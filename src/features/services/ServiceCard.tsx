export interface CommunityServiceSummary {
  id: string;
  category: string;
  serviceArea: string;
}

interface ServiceCardProps {
  service: CommunityServiceSummary;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article aria-labelledby={`service-${service.id}`}>
      <h2 id={`service-${service.id}`}>{service.category}</h2>
      <p>{service.serviceArea}</p>
    </article>
  );
}
