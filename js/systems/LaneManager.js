class LaneManager {
  constructor(scene, laneCount, screenHeight) {
    this.scene = scene;
    this.laneCount = laneCount;
    const topPadding = Math.floor(screenHeight * 0.12);
    const bottomPadding = Math.floor(screenHeight * 0.06);
    const usableHeight = screenHeight - topPadding - bottomPadding;
    this.laneYs = Array.from({ length: laneCount }, (_, i) =>
      Math.round(topPadding + usableHeight * (0.5 + i) / laneCount)
    );
  }

  clampLane(index) {
    return Phaser.Math.Clamp(index, 0, this.laneCount - 1);
  }

  getYForLane(index) {
    const clamped = this.clampLane(index);
    return this.laneYs[clamped];
  }
}

window.LaneManager = LaneManager;


