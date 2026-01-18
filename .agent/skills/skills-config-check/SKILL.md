---
name: skills-config-check
description: |
  Validate agent/IDE skills configuration across a project.
  Use when setting up a new project, debugging skill availability, or
  ensuring all agents can discover installed skills.
---

# Skills Configuration Check

Validate that all AI agents can discover and use installed skills.

## Quick Start

```bash
# Check current configuration
node .agent/skills/skills-config-check/scripts/check-config.mjs

# Auto-fix missing directories and context files
node .agent/skills/skills-config-check/scripts/check-config.mjs --fix
```

## What It Checks

1. **Skills directories exist** for each agent/IDE
2. **Skills are consistent** across directories
3. **Context files reference** all available skills
4. **CLAUDE.md exists** (for Claude Code compatibility)

## Supported Agents

| Agent/IDE | Skills Directory | Context File |
|-----------|------------------|--------------|
| OpenCode | `.opencode/skill/` | `AGENTS.md` |
| Windsurf | `.windsurf/skills/` | `AGENTS.md` |
| Antigravity | `.agent/skills/` | `AGENTS.md` |
| Claude Code | `.claude/skills/` | `CLAUDE.md` |

> **Note:** All agents now support `AGENTS.md` as the standard context file.
> Claude Code uses `CLAUDE.md`, which `--fix` creates as a copy of `AGENTS.md`.

## Workflow

### Step 1: Run Check

```bash
node .agent/skills/skills-config-check/scripts/check-config.mjs
```

### Step 2: Review Report

```
✅ OpenCode (.opencode/skill/): 6 skills
✅ Windsurf (.windsurf/skills/): 6 skills
✅ Antigravity (.agent/skills/): 6 skills
✅ Claude Code (.claude/skills/): 6 skills

📋 Context files reference: 6 of 6 skills
```

### Step 3: Fix Issues

```bash
# Copy skills to missing directories + create CLAUDE.md
node .agent/skills/skills-config-check/scripts/check-config.mjs --fix
```

**What --fix does:**
- Creates missing skill directories
- Copies skills from primary agent to others
- Creates `CLAUDE.md` as copy of `AGENTS.md`

## Options

| Flag | Description |
|------|-------------|
| `--fix` | Auto-create missing directories & sync files |
| `--json` | Output as JSON for scripting |
| `--only=agent` | Check specific agent only |

## Integration

Run after installing skill packages:
```bash
npm install meta-skills agent-ops
node .agent/skills/skills-config-check/scripts/check-config.mjs --fix
```
