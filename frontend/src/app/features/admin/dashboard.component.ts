import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête Administrateur -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <span>Direction des Transports Routiers • Superviseur National PermisSN</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Tableau de Bord National des Examens
          </h1>
          <p class="text-xs text-slate-300">
            Supervision stratégique des centres d'examen du Code de la route au Sénégal
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/admin/utilisateurs" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10">Gérer les comptes</a>
          <a routerLink="/admin/smart-scheduling" 
             class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition flex items-center gap-2">
            <span>Assistant Smart Scheduling</span>
            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Optimiseur</span>
          </a>
        </div>
      </div>

      <!-- Grille de KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>TOTAL CANDIDATS</span>
            <span class="text-indigo-600">👥</span>
          </div>
          <div class="text-3xl font-black text-slate-900">{{ stats?.kpis?.total_candidats ?? 0 }}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1">
            +{{ stats?.kpis?.candidats_valides ?? 0 }} dossiers validés
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>TAUX DE RÉUSSITE</span>
            <span class="text-emerald-600">🎯</span>
          </div>
          <div class="text-3xl font-black text-emerald-600">{{ stats?.kpis?.taux_reussite ?? 0 }} %</div>
          <div class="text-[11px] text-slate-500 mt-1">Admis dès 35/40 points</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>TAUX D'ÉMARGEMENT</span>
            <span class="text-blue-600">📱</span>
          </div>
          <div class="text-3xl font-black text-blue-600">{{ stats?.kpis?.taux_presence ?? 0 }} %</div>
          <div class="text-[11px] text-slate-500 mt-1">Présence contrôlée par QR</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>SESSIONS ACTIVES</span>
            <span class="text-amber-500">📅</span>
          </div>
          <div class="text-3xl font-black text-slate-900">{{ stats?.kpis?.sessions_ouvertes ?? 0 }}</div>
          <div class="text-[11px] text-slate-500 mt-1">Réparties sur le centre d’examen de Castors</div>
        </div>

      </div>

      <!-- Graphiques et Répartition -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <!-- Répartition par Centre d'Examen -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Répartition des Candidats par Centre
            </h3>
            <span class="text-xs text-slate-400">Volume mensuel</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-slate-700">Dakar - Castors (Centre de Castors)</span>
                <span class="text-slate-900 font-mono">64 inscrits (62%)</span>
              </div>
              <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div class="bg-red-500 h-full rounded-full" style="width: 62%"></div>
              </div>
              <span class="text-[10px] text-red-600 font-medium mt-0.5 block">Niveau de charge élevé (saturation proche)</span>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-slate-700">Rufisque - Centre Ngalandou Diouf</span>
                <span class="text-slate-900 font-mono">22 inscrits (21%)</span>
              </div>
              <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div class="bg-sn-green h-full rounded-full" style="width: 21%"></div>
              </div>
              <span class="text-[10px] text-emerald-600 font-medium mt-0.5 block">Sous-utilisé (Capacité disponible)</span>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-slate-700">Thiès - Cité Malick Sy</span>
                <span class="text-slate-900 font-mono">18 inscrits (17%)</span>
              </div>
              <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full rounded-full" style="width: 17%"></div>
              </div>
              <span class="text-[10px] text-blue-600 font-medium mt-0.5 block">Charge optimale</span>
            </div>
          </div>
        </div>

        <!-- Raccourcis Administratifs -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Opérations de Gestion en Attente
            </h3>

            <div class="space-y-3">
              <a routerLink="/admin/candidats" 
                 class="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100/70 transition flex items-center justify-between group">
                <div>
                  <div class="text-xs font-bold text-amber-950">24 Dossiers candidats en attente</div>
                  <div class="text-[11px] text-amber-800">Pièces CNI et certificats à vérifier et approuver</div>
                </div>
                <span class="text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">Instruire →</span>
              </a>

              <a routerLink="/admin/smart-scheduling" 
                 class="p-4 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100/70 transition flex items-center justify-between group">
                <div>
                  <div class="text-xs font-bold text-purple-950">2 Alertes de Saturation Détectées</div>
                  <div class="text-[11px] text-purple-800">Recommandations de rééquilibrage Dakar vers Rufisque</div>
                </div>
                <span class="text-xs font-bold text-purple-900 group-hover:translate-x-1 transition-transform">Consulter →</span>
              </a>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dernière synchronisation : il y a 2 minutes</span>
            <button (click)="loadStats()" class="text-sn-green font-bold hover:underline">Actualiser ↻</button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  stats: any = null;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.getAdminStats().subscribe(res => {
      this.stats = res;
    });
  }
}
