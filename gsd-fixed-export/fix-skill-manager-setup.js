#!/usr/bin/env node
/**
 * Fix skill-manager/setup.js for Trae CN
 * Usage: node fix-skill-manager-setup.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const TRAE_CN_DIR = path.join(HOME, '.trae-cn');
const SETUP_JS_PATH = path.join(TRAE_CN_DIR, 'skills', 'skill-manager', 'setup.js');

function main() {
  console.log('Fixing skill-manager/setup.js for Trae CN...');
  console.log('');
  console.log('Target: ' + SETUP_JS_PATH);
  console.log('');
  
  if (!fs.existsSync(SETUP_JS_PATH)) {
    console.log('ERROR: setup.js not found');
    process.exit(1);
  }
  
  let content = fs.readFileSync(SETUP_JS_PATH, 'utf-8');
  
  // Check if already fixed
  if (content.includes('function getConfigDir()')) {
    console.log('Already fixed! Found getConfigDir function.');
    return;
  }
  
  // Find and replace the hardcoded path
  const oldCode = "const HOME = os.homedir();\nconst CLAUDE_DIR = path.join(HOME, '.claude');";
  const newCode = `const HOME = os.homedir();

function getConfigDir() {
  const traeCnDir = path.join(HOME, '.trae-cn');
  if (fs.existsSync(traeCnDir)) return traeCnDir;
  const claudeDir = path.join(HOME, '.claude');
  if (fs.existsSync(claudeDir)) return claudeDir;
  return traeCnDir;
}

const CLAUDE_DIR = getConfigDir();`;
  
  if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(SETUP_JS_PATH, content);
    console.log('SUCCESS: Fixed skill-manager/setup.js');
  } else {
    // Try alternative approach - replace line by line
    const lines = content.split('\n');
    let fixed = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("const CLAUDE_DIR = path.join(HOME, '.claude');")) {
        // Insert getConfigDir function before this line
        const insertLines = [
          '',
          'function getConfigDir() {',
          '  const traeCnDir = path.join(HOME, \'.trae-cn\');',
          '  if (fs.existsSync(traeCnDir)) return traeCnDir;',
          '  const claudeDir = path.join(HOME, \'.claude\');',
          '  if (fs.existsSync(claudeDir)) return claudeDir;',
          '  return traeCnDir;',
          '}',
          '',
        ];
        
        lines.splice(i, 0, ...insertLines);
        lines[i + insertLines.length] = lines[i + insertLines.length].replace(
          "const CLAUDE_DIR = path.join(HOME, '.claude');",
          'const CLAUDE_DIR = getConfigDir();'
        );
        
        fixed = true;
        break;
      }
    }
    
    if (fixed) {
      content = lines.join('\n');
      fs.writeFileSync(SETUP_JS_PATH, content);
      console.log('SUCCESS: Fixed skill-manager/setup.js (alternative method)');
    } else {
      console.log('ERROR: Could not find pattern to fix');
    }
  }
  
  // Verify the fix
  content = fs.readFileSync(SETUP_JS_PATH, 'utf-8');
  if (content.includes('getConfigDir') && content.includes('.trae-cn')) {
    console.log('');
    console.log('VERIFIED: setup.js now supports .trae-cn');
  } else {
    console.log('');
    console.log('WARNING: Fix may not have been applied correctly');
  }
}

main();
