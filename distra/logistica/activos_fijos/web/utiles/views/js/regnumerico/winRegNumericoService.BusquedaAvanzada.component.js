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

Ext.ns('Ext.LOG.winRegNumericoService.BusquedaAvanzada');

Ext.LOG.winRegNumericoService.BusquedaAvanzada = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.closeAction = 'close';
        _this.modal = true;
        _this.width = 700;
        _this.autoHeight = true;
        _this.constrain = true;

        _this.btnCancelarWinBusAvan = new Ext.Button({
            iconCls: 'cancelar',
            id: 'idbtnbtnCancelarWinReg',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelarF,
            handler: function () {
                _this.close();
            }
        });

        _this.btnAceptarWinBusAvan = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            iconCls: 'aceptar',
            id: 'idbtnAceptarWinAvzPMedio',
            tooltip: _this.idioma.lbTtBtnAceptarF,
            handler: function () {
                _this.getBusquedaAvanMedios();
                _this.close();
            }
        });

        this.tfCodigoWinBusqAvanz = new Ext.form.TextField({
            maxLength: '19',
            fieldLabel: _this.idioma.lbCmCodigo,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true
        });

        this.tfDescripcionWinBusqAvanz = new Ext.form.TextField({
            maxLength: '255',
            fieldLabel: _this.idioma.lbCmDenominacion,
            enableKeyEvents: true,
            regexText: _this.idioma.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.getBuscarMedios();
                    }
                },
                'valid': function (field) {
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

        this.storecmbmarca = new Ext.data.Store({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getmarcas',
            baseParams: {
                idestructura: ''
            },
            listeners: {
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.comboMarca.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNomarca);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
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
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getmodelos',
            baseParams: {
                idestructura: ''
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
            }, [
                {
                    name: 'idmodelo'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'beforeLoad': function (st) {
                    _this.comboModelo.reset();
                    _this.comboModelo.disable();
                },
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.comboModelo.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNomodelo);

                    }
                }
            }

        });

        this.storeColorPrim = new Ext.data.Store({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getcolorprimario',
            baseParams: {
                idestructura: ''
            },
            listeners: {
                'load': function (st, records, options) {
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
            name: 'idcolorprim',
            valueField: 'idcolorprim',
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storeColorPrim,
            triggerAction: 'all',
            listWidth: 300,
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            minChars: 0,
            resizable: true,
            typeAhead: true,
            forceSelection: true,
            editable: false,
            mode: 'remote'
        })

        _this.comboMarca = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmMarca,
            name: 'idmarca',
            valueField: 'idmarca',
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storecmbmarca,
            triggerAction: 'all',
            listWidth: 300,
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            minChars: 0,
            resizable: true,
            typeAhead: true,
            forceSelection: true,
            //readOnly:true,
            editable: false,
            mode: 'remote',
            listeners: {
                'select': function (combo, record, index) {
                    _this.storecmbmodelo.baseParams.idmarca = combo.getValue();
                    _this.storecmbmodelo.load();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.comboModelo = new Ext.form.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCmModelo,
            disabled: true,
            name: 'idmodelo',
            valueField: 'idmodelo',
            displayField: 'denominacion',
            listWidth: 300,
            pageSize: 20,
            minChars: 0,
            resizable: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storecmbmodelo,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbCbVacio,
            // readOnly:true,
            editable: false,
            mode: 'remote',
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.storeColorSec = new Ext.data.Store({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getcolorprimario',
            baseParams: {
                idestructura: ''
            },
            listeners: {
                'load': function (st, records, options) {
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
            name: 'idcolor',
            valueField: 'idcolor',
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storeColorSec,
            triggerAction: 'all',
            listWidth: 300,
            pageSize: 20,
            emptyText: _this.idioma.lbCbVacio,
            minChars: 0,
            resizable: true,
            typeAhead: true,
            forceSelection: true,
            editable: false,
            // readOnly:true,
            mode: 'remote',
            listeners: {
                'select': function (combo, record, index) {
                    // _this.comboColorSegundario.baseParams.idcolor = combo.getValue();
                    // _this.comboColorSeg.load();
                }
            }
        });

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
                    items: [_this.tfCodigoWinBusqAvanz, _this.comboMarca/*,_this.comboCombustible,_this.tfNroMotor1*/]
                },
                {
                    style: 'margin-center: 16px;',
                    columnWidth: .3,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.tfDescripcionWinBusqAvanz, _this.comboModelo]
                },
                {
                    style: 'margin-center: 16px;',
                    columnWidth: .3,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.comboColorSeg, _this.comboColorPrim/*_this.tfMatriculaWinBusqAvanz, _this.tfNroChasis,_this.tfNroMotor2*/]
                }
            ]
        });

        this.buttons = [_this.btnCancelarWinBusAvan, _this.btnAceptarWinBusAvan];

        this.items = [ _this.frmWinBusqAvanz];

        Ext.LOG.winRegNumericoService.BusquedaAvanzada.superclass.constructor.apply(this, arguments);
    },
    getBusquedaAvanMedios: function () {

        var _this = this;

        Ext.getBody().mask('Cargando...', 'x-mask-loading');
        Ext.LOG.GridRegNumericoService.buscar = true;
        _this.store.load({
            params: {
                codigo: _this.tfCodigoWinBusqAvanz.getValue(),
                descripcion: _this.tfDescripcionWinBusqAvanz.getValue(),
                marca: _this.comboMarca.getValue(),
                modelo: _this.comboModelo.getValue(),
                colorprim: _this.comboColorPrim.getValue(),
                colorsec: _this.comboColorSeg.getValue()
            }
        });
    },

});