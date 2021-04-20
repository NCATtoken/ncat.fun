import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-fold',
  templateUrl: './fold.component.html',
  styleUrls: ['./fold.component.scss']
})
export class FoldComponent implements OnInit {

  environment = environment;
  constructor(public session: SessionService) { }

  ngOnInit(): void {
  }

}
