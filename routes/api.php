<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::resource('charity-organizations', App\Http\Controllers\API\CharityOrganizationAPIController::class)
    ->except(['create', 'edit']);

Route::resource('categories', App\Http\Controllers\API\CategoryAPIController::class)
    ->except(['create', 'edit']);

Route::resource('campaigns', App\Http\Controllers\API\CampaignAPIController::class)
    ->except(['create', 'edit']);

Route::resource('donations', App\Http\Controllers\API\DonationAPIController::class)
    ->except(['create', 'edit']);

Route::resource('settings', App\Http\Controllers\API\SettingAPIController::class)
    ->except(['create', 'edit']);

Route::resource('transactions', App\Http\Controllers\API\TransactionAPIController::class)
    ->except(['create', 'edit']);

Route::resource('programs', App\Http\Controllers\API\ProgramAPIController::class)
    ->except(['create', 'edit']);

Route::resource('clients', App\Http\Controllers\API\ClientAPIController::class)
    ->except(['create', 'edit']);