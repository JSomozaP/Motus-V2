import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { GameGridComponent } from './components/game/game-grid/game-grid.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', component: GameGridComponent }, // Supprimer temporairement canActivate: [authGuard]
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/login' }
];
