# CyberTetris

A modern web-based implementation of the classic Tetris game with a cyberpunk aesthetic.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-Latest-764ABC?style=flat&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-8.45.0-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)

## Features

- Classic Tetris gameplay mechanics with modern enhancements
- Responsive, cyberpunk-themed UI
- High score tracking and leaderboard
- Customizable controls
- Performance optimized with Redux Toolkit for state management
- Web Workers for game logic calculations (planned)

## Tech Stack

- **Frontend:** React, TypeScript, CSS Modules
- **State Management:** Redux Toolkit
- **Build & Development:** Vite
- **Testing:** Jest (configured)
- **Linting/Formatting:** ESLint, Prettier
- **Performance:** (planned)
  - React.memo for component optimization
  - Web Workers for game logic

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd CyberTetris

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Project Structure

```
CyberTetris/
├── src/
│   ├── components/       # UI components
│   ├── constants/        # Game constants like tetrominos
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store configuration
│   │   ├── slices/       # Redux Toolkit slices
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── ...config files
```

## License

MIT 