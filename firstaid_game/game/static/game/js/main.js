import KneeKnockdownScene from './KneeKnockdownScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [KneeKnockdownScene],
    parent: 'game-container'
};

const game = new Phaser.Game(config);

