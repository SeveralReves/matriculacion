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
    Schema::create('meal_records', function (Blueprint $table) {
        $table->id();
        $table->foreignId('camper_id')->constrained()->onDelete('cascade');
        $table->foreignId('day_id')->constrained()->onDelete('cascade');
        $table->boolean('has_eaten')->default(false);
        $table->timestamps();
        $table->unique(['camper_id', 'day_id']); // Para evitar duplicados
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_records');
    }
};
