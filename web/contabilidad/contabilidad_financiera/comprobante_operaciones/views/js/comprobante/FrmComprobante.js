Ext.namespace('Ext.FrmComprobante');

Ext.FrmComprobante.Comprobante = Ext.extend(Ext.form.FormPanel, {
    constructor: function(scope, params)
    {
        Ext.applyIf(params || this, {
            items:[{
                layout: 'column',
                bodyStyle: 'padding:0 5px 0 5px',
                border: false,
                hideBorders: true,
                bodyBorder: false,
                items: [{
                    columnWidth: .40,
                    layout: 'form',
                    bodyStyle: 'padding:0 10px 0 0',
                    labelAlign: 'top',
                    items: scope.cbxCuenta
                }]
            }, {
                border: false,
                hideBorders: true,
                bodyBorder: false,
                items: [
                    scope.fpContainerRegionTopGrid = {
                        layout: 'column',
                        bodyStyle: 'padding:5px 5px 0 5px',
                        border: false,
                        hideBorders: true,
                        bodyBorder: false,
                        items: [{
                            columnWidth: .10,
                            layout: 'form',
                            bodyStyle: 'padding:0 10px 0 0',
                            labelAlign: 'top',
                            items: scope.cbxMoneda
                        }, {
                            columnWidth: .15,
                            layout: 'form',
                            bodyStyle: 'padding:0 10px 0 0',
                            labelAlign: 'top',
                            items: scope.cbxTasa
                        }, {
                            columnWidth: .15,
                            layout: 'form',
                            bodyStyle: 'padding:0 10px 0 0',
                            labelAlign: 'top',
                            items: scope.txtFactorConversion
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            bodyStyle: 'padding:0 10px 0 0',
                            labelAlign: 'top',
                            items: scope.nfDebito
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            bodyStyle: 'padding:0 10px 0 0',
                            labelAlign: 'top',
                            items: scope.nfCredito
                        },
                        scope.pnlAlignBtnAceptarPase,
                        scope.pnlAlignBtnCancelarModificacionPase]
                    }
                ]
            }]
        });
        return Ext.FrmComprobante.Comprobante.superclass.constructor.call(this, params);
    }
});