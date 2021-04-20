import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHttpService } from 'src/services/api-http.service';
import { Webpage } from 'src/services/models.definitioins';

@Component({
  selector: 'app-webpage',
  templateUrl: './webpage.component.html',
  styleUrls: ['./webpage.component.scss']
})
export class WebpageComponent implements OnInit {

  webpage?: Webpage;
  notfound = false;

  constructor(private route: ActivatedRoute, private http: ApiHttpService) {
    route.params.subscribe((params) => {
      this.loadPage(params.id);
    })
  }

  ngOnInit(): void {
  }

  loadPage(id: string) {
    this.http.get(this.http.createUrlWithPathVariables('webpages', [id])).subscribe((res: any) => {
      this.webpage = res;
    }, (error) => {
      this.notfound = true;
    });
  }

}
