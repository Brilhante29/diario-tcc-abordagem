import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HistoricoComponent } from './historico.component';
import { AnalisesComponent } from './analises.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'analises', component: AnalisesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
