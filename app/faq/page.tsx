import type { Metadata } from 'next';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';
import { faqItems } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about KEIBUL services, process, project scope and support.',
};

export default function FaqPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="FAQ"
        level={1}
        title="Questions businesses often ask before starting."
      />

      <div className="mt-10 space-y-4">
        {faqItems.map((item, index) => (
          <details key={item.question} className="card-surface rounded-2xl p-5" open={index === 0}>
            <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900">
              {item.question}
            </summary>
            <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>

      <CtaBanner
        title="Need a more specific answer for your situation?"
        text="Talk to us about your business challenge and we’ll help you understand the best next steps."
        primaryLabel="Discuss Your Business"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </div>
  );
}
