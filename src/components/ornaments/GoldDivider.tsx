export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-gold/80" />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5 L11.2 6.8 L16.8 9 L11.2 11.2 L9 16.5 L6.8 11.2 L1.2 9 L6.8 6.8 Z" fill="#B89A62" opacity="0.9" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-gold/80" />
    </div>
  );
}
