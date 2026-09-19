import './globals.css';
import { LanguageProvider } from './LanguageProvider';

export const metadata = {
  metadataBase: new URL('https://salvarez-portfolio.vercel.app'),
  title: 'Sebastian Alvarez | Senior Software Engineer',
  description: 'Senior Software Engineer with 8+ years building production distributed systems in Go. Event-driven architecture (CQRS, DDD), multi-tenant SaaS, SSO / identity and GitOps delivery on Kubernetes.',
  keywords: ['Software Engineer', 'Go', 'Golang', 'Backend Developer', 'Distributed Systems', 'CQRS', 'DDD', 'Multi-tenant SaaS', 'Kubernetes', 'Argentina'],
  alternates: { canonical: '/' },
  authors: [{ name: 'Sebastian Alvarez' }],
  creator: 'Sebastian Alvarez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://salvarez-portfolio.vercel.app',
    title: 'Sebastian Alvarez | Senior Software Engineer',
    description: 'Senior Software Engineer with 8+ years building production distributed systems in Go. Event-driven architecture (CQRS, DDD), multi-tenant SaaS, SSO / identity and GitOps delivery on Kubernetes.',
    siteName: 'Sebastian Alvarez Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Alvarez | Senior Software Engineer',
    description: 'Senior Software Engineer with 8+ years building production distributed systems in Go. Event-driven architecture (CQRS, DDD), multi-tenant SaaS, SSO / identity and GitOps delivery on Kubernetes.',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Ownership proof for Google Search Console (URL-prefix property). Public by
  // design: it ships in the HTML of every page. Removing it un-verifies the site.
  verification: {
    google: 'BG-9Qr9AUFM18L9z_zBQEIT2xRgbJJC7lZaZ4sav1Q0',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
