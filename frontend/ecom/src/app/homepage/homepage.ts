import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import 'swiper/css/bundle';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Homepage implements OnInit, AfterViewInit, OnDestroy {
  activeTab = 1;
  private intervalId: any;
  private autoSlide = false;
  private slideInterval = 6000;
  private observer?: IntersectionObserver;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (this.autoSlide) {
      this.intervalId = setInterval(() => {
        this.nextTab();
      }, this.slideInterval);
    }
  }

  ngAfterViewInit() {
    // Tabs auto-slide
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`tabs-with-card-item-${i}`);
      if (btn) {
        btn.addEventListener('click', () => this.setTab(i));
      }
    }
    this.updateActiveTab();

    // === Scroll Fade Animation Setup ===
    const elements = document.querySelectorAll('.fade-up');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'animate');
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => {
      this.renderer.setStyle(el, 'opacity', '0');
      this.renderer.setStyle(el, 'transform', 'translateY(40px)');
      this.observer!.observe(el);
    });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer) this.observer.disconnect();
  }

  private nextTab() {
    this.activeTab = this.activeTab < 3 ? this.activeTab + 1 : 1;
    this.updateActiveTab();
  }

  private setTab(tab: number) {
    this.activeTab = tab;
    this.updateActiveTab();

    if (this.autoSlide && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.nextTab();
      }, this.slideInterval);
    }
  }

  private updateActiveTab() {
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`tabs-with-card-item-${i}`);
      const panel = document.getElementById(`tabs-with-card-${i}`);
      if (btn && panel) {
        this.renderer.removeClass(btn, 'active');
        this.renderer.addClass(panel, 'hidden');
      }
    }

    const activeBtn = document.getElementById(`tabs-with-card-item-${this.activeTab}`);
    const activePanel = document.getElementById(`tabs-with-card-${this.activeTab}`);

    if (activeBtn && activePanel) {
      this.renderer.addClass(activeBtn, 'active');
      this.renderer.removeClass(activePanel, 'hidden');

      this.renderer.addClass(activePanel, 'opacity-0');
      setTimeout(() => {
        this.renderer.removeClass(activePanel, 'opacity-0');
        this.renderer.addClass(activePanel, 'transition-opacity');
        this.renderer.addClass(activePanel, 'duration-700');
      }, 20);
    }
  }
}
