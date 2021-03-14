const DROPDOWN = document.querySelectorAll('.dropdown');
const DISPLAY_DATA = document.querySelector('#display-data');
const EXPORT_DATA = document.querySelector('#export-data');
const SHOW_MORE = document.querySelector('#show-more');
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
    IS_DISPLAY_DATA = true;
    DISPLAY_DATA.textContent = 'Display data';

    const chart = document.querySelector('#chart');
    const detailChart = document.querySelector('#detail-chart');

    chart.classList.remove('is-hidden');
    detailChart.classList.toggle('is-hidden');
    EXPORT_DATA.parentElement.classList.toggle('is-hidden');
}

function showDetail() {
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

function handlingFilter({scope, isCustom = false}) {
    const parentFilter = scope.parentElement.parentElement;
    const rootFilter = parentFilter.parentElement;

    if(rootFilter.childElementCount > 3) {
        rootFilter.children[2].remove();
    }

    let fieldPencarianId = isCustom ? 'field-pencarian-custom' : 'field-pencarian';
    let fieldOperatorId = isCustom ? 'field-operator-custom' : 'field-operator';
    let removeFilter = isCustom ? 'remove-filter-custom' : 'remove-filter';
    let jsonFilter = {};
    let isRangeDate = false;
    try {
        jsonFilter = JSON.parse(scope.value);
        let searchFilter = '';
        const div = document.createElement('div');
        switch (jsonFilter.type) {
            case 'text':
                searchFilter =  '<div class="control">' +
                                    '<span class="select is-small">' +
                                        `<select id="${fieldOperatorId}">` +
                                            `<option value="${OPERATOR_TYPE.EQUAL.value}"> ${OPERATOR_TYPE.EQUAL.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.NOT_EQUAL.value}"> ${OPERATOR_TYPE.NOT_EQUAL.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.CONTAIN.value}"> ${OPERATOR_TYPE.CONTAIN.symbol} </option>` +
                                        '</select>' +
                                    '</span>' +
                                '</div>' +
                                '<div class="control">' +
                                    `<input id="${fieldPencarianId}" class="input is-small is-rounded" type="text" placeholder="${jsonFilter.placeholder}">` +
                                '</div>' +
                                '<div class="control">' +
                                    `<a class="button is-danger is-small is-rounded" id="${removeFilter}">` +
                                        '<span class="icon is-small">' + 
                                            '<i class="fas fa-times"></i>' +
                                        '</span>' +
                                    '</a>' +
                                '</div>';
                                
                div.setAttribute("class", "field has-addons pr-3");
                div.innerHTML = searchFilter;
                parentFilter.after(div);
                
                break;

            // case 'lookup':
            //     searchFilter =  '<select id="select-filter">' +
            //                         `<option selected disabled>${jsonFilter.value[0]}</option>` +
            //                     '</select>';
            //     div.setAttribute("class", "select is-small is-rounded");
            //     div.innerHTML = searchFilter;
            //     document.querySelector('.field.is-horizontal').appendChild(div);
            //     // document.querySelector('#search-button').addEventListener('click', function() {
            //     //     const value = document.querySelector('#field-pencarian').value;
            //     //     onClickSearch(value);
            //     // });
            //     break;

            case 'date':
                searchFilter =  '<div class="control">' +
                                    '<span class="select is-small">' +
                                        `<select id="${fieldOperatorId}">` +
                                            `<option value="${OPERATOR_TYPE.EQUAL.value}"> ${OPERATOR_TYPE.EQUAL.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.NOT_EQUAL.value}"> ${OPERATOR_TYPE.NOT_EQUAL.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.GREATER.value}"> ${OPERATOR_TYPE.GREATER.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.GREATER_EQUAL.value}"> ${OPERATOR_TYPE.GREATER_EQUAL.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.LESS.value}"> ${OPERATOR_TYPE.LESS.symbol} </option>` +
                                            `<option value="${OPERATOR_TYPE.LESS_EQUAL.value}"> ${OPERATOR_TYPE.LESS_EQUAL.symbol} </option>` +
                                        '</select>' +
                                    '</span>' +
                                '</div>' +
                                '<div class="control">' +
                                    `<input id="${fieldPencarianId}" class="input is-small is-rounded" type="text" placeholder="${jsonFilter.placeholder}">` +
                                '</div>';

                div.setAttribute("class", "field has-addons pr-3");
                div.innerHTML = searchFilter;
                parentFilter.after(div);

                if(jsonFilter.isPeriod) {
                    new Litepicker({ 
                        element: document.getElementById(fieldPencarianId),
                        format: jsonFilter.format ? jsonFilter.format : 'YYYY-MM-DD',
                        maxDate: MAX_YEAR ? new Date(MAX_YEAR, 11, 31) : new Date(new Date().getFullYear(), 11, 31),
                        dropdowns: {
                            minYear: MIN_YEAR,
                            maxYear: MAX_YEAR,
                            months: true,
                            years: true,
                        },
                        onSelect: function(date1, date2) {
                            const FIELD_PENCARIAN = document.querySelector('#field-pencarian') != null ? document.querySelector(`#field-pencarian`).value : null;
                            const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom') != null ? document.querySelector('#field-pencarian-custom').value : null;

                            IS_SEARCH_CLICK = false;
                        }
                    });
                } else {
                    new Litepicker({ 
                        element: document.getElementById(fieldPencarianId),
                        format: jsonFilter.format ? jsonFilter.format : 'YYYY-MM-DD',
                        onSelect: function(date1, date2) {
                            const FIELD_PENCARIAN = document.querySelector('#field-pencarian') != null ? document.querySelector(`#field-pencarian`).value : null;
                            const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom') != null ? document.querySelector('#field-pencarian-custom').value : null;

                            IS_SEARCH_CLICK = false;
                        }
                    });
                }
                
                break;

            case 'range-date':
                isRangeDate = true;
                searchFilter =  '<div class="control">' +
                                    `<input id="${fieldPencarianId}-start" class="input is-small is-rounded" type="text" placeholder="${jsonFilter.placeholder} mulai">` +
                                '</div>' +
                                '<div class="control">' +
                                    `<input id="${fieldPencarianId}-end" class="input is-small is-rounded" type="text" placeholder="${jsonFilter.placeholder} berakhir">` +
                                '</div>' +
                                '<div class="control">' +
                                    `<a class="button is-danger is-small is-rounded" id="${removeFilter}">` +
                                        '<span class="icon is-small">' + 
                                        '<i class="fas fa-times"></i>' +
                                        '</span>' +
                                    '</a>' +
                                '</div>';
                div.setAttribute("class", "field has-addons pr-3");
                div.innerHTML = searchFilter;
                parentFilter.after(div);

                new Litepicker({ 
                    element: document.getElementById(`${fieldPencarianId}-start`),
                    elementEnd: document.getElementById(`${fieldPencarianId}-end`),
                    singleMode: false,
                    numberOfMonths: 2,
                    numberOfColumns: 2,
                    onSelect: function(date1, date2) {
                        const FIELD_PENCARIAN = document.querySelector('#field-pencarian') != null ? document.querySelector(`#field-pencarian`).value : null;
                        const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom') != null ? document.querySelector('#field-pencarian-custom').value : null;

                        IS_SEARCH_CLICK = false;
                    }
                });
                
                break;
        
            default:
                break;
        }

        if(!isRangeDate) {
            document.querySelector(`#${fieldPencarianId}`).addEventListener('change', function() {
                const FIELD_PENCARIAN = document.querySelector('#field-pencarian') != null ? document.querySelector(`#field-pencarian`).value : null;
                const FIELD_PENCARIAN_START = document.querySelector('#field-pencarian-start') != null ? document.querySelector(`#field-pencarian-start`).value : null;
                const FIELD_PENCARIAN_END = document.querySelector('#field-pencarian-end') != null ? document.querySelector(`#field-pencarian-end`).value : null;
                const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom') != null ? document.querySelector('#field-pencarian-custom').value : null;
                const FIELD_PENCARIAN_CUSTOM_START = document.querySelector('#field-pencarian-start-custom') != null ? document.querySelector(`#field-pencarian-start-custom`).value : null;
                const FIELD_PENCARIAN_CUSTOM_END = document.querySelector('#field-pencarian-end-custom') != null ? document.querySelector(`#field-pencarian-end-custom`).value : null;

                const _isRangeDate = FIELD_PENCARIAN_START != undefined && FIELD_PENCARIAN_END != undefined ? true : false;
                const _isRangeDateCustom = FIELD_PENCARIAN_CUSTOM_START != undefined && FIELD_PENCARIAN_CUSTOM_END != undefined ? true : false;

                IS_SEARCH_CLICK = false;
            });
        }

        document.querySelector(`#${removeFilter}`).addEventListener('click', function() {
            rootFilter.children[isCustom ? 1 : 2].remove();
            const FIELD_PENCARIAN = document.querySelector('#field-pencarian') != null ? document.querySelector(`#field-pencarian`).value : null;
            const FIELD_PENCARIAN_START = document.querySelector('#field-pencarian-start') != null ? document.querySelector(`#field-pencarian-start`).value : null;
            const FIELD_PENCARIAN_END = document.querySelector('#field-pencarian-end') != null ? document.querySelector(`#field-pencarian-end`).value : null;
            const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom') != null ? document.querySelector('#field-pencarian-custom').value : null;
            const FIELD_PENCARIAN_CUSTOM_START = document.querySelector('#field-pencarian-start-custom') != null ? document.querySelector(`#field-pencarian-start-custom`).value : null;
            const FIELD_PENCARIAN_CUSTOM_END = document.querySelector('#field-pencarian-end-custom') != null ? document.querySelector(`#field-pencarian-end-custom`).value : null;

            const _isRangeDate = FIELD_PENCARIAN_START != undefined && FIELD_PENCARIAN_END != undefined ? true : false;
            const _isRangeDateCustom = FIELD_PENCARIAN_CUSTOM_START != undefined && FIELD_PENCARIAN_CUSTOM_END != undefined ? true : false;
            

            if(IS_SEARCH_CLICK) {
                onClickSearchButton();
            }

            IS_SEARCH_CLICK = false;
        });
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

function getFilter() {
    const MainFilter = {
        column: null,
        value: null,
        isPeriod: false,
        valueStart: null,
        valueEnd: null,
        valueOperator: null
    };
    const CustomFilter = {
        column: null,
        value: null,
        isPeriod: false,
        valueStart: null,
        valueEnd: null,
        valueOperator: null
    };

    const FIELD_PENCARIAN = document.querySelector('#field-pencarian');
    const FIELD_PENCARIAN_START = document.querySelector('#field-pencarian-start');
    const FIELD_PENCARIAN_END = document.querySelector('#field-pencarian-end');
    const FIELD_OPERATOR = document.querySelector('#field-operator');
    const FIELD_PENCARIAN_CUSTOM = document.querySelector('#field-pencarian-custom');
    const FIELD_PENCARIAN_CUSTOM_START = document.querySelector('#field-pencarian-start-custom');
    const FIELD_PENCARIAN_CUSTOM_END = document.querySelector('#field-pencarian-end-custom');
    const FIELD_OPERATOR_CUSTOM = document.querySelector('#field-operator-custom');
    
    let isMainFilterEmpty = false;
    try {
        
        if(jsonMainFilter) {
            MainFilter.column = {
                source: jsonMainFilter.column.source ?? '',
                column: jsonMainFilter.column.column ?? ''
            };
            MainFilter.value = FIELD_PENCARIAN != null ? FIELD_PENCARIAN.value : null;
            MainFilter.isPeriod = jsonMainFilter.isPeriod ?? false;
            MainFilter.valueStart = FIELD_PENCARIAN_START != null ? FIELD_PENCARIAN_START.value : null;
            MainFilter.valueEnd = FIELD_PENCARIAN_END != null ? FIELD_PENCARIAN_END.value : null;
            MainFilter.valueOperator = FIELD_OPERATOR != null ? parseInt(FIELD_OPERATOR.value) : null;
        } else {
            isMainFilterEmpty = true;
        }

        if(jsonCustomFilter) {
            CustomFilter.column = {
                source: jsonCustomFilter.column.source ?? '',
                column: jsonCustomFilter.column.column ?? ''
            };
            CustomFilter.value = FIELD_PENCARIAN_CUSTOM != null ? FIELD_PENCARIAN_CUSTOM.value : null;
            CustomFilter.isPeriod = jsonCustomFilter.isPeriod ?? false;
            CustomFilter.valueStart = FIELD_PENCARIAN_CUSTOM_START != null ? FIELD_PENCARIAN_CUSTOM_START.value : null;
            CustomFilter.valueEnd = FIELD_PENCARIAN_CUSTOM_END != null ? FIELD_PENCARIAN_CUSTOM_END.value : null;
            CustomFilter.valueOperator = FIELD_OPERATOR_CUSTOM != null ? parseInt(FIELD_OPERATOR_CUSTOM.value) : null;
        }
    } catch (error) {
        alert(error);
        console.error(error);
    }
    
    return {
        MainFilter: isMainFilterEmpty ? [] : [MainFilter],
        CustomFilter: CustomFilter
    };
}