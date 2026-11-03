Ext.define('PRT.view.PanelProrrateo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panelprorrateo',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    frame: false,
    layout: 'border',

    initComponent: function () {

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            enableOverflow: true,
            items: [
                {
                    xtype: 'button',
                    text: this.idioma.btnConfigurar,
                    tooltip: this.idioma.tooltipbtnConfigurar,
                    itemId: 'btnconfiguracionprorrateo'
                },
                {
                    xtype: 'button',
                    text: this.idioma.btnHojaDistribucion,
                    tooltip: this.idioma.tooltipHojaDistribucion,
                    itemId: 'btnhojadistribucion',
                    // hidden: true,
                    disabled: true
                },
                '-',
                {
                    xtype: 'button',
                    text: this.idioma.btnAdicionar,
                    tooltip: this.idioma.tooltipbtnAdicionar,
                    itemId: 'btnadicionarprorrateo',
                    disabled: false
                }, {
                    xtype: 'button',
                    text: this.idioma.btnModificar,
                    tooltip: this.idioma.lbModificarProrrateo,
                    itemId: 'btnmodificarprorrateo',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: this.idioma.btnEliminar,
                    tooltip: this.idioma.lbEliminarProrrateo,
                    itemId: 'btneliminarprorrateo',
                    disabled: true
                },
                //'-',
                {
                    xtype: 'button',
                    text: this.idioma.btnEjecutar,
                    tooltip: this.idioma.tooltipbtnEjecutar,
                    itemId: 'btnejecutarprorrateo',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: this.idioma.btnCancelarProrra,
                    tooltip: this.idioma.tooltipbtnCancelarProrra,
                    itemId: 'btncancelarprorrateo',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: this.idioma.btnVerCmp,
                    tooltip: this.idioma.tooltipbtnVerCmp,
                    itemId: 'btnvercomprobante',
                    disabled: true,
                    hidden: true
                },
                '->',
                {
                    xtype: 'label',
                    text: '',
                    hidden: true,
                    itemId: 'labelSaldoGasto',
                    style: {
                        fontWeight: 'bold',
                        color: '#0E5CBE'
                    }
                }, {
                    xtype: 'button',
                    text: this.idioma.btnActualizarSaldo,
                    tooltip: this.idioma.tooltipbtnActualizarSaldo,
                    itemId: 'btnActualizarSaldo'
                },
                '-',
                {
                    xtype: 'label',
                    text: '',
                    hidden: true,
                    itemId: 'labelfechacontable',
                    //style: 'font-weight:bold;' //Es lo mismo que lo de abajo
                    style: {
                        fontWeight: 'bold'
                    }
                },
                {
                    xtype: 'button',
                    text: this.idioma.btnAyuda,
                    tooltip: this.idioma.tooltipbtnAyuda,
                    itemId: 'btnAyuda'
                }
            ]
        }];

        this.items = [
            {
                xtype: 'gridpanelprorrateo'
            },
            {
                xtype: 'panel',
                itemId: 'panelDetalleProrrateo',
                region: 'east',
                width: 330,
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
            }
        ];

        this.callParent(arguments);
    }
});