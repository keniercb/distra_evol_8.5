Ext.define('Range.controller.MainCntrl', {
    extend: 'Ext.app.Controller',
    views: ['Main', 'Pie'],
    stores: ['Range.store.DateContractType', 'Range.store.ContractType'],
    refs: [{
        ref: 'mainContainer', selector: 'portalpanel'
    }],
    init: function () {
        this.listen({
            store: {
                '#range-date-contract-type': {
                    befroreload: function (store, record) {
                        console.log('store to load')
                    }
                }
            },
            component: {
                'range-pie-chart': {
                    beforerender: this.onPieBeforeRender
                },
                'range-main-chart tool[type=refresh]': {
                    click: this.onToolRefresh
                },
                'range-main-chart toolbar datefield': {
                    change: this.onDateFieldChange
                },
                'range-main-chart radiofield': {
                    change: this.onRadioFieldChange
                },
                'range-main-chart': {
                    afterrender: this.onMainRender
                }
            }
        });

    },
    emptySeries: function (chart) {
        for (var i = 0; i < chart.series.length; i++) {
            while (chart.series[i].data.length != 0) {
                chart.series[i].data[0].remove();
            }
        }
    },
    //in before render because it works with highchart config events
    onPieBeforeRender: function (view) {
        var me = this;
        var labels = this.application.$lang;
        var config = this.application.config.getPie();
        var lineChart = view.up('range-main-chart').down('range-line-chart');

        //-- Pie config
        config.series[0].events = {
            click: function (evt) {
				lineChart.store.removeAll();
                lineChart.store.getProxy().extraParams.type = evt.point.name;
                lineChart.store.load(function (records) {
					if (records.length == 0) {
						me.emptySeries(lineChart.chart);
					}
				});
                lineChart.draw();
            }
        };

        //-- Line config
        config = this.application.config.getLines();
        config.chartConfig.tooltip = {
            crosshairs: [true, true],
            shared: true,
            formatter: function () {
                var point0 = this.points[0].point;
                var point1 = this.points[1].point;
                var serie0Name = point0.series.name;
                var serie1Name = point1.series.name;
                return [
                    '<span style="font-weight:bold; font-size: 12px">',
                    labels.lblDate, ': ', this.x.toLocaleString(), '</span><br/>',
                    '<span style="color:', point0.color, '">\u25CF</span> ', serie0Name, ': <b>', point0.y, '</b><br/>',
                    '<span style="color:', point1.color, '">\u25CF</span> ', serie1Name, ': <b>',
                    point1.low, ' - ', point1.high, '</b><br/>'
                ].join('');
            }
        };
    },
    onToolRefresh: function (tool) {
        var labels = this.application.$lang;
        var portlet = tool.ownerCt.ownerCt;
        portlet.setLoading(labels.lbMsgLoader);
        var store = Ext.getStore('Range.store.ContractType');
        store.removeAll();
        store.load(function () {
            portlet.setLoading(false);
        });
    },
    onRadioFieldChange: function (radiofield) {
        var me = this;
        if (radiofield.checked) {
            var lineChart = radiofield.up('range-main-chart').down('range-line-chart');
            var menu = radiofield.up('menu');
            lineChart.store.removeAll();
            lineChart.store.getProxy().extraParams.period = radiofield.inputValue;
            lineChart.store.load(function (records) {
                if (records.length == 0) {
                    me.emptySeries(lineChart.chart);
                }
            });
            lineChart.draw();
            menu.close();
        }
    },
    onDateFieldChange: function (datefield) {
        var me = this;
        var lineChart = datefield.up('range-main-chart').down('range-line-chart');

        var value = datefield.getValue();
        if (datefield.initial) {
            lineChart.store.getProxy().extraParams.initDate = value;
        } else {
            lineChart.store.getProxy().extraParams.endDate = value;
        }
        lineChart.store.load(function (records) {
            if (records.length == 0) {
                me.emptySeries(lineChart.chart);
            }
        });
    },
    onMainRender: function (chart) {
        var me = this;
        var pieChart = chart.down('range-pie-chart');
        var lineChart = chart.down('range-line-chart');
        var datefield = chart.down('toolbar datefield[initial=false]');
        lineChart.store.getProxy().extraParams.endDate = datefield.getValue();
        pieChart.store.load(function (records) {
            records && Ext.defer(function () {
                pieChart.chart.series[0].points[records[0].index].select(true);
                lineChart.store.getProxy().extraParams.type = records[0].get('type');
                lineChart.store.load(function (records) {
					if (records.length == 0) {
						me.emptySeries(lineChart.chart);
					}
				});
				lineChart.draw();
            }, 1000);
        });
    }

});


