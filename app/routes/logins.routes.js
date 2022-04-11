const controller = require("../controllers/loginSchema.controller")

module.exports = function (app){
    app.post(
        "/api/loginSessions/create",
        controller.createLoginSession
    )

    app.post(
        "/api/loginSessions/find",
        controller.findSession
    )

    app.post(
        "/api/loginSessions/end",
        controller.endSession
    )

    app.post(
        "/api/loginSchema/findUserLogins",
        controller.findUserLogins
    )

    app.post(
        "/api/loginSchema"
        )
}