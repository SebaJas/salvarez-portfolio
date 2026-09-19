import { ImageResponse } from 'next/og';
import { getAllPosts, getPost } from '@/lib/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Blog post by Sebastian Alvarez';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostOpenGraphImage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? 'Writing';

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
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#38bdf8' }}>
          WRITING
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 58 : 68,
            lineHeight: 1.2,
            color: '#f8fafc',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '2px solid #1e293b',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: '#cbd5e1' }}>Sebastian Alvarez</div>
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
