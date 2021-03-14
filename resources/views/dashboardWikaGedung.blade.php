@extends('layout')

@section('detail-chart')
    <table id="tableDetail" class="table is-striped is-hoverable is-fullwidth">
        <thead>
            <tr>
                <th>Nama Proyek</th>
                <th>Total Nilai Kontrak</th>
                <th>Total Nilai OK</th>
                <th>Total Nilai OK Akhir</th>
                <th>Total Nilai OK Awal Bruto</th>
                <th>Total Nilai OK Awal Netto</th>
                <th>Total Nilai Prognosa</th>
                <th>Total Nilai Realisasi</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
@endsection

@section('custom-js')
    <script src="/js/dasboardWikaGedung.js"></script>
@endsection