/*
 * Interfaz para el componente de graficador.
 * @author Yulier Camilo Garrido Garrido
 * fecha de creación 10/3/2014
 * @version 1.0
 */
Ext.ns('Std.Base.Graficador');
Std.Base.Graficador.CarouselGraficador = Ext.extend(Ext.Panel, {
    id: 'carousel-graficador',
    initComponent: function() {
        var me = this;
        me.region = (me.region) ? me.region : 'center';
        me.controller = (this.controller) ? this.controller : new Std.Base.Graficador.GraficadorController();
        me.graficos = (me.graficos) ? me.graficos : [];
        var indicators = '';
        var grafics = '';

        Ext.each(me.graficos, function(item, index) {
            if (index === 0) {
                if (item.xtype === 'grafico')
                    grafics += '<div class="item active"><div id="graf-ext-' + index + '" style="width:100%;"></div></div>';
                else if (item.xtype === 'grupografico') {
                    grafics += '<div class="item active">';
                    var height = (Number(item.graficos.length) % Number(item.columns)) ? (100 / (Math.floor(Number(item.graficos.length) / Number(item.columns) + 1))) : (100 / (Math.floor(Number(item.graficos.length) / Number(item.columns))));
                    grafics += '<div style="height:' + height + '%;">';
                    Ext.each(item.graficos, function(graf, i) {
                        if (i !== 0 && !(i % item.columns)) {
                            grafics += '</div>';
                            grafics += '<div style="height:' + height + '%;">';
                        }

                        grafics += '<div id="graf-ext-' + index + '_' + i + '" style="width:' + (100 / item.columns) + '%;float: left;"></div>';
                    });
                    grafics += '</div>';
                    grafics += '</div>';
                }
                indicators += '<li class="active" data-slide-to="' + index + '" data-target="#carousel-example-generic"></li>';
            }
            else {
                if (item.xtype === 'grafico')
                    grafics += '<div class="item"><div id="graf-ext-' + index + '" style="width:100%;"></div></div>';
                else if (item.xtype === 'grupografico') {
                    grafics += '<div class="item">';
                    var height = (Number(item.graficos.length) % Number(item.columns)) ? (100 / (Math.floor(Number(item.graficos.length) / Number(item.columns) + 1))) : (100 / (Math.floor(Number(item.graficos.length) / Number(item.columns))));
                    grafics += '<div style="height:' + height + '%;">';
                    Ext.each(item.graficos, function(graf, i) {
                        if (i !== 0 && !(i % item.columns)) {
                            grafics += '</div>';
                            grafics += '<div style="height:' + height + '%;">';
                        }

                        grafics += '<div id="graf-ext-' + index + '_' + i + '" style="width:' + (100 / item.columns) + '%;float: left;"></div>';
                    });
                    grafics += '</div>';
                    grafics += '</div>';
                }
                indicators += '<li class="" data-slide-to="' + index + '" data-target="#carousel-example-generic"></li>';
            }
        });

        me.html = '<div id="carousel-example-generic" data-interval="60000" class="carousel slide margin-bottom-20"><ol class="carousel-indicators">' + indicators + '</ol><div class="carousel-inner">' + grafics + '</div><a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"><span class="icon-prev"></span></a><a class="right carousel-control" href="#carousel-example-generic" data-slide="next"><span class="icon-next"></span></a></div>';

        Std.Base.Graficador.CarouselGraficador.superclass.initComponent.call(me);
    },
    listeners: {
        render: function(panel) {
            Ext.each(panel.graficos, function(item, index) {
                if (item.xtype === 'grafico' && item.url) {
                    panel.recargarDatos({
                        el: 'graf-ext-' + index,
                        titulo: item.titulo,
                        tipo: item.tipo,
                        url: item.url,
                        params: item.params,
                        yTitulo: item.yTitulo
                    });
                }
                else if (item.xtype === 'grupografico') {
                    Ext.each(item.graficos, function(graf, i) {
                        if (graf.xtype === 'grafico' && graf.url) {
                            panel.recargarDatos({
                                el: 'graf-ext-' + index + '_' + i,
                                titulo: graf.titulo,
                                tipo: graf.tipo,
                                url: graf.url,
                                params: graf.params,
                                yTitulo: graf.yTitulo
                            });
                        }
                    });
                }

            });


        }
    },
    actualizar: function(panel) {
        Ext.each(panel.graficos, function(item, index) {
            if (item.xtype === 'grafico' && item.url) {
                panel.recargarDatos({
                    el: 'graf-ext-' + index,
                    titulo: item.titulo,
                    tipo: item.tipo,
                    url: item.url,
                    params: item.params,
                    yTitulo: item.yTitulo
                });
            }
            else if (item.xtype === 'grupografico') {
                Ext.each(item.graficos, function(graf, i) {
                    if (graf.xtype === 'grafico' && graf.url) {
                        panel.recargarDatos({
                            el: 'graf-ext-' + index + '_' + i,
                            titulo: graf.titulo,
                            tipo: graf.tipo,
                            url: graf.url,
                            params: graf.params,
                            yTitulo: graf.yTitulo
                        });
                    }
                });
            }

        });


    },
    recargarDatos: function(objeto) {
        var me = this;
        Ext.Ajax.request({
            url: objeto.url,
            method: 'POST',
            params: (objeto.params) ? {data: Ext.encode(objeto.params)} : {},          
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    switch (objeto.tipo) {
                        case '3d-column-null-values':
                            me.graficoColumNnullValues3D({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                        case '3d-pie-donut':
                            me.graficoPieDonut3D({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                        case '3d-pie':
                            me.graficoPie3d({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                        case 'pie':
                            me.graficoPie({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                        case 'spline':
                            me.graficoSpline({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : [],
                                yTitle: objeto.yTitulo
                            });
                            break;
                        case 'spline-plot-bands':
                            me.graficoSplinePlotBands({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                        case 'area-basic':
                            me.graficoAreaBasic({
                                el: objeto.el,
                                titulo: objeto.titulo
                            });
                            break;
                        case 'arearange-line':
                            me.graficoArearangeLine({
                                el: objeto.el,
                                titulo: objeto.titulo
                            });
                            break;
                        case 'pyramid':
                            me.graficoPyramid({
                                el: objeto.el,
                                titulo: objeto.titulo,
                                data: (responseData.data) ? responseData.data : []
                            });
                            break;
                    }
                }
            }
        });
    },
    graficoArearangeLine: function(objeto) {
        var ranges = [
            [1246406400000, 14.3, 27.7],
            [1246492800000, 14.5, 27.8],
            [1246579200000, 15.5, 29.6],
            [1246665600000, 16.7, 30.7],
            [1246752000000, 16.5, 25.0],
            [1246838400000, 17.8, 25.7],
            [1246924800000, 13.5, 24.8],
            [1247011200000, 10.5, 21.4],
            [1247097600000, 9.2, 23.8],
            [1247184000000, 11.6, 21.8],
            [1247270400000, 10.7, 23.7],
            [1247356800000, 11.0, 23.3],
            [1247443200000, 11.6, 23.7],
            [1247529600000, 11.8, 20.7],
            [1247616000000, 12.6, 22.4],
            [1247702400000, 13.6, 19.6],
            [1247788800000, 11.4, 22.6],
            [1247875200000, 13.2, 25.0],
            [1247961600000, 14.2, 21.6],
            [1248048000000, 13.1, 17.1],
            [1248134400000, 12.2, 15.5],
            [1248220800000, 12.0, 20.8],
            [1248307200000, 12.0, 17.1],
            [1248393600000, 12.7, 18.3],
            [1248480000000, 12.4, 19.4],
            [1248566400000, 12.6, 19.9],
            [1248652800000, 11.9, 20.2],
            [1248739200000, 11.0, 19.3],
            [1248825600000, 10.8, 17.8],
            [1248912000000, 11.8, 18.5],
            [1248998400000, 10.8, 16.1]
        ],
                averages = [
                    [1246406400000, 21.5],
                    [1246492800000, 22.1],
                    [1246579200000, 23],
                    [1246665600000, 23.8],
                    [1246752000000, 21.4],
                    [1246838400000, 21.3],
                    [1246924800000, 18.3],
                    [1247011200000, 15.4],
                    [1247097600000, 16.4],
                    [1247184000000, 17.7],
                    [1247270400000, 17.5],
                    [1247356800000, 17.6],
                    [1247443200000, 17.7],
                    [1247529600000, 16.8],
                    [1247616000000, 17.7],
                    [1247702400000, 16.3],
                    [1247788800000, 17.8],
                    [1247875200000, 18.1],
                    [1247961600000, 17.2],
                    [1248048000000, 14.4],
                    [1248134400000, 13.7],
                    [1248220800000, 15.7],
                    [1248307200000, 14.6],
                    [1248393600000, 15.3],
                    [1248480000000, 15.3],
                    [1248566400000, 15.8],
                    [1248652800000, 15.2],
                    [1248739200000, 14.8],
                    [1248825600000, 14.4],
                    [1248912000000, 15],
                    [1248998400000, 13.6]
                ];


        $('#' + objeto.el).highcharts({
            title: {
                text: objeto.titulo
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°C'
            },
            legend: {
            },
            series: [{
                    name: 'Temperature',
                    data: averages,
                    zIndex: 1,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[0]
                    }
                }, {
                    name: 'Range',
                    data: ranges,
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.3,
                    zIndex: 0
                }]
        });
    },
    graficoPieDonut3D: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: objeto.titulo
            },
            plotOptions: {
                pie: {
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                    name: objeto.titulo,
                    data: objeto.data
                }]
        });
    },
    graficoPyramid: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'pyramid',
                marginRight: 100
            },
            title: {
                text: objeto.titulo,
                x: -50
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        softConnector: true
                    }
                }
            },
            legend: {
                enabled: true
            },
            series: [{
                    name: objeto.titulo,
                    data: objeto.data
                }]
        });
    },
    graficoColumNnullValues3D: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'column',
                margin: 75,
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 0,
                    depth: 100
                }
            },
            title: {
                text: objeto.titulo
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            xAxis: {
                categories: objeto.data.categories
            },
            yAxis: {
                opposite: true
            },
            series: objeto.data.data
        });
    },
    graficoPie: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                plotBackgroundColor: null,
                //plotBorderWidth: 1, //null,
                plotShadow: false
            },
            title: {
                text: objeto.titulo
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                    type: 'pie',
                    name: objeto.titulo,
                    data: objeto.data
                }]
        });
    },
    graficoPie3d: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: objeto.titulo
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                    type: 'pie',
                    name: objeto.titulo,
                    data: objeto.data
                }]
        });
    },
    graficoSpline: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                categories: objeto.data.categories
            },
            yAxis: {
                title: {
                    text: objeto.yTitle
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },
            series: objeto.data.data
        });
    },
    graficoSplinePlotBands: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    overflow: 'justify'
                }
            },
            yAxis: {
                title: {
                    text: 'Wind speed (m/s)'
                },
                min: 0,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
                plotBands: [{// Light air
                        from: 0.3,
                        to: 1.5,
                        color: 'rgba(68, 170, 213, 0.1)',
                        label: {
                            text: 'Light air',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// Light breeze
                        from: 1.5,
                        to: 3.3,
                        color: 'rgba(0, 0, 0, 0)',
                        label: {
                            text: 'Light breeze',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// Gentle breeze
                        from: 3.3,
                        to: 5.5,
                        color: 'rgba(68, 170, 213, 0.1)',
                        label: {
                            text: 'Gentle breeze',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// Moderate breeze
                        from: 5.5,
                        to: 8,
                        color: 'rgba(0, 0, 0, 0)',
                        label: {
                            text: 'Moderate breeze',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// Fresh breeze
                        from: 8,
                        to: 11,
                        color: 'rgba(68, 170, 213, 0.1)',
                        label: {
                            text: 'Fresh breeze',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// Strong breeze
                        from: 11,
                        to: 14,
                        color: 'rgba(0, 0, 0, 0)',
                        label: {
                            text: 'Strong breeze',
                            style: {
                                color: '#606060'
                            }
                        }
                    }, {// High wind
                        from: 14,
                        to: 15,
                        color: 'rgba(68, 170, 213, 0.1)',
                        label: {
                            text: 'High wind',
                            style: {
                                color: '#606060'
                            }
                        }
                    }]
            },
            tooltip: {
                valueSuffix: ' m/s'
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    pointInterval: 3600000, // one hour
                    pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
                }
            },
            series: [{
                    name: 'Hestavollane',
                    data: [4.3, 5.1, 4.3, 5.2, 5.4, 4.7, 3.5, 4.1, 5.6, 7.4, 6.9, 7.1,
                        7.9, 7.9, 7.5, 6.7, 7.7, 7.7, 7.4, 7.0, 7.1, 5.8, 5.9, 7.4,
                        8.2, 8.5, 9.4, 8.1, 10.9, 10.4, 10.9, 12.4, 12.1, 9.5, 7.5,
                        7.1, 7.5, 8.1, 6.8, 3.4, 2.1, 1.9, 2.8, 2.9, 1.3, 4.4, 4.2,
                        3.0, 3.0]

                }, {
                    name: 'Voll',
                    data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.3, 0.0,
                        0.0, 0.4, 0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                        0.0, 0.6, 1.2, 1.7, 0.7, 2.9, 4.1, 2.6, 3.7, 3.9, 1.7, 2.3,
                        3.0, 3.3, 4.8, 5.0, 4.8, 5.0, 3.2, 2.0, 0.9, 0.4, 0.3, 0.5, 0.4]
                }],
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        });
    },
    graficoAreaBasic: function(objeto) {
        $('#' + objeto.el).highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function() {
                        return this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Nuclear weapon states'
                },
                labels: {
                    formatter: function() {
                        return this.value / 1000 + 'k';
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                    name: 'USA',
                    data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                        1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                        27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                        26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                        22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                        10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
                }, {
                    name: 'USSR/Russia',
                    data: [null, null, null, null, null, null, null, null, null, null,
                        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                        4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                        15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                        33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                        35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                        21000, 20000, 19000, 18000, 18000, 17000, 16000]
                }]
        });
    }
});
Ext.reg('Std.Base.Graficador.CarouselGraficador', Std.Base.Graficador.CarouselGraficador);
