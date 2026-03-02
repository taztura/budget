export default function YearPills({ availableYears, selectedYear, onChange }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8, marginBottom:20,
      flexWrap:"wrap", overflowX:"auto", paddingBottom:4
    }}>
      <span style={{fontSize:11, fontWeight:700, color:"#9AA0A6",
        letterSpacing:.8, textTransform:"uppercase", whiteSpace:"nowrap"}}>
        Anno:
      </span>
      {["", ...availableYears].map(y => (
        <button key={y||"all"} onClick={()=>onChange(y)}
          style={{
            padding:"5px 14px", borderRadius:20, border:"1.5px solid",
            cursor:"pointer", fontSize:13, fontWeight:700,
            transition:"all .15s", whiteSpace:"nowrap",
            borderColor: selectedYear===y ? "#1A73E8" : "#DADCE0",
            background:  selectedYear===y ? "#E8F0FE" : "#fff",
            color:       selectedYear===y ? "#1A73E8" : "#5F6368"
          }}>
          {y || "Tutti"}
        </button>
      ))}
    </div>
  );
}
