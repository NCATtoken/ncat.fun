import { Contract, ethers, BigNumber, getDefaultProvider } from 'ethers';
import Web3 from 'web3';
import * as ncat from './blockchain';

export const nodeURL = "https://bsc-dataseed.binance.org/";
const abi = require("./PANCAKEV1.json");
export const bnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
export const contractAddress = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
export const defaultProvider = getDefaultProvider(nodeURL);
const roContract = new Contract(contractAddress, abi, defaultProvider);
export const slippage = 0.11; // 11%

// route = address array
export const getAmountsOut = (amount: any, route: any): Promise<any> => {
    return roContract.getAmountsOut(amount, route);
}

export const buyTokens = (signer: any, address: string, bnbamount: BigNumber, ncatamount: BigNumber): Promise<any> => {
    let contract = new Contract(contractAddress, abi, signer);
    let deadline = Date.now() + 5 * 60 * 1000;
    console.log({
        bnbamount: (bnbamount as BigNumber).toString(),
        ncatamount: (ncatamount as BigNumber).toString(),
        address,
        deadline
    });


    return contract.swapExactETHForTokens(
        ncatamount,
        [bnbAddress, ncat.contractAddress],
        address,
        deadline,
        { value: bnbamount });
}

export const sellTokens = (signer: any, address: string, ncatamount: BigNumber, bnbamount: BigNumber): Promise<any> => {
    let contract = new Contract(contractAddress, abi, signer);
    let deadline = Date.now() + 5 * 60 * 1000;
    console.log({
        bnbamount: (bnbamount as BigNumber).toString(),
        ncatamount: (ncatamount as BigNumber).toString(),
        address,
        deadline
    });

    return contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
        ncatamount,
        bnbamount,
        [ncat.contractAddress, bnbAddress],
        address,
        deadline);
}

// export const getBalance = (address: any): Promise<number> => {
//     return roContract.balanceOf(address);
// };

// export const createNCATContractInstanceWeb3 = () => {
//     return new web3.eth.Contract(abi, contract);
// }

// export const createNFTContractInstanceWeb3 = () => {
//     return new web3.eth.Contract(nftAbi, nftAddress);
// }

// export const createPoundContractInstanceWeb3 = () => {
//     return new web3.eth.Contract(poundAbi, nftPoundAddress);
// }


// export const createNCATContractInstance = (signer: any) => {
//     return new Contract(contractAddress, abi, signer);
// }

// export const createNFTContractInstance = (signer: any): Contract => {
//     return new Contract(nftAddress, nftAbi, signer);
// }

// export const createPoundContractInstance = (signer: any): Contract => {
//     return new Contract(nftPoundAddress, poundAbi, signer);
// }

// // NCAT Token functions

// export const getAllowance = async (contract: Contract, owner: any, spender: any): Promise<any> => {
//     try {
//         const allowance = await contract.allowance(owner, spender);
//         return allowance
//     } catch (e) {
//         console.log(e)
//     }

//     return 0;
// }

// export const getDecimals = async (contract: Contract): Promise<number> => {
//     try {
//         const decimals = await contract.decimals();
//         return decimals
//     } catch (e) {
//         console.log(e)
//     }

//     return 0;
// }

// export const approveNCAT = async (contract: Contract, spender: any, limit = ethers.constants.MaxUint256) => {
//     const estimatedGas = await contract.estimateGas.approve(spender, limit);

//     const txResp = await contract.approve(spender, limit);
//     const receipt = await txResp.wait();
//     return receipt.transactionHash;
// }

// // Pound Contract functions

// export const getSwapCost = async (contract: Contract): Promise<number> => {
//     const cost = await contract.swapCost();
//     return cost;
// }

// export const commitSwapNCAT = async (contract: Contract, numberOfNFT: any) => {
//     const estimatedGas = await contract.estimateGas.commitSwapNcat(numberOfNFT);

//     const txResp = await contract.commitSwapNcat(numberOfNFT);
//     const receipt = await txResp.wait();
//     return receipt.transactionHash;
// }

// export const revealNCATs = async (contract: Contract) => {
//     const estimatedGas = await contract.estimateGas.revealNcats();

//     const txResp = await contract.revealNcats();
//     const receipt = await txResp.wait();
//     return receipt.transactionHash;
// }

// // NFT Contract functions

// export const balanceOf = async (contract: Contract, owner: any) => {
//     const balance = await contract.balanceOf(owner);
//     return balance;
// }

// export const tokenOfOwnerByIndex = async (contract: Contract, owner: any, index: number) => {
//     const tokenId = await contract.tokenOfOwnerByIndex(owner, index);
//     return tokenId;
// }