import { ApfaCard } from "./Card";

type FeatureCardProps = {
  number: string;
  title: string;
  body: string;
  className?: string;
};

export function FeatureCard({
  number,
  title,
  body,
  className,
}: FeatureCardProps) {
  return (
    <ApfaCard className={className}>
      <div className="p-8">
        <div className="apfa-card__number">{number}</div>
        <span className="apfa-card__rule" />
        <h3 className="apfa-card__title">{title}</h3>
        <p className="apfa-card__body">{body}</p>
      </div>
    </ApfaCard>
  );
}
