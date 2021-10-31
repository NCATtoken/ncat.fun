import { Component, NgZone, OnInit } from '@angular/core';
import { ApiHttpService } from 'src/services/api-http.service';
import { SessionService } from 'src/services/session.service';
import { SocketioService } from 'src/services/socketio.service';
import * as blockchain from 'src/services/blockchain';
import * as pancakeswap from 'src/services/pancakeswap';
import { BigNumber } from '@ethersproject/bignumber';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {

  amount: number | undefined;
  outputAmount: number = 0.0;
  outputValue: string = '0.0';
  ncat_per_bnb: number = 0.0;
  buying: boolean = true;
  bnb_balance: number = 0.0;
  fromAddress = pancakeswap.bnbAddress;
  toAddress = blockchain.contractAddress;
  slippage = pancakeswap.slippage;
  isSwapping = false;

  constructor(private ngZone: NgZone, private http: ApiHttpService, private socket: SocketioService, public session: SessionService) {

    this.socket.onMessage.subscribe((r) => {
    });
  }

  usemax() {
    if (this.buying)
      this.amount = Number((this.bnb_balance - 0.01).toFixed(5));
    else
      this.amount = Math.floor(this.session.currentBalance / 10 ** 9);

    this.updateOutput();
  }

  ngOnInit() {
    if (this.session.accesstoken) {
      this.streamBnb();
    }
    else {
      this.session.readyEvent.subscribe(() => {
        this.streamBnb();
      });
    }
    this.streamPrice();
  }

  toggle(a = this.buying) {
    this.buying = !a;
    delete this.amount;
    this.outputAmount = 0;
    this.outputValue = '0.0';
  }

  updateOutput() {
    // calculate exchange
    if (this.buying) {
      this.outputAmount = Math.floor(this.ncat_per_bnb * (this.amount || 0));
    }
    else {
      this.outputAmount = ((this.amount || 0) / this.ncat_per_bnb);
    }

    // deduct slippage
    this.outputAmount *= (1 - this.slippage);

    // format output
    if (this.outputAmount > 10 ** 12) {
      this.outputValue = '~' + (this.outputAmount / (10 ** 12)).toFixed(5) + 'T';
    } else if (this.outputAmount > 10 ** 9) {
      this.outputValue = '~' + (this.outputAmount / (10 ** 9)).toFixed(5) + 'B';
    } else if (this.outputAmount > 10 ** 6) {
      this.outputValue = '~' + (this.outputAmount / (10 ** 6)).toFixed(5) + 'M';
    } else {
      this.outputValue = '~' + this.outputAmount.toFixed(5);
    }
  }

  streamBnb() {
    // console.log('get bnb');
    setTimeout(() => this.streamBnb(), 5000);
    (this.session.ethersInjectedProvider).getBalance(this.session.currentAccount).then((r: any) => {

      this.ngZone.run(() => {
        this.bnb_balance = BigNumber.from(r).div(10 ** 9).toNumber() / 10 ** 9;
      });
    }).catch((e) => {
      //
    });
  }

  streamPrice() {
    // console.log('get quote');
    setTimeout(() => this.streamPrice(), 5000);
    pancakeswap.getAmountsOut(BigNumber.from(10 ** 9).mul(10 ** 9), [pancakeswap.bnbAddress, blockchain.contractAddress]).then((r) => {
      // console.log(r);
      this.ngZone.run(() => {
        this.ncat_per_bnb = BigNumber.from(r[1]).div(10 ** 9).toNumber();
        this.updateOutput();
      });
    }).catch((e) => {
      //
    });
  }

  async startswap() {
    try {

      if (this.buying) {
        if (this.amount! < 0.001) {
          alert('Please swap for more than 0.001 BNB');
          return;
        }
      }
      else {
        if (this.outputAmount < 0.001) {
          alert('Please swap for more than 0.001 BNB');
          return;
        }
      }

      let transaction;

      this.isSwapping = true;
      this.socket.onMessage.next({ type: 'message', data: 'Swapping...' });

      if (this.buying) {
        transaction = await pancakeswap.buyTokens(
          this.session.ethersInjectedProvider.getSigner(),
          this.session.currentAccount,
          BigNumber.from(Math.floor(this.amount! * 10 ** 9)).mul(10 ** 9),
          BigNumber.from(Math.floor(this.outputAmount)).mul(10 ** 9),
        );
      }
      else {
        transaction = await pancakeswap.sellTokens(
          this.session.ethersInjectedProvider.getSigner(),
          this.session.currentAccount,
          BigNumber.from(Math.floor(this.amount!)).mul(10 ** 9),
          BigNumber.from(Math.floor(this.outputAmount * 10 ** 9)).mul(10 ** 9),
        );
      }
      console.log(transaction);

      let receipt = await transaction.wait(1);
      console.log(receipt);

      this.socket.onMessage.next({ type: 'message', data: 'Swap Successful!' });

      delete this.amount;
      this.outputAmount = 0;
      this.outputValue = '0.0';

    } catch (error: any) {
      this.socket.onMessage.next({ type: 'message', data: 'Swap failed!' });
      alert(error.data?.message || error.message || error);
      throw error;
    } finally {
      this.isSwapping = false;
    }
  }
}
