# Skill Merge Workflow

When audit identifies similar skills that should be combined.

## When to Merge

Merge two skills when:
- They address the same problem domain
- They have overlapping workflows
- Users are confused about which to use
- Combined skill would still be under 500 lines

**Don't merge if:**
- Skills serve different audiences (beginner vs advanced)
- One is project-specific, other is universal
- Combined complexity would be overwhelming

## Pre-Merge Checklist

```
Merge Preparation:
- [ ] Identify all skills to merge (usually 2, rarely 3+)
- [ ] Read both SKILL.md files completely
- [ ] List all unique workflows from each
- [ ] Identify duplicate/overlapping content
- [ ] Choose merged skill name
- [ ] Get user approval for merge plan
```

## Merge Process

### Step 1: Analyze Skills

For each skill being merged, document:

| Aspect | Skill A | Skill B |
|--------|---------|---------|
| **Name** | [name] | [name] |
| **Primary workflow** | [workflow] | [workflow] |
| **Unique features** | [list] | [list] |
| **Overlapping features** | [list] | [list] |
| **Supporting files** | [count] | [count] |
| **Last updated** | [date] | [date] |

### Step 2: Design Merged Structure

**Choose the best name:**
- Use the more descriptive name
- Or create new name that encompasses both
- Avoid generic names like "utilities"

**Plan the merged SKILL.md:**

```markdown
---
name: [merged-name]
description: |
  [Combined description covering both use cases]
supersedes: [skill-a, skill-b]  # Track what was merged
---

# [Merged Name]

## Quick Start
[Simplest path - usually from whichever skill had better onboarding]

## Workflows

### [Workflow 1 from Skill A]
[Keep if unique or better than Skill B's version]

### [Workflow 2 from Skill B]
[Keep if unique]

### [Combined Workflow]
[If both had similar workflows, merge the best parts]
```

### Step 3: Create Merged Skill

```bash
# Create new skill directory
mkdir -p .agent/skills/[merged-name]

# Start with the better-structured skill as base
cp .agent/skills/[skill-a]/SKILL.md .agent/skills/[merged-name]/SKILL.md
```

**Merge the content:**

1. **Frontmatter:** Combine descriptions, add `supersedes:` field
2. **Quick Start:** Use the clearer version
3. **Workflows:** Include all unique workflows
4. **Deduplicate:** Where workflows overlap, keep the better explanation
5. **Supporting files:** Copy all templates, scripts, references from both

### Step 4: Migrate Supporting Files

```bash
# Copy unique files from both skills
cp -r .agent/skills/[skill-a]/templates/* .agent/skills/[merged-name]/templates/
cp -r .agent/skills/[skill-b]/scripts/* .agent/skills/[merged-name]/scripts/

# Review for duplicates - keep the better version
```

### Step 5: Update Cross-References

Search for references to old skills:

```bash
# Find all references
grep -r "skill-a" .agent/
grep -r "skill-b" .agent/
```

Update:
- Links in other SKILL.md files
- References in project rules
- Documentation that mentions the skills

### Step 6: Update Skills Index

Edit `.agent/rules/skills.md`:

```diff
- | **skill-a** | [path] | [description] |
- | **skill-b** | [path] | [description] |
+ | **merged-name** | [path] | [combined description] |
```

### Step 7: Archive Old Skills

**Don't delete immediately** - move to archive:

```bash
mkdir -p .agent/archive/merged-[date]
mv .agent/skills/[skill-a] .agent/archive/merged-[date]/
mv .agent/skills/[skill-b] .agent/archive/merged-[date]/

# Create archive note
cat > .agent/archive/merged-[date]/README.md << EOF
# Merged Skills Archive

Date: [DATE]
Merged into: [merged-name]

These skills were merged because:
[reason]

Original skills preserved here for reference.
EOF
```

### Step 8: Test and Commit

```bash
# Verify merged skill
cat .agent/skills/[merged-name]/SKILL.md

# Commit with clear message
git add .agent/
git commit -m "merge: combined [skill-a] and [skill-b] into [merged-name]

- Merged overlapping workflows
- Preserved unique features from both
- Archived original skills for reference"
```

## Example Merge

**Scenario:** `deploy-frontend` and `deploy-backend` both have similar deployment steps.

**Analysis:**
- Both use similar CI/CD patterns
- Both check environment variables
- Both have rollback procedures
- Main difference: build commands

**Solution:** Merge into `deploy`

```markdown
---
name: deploy
description: |
  Deploy frontend and backend services with CI/CD automation,
  environment validation, and rollback procedures.
supersedes: [deploy-frontend, deploy-backend]
---

# Deploy

## Workflows

### Deploy Frontend
[Frontend-specific steps]

### Deploy Backend
[Backend-specific steps]

### Common: Pre-Deploy Checklist
[Shared validation steps]

### Common: Rollback
[Shared rollback procedure]
```

## Post-Merge Validation

After merge, verify:
- [ ] All workflows from original skills are preserved
- [ ] No broken links in the merged skill
- [ ] Supporting files are accessible
- [ ] Skills index is updated
- [ ] Other skills' references are updated
- [ ] Git history shows clear merge reasoning
