<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Exception;

trait CreatioHelperTrait 
{
    private $bpmcsrf;
    private $jar;

    public function __construct()
    {
        $this->jar = Cache::has('creatio_cookies') ? Cache::get('creatio_cookies') : new \GuzzleHttp\Cookie\CookieJar();
        $this->bpmcsrf = Cache::has('creatio_bpmcsrf') ? Cache::get('creatio_bpmcsrf') : null;
    }

    final public function restCreatio($endpoint, $method, $useWrapped = true, $data = array())
    {
        $result = (Object)array(
            'Success' => false,
            'Message' => null,
            'Response' => null
        );

        $endpoint_ = is_array($endpoint) ? (Object)$endpoint : $endpoint;
        $uri = env('CREATIO_URL'). '/0/rest/'. $endpoint_->service. '/' .$endpoint_->method;

        if(!$this->bpmcsrf || empty($this->bpmcsrf)) {
            $this->authCreatio();
        }

        $errorList = array();
        $iteration = 0;
        while ($iteration < 3) {
            $isFailed = false;
            try {
                switch (strtolower($method)) {
                    case 'get':
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->get($uri, $data);
                        break;

                    case 'post':
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->post($uri, $data);
                        break;

                    case 'put':
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->put($uri, $data);
                        break;
                    
                    case 'patch':
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->patch($uri, $data);
                        break;

                    case 'delete':
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->delete($uri);
                        break;
                        
                    default:
                        $response = Http::withOptions([
                            'cookies' => $this->jar,
                        ])->withHeaders([
                            'ForceUseSession' => 'true',
                            'BPMCSRF' => $this->bpmcsrf
                        ])->get($uri, $data);
                        break;
                }

                if(!$response->successful() || $response->failed()) {
                    $isFailed = true;
                    $response->throw();
                }

                $body = (Object)$response->json();
                if($useWrapped) {
                    $resultName = $endpoint_->method. 'Result';
                    $body = (Object)$body->$resultName;
                }

                $result->Success = true;
                $result->Response = $body;

                break;
            } catch (Exception $e) {
                $iteration++;
                $errorList[] = $e->getMessage();
            } finally {
                if($isFailed) {
                    $this->authCreatio();
                }
            }
        }

        $result->Message = $result->Success ? null : implode("\n", $errorList);

        return $result;
    }

    final private function authCreatio()
    {
        $result = (Object)array(
            'Success' => false,
            'Message' => null
        );

        $uri = env('CREATIO_URL'). '/ServiceModel/AuthService.svc/Login';
        try {
            Cache::forget('creatio_cookies');
            Cache::forget('creatio_bpmcsrf');

            $response = Http::withOptions([
                'cookies' => $this->jar,
            ])->withHeaders([
                'ForceUseSession' => 'true'
            ])->post($uri, [
                'UserName' => env('CREATIO_USERNAME'),
                'UserPassword' => env('CREATIO_PASSWORD'),
            ]);
            if(!$response->successful() || $response->failed()) {
                $response->throw();
            }

            $body = (Object)$response->json();
            if($body->Code != 0 || !empty($body->Exception)) {
                throw new Exception('Something wrong happen: '. $body->Exception->Message);
            }
            
            $this->bpmcsrf = $response->cookies()->getCookieByName('BPMCSRF')->getValue();
            $result->Success = true;
        } catch (Exception $e) {
            $result->Message = $e->getMessage();
        } finally {
            if($result->Success) {
                Cache::put('creatio_cookies', $this->jar, time() + 86400);
                Cache::put('creatio_bpmcsrf', $this->bpmcsrf, time() + 86400);
            }
        }

        return $result;
    }
}