import { CategoriePermis } from './candidat.model';

export interface SessionExamen {
  id: number;
  centre_id: number;
  centre_nom?: string;
  centre_ville?: string;
  centre_adresse?: string;
  salle_id: number;
  salle_nom?: string;
  categorie_permis: CategoriePermis;
  date_session: string;
  heure_debut: string;
  heure_fin: string;
  capacite_max: number;
  places_reservees: number;
  places_restantes: number;
  est_pleine?: boolean;
  statut: 'ouverte' | 'fermee' | 'en_cours' | 'terminee' | 'annulee';
}
