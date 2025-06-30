# DreamSpeak - Jungian Dream Analysis Application

## Overview

DreamSpeak is a sophisticated dream analysis application that combines Carl Jung's psychological theories with modern AI technology. The app provides users with comprehensive dream interpretation, voice interaction capabilities, and creative visualization tools through a web-based interface optimized for both desktop and mobile experiences.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, local React state for UI
- **Build Tool**: Vite for development and production builds
- **Mobile Optimization**: Responsive design with touch-friendly interfaces

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints with consistent error handling
- **File Organization**: Modular route handlers and service layers

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Tables**: Users, dreams, chat messages with relational structure

## Key Components

### Dream Analysis Engine
- **Primary AI**: OpenAI GPT-4o for comprehensive dream interpretation
- **Analysis Framework**: Structured Jungian archetype identification and symbol interpretation
- **Output Format**: JSON responses with standardized dream analysis data
- **Context Awareness**: Previous dream analysis integration for pattern recognition

### Voice and Audio System
- **Speech Recognition**: Web Speech API for dream input transcription
- **Text-to-Speech**: 
  - ElevenLabs API for premium voice synthesis
  - Web Speech API fallback for basic functionality
- **Voice Management**: Global audio manager to prevent conflicts
- **Mobile Optimization**: Touch-friendly voice controls with visual feedback

### Storage and Data Management
- **Online Storage**: PostgreSQL database with full CRUD operations
- **Offline Capability**: Local storage backup system for network interruptions
- **Data Synchronization**: Automatic sync when connection restored
- **Export Features**: JSON backup export functionality

### Creative Tools
- **Vision Board Creator**: Drag-and-drop interface for visual dream interpretation
- **Image Generation**: DALL-E integration for dream visualization
- **Memory Capsules**: Organized dream collections with analytics

## Data Flow

1. **Dream Input**: Users input dreams via text or voice
2. **Processing**: OpenAI API analyzes content using Jungian framework
3. **Storage**: Results saved to PostgreSQL via Drizzle ORM
4. **Presentation**: Structured analysis displayed with interactive elements
5. **Enhancement**: Optional image generation and voice narration
6. **Analytics**: Aggregate data for insights and pattern recognition

## External Dependencies

### Core APIs
- **OpenAI**: GPT-4o for dream analysis and DALL-E for image generation
- **ElevenLabs**: Premium text-to-speech synthesis

### Development Tools
- **Replit**: Development environment and deployment platform
- **Neon**: Serverless PostgreSQL database hosting

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy

### Development Environment
- **Platform**: Replit with auto-reload and hot module replacement
- **Port Configuration**: Server on port 5000 with proxy setup
- **Environment Variables**: Secure API key management

### Production Deployment
- **Build Process**: Vite production build with Express server bundling
- **Static Assets**: Served via Express with proper caching headers
- **Domain**: Replit.app subdomain with HTTPS by default

### Mobile Accessibility
- **QR Code Generation**: Multiple scripts for easy mobile access
- **Responsive Design**: Mobile-first approach with touch optimization
- **PWA Considerations**: Offline functionality and app-like experience

### Version Control & Backups
- **GitHub Integration**: Automated backup system via Replit Git integration
- **Backup Script**: `backup-project.js` for manual project exports
- **Setup Guide**: `GITHUB_SETUP.md` for complete backup instructions
- **Auto-save**: Replit can auto-commit changes to connected GitHub repository

## Changelog
- June 14, 2025: Initial setup
- June 14, 2025: Chessie V3 voice successfully implemented as default with BETA credit-saving mode
- June 14, 2025: Added comprehensive mobile audio compatibility for iPhone/iOS Safari
- June 14, 2025: Implemented mobile audio unlock system with user gesture requirements
- June 14, 2025: Removed all ElevenLabs character limits for complete voice synthesis

## User Preferences

Preferred communication style: Simple, everyday language.