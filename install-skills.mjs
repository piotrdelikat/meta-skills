#!/usr/bin/env node

/**
 * Meta-Skills Installer
 *
 * Composable postinstall script that merges skills into agent directories.
 * - Never overwrites skills installed by other packages
 * - Tracks ownership via per-package manifest files
 * - Robust project root detection (handles node_modules correctly)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_NAME = "meta-skills";
const SKILLS_SOURCE = path.join(__dirname, "skills");
const MANIFEST_NAME = `.${PACKAGE_NAME}-manifest.json`;

const AGENT_DIRS = [
  { name: "Antigravity", skillsDir: ".agent/skills", rulesDir: ".agent/rules" },
  { name: "OpenCode", skillsDir: ".opencode/skill", rulesDir: null },
  { name: "Windsurf", skillsDir: ".windsurf/skills", rulesDir: null },
  { name: "Claude Code", skillsDir: ".claude/skills", rulesDir: null },
];

function findProjectRoot() {
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }

  const scriptDir = __dirname;
  if (scriptDir.includes("node_modules")) {
    let dir = path.dirname(scriptDir);
    while (dir !== path.parse(dir).root) {
      if (
        fs.existsSync(path.join(dir, "package.json")) &&
        !dir.includes("node_modules")
      ) {
        return dir;
      }
      dir = path.dirname(dir);
    }
  }

  const cwd = process.cwd();
  if (
    fs.existsSync(path.join(cwd, "package.json")) &&
    !cwd.includes("node_modules")
  ) {
    return cwd;
  }

  let dir = __dirname;
  while (dir !== path.parse(dir).root) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath) && !dir.includes("node_modules")) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        if (pkg.name !== PACKAGE_NAME) {
          return dir;
        }
      } catch {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }

  return cwd;
}

function getPackageSkillNames() {
  if (!fs.existsSync(SKILLS_SOURCE)) {
    return [];
  }
  return fs.readdirSync(SKILLS_SOURCE).filter((item) => {
    const itemPath = path.join(SKILLS_SOURCE, item);
    return fs.statSync(itemPath).isDirectory();
  });
}

function parseSkillFrontmatter(skillPath) {
  const skillMdPath = path.join(skillPath, "SKILL.md");
  if (!fs.existsSync(skillMdPath)) {
    return null;
  }

  const content = fs.readFileSync(skillMdPath, "utf-8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = frontmatterMatch[1];
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);

  let description = "No description available";
  const descLineMatch = frontmatter.match(/^description:\s*(.*)$/m);

  if (descLineMatch) {
    if (descLineMatch[1].trim() === "|" || descLineMatch[1].trim() === "") {
      const lines = frontmatter.split("\n");
      const descIndex = lines.findIndex((l) => l.startsWith("description:"));
      if (descIndex !== -1) {
        const descLines = [];
        for (let i = descIndex + 1; i < lines.length; i++) {
          if (lines[i].match(/^[ \t]+/)) {
            descLines.push(lines[i].trim());
          } else {
            break;
          }
        }
        if (descLines.length > 0) {
          description = descLines.join(" ");
        }
      }
    } else {
      description = descLineMatch[1].trim();
    }
  }

  return {
    name: nameMatch ? nameMatch[1].trim() : path.basename(skillPath),
    description: description,
  };
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function deleteRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      deleteRecursive(p);
    } else {
      fs.unlinkSync(p);
    }
  }
  fs.rmdirSync(dir);
}

function readManifest(skillsDir) {
  const manifestPath = path.join(skillsDir, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) {
    return { version: null, installedAt: null, skills: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch {
    return { version: null, installedAt: null, skills: [] };
  }
}

function writeManifest(skillsDir, skills) {
  const manifestPath = path.join(skillsDir, MANIFEST_NAME);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
  );
  const manifest = {
    version: pkg.version,
    installedAt: new Date().toISOString(),
    skills,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function installToAgent(projectRoot, agent, packageSkillNames) {
  const skillsDir = path.join(projectRoot, agent.skillsDir);
  fs.mkdirSync(skillsDir, { recursive: true });

  const manifest = readManifest(skillsDir);
  const manifestSkills = new Set(manifest.skills || []);
  const currentSkills = new Set(packageSkillNames);

  let installed = 0;
  let updated = 0;
  let skipped = 0;
  let removed = 0;
  const installedSkills = [];

  for (const skillName of packageSkillNames) {
    const targetPath = path.join(skillsDir, skillName);
    const sourcePath = path.join(SKILLS_SOURCE, skillName);

    if (fs.existsSync(targetPath)) {
      if (!manifestSkills.has(skillName)) {
        console.log(
          `  ⚠️  Skipping "${skillName}" (owned by another package)`
        );
        skipped++;
        continue;
      }
      deleteRecursive(targetPath);
      updated++;
    } else {
      installed++;
    }

    copyRecursive(sourcePath, targetPath);
    installedSkills.push(skillName);
  }

  const skillsToRemove = (manifest.skills || []).filter(
    (s) => !currentSkills.has(s)
  );
  for (const skillName of skillsToRemove) {
    const targetPath = path.join(skillsDir, skillName);
    if (fs.existsSync(targetPath)) {
      deleteRecursive(targetPath);
      removed++;
    }
  }

  writeManifest(skillsDir, installedSkills);
  return { installed, updated, skipped, removed };
}

function syncClaudeMd(projectRoot) {
  const agentsMd = path.join(projectRoot, "AGENTS.md");
  const claudeMd = path.join(projectRoot, "CLAUDE.md");

  if (fs.existsSync(agentsMd) && !fs.existsSync(claudeMd)) {
    fs.copyFileSync(agentsMd, claudeMd);
    return true;
  }
  return false;
}

function updateGitignore(projectRoot) {
  const gitignorePath = path.join(projectRoot, ".gitignore");
  const entries = [
    "",
    "# Agent & AI Tools",
    ".agent/",
    ".claude/",
    ".opencode/",
    ".windsurf/",
  ];

  let existingContent = "";
  if (fs.existsSync(gitignorePath)) {
    existingContent = fs.readFileSync(gitignorePath, "utf-8");
  }

  if (existingContent.includes("# Agent & AI Tools")) {
    return;
  }

  const newContent = existingContent + entries.join("\n") + "\n";
  fs.writeFileSync(gitignorePath, newContent);
  console.log(`✅ .gitignore updated with agent entries`);
}

async function install() {
  try {
    const projectRoot = findProjectRoot();
    const packageSkillNames = getPackageSkillNames();

    if (packageSkillNames.length === 0) {
      console.warn("⚠️ No skills found in package");
      return;
    }

    console.log(`📦 Installing meta-skills to: ${projectRoot}`);
    console.log("");

    let totalInstalled = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalRemoved = 0;
    let agentsConfigured = 0;

    for (const agent of AGENT_DIRS) {
      const { installed, updated, skipped, removed } = installToAgent(
        projectRoot,
        agent,
        packageSkillNames
      );

      if (installed > 0 || updated > 0 || skipped > 0 || removed > 0) {
        const parts = [];
        if (installed > 0) parts.push(`${installed} new`);
        if (updated > 0) parts.push(`${updated} updated`);
        if (skipped > 0) parts.push(`${skipped} skipped`);
        if (removed > 0) parts.push(`${removed} removed`);
        console.log(
          `✅ ${agent.name} (${agent.skillsDir}): ${parts.join(", ")}`
        );
        totalInstalled += installed;
        totalUpdated += updated;
        totalSkipped += skipped;
        totalRemoved += removed;
        agentsConfigured++;
      }
    }

    if (syncClaudeMd(projectRoot)) {
      console.log("📄 Created CLAUDE.md (copy of AGENTS.md)");
    }

    updateGitignore(projectRoot);

    console.log("");
    console.log(`✅ Meta-skills installed!`);
    console.log(
      `   ${packageSkillNames.length} skills → ${agentsConfigured} agent directories`
    );
    console.log(`   Skills: ${packageSkillNames.join(", ")}`);
    if (totalSkipped > 0) {
      console.log(
        `   ${totalSkipped} skill(s) skipped (owned by other packages)`
      );
    }
  } catch (err) {
    console.error("❌ Error installing meta-skills:", err.message);
    process.exit(1);
  }
}

install();
