import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';

interface Modal {
  id: string;
  title: string;
  content: string;
  type?: string;
  confirmText?: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModalComponent implements OnInit {
  currentModal: Modal | null = null;
  newPseudo: string = '';

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modal$.subscribe((modal: any) => {
      this.currentModal = modal;
      if (modal?.type === 'changePseudo') {
        this.newPseudo = '';
      }
    });
  }

  confirmModal(result: boolean) {
    this.modalService.confirmModal(result);
  }

  confirmPseudo() {
    if (this.newPseudo?.trim()) {
      this.modalService.confirmPseudo(this.newPseudo.trim());
    }
  }

  close() {
    this.modalService.close();
  }
}