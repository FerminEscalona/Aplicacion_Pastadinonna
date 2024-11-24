<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $position): Response
    {
        $user = Auth::user();

        if ($position === 'worker' && $user instanceof \App\Models\worker) {
            return $next($request);
        }

        if ($position === 'manager' && $user instanceof \App\Models\manager) {
            return $next($request);
        }

        return response()->json(['message' => 'Acceso denegado'], 403);
    }
}
