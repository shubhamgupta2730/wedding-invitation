type Props = {
  label?: string;
  className?: string;
};

export function GoldSeal({ label = "Tap to open", className = "" }: Props) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden>
      <defs>
        <radialGradient id="sealGold" cx="40%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#e8d5a8" />
          <stop offset="55%" stopColor="#c4a574" />
          <stop offset="100%" stopColor="#8d7344" />
        </radialGradient>
      </defs>
      <path
        d="M90 8
          C104 12 116 10 126 18
          C138 14 150 22 154 34
          C166 40 172 54 168 66
          C176 78 174 92 166 102
          C170 116 160 128 148 132
          C146 146 132 154 120 152
          C110 162 96 166 84 160
          C70 168 54 162 48 150
          C34 152 22 142 22 128
          C10 122 6 106 12 94
          C4 82 8 66 20 60
          C18 46 28 34 42 32
          C46 18 62 10 76 14
          C80 8 86 6 90 8Z"
        fill="url(#sealGold)"
        stroke="#8a6b3a"
        strokeWidth="1.2"
      />
      <path
        d="M90 28
          C118 28 142 52 142 80
          C142 108 118 132 90 132
          C62 132 38 108 38 80
          C38 52 62 28 90 28Z"
        fill="none"
        stroke="#f3e6c8"
        strokeWidth="1.4"
        opacity="0.7"
      />
      <path
        d="M90 44 c8 -12 28 -8 28 8 c0 22 -28 38 -28 38 s-28 -16 -28 -38 c0 -16 20 -20 28 -8Z"
        fill="#7d6236"
        opacity="0.35"
      />
      <text
        x="90"
        y="86"
        textAnchor="middle"
        fill="#5c4a28"
        fontFamily="Georgia, serif"
        fontSize="11"
        letterSpacing="1.6"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}
