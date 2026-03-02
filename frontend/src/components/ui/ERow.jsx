import { TAG_COLORS, TAG_TEXT, fmt } from "../../constants.js";

export default function ERow({ r, allTags, onClick, full, border }) {
  const isE = r.type === "entrata";
  return (
    <div
      className="rh"
      onClick={onClick}
      style={{
        display:"grid",
        gridTemplateColumns: full ? "90px 40px 1fr 130px 1fr 36px" : "80px 36px 1fr auto auto",
        gap:12, padding:"12px 16px", cursor:"pointer", alignItems:"center",
        borderTop: border ? "1px solid #F3F4F6" : "none",
        transition:"background .12s"
      }}
    >
      <span style={{fontSize:12, color:"#9CA3AF", fontWeight:600}}>
        {r.date.slice(5).replace("-","/")}
      </span>

      <span style={{
        fontSize:11, fontWeight:800, padding:"3px 0", borderRadius:6, textAlign:"center",
        background: isE ? "#D1FAE5" : "#FEE2E2",
        color:      isE ? "#065F46" : "#991B1B"
      }}>
        {isE ? "▲" : "▼"}
      </span>

      <span style={{fontSize:14, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
        {r.description}
      </span>

      <span style={{fontSize:14, fontWeight:800, color: isE ? "#059669" : "#DC2626"}}>
        {isE ? "+" : "-"}{fmt(r.amount)}
      </span>

      <div style={{display:"flex", gap:5, flexWrap:"wrap"}}>
        {r.tags.map(t => {
          const i = allTags.indexOf(t);
          return (
            <span key={t} style={{
              fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20,
              background: TAG_COLORS[i % TAG_COLORS.length],
              color:      TAG_TEXT[i % TAG_TEXT.length]
            }}>
              #{t}
            </span>
          );
        })}
      </div>

      {full && (
        <button
          onClick={ev => { ev.stopPropagation(); onClick(); }}
          style={{
            width:30, height:30, borderRadius:8, border:"1px solid #E5E7EB",
            background:"#fff", fontSize:13, color:"#9CA3AF", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          ✏️
        </button>
      )}
    </div>
  );
}
