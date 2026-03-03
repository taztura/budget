export default function SelF({ value, onChange, opts }) {
  return (
    <select className="input select" value={value} onChange={e=>onChange(e.target.value)}>
      {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
