'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems } from '@/lib/site-data';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="KEIBUL home" onClick={() => setMenuOpen(false)}>
          <span className="brand-name">KEIBUL</span>
          <span className="brand-descriptor">Business &amp; Technology Solutions</span>
        </Link>

        <nav aria-label="Main navigation" className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            href="/contact"
            className="button-primary header-consultation"
            aria-label="Book a Consultation"
            onClick={() => setMenuOpen(false)}
          >
            <span className="header-cta-full">Book a Consultation</span>
            <span className="header-cta-short" aria-hidden="true">Consult</span>
          </Link>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`mobile-nav-wrap${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
        <nav aria-label="Mobile navigation" className="mobile-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/contact" className="button-primary mobile-nav-cta" onClick={() => setMenuOpen(false)}>
            Book a Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
