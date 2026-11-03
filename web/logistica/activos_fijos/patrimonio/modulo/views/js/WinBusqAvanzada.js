Ext.ns('Ext.LOG.moduloMedio');
Ext.LOG.moduloMedio.VentanaBusqAvanzadaP = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);

        _this.title = _this.idioma.lbBuscAvanzBtn;
        _this.closeAction = 'close';
        _this.modal = true;
        _this.width = 600;
        _this.autoHeight = true;
        _this.id = 'idWinAvanzadPanelMedio';

        _this.listeners = {
            'show': function() {
                _this.textfieldCodigo.focus();
            }
        };
        var x = {
            key:'x',
            alt:true,
            ctrl:false,
            shift:false
        };
        _this.btnCancelarWinAvz = new Ext.Button({
            iconCls: 'cancelar',
            id:'idbtnCancelarWinAvzPMedio',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.btnTCancelarBusq + Utils.getTooltip(x),
            key:x,
            handler: function() {
                _this.frmBuscAvanz.getForm().reset();
                _this.store.baseParams = {};
                _this.close();
            }
        });
        var ent = {
            key:13,
            alt:false,
            ctrl:false,
            shift:false
        };
        _this.btnAceptarWinAvz = new Ext.Button({
            text: _this.idioma.btnAceptar,
            iconCls: 'aceptar',
            id:'idbtnAceptarWinAvzPMedio',
            key:ent,
            tooltip: _this.idioma.btnTAceptarBusq + Utils.getTooltip(ent),
            handler: function() {

                if(_this.textfieldDenominacion.isDirty()){
                    var aux = _this.textfieldDenominacion.valido;
                }else{
                    aux = true;
                }
                if (_this.frmBuscAvanz.getForm().isValid() && _this.frmBuscAvanz.getForm().isDirty() && aux) {
                    _this.fn({
                        codigo: _this.textfieldCodigo.getValue(),
                        denominacion: _this.textfieldDenominacion.getValue(),
                        idgruposubgrupo: _this.comboGrupo.getValue(),
                        idmarcamodelo: Ext.getCmp('idmarcamodelo').getValue(),
                        idpais: _this.comboNacionalidad.getValue(),
                        fechaexpini: _this.FechaDesde.getRawValue(),
                        fechaexpfin: _this.FechaHasta.getRawValue(),
                        fechaadq: _this.FechaAdquisicion.getRawValue(),
                        estatus: _this.comboEstatus.getValue()
                    });
                    _this.close();
                } else {
                    if(!aux){
                        mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                    }
                    else if(!_this.frmBuscAvanz.getForm().isValid()){
                        mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                    }

                }
            }
        });

        _this.buttons = [_this.btnCancelarWinAvz, _this.btnAceptarWinAvz];
        _this.storeGrupo = _this.crearStoreGrupo();

        _this.storeNacionalidad = _this.createStoreNacionalidad();

        _this.storeEstatus = _this.createStoreEstatus();

        _this.comboGrupo = new Ext.form.ComboBox({
            anchor: '100%',
            fieldLabel: _this.idioma.lbCMGrupo,
            hiddenName: 'idgruposubgrupo',
            valueField: 'idgruposubgrupo',
            disabled: true,
            displayField: 'denominacion',
            store: _this.storeGrupo,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            listWidth: 300,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.comboEstatus = new Ext.form.ComboBox({
            anchor: '100%',
            fieldLabel: _this.idioma.lbCMEstado,
            hiddenName: 'denominacion',
            valueField: 'denominacion',
            disabled: false,
            displayField: 'denominacion',
            store: _this.storeEstatus,
            mode: 'remote',
            listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.comboNacionalidad = new Ext.form.ComboBox({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCMNacionalidad,
            hiddenName: 'idpais',
            valueField: 'idpais',
            disabled: true,
            displayField: 'nombrepais',
            store: _this.storeNacionalidad,
            mode: 'remote',
            listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            pageSize: 20,
            tpl: '<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item">{nombrepais}</div></tpl>',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.textfieldDenominacion = new Ext.form.TextField({
            anchor: '100%',
            maxLength: '255',
            fieldLabel: _this.idioma.lbDenominacion,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            regexText: _this.title.lbValorIncorrecto,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                },
                'valid': function(field) {
                    field.valido = true;
                    var valor = field.getValue()
                    if (valor.charAt(0) == ' ' || valor.charAt(valor.length - 1) == ' ') {
                        field.valido = false;
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (valor.charAt(0) == '-' || valor.charAt(valor.length-1) == '-' ||
                        valor.charAt(0) == '.' || valor.charAt(valor.length-1) == '.' ||
                        valor.charAt(0) == '_' || valor.charAt(valor.length-1) == '_' ||
                        valor.charAt(valor.length-1) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        field.valido = false;
                    }
                }
            }
                 
        });

        this.textfieldCodigo = new Ext.form.TextField({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCodigo,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            maxLength: '19',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.textfieldNInventario = new Ext.form.TextField({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCMNroInventario,
            maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            maxLength: '255',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.textfieldNSerie = new Ext.form.TextField({
            anchor: '100%',
            fieldLabel: _this.idioma.lbCMNroSeir,
            maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            maxLength: '255',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        var validarFecha = function() {
            if (_this.FechaAdquisicion.getValue()) {
                _this.FechaDesde.setMinValue(_this.FechaAdquisicion.getValue());
                _this.FechaHasta.setMinValue(_this.FechaAdquisicion.getValue());
            }
            if (_this.FechaDesde.getValue()) {
                _this.FechaHasta.setMinValue(_this.FechaDesde.getValue());
                _this.FechaAdquisicion.setMaxValue(_this.FechaDesde.getValue());
            }
            if (_this.FechaHasta.getValue()) {
                _this.FechaDesde.setMaxValue(_this.FechaHasta.getValue());
                _this.FechaAdquisicion.setMaxValue(_this.FechaHasta.getValue());
            }

        }

        _this.FechaDesde = new Ext.form.DateField({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCMInicioExplotacion,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function(datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.FechaHasta = new Ext.form.DateField({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCMFinExplotacion,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function(datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.FechaAdquisicion = new Ext.form.DateField({
            anchor: '95%',
            fieldLabel: _this.idioma.lbCMAdquisicion,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function(datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.frmBuscAvanz = new Ext.form.FormPanel({
            frame: true,
            border: false,
            bodyBorder: false,
            layout: 'column',
            anchor: '100%',
            items: [
                {
                    style: 'margin-left: 16px;',
                    columnWidth: .34,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.textfieldCodigo, new Ext.aft.comboTreeMarcaModelo({
                            anchor: '95%',
                            name: 'descripcionmarcamodelo',
                            dataUrl: 'getMarcaModelo', // Método para cargar las Marcas-Modelos (obligatorio)
                            textRootNode: _this.idioma.lbCmbMarcaModelo, // Texto del nodo padre  (obligatorio)
                            idcmpValue: 'idmarcamodelo', // Identificador del componente donde se guardara el id de la Marca-Modelo seleccionada  (obligatorio)
                            fieldLabel: _this.idioma.lbCmbMarcaModelo,
                            emptyText: _this.idioma.lbCbVacio,
                            modeTree: 'remote'
                        }), {
                            xtype: 'hidden', // Este componente es (obligatorio) para poder utilizar el cmp de Marca-Modelos
                            id: 'idmarcamodelo', // Identificador del componente donde se guardara el id de la Marca seleccionada  (obligatorio)
                            name: 'idmarcamodelo'
                        }, _this.comboNacionalidad, _this.textfieldNInventario]
                },
                {
                    columnWidth: .26,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.textfieldDenominacion, _this.comboGrupo, _this.textfieldNSerie, _this.comboEstatus]
                },
                {
                    columnWidth: .3,
                    layout: 'form',
                    style: 'margin-left: 15px; margin-top: 10px;',
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '100%',
                            title: _this.idioma.lbRangoFechas,
                            layout: 'form',
                            autoHeight: true,
                            labelAlign: 'top',
                            items: [_this.FechaAdquisicion, _this.FechaDesde, _this.FechaHasta]
                        }
                    ]
                }
            ]
        });

        _this.items = [_this.frmBuscAvanz];

        Ext.LOG.moduloMedio.VentanaBusqAvanzadaP.superclass.constructor.apply(this, arguments);
    },
    crearStoreGrupo: function(value) {
        var _this = this;
        this.storeGrupos = new Ext.data.Store({
            url: 'getGrupos',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idgruposubgrupo'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboGrupo.enable();
                
                    }
                }
            }
        });
        return this.storeGrupos;
    },
    createStoreNacionalidad: function() {
        var _this = this;
        this.stNacionalidad = new Ext.data.Store({
            url: 'getNacionalidades',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idpais'
                },
                {
                    name: 'nombrepais'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboNacionalidad.enable();
                        //_this.NroDoc.focus();
                    }
                }
            }
        });
        return this.stNacionalidad;
    },
    createStoreEstatus: function() {
        var _this = this;
        this.stEstatus = new Ext.data.Store({
            url: 'getEstatusTecnico',
            autoLoad: true,
            baseParams: {
                estado: 1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboEstatus.enable();
                    }
                }
            }
        });
        return this.stEstatus;
    }
});