Ext.ns('Ext.Log.ExpTec');

Ext.Log.ExpTec.VentanaBusqAvanzadaGrid = Ext.extend(Ext.Window, {
constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);

        _this.title = _this.idioma.lbTtBuscAvanzBtn;
        _this.closeAction = 'close';
        _this.resizable = false;
        _this.modal = true;
        _this.width = 475;
        _this.autoHeight = true;
        
        _this.listeners = {
            'show': function () {
                _this.textfieldDenom.focus();
            }
        };
        _this.buttons = [
            {
                iconCls: 'cancelar',
                text: _this.idioma.btnCancelar,
                tooltip: _this.idioma.lbBtnCancelarBusqAvanz,
                handler: function () {
                    _this.close();
                }
            },
            {
                text: _this.idioma.btnLimpiar,
                iconCls: 'limpiar',
                tooltip: this.idioma.lbBrtLimpiarBusqAvanz,
                handler: function () {
                    _this.Limpiar();
                }
            },
            {
                text: _this.idioma.btnAceptar,
                id:'idbtnBuscarA',
                iconCls: 'aceptar',
                tooltip: _this.idioma.lbBtnAceptarBusqAvanz,
                handler: function () {
                    _this.store.load({
                        params:{
                            denominacion : ( _this.textfieldDenom.getValue() ) ?_this.textfieldDenom.getValue():"",
                            fechainicio : (_this.FechaD.value ) ? _this.FechaD.value :"",
                            fechafin : (_this.FechaH.value ) ? _this.FechaH.value :"",
                            idusuario : ( _this.cmbU.getValue() ) ?_this.cmbU.getValue():"",
                            tipo: ( _this.cmbTipoMedio.getValue() ) ?_this.cmbTipoMedio.getValue():"",
                            nroinventario: ( _this.textfieldNoInv.getValue() ) ?_this.textfieldNoInv.getValue():"",
                            nroserie: ( _this.textfieldNoSerie.getValue() ) ?_this.textfieldNoSerie.getValue():"",
                            start : 0,
                            limit : Ext.getCmp('idGrid').getBottomToolbar().pageSize
                        }                        
                    });
                    _this.close();
                }
            }
        ];

       _this.storeUsuarios = _this.crearStoreUsuarios();
        
        _this.cmbU = new Ext.form.ComboBox({
            valueField: 'idusuario',
            //disabled: true,
            //width: 100,
            displayField: 'usuario',
            store: _this.storeUsuarios,
            mode: 'local',
            autoCreate: true,
            triggerAction: 'all',
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            fieldLabel: _this.idioma.lbUsuario,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.stTipoMedio = _this.crearStoreTipoMedio();
        
        _this.cmbTipoMedio = new Ext.form.ComboBox({
                valueField: 'tipo',
                displayField: 'TipoMedio',
                store: _this.stTipoMedio,
                autoCreate: true,
                typeAhead: true,
                triggerAction: 'all',
                readOnly: true,
                mode: 'local',
                emptyText: _this.idioma.lbCbVacio,
                fieldLabel: _this.idioma.lbTxtTipoMedio,
                //anchor: '85%'
            });

        this.textfieldDenom = new Ext.form.TextField({
            autoCreate: true,
            //width: 100,
            maxLength: '11',
            fieldLabel: _this.idioma.lbCMDenominacion,
            /*maskRe : /^([0-9]+ ?[0-9]*)+$/,
            regex : /^([0-9]+ ?[0-9]*)+$/,*/
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        Ext.getCmp('idbtnBuscarA').handler();
                        _this.close();
                    }
                }
            }
        });

        this.textfieldNoSerie = new Ext.form.TextField({
            autoCreate: true,
            //width: 100,
            maxLength: '11',
            fieldLabel: _this.idioma.lbCMNroSeir,
            maskRe : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            regex : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        Ext.getCmp('idbtnBuscarA').handler();
                        _this.close();
                    }
                }
            }
        });

        this.textfieldNoInv = new Ext.form.TextField({
            autoCreate: true,
            maxLength: '30',
            fieldLabel: _this.idioma.lbCMNroInventario,
            maskRe : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            regex : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        Ext.getCmp('idbtnBuscarA').handler();
                        _this.close();
                    }
                }
            }
        });

        var validarFecha = function () {
            if (_this.FechaD.getValue()) {
                _this.FechaH.setMinValue(_this.FechaD.getValue());
            }
            if (_this.FechaH.getValue()) {
                _this.FechaD.setMaxValue(_this.FechaH.getValue());
            }
        }

        _this.FechaD = new Ext.form.DateField({
            width: 185,
            fieldLabel: _this.idioma.lbCmbDesde,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.FechaH = new Ext.form.DateField({
            width: 185,
            fieldLabel: _this.idioma.lbCmbHasta,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.frmBuscAvanz = new Ext.FormPanel({
            layout: 'column',
            frame: true,
            anchor: '100%',
            bodyStyle: 'margin: 10px;',
            items: [
                {     
                    columnWidth: .49,    
                    xtype: 'form',
                    labelAlign: 'top',
                    defaults: {
                           anchor: '95%'
                    },
                    items:[_this.textfieldDenom,_this.cmbU,_this.textfieldNoSerie,_this.textfieldNoInv]                     
                },
                {
                    columnWidth: .49,
                    xtype: 'form',
                    labelAlign: 'top',
                    items: [{
                        style: 'margin-top: 10px;',
                        xtype: 'fieldset',
                        title: _this.idioma.lbTitleRango,
                        layout: 'form',
                        height: 125,
                        width: 210,
                        items: [_this.FechaD, _this.FechaH]
                    },{
                        xtype: 'form',
                        labelAlign: 'top',
                        items: [_this.cmbTipoMedio]
                    }]
                }
            ]
        });
        _this.items = [_this.frmBuscAvanz];
        Ext.Log.ExpTec.VentanaBusqAvanzadaGrid.superclass.constructor.apply(this, arguments);
    },
    crearStoreUsuarios: function (params) {
        var _this = this;
        this.storeUsuarios = new Ext.data.Store({
            url: 'getUsuarios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idusuario'
                },
                {
                    name: 'usuario'
                }
            ]),
            listeners: {
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.cmbU.enable();
                    }
                }
            }
        });
        return this.storeUsuarios;
    },

    crearStoreTipoMedio: function(params){
        var _this = this;
        this.StoreTipoMedio = new Ext.data.SimpleStore({
            fields: ['tipo', 'TipoMedio'],
            data: [
                ['Fisico', 'Fisico'],
                ['Abstracto', 'Abstracto']
            ]
        });
         return this.StoreTipoMedio;
    },

    Limpiar: function () {
        var _this = this;
        _this.cmbU.reset();
        _this.cmbTipoMedio.reset();
        _this.textfieldDenom.reset();
        _this.textfieldNoInv.reset();
        _this.textfieldNoSerie.reset();
        _this.FechaD.reset();
        _this.FechaH.reset();
    }
});