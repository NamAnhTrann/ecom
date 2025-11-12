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
  isDarkMode = false;

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    const html = document.documentElement;
    if (saved === 'dark') {
      html.classList.add('dark');
      this.isDarkMode = true;
    }
  }

toggleSidebar() {
  this.sidebarCollapsed.update(v => !v);
}

toggleMobile() {
  this.mobileSidebarOpen.update(v => !v);
}

  toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    this.isDarkMode = html.classList.contains('dark');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }



}
