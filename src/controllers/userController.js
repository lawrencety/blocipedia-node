const userQueries = require('../db/queries.users.js');
const passport = require('passport');
const stripe = require("stripe")("sk_test_mZ2POrqrGLDXl8bOs3fy9fYo00DhgCkIXi");

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
  },

  payment(req, res, next) {
    res.render('user/payment', {...req})
  },

  upgradeUser(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || !result.user) {
        req.flash('notice', 'No user found with that ID.');
        res.redirect('/');
      } else {
        if (result.user.role === 1) {
          req.flash('notice', 'This user is already a premium account');
          res.redirect(req.headers.referer);
        } else {
          const token = req.body.stripeToken; // Using Express
          console.log(token)
          const charge = stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Membership charge',
            source: token,
          });
          userQueries.upgrade(result.user, (err, user) => {
            if(err) {
              req.flash('error', 'We have encountered an error');
              res.redirect(req.headers.referer);
            } else {
              userQueries.getUser(req.params.id, (err, result) => {
                res.render('user/show', {...result});
              })
            }
          })

        }
      }
    })
  },

  downgradeUser(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || !result.user) {
        req.flash('notice', 'No user found with that ID.');
        res.redirect('/');
      } else {
        if (result.user.role === 0) {
          req.flash('notice', 'This user is already a standard account');
          res.redirect(req.headers.referer);
        } else {
          userQueries.downgrade(result.user, (err, user) => {
            if(err) {
              console.log(err);
              req.flash('error', 'We have encountered an error');
              res.redirect(req.headers.referer);
            } else {
              userQueries.getUser(req.params.id, (err, result) => {
                res.render('user/show', {...result});
              })
            }
          })
        }
      }
    })
  },

}
