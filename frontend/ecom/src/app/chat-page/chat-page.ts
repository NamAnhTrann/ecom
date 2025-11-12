import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css'
})
export class ChatPage {
sidebarCollapsed = signal(false);
mobileSidebarOpen = signal(false);

toggleSidebar() {
  this.sidebarCollapsed.update(v => !v);
}

toggleMobile() {
  this.mobileSidebarOpen.update(v => !v);
}



}
