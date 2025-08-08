class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.scoreText = null;
    this.fuelText = null;
    this.astronautsText = null;
    this.highScoreText = null;
    this.overlay = null;
    this.overlayText = null;
    this.keyP = null;
  }

  create() {
    const pad = 10;
    this.scoreText = this.add.text(this.scale.width - pad, pad, 'Score: 0', {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff'
    }).setOrigin(1, 0).setDepth(1000);

    this.fuelText = this.add.text(pad, pad, 'Fuel: 100', {
      fontFamily: 'monospace', fontSize: '18px', color: '#80ffe6'
    }).setOrigin(0, 0).setDepth(1000);

    this.astronautsText = this.add.text(this.scale.width - pad, pad + 30, 'Lives Saved: 0', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffd64d'
    }).setOrigin(1, 0).setDepth(1000);

    // High score display
    const highScore = localStorage.getItem('microlet_rush_high_score') || 0;
    this.highScoreText = this.add.text(this.scale.width - pad, pad + 55, `Best: ${highScore}`, {
      fontFamily: 'monospace', fontSize: '14px', color: '#80ffe6'
    }).setOrigin(1, 0).setDepth(1000);

    // Pause overlay
    this.overlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2,
      this.scale.width, this.scale.height, 0x000000, 0.55).setDepth(998).setVisible(false);
    this.overlayText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Paused\nPress P to resume', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(999).setVisible(false);

    // Global pause key handled in UI so it still works when GameScene is paused
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    GameEvents.on('score:update', this._onScore, this);
    GameEvents.on('fuel:update', this._onFuel, this);
    GameEvents.on('astronauts:update', this._onAstronauts, this);
    GameEvents.on('ui:reset', this._onReset, this);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      GameEvents.off('score:update', this._onScore, this);
      GameEvents.off('fuel:update', this._onFuel, this);
      GameEvents.off('astronauts:update', this._onAstronauts, this);
      GameEvents.off('ui:reset', this._onReset, this);
    });
  }

  _onScore(value) { if (this.scoreText) this.scoreText.setText(`Score: ${value}`); }
  _onFuel(value) { if (this.fuelText) this.fuelText.setText(`Fuel: ${value}`); }
  _onAstronauts(value) { if (this.astronautsText) this.astronautsText.setText(`Lives Saved: ${value}`); }
  _onReset() {
    if (this.scoreText) this.scoreText.setText('Score: 0');
    if (this.fuelText) this.fuelText.setText('Fuel: 100');
    if (this.astronautsText) this.astronautsText.setText('Lives Saved: 0');
    // Update high score display after potential new record
    const highScore = localStorage.getItem('microlet_rush_high_score') || 0;
    if (this.highScoreText) this.highScoreText.setText(`Best: ${highScore}`);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
      const paused = this.scene.isPaused('GameScene');
      if (paused) {
        this.scene.resume('GameScene');
        this.overlay.setVisible(false);
        this.overlayText.setVisible(false);
      } else {
        this.scene.pause('GameScene');
        this.overlay.setVisible(true);
        this.overlayText.setVisible(true);
      }
    }
  }
}

window.UIScene = UIScene;


