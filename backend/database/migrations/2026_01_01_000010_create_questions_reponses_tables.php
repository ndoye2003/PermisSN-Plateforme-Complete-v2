<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->enum('theme', ['signalisation', 'priorites', 'regles', 'securite_vitesse']);
            $table->text('intitule');
            $table->text('intitule_wolof')->nullable();
            $table->string('audio_wolof')->nullable();
            $table->string('illustration_url')->nullable();
            $table->text('explication')->nullable();
            $table->text('explication_wolof')->nullable();
            $table->timestamps();
        });

        Schema::create('reponses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->text('texte');
            $table->text('texte_wolof')->nullable();
            $table->boolean('est_correcte')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reponses');
        Schema::dropIfExists('questions');
    }
};
