---
trigger: always_on
---

# Agent Skills

This file indexes available agent skills.

<!-- META-SKILLS:START -->
## Meta-Skills (Installed Package)

| Skill | Path | Description |
|-------|------|-------------|
| **audit** | [skills/audit/SKILL.md](./skills/audit/SKILL.md) | Assess health of installed skills against project context. Identifies redundant skills to merge, overloaded skills to branch, and irrelevant skills to remove. Use periodically or when skill collection grows. |
| **document** | [skills/document/SKILL.md](./skills/document/SKILL.md) | Create and maintain project documentation. Use for initial docs creation, updating existing docs, and ensuring documentation stays current with date tracking and structured templates. |
| **reflect** | [skills/reflect/SKILL.md](./skills/reflect/SKILL.md) | Self-improvement mechanism triggered after task completion or issue resolution. Analyzes session for corrections and successes, proposes updates to skills and documentation. Uses Producer-Critic pattern for objective assessment. |
| **skill-authoring** | [skills/skill-authoring/SKILL.md](./skills/skill-authoring/SKILL.md) | Create new agent skills following best practices. Use when building a new skill, documenting a workflow, or structuring reusable agent capabilities. |
| **skill-discovery** | [skills/skill-discovery/SKILL.md](./skills/skill-discovery/SKILL.md) | Analyze project to identify missing skills and knowledge gaps. Use when assessing what documentation or capabilities the agent lacks, or when planning improvements to agent effectiveness. |
| **skills-config-check** | [skills/skills-config-check/SKILL.md](./skills/skills-config-check/SKILL.md) | Validate agent/IDE skills configuration across a project. Use when setting up a new project, debugging skill availability, or ensuring all agents can discover installed skills. |
<!-- META-SKILLS:END -->
