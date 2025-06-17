<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, ...$roles)
    {
        \Log::info('RoleMiddleware triggered for user:', [
            'user_id' => auth()->id(),
            'roles' => auth()->check() ? auth()->user()->roles->pluck('name')->toArray() : [],
            'required_roles' => $roles
        ]);
    
        if (!auth()->check() || !auth()->user()->roles->pluck('name')->intersect($roles)->count()) {
            abort(403, 'Unauthorized');
        }
    
        return $next($request);
    }
}
