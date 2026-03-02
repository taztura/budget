export default function KpiCard({ label, value, color, sub }) {
  return (
    <div style={{
      background:"#fff", borderRadius:16, padding:"20px 22px",
      border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,.05)"
    }}>
      <div style={{fontSize:11, fontWeight:700, letterSpacing:1, color:"#9CA3AF", marginBottom:8, textTransform:"uppercase"}}>
        {label}
      </div>
      <div style={{fontSize:23, fontWeight:800, color, marginBottom:3}}>{value}</div>
      <div style={{fontSize:11, color:"#9CA3AF", fontWeight:600}}>{sub}</div>
    </div>
  );
}
