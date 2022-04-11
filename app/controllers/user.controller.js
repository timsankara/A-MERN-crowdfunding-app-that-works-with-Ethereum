const User = require("../models/user.model")

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then(users => res.json(users))
}

exports.makeAdmin = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isAdmin = true;
      user.save()
      res.json({ msg: "User is now an Admin" })
    })
}
exports.removeAdmin = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isAdmin = false;
      user.save()
      res.json({ msg: "User no longer an Admin" })
    })
}

exports.suspendAccount = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isActive = false;
      user.save()
      res.json({ msg: "User suspended..." })
    })
}

exports.activateAccount = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isActive = true;
      user.save()
      res.json({ msg: "User activated..." })
    })
}

exports.isUserAdmin = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      res.json({ isAdmin: user.isAdmin })
    })
}

exports.startWorkDay = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isOnWorkDay = true;
      user.save()
      res.json({ msg: "Work day started" })
    })
}

exports.endWorkDay = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.isOnWorkDay = false;
      user.save()
      res.json({ msg: "Work day ended" })
    })
}

exports.assignRegion = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.region = req.body.region;
      user.save()
      res.json({ msg: "Region Saved" })
    }).catch(err => res.json({ msg: "Error saving region!" }))
}

exports.getRegionUsers = async (req, res) => {
  const users = await User.find({ region: req.body.regionId })
  res.json(users)
}

exports.getUser = (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      res.json(user)
    }).catch(err => res.json({ msg: "Error Fetching user..." }))
}

exports.getUserByEmail = (req, res) => {
  User.find({email: req.body.user_email})
    .then((user) => {
      res.json({user: user})
    }).catch(err => res.json({ msg: "Error Fetching user..." }))
}

// add a campaign to a users campaigns_donated_to array
exports.addCampaign = (req, res) => {
  User.find({ email: req.body.contributor })
    .then((user) => {
      let campaign = [
        req.body.campaign_id,
        false
      ]
      user[0].campaigns_donated_to.push(campaign)
      
      // map through the campaigns_donated_to array and find if the campaign already exists
      // if it does, return the index of the campaign
      // if it doesn't, return -1
      let index = user[0].campaigns_donated_to.map(campaign => campaign[0]).indexOf(req.body.campaign_id)
      if(index == -1) {
        user[0].save()
        res.json({ msg: "Campaign added to user" })
      }
      else{
        res.json({ msg: "Campaign already exists" })
      }
    }).catch(err => {
      res.json({ msg: "Error adding campaign to user" })
      console.log(err)
    })
}