import React, { useEffect } from 'react';
import { Action, Answer, Question, GameModel, Game } from '../Game.jsx';
import { keys, showPopup, closePopup } from '../Game.jsx';
import levelJson from "../../public/json/levelTransport.json"

const LevelHouse = () => {
    useEffect(() => {
        const actions = []
        for (const question of levelJson.questions) {
            var answers = []
            for (const answer of question.answers) {
                answers.push(new Answer(answer.answer, answer.explanation, answer.points))
            }
            actions.push(new Action(question.positionX, new Question(question.question, answers)))
        }

    var gameModel = new GameModel('../public/images/mapTransport.png', 0, 600, '../public/images/trigger.png', actions, 2);

    // Event listeners for key input
    document.body.addEventListener("keydown", function (e) {
        keys[e.key] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.key] = false;
    });
  }, []);
  return <Game />;
};

export default LevelHouse;