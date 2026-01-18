---
name: skill-discovery
description: |
  Analyze project to identify missing skills and knowledge gaps. Use when 
  assessing what documentation or capabilities the agent lacks, or when 
  planning improvements to agent effectiveness.
---

# Skill Discovery

Analyze a project to identify gaps in agent knowledge and capabilities.

> **New to skills?** Read [skill-authoring/CONCEPTS.md](../skill-authoring/CONCEPTS.md) first.

## Quick Start

1. Review existing skills and documentation
2. Analyze project structure and goals
3. Identify gap categories (context/action/workflow)
4. Propose new skills ranked by impact
5. Output proposal for user review

## Gap Categories

| Category | Question | Example Gap |
|----------|----------|-------------|
| **Context** | What doesn't the agent know? | Missing database schema docs |
| **Action** | What can't the agent do? | No deployment automation |
| **Workflow** | What processes are undocumented? | Release process not captured |

## Discovery Workflow

Track progress:

```
Discovery Progress:
- [ ] Step 1: Inventory existing skills
- [ ] Step 2: Analyze project structure
- [ ] Step 3: Review product goals
- [ ] Step 4: Identify gaps
- [ ] Step 5: Prioritize proposals
- [ ] Step 6: Create proposal document
```

### Step 1: Inventory Existing Skills

Read `.agent/skills.md` and list current skills:
```bash
cat .agent/skills.md
ls -la .agent/skills/
```

### Step 2: Analyze Project Structure

Understand codebases, services, and dependencies:
```bash
ls -la
find . -name "*.md" -path "./.agent/*" | head -20
```

### Step 3: Review Product Goals

Check for:
- README.md - Project purpose
- Roadmaps or planning docs
- Issue trackers / TODOs
- Recent commits for active areas

### Step 4: Identify Gaps

For each category, ask:

**Context gaps:**
- What config/env vars are undocumented?
- What APIs lack reference docs?
- What schemas are missing?

**Action gaps:**
- What manual processes could be automated?
- What common tasks lack scripts?
- What validations are missing?

**Workflow gaps:**
- What multi-step processes are undocumented?
- What troubleshooting guides are missing?
- What decision trees need capture?

### Step 5: Prioritize Proposals

Rank by:
1. **Frequency** - How often would this skill be used?
2. **Impact** - How much time/errors does it save?
3. **Complexity** - How hard to create?

### Step 6: Create Proposal Document

Use template:

```markdown
# Skill Proposals for [Project]

## High Priority

### 1. [Skill Name]
- **Gap type:** Context / Action / Workflow
- **Problem:** What's missing
- **Proposed skill:** Brief description
- **Tier:** Universal / Domain / Project

## Medium Priority
...

## Low Priority
...
```

## Output

Create proposal at `.agent/skills/PROPOSALS.md` or present inline.
