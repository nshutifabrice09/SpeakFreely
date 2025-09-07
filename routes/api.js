'use strict';

const BoardModel = require("./models").Board;
const ThreadModel = require("./models").Thread;
const ReplyModel = require("./models").Reply;

module.exports = function (app) {
  
  app.route("/api/threads/:board").post(async (req, res) => {
    const { text, delete_password } = req.body;
    let board = req.body.board;
    if (!board) {
      board =req.params.board;
    }
    console.log("post", req.body);
    const newThread = new ThreadModel ({
      text: text,
      delete_password: delete_password,
      replies: [],
    });
    console.log("newThread", newThread);

   let Boarddata = await BoardModel.findOne({ name: board });
      if (!Boarddata) {
        const newBoard = new BoardModel({
          name: board,
          threads: [],
        });
        console.log("newBoard", newBoard);
        newBoard.threads.push(newThread);
        newBoard.save(( error, data) => {
          console.log("newBoardData", data);
          if (error || !data) {
            console.log(error);
            res.send("There was an error saving in post");
          } else {
            res.json(newThread);
          }
        });
      } else {
        Boarddata.threads.push(newThread);
        Boarddata.save((error, data) => {
          if (error || !data) {
            console.log(error);
            res.send("There was an error saving in post");
          } else {
            res.json(newThread);
          }
        });
      }
    });
  
    
  app.route('/api/replies/:board');

};