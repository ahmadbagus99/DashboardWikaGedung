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
            'ClientId' => $request->input('ClientId')
        ]);
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
            'OrderColumn' => $request->has('OrderColumn') ? $request->input('OrderColumn') : null
        ]);
        
        if($isJSON) {
            return $response->Success ? response()->json($response->Response) : response()->json($response);
        }
        
        return $response->Success ? $response->Response : $response; 
    }

    public function getExport(Request $request)
    {
        $success = false;
        $message = '';

        $filename = 'Forecast Pelaporan ' .$request->input('BulanPelaporanName'). ' ' .$request->input('Tahun'). ' ' .$request->input('ForecastTypeName'). ' Perolehan Bulan ' .$request->input('BulanPerolehanName');

        $excel = new Spreadsheet();
        $data = $this->getForecastProyekDetail($request, false);
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
