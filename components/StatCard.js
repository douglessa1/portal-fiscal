export default function StatCard({ value, label, className = '' }) {
  return (
    <div className={`p-4 rounded-lg bg-card border border-border shadow-sm ${className}`}>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
