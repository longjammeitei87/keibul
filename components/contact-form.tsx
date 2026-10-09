'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import {
  contactFieldLabels,
  contactFieldNames,
  contactMethods,
  contactServices,
  type ContactFieldErrors,
  type ContactFieldName,
} from '@/lib/contact';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

type ApiResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: ContactFieldErrors;
};

function isContactFieldName(value: string): value is ContactFieldName {
  return contactFieldNames.some((field) => field === value);
}

function isContactFieldErrors(value: unknown): value is ContactFieldErrors {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.entries(value).every(
      ([field, message]) => isContactFieldName(field) && typeof message === 'string',
    )
  );
}

function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== 'object' || value === null || !('ok' in value) || typeof value.ok !== 'boolean') {
    return false;
  }

  if ('message' in value && typeof value.message !== 'string') {
    return false;
  }

  return !('fieldErrors' in value) || isContactFieldErrors(value.fieldErrors);
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const isSubmitting = status === 'submitting';

  useEffect(() => {
    const firstInvalidField = contactFieldNames.find((field) => fieldErrors[field]);
    if (firstInvalidField) {
      document.getElementById(`contact-${firstInvalidField}`)?.focus();
    }
  }, [fieldErrors]);

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name;
    if (isContactFieldName(field) && fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      const errors: ContactFieldErrors = {};
      const invalidFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        '[required]:invalid',
      );

      invalidFields.forEach((field) => {
        if (isContactFieldName(field.name)) {
          errors[field.name] = field.validationMessage;
        }
      });

      setFieldErrors(errors);
      setStatus('error');
      setMessage('Please check the highlighted fields and try again.');
      return;
    }

    const formData = new FormData(form);
    const submission = Object.fromEntries(
      [...formData.entries()].map(([name, value]) => [name, typeof value === 'string' ? value : '']),
    );

    setStatus('submitting');
    setMessage('Sending your enquiry…');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.ok && isApiResponse(result) && result.ok) {
        form.reset();
        setStatus('success');
        setMessage("Thank you. Your enquiry has been received. We'll get back to you shortly.");
        return;
      }

      if (isApiResponse(result) && result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      setStatus('error');
      setMessage(
        isApiResponse(result) && result.message
          ? result.message
          : 'We couldn’t send your enquiry just now. Please try again shortly.',
      );
    } catch {
      setStatus('error');
      setMessage('We couldn’t send your enquiry just now. Please check your connection and try again.');
    }
  };

  const describedBy = (field: ContactFieldName) =>
    fieldErrors[field] ? `contact-${field}-error` : undefined;
  const isInvalid = (field: ContactFieldName) => Boolean(fieldErrors[field]);

  return (
    <div className="card-surface p-6 sm:p-8">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="field-label">
              {contactFieldLabels.name}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              className="field-input"
              required
              aria-invalid={isInvalid('name')}
              aria-describedby={describedBy('name')}
              onChange={handleFieldChange}
            />
            {fieldErrors.name ? <p id="contact-name-error" className="field-error">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="contact-business" className="field-label">
              {contactFieldLabels.business}
            </label>
            <input
              id="contact-business"
              name="business"
              type="text"
              autoComplete="organization"
              maxLength={160}
              className="field-input"
              required
              aria-invalid={isInvalid('business')}
              aria-describedby={describedBy('business')}
              onChange={handleFieldChange}
            />
            {fieldErrors.business ? <p id="contact-business-error" className="field-error">{fieldErrors.business}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className="field-label">
              {contactFieldLabels.email}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className="field-input"
              required
              aria-invalid={isInvalid('email')}
              aria-describedby={describedBy('email')}
              onChange={handleFieldChange}
            />
            {fieldErrors.email ? <p id="contact-email-error" className="field-error">{fieldErrors.email}</p> : null}
          </div>
          <div>
            <label htmlFor="contact-phone" className="field-label">
              {contactFieldLabels.phone}
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              className="field-input"
              required
              aria-invalid={isInvalid('phone')}
              aria-describedby={describedBy('phone')}
              onChange={handleFieldChange}
            />
            {fieldErrors.phone ? <p id="contact-phone-error" className="field-error">{fieldErrors.phone}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="contact-service" className="field-label">
            {contactFieldLabels.service}
          </label>
          <select
            id="contact-service"
            name="service"
            className="field-input"
            required
            defaultValue=""
            aria-invalid={isInvalid('service')}
            aria-describedby={describedBy('service')}
            onChange={handleFieldChange}
          >
            <option value="" disabled>
              Select an area of interest
            </option>
            {contactServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {fieldErrors.service ? <p id="contact-service-error" className="field-error">{fieldErrors.service}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-description" className="field-label">
            {contactFieldLabels.description}
          </label>
          <textarea
            id="contact-description"
            name="description"
            rows={5}
            maxLength={4000}
            className="field-input resize-none"
            required
            aria-invalid={isInvalid('description')}
            aria-describedby={describedBy('description')}
            onChange={handleFieldChange}
          />
          {fieldErrors.description ? <p id="contact-description-error" className="field-error">{fieldErrors.description}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-contactMethod" className="field-label">
            {contactFieldLabels.contactMethod}
          </label>
          <select
            id="contact-contactMethod"
            name="contactMethod"
            className="field-input"
            required
            defaultValue=""
            aria-invalid={isInvalid('contactMethod')}
            aria-describedby={describedBy('contactMethod')}
            onChange={handleFieldChange}
          >
            <option value="" disabled>
              Choose a preferred channel
            </option>
            {contactMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          {fieldErrors.contactMethod ? (
            <p id="contact-contactMethod-error" className="field-error">{fieldErrors.contactMethod}</p>
          ) : null}
        </div>

        <div className="form-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {message ? (
          <p
            className={`form-status form-status-${status}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </p>
        ) : null}

        <button type="submit" className="button-primary w-full justify-center sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  );
}
