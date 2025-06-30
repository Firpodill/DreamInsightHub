#!/usr/bin/env node

/**
 * DreamSpeak Project Backup Script
 * Creates a comprehensive backup of all project files
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = './backups';
const PROJECT_NAME = 'dreamspeak';

// Files and directories to include in backup
const INCLUDE_PATTERNS = [
  'client/**/*',
  'server/**/*',
  'shared/**/*',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'drizzle.config.ts',
  'replit.md',
  'components.json',
  '*.md',
  '*.txt'
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'backups',
  '*.log',
  '.env',
  '.env.local'
];

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${PROJECT_NAME}-backup-${timestamp}`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  fs.mkdirSync(backupPath, { recursive: true });

  console.log(`Creating backup: ${backupName}`);

  // Copy files
  copyDirectory('.', backupPath);

  // Create zip file
  try {
    execSync(`cd ${BACKUP_DIR} && zip -r ${backupName}.zip ${backupName}`, { stdio: 'inherit' });
    console.log(`✅ Backup created: ${backupPath}.zip`);
    
    // Clean up directory (keep zip)
    execSync(`rm -rf ${backupPath}`, { stdio: 'inherit' });
    
  } catch (error) {
    console.log(`✅ Backup directory created: ${backupPath}`);
  }

  return backupPath;
}

function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded patterns
    if (EXCLUDE_PATTERNS.some(pattern => entry.name.includes(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateProjectSummary() {
  const summary = {
    projectName: 'DreamSpeak - Jungian Dream Analysis',
    backupDate: new Date().toISOString(),
    description: 'AI-powered dream interpretation platform with voice synthesis',
    technologies: [
      'React + TypeScript',
      'Express.js + Node.js',
      'PostgreSQL + Drizzle ORM',
      'OpenAI GPT-4o',
      'ElevenLabs Voice AI',
      'Tailwind CSS'
    ],
    features: [
      'Voice-to-text dream input',
      'AI Jungian dream analysis',
      'Text-to-speech with Chessie V3 voice',
      'Interactive dream visualization',
      'Mobile-optimized interface',
      'Dream journal and insights'
    ],
    files: {
      frontend: 'client/',
      backend: 'server/', 
      shared: 'shared/',
      database: 'drizzle.config.ts',
      config: 'package.json, tsconfig.json, vite.config.ts'
    }
  };

  return JSON.stringify(summary, null, 2);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting DreamSpeak project backup...');
  
  const backupPath = createBackup();
  
  // Save project summary
  const summaryPath = path.join(BACKUP_DIR, 'project-summary.json');
  fs.writeFileSync(summaryPath, generateProjectSummary());
  
  console.log('📁 Backup completed successfully!');
  console.log(`📍 Location: ${backupPath}`);
  console.log('💡 Next steps:');
  console.log('   1. Download the backup folder');
  console.log('   2. Upload to your GitHub repository');
  console.log('   3. Set up regular backups');
}

export { createBackup, generateProjectSummary };