export function Spinner({ className = "" }) {
  return (
    <svg
      className={`h-5 w-5 animate-spin text-indigo-600 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        opacity="0.75"
      />
    </svg>
  );
}
