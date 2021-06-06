import { Injectable, EventEmitter } from '@angular/core';
import * as blockchain from "./blockchain";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/browser';
import WalletConnectQRModal from'@walletconnect/qrcode-modal';
import Web3 from 'web3';


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {

  //  wallet action
  web3Provider = <WalletConnectProvider>{};
  browserProvider = <WalletConnect>{};
  ethersInjectedProvider = <ethers.providers.JsonRpcProvider>{};
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
    this.web3Provider = new WalletConnectProvider({
      chainId: 56,
      rpc: {  
        56: blockchain.nodeURL,
      },
    });


    // Unused
    // this.browserProvider = new WalletConnect({
    //   bridge: 'https://bridge.walletconnect.org',
    //   qrcodeModal: WalletConnectQRModal
    // });

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

  async connectWallet(onConnect: (account: string, web3Provider: ethers.providers.JsonRpcProvider) => void, onSessionUpdate: (account: string) => void, onDisconnect: () => void) {
    try {
      // Browser Provider
      // this.walletConnect(onConnect, onSessionUpdate, onDisconnect);

      // Web3 Provider
      this.web3ProviderConnect(onConnect, onSessionUpdate, onDisconnect);
    } catch (e) {
      throw e
    }
    
  }

  async web3ProviderConnect(onConnect: (account: string, web3Provider: ethers.providers.JsonRpcProvider) => void, onSessionUpdate: (account: string) => void, onDisconnect: () => void) {
    const accounts = await this.web3Provider.enable();

    this.ethersInjectedProvider = new ethers.providers.Web3Provider(this.web3Provider);

    onConnect(accounts[0], this.ethersInjectedProvider);

    if (this.web3Provider) {
      // Detect disconnection
      this.web3Provider
        .on('disconnect', (code: number, reason: string) => {
          // recommended
          console.log("user disconnected");
          onDisconnect();
        });
    }
  }

  // Unused
  async walletConnect(onConnect: (account: string, web3Provider: ethers.providers.JsonRpcProvider) => void, onSessionUpdate: (account: string) => void, onDisconnect: () => void) {
    if (!this.browserProvider.connected) {
      this.browserProvider.createSession();
      const uri = this.browserProvider.uri;

      WalletConnectQRModal.open(uri, () => {
        console.log("qr modal closed");
      })
    }

  
    this.browserProvider.on("connect", (error: any, payload: any) => {
      if (error) throw error;

      WalletConnectQRModal.close();

      const { accounts, chainId } = payload.params[0];
      this.currentAccount = accounts[0];
      onConnect(this.currentAccount, this.browserProvider as any);
    });
    
    this.browserProvider.on('session_update', (error: any, payload: any) => {
      if (error) throw error;

      const { accounts, chainId} = payload.params[0];
      this.currentAccount = accounts[0];
      onSessionUpdate(this.currentAccount);
    })

    this.browserProvider.on('disconnect', () => {
      console.log("user disconnected");
      onDisconnect();
    })
  }
}
