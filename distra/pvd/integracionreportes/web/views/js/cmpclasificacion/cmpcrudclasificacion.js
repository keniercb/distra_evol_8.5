Utilidades.Cmp.objCmpCrudClasificacionReporte = function (opcionesConfig) {
    var _this = this;
    var html = '';
    var btnaplicar = false;
    var change = false;
    _this.posteliminar = false;
    Ext.QuickTips.init();

    _this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    _this.objValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    _this.crearWinCrudClasificacion = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas, postAccionesGestionarReporte) {
        var accion = parametros.accion;
        var st = parametros.st;
        var sm = parametros.sm;
        var idclasificacion = parametros.idclasificacion;
        var arrayidclasificacion = parametros.arrayidclasificacion;

        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Clasificación',
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

        _this.fpCrudClasificacion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.btnAceptarCrudClasificacion.handler.call(this);
                }
            }], items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.99,
                    layout: 'form',
                    items: [_this.tfdenominacion]
                }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudClasificacion.enable();
                        _this.btnAplicarCrudClasificacion.enable();
                    } else {
                        _this.btnAceptarCrudClasificacion.disable();
                        _this.btnAplicarCrudClasificacion.disable();
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                    }
                }
            }
        });

        _this.btnAplicarCrudClasificacion = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: false,
            id: 'btnAplicarCrudClasificacion',
            disabled: true,
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                btnaplicar = true;
                _this.gestionarCrudClasificacion(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas);
            }
        });

        _this.btnAceptarCrudClasificacion = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnAceptarCrudClasificacion',
            disabled: true,
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                btnaplicar = false;
                _this.gestionarCrudClasificacion(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas, postAccionesGestionarReporte);
            }
        });

        _this.btnCancelarCrudClasificacion = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btnCancelarCrudClasificacion',
            nextTab: '',
            handler: function () {
                if (sm.hasSelection()) sm.clearSelections();
                _this.winCrudClasificacion.destroy();
                btnaplicar = false;
            }
        });

        if (_this.winCrudClasificacion) _this.winCrudClasificacion.destroy();

        _this.winCrudClasificacion = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' clasificación del reporte',
            width: 400,
            defaultButton: 1,
            height: 125,
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
                    if (btnaplicar != 'Adicionar')
                        postAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                render: function (win) {
                    win.focus();
                }
            },
            buttons: [_this.btnCancelarCrudClasificacion, _this.btnAplicarCrudClasificacion, _this.btnAceptarCrudClasificacion],
            items: _this.fpCrudClasificacion
        });

        _this.winCrudClasificacion.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.winCrudClasificacion.doLayout();
        _this.winCrudClasificacion.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion) {
            case 'Adicionar': {
                _this.tfdenominacion.focus(false, 1024);
            }
                break;
            case 'Modificar': {
                _this.tfdenominacion.focus(false, 1024);
                _this.btnAplicarCrudClasificacion.setVisible(false);
                _this.barraProgreso.show('Cargando datos');
                _this.winCrudClasificacion.disable();
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpclasificacion/cargarFormularioClasificacion',
                    params: {
                        idclasificacion: arrayidclasificacion[0]
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'La clasificación que usted quiere modificar ya no se encuentra en los registros.');
                            _this.winCrudClasificacion.destroy();
                            postAccionesGestionar();
                        } else if (responseData.mensaje == 1) {
                            _this.barraProgreso.hide();
                            _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                            _this.winCrudClasificacion.enable();
                        } else if (responseData.mensaje == 2) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'Debe seleccionar una clasificación.');
                            _this.winCrudClasificacion.destroy();
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
    //Adicionar y modificar filtros
    _this.gestionarCrudClasificacion = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas, postAccionesGestionarReporte) {
        var accion = parametros.accion
        var waitMsg = 'Guardando datos de la clasificación';
        var postaccion = '';
        var url = '';
        var arrayidclasificacion = parametros.arrayidclasificacion;
        if (accion == 'Adicionar') {
            url = 'adicionarClasificacion';
            postaccion = 'adicionada';
        } else if (accion == 'Modificar') {
            var idclasificacion = arrayidclasificacion[0];
            url = 'modificarClasificacion';
            postaccion = 'modificada';
        }
        parametros.url = url;
        parametros.postaccion = postaccion;
        parametros.waitMsg = waitMsg;
        parametros.idclasificacion = idclasificacion;
        if (_this.fpCrudClasificacion.getForm().isValid()) {
            _this.gestionarCrudClasificacionServidor(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas, postAccionesGestionarReporte);
        }
    };
    //Eliminar Clasificacion
    _this.eliminarClasificacion = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        var sm = parametros.sm;
        var st = parametros.st;
        var accion = parametros.accion;
        var arrayidclasificacion = parametros.arrayidclasificacion;
        var mensaje = '', mensajemascara = '', mensajeconfirmacion0 = '', mensajeconfirmacion1 = '',
            mensajeconfirmacion2 = '', mensajeconfirmacion3 = '';
        if (sm.getSelections().length > 1) {
            mensaje = '¿Está seguro que quiere eliminar las clasificaciones seleccionadas?';
            mensajemascara = 'Eliminando clasificación';
            mensajeconfirmacion0 = 'Las clasificaciones que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion1 = 'Las clasificaciones han sido eliminadas satisfactoriamente.';
            mensajeconfirmacion2 = 'Algunas de las clasificaciones que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion3 = 'Algunas de los clasificaciones que usted quiere eliminar están asociadas a reportes y no pueden ser eliminadas.'
        } else {
            mensaje = '¿Está seguro que quiere eliminar la clasificación seleccionada?';
            mensajemascara = 'Eliminando clasificación';
            mensajeconfirmacion0 = 'La clasificación que usted quiere eliminar ya no se encuentra en los registros.';
            mensajeconfirmacion1 = 'La clasificación ha sido eliminada satisfactoriamente.';
            mensajeconfirmacion3 = 'La clasificación que usted quiere eliminar está asociada a un reporte y no puede ser eliminada.'
        }
        mostrarMensaje(2, mensaje, eliminar);

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.barraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpclasificacion/eliminarClasificacion',
                    params: {
                        arrayidclasificacion: Ext.encode(arrayidclasificacion)
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
                        }  else if (responseData.mensaje == -1) {
                            mostrarMensaje(1, mensajeconfirmacion3);
                            postAccionesGestionar(1, 'Eliminar');
                        } else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                            mostrarMensaje(1, responseData.mensaje);
                        else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                        actualizarEstadoBarraHerramientas();
                    }
                });

            } else {
                if (sm.hasSelection()) {
                    sm.clearSelections();
                }
            }
        }
    };

    _this.gestionarCrudClasificacionServidor = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas, postAccionesGestionarReporte) {
        _this.barraProgreso.show(parametros.waitMsg);
        var url = parametros.url;
        _this.fpCrudClasificacion.getForm().submit({
            url: '/configuracion/integracionreportes/index.php/cmpclasificacion/' + url,
            params: {
                idclasificacion: parametros.idclasificacion,
            },
            failure: function (form, action) {
                _this.barraProgreso.hide();
                if (action.result.mensaje == -1) {
                    mostrarMensaje(1, 'Ha ocurrido un error. Contacte con el administrador');
                } else if (action.result.mensaje == 0) {
                    if (accion == 'Modificar') {
                        mostrarMensaje(1, 'La clasificación que quiere modificar ya existe.');
                    } else
                        mostrarMensaje(1, 'La clasificación que quiere adicionar ya existe.');
                } else if (action.result.mensaje == 1) {
                    var postaccion = parametros.postaccion;
                    mostrarMensaje(1, 'La clasificación ha sido ' + postaccion + ' satisfactoriamente.');
                    if (!btnaplicar) {
                        _this.winCrudClasificacion.destroy();
                        postAccionesGestionar(action.result.mensaje, parametros.accion);
                        if( parametros.accion == 'Modificar')  postAccionesGestionarReporte(action.result.mensaje, parametros.accion);
                    } else {
                        _this.fpCrudClasificacion.getForm().reset();
                    }
                    actualizarEstadoBarraHerramientas();
                } else if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'La clasificación que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudClasificacion.destroy();
                    postAccionesGestionar(action.result.mensaje, accion);
                } else if (action.result.mensaje == 3) {
                    mostrarMensaje(1, 'Faltan campos obligatorios por llenar.');
                } else if (action.result.mensaje == 4) {
                    mostrarMensaje(1, 'Debe seleccionar una clasificación.');
                } else mostrarMensaje(1, action.result.mensaje);
            }
        });
    }

}