import { Injectable, EventEmitter } from '@angular/core';
import * as blockchain from "./blockchain";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {

  //  wallet action
  provider = <WalletConnectProvider>{};
  ethersInjectedProvider = <ethers.providers.Web3Provider>{};
  correctChainId = 0;
  currentAccount = '';
  isCorrectChain = false;
  currentBalance = 0;

  chainEvents = new EventEmitter();

  get isConnectedToWallet(): boolean {
    return (this.currentAccount !== '');
  }


  constructor() {
    this.walletMagic();
  }


  // do the wallet magic such as event hook up and update status
  async walletMagic() {
    this.correctChainId = (await blockchain.defaultProvider.getNetwork()).chainId;

    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      rpc: {  
        56: blockchain.nodeURL,
      },
    });

    this.provider = provider;
    this.ethersInjectedProvider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await this.ethersInjectedProvider.getNetwork()

    this.isCorrectChain = chainId === this.correctChainId;
    this.currentAccount = '';

    this.chainEvents.emit('start');
  }

  balanceIsStreaming = false;
  async streamBalance(): Promise<any> {
    blockchain.getBalance(this.currentAccount)
      .then((result) => {
        this.currentBalance = result;
        this.chainEvents.emit('balance');
        // get new balance every 30s
        if (!this.balanceIsStreaming) {
          this.balanceIsStreaming = true;
          setTimeout(() => this.streamBalance(), 30000);
        }
      }).catch((e) => {
        this.balanceIsStreaming = false;
      });
  }

  async connectWallet() {
    await this.provider.enable();

    if (this.ethersInjectedProvider) {
      (this.ethersInjectedProvider as any)
        .request({ method: 'eth_accounts' })
        .then((accounts: Array<string>) => {
          if (accounts.length > 0) {
            this.currentAccount = accounts[0];
          }
          this.chainEvents.emit('accountsChanged');
        })
        .catch((err: Error) => {
          console.error(err);
        });
  
      // Detect account changes
      (this.ethersInjectedProvider as any)
        .on('accountsChanged', (accounts: Array<string>) => {
          if (accounts.length === 0) {
            this.currentAccount = '';
            console.log('Please connect to MetaMask.');
          } else if (accounts[0] !== this.currentAccount) {
            this.currentAccount = accounts[0];
          }
          this.chainEvents.emit('accountsChanged');
        });
  
      // Detect chain changes
      (this.ethersInjectedProvider as any)
        .on('chainChanged', (chainId: string) => {
          // recommended
          window.document.location.reload();
          // this.currentAccount = '';
          // this.isCorrectChain = (parseInt(chainId) === this.correctChainId);
          // this.chainEvents.emit('chainChanged');
        });
    }
  }
}
