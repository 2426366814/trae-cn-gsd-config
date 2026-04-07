#!/usr/bin/env node
/**
 * Fix all skills for Trae CN
 * Usage: node fix-all-skills.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const TRAE_CN_DIR = path.join(HOME, '.trae-cn');
const SKILLS_DIR = path.join(TRAE_CN_DIR, 'skills');

function main() {
  console.log('Fixing all skills for Trae CN...');
  console.log('');
  console.log('Target directory: ' + TRAE_CN_DIR);
  console.log('');
  
  if (!fs.existsSync(TRAE_CN_DIR)) {
    console.log('ERROR: .trae-cn directory not found');
    process.exit(1);
  }
  
  let totalFixed = 0;
  
  // Fix skill-manager/setup.js
  const setupPath = path.join(SKILLS_DIR, 'skill-manager', 'setup.js');
  if (fs.existsSync(setupPath)) {
    let content = fs.readFileSync(setupPath, 'utf-8');
    const oldPattern = /const HOME = os\.homedir\(\);\nconst CLAUDE_DIR = path\.join\(HOME, '\.claude'\);/;
    const newCode = `const HOME = os.homedir();

function getConfigDir() {
  const traeCnDir = path.join(HOME, '.trae-cn');
  if (fs.existsSync(traeCnDir)) return traeCnDir;
  const claudeDir = path.join(HOME, '.claude');
  if (fs.existsSync(claudeDir)) return claudeDir;
  return traeCnDir;
}

const CLAUDE_DIR = getConfigDir();`;
    
    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newCode);
      fs.writeFileSync(setupPath, content);
      console.log('FIXED: skill-manager/setup.js');
      totalFixed++;
    } else {
      console.log('SKIP: skill-manager/setup.js already fixed');
    }
  }
  
  // Fix hook files
  const hooksDir = path.join(TRAE_CN_DIR, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    for (const file of hookFiles) {
      const hookPath = path.join(hooksDir, file);
      let content = fs.readFileSync(hookPath, 'utf-8');
      if (content.includes('.claude')) {
        content = content.replace(/\.claude/g, '.trae-cn');
        fs.writeFileSync(hookPath, content);
        console.log('FIXED: hooks/' + file);
        totalFixed++;
      }
    }
  }
  
  // Fix SKILL.md files
  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  for (const skillDir of skillDirs) {
    const skillMdPath = path.join(SKILLS_DIR, skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      let content = fs.readFileSync(skillMdPath, 'utf-8');
      if (content.includes('.claude')) {
        content = content.replace(/\.claude/g, '.trae-cn');
        fs.writeFileSync(skillMdPath, content);
        console.log('FIXED: ' + skillDir + '/SKILL.md');
        totalFixed++;
      }
    }
  }
  
  console.log('');
  console.log('Done. Total files fixed: ' + totalFixed);
}

main();
