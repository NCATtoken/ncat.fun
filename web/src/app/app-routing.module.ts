import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { MerchandiseComponent } from './merchandise/merchandise.component';
import { MerchandisesComponent } from './merchandises/merchandises.component';
import { WebpageComponent } from './webpage/webpage.component';
import { WebpagesComponent } from './webpages/webpages.component';

const routes: Routes = [
  { path: 'pages', component: WebpagesComponent, },
  { path: 'm/:url/:id', component: MerchandiseComponent, },
  { path: 'merchandise', component: MerchandisesComponent, },
  { path: 'p/:url/:id', component: WebpageComponent, },
  { path: 'cart', component: CartComponent, },
  { path: '**', redirectTo: '/' },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
