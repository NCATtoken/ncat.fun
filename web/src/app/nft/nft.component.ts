import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import detectEthereumProvider from '@metamask/detect-provider';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ethers } from 'ethers';
import _ from 'lodash';
import { environment } from 'src/environments/environment.prod';
import { ApiHttpService } from 'src/services/api-http.service';
import { approveNCAT, balanceOf, commitSwapNCAT, createNCATContractInstance, createNFTContractInstance, createPoundContractInstance, defaultProvider, getAllowance, getDecimals, getSwapCost, ipfsDirHash, nftPoundAddress, revealNCATs, tokenOfOwnerByIndex } from 'src/services/blockchain';
import { SessionService } from 'src/services/session.service';
// const Web3 = require('web3');

enum Screen {
  POUND = "pound",
  GALLERY = "gallery"
}

enum TraitType {
  COLLECTION = "collection",
  RARITY = "rarity",
  TYPE = "type"
}

interface Attribute {
  trait_type: TraitType,
  value: string
}

interface Metadata {
  attributes: Array<Attribute>
  description: string
  image: string
  index: number
  name: string
}

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss'],
  providers: [NgbCarouselConfig],
})
export class NFTComponent implements OnInit {

  // enums
  Screen = Screen;

  // Constants
  bigZero = ethers.BigNumber.from(0).toBigInt()

  // Providers
  provider = <unknown>{};
  ethersInjectedProvider = <ethers.providers.Web3Provider>{};

  // Page toggle
  viewing = "";

  // Account and chain checks
  currentAccount = "";
  correctChainId = 0;
  isCorrectChain = true;

  // Pending transaction
  approving = false
  burning = false
  revealing = false

  // Pound
  poundNCATAllowance = ethers.BigNumber.from(0).toBigInt();
  NCATCostPerNFT = 0;
  NFTtoMint = <any>undefined;
  NCATtoBurn = 0;

  // Gallery
  sampledata: Metadata[] = [{
    index: 1,
    name: 'NFT',
    description: 'Someone',
    image: 'assets/nft.gif',
    attributes: [
      {
        trait_type: TraitType.COLLECTION,
        value: 'value',
      },
      {
        trait_type: TraitType.RARITY,
        value: 'value',
      },
      {
        trait_type: TraitType.TYPE,
        value: 'value',
      }
    ],
  }, {
    index: 2,
    name: 'NFT',
    description: 'Someone',
    image: 'assets/nft.gif',
    attributes: [
      {
        trait_type: TraitType.RARITY,
        value: 'value',
      }
    ],
  }, {
    index: 3,
    name: 'NFT',
    description: 'Someone',
    image: 'assets/nft.gif',
    attributes: [
      {
        trait_type: TraitType.RARITY,
        value: 'value',
      }
    ],
  }, {
    index: 3,
    name: 'NFT',
    description: 'Someone',
    image: 'assets/nft.gif',
    attributes: [
      {
        trait_type: TraitType.RARITY,
        value: 'value',
      }
    ],
  }];

  ownedTokenIds: number[] = [];
  nftMetadata: Metadata[] = [];

  constructor(private ngZone: NgZone, private route: ActivatedRoute, private router: Router, private http: ApiHttpService, public session: SessionService, config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  async ngOnInit(): Promise<void> {
    this.provider = await detectEthereumProvider({ mustBeMetaMask: true });

    this.correctChainId = (await defaultProvider.getNetwork()).chainId;
    this.ngZone.run(() => {
      this.isCorrectChain = parseInt((this.provider as any).chainId) === this.correctChainId;
    });

    this.ethersInjectedProvider = new ethers.providers.Web3Provider((this.provider as any));

    // Attempt to grab accounts if already unlocked
    (this.provider as any)
      .request({ method: 'eth_accounts' })
      .then((accounts: Array<string>) => {
        this.ngZone.run(() => {
          if (accounts.length > 0) {
            this.currentAccount = accounts[0];
          }
        });
      })
      .catch((err: Error) => {
        console.error(err);
      });

    // Detect account changes
    if (this.provider) {
      (this.provider as any)
        .on('accountsChanged', (accounts: Array<string>) => {
          this.ngZone.run(() => {
            if (accounts.length === 0) {
              this.currentAccount = '';
              console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== this.currentAccount) {
              this.currentAccount = accounts[0];
              this.getPoundAllowance();
            }
          });

        });
    }

    // Detect chain changes
    if (this.provider) {
      (this.provider as any)
        .on('chainChanged', (chainId: number) => {
          this.ngZone.run(() => {
            this.isCorrectChain = parseInt((this.provider as any).chainId) === this.correctChainId;
          });
        });
    }


    this.getPoundAllowance();
    this.getSwapCost();

    this.getOwnedNFTs();
  }

  async getPoundAllowance(): Promise<any> {
    if (this.currentAccount) {
      if (this.provider) {
        const ncat = createNCATContractInstance(this.ethersInjectedProvider.getSigner());
        const allowance = await getAllowance(ncat, this.currentAccount, nftPoundAddress);
        this.ngZone.run(() => {
          this.poundNCATAllowance = allowance.toBigInt();
        });
      }
    } else {
      setTimeout(async () => { await this.getPoundAllowance() }, 1000);
    }
  }

  async getSwapCost(): Promise<any> {
    if (this.currentAccount) {
      if (this.provider) {
        const pound = createPoundContractInstance(this.ethersInjectedProvider.getSigner());
        const cost = await getSwapCost(pound);
        const ncat = createNCATContractInstance(this.ethersInjectedProvider.getSigner());
        const decimals = await getDecimals(ncat);
        this.ngZone.run(() => {
          this.NCATCostPerNFT = cost / (10 ** decimals);
        });
      }
    } else {
      setTimeout(async () => { await this.getSwapCost() }, 1000);
    }
  }

  async getOwnedNFTs(): Promise<any> {
    if (this.currentAccount) {
      if (this.provider) {
        const nft = createNFTContractInstance(this.ethersInjectedProvider.getSigner());
        const balance = await balanceOf(nft, this.currentAccount);

        let tokenIds: Array<number> = [];
        _.range(balance).map(async (index) => {
          const tokenId = await tokenOfOwnerByIndex(nft, this.currentAccount, index)
          tokenIds.push(tokenId);
        })

        console.log('tokens:', tokenIds)
        this.ngZone.run(() => {
          this.ownedTokenIds = tokenIds;
        });
      }
    } else {
      setTimeout(async () => { await this.getOwnedNFTs() }, 1000);
    }
  }

  async getNFTMetadata(): Promise<any> {
    if (this.currentAccount && this.ownedTokenIds.length > 0) {
      this.ownedTokenIds.forEach(async (tokenId) => {
        this.http.get(`https://ipfs.io/ipfs/${ipfsDirHash}/${tokenId}.json`).subscribe((res: any) => {
          this.nftMetadata.push(res);
          console.log('nfts', this.nftMetadata)
        })
      })
    } else {
      setTimeout(async () => { await this.getNFTMetadata() }, 1000);
    }
  }

  async connectWallet() {
    const handleAccountsChanged = (accounts: Array<string>) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== this.currentAccount) {
        this.currentAccount = accounts[0];
        // Do any other work!
      }
    }

    if (this.provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      (this.provider as any)
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err: any) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
    } else {
      console.log('Please install MetaMask!');
    }
  }

  async disconnectWallet() {
    this.currentAccount = '';
  }

  viewPound() {
    this.viewing = Screen.POUND
  }

  viewGallery() {
    this.viewing = Screen.GALLERY
    if (!environment.production && this.nftMetadata.length == 0) this.nftMetadata = this.sampledata;
    this.getNFTMetadata();
  }

  onBurnInputChange() {
    this.ngZone.run(() => {
      this.NCATtoBurn = (this.NCATCostPerNFT || 0) * this.NFTtoMint;
    });
  }

  async approvePound() {
    try {
      this.ngZone.run(() => {
        this.approving = true;
      });
      const ncat = createNCATContractInstance(this.ethersInjectedProvider.getSigner());
      const txHash = await approveNCAT(ncat, nftPoundAddress);
      this.getPoundAllowance();
      alert(`Approved!\nTransaction hash: ${txHash}`);
    } catch (e) {
      alert(e.data ? e.data.message : e.message);
      console.log(e);
    } finally {
      this.ngZone.run(() => {
        this.approving = false;
      });
    }
  }

  async commitBurnSwap() {
    try {
      this.ngZone.run(() => {
        this.burning = true;
      });
      const pound = createPoundContractInstance(this.ethersInjectedProvider.getSigner());
      const txHash = await commitSwapNCAT(pound, this.NFTtoMint);
      alert(`Burned!\nTransaction hash: ${txHash}`);
      this.getPoundAllowance();
    } catch (e) {
      alert(e.data ? e.data.message : e.message);
      console.log(e);
    } finally {
      this.ngZone.run(() => {
        this.burning = false;
      });
    }
  }

  async revealNCATs() {
    try {
      this.ngZone.run(() => {
        this.revealing = true;
      });
      const pound = createPoundContractInstance(this.ethersInjectedProvider.getSigner());
      const txHash = await revealNCATs(pound);
      alert(`Revealed!\nTransaction hash: ${txHash}\nView your NFT in the gallery!`);

      this.ngZone.run(() => {
        this.viewGallery();
      });
    } catch (e) {
      alert(e.data ? e.data.message : e.message);
      console.log(e);
    } finally {
      this.ngZone.run(() => {
        this.revealing = false;
      });
    }
  }
}
