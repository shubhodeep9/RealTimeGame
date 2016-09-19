/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req,res){
		if(req.session.user){
			if(req.session.game){
				res.redirect('/game/play');
			} else {
				User.findOne({id: req.session.user}).exec(function(err, user){
					Game.find().exec(function(err,games){
						res.view("homepage",{layout: 'layout',title: 'RealGame', username: user.username, games: games});
					});
				});
			}
		} else {
			res.redirect("/auth/login");
		}
	}
};

