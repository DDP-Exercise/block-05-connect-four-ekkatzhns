"use strict";

import { model } from "./model.connectfour.js";
import { polishedView } from "./view.polished.js";
import { consoleView } from "./view.console.js";

const controller = {
    init: function () {
        polishedView.init();
        consoleView.init();

        this.addColumnButtonListener();
        this.addRestartButtonListener();

        model.init();
    },

    addColumnButtonListener: function () {
        polishedView.buttonsElement.addEventListener("click", function (event) {
            if (event.target.classList.contains("columnButton")) {
                let column = Number(event.target.dataset.column);

                model.insertStone(column);
            }
        });
    },

    addRestartButtonListener: function () {
        let restartButton = document.querySelector("#restartButton");

        restartButton.addEventListener("click", function () {
            model.init();
        });
    }
};

controller.init();