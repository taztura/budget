export default function Card({ title, action, children, style: extra = {} }) {
  return (
    <div style={{
      background:"#fff", borderRadius:16, padding:"22px 24px",
      border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,.05)", ...extra
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
        <span style={{fontWeight:800, fontSize:15, color:"#111827"}}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}
