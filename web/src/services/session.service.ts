import { Injectable, EventEmitter } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from 'src/environments/environment';
import * as blockchain from "../services/blockchain";
import { ApiHttpService } from './api-http.service';
import { Cart, Metadata, Price } from './models.definitioins';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';


declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  price: Price = {};
  metadata: Metadata = {};
  cart: Cart;

  constructor(private http: ApiHttpService, private storage: SessionStorageService) {
    this.cart = Object.assign(new Cart, storage.get('cart') || {});
    this.updatePrice();
    this.updateMetadata();

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

}
