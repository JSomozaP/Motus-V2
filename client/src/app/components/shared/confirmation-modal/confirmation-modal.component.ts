import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirmation';
  @Input() message = '';
  @Input() confirmText = 'Confirmer';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }

  onOverlayClick(event: MouseEvent) {
    // Empêcher la fermeture accidentelle en cliquant sur l'overlay
    console.log('🔧 Overlay clicked');
    // NE PAS fermer automatiquement - COMMENTER cette ligne :
    // if (event.target === event.currentTarget) {
    //   this.onCancel();
    // }
  }
}
