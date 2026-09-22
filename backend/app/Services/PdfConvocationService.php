<?php

namespace App\Services;

use App\Models\Reservation;

class PdfConvocationService
{
    /**
     * Génère la structure HTML complète de la convocation officielle PermisSN
     * Centre National d'Examen du Permis de Conduire de Castors (Dakar)
     */
    public static function generateHtml(Reservation $reservation): string
    {
        $candidat = $reservation->candidat;
        $user = $candidat->user;
        $session = $reservation->session;
        $centre = $session->centre;
        $salle = $session->salle;

        $qrDataUri = QrCodeService::generateDataUri($reservation->qr_token, 180);

        $dateFormatted = date('d/m/Y', strtotime($session->date_session));
        $heureDebut = substr($session->heure_debut, 0, 5);
        $heureFin = substr($session->heure_fin, 0, 5);

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Convocation Officielle - {$reservation->numero_reservation}</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.4; margin: 0; background: #fff; }
        .header { text-align: center; border-bottom: 2px solid #00853F; padding-bottom: 12px; margin-bottom: 15px; }
        .republique { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #00853F; }
        .devise { font-size: 11px; font-style: italic; color: #64748b; margin-bottom: 6px; }
        .ministere { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #0f172a; }
        .direction { font-size: 11px; color: #334155; font-weight: 500; }
        
        .flag-bar { display: flex; height: 4px; margin: 8px auto; width: 140px; border-radius: 2px; overflow: hidden; }
        .flag-g { flex: 1; background-color: #00853F; }
        .flag-y { flex: 1; background-color: #FDEF42; }
        .flag-r { flex: 1; background-color: #E31B23; }

        .title-box { background: linear-gradient(135deg, #00853F 0%, #047857 100%); color: #fff; text-align: center; padding: 10px; border-radius: 6px; margin-bottom: 20px; }
        .title-box h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
        .title-box p { margin: 4px 0 0 0; font-size: 12px; opacity: 0.9; }

        .content-grid { display: flex; gap: 20px; margin-bottom: 20px; }
        .col-left { flex: 2; }
        .col-right { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px; text-align: center; }

        .card { background: #f8fafc; border-left: 4px solid #00853F; padding: 10px 14px; margin-bottom: 12px; border-radius: 0 6px 6px 0; }
        .card h3 { margin: 0 0 6px 0; font-size: 13px; color: #00853F; text-transform: uppercase; }
        .info-row { display: flex; margin-bottom: 4px; font-size: 12px; }
        .info-label { font-weight: bold; width: 140px; color: #475569; }
        .info-val { color: #0f172a; flex: 1; }

        .qr-img { width: 150px; height: 150px; border: 1px solid #e2e8f0; background: #fff; padding: 6px; border-radius: 4px; }
        .qr-token { font-size: 10px; color: #64748b; margin-top: 6px; word-break: break-all; font-family: monospace; }

        .rules { border: 1px solid #fed7aa; background-color: #fffbeb; border-radius: 6px; padding: 10px 14px; margin-top: 15px; font-size: 11px; }
        .rules h4 { margin: 0 0 4px 0; color: #b45309; text-transform: uppercase; font-size: 11px; }
        .rules ul { margin: 0; padding-left: 18px; color: #78350f; }

        .footer { margin-top: 25px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        
        @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="republique">République du Sénégal</div>
        <div class="devise">Un Peuple — Un But — Une Foi</div>
        <div class="flag-bar">
            <div class="flag-g"></div>
            <div class="flag-y"></div>
            <div class="flag-r"></div>
        </div>
        <div class="ministere">Ministère des Infrastructures, des Transports Terrestres et du Désenclavement</div>
        <div class="direction">Direction des Transports Routiers — Centre National d'Examen des Castors (Dakar)</div>
    </div>

    <div class="title-box">
        <h1>Convocation Officielle à l'Épreuve Théorique du Code</h1>
        <p>Numéro de Convocation : <strong>{$reservation->numero_reservation}</strong></p>
    </div>

    <div class="content-grid">
        <div class="col-left">
            <div class="card">
                <h3>Identité du Candidat</h3>
                <div class="info-row"><span class="info-label">Matricule National :</span><span class="info-val"><strong>{$candidat->numero_candidat}</strong></span></div>
                <div class="info-row"><span class="info-label">Nom et Prénom :</span><span class="info-val">{$user->name}</span></div>
                <div class="info-row"><span class="info-label">NIN (Carte CNI) :</span><span class="info-val">{$candidat->nin}</span></div>
                <div class="info-row"><span class="info-label">Téléphone :</span><span class="info-val">{$candidat->telephone}</span></div>
                <div class="info-row"><span class="info-label">Catégorie sollicitée :</span><span class="info-val"><strong>Permis {$candidat->categorie_permis}</strong></span></div>
            </div>

            <div class="card">
                <h3>Lieu et Horaire de Passage (Castors)</h3>
                <div class="info-row"><span class="info-label">Lieu d'examen :</span><span class="info-val"><strong>Centre National d'Examen des Castors</strong></span></div>
                <div class="info-row"><span class="info-label">Adresse exacte :</span><span class="info-val">Avenue Bourguiba x Rue 11, Castors, Dakar</span></div>
                <div class="info-row"><span class="info-label">Salle assignée :</span><span class="info-val">{$salle->nom}</span></div>
                <div class="info-row"><span class="info-label">Date de l'examen :</span><span class="info-val"><strong>{$dateFormatted}</strong></span></div>
                <div class="info-row"><span class="info-label">Créneau précis :</span><span class="info-val"><strong>{$heureDebut} à {$heureFin}</strong></span></div>
            </div>
        </div>

        <div class="col-right">
            <img class="qr-img" src="{$qrDataUri}" alt="QR Code Convocation">
            <div style="font-weight: bold; font-size: 11px; margin-top: 6px; color: #00853F;">Contrôle d'Accès Castors</div>
            <div class="qr-token">{$reservation->qr_token}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">À scanner à l'entrée par l'agent</div>
        </div>
    </div>

    <div class="rules">
        <h4>Consignes Officielles pour le Centre de Castors :</h4>
        <ul>
            <li>Présentez-vous impérativement <strong>30 minutes avant l'heure exacte</strong> muni de votre <strong>Carte Nationale d'Identité (CNI) originale</strong>.</li>
            <li>Inutile de venir à 5h du matin : votre place est garantie à l'heure précise indiquée sur ce document.</li>
            <li>Le QR Code ci-contre sera scanné par l'agent d'accueil des Castors pour valider immédiatement votre émargement.</li>
            <li>L'usage du téléphone portable est formellement interdit en salle d'examen.</li>
        </ul>
    </div>

    <div class="footer">
        Plateforme Numérique PermisSN — Centre National des Castors (Dakar) — Document délivré le {$reservation->created_at->format('d/m/Y H:i')}
    </div>

</body>
</html>
HTML;
    }
}
