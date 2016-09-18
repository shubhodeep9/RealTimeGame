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
  	if(req.method == "POST" && req.isSocket && req.session.user!=null){
  		User.findOne({id: req.session.user}).exec(function(err, user){
			var newGame = req.param("Game");
			newGame.users = [user.id];
			Game.create(newGame).exec(function(err,model){
				if(!err) {
					sails.sockets.blast('gameCreated',model);
				}
			});
			res.ok();
		});
  	}
  },
  join: function (req,res) {
  	if(req.method == "POST" && req.session.user && !req.session.game && req.param("gameid",null)!=null && req.isSocket){
  		User.findOne({id: req.session.user}).exec(function(err, user){
  			Game.findOne({id:req.param("gameid")}).exec(function(err, game){
  				if(game.users.length < 4){
	  				if((game.allowed.length>0 && game.allowed.indexOf(req.session.user)>=0) || game.allowed.length==0){
	  					game.users.push(user.id);
	  					game.save(function(err){
	  						sails.sockets.blast('gameUpdated',game);
	  						res.ok();
	  					});
	  				} else {
	  					res.forbidden();
	  				}
  				} else {
  					res.badRequest();
  				}
  			});
  		});
  	}
  },
  play: function (req,res){
  	if(req.session.user){
		Game.findOne({users:req.session.user}).exec(function(err,game){
			if(game!=null){
				req.session.game = game.id;
				res.view('game',{layout:'layout'});
				console.log('In the game');
			} else {
				res.redirect('/');
			}
		});
  	} else {
  		res.redirect('/auth/login');
  	}
  },

  leave: function(req,res){
  	console.log(req.session.user);
  }
};

