Ext.define('Sales.config', {
    config: {
        name: 'Sales',
        lines: {
            series: [{
                type: 'line',
                xField: 'clienttime',
                dataIndex: 'clientamount',
                dataLabels: {
                    style: {
                        "color": "gray",
                        "fontSize": "11px",
                        "fontWeight": "bold",
                        "textShadow": "0 0 2px contrast, 0 0 1px contrast"
                    }
                }
            }, {
                type: 'line',
                xField: 'providertime',
                dataLabels: {
                    style: {
                        "color": "black",
                        "fontSize": "11px",
                        "fontWeight": "bold",
                        "textShadow": "0 0 2px contrast, 0 0 1px contrast"
                    }
                },
                dataIndex: 'provideramount'
            }],
            chartConfig: {
                title: {
                    text: ''
                },
                subtitle: {
                    text: null
                },
                xAxis: {},
                yAxis: {
                    title: {}
                },
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    events: {}
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                }
            }
        },
        pie: {
            series: [{
                type: 'pie',
                categorieField: 'type',
                dataField: 'count'
            }],
            chartConfig: {
                chart: {
                    plotBackgroundColor: null,
                    //plotBorderWidth: 1,//null,
                    plotShadow: false
                },
                xAxis: {},
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                tooltip: {},
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y} ({point.percentage:.0f} %)',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                width: 110
                            }
                        }
                    }
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    enabled: false
                }
            }
        }
    }
});