import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { AnalisesComponent } from './pages/analises/analises.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'analises', component: AnalisesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
