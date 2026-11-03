Ext.define('Sales.view.Main', {
    extend: 'Dashboard.view.core.Portlet',
    alias: 'widget.sales-main-chart',
    requires: ['Sales.view.Lines', 'Sales.view.Pie','Dashboard.validator'],
    constructor:function(){
        //console.log(arguments);
        //console.log(this);
        this.callParent(arguments);
    },
    initComponent: function () {
        var config = this.config;
        var labels = this.$lang;
        if (config && labels) {
            var handleAction = function(action){
                Ext.example.msg('<b>Action</b>', 'You clicked "' + action + '"');
            };
            Ext.apply(this, {
                height: 700,
                layout: 'border',
                closable:false,
                margins: '0 5 5 0',
                title: labels.moduleName,
                tbar: Ext.create('Ext.toolbar.Toolbar', {
                    layout: {
                        overflowHandler: 'Menu'
                    },
                    items: ['->', {
                        id:'sales-start',
                        endDate : 'sales-end',
                        fieldLabel: 'Inicio',
                        labelWidth: 30,
                        labelAlign:'right',
                        format: 'd/m/Y',
                        width: 150,
                        initial:true,
                        xtype: 'datefield',
                        vtype : 'daterange',
                        maxValue: new Date(),
                        enableKeyEvents: true
                    }, {
                        id:'sales-end',
                        startDate : 'sales-start',
                        fieldLabel: 'Fin',
                        labelWidth: 30,
                        labelAlign:'right',
                        vtype : 'daterange',
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        width: 150,
                        initial:false,
                        value: new Date(),
                        enableKeyEvents: true
                    },'->']
                }),
                items: [{
                    region:'center',
                    xtype: 'sales-pie-chart'
                },{
                    region:'south',
                    xtype: 'sales-line-chart'
                }],
                tools: [{
                    xtype: 'tool',
                    //type: 'piechart',
                    type: 'refresh'
                }]
            });
        }
        this.callParent(arguments);
    }
});
