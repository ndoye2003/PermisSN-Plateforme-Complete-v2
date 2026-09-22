<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrainement extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidat_id',
        'score_global',
        'total_questions',
        'details_themes',
        'recommandation',
    ];

    protected $casts = [
        'details_themes' => 'array',
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }
}
