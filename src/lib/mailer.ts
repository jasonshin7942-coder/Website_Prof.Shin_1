import { Resend } from 'resend';
import type { ContactMessage } from '@/types/content';

const inquiryLabels: Record<string, string> = {
  collaboration: '공동 연구',
  invitation: '초청 강연',
  student: '학생 상담',
  media: '미디어 문의',
  general: '일반 문의',
};

export async function sendContactEmail(msg: ContactMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info('[mailer] RESEND_API_KEY not set — email skipped, message saved to DB.');
    return false;
  }

  const resend = new Resend(apiKey);

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="border-bottom:2px solid #000;padding-bottom:8px">연락하기 메시지</h2>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;font-weight:bold;width:100px;color:#555">보낸 사람</td><td style="padding:8px 0">${msg.name}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;color:#555">이메일</td><td style="padding:8px 0"><a href="mailto:${msg.email}">${msg.email}</a></td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;color:#555">문의 유형</td><td style="padding:8px 0">${inquiryLabels[msg.inquiryType] || msg.inquiryType}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;color:#555">제목</td><td style="padding:8px 0">${msg.subject}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;color:#555;vertical-align:top">내용</td>
        <td style="padding:8px 0;white-space:pre-wrap">${msg.message}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;color:#555">수신 시각</td><td style="padding:8px 0">${new Date(msg.createdAt).toLocaleString('ko-KR')}</td></tr>
  </table>
  <p style="margin-top:24px">
    <a href="mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}"
       style="background:#000;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block">
      답장 보내기
    </a>
  </p>
</div>`;

  try {
    const to = process.env.RESEND_TO;
    if (!to) {
      console.error('[mailer] RESEND_TO not set');
      return false;
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to],
      replyTo: msg.email,
      subject: `[연락하기] ${msg.subject}`,
      html,
    });
    if (error) {
      console.error('[mailer] Resend error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[mailer] Failed to send email:', err);
    return false;
  }
}
