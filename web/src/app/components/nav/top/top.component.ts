import { Component, OnInit } from '@angular/core';
import { metadata } from 'src/services/metadata';
import { Links } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';
@Component({
  selector: 'app-nav-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  isMenuCollapsed = true;
  links: Links[] = metadata.top_nav;

  constructor(public session: SessionService) { }

  ngOnInit(): void { }

}
