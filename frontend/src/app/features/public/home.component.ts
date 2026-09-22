import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WolofAudioService } from '../../core/services/wolof-audio.service';
import { WolofVoiceButtonComponent } from '../../shared/components/wolof-voice-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, WolofVoiceButtonComponent],
  template: `
    <!-- Bannière d'accessibilité vocale en Wolof -->
    <div class="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold border-b border-amber-600 shadow-sm">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-center sm:text-left">
          <span class="text-base">📢</span>
          <span>
            Bëgg nga dégg li ci Wolof ?
            (Vous ne savez pas lire le français ? Écoutez le guide audio en Wolof) :
          </span>
        </div>

        <button
          (click)="wolofAudio.speakAccueil()"
          class="px-3.5 py-1 rounded-full bg-slate-950 hover:bg-black text-white font-extrabold text-[11px] shadow transition flex items-center gap-1.5 shrink-0">
          <span>🔊</span>
          <span>Déglul ci Wolof (Écouter en Wolof)</span>
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-10 pb-20">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#00853F_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <!-- Badge institutionnel -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6">
          <span class="w-2 h-2 rounded-full bg-sn-green animate-pulse"></span>
          <span>
            RÉPUBLIQUE DU SÉNÉGAL • CENTRE UNIQUE D'EXAMEN DES CASTORS (DAKAR)
          </span>
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Votre rendez-vous d'examen au <br class="hidden sm:inline">

          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sn-yellow">
            Centre des Castors sans file d'attente
          </span>
        </h1>

        <p class="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
          Fini les réveils à <strong>5h du matin</strong> pour faire la queue devant le centre des Castors.

          <strong>PermisSN</strong> organise et sécurise vos rendez-vous officiels avec une
          <strong>convocation horodatée</strong> et une
          <strong>assistance vocale en Wolof</strong>.
        </p>

        <!-- Information importante -->
        <div class="inline-block p-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-amber-200 mb-8 max-w-2xl">
          ℹ️
          <strong>Rappel :</strong>
          La plateforme ne remplace pas l'examen officiel aux Castors.
          Elle facilite la prise de rendez-vous et l'organisation des candidats.
        </div>

        <!-- Actions principales -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">

          <a
            routerLink="/inscription"
            class="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-sn-yellow to-amber-400 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
            Prendre mon rendez-vous
          </a>

          <a
            routerLink="/entrainement"
            class="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2">
            <span>S'entraîner au Code</span>
            <span class="text-xs px-2 py-0.5 rounded bg-sn-green text-white font-semibold">
              Gratuit
            </span>
          </a>

        </div>

        <!-- Chiffres clés -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800 text-left">

          <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div class="text-xl sm:text-2xl font-extrabold text-emerald-400">
              Centre Castors
            </div>
            <div class="text-xs text-slate-400">
              Dakar
            </div>
          </div>

          <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div class="text-xl sm:text-2xl font-extrabold text-sn-yellow">
              Rendez-vous
            </div>
            <div class="text-xs text-slate-400">
              Créneaux horaires précis
            </div>
          </div>

          <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div class="text-xl sm:text-2xl font-extrabold text-blue-400">
              Audio Wolof 🔊
            </div>
            <div class="text-xs text-slate-400">
              Accessible pour tous
            </div>
          </div>

          <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div class="text-xl sm:text-2xl font-extrabold text-purple-400">
              QR Code
            </div>
            <div class="text-xs text-slate-400">
              Émargement sécurisé
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Processus -->
    <div class="py-16 bg-white border-b border-slate-200">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center max-w-3xl mx-auto mb-14">

          <h2 class="text-xs font-bold text-sn-green uppercase tracking-widest mb-2">
            Parcours simplifié adapté au Sénégal
          </h2>

          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comment ça marche pour le candidat ?
          </p>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">

            <div class="w-12 h-12 rounded-full bg-emerald-100 text-sn-green font-black text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>

            <h3 class="font-bold text-slate-900 text-sm mb-2">
              Inscription simple
            </h3>

            <p class="text-xs text-slate-600">
              Renseignez votre téléphone et votre CNI pour créer votre compte candidat.
            </p>

          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">

            <div class="w-12 h-12 rounded-full bg-emerald-100 text-sn-green font-black text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>

            <h3 class="font-bold text-slate-900 text-sm mb-2">
              Choix de l'heure
            </h3>

            <p class="text-xs text-slate-600">
              Choisissez votre jour et votre créneau de passage au centre de Castors.
            </p>

          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">

            <div class="w-12 h-12 rounded-full bg-emerald-100 text-sn-green font-black text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>

            <h3 class="font-bold text-slate-900 text-sm mb-2">
              Convocation avec QR Code
            </h3>

            <p class="text-xs text-slate-600">
              Recevez votre convocation sur votre téléphone ou imprimez-la.
            </p>

          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">

            <div class="w-12 h-12 rounded-full bg-emerald-100 text-sn-green font-black text-lg flex items-center justify-center mx-auto mb-4">
              4
            </div>

            <h3 class="font-bold text-slate-900 text-sm mb-2">
              Scan & passage à Castors
            </h3>

            <p class="text-xs text-slate-600">
              L'agent scanne votre QR Code à l'entrée et vérifie votre convocation.
            </p>

          </div>

        </div>
      </div>
    </div>

    <!-- Démonstration -->
    <div class="py-12 bg-slate-100 border-t border-slate-200">

      <div class="max-w-4xl mx-auto px-4 text-center">

        <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 font-bold rounded-full text-xs uppercase mb-3">
          Présentation du projet de soutenance
        </span>

        <h3 class="text-2xl font-bold text-slate-900 mb-2">
          Accès aux différents espaces
        </h3>

        <p class="text-xs text-slate-600 mb-6">
          Chaque utilisateur se connecte avec son propre compte.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <!-- Candidat -->
          <button
            (click)="goToLogin()"
            class="p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-sn-green text-left transition group">

            <div class="font-bold text-slate-900 group-hover:text-sn-green flex items-center justify-between mb-1">
              <span>Candidat</span>

              <span class="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                Connexion
              </span>
            </div>

            <div class="text-xs text-slate-500">
              Consulter sa convocation et son rendez-vous.
            </div>

          </button>

          <!-- Agent -->
          <button
            (click)="goToLogin()"
            class="p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 text-left transition group">

            <div class="font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between mb-1">
              <span>Agent</span>

              <span class="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                Connexion
              </span>
            </div>

            <div class="text-xs text-slate-500">
              Gérer l'accueil, les présences et le contrôle des convocations.
            </div>

          </button>

          <!-- Administrateur -->
          <button
            (click)="goToLogin()"
            class="p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-purple-600 text-left transition group">

            <div class="font-bold text-slate-900 group-hover:text-purple-600 flex items-center justify-between mb-1">
              <span>Administration</span>

              <span class="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                Connexion
              </span>
            </div>

            <div class="text-xs text-slate-500">
              Administrer les candidats, sessions et rendez-vous.
            </div>

          </button>

        </div>
      </div>
    </div>
  `
})
export class HomeComponent {

  private router = inject(Router);

  wolofAudio = inject(WolofAudioService);

  goToLogin(): void {
    this.router.navigate(['/connexion']);
  }
}