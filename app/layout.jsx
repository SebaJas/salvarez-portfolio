import './globals.css';

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
