import Link from 'next/link';
import { formatDate } from '@/lib/posts';

// Used by the single-section index and the per-section pages.
export default function PostCard({ post }) {
  return (
    <article className="border-b border-slate-200 py-6">
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

        <h3 className="mt-2 text-lg sm:text-xl font-medium leading-snug text-slate-900 group-hover:text-sky-700 transition-colors">
          {post.title}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
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
