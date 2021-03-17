@extends('layout')

@section('detail-chart')
    <table id="tableDetail" class="table is-striped is-hoverable is-fullwidth">
        <thead>
            <tr>
                <th>Nama Proyek</th>
                <th>Owner</th>
                <th>Is RKAP</th>
                <th>Divisi</th>
                <th>Cafe Wege</th>
                <th>Status Pasar</th>
                <th>Status Proyek</th>
                <th>Nilai OK</th>
                <th>Nilai Prognosa</th>
                <th>Nilai OK Akhir (Realisasi)</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
@endsection

@section('custom-js')
    <script src="/js/dasboardTerendahTerkontrakProyek.js"></script>
@endsection