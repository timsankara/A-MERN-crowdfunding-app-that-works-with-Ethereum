import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from 'axios'
import toast from 'react-hot-toast'
let jwt = require('jsonwebtoken')

class Campaign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campaign: [],
            crowdFundMeContractInstance: this.props.crowdFundMeContractInstance,
            web3: this.props.web3,
            donation_amount: 0,
            current_campaign_donation: 0,
            vendor_address: '',
            vendor_donation: '',
            email: '',

            // campaign requests
            current_requests: []
        }
    }

    componentDidMount = async () => {
        // await this.state.web3.eth.getBalance('0x9098b831dF94679161B70085097039cb567ffd9b').then(console.log)
        const accounts = await this.state.web3.eth.getAccounts();
        this.setState({ accounts })
        let token = (localStorage.getItem("token"))
        if (token) {
            let { email } = jwt.decode(JSON.parse(token))
            this.setState({ email })
        } else {
            alert('Please Sign in to donate')
            window.location.href = '/login'
        }

        const campaign_id = this.props.match.params._id;
        let { crowdFundMeContractInstance, campaign, web3 } = this.state;
        // const response = await fetch(`/api/campaign/getOne/${campaign_id}`);
        // await crowdFundMeContractInstance.methods.returnBalance()
        //     .call()
        //     .then(console.log)

        await axios.get(`/api/campaign/getAll`)
            .then((response) => {
                let campaign = response.data.campaigns[0].filter(campaign => campaign._id == campaign_id)[0];
                this.setState({ campaign })
                // get campaign balance
                crowdFundMeContractInstance.methods.returnCampaignDonationAmount(campaign.index)
                    .call()
                    .then(balance => {
                        balance = web3.utils.fromWei(balance, 'ether');
                        this.setState({ current_campaign_donation: balance })
                    })
                    .catch(err => {
                        console.error(err)
                    })

            })
            .catch(err => {
                console.error(err)
                alert('Unable to fetch Campaign');
            });

        await axios.post('/api/withdrawal_request/getRequestByCampaign', { campaign_id: campaign_id })
            .then(response => {
                this.setState({ current_requests: response.data.requests })
            })
            .catch(err => alert('Unable to fetch withdrawal requests'))
    }

    getDonationAmount = async () => {
        let { crowdFundMeContractInstance, campaign, web3 } = this.state;
        crowdFundMeContractInstance.methods.returnBalance(campaign.index)
            .call()
            // .send({ from: '0x9098b831dF94679161B70085097039cb567ffd9b' })
            .then(balance => {
                balance = web3.utils.fromWei(balance, 'ether');
                console.log(balance);
            })
    }

    donate = async () => {
        // if (this.state.email === '') {
        let { crowdFundMeContractInstance, campaign, web3, accounts } = this.state;
        crowdFundMeContractInstance.methods.donate(campaign.index)
            // .call()
            .send({
                from: accounts[0],
                value: this.state.donation_amount
            })
            .then(balance => {
                // balance = web3.utils.fromWei(balance, 'ether');
                // console.log(balance);
                alert(`Thank you for supporting, ${this.state.campaign.campaign_name} `)

                // push the account that donated to the campaign using express
                axios.post(`/api/campaign/addDonator`, {
                    contributor: this.state.email,
                    campaign_id: this.state.campaign._id
                })
                    .then(response => {
                        console.log(response)

                        // add campaign to the ones the user has donated to
                        axios.post("/api/users/addCampaign", {
                            campaign_id: this.state.campaign._id,
                            contributor: this.state.email
                        })
                            .then(response => {
                                console.log(response)
                                // window.location.reload();
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        window.location.reload()
                    })
                    .catch(err => {
                        console.error(err)
                    })
            })
            .catch(err => {
                console.error(err)
            })
        // }
    }

    getContractBalance = async () => {
        let { crowdFundMeContractInstance, campaign, web3, accounts } = this.state;
        crowdFundMeContractInstance.methods.returnBalance()
            .call()
            // .send({
            //     from: accounts[0],
            //     value: this.state.donation_amount
            // })
            .then(balance => {
                // balance = web3.utils.fromWei(balance, 'ether');
                console.log(balance);
            })
            .catch(err => console.log(err))
    }

    withdraw = () => {
        let { crowdFundMeContractInstance, campaign, web3, accounts } = this.state;
        crowdFundMeContractInstance.methods.getContractBalance()
            .call()
    }

    withdrawEth = async (vendor, withdrawal_amount, campaign_index) => {
        let { crowdFundMeContractInstance, campaign, web3, accounts } = this.state;
        let campaign_balance = web3.utils.toWei(String(withdrawal_amount), 'ether');
        campaign_balance = String(campaign_balance)
        await crowdFundMeContractInstance.methods.withdraw(
            vendor,
            campaign_balance,
            campaign_index
        )
            .send({ from: accounts[0] })
            .then(response => {
                alert('Successfully Withdrawn')
                axios.post("/api/withdrawal_request/handleRequest", { campaign_id: campaign._id })
                    .then(response => {
                        alert(response.data.msg)
                    })
                    .catch(err => console.log(err))
                window.location.reload()
            })
            .catch(err => {
                console.error(err)
            })

        // console.log(campaign_address)
    }

    // create withdraw request using express
    createWithdrawRequest = (req, res) => {
        let contributors = []
        this.state.campaign.campaign_contributors.map(contributor => {
            let contributor_with_vote_status = [contributor, false]
            contributors.push(contributor_with_vote_status)
        })
        console.log(contributors)

        axios.post("/api/withdrawal_request/create", {
            vendor: this.state.vendor_address,
            amount: this.state.vendor_donation,
            campaign: this.state.campaign._id,
            contributors,
            total_votes: this.state.campaign.campaign_contributors.length
        })
            .then(response => {
                alert(response.data.msg)
                window.location.reload();
            })
            .catch(err => {
                console.error(err)
            })
    }

    render() {
        let campaign = this.state.campaign;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div
                        className="col-sm-9 mx-auto card my-3 p-2"
                        style={{ borderRadius: '14px', boxShadow: '0px 0px 10px 0px black' }}
                    >
                        <h3 className="mt-3">
                            {campaign.campaign_name}
                        </h3>
                        <h5 className="mt-3">
                            {campaign.campaign_description}
                        </h5>
                        <hr />
                        <div className="row mx-1">
                            <div
                                className="col-sm-5 card my-2"
                                style={{ borderRadius: '14px', boxShadow: '0px 0px 10px 0px black' }}
                            >
                                <h5 className="text-center my-auto">
                                    Current Donation: {this.state.current_campaign_donation} Ether
                                    <br />
                                </h5>
                                <p style={{ color: 'red' }}>{Math.trunc(this.state.current_campaign_donation / campaign.campaign_target * 100)}%</p>
                                <hr />
                                <h5 className="text-center mb-0">
                                    Goal: {campaign.campaign_target} Ether
                                </h5>
                            </div>
                            <div
                                className="col-sm-6 card mx-auto my-2"
                                style={{ borderRadius: '14px', boxShadow: '0px 0px 10px 0px black' }}
                            >
                                <h5>
                                    <u>
                                        Donate
                                    </u>
                                </h5>
                                <input
                                    type="number"
                                    placeholder='Enter Amount In Ether'
                                    className="col-sm-11 mx-auto"
                                    onChange={(e) => {
                                        let amount = 0;
                                        if (e.target.value !== '') {
                                            amount = this.state.web3.utils.toWei(e.target.value, 'ether')
                                        }

                                        this.setState({ donation_amount: amount })
                                    }}
                                />
                                <br />
                                <button
                                    className="btn btn-primary my-2 col-6 mx-auto"
                                    onClick={this.donate}
                                >
                                    Donate
                                </button>
                                <hr />
                                {this.state.email === this.state.campaign.creator &&
                                    <>
                                        <h3>
                                            Admin Actions
                                        </h3>
                                        <hr />
                                        <p>
                                            <u>
                                                Create Withdrawal Request
                                            </u>
                                        </p>

                                        <input
                                            type="text"
                                            placeholder='Enter Vendor Address'
                                            className="col-sm-11 mx-auto mb-2"
                                            onChange={(e) => this.setState({
                                                vendor_address: e.target.value
                                            })}
                                        />
                                        <input
                                            type="number"
                                            placeholder='Enter Withdrawal Amount'
                                            className="col-sm-11 mx-auto"
                                            onChange={(e) => this.setState({
                                                vendor_donation: e.target.value
                                            })}
                                        />
                                        <button
                                            className="btn btn-primary my-2 col-6 mx-auto"
                                            onClick={this.createWithdrawRequest}
                                        >
                                            Create Withdraw Request
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                        <hr />

                        {this.state.email === this.state.campaign.creator &&
                            <>
                                <h1 className="mx-auto text-center">
                                    <u>
                                        Withdrawal Requests
                                    </u>
                                </h1>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <td>#</td>
                                            <td>Amount</td>
                                            <td>Vendor</td>
                                            <td>% Votes</td>
                                            <td>Handled?</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.current_requests.map((request, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{request.amount}</td>
                                                <td>{request.vendor}</td>
                                                <td>{(request.approval_votes / request.total_votes) * 100}%</td>
                                                <td>{String(request.handled).toLocaleUpperCase()}</td>
                                                {
                                                    (request.approval_votes / request.total_votes) > 0.5 ?
                                                        request.handled == false ?
                                                            <>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => this.withdrawEth(
                                                                            request.vendor,
                                                                            request.amount,
                                                                            this.state.campaign.index
                                                                        )}
                                                                    >
                                                                        Withdraw
                                                                    </button>
                                                                </td>
                                                            </>
                                                            :
                                                            <>
                                                                <td>
                                                                    <p>Request has been handled</p>
                                                                </td>
                                                            </>
                                                        :
                                                        <td>
                                                            <p style={{ color: "red" }}>Can't withdraw</p>
                                                        </td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        }

                        {/* <button
                            className="btn btn-primary"
                            onClick={this.getDonationAmount}
                        >
                            Get Donation Amount
                        </button>
                        <hr />

                        <button
                            className="btn btn-primary"
                            onClick={this.getContractBalance}
                        >
                            Get Contract Balance
                        </button> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Campaign);