import {
  isEmailAddress,
  validateSubmission,
  type ContactSubmission,
} from '@/lib/contact';
import {
  isRecord,
  jsonResponse,
  readRequestBody,
  validateContentLength,
  validateRequestOrigin,
} from '@/lib/contact-request';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

function getEmailConfiguration(): { apiKey: string; toEmail: string; fromEmail: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  const configurationIssues = [
    !apiKey ? 'RESEND_API_KEY' : null,
    !toEmail || !isEmailAddress(toEmail) ? 'CONTACT_TO_EMAIL' : null,
    !fromEmail || !isEmailAddress(fromEmail) ? 'CONTACT_FROM_EMAIL' : null,
  ].filter((name): name is string => name !== null);

  if (!apiKey || !toEmail || !fromEmail || !isEmailAddress(toEmail) || !isEmailAddress(fromEmail)) {
    console.error(`Contact email configuration is missing or invalid: ${configurationIssues.join(', ')}.`);
    return null;
  }

  return { apiKey, toEmail, fromEmail };
}

function getEmailContent(submission: ContactSubmission): { text: string; html: string } {
  const fields: Array<[string, string]> = [
    ['Name', submission.name],
    ['Business / Organization', submission.business],
    ['Email', submission.email],
    ['Phone', submission.phone],
    ['Area of interest', submission.service],
    ['Preferred contact method', submission.contactMethod],
  ];

  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Brief requirement:',
    submission.description,
  ].join('\n');

  const html = [
    ...fields.map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    ),
    `<p><strong>Brief requirement:</strong></p><p>${escapeHtml(submission.description).replace(/\n/g, '<br>')}</p>`,
  ].join('');

  return { text, html };
}

export async function POST(request: Request): Promise<Response> {
  const contentLengthResponse = validateContentLength(request);
  if (contentLengthResponse) {
    return contentLengthResponse;
  }

  const originResponse = validateRequestOrigin(request);
  if (originResponse) {
    return originResponse;
  }

  const bodyResult = await readRequestBody(request);
  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyResult.body);
  } catch {
    return jsonResponse({ ok: false, message: 'Please check your details and try again.' }, 400);
  }

  if (!isRecord(body)) {
    return jsonResponse({ ok: false, message: 'Please check your details and try again.' }, 400);
  }

  if (typeof body.website === 'string' && body.website.trim()) {
    return jsonResponse({ ok: true }, 200);
  }

  const { submission, errors } = validateSubmission(body);
  if (Object.keys(errors).length > 0) {
    return jsonResponse(
      {
        ok: false,
        message: 'Please check the highlighted fields and try again.',
        fieldErrors: errors,
      },
      400,
    );
  }

  const emailConfiguration = getEmailConfiguration();
  if (!emailConfiguration) {
    return jsonResponse(
      {
        ok: false,
        message: 'We’re unable to receive enquiries right now. Please try again later.',
      },
      503,
    );
  }

  const { text, html } = getEmailContent(submission);

  let providerResponse: Response;
  try {
    providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${emailConfiguration.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailConfiguration.fromEmail,
        to: [emailConfiguration.toEmail],
        reply_to: submission.email,
        subject: `Website enquiry: ${submission.service}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(12_000),
      cache: 'no-store',
    });
  } catch {
    console.error('Contact enquiry email delivery failed.');
    return jsonResponse(
      { ok: false, message: 'We couldn’t send your enquiry just now. Please try again shortly.' },
      502,
    );
  }

  if (!providerResponse.ok) {
    console.error(`Contact enquiry email delivery failed with status ${providerResponse.status}.`);
    return jsonResponse(
      { ok: false, message: 'We couldn’t send your enquiry just now. Please try again shortly.' },
      502,
    );
  }

  return jsonResponse({ ok: true }, 200);
}
