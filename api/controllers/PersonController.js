/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    if(req.method == 'POST' && req.param('Person',null)!=null)
    {
      Person.create(req.param('Person')).exec(function(err,model){
        if (err) {
        res.send('Error:Sorry!Something went Wrong');
        }else {
            res.send('Successfully Created!'); 
        }
      });
    }else{
      res.render("person/create");
    }    
  }           
};

