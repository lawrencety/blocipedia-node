const User = require('./models').User;
const Wiki = require('./models').Wiki;
const bcrypt = require('bcryptjs');

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    })
  },

  getUser(id, callback) {
    const result = [];
    return User.findByPk(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result['user'] = user;
        callback(null, result);
      }
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgrade(user, callback) {
    return User.update(
      { role: 1 },
      { where: {id : user.id}})
    .then((updatedRows) => {
      callback(null, updatedRows);
    })
    .catch((err) => {
      callback(err);
    })
  },

  downgrade(user, callback) {
    return User.update(
      { role: 0 },
      { where: { id : user.id } }
    )
    .then((updatedRows) => {
      Wiki.update(
        { private: false },
        { where: { userId: user.id } }
      )
      .then((updatedWikis) => {
        callback(null, updatedRows);
      })
      .catch((err) => {
        callback(err);
      })
    })
  }

}
