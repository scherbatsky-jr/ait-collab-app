import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebsocketService {

  private socket = io('ws://' + environment.webSockeURL);
  
  constructor() {
  }

  joinRoom(data: object) {
    this.socket.emit('join', data);
  }

  sendMessage(data: object) {
    this.socket.emit('message', data);
  }

  newMessageReceived() {
    const observable = new Observable<{ userId: String, text: String}>(observer => {
      this.socket.on('new message', (data: any ) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }
}