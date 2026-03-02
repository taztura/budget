export default function Empty({ text = "Nessun dato" }) {
  return (
    <div style={{textAlign:"center", color:"#D1D5DB", padding:"28px 0", fontSize:14}}>
      {text}
    </div>
  );
}
