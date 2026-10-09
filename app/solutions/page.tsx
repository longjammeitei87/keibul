import type { Metadata } from 'next';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';
import { industries } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Explore the practical solutions KEIBUL can help organizations build across education, healthcare, SMBs, professional services and startups.',
};

export default function SolutionsPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="Solutions"
        level={1}
        title="Technology that supports real business outcomes."
        description="We focus on practical improvements: better operations, smoother service delivery, clearer reporting and smarter workflows."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {industries.map((industry) => (
          <article key={industry.title} className="card-surface rounded-panel p-6">
            <h2 className="text-2xl font-semibold text-foreground">{industry.title}</h2>
            <p className="mt-4 text-base leading-7 text-muted">{industry.description}</p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Possible solutions</p>
              <ul className="mt-4 space-y-3 text-sm text-foreground">
                {industry.solutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full bg-brand-secondary" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-panel border border-border bg-panel p-6 sm:p-8">
        <h3 className="text-2xl font-semibold text-foreground">What we help improve</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            'Business operations',
            'Customer journeys',
            'Internal workflows',
            'Decision-making and reporting',
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-background p-4 text-sm font-medium text-foreground">
              {item}
            </div>
          ))}
        </div>
      </div>

      <CtaBanner
        title="Need one of these solutions for your organization?"
        text="We can help you decide what should be improved, automated, digitized and built."
        primaryLabel="Book a Consultation"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </div>
  );
}
