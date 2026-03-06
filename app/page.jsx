'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    experience: 'Experience',
    projects: 'Projects',
    contact: 'Contact',
    
    // Hero
    role: 'Senior Software Engineer',
    heroTitle1: 'Building',
    heroTitle2: 'Production Systems',
    heroTitle3: 'at scale.',
    heroDescription: '8+ years of experience in <strong>Go</strong> and distributed architectures. Specialized in <strong>CQRS</strong>, <strong>DDD</strong>, and event-driven design. Based in Argentina, working remotely with US companies since 2019.',
    location: 'Merlo, San Luis, Argentina',
    
    // Technical Expertise
    technicalExpertise: 'Technical Expertise',
    languages: 'Languages',
    architecture: 'Architecture',
    backend: 'Backend',
    databases: 'Databases',
    cloudInfra: 'Cloud & Infrastructure',
    frontend: 'Frontend',
    eventDrivenArch: 'Event-Driven Architecture',
    client: 'Client',
    apiGateway: 'API Gateway',
    messageBroker: 'Message Broker',
    command: 'Command',
    writeService: 'Write Service',
    query: 'Query',
    readService: 'Read Service',
    dataStore: 'Data Store',
    
    // Experience
    experienceTitle: 'Experience',
    present: 'Present',
    years: 'years',
    remote: 'Remote',
    
    // Cognativ
    cognativRole: 'Senior Software Engineer',
    cognativCompany: 'Cognativ Inc.',
    cognativLocation: 'Remote (USA)',
    cognativDesc1: 'Designed real-time video analytics rule validation engine in Go, processing high-throughput IoT events with configurable thresholds and AI-powered predictions',
    cognativDesc2: 'Integrated system with AWS IoT Core for device communication and Kafka for event streaming',
    cognativDesc3: 'Implemented motion detection algorithms with bounding box tracking and configurable alert rules',
    cognativDesc4: 'Developed backend applications using NestJS + DrizzleORM, following CQRS and DDD patterns',
    cognativDesc5: 'Led technical architectural design for new projects, ensuring scalability and maintainability',
    
    // 2U
    twouRole: 'Full Stack Developer',
    twouCompany: '2U (via EPWERY)',
    twouLocation: 'Remote (USA)',
    twouDesc1: 'Developed and maintained production Go services handling REST API traffic for web and mobile applications',
    twouDesc2: 'Built real-time data synchronization using PostgreSQL and Firebase, improving data consistency',
    twouDesc3: 'Designed and implemented RESTful web services with comprehensive API documentation and versioning',
    twouDesc4: 'Established CI/CD pipelines using Buildkite, Jenkins, and GitHub Actions',
    twouDesc5: 'Participated in code reviews and mentored team members on Go best practices',
    
    // Aluar
    aluarRole: 'Systems Analyst',
    aluarCompany: 'Aluar',
    aluarLocation: 'Puerto Madryn, Argentina',
    aluarDesc1: 'Developed internal solutions for enterprise management systems',
    aluarDesc2: 'Created and optimized database queries and stored procedures for reporting',
    aluarDesc3: 'Built forms and workflows for business process automation',
    
    // Fabri
    fabriRole: 'Full Stack Developer',
    fabriCompany: 'Fabri S.A.',
    fabriLocation: 'Puerto Madryn, Argentina',
    fabriDesc1: 'Built complete purchase order management system from scratch: backend, frontend, and database',
    fabriDesc2: 'Developed fleet management application handling vehicle maintenance schedules and inventory',
    fabriDesc3: 'Delivered full-stack solutions independently, from requirements gathering to production deployment',
    
    // Featured Project
    featuredProject: 'Featured Project',
    vinilhubSubtitle: "Argentina's first specialized vinyl marketplace",
    vinilhubDescription: 'Complete marketplace connecting record stores, collectors, and buyers with specialized features including vinyl grading systems (Mint, Near Mint, VG+), Discogs catalog integration, and store storefronts.',
    architectureTitle: 'Architecture',
    featuresTitle: 'Features',
    subscriptions: '4-tier subscriptions',
    paymentProviders: '3 payment providers',
    
    // Key Achievements
    keyAchievements: 'Key Achievements',
    achievement1Title: 'Real-Time Analytics Engine',
    achievement1Desc: 'Architected a video analytics engine in Go processing IoT events with sub-100ms latency, integrated with AWS IoT Core and Kafka',
    achievement2Title: 'E-Commerce Platform',
    achievement2Desc: "Built Argentina's first vinyl marketplace with multiple payment providers and comprehensive subscription billing",
    achievement3Title: 'Subscription Billing System',
    achievement3Desc: 'Designed billing handling 4 plan tiers with trials, proration, grace periods, and webhook processing',
    achievement4Title: 'CI/CD Infrastructure',
    achievement4Desc: 'Established pipelines with Buildkite, Jenkins, and GitHub Actions across multiple production projects',
    
    // Education
    education: 'Education',
    degree: 'Informatic Systems Engineering',
    university: 'La Plata Catholic University (UCALP)',
    universityLocation: 'Buenos Aires, Argentina',
    
    // Footer
    letsConnect: "Let's connect",
    openTo: 'Open to opportunities and interesting conversations.',
    languagesSpoken: 'English · Spanish (Native)',
  },
  es: {
    // Navigation
    experience: 'Experiencia',
    projects: 'Proyectos',
    contact: 'Contacto',
    
    // Hero
    role: 'Ingeniero de Software Senior',
    heroTitle1: 'Construyendo',
    heroTitle2: 'Sistemas Productivos',
    heroTitle3: 'a escala.',
    heroDescription: '+8 años de experiencia en <strong>Go</strong> y arquitecturas distribuidas. Especializado en <strong>CQRS</strong>, <strong>DDD</strong>, y diseño orientado a eventos. Basado en Argentina, trabajando remotamente con empresas de EE.UU. desde 2019.',
    location: 'Merlo, San Luis, Argentina',
    
    // Technical Expertise
    technicalExpertise: 'Experiencia Técnica',
    languages: 'Lenguajes',
    architecture: 'Arquitectura',
    backend: 'Backend',
    databases: 'Bases de Datos',
    cloudInfra: 'Cloud e Infraestructura',
    frontend: 'Frontend',
    eventDrivenArch: 'Arquitectura Orientada a Eventos',
    client: 'Cliente',
    apiGateway: 'API Gateway',
    messageBroker: 'Message Broker',
    command: 'Comando',
    writeService: 'Servicio de Escritura',
    query: 'Consulta',
    readService: 'Servicio de Lectura',
    dataStore: 'Base de Datos',
    
    // Experience
    experienceTitle: 'Experiencia',
    present: 'Presente',
    years: 'años',
    remote: 'Remoto',
    
    // Cognativ
    cognativRole: 'Ingeniero de Software Senior',
    cognativCompany: 'Cognativ Inc.',
    cognativLocation: 'Remoto (EE.UU.)',
    cognativDesc1: 'Diseñé motor de validación de reglas de video analytics en tiempo real en Go, procesando eventos IoT de alto rendimiento con umbrales configurables y predicciones con IA',
    cognativDesc2: 'Integré el sistema con AWS IoT Core para comunicación de dispositivos y Kafka para streaming de eventos',
    cognativDesc3: 'Implementé algoritmos de detección de movimiento con seguimiento de bounding box y reglas de alerta configurables',
    cognativDesc4: 'Desarrollé aplicaciones backend usando NestJS + DrizzleORM, siguiendo patrones CQRS y DDD',
    cognativDesc5: 'Lideré el diseño arquitectónico técnico para nuevos proyectos, asegurando escalabilidad y mantenibilidad',
    
    // 2U
    twouRole: 'Desarrollador Full Stack',
    twouCompany: '2U (vía EPWERY)',
    twouLocation: 'Remoto (EE.UU.)',
    twouDesc1: 'Desarrollé y mantuve servicios en producción en Go manejando tráfico REST API para aplicaciones web y móviles',
    twouDesc2: 'Construí sincronización de datos en tiempo real usando PostgreSQL y Firebase, mejorando la consistencia de datos',
    twouDesc3: 'Diseñé e implementé servicios web RESTful con documentación de API completa y versionado',
    twouDesc4: 'Establecí pipelines de CI/CD usando Buildkite, Jenkins y GitHub Actions',
    twouDesc5: 'Participé en revisiones de código y mentoré a miembros del equipo en mejores prácticas de Go',
    
    // Aluar
    aluarRole: 'Analista de Sistemas',
    aluarCompany: 'Aluar',
    aluarLocation: 'Puerto Madryn, Argentina',
    aluarDesc1: 'Desarrollé soluciones internas para sistemas de gestión empresarial',
    aluarDesc2: 'Creé y optimicé consultas de base de datos y procedimientos almacenados para reportes',
    aluarDesc3: 'Construí formularios y flujos de trabajo para automatización de procesos de negocio',
    
    // Fabri
    fabriRole: 'Desarrollador Full Stack',
    fabriCompany: 'Fabri S.A.',
    fabriLocation: 'Puerto Madryn, Argentina',
    fabriDesc1: 'Construí sistema completo de gestión de órdenes de compra desde cero: backend, frontend y base de datos',
    fabriDesc2: 'Desarrollé aplicación de gestión de flota manejando programas de mantenimiento de vehículos e inventario',
    fabriDesc3: 'Entregué soluciones full-stack de manera independiente, desde relevamiento de requerimientos hasta despliegue en producción',
    
    // Featured Project
    featuredProject: 'Proyecto Destacado',
    vinilhubSubtitle: 'El primer marketplace de vinilos especializado de Argentina',
    vinilhubDescription: 'Marketplace completo conectando tiendas de discos, coleccionistas y compradores con características especializadas incluyendo sistemas de clasificación de vinilos (Mint, Near Mint, VG+), integración con catálogo de Discogs, y vitrinas de tiendas.',
    architectureTitle: 'Arquitectura',
    featuresTitle: 'Características',
    subscriptions: 'Suscripciones de 4 niveles',
    paymentProviders: '3 proveedores de pago',
    
    // Key Achievements
    keyAchievements: 'Logros Clave',
    achievement1Title: 'Motor de Analytics en Tiempo Real',
    achievement1Desc: 'Arquitecté un motor de video analytics en Go procesando eventos IoT con latencia sub-100ms, integrado con AWS IoT Core y Kafka',
    achievement2Title: 'Plataforma E-Commerce',
    achievement2Desc: 'Construí el primer marketplace de vinilos de Argentina con múltiples proveedores de pago y facturación de suscripciones completa',
    achievement3Title: 'Sistema de Facturación de Suscripciones',
    achievement3Desc: 'Diseñé facturación manejando 4 niveles de planes con trials, prorrateo, períodos de gracia, y procesamiento de webhooks',
    achievement4Title: 'Infraestructura CI/CD',
    achievement4Desc: 'Establecí pipelines con Buildkite, Jenkins y GitHub Actions en múltiples proyectos en producción',
    
    // Education
    education: 'Educación',
    degree: 'Ingeniería en Sistemas Informáticos',
    university: 'Universidad Católica de La Plata (UCALP)',
    universityLocation: 'Buenos Aires, Argentina',
    
    // Footer
    letsConnect: 'Conectemos',
    openTo: 'Abierto a oportunidades y conversaciones interesantes.',
    languagesSpoken: 'Inglés · Español (Nativo)',
  }
};

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-base font-semibold tracking-wide text-white">Sebastian Alvarez</span>
          <div className="flex items-center gap-6">
            <a href="#experience" className="text-sm text-slate-300 hover:text-white transition-colors">{t.experience}</a>
            <a href="#projects" className="text-sm text-slate-300 hover:text-white transition-colors">{t.projects}</a>
            <a href="mailto:alvarez.sebastian605@gmail.com" className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium">{t.contact}</a>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-1 ml-4 bg-slate-700 rounded-full p-1">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  lang === 'en'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  lang === 'es'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Light with Code Block */}
      <section className={`pt-40 pb-24 px-8 bg-slate-50 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
            <div>
              <p className="text-sm text-sky-600 tracking-widest uppercase mb-4 font-medium">{t.role}</p>
              <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8 tracking-tight">
                {t.heroTitle1}<br />
                <span className="text-slate-900">{t.heroTitle2}</span><br />
                <span className="text-slate-400">{t.heroTitle3}</span>
              </h1>
              <p 
                className="text-lg text-slate-600 max-w-xl leading-relaxed mb-12"
                dangerouslySetInnerHTML={{ __html: t.heroDescription.replaceAll('<strong>', '<span class="text-slate-800 font-medium">').replaceAll('</strong>', '</span>') }}
              />
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
                <span className="text-slate-500">{t.location}</span>
              </div>
            </div>
            
            {/* Code Block - Desktop Only */}
            <div className="hidden lg:block">
              <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-slate-500 text-xs font-mono">event_processor.go</span>
                </div>
                <pre className="text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
<span className="text-slate-500">{/* Real-time event processing */}</span>{'\n'}
<span className="text-sky-400">func</span> <span className="text-emerald-400">ProcessEvent</span>(ctx context.Context) {'{'}{'\n'}
{'  '}event := <span className="text-sky-400">kafka.Consume</span>(ctx){'\n'}
{'\n'}
{'  '}<span className="text-sky-400">if</span> event.Latency {'<'} <span className="text-amber-400">100</span>*time.Millisecond {'{'}{'\n'}
{'    '}<span className="text-emerald-400">TriggerAlert</span>(event){'\n'}
{'  '}{'}'}{'\n'}
{'\n'}
{'  '}<span className="text-emerald-400">iot.Publish</span>(event){'\n'}
{'}'}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise - Dark with Architecture Diagram */}
      <section className={`py-24 px-8 bg-slate-900 text-white transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">{t.technicalExpertise}</p>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Architecture Diagram - Left */}
            <div className="hidden lg:block order-1">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-xs text-sky-400 uppercase tracking-wider mb-4 font-medium text-center">{t.eventDrivenArch}</p>
                
                {/* Diagram - Compact */}
                <div className="space-y-2">
                  {/* Top Row: Client -> API Gateway -> Broker */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-center">
                      <p className="text-xs text-slate-400">{t.client}</p>
                      <p className="text-xs text-slate-200 font-medium">Next.js</p>
                    </div>
                    <span className="text-sky-400">→</span>
                    <div className="bg-sky-900/50 px-3 py-2 rounded-lg border border-sky-700 text-center">
                      <p className="text-xs text-sky-400">{t.apiGateway}</p>
                      <p className="text-xs text-slate-200 font-medium">Go / Fiber</p>
                    </div>
                    <span className="text-sky-400">→</span>
                    <div className="bg-emerald-900/50 px-3 py-2 rounded-lg border border-emerald-700 text-center">
                      <p className="text-xs text-emerald-400">{t.messageBroker}</p>
                      <p className="text-xs text-slate-200 font-medium">Kafka</p>
                    </div>
                  </div>
                  
                  {/* Arrow down */}
                  <div className="flex justify-center">
                    <div className="text-sky-400 text-lg">↓</div>
                  </div>
                  
                  {/* Bottom Row: Command / Query Services + DB */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-center">
                      <p className="text-xs text-slate-400">{t.command}</p>
                      <p className="text-xs text-slate-200 font-medium">{t.writeService}</p>
                    </div>
                    <div className="bg-slate-700 px-3 py-2 rounded-lg border border-slate-600 text-center">
                      <p className="text-xs text-slate-400">{t.query}</p>
                      <p className="text-xs text-slate-200 font-medium">{t.readService}</p>
                    </div>
                    <span className="text-sky-400">→</span>
                    <div className="bg-amber-900/50 px-3 py-2 rounded-lg border border-amber-700 text-center">
                      <p className="text-xs text-amber-400">{t.dataStore}</p>
                      <p className="text-xs text-slate-200 font-medium">PostgreSQL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Grid - Right */}
            <div className="order-2">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.languages}</h3>
                  <p className="text-slate-300">Go (primary), TypeScript, Python, PHP, SQL</p>
                </div>
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.architecture}</h3>
                  <p className="text-slate-300">CQRS, DDD, Hexagonal, Microservices, Event-Driven</p>
                </div>
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.backend}</h3>
                  <p className="text-slate-300">Fiber, NestJS, Django, Laravel, Node.js</p>
                </div>
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.databases}</h3>
                  <p className="text-slate-300">PostgreSQL, MySQL, DynamoDB, Redis, Snowflake</p>
                </div>
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.cloudInfra}</h3>
                  <p className="text-slate-300">AWS (S3, Lambda, IoT Core, EC2, SNS, SQS), Docker, Kubernetes, Kafka</p>
                </div>
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t.frontend}</h3>
                  <p className="text-slate-300">React, Next.js, Tailwind CSS, Zustand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience - Light */}
      <section id="experience" className={`py-24 bg-slate-50 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-8 mb-12">
          <p className="text-sm text-sky-600 tracking-widest uppercase font-medium">{t.experienceTitle}</p>
        </div>
          
        <div className="space-y-0">
          {/* Cognativ - Grey */}
          <div className="bg-slate-200/70">
            <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2025 — {t.present}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">{t.cognativRole}</h3>
                <p className="text-sky-700 mb-4">{t.cognativCompany} · {t.cognativLocation}</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>{t.cognativDesc1}</li>
                  <li>{t.cognativDesc2}</li>
                  <li>{t.cognativDesc3}</li>
                  <li>{t.cognativDesc4}</li>
                  <li>{t.cognativDesc5}</li>
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
          </div>

          {/* 2U - White */}
          <div className="bg-slate-50">
            <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2019 — 2025</p>
                <p className="text-xs text-slate-500">5+ {t.years}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">{t.twouRole}</h3>
                <p className="text-sky-700 mb-4">{t.twouCompany} · {t.twouLocation}</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>{t.twouDesc1}</li>
                  <li>{t.twouDesc2}</li>
                  <li>{t.twouDesc3}</li>
                  <li>{t.twouDesc4}</li>
                  <li>{t.twouDesc5}</li>
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
          </div>

          {/* Aluar - Grey */}
          <div className="bg-slate-200/70">
            <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2019</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">{t.aluarRole}</h3>
                <p className="text-sky-700 mb-4">{t.aluarCompany} · {t.aluarLocation}</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>{t.aluarDesc1}</li>
                  <li>{t.aluarDesc2}</li>
                  <li>{t.aluarDesc3}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fabri S.A. - White */}
          <div className="bg-slate-50">
            <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div>
                <p className="text-sm text-slate-600 font-medium">2016 — 2019</p>
                <p className="text-xs text-slate-500">3 {t.years}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">{t.fabriRole}</h3>
                <p className="text-sky-700 mb-4">{t.fabriCompany} · {t.fabriLocation}</p>
                <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                  <li>{t.fabriDesc1}</li>
                  <li>{t.fabriDesc2}</li>
                  <li>{t.fabriDesc3}</li>
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

      {/* Featured Project - Dark with Code Snippet */}
      <section id="projects" className={`py-24 px-8 bg-slate-900 text-white transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">{t.featuredProject}</p>
          
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <h3 className="text-2xl font-medium mb-2">VinilHub</h3>
              <p className="text-slate-400 mb-6">{t.vinilhubSubtitle}</p>
              
              <p className="text-slate-300 leading-relaxed mb-8">
                {t.vinilhubDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                  <h4 className="text-xs text-sky-400 uppercase tracking-wider mb-3 font-medium">{t.architectureTitle}</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>Next.js 15 + Turborepo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>NestJS + TypeORM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>JWT + Token Rotation</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                  <h4 className="text-xs text-sky-400 uppercase tracking-wider mb-3 font-medium">{t.featuresTitle}</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>{t.subscriptions}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>{t.paymentProviders}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">→</span>
                      <span>RSC + ISR</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Strategy Pattern Code Block */}
            <div className="hidden lg:block">
              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-slate-500 text-xs font-mono">payment_strategy.ts</span>
                </div>
                <pre className="text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
<span className="text-slate-500">{/* Strategy Pattern */}</span>{'\n'}
<span className="text-sky-400">interface</span> <span className="text-emerald-400">PaymentProvider</span> {'{'}{'\n'}
{'  '}<span className="text-amber-400">charge</span>(amount): Promise{'\n'}
{'  '}<span className="text-amber-400">refund</span>(txId): Promise{'\n'}
{'}'}{'\n'}
{'\n'}
<span className="text-sky-400">class</span> <span className="text-emerald-400">MercadoPago</span> {'{'}{'\n'}
{'  '}<span className="text-sky-400">async</span> <span className="text-amber-400">charge</span>(amount) {'{'}{'\n'}
{'    '}<span className="text-sky-400">return this</span>.api.pay(amount){'\n'}
{'  '}{'}'}{'\n'}
{'}'}{'\n'}
{'\n'}
<span className="text-sky-400">class</span> <span className="text-emerald-400">PaymentService</span> {'{'}{'\n'}
{'  '}<span className="text-sky-400">async</span> <span className="text-amber-400">process</span>(order) {'{'}{'\n'}
{'    '}<span className="text-sky-400">return this</span>.provider{'\n'}
{'      '}.charge(order.total){'\n'}
{'  '}{'}'}{'\n'}
{'}'}</pre>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {['Next.js 15', 'React 19', 'NestJS', 'TypeORM', 'PostgreSQL', 'Tailwind', 'AWS S3', 'Vercel'].map((tech) => (
              <span key={tech} className="text-xs text-sky-300 bg-sky-900/50 border border-sky-800 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Key Achievements - Light */}
      <section className={`py-24 px-8 bg-slate-50 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-sky-600 tracking-widest uppercase mb-12 font-medium">{t.keyAchievements}</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">{t.achievement1Title}</h3>
              <p className="text-sm text-slate-600">{t.achievement1Desc}</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">{t.achievement2Title}</h3>
              <p className="text-sm text-slate-600">{t.achievement2Desc}</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">{t.achievement3Title}</h3>
              <p className="text-sm text-slate-600">{t.achievement3Desc}</p>
            </div>
            <div className="border-l-2 border-sky-500 pl-6">
              <h3 className="font-medium mb-2 text-slate-900">{t.achievement4Title}</h3>
              <p className="text-sm text-slate-600">{t.achievement4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education - Dark */}
      <section className={`py-24 px-8 bg-slate-900 text-white transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-sky-400 tracking-widest uppercase mb-12 font-medium">{t.education}</p>
          
          <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
            <div>
              <p className="text-sm text-slate-400">2008 — 2015</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-1">{t.degree}</h3>
              <p className="text-sky-400">{t.university}</p>
              <p className="text-sm text-slate-400">{t.universityLocation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Light */}
      <footer className="py-16 px-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-slate-900">{t.letsConnect}</h3>
              <p className="text-sm text-slate-500">{t.openTo}</p>
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
              <span>{t.languagesSpoken}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}