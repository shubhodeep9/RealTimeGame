/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req,res){
		if(req.cookies.user!=null){
			console.log(req.socket.id);
			res.view("homepage",{layout: 'layout'});
		} else {
			res.redirect("/auth/login");
		}
	}
};

