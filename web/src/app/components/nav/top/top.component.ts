import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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

  constructor(public session: SessionService, private router: Router) { }

  ngOnInit(): void { }

  open(link: Links) {
    this.isMenuCollapsed = true;
    if (link.url) {
      if (link.url.startsWith('/')) { this.router.navigateByUrl(link.url); }
      else {
        window.open(link.url, '_blank');
      }
    }
    else if (link.fragment) {
      this.router.navigateByUrl('/' + link.fragment);
    }
    return false;
  }

}
