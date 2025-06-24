import type { Color, PieceSymbol, Square } from "chess.js";

import { useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({
  board,
  socket,
  chess,
  setBoard,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: any;
  setBoard: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="">
        {board.map((row, i) => {
          return (
            <div className="flex"  key={`row-${i}`}>
              {row.map((square, j) => {
                const squareRepresentation = (String.fromCharCode(
                  97 + (j % 8)
                ) +
                  "" +
                  (8 - i)) as Square;
                return (
                  <div
                    onClick={() => {
                      if (!from) {
                        setFrom(squareRepresentation);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: squareRepresentation,
                              },
                            },
                          })
                        );
                        setFrom(null);
                        // chess.move({
                        //   from,
                        //   to: squareRepresentation,
                        // });
                        // setBoard(chess.board())
                        console.log({
                          from,
                          to: squareRepresentation,
                        });
                      }
                    }}
                    key={`${i}-${j}`}
                    className={`w-[70px] h-[70px] ${
                      (i + j) % 2 === 0 ? "bg-chessLight" : "bg-chessDark"
                    }`}
                  >
                    <div className="flex justify-center items-cente w-full h-full">
                      <div className="flex justify-center items-center h-full">
                        {square ? <img className="w-16" src={`/${square?.color+square?.type}.png `} alt=""/> :null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
