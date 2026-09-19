import Link from 'next/link';
import { getSections } from '@/lib/posts';
import { BLOG_TITLE, BLOG_INTRO } from '@/lib/sections';
import PostCard from './PostCard';

export const metadata = {
  title: 'Blog | Sebastian Alvarez',
  description: BLOG_INTRO,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: 'https://salvarez-portfolio.vercel.app/blog',
    title: 'Blog | Sebastian Alvarez',
    description: BLOG_INTRO,
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
        <header className={grouped ? 'pb-10 sm:pb-12 border-b border-slate-200' : ''}>
          <p className="text-sm text-sky-600 tracking-widest uppercase font-medium">Blog</p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            {grouped ? BLOG_TITLE : sections[0]?.title ?? BLOG_TITLE}
          </h1>

          <p className="mt-5 text-slate-600 leading-relaxed max-w-3xl">{BLOG_INTRO}</p>
        </header>

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
          <div className="mt-12 sm:mt-14 grid md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-14 items-start">
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
