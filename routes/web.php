<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/filter', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('filters', ['client_id' => $request->session()->getId()]);
}]);

$router->get('/dashboard', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('dashboardWikaGedung', ['client_id' => $request->session()->getId()]);
}]);

$router->group(['prefix' => 'dashboard/api', 'middleware' => 'auth_secret_key'], function () use ($router) {
    $router->post('get-monthly-forecasting',  ['uses' => 'DashboardAPIController@getMonthlyForecasting']);
    $router->post('get-forecast-proyek-detail',  ['uses' => 'DashboardAPIController@getForecastProyekDetail']);
    $router->post('send-filter',  ['uses' => 'DashboardAPIController@sendFilter']);
    $router->post('get-excel',  ['uses' => 'DashboardAPIController@getExport']);
});