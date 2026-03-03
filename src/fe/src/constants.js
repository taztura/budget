export const MONTHS      = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
export const MONTHS_FULL = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
];

// Dark-mode tag palette: muted bg + vivid text
export const TAG_COLORS = [
  "rgba(246,130,31,.15)",  "rgba(59,130,246,.15)",  "rgba(0,179,134,.15)",
  "rgba(167,139,250,.15)", "rgba(251,191,36,.15)",  "rgba(251,113,133,.15)",
  "rgba(52,211,153,.15)",  "rgba(99,179,237,.15)",  "rgba(248,113,113,.15)",
  "rgba(196,181,253,.15)", "rgba(110,231,183,.15)", "rgba(253,186,116,.15)"
];
export const TAG_TEXT = [
  "#f6821f", "#60a5fa", "#00b386",
  "#a78bfa", "#fbbf24", "#fb7185",
  "#34d399", "#63b3ed", "#f87171",
  "#c4b5fd", "#6ee7b7", "#fda974"
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
