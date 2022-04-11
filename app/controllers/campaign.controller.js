const Campaign = require('../models/campaign.model')

exports.createCampaign = (req, res) => {
    let campaign = new Campaign({
        campaign_name: req.body.name,
        campaign_description: req.body.description,
        campaign_target: req.body.target,
        campaign_funds_address: req.body.address,
        campaign_funds_address_pk: req.body.campaign_funds_address_pk,
        campaign_creator: req.body.creator,
        campaign_end_date: req.body.end_date,
        index: req.body.index,
        creator: req.body.creator
    })

    campaign.save()
        .then((new_campaign) => {

            res.json({
                msg: "Campaign Created Successfully",
                status: 200,
                new_campaign_id: new_campaign._id
            })

        })
        .catch(err => {
            console.log(err)
            res.json({ msg: "Unable to Create Campaign", code: 400 })
        })
}

exports.getAll = async (req, res) => {
    let campaign_array = []
    await Campaign.find().then(campaigns => {
        campaign_array.push(campaigns)
        // console.log(campaigns)d
    })

    res.json({ campaigns: campaign_array, msg: "Campaigns loaded", status: 200 })
}

exports.getOne = async (req, res) => {
    await Campaign.findById(req.body.campaign_id).then(campaigns => {
        res.json({ campaigns: campaigns, msg: "Campaign loaded", status: 200 })
    })
}

exports.addDonator = async (req, res) => {
    await Campaign.findById(req.body.campaign_id).then(campaign => {
        // campaign.campaign_contributors.push(req.body.contributor)
        // if the users email is not in the contributors array push it in
        if (!campaign.campaign_contributors.includes(req.body.contributor)) {
            campaign.campaign_contributors.push(req.body.contributor)
        }
        campaign.save()
            .then(() => {
                res.json({ msg: "Contributor Added", status: 200 })
            })
            .catch(err => {
                console.log(err)
            })
    })
}
