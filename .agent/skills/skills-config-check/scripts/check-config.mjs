#!/usr/bin/env node

/**
 * Skills Configuration Checker
 * 
 * Validates that agent/IDE skills are properly configured across a project.
 * Checks multiple agent directories and context files for consistency.
 */

import fs from 'fs';
import path from 'path';

// Agent/IDE configuration
const AGENTS = [
  {
    name: 'OpenCode',
    skillsDir: '.opencode/skill',
    contextFiles: ['AGENTS.md'],
  },
  {
    name: 'Windsurf',
    skillsDir: '.windsurf/skills',
    contextFiles: ['AGENTS.md'],  // Windsurf now supports AGENTS.md natively
  },
  {
    name: 'Antigravity',
    skillsDir: '.agent/skills',
    contextFiles: ['AGENTS.md'],  // Skills auto-discovered from folder
  },
  {
    name: 'Claude Code',
    skillsDir: '.claude/skills',
    contextFiles: ['CLAUDE.md'],
  },
];

/**
 * Find project root by looking for package.json
 */
function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

/**
 * Get skill names from a directory
 */
function getSkillsFromDir(skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    return null;
  }
  
  return fs.readdirSync(skillsDir).filter(item => {
    const itemPath = path.join(skillsDir, item);
    return fs.statSync(itemPath).isDirectory() && 
           fs.existsSync(path.join(itemPath, 'SKILL.md'));
  });
}

/**
 * Extract skill references from context files
 */
function extractSkillReferences(projectRoot) {
  const refs = new Set();
  
  // Collect all unique context files from all agents
  const contextFiles = new Set();
  for (const agent of AGENTS) {
    agent.contextFiles.forEach(f => contextFiles.add(f));
  }
  
  for (const file of contextFiles) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Match skill references like: skills/skill-name/SKILL.md or .agent/skills/skill-name
      const matches = content.matchAll(/skills\/([a-z0-9-]+)/gi);
      for (const match of matches) {
        refs.add(match[1]);
      }
    }
  }
  
  return [...refs];
}

/**
 * Copy skills from source to destination directory
 */
function copySkills(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) return 0;
  
  fs.mkdirSync(destDir, { recursive: true });
  const skills = getSkillsFromDir(sourceDir) || [];
  let copied = 0;
  
  for (const skill of skills) {
    const src = path.join(sourceDir, skill);
    const dest = path.join(destDir, skill);
    
    if (!fs.existsSync(dest)) {
      fs.cpSync(src, dest, { recursive: true });
      copied++;
    }
  }
  
  return copied;
}

/**
 * Main check function
 */
function checkConfig(options = {}) {
  const projectRoot = findProjectRoot();
  const { fix = false, json = false, only = null } = options;
  
  const results = {
    projectRoot,
    agents: {},
    allSkills: new Set(),
    contextRefs: [],
    issues: [],
  };
  
  // Check each agent
  for (const agent of AGENTS) {
    if (only && agent.name.toLowerCase() !== only.toLowerCase()) {
      continue;
    }
    
    const skillsDir = path.join(projectRoot, agent.skillsDir);
    const skills = getSkillsFromDir(skillsDir);
    
    results.agents[agent.name] = {
      configured: skills !== null,
      skillsDir: agent.skillsDir,
      skills: skills || [],
      count: skills?.length || 0,
    };
    
    if (skills) {
      skills.forEach(s => results.allSkills.add(s));
    }
  }
  
  // Check context files
  results.contextRefs = extractSkillReferences(projectRoot);
  
  // Find the "primary" agent (first one with skills)
  const primaryAgent = Object.entries(results.agents).find(([_, a]) => a.configured)?.[0];
  const primarySkills = primaryAgent ? results.agents[primaryAgent].skills : [];
  
  // Identify issues
  const allSkillsArray = [...results.allSkills];
  
  // Skills not in context files
  const unreferenced = allSkillsArray.filter(s => !results.contextRefs.includes(s));
  if (unreferenced.length > 0) {
    results.issues.push({
      type: 'unreferenced',
      message: `Skills not referenced in context files: ${unreferenced.join(', ')}`,
      skills: unreferenced,
    });
  }
  
  // Agents missing skills
  for (const [name, agentData] of Object.entries(results.agents)) {
    if (!agentData.configured && primaryAgent) {
      results.issues.push({
        type: 'missing_agent',
        message: `${name} not configured`,
        agent: name,
      });
    }
  }
  
  // Fix mode
  if (fix && primaryAgent) {
    const primaryDir = path.join(projectRoot, results.agents[primaryAgent].skillsDir);
    
    // Copy skills to missing agent directories
    for (const [name, agentData] of Object.entries(results.agents)) {
      if (!agentData.configured) {
        const destDir = path.join(projectRoot, agentData.skillsDir);
        const copied = copySkills(primaryDir, destDir);
        if (copied > 0) {
          console.log(`  📦 Created ${agentData.skillsDir} with ${copied} skills`);
        }
      }
    }
    
    // Sync context files: copy AGENTS.md to CLAUDE.md for Claude Code compatibility
    const agentsMd = path.join(projectRoot, 'AGENTS.md');
    const claudeMd = path.join(projectRoot, 'CLAUDE.md');
    
    if (fs.existsSync(agentsMd) && !fs.existsSync(claudeMd)) {
      fs.copyFileSync(agentsMd, claudeMd);
      console.log('  📄 Created CLAUDE.md (copy of AGENTS.md)');
    }
  }
  
  // Output
  if (json) {
    console.log(JSON.stringify({
      ...results,
      allSkills: allSkillsArray,
    }, null, 2));
    return results;
  }
  
  // Pretty output
  console.log('\n🔍 Skills Configuration Check\n');
  console.log(`📁 Project: ${projectRoot}\n`);
  
  for (const [name, agentData] of Object.entries(results.agents)) {
    const status = agentData.configured 
      ? `✅ ${name} (${agentData.skillsDir}): ${agentData.count} skills`
      : `⚠️  ${name} (${agentData.skillsDir}): Not configured`;
    console.log(status);
  }
  
  console.log(`\n📋 Context files reference: ${results.contextRefs.length} of ${allSkillsArray.length} skills`);
  
  if (unreferenced.length > 0) {
    console.log(`   Missing: ${unreferenced.join(', ')}`);
  }
  
  if (results.issues.length === 0) {
    console.log('\n✅ All checks passed!\n');
  } else {
    console.log(`\n⚠️  ${results.issues.length} issue(s) found`);
    if (!fix) {
      console.log('   Run with --fix to auto-repair\n');
    }
  }
  
  return results;
}

// Parse CLI args
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  json: args.includes('--json'),
  only: args.find(a => a.startsWith('--only='))?.split('=')[1],
};

checkConfig(options);
