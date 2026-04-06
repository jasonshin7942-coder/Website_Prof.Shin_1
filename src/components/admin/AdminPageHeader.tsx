interface AdminPageHeaderProps {
  code: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ code, title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="mono-xs text-muted-foreground mb-2">// {code}</p>
        <h1 className="heading-lg">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
