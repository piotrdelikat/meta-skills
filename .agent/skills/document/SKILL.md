---
name: document
description: |
  Create and maintain project documentation. Use for initial docs creation,
  updating existing docs, and ensuring documentation stays current with
  date tracking and structured templates.
---

# Document

Create, update, and maintain project documentation with structured templates.

## Quick Start

1. Identify documentation type needed (README, Architecture, Decision, Concept)
2. Use appropriate template from `templates/`
3. Fill with project-specific content
4. Add frontmatter with dates for tracking
5. Link from main documentation index

## Documentation Types

| Type | When to Use | Template |
|------|-------------|----------|
| **README** | Project root, major modules | [README.template.md](templates/README.template.md) |
| **Architecture** | Complex systems, multi-module projects | [ARCHITECTURE.template.md](templates/ARCHITECTURE.template.md) |
| **Decision** | Recording architectural/design decisions | [DECISION.template.md](templates/DECISION.template.md) |
| **Concept** | Ideas, vision, planning documents | [CONCEPT.template.md](templates/CONCEPT.template.md) |

## Frontmatter Standard

Every documentation file should include tracking metadata:

```yaml
---
title: Document Title
created: 2025-01-07
last_updated: 2025-01-07
author: name
status: draft | review | published
---
```

## Workflows

### Create New Documentation

```
Progress:
- [ ] Step 1: Analyze what needs documenting
- [ ] Step 2: Choose appropriate template
- [ ] Step 3: Generate initial content
- [ ] Step 4: Review for clarity and completeness
- [ ] Step 5: Add to documentation index
```

#### Step 1: Analyze
- What is the purpose of this documentation?
- Who is the target audience? (beginners, maintainers, users)
- What existing docs can we reference or link to?

#### Step 2: Choose Template
- New project/module → README
- System design explanation → Architecture  
- Why we chose X over Y → Decision
- Ideas, research, planning → Concept

#### Step 3: Generate Content
- Copy template from `templates/`
- Replace all placeholders with actual content
- Add concrete examples from the project
- Include visual aids (file trees, diagrams)

#### Step 4: Review for Clarity
- Read as if you have no project context
- Verify all code examples work
- Check all links are valid
- Ensure progressive disclosure (simple → complex)

#### Step 5: Index
- Add entry to main docs index (README or docs/INDEX.md)
- Cross-link related documentation

---

### Update Existing Documentation

```
Progress:
- [ ] Step 1: Identify what changed
- [ ] Step 2: Update relevant sections
- [ ] Step 3: Update last_updated date
- [ ] Step 4: Review affected cross-references
```

#### Step 1: Identify Changes
After completing a task, identify:
- What behavior changed?
- What configuration changed?
- What new features were added?
- What was deprecated/removed?

#### Step 2: Update Sections
- Modify only affected sections
- Add migration notes if breaking changes
- Update examples to reflect new behavior

#### Step 3: Update Metadata
```yaml
last_updated: [TODAY'S DATE]
```

#### Step 4: Cross-References
- Check if other docs reference this section
- Update or add links as needed

## Core Principles

1. **Start with "Why"** - Explain purpose before implementation
2. **Progressive Disclosure** - Simple overview first, details linked
3. **Quick Wins** - Help users achieve something in < 5 minutes
4. **Concrete Examples** - Real code beats abstract descriptions
5. **Visual Aids** - File trees, diagrams, flowcharts
6. **Keep Current** - Stale docs are worse than no docs

## Integration with `reflect` Skill

After task completion, the `reflect` skill should check:
- Did this change affect any documentation?
- Is there a new concept that needs documenting?
- Are existing docs still accurate?

If updates needed, trigger this skill's update workflow.
