/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 17/03/15
 * Time: 13:20
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 13/03/15
 * Time: 14:34
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Ext.LOG.winBusqAvanzada.Medios');

Ext.LOG.winBusqAvanzada.Medios = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.idioma = _this.configuracion.idioma;
        _this.closeAction = 'close';
        _this.modal = true;
        _this.width = 700;
        _this.autoHeight = true;
        _this.constrain = true;


        _this.btnCancelarWinBusAvan = new Ext.Button({
            iconCls: 'cancelar',
            id: 'idbtnbtnCancelarWinReg',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function() {
                _this.close();
            }
        });

        _this.btnAceptarWinBusAvan = new Ext.Button({
            text: _this.idioma.btnAceptar,
            iconCls: 'aceptar',
            id: 'idbtnAceptarWinAvzPMedio',
            tooltip: _this.idioma.lbTtBtnAceptar,
            handler: function() {
                _this.getBusquedaAvanMedios();
                _this.close();
            }
        });


        this.tfCodigoWinBusqAvanz = new Ext.form.TextField({
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmCodigo,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true
        });

        this.tfNroChasis = new Ext.form.TextField({
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmNoSerie,
            enableKeyEvents: true,
            regexText: _this.idioma.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.getBuscarMedios();
                    }
                },
                'valid': function(field) {
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        _this.btnAceptarWinBusAvan.disable();
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                        _this.btnAceptarWinBusAvan.disable();
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    _this.btnAceptarWinBusAvan.disable();
                                }
                            }

                        }
                    }
                }
            }
        });

        this.tfDescripcionWinBusqAvanz = new Ext.form.TextField({
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmDenominacion,
            enableKeyEvents: true,
            regexText: _this.idioma.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.getBuscarMedios();
                    }
                },
                'valid': function(field) {
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        _this.btnAceptarWinBusAvan.disable();
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                        _this.btnAceptarWinBusAvan.disable();
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    _this.btnAceptarWinBusAvan.disable();
                                }
                            }

                        }
                    }
                }
            }
        });

        this.tfMatriculaWinBusqAvanz = new Ext.form.TextField({
            maxLength: '7',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 7.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmMatricula,
            enableKeyEvents: true,
            regexText: _this.idioma.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function(field) {

                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        _this.btnAceptarWinBusAvan.disable();
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        _this.btnAceptarWinBusAvan.disable();
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    _this.btnAceptarWinBusAvan.disable();
                                }
                            }

                        }
                    }
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.getBuscarMedios();
                    }
                }
            }
        });

        this.textfieldlaser1 = new Ext.form.TextField({
            anchor: '80%',
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            fieldLabel: _this.idioma.lbLaser1,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: _this.idioma.lbValorIncorrecto,
            enableKeyEvents: true,
            listeners: {
                /* 'specialkey': function (cmp, e) {
                 if (e.getKey() == Ext.EventObject.ENTER) {
                 _this.buttons[2].handler();
                 }
                 },*/
                'valid': function(field) {
                    ;
                    var valor = field.getValue();
                    if (valor.charAt(0) == ' ' || valor.charAt(valor.length - 1) == ' ') {
                        ;
                        _this.btnAceptarWinReg.disable();
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (valor.charAt(0) == '-' || valor.charAt(valor.length - 1) == '-' ||
                            valor.charAt(0) == '.' || valor.charAt(valor.length - 1) == '.' ||
                            valor.charAt(0) == '_' || valor.charAt(valor.length - 1) == '_' ||
                            valor.charAt(valor.length - 1) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        ;
                        _this.btnAceptarWinReg.disable();
                    }
                }
            }

        });

        this.textfieldlaser2 = new Ext.form.TextField({
            anchor: '80%',
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            fieldLabel: _this.idioma.lbLaser2,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: _this.idioma.lbValorIncorrecto,
            enableKeyEvents: true,
            listeners: {
                /* 'specialkey': function (cmp, e) {
                 if (e.getKey() == Ext.EventObject.ENTER) {
                 _this.buttons[2].handler();
                 }
                 },*/
                'valid': function(field) {
                    var valor = field.getValue();
                    if (valor.charAt(0) == ' ' || valor.charAt(valor.length - 1) == ' ') {
                        _this.btnAceptarWinReg.disable();
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (valor.charAt(0) == '-' || valor.charAt(valor.length - 1) == '-' ||
                            valor.charAt(0) == '.' || valor.charAt(valor.length - 1) == '.' ||
                            valor.charAt(0) == '_' || valor.charAt(valor.length - 1) == '_' ||
                            valor.charAt(valor.length - 1) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        _this.btnAceptarWinReg.disable();
                    }
                }
            }

        });

        this.textfieldFolio = new Ext.form.TextField({
            anchor: '80%',
            fieldLabel: _this.idioma.lbFolio,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            name: 'folio',
            enableKeyEvents: true
        });

        this.textfieldTonelaje = new Ext.form.NumberField({
            anchor: '80%',
            fieldLabel: _this.idioma.lbTonelaje,
            enableKeyEvents: true,
            decimalPrecision: 2,
            decimalSeparator: "."
        });

        this.storecmbmarca = new Ext.data.Store({
            url: 'getMarcas',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboMarca.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNomarca);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idmarca'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        this.storecmbmodelo = new Ext.data.Store({
            url: 'getModelos',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idmodelo'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'beforeLoad': function(st) {
                    _this.comboModelo.reset();
                    _this.comboModelo.disable();
                },
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboModelo.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNomodelo);

                    }
                }
            }

        });

        this.comboMarca = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmMarca,
            hiddenName: 'idmarca',
            valueField: 'idmarca',
            displayField: 'denominacion',
            store: _this.storecmbmarca,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            // listWidth: 300,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    _this.storecmbmodelo.baseParams.idmarca = combo.getValue();
                    _this.storecmbmodelo.load();
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.comboModelo = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmModelo,
            hiddenName: 'idmodelo',
            valueField: 'idmodelo',
            displayField: 'denominacion',
            store: _this.storecmbmodelo,
            mode: 'remote',
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

        this.storeCombustible = new Ext.data.Store({
            url: 'getCombustible',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboCombustible.enable();
                    } else if (records.length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar');
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idtipocombustible'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        this.comboCombustible = new Ext.form.ComboBox({
            /* anchor: '80%',
             fieldLabel: _this.idioma.lbCmCombustible,
             name: 'idtipocombustible',
             valueField: 'idtipocombustible',
             displayField: 'denominacion',
             tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
             store: _this.storeCombustible,
             triggerAction: 'all',
             listWidth: 300,
             pageSize: 20,
             emptyText: _this.idioma.lbCbVacio,
             minChars: 0,
             resizable: true,
             typeAhead: true,
             forceSelection: true,
             readOnly: true,
             mode: 'remote',*/

            anchor: '80%',
            fieldLabel: _this.idioma.lbCmCombustible,
            hiddenName: 'idtipocombustible',
            valueField: 'idtipocombustible',
            displayField: 'denominacion',
            store: _this.storeCombustible,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    _this.storeCombustible.baseParams.idtipocombustible = combo.getValue();
                    _this.storeCombustible.load();
                }
            }
        });

        this.storeColorPrim = new Ext.data.Store({
            url: 'getColorPrimario',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboColorPrim.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNoColorPrim);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idcolor'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        this.comboColorPrim = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmColorPrim,
            hiddenName: 'idcolor',
            valueField: 'idcolor',
            displayField: 'denominacion',
            store: _this.storeColorPrim,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    _this.storeColorPrim.baseParams.idcolor = combo.getValue();
                    _this.storeColorPrim.load();
                }
            }
        });

        this.storeColorSec = new Ext.data.Store({
            url: 'getColorPrimario',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboColorSeg.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNoColorSec);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idcolor'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        this.comboColorSeg = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmColorSec,
            hiddenName: 'idcolor',
            valueField: 'idcolor',
            displayField: 'denominacion',
            store: _this.storeColorSec,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    // _this.comboColorSegundario.baseParams.idcolor = combo.getValue();
                    // _this.comboColorSeg.load();
                }
            }
        });

        this.tfNroMotor1 = new Ext.form.TextField({
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmNroMotor1,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true
        });

        this.tfNroMotor2 = new Ext.form.TextField({
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmNroMotor2,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true
        });

        this.storeTipoTramite = _this.crearTipoTramite();

        this.comboTipoTramite = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCTipoTramite,
            hiddenName: 'idtipotramite',
            valueField: 'idtipotramite',
            disabled: false,
            displayField: 'denominacion',
            store: _this.storeTipoTramite,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            // listWidth: 300,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.storeColorChapa = _this.createStoreColorChapa();

        this.comboColorChapa = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCColorChapa,
            hiddenName: 'idcolor',
            valueField: 'idcolor',
            disabled: false,
            displayField: 'denominacion',
            store: _this.storeColorChapa,
            mode: 'remote',
            //listWidth: 300,
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

        this.storeSector = _this.createStoreSector();

        this.comboSector = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCSector,
            hiddenName: 'idsector',
            valueField: 'idsector',
            disabled: false,
            displayField: 'denominacion',
            store: _this.storeSector,
            mode: 'remote',
            //  listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            pageSize: 20,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.storeTipoChapa = _this.createStoreTipoChapa();

        this.comboTipoChapa = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCTipoChapa,
            hiddenName: 'idtipochapa',
            valueField: 'idtipochapa',
            disabled: false,
            displayField: 'denominacion',
            store: _this.storeTipoChapa,
            mode: 'remote',
            // listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            pageSize: 20,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.storeEstatusTecnico = new Ext.data.Store({
            url: 'getEstatusTecnico',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboCombustible.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNoestatus);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        this.comboEstatusTecnico = new Ext.form.ComboBox({
            /* anchor: '80%',
             fieldLabel: _this.idioma.lbCmEstado,
             name: 'idestatustecnico',
             valueField: 'idestatustecnico',
             displayField: 'denominacion',
             tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
             store: _this.storeEstatusTecnico,
             triggerAction: 'all',
             listWidth: 300,
             pageSize: 20,
             emptyText: _this.idioma.lbCbVacio,
             minChars: 0,
             resizable: true,
             typeAhead: true,
             forceSelection: true,
             readOnly: true,
             mode: 'remote',*/

            anchor: '80%',
            fieldLabel: _this.idioma.lbCmEstado,
            hiddenName: 'idestatustecnico',
            valueField: 'idestatustecnico',
            displayField: 'denominacion',
            store: _this.storeEstatusTecnico,
            mode: 'remote',
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            /* listeners: {
             'select': function(combo, record, index) {
             _this.storeEstatusTecnico.baseParams.idestatustecnico = combo.getValue();
             _this.storeEstatusTecnico.load();
             }
             }*/
        });

        this.storeInspector = _this.createStoreInspector();

        this.comboInspector = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCInspector,
            hiddenName: 'idinspectormatricula',
            valueField: 'idinspectormatricula',
            disabled: false,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 100.',
            maxLength: '100',
            displayField: 'nombre',
            store: _this.storeInspector,
            mode: 'local',
            //  listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            minChars: 0,
            pageSize: 20,
            typeAhead: true,
            forceSelection: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    // _this.btnAceptarWinBusAvan.enable();
                }
            }
        });
        if (!Ext.aft.winAddMedio.winAddActiva) {
            this.frmWinBusqAvanz = new Ext.FormPanel({
                frame: true,
                border: false,
                bodyBorder: false,
                layout: 'column',
                anchor: '100%',
                items: [
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfCodigoWinBusqAvanz, _this.tfNroChasis, _this.textfieldFolio, _this.textfieldTonelaje, _this.comboTipoTramite, _this.comboColorPrim, _this.comboSector]
                    },
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfDescripcionWinBusqAvanz, _this.tfNroMotor1, _this.textfieldlaser1, _this.comboMarca, _this.comboTipoChapa, _this.comboColorSeg, _this.comboEstatusTecnico]
                    },
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfMatriculaWinBusqAvanz, _this.tfNroMotor2, _this.textfieldlaser2, _this.comboModelo, _this.comboColorChapa, _this.comboCombustible, _this.comboInspector]
                    }
                ]
            });
        } else {
            this.frmWinBusqAvanz = new Ext.FormPanel({
                frame: true,
                border: false,
                bodyBorder: false,
                layout: 'column',
                anchor: '100%',
                items: [
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfCodigoWinBusqAvanz, _this.comboMarca, _this.comboCombustible, _this.tfNroMotor1]
                    },
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfDescripcionWinBusqAvanz, _this.comboModelo, _this.comboColorPrim, _this.comboColorSeg]
                    },
                    {
                        style: 'margin-center: 16px;',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfMatriculaWinBusqAvanz, _this.tfNroChasis, _this.tfNroMotor2, _this.comboEstatusTecnico]
                    }
                ]
            });

        }

        this.buttons = [_this.btnCancelarWinBusAvan, _this.btnAceptarWinBusAvan];

        this.items = [_this.frmWinBusqAvanz];

        Ext.LOG.winBusqAvanzada.Medios.superclass.constructor.apply(this, arguments);
    },
    createStoreInspector: function() {
        var _this = this;
        this.stInspector = new Ext.data.Store({
            url: 'getComboInspector',
            autoLoad: true,
            baseParams: {
                idinspectormatricula: -1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idinspectormatricula'
                },
                {
                    name: 'nombre'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {

                }
            }
        });
        return this.stInspector;
    },
    getBusquedaAvanMedios: function() {

        var _this = this;

        Ext.getBody().mask('Cargando...', 'x-mask-loading');
        Ext.aft.gridCentralRegMatricula.buscar = true;

        if (Ext.aft.winAddMedio.winAddActiva) {
            _this.gridAddMedios.getStore().load({
                params: {
                    codigo: _this.tfCodigoWinBusqAvanz.getValue(),
                    descripcion: _this.tfDescripcionWinBusqAvanz.getValue(),
                    matricula: _this.tfMatriculaWinBusqAvanz.getValue(),
                    marca: _this.comboMarca.getValue(),
                    modelo: _this.comboModelo.getValue(),
                    nrochasi: _this.tfNroChasis.getValue(),
                    combustible: _this.comboCombustible.getValue(),
                    colorprim: _this.comboColorPrim.getValue(),
                    colorsec: _this.comboColorSeg.getValue(),
                    motor1: _this.tfNroMotor1.getValue(),
                    motor2: _this.tfNroMotor2.getValue(),
                    estado: _this.comboEstatusTecnico.getValue()

                            //tipotramite:_this.comboTipoTramite.getValue(),
                            //colorchapa:_this.comboColorChapa.getValue(),
                            //sector:_this.comboSector.getValue(),
                            //tipochapa:_this.comboTipoChapa.getValue()


                }
            });
        } else {
            _this.configuracion.gridCEntral.getStore().load({
                params: {
                    codigo: _this.tfCodigoWinBusqAvanz.getValue(),
                    descripcion: _this.tfDescripcionWinBusqAvanz.getValue(),
                    matricula: _this.tfMatriculaWinBusqAvanz.getValue(),
                    marca: _this.comboMarca.getValue(),
                    modelo: _this.comboModelo.getValue(),
                    nrochasi: _this.tfNroChasis.getValue(),
                    combustible: _this.comboCombustible.getValue(),
                    colorprim: _this.comboColorPrim.getValue(),
                    colorsec: _this.comboColorSeg.getValue(),
                    motor1: _this.tfNroMotor1.getValue(),
                    motor2: _this.tfNroMotor2.getValue(),
                    tipotramite: _this.comboTipoTramite.getValue(),
                    colorchapa: _this.comboColorChapa.getValue(),
                    sector: _this.comboSector.getValue(),
                    tipochapa: _this.comboTipoChapa.getValue(),
                    estado: _this.comboEstatusTecnico.getValue(),
                    laser1: _this.textfieldlaser1.getValue(),
                    laser2: _this.textfieldlaser2.getValue(),
                    tonelage: _this.textfieldTonelaje.getValue(),
                    folio: _this.textfieldFolio.getValue(),
                    idinspectormatricula: _this.comboInspector.getValue()


                }
            });
        }
    },
    crearTipoTramite: function(value) {
        var _this = this;
        this.storeTipoTramite = new Ext.data.Store({
            url: 'getComboTipoTramite',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idtipotramite'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'beforeload': function(st) {
                },
                'load': function(st, records, options) {


                    if (records.length > 0) {
                        _this.comboTipoTramite.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNotopotramitec);
                    }
                }
            }
        });
        return this.storeTipoTramite;
    },
    createStoreColorChapa: function() {
        var _this = this;
        this.stColorChapa = new Ext.data.Store({
            url: 'getComboColorChapa',
            autoLoad: false,
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idcolor'
                },
                {
                    name: 'denominacion'
                }

            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboColorChapa.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNoColorchapa);
                    }
                }
            }
        });
        return this.stColorChapa;
    },
    createStoreSector: function() {
        var _this = this;
        this.stSector = new Ext.data.Store({
            url: 'getComboSector',
            autoLoad: false,
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idsector'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboSector.enable();
                        //_this.NroDoc.focus();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNosector);
                    }
                }
            }
        });
        return this.stSector;
    },
    createStoreTipoChapa: function() {
        var _this = this;
        this.stTipoChapa = new Ext.data.Store({
            url: 'getComboTipoChapa',
            autoLoad: false,
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idtipochapa'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {

                    if (records.length > 0) {
                        _this.comboTipoChapa.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNotopochapa);
                    }
                }
            }
        });
        return this.stTipoChapa;
    }

});