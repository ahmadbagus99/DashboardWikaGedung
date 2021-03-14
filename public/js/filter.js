const filterButton = document.querySelector('#filter');

window.onload = async () => {
    filterButton.addEventListener('click', onClickFilter);
};

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
const selectDivisi = document.getElementById("divisi-filter");
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
const selectCafeWege = document.getElementById("cafewege-filter");
for(index in cafeWege) {
    selectCafeWege.options[selectCafeWege.options.length] = new Option(cafeWege[index], index);
}