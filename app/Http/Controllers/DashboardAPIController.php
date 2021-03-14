<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Exception;
use App\Traits\CreatioHelperTrait;

class DashboardAPIController extends Controller
{

    use CreatioHelperTrait {
        CreatioHelperTrait::__construct as private creatioHelper;
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->creatioHelper();
    }

    public function getMonthlyForecasting(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetMonthlyForecasting'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }

    public function getForecastProyekDetail(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetForecastProyekDetail'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'BulanPerolehanId' => $request->has('BulanPerolehanId') ? $request->input('BulanPerolehanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null,
            'ForecastType' => $request->has('ForecastType') ? $request->input('ForecastType') : null,
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
}
