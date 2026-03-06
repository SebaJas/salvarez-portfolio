'use client';

import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const skills = {
    'Languages': ['Go (primary)', 'TypeScript', 'Python', 'PHP', 'SQL'],
    'Backend': ['NestJS', 'Fiber (Go)', 'Django', 'Laravel', 'Node.js'],
    'Databases': ['PostgreSQL', 'MySQL', 'DynamoDB', 'Snowflake', 'Redis'],
    'Cloud & Infra': ['AWS', 'Docker', 'Kubernetes', 'Kafka'],
    'Frontend': ['React', 'Next.js', 'Tailwind CSS', 'Zustand'],
    'Architecture': ['CQRS', 'DDD', 'Hexagonal', 'Microservices']
  };

  const experience = [
    {
      title: 'Senior Software Engineer',
      company: 'Cognativ Inc.',
      location: 'Doylestown, PA, USA (Remote)',
      period: 'April 2025 – Present',
      tech: ['Go', 'Fiber', 'NestJS', 'PostgreSQL', 'AWS IoT Core', 'Kafka', 'Docker'],
      highlights: [
        'Designed real-time video analytics rule validation engine in Go processing high-throughput IoT events',
        'Integrated system with AWS IoT Core for device communication and Kafka for event streaming',
        'Implemented motion detection algorithms with bounding box tracking and configurable alert rules',
        'Led technical architectural design for new projects ensuring scalability and maintainability'
      ]
    },
    {
      title: 'Full Stack Developer',
      company: '2U (via EPWERY)',
      location: 'Lanham, MD, USA (Remote)',
      period: 'November 2019 – March 2025',
      duration: '5+ years',
      tech: ['Go', 'Python', 'Django', 'PostgreSQL', 'React.js', 'Firebase', 'Docker'],
      highlights: [
        'Developed production Go services handling REST API traffic for web and mobile applications',
        'Built real-time data synchronization using PostgreSQL and Firebase',
        'Established CI/CD pipelines using Buildkite, Jenkins, and GitHub Actions',
        'Mentored team members on Go best practices and conducted code reviews'
      ]
    },
    {
      title: 'Systems Analyst',
      company: 'Aluar',
      location: 'Puerto Madryn, Argentina',
      period: 'February 2019 – May 2019',
      tech: ['Enterprise Systems', 'Database Design', 'JasperReports'],
      highlights: [
        'Developed internal solutions for enterprise management systems',
        'Created and optimized database queries and stored procedures for reporting'
      ]
    },
    {
      title: 'Full Stack Developer',
      company: 'Fabri S.A.',
      location: 'Puerto Madryn, Argentina',
      period: 'February 2016 – February 2019',
      duration: '3 years',
      tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript'],
      highlights: [
        'Built complete purchase order management system from scratch',
        'Developed fleet management application handling vehicle maintenance and inventory',
        'Delivered full-stack solutions independently from requirements to production'
      ]
    }
  ];

  const achievements = [
    {
      icon: '⚡',
      title: 'Real-Time Analytics Engine',
      description: 'Architected a video analytics engine in Go processing IoT events with sub-100ms latency, integrated with AWS IoT Core and Kafka'
    },
    {
      icon: '🛒',
      title: 'VinilHub Marketplace',
      description: "Built Argentina's first vinyl marketplace — complete e-commerce platform with multiple payment providers (MercadoPago, Rebill, PayPal)"
    },
    {
      icon: '💳',
      title: 'Subscription Billing System',
      description: 'Designed billing system handling 4 plan tiers with trials, proration, grace periods, and webhook processing'
    },
    {
      icon: '🚀',
      title: 'CI/CD Excellence',
      description: 'Established CI/CD pipelines with Buildkite, Jenkins, and GitHub Actions across multiple production projects'
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-zinc-900 text-lg shadow-lg shadow-emerald-500/20">
                SA
              </div>
              <span className="font-semibold text-lg tracking-tight hidden sm:block">Sebastian Alvarez</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['about', 'skills', 'experience', 'projects'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === section
                      ? 'bg-zinc-800 text-emerald-400'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="mailto:alvarez.sebastian605@gmail.com"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
              >
                Contact
              </a>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-zinc-800 pt-4">
              <div className="flex flex-col gap-2">
                {['about', 'skills', 'experience', 'projects'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-left ${
                      activeSection === section
                        ? 'bg-zinc-800 text-emerald-400'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="about"
        className={`pt-32 pb-20 px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Available for opportunities
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Senior Software
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Engineer
                </span>
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg">
                8+ years building production systems at scale. Specialized in <span className="text-emerald-400 font-medium">Go</span> and distributed architectures using <span className="text-cyan-400 font-medium">CQRS</span>, <span className="text-cyan-400 font-medium">DDD</span>, and event-driven design.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium transition-all duration-300 border border-zinc-700 hover:border-zinc-600 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium transition-all duration-300 border border-zinc-700 hover:border-zinc-600 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-zinc-500 text-xs font-mono">analytics_engine.go</span>
                </div>
                <pre className="text-sm font-mono leading-relaxed">
                  <code>
                    <span className="text-zinc-500">// Real-time video analytics engine</span>{'\n'}
                    <span className="text-purple-400">package</span> <span className="text-zinc-100">main</span>{'\n\n'}
                    <span className="text-purple-400">func</span> <span className="text-cyan-400">ProcessEvent</span>(<span className="text-orange-400">ctx</span> context.Context) {'{'}
                    {'\n'}  event := <span className="text-cyan-400">kafka.Consume</span>(ctx)
                    {'\n'}  
                    {'\n'}  <span className="text-purple-400">if</span> event.Latency {'<'} <span className="text-emerald-400">100</span>*time.Millisecond {'{'}
                    {'\n'}    <span className="text-cyan-400">TriggerAlert</span>(event)
                    {'\n'}  {'}'}
                    {'\n'}
                    {'\n'}  <span className="text-cyan-400">iot.Publish</span>(event)
                    {'\n'}{'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full" />
            Key Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="group p-6 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section 
        id="skills"
        className={`py-20 px-6 bg-zinc-900/30 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full" />
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <div
                key={category}
                className="p-6 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-lg text-sm border border-zinc-700/50 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section 
        id="experience"
        className={`py-20 px-6 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full" />
            Professional Experience
          </h2>
          <div className="space-y-8">
            {experience.map((job, index) => (
              <div
                key={index}
                className="group relative pl-8 pb-8 border-l-2 border-zinc-800 last:border-l-transparent"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-zinc-900 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors duration-300" />
                <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 ml-4 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/5">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-cyan-400 font-medium">{job.company}</p>
                      <p className="text-zinc-500 text-sm">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                        {job.period}
                      </span>
                      {job.duration && (
                        <p className="text-zinc-500 text-sm mt-1">{job.duration}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-2">
                    {job.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="text-zinc-400 text-sm flex items-start gap-2">
                        <span className="text-emerald-500 mt-1 flex-shrink-0">▸</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VinilHub Project */}
      <section 
        id="projects"
        className={`py-20 px-6 bg-zinc-900/30 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full" />
            Featured Project
          </h2>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-500">
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                  🎵
                </div>
                <div>
                  <h3 className="text-2xl font-bold">VinilHub</h3>
                  <p className="text-zinc-400">Argentina's First Vinyl Marketplace</p>
                </div>
              </div>
              <p className="text-zinc-300 text-lg mb-8 max-w-3xl leading-relaxed">
                Complete marketplace connecting record stores, collectors, and buyers with specialized features including vinyl grading systems (Mint, Near Mint, VG+), Discogs catalog integration, and store storefronts.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <h4 className="font-semibold text-emerald-400 text-lg">Architecture Highlights</h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">▸</span>Next.js 15 monorepo with 3 apps sharing UI library via Turborepo</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">▸</span>NestJS backend with TypeORM, PostgreSQL, clean layered architecture</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">▸</span>JWT auth with HTTP-only cookies, refresh token rotation, RBAC</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">▸</span>3 payment providers using Strategy Pattern with webhooks</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-400 text-lg">Technical Features</h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-cyan-500 mt-1">▸</span>4-tier subscription system with trials, proration, grace periods</li>
                    <li className="flex items-start gap-2"><span className="text-cyan-500 mt-1">▸</span>React Server Components, ISR, connection pooling</li>
                    <li className="flex items-start gap-2"><span className="text-cyan-500 mt-1">▸</span>Dynamic metadata, JSON-LD structured data</li>
                    <li className="flex items-start gap-2"><span className="text-cyan-500 mt-1">▸</span>Programmatic sitemap for SEO optimization</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Next.js 15', 'React 19', 'NestJS', 'TypeORM', 'PostgreSQL', 'Tailwind CSS', 'Zustand', 'Zod', 'AWS S3', 'Vercel'].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm border border-zinc-700 hover:border-zinc-600 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Contact */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🎓</span>
                Education
              </h2>
              <div>
                <h3 className="text-xl font-semibold">Informatic Systems Engineering</h3>
                <p className="text-cyan-400 font-medium">La Plata Catholic University (UCALP)</p>
                <p className="text-zinc-500">Buenos Aires, Argentina • 2008 – 2015</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📬</span>
                Let's Connect
              </h2>
              <div className="space-y-4">
                <a href="mailto:alvarez.sebastian605@gmail.com" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors group">
                  <span className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors">✉️</span>
                  <span className="break-all">alvarez.sebastian605@gmail.com</span>
                </a>
                <a href="tel:+5492804206150" className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 transition-colors group">
                  <span className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors">📱</span>
                  +54 9 2804206150
                </a>
                <div className="flex items-center gap-3 text-zinc-400">
                  <span className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">📍</span>
                  Merlo, San Luis, Argentina
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <p className="text-zinc-400 text-sm">
                  <span className="text-emerald-400 font-medium">Languages:</span> English (Professional) • Spanish (Native)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Sebastian Alvarez. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
