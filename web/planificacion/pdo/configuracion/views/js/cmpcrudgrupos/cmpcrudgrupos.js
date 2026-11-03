
Utilidades.Cmp.Cmpcrudgrupos = function() {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.btnaplicar = false;
    this.valoresiniform = [];
    this.change = false;
    this.changeDenom = false;
    this.changeDescrip = false;
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //componente para el manejo de los mensajes de espera
    this.BarraProgreso = new BarraEstado();

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudGrupo = function(accion, PostAccionesGestionar, arrayidgrupos)
    {
        _this.arrayidgrupos = arrayidgrupos;
        _this.estamodificando = 0;
        var permiso = 1;
        if (accion == 'Modificar') {
            _this.estamodificando = 1;
        }
        //campo para la denominacion del arc
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominaciongrupo',
            fieldLabel: 'Denominación',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            prevTab: 'btacepact',
            anchor: '100%',
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            ((_this.valoresiniform [0]).toString() !== c.getValue().toString()) ? _this.changeDenom = true : _this.changeDenom = false;
                        }, c);
                    }
                },
                change: function() {
                    _this.change = true;
                }
            }
        });

        //campo para la descripcion del arc
        _this.hedescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripciongrupo',
            width: 650,
            height: 265,
            value: '',
            listeners: {
                editmodechange: function(editor) {
                    editor.syncValue();
                    _this.change = true;
                },
                sync: function(editor, html) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform [1] == null) {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.changeDescrip = false;
                            else
                                _this.changeDescrip = true;
                        } else if (_this.valoresiniform [1].toString() != html)
                            _this.changeDescrip = true;
                    }
                }
            }, buttonTips: {
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
                    title: 'Subrayado (Ctrl+I)',
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

        //clasificador de involucrados con el listado de usuarios y grupos
        _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolGrupoNom(arrayidgrupos[0], 'grupo', _this.estamodificando, idautor = null);

        //tabpanel donde pongo el clasificador de involucrados y la descripcion
        _this.tpdatoscomp = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            listeners: {
                tabchange: function(tf)
                {
                    _this.tpdatoscomp.doLayout();
                }
            },
            items: [
                {
                    title: 'Descripci&oacute;n',
                    xtype: 'panel',
                    layout: 'fit',
                    height: 265,
                    items: [_this.hedescripcion]
                },
                _this.pclasificadorinvol
            ]
        });

        //formulario con atributos del arc
        _this.fpCrudGrupo = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.tfdenominacion]
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.tpdatoscomp]
                        }
                    ]
                }],
            listeners: {
                'clientvalidation': function(fm, valid) {
                    if (_this.estamodificando == 1) {
                     (valid && (_this.changeDenom || _this.changeDescrip || _this.objclasificadorinvol.modificarInv)) ? _this.btnAceptarCrudGrupo.setDisabled(false) : _this.btnAceptarCrudGrupo.setDisabled(true);
                     }
                }
            }
        });

        //botones para el crud de grupos
        _this.btnCancelarCrudGrupo = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'btnCancelarCrudGrupo',
            nextTab: 'btnAplicarCrudGrupo',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
                _this.winCrudGrupo.destroy();
                _this.btnaplicar = false;
            }
        });
        _this.btnAceptarCrudGrupo = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            id:'btacepact',
            nextTab: 'tfdenominaciongrupo',
            prevTab: 'btnAplicarCrudGrupo',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function() {
                _this.CrudGrupo(PostAccionesGestionar, accion, aplicar = 0);
            }
        });
        _this.btnAplicarCrudGrupo = new Ext.Button({
            iconCls: 'aplicar',
            id: 'btnAplicarCrudGrupo',
            text: 'Aplicar',
            hidden: true,
            nextTab: 'btacepact',
            prevTab: 'btnCancelarCrudGrupo',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function() {
                _this.CrudGrupo(PostAccionesGestionar, accion, aplicar = 1);
                _this.btnaplicar = true;
            }
        });

        //ventana donde muestro el formulario para el crud de grupos
        if (_this.winCrudGrupo) {
            _this.winCrudGrupo.destroy();
        }
        _this.winCrudGrupo = new Ext.Window({
            modal: true,
            constrain: true,
            closeAction: 'destroy',
            layout: 'fit',
            title: accion + ' grupo',
            width: 680,
            height: 434,
            resizable: false,
            autoValidate: true,
            validateDefaul: true,
            listeners: {
                destroy: function(w) {
                    _this.btnaplicar = false;
                    _this.change = false;
                    _this.changeDenom = false;
                    _this.changeDescrip = false;
                },
                beforedestroy: function() {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Aplicar-Cerrar');
                }
            },
            items: [_this.fpCrudGrupo],
            buttons: [_this.btnCancelarCrudGrupo, _this.btnAplicarCrudGrupo, _this.btnAceptarCrudGrupo]
        });
        _this.winCrudGrupo.doLayout();
        _this.winCrudGrupo.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion)
        {
            case'Adicionar':
                _this.btnCancelarCrudGrupo.setVisible(true);
                _this.btnAceptarCrudGrupo.setVisible(true);
                _this.btnAplicarCrudGrupo.setVisible(true);
                _this.winCrudGrupo.autoValidate = true;
                break;
            default:
                var accionejecutada = 'que usted quiere modificar';
                if (accion == 'Modificar') {
                    if (accion == 'Modificar') {
                        _this.winCrudGrupo.autoValidate = false;
                        _this.btnCancelarCrudGrupo.setVisible(true);
                        _this.btnAceptarCrudGrupo.setVisible(true);
                        _this.btnAceptarCrudGrupo.setDisabled(true);
                        _this.btnAplicarCrudGrupo.setVisible(false);
                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionargrupos/cargarformgrupo',
                        params: {
                            idgrupo: _this.arrayidgrupos[0]
                        },
                        callback: function(options, success, response)
                        {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                _this.winCrudGrupo.enable();
                                mostrarMensaje(3, 'El grupo ' + accionejecutada + ' ya no se encuentra en los registros.', function()
                                {
                                    _this.winCrudGrupo.destroy();
                                    PostAccionesGestionar();
                                });
                            } else {
                                _this.BarraProgreso.hide();
                                _this.winCrudGrupo.enable();
                                responseData = Ext.decode(response.responseText);
                                _this.tfdenominacion.setValue(responseData.data[0].dengrupo);
                                _this.hedescripcion.setValue(responseData.data[0].descgrupo);
                                _this.valoresiniform [0] = responseData.data[0].dengrupo;
                                _this.valoresiniform [1] = responseData.data[0].descgrupo;
                            }
                        }
                    });
                }
        }
    };

    //funcion donde procedo a adicionar y modificar el grupo
    this.CrudGrupo = function(PostAccionesGestionar, accion, aplicar)
    {
        url = 'adicionargrupo';
        waitMsg = 'Guardando datos del grupo';
        postaccion = 'adicionado';
        grupoaccion = 'adicionar';
        if (accion == 'Modificar') {
            url = 'modificargrupo';
            postaccion = 'modificado';
            grupoaccion = 'modificar';
        }
        //if(!_this.validarMod()){
        if (_this.fpCrudGrupo.getForm().isValid()) {
            this.btnaplicar = false;
            var procede = 0;
            var patron = /[a-zA-Z0-9áéíóúñüÑ]/;
            if (_this.tfdenominacion.getValue().match(patron)) {
                procede = 1;
            }
            if (procede == 1) {
                _this.BarraProgreso.show(waitMsg);
                var arraygruposusuarios = _this.objclasificadorinvol.ObtenerListadoGrupoNom();
                    _this.fpCrudGrupo.getForm().submit({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionargrupos/' + url,
                        params: {
                            arraygruposusuarios: Ext.encode(arraygruposusuarios),
                            idgrupo: _this.arrayidgrupos[0]
                        },
                        failure: function(form, action) {
                            _this.BarraProgreso.hide();
                            if (action.result.mensaje == 1) {
                                mostrarMensaje(1, 'El grupo ha sido ' + postaccion + ' satisfactoriamente.');
                                if (aplicar == 0) {
                                    PostAccionesGestionar(action.result.mensaje, accion);
                                    _this.winCrudGrupo.destroy();
                                } else {
                                    //PostAccionesGestionar(0, 'Aplicar');
                                    _this.fpCrudGrupo.getForm().reset();
                                    _this.objclasificadorinvol.ResetearCamposGrupoNom();
                                }
                            }
                            if (action.result.mensaje == 0) {
                                mostrarMensaje(1, 'Ya existe un grupo registrado por usted con esa denominaci&oacute;n. \n\
                                                Por favor, pruebe cambiarlo e intente de nuevo.');
                            }
                            if (action.result.mensaje == 3) {
                                mostrarMensaje(1, 'El grupo de usuarios y estructuras que quiere ' + grupoaccion + ' ya existe.');
                            }
                        }
                    });
            } else
                mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
        } else
            mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
    };

    //funcion donde procedo a eliminar  los grupos
    this.EliminarGrupos = function(arrayidgrupos, PostAccionesGestionar/*,smTGCmpArc,TGCmpArc*/)
    {
        var mensaje = '', mensajeespera;
        if (arrayidgrupos.length > 1) {
            mensaje = '¿Est&aacute; seguro que quiere eliminar los grupos seleccionados?';
            mensajeespera = 'Eliminando grupos';
        } else {
            mensaje = '¿Est&aacute; seguro que quiere eliminar el grupo seleccionado?';
            mensajeespera = 'Eliminando grupo';
        }
        mostrarMensaje(2, mensaje, elimina);
        function elimina(btnPresionado)
        {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(mensajeespera);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionargrupos/eliminargrupos',
                    params: {
                        arrayidgrupos: Ext.encode(arrayidgrupos)
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        msj = 'El grupo que usted quiere eliminar ya no se encuentra en los registros.';
                        icono = 3;
                        var ms = 0;
                        if (responseData.mensaje == 1) {

                            icono = 1;
                            ms = 1;
                            if (arrayidgrupos.length > 1) {
                                msj = 'Los grupos han sido eliminados satisfactoriamente.';
                            } else {
                                msj = 'El grupo ha sido eliminado satisfactoriamente.';
                            }
                        }
                        if (responseData.mensaje == 2) {

                            if (arrayidgrupos.length > 1) {
                                msj = 'Los grupos han sido eliminados y desactivados satisfactoriamente.';
                            } else {
                                msj = 'El grupo ha sido eliminado y desactivado satisfactoriamente.';
                            }
                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 4) {
                            if (arrayidgrupos.length > 1) {
                                msj = 'Los grupos han sido desactivados satisfactoriamente.';
                            } else {
                                msj = 'El grupo ha sido desactivado satisfactoriamente.';
                            }
                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 1
                                || responseData.mensaje == 2
                                || responseData.mensaje == 4) {
                            mostrarMensaje(1, msj);
                            PostAccionesGestionar(ms, 'Eliminar');
                        } else {
                            mostrarMensaje(icono, msj, function()
                            {
                                PostAccionesGestionar(ms, 'Eliminar');
                            });
                        }
                    }
                });
            }
        }
    };

    //funcion donde procedo a activar o desactivar  los grupos
    this.ActivarDesactivarGrupo = function(arrayidgrupos, PostAccionesGestionar, accion)
    {
        var mensaje = '', mensajemascara = '';
        if (arrayidgrupos.length > 1) {
            mensaje = '¿Está seguro que quiere ' + accion + ' los grupos seleccionados?';
            mensajemascara = ' grupos';
        } else {
            mensaje = '¿Está seguro que quiere ' + accion + ' el grupo seleccionado?';
            mensajemascara = ' grupo';
        }
        mostrarMensaje(2, mensaje, ejecuta);

        function ejecuta(btnPresionado)
        {
            if (btnPresionado == 'ok') {
                sms = 'Activando';
                if (arrayidgrupos.length > 1)
                    smsp = 'activados';
                else
                    smsp = 'activado';

                varaccion = 1;
                if (accion == 'desactivar') {
                    sms = 'Desactivando';
                    if (arrayidgrupos.length > 1)
                        smsp = 'desactivados';
                    else
                        smsp = 'desactivado';
                    varaccion = 0;
                }
                _this.BarraProgreso.show(sms + mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionargrupos/activardesactivargrupos',
                    params: {
                        arrayidgrupos: Ext.encode(arrayidgrupos),
                        accion: varaccion
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion1 = '';
                            if (arrayidgrupos.length > 1)
                                mensajeconfirmacion1 = 'Los grupos han sido ' + smsp + ' satisfactoriamente.';
                            else
                                mensajeconfirmacion1 = 'El grupo ha sido ' + smsp + ' satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion1);
                            PostAccionesGestionar(responseData.mensaje, 'DesAct');
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidgrupos.length > 1)
                                mensajeconfirmacion2 = 'Los grupos que usted quiere ' + accion + ' ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'El grupo que usted quiere ' + accion + ' ya no se encuentra en los registros.';

                            mostrarMensaje(3, mensajeconfirmacion2, function()
                            {
                                PostAccionesGestionar(responseData.mensaje, 'DesAct');
                            });
                        }
                    }
                });
            }
        }
    };

    this.AlCancelar = function(PostAccionesGestionar) {
        _this.winCrudGrupo.destroy();
        PostAccionesGestionar(action.result.mensaje, accion);
    }

};
