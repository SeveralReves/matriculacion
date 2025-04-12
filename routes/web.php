<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    CamperController,
    CampController,
    DayController,
    MealRecordController,
    UserController
};
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return redirect()->route('dashboard');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/camps', function () {
    return Inertia::render('Camps');
})->middleware(['auth', 'verified'])->name('camps');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::middleware(['auth'])->prefix('api')->group(function () {

    // 🔐 Solo superadmin puede crear campamentos y usuarios
    Route::post('/camps', [CampController::class, 'store']);
    Route::get('/camps', [CampController::class, 'index']);
    Route::delete('/camps/{camp}', [CampController::class, 'destroy']);
    Route::put('/camps/{camp}', [CampController::class, 'update']);
    Route::get('/camps/{camp}', [CampController::class, 'show']);

    Route::post('/users', [UserController::class, 'store']);

    // 🧍‍♂️ Camper
    Route::get('/camps/{camp}/campers', [CamperController::class, 'index']);
    Route::post('/campers', [CamperController::class, 'store']);
    Route::put('/campers/{camper}', [CamperController::class, 'update']);
    Route::delete('/campers/{camper}', [CamperController::class, 'destroy']);

    // 📅 Days
    Route::get('/camps/{camp}/days', [DayController::class, 'index']);
    Route::post('/days', [DayController::class, 'store']);
    Route::delete('/days/{day}', [DayController::class, 'destroy']);

    // 🍽️ Meal Records
    Route::get('/meal-records', [MealRecordController::class, 'index']); // ?camp_id=...&day_id=...
    Route::post('/meal-records/toggle', [MealRecordController::class, 'toggle']);
});



require __DIR__.'/auth.php';
