import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiHttpService } from 'src/services/api-http.service';
import { Merchandise } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-merchandise',
  templateUrl: './merchandise.component.html',
  styleUrls: ['./merchandise.component.scss'],
  providers: [NgbCarouselConfig],
})
export class MerchandiseComponent implements OnInit {

  merchandise!: Merchandise;
  notfound = false;
  quantity = 1;
  variations1 = '';
  variations2 = '';
  variations3 = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: ApiHttpService, public session: SessionService, config: NgbCarouselConfig) {
    route.params.subscribe((params) => {
      this.loadPage(params.id);
    })

    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {

  }

  loadPage(id: string) {
    this.http.get(this.http.createUrlWithPathVariables('merchandises', [id])).subscribe((res: any) => {
      this.merchandise = res;
    }, (error) => {
      this.notfound = true;
    });
  }

  addCart() {
    this.session.cart.items.push({
      product: this.merchandise, variations: [this.variations1, this.variations2, this.variations3], quantity: this.quantity, amount: this.quantity * (this.merchandise?.price || 0)
    });
    this.session.saveCart();
    this.router.navigate(['/cart'], { fragment: 'cart' });
  }
}
