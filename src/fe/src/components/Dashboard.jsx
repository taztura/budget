import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MONTHS, MONTHS_FULL, TAG_COLORS, TAG_TEXT, fmt, fmtS, getMonthIdx } from "../constants.js";
import Card    from "./ui/Card.jsx";
import KpiCard from "./ui/KpiCard.jsx";
import ERow    from "./ui/ERow.jsx";
import Empty   from "./ui/Empty.jsx";

export default function Dashboard({ records, allTags, filters, yearLabel, onEditRecord, onViewAll }) {

  const dashRecords = useMemo(() =>
    records.filter(r => !filters.year || r.date.slice(0,4) === filters.year),
    [records, filters.year]
  );

  const stats = useMemo(() => {
    const byMonth = {};
    MONTHS.forEach(m => { byMonth[m] = { entrate:0, uscite:0 }; });
    const byTag = {};
    let totalEntrate = 0, totalUscite = 0;

    dashRecords.forEach(r => {
      const mo  = getMonthIdx(r.date);
      const key = MONTHS[mo >= 0 ? mo : 0];
      if (r.type === "entrata") { byMonth[key].entrate += r.amount; totalEntrate += r.amount; }
      else                      { byMonth[key].uscite  += r.amount; totalUscite  += r.amount; }
      r.tags.forEach(t => { byTag[t] = (byTag[t]||0) + r.amount; });
    });

    const curMo      = new Date().getMonth();
    const thisMonthE = dashRecords.filter(r => r.type==="entrata" && getMonthIdx(r.date)===curMo).reduce((a,r)=>a+r.amount,0);
    const thisMonthU = dashRecords.filter(r => r.type==="uscita"  && getMonthIdx(r.date)===curMo).reduce((a,r)=>a+r.amount,0);

    return { byMonth, byTag, totalEntrate, totalUscite, saldo:totalEntrate-totalUscite, thisMonthE, thisMonthU };
  }, [dashRecords]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background:"#fff", border:"1px solid #e0e0e2", borderRadius:8,
        padding:"10px 14px", fontSize:13, boxShadow:"0 4px 12px rgba(0,0,0,.1)"
      }}>
        <div style={{fontWeight:700, marginBottom:6, color:"#1d1d1f"}}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{color:p.color, fontWeight:600}}>
            {p.name}: {fmt(p.value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-content">

      {/* KPI */}
      <div className="kpi-grid">
        <KpiCard label="Entrate totali" value={fmt(stats.totalEntrate)} color="#1b6b3a"
          sub={`${dashRecords.filter(r=>r.type==="entrata").length} movimenti`}/>
        <KpiCard label="Uscite totali"  value={fmt(stats.totalUscite)}  color="#b91c1c"
          sub={`${dashRecords.filter(r=>r.type==="uscita").length} movimenti`}/>
        <KpiCard label="Saldo" value={fmt(stats.saldo)}
          color={stats.saldo>=0?"#1b6b3a":"#b91c1c"}
          sub={stats.saldo>=0?"Positivo ↑":"Negativo ↓"}/>
        <KpiCard label={`${MONTHS_FULL[new Date().getMonth()]} — netto`}
          value={fmt(stats.thisMonthE - stats.thisMonthU)}
          color={(stats.thisMonthE-stats.thisMonthU)>=0?"#1b6b3a":"#b91c1c"}
          sub={`+${fmt(stats.thisMonthE)} / −${fmt(stats.thisMonthU)}`}/>
      </div>

      {/* Grafico */}
      <Card className="card--mb" title={`Entrate vs Uscite — ${yearLabel}`}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={MONTHS.map(m=>({name:m, Entrate:stats.byMonth[m].entrate||0, Uscite:stats.byMonth[m].uscite||0}))}
            barGap={3} barCategoryGap="32%">
            <XAxis dataKey="name" tick={{fontSize:11,fill:"#9898a0",fontFamily:"inherit"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>v>0?fmtS(v):""} tick={{fontSize:11,fill:"#9898a0",fontFamily:"inherit"}} axisLine={false} tickLine={false} width={50}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:13,paddingTop:14,fontFamily:"inherit"}}/>
            <Bar dataKey="Entrate" fill="#a8d9bc" radius={[4,4,0,0]}/>
            <Bar dataKey="Uscite"  fill="#fca5a5" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tag tiles */}
      {Object.keys(stats.byTag).length > 0 && (
        <Card className="card--mb" title="Distribuzione per tag">
          <div className="tag-tiles">
            {Object.entries(stats.byTag).sort((a,b)=>b[1]-a[1]).map(([t,v],i) => (
              <div key={t} className="tag-tile" onClick={onViewAll}
                style={{background:TAG_COLORS[i%TAG_COLORS.length]}}>
                <div className="tag-tile__name"  style={{color:TAG_TEXT[i%TAG_TEXT.length]}}>#{t}</div>
                <div className="tag-tile__amount" style={{color:TAG_TEXT[i%TAG_TEXT.length]}}>{fmt(v)}</div>
                <div className="tag-tile__count"  style={{color:TAG_TEXT[i%TAG_TEXT.length]}}>
                  {dashRecords.filter(r=>r.tags.includes(t)).length} movimenti
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recenti */}
      <Card title="Movimenti recenti"
        action={<button className="view-all-btn" onClick={onViewAll}>Vedi tutti →</button>}>
        {records.length === 0
          ? <Empty text="Nessun movimento. Aggiungine uno!"/>
          : records.slice(0,5).map(r => <ERow key={r.id} r={r} allTags={allTags} onClick={()=>onEditRecord(r)}/>)
        }
      </Card>
    </div>
  );
}
