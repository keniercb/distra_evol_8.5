Ext.ns('Ext.erp');

Ext.erp.categoriaprecio = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        config.codigo = false;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomCategoriaprecioModel';
        this.campoIdNomenclador = 'idcategoriaprecio';
        this.storeFields = [{
                name: 'concepto'
            }, {
                name: 'porciento'
            }, {
                name: 'conformaprecio'
            }, {
                name: 'aplicartodos'
            }, {
                name: 'valor'
            }];
        
      
        this.columnsFields = [{
                dataIndex: 'concepto',
                header: _this.idioma.lbConcepto,
                width: 95,
                renderer: function(value, metaData) {
                    if (value == '+') {
                        return 'Suma';
                    } else {
                        return 'Resta';
                    }
                }
            }, {
                dataIndex: 'porciento',
                header: _this.idioma.lbPorciento,
                width: 75,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }, {
                dataIndex: 'conformaprecio',
                header: _this.idioma.lbConforma,
                width: 95,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }, {
            dataIndex: 'aplicartodos',
            header: _this.idioma.lbAplicarTodos,
            width: 95,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }];
        this.chbxProciento = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbPorciento,
            name: 'porciento',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                }
            }
        });
        this.chbxConforma = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbConforma,
            name: 'conformaprecio',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                }
            }
        });
        this.chbxAplicarTodos = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbAplicarTodos,
            name: 'aplicartodos',
            hideLabel: true,
            listeners: {
                'check': function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked == true) {
                        _this.txtValor.enable();
                    } else {
                        _this.txtValor.disable();
                    }
                }
            }
        });

        

        Ext.erp.categoriaprecio.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
         var _this = this;
           this.txtValor = LOG.util.Prototipos.inputDecimal({
            disabled: true,
            name: 'valor',
            allowBlank: false,
            anchor: '50%'
        });
        this.storecmbConcepto = new Ext.data.SimpleStore({
            fields: ['no', 'operacion'],
            data: [['+', 'Suma'], ['-', 'Resta']]
        });
		this.storecmbMoneda = new Ext.data.SimpleStore({
            fields: ['idnomnoneda', 'codigoiso'],
            data: [[1, 'CUP'], [2, 'CUC']]
        });
        this.cmbConcepto = new Ext.form.ComboBox({
            store: this.storecmbConcepto,
            fieldLabel: _this.idioma.lbConcepto,
            displayField: 'operacion',
            id: 'cmbconcepto',
            valueField: 'no',
            typeAhead: true,
            mode: 'local',
            anchor: '100%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: _this.idioma.tiplbConcepto,
            selectOnFocus: true,
            hiddenName: 'concepto'
        });
		this.cmbMonedas = new Ext.form.ComboBox({
            store: this.storecmbConcepto,
            fieldLabel: 'Moneda',
            displayField: 'codigoiso',
            id: 'idnomnoneda',
            valueField: 'idnomnoneda',
            typeAhead: true,
            mode: 'local',
            anchor: '100%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'moneda'
        });
        this.formFields = [{
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        items: this.cmbConcepto
                    }, {
                        columnWidth: .5,
                        items: this.cmbConcepto
                    }]
            }], {
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        items: [
                            this.chbxProciento,
                            this.chbxConforma
                        ]
                    }, {
                        columnWidth: .5,
                        items: [
                            this.chbxAplicarTodos,
                            this.txtValor
                        ]
                    }]
            }];
    }
});
