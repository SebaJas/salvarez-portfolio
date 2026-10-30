import Link from 'next/link';
import { getAllPosts, getSections, formatDate } from '@/lib/posts';
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

function DraftBadge() {
  return (
    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
      Draft — not published
    </span>
  );
}

// The newest post, set apart at the top in the site's dark band. It still shows
// up in its own section below: the feature is a shortcut, not a move.
function Featured({ post, label }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-12 sm:mt-14 block bg-slate-900 rounded-lg px-6 sm:px-10 py-9 sm:py-12"
    >
      <p className="text-xs tracking-widest uppercase font-medium text-sky-400">Latest · {label}</p>
      <h2 className="mt-4 text-2xl sm:text-4xl font-light tracking-tight text-white leading-tight max-w-3xl group-hover:text-sky-300 transition-colors">
        {post.title}
      </h2>
      <p className="mt-5 text-slate-300 leading-relaxed max-w-2xl">{post.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="text-slate-600">·</span>
        <span>{post.readingMinutes} min read</span>
        {post.draft && <DraftBadge />}
      </div>
    </Link>
  );
}

function SectionPost({ post }) {
  return (
    <article className="py-6 first:pt-0 border-b border-slate-200 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="group block">
        <h3 className="text-lg sm:text-xl font-medium leading-snug text-slate-900 group-hover:text-sky-700 transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-slate-600 leading-relaxed">{post.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-slate-300">·</span>
          <span>{post.readingMinutes} min read</span>
          {post.draft && <DraftBadge />}
        </div>
      </Link>
    </article>
  );
}

export default function BlogIndex() {
  const sections = getSections();
  const latest = getAllPosts()[0];

  // One section means nothing to group: the page keeps its original narrow,
  // single-column list. With two or more, it widens, features the newest post
  // and gives each section a row of its own: name and intro on the left, its
  // posts on the right.
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
        <header>
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
          <>
            <Featured post={latest} label={sections.find((s) => s.slug === latest.section)?.label} />

            <div className="mt-6">
              {sections.map((section) => (
                <section
                  key={section.slug}
                  className="py-12 sm:py-16 border-b border-slate-200 last:border-b-0 grid lg:grid-cols-[17rem_1fr] gap-x-16 gap-y-8"
                >
                  <div>
                    <p className="text-xs text-sky-600 tracking-widest uppercase font-medium">
                      {section.label}
                    </p>
                    <h2 className="mt-3 text-2xl font-light tracking-tight text-slate-900 leading-snug">
                      {section.title}
                    </h2>
                    {section.blurb && (
                      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{section.blurb}</p>
                    )}
                    {section.total > section.posts.length && (
                      <Link
                        href={`/blog/section/${section.slug}`}
                        className="mt-5 inline-block text-sm text-sky-700 hover:text-sky-900 transition-colors"
                      >
                        See all posts →
                      </Link>
                    )}
                  </div>

                  <div className="min-w-0">
                    {section.posts.map((post) => (
                      <SectionPost key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
