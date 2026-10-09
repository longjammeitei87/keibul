import Link from 'next/link';
import { businessContact, siteConfig } from '@/lib/site-data';

const currentYear = 2026;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="footer-brand" aria-label="KEIBUL home">
            {siteConfig.name}
          </Link>
          <p className="footer-descriptor">{siteConfig.descriptor}</p>
          <p className="footer-tagline">{siteConfig.tagline}</p>
          <div className="footer-contact">
            <h3>Contact</h3>
            <address>{businessContact.address}</address>
            <a href={businessContact.phoneLink}>{businessContact.phone}</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/solutions">Solutions</Link></li>
            <li><Link href="/process">Process</Link></li>
            <li><Link href="/work">Work</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Connect</h3>
          <ul>
            <li><Link href="/contact">Book a Consultation</Link></li>
            <li><Link href="/faq">Frequently asked questions</Link></li>
            <li><Link href="/contact">Send an enquiry</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {currentYear} {siteConfig.name}. All rights reserved.</span>
        <span>We start with the business problem, not the technology.</span>
      </div>
    </footer>
  );
}
