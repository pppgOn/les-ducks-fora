import React, { useEffect, useState } from 'react';
import AuthService from '../logic/AuthService';
import tokenService from "../logic/token.service.jsx";

import { Action, Answer, Question, GameModel, Game } from '../Game.jsx';
import { keys, showPopup, closePopup } from '../Game.jsx';
import levelJson from "../../public/json/levelHouse.json"

let isLoggedIn = false; 
const LevelHouse = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const user = tokenService.getUser();
        isLoggedIn = user !== "{}";
        // If not logged in, redirect to the login page
        if (!isLoggedIn) {
            window.location.href = '/signin';
        }
        const actions = []
        for (const question of levelJson.questions) {
            var answers = []
            for (const answer of question.answers) {
                answers.push(new Answer(answer.answer, answer.explanation, answer.points))
            }
            actions.push(new Action(question.positionX, new Question(question.question, answers)))
        }

    var gameModel = new GameModel('../public/images/mapHouse.png', 0, 600, '../public/images/trigger.png', actions, 1);

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