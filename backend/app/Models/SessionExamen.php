<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionExamen extends Model
{
    use HasFactory;

    protected $table = 'sessions';

    protected $fillable = [
        'centre_id',
        'salle_id',
        'categorie_permis',
        'date_session',
        'heure_debut',
        'heure_fin',
        'capacite_max',
        'statut',
    ];

    protected $casts = [
        'date_session' => 'date',
    ];

    public function centre()
    {
        return $this->belongsTo(Centre::class);
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'session_id');
    }

    public function reservationsConfirmees()
    {
        return $this->hasMany(Reservation::class, 'session_id')->where('statut', 'confirmee');
    }

    public function getPlacesRestantesAttribute(): int
    {
        $reservees = $this->reservations()->where('statut', 'confirmee')->count();
        return max(0, $this->capacite_max - $reservees);
    }

    public function isPleine(): bool
    {
        return $this->places_restantes <= 0;
    }
}
