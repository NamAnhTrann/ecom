import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  signal,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatSocket } from '../services/chat-socket';
import { DbService } from '../services/db-service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatPage {
  constructor(
    private chatSocket: ChatSocket,
    private db: DbService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  conversation_id = '';
  messages: any[] = [];
  messageContent = '';
  receiver_id = '';
  latestChat: any = null;
  conversations: any[] = [];
  selectedReceiver: any = null;

  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
  isDarkMode = false;
  myId: string | null = localStorage.getItem('user_id');

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker!: ElementRef<any>;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkMode = true;
    }

    // read param
    this.conversation_id = this.route.snapshot.params['conversation_id'];

    // load conversations first
    this.db.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res.conversations || [];

        if (this.conversations.length === 0) {
          this.latestChat = null;
          return;
        }

        const myId = localStorage.getItem('user_id');
        const convo = this.conversations[0];

        const receiver = convo.participants.find((p: any) => p._id !== myId);
        this.latestChat = receiver;
        this.selectedReceiver = receiver;

        // if URL has no conversation id, auto open the latest one
        if (!this.conversation_id) {
          const firstId = convo._id;
          this.router.navigate(['/chat-page', firstId]);
          return;
        }

        // if conversation selected already
        this.chatSocket.joinConversation(this.conversation_id);
        this.loadMessages();
      },
      error: (err) => console.error(err),
    });

    this.chatSocket.onReceiveMessage((msg: any) => {
      this.messages.push(msg);
    });
  }

  openConversation(conversationId: string) {
    const convo = this.conversations.find((c) => c._id === conversationId);

    if (convo) {
      const myId = localStorage.getItem('user_id');
      this.selectedReceiver = convo.participants.find(
        (p: any) => p._id !== myId
      );
    }

    // Correct Angular navigation
    this.router.navigate(['/chat-page', conversationId]);
  }

  loadMessages() {
    this.db.getMessages(this.conversation_id).subscribe({
      next: (res: any) => {
        // messages
        this.messages = res.messages;

        // DEBUG LOGS
        console.log('DEBUG FULL RESPONSE:', res);

        const myId = localStorage.getItem('user_id');
        console.log('DEBUG myId:', myId);

        const participants = res.conversation?.participants || [];
        console.log('DEBUG participants (raw):', participants);

        // FIX: participants is an array of strings, not objects
        for (const p of participants) {
          console.log('DEBUG participant value:', p);
        }

        // FIND receiver
        if (myId) {
          this.receiver_id = participants.find((p: any) => p !== myId) || '';
        }

        console.log('DEBUG receiver_id:', this.receiver_id);

        if (!this.receiver_id) {
          console.error('NO receiver_id detected');
        }
      },
    });
  }

  loadLatestChat() {
    this.db.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res.conversations || [];

        if (this.conversations.length === 0) {
          this.latestChat = null;
          return;
        }

        const myId = localStorage.getItem('user_id');

        // conversations already sorted by last_updatedAt DESC in backend
        const convo = this.conversations[0];

        // receiver is anyone who is NOT me
        const receiver = convo.participants.find((p: any) => p._id !== myId);

        this.latestChat = receiver;
        this.selectedReceiver = receiver;
        console.log('LATEST CHAT:', this.latestChat);
      },
      error: (err) => console.error(err),
    });
  }

  send() {
    if (!this.messageContent.trim()) return;

    const sender = localStorage.getItem('user_id');
    const receiver = this.receiver_id;

    if (!sender) {
      console.error('NO sender_id found in localStorage');
      return;
    }

    if (!receiver) {
      console.error('NO receiver_id detected');
      return;
    }

    const msg = {
      sender_id: sender,
      receiver_id: receiver,
      messages_content: this.messageContent,
      conversation_id: this.conversation_id,
      message_type: 'text',
    };

    this.chatSocket.sendMessage(msg);
    this.messageContent = '';
  }

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleMobile() {
    this.mobileSidebarOpen.update((v) => !v);
  }

  toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    this.isDarkMode = html.classList.contains('dark');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
