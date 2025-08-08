// Global configuration and shared event bus
(function () {
  window.GameConfig = {
    width: 768,
    height: 432,
    lanes: 3,
    baseWorldSpeed: 180, // px/s
    worldSpeedRampPerSecond: 0.02, // px/s per second
    energyMax: 100,
    energyDrainPerSecond: 4,
  };

  // Cross-scene event emitter
  window.GameEvents = new Phaser.Events.EventEmitter();
})();


