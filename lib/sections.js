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

// Sections with more posts than this get truncated on the index. Enable it once
// there is a per-section page for the "see all" link to point at; until then,
// showing everything is better than hiding posts with no way to reach them.
export const POSTS_PER_SECTION = Infinity;

export function getSection(slug) {
  return (
    SECTIONS.find((s) => s.slug === slug) ??
    SECTIONS.find((s) => s.slug === DEFAULT_SECTION)
  );
}
