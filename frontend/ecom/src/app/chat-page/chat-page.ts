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
  latestChat: any[] = [];
  conversations: any[] = [];
  selectedReceiver: any = null;

  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
  isDarkMode = false;
  myId: string | null = localStorage.getItem('user_id');

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker!: ElementRef<any>;

ngOnInit() {
  this.route.params.subscribe(params => {
  this.conversation_id = params['conversation_id'];

  if (this.conversations.length > 0) {
    this.updateSelectedReceiver();
  }
});
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    this.isDarkMode = true;
  }

  this.conversation_id = this.route.snapshot.params['conversation_id'];

  this.db.getConversations().subscribe({
    next: (res: any) => {
      this.conversations = res.conversations || [];
      const myId = localStorage.getItem('user_id');

      // No conversations
      if (this.conversations.length === 0) {
        this.latestChat = [];
        return;
      }

      // Build the full "Latest Chats" list
      this.latestChat = this.conversations.map((convo: any) => {
        const receiver = convo.participants.find((p: any) => p._id !== myId);

        return {
          convo_id: convo._id,
          user: receiver,
          last_message: convo.last_message,
        };
      });

      console.log("LATEST CHAT ARRAY:", this.latestChat);

      // Auto redirect to first conversation if none in URL
      if (!this.conversation_id) {
        this.router.navigate(['/chat-page', this.conversations[0]._id]);
        return;
      }

      this.updateSelectedReceiver();


      // Join socket room + load messages
      this.chatSocket.joinConversation(this.conversation_id);
      this.loadMessages();
    },
    error: (err) => console.error(err),
  });

  this.chatSocket.onReceiveMessage((msg: any) => {
    this.messages.push(msg);
  });
}

updateSelectedReceiver() {
  const myId = localStorage.getItem('user_id');

  const convo = this.conversations.find(
    (c: any) => c._id === this.conversation_id
  );

  if (!convo) {
    this.selectedReceiver = null;
    return;
  }

  this.selectedReceiver = convo.participants.find(
    (p: any) => p._id !== myId
  );
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

      const myId = localStorage.getItem('user_id');

      // No conversations
      if (this.conversations.length === 0) {
        this.latestChat = [];
        return;
      }

      // Build a list of chat previews
      this.latestChat = this.conversations.map((convo: any) => {
        const receiver = convo.participants.find((p: any) => p._id !== myId);
        return {
          convo_id: convo._id,
          user: receiver,
          last_message: convo.last_message,
        };
      });

      // Auto-select first convo if not already selected
      if (!this.conversation_id) {
        const firstId = this.conversations[0]._id;
        this.router.navigate(['/chat-page', firstId]);
        return;
      }

      // Join selected conversation
      this.chatSocket.joinConversation(this.conversation_id);
      this.loadMessages();
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
