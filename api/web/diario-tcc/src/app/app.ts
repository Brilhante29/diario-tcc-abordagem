import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = signal('TransporteX');

  readonly features: Feature[] = [
    {
      icon: '🛰️',
      title: 'Rastreamento',
      description: 'Acompanhe sua viagem em tempo real.'
    },
    {
      icon: '⚡',
      title: 'Alta Velocidade',
      description: 'Chegue ao destino com rapidez e eficiência.'
    },
    {
      icon: '🔒',
      title: 'Segurança',
      description: 'Tecnologia de ponta para sua proteção.'
    }
  ];
}
