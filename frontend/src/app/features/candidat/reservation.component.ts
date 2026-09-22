import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { WolofAudioService } from '../../core/services/wolof-audio.service';
import { SessionExamen } from '../../core/models/session.model';

@Component({
  selector: 'app-candidat-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête avec Audio Wolof -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-sn-green text-xs font-bold mb-2">
            <span>📍 CENTRE UNIQUE : CASTORS (AVENUE BOURGUIBA, DAKAR)</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            Réservation de votre Créneau d'Examen à Castors
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Choisissez l'horaire précis de votre passage pour éviter l'attente et vous présenter à l'heure exacte.
          </p>
        </div>

        <!-- Bouton Écouter en Wolof -->
        <button (click)="wolofAudio.speakReservationGuide()" 
                class="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2">
          <span class="text-base">🔊</span>
          <span>Déglul ci Wolof (Écouter le guide)</span>
        </button>
      </div>

      <!-- Alerte Pédagogique Contexte Réel Sénégal -->
      <div class="mb-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-center gap-3">
        <span class="text-2xl shrink-0">🏛️</span>
        <div>
          <span class="font-bold block uppercase tracking-wider">Pourquoi la réservation en ligne ?</span>
          <span class="text-indigo-900/80">
            Le Centre d'Examen des Castors reçoit des centaines de candidats chaque jour. En réservant votre créneau horodaté, 
            <strong>vous n'avez plus besoin de vous réveiller à 5h du matin</strong> pour faire la queue. Présentez-vous simplement 30 minutes avant votre heure.
          </span>
        </div>
      </div>

      <!-- Alerte de validation si dossier non approuvé -->
      @if (candidatStatut !== 'valide') {
        <div class="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 text-xs">
            <span class="text-xl">⚠️</span>
            <span>Votre dossier est en cours de validation par l'administration des Castors.</span>
          </div>
          <button (click)="forceValidateMock()" class="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition">
            Valider pour la Démo
          </button>
        </div>
      }

      @if (bookingSuccess) {
        <div class="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center justify-between">
          <span>🎉 Votre créneau au Centre des Castors a été réservé avec succès !</span>
          <button (click)="goToConvocation()" class="px-4 py-1.5 bg-sn-green text-white rounded-xl text-xs font-bold">
            Afficher ma Convocation QR →
          </button>
        </div>
      }

      <!-- Sélecteur de Catégorie & Date -->
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Lieu d'examen</span>
          <span class="font-extrabold text-sm text-slate-900">Centre National d'Examen des Castors (Avenue Bourguiba)</span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-700 whitespace-nowrap">Catégorie Permis :</label>
          <select [(ngModel)]="selectedCategorie" (change)="loadSessions()" 
                  class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-sn-green focus:outline-none bg-white">
            <option value="B">Permis B (Voiture / Taxi / Particulier)</option>
            <option value="A">Permis A (Moto / Deux-roues)</option>
            <option value="C">Permis C (Poids Lourd)</option>
            <option value="D">Permis D (Transport en commun / Car Rapide)</option>
          </select>
        </div>
      </div>

      <!-- Créneaux Disponibles à Castors -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Créneaux Disponibles au Centre des Castors</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (session of sessions; track session.id) {
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-sn-green hover:shadow-md transition flex flex-col justify-between">
              
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        [ngClass]="session.places_restantes > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                    {{ session.places_restantes }} places disponibles
                  </span>
                  <span class="text-xs font-mono font-bold text-slate-400">Cat. {{ session.categorie_permis }}</span>
                </div>

                <h4 class="font-bold text-base text-slate-900 mb-1">Centre des Castors (Dakar)</h4>
                <p class="text-xs text-slate-500 mb-4">{{ session.salle_nom || 'Salle Théorique Principale' }}</p>

                <div class="space-y-2 py-3 border-t border-b border-slate-100 text-xs mb-4">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Date de passage :</span>
                    <strong class="text-slate-900">{{ session.date_session }}</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Heure précise :</span>
                    <strong class="text-emerald-700">{{ session.heure_debut }} - {{ session.heure_fin }}</strong>
                  </div>
                </div>
              </div>

              <div>
                <button (click)="reserver(session.id)" 
                        [disabled]="session.places_restantes <= 0 || loading"
                        class="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-sn-green hover:bg-emerald-700 shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  <span>Réserver ce créneau à Castors</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class CandidatReservationComponent implements OnInit {
  private apiService = inject(ApiService);
  wolofAudio = inject(WolofAudioService);
  private router = inject(Router);

  sessions: SessionExamen[] = [];
  selectedCategorie = 'B';
  candidatStatut = 'valide';
  bookingSuccess = false;
  loading = false;

  ngOnInit() {
    this.apiService.getCandidatProfile().subscribe(res => {
      if (res?.candidat) this.candidatStatut = res.candidat.statut_dossier;
    });
    this.loadSessions();
  }

  loadSessions() {
    this.apiService.getSessions({ categorie_permis: this.selectedCategorie }).subscribe(res => {
      this.sessions = res;
    });
  }

  reserver(sessionId: number) {
    this.loading = true;
    this.apiService.createReservation(sessionId).subscribe({
      next: () => {
        this.loading = false;
        this.bookingSuccess = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  forceValidateMock() {
    this.candidatStatut = 'valide';
  }

  goToConvocation() {
    this.router.navigate(['/candidat/convocation']);
  }
}
