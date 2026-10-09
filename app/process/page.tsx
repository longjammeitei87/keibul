import type { Metadata } from 'next';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';
import { processSteps } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Process',
  description:
    'Learn how KEIBUL works through discovery, analysis, planning, design, build, launch and improvement.',
};

export default function ProcessPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="Process"
        level={1}
        title="A structured way to move from challenge to solution."
        description="We take a practical, transparent approach that keeps the business context at the centre of every decision."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {processSteps.map((step) => (
          <div key={step.number} className="card-surface relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full bg-accent-soft" />
            <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">{step.number}</p>
            <h2 className="relative mt-5 text-2xl font-semibold text-foreground">{step.title}</h2>
            <p className="relative mt-4 text-base leading-7 text-muted">{step.description}</p>
          </div>
        ))}
      </div>

      <CtaBanner
        title="Need a clear path for your next business improvement?"
        text="We can help you understand what matters most, what to improve first and what kind of solution makes sense for your situation."
        primaryLabel="Discuss Your Business"
        primaryHref="/contact"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </div>
  );
}
