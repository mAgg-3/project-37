var im_car_green;
var im_car_red;
var im_boom;
var im_heart;
var font;
var playerSpeed = 7;
var opponents = [];
var roadMarkings = [];
var score = 0;
var lives = 5;

function preload() {
    im_car_green = loadImage('assets/bike3.jpg');
    im_car_red = loadImage('assets/bike2.jpg');
    im_boom = loadImage('assets/boom.png');
    im_heart = loadImage('assets/firstaid.jpg');
    font = loadFont('assets/8-bit.ttf');
}

function setup() {
    createCanvas(600, 600);

    roadMarkings.push(new roadMarking());
    opponents.push(new Opponent());
    player = new Player();
}

function draw() {
    background(44, 44, 44);

    if (frameCount % 25 === 0) {
        roadMarkings.push(new roadMarking());
    }

    // Show road markings
    for (var i = roadMarkings.length - 1; i >= 0; i--) {
        roadMarkings[i].show();
        roadMarkings[i].update();

        // Remove road markings once the are off the screen
        if (roadMarkings[i].offscreen()) {
            roadMarkings.splice(i, 1);
        }
    }

    // New opponents appear after certain number of frames
    if (frameCount % 130 === 0) {
        opponents.push(new Opponent());
    }

    // Show opponents
    for (var i = opponents.length - 1; i >= 0; i--) {
        opponents[i].show();
        opponents[i].update();

        if (opponents[i].overtakenBy(player) && opponents[i].isOvertakenBy === false) {
            score += 5;
            opponents[i].isOvertakenBy = true;
        }

        // If opponents collide with the player, they get destroyed
        if (opponents[i].hits(player)) {
            opponents[i].boom();
            opponents.splice(i, 1);

            // Penalty for collision is -10, and you loose one life
            score = (score >= 10) ? (score - 10) : 0;
            lives--;
        }
        // Remove opponents once the are off the screen
        else if (opponents[i].offscreen()) {
            opponents.splice(i, 1);
        }
    }

    // Show the player
    player.show();

    // Game controls
    if (keyIsDown(LEFT_ARROW)) {
        player.turnLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.turnRight();
    }

    // Show player stats
    textSize(40);
    textFont(font);
    textAlign(LEFT);
    fill(255);
    text('Score: ' + score, 30, 60);

    for (var i = 0; i < lives; i++) {
        image(im_heart, 30 + (i * 70), height - 60);
    }

    if (score == 50) {
        noLoop();
        textSize(60);
        // textFont(font);
        textStyle(BOLD);
        textAlign(CENTER);
        fill(255);
        text('You Won', width / 2, height / 2);

    }

    // Check if game is over
    if (lives === 0) {
        noLoop();

        textSize(60);
        // textFont(font);
        textStyle(BOLD);
        textAlign(CENTER);
        fill(255);
        text('GAME OVER', width / 2, height / 2);
    }
}