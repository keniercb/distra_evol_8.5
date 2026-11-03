Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();


Utilidades.Cmp.Cmpgestionarobservaciones = function () {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.gestionado = 0;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //botones para la gestion de las observaciones
    this.btnAddObs = new Ext.Button({
        id: 'btnAddObs',
        prevTab: 'btnCerrarCrudObs',
        nextTab: 'btnEliObs',
        handler: function () {
            _this.ConstruirWinCrudObservaciones();
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar observaciones',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnEliObs = new Ext.Button({
        id: 'btnEliObs',
        prevTab: 'btnAddObs',
        nextTab: 'btnCerrarCrudObs',
        handler: function () {
            _this.EliminarObservaciones();
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar observaciones',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    //plugin para expandir las filas del grid donde se muestran las observaciones	
    this.expander = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Detalles de la observaci&oacute;n:</b> {obs}</p><br>'
        )
    });
    //Store del grid donde se muestran las observaciones
    this.stGCmpObservaciones = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/plan/index.php/cmpgestionarobservaciones/cargarobservaciones',
        reader: new Ext.data.JsonReader({
            id: 'idobs',
            root: "data"
        }, [{
            name: 'idobs'
        }, {
            name: 'denominacion'
        }, {
            name: 'obs'
        }, {
            name: 'autor'
        }, {
            name: 'fechacreacion'
        }, {
            name: 'eliminar'
        }]),
        listeners: {
            load: function (store, record, options) {
            }
        }
    });
    //modo de seleccion del grid donde se muestran las observaciones
    this.smGCmpObservaciones = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    //grid donde se muestran las observaciones
    this.gCmpObservaciones = new Ext.grid.GridPanel({
        frame: true,
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        store: _this.stGCmpObservaciones,
        sm: _this.smGCmpObservaciones,
        plugins: _this.expander,
        columns: [_this.expander,
            _this.smGCmpObservaciones,
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idobs'
            }, {
                id: 'expandir',
                header: "Asunto",
                dataIndex: 'denominacion',
                sortable: true
            }, {
                header: "Autor",
                width: 150,
                dataIndex: 'autor',
                sortable: true
            }, {
                header: 'Fecha de creaci&oacute;n',
                width: 150,
                dataIndex: 'fechacreacion',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'obs'
            }
        ],
        loadMask: {
            msg: 'Cargando observaciones...'
        },
        usarKeymap: true,
        botonesKeymap: [_this.btnAddObs, _this.btnEliObs],
        tbar: [_this.btnAddObs, ' ', _this.btnEliObs]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        constrain: true,
        title: 'Registro de observaciones',
        layout: 'fit',
        closable: true,
        closeAction: 'hide',
        graggable: false,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.gCmpObservaciones,
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                iconCls: 'cerrar',
                id: 'btnCerrarCrudObs',
                prevTab: 'btnEliObs',
                nextTab: 'btnAddObs',
                handler: function () {
                    _this.WinPrincipal.hide();
                    _this.smGCmpObservaciones.clearSelections();
                    _this.btnEliObs.disable();
                    _this.gCmpObservaciones.getView().refresh(true);
                    if (_this.gestionado == 1) {
                        _this.AccionesAlCerrar();
                    }
                }
            }
        ]
    });

    //funcion que se encarga de construir la ventana con el formulario para adicionar observaciones
    this.ConstruirWinCrudObservaciones = function () {
        if (_this.WinCrudObservaciones) {
            _this.WinCrudObservaciones.destroy();
        }

        //campo de texto para el asunto de la observacion
        _this.tfasunto = new Ext.form.TextField({
            fieldLabel: 'Asunto',
            id: 'asunto',
            maxLength: 255,
            prevTab: 'btnaceptarobs',
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            anchor: '100%'
        });

        //editor html para el cuerpo de la observacion
        _this.hecuerpoasunto = new Ext.form.HtmlEditor({
            fieldLabel: 'Observación',
            height: 245,
            id: 'cuerpo',
            anchor: '100%',
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

        //campo oculto para el id del elemento
        _this.idelemhidden = new Ext.form.Hidden({
            id: 'idelemento',
            value: _this.idelemento
        });

        //formulario con atributos de la observacion
        _this.fpCrudObservaciones = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            reader: new Ext.data.JsonReader({
                    root: "data",
                    id: "idobs"
                }, [{
                    name: 'idobs'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'observacion'
                }]
            ),
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [_this.tfasunto, _this.idelemhidden, _this.hecuerpoasunto]
                }]
            }]
        });

        //ventana donde muestro el formulario para adicionar las observaciones
        _this.WinCrudObservaciones = new Ext.Window({
            title: 'Adicionar observaci&oacute;n',
            modal: true,
            constrain: true,
            closeAction: 'destroy',
            layout: 'fit',
            width: 620,
            height: 400,
            items: [_this.fpCrudObservaciones],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.AdicionarObservaciones();
                },
                scope: this
            }],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    nextTab: 'btnaplicarobs',
                    id: 'btncancelarobs',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        _this.WinCrudObservaciones.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    prevTab: 'btncancelarobs',
                    nextTab: 'btnaceptarobs',
                    id: 'btnaplicarobs',
                    tooltip: 'Guardar datos y limpiar los campos',
                    handler: function () {
                        _this.AdicionarObservaciones(true);
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    id: 'btnaceptarobs',
                    prevTab: 'btnaplicarobs',
                    nextTab: 'asunto',
                    tooltip: 'Cerrar ventana y guardar los datos',
                    handler: function () {
                        _this.AdicionarObservaciones(false);
                    }
                }
            ]
        });
        _this.WinCrudObservaciones.show();
        _this.tfasunto.focus(false, 1024);
    };

    //funcion que se encarga de adicionar las obsservaciones
    this.AdicionarObservaciones = function (aplicar) {
        _this.fpCrudObservaciones.getForm().submit({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobservaciones/adicionarobservaciones',
            waitMsg: 'Adicionando observaci&oacute;n',
            failure: function (form, action) {
                msj = 'La ';
                if (_this.tipoelemento != 'actividad') {
                    msj = 'El ';
                }
                if (action.result.mensaje == 1) {
                    mostrarMensaje(1, 'La observaci&oacute;n ha sido adicionada satisfactoriamente.');
                    _this.PostAccionesGestionar();
                    _this.gestionado = 1;
                    if (aplicar == true) {
                        _this.fpCrudObservaciones.getForm().reset();
                        _this.tfasunto.focus(false, 1024);
                    } else {
                        _this.WinCrudObservaciones.destroy();
                    }
                } else if (action.result.mensaje == 3) {
                    mostrarMensaje(1, msj + _this.tipoelemento + ' al cual usted quiere adicionarle una observaci&oacute;n ya no se encuentra en los registros.', function () {
                            _this.WinCrudObservaciones.destroy();
                            _this.WinPrincipal.hide();
                            _this.AccionesAlCerrar();
                        }
                    );
                } else if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'La observación que quiere adicionar ya existe.');
                }
            }
        });
    };

    //funcion que se encarga de eliminar las obsservaciones
    this.EliminarObservaciones = function () {
        if (_this.arrayidobservaciones.length == 1) {
            msgc = '¿Está seguro que quiere eliminar la observación seleccionada?';
            msgi = 'La observación ha sido eliminada satisfactoriamente.';
            comp = 'Eliminando observaci&oacute;n';
        } else {
            msgc = '¿Está seguro que quiere eliminar las observaciones seleccionadas?';
            msgi = 'Las observaciones han sido eliminadas satisfactoriamente.';
            comp = 'Eliminando observaciones';
        }
        mostrarMensaje(2, msgc, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(comp);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobservaciones/eliminarobservaciones',
                    params: {
                        arrayidobservaciones: Ext.encode(_this.arrayidobservaciones)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, msgi);
                        _this.PostAccionesGestionar();
                        _this.gestionado = 1;
                    }
                });
            } else {
                if (_this.smGCmpObservaciones.hasSelection()) {
                    _this.smGCmpObservaciones.clearSelections();
                    _this.gCmpObservaciones.getView().refresh(true);
                }
            }
        }
    };

    //funcion que se encarga de actualizar el estado de los botones de la barra de herramientas
    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidobservaciones = [];
        _this.btnEliObs.disable();
        if (_this.smGCmpObservaciones.hasSelection()) {
            var arrayrecords = _this.smGCmpObservaciones.getSelections();
            var totalrecords = arrayrecords.length;
            var puedeeliminar = 1;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidobservaciones[i] = arrayrecords[i].data.idobs;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliObs.enable();
                }
            }
        }
    };

    //funcion que se ejecuta luego de adicionar o eliminar  observacion(es)
    this.PostAccionesGestionar = function () {
        _this.stGCmpObservaciones.reload({
            params: {
                idelemento: _this.idelemento
            }
        });
        _this.btnEliObs.disable();
    };

    //funcion que se encarga de mostrar el componente observaciones
    this.CargarCmpObservaciones = function (idelemento, tipoelemento, PostAccionesGestionar) {
        _this.AccionesAlCerrar = PostAccionesGestionar;
        _this.idelemento = idelemento;
        _this.tipoelemento = tipoelemento;
        _this.WinPrincipal.on('beforeshow', function () {
            _this.btnAddObs.focus(true, 700);
        });
        _this.WinPrincipal.doLayout();
        _this.WinPrincipal.show();
        _this.btnAddObs.focus(true, 1024);
        setTimeout(function(){_this.btnAddObs.focus(true); }, 500);
        _this.stGCmpObservaciones.reload({
            params: {
                idelemento: idelemento
            }
        });
    }

};
