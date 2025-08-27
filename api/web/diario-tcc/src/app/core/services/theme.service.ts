import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = signal(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.dark.set(localStorage.getItem('tcc.theme') === 'dark');
      this.apply();
    }
  }

  isDark() {
    return this.dark();
  }

  toggle() {
    this.dark.update(v => !v);
    this.apply();
  }

  private apply() {
    if (!this.isBrowser) {
      return;
    }
    document.documentElement.setAttribute('data-theme', this.dark() ? 'dark' : 'light');
    localStorage.setItem('tcc.theme', this.dark() ? 'dark' : 'light');
  }
}
