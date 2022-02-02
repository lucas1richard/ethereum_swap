import Token from '../../abis/Token.json';
import EthSwap from '../../abis/EthSwap.json';

const loadBlockchainData = async () => {
  const web3 = window.web3
  let token, tokenBalance, ethSwap, ethSwapRate;

  const [[account], networkId] = await Promise.all([
    web3.eth.getAccounts(),
    web3.eth.net.getId(),
  ]);

  const ethBalance = await web3.eth.getBalance(account);

  const tokenData = Token.networks[networkId];
  const ethSwapData = EthSwap.networks[networkId];
  
  if (!tokenData) throw new Error('Token contract not deployed to detected network.');
  if (!ethSwapData) throw new Error('EthSwap contract not deployed to detected network.');
  
  token = new web3.eth.Contract(Token.abi, tokenData.address);
  ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);

  const [tokenBalanceBuffer, ethSwapRateBuffer] = await Promise.all([
    token.methods.balanceOf(account).call(),
    ethSwap.methods.rate.call(),
  ]);

  tokenBalance = tokenBalanceBuffer.toString();
  ethSwapRate = ethSwapRateBuffer.toString();

  console.log({ tokenBalance, ethBalance });

  return {
    account,
    ethBalance,
    token,
    tokenBalance,
    ethSwap,
    ethSwapRate,
  };
}

export default loadBlockchainData;
