import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CrowdFundMe from "./contracts/CrowdFundMe.json";
import getWeb3 from "./getWeb3";
import { v4 as uuid } from 'uuid'
import { Switch, Route, } from "react-router-dom";
import Test from './pages/Test'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import CreateCampaign from './pages/createCampaign'
import NavBar from './components/NavBar'
import Campaign from "./pages/Campaign";
import Notifications from "./pages/Notifications";
import Toaster from 'react-hot-toast'

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // console.log(web3)

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

  runExample = async () => {
    const { accounts, contract } = this.state;
    // Stores a given value, 5 by default.
    await contract.methods.set(6).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  createCampaign = async () => {
    // will create the campaign in the db
    // then create the campaign in the contract

    // the campaign will have the following structure

    const { accounts, crowdFundMeContractInstance, web3 } = this.state;

    // await crowdFundMeContractInstance.methods.set(23)
    //   .send({ from: accounts[0] })
    //   .then(response => console.log(response))
    //   .catch(err => {
    //     console.error(err)
    //   })

    // await crowdFundMeContractInstance.methods.get()
    //   .call({ from: accounts[0] })
    //   .then(response => console.log(response))
    //   .catch(err => {
    //     console.error(err)
    //   })

    // let balance = await web3.eth.getBalance(accounts[0]);
    // balance = web3.utils.fromWei(balance, 'ether')
    // console.log(`${balance}`);

    const { address, privateKey } = web3.eth.accounts.create()
    // const campaign_index = uuid();
    const campaign_index = '9f1ea4f5-be2a-48f4-b147-b827e3f0ecd2'
    console.log(`${campaign_index}`);

    let index_2 = 'd0b786de-1d29-4c22-9e23-05841753935f'

    await crowdFundMeContractInstance.methods.addCampaignToMapping(index_2, address)
      .send({ from: accounts[0] })
      .then(response => console.log(response))
      .catch(err => {
        console.error(err)
      })
  }

  contribute = async () => {
    let index = '765ea478-d822-4a2e-bc4e-6e9fc145d1ab'
    let index_2 = 'd0b786de-1d29-4c22-9e23-05841753935f'
    const { accounts, crowdFundMeContractInstance, web3 } = this.state;

    crowdFundMeContractInstance.methods.contribute(index_2)
      .send({
        from: accounts[0],
        value: 1000000000000000000 // this will be the amount to be donated in ether
      })
      .then(response => console.log(response))
      .catch(err => {
        console.error(err)
      })
    // console.log(`${uuid()}`);

  }

  getBalance = async () => {
    let index = '765ea478-d822-4a2e-bc4e-6e9fc145d1ab'
    let index_2 = 'd0b786de-1d29-4c22-9e23-05841753935f'
    const { accounts, crowdFundMeContractInstance, web3 } = this.state;

    await crowdFundMeContractInstance.methods.returnCampaignDonationAmount('e4fd0b64-f3a9-48db-8533-ee3ab6e6e960')
      .send({ from: accounts[0] })
      // .call()
      .then(balance => {
        // balance = web3.utils.fromWei(balance, 'ether');
        console.log(balance);
      })
      .catch(err => {
        console.error(err)
      })
  }

  getContractBalance = async () => {
    const { accounts, crowdFundMeContractInstance, web3 } = this.state;
    await crowdFundMeContractInstance.methods.getContractBalance()
      .call()
      .then(balance => {
        // balance = web3.utils.fromWei(balance, 'ether');
        console.log(balance);
      })
      .catch(err => {
        console.error(err)
      })
  }

  withdraw = async () => {
    const { accounts, crowdFundMeContractInstance, web3 } = this.state;
    web3.eth.sendTransaction({
      from: accounts[0],
      to: '0x4fF2622B1839751093FE121A6b3641d89682b7d6',
      value: web3.utils.toWei('3', "ether")
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/notifications">
            <Notifications />
          </Route>
          <Route path="/campaign/:_id">
            <Campaign
              crowdFundMeContractInstance={this.state.crowdFundMeContractInstance}
              web3={this.state.web3}
            />
          </Route>
          <Route exact path="/create_campaign">
            <CreateCampaign
              web3={this.state.web3}
            />
          </Route>

          <Route path="/test">
            <Test />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
