---
name: skill-authoring
description: |
  Create new agent skills following best practices. Use when building a new 
  skill, documenting a workflow, or structuring reusable agent capabilities.
---

# Skill Authoring

Create well-structured, effective skills that agents can discover and use.

> **New to skills?** Read [CONCEPTS.md](CONCEPTS.md) first for foundational understanding.

## Quick Start

1. Copy template from [TEMPLATE.md](TEMPLATE.md)
2. Fill in YAML frontmatter (name, description)
3. Write concise instructions
4. Validate against [CHECKLIST.md](CHECKLIST.md)
5. Place in appropriate location

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed reference (optional)
├── EXAMPLES.md        # Usage examples (optional)
└── scripts/           # Utility scripts (optional)
    └── helper.py
```

## YAML Frontmatter Requirements

```yaml
---
name: skill-name          # Max 64 chars, lowercase + hyphens only
description: |            # Max 1024 chars
  What it does. When to use it.
---
```

## Skill Tiers

| Tier | Location | Scope |
|------|----------|-------|
| **Universal** | External package | Reusable across all projects |
| **Domain** | Shared repo | Similar project types |
| **Project** | `.agent/skills/` | Single project specific |

## Core Principles

1. **Concise** - Only add what agent doesn't already know
2. **SKILL.md under 500 lines** - Split to sub-docs if larger
3. **Progressive disclosure** - Link to details, don't embed
4. **Workflows with checklists** - Trackable progress
5. **Examples over descriptions** - Input/output pairs

## Workflow

### Step 1: Define Purpose
- What problem does this skill solve?
- When should the agent use it?
- What tier (universal/domain/project)?

### Step 2: Create Structure
```bash
mkdir -p .agent/skills/new-skill
cp skills/skill-authoring/TEMPLATE.md .agent/skills/new-skill/SKILL.md
```

### Step 3: Write Content
- Start with Quick Start (minimal working example)
- Add workflows with checkboxes
- Link to sub-docs for details

### Step 4: Validate
Run through [CHECKLIST.md](CHECKLIST.md) before publishing.

### Step 5: Register
Add to `.agent/skills.md` index.

## References

- [TEMPLATE.md](TEMPLATE.md) - Blank skill template
- [CHECKLIST.md](CHECKLIST.md) - Quality checklist
- [EXAMPLES.md](EXAMPLES.md) - Good/bad examples
