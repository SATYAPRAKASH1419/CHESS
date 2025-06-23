import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendigUser: WebSocket|null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendigUser=null;
    this.users=[];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket)
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user != socket);
  }
  private addHandler(socket:WebSocket) {
           socket.on("message",(data)=>{
                 const message= JSON.parse(data.toString());

                 if(message.type === INIT_GAME){
                    if(this.pendigUser){
                       //already there is a pending user so connect with this
                       //start the game
                       const game=new Game(this.pendigUser,socket);
                       this.games.push(game);
                       this.pendigUser=null;

                    }else{
                       //add as pending user
                       this.pendigUser=socket;
                    }
                 }

                 if(message.type === MOVE){
                    const game =this.games.find(game=>  game.player1 === socket || game.player2===socket);

                    if(game){
                        game.makeMove(socket,message.move);
                    }
                 }
           })
  }
}
