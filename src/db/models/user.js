'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: 'must be a valid email'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  User.associate = function(models) {
    User.afterCreate((user, callback) => {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log(sgMail.setApiKey(process.env.SENDGRID_API_KEY));
      console.log(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'welcome@blocipedia.com',
        subject: 'Welcome to Blocipedia',
        text: 'Thanks for signing up'
      };
      console.log(msg);
      return sgMail.send(msg);
    });
  };
  return User;
};
