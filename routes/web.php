<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [PageController::class, 'home']);
Route::get('/registrar', [PageController::class, 'register']);
Route::get('/comedor', [PageController::class, 'dinner']);
Route::get('/comedor-contador', [PageController::class, 'dinnerCount']);
Route::get('/listado', [PageController::class, 'listado']);
Route::get('/exportar', [PageController::class, 'export']);