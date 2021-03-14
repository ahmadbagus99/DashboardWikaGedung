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

    public function realisasiProduksiPerPO(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'DuanyamCustomDashboardAPI',
            'method' => 'RealisasiProduksiPerPO'
        ], 'POST', true, [
            'MainFilter' => $request->has('MainFilter') ? $request->input('MainFilter') : null,
            'CustomFilter' => $request->has('CustomFilter') ? $request->input('CustomFilter') : null
        ]);
        
        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
}
