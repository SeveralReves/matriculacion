<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    CamperController,
    CampController,
    DayController,
    MealRecordController,
    UserController
};

// Route::middleware('auth:sanctum')->group(function () {

//     // 🔐 Solo superadmin puede crear campamentos y usuarios
//     Route::post('/camps', [CampController::class, 'store']);
//     Route::get('/camps', [CampController::class, 'index']);

//     Route::post('/users', [UserController::class, 'store']);

//     // 🧍‍♂️ Camper
//     Route::get('/camps/{camp}/campers', [CamperController::class, 'index']);
//     Route::post('/campers', [CamperController::class, 'store']);
//     Route::put('/campers/{camper}', [CamperController::class, 'update']);
//     Route::delete('/campers/{camper}', [CamperController::class, 'destroy']);

//     // 📅 Days
//     Route::get('/camps/{camp}/days', [DayController::class, 'index']);
//     Route::post('/days', [DayController::class, 'store']);
//     Route::delete('/days/{day}', [DayController::class, 'destroy']);

//     // 🍽️ Meal Records
//     Route::get('/meal-records', [MealRecordController::class, 'index']); // params: camp_id & day_id
//     Route::post('/meal-records/toggle', [MealRecordController::class, 'toggle']);
// });
