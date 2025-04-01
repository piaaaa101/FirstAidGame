import KneeKnockdownScene from './KneeKnockdownScene.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,  // Makes canvas fill window
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [KneeKnockdownScene],
    parent: 'game-container',
    backgroundColor: '#ffffff'
};

new Phaser.Game(config);
