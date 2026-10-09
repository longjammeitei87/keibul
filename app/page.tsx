import Link from 'next/link';
import { CaseStudyCard } from '@/components/ui/case-study-card';
import { CtaBanner } from '@/components/ui/cta-banner';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/ui/service-card';
import { faqItems, industries, processSteps, services, siteConfig } from '@/lib/site-data';

const painPoints = [
  'Manual processes',
  'Spreadsheets',
  'Paper records',
  'Repetitive work',
  'Manual reporting',
  'Disconnected systems',
];

const techCapabilities = [
  { title: 'Web', items: ['Websites', 'Web applications', 'Customer portals'] },
  { title: 'Mobile', items: ['Android', 'iOS', 'Business applications'] },
  { title: 'AI', items: ['AI assistants', 'Automation', 'Intelligent workflows'] },
  { title: 'Data', items: ['Analytics', 'Dashboards', 'Reporting'] },
  { title: 'Integrations', items: ['APIs', 'Payments', 'Third-party systems'] },
];

const principles = [
  {
    number: '01',
    title: 'Business-first',
    text: 'We start with your objectives, not a predetermined technology.',
  },
  {
    number: '02',
    title: 'Practical',
    text: 'We focus on improvements that bring real operational value.',
  },
  {
    number: '03',
    title: 'Modern',
    text: 'We use AI and technology where they make sense.',
  },
  {
    number: '04',
    title: 'Long-term',
    text: 'We can continue supporting and improving what we build.',
  },
];

const homeServiceDescriptions = [
  'Find opportunities, improve processes and plan for sustainable growth.',
  'Build useful systems around the way your organization works.',
  'Create better digital experiences for customers and teams.',
  'Reduce repetitive work with thoughtful automation and AI.',
  'Turn business data into clear insights and decisions.',
];

export default function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="section-kicker">{siteConfig.descriptor}</p>
            <h1>
              Business thinking. Technology solutions.{' '}
              <span className="hero-highlight">Real results.</span>
            </h1>
            <p className="hero-description">
              We help businesses improve operations, find growth opportunities and put practical technology to work.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="button-primary">
                Book a Consultation
              </Link>
              <Link href="/services" className="button-secondary">
                Explore Our Services
              </Link>
            </div>
            <p className="hero-tagline">{siteConfig.tagline}</p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="system-orbit orbit-one" />
            <div className="system-orbit orbit-two" />
            <div className="system-core">
              <span>KEIBUL</span>
              <small>Business + Technology</small>
            </div>
            <div className="system-node node-operations">
              <span className="node-mark">01</span>
              <span>Operations</span>
            </div>
            <div className="system-node node-insight">
              <span className="node-mark">02</span>
              <span>Insight</span>
            </div>
            <div className="system-node node-systems">
              <span className="node-mark">03</span>
              <span>Systems</span>
            </div>
            <div className="system-node node-growth">
              <span className="node-mark">04</span>
              <span>Growth</span>
            </div>
            <div className="visual-caption">A better way of working, connected.</div>
          </div>
        </div>
      </section>

      <section className="section-shell problem-section">
        <div className="problem-intro">
          <SectionHeading
            eyebrow="The challenge"
            title="Important work still happening manually?"
          />
          <p>There may be a better way. Start with the friction your team faces every day.</p>
        </div>
        <div className="pain-point-grid">
          {painPoints.map((item, index) => (
            <div key={item} className="pain-point">
              <span>0{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell clarity-section">
        <div className="clarity-number">01 / START WITH THE PROBLEM</div>
        <div className="clarity-content">
          <div>
            <p className="section-kicker">Business clarity first</p>
            <h2>You don’t need to know the technology.</h2>
          </div>
          <div>
            <p>
              Tell us what you want to achieve or what is slowing you down. We’ll help work out what makes sense.
            </p>
            <Link href="/contact" className="text-link">
              Discuss Your Business <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell services-section">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="What we do"
            title="Support for better ways of working."
          />
          <Link href="/services" className="text-link section-heading-link">
            All services <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              index={index}
              title={service.title}
              description={homeServiceDescriptions[index]}
              capabilities={service.outcomes}
            />
          ))}
        </div>
      </section>

      <section className="section-shell industries-section">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="Who we work with"
            title="Built around the way your industry works."
          />
          <Link href="/solutions" className="text-link section-heading-link">
            Explore solutions <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="industry-grid">
          {industries.map((industry, index) => (
            <article key={industry.title} className="industry-item">
              <span className="industry-index">0{index + 1}</span>
              <h3>{industry.title}</h3>
              <p>{industry.description}</p>
              <span className="industry-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell process-section">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="How we work"
            title="A clear path, from challenge to improvement."
          />
          <Link href="/process" className="text-link section-heading-link">
            Our process <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ol className="process-timeline">
          {processSteps.map((step) => (
            <li key={step.number} className="process-step">
              <span className="process-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="why-section">
        <div className="section-shell why-inner">
          <div className="why-heading">
            <p className="section-kicker">Why KEIBUL</p>
            <h2>Technology should solve problems, not create them.</h2>
            <p>We begin with the business need and keep the solution grounded in practical value.</p>
          </div>
          <div className="principle-list">
            {principles.map((principle) => (
              <article key={principle.number} className="principle-item">
                <span>{principle.number}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell capability-section">
        <div className="capability-heading">
          <SectionHeading
            eyebrow="Capabilities"
            title="The right technology for the right problem."
            description="We choose tools based on what your business actually needs."
          />
        </div>
        <div className="capability-grid">
          {techCapabilities.map((capability, index) => (
            <div key={capability.title} className="capability-group">
              <span className="capability-index">0{index + 1}</span>
              <h3>{capability.title}</h3>
              <p>{capability.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell work-section">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="Selected work"
            title="Practical work. Real business challenges."
          />
          <Link href="/work" className="text-link section-heading-link">
            About our work <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <CaseStudyCard />
      </section>

      <section className="section-shell faq-section">
        <div className="faq-intro">
          <SectionHeading
            eyebrow="FAQ"
            title="A few things you might be wondering."
          />
          <Link href="/faq" className="text-link">
            All questions <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="faq-list">
          {faqItems.slice(0, 5).map((item, index) => (
            <details key={item.question} className="faq-item" open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Have a business challenge you’re trying to solve?"
        text="Tell us what’s happening. We’ll help you explore the possibilities."
        primaryLabel="Book a Consultation"
        primaryHref="/contact"
        secondaryLabel="Tell Us About Your Project"
        secondaryHref="/contact"
      />
    </div>
  );
}
