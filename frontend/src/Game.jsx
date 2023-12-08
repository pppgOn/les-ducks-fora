import AuthService from "./logic/AuthService"

const imageDir = "../public/images/"
const happyChar = imageDir + "happy.png"
const thinkingChar = imageDir + "thinking.png"
const neutralChar = imageDir + "neutral.png"
const sadChar = imageDir + "sad.png"
const trigger = imageDir + "trigger.png"
const bricks = imageDir + "bricks.jpg"

const animatedChar1 = imageDir + "char1.png"
const animatedChar2 = imageDir + "char2.png"
const animatedChar3 = imageDir + "char3.png"
const animatedChar4 = imageDir + "char4.png"
const animatedChar5 = imageDir + "char5.png"
const animatedChar6 = imageDir + "char6.png"
const animatedChar7 = imageDir + "char7.png"
const animationDuration = 500;


var answerToDone = 0;
var points = 0;
var reversedPlayer = false;

document.addEventListener('wheel', function (event) {
    event.preventDefault();
  }, { passive: false });
  
  // Disable zooming on touch devices
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });
  
  document.addEventListener('gesturechange', function (event) {
    event.preventDefault();
  });
  
  document.addEventListener('gestureend', function (event) {
    event.preventDefault();
  });

class Animation {
    constructor(frames, duration) {
        this.frames = []
        var firstFrame = new Image();
        frames.forEach((frame) => {
            var frameImage = new Image();
            frameImage.src = frame;
            this.frames.push(frameImage);
        });
        this.animationDuration = duration;
        this.actualAnimationTime = 0;
        this.numberOfFrame = this.frames.length
        this.frameDuration = this.animationDuration/this.numberOfFrame
        this.isActive = false;
    }

    getWidth() {
        return this.frames[Math.floor(this.actualAnimationTime / this.frameDuration)].width;
    }

    getHeight() {
        return this.frames[Math.floor(this.actualAnimationTime / this.frameDuration)].height;
    }

    stop() {
        this.isActive = false;
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.actualAnimationTime = this.frameDuration/2;
        }
    }

    update(time) {
        if (this.isActive) {
            this.actualAnimationTime += time;
            if (this.actualAnimationTime >= this.animationDuration) {
                this.actualAnimationTime = 0;
            }
        } else {
            this.actualAnimationTime = 0;
        }
    }

    getActualFrame() {
        return this.frames[Math.floor(this.actualAnimationTime / this.frameDuration)];
    }
}

export const Game = () => {
    return (
        <div>
            <main class="supermain">
                <div className="game">
                    <canvas id="canvas"></canvas>
                    <div id="popup-overlay">
                        <div className="popup-left-image">
                            <img id="popup-image" src="" alt="Popup Image"/>
                        </div>
                        <div id="popup-content">
                            <div className="popup-right-question" id="popup-question">
                                <p id="explanation"></p>
                                <p id="question"></p>
                                <div id="popup-answers"></div>
                                <button disabled id="close-button" onClick={() => {closePopup()}}>Fermer</button>
                            </div>
                        </div>
                    </div>
                    <div id="popup-end-overlay">
                        <div id="popup-end-content">
                            <div>
                                <p>Niveau terminé !</p>
                                <p id="points"></p>
                            </div>
                            <a id="redirect-end-button" href="/">Revenir à la page d'accueil</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export function showPopup(question) {
    // Show the overlay and popup content
    document.getElementById("close-button").disabled = true;
    document.getElementById("popup-image").src = thinkingChar
    document.getElementById('question').textContent=question.question;
    var answerParagraphe = document.getElementById('popup-answers');
    answerParagraphe.textContent = "";
    var explanation = document.getElementById('explanation');
    explanation.style.backgroundColor = "white";
    explanation.textContent = "";
    question.answers.forEach((answer) => {
        const answerButton = document.createElement("button")
        answerButton.textContent = answer.answer
        answerButton.className = "popup-answer";
        answerButton.onclick = () => {selectAnswer(answer, question, answerButton)};
        answerParagraphe.appendChild(answerButton);
    });
    document.getElementById('popup-overlay').style.display = 'flex';
}

export function selectAnswer(answer, question, answerButton) {
    if (!question.hasAnswered) {
        var explanation = document.getElementById('explanation');
        if (answer.points > 0) {
            document.getElementById("popup-image").src = happyChar
            answerButton.style.backgroundColor = "green";
            answerButton.style.color = "white";
            explanation.style.backgroundColor = "green";
            explanation.style.color = "white";
        } else if (answer.points < 0) {
            document.getElementById("popup-image").src = sadChar
            answerButton.style.backgroundColor = "red";
            answerButton.style.color = "white";
            explanation.style.backgroundColor = "red";
            explanation.style.color = "white";
        } else {
            document.getElementById("popup-image").src = neutralChar
            answerButton.style.backgroundColor = "orange";
            answerButton.style.color = "white";
            explanation.style.backgroundColor = "orange";
            explanation.style.color = "white";
        }
        points += answer.points;
        answerToDone--;
        explanation.textContent=answer.explanation;
        document.getElementById("close-button").disabled = false;
        document.getElementById("close-button").onclick = () => {closePopup()};
    }
    question.hasAnswered = true;
}

export const keys = {};

export function closePopup() {
    // Close the overlay and popup content
    document.getElementById('popup-overlay').style.display = 'none';
}

export class Answer {
    constructor(answer, explanation, points) {
        this.points = points
        this.answer = answer
        this.explanation = explanation
    }
}

export class Question {
    // answers contains points and a other message when you click on it
    constructor(question, answers) {
        this.hasAnswered = false;
        this.question = question
        this.answers = answers
    }
}

export class Action {
    constructor(triggerX, question) {
        this.triggerX = triggerX
        this.question = question
        this.hasTriggered = false;
    }
}

export class GameModel {
    // actions is a list of action
    constructor(backgroundImage, startingX, startingY, triggerImage, actions, level) {
        this.level = level;
        answerToDone = actions.length;
        this.lastUpdateTime = 0;
        this.actions = actions
        this.triggerImage = new Image();
        this.triggerImage.onload = () => this.init();
        this.triggerImage.src = triggerImage;

        this.bricks = new Image();
        this.bricks.onload = () => this.init();
        this.bricks.src = bricks;

        this.background = new Image();
        this.background.onload = () => this.init();
        this.background.src = backgroundImage;
        this.playerAnimarion = new Animation([animatedChar1, animatedChar2, animatedChar3, animatedChar4, animatedChar5, animatedChar6, animatedChar7], animationDuration);

        this.player = {
            x: startingX,
            y: startingY,
            speed: 5, // Adjust the speed as needed
            velX: 0,
        };
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.imagesLoaded = 0;
        this.totalImages = 3; // Adjust this if you have more images to load

        // Set initial canvas size
        this.updateCanvasSize();

        // Add event listener for window resize
        window.addEventListener('resize', () => this.updateCanvasSize());
    }

    init() {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.totalImages) {
            this.update();
        }
    }

    tryToEnd() {
        if(answerToDone == 0) {
            document.getElementById('popup-end-overlay').style.display = 'flex';
            document.getElementById('points').textContent = "Tu as obtenu " + points.toString() + " points !";
            AuthService.pushpoint(points, this.level);
        } else {
            alert("Finnissez toutes les taches avant de quitter le niveau")
            this.player.x-=50;
            keys['ArrowRight'] = false;
            keys['d'] = false;
        }
    }

    updateCanvasSize() {
        // Update canvas size based on window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        var actualTime = Date.now();
        var timeSpend = actualTime - this.lastUpdateTime;
        this.playerAnimarion.update(timeSpend);
        this.lastUpdateTime = actualTime;
        if (keys['ArrowRight'] || keys['d']) {
            // right arrow
            reversedPlayer = false;
            this.player.velX = this.player.speed;
            this.playerAnimarion.start();
        } else if (keys['ArrowLeft'] || keys['q']) {
            // left arrow
            reversedPlayer = true;
            this.playerAnimarion.start();
            this.player.velX = -this.player.speed;
        } else {
            this.playerAnimarion.stop();
            this.player.velX = 0; // No key pressed, stop the player
        }

        if (keys['e'] || keys['space']) {
            this.actions.forEach((action) => {
                if (!action.hasTriggered && action.triggerX + this.triggerImage.width > this.player.x && action.triggerX + this.triggerImage.width < this.player.x + this.playerAnimarion.getWidth()) {
                    action.hasTriggered = true;
                    showPopup(action.question)
                }
            });
        }

        // Move the player
        this.player.x += this.player.velX;
        if (this.player.x < 0) {
            this.player.x = 0;
        } else if (this.player.x > this.background.width - this.playerAnimarion.getActualFrame().width) {
            this.player.x = this.background.width - this.playerAnimarion.getActualFrame().width;
            this.tryToEnd();
        }

        // Calculate the offset to keep the player centered
        const offsetX = (this.canvas.width - this.playerAnimarion.getWidth()) / 2 - this.player.x;
        const offsetY = (this.canvas.height - this.playerAnimarion.getHeight()) / 2 - this.player.y;

        // Render the game with the calculated offset
        this.render(offsetX, offsetY);

        requestAnimationFrame(() => this.update());
    }

    render(offsetX, offsetY) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.drawImage(this.background, offsetX, offsetY, this.background.width, this.background.height);

        // Draw actions
        this.actions.forEach((action) => {
            this.ctx.drawImage (this.triggerImage, action.triggerX + offsetX, this.player.y + offsetY)
        });

        // Draw player
        if (reversedPlayer) {
            this.ctx.save();

            // Translate the context to the center of the image
            this.ctx.translate(this.player.x + offsetX + this.playerAnimarion.getActualFrame().width / 2, this.player.y + offsetY + this.playerAnimarion.getActualFrame().height / 2);

            // Scale the context horizontally by -1 to flip the image horizontally
            this.ctx.scale(-1, 1);

            // Draw the flipped image (centered at the translated position)
            this.ctx.drawImage(this.playerAnimarion.getActualFrame(), -this.playerAnimarion.getActualFrame().width / 2, -this.playerAnimarion.getActualFrame().height / 2);

            // Restore the transformation matrix to its original state
            this.ctx.restore();
        } else {
            this.ctx.drawImage(this.playerAnimarion.getActualFrame(), this.player.x + offsetX, this.player.y + offsetY);
        }
        
        
        
    }
}

export default Game;