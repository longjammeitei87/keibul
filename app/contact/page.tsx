import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with KEIBUL to discuss your business challenge, opportunity or technology requirement.',
};

export default function ContactPage() {
  return (
    <div className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Contact"
            level={1}
            title="Let’s talk about your business."
            description="Tell us what you’re trying to improve, build or automate. You don’t need to have the technical solution figured out."
          />

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Configuration note</p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Contact details and inbox routing can be configured later for a live business workflow. The form currently validates inputs in your browser but does not send or store enquiries.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
