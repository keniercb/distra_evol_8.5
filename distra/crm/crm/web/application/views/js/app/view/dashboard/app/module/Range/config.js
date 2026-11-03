Ext.define('Range.config', {
    config: {
        name: 'Range',
        lines: {
            series: [{
                dataIndex: 'clientmeanamount',
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                type: 'areasplinerange',
                //minDataIndex: 'clientminamount',
                //maxDataIndex: 'clientmaxamount',
                xField: 'clienttime',
                fillOpacity: 0.3,
                lineWidth: 0,
                zindex: 0,
                dataIndex: ['clientminamount', 'clientmaxamount'],
                linkedTo: ':previous'
            }],
            xField: 'clienttime',
            chartConfig: {
                title: {
                    text: ''
                },
                // xAxis: {
                //     type: "datetime",
                //     dateTimeLabelFormats: { // don't display the dummy year
                //         month: '%e. %b',
                //         year: '%b'
                //     }
                // },
                chart: {
                    events: {}
                },
                xAxis: {
                    labels: {
                        rotation: -45,
                        align: 'center',
                        formatter: function () {
                            if (this.value.toLocaleDateString)
                                return this.value.toLocaleDateString();
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
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