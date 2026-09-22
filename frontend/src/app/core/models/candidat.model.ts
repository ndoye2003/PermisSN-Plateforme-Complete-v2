export type StatutDossier = 'incomplet' | 'en_attente' | 'valide' | 'rejete';
export type CategoriePermis = 'A' | 'B' | 'C' | 'D' | 'TOUS';

export interface DocumentCandidat {
  id: number;
  candidat_id: number;
  type_document: 'cni' | 'certificat_medical' | 'photo_identite' | 'quittance';
  nom_original?: string;
  fichier_path: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  motif_rejet?: string;
  created_at: string;
}

export interface Candidat {
  id: number;
  user_id: number;
  numero_candidat: string;
  telephone: string;
  date_naissance?: string;
  lieu_naissance?: string;
  nin?: string;
  adresse?: string;
  categorie_permis: CategoriePermis;
  statut_dossier: StatutDossier;
  motif_rejet?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  documents?: DocumentCandidat[];
  reservations?: any[];
  resultats?: any[];
}
