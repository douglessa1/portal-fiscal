export default function Badge({ children, color = 'primary' }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
  const colorClass = color === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
  return <span className={`${base} ${colorClass}`}>{children}</span>
}
