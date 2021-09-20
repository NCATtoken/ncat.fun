import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Input() config: any;
  @Output() event = new EventEmitter<string>();

  d = '00'; h = '00'; m = '00'; s = '00';

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    this.updatetime();
  }

  d2(v: number) {
    return `00${v}`.substr(-2);
  }

  updatetime() {
    let diff = Math.floor((this.config.stopTime - Date.now()) / 1000);


    if (diff < 0) {
      diff = 0;
    }

    this.ngZone.run(() => {
      this.d = this.d2(Math.floor(diff / (60 * 60 * 24)));
      this.h = this.d2(Math.floor(diff / (60 * 60)) % 24);
      this.m = this.d2(Math.floor(diff / 60) % 60);
      this.s = this.d2(diff % 60);
    });

    if (diff <= 0) {
      this.event.emit('ended');
      return;
    }

    setTimeout(() => {
      this.updatetime();
    }, 1000);
  }

}
