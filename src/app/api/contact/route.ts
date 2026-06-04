import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@/lib/messageStorage';
import { sendContactEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, inquiryType, subject, message, locale } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '필수 항목이 누락됐습니다.' }, { status: 400 });
    }

    const saved = await createMessage({ name, email, inquiryType, subject, message, locale: locale || 'ko' });
    const emailed = await sendContactEmail(saved);

    return NextResponse.json({ success: true, emailed });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
