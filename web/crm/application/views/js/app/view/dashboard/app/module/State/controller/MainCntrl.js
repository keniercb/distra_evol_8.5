Ext.define('State.controller.MainCntrl', {
    extend: 'Ext.app.Controller',
    views: ['Main', 'MainGrid', 'Chart'],
    stores: ['State.store.AmountState'],
    refs: [{
        ref: 'mainContainer', selector: 'portalpanel'
    }],
    init: function () {
        this.listen({
            store: {
                '#state_client_provider_amount': {
                    load: this.onStoreLoad
                }
            },
            component: {
                'state-main-chart': {
                    afterrender: this.onRender
                },
                'state-main-chart tool[type=refresh]': {
                    click: this.onToolRefresh
                },
                'state-main-chart tool[type$=chart]': {
                    click: this.onToolChart
                },
                'state-main-chart toolbar radiofield': {
                    change: this.onClientProvider
                }
            }
        });

    },
    configurePortlet: function (portlet, grid, chart, store, cfg, labels) {
        if (chart.down('highchart')) {
            chart.removeAll(true);
        }
        var mainChart = Ext.widget('highchart', cfg);
        store && mainChart.bindStore(store, true);
        chart.add(mainChart);
        portlet.setLoading(labels.lbMsgLoader);
        store && store.load(function (data) {
            cfg.chartConfig.xAxis.categories = data.map(function (item) {
                return item.get('state_name');
            });
            mainChart.draw();
            grid.reconfigure();
            portlet.setLoading(false);
        });
    },
    onStoreLoad: function (store, records) {
        var mean = records.map(function (item) {
                return item.get('amount');
            }).reduce(function (prev, current) {
                return prev + current;
            }) / records.length;
        var chi2 = records.map(function (item) {
                return item.get('mean');
            }).reduce(function (prev, current) {
                return prev + current;
            }) / records.length;

        this.application.config.mean = mean;
        this.application.config.chi2 = chi2;
    },
    /*onChartRender: function (view) {
     view.body.insertHtml('afterBegin', view.getCategoriesCmp());
     Ext.get(view.getCategoriesRef()).on('click', function (e, t) {
     Ext.create('State.store.AmountState', {
     autoLoad: false
     }).load({
     params: {isClient: t.value}
     });
     }, this, {
     delegate: 'input[type=radio]'
     });
     },*/
    //
    onRender: function (view) {
        var grid = view.down('state-main-grid');
        var sm = grid.getSelectionModel();
        //configure actions for series type
        var lineConfig = this.application.config.getLine();
        var pieConfig = this.application.config.getPie();
        var barConfig = this.application.config.getBar();
        var pointConfig = this.application.config.getPoint();

        lineConfig.series[0].events = pieConfig.series[0].events = barConfig.series[0].events = pointConfig.series[0].events = {
            click: function (evt) {
                sm.select(evt.point.index);
            }
        };
        sm && sm.on('selectionchange', function (selModel, records) {
            var highchart = view.down('state-chart').down('highchart');
            (records.length > 0) && highchart.chart.series[0].points[records[0].index].select(true);
        });
        this.application.config.mean = 0;
        this.onToolChart(view.down('tool[type=piechart]'));

    },
    onToolRefresh: function (tool) {
        var portlet, chartStore, gridStore,
            labels = this.application.$lang;

        portlet = Ext.ComponentQuery.query('state-main-chart')[0];
        if(!portlet){
            Ext.raise('Does not exist Component "state-main-chart"');
        }
        portlet.setLoading(labels.lbMsgLoader);
        chartStore = Ext.getStore('state_client_provider_amount');
        gridStore = portlet.down('state-main-grid').store;

        var doit = false;
        chartStore && chartStore.load(function () {
            doit && portlet.setLoading(false);
            doit = true;
        });
        gridStore && gridStore.load(function () {
            doit && portlet.setLoading(false);
            doit = true;
        });
    },
    onToolChart: function (tool) {

        var labels = this.application.$lang;
        var cfg, config = this.application.config;
        var portlet = tool.ownerCt.ownerCt;
        var chart = portlet.down('state-chart');
        var grid = portlet.down('state-main-grid');
        var store = Ext.create('State.store.AmountState', {
            autoLoad: false
        });

        var tooltip = {
            formatter: function () {
                return [
                    '<b>', this.point.name, '</b>',
                    '<br/>Monto : ', this.y
                ].join('');
            }
        };
        var marginBottom = 140;
        var yAxis = {
            title: {
                text: labels.chartYTitle
            },
            plotLines: [{
                value: config.mean,
                width: 1,
                label: {
                    rotation: 270,
                    text: labels.chartMeanLine,
                    verticalAlign: 'middle',
                    y: 20,
                    x: -4,
                    style: {
                        "color": "#bbb",
                        "fontSize": "10px"
                    }
                },
                dashStyle: 'dash',
                color: '#808080'
            }]
        };

        switch (tool.type) {
            case 'barchart':
                cfg = config.getBar();
                tooltip = {
                    formatter: function () {
                        return '<b>' + this.x + '</b>' + '<br>Monto : ' + this.y;
                    }
                };
                break;
            case 'linechart':
                cfg = config.getLine();
                break;
            case 'pointchart':
                cfg = config.getPoint();
                break;
            case 'piechart':
                cfg = config.getPie();
                marginBottom = 70;
                tooltip = {
                    formatter: function () {
                        return [
                            '<b>', this.point.name, '</b>',
                            '<br/>Monto : ', this.y,
                            '<br/>Porciento : ', Math.round(this.percentage), '%'
                        ].join('');
                    }
                };
                yAxis = {};
        }

        cfg.chartConfig.chart.marginBottom = marginBottom;
        cfg.chartConfig.tooltip = tooltip;
        cfg.chartConfig.yAxis = yAxis;
        //
        // cfg.chartConfig.title.text = labels.chartTitle;
        cfg.chartConfig.legend = {
            enabled: false
        };

        this.configurePortlet(portlet, grid, chart, store, cfg, labels);
    },
    onClientProvider: function (radiofield) {
        if (!radiofield.checked) {
            return;
        }
        var labels = this.application.$lang;
        var portlet = radiofield.up('state-main-chart');
        var chartStore = Ext.getStore('state_client_provider_amount');
        var gridStore = portlet.down('state-main-grid').store;

        portlet.setLoading(labels.lbMsgLoader);
        chartStore.getProxy().extraParams.isClient = radiofield.inputValue;
        gridStore.getProxy().extraParams.isClient = radiofield.inputValue;

        this.onToolRefresh();
    }

});


