'use strict';

const { Board } = require("../models");

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;

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
    })
    .get((req, res) => {
      const board = req.params.board;
      let BoardModel = BoardModel.findOne({ name: board }, (error, data) => {
        if (!data) {
          console.log("No baord with this name");
          res.json({ error: "No board with this name"});
        } else{
          console.log("data", data);
          const threads = data.threads.map((thread) => {
            const {
              _id,
              text,
              created_on,
              bumped_on,
              reported,
              delete_password,
              replies,
            } = threads;
            return {
              _id,
              text,
              created_on,
              bumped_on,
              reported,
              delete_password,
              replies,
              replycount: thread.replies.length,
            };
          });
          res.json(threads);
        }
      });
    }).put((req, res) => {
      console.log("put", req.body);
      const { report_id } = req.body;
      const board = req.params.board;
      let BoardModel = BoardModel.findOne ({ name: board}, (error, boardData) => {
        if (!boardData) {
          res.json("error", "Board not found");
        } else {
          const date = new Date();
          let reportedThread = boardData.threads.id(report_id);
          reportedThread.reported = true;
          reportedThread.bumped_on = date;
          boardData.save((error, updateData) => {
            res.send("Success!")
          })
        }
      }).delete((req, res) => {
        console.log("delete", req.body);
        const { thread_id, delete_password } = req.body;
        const board = req.params.board;
        let BoardModel = BoardModel.findOne({ name: board }, (error, boardData) => {
          if(!boardData) {
            res.json("Error", "Board not found");
          } else {
            let threadToDelete = boardData.threads.id(thread_id);
            if (threadToDelete.delete_password === delete_password) {
              threadToDelete.remove();
            } else {
              res.send("Incorrect Password!");
              return;
            }
            boardData.save((error, updateData) => {
              res.send("Suceess!")
            })
          }
        });
      })
    });
    
  app.route('/api/replies/:board').post((req, res) => {
    console.log("thread", req.body);
    const { thread_id, text, delete_password } = req.body;
    const baord = req.params.body;
    const newReply = new ReplyModel ( {
      text: text,
      delete_password: delete_password,
    });
    let BoardModel = BoardModel.findOne({ name: board}, (error, boardData) => {
      if (!boardData) {
        res.json("error", "Board not found!");
      } else {
        const date = new Date();
        let threadToAddReply = boardData.threads.id(thread_id);
        threadToAddReply.bumped_on = date;
        threadToAddReply.replies.push(newReply);
        boardData.save((error, updateData) => {
          res.json(updateData);
        });
      }
    });
  }).get((req, res) => {
    const board = req.params.board;
    let BoardModel = BoardModel.findOne({ name: board }, (error, data) => {
      if (!data) {
        console.log("No board with this name.");
        res.json({ error: "No board with this name."});
      } else {
        console.log("data", data);
        const thread = data.thread.id(req.query.thread_id);
        res.json(thread);
      }
    })
  })

};