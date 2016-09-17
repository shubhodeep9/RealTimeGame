/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req,res){
		if(req.cookies.user!=null){
			User.findOne({id: req.cookies.user}).exec(function(err, user){
				Game.find().exec(function(err,games){
					res.view("homepage",{layout: 'layout', username: user.username, games: games});
				});
			});
			
		} else {
			res.redirect("/auth/login");
		}
	},
	soc: function(req,res){
		sails.sockets.blast('test','hey');
		res.send('hey');
	}
};

