const userQueries = require('../db/queries.users.js');
const passport = require('passport');

module.exports = {

  signUp(req, res, next) {
    res.render('user/signup');
  },

  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password_conf: req.body.password_conf
    };
    userQueries.createUser(newUser, (err, user) => {
      console.log(err);
      if(err) {
        req.flash('error', err);
        res.redirect('/user/signup')
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', 'You\'ve successfully signed in!');
          res.redirect('/');
        })
      }
    })
  },

  signInForm(req, res, next) {
    res.render('user/signin')
  },

  signIn(req, res, next) {
      passport.authenticate('local') (req, res, () => {
        console.log(req.user);
        if(!req.user) {
          req.flash('notice', 'Sign in failed. Please try again.')
          res.redirect('/user/signin');
        } else {
          req.flash('notice', 'You\'ve successfully signed in!')
          res.redirect('/')
        }
      })
    },

  signOut(req, res, next) {
    req.logout();
    req.flash('notice', 'You\'ve successfully signed out!');
    res.redirect('/');
  },

  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined) {
        req.flash('notice', 'No user found with that ID.');
        res.redirect('/');
      } else {
        res.render('user/show', {...result});
      }
    })
  }

}
