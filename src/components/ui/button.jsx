export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
