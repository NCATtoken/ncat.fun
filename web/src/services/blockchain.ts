import { Contract, ethers, getDefaultProvider } from 'ethers';

const abi = require("./NCAT.json");
const nftAbi = require("./NCATNFT.json");
const poundAbi = require("./NCATPOUND.json");
const contract = '0x0cF011A946f23a03CeFF92A4632d5f9288c6C70D';
export const nftAddress = '0x3890Ee22F9824086370bbdE2abe680Dc2Af7E156';
export const nftPoundAddress = '0x6E5d9EECCb657a11f239A2a6846D34dF724D6c1d';
export const defaultProvider = getDefaultProvider("https://bsc-dataseed.binance.org/");
export const ipfsDirHash = "QmearV9nzFwXvnitGGiP1XgQNYgxURnCE2jDA67xoEeM7U"
const roContract = new Contract(contract, abi, defaultProvider);

export const getBalance = (address: any): Promise<number> => {
    return roContract.balanceOf(address);
};

export const createNCATContractInstance = (signer: any): Contract => {
    return new Contract(contract, abi, signer);
}

export const createNFTContractInstance = (signer: any): Contract => {
    return new Contract(nftAddress, nftAbi, signer);
}

export const createPoundContractInstance = (signer: any): Contract => {
    return new Contract(nftPoundAddress, poundAbi, signer);
}

// NCAT Token functions

export const getAllowance = async (contract: Contract, owner: any, spender: any): Promise<any> => {
    try {
        const allowance = await contract.allowance(owner, spender);
        return allowance
    } catch (e) {
        console.log(e)
    }

    return 0;
}

export const getDecimals = async (contract: Contract): Promise<number> => {
    try {
        const decimals = await contract.decimals();
        return decimals
    } catch (e) {
        console.log(e)
    }

    return 0;
}

export const approveNCAT = async (contract: Contract, spender: any, limit = ethers.constants.MaxUint256) => {
    const estimatedGas = await contract.estimateGas.approve(spender, limit);

    const txResp = await contract.approve(spender, limit);
    const receipt = await txResp.wait();
    return receipt.transactionHash;
}

// Pound Contract functions

export const getSwapCost = async (contract: Contract): Promise<number> => {
    const cost = await contract.swapCost();
    return cost;
}

export const commitSwapNCAT = async (contract: Contract, numberOfNFT: any) => {
    const estimatedGas = await contract.estimateGas.commitSwapNcat(numberOfNFT);

    const txResp = await contract.commitSwapNcat(numberOfNFT);
    const receipt = await txResp.wait();
    return receipt.transactionHash;
}

export const revealNCATs = async (contract: Contract) => {
    const estimatedGas = await contract.estimateGas.revealNcats();

    const txResp = await contract.revealNcats();
    const receipt = await txResp.wait();
    return receipt.transactionHash;
}

// NFT Contract functions

export const balanceOf = async(contract: Contract, owner: any) => {
    const balance = await contract.balanceOf(owner);
    return balance;
}

export const tokenOfOwnerByIndex = async(contract: Contract, owner: any, index: number) => {
    const tokenId = await contract.tokenOfOwnerByIndex(owner, index);
    return tokenId;
}