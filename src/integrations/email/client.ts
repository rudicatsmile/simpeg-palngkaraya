export interface EmailSendParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export function generateEmailTemplate(
  judul: string,
  pesan: string,
  ctaLink?: string,
  namaPemda: string = "Pemerintah Daerah",
  namaBkd: string = "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)"
): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${judul}</title>
  <style>
    body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #1e293b; padding: 24px; text-align: center; color: #ffffff; }
    .header h2 { margin: 0; font-size: 18px; letter-spacing: -0.5px; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #94a3b8; }
    .body { padding: 32px 24px; }
    .body h3 { margin-top: 0; color: #0f172a; font-size: 18px; }
    .body p { font-size: 14px; line-height: 1.6; color: #475569; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 16px; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>${namaPemda.toUpperCase()}</h2>
      <p>${namaBkd}</p>
    </div>
    <div class="body">
      <h3>${judul}</h3>
      <p>${pesan}</p>
      ${
        ctaLink
          ? `<div style="text-align: center; margin: 24px 0;"><a href="${ctaLink}" class="btn">Buka Portal SIMPEG Daerah</a></div>`
          : ""
      }
      <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">Pesan ini dikirim otomatis oleh sistem kepegawaian e-SIMPEG Daerah. Mohon tidak membalas email ini.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${namaPemda}. Seluruh hak cipta dilindungi.
    </div>
  </div>
</body>
</html>
  `;
}


export async function sendEmailMessage(params: EmailSendParams): Promise<{ success: boolean; error?: string }> {
  // Simulasi/Implementasi pengiriman SMTP kedinasan
  console.log(`[EMAIL DISPATCHER] To: ${params.to} | Subjek: ${params.subject}`);
  return { success: true };
}
