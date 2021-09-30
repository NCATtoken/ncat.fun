import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {

  constructor(public session: SessionService) { }

  ngOnInit(): void {
  }

}
