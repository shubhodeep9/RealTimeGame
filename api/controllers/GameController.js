/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `GameController.create()`
   */
  create: function (req, res) {
  	if(req.method == "POST" && req.isSocket && req.cookies.user!=null){
  		User.findOne({id: req.cookies.user}).exec(function(err, user){
			var newGame = req.param("Game");
			newGame.users = [user.id];
			Game.create(newGame).exec(function(err,model){
				if(err){
					res.badRequest();
				} else {
					sails.sockets.blast('gameCreated',model);
					res.cookie('game',model.id);
					res.redirect('/game/play');
				}
			});
			res.ok();
		});
  	}
  },
  join: function (req,res) {
  	if(req.method == "POST" && req.cookies.user!=null && req.cookies.game==null && req.param("gameid",null)!=null && req.isSocket){
  		User.findOne({id: req.cookies.user}).exec(function(err, user){
  			Game.find({id:req.param("gameid")}).exec(function(err, game){
  				if(game.users.length < 4){
	  				if((game.allowed.length>0 && game.allowed.indexOf(req.cookies.user)>=0) || game.allowed.length==0){
	  					Game.update({id:req.param("gameid")},{$push:{users: user.id}}).exec(function(err, updated){
	  						sails.sockets.blast('gameUpdated',updated);
	  					});
	  				}
  				}
  			});
  		});
  	}
  }
};

