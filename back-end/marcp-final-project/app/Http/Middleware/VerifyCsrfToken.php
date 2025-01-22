<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyCsrfToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Excluir rutas que no requieren verificación CSRF
        $except = [
            // Agrega aquí las rutas que no deben ser verificadas
            '/api/logout',
        ];

        if (in_array($request->path(), $except)) {
            return $next($request);
        }

        // Verificación CSRF
        return $next($request);
    }
}
