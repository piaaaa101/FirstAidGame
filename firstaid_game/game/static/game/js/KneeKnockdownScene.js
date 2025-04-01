// KneeKnockdownScene.js
export default class KneeKnockdownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'KneeKnockdownScene' });
    }

    preload() {
        this.load.image('body', '/static/images/body_outline.png');
        this.load.image('bandage', '/static/images/bandage.png');
        this.load.image('kneeZone', '/static/images/knee_target.png');
}


    create() {
        // Background body
        this.add.image(400, 300, 'body').setScale(0.8);

        // Drop zone (invisible or semi-transparent)
        const kneeZone = this.add.image(400, 440, 'kneeZone').setScale(0.5).setAlpha(0.2);
        kneeZone.setInteractive({ dropZone: true });

        // Draggable bandage
        const bandage = this.add.image(100, 500, 'bandage').setScale(0.5).setInteractive();
        this.input.setDraggable(bandage);

        // Drag logic
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // Drop logic
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (dropZone === kneeZone) {
                gameObject.x = kneeZone.x;
                gameObject.y = kneeZone.y;
                gameObject.disableInteractive();

                // Feedback
                this.add.text(300, 100, '✅ Nice! You treated the injury!', {
                    fontSize: '24px',
                    color: '#008800',
                    fontFamily: 'Arial'
                });
            }
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = 100;
                gameObject.y = 500;
            }
        });
    }
}
