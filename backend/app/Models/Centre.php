<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Centre extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'adresse',
        'region',
        'ville',
        'telephone',
        'email',
        'capacite_journaliere',
        'statut',
    ];

    public function salles()
    {
        return $this->hasMany(Salle::class);
    }

    public function sessions()
    {
        return $this->hasMany(SessionExamen::class);
    }
}
