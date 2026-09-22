import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-agent-scan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête Agent Castors -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest block">POSTE D'ACCUEIL & ENTRÉE</span>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Contrôle d'Accès & Émargement — Centre des Castors</h1>
          <p class="text-xs text-slate-500 mt-1">Scan immédiat de la convocation pour enregistrer l'heure exacte de présence du candidat</p>
        </div>

        <a routerLink="/agent/dashboard" class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
          ← Planning des Séances
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <!-- Viseur Caméra & Détecteur -->
        <div class="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-xl border border-slate-800 relative overflow-hidden">
          <div class="relative w-full aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center p-6 overflow-hidden">
            
            <!-- Ligne de scan laser -->
            <div class="absolute inset-x-0 h-0.5 bg-sn-green shadow-[0_0_15px_#00853F] animate-bounce"></div>

            <div class="w-48 h-48 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
              <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-sn-yellow"></div>
              <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-sn-yellow"></div>
              <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-sn-yellow"></div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-sn-yellow"></div>
              
              <svg class="w-16 h-16 text-emerald-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>

            <span class="text-xs text-slate-400 mt-4">Pointez la caméra vers le QR Code de la convocation</span>
          </div>

          <!-- Saisie directe du Token ou douchette -->
          <div class="mt-6 pt-6 border-t border-slate-800 text-left">
            <label class="block text-xs font-bold text-slate-300 mb-1">Code Convocation (ou lecture douchette) :</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="tokenInput" placeholder="PERMIS-SN-CASTORS-RES-..." 
                     (keyup.enter)="validerScan(tokenInput)"
                     class="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:ring-2 focus:ring-sn-green focus:outline-none">
              <button (click)="validerScan(tokenInput)" class="px-4 py-2 rounded-xl bg-sn-green hover:bg-emerald-700 text-xs font-bold text-white transition">
                Valider
              </button>
            </div>
          </div>

        </div>

        <!-- Résultat du Contrôle -->
        <div class="space-y-6">
          
          @if (scanResult) {
            <div class="p-6 rounded-3xl border animate-fadeIn"
                 [ngClass]="scanResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'">
              
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md"
                     [ngClass]="scanResult.success ? 'bg-sn-green' : 'bg-red-600'">
                  {{ scanResult.success ? '✓' : '✕' }}
                </div>
                <div>
                  <h3 class="font-extrabold text-base">{{ scanResult.message }}</h3>
                  <span class="text-xs opacity-75 font-mono">STATUT : ÉMARGÉ</span>
                </div>
              </div>

              @if (scanResult.success) {
                <div class="bg-white/90 p-4 rounded-2xl border border-emerald-100 text-xs space-y-2 mb-4">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Candidat :</span>
                    <strong class="text-slate-900 font-bold">{{ scanResult.candidat?.user?.name || 'Moussa Diop' }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Matricule National :</span>
                    <strong class="font-mono text-slate-900">{{ scanResult.candidat?.numero_candidat || 'SN-2026-DK-00101' }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Catégorie :</span>
                    <strong class="text-sn-green">Permis {{ scanResult.candidat?.categorie_permis || 'B' }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Heure d'émargement :</span>
                    <strong class="text-slate-900 font-mono">{{ scanResult.presence?.heure_scan || '08:24:12' }}</strong>
                  </div>
                </div>

                <button (click)="openNoteModal()" 
                        class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition">
                  Saisir le Résultat de l'Épreuve (/40) →
                </button>
              }

            </div>
          } @else {
            <div class="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              <span class="text-3xl block mb-2">📷</span>
              Scanner prêt. En attente d'un candidat à l'entrée des Castors...
            </div>
          }

          <!-- Formulaire Officiel Saisie de Note -->
          @if (showNoteBox) {
            <div class="bg-white p-6 rounded-3xl border-2 border-blue-500 shadow-xl space-y-4 animate-fadeIn">
              <div class="flex items-center justify-between">
                <h4 class="font-extrabold text-sm text-slate-900">Procès-Verbal de l'Examen Théorique</h4>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Barème National</span>
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nombre de Bonnes Réponses (/40) :</label>
                <input type="number" [(ngModel)]="noteInput" min="0" max="40" 
                       class="w-full text-center text-3xl font-black font-mono py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <span class="text-[10px] text-slate-500 block mt-1">Seuil légal d'admission au Sénégal : 35 sur 40 (5 fautes max autorisées).</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-xs font-bold text-slate-700">Décision Finale :</span>
                <span class="px-3 py-1 rounded-full text-xs font-black uppercase"
                      [ngClass]="noteInput >= 35 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                  {{ noteInput >= 35 ? 'ADMIS (Épreuve Pratique Autorisée)' : 'AJOURNÉ (Échec)' }}
                </span>
              </div>

              <button (click)="enregistrerNote()" class="w-full py-2.5 rounded-xl bg-sn-green hover:bg-emerald-700 text-white font-bold text-xs shadow transition">
                Valider & Transmettre le Résultat Officiel
              </button>
            </div>
          }

          @if (noteSavedMessage) {
            <div class="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center">
              {{ noteSavedMessage }}
            </div>
          }

        </div>

      </div>

    </div>
  `
})
export class AgentScanComponent {
  private apiService = inject(ApiService);

  tokenInput = 'PERMIS-SN-CASTORS-RES-2026-MD98-SECURETOKEN';
  scanResult: any = null;
  showNoteBox = false;
  noteInput = 37;
  noteSavedMessage = '';

  validerScan(token: string) {
    if (!token) return;
    this.apiService.scanQrCode(token).subscribe({
      next: (res) => {
        this.scanResult = res;
      }
    });
  }

  openNoteModal() {
    this.showNoteBox = true;
  }

  enregistrerNote() {
    this.apiService.saveResultat({
      reservation_id: 1,
      score: this.noteInput,
      observations: this.noteInput >= 35 ? 'Admis à l\'épreuve théorique.' : 'Score insuffisant.'
    }).subscribe({
      next: () => {
        this.showNoteBox = false;
        this.noteSavedMessage = `Résultat officiel enregistré : ${this.noteInput}/40 (${this.noteInput >= 35 ? 'ADMIS' : 'AJOURNÉ'}). Le candidat peut consulter son résultat en ligne.`;
      }
    });
  }
}
