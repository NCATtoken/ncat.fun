import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Proposal } from 'src/services/models.definitioins';
import { CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss']
})
export class ProposalItemComponent implements OnInit {

  @Input("data") p!: Proposal;
  // @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  config: CountdownConfig = {};

  constructor() { }

  ngOnInit(): void {
    // this.countdown.begin();
    this.config = {
      format: 'dd HH mm ss',
      prettyText: (s) => {
        const dd = s.split(' ');
        return '⏰ <b class="t">' + dd[0] + '</b>D:' +
          '<b class="t">' + dd[1] + '</b>H:' +
          '<b class="t">' + dd[2] + '</b>M:' +
          '<b class="t">' + dd[3] + '</b>S'
          ;

      },
      stopTime: Date.parse(this.p.expiration!),
    }
  }

}
