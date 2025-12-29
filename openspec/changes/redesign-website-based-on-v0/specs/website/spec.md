## ADDED Requirements
### Requirement: Hero Section Display
The website SHALL display a hero section with the developer's title and specialties.

#### Scenario: Hero content visible
- **WHEN** a visitor loads the homepage
- **THEN** the hero section shows "Ingeniero Backend & Odoo" title
- **AND** displays specialty badges (Python, Odoo, FastAPI, etc.)
- **AND** includes contact buttons for GitHub and LinkedIn

### Requirement: Projects Section Display
The website SHALL display a projects section showcasing key projects in a grid layout.

#### Scenario: Projects grid visible
- **WHEN** scrolling to the projects section
- **THEN** project cards are displayed in a responsive grid
- **AND** each card shows project image, title, description, tech stack, and GitHub link

#### Scenario: Project details accessible
- **WHEN** clicking a project card
- **THEN** links open in new tab to GitHub repository

### Requirement: Articles Section Display
The website SHALL display a recent articles section with blog post previews.

#### Scenario: Articles list visible
- **WHEN** viewing the articles section
- **THEN** recent articles are listed with title, excerpt, date, and read time
- **AND** each article links to the full post

### Requirement: Contact Section Display
The website SHALL display a contact section with call-to-action and social links.

#### Scenario: Contact information accessible
- **WHEN** at the bottom of the page
- **THEN** contact section shows availability message
- **AND** provides links to GitHub, LinkedIn, and blog