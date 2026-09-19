// The blog's sections, in the order they should appear on the index.
//
// A post picks one with `section: "<slug>"` in its frontmatter. A post with no
// section, or with a slug that is not listed here, falls into DEFAULT_SECTION —
// so a typo never makes a post disappear.
//
// The index adapts on its own: while only one section has posts it renders as a
// flat list, exactly as before. As soon as a second one does, it switches to the
// grouped layout, each section with its own label and title.

export const SECTIONS = [
  {
    slug: 'debugging',
    label: 'Debugging',
    title: 'Production bugs worth writing down',
  },
  {
    slug: 'architecture',
    label: 'Architecture',
    title: 'Designs I argued for',
  },
];

export const DEFAULT_SECTION = 'debugging';

// How many posts each section shows on the index. The rest are reachable through
// the "See all" link, which points at /blog/section/<slug>.
export const POSTS_PER_SECTION = 3;

export function getSection(slug) {
  return (
    SECTIONS.find((s) => s.slug === slug) ??
    SECTIONS.find((s) => s.slug === DEFAULT_SECTION)
  );
}
