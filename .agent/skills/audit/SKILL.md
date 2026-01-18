---
name: audit
description: |
  Assess health of installed skills against project context. Identifies
  redundant skills to merge, overloaded skills to branch, and irrelevant
  skills to remove. Use periodically or when skill collection grows.
---

# Audit

Evaluate installed skills against project context and recommend improvements.

## Quick Start

1. Inventory all skills in `.agent/skills/`
2. Read project documentation for context
3. Assess each skill against criteria
4. Generate recommendations (merge/branch/remove)
5. Present findings for user approval

## Assessment Criteria

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ **Good** | Skill is relevant, focused, well-maintained | Keep as-is |
| 🔀 **Merge** | Similar to another skill, causing confusion | Combine with related skill |
| 🌿 **Branch** | Too broad, handles multiple responsibilities | Split into specialized sub-skills |
| ❌ **Remove** | Not relevant to project, never used | Remove from project |
| ⚠️ **Update** | Outdated, references stale patterns | Needs refresh |

## Workflow

```
Progress:
- [ ] Step 1: Inventory skills
- [ ] Step 2: Understand project context
- [ ] Step 3: Assess each skill
- [ ] Step 4: Generate recommendations
- [ ] Step 5: Present for approval
```

### Step 1: Inventory Skills

```bash
# List all installed skills
ls -la .agent/skills/

# Read skills index
cat .agent/rules/skills.md
```

For each skill, note:
- Name and location
- Last modified date
- Number of files/complexity

### Step 2: Understand Project Context

Read project documentation to understand:
- What is the project's purpose?
- What technologies are used?
- What workflows are common?
- What problems need solving?

Key files to review:
- `README.md`
- `.agent/rules/*.md`
- Project configuration files

### Step 3: Assess Each Skill

For each skill, evaluate:

**Relevance Check:**
- Does this skill apply to this project's tech stack?
- Has this skill been used in the past month?
- Does the project have the prerequisites this skill assumes?

**Focus Check:**
- Does the skill do ONE thing well?
- Is the SKILL.md under 500 lines?
- Are there multiple unrelated workflows in one skill?

**Overlap Check:**
- Is there another skill with similar purpose?
- Do multiple skills reference the same workflows?
- Could skills be combined without losing clarity?

### Step 4: Generate Recommendations

Create assessment report:

```markdown
# Skill Audit Report
Date: [DATE]
Project: [PROJECT NAME]

## Summary
- Total skills: [N]
- Good: [N]
- Needs action: [N]

## Detailed Assessment

### ✅ [skill-name] - Good
- Relevant: Yes
- Focused: Yes
- Notes: [Any observations]

### 🔀 [skill-a] + [skill-b] - Recommend Merge
- **Reason:** Both handle [similar responsibility]
- **Proposed name:** [merged-skill-name]
- **Action:** Combine into single skill, preserve best parts of each

### 🌿 [skill-name] - Recommend Branch
- **Reason:** Handles [responsibility A] AND [responsibility B]
- **Proposed split:**
  - `[skill-name]-core` - [Core responsibility]
  - `[skill-name]-[specialization]` - [Specialized responsibility]

### ❌ [skill-name] - Recommend Remove
- **Reason:** [Why it's not relevant]
- **Last used:** [Date or "Never"]
```

### Step 5: Present for Approval

Present recommendations to user with:
- Clear rationale for each recommendation
- Specific actions to take
- Option to accept/reject each recommendation

**Never auto-execute merge/branch/remove without user approval.**

## Merge Guidelines

When merging skills:

1. Create new skill with combined name or best name
2. Combine workflows, deduplicate
3. Merge reference materials
4. Update skills.md index
5. Remove old skill folders
6. Git commit with clear message

**For detailed merge process, see [MERGE.md](MERGE.md)**

## Branch Guidelines

When branching skills:

1. Create sub-folder or sibling skills
2. Move specialized content to new skill
3. Keep core skill focused on fundamentals
4. Cross-reference between related skills
5. Update skills.md with new structure

**For detailed branch process, see [BRANCH.md](BRANCH.md)**

## Scheduling

Consider running audit:
- After adding 3+ new skills
- When skill count exceeds 10
- Quarterly for active projects
- When onboarding new team members
