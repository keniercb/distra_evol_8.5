/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.tiporeclamo = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idtiporeclamo';
        config.codigo = false;
        /*this.storeFields = [
            {
                name: 'generarpedido'
            },
            {
                name: 'idtiporeclamo'
            },
            {
                name: 'descripcion'
            }
        ];


        this.formFields = [new Ext.form.FieldSet(
            {
                style: '-moz-border-radius:5px',
                anchor: '98%',
                autoHeight: true,
                layout: 'column',
                items: [
                    {
                        columnWidth: .35,
                        items: [
                            {
                                xtype: 'checkbox',
                                boxLabel: 'Generar pedido',
                                name: 'generarpedido',
                                anchor: '95%',
                                value: 0,
                                hideLabel: true,
                                listeners: {
                                    'check': function (_checkbox, checked) {
                                        _checkbox.setRawValue(checked == true ? 1 : 0);
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        )];*/


        Ext.erp.tiporeclamo.superclass.constructor.call(this, config);
    }
});