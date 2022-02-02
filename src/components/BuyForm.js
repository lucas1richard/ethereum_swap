import React, { useRef, useState } from 'react';

const BuyForm = ({ buyTokens, ethBalance, tokenBalance, ethSwapRate }) => {
  const [output, setOutput] = useState();
  const input = useRef(null);
  let ethLogo, tokenLogo;
  const { web3: { utils: { toWei, fromWei } } } = window;

  const formSubmit = (event) => {
    event.preventDefault()
    let etherAmount
    etherAmount = input.current.value.toString()
    etherAmount = toWei(etherAmount, 'Ether')
    buyTokens(etherAmount)
  };

  return (
    <form className="mb-3" onSubmit={formSubmit}>
      <div>
        <label className="float-left"><b>Input</b></label>
        <span className="float-right text-muted">
          Balance: {fromWei(ethBalance, 'Ether')}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={(event) => {
            const etherAmount = input.current.value.toString()
            setOutput(etherAmount * ethSwapRate)
          }}
          ref={input}
          className="form-control form-control-lg"
          placeholder="0"
          required
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height='32' alt=""/>
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div>
        <label className="float-left"><b>Output</b></label>
        <span className="float-right text-muted">
          Balance: {fromWei(tokenBalance, 'Ether')}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={output || "0"}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tokenLogo} height='32' alt=""/>
            &nbsp; DApp
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">1 ETH = {ethSwapRate} DApp</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
    </form>
  );
};

export default BuyForm;
