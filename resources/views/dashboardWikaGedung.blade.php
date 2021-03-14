@extends('layout')

@section('detail-chart')
    <table id="tableDetail" class="table is-striped is-hoverable is-fullwidth">
        <thead>
            <tr>
                <th>Lokasi</th>
                <th>Ibu</th>
                <th>Periode</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
@endsection

@section('custom-js')
    <script src="/js/dasboardWikaGedung.js"></script>
@endsection