import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  
  // Variables pour la modal
  showForgotModal = false;
  isResetLoading = false;
  resetMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ✅ Méthode pour le bouton de test
  useTestAccount() {
    this.email = 'jeremy@test.com';
    this.password = 'motus123';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        this.router.navigate(['/game']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = error.error?.message || 'Erreur de connexion';
        this.isLoading = false;
      }
    });
  }

  onForgotPassword() {
    console.log('🔧 onForgotPassword appelé'); // Debug
    
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre email d\'abord';
      return;
    }
    
    this.errorMessage = ''; // Effacer les erreurs précédentes
    this.showForgotModal = true;
    
    console.log('🔧 showForgotModal:', this.showForgotModal); // Debug
  }

  onConfirmReset() {
    console.log('🔧 onConfirmReset appelé');
    this.showForgotModal = false;
    this.isResetLoading = true;
    
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('✅ Email envoyé:', response);
        this.resetMessage = 'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.';
        this.isResetLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur envoi:', error);
        this.errorMessage = 'Erreur: ' + (error.error?.error || 'Échec envoi email');
        this.isResetLoading = false;
      }
    });
  }

  onCancelReset() {
    console.log('🔧 onCancelReset appelé');
    this.showForgotModal = false;
  }
}