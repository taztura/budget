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

  return (
    <div className="page-content">

      {/* KPIs */}
      <div className="kpi-grid">
        <KpiCard label="Entrate totali" value={fmt(stats.totalEntrate)} color="#059669"
          sub={`${dashRecords.filter(r=>r.type==="entrata").length} voci`}/>
        <KpiCard label="Uscite totali"  value={fmt(stats.totalUscite)}  color="#DC2626"
          sub={`${dashRecords.filter(r=>r.type==="uscita").length} voci`}/>
        <KpiCard label="Saldo" value={fmt(stats.saldo)}
          color={stats.saldo>=0?"#059669":"#DC2626"}
          sub={stats.saldo>=0?"Positivo 🟢":"Negativo 🔴"}/>
        <KpiCard label={`${MONTHS_FULL[new Date().getMonth()]} — netto`}
          value={fmt(stats.thisMonthE-stats.thisMonthU)}
          color={(stats.thisMonthE-stats.thisMonthU)>=0?"#059669":"#DC2626"}
          sub={`+${fmt(stats.thisMonthE)} / -${fmt(stats.thisMonthU)}`}/>
      </div>

      {/* Bar chart */}
      <Card className="card--mb" title={`Entrate vs Uscite — ${yearLabel}`}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={MONTHS.map(m=>({name:m, Entrate:stats.byMonth[m].entrate||0, Uscite:stats.byMonth[m].uscite||0}))}
            barGap={4} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{fontSize:11,fill:"#6b6b74"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>v>0?fmtS(v):""} tick={{fontSize:11,fill:"#6b6b74"}} axisLine={false} tickLine={false} width={48}/>
            <Tooltip formatter={(v,n)=>[fmt(v),n]} contentStyle={{borderRadius:10,border:"1px solid #2e2e32",fontSize:12,background:"#1c1c1f",color:"#e8e8ea"}}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:13,paddingTop:12}}/>
            <Bar dataKey="Entrate" fill="#00b386" radius={[5,5,0,0]}/>
            <Bar dataKey="Uscite"  fill="#f04438" radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tag tiles */}
      {Object.keys(stats.byTag).length > 0 && (
        <Card className="card--mb" title="Movimenti per tag">
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

      {/* Recent */}
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
