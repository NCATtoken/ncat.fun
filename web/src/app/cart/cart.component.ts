import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {


  constructor(public session: SessionService) { }

  ngOnInit(): void {
  }

  removeitem(item: any) {
    if (confirm('Are you sure?')) {
      this.session.cart.items.splice(this.session.cart.items.indexOf(item), 1);
      this.session.saveCart();
    }
  }

  checkout() {
    //
    alert('Coming soon!');
  }
}
