class InstructionScene extends Phaser.Scene {
  constructor() {
    super('InstructionScene');
  }

  create() {
    const { width, height } = this.scale;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000011);
    
    // Title
    this.add.text(width / 2, 50, 'MICROLET RUSH: The Next Generation', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instructions - split into two sections for better spacing
    const controls = [
      '🎮 CONTROLS',
      '',
      'Desktop: A/←(Up) D/→(Down) P',
      'Mobile: Swipe or Tap',
      '',
      '🎯 OBJECTIVE',
      '',
      '• Avoid obstacles',
      '• Collect stars & fuel',
      '• Rescue astronauts!'
    ];

    const instructionText = this.add.text(width / 2, 140, controls, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5, 0.2);

    // Start button
    const startButton = this.add.text(width / 2, height - 50, 'START GAME', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#80ffe6',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    // Button hover effects
    startButton.on('pointerover', () => {
      startButton.setStyle({ color: '#ffffff', backgroundColor: '#2a2a3e' });
    });
    
    startButton.on('pointerout', () => {
      startButton.setStyle({ color: '#80ffe6', backgroundColor: '#1a1a2e' });
    });

    // Start game on click or space
    const startGame = () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    };

    startButton.on('pointerdown', startGame);
    
    // Space key to start
    this.input.keyboard.on('keydown-SPACE', startGame);
    
    // Also allow Enter key
    this.input.keyboard.on('keydown-ENTER', startGame);
  }
}

window.InstructionScene = InstructionScene;
