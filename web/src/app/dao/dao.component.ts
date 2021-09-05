import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/services/api-http.service';
import { MetaMaskService } from 'src/services/metamask.service';
import { Proposal } from 'src/services/models.definitioins';
import { WalletConnectService } from 'src/services/walletconnect.service';

enum Screen {
  VOTING = "Voting",
  RESEARCH = "Research",
  FUNDING = "Funding",
  IMPLEMENTATION = "Implementation",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
}

@Component({
  selector: 'app-dao',
  templateUrl: './dao.component.html',
  styleUrls: ['./dao.component.scss']
})

export class DAOComponent implements OnInit {

  // enums
  Screen = Screen;

  // Constants
  bigZero = ethers.BigNumber.from(0).toBigInt()

  // Providers
  provider = <unknown>{};
  ethersInjectedProvider = <ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>{};
  isMetamask = false;

  // Page toggle
  showhelp = false;
  allviews = [Screen.VOTING, Screen.RESEARCH, Screen.FUNDING, Screen.IMPLEMENTATION, Screen.COMPLETED, Screen.REJECTED];
  viewing: String[] = [Screen.VOTING, Screen.FUNDING, Screen.RESEARCH, Screen.IMPLEMENTATION, Screen.COMPLETED];

  // Account and chain checks
  currentAccount = "";
  // correctChainId = 0;
  isCorrectChain = true;

  // proposals
  proposals: Proposal[] = [];
  _proposals: Proposal[] = [];
  start = 0;
  limit = 50;
  loading = false;
  end = false;
  showpropose = false;
  accesstoken?: String;

  public get options() {
    return {
      headers: {
        Authorization: `Bearer ${this.accesstoken}`,
      }
    };
  }


  constructor(private ngZone: NgZone, private http: ApiHttpService, public metamask: MetaMaskService, public walletconnect: WalletConnectService, private renderer: Renderer2) {
  }


  login(onSuccess: Function) {
    this.http.get(`${environment.daoBaseurl}/login?address=${this.currentAccount}`).subscribe((res: any) => {
      this.accesstoken = res.token;
      onSuccess()
    }, (e) => {
      //
    }, () => {
    });
  }

  async ngOnInit(): Promise<void> {
    this.metamask.chainEvents.subscribe((event) => {
      if (!this.metamask.provider) {
        console.log('No metamask');
        return;
      }
      console.log('metamask event', event);
      this.ngZone.run(() => {
        if (this.currentAccount || !this.metamask.currentAccount) return;

        if (event == 'start') {
          this.provider = this.metamask.provider;
          this.ethersInjectedProvider = this.metamask.ethersInjectedProvider;
        }

        this.isCorrectChain = this.metamask.isCorrectChain;
        this.currentAccount = this.metamask.currentAccount;
        console.log('mm', this.currentAccount);
        this.login(() => {
          this.onIntersection();
        });

        if (this.isCorrectChain && this.currentAccount) {
          this.isMetamask = true;
          // this.getPoundAllowance();
          // this.getSwapCost();
          // this.getOwnedNFTs();
        }

      });
    });

    this.walletconnect.chainEvents.subscribe((event) => {
      if (!this.walletconnect.provider) {
        console.log('No walletconect');
        return;
      }
      console.log('walletconnect event', event);
      this.ngZone.run(() => {
        if (this.currentAccount || !this.walletconnect.currentAccount) return;

        if (event == 'start') {
          this.provider = this.walletconnect.provider;
          this.ethersInjectedProvider = this.walletconnect.ethersInjectedProvider;
        }

        this.isCorrectChain = this.walletconnect.isCorrectChain;
        this.currentAccount = this.walletconnect.currentAccount;
        console.log('wc', this.currentAccount);
        this.login(() => {
          this.onIntersection();
        });

        if (this.isCorrectChain && this.currentAccount) {
          this.isMetamask = false;
          // this.getPoundAllowance();
          // this.getSwapCost();
          // this.getOwnedNFTs();
        }
      });
    });
  }

  async connectMetamask() {
    await this.metamask.connectWallet();
  }

  async connectWalletConnect() {
    await this.walletconnect.connectWallet();
  }

  async disconnectWallet() {
    if (this.isMetamask) {
      alert('You need to manually disconnect site from Metamask plugin');
      this.metamask.disconnect();
    }
    else {
      if (!confirm('Disconnect your wallet?')) return;
      this.walletconnect.disconnect();
    }
  }

  //
  toggleViews(view: Screen) {
    if (this.viewing.includes(view)) {
      this.viewing.splice(this.viewing.indexOf(view), 1)
    } else {
      this.viewing.push(view);
    }
    this.proposals = this._proposals.filter((e) => this.viewing.includes(e.state!));
  }

  // lazy load

  onIntersection(/*{ target, visible }: { target: Element; visible: boolean }*/): void {
    if (this.end || this.loading || !this.accesstoken) {
      return;
    }
    console.log('load more', this.currentAccount, this.accesstoken);

    // load more
    this.loading = true;
    this.http.get(`${environment.daoBaseurl}/proposals?page=${this.start}`, this.options).subscribe((res: any) => {
      this._proposals = this._proposals.concat(res.proposals);
      this.start++;
      this.end = (res.proposals.length < this.limit);
      this.proposals = this._proposals.filter((e) => this.viewing.includes(e.state!));
    }, (e) => {
      //
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
      this.onIntersection();
    }
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