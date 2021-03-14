document.addEventListener('DOMContentLoaded', function() {
    showLoading({isShow: true});
    init()
    .catch(error => {
        alert(`Something wrong happen: ${error}`);
        console.error(error);
    })
    .finally(() => {
        showLoading({isShow: false});
    });
});

async function init() {
    try {
        // const req = await getChartData({
        //     MainFilter: null, 
        //     CustomFilter: null
        // });
        // if(!req.Success) {
        //     throw req.Message;
        // }

        // renderChart({
        //     categories: req.Category,
        //     series: req.Series
        // });

        renderChart();
    } catch (error) {
        throw error;
    }
}

async function getChartData({MainFilter, CustomFilter}) {
    try {
        const secretKey = getSecretKey();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/jumlah-ibu-aktif-per-lokasi?SecretKey=${secretKey}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                MainFilter: MainFilter ?? null,
                CustomFilter: CustomFilter ?? null
            })
        });
        if(!req.ok) {
            throw new Error('Something wrong error..');
        }

        return await req.json();
    } catch (error) {
        throw error;
    }
}

async function getDetailData({MainFilter, CustomFilter, Page = 1, isExport = false}) {
    try {
        const secretKey = getSecretKey();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/detail-jumlah-ibu-aktif-per-lokasi?SecretKey=${secretKey}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                MainFilter: MainFilter ?? null,
                CustomFilter: CustomFilter ?? null,
                Page: Page,
                isExport: isExport
            })
        });
        if(!req.ok) {
            throw new Error('Something wrong error..');
        }

        return await req.json();
    } catch (error) {
        throw error;
    }
}

function renderChart() {
    const myChart = Highcharts.chart('chart', {

        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },
    
        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },
    
        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
    
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2017'
            }
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },
    
        series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}

function renderDetail({data = [], clearTable = false}) {
    try {
        if(clearTable) {
            document.querySelector('#tableDetail').replaceChild(document.createElement('tbody'), document.querySelector('#tableDetail tbody'));
        }

        const tbody = document.querySelector('#tableDetail tbody');
        data.forEach(item => {
            let rows =  `<td>${item.Lokasi}</a></td>` +
                        `<td>${item.Ibu}</td>` +
                        `<td>${item.Periode}</td>`;

            let tr = document.createElement('tr');
            tr.innerHTML = rows;
            tbody.appendChild(tr);
        });
    } catch (error) {
        throw error;
    }
}

async function onClickSearch({MainFilter, CustomFilter, isChart}) {
    showLoading({isShow: true});
    try {
        let data;
        if(isChart) {
            data = await getChartData({
                MainFilter: MainFilter,
                CustomFilter: CustomFilter
            });
            if(!data.Success) {
                throw data.Message;
            }

            renderChart({
                categories: data.Category,
                series: data.Series
            });
        } else {
            data = await getDetailData({
                MainFilter: MainFilter,
                CustomFilter: CustomFilter,
                Page: 1
            });
            if(!data.Success) {
                throw data.Message;
            }

            renderDetail({
                data: data.Data,
                clearTable: true
            });
        }

        CURRENT_PAGE = 1;
    } catch (error) { 
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}

async function onClickShowMore() {
    showLoading({isShow: true});
    try {
        CURRENT_PAGE++;
        const filter = CURRENT_FILTER;
        const data = await getDetailData({
            MainFilter: filter.MainFilter,
            CustomFilter: filter.CustomFilter,
            Page: CURRENT_PAGE
        });
        if(!data.Success) {
            throw data.Message;
        }

        renderDetail({
            data: data.Data,
            clearTable: false
        })
    } catch (error) {
        CURRENT_PAGE--;
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}

async function onClickDisplayData() {
    showLoading({isShow: true});
    try {
        const filters = IS_SEARCH_CLICK ? getFilter() : CURRENT_FILTER;
        const data = await getDetailData({
            MainFilter: filters.MainFilter, 
            CustomFilter: filters.CustomFilter, 
            Page: 1
        });
        if(!data.Success) {
            throw data.Message;
        }

        CURRENT_PAGE = 1;
        TOTAL_PAGE = data.TotalPage;

        renderDetail({
            data: data.Data,
            clearTable: true
        });
        showDetail();
    } catch (error) {
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}

async function onClickDisplayChart() {
    showLoading({isShow: true});
    try {
        let filters;
        if(IS_SEARCH_CLICK) {
            filters = getFilter();
        } else {
            if(CURRENT_FILTER.MainFilter != null && CURRENT_FILTER.MainFilter.length > 0) {                
                let index = -1;
                while((index = CURRENT_FILTER.MainFilter.findIndex(item => item.isSeriesClick != undefined)) != -1) {
                    CURRENT_FILTER.MainFilter.splice(index, 1);
                }
            }
            
            filters = CURRENT_FILTER;
        }

        const data = await getChartData({
            MainFilter: filters.MainFilter, 
            CustomFilter: filters.CustomFilter
        });
        if(!data.Success) {
            throw data.Message;
        }

        CURRENT_PAGE = 1;
        TOTAL_PAGE = 0;

        renderChart({
            categories: data.Category,
            series: data.Series
        });
        showDashboard();
    } catch (error) {
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}

async function onClickExportData() {
    showLoading({isShow: true});
    try {
        const filter = CURRENT_FILTER;

    } catch (error) {
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}

