import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/services/session.service';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem, IAddressPortable } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiHttpService } from 'src/services/api-http.service';
import { Cart } from 'src/services/models.definitioins';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  shipping: IAddressPortable = { country_code: 'US' };
  buyer = { name: '', phone: '', email: '' };
  agree = false;
  sending = false;
  environment = environment;

  constructor(public session: SessionService, private router: Router, private http: ApiHttpService) { }

  ngOnInit(): void {
    // this.initConfig();
  }

  removeitem(item: any) {
    if (confirm('Are you sure?')) {
      this.session.cart.items.splice(this.session.cart.items.indexOf(item), 1);
      this.session.saveCart();
    }
  }

  checkout() {
    if (!this.agree) return;

    this.sending = true;

    let payload = Object.assign({ cart: this.session.cart, status: 'new', wallet_address: this.session.cart.wallet_address }, this.buyer, this.shipping);

    this.http.post(this.http.createUrl('orders'), payload)
      .subscribe((res) => {
        this.paypalCheckout(res);
        this.sending = false;
      }, (error) => {
        if (error.error?.data?.errors) {
          try {
            alert(Object.values(error.error?.data?.errors).map((a) => (a as []).join("\n")).join("\n"));
            return;
          } catch (e) {
            //
          }
        }
        this.sending = false;
        alert(error.message);
      });
  }

  paypalCheckout(order: any) {
    console.log(order);

    var items = this.session.cart.items.map((e): ITransactionItem => {
      var vars = e.variations.filter((v) => v).join(", ");
      return {
        name: e.product.title + (vars ? ` (${vars})` : ''),
        quantity: e.quantity.toString(),
        category: 'PHYSICAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: e.product.price!.toFixed(2),
        }
      };
    });

    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.session.cart.total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.session.cart.subtotal.toFixed(2),
                },
                shipping: {
                  currency_code: 'USD',
                  value: this.session.cart.shipping.toFixed(2),
                },
                tax_total: {
                  currency_code: 'USD',
                  value: this.session.cart.tax.toFixed(2),
                },
                discount: {
                  currency_code: 'USD',
                  value: this.session.cart.discount.toFixed(2),
                },
              },
            },
            items: items,
            shipping: {
              address: this.shipping
            }
          },
        ],
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },

      onClientAuthorization: async (data) => {
        let payload = { refno: data.id, paypal: data, status: 'paid' };

        this.http.put(this.http.createUrlWithPathVariables('orders', [order.id]), payload).subscribe((res) => {
          this.session.cart = new Cart;
          this.session.saveCart();
          this.router.navigate(['/track', data.id]);
        }, (error) => {
          alert(error.message);
        }, () => {
          delete this.payPalConfig;
        });
      },
      onCancel: (data, actions) => {
        delete this.payPalConfig;
      },
      onError: err => {
        delete this.payPalConfig;
      },
    };
  }

}
