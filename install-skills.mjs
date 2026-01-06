#!/usr/bin/env node

/**
 * Meta-Skills Installer
 * 
 * Postinstall script that copies skills to the target project's .agent or .claude directory.
 * Only overwrites skills with the same name as those in this package.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SKILLS_SOURCE = path.join(__dirname, "skills");
const RULES_TEMPLATE = path.join(__dirname, "templates", "skills.md.template");
const MARKER_START = "<!-- META-SKILLS:START -->";
const MARKER_END = "<!-- META-SKILLS:END -->";

/**
 * Find the project root - npm sets INIT_CWD to the directory where npm was run
 */
function findProjectRoot() {
  // INIT_CWD is set by npm to the original working directory
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }
  
  // Fallback: walk up from script location to find package.json outside node_modules
  let dir = __dirname;
  while (dir !== path.parse(dir).root) {
    if (
      fs.existsSync(path.join(dir, "package.json")) &&
      !dir.includes("node_modules")
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

/**
 * Find the agent directory (.agent or .claude)
 */
function findAgentDir(projectRoot) {
  const candidates = [".agent", ".claude"];
  
  for (const candidate of candidates) {
    const candidatePath = path.join(projectRoot, candidate);
    if (fs.existsSync(candidatePath)) {
      return { path: candidatePath, name: candidate };
    }
  }
  
  // Default to .agent if neither exists
  return { path: path.join(projectRoot, ".agent"), name: ".agent" };
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
  
  // Parse name
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  
  // Parse description (handles multi-line YAML with | or plain values)
  let description = "No description available";
  const descLineMatch = frontmatter.match(/^description:\s*(.*)$/m);
  
  if (descLineMatch) {
    if (descLineMatch[1].trim() === "|" || descLineMatch[1].trim() === "") {
      // Multi-line: collect indented lines after "description:"
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
      // Single line description
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
 * Generate the skills table markdown for our package skills
 */
function generateSkillsTable(skillsDir) {
  const packageSkillNames = getPackageSkillNames();
  const rows = [];
  
  for (const skillName of packageSkillNames) {
    const skillPath = path.join(skillsDir, skillName);
    const meta = parseSkillFrontmatter(skillPath);
    
    if (meta) {
      rows.push(`| **${meta.name}** | [skills/${skillName}/SKILL.md](./skills/${skillName}/SKILL.md) | ${meta.description} |`);
    }
  }
  
  return rows.join("\n");
}

/**
 * Update or create the skills.md file with our package skills
 */
function updateSkillsMd(rulesDir, skillsDir) {
  const skillsMdPath = path.join(rulesDir, "skills.md");
  const skillsTable = generateSkillsTable(skillsDir);
  
  const packageSection = `${MARKER_START}
## Meta-Skills (Installed Package)

| Skill | Path | Description |
|-------|------|-------------|
${skillsTable}
${MARKER_END}`;

  if (fs.existsSync(skillsMdPath)) {
    let content = fs.readFileSync(skillsMdPath, "utf-8");
    
    // Check if we have existing markers
    const markerRegex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, "g");
    
    if (markerRegex.test(content)) {
      // Replace existing section
      content = content.replace(markerRegex, packageSection);
    } else {
      // Append to end
      content = content.trimEnd() + "\n\n" + packageSection + "\n";
    }
    
    fs.writeFileSync(skillsMdPath, content);
  } else {
    // Create new skills.md with frontmatter
    const newContent = `---
trigger: always_on
---

# Agent Skills

This file indexes available agent skills.

${packageSection}
`;
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.writeFileSync(skillsMdPath, newContent);
  }
}

/**
 * Main installation function
 */
async function install() {
  try {
    const projectRoot = findProjectRoot();
    const agentDir = findAgentDir(projectRoot);
    const skillsDir = path.join(agentDir.path, "skills");
    const rulesDir = path.join(agentDir.path, "rules");
    
    console.log(`📦 Installing meta-skills to: ${agentDir.path}`);
    
    // Get list of skills in our package
    const packageSkillNames = getPackageSkillNames();
    
    if (packageSkillNames.length === 0) {
      console.warn("⚠️ No skills found in package");
      return;
    }
    
    // Create skills directory if it doesn't exist
    fs.mkdirSync(skillsDir, { recursive: true });
    
    // Only remove and replace skills that have the same name as ours
    for (const skillName of packageSkillNames) {
      const targetSkillPath = path.join(skillsDir, skillName);
      const sourceSkillPath = path.join(SKILLS_SOURCE, skillName);
      
      // Remove existing skill with same name (clean update)
      if (fs.existsSync(targetSkillPath)) {
        console.log(`  🔄 Updating skill: ${skillName}`);
        deleteRecursive(targetSkillPath);
      } else {
        console.log(`  ➕ Installing skill: ${skillName}`);
      }
      
      // Copy fresh version
      copyRecursive(sourceSkillPath, targetSkillPath);
    }
    
    // Update skills.md index
    updateSkillsMd(rulesDir, skillsDir);
    
    console.log(`✅ Meta-skills installed! (${packageSkillNames.length} skills)`);
    console.log(`   Skills: ${packageSkillNames.join(", ")}`);
    
  } catch (err) {
    console.error("❌ Error installing meta-skills:", err.message);
    process.exit(1);
  }
}

install();
