Ext.define('ClientContract.controller.MainCntrl', {
    extend: 'Ext.app.Controller',
    views: ['Main'],
    stores:['ClientContract.store.Browsers'],
    init: function () {
        this.listen({
            component: {
                'stock-contract-chart': {
                    afterrender: this.onRender
                },
                'stock-contract-chart tool[type=refresh]': {
                    click: this.onToolRefresh
                }
            }
        });
    },
    onRender: function (chart) {
        // New chart with config and id
        if(!Ext.getCmp('main_chart')) {
            var chartConfig = this.application.config.getColumnDrillDown();

            chartConfig.chartConfig.plotOptions.column.point.events.click = function () {
                var store = Ext.getCmp('main_chart').store;
                var extraParams = store.getProxy().extraParams;

                // Flick store params
                if (extraParams.total) {
                    delete extraParams.total;
                    extraParams.browser = this.category;
                } else {
                    extraParams.total = true;
                    delete extraParams.browser;
                }
                store.load();
            };

            var store = Ext.create('ClientContract.store.Browsers');
            store.getProxy().extraParams.total = true;

            chartConfig.id = 'main_chart';
            var mainChart = Ext.widget('highchart', chartConfig);
            store && mainChart.bindStore(store, true);
            chart.add(mainChart);
            //this.getMainContainer().doLayout();
            store && store.load();
        }
    },
    onToolRefresh: function (tool) {
        var labels = this.application.$lang;
        var portlet = tool.ownerCt.ownerCt;
        portlet.setLoading(labels.lbMsgLoader);
        var store = Ext.getStore('ClientContract.store.Browsers');
        store.load(function() {
            portlet.setLoading(false);
        });
    }

});


