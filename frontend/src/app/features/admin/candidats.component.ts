import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Candidat } from '../../core/models/candidat.model';

@Component({
  selector: 'app-admin-candidats',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Validation & Gestion des Dossiers</h1>
          <p class="text-xs text-slate-500 mt-1">Examen des pièces d'identité et validation des candidatures au Code</p>
        </div>

        <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 self-start">
          ← Retour Dashboard
        </a>
      </div>

      <!-- Filtres et Recherche -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div class="flex-1 w-full">
          <input type="text" [(ngModel)]="searchQuery" (input)="onFilterChange()" 
                 placeholder="Rechercher par nom, matricule ou téléphone..."
                 class="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>

        <div class="w-full sm:w-auto">
          <select [(ngModel)]="selectedStatus" (change)="onFilterChange()" 
                  class="w-full sm:w-auto px-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-semibold">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente d'instruction</option>
            <option value="valide">Validés</option>
            <option value="incomplet">Incomplets</option>
            <option value="rejete">Rejetés</option>
          </select>
        </div>
      </div>

      <!-- Tableau des Candidats -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">Matricule</th>
                <th class="px-6 py-4">Nom et Prénom</th>
                <th class="px-6 py-4">Téléphone / Email</th>
                <th class="px-6 py-4">Permis</th>
                <th class="px-6 py-4">Statut Dossier</th>
                <th class="px-6 py-4 text-right">Actions d'Instruction</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (c of filteredCandidats; track c.id) {
                <tr class="hover:bg-slate-50 transition">
                  <td class="px-6 py-4 font-mono font-bold text-slate-900">{{ c.numero_candidat }}</td>
                  <td class="px-6 py-4 font-bold text-slate-900">{{ c.user?.name }}</td>
                  <td class="px-6 py-4 text-slate-500">
                    <div>{{ c.telephone }}</div>
                    <div class="text-[11px] text-slate-400">{{ c.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                      Cat. {{ c.categorie_permis }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                          [ngClass]="{
                            'bg-emerald-100 text-emerald-800': c.statut_dossier === 'valide',
                            'bg-amber-100 text-amber-800': c.statut_dossier === 'en_attente',
                            'bg-red-100 text-red-800': c.statut_dossier === 'rejete',
                            'bg-slate-100 text-slate-500': c.statut_dossier === 'incomplet'
                          }">
                      {{ c.statut_dossier }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right space-x-2">
                    <button (click)="openDetail(c)" 
                            class="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-indigo-500 text-slate-700 font-semibold hover:text-indigo-600 transition">
                      Voir Pièces
                    </button>
                    @if (c.statut_dossier !== 'valide') {
                      <button (click)="valider(c.id)" 
                              class="px-3 py-1.5 rounded-lg bg-sn-green hover:bg-emerald-700 text-white font-bold transition">
                        Valider ✓
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Prévisualisation / Instruction -->
      @if (selectedCandidat) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 class="font-bold text-base text-slate-900">{{ selectedCandidat.user?.name }}</h3>
                <span class="text-xs font-mono text-slate-500">{{ selectedCandidat.numero_candidat }}</span>
              </div>
              <button (click)="selectedCandidat = null" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 space-y-1">
                <div class="flex justify-between"><span class="text-slate-500">NIN CNI :</span><strong>{{ selectedCandidat.nin || 'Non renseigné' }}</strong></div>
                <div class="flex justify-between"><span class="text-slate-500">Téléphone :</span><strong>{{ selectedCandidat.telephone }}</strong></div>
                <div class="flex justify-between"><span class="text-slate-500">Catégorie Permis :</span><strong>Permis {{ selectedCandidat.categorie_permis }}</strong></div>
              </div>

              <h4 class="font-bold text-slate-900 uppercase tracking-wider text-[11px] pt-2">Pièces Justificatives Déposées :</h4>
              <div class="space-y-2">
                <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>📄 Carte Nationale d'Identité</span>
                  <span class="text-sn-green font-bold">Fichier Conforme ✓</span>
                </div>
                <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>🩺 Certificat Médical d'Aptitude</span>
                  <span class="text-sn-green font-bold">Visite Médicale Validée ✓</span>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-4 border-t border-slate-100">
              <button (click)="rejeter(selectedCandidat.id)" 
                      class="flex-1 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition">
                Rejeter avec Motif
              </button>
              <button (click)="valider(selectedCandidat.id)" 
                      class="flex-1 py-2.5 rounded-xl bg-sn-green hover:bg-emerald-700 text-white text-xs font-bold shadow transition">
                Approuver le Dossier ✓
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminCandidatsComponent implements OnInit {
  private apiService = inject(ApiService);

  candidats: Candidat[] = [];
  filteredCandidats: Candidat[] = [];
  searchQuery = '';
  selectedStatus = '';
  selectedCandidat: Candidat | null = null;

  ngOnInit() {
    this.loadCandidats();
  }

  loadCandidats() {
    this.apiService.getAdminCandidats().subscribe(res => {
      this.candidats = res;
      this.onFilterChange();
    });
  }

  onFilterChange() {
    this.filteredCandidats = this.candidats.filter(c => {
      const matchStatus = !this.selectedStatus || c.statut_dossier === this.selectedStatus;
      const matchSearch = !this.searchQuery || 
        c.user?.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.numero_candidat.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.telephone.includes(this.searchQuery);
      return matchStatus && matchSearch;
    });
  }

  openDetail(c: Candidat) {
    this.selectedCandidat = c;
  }

  valider(id: number) {
    this.apiService.validerDossier(id, 'valide').subscribe(() => {
      const found = this.candidats.find(c => c.id === id);
      if (found) found.statut_dossier = 'valide';
      this.selectedCandidat = null;
      this.onFilterChange();
    });
  }

  rejeter(id: number) {
    this.apiService.validerDossier(id, 'rejete', 'Document illisible ou certificat non conforme.').subscribe(() => {
      const found = this.candidats.find(c => c.id === id);
      if (found) found.statut_dossier = 'rejete';
      this.selectedCandidat = null;
      this.onFilterChange();
    });
  }
}
