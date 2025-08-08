class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;

    const progressText = this.add.text(width / 2, height / 2, 'Loading 0%', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (v) => progressText.setText(`Loading ${Math.round(v * 100)}%`));
    this.load.on('complete', () => progressText.setText('Starting...'));

    // Player microlets (used as ships)
    this.load.image('ship_esperansa', 'sprites/microlets/esperansa.png');
    this.load.image('ship_kuitadu', 'sprites/microlets/kuitadu.png');
    this.load.image('ship_realize_dream', 'sprites/microlets/realize_dream.png');
    this.load.image('ship_silver_omega', 'sprites/microlets/silver_omega.png');

    // Space SVG assets
    this.load.svg('asteroid', 'sprites/space/asteroid.svg');
    this.load.svg('planet', 'sprites/space/planet.svg');
    this.load.svg('comet', 'sprites/space/comet.svg');
    this.load.svg('star_pickup', 'sprites/space/star.svg');
    this.load.svg('fuel_cell', 'sprites/space/fuel_cell.svg');
    this.load.svg('astronaut', 'sprites/space/astronaut.svg');
    this.load.svg('thruster_particle', 'sprites/space/thruster_particle.svg');
  }

  create() {
    // Generate a tiny star particle texture for parallax background
    const g = this.add.graphics({
      x: 0, y: 0,
    });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(2, 2, 2);
    g.generateTexture('particle_star', 4, 4);
    g.destroy();

    // Remove near-white backgrounds from microlet sprites (simple color key)
    const shipKeys = ['ship_esperansa', 'ship_kuitadu', 'ship_realize_dream', 'ship_silver_omega'];
    shipKeys.forEach((k) => this._makeTransparentWhite(k, k + '_cut'));

    // Start core scenes
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }

  _makeTransparentWhite(srcKey, dstKey) {
    const tex = this.textures.get(srcKey);
    if (!tex) return;
    const img = tex.getSourceImage();
    const w = img.width, h = img.height;
    const canvas = this.textures.createCanvas(dstKey + '_canvas', w, h).canvas;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Treat bright white/cream as background
      if ((r + g + b) > 730) {
        data[i + 3] = 0; // alpha
      }
    }
    ctx.putImageData(imageData, 0, 0);
    // Register as a normal image texture
    this.textures.addImage(dstKey, canvas);
    this.textures.remove(dstKey + '_canvas');
  }
}

window.PreloadScene = PreloadScene;


