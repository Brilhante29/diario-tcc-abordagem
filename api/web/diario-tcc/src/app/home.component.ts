import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  entry = {
    situacao: '',
    sentimentos: '',
    pensamentos: '',
    fatos: '',
    resolucao: '',
    observacoes: ''
  };

  feedback = signal(false);

  save() {
    // placeholder for API call
    this.feedback.set(true);
    setTimeout(() => this.feedback.set(false), 2200);
    this.entry = {
      situacao: '',
      sentimentos: '',
      pensamentos: '',
      fatos: '',
      resolucao: '',
      observacoes: ''
    };
  }
}
