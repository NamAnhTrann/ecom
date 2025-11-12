import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  signal,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatPage {

  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
  isDarkMode = false;

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker!: ElementRef<any>;

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    const html = document.documentElement;
    if (saved === 'dark') {
      html.classList.add('dark');
      this.isDarkMode = true;
    }
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
