import React, { Component } from "react";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import axios from "axios"
import getWeb3 from '../getWeb3'
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import CrowdFundMe from "../contracts/CrowdFundMe.json";
import { v4 as uuid } from 'uuid'
import { withRouter } from "react-router";
let jwt = require('jsonwebtoken')

class createCampaign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campaign_name: "",
            campaign_description: "",
            campaign_end_date: "",
            campaign_funding_goal: "",
            campaign_address: "",

            // blockchain
            storageValue: 0,
            web3: this.props.web3,
            accounts: null,
            contract: null,

            // user
            email: ''
        }
    }

    componentDidMount = async () => {
        let token = (localStorage.getItem("token"))
        let email
        if (jwt.decode(JSON.parse(token))) {
            email = jwt.decode(JSON.parse(token)).email
        }else{
            alert('Login First')
            this.props.history.push("/")
        }
        this.setState({ email })
        try {
            // Get network provider and web3 instance.
            // const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await this.state.web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await this.state.web3.eth.net.getId();

            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new this.state.web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const CrowdFundDeployedNetwork = CrowdFundMe.networks[networkId];
            const CrowdFundInstance = new this.state.web3.eth.Contract(
                CrowdFundMe.abi,
                CrowdFundDeployedNetwork && CrowdFundDeployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                accounts,
                contract: instance,
                crowdFundMeContractInstance: CrowdFundInstance
            },
                // this.runExample
            );
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    createCampaign = async (e) => {
        e.preventDefault();
        // axios.post("/api/campaign/create",
        //     {
        //         name: this.state.campaign_name,
        //         descritpion: this.state.campaign_description,
        //         target: this.state.campaign_funding_goal,
        //         end_date: this.state.campaign_end_date
        //     }
        // )
        //     .then(response => {
        //         console.log(response)
        //         alert(response.data.msg)
        //         if (response.data.status === 200) {
        //             this.props.history.push("/")
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })

        const { accounts, crowdFundMeContractInstance, web3 } = this.state;
        const { address, privateKey } = web3.eth.accounts.create()

        const campaign_index = uuid()

        await crowdFundMeContractInstance.methods.donate(campaign_index)
            .send({ from: accounts[0] })
            .then(response => {
                console.log(response)

                // create the campaign in the db
                axios.post("/api/campaign/create",
                    {
                        name: this.state.campaign_name,
                        descritpion: this.state.campaign_description,
                        target: this.state.campaign_funding_goal,
                        end_date: this.state.campaign_end_date,
                        address: address,
                        campaign_funds_address_pk: privateKey,
                        index: campaign_index,
                        creator: this.state.email
                    }
                )
                    .then(response => {
                        console.log(response)
                        alert(response.data.msg)
                        if (response.data.status === 200) {
                            this.props.history.push(`/campaign/${response.data.new_campaign_id}`)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.error(err)
            })

    }

    render() {
        return (
            <div
                className="container-fluid hero"
                style={{ height: "100vh" }}
            >
                <div className="row mx-1">
                    <div className="col-sm-8 card mt-5 mx-auto boxShadow p-0">
                        <div className="card-top">
                            <h1 className="mx-auto">Create Campaign</h1>
                            <hr className="col-8 mx-auto" />
                        </div>
                        <div className="card-body p-0">
                            <h5 className="text-center">
                                Enter Campaign Details Here
                            </h5>
                            <form onSubmit={this.createCampaign} className="p-2">

                                <input
                                    type="text"
                                    placeholder="Campaign Name"
                                    className="col-sm-8 my-1"
                                    required
                                    onChange={(e) => {
                                        this.setState({ campaign_name: e.target.value })
                                    }}
                                />

                                <textarea
                                    placeholder="Campaign Description"
                                    className="col-sm-8 my-1"
                                    required
                                    onChange={(e) => {
                                        this.setState({ campaign_description: e.target.value })
                                    }}
                                />

                                <input
                                    type="number"
                                    placeholder="Funding Goal (In Ether)"
                                    className="col-sm-8 my-1"
                                    required
                                    onChange={(e) => {
                                        this.setState({ campaign_funding_goal: e.target.value })
                                    }}
                                />

                                <h5
                                    className="mt-0 mb-2"
                                >
                                    Campaign End Date
                                </h5>

                                <Datetime
                                    className="col-sm-5 mx-auto my-1"
                                    value={Date()}
                                    closeOnSelect={true}
                                    onChange={(e) => {
                                        this.setState({ campaign_end_date: e._d })
                                    }}
                                />

                                <div className="card-footer">
                                    <button
                                        className="btn btn-success mx-auto my-2"
                                        type="submit"
                                    >
                                        Create Campaign
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(createCampaign);