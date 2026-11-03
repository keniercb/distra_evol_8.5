Ext.define('ClientContract.config',{
    config: {
        name: 'ClientContract',
        columnDrillDown : {
            series : [{
                type : 'column',
                dataIndex : 'usage',
                colorField: 'color',
                // Set this to white, so won't interfere with the series
                // index color
            }],
            xField: 'vendor',
            height : 400,
            //width : '100%',
            chartConfig : {
                chart : {
                    marginBottom : 60,
                    zoomType : 'x'
                },
                title : {
                    text : 'Column drill down demo. Click a column to drill down further (issues a load event)',
                    x : -20 //center
                },
                yAxis : {
                    title : {
                        text : 'Total percent market share'
                    }
                },
                legend: { enabled: false },
                plotOptions: {
                    column: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: Highcharts.getOptions().colors[0],
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function() {
                                return this.y +'%';
                            }
                        },
                        point: {
                            events: {
                                click: null
                            }
                        }
                    }
                }
            }
        }
    }
});