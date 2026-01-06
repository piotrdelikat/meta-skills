# Skill Quality Checklist

Validate before publishing a skill.

## Core Quality

- [ ] **Name** is lowercase with hyphens only, max 64 chars
- [ ] **Description** includes WHAT the skill does
- [ ] **Description** includes WHEN to use it (triggers)
- [ ] **SKILL.md body** is under 500 lines
- [ ] **Quick Start** provides minimal working example
- [ ] **Workflows** have clear, numbered steps
- [ ] **Checklists** for multi-step processes

## Content Quality

- [ ] **Concise** - Only add what agent doesn't know
- [ ] **Examples** are concrete, not abstract
- [ ] **No time-sensitive info** (dates, versions)
- [ ] **Consistent terminology** throughout
- [ ] **Progressive disclosure** - links to details

## Structure

- [ ] **References one level deep** - no deeply nested links
- [ ] **Sub-docs** have table of contents if long
- [ ] **Scripts solve problems** - don't punt to agent

## If Scripts Included

- [ ] Error handling is explicit and helpful
- [ ] Required packages listed
- [ ] No hardcoded paths (use relative or env vars)
- [ ] Validation/verification steps included
- [ ] All forward slashes (no Windows paths)

## Testing

- [ ] Tested with real usage scenarios
- [ ] Works with different models (if applicable)
- [ ] Feedback incorporated
