<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    protected $fillable = [
        'centre_id',
        'nom',
        'capacite',
        'statut',
    ];

    public function centre()
    {
        return $this->belongsTo(Centre::class);
    }

    public function sessions()
    {
        return $this->hasMany(SessionExamen::class);
    }
}
