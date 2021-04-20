import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-tokenomics',
  templateUrl: './tokenomics.component.html',
  styleUrls: ['./tokenomics.component.scss']
})
export class TokenomicsComponent implements OnInit {

  environment = environment;
  showbalance = false;
  constructor(public session: SessionService) { }

  ngOnInit(): void {
  }

}
