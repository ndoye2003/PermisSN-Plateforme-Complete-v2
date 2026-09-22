<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('centre_id')->constrained('centres')->onDelete('cascade');
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->enum('categorie_permis', ['A', 'B', 'C', 'D', 'TOUS'])->default('B');
            $table->date('date_session');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->integer('capacite_max')->default(30);
            $table->enum('statut', ['ouverte', 'fermee', 'en_cours', 'terminee', 'annulee'])->default('ouverte');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
