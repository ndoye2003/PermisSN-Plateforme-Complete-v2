import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { QcmTrainingComponent } from './features/candidat/qcm.component';
import { CandidatDashboardComponent } from './features/candidat/dashboard.component';
import { CandidatDossierComponent } from './features/candidat/dossier.component';
import { CandidatReservationComponent } from './features/candidat/reservation.component';
import { CandidatConvocationComponent } from './features/candidat/convocation.component';
import { AgentDashboardComponent } from './features/agent/dashboard.component';
import { AgentScanComponent } from './features/agent/scan.component';
import { AgentEmargementComponent } from './features/agent/emargement.component';
import { AdminDashboardComponent } from './features/admin/dashboard.component';
import { AdminCandidatsComponent } from './features/admin/candidats.component';
import { AdminUsersComponent } from './features/admin/users.component';
import { AdminSmartSchedulingComponent } from './features/admin/smart-scheduling.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Routes Publiques
  { path: '', component: HomeComponent, title: 'PermisSN — Accueil' },
  { path: 'connexion', component: LoginComponent, title: 'PermisSN — Connexion' },
  { path: 'inscription', component: RegisterComponent, title: 'PermisSN — Inscription' },
  { path: 'entrainement', component: QcmTrainingComponent, title: 'PermisSN — Test QCM Code' },

  // Espace Candidat
  {
    path: 'candidat',
    canActivate: [authGuard, roleGuard(['candidat', 'admin'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CandidatDashboardComponent, title: 'PermisSN — Espace Candidat' },
      { path: 'dossier', component: CandidatDossierComponent, title: 'PermisSN — Dépôt Dossier' },
      { path: 'reservation', component: CandidatReservationComponent, title: 'PermisSN — Réservation Créneau' },
      { path: 'convocation', component: CandidatConvocationComponent, title: 'PermisSN — Convocation Officielle' },
    ]
  },

  // Espace Agent de Centre
  {
    path: 'agent',
    canActivate: [authGuard, roleGuard(['agent', 'admin'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AgentDashboardComponent, title: 'PermisSN — Espace Agent' },
      { path: 'scan', component: AgentScanComponent, title: 'PermisSN — Scanner QR Code' },
      { path: 'emargement/:sessionId', component: AgentEmargementComponent, title: 'PermisSN — Émargement' },
      { path: 'emargement', component: AgentEmargementComponent, title: 'PermisSN — Émargement' },
    ]
  },

  // Espace Administrateur
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, title: 'PermisSN — Dashboard Admin' },
      { path: 'candidats', component: AdminCandidatsComponent, title: 'PermisSN — Validation Dossiers' },
      { path: 'smart-scheduling', component: AdminSmartSchedulingComponent, title: 'PermisSN — Smart Scheduling' },
      { path: 'utilisateurs', component: AdminUsersComponent, title: 'PermisSN — Gestion des comptes' },
    ]
  },

  // Redirection par défaut
  { path: '**', redirectTo: '' }
];
