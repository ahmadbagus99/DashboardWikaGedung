const DROPDOWN = document.querySelectorAll('.dropdown');
const SELECT_FILTER_CUSTOM = document.querySelector('#select-filter-custom');
const DISPLAY_DATA = document.querySelector('#display-data');
const EXPORT_DATA = document.querySelector('#export-data');
const SHOW_MORE = document.querySelector('#show-more');
const CONTAINER_DISPLAY = document.querySelector('#container-display');
const SERIES_CATEGORY = document.querySelector('#series-category');
const TOTAL_SERIES_CATEGORY = document.querySelector('#total-series-category');

const CLIENT_ID = document.getElementById('client_id');

document.addEventListener('DOMContentLoaded', function () {
    if(DROPDOWN.length > 0) {
        DROPDOWN.forEach(function(element) {
            element.addEventListener('click', function(event) {
                event.stopPropagation();
                element.classList.toggle('is-active');
            });
        });
    }
    
    DISPLAY_DATA.addEventListener('click', function (event) {
        showDashboard();
    });

    EXPORT_DATA.addEventListener('click', function(event) {
        onClickExportData().catch(error => {
            alert(error);
        });
    });
});

function showDashboard() {
    CONTAINER_DISPLAY.classList.toggle('is-hidden');
    SERIES_CATEGORY.classList.toggle('is-hidden');
    TOTAL_SERIES_CATEGORY.classList.toggle('is-hidden');

    IS_DISPLAY_DATA = true;
    DISPLAY_DATA.textContent = 'Display data';

    const chart = document.querySelector('#chart');
    const detailChart = document.querySelector('#detail-chart');

    chart.classList.remove('is-hidden');
    detailChart.classList.toggle('is-hidden');
    EXPORT_DATA.parentElement.classList.toggle('is-hidden');
}

function showDetail() {
    CONTAINER_DISPLAY.classList.remove('is-hidden');
    SERIES_CATEGORY.classList.remove('is-hidden');
    TOTAL_SERIES_CATEGORY.classList.remove('is-hidden');

    IS_DISPLAY_DATA = false;
    DISPLAY_DATA.textContent = 'Display chart';

    const chart = document.querySelector('#chart');
    const detailChart = document.querySelector('#detail-chart');

    chart.classList.toggle('is-hidden');
    detailChart.classList.remove('is-hidden');
    EXPORT_DATA.parentElement.classList.remove('is-hidden');
}

function showLoading({isShow = true}) {
    const loading = document.querySelector('.loader-wrapper');
    if(isShow) {
        loading.classList.toggle('is-active');
    } else {
        loading.classList.remove('is-active');
    }
}