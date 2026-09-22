import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { WolofAudioService } from '../../core/services/wolof-audio.service';
import { WolofVoiceButtonComponent } from '../../shared/components/wolof-voice-button.component';

@Component({
  selector: 'app-candidat-convocation',
  standalone: true,
  imports: [CommonModule, WolofVoiceButtonComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Boutons d'action supérieurs (non imprimés) -->
      <div class="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">Convocation Officielle d'Examen</h1>
          <p class="text-xs text-slate-500">Centre National des Examens de Castors (Dakar)</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Bouton Écouter en Wolof -->
          <button (click)="ecouterEnWolof()" 
                  class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2">
            <span class="text-base">🔊</span>
            <span>Déglul ci Wolof (Écouter mes consignes)</span>
          </button>

          <!-- Bouton Imprimer / Télécharger -->
          <button (click)="imprimer()" 
                  class="px-4 py-2.5 rounded-xl bg-sn-green hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-sn-green/20 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>

      <!-- Message Audio Wolof Déroulé -->
      <div class="no-print mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <span class="text-xl shrink-0">📢</span>
        <div>
          <div class="font-bold uppercase tracking-wider mb-1">Consignes Vocales en Wolof :</div>
          <p class="italic text-slate-700 leading-relaxed">
            « Dangay ñëw 30 minutes bala examen bi di tambali ci centre bu Castors ci Avenue Bourguiba. 
            Yoreel sa carte d'identité originale ak sa convocation bi am QR code ci sa téléphone wala ci kayit. 
            Agent bi dafay scan sa code ngir enregistrer sa présence. »
          </p>
        </div>
      </div>

      <!-- FEUILLE DE CONVOCATION OFFICIELLE (Format A4) -->
      <div class="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        <!-- En-tête Institutionnel Sénégal -->
        <div class="text-center pb-6 mb-6 border-b-2 border-sn-green">
          <div class="text-xs font-bold uppercase tracking-widest text-sn-green">RÉPUBLIQUE DU SÉNÉGAL</div>
          <div class="text-[10px] italic text-slate-500 mb-2">Un Peuple — Un But — Une Foi</div>
          
          <div class="flag-banner max-w-[120px] mx-auto mb-3 rounded-full"></div>

          <div class="text-xs font-extrabold uppercase text-slate-900">Ministère des Infrastructures, des Transports Terrestres et du Désenclavement</div>
          <div class="text-[11px] text-slate-600 font-semibold">Direction des Transports Routiers — Centre National d'Examen du Permis de Conduire (Castors)</div>
        </div>

        <!-- Titre & Référence -->
        <div class="bg-gradient-to-r from-sn-green to-emerald-800 text-white text-center p-4 rounded-2xl mb-8">
          <h2 class="text-base sm:text-lg font-extrabold uppercase tracking-wider">
            Convocation Officielle à l'Épreuve du Code de la Route
          </h2>
          <div class="text-xs text-emerald-100 mt-1 font-mono">
            RÉFÉRENCE CONVOCATION : <strong>{{ reservation?.numero_reservation || 'RES-CASTORS-2026-0001' }}</strong>
          </div>
        </div>

        <!-- Corps : Informations & QR Code -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start mb-8">
          
          <!-- Détails Candidat & Rendez-vous -->
          <div class="sm:col-span-2 space-y-6">
            
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 class="text-xs font-bold text-sn-green uppercase tracking-wider mb-3">Identité du Candidat</h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-slate-500">Matricule National :</span></div>
                <div><strong class="text-slate-900 font-mono">{{ candidat?.numero_candidat || 'SN-2026-DK-00101' }}</strong></div>

                <div><span class="text-slate-500">Nom et Prénom :</span></div>
                <div><strong class="text-slate-900">{{ candidat?.user?.name || 'Moussa Diop' }}</strong></div>

                <div><span class="text-slate-500">NIN (Carte CNI) :</span></div>
                <div><strong class="text-slate-900">{{ candidat?.nin || '10819980412001' }}</strong></div>

                <div><span class="text-slate-500">Téléphone :</span></div>
                <div><span class="text-slate-900">{{ candidat?.telephone || '77 812 34 56' }}</span></div>

                <div><span class="text-slate-500">Catégorie Permis :</span></div>
                <div><strong class="text-emerald-700">Permis {{ candidat?.categorie_permis || 'B' }} (Véhicule Léger)</strong></div>
              </div>
            </div>

            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 class="text-xs font-bold text-sn-green uppercase tracking-wider mb-3">Lieu & Heure d'Examen (Castors)</h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-slate-500">Centre d'examen :</span></div>
                <div><strong class="text-slate-900">Centre National d'Examen des Castors</strong></div>

                <div><span class="text-slate-500">Adresse exacte :</span></div>
                <div><span class="text-slate-900">Avenue Bourguiba x Rue 11, Quartier Castors, Dakar</span></div>

                <div><span class="text-slate-500">Salle assignée :</span></div>
                <div><strong class="text-slate-900">Salle Principale Théorique (Castors)</strong></div>

                <div><span class="text-slate-500">Date de passage :</span></div>
                <div><strong class="text-slate-900 font-mono">{{ sessionDateFormatted }}</strong></div>

                <div><span class="text-slate-500">Heure précise :</span></div>
                <div><strong class="text-emerald-700 font-mono">{{ sessionHeureDebut }} à {{ sessionHeureFin }}</strong></div>
              </div>
            </div>

          </div>

          <!-- QR Code Officiel Castors -->
          <div class="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            @if (qrDataUri) {
              <img [src]="qrDataUri" alt="QR Code" class="w-40 h-40 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            } @else {
              <div class="w-40 h-40 bg-white border border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400">QR Code</div>
            }
            <div class="mt-3 text-[11px] font-extrabold text-sn-green uppercase tracking-wider">
              Contrôle d'Accès Castors
            </div>
            <div class="text-[9px] font-mono text-slate-500 mt-1 break-all max-w-[170px]">
              {{ reservation?.qr_token || 'PERMIS-SN-CASTORS-RES-2026-MD98-SECURETOKEN' }}
            </div>
            <div class="text-[10px] text-slate-500 mt-2 font-medium">À présenter à l'agent d'accueil des Castors</div>
          </div>

        </div>

        <!-- Consignes bilingues -->
        <div class="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 mb-8">
          <div class="font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Consignes Importantes pour le Jour de l'Examen à Castors :</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 pl-1">
            <li>Présentez-vous impérativement <strong>30 minutes avant le créneau indiqué</strong> au Centre des Castors (Avenue Bourguiba).</li>
            <li>Munissez-vous de votre <strong>Carte Nationale d'Identité (CNI) originale</strong> et de cette convocation.</li>
            <li>L'agent scannera votre QR Code pour valider votre émargement. Tout retard entraînera l'annulation du créneau.</li>
          </ul>
        </div>

        <div class="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Document officiel généré numériquement — Centre National d'Examen du Permis de Conduire de Castors (Dakar, Sénégal)
        </div>

      </div>

    </div>
  `
})
export class CandidatConvocationComponent implements OnInit {
  private apiService = inject(ApiService);
  private wolofAudio = inject(WolofAudioService);

  reservation: any = null;
  candidat: any = null;
  qrDataUri: string | null = null;
  sessionDateFormatted = '15 Septembre 2026';
  sessionHeureDebut = '08:30';
  sessionHeureFin = '10:00';

  ngOnInit() {
    this.apiService.getActiveReservation().subscribe({
      next: (res) => {
        this.reservation = res.reservation;
        this.candidat = res.reservation?.candidat;
        this.qrDataUri = res.qr_data_uri || null;
        if (res.reservation?.session) {
          this.sessionDateFormatted = res.reservation.session.date_session;
          this.sessionHeureDebut = res.reservation.session.heure_debut;
          this.sessionHeureFin = res.reservation.session.heure_fin;
        }
      }
    });
  }

  ecouterEnWolof() {
    this.wolofAudio.speakConvocation(this.sessionDateFormatted, this.sessionHeureDebut);
  }

  imprimer() {
    window.print();
  }
}
