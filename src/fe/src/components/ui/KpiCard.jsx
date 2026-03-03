export default function KpiCard({ label, value, color, sub }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value" style={{color}}>{value}</div>
      <div className="kpi-card__sub">{sub}</div>
    </div>
  );
}
