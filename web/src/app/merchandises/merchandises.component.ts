import { Component, OnInit } from '@angular/core';
import { ApiHttpService } from 'src/services/api-http.service';
import { Merchandise } from 'src/services/models.definitioins';

@Component({
  selector: 'app-merchandises',
  templateUrl: './merchandises.component.html',
  styleUrls: ['./merchandises.component.scss']
})
export class MerchandisesComponent implements OnInit {

  merchandises: Merchandise[] = [];
  start = 0;
  limit = 40;
  loading = false;
  end = false;
  order = 'price:desc';

  constructor(private http: ApiHttpService) { }

  ngOnInit(): void {
  }

  onIntersection({ target, visible }: { target: Element; visible: boolean }): void {
    if (this.end || this.loading) {
      return;
    }
    // load more
    this.loading = true;
    this.http.get(this.http.createUrlWithQueryParameters('merchandises', (qs) => {
      qs.push('_sort', this.order);
      qs.push('_start', this.start);
      qs.push('_limit', this.limit);
    })).subscribe((res: any) => {
      this.merchandises = this.merchandises.concat(res);
      this.start += res.length;
      this.end = (res.length < this.limit);
    }, (e) => {
      //
    }, () => {
      this.loading = false;
    });
  }
}
