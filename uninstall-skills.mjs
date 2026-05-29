#!/usr/bin/env node

/**
 * Meta-Skills Uninstaller
 *
 * Removes only skills that were tracked by our manifest.
 * Preserves skills installed by other packages.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_NAME = "meta-skills";
const MANIFEST_NAME = `.${PACKAGE_NAME}-manifest.json`;

const AGENT_DIRS = [
  { name: "Antigravity", skillsDir: ".agent/skills", rulesDir: ".agent/rules" },
  { name: "OpenCode", skillsDir: ".opencode/skill", rulesDir: null },
  { name: "Windsurf", skillsDir: ".windsurf/skills", rulesDir: null },
  { name: "Claude Code", skillsDir: ".claude/skills", rulesDir: null },
];

const MARKER_START = "<!-- META-SKILLS:START -->";
const MARKER_END = "<!-- META-SKILLS:END -->";

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

function cleanupSkillsMd(rulesDir) {
  if (!rulesDir) return;
  const skillsMdPath = path.join(rulesDir, "skills.md");
  if (!fs.existsSync(skillsMdPath)) {
    return;
  }
  let content = fs.readFileSync(skillsMdPath, "utf-8");
  const markerRegex = new RegExp(
    `\\n*${MARKER_START}[\\s\\S]*?${MARKER_END}\\n*`,
    "g"
  );
  content = content.replace(markerRegex, "\n");
  content = content.replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(skillsMdPath, content.trim() + "\n");
}

async function uninstall() {
  try {
    const projectRoot = findProjectRoot();
    let totalRemoved = 0;

    console.log(`🧹 Uninstalling meta-skills from: ${projectRoot}`);

    for (const agent of AGENT_DIRS) {
      const skillsDir = path.join(projectRoot, agent.skillsDir);
      const manifestPath = path.join(skillsDir, MANIFEST_NAME);

      if (!fs.existsSync(manifestPath)) {
        continue;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      let removed = 0;

      for (const skillName of manifest.skills || []) {
        const targetPath = path.join(skillsDir, skillName);
        if (fs.existsSync(targetPath)) {
          deleteRecursive(targetPath);
          removed++;
        }
      }

      fs.unlinkSync(manifestPath);

      if (removed > 0) {
        console.log(`  🗑️  ${agent.name}: removed ${removed} skill(s)`);
        totalRemoved += removed;
      }

      // Clean up skills.md if rulesDir exists
      if (agent.rulesDir) {
        cleanupSkillsMd(path.join(projectRoot, agent.rulesDir));
      }
    }

    console.log(`✅ Meta-skills uninstalled! (${totalRemoved} skills removed)`);
  } catch (err) {
    console.error("❌ Error uninstalling meta-skills:", err.message);
  }
}

uninstall();
