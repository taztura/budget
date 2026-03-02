export const MONTHS = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
export const MONTHS_FULL = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
];

export const TAG_COLORS = [
  "#DBEAFE","#D1FAE5","#FEF3C7","#FCE7F3","#EDE9FE",
  "#CCFBF1","#FFEDD5","#F3F4F6","#FEE2E2","#E0F2FE","#FEF9C3","#DCFCE7"
];
export const TAG_TEXT = [
  "#1D4ED8","#065F46","#92400E","#9D174D","#5B21B6",
  "#0F766E","#C2410C","#374151","#991B1B","#0369A1","#713F12","#166534"
];

export const inputSt = {
  width:"100%", padding:"9px 12px", borderRadius:10,
  border:"1.5px solid #E5E7EB", fontSize:13,
  background:"#FAFAFA", outline:"none", color:"#111827"
};

export const ghostBtn = {
  padding:"7px 14px", borderRadius:8, border:"1.5px solid #E5E7EB",
  background:"#fff", color:"#6B7280", fontSize:13, fontWeight:600, cursor:"pointer"
};

export function fmt(n) {
  return new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:2}).format(n||0);
}
export function fmtS(n) {
  return Math.abs(n) >= 1000 ? "€"+(n/1000).toFixed(1)+"k" : fmt(n);
}
export function getYear(d)     { return d ? d.slice(0,4) : ""; }
export function getMonthIdx(d) { return d ? parseInt(d.slice(5,7))-1 : -1; }

export function emptyForm() {
  return { date: new Date().toISOString().slice(0,10), description:"", amount:"", type:"uscita", tags:[], note:"" };
}
