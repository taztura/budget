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

    const curMo     = new Date().getMonth();
    const thisMonthE = dashRecords.filter(r => r.type==="entrata" && getMonthIdx(r.date)===curMo).reduce((a,r)=>a+r.amount,0);
    const thisMonthU = dashRecords.filter(r => r.type==="uscita"  && getMonthIdx(r.date)===curMo).reduce((a,r)=>a+r.amount,0);

    return { byMonth, byTag, totalEntrate, totalUscite, saldo: totalEntrate-totalUscite, thisMonthE, thisMonthU };
  }, [dashRecords]);

  return (
    <div style={{animation:"fi .3s ease"}}>

      {/* KPIs */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:12, marginBottom:20}}>
        <KpiCard
          label="Entrate totali"
          value={fmt(stats.totalEntrate)}
          color="#059669"
          sub={`${dashRecords.filter(r=>r.type==="entrata").length} voci`}
        />
        <KpiCard
          label="Uscite totali"
          value={fmt(stats.totalUscite)}
          color="#DC2626"
          sub={`${dashRecords.filter(r=>r.type==="uscita").length} voci`}
        />
        <KpiCard
          label="Saldo"
          value={fmt(stats.saldo)}
          color={stats.saldo >= 0 ? "#059669" : "#DC2626"}
          sub={stats.saldo >= 0 ? "Positivo 🟢" : "Negativo 🔴"}
        />
        <KpiCard
          label={`${MONTHS_FULL[new Date().getMonth()]} — netto`}
          value={fmt(stats.thisMonthE - stats.thisMonthU)}
          color={(stats.thisMonthE - stats.thisMonthU) >= 0 ? "#059669" : "#DC2626"}
          sub={`+${fmt(stats.thisMonthE)} / -${fmt(stats.thisMonthU)}`}
        />
      </div>

      {/* Bar chart */}
      <Card title={`Entrate vs Uscite — ${yearLabel}`} style={{marginBottom:20}}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart
            data={MONTHS.map(m => ({
              name: m,
              Entrate: stats.byMonth[m].entrate || 0,
              Uscite:  stats.byMonth[m].uscite  || 0,
            }))}
            barGap={4} barCategoryGap="30%"
          >
            <XAxis dataKey="name" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>v>0?fmtS(v):""} tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false} width={48}/>
            <Tooltip formatter={(v,n)=>[fmt(v),n]} contentStyle={{borderRadius:10,border:"1px solid #E5E7EB",fontSize:13}}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:13,paddingTop:12}}/>
            <Bar dataKey="Entrate" fill="#A7F3D0" radius={[5,5,0,0]}/>
            <Bar dataKey="Uscite"  fill="#FECACA" radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tag tiles */}
      {Object.keys(stats.byTag).length > 0 && (
        <Card title="Movimenti per tag" style={{marginBottom:20}}>
          <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
            {Object.entries(stats.byTag).sort((a,b)=>b[1]-a[1]).map(([t,v],i) => (
              <div key={t} className="tag-tile"
                onClick={onViewAll}
                style={{
                  background: TAG_COLORS[i % TAG_COLORS.length], borderRadius:12,
                  padding:"16px 22px", minWidth:130, cursor:"pointer",
                  transition:"all .15s", boxShadow:"0 1px 4px rgba(0,0,0,.06)"
                }}
              >
                <div style={{fontSize:12, fontWeight:700, color:TAG_TEXT[i%TAG_TEXT.length], marginBottom:6}}>#{t}</div>
                <div style={{fontSize:20, fontWeight:800, color:TAG_TEXT[i%TAG_TEXT.length]}}>{fmt(v)}</div>
                <div style={{fontSize:11, color:TAG_TEXT[i%TAG_TEXT.length], opacity:.6, marginTop:3}}>
                  {dashRecords.filter(r=>r.tags.includes(t)).length} movimenti
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent */}
      <Card
        title="Movimenti recenti"
        action={
          <button onClick={onViewAll}
            style={{fontSize:13, color:"#4F46E5", background:"none", border:"none", fontWeight:700, cursor:"pointer"}}>
            Vedi tutti →
          </button>
        }
      >
        {records.length === 0
          ? <Empty text="Nessun movimento. Aggiungine uno!"/>
          : records.slice(0,5).map(r => (
              <ERow key={r.id} r={r} allTags={allTags} onClick={()=>onEditRecord(r)}/>
            ))
        }
      </Card>
    </div>
  );
}
