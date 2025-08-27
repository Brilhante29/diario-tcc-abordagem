import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Entry } from '../../models/entry.model';
import { EntryService } from '../../services/entry.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    situacao: ['', Validators.required],
    sentimentos: [''],
    pensamentos: [''],
    fatos: [''],
    resolucao: [''],
    observacoes: ['']
  });

  feedback = signal(false);

  constructor(
    private entries: EntryService,
    private toast: ToastService
  ) {}

  save() {
    if (this.form.invalid) {
      return;
    }
    const entry = this.form.value as Entry;
    this.entries.save(entry).subscribe({
      next: () => {
        this.feedback.set(true);
        this.toast.show('Entrada salva');
        this.form.reset();
        setTimeout(() => this.feedback.set(false), 2200);
      },
      error: () => this.toast.show('Falha ao salvar')
    });
  }
}
