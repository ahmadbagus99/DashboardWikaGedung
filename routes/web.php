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

$router->get('/dashboard/forecast', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('dashboardWikaGedung', ['client_id' => $request->session()->getId()]);
}]);

$router->get('/dashboard/nilai-ok-per-divisi', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('dashboardNilaiOKPerDivisi', ['client_id' => $request->session()->getId()]);
}]);

$router->get('/dashboard/total-progress-proyek', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('dashboardTotalProgressProyek', ['client_id' => $request->session()->getId()]);
}]);

$router->get('/dashboard/terendah-terkontrak-proyek', ['middleware' => ['auth_secret_key'], function (\Illuminate\Http\Request $request) use ($router) {
    return view('dashboardTerendahTerkontrakProyek', ['client_id' => $request->session()->getId()]);
}]);

$router->group(['prefix' => 'dashboard/api', 'middleware' => 'auth_secret_key'], function () use ($router) {
    $router->post('get-monthly-forecasting',  ['uses' => 'DashboardAPIController@getMonthlyForecasting']);
    $router->post('get-forecast-proyek-detail',  ['uses' => 'DashboardAPIController@getForecastProyekDetail']);
    $router->post('get-excel/forecast',  ['uses' => 'DashboardAPIController@getExportForecast']);
    
    $router->post('get-nilai-ok-per-divisi',  ['uses' => 'DashboardAPIController@getNilaiOKPerDivisi']);
    $router->post('get-nilai-ok-per-divisi-detail',  ['uses' => 'DashboardAPIController@getNilaiOKPerDivisiDetail']);
    $router->post('get-excel/nilai-ok-per-divisi',  ['uses' => 'DashboardAPIController@getExportNilaiOKPerDivisi']);
    
    $router->post('get-total-progress-proyek',  ['uses' => 'DashboardAPIController@getTotalProyekProgress']);
    $router->post('get-total-progress-proyek-detail',  ['uses' => 'DashboardAPIController@getTotalProyekProgressDetail']);
    $router->post('get-excel/total-progress-proyek',  ['uses' => 'DashboardAPIController@getExportTotalProgressProyek']);
    
    $router->post('get-terendah-terkontrak-proyek',  ['uses' => 'DashboardAPIController@getTerendahTerkontrakProyek']);
    $router->post('get-terendah-terkontrak-proyek-detail',  ['uses' => 'DashboardAPIController@getTerendahTerkontrakProyekDetail']);
    $router->post('get-excel/terendah-terkontrak',  ['uses' => 'DashboardAPIController@getExportTerendahTerkontrak']);
    
    $router->post('send-filter',  ['uses' => 'DashboardAPIController@sendFilter']);
    
});