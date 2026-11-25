export interface CommunityServiceSummary {
  id: string;
  name: string;
  category: string;
  serviceArea: string;
}

interface ServiceCardProps {
  service: CommunityServiceSummary;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article aria-labelledby={`service-${service.id}`}>
      <h2 id={`service-${service.id}`}>{service.name}</h2>
      <p>{service.category}</p>
      <p>{service.serviceArea}</p>
    </article>
  );
}
