<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'theme',
        'intitule',
        'intitule_wolof',
        'audio_wolof',
        'illustration_url',
        'explication',
        'explication_wolof',
    ];

    public function reponses()
    {
        return $this->hasMany(Reponse::class);
    }
}
