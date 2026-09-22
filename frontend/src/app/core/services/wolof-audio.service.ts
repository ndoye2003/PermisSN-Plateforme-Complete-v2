import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WolofAudioService {
  isSpeaking = signal<boolean>(false);
  wolofMode = signal<boolean>(true); // Activé par défaut pour l'accessibilité

  /**
   * Lit un texte en Wolof à voix haute via l'API Web Speech du navigateur
   */
  speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('La synthèse vocale n\'est pas supportée par ce navigateur.');
      return;
    }

    // Si une lecture est déjà en cours, on l'arrête
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // On utilise un débit clair et posé
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = 'fr-FR'; // Voix francophone adaptée avec phonétique wolof

    utterance.onstart = () => {
      this.isSpeaking.set(true);
    };

    utterance.onend = () => {
      this.isSpeaking.set(false);
    };

    utterance.onerror = () => {
      this.isSpeaking.set(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking.set(false);
    }
  }

  toggleWolofMode(): void {
    this.wolofMode.update(val => !val);
  }

  // Messages vocaux clés pré-enregistrés en Wolof
  speakAccueil(): void {
    this.speak(
      "Dalal ak jamm ci PermisSN ! Fi mën nga fi jël sa rendez-vous ci centre d'examen bu Castors ci Dakar. " +
      "Doo fi toog di xaar suba teel ci 5h du matin. Dangay jël sa créneau horodaté, ñu jox la sa convocation bu am QR code sécurisé."
    );
  }

  speakConvocation(date: string, heure: string): void {
    this.speak(
      `Dangay ñëw 30 minutes bala examen bi di tambali ci centre bu Castors ci Avenue Bourguiba. ` +
      `Sa date examen moo di le ${date} ci ${heure}. Yoreel sa carte d'identité ak sa convocation bi am QR code. ` +
      `Agent bi dafay scan sa code ngir enregistrer ne ñëw nga.`
    );
  }

  speakReservationGuide(): void {
    this.speak(
      "Tànnal heure bi la gën ci centre bu Castors. Soo ko réservé ba noppi, sa convocation dafay génn ci sassa. " +
      "Doo soxla di dem di taxaw ba guddi."
    );
  }
}
