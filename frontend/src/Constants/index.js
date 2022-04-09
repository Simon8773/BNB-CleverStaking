import abiJson from '../contracts/NFT.json';
import contractAddressJson from '../contracts/contract-address.json';

const abi = abiJson.abi;
const contractAddress = contractAddressJson.Token;
const _upline = '0x64981Ac20308a8d5dbfC3cd87c51Fa951eeA0bB2'
const networkId = 56

export {
    abi, contractAddress, networkId, _upline
}