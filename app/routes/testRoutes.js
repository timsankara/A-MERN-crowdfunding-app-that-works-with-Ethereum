// const express = require('express')
// const router = express.Router()
// const controller = require('../controllers/project.controller')
// const ProjectModel = require('../models/project.model')
// const Models = require('../models/index')
// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");

// router.get("/", (req, res) => {
//     ProjectModel.find()
//         .then(response => res.json(response))
// })

// router.get('/get', (req, res) => {
//     Models.user.find()
//         .then(resp => res.json(resp))
// }) 

// router.post('/createUser', (req, res)=> {
//     const user = new Models.user({ // use the email as the primary key
//         username: req.body.username,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, 8)
//       });
    
//       user.save((err, user) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }
    
//         if (req.body.roles) {
//           Role.find(
//             {
//               name: { $in: req.body.roles }
//             },
//             (err, roles) => {
//               if (err) {
//                 res.status(500).send({ message: err });
//                 return;
//               }
    
//               user.roles = roles.map(role => role._id);
//               user.save(err => {
//                 if (err) {
//                   res.status(500).send({ message: err });
//                   return;
//                 }
    
//                 res.send({ message: "User was registered successfully!" });
//               });
//             }
//           );
//         } else {
//           Models.role.findOne({ name: "user" }, (err, role) => {
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }
    
//             user.roles = [role._id];
//             user.save(err => {
//               if (err) {
//                 res.status(500).send({ message: err });
//                 return;
//               }
    
//               res.send({ message: "User was registered successfully!" });
//             });
//           });
//         }
//       });
// })

// module.exports = router