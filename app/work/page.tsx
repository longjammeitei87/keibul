import type { Metadata } from 'next';
import { CaseStudyCard } from '@/components/ui/case-study-card';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'View KEIBUL selected work placeholders while the portfolio grows with real business case studies and practical digital solutions.',
};

export default function WorkPage() {
  return (
    <div className="section-shell">
      <SectionHeading
        eyebrow="Work"
        level={1}
        title="Selected work"
        description="We’re building a portfolio of practical digital solutions designed around real business challenges."
      />

      <div className="mt-10">
        <CaseStudyCard />
      </div>

      <CtaBanner
        title="Have a project in mind?"
        text="We can help shape the problem, validate the opportunity and determine the most useful solution before any build work begins."
        primaryLabel="Book a Consultation"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </div>
  );
}
