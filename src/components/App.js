import React, { Component } from 'react';
import './App.css';
import Main from './Main';
import Navbar from './Navbar';
import { loadBlockchainData, loadWeb3 } from './utils';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }
  
  async componentDidMount() {
    try {
      await loadWeb3()
      await this.loadBlockchainData()
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  async loadBlockchainData() {
    const {
      account,
      ethBalance,
      token,
      tokenBalance,
      ethSwap,
      ethSwapRate,
    } = await loadBlockchainData();

    console.log({ ethBalance, tokenBalance });

    this.setState({
      account,
      ethBalance,
      token,
      tokenBalance,
      ethSwap,
      ethSwapRate,
      loading: false,
    });
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    const { ethSwap, account } = this.state;
    ethSwap.methods.buyTokens()
      .send({ from: account, value: etherAmount })
      .on('transactionHash', async (hash) => {
        this.setState({ loading: false })
      })
  }
  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true });
    const { ethSwap, account, token } = this.state;
    token.methods.approve(ethSwap.address, tokenAmount).send({ from: account })
    ethSwap.methods.sellTokens(tokenAmount).send({ from: account })
    this.setState({ loading: false });
  }
  
  render() {
    const {
      loading,
      account,
      error,
      ethBalance,
      tokenBalance,
      ethSwapRate,
    } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    };
    
    return (
      <div>
        <Navbar account={account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              <div className="content mr-auto ml-auto">
                {loading
                  ? <p className="text-center">loading...</p>
                  : (
                    <Main
                      buyTokens={this.buyTokens}
                      sellTokens={this.sellTokens}
                      ethBalance={ethBalance}
                      tokenBalance={tokenBalance}
                      ethSwapRate={ethSwapRate}
                    />
                  )
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
