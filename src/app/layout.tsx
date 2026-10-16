import type { Metadata } from "next";
import { Caveat, DM_Sans, Playfair_Display } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: wedding.share.title,
  description: wedding.share.text,
  openGraph: {
    title: wedding.share.title,
    description: wedding.share.text,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${handwriting.variable} bg-champagne font-sans text-olive antialiased`}>
        <div className="mx-auto min-h-dvh w-full max-w-[820px] bg-ivory shadow-[0_0_80px_rgba(65,68,56,0.12)] lg:my-8 lg:min-h-[calc(100dvh-4rem)] lg:rounded-[1.75rem]">
          {children}
        </div>
      </body>
    </html>
  );
}
