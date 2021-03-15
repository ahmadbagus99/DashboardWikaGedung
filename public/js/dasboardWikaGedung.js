let TAHUN, BULAN_PELAPORAN_ID, DIVISI_ID, CAFE_WEGE_ID, BULAN_PEROLEHAN_ID, ORDER_COLUMN, SERIES_TYPE;

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

    CHANNEL_CUSTOM_DASHBOARD.bind('send-filter', function(data) {
        console.log({data});

        if(data.ClientId == CLIENT_ID.value) {
            TAHUN = data.Tahun;
            BULAN_PELAPORAN_ID = data.BulanPelaporanId;
            DIVISI_ID = data.DivisiId;
            CAFE_WEGE_ID = data.CafeWegeId;

            showLoading({isShow: true});
            getChartData()
            .then(res => {
                if(!res.Status.Success) {
                    throw res.Status.Message;
                }

                renderChart({
                    categories: res.Category,
                    series: res.Series,
                    legend: res.Legend
                })
            })
            .catch(error => {
                alert(`Something wrong happen: ${error}`);
                console.error(error);
            })
            .finally(() => {
                showLoading({isShow: false});
            });
        }
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
        const req = await fetch(`${APP_URL}/dashboard/api/get-monthly-forecasting?SecretKey=${getSecretKey()}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].id : BULAN_PELAPORAN_ID,
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

async function getDetailData(bulanPerolehanId, forecastType) {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/get-forecast-proyek-detail?SecretKey=${getSecretKey()}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].id : BULAN_PELAPORAN_ID,
                BulanPerolehanId : bulanPerolehanId,
                DivisiId : DIVISI_ID == null ? null : DIVISI_ID,
                CafeWegeId : CAFE_WEGE_ID == null ? null : CAFE_WEGE_ID,
                ForecastType : forecastType,
                OrderColumn : ORDER_COLUMN == null ? null : ORDER_COLUMN
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
    Highcharts.chart('chart', {
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
                        console.log(event.point.series.name, event.point.category)

                        showLoading({isShow: true});
                        try {
                            const forecastType = FORECAST_TYPE.filter(item => item.name == event.point.series.name)[0].type;
                            const bulanPerolehanId = MONTHS.filter(item => item.name == event.point.category)[0].id;
                            const data = await getDetailData(bulanPerolehanId, forecastType);
                            console.log({data, bulanPerolehanId, forecastType});

                            if(!data.Status.Success) {
                                throw data.Status.Message;
                            }

                            if(data.Detail.length < 1) {
                                alert('Data not found')
                            } else {
                                renderDetail({
                                    data: data.Detail,
                                    clearTable: true
                                });
                                
                                const totalName = FORECAST_TYPE.filter(item => item.type == forecastType)[0].total;
                                const total = data[totalName];

                                SERIES_CATEGORY.innerHTML = `<strong>${event.point.series.name} - ${event.point.category}</strong>`;
                                TOTAL_SERIES_CATEGORY.innerHTML = `<strong>Total ${event.point.series.name}: ${Highcharts.numberFormat(total/1000000, 2, ',', '.')}</strong>`;
                                
                                BULAN_PEROLEHAN_ID = bulanPerolehanId;
                                SERIES_TYPE = forecastType;

                                showDetail();
                            }
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
            let rows =  `<td><a href="${CREATIO_URL}/0/Nui/ViewModule.aspx#CardModuleV2/OpportunityPageV2/edit/${item.ProyekId}">${item.Proyek}</a></td>` +
                        `<td><a href="${CREATIO_URL}/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/${item.OwnerId}">${item.Owner}</a></td>` +
                        `<td>${item.IsRKAP ? 'Yes' : 'No'}</td>` +
                        `<td>${item.Divisi}</td>` +
                        `<td>${item.CafeWege}</td>` +
                        `<td>${item.StatusPasar}</td>` +
                        `<td>${item.StatusProyek}</td>` +
                        `<td>${Highcharts.numberFormat(item.NilaiOK/1000000, 2, ',', '.')}</td>` +
                        `<td>${Highcharts.numberFormat(item.NilaiPrognosa/1000000, 2, ',', '.')}</td>` +
                        `<td>${Highcharts.numberFormat(item.NilaiRealisasi/1000000, 2, ',', '.')}</td>`

            let tr = document.createElement('tr');
            tr.innerHTML = rows;
            tbody.appendChild(tr);
        });
    } catch (error) {
        throw error;
    }
}

async function onClickDisplayChart() {
    showDashboard();
}

async function onClickExportData() {
    showLoading({isShow: true});
    try {
        
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/get-excel?SecretKey=${getSecretKey()}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].id : BULAN_PELAPORAN_ID,
                BulanPerolehanId : BULAN_PEROLEHAN_ID == null ? null : BULAN_PEROLEHAN_ID,
                DivisiId : DIVISI_ID == null ? null : DIVISI_ID,
                CafeWegeId : CAFE_WEGE_ID == null ? null : CAFE_WEGE_ID,
                ForecastType : SERIES_TYPE == null ? 0 : SERIES_TYPE,
                OrderColumn : ORDER_COLUMN == null ? null : ORDER_COLUMN,
                BulanPelaporanName: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].name : MONTHS.filter(item => item.id == BULAN_PELAPORAN_ID)[0].name,
                ForecastTypeName: SERIES_TYPE == null ? FORECAST_TYPE[0].name : FORECAST_TYPE.filter(item => item.type == SERIES_TYPE)[0].name,
                BulanPerolehanName: BULAN_PEROLEHAN_ID == null ? null : MONTHS.filter(item => item.id == BULAN_PEROLEHAN_ID)[0].name,
            })
        });
        if(!req.ok) {
            throw new Error('Something wrong error..');
        }

        const contentDispositionHeader = req.headers.get('Content-Disposition');
        const fileNameKey = contentDispositionHeader.split('; ')[1];
        const fileNameValue = fileNameKey.split('=')[1];
        const fileName = fileNameValue.substring(1, (fileNameValue.length-1));

        const data = await req.blob();

        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();    
        a.remove();

    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        showLoading({isShow: false});
    }
}