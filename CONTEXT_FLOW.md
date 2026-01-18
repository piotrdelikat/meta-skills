# How Agent Context Works with Skills

## The Context Flow

Modern agents like Antigravity, OpenCode, and Windsurf **automatically discover** skills from their respective skills directories. Here's how it works:

```
┌─────────────────────────────────────────────────────────────┐
│ Agent Starts                                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent scans skills directory:                               │
│ - Antigravity: .agent/skills/                               │
│ - OpenCode: .opencode/skill/                                │
│ - Windsurf: .windsurf/skills/                               │
│ - Claude Code: .claude/skills/                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent reads YAML frontmatter from each SKILL.md:            │
│                                                              │
│ ---                                                          │
│ name: reflect                                                │
│ description: Self-improvement mechanism triggered after      │
│   task completion...                                         │
│ ---                                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent works on task...                                       │
│ - Completes a feature                                        │
│ - Fixes a bug                                                │
│ - User provides feedback                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent thinks: "This is a task completion moment.            │
│ The 'reflect' skill description says it's triggered after   │
│ task completion. Should I use it?"                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent reads full SKILL.md for detailed instructions         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent executes skill workflow                               │
└─────────────────────────────────────────────────────────────┘
```

## Progressive Disclosure Pattern

Skills use a two-level loading approach:

### Level 1: Discovery (Lightweight)

When a conversation starts, the agent reads only the **YAML frontmatter** from each skill:

```yaml
---
name: reflect
description: |
  Self-improvement mechanism triggered after task completion.
  Analyzes session for corrections and successes.
---
```

This tells the agent:
- **What** the skill does
- **When** to use it

### Level 2: Activation (On-Demand)

When the agent decides to use a skill, it reads the **full SKILL.md** with:
- Detailed workflows
- Step-by-step instructions
- Examples and anti-patterns

## Why This Works

**Memory Efficient:**
- Only skill descriptions are loaded initially (~200 chars each)
- Full instructions loaded only when needed

**Context Aware:**
- Agent knows all available skills from descriptions
- Can choose appropriate skill for the situation

**Self-Triggering:**
- Good descriptions enable agent to self-initiate skills
- "triggered after task completion" → agent knows when to consider it

## Agent-Specific Notes

### Antigravity
- Auto-discovers skills from `.agent/skills/`
- No index file required
- Reads AGENTS.md for project context

### OpenCode / Windsurf
- Discovers skills from respective directories
- Both support AGENTS.md as context file

### Claude Code
- Uses `.claude/skills/` directory
- Requires CLAUDE.md (copy of AGENTS.md works)

## Skills Index File (Optional)

The `skills.md` file in `.agent/rules/` is **optional** but can help with:
- Human-readable skill index
- Custom skill ordering
- Additional context for agents that don't auto-discover

```markdown
---
trigger: always_on
---

# Agent Skills

| Skill | Description |
|-------|-------------|
| **reflect** | Self-improvement after task completion |
| **document** | Create project documentation |
```

## Summary

| Component | Purpose | Required? |
|-----------|---------|-----------|
| `/skills/*/SKILL.md` | Skill instructions | ✅ Yes |
| YAML frontmatter | Discovery metadata | ✅ Yes |
| `AGENTS.md` | Project context | Recommended |
| `skills.md` index | Human-readable list | Optional |
