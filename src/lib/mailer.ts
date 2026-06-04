import nodemailer from 'nodemailer';
import type { ContactMessage } from '@/types/content';

// Reads SMTP config from environment variables.
// Set these in .env.local to enable email delivery.
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

export async function sendContactEmail(msg: ContactMessage): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    // Email not configured — message is stored but not emailed.
    console.info('[mailer] SMTP not configured. Message saved to storage only.');
    return false;
  }

  const to = process.env.SMTP_TO || process.env.SMTP_USER!;

  const inquiryLabels: Record<string, string> = {
    collaboration: '공동 연구',
    invitation: '초청 강연',
    student: '학생 상담',
    media: '미디어 문의',
    general: '일반 문의',
  };

  const html = `
<h2>연락하기 메시지</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:8px;font-weight:bold;width:120px">보낸 사람</td><td style="padding:8px">${msg.name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold">이메일</td><td style="padding:8px"><a href="mailto:${msg.email}">${msg.email}</a></td></tr>
  <tr><td style="padding:8px;font-weight:bold">문의 유형</td><td style="padding:8px">${inquiryLabels[msg.inquiryType] || msg.inquiryType}</td></tr>
  <tr><td style="padding:8px;font-weight:bold">제목</td><td style="padding:8px">${msg.subject}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;vertical-align:top">내용</td><td style="padding:8px;white-space:pre-wrap">${msg.message}</td></tr>
  <tr><td style="padding:8px;font-weight:bold">수신 시각</td><td style="padding:8px">${new Date(msg.createdAt).toLocaleString('ko-KR')}</td></tr>
</table>
`;

  try {
    await transporter.sendMail({
      from: `"신종천 교수 웹사이트" <${process.env.SMTP_USER}>`,
      to,
      replyTo: msg.email,
      subject: `[연락하기] ${msg.subject}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('[mailer] Failed to send email:', err);
    return false;
  }
}
