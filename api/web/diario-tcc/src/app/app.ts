import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  drawerOpen = signal(false);
  isDark = signal(false);
  toast = signal('');

  ngOnInit() {
    const saved = localStorage.getItem('tcc.theme') === 'dark';
    this.isDark.set(saved);
    this.updateTheme();
  }

  openDrawer() { this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }

  toggleTheme() {
    this.isDark.update(v => !v);
    this.updateTheme();
  }

  private updateTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
    localStorage.setItem('tcc.theme', this.isDark() ? 'dark' : 'light');
  }

  showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(''), 2000);
  }
}
