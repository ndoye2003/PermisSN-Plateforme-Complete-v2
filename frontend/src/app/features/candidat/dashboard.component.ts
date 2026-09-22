import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-candidat-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Bannière Bienvenue & Matricule -->
      <div class="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-emerald-900/40 relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
              <span>Portail Candidat PermisSN</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Jërejëf, {{ user()?.name }} !
            </h1>
            <p class="text-sm text-slate-300">
              Suivez en temps réel l'état de votre dossier administratif et vos rendez-vous d'examen.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl text-left sm:text-right shrink-0">
            <span class="block text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Matricule National Unique</span>
            <span class="block text-xl font-mono font-bold text-sn-yellow mt-0.5">
              {{ candidat?.numero_candidat || 'SN-2026-DK-00101' }}
            </span>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  [ngClass]="{
                    'bg-emerald-500/30 text-emerald-200': candidat?.statut_dossier === 'valide',
                    'bg-amber-500/30 text-amber-200': candidat?.statut_dossier === 'en_attente',
                    'bg-red-500/30 text-red-200': candidat?.statut_dossier === 'rejete',
                    'bg-slate-700 text-slate-300': !candidat?.statut_dossier || candidat?.statut_dossier === 'incomplet'
                  }">
              Dossier {{ candidat?.statut_dossier || 'Incomplet' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stepper Visuel du Parcours Candidat -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Progression de votre parcours officiel</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
          
          <!-- Étape 1 -->
          <div class="p-4 rounded-xl border transition"
               [ngClass]="'bg-emerald-50/50 border-emerald-200 text-emerald-900'">
            <div class="flex items-center justify-between mb-2">
              <span class="w-6 h-6 rounded-full bg-sn-green text-white text-xs font-bold flex items-center justify-center">✓</span>
              <span class="text-[10px] font-bold uppercase text-sn-green">Validé</span>
            </div>
            <div class="font-bold text-xs">1. Inscription</div>
            <div class="text-[11px] text-slate-500 mt-1">Compte créé</div>
          </div>

          <!-- Étape 2 -->
          <div class="p-4 rounded-xl border transition"
               [ngClass]="candidat?.statut_dossier === 'valide' || candidat?.statut_dossier === 'en_attente' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'">
            <div class="flex items-center justify-between mb-2">
              <span class="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    [ngClass]="candidat?.statut_dossier === 'valide' || candidat?.statut_dossier === 'en_attente' ? 'bg-sn-green' : 'bg-amber-500'">
                {{ candidat?.statut_dossier === 'valide' || candidat?.statut_dossier === 'en_attente' ? '✓' : '2' }}
              </span>
              <span class="text-[10px] font-bold uppercase" [ngClass]="candidat?.statut_dossier === 'valide' ? 'text-sn-green' : 'text-amber-700'">
                {{ candidat?.statut_dossier || 'Incomplet' }}
              </span>
            </div>
            <div class="font-bold text-xs">2. Pièces jointes</div>
            <div class="text-[11px] text-slate-500 mt-1">CNI & Certificat médical</div>
          </div>

          <!-- Étape 3 -->
          <div class="p-4 rounded-xl border transition"
               [ngClass]="activeReservation ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : (candidat?.statut_dossier === 'valide' ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-400')">
            <div class="flex items-center justify-between mb-2">
              <span class="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    [ngClass]="activeReservation ? 'bg-sn-green' : (candidat?.statut_dossier === 'valide' ? 'bg-blue-600' : 'bg-slate-300')">
                {{ activeReservation ? '✓' : '3' }}
              </span>
              <span class="text-[10px] font-bold uppercase" [ngClass]="activeReservation ? 'text-sn-green' : 'text-blue-600'">
                {{ activeReservation ? 'Réservé' : 'À faire' }}
              </span>
            </div>
            <div class="font-bold text-xs">3. Réservation</div>
            <div class="text-[11px] text-slate-500 mt-1">Choix session & centre</div>
          </div>

          <!-- Étape 4 -->
          <div class="p-4 rounded-xl border transition"
               [ngClass]="activeReservation ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'">
            <div class="flex items-center justify-between mb-2">
              <span class="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    [ngClass]="activeReservation ? 'bg-sn-green' : 'bg-slate-300'">
                {{ activeReservation ? '✓' : '4' }}
              </span>
              <span class="text-[10px] font-bold uppercase text-sn-green">QR Code</span>
            </div>
            <div class="font-bold text-xs">4. Convocation</div>
            <div class="text-[11px] text-slate-500 mt-1">Document téléchargeable</div>
          </div>

          <!-- Étape 5 -->
          <div class="p-4 rounded-xl border transition"
               [ngClass]="hasResultat ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'">
            <div class="flex items-center justify-between mb-2">
              <span class="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    [ngClass]="hasResultat ? 'bg-sn-green' : 'bg-slate-300'">
                {{ hasResultat ? '✓' : '5' }}
              </span>
              <span class="text-[10px] font-bold uppercase text-slate-500">Examen</span>
            </div>
            <div class="font-bold text-xs">5. Résultat</div>
            <div class="text-[11px] text-slate-500 mt-1">Note & épreuve pratique</div>
          </div>

        </div>
      </div>

      <!-- Contenu Principal : Réservation Active ou Call To Action -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Colonne Gauche (2/3) : Réservation Active ou Étape suivante -->
        <div class="lg:col-span-2 space-y-6">
          
          @if (activeReservation) {
            <!-- Carte Convocation Active avec QR Code -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <div class="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Convocation d'Examen Confirmée
                  </span>
                  <h2 class="text-xl font-bold text-slate-900 mt-2">
                    {{ activeReservation?.session?.centre_nom || 'Centre de Castors de Castors' }}
                  </h2>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ activeReservation?.session?.centre_adresse || 'Parc de Hann, Route des Pères Maristes, Dakar' }}
                  </p>
                </div>

                <div class="hidden sm:block text-right">
                  <span class="text-[11px] text-slate-400 font-semibold block">RÉFÉRENCE</span>
                  <span class="text-xs font-mono font-bold text-slate-700">{{ activeReservation?.numero_reservation }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div class="sm:col-span-2 space-y-3 text-sm">
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="text-slate-500 text-xs">Date de l'épreuve :</span>
                    <span class="font-bold text-slate-900">{{ activeReservation?.session?.date_session }}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="text-slate-500 text-xs">Heure de convocation :</span>
                    <span class="font-bold text-emerald-700">{{ activeReservation?.session?.heure_debut }} - {{ activeReservation?.session?.heure_fin }}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="text-slate-500 text-xs">Salle d'examen :</span>
                    <span class="font-bold text-slate-900">{{ activeReservation?.session?.salle_nom || 'Salle A' }}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="text-slate-500 text-xs">Catégorie Permis :</span>
                    <span class="font-bold text-slate-900">Permis {{ candidat?.categorie_permis || 'B' }}</span>
                  </div>

                  <div class="pt-4 flex flex-wrap gap-3">
                    <a routerLink="/candidat/convocation" 
                       class="px-5 py-2.5 rounded-xl bg-sn-green hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-sn-green/20 transition flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Imprimer ma Convocation PDF</span>
                    </a>
                  </div>
                </div>

                <!-- QR Code Box -->
                <div class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  @if (qrDataUri) {
                    <img [src]="qrDataUri" alt="QR Code" class="w-32 h-32 rounded-lg bg-white p-1 shadow-sm border border-slate-200">
                  } @else {
                    <div class="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-500">QR Code</div>
                  }
                  <span class="text-[10px] font-bold text-sn-green mt-2 uppercase">Scan à l'accueil</span>
                  <span class="text-[9px] font-mono text-slate-400 truncate max-w-[120px]">{{ activeReservation?.qr_token }}</span>
                </div>
              </div>
            </div>
          } @else {
            <!-- Pas encore de réservation active -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
              <div class="w-16 h-16 rounded-full bg-emerald-100 text-sn-green mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                📅
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Aucune session réservée pour le moment</h3>
              <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">
                @if (candidat?.statut_dossier === 'valide') {
                  Votre dossier a été approuvé par l'administration. Vous pouvez dès à présent choisir votre centre et réserver votre date d'examen.
                } @else if (candidat?.statut_dossier === 'en_attente') {
                  Vos pièces justificatives sont en cours d'instruction par les agents du Ministère. Vous recevrez une alerte dès validation.
                } @else {
                  Pour réserver votre date d'examen, vous devez d'abord compléter votre dossier administratif et téléverser votre CNI.
                }
              </p>

              @if (candidat?.statut_dossier === 'valide') {
                <a routerLink="/candidat/reservation" 
                   class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sn-green hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-sn-green/20 transition">
                  <span>Choisir un centre et réserver</span>
                  <span>→</span>
                </a>
              } @else {
                <a routerLink="/candidat/dossier" 
                   class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sn-green hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-sn-green/20 transition">
                  <span>Compléter mon dossier de pièces</span>
                  <span>→</span>
                </a>
              }
            </div>
          }

        </div>

        <!-- Colonne Droite (1/3) : Widgets complémentaires (QCM & Informations) -->
        <div class="space-y-6">
          
          <!-- Widget Entraînement au Code -->
          <div class="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-6 rounded-3xl shadow-lg shadow-amber-500/10">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-extrabold uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-full text-slate-900">
                Module Soutenance
              </span>
              <span class="text-xl">🎯</span>
            </div>
            <h3 class="text-xl font-black mb-2">Préparez votre Code</h3>
            <p class="text-xs text-slate-900/80 mb-5 leading-relaxed">
              Testez vos connaissances sur la signalisation, les priorités au Sénégal et la vitesse avec nos séries interactives conformes à l'examen officiel.
            </p>
            <a routerLink="/entrainement" 
               class="block w-full text-center py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold shadow transition">
              Lancer une série d'entraînement (QCM)
            </a>
          </div>

          <!-- Pièces Justificatives -->
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h4 class="text-sm font-bold text-slate-900 mb-4">Pièces du Dossier</h4>
            
            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="font-medium text-slate-700">Carte Nationale d'Identité (CNI)</span>
                <span class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                      [ngClass]="candidat?.statut_dossier === 'valide' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                  {{ candidat?.statut_dossier === 'valide' ? 'Validé' : 'En attente' }}
                </span>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="font-medium text-slate-700">Certificat Médical d'Aptitude</span>
                <span class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                      [ngClass]="candidat?.statut_dossier === 'valide' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                  {{ candidat?.statut_dossier === 'valide' ? 'Validé' : 'En attente' }}
                </span>
              </div>
            </div>

            <a routerLink="/candidat/dossier" class="block text-center text-xs font-bold text-sn-green hover:underline mt-4">
              Gérer mes documents téléversés →
            </a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class CandidatDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  candidat: any = null;
  activeReservation: any = null;
  qrDataUri: string | null = null;
  hasResultat = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getCandidatProfile().subscribe({
      next: (res) => {
        this.candidat = res.candidat;
        this.activeReservation = res.active_reservation;
        this.qrDataUri = res.qr_data_uri;
        this.hasResultat = !!(this.candidat?.resultats && this.candidat.resultats.length > 0);
      }
    });
  }
}
