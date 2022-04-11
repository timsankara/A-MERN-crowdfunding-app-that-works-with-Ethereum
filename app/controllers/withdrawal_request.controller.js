const WithdrawalRequest = require('../models/withdrawal_request.model');

exports.createRequest = (req, res) => {
    const request = new WithdrawalRequest({
        campaign: req.body.campaign,
        amount: req.body.amount,
        vendor: req.body.vendor,
        contributors: req.body.contributors,
        total_votes: req.body.total_votes,
    })

    request.save()
        .then(resp => {
            res.json({ msg: 'Request created successfully' })
        }).catch(err => {
            res.status(400).json({ msg: 'Error: ' + err })
        })
}

// return a request if the user is in the list of contributors
exports.getRequestByUser = (req, res) => {
    let campaigns_contributed_to = []
    let user_email = req.body.user_email.toString()
    WithdrawalRequest.find()
        .then(requests => {
            for (let i = 0; i < requests.length; i++) {
                // console.log(requests[i])
                // campaigns the user has contributed to but has not voted on
                // if (requests[i].contributors[1][0] == user_email && requests[i].contributors[1][1] === false) {
                //     campaigns_contributed_to.push(requests[i])
                //     console.log(requests[i].contributors.includes(user_email))
                // }
                requests[i].contributors.forEach(contributor => {
                    if (contributor[0] == user_email && contributor[1] === false) {
                        campaigns_contributed_to.push(requests[i])
                    }
                })
            }
            console.log(campaigns_contributed_to)
            res.json({ campaigns: campaigns_contributed_to })
        }).catch(err => {
            console.error(err)
            res.status(400).json({ msg: 'Error: ' + err })
        })
}

exports.handleRequest = async (req, res) => {
    let campaign_id = req.body.campaign_id.toString()
    let request = await WithdrawalRequest.findOne({ campaign: campaign_id })
    // console.log(request)
    request.handled = true
    request.save()
        .then(response => {
            res.json({ msg: "Request Handled" })
            console.log(response)
        })
        .catch(err => {
            console.error(err)
            res.status(400).json({ msg: 'Error: ' + err })
        })
}

exports.getRequestByCampaign = (req, res) => {
    let campaign_id = req.body.campaign_id.toString()
    WithdrawalRequest.find({ campaign: campaign_id })
        .then(requests => {
            res.json({ requests: requests })
        })
        .catch(err => {
            console.error(err)
            res.status(400).json({ msg: 'Error: ' + err })
        })
}

exports.voteOnRequest = (req, res) => {
    let request_id = req.body.request_id.toString()
    let filter = { _id: request_id }
    let approval_update = { approval_votes: req.body.approval_votes, contributors: req.body.contributors }
    let decline_update = { declined_votes: req.body.declined_votes, contributors: req.body.contributors }
    if (req.body.vote === 'yes') {
        WithdrawalRequest.findOneAndUpdate(filter, approval_update, { new: true })
            .then(request => {
                res.json({ request: request, msg: "Request Approved" })
                request.save()
            })
            .catch(err => {
                console.error(err)
                res.status(400).json({ msg: 'Error: ' + err })
            })
    } else if (req.body.vote === 'no') {
        WithdrawalRequest.findOneAndUpdate(filter, decline_update, { new: true })
            .then(request => {
                res.json({ request: request, msg: "Request Declined" })
                request.save()
            })
            .catch(err => {
                console.error(err)
                res.status(400).json({ msg: 'Error: ' + err })
            })
    }
}