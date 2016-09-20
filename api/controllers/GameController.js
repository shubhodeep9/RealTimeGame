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
  				if(game.users.length < 4 && game.users.indexOf(user.id)<0){
	  				if((game.allowed.length>0 && game.allowed.indexOf(req.session.user)>=0) || game.allowed.length==0){
	  					game.users.push(user.id);
	  					game.save(function(err){
	  						sails.sockets.blast('gameUpdated',game);
	  						User.find({id:game.users}).exec(function(err,users){
	  							sails.sockets.broadcast(game.id,'gamePlayers',users);
	  						});
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
				User.find({id:game.users}).exec(function(err,users){
					res.view('game',{users:users,title:game.name});
				});
			} else {
				res.redirect('/');
			}
		});
  	} else {
  		res.redirect('/auth/login');
  	}
  },
  subscribe: function(req,res){
  	if(req.isSocket && req.session.game){
  		sails.sockets.join(req,req.session.game,function(err){
  			return res.json({
  				message: 'Done'
  			});
  		});
  	}
  },

  leave: function(req,res){
  	if(req.method == "POST" && req.session.user && req.session.game && req.isSocket){
  		sails.sockets.leave(req,req.session.game,function(err){
  			if(err){
  				console.log(err);
  				res.serverError(err);
  			} else {
  				Game.findOne({id:req.session.game},function(err,game){
		          	game.users.splice(game.users.indexOf(req.session.user),1);
		          	game.save(function(err){
		            	sails.sockets.blast('gameUpdated',game);
		            	User.find({id:game.users}).exec(function(err,users){
  							sails.sockets.broadcast(game.id,'gamePlayers',users);
				          	req.session.game = null;
		  				  	res.ok();
  						});
		          	});
		        });
  			}
  		})
  	}
  }
};

