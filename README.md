This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact enquiry email

The contact form submits to the server-side `/api/contact` route. Email delivery uses the Resend REST API and requires these server-only environment variables:

- `RESEND_API_KEY` — API key for the Resend account.
- `CONTACT_TO_EMAIL` — inbox that should receive KEIBUL enquiries.
- `CONTACT_FROM_EMAIL` — sender address verified with Resend.

Copy `.env.example` to `.env.local` for local development and fill in the values. Add the same variables to the production hosting environment; never use a `NEXT_PUBLIC_` prefix or commit real credentials. The route validates submissions and returns a visitor-friendly temporary error when the email configuration is missing or the provider cannot accept a message. No enquiry is stored if email delivery is unavailable.

### Contact-form abuse protection

Contact-form rate limiting is deferred. The route currently does not enforce a per-client submission limit, and no in-memory or caller-controlled-header substitute is used. Abuse protection is reduced until a shared production rate limiter is selected, configured, and tested.

The contact route still enforces server-side field validation, same-origin checks when an `Origin` header is present, a 16 KiB request-body limit, and honeypot handling. The form prevents duplicate submissions while a request is in progress in the current browser session. These controls do not replace server-side rate limiting.

When an `Origin` header is present, the contact route accepts only the configured KEIBUL site origin and, on Vercel, the trusted Vercel deployment hostnames. It does not use request-supplied forwarded-host or forwarded-protocol headers for this check. Requests without `Origin` remain allowed for non-browser callers; the contact endpoint does not use cookie-based authentication. Browser form submissions send `Origin` and are checked.

Focused contact API tests mock email delivery; they do not send real messages or verify live Resend delivery or external rate limiting.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
