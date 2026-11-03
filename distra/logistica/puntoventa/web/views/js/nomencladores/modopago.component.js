Ext.ns('Ext.erp');

Ext.erp.modopago = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        config.codigo = true;    
        this.campoIdNomenclador = 'idmodopago';
        Ext.apply(this, config);

        this.storeFields = [{
            name: 'recargodescuento'
        },{
            name: 'valor'
        },{
            name: 'porcentual'
        }];
        this.columnsFields = [ {
            dataIndex: 'recargodescuento',
            header: 'Concepto',
            width: 120,
            renderer: function(value, metaData, rd) {
                if (value == '+') {
                    return 'Recargo';
                } else if (value == '-') {
                    return 'Descuento';
                }
            }
        },{
            dataIndex: 'porcentual',
            header: 'Porcentual',
            width: 75,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else if (value == 0) {
                    metaData.css = 'inactivo';
                }
            }
        },{
            dataIndex: 'valor',
            header: 'Valor',
            width: 75,
            renderer: function(value, metaData, rd) {
                console.log()
                if (rd.data.porcentual == 1) {
                    return value+'%';
                } else {
                    return value;
                }
            }
        }];

        this.chbxProciento = new Ext.form.Checkbox({
            boxLabel: 'Porcentual',
            name: 'porcentual',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    Ext.getCmp('idhdporcentual').setValue(checked == true ? 1 : 0);
                }
            }
        });

        Ext.erp.modopago.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        this.txtValor = LOG.util.Prototipos.inputDecimal({
            name: 'valor',
            allowBlank: false,
            anchor: '98%',
            hideLabel: true
        });
        this.storeRecDesc = new Ext.data.SimpleStore({
            fields: ['signo', 'operacion'],
            data: [['+', 'Recargo'], ['-', 'Descuento']]
        });
        this.cmbConcepto = new Ext.form.ComboBox({
            store: this.storeRecDesc,
            fieldLabel: 'Concepto',
            displayField: 'operacion',
            id: 'cmbconcepto',
            valueField: 'signo',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'recargodescuento'
        });

        this.formFields = [{
            layout: 'column',
            items: [ {
                columnWidth: 1,
                layout: 'form',
                items: this.cmbConcepto
            }]
        },{
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: this.txtValor
            }, {
                columnWidth: .5,
                layout: 'form',
                items: this.chbxProciento
            }]
        },{
            xtype: 'hidden',
            name: 'porcentual',
            id: 'idhdporcentual',
            value: 0
        }];
    }
});
