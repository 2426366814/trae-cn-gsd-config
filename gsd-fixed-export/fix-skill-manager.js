#!/usr/bin/env node
/**
 * Fix skill-manager for Trae CN
 * 
 * Usage: node fix-skill-manager.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const TRAE_CN_DIR = path.join(HOME, '.trae-cn');
const SKILL_MANAGER_DIR = path.join(TRAE_CN_DIR, 'skills', 'skill-manager');
const SETUP_JS_PATH = path.join(SKILL_MANAGER_DIR, 'setup.js');

function main() {
  console.log('Fixing skill-manager for Trae CN...');
  console.log('');
  
  if (!fs.existsSync(SETUP_JS_PATH)) {
    console.log('ERROR: skill-manager/setup.js not found at ' + SETUP_JS_PATH);
    process.exit(1);
  }
  
  let content = fs.readFileSync(SETUP_JS_PATH, 'utf-8');
  
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
    fs.writeFileSync(SETUP_JS_PATH, content);
    console.log('SUCCESS: Fixed skill-manager/setup.js');
    console.log('  - Added getConfigDir() function');
    console.log('  - Now supports .trae-cn directory');
  } else {
    console.log('INFO: skill-manager/setup.js already fixed or pattern not found');
  }
  
  console.log('');
  console.log('Done.');
}

main();
