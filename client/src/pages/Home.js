import React, { Component } from 'react'
import Select from 'react-select'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'

export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            campaigns: []
        }
    }

    componentDidMount() {
        axios.get("/api/campaign/getAll")
            .then((response) => {
                this.setState({ campaigns: response.data.campaigns[0] })
            })
            .catch(err => {
                console.error(err)
            })
    }

    render() {
        return (
            <div className="container-fluid">

                {/* the top hero section */}
                <div className="row hero text-white">
                    <div className="col-sm-11 mx-auto my-5 my-auto mx-auto">
                        <h1 className="text-center mb-3">Decentralised Crowdfunding</h1>
                        <small className="text-center">Fund Brilliant Ideas on Ethereum</small>
                    </div>
                </div>

                {/* the about section */}

                <h2 className="text-center mx-auto">Join Us Today</h2>
                <small className="text-center mx-auto">Create or Fund a Campaign</small>
                <hr className="col-8 mx-auto" />
                <div className="row mt-4 mx-1">
                    <div className="col-sm-5 mx-auto card my-1 p-0 boxShadow">
                        <div className="card-top">
                            <h4 className="card-title">Fund A Campaign</h4>
                            <hr />
                        </div>
                        <div className="card-body">
                            <p className="text-center">
                                Find a cause to support on our platform.
                                <br />
                                Your contribution is secured on Ethereum.
                                <br />
                                Funds are disbursed once 50% of the backers approve a withdrawal.
                            </p>
                        </div>
                        <div className="card-footer mx-0">
                            <Select
                                placeholder="Select A Campaign Here..."
                                options={this.state.campaigns.map((campaign) => {
                                    return {
                                        label: campaign.campaign_name,
                                        value: campaign._id
                                    }
                                })}
                                onChange={(selectedOption) => {
                                    this.props.history.push(`/campaign/${selectedOption.value}`)
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-5 mx-auto card my-1 p-0 boxShadow">
                        <div className="card-top">
                            <h4 className="card-title">Create A Campaign</h4>
                            <hr />
                        </div>
                        <div className="card-body">
                            <p className="text-center">
                                Create a cause to fundraise for.
                                <br />
                                Spread the word about your campaign.
                                <br />
                                Secure funding for your cause and keep chapioning for your cause.
                            </p>
                        </div>
                        <div className="card-footer mx-0">
                            <Link to="/create_campaign">
                                <button className="btn btn-primary">Create Campaign</button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Home)