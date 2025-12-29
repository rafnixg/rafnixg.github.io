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