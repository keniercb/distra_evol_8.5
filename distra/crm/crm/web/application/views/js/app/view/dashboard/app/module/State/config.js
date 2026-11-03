Ext.define('State.config', {
    config: {
        name: 'State',
        mean: 0,
        line: {
            series: [{
                type: 'line',
                xField: 'state_name',
                dataIndex: 'amount',
                dataLabels: {
                    style: {
                        "color": "gray",
                        "fontSize": "11px",
                        "fontWeight": "bold",
                        "textShadow": "0 0 2px contrast, 0 0 1px contrast"
                    }
                }
            }],
            chartConfig: {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {},
                yAxis: {
                    title: {}
                },
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                }
            }
        },
        pie: {
            series: [{
                type: 'pie',
                categorieField: 'state_name',
                dataField: 'amount'
            }],
            chartConfig: {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {},
                yAxis: {
                    title: {}
                },
                chart: {
                    //margin: 40,
                    //spacingBottom:100,
                    zoomType: 'x'
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {},
                plotOptions: {
                    pie: {
                        //showInLegend: true,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: ' {point.y} ({point.percentage:.0f} %)',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    borderWidth: 0
                }
            }
        },
        point: {
            series: [{
                type: 'line',
                lineWidth: 0,
                xField: 'state_name',
                dataIndex: 'amount',
                dataLabels: {
                    style: {
                        "color": "gray",
                        "fontSize": "11px",
                        "fontWeight": "bold",
                        "textShadow": "0 0 2px contrast, 0 0 1px contrast"
                    }
                }
            }],
            chartConfig: {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {},
                yAxis: {},
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                }
            }
        },
        bar: {
            series: [{
                type: 'column',
                dataIndex: 'amount',
                dataLabels: {
                    style: {
                        "color": "gray",
                        "fontSize": "11px",
                        "fontWeight": "bold",
                        "textShadow": "0 0 2px contrast, 0 0 1px contrast"
                    }
                }
            }],
            xField: 'state_name',
            chartConfig: {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: '',
                },
                subtitle: {
                    text: '',
                },
                plotOptions: {
                    column: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            }
        }
    }
});