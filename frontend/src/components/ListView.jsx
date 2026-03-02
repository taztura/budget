import { useMemo } from "react";
import { MONTHS_FULL, inputSt, fmt, getMonthIdx } from "../constants.js";
import ERow  from "./ui/ERow.jsx";
import SelF  from "./ui/SelF.jsx";
import Lbl   from "./ui/Lbl.jsx";

export default function ListView({ records, allTags, filters, setFilters, onEditRecord, onAdd }) {

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (filters.year  && r.date.slice(0,4) !== filters.year) return false;
      if (filters.month && MONTHS_FULL[getMonthIdx(r.date)] !== filters.month) return false;
      if (filters.type  && r.type !== filters.type) return false;
      if (filters.tag   && !r.tags.includes(filters.tag)) return false;
      if (filters.q     && !r.description.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
  }, [records, filters]);

  const filteredEntrate = filtered.filter(r=>r.type==="entrata").reduce((a,r)=>a+r.amount,0);
  const filteredUscite  = filtered.filter(r=>r.type==="uscita").reduce((a,r)=>a+r.amount,0);
  const activeFilters   = [filters.month, filters.type, filters.tag, filters.q].filter(Boolean).length;

  function resetFilters() {
    setFilters(f => ({ ...f, month:"", type:"", tag:"", q:"" }));
  }

  return (
    <div style={{animation:"fi .3s ease"}}>

      {/* Filters */}
      <div style={{
        background:"#fff", borderRadius:16, padding:"18px 20px", marginBottom:18,
        border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,.05)",
        display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end"
      }}>
        <div style={{flex:"2 1 180px"}}>
          <Lbl>Cerca</Lbl>
          <input
            placeholder="🔍  Descrizione..." value={filters.q}
            onChange={e=>setFilters(f=>({...f,q:e.target.value}))}
            style={inputSt}
          />
        </div>
        <div style={{flex:"1 1 130px"}}>
          <Lbl>Mese</Lbl>
          <SelF
            value={filters.month}
            onChange={v=>setFilters(f=>({...f,month:v}))}
            opts={[["","Tutti i mesi"],...MONTHS_FULL.map(m=>[m,m])]}
          />
        </div>
        <div style={{flex:"1 1 120px"}}>
          <Lbl>Tipo</Lbl>
          <SelF
            value={filters.type}
            onChange={v=>setFilters(f=>({...f,type:v}))}
            opts={[["","Tutti"],["entrata","📈 Entrate"],["uscita","📉 Uscite"]]}
          />
        </div>
        <div style={{flex:"1 1 130px"}}>
          <Lbl>Tag</Lbl>
          <SelF
            value={filters.tag}
            onChange={v=>setFilters(f=>({...f,tag:v}))}
            opts={[["","Tutti i tag"],...allTags.map(t=>[t,"#"+t])]}
          />
        </div>
        {activeFilters > 0 && (
          <button onClick={resetFilters}
            style={{
              padding:"9px 16px", borderRadius:10, background:"#FEE2E2", color:"#DC2626",
              border:"none", fontWeight:700, fontSize:13, cursor:"pointer", alignSelf:"flex-end"
            }}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* Summary bar */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:12, padding:"0 2px", flexWrap:"wrap", gap:8
      }}>
        <span style={{fontSize:13, color:"#6B7280", fontWeight:600}}>
          {filtered.length} {filtered.length===1?"movimento":"movimenti"}
          {activeFilters > 0 && <span style={{color:"#4F46E5"}}> (filtrati)</span>}
        </span>
        <div style={{display:"flex", gap:16}}>
          <span style={{fontSize:13, fontWeight:700, color:"#059669"}}>↑ {fmt(filteredEntrate)}</span>
          <span style={{fontSize:13, fontWeight:700, color:"#DC2626"}}>↓ {fmt(filteredUscite)}</span>
          <span style={{fontSize:13, fontWeight:800}}>
            Saldo:{" "}
            <span style={{color:(filteredEntrate-filteredUscite)>=0?"#059669":"#DC2626"}}>
              {fmt(filteredEntrate-filteredUscite)}
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{
          background:"#fff", borderRadius:16, padding:56, textAlign:"center",
          border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,.05)"
        }}>
          <div style={{fontSize:38, marginBottom:10}}>🔍</div>
          <div style={{fontSize:16, fontWeight:700, color:"#374151", marginBottom:6}}>Nessun movimento trovato</div>
          <div style={{fontSize:13, color:"#9CA3AF", marginBottom:18}}>
            {activeFilters > 0 ? "Prova a cambiare i filtri" : "Aggiungi il tuo primo movimento!"}
          </div>
          <button onClick={onAdd}
            style={{padding:"10px 24px", borderRadius:10, background:"#4F46E5",
              color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:"pointer"}}>
            + Aggiungi
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display:"grid", gridTemplateColumns:"90px 40px 1fr 130px 1fr 36px",
            gap:12, padding:"6px 16px", marginBottom:4, fontSize:11,
            fontWeight:700, letterSpacing:.8, color:"#9CA3AF", textTransform:"uppercase"
          }}>
            <div>Data</div><div/><div>Descrizione</div><div>Importo</div><div>Tag</div><div/>
          </div>
          <div style={{
            background:"#fff", borderRadius:16, overflow:"hidden",
            border:"1px solid #E5E7EB", boxShadow:"0 1px 6px rgba(0,0,0,.05)"
          }}>
            {filtered.map((r,i) => (
              <ERow key={r.id} r={r} allTags={allTags} onClick={()=>onEditRecord(r)} full border={i>0}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
