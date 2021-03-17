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

        //if(data.ClientId == CLIENT_ID.value) {
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
                console.error(error);

                alert(`Something wrong happen: ${error}`);
            })
            .finally(() => {
                showLoading({isShow: false});
            });
       // }
    });
});

async function init() {
    try {
        TITLE_DASHBOARD.innerHTML = `<strong>Terendah vs Terkontrak</strong>`;

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
        const req = await fetch(`${APP_URL}/dashboard/api/get-terendah-terkontrak-proyek?SecretKey=${getSecretKey()}`, {
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

async function getDetailData(statusProyekType) {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const req = await fetch(`${APP_URL}/dashboard/api/get-terendah-terkontrak-proyek-detail?SecretKey=${getSecretKey()}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].id : BULAN_PELAPORAN_ID,
                DivisiId : DIVISI_ID == null ? null : DIVISI_ID,
                CafeWegeId : CAFE_WEGE_ID == null ? null : CAFE_WEGE_ID,
                StatusProyekType : statusProyekType,
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

function renderChart({series = [], legend = []}) {
    Highcharts.setOptions({
        colors: [
            COLORS.GREEN, COLORS.BLUE
        ]
    });

    Highcharts.chart('chart', {
        title: {
            text: null
        },
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        subtitle: {
            text: null
        },
        tooltip: {
            formatter: function() {
                let newLabel =  `<span style="font-size: 12px">${this.key}</span><br/>` +
                                `<span style="font-size: 12px">${this.series.name}: <strong>${Highcharts.numberFormat(this.y, 2, ',', '.')}</strong></span>`;
                return newLabel;
            }
        },
        legend: {
            labelFormatter: function() {
                return `<span style="color: ${this.color}; font-size: 16px;">${this.name}: ${this.y}</span>`;
            }
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.y}',
                },
                showInLegend: true
            },
            series: {
                cursor: 'pointer',
                events: {
                    click: async (event) => {
                        console.log(event.point.series.name, event.point.name)

                        showLoading({isShow: true});
                        try {
                            const statusProyekType = STATUS_PROYEK_TYPE.filter(item => item.name == event.point.name)[0].type;
                            const data = await getDetailData(statusProyekType);
                            console.log({data, statusProyekType});

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
                                
                                const total = data.TotalData;

                                SERIES_CATEGORY.innerHTML = `<strong>${event.point.name}</strong>`;
                                TOTAL_SERIES_CATEGORY.innerHTML = `<strong>Total: ${Highcharts.numberFormat(total/1000000, 2, ',', '.')}</strong>`;
                                
                                SERIES_TYPE = statusProyekType;

                                showDetail();
                            }
                        } catch (error) {
                            console.error(error);
                            
                            alert(error);
                        } finally {
                            showLoading({isShow: false});
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: series
    });
}


function renderDetail({data = [], clearTable = false}) {
    try {
        if(clearTable) {
            document.querySelector('#tableDetail').replaceChild(document.createElement('tbody'), document.querySelector('#tableDetail tbody'));
        }

        const tbody = document.querySelector('#tableDetail tbody');
        data.forEach(item => {
            let rows =  `<td><a href="${CREATIO_URL}/0/Nui/ViewModule.aspx#CardModuleV2/OpportunityPageV2/edit/${item.ProyekId}" target="_blank">${item.Proyek}</a></td>` +
                        `<td><a href="${CREATIO_URL}/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/${item.OwnerId}" target="_blank">${item.Owner}</a></td>` +
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
        const req = await fetch(`${APP_URL}/dashboard/api/get-excel/terendah-terkontrak?SecretKey=${getSecretKey()}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                Tahun: TAHUN == null ? new Date().getFullYear().toString() : TAHUN,
                BulanPelaporanId: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].id : BULAN_PELAPORAN_ID,
                BulanPerolehanId : BULAN_PEROLEHAN_ID == null ? null : BULAN_PEROLEHAN_ID,
                DivisiId : DIVISI_ID == null ? null : DIVISI_ID,
                CafeWegeId : CAFE_WEGE_ID == null ? null : CAFE_WEGE_ID,
                StatusProyekType : SERIES_TYPE == null ? 0 : SERIES_TYPE,
                OrderColumn : ORDER_COLUMN == null ? null : ORDER_COLUMN,
                BulanPelaporanName: BULAN_PELAPORAN_ID == null ? MONTHS[new Date().getMonth()].name : MONTHS.filter(item => item.id == BULAN_PELAPORAN_ID)[0].name,
                StatusProyekTypeName: SERIES_TYPE == null ? STATUS_PROYEK_TYPE[0].name : STATUS_PROYEK_TYPE.filter(item => item.type == SERIES_TYPE)[0].name,
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