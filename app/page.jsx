'use client';

import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-sm font-medium tracking-wide">Sebastian Alvarez</span>
          <div className="flex items-center gap-8">
            <a href="#experience" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Experience</a>
            <a href="#projects" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Projects</a>
            <a href="mailto:alvarez.sebastian605@gmail.com" className="text-sm text-slate-900 hover:text-sky-700 transition-colors font-medium">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero - Light */}
      <section className={`pt-40 pb-24 px-6 bg-slate-50 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-600 tracking-widest uppercase mb-4 font-medium">Senior Software Engineer</p>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8 tracking-tight">
            Building production systems<br />
            <span className="text-slate-400">at scale.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-12">
            8+ years of experience in <span className="text-slate-800 font-medium">Go</span> and distributed architectures. Specialized in <span className="text-slate-800 font-medium">CQRS</span>, <span className="text-slate-800 font-medium">DDD</span>, and event-driven design. Based in Argentina, working remotely with US companies since 2019.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://github.com/SebaJas" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 group">
              <svg className="w-5 h-5 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/sebaalvarez87/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-sky-700 transition-colors flex items-center gap-2 group">
              <svg className="w-5 h-5 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Merlo, San Luis, Argentina</span>
          </div>
        </div>
      </section>

      {/* Technical Expertise - Dark */}
      <section className={`py-24 px-6 bg-slate-900 text-white transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">Technical Expertise</p>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Languages</h3>
              <p className="text-slate-300">Go (primary), TypeScript, Python, PHP, SQL</p>
            </div>
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Architecture</h3>
              <p className="text-slate-300">CQRS, DDD, Hexagonal, Microservices, Event-Driven</p>
            </div>
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Backend</h3>
              <p className="text-slate-300">Fiber, NestJS, Django, Laravel, Node.js</p>
            </div>
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Databases</h3>
              <p className="text-slate-300">PostgreSQL, MySQL, DynamoDB, Redis, Snowflake</p>
            </div>
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Cloud & Infrastructure</h3>
              <p className="text-slate-300">AWS (S3, Lambda, IoT Core, EC2, SNS, SQS), Docker, Kubernetes, Kafka</p>
            </div>
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Frontend</h3>
              <p className="text-slate-300">React, Next.js, Tailwind CSS, Zustand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience - Light */}
      <section id="experience" className={`py-24 px-6 bg-slate-50 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-600 tracking-widest uppercase mb-12 font-medium">Experience</p>
          
          <div className="space-y-16">
            {/* Cognativ */}
            <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2025 — Present</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Senior Software Engineer</h3>
                <p className="text-sky-700 mb-4">Cognativ Inc. · Remote (USA)</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>Designed real-time video analytics rule validation engine in Go, processing high-throughput IoT events with configurable thresholds and AI-powered predictions</li>
                  <li>Integrated system with AWS IoT Core for device communication and Kafka for event streaming</li>
                  <li>Implemented motion detection algorithms with bounding box tracking and configurable alert rules</li>
                  <li>Developed backend applications using NestJS + DrizzleORM, following CQRS and DDD patterns</li>
                  <li>Led technical architectural design for new projects, ensuring scalability and maintainability</li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Go', 'Fiber', 'NestJS', 'PostgreSQL', 'AWS IoT Core', 'Kafka', 'Docker'].map((tech) => (
                    <span key={tech} className="text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2U */}
            <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2019 — 2025</p>
                <p className="text-xs text-slate-500">5+ years</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Full Stack Developer</h3>
                <p className="text-sky-700 mb-4">2U (via EPWERY) · Remote (USA)</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>Developed and maintained production Go services handling REST API traffic for web and mobile applications</li>
                  <li>Built real-time data synchronization using PostgreSQL and Firebase, improving data consistency</li>
                  <li>Designed and implemented RESTful web services with comprehensive API documentation and versioning</li>
                  <li>Established CI/CD pipelines using Buildkite, Jenkins, and GitHub Actions</li>
                  <li>Participated in code reviews and mentored team members on Go best practices</li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Go', 'Python', 'Django', 'PostgreSQL', 'React.js', 'Firebase', 'Docker'].map((tech) => (
                    <span key={tech} className="text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Aluar */}
            <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2019</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Systems Analyst</h3>
                <p className="text-sky-700 mb-4">Aluar · Puerto Madryn, Argentina</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>Developed internal solutions for enterprise management systems</li>
                  <li>Created and optimized database queries and stored procedures for reporting</li>
                  <li>Built forms and workflows for business process automation</li>
                </ul>
              </div>
            </div>

            {/* Fabri S.A. */}
            <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2016 — 2019</p>
                <p className="text-xs text-slate-500">3 years</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Full Stack Developer</h3>
                <p className="text-sky-700 mb-4">Fabri S.A. · Puerto Madryn, Argentina</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>Built complete purchase order management system from scratch: backend, frontend, and database</li>
                  <li>Developed fleet management application handling vehicle maintenance schedules and inventory</li>
                  <li>Delivered full-stack solutions independently, from requirements gathering to production deployment</li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['PHP', 'Laravel', 'MySQL', 'JavaScript'].map((tech) => (
                    <span key={tech} className="text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project - Dark */}
      <section id="projects" className={`py-24 px-6 bg-slate-900 text-white transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">Featured Project</p>
          
          <div>
            <h3 className="text-2xl font-medium mb-2">VinilHub</h3>
            <p className="text-slate-400 mb-6">Argentina's first specialized vinyl marketplace</p>
            
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Complete marketplace connecting record stores, collectors, and buyers with specialized features including vinyl grading systems (Mint, Near Mint, VG+), Discogs catalog integration, and store storefronts.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="text-xs text-sky-400 uppercase tracking-wider mb-4 font-medium">Architecture</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>Next.js 15 monorepo with Turborepo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>NestJS backend with TypeORM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>JWT auth with refresh token rotation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>Strategy Pattern for payment providers</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="text-xs text-sky-400 uppercase tracking-wider mb-4 font-medium">Features</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>4-tier subscription system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>3 payment providers (MercadoPago, Rebill, PayPal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>React Server Components + ISR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">→</span>
                    <span>SEO with JSON-LD structured data</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Next.js 15', 'React 19', 'NestJS', 'TypeORM', 'PostgreSQL', 'Tailwind CSS', 'AWS S3', 'Vercel'].map((tech) => (
                <span key={tech} className="text-xs text-sky-300 bg-sky-900/50 border border-sky-800 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements - Light */}
      <section className={`py-24 px-6 bg-slate-50 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-600 tracking-widest uppercase mb-12 font-medium">Key Achievements</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">Real-Time Analytics Engine</h3>
              <p className="text-sm text-slate-600">Architected a video analytics engine in Go processing IoT events with sub-100ms latency, integrated with AWS IoT Core and Kafka</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">E-Commerce Platform</h3>
              <p className="text-sm text-slate-600">Built Argentina's first vinyl marketplace with multiple payment providers and comprehensive subscription billing</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">Subscription Billing System</h3>
              <p className="text-sm text-slate-600">Designed billing handling 4 plan tiers with trials, proration, grace periods, and webhook processing</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">CI/CD Infrastructure</h3>
              <p className="text-sm text-slate-600">Established pipelines with Buildkite, Jenkins, and GitHub Actions across multiple production projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education - Dark */}
      <section className={`py-24 px-6 bg-slate-900 text-white transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">Education</p>
          
          <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
            <div>
              <p className="text-sm text-slate-400">2008 — 2015</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-1">Informatic Systems Engineering</h3>
              <p className="text-sky-400">La Plata Catholic University (UCALP)</p>
              <p className="text-sm text-slate-400">Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Light */}
      <footer className="py-16 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-slate-900">Let's connect</h3>
              <p className="text-sm text-slate-500">Open to opportunities and interesting conversations.</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:alvarez.sebastian605@gmail.com" className="text-slate-700 hover:text-sky-700 transition-colors">
                alvarez.sebastian605@gmail.com
              </a>
              <a href="tel:+5492804206150" className="text-slate-500 hover:text-sky-700 transition-colors">
                +54 9 2804206150
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Sebastian Alvarez</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/SebaJas" target="_blank" rel="noopener noreferrer" className="hover:text-sky-700 transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/sebaalvarez87/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-700 transition-colors">LinkedIn</a>
              <span>English · Spanish (Native)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
