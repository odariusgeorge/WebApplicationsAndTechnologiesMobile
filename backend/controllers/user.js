const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require("../models/user")

exports.getUsers = (req, res, next) => {

  const usersQuery = User.find();
  const counter = User.find().countDocuments();
  let fetchedUsers;

  usersQuery
  .then(users => {
    fetchedUsers = users;
    return counter;
  }).then( count => {
    res.status(200).json({
      message: "Users fetched successfully!",
      users: fetchedUsers,
      maxUsers: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching users failed!"
    });
  });
}

exports.createUser =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
  const user = new User({
    email: req.body.email,
    password: hash,
    admin: req.body.admin,
    isVerified: req.body.isVerified
  });
  user.save()
  .then(result => {
    res.status(201).json({
      message: 'User created!',
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
        message: "Invalid authentication credentials!"
    });
  });
})
}

exports.createModerator =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
  const user = new User({
    email: req.body.email,
    password: hash,
    admin: req.body.admin,
    isVerified: req.body.isVerified
  });
  user.save()
  .then(result => {
    res.status(201).json({
      message: 'Moderator created!',
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
        message: "Invalid authentication credentials!"
    });
  });
})
}

exports.modifyPassword = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User ({
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin,
      isVerified: req.body.isVerified,

    })
    User.findOneAndUpdate({_id:req.params.id}, {$set:{password: hash, isVerified: true}}, {new: true}, (err, usr) => {
      if(err) {
        res.status(401).json({message:"Wrong"});
      } else
      res.status(200).json({message: 'Update successful!'});
    });


  });
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({email: req.params.id}).then( result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Deletion successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  });
};


exports.userLogin =  (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) { return res.status(404).json({ message: "Auth failed"}); }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then( result => {
    if (!result) {
      return res.status(404).json({ message: "Auth failed"});
    }
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id, isAdmin: fetchedUser.admin}, process.env.JWT_KEY, {
      expiresIn: "1h"
    });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      admin: fetchedUser.admin,
      isVerified: fetchedUser.isVerified
    });
  })
  .catch(err => {
    res.status(404).json({
      message: "Invalid authentication credentials"
    });
  });
}
