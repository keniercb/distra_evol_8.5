Utilidades.Cmp.objCmpCrudConfiguracion = function (opcionesConfig) {

    var _this = this;
    var html = '';
    var btnaplicar = false;
    var change = false;
    _this.posteliminar = false;
    Ext.QuickTips.init();

    _this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    _this.objValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    _this.crearWinCrudConfiguracion = function (parametros, postAccionesGestionar) {
        var accion = parametros.accion;
        var st = parametros.st;
        var sm = parametros.sm;
        var arrayidconfiguracion = parametros.arrayidconfiguracion;

        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.tfurlservidor = new Ext.form.TextField({
            id: 'tfurlservidor',
            fieldLabel: 'URL servidor ReportServer',
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.objValidaciones.expresionRegular('url'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,.:/()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('url'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.tfusuario = new Ext.form.TextField({
            id: 'tfusuario',
            fieldLabel: 'Usuario',
            disabled: false,
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: true,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.tfapikey = new Ext.form.TextField({
            id: 'tfapikey',
            fieldLabel: 'API key',
            disabled: false,
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: true,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.chbautdistra = new Ext.form.Checkbox({
            id: 'chbautdistra',
            boxLabel: 'Utilizando DISTRA',
            checked: false,
            fieldLabel: '',
            labelSeparator: '',
            listeners: {
                check: function (check, checked) {
                    if (checked) {
                        _this.tfusuario.disable();
                        _this.tfapikey.disable();
                        _this.tfidsso.enable();
                        _this.tfidsso.allowBlank = false;
                        _this.tfidsso.validate();
                    } else {
                        _this.tfusuario.enable();
                        _this.tfapikey.enable();
                        _this.tfidsso.disable();
                        _this.tfidsso.allowBlank = true;
                        _this.tfidsso.validate();
                    }
                }
            }
        });

        _this.tfidsso = new Ext.form.TextField({
            id: 'tfidsso',
            fieldLabel: 'Id script SSO',
            maxLength: 10,
            disabled: false,
            maxLengthText: 'El tamaño máximo requerido es 10 caracteres.',
            regex: _this.objValidaciones.expresionRegular('numeropositivo'),
            maskRe: /^([0-9])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('numeropositivo'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                'render': function (c) {
                }
            }
        });
        //usuario para autenticarse al ReportServer
        _this.tfusuariors = new Ext.form.TextField({
            id: 'tfusuariors',
            fieldLabel: 'Usuario',
            disabled: false,
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.tfpwd = new Ext.form.TextField({
            id: 'tfpwd',
            fieldLabel: 'Contraseña',
            disabled: false,
            maxLength: 60,
            inputType: 'password',
            maxLengthText: 'El tamaño máximo requerido es 60 caracteres.',
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.fsapikey = new Ext.form.FieldSet({
            id: 'fsapikey',
            title: 'Autenticarse utilizando API key',
            autoHeight: true,
            columnWidth: 1,
            layout: 'fit',
            checkboxToggle: true,
            collapsed: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.tfusuario]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.tfapikey]
                }]
            }],
            listeners: {
                expand: function (p) {
                    _this.fssso.collapse(true);
                    _this.tfidsso.allowBlank = true;
                    _this.tfidsso.validate();
                    _this.tfusuariors.allowBlank = true;
                    _this.tfusuariors.validate();
                    _this.tfpwd.allowBlank = true;
                    _this.tfpwd.validate();
                },
                collapse: function (p) {
                    _this.fssso.expand(true);
                }
            }
        });

        _this.fssso = new Ext.form.FieldSet({
            id: 'fssso',
            title: 'Autenticarse utilizando usuario/contraseña',
            autoHeight: true,
            columnWidth: 1,
            layout: 'fit',
            checkboxToggle: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.tfusuariors]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.tfpwd]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.tfidsso]
                }]
            }],
            listeners: {
                expand: function (p) {
                    _this.fsapikey.collapse(true);
                    _this.tfidsso.allowBlank = false;
                    _this.tfidsso.validate();
                    _this.tfusuariors.allowBlank = false;
                    _this.tfusuariors.validate();
                    _this.tfpwd.allowBlank = false;
                    _this.tfpwd.validate();
                },
                collapse: function (p) {
                    _this.fsapikey.expand(true);
                }
            }
        });

        _this.fpCrudConfiguracion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.btnAceptarCrudConfiguracion.handler.call(this);
                }
            }], items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfdenominacion]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfurlservidor]
                    }, {
                        columnWidth: 1,
                        layout: 'fit',
                        items: [{
                            xtype: 'panel',
                            activeTab: 0,
                            border: false,
                            bodyBorder: false,
                            width: 400,
                            height: 500,
                            items: [{
                                frame: false,
                                items: [_this.fssso, _this.fsapikey]
                            }]
                        }]
                    }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudConfiguracion.enable();
                    } else {
                        _this.btnAceptarCrudConfiguracion.disable();
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                    }
                }
            }
        });

        _this.btnAplicarCrudConfiguracion = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: false,
            id: 'btnAplicarCrudConfiguracion',
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                btnaplicar = true;
                _this.gestionarCrudConfiguracion(parametros, postAccionesGestionar);
            }
        });

        _this.btnAceptarCrudConfiguracion = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnAceptarCrudConfiguracion',
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                btnaplicar = false;
                _this.gestionarCrudConfiguracion(parametros, postAccionesGestionar);
            }
        });

        _this.btnCancelarCrudConfiguracion = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btnCancelarCrudConfiguracion',
            nextTab: '',
            handler: function () {
                if (sm.hasSelection()) sm.clearSelections();
                _this.winCrudConfiguracion.destroy();
                if (btnaplicar)
                    postAccionesGestionar(1, 'Cancelar-Cerrar');
                btnaplicar = false;
            }
        });

        if (_this.winCrudConfiguracion) {
            _this.winCrudConfiguracion.destroy();
        }

        _this.winCrudConfiguracion = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' configuración',
            width: 400,
            defaultButton: 1,
            height: 345,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {

                },
                destroy: function () {
                    btnaplicar = false;
                },
                beforedestroy: function () {
                    if (btnaplicar)
                        postAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                render: function (w) {
                    w.focus();
                }
            },
            buttons: [_this.btnCancelarCrudConfiguracion,
                _this.btnAplicarCrudConfiguracion, _this.btnAceptarCrudConfiguracion
            ],
            items: _this.fpCrudConfiguracion
        });
        _this.winCrudConfiguracion.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.winCrudConfiguracion.doLayout();
        _this.winCrudConfiguracion.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion) {
            case 'Adicionar': {
                _this.tfdenominacion.focus(false, 1024);
            }
                break;
            case 'Modificar': {
                _this.tfdenominacion.focus(false, 1024);
                _this.btnAplicarCrudConfiguracion.setVisible(false);
                _this.barraProgreso.show('Cargando datos');
                _this.winCrudConfiguracion.disable();
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpconfiguracion/cargarFormularioConfiguracion',
                    params: {
                        idconfiguracion: arrayidconfiguracion[0]
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'La configuración que usted quiere modificar ya no se encuentra en los registros.');
                            _this.winCrudConfiguracion.destroy();
                            postAccionesGestionar();
                        } else if (responseData.mensaje == 1) {
                            _this.barraProgreso.hide();
                            _this.tfdenominacion.setValue(responseData.data[0].denconfiguracion);
                            _this.tfurlservidor.setValue(responseData.data[0].urlservidor);
                            if (responseData.data[0].autenticarapikey == '1' || responseData.data[0].usuario) {
                                _this.tfusuario.setValue(responseData.data[0].usuario);
                                _this.tfapikey.setValue(responseData.data[0].apikey);
                                _this.fsapikey.expand();
                                _this.fssso.collapse();
                            } else {
                                _this.tfusuariors.setValue(responseData.data[0].usuariors);
                                //_this.tfpwd.setValue(_this.decryptRSA(responseData.data[0].contrasenna))
                                _this.tfidsso.setValue(responseData.data[0].idsso);
                                _this.fsapikey.collapse();
                                _this.fssso.expand();
                            }
                            _this.winCrudConfiguracion.enable();
                        } else if (responseData.mensaje == 2) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'Debe seleccionar una configuración.');
                            _this.winCrudConfiguracion.destroy();
                            postAccionesGestionar();
                        } else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                            mostrarMensaje(1, responseData.mensaje);
                        else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                    }
                });
            }
                break;
        }
    }
    //Adicionar y modificar configuración
    _this.gestionarCrudConfiguracion = function (parametros, postAccionesGestionar) {
        var accion = parametros.accion
        var waitMsg = 'Guardando datos de la configuración';
        var postaccion = '';
        var url = '';
        var arrayidconfiguracion = parametros.arrayidconfiguracion;
        if (accion == 'Adicionar') {
            url = 'adicionarConfiguracion';
            postaccion = 'adicionada';
        } else if (accion == 'Modificar') {
            var idconfiguracion = arrayidconfiguracion[0];
            url = 'modificarConfiguracion';
            postaccion = 'modificada';
        }
        if (_this.fpCrudConfiguracion.getForm().isValid()) {
            _this.barraProgreso.show(waitMsg);
            var params = _this.fpCrudConfiguracion.getForm().getValues();
            if (params.hasOwnProperty('fssso-checkbox') && params['fssso-checkbox'] == 'on') {
                _this.tfusuario.reset();
                _this.tfapikey.reset();
                _this.tfpwd.maxLength = 255;
                _this.tfpwd.setValue(_this.encryptRSA(_this.tfpwd.getValue()));
            }
            if (params.hasOwnProperty('fsapikey-checkbox') && params['fsapikey-checkbox'] == 'on') {
                _this.tfusuariors.reset();
                _this.tfpwd.reset();
                _this.tfidsso.reset();
            }
            _this.fpCrudConfiguracion.getForm().submit({
                url: '/configuracion/integracionreportes/index.php/cmpconfiguracion/' + url,
                params: {
                    idconfiguracion: idconfiguracion
                },
                failure: function (form, action) {
                    _this.barraProgreso.hide();
                    if (action.result.mensaje == -1) {
                        mostrarMensaje(1, 'Ha ocurrido un error. Contacte con el administrador');
                    } else if (action.result.mensaje == 0) {
                        if (accion == 'Modificar') {
                            mostrarMensaje(1, 'La configuración que quiere modificar ya existe.');
                        } else
                            mostrarMensaje(1, 'La configuración que quiere adicionar ya existe.');
                    } else if (action.result.mensaje == 1) {
                        mostrarMensaje(1, 'La configuración ha sido ' + postaccion + ' satisfactoriamente.');
                        if (!btnaplicar) {
                            _this.winCrudConfiguracion.destroy();
                            postAccionesGestionar(action.result.mensaje, accion);
                        } else {
                            _this.fpCrudConfiguracion.getForm().reset();
                        }
                    } else if (action.result.mensaje == 2) {
                        mostrarMensaje(1, 'La configuración que usted quiere modificar ya no se encuentra en los registros.');
                        _this.winCrudConfiguracion.destroy();
                        postAccionesGestionar(action.result.mensaje, accion);
                    } else if (action.result.mensaje == 3) {
                        mostrarMensaje(1, 'Faltan campos obligatorios por llenar.');
                    } else if (action.result.mensaje == 4) {
                        mostrarMensaje(1, 'Debe seleccionar una configuración.');
                    } else mostrarMensaje(1, action.result.mensaje);
                }
            });
        }

    };

    _this.eliminarConfiguracion = function (parametros, postAccionesGestionar) {
        var sm = parametros.sm;
        var st = parametros.st;
        var accion = parametros.accion;
        var arrayidconfiguracion = parametros.arrayidconfiguracion
        var mensaje = '', mensajemascara = '', mensajeconfirmacion0 = '', mensajeconfirmacion1 = '',
            mensajeconfirmacion2 = '', mensajeconfirmacion3 = '';
        if (sm.getSelections().length > 1) {
            mensaje = '¿Está seguro que quiere eliminar las configuraciones seleccionadas?';
            mensajemascara = 'Eliminando configuraciones';
            mensajeconfirmacion0 = 'Los configuraciones que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion1 = 'Los configuraciones han sido eliminadas satisfactoriamente.';
            mensajeconfirmacion2 = 'Algunas de los configuraciones que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion3 = 'Algunas de los configuraciones que usted quiere eliminar están asociadas a reportes y no pueden ser eliminadas.'
        } else {
            mensaje = '¿Está seguro que quiere eliminar la configuración seleccionada?';
            mensajemascara = 'Eliminando configuración';
            mensajeconfirmacion0 = 'La configuración que usted quiere eliminar ya no se encuentra en los registros.';
            mensajeconfirmacion1 = 'La configuración ha sido eliminada satisfactoriamente.';
            mensajeconfirmacion3 = 'La configuración que usted quiere eliminar está asociada a un reporte y no puede ser eliminada.'
        }
        mostrarMensaje(2, mensaje, eliminar);

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.barraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpconfiguracion/eliminarConfiguracion',
                    params: {
                        arrayidconfiguracion: Ext.encode(arrayidconfiguracion)
                    },
                    callback: function (options, success, response) {
                        _this.barraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion0);
                            postAccionesGestionar(0, 'Eliminar');
                        } else if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion1);
                            postAccionesGestionar(1, 'Eliminar');
                        } else if (responseData.mensaje == 2) {
                            mostrarMensaje(1, mensajeconfirmacion2);
                            postAccionesGestionar(1, 'Eliminar');
                        } else if (responseData.mensaje == -1) {
                            mostrarMensaje(1, mensajeconfirmacion3);
                            postAccionesGestionar(1, 'Eliminar');
                        } else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                            mostrarMensaje(1, responseData.mensaje);
                        else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                    }
                });
            } else {
                if (sm.hasSelection()) {
                    sm.clearSelections();
                }
            }
        }
    };

    _this.encryptRSA = function (text) {
        var key = RSA.getPublicKey(window.parent.document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    }

    _this.decryptRSA = function (text) {

    }
}