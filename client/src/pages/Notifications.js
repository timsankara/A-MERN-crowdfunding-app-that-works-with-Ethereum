import React, { Component } from "react";
import axios from 'axios';
let jwt = require('jsonwebtoken');

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pending_requests: []
        }
    }

    async componentDidMount() {
        let token = (localStorage.getItem("token"))
        let email
        let pending_requests_with_your_contribution = []

        if (token) {
            email = jwt.decode(JSON.parse(token)).email
            this.setState({ email })
        } else {
            alert('Please Sign in to donate')
            window.location.href = '/login'
        }

        await axios.post('/api/withdrawal_request/getRequestByUser', {
            user_email: email,
        })
            .then(request => {
                pending_requests_with_your_contribution = (request.data.campaigns);
                this.setState({ pending_requests: pending_requests_with_your_contribution })
                console.log(request)
            })
            .catch(console.log)
    }

    vote = async (vote_type, request_id, approval_votes, contributors, declined_votes) => {
        // console.log(contributors)
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        if (vote_type === 'yes') {

            // mark the user as has voted
            for (let i = 0; i < contributors.length; i++) {
                if (contributors[i][0] === this.state.email) {
                    contributors.splice(i, 1)
                    contributors.push([this.state.email, true])
                }
            }

            // console.log(vote_type, request_id, approval_votes)
            await axios.post('/api/withdrawal_request/voteOnRequest', {
                request_id,
                user_email: this.state.email,
                vote: 'yes',
                approval_votes: approval_votes,
                declined_votes,
                contributors
            })
                .then((resp) => {
                    console.log(resp)
                    alert('Request Approved')
                })
                .catch(console.log)
            window.location.reload()
        }
        else if (vote_type === 'no') {

            // mark the user as has voted
            for (let i = 0; i < contributors.length; i++) {
                if (contributors[i][0] === this.state.email) {
                    contributors.splice(i, 1)
                    contributors.push([this.state.email, true])
                }
            }

            await axios.post('/api/withdrawal_request/voteOnRequest', {
                request_id,
                user_email: this.state.email,
                vote: 'no',
                approval_votes: approval_votes,
                declined_votes,
                contributors
            })
                .then((resp) => {
                    console.log(resp)
                    alert('Request Declined')
                })
                .catch(console.log)
            window.location.reload()
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-11 mx-auto">
                        <h1 className="text-center">
                            Notifications
                        </h1>
                        <h5 className="text-center mt-5 mb-0">
                            <u>
                                Vote On These Proposed WIthdrawals
                            </u>
                        </h5>
                        <table className=" table table-striped">
                            <thead>
                                <tr>
                                    <th>Campaign Name</th>
                                    <th>Withdrawal Amount</th>
                                    <th>Destination</th>
                                    <th>Approve</th>
                                    <th>Decline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.pending_requests.map((request, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{request.campaign}</td>
                                            <td>{request.amount}</td>
                                            <td>{request.vendor}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => this.vote(
                                                        'yes',
                                                        request._id,
                                                        request.approval_votes + 1,
                                                        request.contributors,
                                                        request.declined_votes
                                                    )}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.vote(
                                                        'no',
                                                        request._id,
                                                        request.approval_votes,
                                                        request.contributors,
                                                        request.declined_votes + 1
                                                    )}
                                                >
                                                    Decline
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notifications;