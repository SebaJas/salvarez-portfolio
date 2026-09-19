import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Replaces the /apple-touch-icon.png that layout.jsx used to reference but that
// never existed in public/. Next injects the <link> tag for this automatically.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#38bdf8',
          fontSize: 96,
        }}
      >
        SA
      </div>
    ),
    size
  );
}
