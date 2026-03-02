import { useState } from "react";
import { TAG_COLORS, TAG_TEXT, inputSt, fmt } from "../constants.js";
import Card from "./ui/Card.jsx";
import Empty from "./ui/Empty.jsx";

export default function TagsView({ allTags, records, onAddTag, onDeleteTag }) {
  const [newTag, setNewTag] = useState("");

  function handleAdd() {
    const t = newTag.trim().toLowerCase();
    if (t) onAddTag(t);
    setNewTag("");
  }

  return (
    <div style={{animation:"fi .3s ease", maxWidth:600}}>
      <Card title="Gestione Tag">
        {/* Add new */}
        <div style={{display:"flex", gap:8, marginBottom:20}}>
          <input
            placeholder="Nuovo tag..."
            value={newTag}
            onChange={e=>setNewTag(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            style={{...inputSt, flex:1}}
          />
          <button onClick={handleAdd}
            style={{
              padding:"9px 20px", borderRadius:10, background:"#4F46E5", color:"#fff",
              border:"none", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap"
            }}>
            + Aggiungi
          </button>
        </div>

        {/* Tag list */}
        {allTags.length === 0
          ? <Empty text="Nessun tag ancora"/>
          : (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {allTags.map((t,i) => {
                const count = records.filter(r=>r.tags.includes(t)).length;
                const total = records.filter(r=>r.tags.includes(t)).reduce((a,r)=>a+r.amount,0);
                return (
                  <div key={t} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 16px", borderRadius:12,
                    background:"#F9FAFB", border:"1px solid #F3F4F6"
                  }}>
                    <span style={{
                      fontSize:13, fontWeight:700, padding:"4px 14px", borderRadius:20,
                      background: TAG_COLORS[i % TAG_COLORS.length],
                      color:      TAG_TEXT[i % TAG_TEXT.length]
                    }}>
                      #{t}
                    </span>
                    <span style={{flex:1, fontSize:13, color:"#6B7280"}}>
                      {count} {count===1?"movimento":"movimenti"} · {fmt(total)}
                    </span>
                    <button onClick={()=>onDeleteTag(t)}
                      style={{
                        background:"#FEE2E2", color:"#DC2626", border:"none",
                        borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer"
                      }}>
                      Elimina
                    </button>
                  </div>
                );
              })}
            </div>
          )
        }
      </Card>
    </div>
  );
}
