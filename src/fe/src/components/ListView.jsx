import { useMemo } from "react";
import { MONTHS_FULL, fmt, getMonthIdx } from "../constants.js";
import ERow from "./ui/ERow.jsx";
import SelF from "./ui/SelF.jsx";
import Lbl  from "./ui/Lbl.jsx";

export default function ListView({ records, allTags, filters, setFilters, onEditRecord, onAdd }) {

  const filtered = useMemo(() => records.filter(r => {
    if (filters.year  && r.date.slice(0,4) !== filters.year) return false;
    if (filters.month && MONTHS_FULL[getMonthIdx(r.date)] !== filters.month) return false;
    if (filters.type  && r.type !== filters.type) return false;
    if (filters.tag   && !r.tags.includes(filters.tag)) return false;
    if (filters.q     && !r.description.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [records, filters]);

  const filteredEntrate = filtered.filter(r=>r.type==="entrata").reduce((a,r)=>a+r.amount,0);
  const filteredUscite  = filtered.filter(r=>r.type==="uscita").reduce((a,r)=>a+r.amount,0);
  const saldo           = filteredEntrate - filteredUscite;
  const activeFilters   = [filters.month, filters.type, filters.tag, filters.q].filter(Boolean).length;

  return (
    <div className="page-content">

      {/* Filters */}
      <div className="filters">
        <div className="filters__field">
          <Lbl>Cerca</Lbl>
          <input className="input" placeholder="🔍  Descrizione..." value={filters.q}
            onChange={e=>setFilters(f=>({...f,q:e.target.value}))}/>
        </div>
        <div className="filters__field--sm">
          <Lbl>Mese</Lbl>
          <SelF value={filters.month} onChange={v=>setFilters(f=>({...f,month:v}))}
            opts={[["","Tutti i mesi"],...MONTHS_FULL.map(m=>[m,m])]}/>
        </div>
        <div className="filters__field--xs">
          <Lbl>Tipo</Lbl>
          <SelF value={filters.type} onChange={v=>setFilters(f=>({...f,type:v}))}
            opts={[["","Tutti"],["entrata","📈 Entrate"],["uscita","📉 Uscite"]]}/>
        </div>
        <div className="filters__field--sm">
          <Lbl>Tag</Lbl>
          <SelF value={filters.tag} onChange={v=>setFilters(f=>({...f,tag:v}))}
            opts={[["","Tutti i tag"],...allTags.map(t=>[t,"#"+t])]}/>
        </div>
        {activeFilters > 0 && (
          <button className="filters__reset"
            onClick={()=>setFilters(f=>({...f,month:"",type:"",tag:"",q:""}))}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="summary-bar">
        <span className="summary-bar__count">
          {filtered.length} {filtered.length===1?"movimento":"movimenti"}
          {activeFilters > 0 && <span className="summary-bar__filtered"> (filtrati)</span>}
        </span>
        <div className="summary-bar__amounts">
          <span className="summary-bar__in">↑ {fmt(filteredEntrate)}</span>
          <span className="summary-bar__out">↓ {fmt(filteredUscite)}</span>
          <span className="summary-bar__balance">
            Saldo: <span className={saldo>=0?"summary-bar__balance--pos":"summary-bar__balance--neg"}>
              {fmt(saldo)}
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="list-empty">
          <div className="list-empty__icon">🔍</div>
          <div className="list-empty__title">Nessun movimento trovato</div>
          <div className="list-empty__sub">
            {activeFilters > 0 ? "Prova a cambiare i filtri" : "Aggiungi il tuo primo movimento!"}
          </div>
          <button className="list-empty__btn" onClick={onAdd}>+ Aggiungi</button>
        </div>
      ) : (
        <>
          <div className="list-header">
            <div>Data</div><div/><div>Descrizione</div><div>Importo</div><div>Tag</div><div/>
          </div>
          <div className="list-body">
            {filtered.map((r,i) => (
              <ERow key={r.id} r={r} allTags={allTags} onClick={()=>onEditRecord(r)} full border={i>0}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
