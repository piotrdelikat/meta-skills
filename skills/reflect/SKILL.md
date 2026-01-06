---
name: reflect
trigger: hook
description: |
  Self-improvement mechanism triggered after task completion or issue resolution.
  Analyzes session for corrections and successes, proposes updates to skills
  and documentation. Uses Producer-Critic pattern for objective assessment.
---

# Reflect

Self-improvement hook that learns from task completions and user feedback.

> **Trigger:** Run after completing a significant task, resolving an issue, or when explicitly invoked. This skill should be considered at natural breakpoints in work.

## Quick Start

1. Adopt Critic persona (separate from Worker)
2. Analyze the completed session
3. Identify corrections (what went wrong) and approvals (what went right)
4. Propose updates to skills or documentation
5. Request user approval before making changes

## The Reflection Loop

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  EXECUTE    │────▶│  EVALUATE   │────▶│   REFINE    │
│  (Worker)   │     │  (Critic)   │     │  (Update)   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       └───────────────────────────────────────┘
```

## Personas

### Worker Persona
The agent executing tasks - building, fixing, creating.

### Critic Persona
**Adopt this when reflecting:**

> "I am a Senior Reviewer analyzing this session. I look for:
> - Mistakes that were corrected
> - Patterns that worked well
> - Knowledge gaps that caused issues
> - Opportunities to improve agent instructions"

Use the Critic persona to reduce bias and improve objectivity.

## Workflow

```
Reflection Progress:
- [ ] Step 1: Switch to Critic persona
- [ ] Step 2: Scan session for signals
- [ ] Step 3: Categorize learnings
- [ ] Step 4: Draft proposed updates
- [ ] Step 5: Request user approval
- [ ] Step 6: Persist approved changes
```

### Step 1: Switch Persona

Mentally shift from "doer" to "reviewer":
- What would a senior engineer notice about this session?
- What patterns emerged?
- What could be done better next time?

### Step 2: Scan for Signals

**Negative Signals (Corrections):**
- User said "no", "wrong", "that's not right"
- Had to redo or rollback work
- Made assumptions that were incorrect
- Missed requirements on first attempt

**Positive Signals (Approvals):**
- User said "yes", "perfect", "exactly"
- Task completed without revision
- Approach was praised
- Found efficient solution

### Step 3: Categorize Learnings

| Category | Description | Where to Update |
|----------|-------------|-----------------|
| **Project-specific** | This project's conventions, preferences | `.agent/rules/` or project skill |
| **Skill improvement** | Better workflow or instruction | Specific skill's SKILL.md |
| **New skill needed** | Gap in capabilities | Create new skill via `skill-authoring` |
| **Documentation** | Outdated or missing docs | Update via `document` skill |

### Step 4: Draft Proposed Updates

For each learning, draft a specific, actionable update:

```markdown
## Proposed Update

**Type:** [Rule | Skill Update | New Skill | Documentation]

**Location:** [File path]

**Current state:**
[What it says now, or "N/A" if new]

**Proposed change:**
[Specific text to add/modify]

**Rationale:**
[Why this helps - reference the specific session event]
```

### Step 5: Request Approval

**Never persist changes without user approval.**

Present proposed updates clearly:

> "Based on this session, I propose the following updates:
>
> 1. **Add rule to `.agent/rules/project.md`:**
>    'Always run tests before committing in this project'
>    *Rationale: I forgot to run tests twice today*
>
> 2. **Update `skills/deploy/SKILL.md`:**
>    Add step to check environment variables
>    *Rationale: Deployment failed due to missing env var*
>
> Do you approve these updates?"

### Step 6: Persist Changes

After approval:

1. Make the changes to files
2. Update `last_updated` dates
3. Consider git commit with descriptive message:
   ```
   reflect: learned [brief description]
   
   - Added rule about [X]
   - Updated [skill] workflow
   ```

## When to Reflect

### Natural Breakpoints

- After completing a feature or bugfix
- After resolving a user-reported issue
- After a task required multiple attempts
- At end of work session

### Explicit Triggers

User can invoke: "Please reflect on this session",
"/reflect"

### Automatic Consideration

This skill's description in `skills.md` ensures the agent is aware it should consider reflection at appropriate moments.

## Safety Guardrails

1. **Human-in-the-loop:** Always ask before persisting
2. **Version control:** Changes should be git-tracked
3. **Reversibility:** User can rollback via git
4. **Transparency:** Explain rationale for each proposal

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Make changes silently | Always present for approval |
| Over-generalize from one event | Look for patterns across sessions |
| Add rules that conflict | Check existing rules first |
| Create overly specific rules | Abstract to useful generalizations |

## Integration Points

- **`document` skill:** Update documentation when behavior changes
- **`audit` skill:** Reflection may reveal skill gaps
- **`skill-authoring`:** Create new skills when patterns emerge

## Example Reflection

**Session summary:** Built a React component, initially used class syntax, user corrected to use hooks.

**Critic analysis:**
- Correction detected: "Use hooks, not classes"
- Pattern: This project uses functional components
- Learning category: Project-specific rule

**Proposed update:**
```markdown
## Proposed Update

**Type:** Rule
**Location:** `.agent/rules/project.md`

**Proposed change:**
Add: "This project uses React functional components with hooks. Do not use class components."

**Rationale:** User corrected class component usage during component creation.
```
