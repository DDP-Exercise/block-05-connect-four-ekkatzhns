"use strict";

export const ROWS = 6;
export const COLUMNS = 7;

export const PLAYER_CHANGE_EVENT = "connectfour:playerchange";
export const STONE_INSERTED_EVENT = "connectfour:stoneinserted";
export const GAME_OVER_EVENT = "connectfour:gameover";
export const INVALID_MOVE_EVENT = "connectfour:invalidmove";

export const model = {
    board: [],
    currentPlayer: 1,
    gameOver: false,
    winningStones: [],

    init: function () {
        this.board = [];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winningStones = [];

        for (let row = 0; row < ROWS; row++) {
            this.board[row] = [];

            for (let column = 0; column < COLUMNS; column++) {
                this.board[row][column] = 0;
            }
        }

        this.sendStoneInsertedEvent();
        this.sendPlayerChangeEvent();
    },

    insertStone: function (column) {
        if (this.gameOver === true) {
            return;
        }

        let row = this.findFreeRow(column);

        if (row === -1) {
            this.sendInvalidMoveEvent("This column is full!");
            return;
        }

        this.board[row][column] = this.currentPlayer;

        this.sendStoneInsertedEvent();

        if (this.checkWin(row, column) === true) {
            this.gameOver = true;
            this.sendGameOverEvent(false);
            return;
        }

        if (this.checkDraw() === true) {
            this.gameOver = true;
            this.sendGameOverEvent(true);
            return;
        }

        this.changePlayer();
    },

    findFreeRow: function (column) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row][column] === 0) {
                return row;
            }
        }

        return -1;
    },

    changePlayer: function () {
        if (this.currentPlayer === 1) {
            this.currentPlayer = 2;
        } else {
            this.currentPlayer = 1;
        }

        this.sendPlayerChangeEvent();
    },

    checkDraw: function () {
        for (let column = 0; column < COLUMNS; column++) {
            if (this.board[0][column] === 0) {
                return false;
            }
        }

        return true;
    },

    checkWin: function (row, column) {
        if (this.checkDirection(row, column, 0, 1) === true) {
            return true;
        }

        if (this.checkDirection(row, column, 1, 0) === true) {
            return true;
        }

        if (this.checkDirection(row, column, 1, 1) === true) {
            return true;
        }

        if (this.checkDirection(row, column, 1, -1) === true) {
            return true;
        }

        return false;
    },

    checkDirection: function (row, column, rowStep, columnStep) {
        let player = this.currentPlayer;
        let stones = [];

        let stonesBefore = this.collectStones(
            row,
            column,
            -rowStep,
            -columnStep,
            player
        );

        let stonesAfter = this.collectStones(
            row,
            column,
            rowStep,
            columnStep,
            player
        );

        for (let i = 0; i < stonesBefore.length; i++) {
            stones.push(stonesBefore[i]);
        }

        stones.push({
            row: row,
            column: column
        });

        for (let i = 0; i < stonesAfter.length; i++) {
            stones.push(stonesAfter[i]);
        }

        if (stones.length >= 4) {
            this.winningStones = [];

            for (let i = 0; i < 4; i++) {
                this.winningStones.push(stones[i]);
            }

            return true;
        }

        return false;
    },

    collectStones: function (row, column, rowStep, columnStep, player) {
        let stones = [];

        let nextRow = row + rowStep;
        let nextColumn = column + columnStep;

        while (
            nextRow >= 0 &&
            nextRow < ROWS &&
            nextColumn >= 0 &&
            nextColumn < COLUMNS &&
            this.board[nextRow][nextColumn] === player
            ) {
            stones.push({
                row: nextRow,
                column: nextColumn
            });

            nextRow = nextRow + rowStep;
            nextColumn = nextColumn + columnStep;
        }

        return stones;
    },

    sendPlayerChangeEvent: function () {
        let event = new CustomEvent(PLAYER_CHANGE_EVENT, {
            detail: {
                currentPlayer: this.currentPlayer
            }
        });

        document.dispatchEvent(event);
    },

    sendStoneInsertedEvent: function () {
        let event = new CustomEvent(STONE_INSERTED_EVENT, {
            detail: {
                board: this.board
            }
        });

        document.dispatchEvent(event);
    },

    sendGameOverEvent: function (isDraw) {
        let event = new CustomEvent(GAME_OVER_EVENT, {
            detail: {
                winner: this.currentPlayer,
                isDraw: isDraw,
                winningStones: this.winningStones
            }
        });

        document.dispatchEvent(event);
    },

    sendInvalidMoveEvent: function (message) {
        let event = new CustomEvent(INVALID_MOVE_EVENT, {
            detail: {
                message: message
            }
        });

        document.dispatchEvent(event);
    }
};