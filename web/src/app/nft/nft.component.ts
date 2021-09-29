import { Component, NgZone, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ethers } from 'ethers';
import _ from 'lodash';
import { environment } from 'src/environments/environment.prod';
import { ApiHttpService } from 'src/services/api-http.service';
import { approveNCAT, balanceOf, commitSwapNCAT, createNCATContractInstance, createNFTContractInstance, createPoundContractInstance, getAllowance, getDecimals, getSwapCost, nftPoundAddress, revealNCATs, tokenOfOwnerByIndex } from 'src/services/blockchain';
import { MetaMaskService } from 'src/services/metamask.service';
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

  // Providers
  provider = <unknown>{};
  ethersInjectedProvider = <ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>{};
  isMetamask?: boolean;

  // Page toggle
  viewing = "";

  // Account and chain checks
  currentAccount = "";
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
  sampledata: Metadata[] = [
    { index: 1, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '1/10', }, { trait_type: TraitType.RARITY, value: 'Legendary', }, { trait_type: TraitType.TYPE, value: 'Weapon', }], },
    { index: 2, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '2/5', }, { trait_type: TraitType.RARITY, value: 'Rare', }, { trait_type: TraitType.TYPE, value: 'Gem', }], },
    { index: 3, name: 'DCA from UFO', description: 'Disco Alient Cat, Dollar Cost Average, which is it?', image: 'assets/nft.gif', attributes: [{ trait_type: TraitType.COLLECTION, value: '1/80', }, { trait_type: TraitType.RARITY, value: 'Common', }, { trait_type: TraitType.TYPE, value: 'Card', }], },
  ];

  ownedTokenIds: number[] = [];
  nftMetadata: Metadata[] = [];

  constructor(private ngZone: NgZone, private http: ApiHttpService, public metamask: MetaMaskService, public walletconnect: WalletConnectService) {
  }

  async ngOnInit(): Promise<void> {
    this.metamask.chainEvents.subscribe((event) => {
      if (!this.metamask.provider) {
        console.log('No metamask');
        return;
      }

      console.log('metamask event', event);
      this.ngZone.run(() => {

        if (event == 'start') {
          this.provider = this.metamask.provider;
          this.ethersInjectedProvider = this.metamask.ethersInjectedProvider;
        }

        if (!this.metamask.currentAccount) return;

        this.isCorrectChain = this.metamask.isCorrectChain;
        this.currentAccount = this.metamask.currentAccount;

        if (this.isCorrectChain && this.currentAccount) {
          this.isMetamask = true;
          this.getPoundAllowance();
          this.getSwapCost();
          this.getOwnedNFTs();
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

        if (event == 'start') {
          this.provider = this.walletconnect.provider;
          this.ethersInjectedProvider = this.walletconnect.ethersInjectedProvider;
        }

        if (!this.walletconnect.currentAccount) return;

        this.isCorrectChain = this.walletconnect.isCorrectChain;
        this.currentAccount = this.walletconnect.currentAccount;

        if (this.isCorrectChain && this.currentAccount) {
          this.isMetamask = false;
          this.getPoundAllowance();
          this.getSwapCost();
          this.getOwnedNFTs();
        }
      });
    });
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
      const ncat = createNCATContractInstance(this.ethersInjectedProvider.getSigner());
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
