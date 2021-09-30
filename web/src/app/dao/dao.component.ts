import { ThrowStmt } from '@angular/compiler';
import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/services/api-http.service';
import { MetaMaskService } from 'src/services/metamask.service';
import { Proposal, States } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';
import { SocketioService } from 'src/services/socketio.service';
import { WalletConnectService } from 'src/services/walletconnect.service';


@Component({
  selector: 'app-dao',
  templateUrl: './dao.component.html',
  styleUrls: ['./dao.component.scss']
})

export class DAOComponent implements OnInit {


  // Page toggle
  showhelp = false;
  allviews = [States.VOTING, States.RESEARCH, States.FUNDING, States.IMPLEMENTATION, States.COMPLETED, States.REJECTED];
  viewing: String[] = [States.VOTING, States.FUNDING, States.RESEARCH, States.IMPLEMENTATION, States.COMPLETED];
  vieworders = ['Latest', 'Popularity'];
  vieworder = this.vieworders[0];
  isSendingFund = false;

  // proposals
  proposals: Proposal[] = [];
  _proposals: Proposal[] = [];
  start = 0;
  limit = 50;
  loading = false;
  end = false;
  showpropose = false;

  public get options() {
    return {
      headers: {
        Authorization: `Bearer ${this.session.accesstoken}`,
      }
    };
  }


  constructor(private ngZone: NgZone, private http: ApiHttpService, private socket: SocketioService, public session: SessionService) {

    this.socket.onMessage.subscribe((r) => {
      // watch proposal update message
      if (r.type == 'proposal' && r.data) {
        let data = r.data;
        let idx = this.proposals.findIndex((e) => e.id == data.id);
        if (idx >= 0) {
          let p = this.proposals[idx];
          this.proposals[idx] = Object.assign(p, data);
        }
      }
    });

  }

  ngOnInit() {
    if (this.session.accesstoken) {
      this.loadProposals();
    }
    this.session.readyEvent.subscribe(() => {
      this.loadProposals();
    });
  }

  //
  toggleViews(view: States) {
    if (this.viewing.includes(view)) {
      this.viewing.splice(this.viewing.indexOf(view), 1)
    } else {
      this.viewing.push(view);
    }
    this.proposals = this._proposals.filter((e) => this.viewing.includes(e.state!));
    this.sortViews();
  }

  //
  sortViews() {
    switch (this.vieworder) {

      case 'Popularity':
        this.proposals.sort((a, b) => (BigNumber.from(b.for).lt(BigNumber.from(a.for))) ? -1 : 1);
        break;
      default:
        this.proposals.sort((a, b) => b.id! - a.id!);
        break;
    }
  }

  // lazy load

  loadProposals(/*{ target, visible }: { target: Element; visible: boolean }*/): void {
    if (this.end || this.loading || !this.session.accesstoken) {
      return;
    }

    // load more
    this.loading = true;
    this.http.get(`${environment.daoBaseurl}/proposals?page=${this.start}`, this.options).subscribe((res: any) => {
      this._proposals = this._proposals.concat(res.proposals);
      this.start++;
      this.end = (res.proposals.length < this.limit);
      this.proposals = this._proposals.filter((e) => this.viewing.includes(e.state!));
    }, (e) => {
      if (e.error?.message)
        alert(e.error.message);
      else
        alert(e.message);
    }, () => {
      this.loading = false;
    });
  }

  // propose
  onPropose(created: boolean) {
    this.showpropose = false;
    window.scroll(0, 0);
    if (created) {
      this._proposals = [];
      this.start = 0;
      this.end = false;
      this.loading = false;
      this.loadProposals();
    }
  }

  // onvote
  onVote(p: Proposal, vote: boolean) {
    console.log('vote', p, vote);

    // load more
    this.http.get(`${environment.daoBaseurl}/proposals/vote?proposalId=${p.id}&support=${vote}`, this.options).subscribe((res: any) => {
      if (res.message == 'success') {
        // this.proposals.splice(this.proposals.indexOf(p), 1, [res.proposal] as any);
        this.proposals[this.proposals.indexOf(p)] = Object.assign(p, res.proposal);
      }
    }, (e) => {
      if (e.error?.message)
        alert(e.error.message);
      else
        alert(e.message);
    }, () => {
      // this.loading = false;
    });
  }

  // send BNB to wallet
  onFund(p: Proposal) {
    let amount = prompt('Enter amount to fund in BNB.');

    if (amount == null || isNaN(parseFloat(amount))) {
      alert('Please enter a valid amount')
      return;
    }

    const tx = {
      to: p.fund_wallet_address,
      value: ethers.utils.parseEther(amount),
    };

    this.session.ethersInjectedProvider.getSigner().sendTransaction(tx)
      .then(async (transaction) => {
        this.isSendingFund = true;
        let receipt = await transaction.wait(1);

        await this.http.post(`${environment.daoBaseurl}/proposals/fund?proposalId=${p.id}`, { transaction, receipt }, this.options).subscribe((res: any) => {
          if (res.message == 'success') {
            this.proposals[this.proposals.indexOf(p)] = Object.assign(p, res.proposal);
          }
        }, (e) => {
          if (e.error?.message)
            alert(e.error.message);
          else
            alert(e.message);
        }, () => {
          // this.loading = false;
        });
      })
      .catch((E) => console.log(E.data.message))
      .finally(() => {
        this.isSendingFund = false;
      });
  }

  // advance to next state
  onState(p: Proposal, accepted: boolean) {
    if ((p.state != States.RESEARCH && p.state != States.IMPLEMENTATION) || !this.session.isadmin) return;

    this.http.post(`${environment.daoBaseurl}/proposals/state?proposalId=${p.id}`, { accepted }, this.options).subscribe((res: any) => {
      if (res.message == 'success') {
        this.proposals[this.proposals.indexOf(p)] = Object.assign(p, res.proposal);
      }
    }, (e) => {
      if (e.error?.message)
        alert(e.error.message);
      else
        alert(e.message);
    }, () => {
      // this.loading = false;
    });
  }

}

/**
 DAO revamp plan
1) build DAO into website following website's theme — similar to merch store and NFT

2) each DAO should have a life-span (or stages)
a) NEW : voting stage

b) ACCEPTED or REJECTED
 - for a vote to be accepted it needs to also hit certain threshold ie 50 people vote yes and total votes weighted 20T NCATs or more
- otherwise it is still rejected

c) RESEARCH:
  - at this stage we need to contact the community and figure out details, eg the funding-target-amount, funding-target-date, currently-funded-amount, and also detail writeup (or pitch video ?) about the project and it's own mini-roadmap
  - next it goes to FUNDING or IMPLEMENTATION stage if no funding needed.

d) FUNDING
  - for DAO that needs funding, they go into this stage (after research being done)
  - at this stage each DAO will have it's OWN funding-target-amount, funding-target-date, currently-funded-amount, and also detail writeup (or pitch video ?) about the project and it's own mini-roadmap
  - after fund secured, continue to IMPLEMENTATION stage. ** see what-ifs below
  - all DAO funds should go into multisig wallet. each project's funding ledger will be traced in a off-chain database

e) IMPLEMENTATION:
 - once funding secured they come to this stage, OR for DAO that doesn't require funding
 - mini roadmaps are updated as we progress, until the project is COMPLETE

f) COMPLETED
 - hall of fame! all successfully completed  DAO will be recorded here

g) CANCELLED / REJECTED
  - basically the graveyards of ideas

the what-ifs:
- if funding fail to reach within timeline, what happen to the funds?


graph LR
    P((Proposed))
    V{Voting}
    R{Research}
    F{Funding}
    I{Implementation}
    C((Completed))
    X((Failed))

    P --> V
    subgraph Proposal Lifespan
    V -->|Vote Passed| R
    R -->|Needs Funding| F
    F -->|Funds Secured| I
    I -->|Fa0iled to Implement| X
    end
    I -->|Implemented| C
    R -->|Rejected| X
    F -->|No Funds| X
    R -->|No Need Funding| I
    V -->|Vote Failed| X
    X --> C


 */