import { Candidat } from './candidat.model';
import { SessionExamen } from './session.model';

export interface Reservation {
  id: number;
  candidat_id: number;
  session_id: number;
  numero_reservation: string;
  qr_token: string;
  statut: 'confirmee' | 'annulee' | 'terminee';
  date_reservation: string;
  candidat?: Candidat;
  session?: SessionExamen;
  presence?: {
    id: number;
    date_scan: string;
    heure_scan: string;
    statut: 'present' | 'absent' | 'retard';
    remarques?: string;
  };
  resultat?: {
    id: number;
    score: number;
    total_points: number;
    statut: 'admis' | 'ajourne';
    observations?: string;
    date_resultat: string;
  };
}
