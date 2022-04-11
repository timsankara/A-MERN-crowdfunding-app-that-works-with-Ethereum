const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const new_user = new User({ // use the email as the primary
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  User.findOne({ email: req.body.email }) // find our if the user is already registered
    .then((user) => {
      if (!user) { // if the user is not registered
        new_user.save((err, user) => { // save the user to the data base
          if (err) {
            res.status(500).send({ message: err });
            console.log("Server err:", err)
            return;
          }
          res.json({ message: "User Has been Registered", status: 200 })
        });
      } else {
        res.json({ message: "Sorry a user with this email is already registered", status: 400 }) // else return this message
      }
    })

};

exports.signin = (req, res) => { // needs username & password
  User.findOne({ email: req.body.email })
    .then((user, err) => {
      // if (err) {
      //   res.status(500).send({
      //     isValid: false,
      //     message: err
      //   });
      //   return err;
      // }
      if (!user) {
        return res.send({
          isValid: false,
          msg: "User Not found."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.send({
          isValid: false,
          accessToken: null,
          msg: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id, email: user.email }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        email: user.email,
        accessToken: token,
        msg: "Welcome Back",
        action: "next"
      });
    })
    .catch(err => {
      console.log(err)
    });
};
