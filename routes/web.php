<?php

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

Route::get('/', function () {
    return view('frontend.home');
});

Route::get('/about', [App\Http\Controllers\HomeController::class, 'about'])->name('about');

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
