const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GREY: '#b8b0b0',
    ORANGE: '#FF8067',
    YELLOW: '#fff591',
    RED: '#EA4646',
    RED_SOFT: '#E94D51',
    BLUE: '#4CACDF',
    BLUE_SOFT: '#a6dcef',
    GREEN: '#a7e9af',
    GREEN_SOFT: '#cee397'
};
const MONTHS = [
    {
        id: '2dc31081-f432-4e51-b4ed-5b143634ad9e',
        name: 'Januari'
    },
    {
        id: '9b77a157-ad03-44df-a0d0-ce32fedba58d',
        name: 'Februari'
    },
    {
        id: '83eba05d-ee5c-454e-9773-352498121155',
        name: 'Maret'
    },
    {
        id: 'bdd1da55-ca6c-4436-a9e8-9a9b0dda46f2',
        name: 'April'
    },
    {
        id: '765d27d6-406e-4dbb-9579-d98744b83b21',
        name: 'Mei'
    },
    {
        id: '134e7c3b-46fb-4f30-903f-38cc361e92c0',
        name: 'Juni'
    },
    {
        id: '963393eb-cbe1-4e8f-beae-712412a47668',
        name: 'Juli'
    },
    {
        id: '6a5ca90a-fa1d-4df3-ad2d-5874b71ef4eb',
        name: 'Agustus'
    },
    {
        id: 'cb54c8de-c959-4d2f-8531-d357774cf233',
        name: 'September'
    },
    {
        id: '9d8dfef6-fdf4-4608-861e-5cb4ba60cabd',
        name: 'Oktober'
    },
    {
        id: 'c8779d9a-1f90-4209-8e9e-6e8d6b93ebc4',
        name: 'November'
    },
    {
        id: 'd0e63e54-5aa2-4e89-9ed5-2acbd038b44f',
        name: 'Desember'
    },
];
const DIVISI = [
    {
        id: '43628c50-161f-4bb3-93af-01c16a83e490',
        name: 'Divisi 1'
    },
    {
        id: '45abc04c-5717-4d58-b9ef-28724b902790',
        name: 'Divisi 2'
    },
    {
        id: '5cddb31e-ae5a-4644-bdd8-e8503b806fe3',
        name: 'Divisi 3'
    },
    {
        id: '99b4b940-81eb-46cf-8d7a-acb1953fba1d',
        name: 'DIVIKM'
    },
    {
        id: '2504d769-770e-4bce-a7ea-ec4b7db7d932',
        name: 'WPG'
    },
];
const CAFE_WEGE = [
    {
        id: '57a5076c-39dc-4b5b-b7f2-062ce7b60d9a',
        name: 'Cafe Wege Jakarta',
        divisiId: DIVISI[0].id
    },
    {
        id: 'f9269bc8-9c66-4560-a5ec-9f78823c3eb7',
        name: 'Cafe Wege Surabaya',
        divisiId: DIVISI[1].id
    },
    {
        id: 'a75f1bf4-a0bb-4e1a-acdf-9ca6c1e26cc1',
        name: 'Cafe Wege Makasar',
        divisiId: DIVISI[1].id
    },
    {
        id: 'c4b8199b-cb00-4e71-afc3-23852aae3a7c',
        name: 'Cafe Wege Medan',
        divisiId: DIVISI[2].id
    },
    {
        id: '02262424-5a81-4673-a32d-68e078d2ae78',
        name: 'Cafe Wege Yogyakarta',
        divisiId: DIVISI[2].id
    },
];
const FORECAST_TYPE = [
    {
        name: 'Nilai OK',
        type: 1,
        total: 'TotalNilaiOK'
    },
    {
        name: 'Forecast',
        type: 2,
        total: 'TotalNilaiPrognosa'
    },
    {
        name: 'Realisasi',
        type: 3,
        total: 'TotalNilaiRealisasi'
    }
];

Pusher.logToConsole = true;

const PUSHER = new Pusher(PUSHER_APP_KEY, {
    cluster: 'ap1'
});
const CHANNEL_CUSTOM_DASHBOARD = PUSHER.subscribe('custom-dashboard');

function getSecretKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const secretKey = urlParams.get('SecretKey');

    return secretKey;
}