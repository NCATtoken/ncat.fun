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
  limit = 25;
  loading = false;
  end = false;


  constructor(private http: ApiHttpService) { }

  ngOnInit(): void {
  }

  onIntersection({ target, visible }: { target: Element; visible: boolean }): void {
    console.log(target, visible);
    if (this.end) {
      return;
    }
    // load more
    this.loading = true;
    this.http.get(this.http.createUrlWithQueryParameters('merchandises', (qs) => {
      qs.push('_sort', 'published_at');
      qs.push('_start', this.start);
      qs.push('_limit', this.limit);
    })).subscribe((res: any) => {
      this.merchandises = this.merchandises.concat(res);
      console.log(res);
      this.start += res.length;
      this.end = (res.length < this.limit);
    }, null, () => {
      this.loading = false;
    });
  }
}
