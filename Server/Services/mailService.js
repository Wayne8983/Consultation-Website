const nodemailer = require("nodemailer");
const path = require("path");

const logoPath = path.join(
  __dirname,
  "../../Client/src/assets/companyLogo.png"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user_email,
    pass: process.env.Gmail_Password,
  },
});

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const formatDate = (date) => {
  if (!date) return "To be confirmed";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
};

const baseTemplate = ({ title, previewText, body }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>

      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          ${escapeHtml(previewText)}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.14);">
                <tr>
                  <td style="background:#050507;padding:34px 32px;text-align:center;">
                    <img src="cid:companyLogo" alt="Strategy Center" style="width:82px;height:auto;margin-bottom:18px;" />

                    <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.25;font-weight:800;">
                      Strategy Center
                    </h1>

                    <p style="margin:10px 0 0;color:#cbd5e1;font-size:14px;line-height:1.7;">
                      Strategy, leadership, and performance excellence.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:38px 34px;">
                    ${body}
                  </td>
                </tr>

                <tr>
                  <td style="background:#050507;padding:24px 32px;text-align:center;">
                    <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.7;">
                      © ${new Date().getFullYear()} Strategy Center. All rights reserved.
                    </p>

                    <p style="margin:8px 0 0;color:#64748b;font-size:12px;line-height:1.7;">
                      Nairobi, Kenya
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: `"Strategy Center" <${process.env.user_email}>`,
    to,
    subject,
    text,
    html,
    attachments: [
      {
        filename: "companyLogo.png",
        path: logoPath,
        cid: "companyLogo",
      },
    ],
  });
};

const sendConsultationApprovedEmail = async ({
  to,
  name,
  email,
  temporaryPassword,
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(temporaryPassword);

  return sendEmail({
    to,
    subject: "Your Consultation Has Been Approved",
    text: `Hello ${name}, your consultation has been approved. Your login email is ${email} and your temporary password is ${temporaryPassword}. Please change your password after logging in.`,
    html: baseTemplate({
      title: "Consultation Approved",
      previewText: "Your consultation has been approved.",
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Consultation Approved
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          Welcome, ${safeName}
        </h2>

        <p style="margin:18px 0 0;color:#4b5563;font-size:16px;line-height:1.8;">
          Your consultation request has been approved. We have created your client account so you can access your workspace.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;background:#faf5ff;border:1px solid #f0abfc;border-radius:16px;">
          <tr>
            <td style="padding:22px;">
              <p style="margin:0 0 14px;color:#111827;font-size:16px;font-weight:700;">
                Login Details
              </p>

              <p style="margin:0 0 12px;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Email:</strong><br />
                ${safeEmail}
              </p>

              <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Temporary Password:</strong><br />
                <span style="display:inline-block;margin-top:6px;padding:10px 12px;background:#ffffff;border:1px solid #e9d5ff;border-radius:10px;color:#111827;font-weight:700;letter-spacing:0.04em;">
                  ${safePassword}
                </span>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.8;">
          Please change your password after your first login.
        </p>
      `,
    }),
  });
};

const sendConsultationRejectedEmail = async ({ to, name }) => {
  const safeName = escapeHtml(name);

  return sendEmail({
    to,
    subject: "Update On Your Consultation Request",
    text: `Hello ${name}, thank you for contacting Strategy Center. We are unable to approve your consultation request at this time.`,
    html: baseTemplate({
      title: "Consultation Update",
      previewText: "An update on your consultation request.",
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Consultation Update
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          Hello, ${safeName}
        </h2>

        <p style="margin:18px 0 0;color:#4b5563;font-size:16px;line-height:1.8;">
          Thank you for reaching out to Strategy Center. After reviewing your consultation request, we are unable to approve it at this time.
        </p>

        <p style="margin:18px 0 0;color:#4b5563;font-size:16px;line-height:1.8;">
          You may contact our team for more information or submit another request in the future.
        </p>
      `,
    }),
  });
};

const sendContactMessageReceivedEmail = async ({ to, name }) => {
  const safeName = escapeHtml(name);

  return sendEmail({
    to,
    subject: "We Received Your Message",
    text: `Hello ${name}, we received your message and will get back to you shortly.`,
    html: baseTemplate({
      title: "Message Received",
      previewText: "We received your message.",
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Message Received
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          Thank you, ${safeName}
        </h2>

        <p style="margin:18px 0 0;color:#4b5563;font-size:16px;line-height:1.8;">
          We have received your message. Our team will review it and get back to you shortly.
        </p>
      `,
    }),
  });
};

const sendMeetingCreatedEmail = async ({
  to,
  name,
  title,
  description,
  meetingDate,
  venue,
}) => {
  return sendEmail({
    to,
    subject: "New Meeting Scheduled",
    text: `Hello ${name}, a meeting has been scheduled: ${title}, ${formatDate(meetingDate)}, Venue: ${venue}.`,
    html: baseTemplate({
      title: "Meeting Scheduled",
      previewText: "A new meeting has been scheduled.",
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Meeting Scheduled
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          Hello, ${escapeHtml(name)}
        </h2>

        <p style="margin:18px 0;color:#4b5563;font-size:16px;line-height:1.8;">
          A meeting has been scheduled for you.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
          <tr>
            <td style="padding:22px;">
              <p style="margin:0 0 12px;color:#111827;font-size:18px;font-weight:700;">
                ${escapeHtml(title)}
              </p>

              <p style="margin:0 0 10px;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Date:</strong><br />
                ${escapeHtml(formatDate(meetingDate))}
              </p>

              <p style="margin:0 0 10px;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Venue:</strong><br />
                ${escapeHtml(venue)}
              </p>

              ${
                description
                  ? `<p style="margin:0;color:#4b5563;font-size:14px;line-height:1.7;">
                      <strong style="color:#111827;">Description:</strong><br />
                      ${escapeHtml(description)}
                    </p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      `,
    }),
  });
};
const sendMeetingCancelledEmail = async ({
  to,
  name,
  title,
  description,
  meetingDate,
  venue,
}) => {
  return sendEmail({
    to,
    subject: "Meeting Cancelled",
    text: `Hello ${name}, the scheduled meeting "${title}" on ${formatDate(
      meetingDate
    )} at ${venue} has been cancelled.`,
    html: baseTemplate({
      title: "Meeting Cancelled",
      previewText: "Your scheduled meeting has been cancelled.",
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Meeting Cancelled
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          Hello, ${escapeHtml(name)}
        </h2>

        <p style="margin:18px 0;color:#4b5563;font-size:16px;line-height:1.8;">
          Your scheduled meeting has been cancelled.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
          <tr>
            <td style="padding:22px;">
              <p style="margin:0 0 12px;color:#111827;font-size:18px;font-weight:700;">
                ${escapeHtml(title)}
              </p>

              <p style="margin:0 0 10px;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Date:</strong><br />
                ${escapeHtml(formatDate(meetingDate))}
              </p>

              <p style="margin:0 0 10px;color:#4b5563;font-size:14px;line-height:1.7;">
                <strong style="color:#111827;">Venue:</strong><br />
                ${escapeHtml(venue)}
              </p>

              ${
                description
                  ? `<p style="margin:0;color:#4b5563;font-size:14px;line-height:1.7;">
                      <strong style="color:#111827;">Description:</strong><br />
                      ${escapeHtml(description)}
                    </p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      `,
    }),
  });
};

const sendGeneralNotificationEmail = async ({
  to,
  subject,
  heading,
  message,
}) => {
  return sendEmail({
    to,
    subject,
    text: message,
    html: baseTemplate({
      title: subject,
      previewText: message,
      body: `
        <p style="margin:0 0 12px;color:#db2777;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          Strategy Center
        </p>

        <h2 style="margin:0;color:#111827;font-size:30px;line-height:1.25;">
          ${escapeHtml(heading)}
        </h2>

        <p style="margin:18px 0 0;color:#4b5563;font-size:16px;line-height:1.8;">
          ${escapeHtml(message)}
        </p>
      `,
    }),
  });
};

module.exports = {
  sendEmail,
  sendConsultationApprovedEmail,
  sendMeetingCancelledEmail,
  sendConsultationRejectedEmail,
  sendContactMessageReceivedEmail,
  sendMeetingCreatedEmail,
  sendGeneralNotificationEmail,
};