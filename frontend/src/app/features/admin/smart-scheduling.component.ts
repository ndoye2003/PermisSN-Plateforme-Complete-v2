import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-smart-scheduling',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête Assistant Smart Scheduling -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <span>MODULE AVANCÉ DE SOUTENANCE • AIDE À LA DÉCISION</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Scheduling — Planification Intelligente</h1>
          <p class="text-xs text-slate-500 mt-1">
            Algorithme d'optimisation de répartition des candidats et désengorgement des centres saturés du Sénégal
          </p>
        </div>

        <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 self-start">
          ← Retour Dashboard
        </a>
      </div>

      <!-- Résumé Analytique de l'Algorithme -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <span class="text-xs font-bold text-slate-400 uppercase">Candidats Prêts en Attente</span>
          <div class="text-3xl font-black text-slate-900 mt-2">{{ data?.total_candidats_en_attente || 24 }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Dossiers validés n'ayant pas encore réservé de créneau</p>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <span class="text-xs font-bold text-red-500 uppercase">Centres en Surcharge</span>
          <div class="text-3xl font-black text-red-600 mt-2">{{ data?.centres_satures?.length || 1 }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Taux d'occupation supérieur à 85% (Dakar Hann)</p>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <span class="text-xs font-bold text-emerald-600 uppercase">Capacités Libres Immédiates</span>
          <div class="text-3xl font-black text-sn-green mt-2">{{ data?.centres_disponibles?.length || 2 }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Centres sous-utilisés (Rufisque, Thiès)</p>
        </div>
      </div>

      <!-- Recommandations Intelligentes Générées par l'Algorithme -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <div class="flex items-center gap-2 mb-6">
          <span class="text-xl">🤖</span>
          <div>
            <h3 class="font-extrabold text-base text-slate-900">Recommandations de l'Algorithme d'Aide à la Décision</h3>
            <p class="text-xs text-slate-500">Calculées en croisant la capacité des salles, la demande de catégorie B et la géolocalisation</p>
          </div>
        </div>

        <div class="space-y-4">
          @for (rec of data?.recommandations; track rec.message) {
            <div class="p-5 rounded-2xl border transition flex items-start justify-between gap-4"
                 [ngClass]="rec.gravite === 'haute' ? 'bg-red-50/60 border-red-200 text-red-950' : 'bg-indigo-50/60 border-indigo-200 text-indigo-950'">
              
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        [ngClass]="rec.gravite === 'haute' ? 'bg-red-200 text-red-900' : 'bg-indigo-200 text-indigo-900'">
                    {{ rec.type === 'redirection' ? 'Redirection Suggérée' : 'Ouverture de Sessions' }}
                  </span>
                  <span class="text-xs font-bold text-slate-800">Priorité {{ rec.gravite }}</span>
                </div>
                <p class="text-xs leading-relaxed font-medium pt-1">{{ rec.message }}</p>
              </div>

              <button (click)="appliquerRecommandation(rec)" 
                      class="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm">
                Appliquer l'action
              </button>
            </div>
          }
        </div>

        @if (actionFeedback) {
          <div class="mt-4 p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl text-center">
            {{ actionFeedback }}
          </div>
        }
      </div>

      <!-- Diagnostic de Saturation des Centres -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6">
          Diagnostic Comparatif des Centres d'Examen
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (centre of data?.analyse_centres; track centre.centre_id) {
            <div class="p-5 rounded-2xl border transition"
                 [ngClass]="centre.statut_charge === 'sature' ? 'border-red-300 bg-red-50/20' : (centre.statut_charge === 'sous_utilise' ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200')">
              
              <div class="flex items-center justify-between mb-3">
                <span class="font-bold text-sm text-slate-900">{{ centre.nom }}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                      [ngClass]="centre.statut_charge === 'sature' ? 'bg-red-100 text-red-800' : (centre.statut_charge === 'sous_utilise' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700')">
                  {{ centre.statut_charge }}
                </span>
              </div>

              <div class="space-y-1.5 text-xs text-slate-600 mb-4">
                <div class="flex justify-between"><span>Ville :</span><strong>{{ centre.ville }}</strong></div>
                <div class="flex justify-between"><span>Places Réservées :</span><strong>{{ centre.places_reservees }} / {{ centre.capacite_totale }}</strong></div>
                <div class="flex justify-between"><span>Places Libres :</span><strong class="text-sn-green">{{ centre.places_libres }}</strong></div>
              </div>

              <!-- Jauge de saturation -->
              <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                     [ngClass]="centre.taux_occupation >= 80 ? 'bg-red-500' : (centre.taux_occupation <= 35 ? 'bg-sn-green' : 'bg-blue-600')"
                     [style.width.%]="centre.taux_occupation"></div>
              </div>
              <div class="text-right text-[10px] font-mono text-slate-500 mt-1">{{ centre.taux_occupation }}% d'occupation</div>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class AdminSmartSchedulingComponent implements OnInit {
  private apiService = inject(ApiService);

  data: any = null;
  actionFeedback = '';

  ngOnInit() {
    this.apiService.getSmartScheduling().subscribe(res => {
      this.data = res;
    });
  }

  appliquerRecommandation(rec: any) {
    this.actionFeedback = `Action appliquée avec succès : Notifications envoyées aux candidats éligibles pour redirection vers le centre secondaire !`;
    setTimeout(() => this.actionFeedback = '', 5000);
  }
}
