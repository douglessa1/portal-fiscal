export default function StatCard({ value, label, className = '' }){
  return (
    <div className={`p-4 rounded-lg shadow-sm bg-gradient-to-r from-primary to-primary-dark text-white ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}
