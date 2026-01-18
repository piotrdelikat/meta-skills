# Skill Branch Workflow

When audit identifies a skill that's too broad and should be split.

## When to Branch

Branch a skill when:
- SKILL.md exceeds 500 lines
- Multiple unrelated workflows in one skill
- Skill serves both beginners and advanced users (split by level)
- Skill handles multiple distinct responsibilities
- Team members are confused about skill's scope

**Don't branch if:**
- Workflows are sequential steps of one process
- Splitting would create orphaned content
- Each branch would be too small (< 100 lines)

## Pre-Branch Checklist

```
Branch Preparation:
- [ ] Identify the overloaded skill
- [ ] List all distinct responsibilities/workflows
- [ ] Group related workflows together
- [ ] Determine branching strategy (sub-skills vs siblings)
- [ ] Choose names for new skills
- [ ] Get user approval for branch plan
```

## Branching Strategies

### Strategy 1: Core + Specializations

Best when: One fundamental workflow with advanced variations

```
Original: testing (500+ lines, covers unit, integration, e2e, performance)

Branch to:
├── testing/              # Core skill - fundamentals
│   └── SKILL.md         # Unit testing, basic concepts
├── testing-integration/  # Specialization
│   └── SKILL.md         # Integration testing patterns
└── testing-e2e/         # Specialization
    └── SKILL.md         # E2E testing workflows
```

### Strategy 2: Beginner + Advanced

Best when: Same topic, different complexity levels

```
Original: api-design (covers REST basics + advanced patterns)

Branch to:
├── api-design/          # Beginner-friendly
│   └── SKILL.md        # REST fundamentals, CRUD
└── api-design-advanced/ # Advanced patterns
    └── SKILL.md        # GraphQL, versioning, rate limiting
```

### Strategy 3: Sibling Skills

Best when: Multiple unrelated responsibilities

```
Original: backend (covers database, API, auth, caching)

Branch to:
├── database/           # Separate concern
│   └── SKILL.md
├── api/                # Separate concern
│   └── SKILL.md
└── auth/               # Separate concern
    └── SKILL.md
```

## Branch Process

### Step 1: Analyze the Overloaded Skill

Map out all content:

```markdown
# Content Inventory: [skill-name]

## Workflows
1. [Workflow A] - [Lines X-Y] - [Responsibility: ...]
2. [Workflow B] - [Lines X-Y] - [Responsibility: ...]
3. [Workflow C] - [Lines X-Y] - [Responsibility: ...]

## Supporting Files
- templates/[file] - Used by: [Workflow A, B]
- scripts/[file] - Used by: [Workflow C]

## Grouping
Group 1 (Core): Workflows A, B
Group 2 (Advanced): Workflow C
```

### Step 2: Design Branch Structure

**Choose branching strategy** (see above)

**Plan each new skill:**

| New Skill | Contains | Audience | Size |
|-----------|----------|----------|------|
| [skill-core] | [Workflows A, B] | Beginners | ~200 lines |
| [skill-advanced] | [Workflow C] | Advanced | ~300 lines |

### Step 3: Create New Skill Directories

```bash
# For core + specialization strategy
mkdir -p .agent/skills/[skill-name]
mkdir -p .agent/skills/[skill-name]-[specialization]

# For sibling strategy
mkdir -p .agent/skills/[new-skill-1]
mkdir -p .agent/skills/[new-skill-2]
```

### Step 4: Split the Content

**For each new skill:**

1. **Create SKILL.md with proper frontmatter:**

```yaml
---
name: [new-skill-name]
description: |
  [Focused description of this skill's specific responsibility]
branched_from: [original-skill]  # Track lineage
related_skills: [sibling-skill-names]  # Cross-reference
---
```

2. **Copy relevant workflows:**
   - Extract specific sections from original SKILL.md
   - Rewrite intro to focus on this skill's scope
   - Remove irrelevant workflows

3. **Distribute supporting files:**
   - Copy templates/scripts used by this skill's workflows
   - Don't duplicate - if shared, keep in core skill

### Step 5: Create Navigation

**In core skill, link to specializations:**

```markdown
# [Core Skill Name]

[Core content...]

## Advanced Topics

For specialized use cases, see:
- [Specialization A](../[skill-name]-[spec-a]/SKILL.md)
- [Specialization B](../[skill-name]-[spec-b]/SKILL.md)
```

**In specializations, link back to core:**

```markdown
# [Specialization Name]

> **Prerequisites:** Familiarity with [core skill](../[skill-name]/SKILL.md)

[Specialized content...]
```

### Step 6: Update Skills Index

Edit `.agent/rules/skills.md`:

```diff
- | **[original-skill]** | [path] | [broad description] |
+ | **[skill-core]** | [path] | [focused description] |
+ | **[skill-spec-a]** | [path] | [specialized description] |
+ | **[skill-spec-b]** | [path] | [specialized description] |
```

Group related skills visually:

```markdown
## [Category] Skills

| Skill | Path | Description |
|-------|------|-------------|
| **[core]** | [path] | Core fundamentals |
| ↳ **[spec-a]** | [path] | Advanced: [topic] |
| ↳ **[spec-b]** | [path] | Advanced: [topic] |
```

### Step 7: Archive Original Skill

```bash
mkdir -p .agent/archive/branched-[date]
mv .agent/skills/[original-skill] .agent/archive/branched-[date]/

# Create archive note
cat > .agent/archive/branched-[date]/README.md << EOF
# Branched Skill Archive

Date: [DATE]
Original: [original-skill]
Branched into:
- [new-skill-1]
- [new-skill-2]

Reason: [why it was split]

Original skill preserved here for reference.
EOF
```

### Step 8: Update Cross-References

Search for references to the original skill:

```bash
grep -r "[original-skill]" .agent/
```

Update references to point to the appropriate new skill.

### Step 9: Test and Commit

```bash
# Verify each new skill is coherent
cat .agent/skills/[new-skill-1]/SKILL.md
cat .agent/skills/[new-skill-2]/SKILL.md

# Commit with clear message
git add .agent/
git commit -m "branch: split [original-skill] into focused skills

Created:
- [new-skill-1]: [responsibility]
- [new-skill-2]: [responsibility]

Reason: Original skill was overloaded with [X] workflows
covering [Y] distinct responsibilities.

Archived original for reference."
```

## Example Branch

**Scenario:** `backend` skill has 600 lines covering database, API, auth, and caching.

**Analysis:**
- 4 distinct responsibilities
- No clear "core" - all are siblings
- Each could be 150-200 lines

**Solution:** Branch into sibling skills

```
backend/ (archived)
  ↓
├── database/
│   └── SKILL.md (schema design, migrations, queries)
├── api/
│   └── SKILL.md (REST endpoints, validation, error handling)
├── auth/
│   └── SKILL.md (authentication, authorization, sessions)
└── caching/
    └── SKILL.md (cache strategies, invalidation, Redis)
```

Each new skill:
- Has `related_skills:` pointing to siblings
- References others when workflows interact
- Maintains focused scope

## Post-Branch Validation

After branching, verify:
- [ ] All content from original skill is preserved
- [ ] Each new skill has clear, focused scope
- [ ] Cross-references between related skills work
- [ ] Skills index shows relationship structure
- [ ] No orphaned supporting files
- [ ] Git history shows clear branching reasoning
- [ ] Each new skill is usable standalone
