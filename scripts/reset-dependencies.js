#!/usr/bin/env node

/**
 * This script safely resets npm dependencies without using the risky --force flag
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}Starting dependency reset process...${colors.reset}\n`);

// Define paths
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const packageLockPath = path.join(process.cwd(), 'package-lock.json');

try {
  // 1. Verify npm cache (safer than cleaning)
  console.log(`${colors.yellow}Verifying npm cache integrity...${colors.reset}`);
  execSync('npm cache verify', { stdio: 'inherit' });
  
  // 2. Remove node_modules if exists
  if (fs.existsSync(nodeModulesPath)) {
    console.log(`\n${colors.yellow}Removing node_modules folder...${colors.reset}`);
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  }
  
  // 3. Remove package-lock.json if exists
  if (fs.existsSync(packageLockPath)) {
    console.log(`\n${colors.yellow}Removing package-lock.json...${colors.reset}`);
    fs.unlinkSync(packageLockPath);
  }
  
  // 4. Clean install dependencies
  console.log(`\n${colors.yellow}Installing dependencies...${colors.reset}`);
  execSync('npm install', { stdio: 'inherit' });
  
  console.log(`\n${colors.green}✓ Dependencies reset successfully!${colors.reset}`);
} catch (error) {
  console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}