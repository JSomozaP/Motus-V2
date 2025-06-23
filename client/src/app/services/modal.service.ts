import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Modal {
  id: string;
  title: string;
  content: string;
  type?: string;
  confirmText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<Modal | null>(null);
  public modal$ = this.modalSubject.asObservable();
  
  private resolveFunction: ((value: boolean) => void) | null = null;
  private pseudoResolve: ((value: string | null) => void) | null = null;

  open(modal: Modal) {
    this.modalSubject.next(modal);
  }

  close() {
    this.modalSubject.next(null);
    if (this.resolveFunction) {
      this.resolveFunction(false);
      this.resolveFunction = null;
    }
    if (this.pseudoResolve) {
      this.pseudoResolve(null);
      this.pseudoResolve = null;
    }
  }

  // POUR LES CONFIRMATIONS NORMALES
  confirm(title: string, content: string, confirmText: string = 'Confirmer'): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveFunction = resolve;
      this.open({
        id: 'confirm',
        title,
        content,
        type: 'confirm',
        confirmText
      });
    });
  }

  confirmModal(result: boolean) {
    if (this.resolveFunction) {
      this.resolveFunction(result);
      this.resolveFunction = null;
    }
    this.close();
  }

  // POUR LE CHANGEMENT DE PSEUDO
  changePseudo(currentPseudo: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.pseudoResolve = resolve;
      this.open({
        id: 'changePseudo',
        title: '📝 Changer de pseudo',
        content: `Pseudo actuel: ${currentPseudo}`,
        type: 'changePseudo'
      });
    });
  }

  confirmPseudo(newPseudo: string) {
    if (this.pseudoResolve) {
      this.pseudoResolve(newPseudo);
      this.pseudoResolve = null;
    }
    this.close();
  }
}