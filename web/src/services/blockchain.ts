import { Contract, getDefaultProvider } from 'ethers';

const abi = require("./NCAT.json");
const contract = '0x0cf011a946f23a03ceff92a4632d5f9288c6c70d';
const defaultProvider = getDefaultProvider("https://bsc-dataseed.binance.org/");
const roContract = new Contract(contract, abi, defaultProvider);

export const getBalance = (address: any): Promise<number> => {
    return roContract.balanceOf(address);
};