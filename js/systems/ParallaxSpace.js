class ParallaxSpace {
  constructor(scene) {
    this.scene = scene;

    // Particle Emitter API updated in Phaser 3.60
    this.starEmitterFar = scene.add.particles(0, 0, 'particle_star', {
      x: { min: 0, max: scene.scale.width },
      y: 0,
      lifespan: { min: 4000, max: 7000 },
      speedY: { min: 30, max: 60 },
      scale: { start: 0.6, end: 0.2 },
      quantity: 2,
      blendMode: 'ADD',
      emitZone: { source: new Phaser.Geom.Rectangle(0, -10, scene.scale.width, 10) },
    });

    this.starEmitterNear = scene.add.particles(0, 0, 'particle_star', {
      x: { min: 0, max: scene.scale.width },
      y: 0,
      lifespan: { min: 2000, max: 3500 },
      speedY: { min: 80, max: 140 },
      scale: { start: 1.0, end: 0.3 },
      quantity: 3,
      blendMode: 'ADD',
      emitZone: { source: new Phaser.Geom.Rectangle(0, -10, scene.scale.width, 10) },
    });
  }

  setActive(active) {
    [this.starEmitterFar, this.starEmitterNear].forEach((e) => {
      if (!e) return;
      if (typeof e.start === 'function' && typeof e.stop === 'function') {
        active ? e.start() : e.stop();
      } else if ('emitting' in e) {
        e.emitting = active;
      } else if ('on' in e) {
        e.on = active;
      }
    });
  }
}

window.ParallaxSpace = ParallaxSpace;


