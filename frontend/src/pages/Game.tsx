import { useEffect, useRef, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const chessRef = useRef(new Chess());
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isStarted,setIsStarted]=useState(false);
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const messsage = JSON.parse(event.data);
      console.log(messsage);
      switch (messsage.type) {
        case INIT_GAME:
            setIsStarted(true);
          chessRef.current = new Chess();
          setBoard(chessRef.current.board());
          console.log("Game Initialized");
          break;
        case MOVE:
          const move = messsage.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("game Over");
          break;
      }
    };
  }, [socket]);
  if (!socket) return <div>Connecting...</div>;
  return (
    <div className="flex justify-center  ">
      <div className="max-w-screen-lg w-full">
        <div className="grid grid-cols-12 w-full   gap-2 ">
          <div className=" col-span-12 lg:col-span-9 h-screen flex flex-col items-center justify-center ">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className=" col-span-12 lg:col-span-3 flex flex-col items-center justify-center  mb-8 lg:mb-0  ">
            <div className="w-96 h-20 lg:h-[560px] lg:w-60 bg-slate-700 flex items-center justify-center  flex-col   ">
              {!isStarted && <button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
                className="bg-chessDark rounded-md  w-[200px]  "
              >
                <div className="flex items-center justify-center m-2">
                  <div className="text-white font-bold text-lg">Start Game</div>
                </div>
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
