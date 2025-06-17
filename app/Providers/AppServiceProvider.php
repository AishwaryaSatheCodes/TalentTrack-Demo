<?php

namespace App\Providers;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;


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
    public function boot()
{
    // Enable foreign key constraints only for SQLite
    if (DB::getDriverName() === 'sqlite') {
        DB::statement('PRAGMA foreign_keys = ON;');
    }

    Schema::defaultStringLength(191); // if you're also setting this
}
}
