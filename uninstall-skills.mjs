#!/usr/bin/env node

/**
 * Meta-Skills Uninstaller
 * 
 * Preuninstall script that removes only the skills installed by this package.
 * Preserves user's custom skills and updates skills.md accordingly.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SKILLS_SOURCE = path.join(__dirname, "skills");
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
  
  return null;
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
 * Remove the meta-skills section from skills.md
 */
function cleanupSkillsMd(rulesDir) {
  const skillsMdPath = path.join(rulesDir, "skills.md");
  
  if (!fs.existsSync(skillsMdPath)) {
    return;
  }
  
  let content = fs.readFileSync(skillsMdPath, "utf-8");
  
  // Remove our marked section
  const markerRegex = new RegExp(`\\n*${MARKER_START}[\\s\\S]*?${MARKER_END}\\n*`, "g");
  content = content.replace(markerRegex, "\n");
  
  // Clean up multiple consecutive newlines
  content = content.replace(/\n{3,}/g, "\n\n");
  
  fs.writeFileSync(skillsMdPath, content.trim() + "\n");
}

/**
 * Main uninstall function
 */
async function uninstall() {
  try {
    const projectRoot = findProjectRoot();
    const agentDir = findAgentDir(projectRoot);
    
    if (!agentDir) {
      console.log("📦 No agent directory found, nothing to uninstall");
      return;
    }
    
    const skillsDir = path.join(agentDir.path, "skills");
    const rulesDir = path.join(agentDir.path, "rules");
    
    console.log(`🧹 Uninstalling meta-skills from: ${agentDir.path}`);
    
    // Get list of skills in our package
    const packageSkillNames = getPackageSkillNames();
    
    if (packageSkillNames.length === 0) {
      console.warn("⚠️ No skills found in package");
      return;
    }
    
    // Only remove skills that have the same name as ours
    let removedCount = 0;
    for (const skillName of packageSkillNames) {
      const targetSkillPath = path.join(skillsDir, skillName);
      
      if (fs.existsSync(targetSkillPath)) {
        console.log(`  🗑️  Removing skill: ${skillName}`);
        deleteRecursive(targetSkillPath);
        removedCount++;
      }
    }
    
    // Clean up skills.md
    cleanupSkillsMd(rulesDir);
    
    console.log(`✅ Meta-skills uninstalled! (${removedCount} skills removed)`);
    
  } catch (err) {
    console.error("❌ Error uninstalling meta-skills:", err.message);
    // Don't exit with error on uninstall - package removal should still proceed
  }
}

uninstall();
