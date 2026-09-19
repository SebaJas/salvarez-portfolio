import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatDate } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `https://salvarez-portfolio.vercel.app/blog/${post.slug}`;

  return {
    title: `${post.title} | Sebastian Alvarez`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['Sebastian Alvarez'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto py-5 flex items-center justify-between">
          <Link href="/" className="text-white font-medium hover:text-sky-400 transition-colors">
            Sebastian Alvarez
          </Link>
          <Link href="/blog" className="text-xs sm:text-sm text-slate-300 hover:text-sky-400 transition-colors">
            ← All writing
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-slate-300">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-light leading-tight tracking-tight text-slate-900">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/blog" className="text-sky-700 hover:text-sky-900 transition-colors">
            ← All writing
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            Portfolio
          </Link>
          <a
            href="https://www.linkedin.com/in/sebaalvarez87/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            LinkedIn
          </a>
        </footer>
      </article>
    </main>
  );
}
