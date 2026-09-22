import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-agent-emargement',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Liste d'Émargement de la Session</h1>
          <p class="text-xs text-slate-500 mt-1">
            Contrôle des présences et suivi des candidats convoqués
          </p>
        </div>

        <a routerLink="/agent/dashboard" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
          ← Retour Sessions
        </a>
      </div>

      <!-- Tableau des candidats convoqués -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">Matricule</th>
                <th class="px-6 py-4">Nom du Candidat</th>
                <th class="px-6 py-4">Téléphone</th>
                <th class="px-6 py-4">Réf. Convocation</th>
                <th class="px-6 py-4">Statut Présence</th>
                <th class="px-6 py-4">Résultat Examen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (item of candidats; track item.id) {
                <tr class="hover:bg-slate-50 transition">
                  <td class="px-6 py-4 font-mono font-bold text-slate-900">{{ item.candidat?.numero_candidat }}</td>
                  <td class="px-6 py-4 font-bold text-slate-900">{{ item.candidat?.user?.name }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ item.candidat?.telephone }}</td>
                  <td class="px-6 py-4 font-mono text-slate-500">{{ item.numero_reservation }}</td>
                  <td class="px-6 py-4">
                    @if (item.presence) {
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Présent ({{ item.presence.heure_scan }})
                      </span>
                    } @else {
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                        En attente d'arrivée
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    @if (item.resultat) {
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                            [ngClass]="item.resultat.statut === 'admis' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                        {{ item.resultat.statut }} ({{ item.resultat.score }}/40)
                      </span>
                    } @else {
                      <span class="text-slate-400 italic">Non renseigné</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AgentEmargementComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  candidats: any[] = [];
  sessionId = 1;

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId')) || 1;
    this.apiService.getSessionCandidates(this.sessionId).subscribe(res => {
      this.candidats = res.candidats || [];
    });
  }
}
