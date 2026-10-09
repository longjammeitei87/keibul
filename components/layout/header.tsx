'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems } from '@/lib/site-data';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="brand-lockup"
          aria-label="KEIBUL Business & Technology Solutions home"
          onClick={() => setMenuOpen(false)}
        >
          <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <path d="M2 12h15v50H2z" fill="#0F2E2B" />
            <path d="M17 26 58 0v17L25 47l-8-4z" fill="#A7C89A" />
            <path d="m17 39 10-2 31 25H38z" fill="#0F2E2B" />
          </svg>
          <span className="brand-copy">
            <span className="brand-name">KEIBUL</span>
            <span className="brand-descriptor">Business &amp; Technology Solutions</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${isActive(item.href) ? ' is-active' : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
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
            <svg className="header-cta-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 8h9M8 3l5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
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
              className={`mobile-nav-link${isActive(item.href) ? ' is-active' : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
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
