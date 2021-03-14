<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/litepicker/dist/css/style.css">
        <link rel="stylesheet" href="/css/style.css">
        <title>Dashboard Wika Gedung</title>
    </head>
    <body style='font-family:"Bpmonline";'>
        <div class="box box-custom">

            <div class="loader-wrapper">
                <!-- <div class="loader is-loading"></div> -->
                <div class="Preloader">
                    <div class="Preloader-squareContainer">
                    <div class="Preloader-square"></div>
                    <div class="Preloader-square"></div>
                    <div class="Preloader-square"></div>
                    <div class="Preloader-square"></div>
                    <div class="Preloader-square"></div>
                    <div class="Preloader-square"></div>
                    </div>
                    <!-- <div class="Preloader-message" style='font-family:"Bpmonline";'>Loading</div> -->
                </div>

            </div>

            <div class="columns mb-0">
                <div class="column mb-0">
                    <div class="dropdown is-right is-pulled-right">
                        <div class="dropdown-trigger">
                            <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span class="icon is-small">
                                    <i class="fas fa-cog" aria-hidden="true"></i>
                                </span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a id="display-data" href="javascript:void(0);" class="dropdown-item">
                                    Display data
                                </a>
                            </div>
                            <div class="dropdown-content is-hidden">
                                <a id="export-data" href="javascript:void(0);" class="dropdown-item">
                                    Export Data
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
 
            </div>
            
            @yield('custom-filter')

            <div id="chart" style="width:100%; height:400px;"></div>
            <div id="detail-chart" class="is-hidden" style="height:400px; overflow-y: auto;"> 
                
                @yield('detail-chart')

                <div class="has-text-centered is-hidden">
                    <a href="javascript:void(0);" id="show-more">
                        <span class="icon"><i class="fas fa-angle-double-down"></i></span> 
                        <span>Show more</span>
                    </a>
                </div>
            </div>
        </div>

        <script src="https://static.codepen.io/assets/common/stopExecutionOnTimeout-157cd5b220a5c80d4ff8e0e70ac069bffd87a61252088146915e8726e5d9f147.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
        <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/litepicker/dist/js/main.js"></script>
        <script>
            const MIN_YEAR = @json(isset($minYear) ? $minYear : 2010, JSON_PRETTY_PRINT);
            const MAX_YEAR = @json(isset($maxYear) ? $maxYear : null, JSON_PRETTY_PRINT);
            const APP_URL = @json(env('APP_URL'), JSON_PRETTY_PRINT);
            const CREATIO_URL = @json(env('CREATIO_URL'), JSON_PRETTY_PRINT);
        </script>
        <script src="/js/app.js"></script>
        <script src="/js/loadingScript.js"></script>
        
        @yield('custom-js')

    </body>
</html>