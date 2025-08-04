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
    Schema::create('registered_records', function (Blueprint $table) {
        $table->id();
        $table->foreignId('camper_id')->constrained()->onDelete('cascade');
        $table->boolean('has_registered')->default(false);
        $table->timestamps();
        $table->unique(['camper_id']); // Para evitar duplicados
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registered_records');
    }
};
