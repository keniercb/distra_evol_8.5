Utilidades.Cmp.Cmpcrudejercicio = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idEstructura = null;
    this.PostAccionesGestionar = null;
    this.idEjercicio = null;
    this.denomEjercicio = null;
    this.descEjercicio = null;
    this.accion = null;
    this.arrayidelementos = [];


    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();


    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudejercicio = function (accion, idEstructura, PostAccionesGestionar, idEjercicio, denomEjercicio, descEjercicio) {

        _this.idEstructura = idEstructura;
        _this.idEjercicio = idEjercicio;
        _this.denomEjercicio = denomEjercicio;
        _this.descEjercicio = descEjercicio;
        _this.accion = accion;
        _this.PostAccionesGestionar = PostAccionesGestionar;

        this.estamodificando = 0;
        if (_this.accion == 'Modificar') {
            _this.estamodificando = 1;
        }

        var readOnly = false;

        //campo para la denominacion del ejercicio
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            readOnly: readOnly,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'btnacep',
            allowBlank: false,
            anchor: '100%',
            style: {textTransform: 'uppercase'}
        });

        //campo para la descripcion del ejercicio
        this.tfdescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'Descripción',
            id: 'tfdescripcion',
            readOnly: readOnly,
            listeners: {},
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

        //panel de la descripcion
        this.pEjercicioDescripcion = new Ext.Panel({
            title: 'Descripción',
            layout: 'fit',
            items: [_this.tfdescripcion]
        });

        //objeto plantilla
        this.objcmpPlantilla = new Utilidades.Cmp.Cmpgestionarplantilla(
            {
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarCerrarWinP: false,
                noUsarSeleccionarWinP: false,
                noUsarGestObser: true,
                noMostrarColumObser: true,
                reordenarHijos: false,
                nombrePanel: 'Registro de plantillas',
                nombreGrid: 'Registro de plantillas',
                msgMascara: 'Cargando plantillas...',
                noUsarAdicionar: true,
                noAutoload: false,
                singleSeleccion: false,
                tipoComponente: 'panel'
            });

        this.gridPlantillas = _this.objcmpPlantilla.CargarCmpPlantilla(null, null, null, null, null, null, null, _this.idEstructura);

        //panel de las plantillas
        this.pEjercicioPlantilla = new Ext.Panel({
            title: 'Registro de plantillas',
            layout: 'fit',
            id: 'pEjercicioPlantilla',
            items: [_this.gridPlantillas]
        });

        //tabpanel para adicionar/modificar ejercicio
        this.tpdatosejercicio = new Ext.TabPanel({
            height: 400,
            activeTab: 0,
            frame: true,
            items: [_this.pEjercicioDescripcion, _this.pEjercicioPlantilla]
        });

        this.fpCrudejercicio = new Ext.FormPanel({
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
                        items: [_this.tpdatosejercicio]
                    }]
            }]
        });

        this.btnAplicarCrudejercicio = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: (_this.accion == 'Modificar'),
            id: 'btnplic',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.adicionar(1);
            }
        });
        this.btnAceptarCrudejercicio = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnacep',
            nextTab: 'tfdenominacion',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.adicionar(0);
            }
        });
        if (_this.winCrudejercicio) {
            _this.winCrudejercicio.destroy();
        }
        this.winCrudejercicio = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: _this.accion + ' ejercicio',
            width: 700,
            height: 530,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                id: 'btncanc',
                handler: function () {
                    _this.winCrudejercicio.destroy();
                }
            }, {
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: true,
                id: 'btncerr',
                handler: function () {
                    _this.winCrudejercicio.destroy();
                }
            }, _this.btnAplicarCrudejercicio,
                _this.btnAceptarCrudejercicio
            ],
            items: _this.fpCrudejercicio
        });
        switch (_this.accion) {
            case 'Modificar':
                _this.tfdenominacion.setValue(_this.denomEjercicio);
                _this.tfdescripcion.setValue(_this.descEjercicio);
                break;
        }
        _this.winCrudejercicio.doLayout();
        _this.winCrudejercicio.show();
    };

//funcion donde procedo a adicionar y modificar un ejercicio
    this.adicionar = function (aplicar) {
        var smPlant = _this.objcmpPlantilla.smPlantilla;
        _this.arrayidelementos = [];
        _this.elementosseleccionados = [];
        if (smPlant.hasSelection()) {
            var arrayrecords = smPlant.getSelections();
            var totalrecords = arrayrecords.length;
            var idplantilla = arrayrecords[0].data.idplantilla;
            var adicionarBien = 1;
            if (totalrecords > 0) {
                accionMens = 'adicionar';
                if (_this.accion == 'Modificar')
                    accionMens = 'modificar';

                Ext.each(arrayrecords, function (r) {
                    if (r.data.idplantilla == idplantilla) {
                        _this.elementosseleccionados.push(r);
                        _this.arrayidelementos.push({
                            idelemento: r.data.idelemento,
                            tipo: r.data.tipoelemento,
                            hoja: r.data.hoja,
                            fechafin: r.data.fechafin,
                            fechainicio: r.data.fechainicio,
                            horainicio: r.data.horainicio,
                            horafin: r.data.horafin
                        });
                    }
                    else {
                        mostrarMensaje(1, 'El ejercicio no se ha podido ' + accionMens + ' debido a que sus elementos no pertenecen a una misma plantilla.');
                        adicionarBien = 0;
                        _this.elementosseleccionados = [];
                        _this.arrayidelementos = [];
                        return false;
                    }

                });
            }
        } else {
            _this.elementosseleccionados = [];
            _this.arrayidelementos = [];
        }

        if (adicionarBien != 0) {
            url = 'adicionarEjercicio';
            waitMsg = 'Guardando datos del ejercicio...';
            postaccion = 'adicionado';

            if (_this.accion == 'Modificar') {
                url = 'modificarEjercicio';
                waitMsg = 'Modificando datos del ejercicio...';
                postaccion = 'modificado';
            }

            _this.BarraProgreso.show(waitMsg);
            _this.fpCrudejercicio.getForm().submit({
                url: '/planificacion/proyecto/planeacion/index.php/cmpejercicio/' + url,
                params: {
                    identidad: _this.idEstructura,
                    idejercicio: _this.idEjercicio,
                    arrayElementos: Ext.encode(_this.arrayidelementos)
                },
                failure: function (form, action) {
                    _this.BarraProgreso.hide();
                    if (action.result.mensaje == 1) {
                        mostrarMensaje(1, 'El ejercicio ha sido ' + postaccion + ' satisfactoriamente.');
                        if (aplicar == 0) {
                            _this.winCrudejercicio.destroy();
                            _this.PostAccionesGestionar();

                        } else {
                            _this.fpCrudejercicio.getForm().reset();
                        }
                    }
                    if (action.result.mensaje == 0) {
                        if (_this.accion == 'Modificar') {
                            mostrarMensaje(1, 'El ejercicio que quiere modificar ya existe.');
                        } else {
                            mostrarMensaje(1, 'El ejercicio que quiere adicionar ya existe.');
                        }
                    }
                    if (action.result.mensaje == 2) {
                        mostrarMensaje(1, 'El ejercicio que usted quiere modificar ya no se encuentra en los registros.');
                        _this.winCrudejercicio.destroy();
                    }
                }
            });
        }
    };

};
