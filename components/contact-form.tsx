'use client';

import { FormEvent, useState } from 'react';

const serviceOptions = [
  'Business Growth & Consulting',
  'Technology Consulting',
  'Custom Software',
  'Website',
  'Mobile App',
  'AI & Automation',
  'Data & Analytics',
  'Booking / Appointment System',
  'Not sure yet',
];

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const isValid = form.checkValidity();
    if (!isValid) {
      form.reportValidity();
      setStatus('error');
      setMessage('Please complete the highlighted fields before submitting your enquiry.');
      return;
    }

    setStatus('success');
    setMessage(
      'Your details passed local validation. This form is not connected to an inbox yet, so your enquiry has not been sent.',
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="field-label">
              Name
            </label>
            <input id="name" name="name" type="text" className="field-input" required />
          </div>
          <div>
            <label htmlFor="business" className="field-label">
              Business / Organization
            </label>
            <input id="business" name="business" type="text" className="field-input" required />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" name="email" type="email" className="field-input" required />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" className="field-input" required />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="field-label">
            What can we help you with?
          </label>
          <select id="service" name="service" className="field-input" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="field-label">
            Brief description of requirement
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="field-input resize-none"
            required
          />
        </div>

        <div>
          <label htmlFor="contactMethod" className="field-label">
            Preferred contact method
          </label>
          <select id="contactMethod" name="contactMethod" className="field-input" required defaultValue="">
            <option value="" disabled>
              Choose a preferred channel
            </option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>

        {message ? (
          <p
            className={status === 'success' ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700' : 'rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700'}
            role={status === 'success' ? 'status' : 'alert'}
          >
            {message}
          </p>
        ) : null}

        <button type="submit" className="button-primary w-full justify-center sm:w-auto">
          Send Enquiry
        </button>
      </form>
    </div>
  );
}
