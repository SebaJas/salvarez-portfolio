import Link from 'next/link';
import { getSections } from '@/lib/posts';
import PostCard from './PostCard';

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

export default function BlogIndex() {
  const sections = getSections();

  // One section means nothing to group: the page keeps its original narrow,
  // single-column shape. With two or more, it widens and lays them out side by
  // side, so the second section is visible without scrolling past the first.
  const grouped = sections.length > 1;
  const width = grouped ? 'max-w-6xl' : 'max-w-3xl';

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 px-4 sm:px-8">
        <div className={`${width} mx-auto py-5 flex items-center justify-between`}>
          <Link href="/" className="text-white font-medium hover:text-sky-400 transition-colors">
            Sebastian Alvarez
          </Link>
          <Link href="/" className="text-xs sm:text-sm text-slate-300 hover:text-sky-400 transition-colors">
            ← Portfolio
          </Link>
        </div>
      </nav>

      <div className={`${width} mx-auto px-4 sm:px-8 py-16 sm:py-24`}>
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

        {grouped && (
          <div className="mt-14 sm:mt-16 grid md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-14 items-start">
            {sections.map((section) => (
              <div key={section.slug}>
                <p className="text-xs text-sky-600 tracking-widest uppercase font-medium">
                  {section.label}
                </p>
                <h2 className="mt-3 text-2xl font-light tracking-tight text-slate-900">
                  {section.title}
                </h2>

                <div className="mt-6 border-t border-slate-200">
                  {section.posts.map((post) => (
                    <PostCard key={post.slug} post={post} compact />
                  ))}
                </div>

                {section.total > section.posts.length && (
                  <Link
                    href={`/blog/section/${section.slug}`}
                    className="mt-5 inline-block text-sm text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    See all {section.total} posts →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
