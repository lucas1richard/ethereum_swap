import React, { useState } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const Main = ({ buyTokens, sellTokens, ethBalance, tokenBalance, ethSwapRate }) => {
  const [currentForm, setCurrentForm] = useState('buy');
  
  return (
    <div id="content">
      <button onClick={() => setCurrentForm('buy')}>Buy</button>
      <button onClick={() => setCurrentForm('sell')}>Sell</button>

      <div className="card mb-4" >
        <div className="card-body">
          {currentForm === 'buy'
            ? (
              <BuyForm
                buyTokens={buyTokens}
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                ethSwapRate={ethSwapRate}
              />
            )
            : (
              <SellForm
                sellTokens={sellTokens}
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                ethSwapRate={ethSwapRate}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Main;
