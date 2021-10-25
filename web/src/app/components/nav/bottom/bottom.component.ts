import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public session: SessionService, private router: Router) {
    this.year = (new Date()).getFullYear();
  }

  ngOnInit(): void { }

  open(link: Links) {
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
