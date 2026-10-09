import assert from 'node:assert/strict';
import test from 'node:test';
import { POST } from '../app/api/contact/route.ts';
import { validateSubmission } from '../lib/contact.ts';
import {
  isRequestOriginAllowed,
  maximumRequestSize,
  readRequestBody,
  validateContentLength,
  validateRequestOrigin,
} from '../lib/contact-request.ts';

const validSubmission = {
  name: 'Test Contact',
  business: 'Example Business',
  email: 'test@example.com',
  phone: '+919863497142',
  service: 'Technology Consulting',
  description: 'Please contact me about a test enquiry.',
  contactMethod: 'Email',
};

const emailConfiguration = {
  RESEND_API_KEY: 'test-resend-key',
  CONTACT_TO_EMAIL: 'inbox@example.com',
  CONTACT_FROM_EMAIL: 'website@example.com',
  VERCEL: undefined,
  UPSTASH_REDIS_REST_URL: undefined,
  UPSTASH_REDIS_REST_TOKEN: undefined,
};

async function withEnvironment(values, callback) {
  const original = new Map(Object.keys(values).map((key) => [key, process.env[key]]));

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await callback();
  } finally {
    for (const [key, value] of original) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

function makeRequest(body, headers = {}) {
  const requestHeaders = new Headers({
    'content-type': 'application/json',
    origin: 'https://www.keibul.com',
    ...headers,
  });
  if (headers.origin === null) {
    requestHeaders.delete('origin');
  }

  return new Request('https://www.keibul.com/api/contact', {
    method: 'POST',
    headers: requestHeaders,
    body,
  });
}

function mockFetch(callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = callback;
  return () => {
    globalThis.fetch = originalFetch;
  };
}

test('server validation accepts a complete valid submission', () => {
  const { submission, errors } = validateSubmission(validSubmission);
  assert.deepEqual(errors, {});
  assert.equal(submission.email, validSubmission.email);
});

test('server validation rejects missing, malformed, and unsupported values', () => {
  const { errors } = validateSubmission({
    ...validSubmission,
    name: '',
    email: 'not-an-email',
    service: 'Unlisted service',
    contactMethod: 'Unlisted method',
  });
  assert.equal(errors.name, 'Name is required.');
  assert.equal(errors.email, 'Enter a valid email address.');
  assert.equal(errors.service, 'Choose an area of interest from the list.');
  assert.equal(errors.contactMethod, 'Choose a preferred contact method from the list.');
});

test('origin validation accepts configured KEIBUL and Vercel deployment origins', async () => {
  assert.equal(validateRequestOrigin(makeRequest(JSON.stringify(validSubmission))), null);

  const request = new Request('https://www.keibul.com/api/contact', {
    headers: {
      host: 'internal.vercel.app',
      'x-forwarded-host': 'attacker.example',
      'x-forwarded-proto': 'https',
    },
  });
  assert.equal(isRequestOriginAllowed('https://www.keibul.com', request), true);
  assert.equal(isRequestOriginAllowed('https://attacker.example', request), false);
  assert.equal(
    await withEnvironment(
      {
        VERCEL: '1',
        VERCEL_URL: 'keibul-preview.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'keibul-production.vercel.app',
      },
      async () =>
        isRequestOriginAllowed('https://keibul-preview.vercel.app', request) &&
        isRequestOriginAllowed('https://keibul-production.vercel.app', request),
    ),
    true,
  );
  assert.equal(
    await withEnvironment({ VERCEL: undefined }, async () =>
      isRequestOriginAllowed('https://keibul-preview.vercel.app', request),
    ),
    false,
  );
});

test('origin validation rejects foreign, malformed, and non-origin values', () => {
  const request = makeRequest(JSON.stringify(validSubmission));
  assert.equal(isRequestOriginAllowed('https://attacker.example', request), false);
  assert.equal(isRequestOriginAllowed('not-an-origin', request), false);
  assert.equal(isRequestOriginAllowed('https://www.keibul.com/path', request), false);

  const foreignRequest = makeRequest(JSON.stringify(validSubmission), {
    origin: 'https://attacker.example',
  });
  assert.equal(validateRequestOrigin(foreignRequest)?.status, 403);
  const malformedRequest = makeRequest(JSON.stringify(validSubmission), { origin: 'not-an-origin' });
  assert.equal(validateRequestOrigin(malformedRequest)?.status, 403);
});

test('missing Origin remains allowed for non-browser callers', async () => {
  const request = makeRequest(JSON.stringify(validSubmission), { origin: null });
  assert.equal(validateRequestOrigin(request), null);

  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  try {
    const response = await withEnvironment(emailConfiguration, () => POST(request));
    assert.equal(response.status, 200);
    assert.equal(fetchCalled, true);
  } finally {
    restoreFetch();
  }
});

test('the contact endpoint returns validation errors without sending email', async () => {
  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(makeRequest(JSON.stringify({ ...validSubmission, name: '', email: 'invalid' }))),
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.fieldErrors.name, 'Name is required.');
    assert.equal(body.fieldErrors.email, 'Enter a valid email address.');
    assert.equal(fetchCalled, false);
  } finally {
    restoreFetch();
  }
});

test('the contact endpoint rejects foreign and malformed origins', async () => {
  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  try {
    for (const origin of ['https://attacker.example', 'not-an-origin']) {
      const response = await withEnvironment(emailConfiguration, () =>
        POST(makeRequest(JSON.stringify(validSubmission), { origin })),
      );
      assert.equal(response.status, 403);
    }
    assert.equal(fetchCalled, false);
  } finally {
    restoreFetch();
  }
});

test('declared and streamed request bodies over the limit return 413', async () => {
  const declaredOversize = makeRequest('', {
    'content-length': String(maximumRequestSize + 1),
  });
  assert.equal(validateContentLength(declaredOversize)?.status, 413);

  const oversizedBody = new Uint8Array(maximumRequestSize + 1);
  const streamedOversize = new Request('https://www.keibul.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.keibul.com',
    },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(oversizedBody);
        controller.close();
      },
    }),
    duplex: 'half',
  });
  const streamedOversizeForRoute = streamedOversize.clone();
  const result = await readRequestBody(streamedOversize);
  assert.equal(result.ok, false);
  assert.equal(result.response.status, 413);

  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(declaredOversize),
    );
    assert.equal(response.status, 413);
    const streamedResponse = await withEnvironment(emailConfiguration, () =>
      POST(streamedOversizeForRoute),
    );
    assert.equal(streamedResponse.status, 413);
    assert.equal(fetchCalled, false);
  } finally {
    restoreFetch();
  }
});

test('honeypot submissions return success without sending email', async () => {
  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(makeRequest(JSON.stringify({ ...validSubmission, website: 'filled by bot' }))),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(fetchCalled, false);
  } finally {
    restoreFetch();
  }
});

test('email delivery proceeds without Upstash configuration', async () => {
  let fetchCalled = false;
  const restoreFetch = mockFetch(async (url, options) => {
    fetchCalled = true;
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.method, 'POST');
    return Response.json({ id: 'mock-email-id' }, { status: 200 });
  });
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(makeRequest(JSON.stringify(validSubmission))),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(fetchCalled, true);
  } finally {
    restoreFetch();
  }
});

test('missing email configuration returns a generic 503 without sending', async () => {
  let fetchCalled = false;
  const restoreFetch = mockFetch(async () => {
    fetchCalled = true;
    return Response.json({ id: 'mock-email-id' });
  });
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const response = await withEnvironment(
      {
        CONTACT_FROM_EMAIL: undefined,
      },
      () => POST(makeRequest(JSON.stringify(validSubmission))),
    );
    const body = await response.text();

    assert.equal(response.status, 503);
    assert.ok(body.includes('unable to receive enquiries'));
    assert.ok(!body.includes('CONTACT_FROM_EMAIL'));
    assert.equal(fetchCalled, false);
  } finally {
    restoreFetch();
    console.error = originalConsoleError;
  }
});

test('email provider failures return a safe response without exposing provider details', async () => {
  const originalConsoleError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args.join(' '));
  const restoreFetch = mockFetch(async () => {
    throw new Error('internal-provider-detail-test');
  });
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(makeRequest(JSON.stringify(validSubmission))),
    );
    const body = await response.text();
    assert.equal(response.status, 502);
    assert.ok(body.includes('We couldn’t send your enquiry'));
    assert.ok(!body.includes('internal-provider-detail-test'));
    assert.ok(!logs.some((entry) => entry.includes('internal-provider-detail-test')));
  } finally {
    restoreFetch();
    console.error = originalConsoleError;
  }
});

test('email provider error responses are not exposed in the response or logs', async () => {
  const originalConsoleError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args.join(' '));
  const restoreFetch = mockFetch(async () =>
    Response.json(
      { name: 'ProviderError', message: 'failure for test@example.com internal-provider-detail' },
      { status: 500 },
    ),
  );
  try {
    const response = await withEnvironment(emailConfiguration, () =>
      POST(makeRequest(JSON.stringify(validSubmission))),
    );
    const body = await response.text();
    const combinedOutput = `${body}\n${logs.join('\n')}`;
    assert.equal(response.status, 502);
    assert.ok(body.includes('We couldn’t send your enquiry'));
    assert.ok(!combinedOutput.includes('test@example.com'));
    assert.ok(!combinedOutput.includes('internal-provider-detail'));
    assert.ok(!combinedOutput.includes('test-resend-key'));
  } finally {
    restoreFetch();
    console.error = originalConsoleError;
  }
});
