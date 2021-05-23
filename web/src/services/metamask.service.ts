import { Injectable, EventEmitter } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from 'src/environments/environment';
import * as blockchain from "./blockchain";
import { ApiHttpService } from './api-http.service';
import { Cart, Metadata, Price } from './models.definitioins';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {

  //  wallet action
  provider = <unknown>{};
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
    this.provider = await detectEthereumProvider({ mustBeMetaMask: true });
    this.currentAccount = '';

    // Attempt to grab accounts if already unlocked
    if (this.provider) {
      this.isCorrectChain = parseInt((this.provider as any).chainId) === this.correctChainId;
      this.ethersInjectedProvider = new ethers.providers.Web3Provider((this.provider as any));

      (this.provider as any)
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
      (this.provider as any)
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
      (this.provider as any)
        .on('chainChanged', (chainId: string) => {
          // recommended
          window.document.location.reload();
          // this.currentAccount = '';
          // this.isCorrectChain = (parseInt(chainId) === this.correctChainId);
          // this.chainEvents.emit('chainChanged');
        });
    }

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
    const handleAccountsChanged = (accounts: Array<string>) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== this.currentAccount) {
        this.currentAccount = accounts[0];
        // Do any other work!
      }
    }

    if (this.provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      (this.provider as any)
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err: any) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
    } else {
      console.log('Please install MetaMask!');
    }
  }
}
