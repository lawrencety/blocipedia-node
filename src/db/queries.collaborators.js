const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;

module.exports = {
  createCollaborator(req, email, callback) {
    return User.findOne({
      where: { email: email }
    })
    .then((user) => {
      Collaborator.create({
        wikiId: req.params.id,
        userId: user.id
      })
      .then((collaborator) => {
        callback(null, collaborator);
      })
      .catch((err) => {
        callback(err);
      })
    })
  },

  deleteCollaborator(req, userId , callback) {
    const wikiId = req.params.wikiId;
    return Collaborator.findOne({
      where: { wikiId: wikiId, userId: userId }
    })
    .then((collaborator) => {
      if(!collaborator) {
        return callback('Favorite not found');
      } else {
        return collaborator.destroy()
        .then((deletedRecordsCount) => {
          callback(null, deletedRecordsCount);
        })
        .catch((err) => {
          callback(err);
        })
      }
    })
    .catch((err) => {
      callback(err);
    })
  }
}
