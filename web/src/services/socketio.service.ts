import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export interface SocketMessage { type: string, data: any };

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  private socket: Socket = io(environment.socketEndpoint);

  onMessage = new EventEmitter<SocketMessage>();
  // onChat = new EventEmitter<Chat>();

  constructor() {
    this.connect();
  }

  public send(data: SocketMessage) {
    this.socket.emit('message', JSON.stringify(data));
  }

  private connect() {
    // this.socket = io(environment.socketEndpoint);

    this.socket.on('message', (data: any) => {
      this.onMessage.next({ type: 'message', data });
    });

    this.socket.on('proposal', (data: any) => {
      this.onMessage.next({ type: 'proposal', data });
    });

    // this.socket.on('player', (data: any) => {
    //   this.onMessage.next({ type: 'player', data });
    // });

    // this.socket.on('mapobject', (data: any) => {
    //   this.onMessage.next({ type: 'mapobject', data });
    // });

    // this.socket.on('map', (data: any) => {
    //   this.onMessage.next({ type: 'map', data });
    // });

    // this.socket.on('chat', (data: any) => {
    //   this.onMessage.next({ type: 'chat', data });
    //   this.onChat.next(data);
    // });

    // this.socket.on('hello', (data: any) => {
    // });

    // this.socket.on('update', (data: any) => {
    //   alert(`There\'s an update to the game (${data}). Page will refresh now.`);
    //   window.location.reload();
    // });
  }

}
