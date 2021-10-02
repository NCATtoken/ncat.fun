import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from 'src/environments/environment';
import * as blockchain from "../services/blockchain";
import { ApiHttpService } from './api-http.service';
import { Cart, Metadata, Price } from './models.definitioins';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { MetaMaskService } from './metamask.service';
import { SocketioService } from './socketio.service';
import { WalletConnectService } from './walletconnect.service';


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  price: Price = {};
  metadata: Metadata = {};
  cart: Cart;

  constructor(private http: ApiHttpService, private storage: SessionStorageService, private ngZone: NgZone, private socket: SocketioService, public metamask: MetaMaskService, public walletconnect: WalletConnectService) {
    this.cart = Object.assign(new Cart, storage.get('cart') || {});
    this.updatePrice();
    this.updateMetadata();
    this.initwallets();

  }

  updatePrice() {
    this.http.get(environment.priceDataJson)
      .subscribe((res: any) => {
        this.price = res;
      }, (error) => {
        // retry in 5 sec
        setTimeout(() => this.updatePrice(), 5000);
      }, () => {
        // get new price every 15min, if u wait long enough :D
        setTimeout(() => this.updatePrice(), 15 * 60 * 1000);
      });
  }

  // cart
  saveCart() {
    this.cart.subtotal = 0;
    this.cart.shipping = 6; // hardcode
    this.cart.items.forEach(e => {
      this.cart.subtotal += e.amount;
    });
    this.cart.tax = parseFloat((this.cart.subtotal * environment.tax / 100).toFixed(2));
    this.cart.total = this.cart.subtotal + this.cart.tax + this.cart.shipping;
    this.storage.set('cart', this.cart);
  }


  updateMetadata() {
    this.http.get(this.http.createUrl('metadata'))
      .subscribe((res: any) => {
        this.metadata = res;
      }, (error) => {
        // retry in 5 sec
        setTimeout(() => this.updatePrice(), 5000);
      }, () => {
        // get new price every 15min, if u wait long enough :D
        setTimeout(() => this.updatePrice(), 15 * 60 * 1000);
      });
  }

  // blockchain part
  currentAccount = "";
  isCorrectChain = true;
  accesstoken?: String;
  isadmin = false;
  currentBalance = 0;

  // Providers
  provider = <unknown>{};
  ethersInjectedProvider = <ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>{};
  isMetamask?: boolean;

  readyEvent = new EventEmitter<void>();

  login(onSuccess: Function) {
    this.http.get(`${environment.daoBaseurl}/login?address=${this.currentAccount}`).subscribe((res: any) => {
      this.accesstoken = res.token;
      this.isadmin = res.a;
      onSuccess()
    }, (e) => {
      if (e.error?.message)
        alert(e.error.message);
      else
        alert(e.message);
    }, () => {
    });
  }


  initwallets() {
    this.metamask.chainEvents.subscribe((event) => {
      if (!this.metamask.provider) {
        console.log('No metamask');
        return;
      }

      console.log('metamask event', event);
      if (event == 'balance') {
        this.currentBalance = this.metamask.currentBalance;
        console.log(this.currentAccount, 'balance', this.currentBalance);
        return;
      }

      this.ngZone.run(() => {

        if (event == 'start') {
          this.provider = this.metamask.provider;
          this.ethersInjectedProvider = this.metamask.ethersInjectedProvider;
          this.isMetamask = true;
        }

        if (!this.metamask.currentAccount) return;

        this.isCorrectChain = this.metamask.isCorrectChain;
        this.currentAccount = this.metamask.currentAccount;
        this.metamask.streamBalance();

        if (this.isCorrectChain && this.currentAccount) {
          this.login(() => {
            this.readyEvent.emit();
          });
        }
      });
    });

    this.walletconnect.chainEvents.subscribe((event) => {
      if (!this.walletconnect.provider) {
        console.log('No walletconect');
        return;
      }

      console.log('walletconnect event', event);
      if (event == 'balance') {
        this.currentBalance = this.walletconnect.currentBalance;
        console.log(this.currentAccount, 'balance', this.currentBalance);
        return;
      }

      this.ngZone.run(() => {

        if (event == 'start') {
          this.provider = this.walletconnect.provider;
          this.ethersInjectedProvider = this.walletconnect.ethersInjectedProvider;
          this.isMetamask = false;
        }

        if (!this.walletconnect.currentAccount) return;

        this.isCorrectChain = this.walletconnect.isCorrectChain;
        this.currentAccount = this.walletconnect.currentAccount;
        this.walletconnect.streamBalance();

        if (this.isCorrectChain && this.currentAccount) {
          this.login(() => {
            this.readyEvent.emit();
          });
        }
      });
    });
  }


  async connectMetamask() {
    await this.metamask.connectWallet();
  }

  async connectWalletConnect() {
    await this.walletconnect.connectWallet();
  }

  async disconnectWallet() {
    this.currentAccount = '';
    if (this.isMetamask) {
      alert('You need to manually disconnect site from Metamask plugin');
      this.metamask.disconnect();
    }
    else {
      if (!confirm('Disconnect your wallet?')) return;
      this.walletconnect.disconnect();
    }
  }

  async addchain() {
    if (this.isMetamask) {
      if (environment.chainId == 56) {
        this.metamask.provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x38', chainName: 'Binance Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://bsc-dataseed.binance.org/'], blockExplorerUrls: ['https://bscscan.com/'] }] });
      }
      else {
        this.metamask.provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x61', chainName: 'BSC Testnet', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'], blockExplorerUrls: ['https://testnet.bscscan.com/'] }] });
      }
    }
    else {
      alert('Please add manually');
    }
  }

}
