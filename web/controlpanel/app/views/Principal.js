Ext.define('Controlpanel.view.Principal', {
    /*require: [
        'Replica.view.ArbolAmbientes',
        'Replica.view.PanelNodos',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],*/
    extend: 'Ext.container.Viewport',
    alias: 'widget.principal',
    //border: 0,
    initComponent: function(){


        this.PanelCenter = Ext.widget('panelCenter');
        this.PanelEast = Ext.widget('panelEast');
        this.PanelWest = Ext.widget('panelWest');

        var _this = this;
        this.layout  = 'fit';
        this.items = [
            {
                xtype: 'panel',
                layout: 'border',
                dockedItems: [{
                    xtype: 'toolbar',
                    items: ['->',{
                        text: Zeolides.etiquetas.textAyuda,
                        iconCls: "ayuda",
                        tooltip : Zeolides.etiquetas.tooltipAyuda,
                        name: 'btnAyuda',
                        id: 'btnAyuda'
                    }]
                }],
                items: [
                    this.PanelCenter,
                    this.PanelEast,
                    this.PanelWest
                ]
            }
        ],
        this.callParent(arguments);
    }


});