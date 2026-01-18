# Skill Template

Copy this template when creating a new skill.

```markdown
---
name: your-skill-name
description: |
  Brief description of what this skill does.
  When to use it (triggers, keywords, scenarios).
---

# Skill Name

Brief one-line purpose.

## Quick Start

[Minimal working example - the fastest path to value]

## Workflow

Copy this checklist to track progress:

```
Progress:
- [ ] Step 1: [action]
- [ ] Step 2: [action]
- [ ] Step 3: [action]
```

### Step 1: [Action Name]

[Clear instructions]

### Step 2: [Action Name]

[Clear instructions]

### Step 3: [Action Name]

[Clear instructions]

## Advanced

For detailed reference, see [REFERENCE.md](REFERENCE.md).

## Examples

See [EXAMPLES.md](EXAMPLES.md) for common patterns.
```

## Frontmatter Requirements

| Field | Constraint |
|-------|------------|
| `name` | Max 64 chars, lowercase, hyphens only |
| `description` | Max 1024 chars, include WHAT and WHEN |

## File Naming

| File | Purpose |
|------|---------|
| `SKILL.md` | Main instructions (required) |
| `REFERENCE.md` | Detailed API/config reference |
| `EXAMPLES.md` | Input/output examples |
| `KNOWN_ISSUES.md` | Common problems and solutions |
| `scripts/*.py` | Utility scripts |
