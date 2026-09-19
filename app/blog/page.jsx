import Link from 'next/link';
import { getSections, formatDate } from '@/lib/posts';

export const metadata = {
  title: 'Blog | Sebastian Alvarez',
  description:
    'Notes on distributed systems, Go, and the production bugs worth writing down — pagination, identity, data integrity.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: 'https://salvarez-portfolio.vercel.app/blog',
    title: 'Blog | Sebastian Alvarez',
    description:
      'Notes on distributed systems, Go, and the production bugs worth writing down.',
  },
};

function PostCard({ post }) {
  return (
    <article className="border-b border-slate-200 py-8">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-slate-300">·</span>
          <span>{post.readingMinutes} min read</span>
          {post.draft && (
            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              Draft — not published
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl sm:text-2xl font-medium text-slate-900 group-hover:text-sky-700 transition-colors">
          {post.title}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {post.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}

export default function BlogIndex() {
  const sections = getSections();

  // While everything lives in one section there is nothing to group, so the page
  // keeps its original shape: that section's title as the heading, then the
  // posts. The grouped layout appears on its own once a second section has posts.
  const grouped = sections.length > 1;

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto py-5 flex items-center justify-between">
          <Link href="/" className="text-white font-medium hover:text-sky-400 transition-colors">
            Sebastian Alvarez
          </Link>
          <Link href="/" className="text-xs sm:text-sm text-slate-300 hover:text-sky-400 transition-colors">
            ← Portfolio
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <p className="text-sm text-sky-600 tracking-widest uppercase font-medium">Blog</p>

        {!grouped && sections.length > 0 && (
          <h1 className="mt-4 text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            {sections[0].title}
          </h1>
        )}

        <p className="mt-5 text-slate-600 leading-relaxed max-w-xl">
          Mostly distributed systems in Go: the failures that do not crash, the ones that answer
          the wrong question quietly, and what they turned out to be underneath.
        </p>

        {sections.length === 0 && <p className="mt-12 text-slate-500">No posts yet.</p>}

        {!grouped &&
          sections.map((section) => (
            <div key={section.slug} className="mt-12 sm:mt-16 border-t border-slate-200">
              {section.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ))}

        {grouped &&
          sections.map((section) => (
            <div key={section.slug} className="mt-16 sm:mt-20">
              <p className="text-xs text-sky-600 tracking-widest uppercase font-medium">
                {section.label}
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
                {section.title}
              </h2>
              <div className="mt-8 border-t border-slate-200">
                {section.posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
