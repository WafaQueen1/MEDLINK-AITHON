export const StatCard = ({ label, value, detail }) => (
  <article className="stat-card">
    <p>{label}</p>
    <strong>{value}</strong>
    <span>{detail}</span>
  </article>
);
