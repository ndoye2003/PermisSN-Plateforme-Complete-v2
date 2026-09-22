import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { WolofAudioService } from '../../core/services/wolof-audio.service';
import { QuestionQcm, ResultatQcm } from '../../core/models/qcm.model';

interface ExtendedQuestion extends QuestionQcm {
  intitule_wolof?: string;
  explication_wolof?: string;
  reponses: {
    id: number;
    question_id: number;
    texte: string;
    texte_wolof?: string;
  }[];
}

@Component({
  selector: 'app-qcm-training',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête avec mention Wolof -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-full text-xs uppercase tracking-wider mb-2">
          <span>🇸🇳 BILINGUE : FRANÇAIS & AUDIO WOLOF</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Entraînement au Code avec Audio Wolof
        </h1>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          Spécialement conçu pour les candidats au Centre des Castors : vous pouvez écouter chaque question et chaque réponse à voix haute en Wolof.
        </p>
      </div>

      <!-- Mode Quiz en cours -->
      @if (!resultat) {
        <div class="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          
          <!-- Barre d'avancement & Bouton Écouter Question -->
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Question {{ currentIndex + 1 }} sur {{ questions.length }}</span>
            
            <button (click)="ecouterQuestion()" 
                    class="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition flex items-center gap-1.5">
              <span class="text-sm">🔊</span>
              <span>Déglul lajj bi ci Wolof (Écouter)</span>
            </button>
          </div>

          <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8">
            <div class="bg-sn-green h-full transition-all duration-300 rounded-full"
                 [style.width.%]="((currentIndex + 1) / questions.length) * 100"></div>
          </div>

          <!-- Question Actuelle Bilingue -->
          @if (currentQuestion) {
            <div class="mb-6">
              <!-- Question en Français -->
              <h2 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {{ currentQuestion.intitule }}
              </h2>

              <!-- Question en Wolof (Mise en avant pour non-francophones) -->
              @if (currentQuestion.intitule_wolof) {
                <div class="mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <span class="text-lg">📢</span>
                  <div>
                    <span class="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider block">Ci Wolof :</span>
                    <p class="text-sm font-semibold text-amber-950 mt-0.5">
                      « {{ currentQuestion.intitule_wolof }} »
                    </p>
                  </div>
                </div>
              }
            </div>

            <!-- Liste des Réponses (Français + Wolof) -->
            <div class="space-y-3 mb-8">
              @for (rep of currentQuestion.reponses; track rep.id) {
                <button (click)="selectOption(rep.id)" 
                        class="w-full p-4 rounded-2xl border text-left text-sm transition flex items-center justify-between group"
                        [ngClass]="answers[currentQuestion.id] === rep.id ? 'border-sn-green bg-emerald-50/70 text-emerald-950 font-bold shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'">
                  <div>
                    <span class="block">{{ rep.texte }}</span>
                    @if (rep.texte_wolof) {
                      <span class="block text-xs text-amber-800/90 font-medium italic mt-0.5">
                        🗣️ {{ rep.texte_wolof }}
                      </span>
                    }
                  </div>

                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition"
                       [ngClass]="answers[currentQuestion.id] === rep.id ? 'border-sn-green bg-sn-green text-white' : 'border-slate-300'">
                    @if (answers[currentQuestion.id] === rep.id) {
                      <span class="text-xs">✓</span>
                    }
                  </div>
                </button>
              }
            </div>

            <!-- Navigation -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100">
              <button (click)="prevQuestion()" [disabled]="currentIndex === 0"
                      class="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30">
                ← Précédent
              </button>

              @if (currentIndex < questions.length - 1) {
                <button (click)="nextQuestion()" 
                        class="px-6 py-2.5 rounded-xl bg-sn-green hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-sn-green/20 transition">
                  Question Suivante →
                </button>
              } @else {
                <button (click)="submitTest()" 
                        class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition">
                  Terminer & Calculer mon Score 🏁
                </button>
              }
            </div>
          }

        </div>
      }

      <!-- Mode Résultats avec Recommandation -->
      @if (resultat) {
        <div class="space-y-8 animate-fadeIn">
          
          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Score Obtenu au Test Blanc</span>
            <div class="text-5xl font-extrabold text-slate-900 my-2">
              {{ resultat.score_global }} <span class="text-2xl text-slate-400">/ {{ resultat.total_questions }}</span>
            </div>
            <div class="inline-block px-4 py-1.5 rounded-full font-bold text-xs"
                 [ngClass]="resultat.pourcentage_global >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
              {{ resultat.pourcentage_global }} % de réussite
            </div>

            <!-- Bouton Audio Recommandation -->
            <div class="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-1">
                  <span>💡</span>
                  <span>Conseil Pédagogique du Système :</span>
                </div>
                <p class="text-xs text-indigo-950 font-medium leading-relaxed">
                  {{ resultat.recommandation }}
                </p>
              </div>

              <button (click)="ecouterRecommandation()" 
                      class="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5">
                <span>🔊</span>
                <span>Déglul conseil bi</span>
              </button>
            </div>
          </div>

          <!-- Détail par Thème -->
          <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6">
              Performances par Thème
            </h3>

            <div class="space-y-5">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                  <span class="text-slate-700">1. Signalisation Routière</span>
                  <span class="text-emerald-700 font-mono">{{ resultat.theme_stats['signalisation']?.score || 0 }} %</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-sn-green h-full rounded-full" [style.width.%]="resultat.theme_stats['signalisation']?.score || 0"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                  <span class="text-slate-700">2. Règles de Priorité</span>
                  <span class="text-amber-600 font-mono">{{ resultat.theme_stats['priorites']?.score || 0 }} %</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" [style.width.%]="resultat.theme_stats['priorites']?.score || 0"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                  <span class="text-slate-700">3. Vitesse & Sécurité à Dakar</span>
                  <span class="text-emerald-700 font-mono">{{ resultat.theme_stats['securite_vitesse']?.score || 0 }} %</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-sn-green h-full rounded-full" [style.width.%]="resultat.theme_stats['securite_vitesse']?.score || 0"></div>
                </div>
              </div>
            </div>

            <div class="mt-8 text-center">
              <button (click)="restart()" 
                      class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow transition">
                Refaire un Test d'Entraînement ↺
              </button>
            </div>
          </div>

        </div>
      }

    </div>
  `
})
export class QcmTrainingComponent implements OnInit {
  private apiService = inject(ApiService);
  private wolofAudio = inject(WolofAudioService);

  questions: ExtendedQuestion[] = [
    {
      id: 1,
      theme: 'signalisation',
      intitule: 'Que signifie un panneau triangulaire à fond blanc bordé de rouge avec deux flèches de sens opposé ?',
      intitule_wolof: 'Panneau bi am ñetti koñ te xonq, am ñaari fëc yu jëm ci ñaari wet, lan lay firndeel ?',
      explication: 'Ce panneau annonce que la circulation se fait désormais à double sens.',
      reponses: [
        { id: 1, question_id: 1, texte: 'Circulation à double sens', texte_wolof: 'Tali ñaari yoon (dem ak ñëw)' },
        { id: 2, question_id: 1, texte: 'Sens unique obligatoire', texte_wolof: 'Benn yoon rekk nga mën a jëm' },
        { id: 3, question_id: 1, texte: 'Interdiction de dépasser', texte_wolof: 'Tere nañu la dépasser' },
      ]
    },
    {
      id: 2,
      theme: 'priorites',
      intitule: 'À une intersection sans aucune signalisation à Dakar, qui a la priorité ?',
      intitule_wolof: 'Bo demee ba ci croisement bu amul benn panneau wala feu rouge, kan mo wara jëkk a jàll ?',
      explication: 'En l\'absence de signalisation, la priorité à droite s\'applique obligatoirement.',
      reponses: [
        { id: 4, question_id: 2, texte: 'La priorité à droite', texte_wolof: 'Ku nekk ci sa ndeyjoor moo la jëkk' },
        { id: 5, question_id: 2, texte: 'La priorité à gauche', texte_wolof: 'Ku nekk ci sa càmmooñ' },
        { id: 6, question_id: 2, texte: 'Le véhicule le plus rapide', texte_wolof: 'Oto bi gën a gaaw' },
      ]
    },
    {
      id: 3,
      theme: 'priorites',
      intitule: 'Au carrefour giratoire (rond-point), qui doit passer en premier ?',
      intitule_wolof: 'Ci rond-point bi, kan mo wara jëkk a jàll ?',
      explication: 'Les véhicules déjà engagés sur le rond-point ont la priorité absolue.',
      reponses: [
        { id: 7, question_id: 3, texte: 'Les véhicules circulant sur l\'anneau', texte_wolof: 'Ñi nekk ba noppi ci biir rond-point bi' },
        { id: 8, question_id: 3, texte: 'Les véhicules qui arrivent pour entrer', texte_wolof: 'Ñiy soga dugg' },
      ]
    },
    {
      id: 4,
      theme: 'regles',
      intitule: 'Quelle est la vitesse maximale en agglomération / ville à Dakar ?',
      intitule_wolof: 'Ci biir dëkk bi (Dakar), ban vitesse nga warul romb ?',
      explication: 'La vitesse maximale est de 50 km/h en ville pour la sécurité de tous.',
      reponses: [
        { id: 9, question_id: 4, texte: '50 km/h', texte_wolof: '50 km/h rekk ci biir dëkk' },
        { id: 10, question_id: 4, texte: '80 km/h', texte_wolof: '80 km/h' },
        { id: 11, question_id: 4, texte: '30 km/h', texte_wolof: '30 km/h' },
      ]
    },
    {
      id: 5,
      theme: 'securite_vitesse',
      intitule: 'Le port de la ceinture de sécurité est-il obligatoire pour tous les passagers ?',
      intitule_wolof: 'Ndax ceinture de sécurité bi war na ci ñépp ñi toog ci oto bi ?',
      explication: 'Oui, obligatoire pour le conducteur et tous les passagers.',
      reponses: [
        { id: 12, question_id: 5, texte: 'Oui, pour tous les passagers à bord', texte_wolof: 'Waaw, ñépp war nañu ko takk' },
        { id: 13, question_id: 5, texte: 'Non, uniquement pour le chauffeur', texte_wolof: 'Déedéet, chauffeur bi rekk' },
      ]
    }
  ];

  currentIndex = 0;
  answers: { [qId: number]: number } = {};
  resultat: ResultatQcm | null = null;

  get currentQuestion(): ExtendedQuestion | undefined {
    return this.questions[this.currentIndex];
  }

  ngOnInit() {
    this.apiService.getQcmQuestions().subscribe(res => {
      if (res && res.length > 0) {
        // Fusion des questions avec enrichissement wolof
      }
    });
  }

  ecouterQuestion() {
    if (this.currentQuestion?.intitule_wolof) {
      let speech = this.currentQuestion.intitule_wolof + ". ";
      this.currentQuestion.reponses.forEach((r, idx) => {
        speech += `Option ${idx + 1} : ${r.texte_wolof || r.texte}. `;
      });
      this.wolofAudio.speak(speech);
    }
  }

  ecouterRecommandation() {
    if (this.resultat?.recommandation) {
      this.wolofAudio.speak(this.resultat.recommandation);
    }
  }

  selectOption(reponseId: number) {
    if (this.currentQuestion) {
      this.answers[this.currentQuestion.id] = reponseId;
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitTest() {
    const correctMap: { [qId: number]: number } = { 1: 1, 2: 4, 3: 7, 4: 9, 5: 12 };
    let correct = 0;
    const total = this.questions.length;

    Object.keys(correctMap).forEach(qStr => {
      const qId = parseInt(qStr);
      if (this.answers[qId] === correctMap[qId]) correct++;
    });

    const pct = Math.round((correct / total) * 100);
    this.resultat = {
      score_global: correct,
      total_questions: total,
      pourcentage_global: pct,
      theme_stats: {
        signalisation: { total: 1, correct: this.answers[1] === 1 ? 1 : 0, score: this.answers[1] === 1 ? 100 : 0 },
        priorites: { total: 2, correct: (this.answers[2] === 4 ? 1 : 0) + (this.answers[3] === 7 ? 1 : 0), score: Math.round(((this.answers[2] === 4 ? 1 : 0) + (this.answers[3] === 7 ? 1 : 0)) / 2 * 100) },
        regles: { total: 1, correct: this.answers[4] === 9 ? 1 : 0, score: this.answers[4] === 9 ? 100 : 0 },
        securite_vitesse: { total: 1, correct: this.answers[5] === 12 ? 1 : 0, score: this.answers[5] === 12 ? 100 : 0 },
      },
      recommandation: pct >= 80 
        ? 'Jërejëf ! Am nga score bu baax. Yaa ngi waajal bu baax sa examen ci centre Castors.' 
        : 'Dangay gën a réviser priorité yi ak vitesse bi bala ngay dem ci centre Castors.',
      details: []
    };
  }

  restart() {
    this.answers = {};
    this.currentIndex = 0;
    this.resultat = null;
  }
}
