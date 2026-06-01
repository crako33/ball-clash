export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md text-slate-100 shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
