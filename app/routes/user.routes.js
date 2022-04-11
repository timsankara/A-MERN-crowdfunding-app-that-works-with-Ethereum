const { authJwt } = require("../middlewares"); // from the index.js
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/users/all",
    controller.getAllUsers
  )

  app.post(
    "/api/users/makeAdmin",
    controller.makeAdmin
  )

  app.post(
    "/api/users/removeAdmin",
    controller.removeAdmin
  )

  app.post(
    "/api/users/suspendAccount",
    controller.suspendAccount
  )

  app.post(
    "/api/users/activateAccount",
    controller.activateAccount
  )

  app.post(
    "/api/users/isUserAdmin",
    controller.isUserAdmin
  )

  app.post(
    "/api/users/startWorkDay",
    controller.startWorkDay
  )

  app.post(
    "/api/users/endWorkDay",
    controller.endWorkDay
  )

  app.post(
    "/api/users/assignRegion",
    controller.assignRegion
  )

  app.post(
    "/api/users/getRegionUsers",
    controller.getRegionUsers
  )

  app.post(
    "/api/users/getUser",
    controller.getUser
  )

  app.post(
    "/api/users/addCampaign",
    controller.addCampaign
  )

  app.post(
    "/api/users/getUserByEmail",
    controller.getUserByEmail
  )
};
