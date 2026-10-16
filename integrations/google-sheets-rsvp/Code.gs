/**
 * Google Apps Script receiver for RSVP replies, guest wishes, voice blessings, and anonymous invitation analytics.
 * Configure SPREADSHEET_ID and RSVP_SECRET in Script Properties.
 * NOTIFICATION_EMAIL is optional.
 */
function doPost(e) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("RSVP_SECRET");
    if (!expectedSecret || expectedSecret.length < 24) {
      return json_({ ok: false, message: "RSVP receiver is not configured." });
    }

    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!payload.secret || payload.secret !== expectedSecret) {
      return json_({ ok: false, message: "Unauthorized RSVP request." });
    }

    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) return json_({ ok: false, message: "Spreadsheet is not configured." });

    if (payload.kind === "list-wishes") return listWishes_(spreadsheetId);
    if (payload.kind === "wish") return saveWish_(spreadsheetId, payload);
    if (payload.kind === "voice-note") return saveVoiceNote_(spreadsheetId, properties, payload);
    if (payload.kind === "analytics") return saveAnalyticsEvent_(spreadsheetId, payload.event);

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const attending = payload.attending === "yes" || payload.attending === "no" ? payload.attending : "";
    const guests = Number(payload.guests);
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    if (!name || name.length > 120 || !attending || !Number.isInteger(guests) || guests < 1 || guests > 20 || message.length > 1000) {
      return json_({ ok: false, message: "Invalid RSVP details." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheetByName("RSVP Responses") || spreadsheet.insertSheet("RSVP Responses");
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Received at", "Guest name", "Attendance", "Guests", "Message"]);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([new Date(), safeCell_(name), attending, guests, safeCell_(message)]);
    } finally {
      lock.releaseLock();
    }

    let notificationSent = false;
    const notificationEmail = properties.getProperty("NOTIFICATION_EMAIL");
    if (notificationEmail) {
      try {
        MailApp.sendEmail({
          to: notificationEmail,
          subject: "Wedding RSVP received",
          body: [
            "A new RSVP has been added to your wedding guest sheet.",
            "",
            "Name: " + name,
            "Attendance: " + (attending === "yes" ? "Joyfully yes" : "Regretfully no"),
            "Guests: " + guests,
            "Message: " + (message || "—"),
          ].join("\n"),
        });
        notificationSent = true;
      } catch (mailError) {
        // The reply is already saved; a mail quota or permission issue must not lose it.
      }
    }

    return json_({ ok: true, notificationSent: notificationSent });
  } catch (error) {
    return json_({ ok: false, message: "Could not save the RSVP." });
  }
}

function saveAnalyticsEvent_(spreadsheetId, eventName) {
  const events = {
    page_opened: "Invitation page opened",
    curtain_opened: "Curtain reveal completed",
    date_revealed: "Wedding date revealed",
    calendar_download_clicked: "Calendar download clicked",
    date_navigation_clicked: "Date navigation clicked",
    celebrations_navigation_clicked: "Celebrations navigation clicked",
    venue_navigation_clicked: "Venue navigation clicked",
    rsvp_navigation_clicked: "RSVP navigation clicked",
    directions_clicked: "Venue directions clicked",
    rsvp_started: "RSVP form started",
    rsvp_submitted: "RSVP submitted",
    wish_submitted: "Wish submitted",
    voice_recording_started: "Voice recording started",
    voice_note_submitted: "Voice blessing submitted",
    invitation_share_clicked: "Share invitation clicked",
  };
  if (typeof eventName !== "string" || !Object.prototype.hasOwnProperty.call(events, eventName)) {
    return json_({ ok: false, message: "Invalid analytics event." });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const log = spreadsheet.getSheetByName("Invitation Analytics") || spreadsheet.insertSheet("Invitation Analytics");
    if (log.getLastRow() === 0) {
      log.appendRow(["Received at", "Event"]);
      log.setFrozenRows(1);
      log.setColumnWidth(1, 170);
      log.setColumnWidth(2, 250);
    }
    log.appendRow([new Date(), eventName]);

    const summary = spreadsheet.getSheetByName("Analytics Summary") || spreadsheet.insertSheet("Analytics Summary");
    if (summary.getLastRow() === 0) {
      summary.appendRow(["Interaction", "All time", "Today"]);
      const rows = Object.keys(events).map(function (key) {
        return [events[key], "", ""];
      });
      summary.getRange(2, 1, rows.length, 3).setValues(rows);
      Object.keys(events).forEach(function (key, index) {
        const row = index + 2;
        summary.getRange(row, 2).setFormula("=COUNTIF('Invitation Analytics'!B:B, \"" + key + "\")");
        summary.getRange(row, 3).setFormula("=COUNTIFS('Invitation Analytics'!B:B, \"" + key + "\", 'Invitation Analytics'!A:A, \">=\"&TODAY(), 'Invitation Analytics'!A:A, \"<\"&TODAY()+1)");
      });
      summary.setFrozenRows(1);
      summary.autoResizeColumns(1, 3);
    }
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function listWishes_(spreadsheetId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Guest Wishes");
  if (!sheet || sheet.getLastRow() < 2) return json_({ ok: true, wishes: [] });

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  const wishes = rows
    .filter(function (row) { return row[3] === "Yes"; })
    .slice(-30)
    .reverse()
    .map(function (row, index) {
      return { id: String(row[0].getTime()) + "-" + index, name: String(row[1]).split(/\s+/)[0], message: String(row[2]) };
    });
  return json_({ ok: true, wishes: wishes });
}

function saveWish_(spreadsheetId, payload) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const wish = typeof payload.wish === "string" ? payload.wish.trim() : "";
  if (!name || name.length > 60 || !wish || wish.length > 180) {
    return json_({ ok: false, message: "Invalid wish." });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Guest Wishes") || SpreadsheetApp.openById(spreadsheetId).insertSheet("Guest Wishes");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Received at", "Guest name", "Blessing", "Show on tree"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), safeCell_(name), safeCell_(wish), payload.share === true ? "Yes" : "No"]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function saveVoiceNote_(spreadsheetId, properties, payload) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const audio = typeof payload.audio === "string" ? payload.audio : "";
  const mimeType = typeof payload.mimeType === "string" ? payload.mimeType : "";
  const duration = Number(payload.duration);
  const allowedTypes = ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg", "audio/wav"];
  if (!name || name.length > 60 || !audio || audio.length > 2800000 || allowedTypes.indexOf(mimeType) === -1 || !Number.isInteger(duration) || duration < 1 || duration > 20) {
    return json_({ ok: false, message: "Invalid voice note." });
  }

  const folderProperty = "VOICE_BLESSINGS_FOLDER_ID";
  let folderId = properties.getProperty(folderProperty);
  let folder;
  if (folderId) {
    folder = DriveApp.getFolderById(folderId);
  } else {
    folder = DriveApp.createFolder("Rishi & Nikita - Voice Blessings");
    folderId = folder.getId();
    properties.setProperty(folderProperty, folderId);
  }

  const extensionByType = { "audio/webm": "webm", "audio/mp4": "m4a", "audio/ogg": "ogg", "audio/mpeg": "mp3", "audio/wav": "wav" };
  const cleanName = name.replace(/[^A-Za-z0-9 _-]/g, "").trim().slice(0, 40) || "Guest";
  const filename = cleanName + " - " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "." + extensionByType[mimeType];
  const blob = Utilities.newBlob(Utilities.base64Decode(audio), mimeType, filename);
  const file = folder.createFile(blob);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName("Voice Blessings") || spreadsheet.insertSheet("Voice Blessings");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Received at", "Guest name", "Duration (seconds)", "Audio file", "Drive file ID"]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), safeCell_(name), duration, filename, file.getId()]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
