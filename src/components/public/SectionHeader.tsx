interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({ label, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      {label && (
        <p className="mono-xs text-muted-foreground mb-3">{label}</p>
      )}
      <h2 className="heading-lg mb-4">{title}</h2>
      {description && (
        <p className="body-lg text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
  );
}
