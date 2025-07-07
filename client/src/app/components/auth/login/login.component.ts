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

  // Méthode pour le bouton de test (utilise les variables d'environnement en développement)
  useTestAccount() {
    // En production, cette fonctionnalité devrait être désactivée
    if (typeof window !== 'undefined' && (window as any)['isDevelopment']) {
      this.email = 'demo@example.com';
      this.password = 'DemoPassword123!';
    } else {
      console.warn('Test account feature is disabled in production');
    }
  }

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
       
        
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
        
        
        this.router.navigate(['/game']).then(success => {
          if (success) {
            console.log('✅ Redirection réussie !');
          } else {
            console.error('❌ Échec de la redirection !');
          }
        }).catch(error => {
          console.error('❌ Erreur lors de la redirection:', error);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = error.error?.error || 'Erreur de connexion';
        this.isLoading = false;
      }
    });
  }
  //Test comment
  onForgotPassword() {
    console.log('🔧 onForgotPassword appelé');
    
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre email d\'abord';
      return;
    }
    
    this.errorMessage = ''; // Efface les erreurs précédentes
    this.showForgotModal = true;
    
    console.log('🔧 showForgotModal:', this.showForgotModal);
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