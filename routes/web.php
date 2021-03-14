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

$router->get('/filter', function () use ($router) {
    return view('filters');
});

$router->get('/dashboard', function () use ($router) {
    return view('dashboardWikaGedung');
});

$router->group(['prefix' => 'dashboard/api'], function () use ($router) {
    $router->post('get-monthly-forecasting',  ['uses' => 'DashboardAPIController@getMonthlyForecasting']);
    $router->post('get-forecast-proyek-detail',  ['uses' => 'DashboardAPIController@getForecastProyekDetail']);
});