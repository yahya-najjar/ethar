<?php

use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

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

Auth::routes();

Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth'],
], function () {

    Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
    Route::resource('charityOrganizations', App\Http\Controllers\CharityOrganizationController::class);
    Route::resource('categories', App\Http\Controllers\CategoryController::class);
    Route::resource('campaigns', App\Http\Controllers\CampaignController::class);
    Route::resource('donations', App\Http\Controllers\DonationController::class);
    Route::resource('settings', App\Http\Controllers\SettingController::class);
    Route::resource('transactions', App\Http\Controllers\TransactionController::class);
    Route::resource('programs', App\Http\Controllers\ProgramController::class);
});

Route::resource('clients', App\Http\Controllers\ClientController::class);

Route::prefix('user')->name('user.')->group(function () {
    Route::middleware('guest:client')->group(function () {
        Route::get('login', [UserAuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [UserAuthController::class, 'login']);

        Route::get('register', [UserAuthController::class, 'showRegisterForm'])->name('register');
        Route::post('register', [UserAuthController::class, 'register']);
    });

    Route::middleware('auth:client')->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout'])->name('logout');
        Route::get('dashboard', [UserAuthController::class, 'dashboard'])->name('dashboard');
    });
});

Route::get('/', function () {
    return view('frontend.home');
})->name('homepage');

Route::get('/about', [App\Http\Controllers\HomeController::class, 'about'])->name('about');
Route::get('/campaign/{id}', [HomeController::class, 'campaign'])->name('campaign');
Route::get('/donate', [HomeController::class, 'donate'])->name('donate');
Route::get('/category/{slug}', [HomeController::class, 'category'])->name('category');
Route::get('/program/{slug}', [HomeController::class, 'program'])->name('program');
