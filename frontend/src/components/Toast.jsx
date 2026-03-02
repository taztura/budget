export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999, animation:"ti .25s ease",
      background: toast.type==="err" ? "#FEE2E2" : toast.type==="warn" ? "#FEF3C7" : "#D1FAE5",
      color:      toast.type==="err" ? "#991B1B" : toast.type==="warn" ? "#92400E" : "#065F46",
      padding:"12px 20px", borderRadius:10, fontWeight:700, fontSize:14,
      boxShadow:"0 4px 20px rgba(0,0,0,.12)"
    }}>
      {toast.msg}
    </div>
  );
}
