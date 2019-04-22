const wikiQueries = require('../db/queries.wiki.js');
const userQueries = require('../db/queries.users.js');
const Authorizer = require('../policies/wiki');
const markdown = require('markdown').markdown;

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, req.headers.referer);
      } else if (req.user) {
        userQueries.getUser(req.user.id, (err, result) => {
          if(err){
            res.redirect(500, req.headers.referer);
          } else {
            res.render('wiki/wiki', {wikis, result});
          }
        })
      } else {
        res.render('wiki/wiki', {wikis})
      }
    })
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render('wiki/new', {markdown});
    } else {
      req.flash('notice', 'You must be signed in to do that.');
      res.redirect(req.headers.referer);
    }
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: (req.body.private === 'private'),
        userId: req.user.id
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, '/wiki/new');
        } else {
          res.render('wiki/show', {wiki, markdown})
        }
      })
    } else {
      req.flash('notice', 'You must be signed in to do that.');
      res.redirect(req.headers.referer);
    }
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err) {
        res.redirect(404, '/wiki')
      } else {
        res.render('wiki/show', {wiki, markdown})
      }
    })
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, '/wiki')
      } else {
        authorized = new Authorizer(req.user, wiki).edit();
        if(authorized) {
          res.render('wiki/edit', {wiki});
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          res.redirect(req.headers.referer);
        }
      }
    })
  },

  update(req, res, next) {
    return wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, '/wiki')
      } else {
        authorized = new Authorizer(req.user, wiki).update();
        if(authorized) {
          return wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err) {
              res.redirect(401, `/wiki/${req.params.id}`);
            } else {
              res.render('wiki/show', {wiki, markdown});
            }
          })
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          res.redirect(req.headers.referer);
        }
      }
    })
  },

  destroy(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err) {
        res.redirect(404, '/wiki')
      } else {
        authorized = new Authorizer(req.user, wiki).destroy();
        if(authorized) {
          wikiQueries.deleteWiki(req.params.id, (err, deletedRecordsCount) => {
            if(err) {
              res.redirect(401, `/wiki/${req.params.id}`);
            } else {
              res.redirect(303, '/wiki');
            }
          });
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          res.redirect(req.headers.referer);
        }
      }
    })
  }

}
