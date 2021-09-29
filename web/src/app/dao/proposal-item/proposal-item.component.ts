import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BigNumber } from '@ethersproject/bignumber';
import { isNumber } from 'lodash';
// import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { Proposal, States } from 'src/services/models.definitioins';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss']
})
export class ProposalItemComponent implements OnInit, DoCheck {

  @Input("data") p!: Proposal;
  @Output() vote = new EventEmitter<boolean>();
  @Output() fund = new EventEmitter<void>();
  @Input() address!: string;
  @Input() sendingFund!: boolean;

  // @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  States = States;
  config = {};
  passed = true;
  progress: number = 0;
  fund_progress: number = 0;
  vfor!: BigNumber;
  vagainst!: BigNumber;
  vtotal!: BigNumber;
  voted = false;
  showvoters = false;
  showfunders = false;
  funded = false;

  constructor() { }

  ngDoCheck() {
    this.updatepct();
  }

  ngOnInit(): void {
    this.config = {
      // format: 'dd HH mm ss',
      // prettyText: (s) => {
      //   const dd = s.split(' ');
      //   return '⏰ <b class="t">' + dd[0] + '</b>D:' +
      //     '<b class="t">' + dd[1] + '</b>H:' +
      //     '<b class="t">' + dd[2] + '</b>M:' +
      //     '<b class="t">' + dd[3] + '</b>S';
      // },
      stopTime: Date.parse(this.p.expiration!),
    }

    this.updatepct();
  }

  countdownEvent(e: any) {
    if (e == 'ended') {
      // todo: refresh item
    }
  }

  onVote(val: boolean) {
    if (!confirm('Submit your vote?')) return;
    this.vote.emit(val);
  }

  onFund() {
    this.fund.emit();
  }

  updatepct() {
    this.voted = this.p.voters?.includes(this.address) || false;

    this.vfor = BigNumber.from(this.p.for);
    this.vagainst = BigNumber.from(this.p.against);
    this.vtotal = this.vagainst.add(this.vfor);
    if (this.vtotal.isZero()) {
      this.progress = 0;
    }
    else {
      this.progress = this.vfor.div(this.vtotal).toNumber() * 100;
    }

    // 75% and 200B voted
    this.passed = (this.progress > 75 && this.vfor.gte(BigNumber.from(200 * 10 ** 9)));

    if (this.p.require_fund) {
      this.fund_progress = (this.p.raised_fund || 0) / (this.p.target_fund || 1) * 100;
    }
    else {
      this.fund_progress = 0;
    }

    this.funded = ((this.p.raised_fund || 0) >= (this.p.target_fund || 1));
  }
}
