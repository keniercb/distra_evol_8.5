/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 13/03/15
 * Time: 14:34
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Ext.LOG.winRegistrar');
var valor = new Array();
var idsbasedatos = new Array();
Ext.LOG.winRegistrar.Medios = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.idioma = _this.configuracion.idioma;
        _this.closeAction = 'close';
        _this.modal = true;
        _this.width = 550;
        _this.autoHeight = true;
        _this.id = 'idwinRegistrar';
        _this.constrain = true;


        if (_this.registrar) {
            _this.getComboDepositos();
        }

        this.btnCancelarWinReg = new Ext.Button({
            iconCls: 'cancelar',
            id: 'idbtnbtnCancelarWinReg',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function() {
                _this.close();
            }
        });

        this.btnAceptarWinReg = new Ext.Button({
            text: _this.idioma.btnAceptar,
            iconCls: 'aceptar',
            id: 'idbtnAceptarWinAvzPMedio',
            disabled: true,
            // key:ent,
            tooltip: _this.idioma.lbTtBtnAceptar, //+ Utils.getTooltip(ent),
            handler: function() {

                if (!_this.registrar && _this.textfieldlaser1.isDirty() && _this.textfieldlaser2.isDirty() && _this.textfieldFolio.isDirty()
                        && _this.textfieldTonelaje.isDirty() && _this.comboTipoTramite.isDirty() && _this.acreditador.isDirty()
                        && _this.jefe.isDirty() && _this.funcionario.isDirty()
                        && _this.textfielmatricula.isDirty() && _this.comboTipoChapa.isDirty() && _this.comboSector.isDirty()) {

                } else {                   
                    Ext.getBody().mask('Cargando...', 'x-mask-loading');
                    _this.getCompletarDatosMedios();
                }
            }
        });

        this.storeTipoTramite = _this.crearTipoTramite();
        this.comboTipoTramite = new LOG.util.LovCombo({
            fieldLabel: _this.idioma.lbCTipoTramite,
            valueField: 'idtipotramite',
            hiddenName: 'idtipotramite',
            displayField: 'denominacion',
            typeAhead: true,
            allowBlank: true,
            mode: 'remote',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            editable: false,
            anchor: '90%',
            store: _this.storeTipoTramite,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.comboTipoTramite2 = new Ext.form.ComboBox({
            anchor: '90%',
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
            anchor: '90%',
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
            anchor: '90%',
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

        this.storeInspector = _this.createStoreInspector();
        this.comboInspector = new Ext.form.ComboBox({
            anchor: '90%',
            fieldLabel: _this.idioma.lbCInspector,
            //hiddenName: 'idinspectormatricula',
            valueField: 'idinspectormatricula',
            disabled: false,
            displayField: 'nombre',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 100.',
            maxLength: '100',
            store: _this.storeInspector,
            mode: 'local',
            //  listWidth: 300,
            //autoCreate: true,
            triggerAction: 'all',
            minChars: 0,
            pageSize: 20,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
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
            anchor: '90%',
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

        this.storeMoneda = _this.createStoreMoneda();
        this.comboMoneda = new Ext.form.ComboBox({
            anchor: '90%',
            fieldLabel: _this.idioma.lbCMoneda,
            hiddenName: 'idmoneda',
            valueField: 'idmoneda',
            disabled: false,
            displayField: 'nombremoneda',
            store: _this.storeMoneda,
            mode: 'remote',
            // listWidth: 300,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            minChars: 0,
            pageSize: 20,
            tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{nombremoneda}</div></tpl>',
            emptyText: _this.idioma.lbCbVacio,
            /*listeners: {
             'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             _this.buttons[2].handler();
             }
             }
             }*/
        });

        this.textfieldDireccion = new Ext.form.TextArea({
            anchor: '88%',
            height: 50,
            disabled: true,
            editable: false,
            hideLabel: true,
            //name:_this.idioma.lbDireccion,
            //fieldLabel: _this.idioma.lbDireccion,
            regexText: _this.idioma.lbValorIncorrecto

        });

        this.idpersona = new Ext.form.Hidden({
            anchor: '90%'
        });

        this.cmpEditable = new Ext.form.TextField({
            anchor: '90%',
            fieldLabel: _this.idioma.lbPosedor,
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            // enableKeyEvents: true,
            allowBlank: true,
            readOnly: true,
            editable: false,
            listeners: {
                'focus': function(field) {
                    //Ext.getBody().mask("Cargando...", 'x-mask-loading');

                    var panelBusPer;
                    if (!winBusPer) {
                        var btnAceptar = new LOG.util.Prototipos.botonAceptar({                            
                            listeners: {
                                'click': function() {
                                     if (panelBusPer.getSeleccion()) {
                                        _this.cmpEditable.setValue(panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel'));
                                        _this.idpersona.setValue(panelBusPer.getSeleccion().get('idpersona'));
                                        _this.getBuscarDireccion(panelBusPer.getSeleccion().get('idpersona'));
                                        _this.btnAceptarWinReg.enable();
                                    }
                                    winBusPer.close();
                                }

                            }
                        });
                        var btnCancelar = new LOG.util.Prototipos.botonCancelar({
                            text: 'Cancelar',
                            iconCls: 'cancelar',
                            listeners: {
                                'click': function() {
                                    winBusPer.close();
                                }

                            }
                        });

                        var winBusPer = new Ext.Window({
                            modal: true,
                            layout: 'fit',
                            id: 'winBusPer',
                            title: 'Buscar persona',
                            width: 700,
                            height: 490,
                            closeAction: 'destroy',
                            constrain: true,
                            closable: true,
                            plain: false,
                            items: [
                                panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                    seguridad: 0,
                                    singleSelect: true,
                                    modulo: 'PERSONA',
                                    region: 'center',
                                    identidad: perfil.idestructuracomun,
                                    listeners: {
                                        'personaselecionada': function() {
                                            btnAceptar.enable();
                                        },
                                        'personadeselecionada': function() {
                                            btnAceptar.disable();
                                        }
                                    },
                                    limit: 15,
                                    start: 0
                                })
                            ],
                            resizable: true,
                            buttons: [btnCancelar, btnAceptar],
                        });
                        winBusPer.show();
                        winBusPer.center();
                        panelBusPer.runSearch = function(condiciones) {
                            if (condiciones.length > 0) {
                                condiciones[condiciones.length - 1].logico = '';
                                panelBusPer.hasSearch = true;
                                panelBusPer.searchField.setVisibleBtnClear(panelBusPer.hasSearch);
                            } else {
                                panelBusPer.hasSearch = false;
                                panelBusPer.searchField.setVisibleBtnClear(this.hasSearch);
                            }
                            panelBusPer.stPersonas.baseParams.condiciones = Ext.encode(condiciones);
                            panelBusPer.stPersonas.load();
                        }
                        panelBusPer.cleanSearch = function() {

                            panelBusPer.fpAdvancedSearch.getForm().reset();
                            panelBusPer.stPersonas.baseParams.condiciones = '';
                            if (panelBusPer.fpAdvancedSearch.isVisible())
                                panelBusPer.tfNumero.focus(true, 100);
                            panelBusPer.btnCleanSearch.disable();
                            panelBusPer.btnSearch.disable();
                            panelBusPer.searchField.setValue(" ");
                        }

                    }
                    else {
                        _this.winBusPer.show();
                    }
                }
            }
        });

        this.textfieldlaser1 = new Ext.form.TextField({
            anchor: '90%',
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            fieldLabel: _this.idioma.lbLaser1,
            maskRe: /^([0-9]*)+$/,
            regex: /^([0-9]*)+$/,
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
            anchor: '90%',
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            fieldLabel: _this.idioma.lbLaser2,
            maskRe: /^([0-9]*)+$/,
            regex: /^([0-9]*)+$/,
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
            anchor: '90%',
            fieldLabel: _this.idioma.lbFolio,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            name: 'folio',
            enableKeyEvents: true
        });

        this.textfieldTonelaje = new Ext.form.NumberField({
            anchor: '90%',
            fieldLabel: _this.idioma.lbTonelaje,
            enableKeyEvents: true,
            decimalPrecision: 2,
            decimalSeparator: "."
        });

        this.acreditador = new Ext.form.TextField({
            anchor: '90%',
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            fieldLabel: _this.idioma.lbacreditador,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
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

        this.funcionario = new Ext.form.TextField({
            anchor: '90%',
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            fieldLabel: _this.idioma.lbFuncionario,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
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

        this.jefe = new Ext.form.TextField({
            anchor: '90%',
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            fieldLabel: 'Jefe',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
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

        _this.label = new Ext.form.Label({
            anchor: '95%',
            text: _this.idioma.lbDireccion + ": "
        });

        this.textfielmatricula = new Ext.form.TextField({
            anchor: '90%',
            maxLength: '7',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 7.',
            minLength: '7',
            minLengthText: 'El tamaño minimo requerido es 7.',
            fieldLabel: 'Matr&iacute;cula',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
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

        _this.frmWinRegistrar = new Ext.FormPanel({
            frame: true,
            border: false,
            bodyBorder: false,
            // layout: 'column',
            anchor: '100%',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .3,
                            style: 'margin-center: 16px;',
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.textfieldFolio, _this.textfieldlaser1, _this.comboTipoTramite, _this.comboColorChapa, _this.acreditador, _this.label]
                        }, {
                            columnWidth: .3,
                            style: 'margin-center: 16px;',
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.textfieldlaser2, _this.textfieldTonelaje, _this.comboMoneda, _this.comboInspector, _this.funcionario]
                        }, {
                            columnWidth: .3,
                            style: 'margin-center: 16px;',
                            layout: 'form',
                            labelAlign: 'top',
                            items: [(Ext.LOG.gestregmatricula.vistaactiva != "VEHICULO") ? _this.cmpEditable : _this.getComboDepositos(_this.configuracion.sm.selections.items[0].data.regestructura), _this.comboTipoChapa, _this.comboSector, _this.textfielmatricula, _this.jefe]
                        }]
                }, _this.textfieldDireccion]
        });

        if (Ext.LOG.gestregmatricula.vistaactiva == "VEHICULOOPR") {
            _this.jefe.hide();
            _this.funcionario.hide();
            _this.acreditador.hide();
        }
        if (!_this.registrar) {
            _this.textfieldlaser1.setValue(_this.configuracion.sm.selections.items[0].data.numerolaser1);
            _this.textfieldlaser2.setValue(_this.configuracion.sm.selections.items[0].data.numerolaser2);
            _this.textfieldFolio.setValue(_this.configuracion.sm.selections.items[0].data.foliocirculacion);
            _this.textfieldTonelaje.setValue(_this.configuracion.sm.selections.items[0].data.tonelage);
            _this.acreditador.setValue(_this.configuracion.sm.selections.items[0].data.acreditador);
            _this.funcionario.setValue(_this.configuracion.sm.selections.items[0].data.funcionario);

            _this.jefe.setValue(_this.configuracion.sm.selections.items[0].data.jefe);
            _this.textfielmatricula.setValue(_this.configuracion.sm.selections.items[0].data.nromatricula);
            _this.getcargarColorPorId();
            // _this.comboColorChapa.setValue(_this.configuracion.sm.selections.items[0].data.denomcolorchapa);
            _this.comboTipoChapa.setValue(_this.configuracion.sm.selections.items[0].data.denomtipochapa);
            _this.comboSector.setValue(_this.configuracion.sm.selections.items[0].data.denomsector);
            // _this.comboInspector.setValue(_this.configuracion.sm.selections.items[0].data.idinspectormatricula);



            _this.getcargarMonedaPorId();
            if (Ext.LOG.gestregmatricula.vistaactiva != "VEHICULO") {
                _this.cmpEditable.setValue(_this.configuracion.sm.selections.items[0].data.denompersona);
                _this.idpersona.setValue(_this.configuracion.sm.selections.items[0].data.idpersona);
                _this.getBuscarDireccion(_this.configuracion.sm.selections.items[0].data.idpersona);
            }

        }
        _this.buttons = [_this.btnCancelarWinReg, _this.btnAceptarWinReg];

        _this.items = [_this.frmWinRegistrar];

        Ext.LOG.winRegistrar.Medios.superclass.constructor.apply(this, arguments);
    },
    crearTipoTramite: function(value) {
        var _this = this;
        this.storeTipoTramite = new Ext.data.Store({
            url: 'getComboTipoTramite',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            autoLoad: true,
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
                        if(!_this.registrar){
                            _this.comboTipoTramite.setValue(_this.configuracion.sm.selections.items[0].data.idtipotramite);
                        }
                        _this.comboTipoTramite.enable();
                    } else {
                        mostrarMensaje(1, _this.idioma.lbNotopotramitec);
                    }
                }
            }
        });
        return this.storeTipoTramite;
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
    createStoreInspector: function() {
        var _this = this;
        this.stInspector = new Ext.data.Store({
            url: 'getComboInspector',
            autoLoad: true,
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
                    if (_this.configuracion.sm.selections.items[0].data.idinspectormatricula) {
                        _this.comboInspector.setValue(_this.configuracion.sm.selections.items[0].data.idinspectormatricula);
                    }

                }
            }
        });
        return this.stInspector;
    },
    createStoreColorChapa: function() {
        var _this = this;
        this.stColorChapa = new Ext.data.Store({
            url: 'getComboColorChapa',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            autoLoad: false,
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
    createStoreTipoChapa: function() {
        var _this = this;
        this.stTipoChapa = new Ext.data.Store({
            url: 'getComboTipoChapa',
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            autoLoad: false,
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
    },
    createStoreMoneda: function() {
        var _this = this;
        this.stMoneda = new Ext.data.Store({
            url: 'getComboMoneda',
            autoLoad: false,
            baseParams: {
                idestructura: Ext.getCmp('itemx').getValue()
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idmoneda'
                },
                {
                    name: 'nombremoneda'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    if (records.length > 0) {
                        _this.comboMoneda.enable();
                    }
                }
            }
        });
        return this.stMoneda;
    },
    getComboDepositos: function(identidad) {
        if (this.comboDeposito == undefined) {
            var _this = this;
            this.stDepositos = new Ext.data.SimpleStore({
                fields: ['id', 'descripcion'],
                data: [],
                autoLoad: false
            });

            this.comboDeposito = new Ext.form.ComboBox({
                anchor: '90%',
                disabled: true,
                fieldLabel: _this.idioma.lbPosedor,
                editable: false,
                id: 'itemxregistrar',
                mode: 'local',
                allowBlank: false,
                emptyText: 'Seleccione...',
                displayField: 'descripcion',
                valueField: 'id',
                hiddenName: 'id',
                readOnly: true,
                store: this.stDepositos,
                listeners: {
                    'render': function(p) {

                        var theTip = null;

                        p.getEl().on('mouseover', function() {
                            theTip = new Ext.Tip({
                                margin: '0 0 0 200',
                                shadow: false
                            });
                            var pos = _this.comboDeposito.getPosition();
                            var x = pos[0];
                            var y = pos[1] + 20;
                            var text = (_this.identidad == _this.comboDeposito.getValue()) ? _this.idioma.lbEntidad : ''/*_this.idioma.lbCbDeposito*/;
                            theTip.html = '<b>' + text + ':</b>' + ' ' + _this.comboDeposito.getRawValue();
                            theTip.showAt([x, y]);
                        });

                        p.getEl().on('mouseleave', function() {
                            if (theTip)
                                theTip.hide();
                        });
                    },
                    'focus': function(combo) {
                        // _this.getWinAreasResponsabilidad();

                    }
                }
            });
            //Al crearse la primera vez se tienes que poner el nombre de la entidad
            this.cargarEntidadComboArea(identidad);

        }

        return this.comboDeposito;
    },
    getWinAreasResponsabilidad: function() {
        var _this = this;

        Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
        if (!_this.cmpAreaRespWin) {

            _this.cmpAreaRespWin = new Log.AF.Utiles.WinContainer({
                modal: true,
                doAction: function(nodo) {
                    function funcion() {
                        _this.comboDeposito.setValue(nodo.attributes.id);
                        _this.comboDeposito.setRawValue(nodo.attributes.text);
                        _this.cmpAreaRespWin.hide();

                        _this.cargarEntidadComboAreaRegistro(nodo.attributes.id);
                        /* _this.gridCEntral.getStore().baseParams = {};
                         if (!_this.stopGrid) {
                         _this.gridCEntral.getStore().load({
                         params: {
                         anode: null,
                         _id: null,
                         idarea: _this.comboDeposito.getValue(),
                         start: 0,
                         limit: 20
                         
                         // Ext.LOG.moduloMedio.start
                         //Ext.LOG.moduloMedio.limit
                         }
                         });
                         }*/

                    }


                    if (nodo.getDepth() == 0) {
                        //Es padre
                        _this.tipo_area_seleccionada = 'entidad';
                        // _this.btnAdicionar.disable();
                        // _this.btnGestnomenclatura.disable();

                        funcion();
                    } else if (nodo.attributes.interna) {
                        //Es un area resp
                        _this.tipo_area_seleccionada = 'arearesp';
                        //_this.btnAdicionar.enable();
                        // _this.btnGestnomenclatura.enable();
                        funcion();
                    } else {
                        _this.tipo_area_seleccionada = 'otra';
                        //mostrarMensaje(1, _this.idioma.lbNoEsAreaResp);
                        funcion();
                    }
                },
                entidad: _this.comboDeposito.getRawValue(),
                identidad: _this.comboDeposito.getValue(),
                listeners: {
                    'beforeshow': function() {
                        Ext.getBody().unmask();
                    }
                }
            });
        } else {
            _this.cmpAreaRespWin.show();
        }

    },
    cargarEntidadComboArea: function(idestructura) {
        var _this = this;

        Ext.Ajax.request({
            url: 'getEntidad',
            method: 'POST',
            params: {
                idestructura: idestructura
            },
            callback: function(options, success, response) {

                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.identidad;
                _this.entidad = rd.entidad;
                _this.direccion = rd.direccion;
                _this.comboDeposito.setValue(rd.identidad);
                _this.comboDeposito.setRawValue(rd.entidad);
                _this.comboDeposito.enable();
                _this.textfieldDireccion.setValue(_this.direccion);
            }
        });
    },
    cargarEntidadComboAreaRegistro: function(idestructura) {
        var _this = this;

        Ext.Ajax.request({
            url: 'getEntidadRegistro',
            method: 'POST',
            params: {
                idestructura: idestructura
            },
            callback: function(options, success, response) {

                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.identidad;
                _this.entidad = rd.entidad;
                _this.direccion = rd.direccion;

                _this.comboDeposito.setValue(rd.identidad);
                _this.comboDeposito.setRawValue(rd.entidad);
                _this.comboDeposito.enable();
                _this.textfieldDireccion.setValue(_this.direccion);


            }
        });
    },
    getCompletarDatosMedios: function() {
        var _this = this;
        var idregnum = _this.configuracion.sm.selections.items[0].data.idregnumerico;

        if (Ext.LOG.gestregmatricula.vistaactiva != "VEHICULO") {
            var idpersona = _this.idpersona.getValue();
        } else {
            var idestructura = Ext.getCmp('itemx').getValue();
        }
        if (_this.frmWinRegistrar.getForm().isDirty()) {

            var parametros = {
                idtipotramite: (_this.comboTipoTramite.isDirty()) ? _this.comboTipoTramite.getValue() : null,
                idcolor: (_this.comboColorChapa.isDirty()) ? _this.comboColorChapa.getValue() : null,
                idsector: (_this.comboSector.isDirty()) ? _this.comboSector.getValue() : null,
                idtipochapa: (_this.comboTipoChapa.isDirty()) ? _this.comboTipoChapa.getValue() : null,
                laser1: (_this.textfieldlaser1.isDirty()) ? _this.textfieldlaser1.getValue() : null,
                laser2: (_this.textfieldlaser2.isDirty()) ? _this.textfieldlaser2.getValue() : null,
                folio: (_this.textfieldFolio.isDirty()) ? _this.textfieldFolio.getValue() : null,
                nromatricula: (_this.textfielmatricula.isDirty()) ? _this.textfielmatricula.getValue() : null,
                acreditador: (_this.acreditador.isDirty()) ? _this.acreditador.getValue() : null,
                funcionario: (_this.funcionario.isDirty()) ? _this.funcionario.getValue() : null,
                jefe: (_this.jefe.isDirty()) ? _this.jefe.getValue() : null,
                tonelage: (_this.textfieldTonelaje.isDirty()) ? _this.textfieldTonelaje.getValue() : null,
                moneda: (_this.comboMoneda.isDirty()) ? _this.comboMoneda.getValue() : null,
                idregnum: idregnum,
                idpersona: (idpersona) ? idpersona : null,
                idestructura: (idestructura) ? idestructura : null
            }

            if (_this.comboInspector.getValue() != _this.comboInspector.getRawValue()/*_this.comboInspector.getValue() && !typeof(_this.comboInspector.getValue()) ==  'String'*/) {
                parametros.idinspectormatricula = _this.comboInspector.getValue();
            } else {
                parametros.nombreinspector = _this.comboInspector.getRawValue().trim();
            }
            Ext.Ajax.request({
                url: 'getCompletarDatosMedios',
                method: 'POST',
                params: {
                    parametros: Ext.encode(parametros)
                },
                callback: function(options, success, response) {

                    var rd = Ext.decode(response.responseText);
                    if (rd.msg == 1) {
                        mostrarMensaje(1, _this.idioma.MsgRegistroOk);
                        _this.gridCEntral.getStore().load();
                        _this.close();
                    } else {
                        mostrarMensaje(3, _this.idioma.MsgRegistroNoOk);
                        Ext.getBody().unmask();
                        _this.close();
                    }
                }

            });
        } else {
            Ext.getBody().unmask();
        }
    },
    getBuscarDireccion: function(idpersona) {
        var _this = this;

        Ext.Ajax.request({
            url: 'getBuscarDireccion',
            method: 'POST',
            params: {
                idpersona: idpersona
            },
            callback: function(options, success, response) {

                var rd = Ext.decode(response.responseText);
                if (rd.direccion) {
                    _this.textfieldDireccion.setValue(rd.direccion);
                }
            }
        });
    },
    getcargarMonedaPorId: function() {

        var _this = this;
        if (_this.configuracion.sm.selections.items[0].data.idmoneda != null) {
            Ext.Ajax.request({
                url: 'getcargarMonedaPorId',
                method: 'POST',
                params: {
                    idestructura: Ext.getCmp('itemx').getValue(),
                    idmoneda: _this.configuracion.sm.selections.items[0].data.idmoneda

                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    _this.comboMoneda.setValue(rd.datos[0].idmoneda);
                    _this.comboMoneda.setRawValue(rd.datos[0].nombremoneda);

                }
            });
        }

    },
    getcargarColorPorId: function() {

        var _this = this;
        if (_this.configuracion.sm.selections.items[0].data.idcolorchapa != null) {
            Ext.Ajax.request({
                url: 'getcargarColorPorId',
                method: 'POST',
                params: {
                    idestructura: Ext.getCmp('itemx').getValue(),
                    idcolorchapa: _this.configuracion.sm.selections.items[0].data.idcolorchapa

                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    _this.comboColorChapa.setValue(rd.datos[0].idcolor);
                    _this.comboColorChapa.setRawValue(rd.datos[0].denominacion);

                }
            });
        }
    }


});