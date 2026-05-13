"use strict";

import {
    PLAYER_CHANGE_EVENT,
    STONE_INSERTED_EVENT,
    GAME_OVER_EVENT,
    INVALID_MOVE_EVENT
} from "./model.connectfour.js";

export const consoleView = {
    init: function () {
        document.addEventListener(PLAYER_CHANGE_EVENT, function (event) {
            console.log("Current player:", event.detail.currentPlayer);
        });

        document.addEventListener(STONE_INSERTED_EVENT, function (event) {
            console.table(event.detail.board);
        });

        document.addEventListener(GAME_OVER_EVENT, function (event) {
            if (event.detail.isDraw === true) {
                console.log("Game over: draw");
            } else {
                console.log("Game over. Winner:", event.detail.winner);
                console.log("Winning stones:", event.detail.winningStones);
            }
        });

        document.addEventListener(INVALID_MOVE_EVENT, function (event) {
            console.log("Invalid move:", event.detail.message);
        });
    }
};