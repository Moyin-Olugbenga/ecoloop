

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  console.log("---- EMAIL (stub) ----");
  console.log("To:", input.to);
  console.log("Subject:", input.subject);
  console.log("Body:", input.html);
  console.log("-----------------------");
}

export function activationEmailHtml(activationUrl: string) {
  return `
    <p>Welcome to TrashVill!</p>
    <p>Click the link below to activate your account:</p>
    <p><a href="${activationUrl}">${activationUrl}</a></p>
    <p>This link expires in 24 hours.</p>
  `;
}

export function passwordResetEmailHtml(resetUrl: string) {
  return `
    <p>We received a request to reset your TrashVill password.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
  `;
}