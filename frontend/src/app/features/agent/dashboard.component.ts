import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête Agent -->
      <div class="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <span>Poste de Contrôle & Accueil — PermisSN</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Espace Agent d'Accueil : {{ user()?.name }}
          </h1>
          <p class="text-xs text-slate-300">
            Centre d'Examen de Castors (Dakar) • Émargement et Saisie des Résultats
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/agent/scan" 
             class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-sn-green hover:from-emerald-600 hover:to-sn-green text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Ouvrir le Scanner QR Code</span>
          </a>
        </div>
      </div>

      <!-- Planning des Sessions d'Examen du Jour -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-base font-bold text-slate-900">Sessions Programmées</h2>
            <p class="text-xs text-slate-500">Liste des créneaux et suivi des présences en temps réel</p>
          </div>
          <span class="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Aujourd'hui : {{ today }}
          </span>
        </div>

        <div class="space-y-4">
          @for (session of sessions; track session.id) {
            <div class="p-5 rounded-2xl border border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/20 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-sm text-slate-900">{{ session.salle_nom || 'Salle Cheikh Anta Diop' }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                    Cat. {{ session.categorie_permis }}
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold uppercase"
                        [ngClass]="session.statut === 'ouverte' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
                    {{ session.statut }}
                  </span>
                </div>
                <div class="text-xs text-slate-500 flex items-center gap-4">
                  <span>📅 {{ session.date_session }}</span>
                  <span>⏰ {{ session.heure_debut }} - {{ session.heure_fin }}</span>
                  <span>👥 Capacité : {{ session.capacite_max }} candidats</span>
                </div>
              </div>

              <!-- Jauge de présence -->
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div class="text-xs font-bold text-slate-900">{{ session.places_reservees || 18 }} inscrits</div>
                  <div class="text-[11px] text-emerald-700 font-semibold">{{ session.total_presents || 12 }} émargés</div>
                </div>

                <a [routerLink]="['/agent/emargement', session.id]" 
                   class="px-4 py-2 rounded-xl border border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition">
                  Liste d'Émargement →
                </a>
              </div>

            </div>
          }
        </div>

      </div>

    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  sessions: any[] = [];
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  ngOnInit() {
    this.apiService.getAgentSessions().subscribe(res => {
      this.sessions = res;
    });
  }
}
