export default function Toast({ toast }) {
  if (!toast) return null;
  const cls = toast.type === "err" ? "toast--err" : toast.type === "warn" ? "toast--warn" : "toast--ok";
  return <div className={`toast ${cls}`}>{toast.msg}</div>;
}
