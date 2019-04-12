const User = require('./models').User;
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
    return User.findByPk(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        callback(null, user);
      }
    })
    .catch((err) => {
      callback(err);
    })
  }
}
