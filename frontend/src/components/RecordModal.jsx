import { useState } from "react";
import { TAG_COLORS, TAG_TEXT, inputSt } from "../constants.js";
import Lbl from "./ui/Lbl.jsx";

export default function RecordModal({ modal, form, setForm, allTags, onSave, onDelete, onClose, onAddTag }) {
  const [newTag, setNewTag] = useState("");

  function toggleTag(t) {
    setForm(f => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter(x=>x!==t) : [...f.tags,t] }));
  }

  function handleAddTag() {
    const t = newTag.trim().toLowerCase();
    if (t) onAddTag?.(t);
    setNewTag("");
  }

  if (!modal) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, background:"rgba(10,10,30,.4)", zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"center",
        animation:"oi .2s ease", padding:20
      }}
    >
      <div style={{
        background:"#fff", borderRadius:20, padding:32, width:"100%", maxWidth:480,
        animation:"mi .25s ease", boxShadow:"0 20px 60px rgba(0,0,0,.16)",
        maxHeight:"90vh", overflowY:"auto"
      }}>

        {/* Header */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22}}>
          <span style={{fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700}}>
            {modal==="add" ? "Nuovo movimento" : "Modifica movimento"}
          </span>
          <button onClick={onClose} style={{
            background:"#F3F4F6", border:"none", borderRadius:8,
            width:32, height:32, fontSize:15, color:"#9CA3AF", cursor:"pointer"
          }}>✕</button>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>

          {/* Type toggle */}
          <div>
            <Lbl>Tipo</Lbl>
            <div style={{display:"flex", borderRadius:10, overflow:"hidden", border:"1.5px solid #E5E7EB"}}>
              {["entrata","uscita"].map(t => (
                <button key={t} onClick={()=>setForm(f=>({...f,type:t}))}
                  style={{
                    flex:1, padding:"10px", border:"none", fontWeight:700, fontSize:14, cursor:"pointer",
                    transition:"all .15s",
                    background: form.type===t ? (t==="entrata" ? "#059669" : "#DC2626") : "#fff",
                    color: form.type===t ? "#fff" : "#9CA3AF"
                  }}>
                  {t==="entrata" ? "📈 Entrata" : "📉 Uscita"}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Amount */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <div>
              <Lbl>Data</Lbl>
              <input type="date" value={form.date}
                onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inputSt}/>
            </div>
            <div>
              <Lbl>Importo €</Lbl>
              <input type="number" placeholder="0,00" value={form.amount}
                onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={inputSt}/>
            </div>
          </div>

          {/* Description */}
          <div>
            <Lbl>Descrizione</Lbl>
            <input placeholder="es. Stipendio, Affitto, Spesa..." value={form.description}
              onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={inputSt}/>
          </div>

          {/* Tags */}
          <div>
            <Lbl>Tag</Lbl>
            <div style={{display:"flex", flexWrap:"wrap", gap:7, marginBottom:10}}>
              {allTags.map((t,i) => {
                const sel = form.tags.includes(t);
                return (
                  <button key={t} onClick={()=>toggleTag(t)}
                    style={{
                      padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
                      border:`1.5px solid ${sel ? TAG_TEXT[i%TAG_TEXT.length] : "#E5E7EB"}`,
                      background: sel ? TAG_COLORS[i%TAG_COLORS.length] : "#fff",
                      color: sel ? TAG_TEXT[i%TAG_TEXT.length] : "#9CA3AF",
                      transition:"all .12s"
                    }}>
                    #{t}
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex", gap:8}}>
              <input placeholder="Crea nuovo tag..." value={newTag}
                onChange={e=>setNewTag(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleAddTag()}
                style={{...inputSt, flex:1}}/>
              <button onClick={handleAddTag}
                style={{
                  padding:"9px 16px", borderRadius:10, background:"#EEF2FF", color:"#4F46E5",
                  border:"none", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap"
                }}>
                + Tag
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <Lbl>Note</Lbl>
            <textarea rows={2} value={form.note} placeholder="Opzionale..."
              onChange={e=>setForm(f=>({...f,note:e.target.value}))}
              style={{...inputSt, resize:"none"}}/>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:"flex", gap:10, marginTop:22}}>
          <button onClick={onSave}
            style={{
              flex:1, padding:"13px", borderRadius:12,
              background: form.type==="entrata" ? "#059669" : "#4F46E5",
              color:"#fff", border:"none", fontWeight:800, fontSize:15, cursor:"pointer"
            }}>
            {modal==="add" ? "Aggiungi" : "Salva modifiche"}
          </button>
          {modal !== "add" && (
            <button onClick={()=>onDelete(modal)}
              style={{
                padding:"13px 18px", borderRadius:12, background:"#FEE2E2",
                color:"#DC2626", border:"none", fontWeight:700, fontSize:14, cursor:"pointer"
              }}>
              🗑 Elimina
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
