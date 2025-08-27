import { ErrorHandler, Injectable } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private toast: ToastService) {}

  handleError(error: unknown): void {
    this.toast.show('Erro inesperado');
    console.error(error);
  }
}
