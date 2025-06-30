#!/usr/bin/env node

/**
 * DreamSpeak Clean Backup Script
 * Creates a backup excluding QR codes and temp files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCLUDE_PATTERNS = [
  /qr.*\.(png|svg|html|js)$/i,
  /.*qr.*$/i,
  /dream-decoder.*\.(png|svg)$/i,
  /dreamspeak.*qr.*$/i,
  /final-qr-code\./i,
  /deployment.*qr/i,
  /create-qr/i,
  /generate.*qr/i,
  /monitor-deployment/i,
  /test-and-generate/i,
  /display-qr/i,
  /simple-qr/i,
  /\.cache/,
  /\.local/,
  /\.upm/,
  /node_modules/,
  /\.git/,
  /backups/,
  /DUPLICATE_PWA/
];

function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(fileName) || pattern.test(filePath));
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (shouldExclude(srcPath)) {
      continue; // Skip this file/directory
    }

    if (item.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createCleanBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `dreamspeak-clean-${timestamp}`;
  const backupPath = path.join(__dirname, 'backups', backupName);

  console.log(`🧹 Creating clean backup: ${backupName}`);

  // Create backup directory
  fs.mkdirSync(backupPath, { recursive: true });

  // Copy essential files
  const essentialFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'components.json',
    'drizzle.config.ts',
    'replit.md',
    'GITHUB_SETUP.md',
    '.replit'
  ];

  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(backupPath, file));
    }
  });

  // Copy essential directories
  const essentialDirs = ['client', 'server', 'shared'];
  
  essentialDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDirectory(dir, path.join(backupPath, dir));
    }
  });

  // Copy lips.svg (your logo)
  if (fs.existsSync('lips.svg')) {
    fs.copyFileSync('lips.svg', path.join(backupPath, 'lips.svg'));
  }

  // Create project summary
  const summary = {
    projectName: "DreamSpeak - Jungian Dream Analysis",
    backupDate: new Date().toISOString(),
    description: "Clean backup of core application files",
    contents: {
      "Essential Files": essentialFiles.filter(f => fs.existsSync(f)),
      "Core Directories": essentialDirs,
      "Features": [
        "AI-powered Jungian dream analysis",
        "Chessie V3 voice synthesis",
        "Mobile iPhone compatibility",
        "Interactive dream journaling",
        "OpenAI GPT-4o integration",
        "ElevenLabs voice API"
      ]
    },
    excludedItems: "QR codes, temporary files, caches, duplicates"
  };

  fs.writeFileSync(
    path.join(backupPath, 'README.md'),
    `# DreamSpeak - AI Dream Analysis Platform

${summary.description}

## Features
${summary.contents.Features.map(f => `- ${f}`).join('\n')}

## Project Structure
- \`client/\` - React frontend with TypeScript
- \`server/\` - Express.js backend
- \`shared/\` - Shared types and schemas
- Configuration files for Vite, Tailwind, Drizzle ORM

## Backup Date
${summary.backupDate}
`
  );

  console.log(`✅ Clean backup created: ${backupPath}`);
  console.log(`📁 Contains only essential DreamSpeak application files`);
  
  return backupPath;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const backupPath = createCleanBackup();
  console.log(`🎯 Ready for GitHub upload: ${path.basename(backupPath)}`);
}

export { createCleanBackup };