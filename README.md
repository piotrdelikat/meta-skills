# 🧠 Meta-Skills

A collection of reusable agent skills for AI-assisted development. Install once, use everywhere.

## ✨ Features

- **Modular skills**: Pick and use focused capabilities
- **Auto-install**: Skills automatically copy to your project on npm install
- **Clean updates**: Reinstalling updates only package skills, preserves your custom ones
- **IDE compatible**: Works with `.agent/` and `.claude/` directories

## ⚡️ Installation

### From GitHub Packages

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
3. Update `{agent-dir}/rules/skills.md` with skill descriptions

## 📦 Included Skills

| Skill | Description |
|-------|-------------|
| **skill-authoring** | Create new agent skills following best practices |
| **skill-discovery** | Analyze project gaps, propose missing skills |

## 🔄 Updating

Simply reinstall to get the latest skills:

```bash
npm install meta-skills@latest
```

Only package-provided skills are updated. Your custom project skills remain untouched.

## 🗑️ Uninstalling

```bash
npm uninstall meta-skills
```

This removes only the skills that were installed by this package.

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
