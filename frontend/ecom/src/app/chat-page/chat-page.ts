import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatSocket } from '../services/chat-socket';
import { DbService } from '../services/db-service';
import { WhatsappDatePipe } from '../whatsapp-date-pipe';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, WhatsappDatePipe],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatPage {
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

  constructor(
    private chatSocket: ChatSocket,
    private db: DbService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkMode = true;
    }

    // Listen for route changes first
    this.route.params.subscribe(params => {
      this.conversation_id = params['conversation_id'];

      if (this.conversations.length > 0) {
        this.updateSelectedReceiver();
        this.chatSocket.joinConversation(this.conversation_id);
        this.loadMessages();
      }
    });

    // Load conversations initially
    this.db.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res.conversations || [];

        if (this.conversations.length === 0) {
          this.latestChat = [];
          return;
        }

        this.buildLatestChatList();

        // If no convo selected in URL, open first
        if (!this.conversation_id) {
          const firstId = this.conversations[0]._id;
          this.router.navigate(['/chat-page', firstId]);
          return;
        }

        // Select receiver and load messages
        this.updateSelectedReceiver();
        this.chatSocket.joinConversation(this.conversation_id);
        this.loadMessages();
      },
      error: (err) => console.error(err),
    });

    // Receive new message
    this.chatSocket.onReceiveMessage((msg: any) => {
      this.messages.push(msg);
      this.reloadConversationsLatest();
    });
  }

  /*
   * Build list of latest chats similar to Instagram/Messenger
   */
  private buildLatestChatList() {
    const myId = localStorage.getItem('user_id');

    this.latestChat = this.conversations.map((convo: any) => {
      const receiver = convo.participants.find((p: any) => p._id !== myId);
      return {
        convo_id: convo._id,
        user: receiver,
        last_message: convo.last_message,
        last_updatedAt: convo.last_updatedAt 
      };
    });
  }

  /*
   * Reload conversations when messages update
   */
  private reloadConversationsLatest() {
    this.db.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res.conversations || [];
        this.buildLatestChatList();
      },
      error: (err) => console.error(err),
    });
  }

  /*
   * Update who the receiver is for the current conversation
   */
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

  /*
   * When user clicks another chat from sidebar
   */
  openConversation(conversationId: string) {
    this.router.navigate(['/chat-page', conversationId]);
  }

  /*
   * Load chat messages for selected conversation
   */
  loadMessages() {
    this.db.getMessages(this.conversation_id).subscribe({
      next: (res: any) => {
        this.messages = res.messages;

        const myId = localStorage.getItem('user_id');
        const participants = res.conversation?.participants || [];

        this.receiver_id = participants.find((p: any) => p !== myId) || '';
      },
      error: (err) => console.error(err),
    });
  }

  send() {
    if (!this.messageContent.trim()) return;

    const sender = localStorage.getItem('user_id');
    const receiver = this.receiver_id;

    if (!sender || !receiver) return;

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
  this.sidebarCollapsed.update(v => !v);
}
  toggleMobile() {
    this.mobileSidebarOpen.update(v =>!v)
  }

  toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    this.isDarkMode = html.classList.contains('dark');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
