export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 ${className}`}>
      {children}
    </div>
  )
}
