/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req,res){
		if(req.cookies.user!=null){
			res.send("<a href='/auth/logout'>Logout</a>");
		} else {
			res.redirect("/auth/login");
		}
	}
};

