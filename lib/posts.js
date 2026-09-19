import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { SECTIONS, POSTS_PER_SECTION, getSection } from '@/lib/sections';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

// Drafts are visible while running `npm run dev` so they can be previewed at
// their real URL, and excluded from the production build — so they are absent
// from the index, the sitemap and the routes Vercel serves.
export const SHOW_DRAFTS = process.env.NODE_ENV !== 'production';

// Token classes are styled in globals.css so code blocks match the site palette
// instead of pulling in a highlight.js theme.
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

function readPost(filename) {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags ?? [],
    draft: data.draft === true, // published unless a post opts in to draft
    section: getSection(data.section).slug,
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
    content,
  };
}

export function getAllPosts({ includeDrafts = SHOW_DRAFTS } = {}) {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPost(slug) {
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return null;

  return { ...post, html: marked.parse(post.content) };
}

// Sections that actually have published posts, in the order defined in
// lib/sections.js. The index renders a flat list while this returns one entry.
export function getSections(options) {
  const posts = getAllPosts(options);

  return SECTIONS.map((section) => ({
    ...section,
    posts: posts
      .filter((post) => post.section === section.slug)
      .slice(0, POSTS_PER_SECTION),
  })).filter((section) => section.posts.length > 0);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
