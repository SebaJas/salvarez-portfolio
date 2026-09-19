import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

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
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
    content,
  };
}

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPost(slug) {
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return null;

  return { ...post, html: marked.parse(post.content) };
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
