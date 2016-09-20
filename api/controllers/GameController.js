/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `GameController.create()`
   * The controller creates a new game,
   * and pushes the update to the public\
   * socket handler.
   * @params req, res
   * @return Response status code
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

  /**
  * The controller that enables one user to join\
  * a game from the list in index page.
  * Broadcasts the number of playes to public\
  * socket handler.
  * @params req, res
  * @return Response status code
  */
  join: function (req,res) {
  	if(req.method == "POST" && req.session.user && !req.session.game && req.param("gameid",null)!=null && req.isSocket){
  		User.findOne({id: req.session.user}).exec(function(err, user){
  			Game.findOne({id:req.param("gameid")}).exec(function(err, game){
  				if(game.users.length < 4 && game.users.indexOf(user.id)<0){
	  				if((game.allowed.length>0 && game.allowed.indexOf(user.username)>=0) || game.allowed.length==0){
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

  /**
  * The controller sets the game session\
  * Renders the view for the page /game/play
  * @params req, res
  * @return Renders game.ejs
  */
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

  /**
  * The controller joins the socket to the session game room.
  * @params req, res
  * @return response json
  */
  subscribe: function(req,res){
  	if(req.isSocket && req.session.game){
  		sails.sockets.join(req,req.session.game,function(err){
  			return res.json({
  				message: 'Done'
  			});
  		});
  	}
  },

  /**
  * The controller to leave the game room.
  * leaves the socket room.
  * Removes the user from the database.
  * nullifies the game session
  * @params req, res
  * @return response status code
  */
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

