const filterButton = document.querySelector('#filter');
const divisiFilter = document.querySelector('#divisi-filter');
const selectDivisi = document.getElementById("divisi-filter");
const selectCafeWege = document.getElementById("cafewege-filter");
const bulanPelaporanFilter = document.getElementById("bulanPelaporan-filter");
const tahunFilter = document.getElementById("tahun-filter");
const isRKAPFilter = document.querySelector('#is-rkap-filter');
const clientId = document.getElementById('client_id');

document.addEventListener('DOMContentLoaded', function() {
    init();

    filterButton.addEventListener('click', onClickFilter);
    selectDivisi.addEventListener('change', onChangeDivisi);
});

function init() {

    seedLookup();

    const currentDate = new Date();
    bulanPelaporanFilter.value = MONTHS[currentDate.getMonth()].id;
    tahunFilter.value = currentDate.getFullYear().toString();
}

function seedLookup() {
    // seed divsi
    for(let i = 0; i < DIVISI.length; i++) {
        let opt = document.createElement('option');
        opt.value = DIVISI[i].id;
        opt.innerHTML = DIVISI[i].name;
        selectDivisi.appendChild(opt);
    }

    // seed cafe wege
    for(let i = 0; i < CAFE_WEGE.length; i++) {
        let opt = document.createElement('option');
        opt.value = CAFE_WEGE[i].id;
        opt.innerHTML = CAFE_WEGE[i].name;
        selectCafeWege.appendChild(opt);
    }

    // seed bulan pelaporan
    for(let i = 0; i < MONTHS.length; i++) {
        var opt = document.createElement('option');
        opt.value = MONTHS[i].id;
        opt.innerHTML = MONTHS[i].name;
        bulanPelaporanFilter.appendChild(opt);
    }
}

function onChangeDivisi() {
    if(selectDivisi.value == '') {
        
        for(let i = 0; i < CAFE_WEGE.length; i++) {
            let opt = document.createElement('option');
            opt.value = CAFE_WEGE[i].id;
            opt.innerHTML = CAFE_WEGE[i].name;
            selectCafeWege.appendChild(opt);
        }

    } else {

        // hapus lookup cafe wege
        const cafeWegeLength = selectCafeWege.options.length;
        for (let i = cafeWegeLength; i > 0; i--) {
            selectCafeWege.options[i] = null;
        }

        // seed ulang berdasarkan divisi
        const newCafeWege = CAFE_WEGE.filter(item => item.divisiId == selectDivisi.value);
        for(let i = 0; i < newCafeWege.length; i++) {
            let opt = document.createElement('option');
            opt.value = newCafeWege[i].id;
            opt.innerHTML = newCafeWege[i].name;
            selectCafeWege.appendChild(opt);
        }
    }
    
    
}

function onClickFilter() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch(`${APP_URL}/dashboard/api/send-filter?SecretKey=${getSecretKey()}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            Tahun: tahunFilter.value == '' ? null : tahunFilter.value,
            BulanPelaporanId: bulanPelaporanFilter.value == '' ? null : bulanPelaporanFilter.value,
            DivisiId : divisiFilter.value == '' ? null : divisiFilter.value,
            CafeWegeId: selectCafeWege.value == '' ? null : selectCafeWege.value,
            ClientId: clientId.value,
            IsRKAP: isRKAPFilter.checked
        })
    });
}
