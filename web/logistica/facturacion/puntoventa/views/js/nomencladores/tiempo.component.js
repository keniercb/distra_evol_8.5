Ext.ns('Ext.erp');

Ext.erp.tiempo = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        config.codigo = false;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idtiempo';
        this.storeFields = [{
            name: 'cantidaddias'
        }];
        this.columnsFields = [{
            dataIndex: 'cantidaddias',
            header: 'Cantidad dias',
            width: 95
        }];
        Ext.erp.tiempo.superclass.constructor.call(this, config);
    },
    initFormFields: function () {
        var _this = this;
        this.Cantdias = LOG.util.Prototipos.inputEntero({
            fieldLabel: 'Cantidad de dias',
            //disabled: true,
            name: 'cantidaddias',
            allowBlank: false,
            anchor: '98%'
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                //  columnWidth: .5,
                layout: 'form',
                items: this.Cantdias
            }]
        }]
    }
});