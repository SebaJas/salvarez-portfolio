import { ImageResponse } from 'next/og';

export const alt = 'Sebastian Alvarez — Senior Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Rendered at build time by Satori, which only supports a flexbox subset of CSS:
// every container needs an explicit display/flexDirection.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 6,
              color: '#38bdf8',
              marginBottom: 20,
            }}
          >
            SENIOR SOFTWARE ENGINEER
          </div>
          <div style={{ display: 'flex', fontSize: 92, color: '#f8fafc' }}>
            Sebastian Alvarez
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 34, color: '#cbd5e1' }}>
            Go · CQRS · DDD · Event-Driven
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#cbd5e1', marginTop: 10 }}>
            Multi-tenant SaaS · SSO / Identity · Kubernetes
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '2px solid #1e293b',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: '#64748b' }}>
            8+ years building production systems at scale
          </div>
          <div style={{ display: 'flex', flexGrow: 1 }} />
          <div style={{ display: 'flex', fontSize: 26, color: '#38bdf8' }}>
            salvarez-portfolio.vercel.app
          </div>
        </div>
      </div>
    ),
    size
  );
}
