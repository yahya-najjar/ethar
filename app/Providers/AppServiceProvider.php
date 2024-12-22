<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Program;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $categories = Category::query()->get();
        $programs = Program::query()->get();
        $sliders = Program::query()->whereNotNull('image')->get();
        view()->share('categories', $categories);
        view()->share('programs', $programs);
        view()->share('sliders', $sliders);
    }
}
