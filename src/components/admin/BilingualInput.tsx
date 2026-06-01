'use client';

interface BilingualInputProps {
  label: string;
  nameKo: string;
  nameEn: string;
  nameZh?: string;
  valueKo: string;
  valueEn: string;
  valueZh?: string;
  onChange: (field: string, value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export default function BilingualInput({
  label,
  nameKo,
  nameEn,
  nameZh,
  valueKo,
  valueEn,
  valueZh = '',
  onChange,
  multiline = false,
  rows = 3,
  required = false,
}: BilingualInputProps) {
  const langs = [
    { name: nameKo, value: valueKo, label: '한국어 (KO)', req: required },
    { name: nameEn, value: valueEn, label: 'English (EN)', req: false },
    ...(nameZh ? [{ name: nameZh, value: valueZh, label: '中文 (ZH)', req: false }] : []),
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <div className={`grid grid-cols-1 gap-3 ${nameZh ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {langs.map((lang) => (
          <div key={lang.name}>
            <span className="mono-xs text-muted-foreground mb-1 block">{lang.label}</span>
            {multiline ? (
              <textarea
                value={lang.value}
                onChange={(e) => onChange(lang.name, e.target.value)}
                className="input-field resize-none"
                rows={rows}
                required={lang.req}
              />
            ) : (
              <input
                type="text"
                value={lang.value}
                onChange={(e) => onChange(lang.name, e.target.value)}
                className="input-field"
                required={lang.req}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
