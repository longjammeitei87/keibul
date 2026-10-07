import type { Metadata } from 'next';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn the KEIBUL philosophy: start with the business problem, identify the opportunity and build practical solutions that support growth.',
};

export default function AboutPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="About"
        level={1}
        title="Businesses shouldn’t need to become technology experts to benefit from technology."
        description="KEIBUL is built around a simple idea: understand the business first, then identify the right improvement, solution or technology path."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card-surface rounded-[2rem] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Our philosophy</h2>
          <ul className="mt-6 space-y-4 text-base leading-7 text-slate-600">
            <li>Understand the business and the real challenge before suggesting a technology solution.</li>
            <li>Identify the gap, opportunity or inefficiency that matters most.</li>
            <li>Recommend the right approach based on practical value and business fit.</li>
            <li>Build useful systems, automate select processes and support continuous improvement.</li>
          </ul>
        </div>

        <div className="card-surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Built from Northeast India</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Rooted here. Built for anywhere.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Built from Northeast India. Designed for modern businesses. KEIBUL brings a grounded regional identity and a practical, modern business mindset that can serve organizations across India and beyond.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            We help clients decide what should be improved, what can be automated, what should be digitized, what data matters and what technology should not be built.
          </p>
        </div>
      </div>

      <CtaBanner
        title="Need a business-first technology partner?"
        text="We can help you understand the problem, define the right opportunity and choose the most responsible way to move forward."
        primaryLabel="Book a Consultation"
        primaryHref="/contact"
        secondaryLabel="See Our Process"
        secondaryHref="/process"
      />
    </div>
  );
}
