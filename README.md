# flappy-bird-expo

# React Native Flappy Bird

A modern mobile implementation of the classic Flappy Bird game built with React Native and Expo. This game showcases smooth gameplay mechanics and responsive controls while demonstrating advanced React Native development concepts.

## 🎮 Game Features
- Smooth bird physics and animations
- Dynamically generated obstacles
- Real-time score tracking
- Best score persistence
- Responsive touch controls
- Clean, modern UI design
- Custom-styled components
- Collision detection system

## 🛠️ Technical Stack
- React Native
- Expo
- React Native Game Engine
- Custom physics system
- Component-based architecture

## 🚀 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-native-flappy-bird.git
   ```
2. Install dependencies:
   ```bash
   cd react-native-flappy-bird
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 How to Play
- Tap the screen to make the bird flap
- Navigate through pipes without touching them
- Each successful pipe passage earns one point
- Try to beat your high score!

## 🏗️ Project Structure
```
├── App.js                 # Main game component
├── components/           
│   ├── Bird.js           # Bird component
│   ├── Floor.js          # Ground component
│   └── Pipe.js           # Obstacle component
├── systems.js            # Game physics and logic
└── assets/               # Game assets
```

## 🔧 Technical Implementation
- Custom physics engine for realistic bird movement
- Efficient pipe generation and cleanup system
- Collision detection algorithms
- State management for game progression
- Performance-optimized rendering