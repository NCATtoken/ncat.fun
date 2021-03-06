import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularWebStorageModule } from 'angular-web-storage';
import { InViewportModule } from 'ng-in-viewport';
import { NgxPayPalModule } from 'ngx-paypal';
import { ApiHttpService } from 'src/services/api-http.service';
import { SessionService } from 'src/services/session.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { FeaturesComponent } from './components/body/features/features.component';
import { FoldComponent } from './components/body/fold/fold.component';
import { RoadmapComponent } from './components/body/roadmap/roadmap.component';
import { TokenomicsComponent } from './components/body/tokenomics/tokenomics.component';
import { BottomComponent } from './components/nav/bottom/bottom.component';
import { TopComponent } from './components/nav/top/top.component';
import { StrapiMediaComponent } from './components/strapi-media/strapi-media.component';
import { HomeComponent } from './home/home.component';
import { MerchandiseComponent } from './merchandise/merchandise.component';
import { MerchandisesComponent } from './merchandises/merchandises.component';
import { WebpageComponent } from './webpage/webpage.component';
import { WebpagesComponent } from './webpages/webpages.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { NFTComponent } from './nft/nft.component';
import { MarkdownPipe, NumPipe, ShortAddressPipe } from 'src/services/pipes';
import { MetaMaskService } from 'src/services/metamask.service';


@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    BottomComponent,
    HomeComponent,
    WebpageComponent,
    TokenomicsComponent,
    FeaturesComponent,
    RoadmapComponent,
    FoldComponent,
    StrapiMediaComponent,
    WebpagesComponent,
    MerchandiseComponent,
    MerchandisesComponent,
    NFTComponent,
    CartComponent,
    TrackOrderComponent,
    NumPipe,
    MarkdownPipe,
    ShortAddressPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    InViewportModule,
    FormsModule,
    AngularWebStorageModule,
    NgxPayPalModule,
  ],
  providers: [
    ApiHttpService,
    SessionService,
    MetaMaskService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
