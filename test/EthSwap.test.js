const { assert } = require('chai');

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai').use(require('chai-as-promised')).should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
  let token;
  let ethSwap;
  let totalSupply;

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    const totalSupplyBuffer = await token.totalSupply();
    totalSupply = totalSupplyBuffer.toString();
    await token.transfer(ethSwap.address, totalSupply);
  });

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name();
      assert.equal(name, 'DApp Token');
    });
  });

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name();
      assert.equal(name, 'EthSwap instant exchange');
    });

    it('contract has tokens', async () => {
      const balanceBuffer = await token.balanceOf(ethSwap.address);
      const balance = balanceBuffer.toString();
      assert.equal(totalSupply, balance);
      assert.equal(totalSupply, tokens('1000000'));
    });
  });

  describe('buyTokens()', async () => {
    let result;
    before(async () => {
      result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') });
    })
    it('allows user to instantly purchase tokens from ethSwap for a fixed rate', async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'));
      let ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens('999900'));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'));

      // check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');
    });
  });

  describe('sellTokens()', async () => {
    let result;
    before(async () => {
      const hundredTokens = tokens('100');
      
      // the investor must approve the tokens
      await token.approve(ethSwap.address, hundredTokens, { from: investor });
      result = await ethSwap.sellTokens(hundredTokens, { from: investor });
    })

    it('allows user to instantly sell tokens to ethSwap for a fixed rate', async () => {
      const investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), '0');

      const ethSwapTokenBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapTokenBalance.toString(), totalSupply);

      const ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapEtherBalance.toString(), web3.utils.toWei('0', 'Ether'));

      // check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');

      // FAILURE: investor cannot sell more tokens than they have
      await token.approve(ethSwap.address, tokens('500'), { from: investor });
      await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    });
  });
});