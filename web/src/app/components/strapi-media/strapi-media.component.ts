import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'strapi-media',
  templateUrl: './strapi-media.component.html',
  styleUrls: ['./strapi-media.component.scss']
})
export class StrapiMediaComponent implements OnInit {

  environment = environment;
  @Input() media: any;
  @Input() class?: string;
  @Input() style?: string;

  constructor() { }

  ngOnInit(): void {
  }

  getUrl(): string {
    return environment.apiBaseurl + this.media.url;
  }

  isImage(): boolean {
    return (this.media.mime.startsWith('image/'));
  }

}
