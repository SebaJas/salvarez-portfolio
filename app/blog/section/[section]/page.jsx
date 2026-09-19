import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSections, getSectionPosts } from '@/lib/posts';
import { SECTIONS } from '@/lib/sections';
import PostCard from '../../PostCard';

// Lives under /blog/section/<slug> rather than /blog/<slug> because that one is
// already taken by the posts themselves.
export function generateStaticParams() {
  return getSections().map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }) {
  const { section: slug } = await params;
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) return {};

  return {
    title: `${section.title} | Sebastian Alvarez`,
    description: `Posts in the ${section.label} section: ${section.title}.`,
    alternates: { canonical: `/blog/section/${section.slug}` },
    openGraph: {
      type: 'website',
      url: `https://salvarez-portfolio.vercel.app/blog/section/${section.slug}`,
      title: section.title,
      description: `Posts in the ${section.label} section.`,
    },
  };
}

export default async function SectionPage({ params }) {
  const { section: slug } = await params;
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();

  const posts = getSectionPosts(slug);
  if (posts.length === 0) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto py-5 flex items-center justify-between">
          <Link href="/" className="text-white font-medium hover:text-sky-400 transition-colors">
            Sebastian Alvarez
          </Link>
          <Link href="/blog" className="text-xs sm:text-sm text-slate-300 hover:text-sky-400 transition-colors">
            ← All posts
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <p className="text-sm text-sky-600 tracking-widest uppercase font-medium">
          {section.label}
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
          {section.title}
        </h1>
        <p className="mt-5 text-slate-600">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>

        <div className="mt-12 border-t border-slate-200">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-12 inline-block text-sm text-sky-700 hover:text-sky-900 transition-colors"
        >
          ← All posts
        </Link>
      </div>
    </main>
  );
}
