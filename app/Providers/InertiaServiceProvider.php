<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class InertiaServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();

                // Debugging roles
                if ($user) {
                    dd($user->roles()->pluck('name')->toArray());
                }

                return [
                    'user' => $user,
                    'roles' => $user ? $user->roles()->pluck('name')->toArray() : [],
                ];
            },
        ]);
    }
}
