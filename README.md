# Microlet Rush 2.0 - Space Runner

An endless space runner game built with Phaser 3.60 where you pilot a microlet-turned-spaceship through cosmic lanes, dodging asteroids and planets while collecting stars, fuel cells, and rescuing stranded astronauts.

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server) or Node.js

### Running the Game

#### Option 1: Python (Recommended)
```bash
# Navigate to the project directory
cd /path/to/microlet-rush-2.0

# Start a local server
python3 -m http.server --directory . 5173

# Open your browser to
# http://localhost:5173
```

#### Option 2: Node.js
```bash
# Install serve globally (if not already installed)
npm install -g serve

# Start the server
npx serve . -l 5173

# Open your browser to
# http://localhost:5173
```

#### Option 3: Any HTTP Server
You can use any local HTTP server. The key is to avoid opening the `index.html` file directly in the browser (file:// protocol) as this will cause CORS issues with asset loading.

## 🎮 Gameplay

### Controls
- **Desktop**: 
  - `A` or `←` - Move left (up)
  - `D` or `→` - Move right  (down)
  - `P` - Pause/Resume
- **Mobile**: 
  - Swipe left/right to change lanes
  - Tap top-right area to pause

### Objective
Navigate through three space lanes, avoiding obstacles while collecting resources to extend your journey and maximize your score.

### Game Elements

#### Obstacles
- **Asteroids**: Small rocky obstacles
- **Planets**: Larger celestial bodies to avoid
- **Comets**: Fast-moving space debris (advanced)

#### Pickups
- **Stars** ⭐: +10 points each
- **Fuel Cells** 🔋: +25 energy (restores ship power)
- **Astronauts** 👨‍🚀: +50 points + temporary 1.5x score multiplier for 10 seconds

#### Scoring
- **Distance**: Score increases based on distance traveled
- **Multiplier**: Astronaut rescues provide temporary score boost
- **Lives Saved**: Track how many astronauts you've rescued

### Game Over
- Colliding with any obstacle
- Running out of energy (fuel)

## 🛠️ Development

### Project Structure
```
microlet-rush-2.0/
├── index.html              # Main HTML file
├── design.md               # Game design specification
├── README.md               # This file
├── js/
│   ├── config.js           # Global configuration
│   ├── main.js             # Phaser game initialization
│   ├── scenes/
│   │   ├── PreloadScene.js # Asset loading
│   │   ├── GameScene.js    # Main gameplay
│   │   └── UIScene.js      # HUD and pause overlay
│   └── systems/
│       ├── LaneManager.js  # Lane positioning logic
│       └── ParallaxSpace.js # Starfield and background
└── sprites/
    ├── microlets/          # Player ship sprites
    ├── space/              # Space-themed assets (SVG)
    └── background/         # Background textures
```

### Key Features
- **Responsive Design**: Works on desktop and mobile
- **Parallax Background**: Dynamic starfield with multiple layers
- **Particle Effects**: Thruster particles and starfield
- **Collision Detection**: Arcade physics for precise gameplay
- **Progressive Difficulty**: Speed and spawn rates increase over time
- **Pause System**: Full game pause with overlay

### Debug Mode
Add `?debug=1` to the URL to enable physics debug overlays:
```
http://localhost:5173?debug=1
```

### Asset Processing
The game automatically processes microlet sprites to remove white/cream backgrounds for better visual integration with the space theme.

## 🎨 Customization

### Modifying Assets
- **Player Ships**: Replace files in `sprites/microlets/`
- **Space Assets**: Edit SVG files in `sprites/space/`
- **Backgrounds**: Modify files in `sprites/background/`

### Adjusting Gameplay
Key parameters can be modified in `js/config.js`:
- `baseWorldSpeed`: Initial scroll speed
- `worldSpeedRampPerSecond`: How fast speed increases
- `energyMax`: Maximum fuel capacity
- `energyDrainPerSecond`: Fuel consumption rate

## 🚀 Future Enhancements

Planned features from the design document:
- Menu scene with ship selection
- Comet hazards with particle trails
- Black hole gravity wells
- Audio system with SFX and music
- Enhanced visual effects and polish

## 📝 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Enjoy piloting your microlet through the cosmos!** 🌌
