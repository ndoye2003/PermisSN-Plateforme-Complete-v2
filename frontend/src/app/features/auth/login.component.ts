import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        <!-- En-tête Institutionnel -->
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sn-green to-emerald-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-sn-green/30 mb-3">
            <span class="text-sn-yellow font-extrabold text-xl">★</span>
          </div>
          <span class="text-[10px] font-extrabold tracking-widest text-sn-green uppercase">RÉPUBLIQUE DU SÉNÉGAL</span>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-1">Connexion Sécurisée</h2>
          <p class="text-xs text-slate-500 mt-1">Portail d'Accès aux Examens du Permis — Centre des Castors</p>
        </div>

        <!-- Message d'erreur -->
        @if (errorMessage) {
          <div class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        }

        <!-- Formulaire de Connexion -->
        <form class="space-y-4" (ngSubmit)="onSubmit()">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Identifiant (Identifiant ou adresse email)</label>
            <input type="text" [(ngModel)]="identifiant" name="identifiant" required
                   placeholder="ADM-CAST-001 ou votre.email@permis.sn"
                   class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sn-green focus:outline-none transition">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   placeholder="••••••••••••"
                   class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sn-green focus:outline-none transition">
          </div>

          <button type="submit" [disabled]="loading"
                  class="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-sn-green hover:bg-emerald-700 shadow-md shadow-sn-green/20 transition disabled:opacity-50 flex items-center justify-center gap-2">
            @if (loading) {
              <span>Connexion en cours...</span>
            } @else {
              <span>Se Connecter au Système →</span>
            }
          </button>
        </form>

        <div class="text-center pt-2">
          <p class="text-xs text-slate-500">
            Nouveau candidat ?
            <a routerLink="/inscription" class="font-bold text-sn-green hover:underline">Créer un nouveau compte</a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  identifiant = '';
  password = '';
  loading = false;
  errorMessage = '';


  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ identifiant: this.identifiant, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'admin') this.router.navigate(['/admin/dashboard']);
        else if (res.user.role === 'agent') this.router.navigate(['/agent/dashboard']);
        else this.router.navigate(['/candidat/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Identifiant ou mot de passe incorrect.';
      }
    });
  }
}
