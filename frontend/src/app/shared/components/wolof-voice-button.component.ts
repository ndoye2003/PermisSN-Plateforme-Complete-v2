import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WolofAudioService } from '../../core/services/wolof-audio.service';

@Component({
  selector: 'app-wolof-voice-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleAudio()" 
            [title]="label"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm border"
            [ngClass]="wolofAudio.isSpeaking() ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' : 'bg-emerald-50 text-sn-green border-emerald-200 hover:bg-emerald-100'">
      <span class="text-sm">🔊</span>
      <span>{{ wolofAudio.isSpeaking() ? 'Dañuy wax...' : label }}</span>
    </button>
  `
})
export class WolofVoiceButtonComponent {
  @Input() textToSpeak = '';
  @Input() label = 'Déglul ci Wolof (Écouter)';

  wolofAudio = inject(WolofAudioService);

  toggleAudio(): void {
    if (this.wolofAudio.isSpeaking()) {
      this.wolofAudio.stop();
    } else {
      this.wolofAudio.speak(this.textToSpeak);
    }
  }
}
