Ext.define('PRT.view.PanelProrrateo' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.panelprorrateo',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    frame: false,
    layout: 'border',

    initComponent: function() {

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            enableOverflow: true,
            items: [
                {
                    xtype: 'button',
                    text: this.idioma.btnConfigurar,
                    //tooltip: this.idioma.tooltipbtnConfigurar,
                    itemId: 'btnconfiguracionprorrateo'
                },'-',
                {
                    xtype: 'button',
                    text: "<span class='icondistra-asociar'></span>Asociar",
                    //tooltip: this.idioma.tooltipHojaDistribucion,
                    itemId: 'btnhojadistribucion',
                    //disabled: true
                },
                '-',
                {
                    xtype: 'button',
                    text: "<span class='icondistra-crearreporte'></span>Gestionar ficha de costo",
                    //tooltip: this.idioma.tooltipbtnAdicionar,
                    itemId: 'btnadicionarprorrateo',
                    //disabled: true
                },'-',{
                    xtype: 'button',
                    text: "<span class='icondistra-importar'></span>Importar",
                    //tooltip: this.idioma.lbModificarProrrateo,
                    itemId: 'btnmodificarprorrateo',
                    //disabled: true
                },'-',{
                    xtype: 'button',
                    text: "<span class='icondistra-vistareporte'></span>Vista reporte",
                    //tooltip: this.idioma.lbEliminarProrrateo,
                    itemId: 'btneliminarprorrateo',
                    //disabled: true
                },

            ]
        }];

        this.items = [
            {
                xtype: 'gridpanelprorrateo'
            },
            /*{
                xtype: 'panel',
                itemId: 'panelDetalleProrrateo',
                region: 'east',
                width: 350,
                title: this.idioma.titleCentroReceptor,
                collapsible: true,
                split: true,
                collapsed: true,
                autoScroll: true,
                bodyStyle: {
                    background: '#ffffff',
                    //background: '#323c41',
                    padding: '10 10 10 10',
                    boxSizing: 'border-box'
                }
            }*/
        ];

        this.callParent(arguments);
    }
});