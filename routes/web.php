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

$router->get('/filter', function (\Illuminate\Http\Request $request) use ($router) {
    return view('filters');
    // return $request->session()->getId();
});

$router->get('/dashboard', function (\Illuminate\Http\Request $request) use ($router) {
    // return view('dashboardWikaGedung');
    return $request->session()->getId();
});

$router->group(['prefix' => 'dashboard/api'], function () use ($router) {
    $router->post('get-monthly-forecasting',  ['uses' => 'DashboardAPIController@getMonthlyForecasting']);
    $router->post('get-forecast-proyek-detail',  ['uses' => 'DashboardAPIController@getForecastProyekDetail']);
});


// Test session
$router->get('/test', function () {

    $options = array(
        'cluster' => 'ap1',
        'useTLS' => true
    );
    $pusher = new Pusher\Pusher(
        'b520b5ff2c37e46950a6',
        '938af1b183591a3c1f0a',
        '1171923',
        $options
    );

    $data['message'] = 'hello world';
    $pusher->trigger('my-channel', 'my-event', $data);

    // return view('test');
});