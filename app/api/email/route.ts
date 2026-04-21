import { Resend } from "resend";

export const runtime = "nodejs";

interface EmailRequestBody {
  to?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return Response.json(
      { error: "Email sending is not configured on the server." },
      { status: 500 }
    );
  }

  let body: EmailRequestBody;
  try {
    body = (await request.json()) as EmailRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const to = body.to?.trim();
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!to || !subject || !message) {
    return Response.json(
      { error: "Missing required fields: to, subject, message." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(to)) {
    return Response.json({ error: "Invalid recipient email address." }, { status: 400 });
  }

  if (subject.length > 200 || message.length > 5000) {
    return Response.json({ error: "Subject or message too long." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text: message,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }

  return Response.json({ id: data?.id ?? null });
}
