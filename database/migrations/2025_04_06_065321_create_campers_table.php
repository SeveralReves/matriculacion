<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('campers', function (Blueprint $table) {
            $table->id();
            $table->string('identity_card')->nullable(); // Cedula de Identidad (opcional)
            $table->string('first_name');
            $table->string('last_name');
            $table->string('church');
            $table->date('birth_date');
            $table->string('email');
            $table->foreignId('zone_id')->constrained()->onDelete('cascade');
            $table->string('color');
            $table->boolean('baptized')->default(false);
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('serial')->unique(); // Serial único
            $table->string('payment_method');
            $table->string('reference')->nullable();
            $table->text('comments')->nullable();
            $table->foreignId('camp_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campers');
    }
};
