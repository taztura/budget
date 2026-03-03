import { useState } from "react";
import { TAG_COLORS, TAG_TEXT } from "../constants.js";
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
    <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="modal">

        <div className="modal__header">
          <span className="modal__title">
            {modal==="add" ? "Nuovo movimento" : "Modifica movimento"}
          </span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">

          {/* Type toggle */}
          <div>
            <Lbl>Tipo</Lbl>
            <div className="type-toggle">
              {["entrata","uscita"].map(t => (
                <button key={t} onClick={()=>setForm(f=>({...f,type:t}))}
                  className={`type-btn${form.type===t?` type-btn--${t}`:""}`}>
                  {t==="entrata" ? "📈 Entrata" : "📉 Uscita"}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Amount */}
          <div className="date-amount-grid">
            <div>
              <Lbl>Data</Lbl>
              <input type="date" className="input" value={form.date}
                onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
            </div>
            <div>
              <Lbl>Importo €</Lbl>
              <input type="number" className="input" placeholder="0,00" value={form.amount}
                onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
            </div>
          </div>

          {/* Description */}
          <div>
            <Lbl>Descrizione</Lbl>
            <input className="input" placeholder="es. Stipendio, Affitto, Spesa..." value={form.description}
              onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          </div>

          {/* Tags */}
          <div>
            <Lbl>Tag</Lbl>
            <div className="tag-pills">
              {allTags.map((t,i) => {
                const sel = form.tags.includes(t);
                return (
                  <button key={t} onClick={()=>toggleTag(t)}
                    className="tag-pill"
                    style={sel ? {
                      border:`1.5px solid ${TAG_TEXT[i%TAG_TEXT.length]}`,
                      background:TAG_COLORS[i%TAG_COLORS.length],
                      color:TAG_TEXT[i%TAG_TEXT.length]
                    } : {}}>
                    #{t}
                  </button>
                );
              })}
            </div>
            <div className="tag-add-row">
              <input className="input" placeholder="Crea nuovo tag..." value={newTag}
                onChange={e=>setNewTag(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleAddTag()}/>
              <button className="tag-add-btn" onClick={handleAddTag}>+ Tag</button>
            </div>
          </div>

          {/* Note */}
          <div>
            <Lbl>Note</Lbl>
            <textarea className="input textarea" rows={2} value={form.note} placeholder="Opzionale..."
              onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
          </div>
        </div>

        {/* Actions */}
        <div className="modal__footer">
          <button onClick={onSave}
            className={`modal-save modal-save--${form.type}`}>
            {modal==="add" ? "Aggiungi" : "Salva modifiche"}
          </button>
          {modal !== "add" && (
            <button className="modal-delete" onClick={()=>onDelete(modal)}>🗑 Elimina</button>
          )}
        </div>
      </div>
    </div>
  );
}
