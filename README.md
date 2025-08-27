# Liikii Desktop

A Linear-style desktop UI template for project management, built with Electron, React, and TypeScript.

## Features

- **Linear-inspired Design**: Clean, minimal interface with dark/light theme support
- **Desktop Integration**: Native menu bar, system tray, and notifications
- **Project Management**: Task-centric workflow with project containers
- **Template System**: JSON-driven layout configuration
- **DCC Integration**: Support for Python/DCC launchers and environment managers
- **Cross-platform**: Windows and Linux support

## Technology Stack

- **Desktop Framework**: Electron
- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with design tokens
- **State Management**: Zustand (planned)
- **Icons**: Lucide React
- **Routing**: React Router

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd liikii

# Install dependencies
npm install
```

### Development Scripts

```bash
# Start development server (Vite + Electron)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm run test
```

### Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main Electron entry point
│   ├── preload.ts  # Preload script for IPC
│   └── utils.ts    # Main process utilities
├── renderer/       # React application (unused, using src/ directly)
├── components/     # React components
│   ├── AppShell.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ThemeProvider.tsx
├── pages/          # Page components
│   └── ProjectsPage.tsx
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores
├── styles/         # CSS and design tokens
│   └── index.css
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── assets/         # Static assets
```

## Design System

The application follows a design token approach with:

- **Colors**: Dark theme (default) with Monet-inspired pastel accents
- **Typography**: Inter font family with consistent scale
- **Spacing**: 4px grid system
- **Components**: Linear-inspired UI patterns

### Theme Colors

**Dark Theme (Default)**:
- Background: `#0B0D12`
- Surface: `#0F141A`, `#141A21`
- Text: `#E6EAF2`, `#A8B0BE`
- Accents: Lilac, Blue, Pink, Mint, Butter

**Light Theme**:
- Background: `#F7F8FA`
- Surface: `#FFFFFF`, `#F2F4F7`
- Text: `#0F141A`, `#475569`

## Current Status

✅ **Task 1 Complete**: Project Foundation Setup
- Electron + React + TypeScript project initialized
- Build tools and development environment configured
- Component-based folder structure established
- Basic Linear-inspired layout implemented
- Theme system with dark/light mode toggle
- Projects page with empty state

### Next Steps

- Task 2: Design System Foundation (detailed components)
- Task 3: Core Layout Architecture (responsive design)
- Task 4: Navigation and Routing System
- Task 5: Projects Main View Implementation
- And more...

## Contributing

This project follows the PRD specifications for a Linear-style desktop UI template. Please refer to `PRD.md` for detailed requirements and acceptance criteria.

## License

MIT
