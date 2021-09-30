import { Component } from '@angular/core';
import { timeStamp } from 'console';
import { SocketioService } from 'src/services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NCAT Token';
  toasts: string[] = [];
  t: any;

  constructor(private socket: SocketioService) {
    this.socket.onMessage.subscribe((r) => {
      if (r.type == 'message') {
        if (this.toasts[this.toasts.length - 1] != r.data) {
          this.toasts.push(r.data);
          if (this.toasts.length == 1) {
            try {
              clearInterval(this.t);
            } catch (e) {
              //
            } finally {
              this.t = setInterval(() => {
                if (this.toasts.length > 0)
                  this.toasts.shift();
              }, 3000);
            }
          }
        }
      }
    });
  }
}