import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-[90vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-sn-green text-xs font-bold mb-3">
            <span>🇸🇳 RÉPUBLIQUE DU SÉNÉGAL</span>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Inscription Candidat au Code</h2>
          <p class="text-xs text-slate-500 mt-1">Créez votre dossier et obtenez votre numéro national d'identification</p>
        </div>

        @if (errorMessage) {
          <div class="p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nom et Prénom complets *</label>
              <input type="text" [(ngModel)]="form.name" name="name" required
                     placeholder="Ex: Moussa Diop"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Adresse Email *</label>
              <input type="email" [(ngModel)]="form.email" name="email" required
                     placeholder="moussa.diop@example.sn"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Numéro de Téléphone (Sénégal) *</label>
              <input type="text" [(ngModel)]="form.telephone" name="telephone" required
                     placeholder="77 812 34 56"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Numéro d'Identification National (NIN CNI)</label>
              <input type="text" [(ngModel)]="form.nin" name="nin"
                     placeholder="Ex: 10819980412001"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Date de Naissance</label>
              <input type="date" [(ngModel)]="form.date_naissance" name="date_naissance"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Lieu de Naissance</label>
              <input type="text" [(ngModel)]="form.lieu_naissance" name="lieu_naissance"
                     placeholder="Ex: Dakar / Thiès / Saint-Louis"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Catégorie de Permis Sollicitée *</label>
              <select [(ngModel)]="form.categorie_permis" name="categorie_permis" required
                      class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none bg-white">
                <option value="B">Catégorie B (Véhicule léger / Voiture)</option>
                <option value="A">Catégorie A (Motocyclette)</option>
                <option value="C">Catégorie C (Poids Lourd / Transport)</option>
                <option value="D">Catégorie D (Transport en commun)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Mot de passe *</label>
              <input type="password" [(ngModel)]="form.password" name="password" required
                     placeholder="••••••••"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Adresse de Résidence</label>
            <input type="text" [(ngModel)]="form.adresse" name="adresse"
                   placeholder="Ex: Hann Maristes 2, Villa 45, Dakar"
                   class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sn-green focus:outline-none">
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="loading"
                    class="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-sn-green hover:bg-emerald-700 shadow-lg shadow-sn-green/20 transition disabled:opacity-50">
              {{ loading ? 'Création de votre compte...' : 'Valider mon Inscription' }}
            </button>
          </div>

          <div class="text-center pt-2">
            <span class="text-xs text-slate-600">Déjà inscrit ? </span>
            <a routerLink="/connexion" class="text-xs font-bold text-sn-green hover:underline">Se connecter</a>
          </div>

        </form>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = {
    name: '',
    email: '',
    password: '',
    telephone: '',
    nin: '',
    date_naissance: '',
    lieu_naissance: '',
    adresse: '',
    categorie_permis: 'B',
  };

  loading = false;
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/candidat/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Erreur lors de l\'inscription. Veuillez vérifier les informations saisies.';
      }
    });
  }
}
