#!/usr/bin/env node

/**
 * DreamSpeak Minimal Backup Script
 * Creates the smallest possible backup for GitHub upload
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createMinimalBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `dreamspeak-minimal-${timestamp}`;
  const backupPath = path.join(__dirname, 'backups', backupName);

  console.log(`📦 Creating minimal backup: ${backupName}`);

  // Create backup directory
  fs.mkdirSync(backupPath, { recursive: true });

  // Copy only essential config files (exclude large package-lock.json)
  const essentialFiles = [
    'package.json',
    'tsconfig.json', 
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'components.json',
    'drizzle.config.ts',
    'replit.md'
  ];

  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(backupPath, file));
    }
  });

  // Copy core directories
  const coreDirs = ['client', 'server', 'shared'];
  
  coreDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDirectory(dir, path.join(backupPath, dir));
    }
  });

  // Create installation instructions
  const installInstructions = `# DreamSpeak - AI Dream Analysis Platform

## Quick Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Required Environment Variables
- OPENAI_API_KEY
- ELEVENLABS_API_KEY  
- DATABASE_URL

## Features
- AI-powered Jungian dream analysis
- Chessie V3 voice synthesis (default)
- Mobile iPhone compatibility
- Interactive dream journaling
- OpenAI GPT-4o integration
- ElevenLabs voice API

## Project Structure
- \`client/\` - React frontend with TypeScript
- \`server/\` - Express.js backend  
- \`shared/\` - Shared types and schemas

Built for Replit deployment with PostgreSQL database.
`;

  fs.writeFileSync(path.join(backupPath, 'README.md'), installInstructions);

  console.log(`✅ Minimal backup created: ${backupPath}`);
  console.log(`📁 Optimized for GitHub upload (no package-lock.json)`);
  
  return backupPath;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const backupPath = createMinimalBackup();
  console.log(`🚀 Ready for GitHub: ${path.basename(backupPath)}`);
}

export { createMinimalBackup };