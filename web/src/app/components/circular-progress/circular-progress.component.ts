import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Context } from 'vm';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent implements AfterViewInit {

  @Input() size = 100;
  @Input() progress = 90;
  @Input() lineWidth = 10;
  @ViewChild('Canvas') canvas!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    let ctx: Context = this.canvas.nativeElement.getContext("2d")!;

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    this.canvas.nativeElement.style.width = this.size + "px";
    this.canvas.nativeElement.style.height = this.size + "px";
    this.canvas.nativeElement.width = Math.floor(this.size * scale);
    this.canvas.nativeElement.height = Math.floor(this.size * scale);
    ctx.scale(scale, scale);

    ctx.lineCap = 'round';

    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(this.size / 2, this.size / 2, this.size / 2 - this.lineWidth - 1, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#1e61a4';
    ctx.lineWidth = this.lineWidth * 0.75;
    ctx.beginPath();
    ctx.arc(this.size / 2, this.size / 2, this.size / 2 - this.lineWidth - 1, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#e07891';
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.arc(this.size / 2, this.size / 2, this.size / 2 - this.lineWidth - 1, -0.5 * Math.PI, (2 * (this.progress / 100) - 0.5) * Math.PI);
    ctx.stroke();

  }

}
