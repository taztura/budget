import { inputSt } from "../../constants.js";

export default function SelF({ value, onChange, opts }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...inputSt, background:"#FAFAFA"}}>
      {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
