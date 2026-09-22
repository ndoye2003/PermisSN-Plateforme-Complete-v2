import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="no-print sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
      <!-- Barre tricolore Sénégal -->
      <div class="flag-banner"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Marque Officielle -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sn-green to-emerald-800 flex items-center justify-center text-white font-bold shadow-md shadow-sn-green/20 group-hover:scale-105 transition-transform">
              <span class="text-sn-yellow font-extrabold text-lg">★</span>
            </div>
            <div>
              <span class="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                PERMIS<span class="text-sn-green">SN</span>
              </span>
              <span class="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                Centre National d'Examen des Castors (Dakar)
              </span>
            </div>
          </a>

          <!-- Liens de navigation selon le rôle réel -->
          <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-sn-green bg-emerald-50" [routerLinkActiveOptions]="{exact: true}"
               class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
              Accueil
            </a>
            
            <a routerLink="/entrainement" routerLinkActive="text-sn-green bg-emerald-50"
               class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <span>Test Code (Audio Wolof)</span>
              <span class="text-[10px] px-1.5 py-0.5 font-bold rounded-full bg-amber-100 text-amber-900">Audio 🔊</span>
            </a>

            <!-- Navigation Candidat -->
            @if (user()?.role === 'candidat') {
              <a routerLink="/candidat/dashboard" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
                Mon Espace Candidat
              </a>
              <a routerLink="/candidat/reservation" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
                Prendre Rendez-vous (Castors)
              </a>
            }

            <!-- Navigation Agent Castors -->
            @if (user()?.role === 'agent') {
              <a routerLink="/agent/dashboard" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
                Planning des Séances (Castors)
              </a>
              <a routerLink="/agent/scan" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors flex items-center gap-1">
                <span>Scanner QR Code</span>
              </a>
            }

            <!-- Navigation Administrateur -->
            @if (user()?.role === 'admin') {
              <a routerLink="/admin/dashboard" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
                Tableau de Bord National
              </a>
              <a routerLink="/admin/candidats" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors">
                Dossiers Candidats
              </a>
              <a routerLink="/admin/smart-scheduling" routerLinkActive="text-sn-green bg-emerald-50"
                 class="px-3 py-2 rounded-lg text-slate-700 hover:text-sn-green hover:bg-slate-50 transition-colors flex items-center gap-1">
                <span>Régulation Flux Castors</span>
                <span class="text-[10px] px-1.5 py-0.5 font-bold rounded-full bg-indigo-100 text-indigo-700">Algo</span>
              </a>
            }
          </nav>

          <!-- Zone Profil Utilisateur / Connexion -->
          <div class="flex items-center gap-3">
            @if (user()) {
              <div class="flex items-center gap-2">
                <div class="text-right hidden sm:block">
                  <div class="text-xs font-bold text-slate-900 leading-none">{{ user()?.name }}</div>
                  <div class="text-[10px] font-extrabold uppercase tracking-wider mt-0.5"
                       [ngClass]="{
                         'text-emerald-700': user()?.role === 'candidat',
                         'text-blue-700': user()?.role === 'agent',
                         'text-purple-700': user()?.role === 'admin'
                       }">
                    {{ user()?.role === 'admin' ? 'Administrateur National' : (user()?.role === 'agent' ? 'Agent Castors' : 'Candidat') }}
                  </div>
                </div>

                <button (click)="logout()" 
                        title="Se déconnecter"
                        class="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            } @else {
              <div class="flex items-center gap-2">
                <a routerLink="/connexion" 
                   class="px-4 py-2 text-xs font-bold text-slate-700 hover:text-sn-green transition">
                  Connexion
                </a>
                <a routerLink="/inscription" 
                   class="px-4 py-2 text-xs font-bold text-white bg-sn-green hover:bg-sn-green-700 rounded-xl shadow-sm shadow-sn-green/20 transition">
                  Créer un compte
                </a>
              </div>
            }
          </div>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }
}
