const filterButton = document.querySelector('#filter');
const divisiFilter = document.querySelector('#divisi-filter');
const selectDivisi = document.getElementById("divisi-filter");
const selectCafeWege = document.getElementById("cafewege-filter");

window.onload = async () => {
    filterButton.addEventListener('click', onClickFilter);
};

document.addEventListener('DOMContentLoaded', function() {
    divisiFilter.addEventListener('change', function() {
        console.log(selectDivisi);
    });
});

function onClickFilter() {
    console.log('%c Filter Button is clicked...', 'color: blue');
}

const divisi = {
    Divisi1 : 'Divisi 1',
    Divisi2 : 'Divisi 2',
    Divisi3 : 'Divisi 3',
    DivisiDIVIKM : 'Divisi DIVIKM',
    DivisiWPG : 'Divisi WPG',
};

for(index in divisi) {
    selectDivisi.options[selectDivisi.options.length] = new Option(divisi[index], index);
}

const cafeWege = {
    CafeWegeJakarta : 'Cafe Wege Jakarta',
    CafeWegeSurabaya : 'Cafe Wege Surabaya',
    CafeWegeMakasar : 'Cafe Wege Makasar',
    CafeWegeMedan : 'Cafe Wege Medan',
    CafeWegeYogyakarta : 'Cafe Wege Yogyakarta',
};

for(index in cafeWege) {
    selectCafeWege.options[selectCafeWege.options.length] = new Option(cafeWege[index], index);
}