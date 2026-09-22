import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-users', standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div class="bg-slate-900 text-white rounded-3xl p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div><p class="text-xs uppercase tracking-widest text-emerald-300 font-bold">Administration</p><h1 class="text-2xl font-black">Comptes utilisateurs</h1><p class="text-xs text-slate-300 mt-1">Création, activation et contrôle des comptes Admin, Agent et Candidat.</p></div>
      <button (click)="showForm=!showForm" class="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold">+ Nouveau compte</button>
    </div>

    @if(showForm){
      <form (ngSubmit)="create()" class="bg-white p-6 rounded-3xl border border-slate-200 grid md:grid-cols-2 gap-4">
        <input [(ngModel)]="form.name" name="name" required placeholder="Nom complet" class="px-4 py-3 rounded-xl border">
        <input [(ngModel)]="form.identifiant" name="identifiant" required placeholder="Identifiant unique (ex: AGT-CAST-002)" class="px-4 py-3 rounded-xl border uppercase">
        <input [(ngModel)]="form.email" name="email" type="email" required placeholder="Email" class="px-4 py-3 rounded-xl border">
        <select [(ngModel)]="form.role" name="role" class="px-4 py-3 rounded-xl border"><option value="agent">Agent</option><option value="admin">Administrateur</option><option value="candidat">Candidat</option></select>
        <input [(ngModel)]="form.password" name="password" type="password" required minlength="8" placeholder="Mot de passe initial" class="px-4 py-3 rounded-xl border">
        <button class="px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm">Créer le compte</button>
        @if(message){<p class="md:col-span-2 text-xs font-bold text-emerald-700">{{message}}</p>}
      </form>
    }

    <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div class="p-5 flex flex-col md:flex-row gap-3 border-b"><input [(ngModel)]="search" (input)="load()" placeholder="Rechercher nom, identifiant ou email..." class="flex-1 px-4 py-3 rounded-xl border"><select [(ngModel)]="role" (change)="load()" class="px-4 py-3 rounded-xl border"><option value="">Tous les rôles</option><option value="admin">Administrateur</option><option value="agent">Agent</option><option value="candidat">Candidat</option></select></div>
      <div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="p-4 text-left">Nom</th><th class="p-4 text-left">Identifiant</th><th class="p-4 text-left">Rôle</th><th class="p-4 text-left">Statut</th><th class="p-4 text-right">Action</th></tr></thead><tbody>
      @for(u of users; track u.id){<tr class="border-t"><td class="p-4 font-bold">{{u.name}}<div class="text-xs text-slate-500">{{u.email}}</div></td><td class="p-4 font-mono text-xs">{{u.identifiant}}</td><td class="p-4 uppercase text-xs font-bold">{{u.role}}</td><td class="p-4"><span [class]="u.is_active?'text-emerald-700':'text-red-700'">{{u.is_active?'Actif':'Désactivé'}}</span></td><td class="p-4 text-right"><button (click)="toggle(u)" class="text-xs font-bold text-blue-700 mr-3">{{u.is_active?'Désactiver':'Activer'}}</button><button (click)="remove(u)" class="text-xs font-bold text-red-700">Supprimer</button></td></tr>}
      </tbody></table></div>
    </div>
  </div>`
})
export class AdminUsersComponent implements OnInit {
  private api=inject(ApiService); users:any[]=[]; search=''; role=''; showForm=false; message='';
  form:any={name:'',identifiant:'',email:'',role:'agent',password:''};
  ngOnInit(){this.load();}
  load(){this.api.getAdminUsers({search:this.search,role:this.role}).subscribe({next:r=>this.users=r});}
  create(){this.message='';this.api.createAdminUser(this.form).subscribe({next:r=>{this.message=r.message;this.form={name:'',identifiant:'',email:'',role:'agent',password:''};this.load();},error:e=>this.message=e?.error?.message||'Erreur de création.'});}
  toggle(u:any){this.api.updateAdminUser(u.id,{is_active:!u.is_active}).subscribe(()=>this.load());}
  remove(u:any){if(confirm(`Supprimer le compte ${u.identifiant} ?`))this.api.deleteAdminUser(u.id).subscribe(()=>this.load());}
}
