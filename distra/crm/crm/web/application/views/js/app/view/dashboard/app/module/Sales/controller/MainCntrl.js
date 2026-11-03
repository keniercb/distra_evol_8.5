Ext.define('Sales.controller.MainCntrl', {
    extend: 'Ext.app.Controller',
    views: ['Main', 'Pie'],
    stores: ['Sales.store.DateContractType', 'Sales.store.ContractType'],
    refs: [{
        ref: 'mainContainer', selector: 'portalpanel'
    }],
    init: function () {
        this.listen({
            store: {
                '#sales-date-contract-type': {
                    befroreload: function (store, record) {
                        console.log('store to load')
                    }
                }
            },
            component: {
                'sales-pie-chart': {
                    beforerender: this.onPieBeforeRender
                },
                'sales-main-chart tool[type=refresh]': {
                    click: this.onToolRefresh
                },
                'sales-main-chart toolbar datefield': {
                    change: this.onDateFieldChange
                },
                'sales-main-chart': {
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
        var lineChart = view.up('sales-main-chart').down('sales-line-chart');

        //-- Pie config
        config.series[0].events = {
            click: function (evt) {
                lineChart.store.getProxy().extraParams.type = evt.point.name;
                lineChart.store.load(function (records) {
                    if (records.length == 0) {
                        me.emptySeries(lineChart.chart);
                    }
                    Highcharts.fireEvent(lineChart.chart, 'load');
                });
            }
        };

        //-- Line config
        config = this.application.config.getLines();
        config.chartConfig.chart.events.load = function () {
            for (var key in this.series) {
                var removeIndex = [];
                var weight = 0;
                var i, aSeries = this.series[key];
                for (i in aSeries.data) {
                    if (aSeries.data[i].x + aSeries.data[i].y == 0) {
                        removeIndex.push(parseInt(i));
                    }
                }
                for (i in removeIndex) {
                    var iRemove = removeIndex[i] - weight;
                    this.series[key].data[iRemove].remove();
                    weight = weight + 1;
                }
            }
        };
        config.chartConfig.tooltip = {
            formatter: function () {
                var name, record = lineChart.store.getAt(this.point.index);
                var dt = Ext.Date.parse(parseInt(this.x) / 1000, "U");
                if (record) {
                    if (this.series.index === 0) {
                        name = '<b>' + this.series.name + ': </b>' + record.get('clientnumber');
                    } else {
                        name = '<b>' + this.series.name + ': </b>' + record.get('providernumber');
                    }
                    return [
                        name,
                        '<br/><b>', labels.lblDate, ': </b>', Ext.Date.format(dt, "d/m/Y H:i:s"),
                        '<br/><b>', labels.lblAmount, ': </b>', this.y
                    ].join('');
                }
                return false;
            }
        };
    },
    onToolRefresh: function (tool) {
        var labels = this.application.$lang;
        var portlet = tool.ownerCt.ownerCt;
        portlet.setLoading(labels.lbMsgLoader);
        var store = Ext.getStore('Sales.store.ContractType');
        store.load(function () {
            portlet.setLoading(false);
        });
    },
    onDateFieldChange: function (datefield) {
        var me = this;
        var lineChart = datefield.up('sales-main-chart').down('sales-line-chart');
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
            Highcharts.fireEvent(lineChart.chart, 'load');
        });
    },
    onMainRender: function (chart) {
        var pieChart = chart.down('sales-pie-chart');
        var lineChart = chart.down('sales-line-chart');
        var datefield = chart.down('toolbar datefield[initial=false]');
        lineChart.store.getProxy().extraParams.endDate = datefield.getValue();
        pieChart.store.load(function (records) {
            records && Ext.defer(function () {
                pieChart.chart.series[0].points[records[0].index].select(true);
                lineChart.store.getProxy().extraParams.type = records[0].get('type');
                lineChart.store.load();
            }, 1000);
        });

    }

});


