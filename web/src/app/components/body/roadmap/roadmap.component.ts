import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/services/api-http.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {

  environment = environment;
  roadmaps: any;
  constructor(public session: SessionService, private http: ApiHttpService) { }

  ngOnInit(): void {
    this.http.get(this.http.createUrlWithQueryParameters('roadmaps', (qs) => {
      qs.push('_sort', 'when')
    }))
      .subscribe((res: any) => {
        this.roadmaps = res;
      }, (error) => {
        //
      });
  }

}
