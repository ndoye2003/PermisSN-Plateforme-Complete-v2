<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resultat extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'candidat_id',
        'session_id',
        'score',
        'total_points',
        'statut',
        'observations',
        'date_resultat',
    ];

    protected $casts = [
        'date_resultat' => 'datetime',
        'score' => 'integer',
        'total_points' => 'integer',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function session()
    {
        return $this->belongsTo(SessionExamen::class, 'session_id');
    }

    public function isAdmis(): bool
    {
        return $this->statut === 'admis';
    }
}
