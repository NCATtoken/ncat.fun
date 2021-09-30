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

  constructor(public session: SessionService) {
    this.session.readyEvent.subscribe(() => {
      console.log(this.session.isMetamask);
    });

  }

  ngOnInit(): void {
  }

}
