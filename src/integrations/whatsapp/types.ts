export interface WhatsAppSendParams {
  to: string; // Nomor telepon tujuan
  message: string;
  templateId?: string;
  templateVars?: Record<string, string>;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  status: "sent" | "failed" | "queued";
  error?: string;
  attempt: number;
}

export interface WhatsAppWebhookPayload {
  messageId: string;
  status: "delivered" | "read" | "failed";
  timestamp: string;
  recipient: string;
  error?: string;
}
