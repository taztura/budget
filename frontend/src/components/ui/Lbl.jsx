export default function Lbl({ children }) {
  return (
    <div style={{
      fontSize:11, fontWeight:700, letterSpacing:.8, color:"#9CA3AF",
      textTransform:"uppercase", marginBottom:5
    }}>
      {children}
    </div>
  );
}
