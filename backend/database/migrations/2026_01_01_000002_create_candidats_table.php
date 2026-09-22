<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('numero_candidat', 50)->unique();
            $table->string('telephone', 30);
            $table->date('date_naissance')->nullable();
            $table->string('lieu_naissance', 100)->nullable();
            $table->string('nin', 30)->nullable();
            $table->text('adresse')->nullable();
            $table->enum('categorie_permis', ['A', 'B', 'C', 'D'])->default('B');
            $table->enum('statut_dossier', ['incomplet', 'en_attente', 'valide', 'rejete'])->default('incomplet');
            $table->text('motif_rejet')->nullable();
            $table->enum('langue_preferee', ['francais', 'wolof'])->default('wolof');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidats');
    }
};
