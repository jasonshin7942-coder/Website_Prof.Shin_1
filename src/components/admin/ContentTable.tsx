'use client';

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode;
}

interface ContentTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTogglePublish?: (id: string) => void;
}

export default function ContentTable({ columns, data, onEdit, onDelete, onTogglePublish }: ContentTableProps) {
  if (data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="font-mono text-3xl text-muted-foreground/20 mb-3">∅</p>
        <p className="text-muted-foreground text-sm">등록된 항목이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 font-medium text-muted-foreground mono-xs ${
                  idx === 0 ? 'w-[40%]' : ''
                }`}
              >
                {col.label}
              </th>
            ))}
            <th className="text-right px-4 py-3 font-medium text-muted-foreground mono-xs w-[180px]">관리</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id as string || i} className="border-b border-border last:border-0 hover:bg-muted/30">
              {columns.map((col, idx) => (
                <td key={col.key} className={`px-4 py-3 ${idx === 0 ? 'truncate' : 'whitespace-nowrap'}`}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  {onTogglePublish && (
                    <button
                      onClick={() => onTogglePublish(row.id as string)}
                      className={`mono-xs px-2 py-0.5 border ${
                        row.published
                          ? 'border-success text-success'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {row.published ? '게시' : '비공개'}
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row.id as string)}
                      className="mono-xs px-2 py-0.5 border border-border hover:border-foreground"
                    >
                      수정
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row.id as string)}
                      className="mono-xs px-2 py-0.5 border border-danger text-danger hover:bg-danger hover:text-white"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
