import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHttpService } from 'src/services/api-http.service';
import { Merchandise } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-merchandise',
  templateUrl: './merchandise.component.html',
  styleUrls: ['./merchandise.component.scss']
})
export class MerchandiseComponent implements OnInit {

  merchandise!: Merchandise;
  notfound = false;
  quantity = 1;

  constructor(private route: ActivatedRoute, private router: Router, private http: ApiHttpService, public session: SessionService) {
    route.params.subscribe((params) => {
      this.loadPage(params.id);
    })
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
    this.session.cart.items.push({ product: this.merchandise, quantity: this.quantity, amount: this.quantity * (this.merchandise?.price || 0) });
    this.session.saveCart();
    this.router.navigate(['/cart'], { fragment: 'cart' });
  }
}
