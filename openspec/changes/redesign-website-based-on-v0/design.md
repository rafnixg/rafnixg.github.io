## Context
The current rafnixg.github.io is a static portfolio website with basic sections. The v0-rafnixg-dev.vercel.app provides a modern reference design with clear sections for hero, specialties, projects, articles, and contact. This redesign aims to adopt that structure while maintaining the static nature and existing content.

## Goals / Non-Goals
- Goals: Create a modern, professional layout; improve content organization; enhance mobile experience; maintain fast loading
- Non-Goals: Add dynamic features or backend; change domain or hosting; introduce new frameworks

## Decisions
- Layout: Single-page design with distinct sections (hero, specialties, projects, articles, contact)
- Color Scheme: Maintain dark theme as primary, ensure good contrast
- Typography: Use clean, readable fonts; consider adding the Mona Sans font if available
- Projects Display: Grid layout with cards showing image, title, description, tech stack, and GitHub link
- Articles: List format with title, excerpt, metadata (date, views, read time)
- Navigation: Simple header with contact links, possibly smooth scrolling to sections

## Implementation Notes
- Palette: adopt v0 OKLCH tokens in a single top-level `:root` (e.g. `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--border`, `--ring`).
- Theme: enforce a single dark theme; remove `body.light` variants and ensure `body.classList` applies `dark` at load.
- Hero: center-aligned hero with decorative blurred blobs (`::before`/`::after`), a `gradient-text` span, and CTA + social link groups.
- Social links: 44px square containers and ~40px SVG/image sizing for consistent tappable targets.
- Projects: responsive `projects-grid` (two-column desktop, one-column under ~900px), `.project-card` hover lift and shadow, `.project-image` uses `aspect-ratio` and `object-fit: contain`.
- Badges/tech pills: rounded small `span` elements styled with tinted OKLCH accents and subtle borders.

## Breakpoints and Responsiveness
- Desktop: >= 900px show two-column project grid
- Tablet: 600–899px adjust spacing and font scales with `clamp()`
- Mobile: <600px single-column layout, stacked hero content, larger tappable controls

## Risks / Trade-offs
- Risk: Redesign might increase CSS complexity, affecting load times
  - Mitigation: Optimize CSS, use efficient selectors
- Risk: Mobile responsiveness requires careful testing
  - Mitigation: Use flexbox/grid, test on multiple devices
- Trade-off: More sections vs. keeping page concise
  - Decision: Prioritize comprehensive showcase over minimalism

## Migration Plan
1. Backup current files
2. Implement new HTML structure
3. Update CSS incrementally
4. Test responsiveness and performance
5. Deploy and monitor

## Open Questions
- Should we include actual article data or placeholder?
- Any specific color adjustments needed?
- How to handle projects without images?