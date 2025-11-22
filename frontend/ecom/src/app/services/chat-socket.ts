import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatSocket {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3030', {
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  userOnline(user_id: string) {
    this.socket.emit('user_online', { user_id });
  }

  joinConversation(conversation_id: string) {
    this.socket.emit('join_conversation', conversation_id);
  }

  sendMessage(msg: any) {
    this.socket.emit('send_message', msg);
  }

  emitTyping(data: any) {
    this.socket.emit('typing', data);
  }

  stopTyping(data: any) {
    this.socket.emit('stop_typing', data);
  }

  onReceiveMessage(callback: Function) {
    this.socket.on('receive_message', (msg) => callback(msg));
  }

  onTyping(callback: Function) {
    this.socket.on('typing', (data) => callback(data));
  }

  onStatusUpdate(callback: Function) {
    this.socket.on('user_status_update', (data) => callback(data));
  }
}
