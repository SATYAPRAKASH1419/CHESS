import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { z } from "zod";

const moveSchema = z.object({
  from: z.string().length(2),
  to: z.string().length(2),
});
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;

  private startTime: Date;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();

    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    //validation of user->user and move using zod
    const validation = moveSchema.safeParse(move);
    if (!validation.success) {
      socket.send(
        JSON.stringify({
          type: "error",
          payload: {
            message: "Invalid move format. 'from' and 'to' must be valid squares like 'e2'.",
          },
        })
      );
      return;
    }
    const currentTurn = this.board.turn();
    if (currentTurn === "w" && socket !== this.player1) {
     socket.send(
        JSON.stringify({
            type:"error",
            payload:{
                message:"NOT your turn (White Moves Now)"
            }
        })
     )
      return;
    }
    if (currentTurn === "b" && socket !== this.player2) {
      socket.send(
        JSON.stringify({
            type:"error",
            payload:{
                message:"Not your turn (black moves now)"
            }
        })
      )

      return;
    }

       const result = this.board.move(move);
       if (!result) {
      socket.send(
        JSON.stringify({
          type: "error",
          payload: {
            message: "Illegal move. Please try again.",
          },
        })
      );
      return;
    }

    //check if the game is over
    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    } else {
      //if not over
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }

    //send the updated board to the both player
  }
}
