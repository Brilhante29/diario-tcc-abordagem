import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, NgIf],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  drawerOpen = signal(false);

  constructor(
    public theme: ThemeService,
    private toast: ToastService,
    public auth: AuthService,
    private router: Router
  ) {}

  openDrawer() { this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }

  showSoon() {
    this.toast.show('Em breve ✨');
    this.closeDrawer();
  }

  logout() {
    this.auth.logout();
    this.closeDrawer();
    this.router.navigate(['/login']);
  }
}
