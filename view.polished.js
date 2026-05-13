"use strict";

import {
    ROWS,
    COLUMNS,
    PLAYER_CHANGE_EVENT,
    STONE_INSERTED_EVENT,
    GAME_OVER_EVENT,
    INVALID_MOVE_EVENT
} from "./model.connectfour.js";

export const polishedView = {
    boardElement: document.querySelector("#board"),
    buttonsElement: document.querySelector("#buttons"),
    currentPlayerText: document.querySelector("#currentPlayerText"),
    messageElement: document.querySelector("#message"),

    init: function () {
        this.createButtons();
        this.createBoard();

        document.addEventListener(PLAYER_CHANGE_EVENT, function (event) {
            polishedView.showCurrentPlayer(event.detail.currentPlayer);
        });

        document.addEventListener(STONE_INSERTED_EVENT, function (event) {
            polishedView.updateBoard(event.detail.board);
            polishedView.showMessage("");
        });

        document.addEventListener(GAME_OVER_EVENT, function (event) {
            polishedView.showGameOver(event.detail);
        });

        document.addEventListener(INVALID_MOVE_EVENT, function (event) {
            polishedView.showMessage(event.detail.message);
        });
    },

    createButtons: function () {
        this.buttonsElement.innerHTML = "";

        for (let column = 0; column < COLUMNS; column++) {
            let button = document.createElement("button");

            button.textContent = "↓";
            button.classList.add("columnButton");
            button.dataset.column = column;

            this.buttonsElement.appendChild(button);
        }
    },

    createBoard: function () {
        this.boardElement.innerHTML = "";

        for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
                let cell = document.createElement("div");

                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.column = column;

                this.boardElement.appendChild(cell);
            }
        }
    },

    updateBoard: function (board) {
        for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
                let cell = document.querySelector(
                    '[data-row="' + row + '"][data-column="' + column + '"]'
                );

                cell.innerHTML = "";
                cell.classList.remove("winnerStone");

                if (board[row][column] === 1) {
                    let stone = document.createElement("div");

                    stone.classList.add("stone");
                    stone.classList.add("player1");
                    stone.textContent = "🐱";

                    cell.appendChild(stone);
                }

                if (board[row][column] === 2) {
                    let stone = document.createElement("div");

                    stone.classList.add("stone");
                    stone.classList.add("player2");
                    stone.textContent = "🐶";

                    cell.appendChild(stone);
                }
            }
        }
    },

    showCurrentPlayer: function (player) {
        if (player === 1) {
            this.currentPlayerText.textContent = "Current player: Kitty 🐱";
        }

        if (player === 2) {
            this.currentPlayerText.textContent = "Current player: Doggy 🐶";
        }
    },

    showMessage: function (message) {
        this.messageElement.textContent = message;
    },

    showGameOver: function (result) {
        if (result.isDraw === true) {
            this.currentPlayerText.textContent =
                "Draw! Kitty and Doggy share the snack crown.";
            return;
        }

        if (result.winner === 1) {
            this.currentPlayerText.textContent =
                "Kitty 🐱 wins the snack crown!";
        }

        if (result.winner === 2) {
            this.currentPlayerText.textContent =
                "Doggy 🐶 wins the snack crown!";
        }

        this.markWinningStones(result.winningStones);
    },

    markWinningStones: function (winningStones) {
        for (let i = 0; i < winningStones.length; i++) {
            let stone = winningStones[i];

            let cell = document.querySelector(
                '[data-row="' + stone.row + '"][data-column="' + stone.column + '"]'
            );

            cell.classList.add("winnerStone");
        }
    }
};