# 🧠 Meta-Skills

A collection of reusable agent skills for AI-assisted development. Install once, use everywhere.

## ✨ Features

- **Modular skills**: Pick and use focused capabilities
- **Auto-install**: Skills automatically copy to your project on npm install
- **Clean updates**: Reinstalling updates only package skills, preserves your custom ones
- **Multi-agent support**: Works with OpenCode, Windsurf, Antigravity, and Claude Code

## 🤖 Agent Compatibility

| Agent | Skills Directory | Context File |
|-------|------------------|--------------|
| OpenCode | `.opencode/skill/` | `AGENTS.md` |
| Windsurf | `.windsurf/skills/` | `AGENTS.md` |
| Antigravity | `.agent/skills/` | `AGENTS.md` |
| Claude Code | `.claude/skills/` | `CLAUDE.md` |

> **Note:** All agents now support `AGENTS.md` as the standard context file.
> Use `skills-config-check --fix` to sync skills across all agent directories.

## ⚡️ Installation

### From GitHub

```bash
npm install @piotrdelikat/meta-skills
```

### From Local

```bash
npm install /path/to/meta-skills
```

The postinstall script will:
1. Detect your agent directory (`.agent/` or `.claude/`)
2. Copy skills to `{agent-dir}/skills/`
3. Update `{agent-dir}/rules/skills.md` with skill index

## 📦 Included Skills

| Skill | Description |
|-------|-------------|
| **skills-config-check** | Validate agent configuration, sync skills across IDEs |
| **skill-authoring** | Create new agent skills following best practices |
| **skill-discovery** | Analyze project gaps, propose missing skills |
| **document** | Create and maintain project documentation |
| **audit** | Assess health of installed skills |
| **reflect** | Self-improvement after task completion |

## 🔧 Configuration Check

After installing, verify your setup:

```bash
node .agent/skills/skills-config-check/scripts/check-config.mjs
```

Auto-fix missing directories and sync `CLAUDE.md`:

```bash
node .agent/skills/skills-config-check/scripts/check-config.mjs --fix
```

## 🔄 Updating

Simply reinstall to get the latest skills:

```bash
npm install meta-skills@latest
```

Only package-provided skills are updated. Your custom project skills remain untouched.

## 📁 Structure

Each skill follows this structure:

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed reference (optional)
├── EXAMPLES.md        # Usage examples (optional)
└── scripts/           # Utility scripts (optional)
```

## 🤝 Contributing

Add new skills by creating a folder in `skills/` with at least a `SKILL.md` file containing YAML frontmatter:

```yaml
---
name: my-skill
description: |
  What it does. When to use it.
---
```

## License

MIT
