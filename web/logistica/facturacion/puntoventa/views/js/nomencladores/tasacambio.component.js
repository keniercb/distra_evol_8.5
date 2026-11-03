Ext.ns('Ext.erp');

Ext.erp.tasacambio = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {        
        config.codigo = false; 
        var _this = this;
        //config.denominacion = false;
        //this.bussinesModel = 'NomTasaCambioModel';
        this.campoIdNomenclador = 'idtasacambio';
        Ext.apply(this, config);
        this.storeFields = [{
            name: 'idmonedabase'
        }, {
            name: 'idmonedacambio'
        }, {
            name: 'venta'
        }, {
            name: 'devolucion'
        }];

        this.columnsFields = [{
            dataIndex: 'idmonedabase',
            header: 'Moneda base',
            width: 95,
            renderer: function(value, metaData) {
                if (value == idmoneda) {
                    return moneda;
                } else if (value == idmonedaalternativa){
                    return monedaalternativa;
                }
            }
        },{
            dataIndex: 'idmonedacambio',
            header: 'Moneda cambio',
            width: 95,
            renderer: function(value, metaData) {
                if (value == idmoneda) {
                    return moneda;
                } else if (value == idmonedaalternativa){
                    return monedaalternativa;
                }
            }
        }, {
            dataIndex: 'venta',
            header: 'Venta',
            align: 'right',
            width: 95
        }, {
            dataIndex: 'devolucion',
            header: 'Devolución',
            align: 'right',
            width: 95
        }];
        
        Ext.erp.tasacambio.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        var _this = this;
        

        this.stMonedaAlternativa = new Ext.data.Store({
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarmonedas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idmoneda"
            }, [{
                name: 'idmoneda'
            }, {
                name: 'codigoiso'
            }])
        });

        this.cmbMoneda = new LOG.util.ComboBox({
            id: 'cmbMoneda',
            emptyText: 'Seleccione...',//scope.etiquetas.lbSeleccionar,
            fieldLabel: 'Moneda cambio',//scope.etiquetas.lbMonedaAlternativa,
            blankText: 'Moneda cambio',//scope.etiquetas.lbBlankText,
            forceSelection: true,
            typeAhead: true,
            editable: true,
            allowBlank: false,
            store: this.stMonedaAlternativa,
            name: 'idmonedacambio',
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            triggerAction: 'all',
            hiddenName: 'idmonedacambio',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            anchor: '98%',
            listeners: {
                keyup: function () {
                    //comprobarVentana();
                },
                select: function () {
                    //comprobarVentana();
                },
                expand: function (combo) {
                    //this.stMonedaAlternativa.clearFilter();
                    this.stMonedaAlternativa.filterBy(function (record) {
                        return record.json.idmonedaentidad != this.cmbMonedaContable.getValue();
                    });
                }
            }
        });

        this.stMonedaContable = new Ext.data.SimpleStore({
            fields: ['idnomnoneda', 'codigoiso'],
            data: [[idmoneda, moneda], [idmonedaalternativa, monedaalternativa]]
        });

        /*this.stMonedaContable = new Ext.data.Store({
            url: 'cargarmonedacont',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idmonedaentidad"
            }, [{
                name: 'idmonedaentidad'
            }, {
                name: 'codigoiso'
            }])
        });*/

        this.cmbMonedaContable = new LOG.util.ComboBox({
            id: 'cmbMonedaContable',
            emptyText: 'Seleccione...',//scope.etiquetas.lbSeleccionar,
            fieldLabel: 'Moneda base',//scope.etiquetas.lbMonedaContable,
            blankText: 'Moneda base',//scope.etiquetas.lbBlankText,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            store: this.stMonedaContable,
            name: 'idmonedabase',
            displayField: 'codigoiso',
            valueField: 'idnomnoneda',
            triggerAction: 'all',
            hiddenName: 'idmonedabase',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            anchor: '98%',
            listeners: {
                keyup: function () {
                    //comprobarVentana();
                },
                select: function (combo, record, index) {
                    //comprobarVentana();
                    if (this.cmbMoneda.getValue() == record.json.idnomnoneda) {
                        this.cmbMoneda.reset();
                    }
                }
            }
        });
        this.cmbMoneda.getStore().load();
        //this.cmbMonedaContable.getStore().load();

        this.txtVenta = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Venta',
            //disabled: true,
            name: 'venta',
            allowBlank: false,
            anchor: '98%'
        });
        this.txtDevolucion = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Devolución',
            //disabled: true,
            name: 'devolucion',
            allowBlank: false,
            anchor: '98%'
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: this.cmbMonedaContable
            }, {
                columnWidth: .5,
                layout: 'form',
                items: this.cmbMoneda
            }]
        },/*{
            layout: 'column',
            items: [ {
                columnWidth: 1,
                layout: 'form',
                items: this.cmbMonedasTotal
            }]
        },*/ {
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [
                    this.txtVenta
                ]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [                    
                    this.txtDevolucion
                ]
            }]
        }];
    }
});
