import { Component, DoCheck, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BigNumber } from '@ethersproject/bignumber';
import { isNumber } from 'lodash';
import { environment } from 'src/environments/environment';
// import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { Proposal, States } from 'src/services/models.definitioins';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss']
})
export class ProposalItemComponent implements OnInit, DoCheck {

  @Input("data") p!: Proposal;
  @Input() address!: string;
  @Input() sendingFund!: boolean;
  @Input() isadmin!: boolean;
  @Output() vote = new EventEmitter<boolean>();
  @Output() fund = new EventEmitter<void>();
  @Output() state = new EventEmitter<boolean>();

  // @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  States = States;
  config = {};
  config2 = {};
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

  constructor(public ngZone: NgZone) { }

  ngDoCheck() {
    this.updatepct();
  }

  ngOnInit(): void {
    this.config = {
      stopTime: Date.parse(this.p.expiration!),
    }
    if (this.p.has_expire == true) {
      this.config2 = {
        stopTime: Date.parse(this.p.expire_date!),
      }
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

  onApprove() {
    if (!confirm('Approve the ' + this.p.state + ' ?')) return;
    this.state.emit(true);
  }

  onReject() {
    if (!confirm('Reject the proposal?')) return;
    this.state.emit(false);
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
    this.passed = (this.progress > environment.require_percentage && this.vfor.gte(BigNumber.from(environment.require_weight * 10 ** 9)));

    if (this.p.require_fund) {
      this.fund_progress = (this.p.raised_fund || 0) / (this.p.target_fund || 1) * 100;
    }
    else {
      this.fund_progress = 0;
    }
    this.funded = ((this.p.raised_fund || 0) >= (this.p.target_fund || 1));
  }
}
