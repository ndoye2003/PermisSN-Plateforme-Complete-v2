<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Candidat;
use App\Models\Centre;
use App\Models\Salle;
use App\Models\SessionExamen;
use App\Models\Reservation;
use App\Models\Presence;
use App\Models\Resultat;
use App\Models\Question;
use App\Models\Reponse;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Mot de passe unique et sécurisé pour tous les comptes : Passer123#
        $adminPassword = Hash::make('Adm@2026!');
        $agentPassword = Hash::make('Agt@2026!');
        $candidatePassword = Hash::make('Cnd@2026!');

        // =========================================================================
        // 1. COMPTE ADMINISTRATEUR NATIONAL (Accès total au système)
        // =========================================================================
        $admin = User::updateOrCreate(['email' => 'admin@permis.sn'], [
            'name' => 'Administrateur PermisSN',
            'identifiant' => 'ADM-CAST-001',
            'password' => $adminPassword,
            'role' => 'admin',
            'is_active' => true,
        ]);

        // =========================================================================
        // 2. COMPTE AGENT OFFICIEL DU CENTRE DES CASTORS (Contrôle d'accès & Notes)
        // =========================================================================
        $agentCastors = User::updateOrCreate(['email' => 'agent.castors@permis.sn'], [
            'name' => 'Agent Centre Castors',
            'identifiant' => 'AGT-CAST-001',
            'password' => $agentPassword,
            'role' => 'agent',
            'is_active' => true,
        ]);

        // =========================================================================
        // 3. COMPTES CANDIDATS UTILISATEURS
        // =========================================================================
        $uMoussa = User::updateOrCreate(['email' => 'moussa.diop@permis.sn'], [
            'name' => 'Moussa Diop',
            'identifiant' => 'CND-2026-00001',
            'password' => $candidatePassword,
            'role' => 'candidat',
            'is_active' => true,
        ]);

        $uFatou = User::updateOrCreate(['email' => 'fatou.fall@permis.sn'], [
            'name' => 'Fatou Fall',
            'identifiant' => 'CND-2026-00002',
            'password' => $candidatePassword,
            'role' => 'candidat',
            'is_active' => true,
        ]);

        $uModou = User::updateOrCreate(['email' => 'modou.ndiaye@permis.sn'], [
            'name' => 'Modou Ndiaye',
            'identifiant' => 'CND-2026-00003',
            'password' => $candidatePassword,
            'role' => 'candidat',
            'is_active' => true,
        ]);

        // =========================================================================
        // 4. PROFILS CANDIDATS
        // =========================================================================
        $cMoussa = Candidat::updateOrCreate(['user_id' => $uMoussa->id], [
            'numero_candidat' => 'SN-2026-DK-00101',
            'telephone' => '778123456',
            'date_naissance' => '1998-04-12',
            'lieu_naissance' => 'Dakar',
            'nin' => '10819980412001',
            'adresse' => 'Grand Yoff, Dakar',
            'categorie_permis' => 'B',
            'statut_dossier' => 'valide',
        ]);

        $cFatou = Candidat::updateOrCreate(['user_id' => $uFatou->id], [
            'numero_candidat' => 'SN-2026-DK-00102',
            'telephone' => '765234567',
            'date_naissance' => '2001-09-23',
            'lieu_naissance' => 'Dakar',
            'nin' => '20120010923004',
            'adresse' => 'Médina Rue 22, Dakar',
            'categorie_permis' => 'B',
            'statut_dossier' => 'en_attente',
        ]);

        $cModou = Candidat::updateOrCreate(['user_id' => $uModou->id], [
            'numero_candidat' => 'SN-2026-DK-00103',
            'telephone' => '781987654',
            'date_naissance' => '1995-12-05',
            'lieu_naissance' => 'Pikine',
            'nin' => '19519951205002',
            'adresse' => 'Pikine Tally Boumack',
            'categorie_permis' => 'B',
            'statut_dossier' => 'incomplet',
        ]);

        // =========================================================================
        // 5. CENTRE D'EXAMEN OFFICIEL DE CASTORS (DAKAR)
        // =========================================================================
        $cCastors = Centre::updateOrCreate(['nom' => "Centre National d'Examen du Permis de Conduire de Castors"], [
            'adresse' => 'Avenue Bourguiba x Rue 11, Quartier Castors (Face Marché Castors)',
            'region' => 'Dakar',
            'ville' => 'Dakar (Castors)',
            'telephone' => '+221 33 824 12 12',
            'email' => 'centre.castors@permis.sn',
            'capacite_journaliere' => 250,
            'statut' => 'actif',
        ]);

        // Salles du centre
        $salle1 = Salle::updateOrCreate(['centre_id' => $cCastors->id, 'nom' => 'Salle Principale Théorique A (Castors)'], [
            'capacite' => 35,
            'statut' => 'disponible',
        ]);

        $salle2 = Salle::updateOrCreate(['centre_id' => $cCastors->id, 'nom' => 'Salle Numérique Informatique B (Castors)'], [
            'capacite' => 30,
            'statut' => 'disponible',
        ]);

        // =========================================================================
        // 6. SESSIONS D'EXAMEN REELLES A CASTORS
        // =========================================================================
        $session1 = SessionExamen::updateOrCreate([
            'centre_id' => $cCastors->id,
            'salle_id' => $salle1->id,
            'date_session' => now()->addDays(2)->toDateString(),
            'heure_debut' => '08:00:00',
        ], [
            'heure_fin' => '09:30:00',
            'categorie_permis' => 'B',
            'capacite_max' => 35,
            'statut' => 'ouverte',
        ]);

        $session2 = SessionExamen::updateOrCreate([
            'centre_id' => $cCastors->id,
            'salle_id' => $salle1->id,
            'date_session' => now()->addDays(2)->toDateString(),
            'heure_debut' => '10:00:00',
        ], [
            'heure_fin' => '11:30:00',
            'categorie_permis' => 'B',
            'capacite_max' => 35,
            'statut' => 'ouverte',
        ]);

        $session3 = SessionExamen::updateOrCreate([
            'centre_id' => $cCastors->id,
            'salle_id' => $salle2->id,
            'date_session' => now()->addDays(2)->toDateString(),
            'heure_debut' => '12:00:00',
        ], [
            'heure_fin' => '13:30:00',
            'categorie_permis' => 'B',
            'capacite_max' => 30,
            'statut' => 'ouverte',
        ]);

        // =========================================================================
        // 7. RESERVATION CONFIRMEE POUR LE CANDIDAT MOUSSA DIOP
        // =========================================================================
        $resMoussa = Reservation::updateOrCreate(['numero_reservation' => 'RES-CASTORS-2026-0001'], [
            'candidat_id' => $cMoussa->id,
            'session_id' => $session1->id,
            'qr_token' => 'PERMIS-SN-CASTORS-RES-2026-MD98-SECURETOKEN',
            'statut' => 'confirmee',
            'date_reservation' => now()->subDay(),
        ]);

        // =========================================================================
        // 8. BANQUE DE QUESTIONS DU CODE (BILINGUE FRANÇAIS & WOLOF)
        // =========================================================================
        $questionsData = [
            [
                'theme' => 'signalisation',
                'intitule' => 'Que signifie ce panneau triangulaire à fond blanc bordé de rouge avec deux flèches de sens opposé ?',
                'intitule_wolof' => 'Panneau bi am ñetti koñ te xonq, am ñaari fëc yu jëm ci ñaari wet, lan lay firndeel ?',
                'explication' => 'Ce panneau de danger annonce une circulation à double sens.',
                'explication_wolof' => 'Dafay wone ne tali bi léegi ñaari yoon lay doon : ñiy dem ak ñiy ñëw.',
                'reponses' => [
                    ['texte' => 'Circulation à double sens', 'texte_wolof' => 'Tali ñaari yoon (dem ak ñëw)', 'correct' => true],
                    ['texte' => 'Sens unique obligatoire', 'texte_wolof' => 'Benn yoon rekk nga mën a jëm', 'correct' => false],
                    ['texte' => 'Interdiction de dépasser', 'texte_wolof' => 'Tere nañu la dépasser', 'correct' => false],
                ]
            ],
            [
                'theme' => 'priorites',
                'intitule' => 'À une intersection sans aucune signalisation à Dakar, qui a la priorité ?',
                'intitule_wolof' => 'Bo demee ba ci croisement bu amul benn panneau wala feu rouge, kan mo wara jëkk a jàll ?',
                'explication' => 'La priorité à droite est la règle absolue en l\'absence de panneaux.',
                'explication_wolof' => 'Képp ku nekk ci sa ndeyjoor (droite), kooku moo la jëkk a jàll.',
                'reponses' => [
                    ['texte' => 'La priorité à droite', 'texte_wolof' => 'Ku nekk ci sa ndeyjoor moo la jëkk', 'correct' => true],
                    ['texte' => 'La priorité à gauche', 'texte_wolof' => 'Ku nekk ci sa càmmooñ (gauche)', 'correct' => false],
                    ['texte' => 'Le véhicule le plus rapide', 'texte_wolof' => 'Oto bi gën a gaaw', 'correct' => false],
                ]
            ],
            [
                'theme' => 'priorites',
                'intitule' => 'Au carrefour giratoire (rond-point) au Sénégal, qui doit passer en premier ?',
                'intitule_wolof' => 'Ci rond-point bi, kan mo wara jëkk a jàll ?',
                'explication' => 'Les véhicules déjà engagés sur le rond-point ont la priorité.',
                'explication_wolof' => 'Borom oto yi nekk ba noppi ci biir rond-point bi ñooy jëkk a jàll bala ngay dugg.',
                'reponses' => [
                    ['texte' => 'Les véhicules déjà engagés sur le rond-point', 'texte_wolof' => 'Ñi nekk ba noppi ci biir rond-point bi', 'correct' => true],
                    ['texte' => 'Les véhicules qui arrivent pour entrer', 'texte_wolof' => 'Ñiy soga ñëw ci rond-point bi', 'correct' => false],
                ]
            ],
            [
                'theme' => 'regles',
                'intitule' => 'Quelle est la vitesse maximale autorisée en ville / agglomération à Dakar ?',
                'intitule_wolof' => 'Ci biir dëkk bi (Dakar), ban vitesse nga warul romb ?',
                'explication' => 'La vitesse en agglomération est limitée à 50 km/h pour la sécurité de tous.',
                'explication_wolof' => 'Waroo romb 50 km/h ci biir dëkk ngir bañ a am accident ak piéton yi.',
                'reponses' => [
                    ['texte' => '50 km/h', 'texte_wolof' => '50 km/h rekk ci biir dëkk', 'correct' => true],
                    ['texte' => '60 km/h', 'texte_wolof' => '60 km/h', 'correct' => false],
                    ['texte' => '70 km/h', 'texte_wolof' => '70 km/h', 'correct' => false],
                ]
            ],
            [
                'theme' => 'securite_vitesse',
                'intitule' => 'Le port de la ceinture de sécurité est-il obligatoire pour tous les passagers ?',
                'intitule_wolof' => 'Ndax ceinture de sécurité bi war na ci ñépp ñi toog ci oto bi ?',
                'explication' => 'La ceinture de sécurité est obligatoire à l\'avant comme à l\'arrière.',
                'explication_wolof' => 'Waaw, chauffeur bi ak ñépp ñi toog ci ginnaaw war nañu takk sen ceinture.',
                'reponses' => [
                    ['texte' => 'Oui, pour tous les passagers à bord', 'texte_wolof' => 'Waaw, ñépp war nañu ko takk', 'correct' => true],
                    ['texte' => 'Non, uniquement pour le chauffeur', 'texte_wolof' => 'Déedéet, chauffeur bi rekk', 'correct' => false],
                ]
            ]
        ];

        foreach ($questionsData as $item) {
            $q = Question::updateOrCreate(
                ['intitule' => $item['intitule']],
                [
                    'theme' => $item['theme'],
                    'intitule_wolof' => $item['intitule_wolof'],
                    'explication' => $item['explication'],
                    'explication_wolof' => $item['explication_wolof'],
                ]
            );

            foreach ($item['reponses'] as $rep) {
                Reponse::updateOrCreate([
                    'question_id' => $q->id,
                    'texte' => $rep['texte'],
                ], [
                    'texte_wolof' => $rep['texte_wolof'],
                    'est_correcte' => $rep['correct'],
                ]);
            }
        }
    }
}
