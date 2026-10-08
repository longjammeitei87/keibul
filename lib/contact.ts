export const contactServices = [
  'Business Growth & Consulting',
  'Technology Consulting',
  'Custom Software',
  'Website',
  'Mobile App',
  'AI & Automation',
  'Data & Analytics',
  'Booking / Appointment System',
  'Not sure yet',
] as const;

export const contactMethods = ['Email', 'Phone', 'WhatsApp'] as const;

export const contactFieldNames = [
  'name',
  'business',
  'email',
  'phone',
  'service',
  'description',
  'contactMethod',
] as const;

export type ContactFieldName = (typeof contactFieldNames)[number];
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export type ContactSubmission = Record<ContactFieldName, string>;

export const contactFieldLabels: Record<ContactFieldName, string> = {
  name: 'Name',
  business: 'Business / Organization',
  email: 'Email',
  phone: 'Phone',
  service: 'Area of interest',
  description: 'Brief requirement',
  contactMethod: 'Preferred contact method',
};

export const contactFieldLimits: Record<ContactFieldName, number> = {
  name: 100,
  business: 160,
  email: 254,
  phone: 40,
  service: 80,
  description: 4000,
  contactMethod: 20,
};

export function normalizeContactField(value: string, field: ContactFieldName): string {
  const normalized = value.replace(/\r\n?/g, '\n');
  const withoutControls =
    field === 'description'
      ? normalized.replace(/[^\S\n]+/g, ' ').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      : normalized.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ');

  return withoutControls.trim().slice(0, contactFieldLimits[field]);
}

export function isEmailAddress(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
