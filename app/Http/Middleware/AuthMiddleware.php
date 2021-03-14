<?php

namespace App\Http\Middleware;

use Closure;
use \Firebase\JWT\JWT;
use Exception;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        try {
            if(!$token || empty($token)) {
                throw new Exception('Token is undefined or empty');
            }

            $decoded = JWT::decode($token, env('JWT_KEY'), array('HS256'));
        } catch (Exception $e) {
            return response()->json([
                'Success' => false,
                'Message' => 'Access Denied: '. $e->getMessage(),
                'Type' => get_class($e)
            ], 401);
        }

        return $next($request);
    }
}