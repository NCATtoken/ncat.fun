import { Component, NgZone, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ethers } from 'ethers';
import _ from 'lodash';
import { environment } from 'src/environments/environment.prod';
import { ApiHttpService } from 'src/services/api-http.service';
import { approveNCAT, balanceOf, commitSwapNCAT, createNCATContractInstance, createNFTContractInstance, createPoundContractInstance, getAllowance, getDecimals, getSwapCost, nftPoundAddress, revealNCATs, tokenOfOwnerByIndex } from 'src/services/blockchain';
import { MetaMaskService } from 'src/services/metamask.service';
import { SessionService } from 'src/services/session.service';
import { WalletConnectService } from 'src/services/walletconnect.service';

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


  // Page toggle
  viewing = "";

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
  sampledata: Metadata[] = [
    { index: 1, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '1/10', }, { trait_type: TraitType.RARITY, value: 'Legendary', }, { trait_type: TraitType.TYPE, value: 'Weapon', }], },
    { index: 2, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '2/5', }, { trait_type: TraitType.RARITY, value: 'Rare', }, { trait_type: TraitType.TYPE, value: 'Gem', }], },
    { index: 3, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '1/80', }, { trait_type: TraitType.RARITY, value: 'Common', }, { trait_type: TraitType.TYPE, value: 'Card', }], },
  ];

  ownedTokenIds: number[] = [];
  nftMetadata: Metadata[] = [];

  constructor(private ngZone: NgZone, private http: ApiHttpService, public session: SessionService) {
  }

  async ngOnInit(): Promise<void> {
    if (this.session.accesstoken) {
      this.getPoundAllowance();
      this.getSwapCost();
      this.getOwnedNFTs();

    }
    this.session.readyEvent.subscribe(() => {
      this.getPoundAllowance();
      this.getSwapCost();
      this.getOwnedNFTs();
    });
  }

  async getPoundAllowance(): Promise<any> {
    if (this.session.currentAccount) {
      if (this.session.provider) {
        const ncat = createNCATContractInstance(this.session.ethersInjectedProvider.getSigner());
        const allowance = await getAllowance(ncat, this.session.currentAccount, nftPoundAddress);
        this.ngZone.run(() => {
          this.poundNCATAllowance = allowance.toBigInt();
        });
      }
    } else {
      setTimeout(async () => { await this.getPoundAllowance() }, 1000);
    }
  }

  async getSwapCost(): Promise<any> {
    if (this.session.currentAccount) {
      if (this.session.provider) {
        const pound = createPoundContractInstance(this.session.ethersInjectedProvider.getSigner());
        const cost = await getSwapCost(pound);
        const ncat = createNCATContractInstance(this.session.ethersInjectedProvider.getSigner());
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
    if (this.session.currentAccount) {
      if (this.session.provider) {
        const nft = createNFTContractInstance(this.session.ethersInjectedProvider.getSigner());
        const balance = await balanceOf(nft, this.session.currentAccount);

        let tokenIds: Array<number> = [];
        _.range(balance).map(async (index) => {
          const tokenId = await tokenOfOwnerByIndex(nft, this.session.currentAccount, index)
          tokenIds.push(tokenId);
        })

        this.ngZone.run(() => {
          this.ownedTokenIds = tokenIds;
        });
      }
    } else {
      setTimeout(async () => { await this.getOwnedNFTs() }, 1000);
    }
  }

  async getNFTMetadata(): Promise<any> {
    if (this.session.currentAccount && this.ownedTokenIds.length > 0) {
      this.nftMetadata = [];
      this.ownedTokenIds.forEach(async (tokenId) => {
        this.http.get(`https://ncat.fun/assets/metadata/${tokenId}.json`).subscribe((res: any) => {
          this.nftMetadata.push(res);
        })
      })
    } else {
      setTimeout(async () => { await this.getNFTMetadata() }, 1000);
    }
  }

  viewPound() {
    this.viewing = Screen.POUND
  }

  viewGallery() {
    this.viewing = Screen.GALLERY
    if (!environment.production && this.ownedTokenIds.length == 0) this.nftMetadata = this.sampledata;
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
      const ncat = createNCATContractInstance(this.session.ethersInjectedProvider.getSigner());
      const txHash = await approveNCAT(ncat, nftPoundAddress);
      this.getPoundAllowance();
      alert(`Approved!\nTransaction hash: ${txHash}`);
    } catch (e: any) {
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
      const pound = createPoundContractInstance(this.session.ethersInjectedProvider.getSigner());
      const txHash = await commitSwapNCAT(pound, this.NFTtoMint);
      alert(`Burned!\nTransaction hash: ${txHash}`);
      this.getPoundAllowance();
    } catch (e: any) {
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
      const pound = createPoundContractInstance(this.session.ethersInjectedProvider.getSigner());
      const txHash = await revealNCATs(pound);
      alert(`Revealed!\nTransaction hash: ${txHash}\nView your NFT in the gallery!`);

      this.ngZone.run(() => {
        this.viewGallery();
      });
    } catch (e: any) {
      alert(e.data ? e.data.message : e.message);
      console.log(e);
    } finally {
      this.ngZone.run(() => {
        this.revealing = false;
      });
    }
  }
}
