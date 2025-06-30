import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      
      const formData = this.registerForm.value;
      
     
      this.authService.register(
        formData.pseudo,   // pseudo choisi par l'utilisateur
        formData.email,    // email
        formData.password  // password
      ).subscribe({
        next: (response: any) => {
          console.log("✅ Inscription réussie", response);
          this.successMessage = "Inscription réussie ! Vérifiez votre email pour activer votre compte.";
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000);
        },
        error: (error: any) => {
          console.error("❌ Erreur inscription", error);
          
          // GESTION SPÉCIFIQUE DU PSEUDO DÉJÀ EXISTANT
          if (error.error?.error?.includes('pseudo') || error.error?.error?.includes('Duplicate')) {
            this.errorMessage = "Ce pseudo est déjà utilisé, veuillez en choisir un autre.";
          } else if (error.error?.error?.includes('email')) {
            this.errorMessage = "Cet email est déjà utilisé.";
          } else {
            this.errorMessage = error.error?.error || "Erreur lors de l'inscription";
          }
          
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  get pseudo() { return this.registerForm.get('pseudo'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}