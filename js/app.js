var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('ground', 'assets/images/platform.png');
    this.load.image('star', 'assets/images/star.png');
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.spritesheet('dude', 'assets/images/dude.png',{ frameWidth: 32, frameHeight: 48 });
}

var platforms;
var player; 
var stars; 
var bombs;
var score = 0;
var collectCounter = 0;
var starCounter = 0;
var scale = 0;
var scoreText;

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, null, this);
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    collectCounter += 1
    starCounter += 1

    if(collectCounter==5){
        scale+=1;
        player.setScale(scale);
        collectCounter=0
    }

    if (stars.countActive(true) < 12)
    {
        var x = Phaser.Math.Between(0, 800);

        var star = stars.create(x, 16, 'star');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    switch(starCounter){
        case starCounter=1:
            player.setTint(0xff0000);
            break;

        case starCounter=2:
            player.setTint(0xffa500);
            break;

        case starCounter=3:
            player.setTint(0xffff00);
            break;

        case starCounter=4:
            player.setTint(0x00ff00);
            break;

        case starCounter=5:
            player.setTint(0x0000ff);
            break;

        case starCounter=6:
            player.setTint(0x4b0082);
            break;

        case starCounter=7:
            player.setTint(0x8f00ff);
            starCounter = 0;
            break;
    }

}

function update ()
{   
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }

    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }

    else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
    }
}