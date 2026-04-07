#!/usr/bin/env node
/**
 * Complete fix for skill-manager and all skills for Trae CN
 * Usage: node fix-all-trae-cn.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const TRAE_CN_DIR = path.join(HOME, '.trae-cn');
const SKILLS_DIR = path.join(TRAE_CN_DIR, 'skills');
const HOOKS_DIR = path.join(TRAE_CN_DIR, 'hooks');

function main() {
  console.log('=== Complete Fix for Trae CN ===');
  console.log('');
  console.log('Target: ' + TRAE_CN_DIR);
  console.log('');
  
  if (!fs.existsSync(TRAE_CN_DIR)) {
    console.log('ERROR: .trae-cn directory not found');
    process.exit(1);
  }
  
  let totalFixed = 0;
  
  // 1. Fix skill-manager/setup.js - main file
  console.log('[1/4] Fixing skill-manager/setup.js...');
  const setupPath = path.join(SKILLS_DIR, 'skill-manager', 'setup.js');
  if (fs.existsSync(setupPath)) {
    let content = fs.readFileSync(setupPath, 'utf-8');
    
    // Fix the generated hook code - replace hardcoded paths with dynamic detection
    const oldPatterns = [
      /const LOG_FILE = path\.join\(HOME, "\.claude", "logs", "skill-usage\.log"\);/g,
      /const HOOKS_DIR = path\.join\(HOME, "\.claude", "hooks"\);/g,
      /const SKILLS_DIR = path\.join\(HOME, "\.claude", "skills"\);/g,
      /const SETTINGS_PATH = path\.join\(HOME, "\.claude", "settings\.json"\);/g,
      /path\.join\(HOME, '\.claude', 'hooks',/g,
    ];
    
    const newPatterns = [
      'const LOG_FILE = path.join(getConfigDir(), "logs", "skill-usage.log");',
      'const HOOKS_DIR = path.join(getConfigDir(), "hooks");',
      'const SKILLS_DIR = path.join(getConfigDir(), "skills");',
      'const SETTINGS_PATH = path.join(getConfigDir(), "settings.json");',
      "path.join(getConfigDir(), 'hooks',",
    ];
    
    for (let i = 0; i < oldPatterns.length; i++) {
      if (oldPatterns[i].test(content)) {
        content = content.replace(oldPatterns[i], newPatterns[i]);
        console.log('  Fixed pattern ' + (i + 1));
        totalFixed++;
      }
    }
    
    // Add getConfigDir function to generated hooks if not present
    if (content.includes('getConfigDir()') && !content.includes('function getConfigDir() {')) {
      // Add the function definition after HOME declaration in generated code
      content = content.replace(
        /'const HOME = os\.homedir\(\);'/g,
        `'const HOME = os.homedir();',`,
        `'',`,
        `'function getConfigDir() {',`,
        `'  const traeCnDir = path.join(HOME, ".trae-cn");',`,
        `'  if (fs.existsSync(traeCnDir)) return traeCnDir;',`,
        `'  const claudeDir = path.join(HOME, ".claude");',`,
        `'  if (fs.existsSync(claudeDir)) return claudeDir;',`,
        `'  return traeCnDir;',`,
        `'}',`
      );
    }
    
    fs.writeFileSync(setupPath, content);
    console.log('  DONE');
  }
  
  // 2. Fix existing hook files
  console.log('');
  console.log('[2/4] Fixing hook files...');
  if (fs.existsSync(HOOKS_DIR)) {
    const hookFiles = fs.readdirSync(HOOKS_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    for (const file of hookFiles) {
      const hookPath = path.join(HOOKS_DIR, file);
      let content = fs.readFileSync(hookPath, 'utf-8');
      if (content.includes('.claude')) {
        content = content.replace(/\.claude/g, '.trae-cn');
        fs.writeFileSync(hookPath, content);
        console.log('  FIXED: hooks/' + file);
        totalFixed++;
      }
    }
  }
  
  // 3. Fix SKILL.md files
  console.log('');
  console.log('[3/4] Fixing SKILL.md files...');
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
        console.log('  FIXED: ' + skillDir + '/SKILL.md');
        totalFixed++;
      }
    }
  }
  
  // 4. Fix other JS files in skills
  console.log('');
  console.log('[4/4] Fixing other JS files...');
  for (const skillDir of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillDir);
    const jsFiles = findJsFiles(skillPath);
    for (const jsFile of jsFiles) {
      let content = fs.readFileSync(jsFile, 'utf-8');
      // Only fix path-related hardcoded paths, not comments or documentation
      const pathPattern = /path\.join\([^)]*'\.claude'[^)]*\)/g;
      if (pathPattern.test(content)) {
        content = content.replace(pathPattern, (match) => match.replace(/'\.claude'/g, "'.trae-cn'"));
        fs.writeFileSync(jsFile, content);
        console.log('  FIXED: ' + path.relative(SKILLS_DIR, jsFile));
        totalFixed++;
      }
    }
  }
  
  console.log('');
  console.log('=== Summary ===');
  console.log('Total files fixed: ' + totalFixed);
  console.log('');
  console.log('Done!');
}

function findJsFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Skip node_modules and hidden directories
      if (item.name === 'node_modules' || item.name.startsWith('.')) continue;
      results.push(...findJsFiles(fullPath));
    } else if (item.name.endsWith('.js') || item.name.endsWith('.cjs')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

main();
