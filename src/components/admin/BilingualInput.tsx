'use client';

interface BilingualInputProps {
  label: string;
  nameKo: string;
  nameEn: string;
  valueKo: string;
  valueEn: string;
  onChange: (field: string, value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export default function BilingualInput({
  label,
  nameKo,
  nameEn,
  valueKo,
  valueEn,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
}: BilingualInputProps) {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="mono-xs text-muted-foreground mb-1 block">한국어 (KO)</span>
          {multiline ? (
            <textarea
              value={valueKo}
              onChange={(e) => onChange(nameKo, e.target.value)}
              className="input-field resize-none"
              rows={rows}
              required={required}
            />
          ) : (
            <input
              type="text"
              value={valueKo}
              onChange={(e) => onChange(nameKo, e.target.value)}
              className="input-field"
              required={required}
            />
          )}
        </div>
        <div>
          <span className="mono-xs text-muted-foreground mb-1 block">English (EN)</span>
          {multiline ? (
            <textarea
              value={valueEn}
              onChange={(e) => onChange(nameEn, e.target.value)}
              className="input-field resize-none"
              rows={rows}
            />
          ) : (
            <input
              type="text"
              value={valueEn}
              onChange={(e) => onChange(nameEn, e.target.value)}
              className="input-field"
            />
          )}
        </div>
      </div>
    </div>
  );
}
