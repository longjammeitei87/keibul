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
            description="Tell us what you’re trying to improve, build or automate. You don’t need to have the technical solution figured out to start a useful conversation."
          />

          <div className="mt-8 border-l-2 border-teal-700 pl-5">
            <p className="text-base leading-7 text-slate-600">
              Share a little about your organization and what you’d like to change. We’ll use your enquiry to understand the context and follow up using your preferred contact method.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
