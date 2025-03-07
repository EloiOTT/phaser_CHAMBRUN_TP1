var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors;
var stars;
var scoreText;
var bomb;
var saut = 2;
var nbsaut = 1;


function preload(){
	this.load.image('background','assets/ciel.png');
	this.load.image('etoile','assets/piece.png');
	this.load.image('sol','assets/platforma.png');
	this.load.image('bomb','assets/bombo.png');
	this.load.spritesheet('perso','assets/dudi.png',{frameWidth: 32, frameHeight: 32});
}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,568,'sol').setScale(2).refreshBody();
	platforms.create(200,568,'sol').setScale(2).refreshBody();
	platforms.create(600,568,'sol').setScale(2).refreshBody();
	platforms.create(600,380,'sol');
	platforms.create(70,380,'sol');
	platforms.create(350,220,'sol');

	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 6}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});

	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});

	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}

	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	}
	
	if(cursors.up.isDown && player.body.touching.down){

		saut = 2;

	}


	if ((nbsaut==1) && saut>0 && cursors.up.isDown){

		saut --;

		nbsaut=0;

		if (saut == 1) {

		player.setVelocityY(-330);

			if (player.body.velocity.y<0) {

				player.anims.play('left',true);

			}

		}


		if (saut == 0) {

		player.setVelocityY(-330);

			if (player.body.velocity.y<0) {

				player.anims.play('left',true);

			}

		}

	}


	if (cursors.up.isUp) {

		nbsaut=1;

	}
	
	if(cursors.down.isDown){
		player.setVelocityY(500);
	}

}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ?
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-30, 500), 20);
	}
}
