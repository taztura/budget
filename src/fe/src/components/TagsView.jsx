import { useState } from "react";
import { TAG_COLORS, TAG_TEXT, fmt } from "../constants.js";
import Card  from "./ui/Card.jsx";
import Empty from "./ui/Empty.jsx";

export default function TagsView({ allTags, records, onAddTag, onDeleteTag }) {
  const [newTag, setNewTag] = useState("");

  function handleAdd() {
    const t = newTag.trim().toLowerCase();
    if (t) onAddTag(t);
    setNewTag("");
  }

  return (
    <div className="tags-view">
      <Card title="Gestione Tag">
        <div className="tags-add-row">
          <input className="input" placeholder="Nuovo tag..." value={newTag}
            onChange={e=>setNewTag(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleAdd()}/>
          <button className="tags-add-btn" onClick={handleAdd}>+ Aggiungi</button>
        </div>

        {allTags.length === 0
          ? <Empty text="Nessun tag ancora"/>
          : (
            <div className="tags-list">
              {allTags.map((t,i) => {
                const count = records.filter(r=>r.tags.includes(t)).length;
                const total = records.filter(r=>r.tags.includes(t)).reduce((a,r)=>a+r.amount,0);
                return (
                  <div key={t} className="tags-item">
                    <span className="tag-badge"
                      style={{background:TAG_COLORS[i%TAG_COLORS.length], color:TAG_TEXT[i%TAG_TEXT.length]}}>
                      #{t}
                    </span>
                    <span className="tags-item__info">
                      {count} {count===1?"movimento":"movimenti"} · {fmt(total)}
                    </span>
                    <button className="tags-item__delete" onClick={()=>onDeleteTag(t)}>Elimina</button>
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
