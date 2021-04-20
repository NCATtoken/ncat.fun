import { Component, OnInit } from '@angular/core';
import { ApiHttpService } from 'src/services/api-http.service';
import { Webpage } from 'src/services/models.definitioins';

@Component({
  selector: 'app-webpages',
  templateUrl: './webpages.component.html',
  styleUrls: ['./webpages.component.scss']
})
export class WebpagesComponent implements OnInit {

  webpages: Webpage[] = [];
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
    this.http.get(this.http.createUrlWithQueryParameters('webpages', (qs) => {
      qs.push('_sort', 'published_at');
      qs.push('_start', this.start);
      qs.push('_limit', this.limit);
      qs.push('show_in_pages', true);
    })).subscribe((res: any) => {
      this.webpages = this.webpages.concat(res);
      this.start += res.length;
      this.end = (res.length < this.limit);
    }, null, () => {
      this.loading = false;
    });
  }

}
