let score=0;
let scoreText;

class GameScene extends Phaser.Scene{
    preload(){
        // 씬이 로딩될때 가장 처음 호출됨
        this.load.setPath('./assets')
        this.load.image('bg', 'images/ground.png')
        this.load.image('catus', 'images/catus.png')
        this.load.spritesheet('player', 'images/dino.png', {frameWidth : 50, frameHeight : 50});
        this.load.spritesheet('bird', 'images/bird.png', {frameWidth : 85,  frameHeight : 50});
        this.load.spritesheet('player-duck', 'images/dino-duck.png', {frameWidth : 118, frameHeight : 100});
        this.load.bitmapFont('score-font', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    }

    create(){
        //배경
        this.bg = this.add.tileSprite(0, HEIGHT-100, WIDTH, 15, 'bg')
        .setOrigin(0,0)
        
        scoreText = this.add.bitmapText(200, 50, 'score-font', "0", 20)

        //공룡
        this.player = this.physics.add.sprite(50, HEIGHT-100);
        this.player.body.setSize(30,50).setOffset(0, -10);

        this.anims.create({
            key : 'player-run',
            frames : this.anims.generateFrameNames('player', {start : 0, end : 1}),
            frameRate : 5,
            repeat : -1
        })

        this.anims.create({
            key : 'player-ducking',
            frames : this.anims.generateFrameNames('player-duck', {start : 0, end : 1}),
            frameRate : 5,
            repeat : -1
        })
    
        this.player.play('player-run');
        
        //새
        this.time.addEvent({
            delay : 4000,
            callback : this.addBird,
            callbackScope : this,
            loop : true
        })

        //선인장
        this.time.addEvent({
            delay : 2500,
            callback : this.addCatus,
            callbackScope : this,
            loop : true
        })

        //점수
        this.time.addEvent({
            delay : 1,
            callback : this.calculateScore,
            callbackScope : this,
            loop : true
        })

        this.input.keyboard.on('keydown-DOWN', function(){
            this.player.setScale(0.5);
            this.player.body.setSize(70,40)
                    .setOffset(30,30);

            this.player.play('player-ducking')
        }.bind(this))

        this.input.keyboard.on('keyup-DOWN', function(){
            this.player.setScale(1);
            this.player.body.setSize(30,50)
            .setOffset(0, -10); 

            this.player.play('player-run')
        }.bind(this))

        this.input.keyboard.on('keydown-SPACE', function(){
            if(this.player.y < HEIGHT-100) return;
            
            this.tweens.add({
                targets : this.player,
                y : this.player.y - 50,
                duration : 400,
                yoyo:true,
            })
        }.bind(this))
    }

    calculateScore(){
        score++;
    }

    addBird(){
        this.birdGroup = this.physics.add.group();

        var randomX = Phaser.Math.Between(50,150);
        var bird = this.physics.add.sprite(WIDTH+randomX, HEIGHT-130, 'bird')
                        .setScale(0.5);
        
        bird.body.setSize(50, 20);

        this.anims.create({
            key : 'bird-fly',
            frames : this.anims.generateFrameNames('bird', {start : 0, end : 1}),
            frameRate : 5,
            repeat : -1
        })

        bird.play('bird-fly');

        this.birdGroup.add(bird);

        this.tweens.add({
            targets : bird,
            x : 0,
            duration : 3000,
            onComplete : function () {
                bird.destroy()
            }.bind(this)
        })

        this.physics.add.overlap(this.player, this.birdGroup, this.hitCatusOrBird, null, this)
    }

    addCatus() {
        this.catusGroup = this.physics.add.group();
        
        var randomX = Phaser.Math.Between(100, 200);
        var catus = this.physics.add.sprite(WIDTH+randomX, HEIGHT-100, 'catus')
                            .setScale(0.5);
        catus.body.setSize(20, 50);

        this.catusGroup.add(catus);
        
        this.tweens.add({
            targets : catus,
            x : 0,
            duration : 3000,
            onComplete : function(){
                catus.destroy();
            }.bind(this)
        })

        this.physics.add.overlap(this.player, this.catusGroup, this.hitCatusOrBird, null, this)
    }

    hitCatusOrBird() {
        alert("Game Over!");
        this.scene.restart();
    }

    update(){
        this.bg.tilePositionX += 5;

        scoreText.text = score
        console.log(scoreText.text)
    }
}
