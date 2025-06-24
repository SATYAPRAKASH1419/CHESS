"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const zod_1 = require("zod");
const moveSchema = zod_1.z.object({
    from: zod_1.z.string().length(2),
    to: zod_1.z.string().length(2),
});
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        //validation of user->user and move using zod
        const validation = moveSchema.safeParse(move);
        if (!validation.success) {
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Invalid move format. 'from' and 'to' must be valid squares like 'e2'.",
                },
            }));
            return;
        }
        const currentTurn = this.board.turn();
        if (currentTurn === "w" && socket !== this.player1) {
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "NOT your turn (White Moves Now)"
                }
            }));
            return;
        }
        if (currentTurn === "b" && socket !== this.player2) {
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Not your turn (black moves now)"
                }
            }));
            return;
        }
        const result = this.board.move(move);
        if (!result) {
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Illegal move. Please try again.",
                },
            }));
            return;
        }
        //check if the game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        else {
            //if not over
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        //send the updated board to the both player
    }
}
exports.Game = Game;
