export default class KneeKnockdownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'KneeKnockdownScene' });
    }

    preload() {
        // Load your new video for background
        this.load.video('kneeknockdown_video', '/static/videos/kneeknockdown3.mp4');

        // Load icons for drag-and-drop
        this.load.image('wash_hands', '/static/images/5.png');
        this.load.image('evaluate', '/static/images/6.png');
        this.load.image('clean', '/static/images/3.png');
        this.load.image('dry', '/static/images/4.png');
        this.load.image('antiseptic', '/static/images/2.png');
        this.load.image('bandage', '/static/images/1.png');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Add the video as the background
        this.video = this.add.video(centerX, centerY, 'kneeknockdown_video');
        this.video.setDisplaySize(this.scale.width, this.scale.height); // Ensure it fills the screen
        this.video.setLoop(true); // Loop the video
        this.video.play();  // Play the video immediately
        this.video.setDepth(-1); // Put video behind everything

        // Feedback text (will be hidden until drag-and-drop starts)
        this.feedbackText = this.add.text(centerX - 200, 30, 'Video playing...', {
            fontSize: '22px',
            color: '#008000',
            fontFamily: 'Arial'
        }).setDepth(5);

        // Call the function to show the game UI after 20 seconds
        this.time.delayedCall(20000, this.startDragAndDrop, [], this);  // 20000 ms = 20 seconds

        // Step order for drag-and-drop game (hidden until 20s)
        this.stepOrder = ['wash_hands', 'evaluate', 'clean', 'dry', 'antiseptic', 'bandage'];
        this.currentStepIndex = 0;
        this.dropZoneGraphics = {};
        this.stepInstruction = this.add.text(centerX, centerY - 300, '', {
            fontSize: '20px',
            color: '#000000',
            fontFamily: 'Arial',
            backgroundColor: '#ffffe0',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setDepth(6);

        this.progressBar = this.add.graphics();
        this.updateProgressBar();

        // Retry button (hidden until game finishes)
        this.retryBtn = this.add.text(centerX, centerY + 280, '🔁 Retry', {
            fontSize: '20px', color: '#000', backgroundColor: '#ffffcc', padding: 10
        }).setOrigin(0.5).setInteractive().setVisible(false).on('pointerdown', () => this.scene.restart());
    }

    startDragAndDrop() {
        // Remove video and show the drag-and-drop game
        this.feedbackText.setText('Now, drag and drop the items!');  // Update feedback text

        // Create draggable icons
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const steps = [
            { key: 'wash_hands', x: centerX - 350, y: centerY - 150, label: "Wash" },
            { key: 'evaluate', x: centerX - 350, y: centerY, label: "Evaluate" },
            { key: 'clean', x: centerX - 350, y: centerY + 150, label: "Clean" },
            { key: 'dry', x: centerX + 350, y: centerY - 150, label: "Dry" },
            { key: 'antiseptic', x: centerX + 350, y: centerY, label: "Antiseptic" },
            { key: 'bandage', x: centerX + 350, y: centerY + 150, label: "Bandage" },
        ];

        steps.forEach((step) => {
            const icon = this.add.image(step.x, step.y, step.key)
                .setScale(0.3)
                .setInteractive();
            icon.setData('stepKey', step.key);
            icon.setData('originalX', step.x);
            icon.setData('originalY', step.y);
            icon.setDepth(2);
            this.input.setDraggable(icon);

            this.add.text(step.x - 30, step.y + 40, step.label, {
                fontSize: '12px', color: '#000', fontFamily: 'Arial'
            }).setDepth(3);
        });

        this.input.on('dragstart', (_, gameObject) => {
            const stepKey = gameObject.getData('stepKey');
            const currentStep = this.stepOrder[this.currentStepIndex];

            if (stepKey === currentStep) {
                this.dropZoneGraphics[stepKey].clear();
                this.dropZoneGraphics[stepKey].lineStyle(4, 0xffff99, 1);
                this.dropZoneGraphics[stepKey].strokeRect(
                    this.stepZones[stepKey].x - 40,
                    this.stepZones[stepKey].y - 40,
                    80, 80
                );
            }
        });

        this.input.on('drag', (_, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (_, gameObject, dropZone) => {
            const currentStep = this.stepOrder[this.currentStepIndex];
            const itemStep = gameObject.getData('stepKey');

            // Reset highlights
            for (let gfx of Object.values(this.dropZoneGraphics)) {
                gfx.clear();
            }

            if (itemStep === currentStep && dropZone === this.stepZones[itemStep]) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();

                this.feedbackText.setText(`✅ Step ${this.currentStepIndex + 1}: ${itemStep.replace('_', ' ')}`);
                this.speakText(`Step ${this.currentStepIndex + 1}: ${itemStep.replace('_', ' ')} completed.`);
                this.currentStepIndex++;
                this.updateProgressBar();

                if (this.currentStepIndex === this.stepOrder.length) {
                    this.add.text(centerX - 200, 100, '🎉 All steps completed! Great job!', {
                        fontSize: '26px', color: '#0044cc', fontFamily: 'Arial'
                    }).setDepth(6);
                    this.retryBtn.setVisible(true);
                } else {
                    this.announceCurrentStep();
                }
            } else {
                const originalX = gameObject.getData('originalX');
                const originalY = gameObject.getData('originalY');
                gameObject.setPosition(originalX, originalY);
                this.feedbackText.setText('❌ Wrong step or location — try again!');
                this.speakText(`That's not the right step. Try again.`);
            }
        });

        this.input.on('dragend', (_, gameObject, dropped) => {
            if (!dropped) {
                const originalX = gameObject.getData('originalX');
                const originalY = gameObject.getData('originalY');
                gameObject.setPosition(originalX, originalY);
                for (let gfx of Object.values(this.dropZoneGraphics)) {
                    gfx.clear();
                }
            }
        });
    }

    updateProgressBar() {
        const progressWidth = 300;
        const stepCount = this.stepOrder.length;
        const completed = this.currentStepIndex;

        this.progressBar.clear();
        this.progressBar.fillStyle(0xcccccc);
        this.progressBar.fillRect(50, 20, progressWidth, 15);
        this.progressBar.fillStyle(0x88cc88);
        this.progressBar.fillRect(50, 20, (completed / stepCount) * progressWidth, 15);
        this.progressBar.setDepth(4);
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    announceCurrentStep() {
        const stepKey = this.stepOrder[this.currentStepIndex];
        const instructions = {
            wash_hands: 'Wash your hands near the top left.',
            evaluate: 'Evaluate the wound in the center-upper area.',
            clean: 'Clean the wound just below the center.',
            dry: 'Dry around the right side.',
            antiseptic: 'Apply antiseptic on the left side.',
            bandage: 'Finally, bandage the wound near the bottom center.'
        };
        const message = `Step ${this.currentStepIndex + 1}: ${instructions[stepKey]}`;
        this.stepInstruction.setText(message);
        this.speakText(message);
    }
}
