#!/usr/bin/env node

/**
 * Meta-Skills Installer
 * 
 * Postinstall script that copies skills to all agent/IDE directories.
 * Supports: OpenCode, Windsurf, Antigravity, Claude Code
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SKILLS_SOURCE = path.join(__dirname, "skills");
const PACKAGE_NAME = "meta-skills";

// All agent skill directories to install to
const AGENT_DIRS = [
  { name: "Antigravity", skillsDir: ".agent/skills", rulesDir: ".agent/rules" },
  { name: "OpenCode", skillsDir: ".opencode/skill", rulesDir: null },
  { name: "Windsurf", skillsDir: ".windsurf/skills", rulesDir: null },
  { name: "Claude Code", skillsDir: ".claude/skills", rulesDir: null },
];

/**
 * Find the project root
 * Priority: 1) INIT_CWD (npm sets this), 2) cwd(), 3) walk up from script
 */
function findProjectRoot() {
  // INIT_CWD is set by npm to the original working directory
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }
  
  // Use current working directory (for manual runs)
  const cwd = process.cwd();
  
  // If cwd has package.json and isn't in node_modules, use it
  if (fs.existsSync(path.join(cwd, "package.json")) && !cwd.includes("node_modules")) {
    return cwd;
  }
  
  // Fallback: walk up from script location
  let dir = __dirname;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "package.json")) && !dir.includes("node_modules")) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  
  return cwd;
}

/**
 * Get list of skill names from the source package
 */
function getPackageSkillNames() {
  if (!fs.existsSync(SKILLS_SOURCE)) {
    return [];
  }
  return fs.readdirSync(SKILLS_SOURCE).filter((item) => {
    const itemPath = path.join(SKILLS_SOURCE, item);
    return fs.statSync(itemPath).isDirectory();
  });
}

/**
 * Parse YAML frontmatter from a SKILL.md file
 */
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
      const descIndex = lines.findIndex(l => l.startsWith("description:"));
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
    description: description
  };
}

/**
 * Recursively copy a directory
 */
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

/**
 * Recursively delete a directory
 */
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

/**
 * Install skills to a single agent directory
 */
function installToAgent(projectRoot, agent, packageSkillNames, verbose = true) {
  const skillsDir = path.join(projectRoot, agent.skillsDir);
  let installed = 0;
  let updated = 0;
  
  // Create skills directory
  fs.mkdirSync(skillsDir, { recursive: true });
  
  for (const skillName of packageSkillNames) {
    const targetSkillPath = path.join(skillsDir, skillName);
    const sourceSkillPath = path.join(SKILLS_SOURCE, skillName);
    
    if (fs.existsSync(targetSkillPath)) {
      deleteRecursive(targetSkillPath);
      updated++;
    } else {
      installed++;
    }
    
    copyRecursive(sourceSkillPath, targetSkillPath);
  }
  
  // Write version file for tracking
  const versionFile = path.join(skillsDir, ".meta-skills-version");
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
  fs.writeFileSync(versionFile, JSON.stringify({
    version: pkg.version,
    installedAt: new Date().toISOString(),
    skills: packageSkillNames,
  }, null, 2));
  
  return { installed, updated };
}

/**
 * Sync CLAUDE.md from AGENTS.md for Claude Code compatibility
 */
function syncClaudeMd(projectRoot) {
  const agentsMd = path.join(projectRoot, "AGENTS.md");
  const claudeMd = path.join(projectRoot, "CLAUDE.md");
  
  if (fs.existsSync(agentsMd) && !fs.existsSync(claudeMd)) {
    fs.copyFileSync(agentsMd, claudeMd);
    return true;
  }
  return false;
}

/**
 * Main installation function
 */
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
    let agentsConfigured = 0;
    
    // Install to all agent directories
    for (const agent of AGENT_DIRS) {
      const { installed, updated } = installToAgent(projectRoot, agent, packageSkillNames, true);
      
      if (installed > 0 || updated > 0) {
        const status = updated > 0 ? "🔄" : "✅";
        console.log(`${status} ${agent.name} (${agent.skillsDir}): ${installed + updated} skills`);
        totalInstalled += installed;
        totalUpdated += updated;
        agentsConfigured++;
      }
    }
    
    // Sync CLAUDE.md if AGENTS.md exists
    if (syncClaudeMd(projectRoot)) {
      console.log("📄 Created CLAUDE.md (copy of AGENTS.md)");
    }
    
    console.log("");
    console.log(`✅ Meta-skills installed!`);
    console.log(`   ${packageSkillNames.length} skills → ${agentsConfigured} agent directories`);
    console.log(`   Skills: ${packageSkillNames.join(", ")}`);
    
  } catch (err) {
    console.error("❌ Error installing meta-skills:", err.message);
    process.exit(1);
  }
}

install();
