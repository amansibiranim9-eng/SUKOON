# SUKOON (سکون)

SUKOON is a premium, immersive interactive Dhikr web experience that transforms traditional Istighfar and remembrance into a peaceful visual journey. Explore beautiful atmospheric worlds (Rain, Noor, Sakina), interact with floating particles, glowing lights, and gentle animations through touch and phone movement. Each Dhikr creates a unique visual response.

## Technology Stack

- **React 18** - Component-based user interface
- **Vite** - High performance frontend tooling & build system
- **TypeScript** - Strict static typing for reliability and maintainability
- **Tailwind CSS** - Utility-first styling with custom atmospheric themes
- **Three.js** - 3D visual environments, particle systems, and shaders
- **Framer Motion** - Fluid gestures, transitions, and micro-interactions
- **Zustand** - Lightweight, scalable state management

## Architecture Overview

```text
src/
├── assets/
│   ├── images/              # Visual assets, textures, and background imagery
│   └── sounds/              # Ambient sounds, audio cues, and nature soundscapes
├── components/
│   ├── ui/                  # Reusable low-level UI components (buttons, sliders, modals)
│   ├── layout/              # Application frame, header, navigation, and overlays
│   ├── dhikr/               # Dhikr counter, text display, Arabic typography, progress
│   └── worlds/              # 3D interactive environments
│       ├── rain/            # Rain atmospheric world (gentle droplets, ripples, calming rain)
│       ├── noor/            # Noor atmospheric world (radiant light beams, golden aura)
│       └── sakina/          # Sakina atmospheric world (serene clouds, stillness, twilight)
├── hooks/                   # Custom reusable React hooks (e.g., useDhikr, useAudio)
├── services/                # Standalone services (audio engine, persistence, haptics)
├── store/                   # Global application state (active world, counts, settings)
├── types/                   # TypeScript interfaces, types, and constants
├── utils/                   # Helper functions, math utils, and classnames helper
└── styles/                  # Tailwind base layers, global styles, and CSS animations
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

### Production Build

Build for production with full type checking:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## License

MIT
