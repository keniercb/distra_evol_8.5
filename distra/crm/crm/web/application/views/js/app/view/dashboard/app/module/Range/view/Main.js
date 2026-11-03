Ext.define('Range.view.Main', {
    extend: 'Dashboard.view.core.Portlet',
    alias: 'widget.range-main-chart',
    requires: ['Range.view.Lines', 'Range.view.Pie', 'Dashboard.validator'],
    initComponent: function () {
        var config = this.config;
        var labels = this.$lang;
        if (config && labels) {
            Ext.apply(this, {
                height: 700,
                layout: 'border',
                closable: false,
                margins: '0 5 5 0',
                title: labels.moduleName,
                tbar: Ext.create('Ext.toolbar.Toolbar', {
                    layout: {
                        overflowHandler: 'Menu'
                    },
                    items: [{
                        text: 'Período',
                        labelWidth: 30,
                        labelAlign: 'right',
                        xtype: 'splitbutton',
                        vertical: true,
                        menu: {
                            closeAction: 'hide',
                            items: [
                                {boxLabel: '3 Meses', name: 'range-rb', inputValue: '3 month', xtype: 'radiofield'},
                                {
                                    boxLabel: '6 Meses',
                                    name: 'range-rb',
                                    inputValue: '6 month',
                                    checked: true,
                                    xtype: 'radiofield'
                                },
                                {boxLabel: '1 Año', name: 'range-rb', inputValue: '1 year', xtype: 'radiofield'}
                            ]
                        }
                    }, '->', {
                        fieldLabel: 'Inicio',
                        labelWidth: 30,
                        id:'range-start',
                        endDate : 'range-end',
                        labelAlign: 'right',
                        width: 150,
                        initial: true,
                        format: 'd/m/Y',
                        xtype: 'datefield',
                        vtype : 'daterange',
                        maxValue: new Date(),
                        enableKeyEvents: true
                    }, {
                        fieldLabel: 'Fin',
                        labelWidth: 30,
                        id:'range-end',
                        startDate : 'range-start',
                        labelAlign: 'right',
                        width: 150,
                        initial: false,
                        value: new Date(),
                        format: 'd/m/Y',
                        xtype: 'datefield',
                        vtype : 'daterange',
                        enableKeyEvents: true
                    }, '->']
                }),
                items: [{
                    region: 'center',
                    xtype: 'range-pie-chart'
                }, {
                    region: 'south',
                    xtype: 'range-line-chart'
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
