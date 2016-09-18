/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    if(req.session.user){
      res.redirect('/');
    } else {
      if(req.method == "POST" && req.param("User",null)!=null){
        User.findOne(req.param("User")).exec(function(err,model){
          
          if(model!=null){
            req.session.user = model.id;
            res.redirect('/');
          } else {
            res.redirect('/auth/login');
          }
        })
      } else {
        res.view('auth/login', {layout: 'layout', title: 'Login'});
      }
    }
  },


  /**
   * `AuthController.register()`
   */
  register: function (req, res) {
    if(req.method == "POST" && req.param("User",null)!=null){
      User.create(req.param("User")).exec(function(err,model){
          if(err){
            res.send("Error");
          } else {
            res.redirect('auth/login');
          }
      })
    } else {
      res.view('auth/login', {layout: 'layout', title: 'Register'});
    }
  },

  /**
  * `AuthController.logout()`
  */
  logout: function (req,res){
    req.session.user = null;
    if(req.session.game){
      req.session.game = null;
    }
    return res.redirect('/auth/login');
  }

};

