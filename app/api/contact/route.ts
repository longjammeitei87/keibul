import {
  contactFieldLabels,
  contactFieldNames,
  contactFieldLimits,
  contactMethods,
  contactServices,
  isEmailAddress,
  normalizeContactField,
  type ContactFieldErrors,
  type ContactSubmission,
} from '@/lib/contact';

const maximumRequestSize = 16_384;

function jsonResponse(body: object, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

function validateSubmission(input: Record<string, unknown>): {
  submission: ContactSubmission;
  errors: ContactFieldErrors;
} {
  const submission: ContactSubmission = {
    name: '',
    business: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    contactMethod: '',
  };
  const errors: ContactFieldErrors = {};

  for (const field of contactFieldNames) {
    const value = input[field];
    if (typeof value !== 'string') {
      errors[field] = `${contactFieldLabels[field]} is required.`;
      submission[field] = '';
      continue;
    }

    const normalized = normalizeContactField(value, field);
    submission[field] = normalized;
    if (!normalized) {
      errors[field] = `${contactFieldLabels[field]} is required.`;
    } else if (value.length > contactFieldLimits[field]) {
      errors[field] = `${contactFieldLabels[field]} is too long.`;
    }
  }

  if (submission.email && !isEmailAddress(submission.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (submission.service && !contactServices.some((service) => service === submission.service)) {
    errors.service = 'Choose an area of interest from the list.';
  }

  if (
    submission.contactMethod &&
    !contactMethods.some((method) => method === submission.contactMethod)
  ) {
    errors.contactMethod = 'Choose a preferred contact method from the list.';
  }

  return { submission, errors };
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

function redactSensitiveValues(value: string, sensitiveValues: string[]): string {
  const redacted = sensitiveValues.reduce(
    (result, sensitiveValue) =>
      sensitiveValue ? result.split(sensitiveValue).join('[redacted]') : result,
    value,
  );

  return redacted.slice(0, 500);
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
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maximumRequestSize) {
    return jsonResponse({ ok: false, message: 'Your enquiry is too large. Please shorten it and try again.' }, 413);
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return jsonResponse({ ok: false, message: 'We could not verify this request. Please refresh the page and try again.' }, 403);
      }
    } catch {
      return jsonResponse({ ok: false, message: 'We could not verify this request. Please refresh the page and try again.' }, 403);
    }
  }

  const rawBody = await request.text();
  if (rawBody.length > maximumRequestSize) {
    return jsonResponse({ ok: false, message: 'Your enquiry is too large. Please shorten it and try again.' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
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
    let providerError = '';
    try {
      const responseBody: unknown = await providerResponse.json();
      if (isRecord(responseBody)) {
        const name = typeof responseBody.name === 'string' ? responseBody.name : '';
        const message = typeof responseBody.message === 'string' ? responseBody.message : '';
        providerError = [name, message].filter(Boolean).join(': ');
      }
    } catch (error) {
      console.error(
        `Contact enquiry email provider returned an unreadable error response (status ${providerResponse.status}; ${error instanceof Error ? error.name : 'unknown error'}).`,
      );
    }

    const details = redactSensitiveValues(providerError, [
      emailConfiguration.apiKey,
      emailConfiguration.toEmail,
      emailConfiguration.fromEmail,
      ...Object.values(submission),
    ]);
    console.error(
      `Contact enquiry email delivery failed with status ${providerResponse.status}${details ? `: ${details}` : '.'}`,
    );
    return jsonResponse(
      { ok: false, message: 'We couldn’t send your enquiry just now. Please try again shortly.' },
      502,
    );
  }

  return jsonResponse({ ok: true }, 200);
}
