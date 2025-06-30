# DreamSpeak GitHub Backup Setup

## Quick Setup (Recommended)

### Method 1: Use Replit's Git Integration

1. **Open Version Control in Replit**
   - Click the Git icon in the left sidebar (branching symbol)
   - Or press `Ctrl+Shift+G`

2. **Connect to GitHub**
   - Click "Create a Git repository"
   - Choose "Create a new repository on GitHub"
   - Repository name: `dreamspeak-jungian-analysis`
   - Set to **Private** (recommended)
   - Click "Create & Connect"

3. **Make Initial Commit**
   - Add commit message: "Initial DreamSpeak setup - voice-enabled dream analysis"
   - Select all files to include
   - Click "Commit & Push"

### Method 2: Manual GitHub Setup

1. **Create GitHub Repository**
   - Go to github.com → New repository
   - Name: `dreamspeak-app`
   - Private repository
   - Don't initialize with README

2. **Use Backup Script**
   ```bash
   node backup-project.js
   ```
   - Download the backup folder
   - Upload to your GitHub repository

## Automatic Backups

### Option 1: Replit Auto-Push
- Enable in Replit Settings
- Go to your repl settings
- Turn on "Auto-save to GitHub"
- Commits happen automatically on changes

### Option 2: Scheduled Backups
Run the backup script regularly:
```bash
# Create backup manually
node backup-project.js

# Or set up a cron job (if available)
# 0 */6 * * * cd /path/to/project && node backup-project.js
```

## What Gets Backed Up

✅ **Included:**
- All source code (`client/`, `server/`, `shared/`)
- Configuration files (`package.json`, `tsconfig.json`)
- Database schema (`drizzle.config.ts`)
- Documentation (`replit.md`, `README.md`)
- Build configs (`vite.config.ts`, `tailwind.config.ts`)

❌ **Excluded:**
- `node_modules/` (can be reinstalled)
- Environment variables (`.env` files)
- Build outputs (`dist/`, `build/`)
- Logs and temporary files

## Security Notes

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Keep repository private for personal projects
- Review files before committing

## Restore Instructions

To restore your project:
1. Clone from GitHub: `git clone [repository-url]`
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:push`
5. Start development: `npm run dev`

## Repository Structure

```
dreamspeak-app/
├── client/           # React frontend
├── server/           # Express backend  
├── shared/           # Shared types/schemas
├── package.json      # Dependencies
├── replit.md         # Project documentation
└── backup-project.js # Backup utility
```