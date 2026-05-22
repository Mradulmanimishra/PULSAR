<div align="center">

# ⚡ PULSAR

### Enterprise-Grade Multiplayer 3D Arena Combat Platform

[![MIT License](https://img.shields.io/badge/license-MIT-cyan.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r182-orange.svg)](https://threejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-white.svg)](https://socket.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org)

**Engage in real-time multiplayer 3D combat with players worldwide. No downloads, no plugins — just pure web-based gaming.**

[📖 Documentation](#-documentation) · [🚀 Getting Started](#-getting-started) · [🐛 Report Issue](https://github.com/Mradulmanimishra/PULSAR/issues) · [💡 Request Feature](https://github.com/Mradulmanimishra/PULSAR/issues)

</div>

---

## 📋 Overview

**PULSAR** is a high-performance, browser-based multiplayer 3D arena combat game built with modern web technologies. Supporting up to **60 concurrent players**, it delivers real-time action with sub-100ms latency, responsive physics-based movement, and cross-platform compatibility.

### Core Capabilities

- 🔫 **Real-Time Combat** — Instant hit detection and player elimination with live-score updates
- ⚡ **Optimized Networking** — WebSocket-based communication for <100ms latency
- 📱 **Full Mobile Support** — Touch controls with dual-joystick + fire button layout
- 🏆 **Live Leaderboard** — Real-time ranking system with persistent player stats
- 🎨 **Immersive Graphics** — Post-processed 3D rendering with visual effects

---

## ✨ Key Features

| Feature | Specification |
|---------|---|
| **Concurrency** | Up to 60 simultaneous players per instance |
| **Networking** | WebSocket via Socket.IO with automatic fallback |
| **Latency** | Sub-100ms round-trip via optimized event batching |
| **Graphics Pipeline** | Three.js with bloom, chromatic aberration, and FXAA |
| **Physics Engine** | Rapier (WASM) for deterministic movement |
| **Platform Support** | Desktop (Win/Mac/Linux) + Mobile (iOS/Android) |
| **Responsive Design** | Adaptive UI for screens 320px–4K+ |
| **State Management** | Zustand with optimistic client prediction |
| **Build & Deploy** | Vite + Docker + Fly.io ready |

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 6 with HMR and optimized bundling
- **Styling**: Tailwind CSS v4 for utility-first design
- **State Management**: Zustand with middleware support

### 3D Rendering
- **Engine**: Three.js r182 (GLSL shaders, post-processing)
- **React Integration**: React Three Fiber for component-based 3D
- **Physics**: Rapier (WASM) for deterministic collision detection
- **Utilities**: Drei for pre-built components and helpers
- **Post-Processing**: Bloom, chromatic aberration, FXAA

### Backend & Networking
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js for REST/static serving
- **Realtime**: Socket.IO 4.8 with auto-reconnection
- **Database**: SQLite3 (session/stats persistence)
- **Containerization**: Docker (multi-stage build)

### DevOps & Deployment
- **Container Runtime**: Docker (980MB image)
- **Hosting**: Fly.io (auto-scaling across regions)
- **Monitoring**: Health checks via HTTP GET `/`
- **Configuration**: Environment variables via `.env`

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Installation |
|---|---|---|
| **Node.js** | 18+ (LTS) | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ | Bundled with Node.js |
| **Git** | Any recent | [git-scm.com](https://git-scm.com/) |

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Mradulmanimishra/PULSAR.git
cd PULSAR

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open browser to **http://localhost:3000** — Hot Module Replacement (HMR) enabled for instant feedback.

### npm Scripts

```bash
npm run dev       # Start dev server (backend + frontend)
npm run build     # Production build
npm start         # Run production build (requires NODE_ENV=production)
npm run lint      # Type-check with TypeScript
npm run clean     # Remove dist/ artifacts
npm run preview   # Preview production build locally
```

### Environment Configuration

Create `.env` file in project root:

```env
# Server Config
NODE_ENV=development
PORT=3000

# Optional: Custom game settings
MAX_PLAYERS=60
ARENA_SIZE=100
```

---

## 📦 Production Deployment

### Docker Build

```bash
# Build image
docker build -t pulsar:latest .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production pulsar:latest
```

### Fly.io Deployment

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly
flyctl auth login

# Deploy
cd PULSAR
flyctl deploy
```

**Configuration**: Edit `fly.toml` for custom regions, VM size, and scaling policies.

---

## 🎮 User Controls

### Desktop Input Scheme

| Action | Key(s) | Notes |
|---|---|---|
| Move Forward | `W` | Continuous movement |
| Move Left | `A` | Strafing |
| Move Right | `D` | Strafing |
| Move Backward | `S` | Reverse |
| Fire | Left Mouse | Instant hit scan |
| Look/Aim | Mouse Move | Locked during gameplay |
| Unlock Cursor | `Escape` | Pause/menu |

### Mobile Input Scheme

| Control | Interaction | Zone |
|---|---|---|
| **Movement Joystick** | Dual-axis thumbstick | Bottom-left |
| **Look Joystick** | Dual-axis aiming | Bottom-right |
| **Fire Button** | Tap/hold for rapid fire | Center screen |

---

## 🏗️ Architecture

### System Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   Web Browser   │         │   Node.js Server │
│  ┌───────────┐  │◄─────►  │  ┌────────────┐  │
│  │ React App │  │ Socket  │  │ Express.js │  │
│  │ Three.js  │  │   IO    │  │ Socket.IO  │  │
│  │ Zustand   │  │         │  │ SQLite3    │  │
│  └───────────┘  │         │  └────────────┘  │
└─────────────────┘         └──────────────────┘
        ▲                            ▲
        └──────────────┬─────────────┘
                       │
              HTTP/WebSocket
              Port 3000
```

### Data Flow

1. **Client Input** → Keyboard/touch events → Zustand store
2. **Prediction** → Local state update (optimistic)
3. **Transmission** → Socket.IO emit (batched 60fps)
4. **Server Processing** → Collision detection, hit validation
5. **Broadcast** → Updated player states to all clients
6. **Reconciliation** → Server state authority, client correction

---

## � Project Structure

```
PULSAR/
├── server.ts                      # Express + Socket.IO server entry point
├── src/
│   ├── main.tsx                   # React app entry
│   ├── App.tsx                    # Root component (UI router, HUD)
│   ├── store.ts                   # Zustand state + socket handlers
│   ├── index.css                  # Global Tailwind styles
│   ├── components/
│   │   ├── Game.tsx               # Canvas container (Three.js)
│   │   ├── Arena.tsx              # 3D environment (walls, floor)
│   │   ├── Player.tsx             # Local player controller
│   │   ├── OtherPlayer.tsx        # Remote player rendering
│   │   ├── Enemy.tsx              # AI/bot controller
│   │   ├── Effects.tsx            # Post-processing pipeline
│   │   └── MobileControls.tsx     # Touch joystick UI
│   ├── hooks/
│   │   └── useIsMobile.ts         # Device detection utility
├── index.html                     # HTML entry (Vite)
├── Dockerfile                     # Multi-stage container build
├── fly.toml                       # Fly.io deployment config
├── vite.config.ts                 # Vite bundler config
├── tsconfig.json                  # TypeScript settings
├── package.json                   # Dependencies + scripts
└── README.md                      # This file
```

### Component Hierarchy

```
App
├── Game
│   ├── Arena
│   ├── Player (Local)
│   ├── OtherPlayer (Remotex60)
│   ├── Enemy
│   ├── Effects
│   └── MobileControls
├── HUD
│   ├── Leaderboard
│   ├── Health/Score
│   ├── Timer
│   └── Event Feed
└── Menu
    ├── Lobby
    ├── Game Over
    └── Settings

---

## 🤝 Contributing

We welcome contributions! Follow these guidelines:

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Test before submitting PRs

### Contribution Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/YourFeature`
3. **Implement** changes with clear commit messages
4. **Test** locally: `npm run lint && npm run build`
5. **Push** to your fork
6. **Submit** Pull Request with description of changes

### Branch Naming Convention
- `feature/description` — New functionality
- `bugfix/issue-number` — Bug fixes
- `docs/update-name` — Documentation updates
- `refactor/description` — Code improvements

### Commit Message Format
```
<type>: <subject>

<body>

Fixes #<issue-number>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

---

## 🐛 Issue Reporting

**Found a bug?** Please report it with:
- Description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (browser, OS, device)
- Screenshots/video if applicable

---

## 📚 Documentation

- [API Reference](#api-reference) — Socket.IO event contracts
- [Performance Tuning](#performance-tuning) — Optimization tips
- [Troubleshooting](#troubleshooting) — Common issues

### API Reference

#### Client → Server Events

```typescript
// Player action
socket.emit('player:move', { 
  x: number, 
  y: number, 
  rotation: number 
})

// Fire event
socket.emit('player:fire', { 
  hit: boolean, 
  targetId: string 
})
```

#### Server → Client Events

```typescript
// Game state update
socket.on('game:update', (state: GameState) => {
  // { players: Player[], leaderboard: Score[] }
})

// Player eliminated
socket.on('game:eliminated', (data: { 
  playerId: string, 
  eliminatedBy: string 
}) => {})
```

---

## ⚙️ Performance Tuning

### Optimization Tips

- **Reduce Network Traffic** — Socket.IO batching enabled by default
- **Graphics** — Adjust `pixelRatio` in `vite.config.ts`
- **Physics** — Rapier step frequency configurable in `store.ts`
- **Asset Caching** — Browser caching configured in `fly.toml`

### Monitoring

```bash
# Check network latency
npm run dev -- --inspect
# Open chrome://inspect for DevTools

# Profile React rendering
# Use React Profiler API in dev build
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|---|---|
| **Cannot connect to server** | Check `PORT` in `.env`, verify firewall |
| **3D not rendering** | Update GPU drivers, check browser WebGL support |
| **High latency/lag** | Reduce player count, check network bandwidth |
| **Mobile controls unresponsive** | Enable touch events in browser settings |
| **Build fails** | Run `npm install` again, clear `node_modules` |

---

## 🗺️ Roadmap

### v1.1 (Q3 2026)
- [ ] Custom arena builder
- [ ] Team deathmatch mode
- [ ] Player profiles & statistics
- [ ] In-game chat system

### v1.2 (Q4 2026)
- [ ] Matchmaking system
- [ ] Achievements & badges
- [ ] VoIP integration
- [ ] Spectator mode

### v2.0 (2027)
- [ ] Advanced physics (destructible environment)
- [ ] Power-ups & special weapons
- [ ] Ranked competitive mode
- [ ] Game server scaling via Kubernetes

---

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/Mradulmanimishra/PULSAR/issues)
- **Email**: mradulmanimishra2003@gmail.com
- **Twitter**: [@Mradul_Dev](https://twitter.com)

---

## 📜 License

This project is distributed under the **MIT License** — a permissive open-source license that allows:

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

⚠️ Requires: License and copyright notice inclusion

See [LICENSE](LICENSE) file for complete terms.

---

## 🙏 Acknowledgments

- **Three.js Community** — Powerful 3D graphics library
- **React Team** — React 19 architecture
- **Socket.IO** — Real-time networking protocol
- **Fly.io** — Hosting & deployment platform

---

<div align="center">

### Built with ❤️ by [Mradul Manimishra](https://github.com/Mradulmanimishra)

**[⭐ Star this repo](https://github.com/Mradulmanimishra/PULSAR)** if you find it useful!

---

*Last Updated: May 2026*  
*PULSAR v1.0.0 — Enterprise Multiplayer Arena*

</div>
