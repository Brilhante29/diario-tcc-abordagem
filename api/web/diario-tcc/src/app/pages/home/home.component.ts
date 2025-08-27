import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Entry } from '../../models/entry.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  entry: Entry = {
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
