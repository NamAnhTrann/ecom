import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, Renderer2 } from '@angular/core';
import 'swiper/css/bundle';

@Component({
  selector: 'app-about-us-page',
  imports: [],
  templateUrl: './about-us-page.html',
  styleUrl: './about-us-page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AboutUsPage implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // === Scroll Fade Animation Setup ===
    const elements = document.querySelectorAll('.fade-up');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'animate');
            this.observer.unobserve(entry.target); // stop observing once animated
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => this.observer.observe(el));
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}
