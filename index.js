const gameConfig = {
    type : Phaser.AUTO,
    backgroundColor : "#ffffff",
    scale : {
        mode: Phaser.Scale.FIT,
        width : window.innerWidth,
        height : 300,
        autoCenter : Phaser.Scale.CENTER_BOTH
    },
    physics : {
        default : 'arcade',
        arcade : {
            debug : true
        }
    },
    scene : [GameScene],
    pixelArt: true
}

const GAME = new Phaser.Game(gameConfig);
const WIDTH = GAME.config.width;
const HEIGHT = GAME.config.height;