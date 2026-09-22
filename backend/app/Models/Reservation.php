<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidat_id',
        'session_id',
        'numero_reservation',
        'qr_token',
        'statut',
        'date_reservation',
    ];

    protected $casts = [
        'date_reservation' => 'datetime',
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function session()
    {
        return $this->belongsTo(SessionExamen::class, 'session_id');
    }

    public function presence()
    {
        return $this->hasOne(Presence::class);
    }

    public function resultat()
    {
        return $this->hasOne(Resultat::class);
    }

    public static function genererNumeroReservation(): string
    {
        $annee = date('Y');
        $random = str_pad((string) mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        return "RES-{$annee}-{$random}";
    }

    public static function genererQrToken(int $candidatId, int $sessionId): string
    {
        $unique = Str::random(16);
        $signature = hash('sha256', "PERMIS-SN-{$candidatId}-{$sessionId}-{$unique}");
        return "PERMIS-SN-RES-" . strtoupper(substr($signature, 0, 24));
    }
}
