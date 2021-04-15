<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Exception;
use App\Traits\CreatioHelperTrait;
use \Pusher;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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

    public function sendFilter(Request $request)
    {
        $options = array(
            'cluster' => 'ap1',
            'useTLS' => true
        );
        $pusher = new Pusher\Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            $options
        );
        
        // $data['message'] = $request->json();
        $pusher->trigger('custom-dashboard', 'send-filter', [
            'Tahun' => $request->input('Tahun'),
            'BulanPelaporanId' => $request->input('BulanPelaporanId'),
            'DivisiId' => $request->input('DivisiId'),
            'CafeWegeId' => $request->input('CafeWegeId'),
            'ClientId' => $request->input('ClientId'),
            'IsRKAP' => $request->input('IsRKAP'),
        ]);
    }
    
    // forecast
    
    public function getMonthlyForecasting(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetMonthlyForecasting'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null,
            'IsRKAP' => $request->has('IsRKAP') ? $request->input('IsRKAP') : false,
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
    
    public function getForecastProyekDetail(Request $request, $isJSON = true)
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
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null,
            'IsRKAP' => $request->has('IsRKAP') ? $request->input('IsRKAP') : false,
        ]);
        
        if($isJSON) {
            return $response->Success ? response()->json($response->Response) : response()->json($response);
        }
        
        return $response->Success ? $response->Response : $response; 
    }
    
    // end forecast
    
    // divisi
    
    public function getNilaiOKPerDivisi(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetNilaiOKPerDivisi'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
    
    public function getNilaiOKPerDivisiDetail(Request $request, $isJSON = true)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetNilaiOKPerDivisiDetail'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null,
            'ForecastType' => $request->has('ForecastType') ? $request->input('ForecastType') : null,
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null
        ]);
        
        if($isJSON) {
            return $response->Success ? response()->json($response->Response) : response()->json($response);
        }
        
        return $response->Success ? $response->Response : $response; 
    }
    
    // end divisi
    
    // on progress, menang, kalah
    
    public function getTotalProyekProgress(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetTotalProyekProgress'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
    
    public function getTotalProyekProgressDetail(Request $request, $isJSON = true)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetTotalProyekProgressDetail'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null,
            'StatusProyekType' => $request->has('StatusProyekType') ? $request->input('StatusProyekType') : null,
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null
        ]);
        
        if($isJSON) {
            return $response->Success ? response()->json($response->Response) : response()->json($response);
        }
        
        return $response->Success ? $response->Response : $response; 
    }
    
    // end on progress, menang, kalah
    
    // terendah terkontrak
    
    public function getTerendahTerkontrakProyek(Request $request)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetTerendahTerkontrakProyek'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null
        ]);

        return $response->Success ? response()->json($response->Response) : response()->json($response);
    }
    
    public function getTerendahTerkontrakProyekDetail(Request $request, $isJSON = true)
    {
        $response = $this->restCreatio([
            'service' => 'CustomDashboardAPI',
            'method' => 'GetTerendahTerkontrakProyekDetail'
        ], 'POST', false, [
            'Tahun' => $request->has('Tahun') ? $request->input('Tahun') : null,
            'BulanPelaporanId' => $request->has('BulanPelaporanId') ? $request->input('BulanPelaporanId') : null,
            'DivisiId' => $request->has('DivisiId') ? $request->input('DivisiId') : null,
            'CafeWegeId' => $request->has('CafeWegeId') ? $request->input('CafeWegeId') : null,
            'StatusProyekType' => $request->has('StatusProyekType') ? $request->input('StatusProyekType') : null,
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null
        ]);
        
        if($isJSON) {
            return $response->Success ? response()->json($response->Response) : response()->json($response);
        }
        
        return $response->Success ? $response->Response : $response; 
    }
    
    // end terendah terkontrak

    public function getExportForecast(Request $request)
    {
        $filename = 'Forecast Pelaporan ' .$request->input('BulanPelaporanName'). ' ' .$request->input('Tahun'). ' ' .$request->input('ForecastTypeName'). ' Perolehan Bulan ' .$request->input('BulanPerolehanName');
        $data = $this->getForecastProyekDetail($request, false);
        $this->getExport($filename, $data);
    }

    public function getExportNilaiOKPerDivisi(Request $request)
    {
        $filename = 'Nilai Realisasi OK Per Divisi Pelaporan ' .$request->input('BulanPelaporanName'). ' ' .$request->input('Tahun'). ' ' .$request->input('ForecastTypeName');
        $data = $this->getNilaiOKPerDivisiDetail($request, false);
        $this->getExport($filename, $data);
    }

    public function getExportTotalProgressProyek(Request $request)
    {
        $filename = 'On Progress vs Menang vs Kalah Pelaporan ' .$request->input('BulanPelaporanName'). ' ' .$request->input('Tahun'). ' ' .$request->input('StatusProyekTypeName');
        $data = $this->getTotalProyekProgressDetail($request, false);
        $this->getExport($filename, $data);
    }

    public function getExportTerendahTerkontrak(Request $request)
    {
        $filename = 'Terendah vs Terkontrak Pelaporan ' .$request->input('BulanPelaporanName'). ' ' .$request->input('Tahun'). ' ' .$request->input('StatusProyekTypeName');
        $data = $this->getTerendahTerkontrakProyekDetail($request, false);
        $this->getExport($filename, $data);
    }

    public function getExport($filename, $data)
    {
        $success = false;
        $message = '';

        $excel = new Spreadsheet();
        $headers = [
            'No', 'Nama Proyek', 'Owner', 'Is RKAP',
            'Divisi', 'Cafe Wege', 'Status Pasar', 
            'Status Proyek', 'Nilai OK', 'Nilai Prognosa', 'Nilai Realisasi'
        ];

        try {
            
            if(!isset($data->Detail) || empty($data->Detail)) {
                throw new Exception('Data Spread Sheet is Empty');
            }

            $excel->getActiveSheet()->getStyle('A1:K1')->getFont()->setBold(true);
            $excel->getActiveSheet()->fromArray($headers, NULL, 'A1');

            $rowIndex = 2;
            $no = 1;

            foreach($data->Detail as $row) {
                $excel->getActiveSheet()->setCellValue('A'.$rowIndex, $no)
                            ->getColumnDimension('A')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('B'.$rowIndex, $row['Proyek'])
                            ->getColumnDimension('B')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('C'.$rowIndex, $row['Owner'])
                            ->getColumnDimension('C')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('D'.$rowIndex, $row['IsRKAP'] ? 'Yes' : 'No')
                            ->getColumnDimension('D')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('E'.$rowIndex, $row['Divisi'])
                            ->getColumnDimension('E')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('F'.$rowIndex, $row['CafeWege'])
                            ->getColumnDimension('F')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('G'.$rowIndex, $row['StatusPasar'])
                            ->getColumnDimension('G')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('H'.$rowIndex, $row['StatusProyek'])
                            ->getColumnDimension('H')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('I'.$rowIndex, $row['NilaiOK'])
                            ->getColumnDimension('I')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('J'.$rowIndex, $row['NilaiPrognosa'])
                            ->getColumnDimension('J')->setAutoSize(true);
                $excel->getActiveSheet()->setCellValue('K'.$rowIndex, $row['NilaiRealisasi'])
                            ->getColumnDimension('K')->setAutoSize(true);

                $rowIndex++;
                $no++;
            }

            $success = true;

        } catch (\Exception $e) {
            $message = $e->getMessage();
        } finally {
            if(!$success) {
                return response()->json([
                    'Success' => $success,
                    'Message' => 'Error: '. $message
                ], 400);
            }

            $writer = new Xlsx($excel);
            $writer->setOffice2003Compatibility(true);
            
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment; filename="' .$filename. '"');

            $writer->save("php://output");
        }
    }
}
