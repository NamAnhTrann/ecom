import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatSocket {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3030', {
      withCredentials: true, // this is socket.io setting (not httpOptions)
      transports: ['websocket'],
    });
  }

  userOnline(user_id: string) {
    this.socket.emit('user_online', { user_id });
  }

  userJoinConversation(conversation_id: string) {
    this.socket.emit('join_conversation', { conversation_id });
  }

  sendMessage(msg_data: any) {
    this.socket.emit('send_message', msg_data);
  }

  typing(conversation_id: string, user_id: string) {
    this.socket.emit('typing', { conversation_id, user_id });
  }

  stopTyping(conversation_id: string, user_id: string) {
    this.socket.emit('stop_typing', { conversation_id, user_id });
  }

  onReceiveMessage(callback: Function) {
    this.socket.on('receive_message', (data) => callback(data));
  }

  onTyping(callback: Function) {
    this.socket.on('typing', (data) => callback(data));
  }

  onStopTyping(callback: Function) {
    this.socket.on('stop_typing', (data) => callback(data));
  }

  onStatusUpdate(callback: Function) {
    this.socket.on('user_status_update', (data) => callback(data));
  }

  disconnect() {
    this.socket.disconnect();
  }
}
