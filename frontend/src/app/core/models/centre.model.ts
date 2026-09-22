export interface Centre {
  id: number;
  nom: string;
  adresse: string;
  region: string;
  ville: string;
  telephone?: string;
  email?: string;
  capacite_journaliere: number;
  statut: 'actif' | 'inactif';
  nombre_salles?: number;
  prochaines_sessions_ouvertes?: number;
  salles?: Salle[];
}

export interface Salle {
  id: number;
  centre_id: number;
  nom: string;
  capacite: number;
  statut: 'disponible' | 'maintenance' | 'indisponible';
}
