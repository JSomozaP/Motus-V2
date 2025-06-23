import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Modal {
  id: string;
  title: string;
  content: string;
  message?: string;       
  confirmText?: string;    
  placeholder?: string;    
  initialValue?: string;   
  type: 'info' | 'confirm' | 'error' | 'input' | 'changePseudo'; 
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<Modal | null>(null);
  public modal$ = this.modalSubject.asObservable();
  private resolveFunction: ((value: boolean) => void) | null = null;
  private pseudoResolve: ((value: string | null) => void) | null = null;

  open(modal: Omit<Modal, 'isOpen'>) {
    this.modalSubject.next({ ...modal, isOpen: true });
  }

  confirm(title: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveFunction = resolve;
      this.open({
        id: 'confirm',
        title,
        content,
        message: content,
        confirmText: 'Confirmer',
        type: 'confirm'
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

  close() {
    this.modalSubject.next(null);
  }

  cancel() {    
    this.close();
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    return this.confirm(title, message);
  }

  changePseudo(currentPseudo: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.pseudoResolve = resolve;
      this.open({
        id: 'changePseudo',
        title: 'Changer de pseudo',
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