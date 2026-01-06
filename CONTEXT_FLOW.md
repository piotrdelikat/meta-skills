# How Agent Context Works with Skills

## The Context Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Agent Starts                                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Reads: .agent/rules/skills.md                               │
│ (because frontmatter has `trigger: always_on`)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent sees skill descriptions in context:                   │
│                                                              │
│ | Skill | Description |                                     │
│ |-------|-------------|                                     │
│ | reflect | "Self-improvement mechanism triggered after    │
│ |         | task completion or issue resolution..."        │
│ | document | "Create and maintain project documentation..." │
│ | audit | "Assess health of installed skills..."           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent works on task...                                       │
│ - Completes a feature                                        │
│ - Fixes a bug                                                │
│ - User corrects something                                    │
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
│ Agent reads: .agent/skills/reflect/SKILL.md                 │
│ (Full detailed instructions)                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Agent executes reflect workflow:                            │
│ 1. Switch to Critic persona                                 │
│ 2. Scan session for corrections/approvals                   │
│ 3. Categorize learnings                                     │
│ 4. Propose updates                                          │
│ 5. Request user approval                                    │
└─────────────────────────────────────────────────────────────┘
```

## What's in skills.md (Always in Context)

When you install meta-skills, the `skills.md` file looks like this:

```markdown
---
trigger: always_on
---

# Agent Skills

This file indexes available agent skills.

<!-- META-SKILLS:START -->
## Meta-Skills (Installed Package)

| Skill | Path | Description |
|-------|------|-------------|
| **skill-authoring** | [skills/skill-authoring/SKILL.md](./skills/skill-authoring/SKILL.md) | Create new agent skills following best practices. Use when building a new skill, documenting a workflow, or structuring reusable agent capabilities. |
| **skill-discovery** | [skills/skill-discovery/SKILL.md](./skills/skill-discovery/SKILL.md) | Analyze project to identify missing skills and knowledge gaps. Use when assessing what documentation or capabilities the agent lacks, or when planning improvements to agent effectiveness. |
| **document** | [skills/document/SKILL.md](./skills/document/SKILL.md) | Create and maintain project documentation. Use for initial docs creation, updating existing docs, and ensuring documentation stays current with date tracking and structured templates. |
| **audit** | [skills/audit/SKILL.md](./skills/audit/SKILL.md) | Assess health of installed skills against project context. Identifies redundant skills to merge, overloaded skills to branch, and irrelevant skills to remove. Use periodically or when skill collection grows. |
| **reflect** | [skills/reflect/SKILL.md](./skills/reflect/SKILL.md) | Self-improvement mechanism triggered after task completion or issue resolution. Analyzes session for corrections and successes, proposes updates to skills and documentation. Uses Producer-Critic pattern for objective assessment. |
<!-- META-SKILLS:END -->
```

## The Key Mechanism

### 1. Description in Context (Lightweight)

The **description** from each skill's frontmatter is **always** in the agent's context via `skills.md`:

```yaml
---
name: reflect
trigger: hook
description: |
  Self-improvement mechanism triggered after task completion or issue resolution.
  Analyzes session for corrections and successes, proposes updates to skills
  and documentation. Uses Producer-Critic pattern for objective assessment.
---
```

This description tells the agent:
- **What** the skill does
- **When** to use it ("after task completion or issue resolution")
- **How** it works ("Producer-Critic pattern")

### 2. Full Instructions (On-Demand)

When the agent decides to use the skill, it reads the **full SKILL.md** which contains:
- Detailed workflows
- Step-by-step instructions
- Examples
- Anti-patterns
- Integration points

## Why This Works

**Memory Efficient:**
- Only skill descriptions are always loaded (~200 chars each)
- Full instructions loaded only when needed

**Context Aware:**
- Agent knows all available skills
- Descriptions hint at when to use each skill
- Agent can choose appropriate skill for the situation

**Self-Triggering:**
- Good descriptions enable agent to self-initiate skills
- "triggered after task completion" → agent knows to consider it
- "Use when assessing..." → agent knows when it's relevant

## The `trigger: hook` Frontmatter

```yaml
trigger: hook
```

This is **metadata for humans** and **documentation for the agent**. It signals:
- This skill is meant to be run at specific moments
- Not a direct user request, but a process hook
- Agent should consider it at natural breakpoints

## Example: How Reflect Gets Triggered

**Scenario:** Agent just fixed a bug after user correction

**Agent's internal reasoning:**
1. "I just completed a task (bug fix)"
2. "User corrected my initial approach"
3. "I see 'reflect' skill in my context"
4. "Description says: 'triggered after task completion or issue resolution'"
5. "This matches the current situation"
6. "Let me read the full reflect SKILL.md"
7. "Ah, I should switch to Critic persona and analyze what I learned"

**Agent's action:**
> "I notice this task involved a correction. Would you like me to reflect on this session to capture what I learned?"

Or the agent might proactively say:
> "Let me reflect on this session. I'll switch to Critic mode and analyze what happened..."

## Summary

| Component | Purpose | Always in Context? |
|-----------|---------|-------------------|
| `skills.md` | Index with descriptions | ✅ Yes (trigger: always_on) |
| Skill descriptions | Tell agent when to use skill | ✅ Yes (in skills.md) |
| Full SKILL.md | Detailed instructions | ❌ No (loaded on-demand) |
| `trigger: hook` | Metadata signaling | ✅ Yes (in description context) |

The agent doesn't need explicit instructions to "run reflect after tasks" because:
1. The description is always in context
2. The description clearly states when to use it
3. The agent can read and understand this guidance
4. The agent can self-initiate based on the description
