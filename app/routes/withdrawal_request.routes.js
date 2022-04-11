const controller = require('../controllers/withdrawal_request.controller');

module.exports = function(app) {
    app.post('/api/withdrawal_request/create', controller.createRequest);
    app.post('/api/withdrawal_request/getRequestByUser', controller.getRequestByUser);
    app.post('/api/withdrawal_request/getRequestByCampaign', controller.getRequestByCampaign);
    app.post('/api/withdrawal_request/voteOnRequest', controller.voteOnRequest);
    app.post('/api/withdrawal_request/handleRequest', controller.handleRequest);
};