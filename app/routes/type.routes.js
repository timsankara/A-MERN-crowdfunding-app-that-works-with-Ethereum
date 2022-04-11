const controller = require("../controllers/type.controller")

module.exports = (app) => {
    app.post("/api/types/create",
        controller.createType
    )

    app.get("/api/types/getAll",
        controller.getAll
    )
}