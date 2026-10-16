type BloomProps = { x: number; y: number; size: number; color: string };

function Bloom({ x, y, size, color }: BloomProps) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, index) => (
        <ellipse
          key={index}
          cx={x}
          cy={y - size * 0.56}
          rx={size * 0.27}
          ry={size * 0.53}
          transform={`rotate(${index * 60} ${x} ${y})`}
          fill={color}
          fillOpacity=".86"
          stroke="#fffaf3"
          strokeOpacity=".72"
          strokeWidth=".8"
        />
      ))}
      <circle cx={x} cy={y} r={size * 0.2} fill="#ad8051" />
      <circle cx={x} cy={y} r={size * 0.07} fill="#fff4dc" />
    </g>
  );
}

export function GardenScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 250" className={className} role="img" aria-label="An elegant floral arch illustration">
      <defs>
        <linearGradient id="arch-glow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f4e5da" stopOpacity=".7" />
          <stop offset="1" stopColor="#fbf6f0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="142" rx="126" ry="101" fill="url(#arch-glow)" />
      <path d="M64 218 C48 145 72 61 145 32 C158 27 169 25 180 25 C191 25 202 27 215 32 C288 61 312 145 296 218" fill="none" stroke="#ad8051" strokeOpacity=".54" strokeWidth="1.2" />
      <path d="M76 217 C62 148 83 75 147 46 M213 46 C277 75 298 148 284 217" fill="none" stroke="#a07770" strokeOpacity=".34" strokeWidth="1" />

      <g fill="#a07770" fillOpacity=".5" stroke="#a07770" strokeOpacity=".45" strokeWidth=".8">
        <path d="M76 185 C89 171 101 174 109 190 C96 187 87 192 82 203Z" />
        <path d="M84 153 C98 139 109 142 116 158 C104 155 95 161 90 171Z" />
        <path d="M99 119 C112 104 124 106 131 123 C118 119 110 126 105 136Z" />
        <path d="M119 87 C133 73 144 77 148 93 C137 89 127 95 123 105Z" />
        <path d="M284 185 C271 171 259 174 251 190 C264 187 273 192 278 203Z" />
        <path d="M276 153 C262 139 251 142 244 158 C256 155 265 161 270 171Z" />
        <path d="M261 119 C248 104 236 106 229 123 C242 119 250 126 255 136Z" />
        <path d="M241 87 C227 73 216 77 212 93 C223 89 233 95 237 105Z" />
      </g>

      <path d="M76 216 C93 192 97 163 110 142 C121 122 132 96 151 77 M284 216 C267 192 263 163 250 142 C239 122 228 96 209 77" fill="none" stroke="#a07770" strokeOpacity=".62" strokeWidth="1.2" />
      <path d="M112 223 C133 205 150 206 166 220 M248 223 C227 205 210 206 194 220 M143 226 C158 215 171 216 180 227 C189 216 202 215 217 226" fill="none" stroke="#ad8051" strokeOpacity=".5" strokeWidth="1" />

      <Bloom x={75} y={191} size={13} color="#d9aaa4" />
      <Bloom x={102} y={146} size={12} color="#edc8b6" />
      <Bloom x={133} y={91} size={11} color="#d9aaa4" />
      <Bloom x={180} y={42} size={13} color="#edc8b6" />
      <Bloom x={227} y={91} size={11} color="#d9aaa4" />
      <Bloom x={258} y={146} size={12} color="#edc8b6" />
      <Bloom x={285} y={191} size={13} color="#d9aaa4" />
      <circle cx="180" cy="231" r="2.5" fill="#ad8051" />
      <path d="M155 231 H169 M191 231 H205" stroke="#ad8051" strokeOpacity=".65" />
    </svg>
  );
}
