import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/services/api-http.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  environment = environment;
  features: any;
  constructor(public session: SessionService, private http: ApiHttpService) { }

  ngOnInit(): void {
    this.http.get(this.http.createUrlWithQueryParameters('features', (qs) => {
      qs.push('_sort', 'sequence')
    }))
      .subscribe((res: any) => {
        this.features = res;
      }, (error) => {
        //
      });
  }

}
