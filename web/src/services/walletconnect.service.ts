import { EventEmitter, Injectable } from '@angular/core';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import * as blockchain from "./blockchain";


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {

  //  wallet action
  provider: WalletConnectProvider | null = null;
  // browserProvider = <WalletConnect>{};
  ethersInjectedProvider = <ethers.providers.JsonRpcProvider>{};
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
    await blockchain.defaultProvider.getNetwork();
    this.currentAccount = '';
    //  Create WalletConnect Provider
    this.provider = new WalletConnectProvider({
      chainId: 56,
      rpc: {
        56: blockchain.nodeURL,
      },
    });

    if (this.provider) {
      this.isCorrectChain = ((this.provider as WalletConnectProvider).chainId === environment.chainId);
      this.ethersInjectedProvider = new ethers.providers.Web3Provider(this.provider);

      // const accounts = await this.web3Provider.enable();
      // this.currentAccount = accounts[0];

      // Detect disconnection
      (this.provider as WalletConnectProvider)
        .on('disconnect', () => {
          this.currentAccount = '';
          this.chainEvents.emit('disconnected');
        });

      // (this.provider as WalletConnectProvider)
      //   .on('connect', (r: any) => {
      //     console.log(r);
      //     this.chainEvents.emit('connect');
      //   });
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
    try {
      const accounts = await (this.provider as WalletConnectProvider).enable();
      this.currentAccount = accounts[0];
      this.chainEvents.emit('connect');
    } catch (e) {
      // reload browser if user close the qrcode
      window.document.location.reload();
    }
  }

  async disconnect() {
    this.currentAccount = '';
    return this.provider?.disconnect();
  }

  // Unused
  // async walletConnect(onConnect: (account: string, web3Provider: ethers.providers.JsonRpcProvider) => void, onSessionUpdate: (account: string) => void, onDisconnect: () => void) {
  //   if (!this.browserProvider.connected) {
  //     this.browserProvider.createSession();
  //     const uri = this.browserProvider.uri;

  //     WalletConnectQRModal.open(uri, () => {
  //       console.log("qr modal closed");
  //     })
  //   }


  //   this.browserProvider.on("connect", (error: any, payload: any) => {
  //     if (error) throw error;

  //     WalletConnectQRModal.close();

  //     const { accounts, chainId } = payload.params[0];
  //     this.currentAccount = accounts[0];
  //     onConnect(this.currentAccount, this.browserProvider as any);
  //   });

  //   this.browserProvider.on('session_update', (error: any, payload: any) => {
  //     if (error) throw error;

  //     const { accounts, chainId } = payload.params[0];
  //     this.currentAccount = accounts[0];
  //     onSessionUpdate(this.currentAccount);
  //   })

  //   this.browserProvider.on('disconnect', () => {
  //     console.log("user disconnected");
  //     onDisconnect();
  //   })
  // }
}
