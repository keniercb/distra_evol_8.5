Ext.define('State.view.Main', {
    extend: 'Dashboard.view.core.Portlet',
    alias: 'widget.state-main-chart',
    requires: ['State.view.Chart', 'State.view.MainGrid'],
    initComponent: function () {
        var config = this.config;
        var labels = this.$lang;
        if (config && labels) {

            Ext.apply(this, {
                height: 650,
                layout: 'border',
                margins: '0 5 5 0',
                closable: false,
                title: labels.moduleName,
                items: [{
                    region: 'center',
                    xtype: 'state-chart'
                }, {
                    region: 'south',
                    xtype: 'state-main-grid'
                }],
                tbar: Ext.create('Ext.toolbar.Toolbar', {
                    layout: {
                        overflowHandler: 'Menu'
                    },
                    items: ['->', {
                        boxLabel: 'Clientes',
                        inputValue: 1,
                        xtype: 'radiofield',
                        checked: true,
                        name: 'state-radio'
                    }, ' ', ' ', {
                        boxLabel: 'Proveedores',
                        inputValue: 0,
                        name: 'state-radio',
                        xtype: 'radiofield'
                    }, '->']
                }),
                tools: [{
                    xtype: 'tool',
                    type: 'refresh'
                }, {
                    xtype: 'tool',
                    type: 'piechart'
                }, {
                    xtype: 'tool',
                    type: 'barchart'
                }, {
                    xtype: 'tool',
                    type: 'linechart'
                }, {
                    xtype: 'tool',
                    type: 'pointchart'
                }]
            });
        }
        this.callParent(arguments);
    }
});
