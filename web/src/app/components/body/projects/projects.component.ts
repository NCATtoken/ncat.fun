import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiHttpService } from 'src/services/api-http.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {


  environment = environment;
  featureds: any;
  constructor(public session: SessionService, private http: ApiHttpService) { }

  ngOnInit(): void {
    this.http.get(this.http.createUrlWithQueryParameters('projects', (qs) => {
      qs.push('_sort', 'priority:desc')
    }))
      .subscribe((res: any) => {
        this.featureds = res;
      }, (error) => {
        //
      });
  }

  bgurl(item: any) {
    return { backgroundImage: `url(${environment.apiBaseurl}${item.image.url})` };
  }
}
