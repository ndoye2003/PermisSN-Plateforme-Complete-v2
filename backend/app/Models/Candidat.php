<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'numero_candidat',
        'telephone',
        'date_naissance',
        'lieu_naissance',
        'nin',
        'adresse',
        'categorie_permis',
        'statut_dossier',
        'motif_rejet',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reservationActive()
    {
        return $this->hasOne(Reservation::class)
            ->whereIn('statut', ['confirmee'])
            ->latestOfMany();
    }

    public function resultats()
    {
        return $this->hasMany(Resultat::class);
    }

    public function entrainements()
    {
        return $this->hasMany(Entrainement::class);
    }

    public static function genererNumeroCandidat(string $region = 'DK'): string
    {
        $annee = date('Y');
        $random = str_pad((string) mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        return "SN-{$annee}-{$region}-{$random}";
    }
}
