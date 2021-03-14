const DROPDOWN = document.querySelectorAll('.dropdown');
const SELECT_FILTER_CUSTOM = document.querySelector('#select-filter-custom');
const DISPLAY_DATA = document.querySelector('#display-data');
const EXPORT_DATA = document.querySelector('#export-data');
const SHOW_MORE = document.querySelector('#show-more');
const CONTAINER_DISPLAY = document.querySelector('#container-display');
const OPERATOR_TYPE = {
    EQUAL: {
        value: 0,
        symbol: '='
    },
    NOT_EQUAL: {
        value: 1,
        symbol: '!='
    },
    CONTAIN: {
        value: 2,
        symbol: 'Contain'
    },
    GREATER: {
        value: 0,
        symbol: '>'
    },
    GREATER_EQUAL: {
        value: 0,
        symbol: '>='
    },
    LESS: {
        value: 0,
        symbol: '<'
    },
    LESS_EQUAL: {
        value: 0,
        symbol: '<='
    }
};
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
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_FILTER = {
    MainFilter: null,
    CustomFilter: null
};
const EDIT_PAGE_URL = {
    PRODUCTION_ORDER: '/0/Nui/ViewModule.aspx#CardModuleV2/UsrProductionOrder1Page/edit/'
};

let IS_DISPLAY_DATA = true;
let IS_SEARCH_CLICK = false;
let CURRENT_PAGE = 1;
let TOTAL_PAGE = 0;

showLoading({isShow: true});
window.onload = () => {
    showLoading({isShow: false});
};

document.addEventListener('DOMContentLoaded', function () {
    if(DROPDOWN.length > 0) {
        DROPDOWN.forEach(function(element) {
            element.addEventListener('click', function(event) {
                event.stopPropagation();
                element.classList.toggle('is-active');
            });
        });
    }
    
    document.addEventListener('click', function (event) {
        closeDropdowns();
    });
    
    DISPLAY_DATA.addEventListener('click', function (event) {
        if(IS_DISPLAY_DATA) {
            onClickDisplayData()
            .catch(error => {
                alert(error);
            });
        } else {
            onClickDisplayChart()
            .catch(error => {
                alert(error);
            });
        }
    });

    SHOW_MORE.addEventListener('click', function(event) {
        onClickShowMore().catch(error => {
            alert(error);
        });
        handlingShowMore();
    });

    EXPORT_DATA.addEventListener('click', function(event) {
        onClickExportData().catch(error => {
            alert(error);
        });
    });
});

function closeDropdowns() {
    DROPDOWN.forEach(function (element) {
        element.classList.remove('is-active');
    });
}

function getSecretKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const secretKey = urlParams.get('SecretKey');

    return secretKey;
}

function showLoading({isShow = true}) {
    const loading = document.querySelector('.loader-wrapper');
    if(isShow) {
        loading.classList.toggle('is-active');
    } else {
        loading.classList.remove('is-active');
    }
}

function showDashboard() {
    CONTAINER_DISPLAY.classList.toggle('is-hidden');
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
    IS_DISPLAY_DATA = false;
    DISPLAY_DATA.textContent = 'Display chart';

    const chart = document.querySelector('#chart');
    const detailChart = document.querySelector('#detail-chart');

    chart.classList.toggle('is-hidden');
    detailChart.classList.remove('is-hidden');
    EXPORT_DATA.parentElement.classList.remove('is-hidden');

    handlingShowMore();
}

function onClickSearchButton() {
    const filters = getFilter();
    if(CURRENT_FILTER.MainFilter != null && CURRENT_FILTER.MainFilter.length > 0) {
        const newFilter = CURRENT_FILTER.MainFilter.filter(item => item.isSeriesClick != undefined);
        newFilter.forEach(item => filters.MainFilter.push(item));
    }
    CURRENT_FILTER.MainFilter = filters.MainFilter;
    CURRENT_FILTER.CustomFilter = filters.CustomFilter;

    onClickSearch({
        MainFilter: filters.MainFilter,
        CustomFilter: filters.CustomFilter,
        isChart: IS_DISPLAY_DATA ? true : false
    }).catch(error => {
        alert(error);
    });
}

function handlingShowMore() {
    if(CURRENT_PAGE < TOTAL_PAGE) {
        SHOW_MORE.parentElement.classList.remove('is-hidden');
    } else {
        if(CURRENT_PAGE == TOTAL_PAGE) {
            SHOW_MORE.parentElement.classList.toggle('is-hidden', true);
        }
    }
}



