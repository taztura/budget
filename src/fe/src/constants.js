export const MONTHS      = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
export const MONTHS_FULL = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
];

export const TAG_COLORS = [
  "#fef3e8","#e8f0fd","#e8f5ed","#f3f0ff","#fffbeb",
  "#fef2f2","#e8f8fc","#f0f9f4","#fef9ec","#eff6ff","#f0fdf4","#fdf4ff"
];
export const TAG_TEXT = [
  "#c05a0a","#1d4ed8","#1b6b3a","#5b21b6","#92400e",
  "#b91c1c","#0369a1","#166534","#b45309","#1e40af","#15803d","#7e22ce"
];

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
