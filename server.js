#!/usr/bin/env node
import {fenToBoard, boardToFen} from "./helper.js";
import { Chess } from 'chess.js'
import express from "express";
import stockfish from "stockfish";
const app = express()
const port = 8080
const engine = stockfish();
const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/"


engine.onmessage = function(msg) {
  console.log(msg);
};

engine.postMessage("uci");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', (request, response) => {
 let chess = new Chess(request.query.fen);

 if (request.query.move) {
     try {
         chess.move(request.query.move)
     } catch {
         response.send({
             status: false,
             moveName: "",
             FEN: "",
             board: []
         });
     }

 }
// if chess engine replies
  engine.onmessage = function(msg) {
    console.log(msg);
    // in case the response has already been sent?
    if (response.headersSent) {
        return;
    }
    // only send response when it is a recommendation
    if (typeof(msg == "string") && msg.match("bestmove")) {
        let move = msg.split(" ")[1];
        let c = chess.get(move.substring(0, 2));
        let moveObject = {from: move.substring(0, 2), to: move.substring(2, 4) };
        if (move.length == 5) {
            moveObject.promotion = move.charAt(4);
        }
        chess.move(moveObject);
        response.send({
            status:true,
            moveName: move,
            FEN: chess.fen(),
            board : fenToBoard(chess.fen())
        });
    }
  }

// run chess engine
  engine.postMessage("ucinewgame");
  let a = request.query.move ? chess.fen() : request.query.fen;
  engine.postMessage("position fen " + a);
  engine.postMessage("go depth " + (request.query.elo * 3 - 3));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})