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
    RegisteredRecordController,
    UserController,
    GuestController,
    DashboardApiController,
    RoomController,
    GuestMealRecordController
};
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;

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
// Route::get('/sanctum/csrf-cookie', function (Request $request) {
//     $token = $request->session()->token();

//     return response()->noContent()->withCookie(
//         cookie(
//             'XSRF-TOKEN',
//             $token,
//             120, // duración en minutos
//             '/',
//             config('session.domain'),
//             true,  // Secure (porque estás en HTTPS)
//             false, // HttpOnly = false ✅
//             false, // raw = false
//             'Lax'  // SameSite
//         )
//     );
// });


Route::get('/artisan-reset', function () {
    // Protege con una clave secreta
    if (request('secret') !== 'admin123456') {
        abort(403, 'No autorizado');
    }

    try {
        // 1. Elimina todas las tablas y corre migraciones
        Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed' => true,
        ]);

        return 'Base de datos reseteada y seeders ejecutados exitosamente.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/clear-artisan', function () {
    // Protección simple (idealmente reemplazar por auth real)
    if (request('secret') !== 'admin123456') {
        abort(403, 'No autorizado');
    }

    Artisan::call('route:clear');
    Artisan::call('config:clear');
    Artisan::call('cache:clear');

    return 'Limpieza completada.';
});

Route::get('/', function () {
    return redirect()->route('dashboard');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/campamentos', function () {
    return Inertia::render('Camps');
})->middleware(['auth', 'verified','superadmin'])->name('camps');

Route::get('/usuarios', function () {
    return Inertia::render('Users');
})->middleware(middleware: ['auth', 'verified','superadmin'])->name('users');

Route::get('/acampantes', function () {
    return Inertia::render('Campers');
})->middleware(middleware: ['auth', 'verified'])->name('campers');

Route::get('/comidas', function () {
    return Inertia::render('Meals');
})->middleware(middleware: ['auth', 'verified'])->name('meals');

Route::get('/matricula', function () {
    return Inertia::render('Register');
})->middleware(middleware: ['auth', 'verified'])->name('registered');

Route::get('/dormitorios', function () {
    return Inertia::render('Rooms');
})->middleware(middleware: ['auth', 'verified'])->name('rooms');

Route::get('/invitados', function () {
    return Inertia::render('GuestsMeals');
})->middleware(middleware: ['auth', 'verified'])->name('guests');

Route::get('/importar-acampantes', function () {
    return Inertia::render('ImportExport');
})->middleware(middleware: ['auth', 'verified'])->name('imports');



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

    // 🍽️ Registered Records
    Route::get('/registered-records', [RegisteredRecordController::class, 'index']); // ?camp_id=...
    Route::post('/registered-records/toggle', [RegisteredRecordController::class, 'toggle']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::get('/churches', function () {
        return \App\Models\Camper::select('church')->distinct()->pluck('church')->filter()->values();
    });
    Route::get('/zones', function () {
        return \App\Models\Camper::select('zone')->distinct()->pluck('zone')->filter()->values();
    });

    Route::get('/guests', [GuestController::class, 'index']);
    Route::post('/guests', [GuestController::class, 'store']);
    Route::post('/guest-meal-records/toggle', [GuestMealRecordController::class, 'toggle']);
    
    Route::get('/dashboard/totals', [DashboardApiController::class, 'totals']);
    Route::get('/dashboard/camp/{id}', [DashboardApiController::class, 'camp']);
    Route::get('/dashboard/camp/{camp}/day/{day}', [DashboardApiController::class, 'campDay']);

    Route::get('/camps/{camp}/rooms', [RoomController::class, 'index']);
    Route::post('/camps/{camp}/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
    Route::post('/rooms/{room}/assign-campers', [RoomController::class, 'assignCampers']);
    Route::get('/rooms/{room}/campers', [RoomController::class, 'campers']);

    Route::post('/camps/{camp}/campers/import', [CamperController::class, 'import']);
    Route::get('/camps/{camp}/campers/export', [CamperController::class, 'export']);

});



require __DIR__.'/auth.php';
