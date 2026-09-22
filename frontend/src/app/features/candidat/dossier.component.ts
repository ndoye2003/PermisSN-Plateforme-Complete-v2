import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-candidat-dossier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Dossier Administratif & Justificatifs</h1>
        <p class="text-sm text-slate-500 mt-1">
          Téléversez vos pièces obligatoires. Une fois approuvées par l'administration, vous pourrez réserver votre session d'examen.
        </p>
      </div>

      <!-- Alerte Statut -->
      <div class="mb-8 p-4 rounded-2xl border flex items-center justify-between gap-4"
           [ngClass]="{
             'bg-emerald-50 border-emerald-200 text-emerald-900': statut === 'valide',
             'bg-amber-50 border-amber-200 text-amber-900': statut === 'en_attente',
             'bg-red-50 border-red-200 text-red-900': statut === 'rejete',
             'bg-slate-50 border-slate-200 text-slate-700': statut === 'incomplet'
           }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
               [ngClass]="{
                 'bg-sn-green text-white': statut === 'valide',
                 'bg-amber-500 text-white': statut === 'en_attente',
                 'bg-red-600 text-white': statut === 'rejete',
                 'bg-slate-300 text-slate-700': statut === 'incomplet'
               }">
            {{ statut === 'valide' ? '✓' : (statut === 'rejete' ? '✕' : '!') }}
          </div>
          <div>
            <div class="font-bold text-sm">
              Statut du dossier : <span class="uppercase tracking-wider font-extrabold">{{ statut }}</span>
            </div>
            <div class="text-xs opacity-80 mt-0.5">
              @if (statut === 'valide') { Votre dossier est validé. Vous pouvez dès maintenant choisir une session. }
              @else if (statut === 'en_attente') { Dossier soumis. Les agents examinent vos pièces. }
              @else if (statut === 'rejete') { Motif du rejet : {{ motifRejet || 'Pièce illisible ou non conforme.' }} }
              @else { Veuillez fournir au minimum votre CNI et votre certificat médical. }
            </div>
          </div>
        </div>
      </div>

      <!-- Cartes d'upload des documents -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <!-- CNI -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-slate-900">1. Carte Nationale d'Identité (CNI)</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  [ngClass]="hasDoc('cni') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
              {{ hasDoc('cni') ? 'Téléversé' : 'Requis' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">Recto-verso lisible, format PDF ou image (max 5 Mo).</p>
          <input type="file" (change)="onFileSelected($event, 'cni')" class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-sn-green hover:file:bg-emerald-100 cursor-pointer">
        </div>

        <!-- Certificat Médical -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-slate-900">2. Certificat Médical d'Aptitude</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  [ngClass]="hasDoc('certificat_medical') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
              {{ hasDoc('certificat_medical') ? 'Téléversé' : 'Requis' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">Délivré par un médecin agréé au Sénégal (vue, réflexes).</p>
          <input type="file" (change)="onFileSelected($event, 'certificat_medical')" class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-sn-green hover:file:bg-emerald-100 cursor-pointer">
        </div>

        <!-- Photo d'Identité -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-slate-900">3. Photo d'Identité Récente</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  [ngClass]="hasDoc('photo_identite') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
              {{ hasDoc('photo_identite') ? 'Téléversé' : 'Optionnel' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">Format photo d'identité fond neutre.</p>
          <input type="file" (change)="onFileSelected($event, 'photo_identite')" class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-sn-green hover:file:bg-emerald-100 cursor-pointer">
        </div>

        <!-- Quittance / Reçu -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-slate-900">4. Quittance des Droits d'Examen</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  [ngClass]="hasDoc('quittance') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
              {{ hasDoc('quittance') ? 'Téléversé' : 'Optionnel' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">Reçu de paiement Trésor Public / Wave / Orange Money.</p>
          <input type="file" (change)="onFileSelected($event, 'quittance')" class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-sn-green hover:file:bg-emerald-100 cursor-pointer">
        </div>

      </div>

      <!-- Message succès upload -->
      @if (uploadMessage) {
        <div class="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center">
          {{ uploadMessage }}
        </div>
      }

    </div>
  `
})
export class CandidatDossierComponent implements OnInit {
  private apiService = inject(ApiService);

  statut: string = 'incomplet';
  motifRejet: string = '';
  documents: any[] = [];
  uploadMessage = '';

  ngOnInit() {
    this.apiService.getCandidatProfile().subscribe({
      next: (res) => {
        this.statut = res.candidat.statut_dossier;
        this.motifRejet = res.candidat.motif_rejet;
        this.documents = res.candidat.documents || [];
      }
    });
  }

  hasDoc(type: string): boolean {
    return this.documents.some(d => d.type_document === type);
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('fichier', file);
      formData.append('type_document', type);

      this.apiService.uploadDocument(formData).subscribe({
        next: (res) => {
          this.uploadMessage = 'Pièce justificative téléversée avec succès !';
          this.documents.push({ type_document: type, nom_original: file.name, statut: 'en_attente' });
          if (this.statut === 'incomplet') this.statut = 'en_attente';
          setTimeout(() => this.uploadMessage = '', 4000);
        }
      });
    }
  }
}
