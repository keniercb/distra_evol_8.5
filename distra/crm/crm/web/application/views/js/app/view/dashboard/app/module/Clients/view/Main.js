Ext.define('Clients.view.Main', {
    extend: 'Dashboard.view.core.Portlet',
    alias: 'widget.clients-main',
    requires: ['Clients.view.Chart', 'Clients.view.MainGrid'],
    initComponent: function () {
        var config = this.config;
        var labels = this.$lang;
        if (config && labels) {

            var dateMenu = Ext.create('Ext.menu.DatePicker');
            var menu = Ext.create('Ext.menu.Menu', {
                style: {
                    overflow: 'visible'     // For the Combo popup
                },
                closeAction: 'hide',
                items: [{
                    text: 'Por montos',
                    menu: {        // <-- submenu by nested config object
						closeAction: 'hide',
                        items: [{
                            boxLabel: '10 Mejores', name: 'client-rb', inputValue: '0', xtype: 'radiofield'
                        }, {
                            boxLabel: '10 Peores', name: 'client-rb', inputValue: '1', xtype: 'radiofield'
                        }, {
                            boxLabel: 'Todos', name: 'client-rb', inputValue: '2', xtype: 'radiofield'
                        }]
                    }
                }, {
                    text: 'Por fecha firma',
                    iconCls: 'calendar',
                    menu: dateMenu // <-- submenu by reference
                }]
            });

            Ext.apply(this, {
                height: 650,
                layout: 'border',
                margins: '0 5 5 0',
                closable: false,
                title: labels.moduleName,
                items: [{
                    region: 'center',
                    xtype: 'clients-main-chart'
                }, {
                    region: 'south',
                    xtype: 'clients-main-grid'
                }],
                tbar: Ext.create('Ext.toolbar.Toolbar', {
                    layout: {
                        overflowHandler: 'Menu'
                    },
                    items: [{
                        text: 'Filtros',
                        iconCls: 'bmenu',  // <-- icon
                        menu: menu  // assign menu by instance
                    }, '->', {
                        boxLabel: 'Clientes',
                        inputValue: 1,
                        xtype: 'radiofield',
                        checked: true,
                        name: 'clients-radio'
                    }, ' ', ' ', {
                        boxLabel: 'Proveedores',
                        inputValue: 0,
                        name: 'clients-radio',
                        xtype: 'radiofield'
                    }, '->', ' ', '->']
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
