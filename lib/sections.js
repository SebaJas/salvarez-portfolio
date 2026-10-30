// The blog's sections, in the order they should appear on the index.
//
// A post picks one with `section: "<slug>"` in its frontmatter. A post with no
// section, or with a slug that is not listed here, falls into DEFAULT_SECTION —
// so a typo never makes a post disappear.
//
// The index adapts on its own: while only one section has posts it renders as a
// flat list, exactly as before. As soon as a second one does, it switches to the
// grouped layout: the newest post featured on top, then one row per section with
// its label, title and blurb beside its posts.

export const SECTIONS = [
  {
    slug: 'debugging',
    label: 'Debugging',
    title: 'Production bugs worth writing down',
    blurb:
      'Failures that returned success, traced back to the one line, field or assumption behind them.',
  },
  {
    slug: 'architecture',
    label: 'Architecture',
    title: 'Designs I argued for',
    blurb:
      'Changes I pushed for after an incident, with the costs I would want a reviewer to challenge.',
  },
  {
    slug: 'operations',
    label: 'Operations',
    title: 'Shipping to machines that are already running',
    blurb: 'What happens when a correct change reaches a fleet of servers that never stopped.',
  },
];

export const DEFAULT_SECTION = 'debugging';

// Page-level heading and intro, used once there is more than one section. With a
// single section its own title carries the page instead.
export const BLOG_TITLE = 'Notes from production systems';
export const BLOG_INTRO =
  'Production systems, from both ends: the failures that do not announce ' +
  'themselves, and the designs meant to remove the next one.';

// How many posts each section shows on the index. The rest are reachable through
// the "See all" link, which points at /blog/section/<slug>.
export const POSTS_PER_SECTION = 3;

export function getSection(slug) {
  return (
    SECTIONS.find((s) => s.slug === slug) ??
    SECTIONS.find((s) => s.slug === DEFAULT_SECTION)
  );
}
