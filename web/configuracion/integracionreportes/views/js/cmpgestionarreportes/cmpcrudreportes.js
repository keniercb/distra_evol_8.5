Utilidades.Cmp.objCmpCrudReportes = function (opcionesConfig) {
    Ext.QuickTips.init();
    var _this = this;
    var html = '';
    var btnaplicar = false;
    var change = false;
    _this.posteliminar = false;

    _this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    _this.objValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    _this.objFiltro = new Utilidades.Cmp.CmpFiltro({
        autoloadstore: false,
    });

    _this.crearWinCrudReportes = function (parametros, postAccionesGestionar) {
        var accion = parametros.accion;
        var st = parametros.st;
        var sm = parametros.sm;
        var arrayidreportes = parametros.arrayidreportes;

        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionreporte',
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

        _this.hedescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'Descripción',
            id: 'hedescripcion',
            width: 640,
            prevTab: '',
            nextTab: '',
            readOnly: false,
            height: 140,
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    change = true;
                },
                sync: function (editor, html) {
                    change = true;
                    if (accion == 'Modificar') {
                    }
                }
            },
            buttonTips: {
                bold: {
                    title: 'Negrita (Ctrl+B)',
                    text: 'Aplica el formato de negrita al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                italic: {
                    title: 'Cursiva (Ctrl+I)',
                    text: 'Aplica el formato de cursiva al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                underline: {
                    title: 'Subrayado (Ctrl+U)',
                    text: 'Subraya el texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                increasefontsize: {
                    title: 'Agrandar fuente',
                    text: 'Aumenta el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                backcolor: {
                    title: 'Color de resaltado del texto',
                    text: 'Cambia el aspecto del texto como si estuviera marcado con un marcador.',
                    cls: 'x-html-editor-tip'
                },
                forecolor: {
                    title: 'Color de fuente',
                    text: 'Cambia el color del texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyleft: {
                    title: 'Alinear texto a la izquierda',
                    text: 'Alinea el texto a la izquierda.',
                    cls: 'x-html-editor-tip'
                },
                justifycenter: {
                    title: 'Centrar',
                    text: 'Centrar el texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyright: {
                    title: 'Alinear texto a la derecha',
                    text: 'Alinea el texto a la derecha.',
                    cls: 'x-html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Viñetas',
                    text: 'Inicia una lista con viñetas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Numeración',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'Hipervínculo',
                    text: 'Hace del texto seleccionado un hipervínculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            }
        });

        _this.objConfiguracion = new Utilidades.Cmp.CmpConfiguracion({
            integracion: true
        });
        _this.stcmbconfiguracion = _this.objConfiguracion.obtenerStore();

        _this.cmbconfiguracion = new Ext.form.ComboBox({
            id: 'cmbconfiguracion',
            prevTab: '',
            nextTab: '',
            emptyText: 'Seleccione',
            fieldLabel: 'Servidor ReportServer',
            store: _this.stcmbconfiguracion,
            hiddenName: 'idconfiguracion',
            valueField: 'idconfiguracion',
            displayField: 'denconfiguracion',
            triggerAction: 'all',
            allowBlank: false,
            editable: false,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '99%',
            listeners: {
                expand: function (combo) {
                    //_this.stcmbconfiguracion.reload();
                },
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (accion == 'Modificar') {
                    }
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (_this.isValid()) {
                            }
                        }, c);
                    }
                }
            }
        });

        _this.tfidreportserver = new Ext.form.TextField({
            id: 'tfidreportserver',
            fieldLabel: 'Id reporte ReportServer',
            maxLength: 10,
            maxLengthText: 'El tamaño máximo requerido es 10 caracteres.',
            regex: _this.objValidaciones.expresionRegular('numeropositivo'),
            maskRe: /^([0-9])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('numeropositivo'),
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
                            if (_this.isValid()) {
                            }
                        }, c);
                    }
                }
            }
        });

        _this.stclasificacionreporte = new Ext.data.Store({
            autoLoad: true,
            url: '/configuracion/integracionreportes/index.php/cmpclasificacion/listarClasificacion',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'total',
                    root: 'data',
                    id: 'idclasificacion'
                }, [{
                    name: 'idclasificacion'
                }, {
                    name: 'denominacion'
                }]
            ),
            listeners: {
                beforeload: function () {
                },
                'load': function (store, records, options) {
                    if (store.getCount() == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    }
                }
            }
        });

        _this.cmbclasificacionreporte = new Ext.form.ComboBox({
            id: 'cmbclasificacionreporte',
            fieldLabel: 'Clasificación',
            emptyText: 'Seleccione',
            store: _this.stclasificacionreporte,
            valueField: 'idclasificacion',
            hiddenName: 'idclasificacion',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'remote',
            anchor: '99%',
            editable: false,
            typeAhead: true,
            listeners: {
                expand: function (combo) {
                    /*_this.stclasificacionreporte.reload({
                        callback: function (record, options, success) {
                        }
                    });*/
                },
                change: function (field, newValue, oldValue) {
                }
            }
        });

        _this.objFiltro = new Utilidades.Cmp.CmpFiltro({
            tipocomponente: 'panel',
            idcmp: 'panelFiltro',
            idreporte: (arrayidreportes) ? arrayidreportes[0] : '',
            integracion: true,
            accionreporte: accion,
            nousarpaginado: (accion == 'Adicionar') ? true : false,
            autoloadstore: (accion == 'Adicionar') ? false : true,

        })
        _this.pFiltros = _this.objFiltro.crearWinFiltro();

        _this.fpCrudReporte = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.btnAceptarCrudReporte.handler.call(this);
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
                                items: [{
                                    layout: 'column',
                                    items: [{
                                        columnWidth: 0.30,
                                        layout: 'form',
                                        items: [_this.tfidreportserver]
                                    }, {
                                        columnWidth: 0.35,
                                        layout: 'form',
                                        bodyStyle: 'padding:0 0 0 5px',
                                        items: [_this.cmbconfiguracion]
                                    }, {
                                        columnWidth: 0.35,
                                        layout: 'form',
                                        bodyStyle: 'padding:0 0 0 5px',
                                        items: [_this.cmbclasificacionreporte]
                                    }, {
                                        columnWidth: 1,
                                        layout: 'form',
                                        items: [{
                                            xtype: 'tabpanel',
                                            id: 'tabPanelReporteBottom',
                                            activeTab: 0,
                                            border: true,
                                            bodyBorder: true,
                                            anchor: '100%',
                                            height: 255,
                                            items: [{
                                                xtype: 'panel',
                                                id: 'tabPanelParametros',
                                                prevTab: '',
                                                nextTab: '',
                                                title: 'Filtros',
                                                layout: 'fit',
                                                items: [_this.pFiltros]
                                            }, {
                                                xtype: 'panel',
                                                id: 'tabPanelDescripcion',
                                                prevTab: '',
                                                nextTab: '',
                                                title: 'Descripci&oacute;n',
                                                layout: 'fit',
                                                items: [_this.hedescripcion]
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                    }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudReporte.enable();
                    } else {
                        _this.btnAceptarCrudReporte.disable();
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                    }
                }
            }
        });

        _this.btnAplicarCrudReporte = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: false,
            id: 'btnAplicarCrudReporte',
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                btnaplicar = true;
                _this.gestionarCrudReportes(parametros, postAccionesGestionar);
            }
        });

        _this.btnAceptarCrudReporte = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnAceptarCrudReporte',
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                btnaplicar = false;
                _this.gestionarCrudReportes(parametros, postAccionesGestionar);
            }
        });

        _this.btnCancelarCrudReporte = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btnCancelarCrudReporte',
            nextTab: '',
            handler: function () {
                if (sm.hasSelection()) sm.clearSelections();
                _this.winCrudReporte.destroy();
                if (btnaplicar)
                    postAccionesGestionar(1, 'Cancelar-Cerrar');
                btnaplicar = false;
            }
        });

        if (_this.winCrudReporte) {
            _this.winCrudReporte.destroy();
        }

        _this.winCrudReporte = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' reporte',
            width: 600,
            defaultButton: 1,
            height: 430,
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
            buttons: [_this.btnCancelarCrudReporte,
                _this.btnAplicarCrudReporte, _this.btnAceptarCrudReporte
            ],
            items: _this.fpCrudReporte
        });
        _this.winCrudReporte.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        //_this.stcmbconfiguracion.reload();
        _this.winCrudReporte.doLayout();
        _this.winCrudReporte.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion) {
            case 'Adicionar': {
                _this.cmbconfiguracion.validate();
                _this.tfdenominacion.focus(false, 1024);
            }
                break;
            case 'Modificar': {
                _this.tfdenominacion.focus(false, 1024);
                _this.btnAplicarCrudReporte.setVisible(false);
                _this.barraProgreso.show('Cargando datos');
                _this.winCrudReporte.disable();
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/cargarFormularioReporte',
                    params: {
                        idreporte: arrayidreportes[0]
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'El reporte que usted quiere modificar ya no se encuentra en los registros.');
                            _this.winCrudReporte.destroy();
                            postAccionesGestionar();
                        } else if (responseData.mensaje == 1) {
                            _this.barraProgreso.hide();
                            _this.tfdenominacion.setValue(responseData.data[0].denreporte);
                            _this.cmbconfiguracion.setValue(responseData.data[0].idconfiguracion);
                            _this.cmbconfiguracion.setRawValue(responseData.data[0].denconfiguracion);
                            _this.tfidreportserver.setValue(responseData.data[0].idreportereportserver);
                            _this.hedescripcion.setValue(responseData.data[0].descreporte);
                            _this.cmbclasificacionreporte.setValue(responseData.data[0].idclasificacion);
                            _this.cmbclasificacionreporte.setRawValue(responseData.data[0].denclasificacion);
                            _this.winCrudReporte.enable();
                        } else if (responseData.mensaje == 2) {
                            _this.barraProgreso.hide();
                            mostrarMensaje(1, 'Debe seleccionar un reporte.');
                            _this.winCrudReporte.destroy();
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
    //Adicionar y modificar reporte
    _this.gestionarCrudReportes = function (parametros, postAccionesGestionar) {
        var accion = parametros.accion
        var waitMsg = 'Guardando datos del reporte';
        var postaccion = '';
        var url = '';
        var arrayidreportes = parametros.arrayidreportes;
        if (accion == 'Adicionar') {
            url = 'adicionarReporte';
            postaccion = 'adicionado';
        } else if (accion == 'Modificar') {
            var idreporte = arrayidreportes[0];
            url = 'modificarReporte';
            postaccion = 'modificado';
        }
        if (_this.fpCrudReporte.getForm().isValid()) {
            _this.barraProgreso.show(waitMsg);
            _this.fpCrudReporte.getForm().submit({
                url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/' + url,
                params: {
                    idreporte: idreporte,
                    arrayfiltros: (accion == 'Adicionar') ? Ext.encode(_this.objFiltro.obtenerStoreToArray()) : []
                },
                failure: function (form, action) {
                    _this.barraProgreso.hide();
                    if (action.result.mensaje == -1) {
                        mostrarMensaje(1, 'Ha ocurrido un error. Contacte con el administrador');
                    } else if (action.result.mensaje == 0) {
                        if (accion == 'Modificar') {
                            mostrarMensaje(1, 'El reporte que quiere modificar ya existe.');
                        } else
                            mostrarMensaje(1, 'El reporte que quiere adicionar ya existe.');
                    } else if (action.result.mensaje == 1) {
                        mostrarMensaje(1, 'El reporte ha sido ' + postaccion + ' satisfactoriamente.');
                        if (!btnaplicar) {
                            _this.winCrudReporte.destroy();
                            postAccionesGestionar(action.result.mensaje, accion);
                        } else {
                            _this.fpCrudReporte.getForm().reset();
                            _this.objFiltro.obtenerStore().removeAll();
                        }
                        _this.objFiltro.actualizarEstadoBarraHerramientas();
                    } else if (action.result.mensaje == 2) {
                        mostrarMensaje(1, 'El reporte que usted quiere modificar ya no se encuentra en los registros.');
                        _this.winCrudReporte.destroy();
                        postAccionesGestionar(action.result.mensaje, accion);
                    } else if (action.result.mensaje == 3) {
                        mostrarMensaje(1, 'Faltan campos obligatorios por llenar.');
                    } else if (action.result.mensaje == 4) {
                        mostrarMensaje(1, 'Debe seleccionar un reporte.');
                        _this.winCrudReporte.destroy();
                    } else if (action.result.mensaje == 6) {
                        mostrarMensaje(1, 'Hubo algunos filtros del reporte que no fueron ' + postaccion + 's.');
                        if (!btnaplicar) {
                            _this.winCrudReporte.destroy();
                            postAccionesGestionar(action.result.mensaje, accion);
                        } else {
                            _this.fpCrudReporte.getForm().reset();
                            _this.objFiltro.obtenerStore().removeAll();
                        }
                        _this.objFiltro.actualizarEstadoBarraHerramientas();
                    } else mostrarMensaje(1, action.result.mensaje);
                }
            });
        }

    };
    //Eliminar reporte
    _this.eliminarReporte = function (parametros, postAccionesGestionar) {
        var sm = parametros.sm;
        var st = parametros.st;
        var accion = parametros.accion;
        var arrayidreportes = parametros.arrayidreportes
        var mensaje = '', mensajemascara = '', mensajeconfirmacion0 = '', mensajeconfirmacion1 = '',
            mensajeconfirmacion2 = '';
        if (sm.getSelections().length > 1) {
            mensaje = '¿Está seguro que quiere eliminar los reportes seleccionados?';
            mensajemascara = 'Eliminando reportes';
            mensajeconfirmacion0 = 'Los reportes que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion1 = 'Los reportes han sido eliminados satisfactoriamente.';
            mensajeconfirmacion2 = 'Algunos de los reportes que usted quiere eliminar ya no se encuentran en los registros.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar el reporte seleccionado?';
            mensajemascara = 'Eliminando reporte';
            mensajeconfirmacion0 = 'El reporte que usted quiere eliminar ya no se encuentra en los registros.';
            mensajeconfirmacion1 = 'El reporte ha sido eliminado satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, eliminar);

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.barraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/configuracion/integracionreportes/index.php/cmpintegracionreportes/eliminarReporte',
                    params: {
                        arrayidreportes: Ext.encode(arrayidreportes)
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
}