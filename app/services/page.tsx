import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';
import { services } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore KEIBUL services covering business consulting, custom software, web development, AI automation and data insights.',
};

export default function ServicesPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="Services"
        level={1}
        title="Practical solutions for business growth and operational improvement."
        description="We work with organizations that need to improve how they operate, serve customers and use technology without unnecessary complexity."
      />

      <div className="mt-10 space-y-6">
        {services.map((service) => (
          <article key={service.title} className="card-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="section-kicker">Service</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{service.title}</h2>
              </div>
              <div>
                <p className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                  Business outcome
                </p>
                <p className="mt-4 text-lg leading-8 text-muted">{service.description}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {service.outcomes.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-background p-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="button-primary">
                Book a Consultation
              </Link>
              <Link href="/solutions" className="button-secondary">
                Explore Solutions
              </Link>
            </div>
          </article>
        ))}
      </div>

      <CtaBanner
        title="Need a solution tailored to your business?"
        text="Tell us about the challenge you want to solve, and we’ll help you decide the right strategy, system or technology approach."
        primaryLabel="Discuss Your Business"
        primaryHref="/contact"
        secondaryLabel="See Our Process"
        secondaryHref="/process"
      />
    </div>
  );
}
