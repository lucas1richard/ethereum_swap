pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap instant exchange";
  Token public token;
  uint public rate = 100;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );
  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable { // buy FROM ETHSWAP
    // calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // require ethSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // transfer tokens to the user
    token.transfer(msg.sender, tokenAmount);

    // emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public { // sell TO ETHSWAP
    require(token.balanceOf(msg.sender) >= _amount);
  
    // calculate the amount of ether to redeem
    uint etherAmount = _amount / rate;

    require(address(this).balance >= etherAmount);
  
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

    // emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }
}
