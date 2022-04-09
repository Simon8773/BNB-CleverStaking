import React, { Component } from "react";
import Web3 from 'web3'
import Header from './components/Header'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import Introduction from './components/Introduction'
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Faq from './components/Faq';
import Footer from './components/Footer';
import { abi, contractAddress } from "./Constants";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

class App extends Component {
  state = {
    invested: 0,
    bonus: 0,
    web3: null,
    accounts: null,
    contract: null,
    refLink: null,
    open: false,
  };

  componentDidMount = async () => {
    try {

      // Get Referral Link
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const refLink = urlParams.get('ref_link');
      console.log(refLink);
      // Check Address is valid
      let result = Web3.utils.isAddress(refLink)
      console.log(result)  // => true
      if(result) { this.setState({  refLink }); }


      window.addEventListener("scroll", this.handleScroll);
      // const web3 = await getWeb3();
      // // Get network provider and web3 instance.

      // // Switch to BSC CHAIN
      // window.ethereum
      // .request({
      //   method: "wallet_addEthereumChain",
      //   params: [
      //     {
      //       chainId: "0x61",
      //       chainName: "Smart Chain - Testnet",
      //       nativeCurrency: {
      //         name: "BNB",
      //         symbol: "BNB",
      //         decimals: 18,
      //       },
      //       rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      //       blockExplorerUrls: ["https://testnet.bscscan.com/"],
      //     },
      //   ],
      // })
      // .catch((error) => {
      //   console.log(error);
      // });


      // console.log("get Account");
      // // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();

      // console.log("got Account: ", accounts);
      // // Get the contract instance.
      // const instance = new web3.eth.Contract(
      //   abi,
      //   contractAddress,
      // );

      // console.log('instance', instance)

      // Catch any errors for any of the above operations.
      const provider = new Web3.providers.HttpProvider(
        'https://data-seed-prebsc-1-s1.binance.org:8545/'
      );
      const web3 = new Web3(provider);


      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        abi,
        contractAddress,
      );

      console.log('instance', instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance });
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, refLink });
    } catch (error) {
      // Catch any errors for any of the above operations.
      const provider = new Web3.providers.HttpProvider(
        'https://data-seed-prebsc-1-s1.binance.org:8545/'
      );
      const web3 = new Web3(provider);


      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        abi,
        contractAddress,
      );

      console.log('instance', instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 20) {
      document.querySelector(".navbar").className = "navbar scroll";
    } else {
      document.querySelector(".navbar").className = "navbar";
    }
  };

  connect = async () => {
    console.log('connect')
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log('connect', accounts)

      // Switch to BSC CHAIN
      window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x61",
            chainName: "Smart Chain - Testnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ],
      })
      .catch((error) => {
        console.log(error);
      });

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        abi,
        contractAddress,
      );

      console.log('instance', instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="main">
        <Header connect={this.connect} accounts={this.state.accounts} />
        <Introduction contract={this.state.contract} />
        <Deposit
          contract={this.state.contract}
          accounts={this.state.accounts}
          web3={this.state.web3}
          setOpen={(isOpen) => this.setState({ open: isOpen })}
          refLink={this.state.refLink}
        />
        <Withdraw
          contract={this.state.contract}
          setOpen={(isOpen) => this.setState({ open: isOpen })}
          accounts={this.state.accounts}
        />
        {/* <Faq /> */}
        <Footer />
        {this.state.open && <div className="notification">
          <span className="notification-text">Transactoin Done.</span>
          <span className="outlined notification-btn" onClick={() => this.setState({ open: false })}>OK</span>
        </div>}
      </div>
    );
  }
}

export default App;
