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
			newGame.users = [user.username];
			Game.create(newGame).exec(function(err,model){
				if(err){
					res.badRequest();
				} else {
					sails.sockets.blast('gameCreated',model);
				}
			});
			res.ok();
		});
  	}
  }
};

