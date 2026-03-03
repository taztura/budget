export default function YearPills({ availableYears, selectedYear, onChange }) {
  return (
    <div className="year-pills">
      <span className="year-pills__label">Anno:</span>
      {["", ...availableYears].map(y => (
        <button key={y||"all"} onClick={()=>onChange(y)}
          className={`year-pill${selectedYear===y?" year-pill--active":""}`}>
          {y || "Tutti"}
        </button>
      ))}
    </div>
  );
}
