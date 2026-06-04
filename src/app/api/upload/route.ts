import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

const BUCKET = 'uploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { error } = await db.storage
      .from(BUCKET)
      .upload(fileName, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(fileName);
    return NextResponse.json({ url: urlData.publicUrl, fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
