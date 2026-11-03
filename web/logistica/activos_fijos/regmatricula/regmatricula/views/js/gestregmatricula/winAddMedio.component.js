/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 9/03/15
 * Time: 14:30
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.aft');
Ext.aft.winAddMedio = Ext.extend(Ext.Window, {
    constructor: function(config) {
        this.closeAction = 'close';
        this.constrain = true;
        Ext.apply(this, config);
        var _this = this;

        _this.etiquetas = config.configuracion.idioma;

        this.modal = true;
        this.width = 999;
        this.height = 500;
        this.modal = true;
        this.loyaut = 'fit';
        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Adicionando medio(s) de transporte..."});
        Ext.aft.winAddMedio.winAddActiva = true;
        Ext.aft.winAddMedio.regnumadicionados = null;

        this.addAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            id: 'idbtnAceptarWinAdd',
            tooltip: _this.etiquetas.lbTtBtnAceptar,
            disabled: true,
            handler: function() {
                _this.myMask.show();
                _this.getAddRegVehiculos(true);
                Ext.aft.winAddMedio.winAddActiva = false;

            }
        });

        this.addCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: "Cancelar",
            id: 'idbtnCancelarWinAddMod',
            tooltip: _this.etiquetas.lbTtBtnCancelar,
            handler: function() {
                Ext.aft.winAddMedio.winAddActiva = false;
                _this.close();
            }
        });

        this.addAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            id: 'idbtnAplicarWinAddMod',
            disabled: true,
            tooltip: _this.etiquetas.lbTtBtnAplicar,
            handler: function() {
                _this.myMask.show();
                _this.getAddRegVehiculos(false);

            }
        });

        this.tfDescripcionADD = new Ext.form.TextField({
            maxLength: '255',
            enableKeyEvents: true,
            valido: true,
            regexText: _this.etiquetas.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarADD.handler();
                    }
                }
            }
        });

        this.tfCodigoADD = new Ext.form.TextField({
            maxLength: '19',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarADD.handler();
                    }
                }
            }
        });

        this.tfMatriculaADD = new Ext.form.TextField({
            maxLength: '255',
            enableKeyEvents: true,
            valido: true,
            regexText: _this.etiquetas.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarADD.handler();
                    }
                }
            }
        });

        this.btnBuscarADD = new Ext.Button({
            iconCls: 'buscar',
            id: 'buscarADD',
            text: _this.etiquetas.btnBuscar,
            tooltip: _this.etiquetas.btnTtBuscar,
            handler: function() {
                _this.getBuscarMedios();
            }
        });

        this.btnLimpiarADD = new Ext.Button({
            iconCls: 'limpiar',
            id: 'limpiarADD',
            text: _this.etiquetas.btnLimpiar,
            tooltip: _this.etiquetas.btnTtLimpiar,
            handler: function() {
                //_this.btnBuscar = false;
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                _this.tfCodigoADD.reset();
                _this.tfDescripcionADD.reset();
                _this.tfMatriculaADD.reset();
                _this.gridAddMedios.getStore().load();
            }
        });

        this.btnBusqavanzADD = new Ext.Button({
            xtype: 'button',
            id: 'buttonADD',
            icon: perfil.dirImg + 'buscaravanzada.png',
            iconCls: 'btn',
            text: _this.etiquetas.btnBuscarAvanzado,
            tooltip: _this.etiquetas.btnBuscarAvanzada,
            handler: function() {
                _this.winBusqAvanzadaADD = new Ext.LOG.winBusqAvanzada.Medios({
                    title: (Ext.getCmp('vehiculo').disabled) ? _this.etiquetas.textBusqAvanVehiculo : _this.etiquetas.textBusqAvanVehiculoOper,
                    configuracion: _this.configuracion,
                    gridAddMedios: _this.gridAddMedios,
                    registrar: false
                });

                /* var validador = new FormValidator({
                 buttons: [_this.winBusqAvanzadaADD.btnAceptarWinBusAvan],
                 buttonsRegister:[_this.winBusqAvanzadaADD.btnCancelarWinBusAvan],
                 fields:[_this.winBusqAvanzadaADD.tfDescripcionWinBusqAvanz,
                 _this.winBusqAvanzadaADD.tfMatriculaWinBusqAvanz,
                 _this.winBusqAvanzadaADD.tfCodigoWinBusqAvanz,
                 _this.winBusqAvanzadaADD.comboModelo,
                 _this.winBusqAvanzadaADD.comboMarca,_this.winBusqAvanzadaADD.tfNroChasis,
                 _this.winBusqAvanzadaADD.comboCombustible, _this.winBusqAvanzadaADD.tfNroMotor1,
                 _this.winBusqAvanzadaADD.comboColorPrim, _this.winBusqAvanzadaADD.tfNroMotor2,
                 _this.winBusqAvanzadaADD.comboColorSeg,_this.winBusqAvanzadaADD.comboTipoTramite,
                 _this.winBusqAvanzadaADD.comboColorChapa,_this.winBusqAvanzadaADD.comboSector,
                 _this.winBusqAvanzadaADD.comboTipoChapa,_this.winBusqAvanzadaADD.comboEstatusTecnico
                 ],
                 keyMapContainer:_this.winModificarMedio
                 });*/
                _this.winBusqAvanzadaADD.show();

            }
        });

        this.tbar = [_this.etiquetas.lbCmCodigo + ': ', _this.tfCodigoADD, '&nbsp;&nbsp; ', _this.etiquetas.lbCmDenominacion + ': ',
            _this.tfDescripcionADD, '&nbsp;&nbsp;', _this.etiquetas.lbCmMatricula + ': ', _this.tfMatriculaADD, '&nbsp;&nbsp;', _this.btnBuscarADD, _this.btnBusqavanzADD, _this.btnLimpiarADD];

        this.buttons = [_this.addCancelar, _this.addAplicar, _this.addAceptar];

        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            checkOnly: false

        });

        this.sm.on({
            'rowselect': function(st, number, record) {

                if (st.selections.items.length > 0) {
                    _this.addAplicar.enable();
                    _this.addAceptar.enable();
                }
            },
            'rowdeselect': function(st, number, record) {
                if (st.selections.items.length == 0) {
                    _this.addAplicar.disable();
                    _this.addAceptar.disable();
                }
            }
        });
        this.gridAddMedios = new Ext.aft.gridCentralRegMatricula({
            url: 'cargarGridCentral',
            activartbar: false,
            width: 1500,
            autoScroll: true,
            height: 358,
            autoWidth: true,
            autoload: true,
            sm: _this.sm,
            cargarcentral: false,
            // tbar: _this.tbar,
            configuracion: _this.configuracion
        });
        this.panelAddmedios = new Ext.FormPanel({
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 990,
            height: 400,
            autoScroll: true,
            // tbar: [ _this.btnBuscarADD, _this.btnBusqavanzADD, _this.btnLimpiarADD],
            items: [_this.gridAddMedios]

        });
        this.items = [_this.panelAddmedios];

        Ext.aft.winAddMedio.superclass.constructor.apply(this, arguments);
    },
    getBuscarMedios: function() {

        var _this = this;
        if (_this.tfCodigoADD.isDirty() || _this.tfDescripcionADD.isDirty() || _this.tfMatriculaADD.isDirty()) {
            if (_this.tfCodigoADD.isValid() && _this.tfDescripcionADD.valido && _this.tfMatriculaADD.valido) {
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                Ext.aft.gridCentralRegMatricula.buscar = true;
                _this.gridAddMedios.getStore().load({
                    params: {
                        codigo: _this.tfCodigoADD.getValue(),
                        descripcion: _this.tfDescripcionADD.getValue(),
                        matricula: _this.tfMatriculaADD.getValue()

                    }
                });
            } else {
                mostrarMensaje(1, _this.etiquetas.MsgInscripcionCamposError);
            }
        }

    },
    getAddRegVehiculos: function(accion) {

        var _this = this;
        var idregnum = new Array();
        for (var i = 0; i < _this.sm.selections.items.length; i++) {
            idregnum.push(_this.sm.selections.items[i].data.idregnumerico);
        }

        Ext.Ajax.request({
            url: 'getAddRegVehiculo',
            method: 'POST',
            params: {
                idregnum: Ext.encode(idregnum),
                idestructura: Ext.getCmp('itemx').getValue(),
                tipo: (Ext.getCmp('vehiculo').disabled) ? 0 : 1,
                registro: Ext.LOG.gestregmatricula.vistaactiva
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);

                if (rd.msg == 1) {
                    mostrarMensaje(1, _this.etiquetas.MsgAdicionarMediosOK);
                    if (accion) {
                        _this.close();
                        _this.myMask.show();
                        _this.gridCEntral.getStore().load();
                    }
                    else {
                        _this.myMask.show();
                        _this.gridAddMedios.getStore().load();
                        _this.gridCEntral.getStore().load();
                        _this.addAplicar.disable();
                        _this.addAceptar.disable();
                    }

                }

            }
        });

    }
});