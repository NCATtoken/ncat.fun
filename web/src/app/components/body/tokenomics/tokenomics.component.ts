import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MetaMaskService } from 'src/services/metamask.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-tokenomics',
  templateUrl: './tokenomics.component.html',
  styleUrls: ['./tokenomics.component.scss']
})
export class TokenomicsComponent implements OnInit {

  environment = environment;
  showbalance = false;
  isConnectedToWallet = false;
  isCorrectChain = false;
  currentBalance = 0;

  constructor(public session: SessionService, public metamask: MetaMaskService, public ngZone: NgZone) {

    this.metamask.chainEvents.subscribe((event) => {
      this.ngZone.run(() => {
        this.isCorrectChain = this.metamask.isCorrectChain;
        this.isConnectedToWallet = this.metamask.isConnectedToWallet;
        if (this.isConnectedToWallet) {
          this.showbalance = true;
          if (event !== 'balance') {
            // prevent restream...
            this.metamask.streamBalance();
          }
        }
        if (event == 'balance') {
          this.currentBalance = this.metamask.currentBalance;
        }
      });
    });
  }

  ngOnInit(): void {
  }

  connectwallet() {
    this.metamask.connectWallet();
  }
}
