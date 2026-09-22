<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidat_id',
        'type_document',
        'nom_original',
        'fichier_path',
        'statut',
        'motif_rejet',
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }
}
