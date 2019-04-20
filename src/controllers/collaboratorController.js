const collaboratorQueries = require('../db/queries.collaborators.js');
const userQueries = require('../db/queries.users.js');

module.exports = {

  create(req, res, next) {
    if(req.user.role != 0) {
      let newCollaborator = {
        email: req.body.email,
      };
      collaboratorQueries.createCollaborator(req, email, (err, collaborator) => {
        if(err) {
          req.flash('error', err);
          res.redirect(req.headers.referer);
        } else {
          res.redirect(req.headers.referer);
        }
      })
    } else {
      req.flash('notice', 'You must be a premium user to do that');
      res.redirect(req.headers.referer);
    }
  },

  destroy(req, res, next) {
    if(req.user.role != 0) {
      let collaboratorId = req.params.id;
      collaboratorQueries.deleteCollaborator(req, collaboratorId, (err, collaborator) => {
        if(err) {
          req.flash('error', err);
          res.redirect(req.headers.referer);
        } else {
          res.redirect(req.headers.referer);
        }
      })
    } else {
      req.flash('notice', 'You must be a premium user to do that');
      res.redirect(req.headers.referer);
    }
  }

}
