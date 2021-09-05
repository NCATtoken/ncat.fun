import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { DAOComponent } from './dao/dao.component';
import { ProposalComponent } from './dao/proposal/proposal.component';
import { ProposeComponent } from './dao/propose/propose.component';
import { HomeComponent } from './home/home.component';
import { MerchandiseComponent } from './merchandise/merchandise.component';
import { MerchandisesComponent } from './merchandises/merchandises.component';
import { NFTComponent } from './nft/nft.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { WebpageComponent } from './webpage/webpage.component';
import { WebpagesComponent } from './webpages/webpages.component';

const routes: Routes = [
  { path: 'pages', component: WebpagesComponent, },
  { path: 'm/:url/:id', component: MerchandiseComponent, },
  { path: 'merchandise', component: MerchandisesComponent, },
  { path: 'nft', component: NFTComponent, },
  { path: 'dao', component: DAOComponent },
  { path: 'p/:url/:id', component: WebpageComponent, },
  { path: 'cart', component: CartComponent, },
  { path: 'track/:id', component: TrackOrderComponent, },
  { path: '**', redirectTo: '/' },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { anchorScrolling: "enabled", scrollPositionRestoration: "top" }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
