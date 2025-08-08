(function () {
  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#000000',
    width: GameConfig.width,
    height: GameConfig.height,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: window.location.search.includes('debug=1') },
    },
    scene: [PreloadScene, GameScene, UIScene],
  };

  window.addEventListener('load', function () {
    new Phaser.Game(config);
  });
})();


