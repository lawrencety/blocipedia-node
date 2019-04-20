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
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
      /*
        0 = standard
        1 = premium
        2 = admin
      */
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: 'userId',
      as: 'wikis'
    });
    User.hasMany(models.Collaborator, {
      foreignKey: 'userId',
      as: 'collaborators'
    });
    User.afterCreate((user, callback) => {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'welcome@blocipedia.com',
        subject: 'Welcome to Blocipedia',
        text: 'Thanks for signing up'
      };
      return sgMail.send(msg);
    });
  };
  return User;
};
