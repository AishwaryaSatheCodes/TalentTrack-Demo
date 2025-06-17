<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function __construct()
    {
        Inertia::share([
            'auth' => [
                'user' => auth()->user(),
                'roles' => auth()->user()->roles()->pluck('name')->toArray(),
            ],
        ]);
    }
}
