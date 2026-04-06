'use client';

import { useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
}

const mockFiles: MediaFile[] = [
  { id: '1', name: 'profile-photo.jpg', type: 'image/jpeg', size: '2.4 MB', uploadedAt: '2024-12-01', url: '/uploads/profile-photo.jpg' },
  { id: '2', name: 'research-poster.pdf', type: 'application/pdf', size: '5.1 MB', uploadedAt: '2024-11-15', url: '/uploads/research-poster.pdf' },
  { id: '3', name: 'exhibition-banner.png', type: 'image/png', size: '1.8 MB', uploadedAt: '2024-10-20', url: '/uploads/exhibition-banner.png' },
];

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>(mockFiles);
  const [dragOver, setDragOver] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('이 파일을 삭제하시겠습니까?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleUpload = () => {
    // Placeholder - would handle file upload
    const newFile: MediaFile = {
      id: Date.now().toString(),
      name: 'new-upload.jpg',
      type: 'image/jpeg',
      size: '1.2 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      url: '/uploads/new-upload.jpg',
    };
    setFiles(prev => [newFile, ...prev]);
  };

  return (
    <div>
      <AdminPageHeader
        code="MEDIA"
        title="미디어 라이브러리"
        description="이미지, PDF 등 미디어 파일을 관리합니다"
      />

      {/* Upload area */}
      <div
        className={`border-2 border-dashed p-12 text-center mb-8 transition-colors ${
          dragOver ? 'border-foreground bg-muted/50' : 'border-border'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
      >
        <p className="font-mono text-3xl text-muted-foreground/20 mb-4">↑</p>
        <p className="text-sm text-muted-foreground mb-2">파일을 드래그하거나 클릭하여 업로드</p>
        <p className="mono-xs text-muted-foreground mb-4">JPG, PNG, PDF · 최대 10MB</p>
        <button onClick={handleUpload} className="btn-primary">파일 선택</button>
      </div>

      {/* File list */}
      <div className="border border-border">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b border-border mono-xs text-muted-foreground">
          <div className="col-span-5">파일명</div>
          <div className="col-span-2">유형</div>
          <div className="col-span-2">크기</div>
          <div className="col-span-2">업로드일</div>
          <div className="col-span-1 text-right">관리</div>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">업로드된 파일이 없습니다</p>
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 items-center text-sm">
              <div className="col-span-5 font-medium truncate">{file.name}</div>
              <div className="col-span-2 text-muted-foreground mono-xs">{file.type.split('/')[1]?.toUpperCase()}</div>
              <div className="col-span-2 text-muted-foreground">{file.size}</div>
              <div className="col-span-2 text-muted-foreground">{file.uploadedAt}</div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleDelete(file.id)}
                  className="mono-xs text-danger hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        총 {files.length}개 파일
      </p>
    </div>
  );
}
