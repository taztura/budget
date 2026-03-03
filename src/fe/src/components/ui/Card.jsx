export default function Card({ title, action, children, className="" }) {
  return (
    <div className={`card ${className}`}>
      <div className="card__header">
        <span className="card__title">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}
