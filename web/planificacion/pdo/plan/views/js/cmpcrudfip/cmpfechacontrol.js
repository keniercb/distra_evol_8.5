Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();


Utilidades.Cmp.Cmpfechacontrol = function() {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    var cargaefectuada;
    this.arrayfechascontrol = [];
    this.arrayidfechascontrol = [];

    this.modificarFechas = false;
    this.arrayTempFechas = [];
    this.arrayIniFechas = [];
    var contFechas = 1;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //funcion para obtener el panel donde se muestra el grid con las fechas de control
    this.ConstruirPanelFechasControl = function(estamodificando, idelemento, AccionPostGestionarFechasControl, accion) {
        cargaefectuada = 0;
        _this.estamodificandofip = estamodificando;
        _this.idelemento = idelemento;
        _this.AccionPostGestionarFechasControl = AccionPostGestionarFechasControl;
        //botones para la gestion de las fechas de control
        _this.btnAdicionar = new Ext.Button({
            handler: function() {
                _this.ConstruirWinCrudfechascontrol();
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar fechas de control',
            id: 'btnAdicionarFechaControl',
            prevTab: '',
            nextTab: 'btnEliminarFechaControl',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });
        _this.btnModificar = new Ext.Button({
            handler: function() {
                //_this.EliminarObservaciones();
            },
            disabled: true,
            iconCls: 'modificar',
            tooltip: 'Modificar fecha de control',
            id: 'btnModificarFechaControl',
            prevTab: '',
            nextTab: '',
            key: {
                alt: true,
                key: 'M'
            },
            scope: this
        });
        _this.btnEliminar = new Ext.Button({
            handler: function() {
                _this.EliminarFechasControl();
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar fecha de control',
            id: 'btnEliminarFechaControl',
            prevTab: 'btnAdicionarFechaControl',
            nextTab: 'btnCancelarFip',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        //plugin para expandir las filas del grid donde se muestran las fechas	
        _this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p><b>Detalles:</b> {comentario}</p><br>'
                    )
        });

        //Store del grid donde se muestran las fechas
        _this.stGCmpfechacontrol = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: '/planificacion/pdo/plan/index.php/cmpfechacontrol/cargarfechascontrol',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.idelemento = _this.idelemento;
                },
                load: function(store, record, options) {
                    if (contFechas == 1) {
                        _this.arrayIniFechas = _this.ObtenerFechasControlDesdeCliente();
                        contFechas++;
                    } else {
                        _this.arrayTempFechas = _this.ObtenerFechasControlDesdeCliente();
                        _this.modificarFechas = !_this.compararArray(_this.arrayIniFechas, _this.arrayTempFechas);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'fechacontrol',
                root: "data"
            }, [{
                    name: 'fechacontrol'
                }, {
                    name: 'nombreautor'
                }, {
                    name: 'fechacreacion'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'comentario'
                }
            ])
        });

        //modo de seleccion del grid donde se muestran las fechas
        _this.smGCmpfechacontrol = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function(sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });

        //grid donde se muestran las fechas de control
        _this.gCmpCmpfechacontrol = new Ext.grid.GridPanel({
            frame: true,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            store: _this.stGCmpfechacontrol,
            sm: _this.smGCmpfechacontrol,
            plugins: _this.expander,
            loadMask: {
                msg: 'Cargando fechas de control'
            },
            columns: [_this.expander,
                _this.smGCmpfechacontrol,
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idfechas'
                }, {
                    id: 'expandir',
                    header: 'Fecha de control',
                    width: 150,
                    dataIndex: 'fechacontrol',
                    sortable: true
                }, {
                    header: 'Autor',
                    width: 150,
                    dataIndex: 'nombreautor',
                    sortable: true
                }, {
                    header: 'Creado el',
                    width: 150,
                    dataIndex: 'fechacreacion',
                    sortable: true
                }
            ],
            listeners: {
                'beforerender': function(e) {
                    _this.modificarFechas = false;
                    _this.arrayTempFechas = [];
                    _this.arrayIniFechas = [];
                    contFechas = 1;
                }
            }
        });

        //panel donde s emuestra el grid para las fechas de control
        _this.pfechascontrol = new Ext.Panel({
            title: 'Fechas de control',
            layout: 'fit',
            usarKeymap: true,
            botonesKeymap: [_this.btnAdicionar, _this.btnEliminar],
            tbar: [_this.btnAdicionar, /*_this.btnModificar,*/ ' ', _this.btnEliminar],
            items: [_this.gCmpCmpfechacontrol]
        });
        _this.pfechascontrol.addListener('activate', function() {
            if (estamodificando) {
                _this.stGCmpfechacontrol.load();
                cargaefectuada = 1;
            }
        });

        if (accion == 'adicionarfechas') {
            _this.stGCmpfechacontrol.load();
            cargaefectuada = 1;
        }

        return _this.pfechascontrol;
    };

    this.compararArray = function(arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i] == arrayTemp[j]) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                } else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };

    //funcion que se encarga de construir la ventana con el formulario para adicionar las fechas de control
    this.ConstruirWinCrudfechascontrol = function() {
        if (_this.WinCrudfechascontrol) {
            _this.WinCrudfechascontrol.destroy();
        }
        //campo para la fecha de control del fip
        _this.fcontrol = new Ext.form.DateField({
            fieldLabel: 'Fecha de control',
            id: 'dffechacontrol',
            format: 'd/m/Y',
            prevTab: 'btnacepfech',
            allowBlank: false,
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '35%',
            startDateField: ['femifip'],
            minText: 'La fecha de control tiene que ser posterior o igual a la fecha de emisión.',
        });

        //editor html para el comentario de la fecha de control
        _this.comentariofechacontrol = new Ext.form.HtmlEditor({
            fieldLabel: 'Comentario',
            height: 245,
            id: 'hcomentario',
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

        //formulario con atributos de la fecha de control
        _this.fpCrudfechascontrol = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idfechas"
            }, [{
                    name: 'idfechas'
                }, {
                    name: 'fechaentrega'
                }, {
                    name: 'comentario'
                }]
                    ),
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.fcontrol, _this.idelemhidden, _this.comentariofechacontrol]
                        }]
                }]
        });
        //ventana donde muestro el formulario para adicionar las fechas
        _this.WinCrudfechascontrol = new Ext.Window({
            title: 'Adicionar fechas de control',
            modal: true,
            constrain: true,
            closeAction: 'destroy',
            layout: 'fit',
            width: 620,
            height: 400,
            items: [_this.fpCrudfechascontrol],
            listeners: {
                destroy: function(win) {
                    if (_this.estamodificandofip) {
                        _this.stGCmpfechacontrol.load();
                    }
                }
            },
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'btncancelarfech',
                    prevTab: '',
                    nextTab: (_this.estamodificandofip) ? 'btnacepfech' : 'btnaplfech',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function() {
                        _this.WinCrudfechascontrol.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    prevTab: 'btncancelarfech',
                    nextTab: 'btnacepfech',
                    id: 'btnaplfech',
                    tooltip: 'Guardar datos y limpiar los campos',
                    handler: function() {
                        _this.CrudFechasControl(aplicar = 1);
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    id: 'btnacepfech',
                    prevTab: (_this.estamodificandofip) ? 'btncancelarfech' : 'btnaplfech',
                    nextTab: 'dffechacontrol',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function() {
                        _this.CrudFechasControl(aplicar = 0);
                    }
                }
            ]
        });
        _this.WinCrudfechascontrol.show();
        _this.fcontrol.focus(false, 1024);
    };
    //funcion que se encarga de adicionar las fechas de control
    this.CrudFechasControl = function(aplicar) {
        if (_this.fpCrudfechascontrol.getForm().isValid()) {
            var procede = 1;
            if (procede == 1) {
                _this.BarraProgreso.show('Adicionando fecha de control');
                if (!_this.estamodificandofip) {
                    _this.CrudFechaControlDesdeCliente();
                } else {
                    _this.fpCrudfechascontrol.getForm().submit({
                        url: '/planificacion/pdo/plan/index.php/cmpfechacontrol/adicionarfechascontrol',
                        params: {
                            idelemento: _this.idelemento
                        },
                        failure: function(form, action) {
                            _this.BarraProgreso.hide();
                            if (action.result.mensaje == 1) {
                                mostrarMensaje(1, 'La fecha de control ha sido adicionada satisfactoriamente.');
                                if (aplicar) {
                                    _this.fcontrol.focus(false, 1024);
                                    _this.LimpiarFormulario();
                                } else {
                                    _this.WinCrudfechascontrol.destroy();
                                }
                            } else if (action.result.mensaje == 3) {
                                mostrarMensaje(1, 'El FIP al cual usted quiere adicionarle una fecha de control ya no se encuentra en los registros.', function() {
                                    _this.WinCrudfechascontrol.destroy();
                                    _this.AccionPostGestionarFechasControl(action.result.mensaje);
                                }
                                );
                            } else if (action.result.mensaje == 2) {
                                mostrarMensaje(1, 'Ya existe una fecha de control para ese d&iacute;a.');
                            }
                        }
                    });
                }
            } else
                mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
        } else
            mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
    };
    //funcion para eliminar fechas de control
    this.EliminarFechasControl = function() {
        var arrayfechascontroleleccionadas = _this.smGCmpfechacontrol.getSelections();
        var mensajefechacontrol = '', mensajemascarafechacontrol = '', mensajeinformacion = '';
        if (arrayfechascontroleleccionadas.length > 1) {
            mensajefechacontrol = '¿Está seguro que quiere eliminar las fechas de control seccionadas?';
            mensajemascarafechacontrol = 'Eliminando fechas de control';
            mensajeinformacion = 'Las fechas de control han sido eliminadas satisfactoriamente.';
        } else {
            mensajefechacontrol = '¿Está seguro que quiere eliminar la fecha de control seccionada?';
            mensajemascarafechacontrol = 'Eliminando fecha de control';
            mensajeinformacion = 'La fecha de control ha sido eliminada satisfactoriamente.';
        }
        mostrarMensaje(2, mensajefechacontrol, function(btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascarafechacontrol);
                if (_this.estamodificandofip == 0) {
                    if (arrayfechascontroleleccionadas.length > 0) {
                        for (var i = 0; i < arrayfechascontroleleccionadas.length; i++) {
                            _this.stGCmpfechacontrol.remove(arrayfechascontroleleccionadas[i]);
                        }
                    }
                    _this.BarraProgreso.hide();
                    mostrarMensaje(1, mensajeinformacion);
                    _this.ActualizarEstadoBarraHerramientas();
                } else {
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpfechacontrol/eliminarfechascontrol',
                        params: {
                            idelemento: _this.idelemento,
                            arrayidfechascontrol: Ext.encode(_this.arrayidfechascontrol)
                        },
                        callback: function(options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'El FIP al cual usted quiere eliminarle las fechas de control ya no se encuentra en los registros.', function() {
                                    _this.AccionPostGestionarFechasControl(responseData.mensaje);
                                });
                            }
                            if (responseData.mensaje == 1) {
                                var mensajeinformacion3 = '';
                                if (_this.arrayidfechascontrol.length > 1)
                                    mensajeinformacion3 = 'Las fechas de control han sido eliminadas satisfactoriamente.';
                                else
                                    mensajeinformacion3 = 'La fecha de control ha sido eliminada satisfactoriamente.';
                                mostrarMensaje(1, mensajeinformacion3);
                                _this.stGCmpfechacontrol.load();
                            }
                            if (responseData.mensaje == 2) {
                                mensajeinformacion = 'Algunas de las fechas de control que usted trat&oacute; de eliminar no se encontraban en el registro. El resto fueron eliminadas satisfactoriamente.';
                                mostrarMensaje(1, mensajeinformacion);
                                _this.stGCmpfechacontrol.load();
                            }
                            if (responseData.mensaje == 3) {
                                var mensajeinformacion2 = '';
                                if (_this.arrayidfechascontrol.length > 1)
                                    mensajeinformacion2 = 'Las fechas de control que usted quiere eliminar ya no se encuentran en los registros.';
                                else
                                    mensajeinformacion2 = 'La fecha de control que usted quiere eliminar ya no se encuentra en los registros.';
                                mostrarMensaje(1, mensajeinformacion2);
                                _this.stGCmpfechacontrol.load();
                            }
                        }
                    });
                }
            }
        });
    };

    //funcion que se encarga de actualizar el estado de los botones de la barra de herramientas
    this.ActualizarEstadoBarraHerramientas = function() {
        _this.arrayidfechascontrol = [];
        _this.btnEliminar.disable();
        if (_this.smGCmpfechacontrol.hasSelection()) {
            var arrayrecords = _this.smGCmpfechacontrol.getSelections();
            var totalrecords = arrayrecords.length;
            var puedeeliminar = 1;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidfechascontrol[i] = arrayrecords[i].data.fechacontrol;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                }
            }
        }
    };
    //funcion para adicionar fechas de control a nivel de interfaz del cliente
    this.CrudFechaControlDesdeCliente = function() {
        var fechacontrol = _this.ConvertirFecha(_this.fcontrol.getValue());
        procede = _this.VerificarDuplicidadFechaControlDesdeCliente(fechacontrol);
        if (procede) {
            var arrayfechascontrolexistentes = [];
            arrayfechascontrolexistentes = _this.stGCmpfechacontrol.getRange();
            var FechasControlRecord = Ext.data.Record.create([
                {
                    name: 'fechacontrol'
                }, {
                    name: 'nombreautor'
                }, {
                    name: 'comentario'
                }, {
                    name: 'fechacreacion'
                }, {
                    name: 'eliminar'
                }
            ]);
            var nuevorecord = new FechasControlRecord({
                fechacontrol: fechacontrol,
                nombreautor: 'Usted',
                comentario: _this.comentariofechacontrol.getValue(),
                fechacreacion: _this.ConvertirFecha(new Date()),
                eliminar: 1
            });
            arrayfechascontrolexistentes.push(nuevorecord);
            _this.stGCmpfechacontrol.removeAll();
            _this.stGCmpfechacontrol.add(arrayfechascontrolexistentes);
            _this.BarraProgreso.hide();
            mostrarMensaje(1, 'La fecha de control ha sido adicionada satisfactoriamente.');
            if (!aplicar) {
                _this.WinCrudfechascontrol.destroy();
            } else {
                _this.LimpiarFormulario();
            }
        } else {
            mostrarMensaje(1, 'Ya existe una fecha de control para ese d&iacute;a.');
            _this.BarraProgreso.hide();
        }
    };

    //funcion para obtener el listado de fechas de control del grid
    this.ObtenerFechasControlDesdeCliente = function() {
        var arrayfechascontrol = [];
        var fechascontrolexistentes = _this.stGCmpfechacontrol.getRange();
        if (fechascontrolexistentes.length > 0) {
            for (var i = 0; i < fechascontrolexistentes.length; i++) {
                var fechacontrol = {};
                fechacontrol = {
                    fechacontrol: fechascontrolexistentes[i].data.fechacontrol,
                    comentario: fechascontrolexistentes[i].data.comentario
                };
                arrayfechascontrol.push(fechacontrol);
            }
        }
        return arrayfechascontrol;
    };

    //funcion para verificar si existe ya una fecha de control desde el cliente
    this.VerificarDuplicidadFechaControlDesdeCliente = function(fechacontrol) {
        var procede = 1;
        var arrayfechascontrolexistentes = _this.stGCmpfechacontrol.getRange();
        if (arrayfechascontrolexistentes.length > 0) {
            for (var i = 0; i < arrayfechascontrolexistentes.length; i++) {
                if (fechacontrol == arrayfechascontrolexistentes[i].data.fechacontrol) {
                    procede = 0;
                    break;
                }
            }
        }
        return procede;
    };
    //funcion para limpiar el formulario al aplicar
    this.LimpiarFormulario = function() {
        //_this.stGCmpfechacontrol.removeAll();
        _this.fcontrol.reset();
        _this.comentariofechacontrol.reset();

    };

    this.obtenerGridFechasDeControl = function() {
        return _this.gCmpCmpfechacontrol;

    };
    //funcion para convertir las fechas con formato largo a dd/mm/YY
    this.ConvertirFecha = function(fecha) {
        var fechafinal = ((fecha.getDate('') < 9) ? '0' + fecha.getDate('') : fecha.getDate('')) + " / " + (((fecha.getMonth('mm') + 1) < 9) ? '0' + (fecha.getMonth('mm') + 1) : (fecha.getMonth('mm') + 1)) + " / " + fecha.getFullYear();
        return fechafinal;
    }
};
