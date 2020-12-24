var express = require('express');
const bodyParser = require('body-parser');
const Team=require('../Model/teamModel')
var teamRouter = express.Router();


/* GET users listing. */
teamRouter.get('/fatchTeam', function(req, res, next) {
  const limit = parseInt(req.query.limit); 
  const skip = parseInt(req.query.skip);
  Team.find({}).sort({ score: -1 }).skip(skip) // Always apply 'skip' before 'limit'
  .limit(limit)
  .then((teams) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(teams);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post('/addTeam',(req,res,next)=>{
  Team.find({})
  .then(teams=>{
    user = teams.filter(team => team.team_name === req.body.team_name)[0];
    if(user){
         res.status(400).send({errMsg:'The team name already exist!!'})
       }else{
        Team.create(req.body)
        .then((team) => {
            console.log('Team added ', team);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(team);
        }, (err) => next(err))
        .catch((err) => next(err));
       }
     })
     .catch((err) => next(err));
 
})
.put('/update',(req, res, next) => {

  Team.findByIdAndUpdate(req.body._id, {
      $set: req.body
  }, { new: true })
  .then((dish) => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err));
})
module.exports = teamRouter;