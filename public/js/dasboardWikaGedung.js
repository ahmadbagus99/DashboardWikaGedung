let TAHUN, BULAN_PELAPORAN_ID, DIVISI_ID, CAFE_WEGE_ID, BULAN_PEROLEHAN_ID, FORECAST_TYPE, ORDER_COLUMN;

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
        const req = await getChartData();
        const status = req.Status;
        if(!status.Success) {
            throw status.Message;
        }

        renderChart({
            categories: req.Category,
            series: req.Series,
            legend: req.Legend
        });
    } catch (error) {
        throw error;
    }
}

async function getChartData() {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/get-monthly-forecasting`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? getBulanId(new Date().getMonth().toString()) : BULAN_PELAPORAN_ID,
                DivisiId : DIVISI_ID == null ? '' : DIVISI_ID,
                CafeWegeId: CAFE_WEGE_ID == null ? '' : CAFE_WEGE_ID
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

async function getDetailData() {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/get-forecast-proyek-detail`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? getBulanId(new Date().getMonth().toString()) : BULAN_PELAPORAN_ID,
                BulanPerolehanId : BULAN_PEROLEHAN_ID == null ? getBulanId(new Date().getMonth().toString()) : BULAN_PEROLEHAN_ID,
                DivisiId : DIVISI_ID == null ? '' : DIVISI_ID,
                CafeWegeId : CAFE_WEGE_ID == null ? '' : CAFE_WEGE_ID,
                ForecastType : FORECAST_TYPE == null ? 1000 : FORECAST_TYPE,
                OrderColumn : ORDER_COLUMN == null ? '' : ORDER_COLUMN
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

function renderChart({categories = [], series = [], legend = []}) {
    const myChart = Highcharts.chart('chart', {
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: categories,
        },
        yAxis: {
            title: {
                text: 'Nilai OK'
            }
        },
        tooltip: {
            formatter: function() {
                let newLabel =  `<span style="font-size: 12px">${this.key}</span><br/>` +
                                `<span style="font-size: 12px">${this.series.name} kumulatif: <strong>${Highcharts.numberFormat(this.y, 2, ',', '.')}</strong></span>`;
                return newLabel;
            }
        },
        legend: {
            labelFormatter: function() {
                const legend_ = legend.filter(item => {
                    return item.Name == this.name
                });
                const total = legend_[0].Data;

                return `<span style="color: ${this.color}; font-size: 16px;">${this.name}: ${Highcharts.numberFormat(total/1000000, 2, ',', '.')}</span>`;
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: async (event) => {
                        showLoading({isShow: true});
                        try {
                            const bulanPerolehan = event.point.category;
                            const forecastType = 10;

                            const data = await getDetailData();
                            console.log(data)
                            renderDetail({
                                forecastType_: data.Data,
                                clearTable: true
                            });
                            
                            CURRENT_PAGE = 1;
                            TOTAL_PAGE = data.TotalPage;
                            
                            showDetail();
                        } catch (error) {
                            alert(error);
                            console.error(error);
                        } finally {
                            showLoading({isShow: false});
                        }
                    }
                }
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    yAxis: {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -5
                        },
                        title: {
                            text: null
                        }
                    },
                    credits: {
                        enabled: false
                    }
                }
            }]
        },
        credits: {
            enabled: false
        },
        series: series.map(item => {
            const newData = item.data.map( item => item/1000000);
            item.data = newData;

            if (item.name == "Nilai OK") {
                item.color = COLORS.BLUE;
            } else if (item.name == "Forecast") {
                item.color = COLORS.YELLOW;
            } else {
                item.color = COLORS.GREEN;
            }
            
            return item;
        })
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
        const req = await getChartData();
        const status = req.Status;
        if(!status.Success) {
            throw status.Message;
        }

        renderChart({
            categories: req.Category,
            series: req.Series,
            legend: req.Legend
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

function getBulanId(namaBulan) {
    let IdBulan;
    switch (namaBulan) {
        case namaBulan = 'January' :
            IdBulan = '2dc31081-f432-4e51-b4ed-5b143634ad9e';
            break;

        case namaBulan = 'Februari' :
            IdBulan = '9b77a157-ad03-44df-a0d0-ce32fedba58d';
            break;
        
        case namaBulan = 'Maret' :
            IdBulan = '83eba05d-ee5c-454e-9773-352498121155';
            break;

        case namaBulan = 'April' :
            IdBulan = 'bdd1da55-ca6c-4436-a9e8-9a9b0dda46f2';
            break; 
        
        case namaBulan = 'Mei' :
            IdBulan = '765d27d6-406e-4dbb-9579-d98744b83b21';
            break;  

        case namaBulan = 'Juni' :
            IdBulan = '134e7c3b-46fb-4f30-903f-38cc361e92c0';
            break;  

        case namaBulan = 'Juli' :
            IdBulan = '963393eb-cbe1-4e8f-beae-712412a47668';
            break;  

        case namaBulan = 'Agustus' :
            IdBulan = '6a5ca90a-fa1d-4df3-ad2d-5874b71ef4eb';
            break;  

        case namaBulan = 'September' :
            IdBulan = 'cb54c8de-c959-4d2f-8531-d357774cf233';
            break; 

        case namaBulan = 'Oktober' :
            IdBulan = '9d8dfef6-fdf4-4608-861e-5cb4ba60cabd';
            break; 

        case namaBulan = 'November' :
            IdBulan = 'c8779d9a-1f90-4209-8e9e-6e8d6b93ebc4';
            break; 

        default:
            IdBulan = 'd0e63e54-5aa2-4e89-9ed5-2acbd038b44f';
    }
    return IdBulan; 
}

function getDivisiId(namaDivisi) {
    let IdDivisi;
    switch (namaDivisi) {
        case namaDivisi = 'Divisi1' :
            IdDivisi = '43628c50-161f-4bb3-93af-01c16a83e490';
            break;

        case namaDivisi = 'Divisi2' :
            IdDivisi = '45abc04c-5717-4d58-b9ef-28724b902790';
            break;
        
        case namaDivisi = 'Divisi3' :
            IdDivisi = '5cddb31e-ae5a-4644-bdd8-e8503b806fe3';
            break;

        case namaDivisi = 'DivisiDIVIKM' :
            IdDivisi = '99b4b940-81eb-46cf-8d7a-acb1953fba1d';
            break; 
        
        default:
            IdDivisi = '2504d769-770e-4bce-a7ea-ec4b7db7d932';
    }
    return IdDivisi; 
}

function getCafeWegeId(namaCafeWege) {
    let IdCafeWege;
    switch (namaCafeWege) {
        case namaCafeWege = 'CafeWegeJakarta' :
            IdCafeWege = '57a5076c-39dc-4b5b-b7f2-062ce7b60d9a';
            break;

        case namaCafeWege = 'CafeWegeSurabaya' :
            IdCafeWege = 'f9269bc8-9c66-4560-a5ec-9f78823c3eb7';
            break;
        
        case namaCafeWege = 'CafeWegeMakasar' :
            IdCafeWege = 'a75f1bf4-a0bb-4e1a-acdf-9ca6c1e26cc1';
            break;

        case namaCafeWege = 'CafeWegeMedan' :
            IdCafeWege = 'c4b8199b-cb00-4e71-afc3-23852aae3a7c';
            break; 
        
        default:
            IdCafeWege = '02262424-5a81-4673-a32d-68e078d2ae78';
    }
    return IdCafeWege; 
}