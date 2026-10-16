type Props = {
  className?: string;
  position?: "tl" | "tr" | "bl" | "br";
};

const transforms: Record<NonNullable<Props["position"]>, string> = {
  tl: "",
  tr: "scale(-1, 1)",
  bl: "scale(1, -1)",
  br: "scale(-1, -1)",
};

export function FloralCorner({ className = "", position = "tl" }: Props) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      aria-hidden
      fill="none"
      style={{ transform: transforms[position] }}
    >
      <path
        d="M12 148 C18 92 48 48 118 22"
        stroke="#B89A62"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <path
        d="M22 148 C28 108 52 70 102 48"
        stroke="#A07770"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M88 18 C102 8 122 14 128 28 C118 24 104 28 96 38 C92 24 82 20 88 18Z"
        fill="#A07770"
        opacity="0.55"
      />
      <path
        d="M54 46 C70 34 90 42 96 58 C84 52 70 56 62 66 C58 52 48 48 54 46Z"
        fill="#D9B9AE"
        opacity="0.55"
      />
      <path
        d="M28 92 C42 80 60 86 66 100 C54 94 42 98 36 108 C32 96 22 94 28 92Z"
        fill="#A07770"
        opacity="0.5"
      />
      <circle cx="118" cy="28" r="2.2" fill="#B89A62" />
      <circle cx="62" cy="58" r="1.8" fill="#B89A62" />
    </svg>
  );
}
