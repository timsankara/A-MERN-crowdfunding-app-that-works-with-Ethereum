const controller = require('../controllers/campaign.controller')

module.exports = function (app) {
    app.post(
        "/api/campaign/create",
        controller.createCampaign
    );

    app.get(
        "/api/campaign/getAll",
        controller.getAll
    )
    app.post(
        "/api/campaign/addDonator",
        controller.addDonator
    )
}
