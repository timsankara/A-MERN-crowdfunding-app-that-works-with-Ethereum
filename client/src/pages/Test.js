import React, { Component } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import CrowdFundMe from "../contracts/CrowdFundMe.json";

import getWeb3 from "../getWeb3";

class Test extends Component {

    state = { storageValue: 0, web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const CrowdFundDeployedNetwork = CrowdFundMe.networks[networkId];
            const CrowdFundInstance = new web3.eth.Contract(
                CrowdFundMe.abi,
                CrowdFundDeployedNetwork && CrowdFundDeployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                web3, accounts,
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

    render() {
        return (
            <div className="container-fluid">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>
                <p>
                    If your contracts compiled and migrated successfully, below will show
                    a stored value of 5 (by default).
                </p>
                <p>
                    Try changing the value stored on <strong>line 42</strong> of App.js.
                </p>
                <div>The stored value is: {this.state.storageValue}</div>

                <hr />

                <button
                    className="btn btn-primary"
                    onClick={this.createCampaign}
                >
                    Create Campaign
                </button>
                <hr />

                <button
                    className="btn btn-primary"
                    onClick={this.contribute}
                >
                    Contribute
                </button>
                <hr />

                <button
                    className="btn btn-primary"
                    onClick={this.getBalance}
                >
                    Get Balance
                </button>
                <hr />

                <button
                    className="btn btn-primary"
                    onClick={this.getContractBalance}
                >
                    Get Contract Balance
                </button>
                <hr />

                <button
                    className="btn btn-primary"
                    onClick={this.withdraw}
                >
                    Withdraw
                </button>
            </div>
        );
    }
}

export default Test;
