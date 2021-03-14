<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Custom Dashboard WIKA</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <link rel="stylesheet" href="/css/filter.css">
    </head>
    <body style='font-family:"Bpmonline";'>
        <section id="content">
            <div class="card" style="margin: 0">

                <div class="card-action blue darken-1" style="padding: 5px"></div>
                <div class="divider"></div>

                <!-- Header -->
                <div class="header-chart" style="padding-top: 15px; padding-bottom: 15px;">

                    <!-- Form filtering -->
                    <div class="row" style="margin-bottom: 0">
                        <form class="col s12">

                             <!-- divisi filtering -->
                             <div class="input-field col s2">       
                                <select class="browser-default left" id="divisi-filter" style="border: 1px solid #444;">
                                    <option value="" disabled selected>Divisi</option>
                                </select>
                            </div>
                            
                            <!-- cafe wege filtering -->
                            <div class="input-field col s2">         
                                <select class="browser-default left" id="cafewege-filter" style="border: 1px solid #444;">
                                    <option value="" disabled selected>Cafe Wege</option>
                                </select>
                            </div>

                            <!-- bulan pelaporan filtering -->
                            <div class="input-field col s2">
                                <select class="browser-default left" id="bulanPelaporan-filter" style="border: 1px solid #444;">
                                    <option value="" disabled selected>Bulan Pelaporan</option>
                                    <option value="Januari">January</option>
                                    <option value="Februari">Februari</option>
                                    <option value="Maret">Maret</option>
                                    <option value="April">April</option>
                                    <option value="Mei">Mei</option>
                                    <option value="Juni">Juni</option>
                                    <option value="Juli">Juli</option>
                                    <option value="Agustus">Agustus</option>
                                    <option value="September">September</option>
                                    <option value="Oktober">Oktober</option>
                                    <option value="November">November</option>
                                    <option value="Desember">Desember</option>
                                </select>
                            </div>

                            <!-- tahun filtering -->
                            <div class="input-field col s2">
                                <select class="browser-default left" id="tahun-filter" style="border: 1px solid #444;">
                                    <option value="" disabled selected>Tahun</option>
                                    <option value="2016">2016</option>
                                    <option value="2017">2017</option>
                                    <option value="2018">2018</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                </select>
                            </div>

                            <div class="input-field col s2">
                                <button class="btn waves-effect waves-light blue darken-1" type="button" id="filter" style="width: 100%; margin-top: 3px;">Filter</button>
                            </div>
                        </form>
                    </div>
                    <!-- End Form filtering -->
                </div>
                <!-- End Header -->
            </div>
        </section>

        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
        <script src="https://js.pusher.com/5.1/pusher.min.js"></script>
        <script src="/js/filter.js"></script>
    </body>
</html>