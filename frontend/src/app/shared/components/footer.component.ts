import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="no-print mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-white font-extrabold text-base">PERMIS<span class="text-sn-green">SN</span></span>
            </div>
            <p class="text-slate-400 text-xs leading-relaxed">
              Plateforme numérique nationale de gestion, de planification et de suivi des examens théoriques du Code de la route au Sénégal.
            </p>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Institutions</h4>
            <ul class="space-y-2">
              <li>Ministère des Transports Terrestres</li>
              <li>Direction des Transports Routiers (DTR)</li>
              <li>Division Nationale des Permis</li>
              <li>Centres Régionaux du Sénégal</li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Assistance & Contact</h4>
            <ul class="space-y-2">
              <li>Numéro Vert : <span class="text-emerald-400 font-semibold">800 00 20 20</span></li>
              <li>Email : contact&#64;permis.sn</li>
              <li>Horaires : Lun - Ven (08h00 - 17h00)</li>
              <li>Dakar, Castors, Sénégal</li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Cadre du Projet</h4>
            <div class="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span class="text-sn-yellow font-bold block mb-1">Projet de Soutenance</span>
              <p class="text-[11px] text-slate-300">
                Conception et développement d’une solution moderne d'optimisation du parcours candidat et de contrôle par QR Code.
              </p>
            </div>
          </div>

        </div>

        <div class="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; 2026 PermisSN — République du Sénégal. Tous droits réservés.
          </div>
          <div class="flex items-center gap-4">
            <span>Confidentialité</span>
            <span>Conditions d'utilisation</span>
            <span>Sécurité des données</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
