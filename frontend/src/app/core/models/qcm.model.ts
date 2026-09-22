export type ThemeQcm = 'signalisation' | 'priorites' | 'regles' | 'securite_vitesse';

export interface ReponseQcm {
  id: number;
  question_id: number;
  texte: string;
}

export interface QuestionQcm {
  id: number;
  theme: ThemeQcm;
  intitule: string;
  illustration_url?: string;
  explication?: string;
  reponses: ReponseQcm[];
}

export interface ResultatQcm {
  score_global: number;
  total_questions: number;
  pourcentage_global: number;
  theme_stats: {
    [key in ThemeQcm]?: {
      total: number;
      correct: number;
      score: number;
    };
  };
  recommandation: string;
  details: {
    question_id: number;
    intitule: string;
    theme: ThemeQcm;
    est_correct: boolean;
    bonne_reponse: string;
    explication?: string;
  }[];
}
