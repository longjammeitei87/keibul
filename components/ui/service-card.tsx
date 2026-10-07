type ServiceCardProps = {
  index: number;
  title: string;
  description: string;
  capabilities: string[];
};

const iconPaths = [
  <><path d="M12 3v2" /><path d="M5.6 5.6 7 7" /><path d="M3 12h2" /><path d="M19 12h2" /><path d="m17 7 1.4-1.4" /><path d="M8 16.5a5 5 0 1 1 8 0c-.7.6-1 1.3-1 2.5h-6c0-1.2-.3-1.9-1-2.5Z" /><path d="M9 22h6" /></>,
  <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 13h4" /><path d="M8 16h8" /></>,
  <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M10 5.5h4" /><path d="M11 18.5h2" /></>,
  <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
  <><path d="M4 19V5" /><path d="M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
];

export function ServiceCard({ index, title, description, capabilities }: ServiceCardProps) {
  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {iconPaths[index]}
          </svg>
        </span>
        <span className="service-index">0{index + 1}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
    </article>
  );
}
