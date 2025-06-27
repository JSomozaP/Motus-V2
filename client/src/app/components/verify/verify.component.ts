import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VerifyComponent implements OnInit {
  token = '';
  isLoading = true;
  success = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    console.log('🔍 Démarrage de la vérification email');
    this.verifyAccount();
  }

  verifyAccount() {
    this.http.get(`http://localhost:3000/api/auth/verify/${this.token}`).subscribe({
      next: (response: any) => {
        console.log('✅ Email vérifié avec succès');
        this.success = true;
        this.isLoading = false;
        
        // Redirection automatique après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la vérification');
        this.error = error.error?.error || 'Token invalide ou expiré';
        this.isLoading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}