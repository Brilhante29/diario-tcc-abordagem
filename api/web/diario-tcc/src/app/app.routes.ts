import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { AnalisesComponent } from './pages/analises/analises.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'historico', component: HistoricoComponent, canActivate: [authGuard] },
  { path: 'analises', component: AnalisesComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
