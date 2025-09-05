'use strict';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .post((req, res) =>{
    res.json({ test: "test"});
  });
    
  app.route('/api/replies/:board');

};
