<div align="center">

# ⚡ NEON ARENA

### Massive Multiplayer Real-Time 3D Laser Tag — In Your Browser

[![MIT License](https://img.shields.io/badge/license-MIT-cyan.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r182-orange.svg)](https://threejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-white.svg)](https://socket.io)

**Battle players worldwide in a neon-lit 3D arena — no downloads, no installs. Just open and play.**

[▶ Play Now](https://github.com/Mradulmanimishra/NEON-ARENA) · [Report Bug](https://github.com/Mradulmanimishra/NEON-ARENA/issues) · [Request Feature](https://github.com/Mradulmanimishra/NEON-ARENA/issues)

</div>

---

## 🎮 About The Game

**NEON ARENA** is a fast-paced, browser-based, massively multiplayer laser tag game rendered entirely in 3D. Up to **60 players** can battle simultaneously in a neon-lit arena — no plugins, no downloads — just a modern web browser.

- 🔫 **Shoot to disable** enemy players and climb the leaderboard
- ⚡ **Real-time** movement and hit detection via WebSockets
- 🌐 **Mobile-friendly** with dual on-screen joysticks and a shoot button
- 🏆 **Live leaderboard** — see your rank update in real time

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌐 Multiplayer | Up to 60 simultaneous players via Socket.IO |
| 🎨 3D Graphics | Three.js with React Three Fiber and post-processing effects |
| 📱 Mobile Controls | Dual-joystick + shoot button for touch devices |
| 🏃 Physics | Rapier physics engine for realistic movement |
| 🔊 HUD | Live score, timer, leaderboard and event feed |
| ⚡ Hot Reload | Vite dev server with instant HMR |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **3D Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei, Rapier Physics
- **Post-Processing**: `@react-three/postprocessing` (bloom, chromatic aberration)
- **Multiplayer**: Socket.IO (client + server)
- **Backend**: Express.js + Vite middleware (served from a single Node.js process)
- **State**: Zustand
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite 6

---

## 🚀 Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mradulmanimishra/NEON-ARENA.git
cd NEON-ARENA

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to **http://localhost:3000**

> The backend (Socket.IO + Express) and frontend (Vite + React) run together from a single `npm run dev` command.

---

## 🎮 Controls

### Desktop
| Action | Control |
|---|---|
| Move | `W A S D` |
| Look | Mouse |
| Shoot | Left Click |
| Unlock cursor | `Escape` |

### Mobile
| Action | Control |
|---|---|
| Move | Left on-screen joystick |
| Look | Right on-screen joystick |
| Shoot | Center button |

---

## 📁 Project Structure

```
NEON-ARENA/
├── server.ts              # Express + Socket.IO server
├── src/
│   ├── App.tsx            # Main UI (menus, HUD, game over)
│   ├── store.ts           # Zustand global state + socket logic
│   ├── components/
│   │   ├── Game.tsx       # Three.js canvas root
│   │   ├── Arena.tsx      # 3D arena walls and floor
│   │   ├── Player.tsx     # Local player (movement, shooting)
│   │   ├── OtherPlayer.tsx# Remote player rendering
│   │   ├── Enemy.tsx      # Enemy AI logic
│   │   ├── Effects.tsx    # Post-processing effects
│   │   └── MobileControls.tsx  # Touch joystick controls
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/MyFeature`
3. Commit your changes: `git commit -m 'Add MyFeature'`
4. Push to the branch: `git push origin feature/MyFeature`
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Mradul Manimishra](https://github.com/Mradulmanimishra)

</div>
