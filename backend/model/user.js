const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ld = require('lodash');
const vdator = require('validator');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 6, trim: true },
  password: { type: String, required: true, minlength: 8 },
  email: {
    properties:{
      value:{
        type: String,
        unique: true,
        validate: {
          validator: vdator.isEmail,
          message: '{VALUE} is not a valid email'
        }
      }, 
      hidden:{
        type:Boolean,
        default:true
      }
    }
  }, 
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: [{
      type: String,
      require: true
    }]
  }]
})

/* Generate auth token */
userSchema.methods.generateAuth = function () {
  var User = this;
  var access = 'auth';

  var token = jwt.sign({ _id: User._id.toHexString(), access }, process.env.JWT_SECRET, { expiresIn: "10h" }).toString();
  User.tokens = User.tokens.concat([{ access, token }]);
  return User.save().then(() => {
    return token;
  })
}

/* Find by auth token */
userSchema.statics.findByToken = function (token) {
  var User = this;
  var decodedTokenObj;

  try {
    decodedTokenObj = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decodedTokenObj._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

/* Find user by email */
userSchema.statics.findByEmail = function(email) {
  var User = this;

  return User.findOne({ 'email.properties.value': email }).then((user) => {
    if (user == null || !user.email) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user);
    }
  });
};

/* Find email by username */
userSchema.statics.findEmailByUsername = function(username) {
  var User = this;

  return User.findOne({username}).then((user) => {
    if (user == null || !user.email) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user.email);
    }
  });
};

/* Find user by username */
userSchema.statics.findByUsername = function(username) {
  var User = this;

  return User.findOne({username}).then((user) => {
    if (user == null) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user);
    }
  });
};

/* Function to prevent too much information from being returned on request when the response is the object */
userSchema.methods.toJSON = function () {
  return ld.pick(this.toObject(), ['_id', 'username', 'email']);
}

/* Creating the user model from the schema and giving it to Mongoose */
let User = mongoose.model('User', userSchema);

module.exports = User;