# What Are Skills?

Skills are modular capabilities that extend agent functionality. They package instructions, workflows, and resources that agents use automatically when relevant.

## Purpose

Skills transform general-purpose agents into specialists by providing:
- **Domain expertise** without repeating prompts
- **Reusable workflows** that load on-demand
- **Progressive disclosure** - context only when needed

## How Skills Work

### Three Loading Levels

| Level | Content | Loaded When |
|-------|---------|-------------|
| **1. Metadata** | YAML name/description | Always (at startup) |
| **2. Instructions** | SKILL.md body | When skill triggered |
| **3. Resources** | Sub-docs, scripts | When referenced |

This means:
- Many skills = minimal overhead (only metadata loaded)
- Triggered skill = instructions enter context
- Sub-docs = only loaded if agent reads them

### Filesystem-Based Architecture

Unlike prompts (one-off instructions), skills live as directories:

```
skill-name/
├── SKILL.md         # Instructions (Level 2)
├── REFERENCE.md     # Detail docs (Level 3)
└── scripts/         # Utility code (Level 3)
```

Agents access these files via filesystem, loading content progressively.

## Skills vs Prompts

| Aspect | Prompts | Skills |
|--------|---------|--------|
| **Scope** | One conversation | Reusable across sessions |
| **Loading** | All upfront | Progressive, on-demand |
| **Structure** | Inline text | Filesystem directories |
| **Maintenance** | Edit each prompt | Update once, applies everywhere |

## Key Design Principles

1. **Skills share context window** - Be concise
2. **Only add what agent doesn't know** - No explaining basics
3. **Link, don't embed** - Progressive disclosure
4. **Workflows with checklists** - Trackable progress
5. **Examples over descriptions** - Show, don't tell

## Skill Tiers

| Tier | Scope | Location |
|------|-------|----------|
| **Universal** | All projects | External package (future) |
| **Domain** | Similar projects | Shared repo |
| **Project** | Single project | `.agent/skills/` in repo |

## When to Create a Skill

Create a skill when:
- **Repeating same instructions** across sessions
- **Complex workflow** needs documentation
- **Domain knowledge** agent lacks
- **Scripts or tools** worth packaging

Don't create a skill for:
- One-off tasks
- Information agent already knows
- Very short instructions (<50 tokens)
