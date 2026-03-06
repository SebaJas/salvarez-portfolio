import './globals.css';

export const metadata = {
  title: 'Sebastian Alvarez | Senior Software Engineer',
  description: 'Senior Software Engineer with 8+ years building production systems at scale. Specialized in Go and distributed architectures using CQRS, DDD, and event-driven design.',
  keywords: ['Software Engineer', 'Go', 'Golang', 'Backend Developer', 'Distributed Systems', 'CQRS', 'DDD', 'Argentina'],
  authors: [{ name: 'Sebastian Alvarez' }],
  creator: 'Sebastian Alvarez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sebastianalvarez.dev',
    title: 'Sebastian Alvarez | Senior Software Engineer',
    description: 'Senior Software Engineer with 8+ years building production systems at scale. Specialized in Go and distributed architectures.',
    siteName: 'Sebastian Alvarez Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Alvarez | Senior Software Engineer',
    description: 'Senior Software Engineer with 8+ years building production systems at scale.',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
