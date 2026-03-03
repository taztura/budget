import { TAG_COLORS, TAG_TEXT, fmt } from "../../constants.js";

export default function ERow({ r, allTags, onClick, full, border }) {
  const isE = r.type === "entrata";
  return (
    <div onClick={onClick}
      className={`erow ${full?"erow--full":"erow--compact"} ${border?"erow--border":""}`}>

      <span className="erow__date">{r.date.slice(5).replace("-","/")}</span>

      <span className={`erow__badge ${isE?"erow__badge--in":"erow__badge--out"}`}>
        {isE ? "▲" : "▼"}
      </span>

      <span className="erow__desc">{r.description}</span>

      <span className={`erow__amount ${isE?"erow__amount--in":"erow__amount--out"}`}>
        {isE?"+":"-"}{fmt(r.amount)}
      </span>

      <div className="erow__tags">
        {r.tags.map(t => {
          const i = allTags.indexOf(t);
          return (
            <span key={t} className="tag-badge"
              style={{background:TAG_COLORS[i%TAG_COLORS.length], color:TAG_TEXT[i%TAG_TEXT.length]}}>
              #{t}
            </span>
          );
        })}
      </div>

      {full && (
        <button className="erow__edit-btn" onClick={ev=>{ ev.stopPropagation(); onClick(); }}>
          ✏️
        </button>
      )}
    </div>
  );
}
