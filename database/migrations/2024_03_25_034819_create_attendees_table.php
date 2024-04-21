<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lastname');
            $table->string('document_id')->unique()->nullable();
            $table->string('birthdate');
            $table->string('church');
            $table->string('color');
            $table->string('zone');
            $table->boolean('baptized')->default(false); 
            $table->string('gender');
            $table->string('conference')->nullable();
            $table->string('serial');
            $table->string('workshop')->nullable();
            $table->string('payment')->nullable();
            $table->string('reference')->nullable();
            $table->string('email')->unique()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendees');
    }
};
