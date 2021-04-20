import { Component, OnInit } from '@angular/core';
import { metadata } from 'src/services/metadata';
import { Links } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';


@Component({
  selector: 'app-nav-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss']
})

export class BottomComponent implements OnInit {

  links: Links[] = metadata.bottom_nav;
  year: number;

  constructor(public session: SessionService) {
    this.year = (new Date()).getFullYear();
  }

  ngOnInit(): void { }

}
