class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.worldSpeed = GameConfig.baseWorldSpeed;
    this.score = 0;
    this.astronautsSaved = 0;
    this.energy = GameConfig.energyMax;
    this.multiplier = 1;
    this.playerLane = 1; // center lane for 3 lanes
    this.laneManager = null;
    this.player = null;
    this.cursors = null;
    this.keys = null;
    this.obstacles = null;
    this.pickups = null;
    this.parallax = null;
  }

  create() {
    this.worldSpeed = GameConfig.baseWorldSpeed;
    this.score = 0;
    this.astronautsSaved = 0;
    this.energy = GameConfig.energyMax;
    this.multiplier = 1;

    // Background
    this.parallax = new ParallaxSpace(this);

    // Lanes
    this.laneManager = new LaneManager(this, GameConfig.lanes, this.scale.height);
    this.playerLane = 1;

    // Player
    const shipKey = Phaser.Utils.Array.GetRandom([
      'ship_esperansa_cut', 'ship_kuitadu_cut', 'ship_realize_dream_cut', 'ship_silver_omega_cut'
    ]);
    this.player = this.physics.add.sprite(140, this.laneManager.getYForLane(this.playerLane), shipKey);
    this.player.setDepth(10);
    const scale = Math.min(1, 96 / Math.max(this.player.width, this.player.height));
    this.player.setScale(scale);
    this.player.setCircle(Math.max(12, (this.player.displayWidth + this.player.displayHeight) / 6));
    this.player.setCollideWorldBounds(true);

    // Thruster particles (Phaser 3.60 API)
    this.thrusterEmitter = this.add.particles(0, 0, 'thruster_particle', {
      follow: this.player,
      followOffset: { x: -this.player.displayWidth * 0.35, y: 0 },
      lifespan: 350,
      speed: { min: 30, max: 80 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.5, end: 0.1 },
      alpha: { start: 0.9, end: 0 },
      blendMode: 'ADD',
      quantity: 1,
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this._setupSwipe();

    // Groups
    this.obstacles = this.physics.add.group();
    this.pickups = this.physics.add.group();

    // Collisions
    this.physics.add.collider(this.player, this.obstacles, this._onCrash, undefined, this);
    this.physics.add.overlap(this.player, this.pickups, this._onPickup, undefined, this);

    // Spawners
    this.time.addEvent({ delay: 1500, loop: true, callback: this._spawnObstacle, callbackScope: this });
    this.time.addEvent({ delay: 900, loop: true, callback: this._spawnPickup, callbackScope: this });

    // HUD init
    GameEvents.emit('score:update', Math.floor(this.score));
    GameEvents.emit('fuel:update', Math.floor(this.energy));
    GameEvents.emit('astronauts:update', this.astronautsSaved);
  }

  _setupSwipe() {
    let startX = null;
    this.input.on('pointerdown', (p) => { startX = p.x; });
    this.input.on('pointerup', (p) => {
      if (startX == null) return;
      const dx = p.x - startX;
      if (Math.abs(dx) > 32) {
        if (dx > 0) this._changeLane(1); else this._changeLane(-1);
      }
      startX = null;
    });
  }

  _changeLane(direction) {
    const nextLane = Phaser.Math.Clamp(this.playerLane + direction, 0, GameConfig.lanes - 1);
    if (nextLane === this.playerLane) return;
    this.playerLane = nextLane;
    const targetY = this.laneManager.getYForLane(this.playerLane);
    this.tweens.add({ targets: this.player, y: targetY, duration: 140, ease: 'Sine.easeInOut' });
  }

  _spawnObstacle() {
    const lane = Phaser.Math.Between(0, GameConfig.lanes - 1);
    const y = this.laneManager.getYForLane(lane);
    const key = Phaser.Math.RND.pick(['asteroid', 'planet']);
    const sprite = this.obstacles.create(this.scale.width + 40, y, key);
    sprite.setDepth(5);
    sprite.setVelocityX(-this.worldSpeed);
    sprite.setCircle(Math.max(14, (sprite.width + sprite.height) / 6));
  }

  _spawnPickup() {
    const lane = Phaser.Math.Between(0, GameConfig.lanes - 1);
    const y = this.laneManager.getYForLane(lane);
    const weightedKeys = ['star_pickup','star_pickup','star_pickup','star_pickup','star_pickup','fuel_cell','fuel_cell','astronaut'];
    const chosenKey = Phaser.Math.RND.pick(weightedKeys);
    const sprite = this.pickups.create(this.scale.width + 40, y, chosenKey);
    sprite.setDepth(5);
    sprite.setVelocityX(-this.worldSpeed * 0.9);
    sprite.setCircle(Math.max(10, (sprite.width + sprite.height) / 8));
  }

  _onPickup(player, pickup) {
    if (!pickup.active) return;
    const key = pickup.texture.key;
    if (key === 'fuel_cell') {
      this.energy = Math.min(GameConfig.energyMax, this.energy + 25);
    } else if (key === 'astronaut') {
      this.score += 50;
      this.astronautsSaved++;
      this.multiplier = 1.5;
      this.time.delayedCall(10000, () => { this.multiplier = 1; });
    } else {
      this.score += 10;
    }
    pickup.destroy();
    GameEvents.emit('fuel:update', Math.floor(this.energy));
    GameEvents.emit('score:update', Math.floor(this.score));
    GameEvents.emit('astronauts:update', this.astronautsSaved);
  }

  _onCrash() {
    // Simple game-over: restart the scene
    this.cameras.main.shake(200, 0.01);
    this.scene.restart();
    GameEvents.emit('ui:reset');
  }

  update(time, delta) {
    // Input
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keys.left)) {
      this._changeLane(-1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keys.right)) {
      this._changeLane(1);
    }

    // Progression
    const dt = delta / 1000;
    this.worldSpeed += GameConfig.worldSpeedRampPerSecond * dt;

    // Move existing objects with current speed (ensure newly spawned inherit new velocity)
    this.obstacles.children.iterate((o) => { if (o && o.body) o.setVelocityX(-this.worldSpeed); });
    this.pickups.children.iterate((p) => { if (p && p.body) p.setVelocityX(-this.worldSpeed * 0.9); });

    // Score and energy
    this.score += (this.worldSpeed * dt) / 10 * this.multiplier;
    this.energy -= GameConfig.energyDrainPerSecond * dt;
    if (this.energy <= 0) {
      this._onCrash();
      return;
    }
    if (Math.floor(this.score) % 5 === 0) {
      GameEvents.emit('score:update', Math.floor(this.score));
    }
    GameEvents.emit('fuel:update', Math.max(0, Math.floor(this.energy)));

    // Cleanup off-screen
    const minX = -80;
    this.obstacles.children.iterate((o) => { if (o && o.x < minX) o.destroy(); });
    this.pickups.children.iterate((p) => { if (p && p.x < minX) p.destroy(); });
  }
}

window.GameScene = GameScene;


