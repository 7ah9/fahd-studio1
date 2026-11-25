import "server-only";

/**
 * Acceptance e-mail, sent through the studio's Gmail account using an
 * "App password" (env GMAIL_USER + GMAIL_APP_PASSWORD). It never throws:
 * the admin panel just shows whether the mail went out.
 */

export type MailResult = "sent" | "not_configured" | "failed";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendAcceptanceEmail(opts: {
  to: string;
  name: string;
  kind: "join" | "staff";
  /** Arabic role name (staff applications). */
  roleLabel?: string;
  discordUrl?: string;
}): Promise<MailResult> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return "not_configured";

  const name = opts.name.trim().slice(0, 80) || "";
  const arWhat =
    opts.kind === "staff"
      ? `تم قبول تقديمك لإدارة سيرفر FAHAD STUDIO${opts.roleLabel ? ` بدور: ${opts.roleLabel}` : ""}.`
      : "تم قبول طلب انضمامك إلى فريق FAHAD STUDIO.";
  const enWhat =
    opts.kind === "staff"
      ? "Your application to join the FAHAD STUDIO server staff has been accepted."
      : "Your application to join the FAHAD STUDIO team has been accepted.";
  const arNext = "سنتواصل معك عبر Discord قريباً، تأكد أنك داخل السيرفر وأن رسائلك الخاصة مفتوحة.";
  const enNext = "We will contact you on Discord soon. Make sure you are in the server and your DMs are open.";
  const link = opts.discordUrl && /^https?:\/\//i.test(opts.discordUrl) ? opts.discordUrl : "";

  const text = [
    `مرحباً ${name}،`,
    arWhat,
    arNext,
    link ? `سيرفر Discord: ${link}` : "",
    "إذا لم تقدّم أنت على هذا الطلب فتجاهل هذه الرسالة.",
    "",
    "— FAHAD STUDIO",
    "",
    "-----",
    `Hello ${name},`,
    enWhat,
    enNext,
    link ? `Discord server: ${link}` : "",
    "If you did not submit this application, please ignore this email.",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const html = `<div style="background:#06070a;padding:24px;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:560px;margin:auto;background:#0e1016;border:1px solid #1f2733;border-radius:16px;padding:28px;color:#e8eef6">
    <div style="font-size:20px;font-weight:700;color:#9cc0e4;letter-spacing:1px">FAHAD STUDIO</div>
    <div dir="rtl" style="margin-top:20px;line-height:2;font-size:15px">
      <p>مرحباً ${esc(name)}،</p>
      <p style="font-size:17px;font-weight:700">🎉 ${esc(arWhat)}</p>
      <p>${esc(arNext)}</p>
    </div>
    <hr style="border:none;border-top:1px solid #1f2733;margin:20px 0" />
    <div dir="ltr" style="line-height:1.9;font-size:14px;color:#b9c6d6">
      <p>Hello ${esc(name)},</p>
      <p>${esc(enWhat)}</p>
      <p>${esc(enNext)}</p>
    </div>
    ${
      link
        ? `<p style="text-align:center;margin:24px 0 8px"><a href="${esc(link)}" style="background:#9cc0e4;color:#06070a;text-decoration:none;font-weight:700;padding:12px 26px;border-radius:999px;display:inline-block">Discord</a></p>`
        : ""
    }
    <p dir="rtl" style="font-size:12px;color:#6b7788;margin-top:20px">إذا لم تقدّم أنت على هذا الطلب فتجاهل هذه الرسالة.</p>
  </div>
</div>`;

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
    await transporter.sendMail({
      from: `"FAHAD STUDIO" <${user}>`,
      to: opts.to,
      subject: "🎉 تم قبول طلبك في FAHAD STUDIO | Your application was accepted",
      text,
      html,
    });
    return "sent";
  } catch (err) {
    console.error("[mail] failed", err);
    return "failed";
  }
}
