Utilidades.Cmp.Cmpcrudproyecto = function() {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.arrayidelementos = [];

    this.BarraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudproyecto = function(accion, tipo, PostAccionesGestionar, arrayidelementos, idEstructura) {

        this.estamodificando = 0;
        this.arrayidelementos = arrayidelementos;
        if (accion == 'Modificar') {
            _this.estamodificando = 1;
        }
        var readOnly = false;
        if (accion == 'Ver datos de') {
            readOnly = true;
        }
        var propertyPlantilla = false;
        if (tipo == 'plantilla') {
            propertyPlantilla = true;
        }
        //campo para la denominacion del proyecto
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            readOnly: readOnly,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áÃƒÂ©ÃƒÂ­óúÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ñÃƒâ€˜ÃƒÅ“"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'btnacep',
            allowBlank: false,
            anchor: '100%',
            style: {textTransform: 'uppercase'},
            listeners: {}
        });
        //campo para la descripcion del proyecto
        this.hedescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'Descripción',
            id: 'hedescripcion',
            readOnly: readOnly,
            width: 640,
            height: 140,
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
                    title: 'HipervÃƒÂ­nculo',
                    text: 'Hace del texto seleccionado un hipervÃƒÂ­nculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            }
        });
        //campo para la identificacion del proyecto
        this.identificacion = new Ext.form.TextField({
            id: 'identificacion',
            fieldLabel: 'Identificación',
            allowBlank: false,
            maxLength: 10,
            maxLengthText: 'El tamaño máximo requerido es 10 caracteres.',
            readOnly: readOnly,
            anchor: '100%',
            listeners: {}
        });
        //campo para la duracion del proyecto
        /*this.duracionEstimadaXX = new Ext.form.NumberField({
         fieldLabel: 'Duración estimada',
         id: 'duracionE',
         maxValue: 1000,
         maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
         readOnly: readOnly,
         allowNegative: false,
         value: 1,
         anchor: '95%',
         listeners: {}
         });*/

        //campos para la duracion de la tarea
        this.duracionEstimadaDias = new Ext.form.NumberField({
            fieldLabel: 'D&iacute;as',
            id: 'duracionEstimadaDias',
            maxValue: 1000,
            //width: 40,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 30,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimadaHoras = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            id: 'duracionEstimadaHoras',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            //width: 40,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimadaMinutos = new Ext.form.NumberField({
            fieldLabel: 'Min',
            id: 'duracionEstimadaMinutos',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            // width: 40,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimada = new Ext.form.FieldSet({
            title: 'Duración estimada:',
            height: 88,
            anchor: '95%',
            items: [{
                    layout: 'column', items: [{
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.duracionEstimadaDias]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.duracionEstimadaHoras]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.duracionEstimadaMinutos]
                        }]
                }]
        });
        //campo para la duracion del proyecto
        this.duracionReal = new Ext.form.NumberField({
            fieldLabel: 'Duración real',
            id: 'duracionR',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 0,
            anchor: '95%',
            listeners: {}
        });
        //store del combo para la prioridad del proyecto
        this.stCmbPrioridad = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarPrioridad',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.tiponom = 19;
                }
            },
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idnomenclador',
                root: "data"
            }, [{
                    name: 'idprioridad'
                }, {
                    name: 'denominacion'
                }])
        });
        //combo para la prioridad del proyecto
        this.cmbPrioridad = new Ext.form.ComboBox({
            id: 'cmbPrioridad',
            emptyText: 'Seleccione',
            fieldLabel: 'Prioridad',
            store: _this.stCmbPrioridad,
            hiddenName: 'idprioridad',
            valueField: 'idprioridad',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            readOnly: readOnly,
            editable: false,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '100%',
            listeners: {}
        });
        //store del combo categoria del proyecto
        this.stCmbCategorias = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarNomenclador',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.tiponom = 14;
                }
            },
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idnomenclador',
                root: "data"
            }, [{
                    name: 'idnomenclador'
                }, {
                    name: 'denominacion'
                }])
        });
        //combo categoria del proyecto
        this.cmbcategoria = new Ext.form.ComboBox({
            id: 'cmbcategoria',
            emptyText: 'Seleccione',
            fieldLabel: 'Categoría del proyecto',
            store: _this.stCmbCategorias,
            hiddenName: 'idnomenclador',
            valueField: 'idnomenclador',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            readOnly: readOnly,
            editable: false,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '100%',
            listeners: {}
        });
        //campo para la fecha de inicio del proyecto
        this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'fini',
            endDateField: 'ffin',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            blankText: 'Este campo es obligatorio.',
            readOnly: readOnly,
            hideTrigger: readOnly,
            enableKeyEvents: true,
            format: 'd/m/Y',
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '95%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    if (date > _this.ffin.getValue()) {
                        _this.ffin.setValue(date);
                    }
                }
            }
        });
        //campo para la fecha de fin del proyecto
        this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffin',
            startDateField: 'fini',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            format: 'd/m/Y',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            blankText: 'Este campo es obligatorio.',
            readOnly: readOnly,
            hideTrigger: readOnly,
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '100%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                }
            }
        });
        //campo para el estado de cumplimiento del proyecto
        this.estadoCumpl = new Ext.form.TextField({
            id: 'estadoCumpl',
            fieldLabel: 'Estado de cumplimiento',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '95%'
        });
        //campo para el grado de cumplimientode del proyecto
        this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocump',
            maxValue: 100,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            readOnly: true,
            disabled: propertyPlantilla,
            allowNegative: false,
            value: 0,
            anchor: '95%',
            listeners: {}
        });
        //this.tpCompartirProyecto = new Ext.TabPanel({
        //    activeTab: 0,
        //    border: false,
        //    region: 'center',
        //    items: []
        //});

        //texto donde muestro el autor del plan
        this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        if (accion == 'Adicionar') {
            this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolProyecto(
                    null, 8, _this.estamodificando, null);
        } else {
            this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolProyecto(
                    _this.arrayidelementos[0].id, 8, _this.estamodificando, _this.arrayidelementos[0].idautor);
        }

        this.fpCrudProyecto = new Ext.FormPanel({
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
                            layout: 'fit',
                            items: [{
                                    xtype: 'panel',
                                    border: false,
                                    bodyBorder: false,
                                    width: 400,
                                    height: 500,
                                    items: [
                                        {
                                            layout: 'column',
                                            items: [
                                                {
                                                    columnWidth: 1,
                                                    layout: 'form',
                                                    items: [_this.identificacion]
                                                }/*, {
                                                 columnWidth: 0.2,
                                                 layout: 'form',
                                                 items: [_this.duracionEstimada]
                                                 }, {
                                                 columnWidth: 0.2,
                                                 layout: 'form',
                                                 items: [_this.duracionReal]
                                                 }*/]
                                        }, {
                                            layout: 'column',
                                            items: [
                                                {
                                                    columnWidth: 0.33,
                                                    layout: 'form',
                                                    //items: [_this.fini, _this.ffin]
                                                    items: [_this.duracionEstimada, _this.duracionReal]
                                                }, {
                                                    columnWidth: 0.33,
                                                    layout: 'form',
                                                    items: [_this.fini, _this.estadoCumpl, _this.porcientocump]
                                                }, {
                                                    columnWidth: 0.33,
                                                    layout: 'form',
                                                    items: [_this.ffin, _this.cmbcategoria, _this.cmbPrioridad]
                                                }]
                                        }, {
                                            layout: 'column',
                                            items: [
                                                {
                                                    columnWidth: 1,
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'tabpanel',
                                                            activeTab: 0,
                                                            height: 240,
                                                            items: [
                                                                {
                                                                    xtype: 'panel',
                                                                    title: 'Descripci&oacute;n',
                                                                    layout: 'fit',
                                                                    items: [_this.hedescripcion]
                                                                }, _this.pclasificadorinvol
                                                                        /*, {
                                                                         xtype: 'panel',
                                                                         title: 'Contenidos asociados',
                                                                         id: 'contenidos',
                                                                         layout: 'fit'
                                                                         // items: []
                                                                         },*/]
                                                        }]
                                                }, {
                                                    columnWidth: 1,
                                                    layout: 'form',
                                                    bodyStyle: 'padding:5px 5px',
                                                    items: [_this.lfautor]
                                                }]
                                        }]
                                }]
                        }]
                }]
        });
        this.btnAplicarCrudProyecto = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: (accion == 'Modificar' || accion == 'Ver datos de' || accion == 'Duplicar'),
            id: 'btnplic',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function() {
                _this.adicionar(accion, 1, tipo, PostAccionesGestionar, arrayidelementos, idEstructura);
            }
        });
        this.btnAceptarCrudProyecto = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnacep',
            nextTab: 'tfdenominacion',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function() {
                _this.adicionar(accion, 0, tipo, PostAccionesGestionar, arrayidelementos, idEstructura);
            }
        });
        if (_this.winCrudProyecto) {
            _this.winCrudProyecto.destroy();
        }
        this.winCrudProyecto = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' ' + tipo,
            width: 700,
            height: 540,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    id: 'btncanc',
                    handler: function() {
                        _this.winCrudProyecto.destroy();
                        //PostAccionesGestionar()
                    }
                }, {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    hidden: true,
                    id: 'btncerr',
                    handler: function() {
                        _this.winCrudProyecto.destroy();
                    }
                }, _this.btnAplicarCrudProyecto,
                _this.btnAceptarCrudProyecto
            ],
            items: _this.fpCrudProyecto
        });
        _this.winCrudProyecto.doLayout();
        _this.winCrudProyecto.show();

        this.cargarDatosDesdeCliente = function(arrayidelementos) {
            _this.BarraProgreso.show('Cargando datos...');
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarFormElemento',
                params: {
                    idelemento: arrayidelementos[0].id,
                    tipo: arrayidelementos[0].tipo,
                    plantilla: arrayidelementos[0].plantilla
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 0) {
                        /*  _this.BarraProgreso.hide();
                         mostrarMensaje(1, 'La actividad ' + accionejecutada + ' ya no se encuentra en los registros.');
                         _this.winCrudProyecto.destroy();
                         PostAccionesGestionar();*/
                    } else {
                        _this.BarraProgreso.hide();
                        var titulo = _this.winCrudProyecto.title + '  -  ' + 'CAR: ' + responseData.data[0].idelemento;
                        _this.winCrudProyecto.setTitle(titulo);
                        if (arrayidelementos[0].plantilla != 1) {
                            _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                            _this.estadoCumpl.setValue(responseData.data[0].estadocumplimiento);
                            _this.fini.setValue(responseData.data[0].fechainicio);
                            _this.ffin.setValue(responseData.data[0].fechafin);
                        }
                        _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                        //_this.duracionEstimada.setValue(responseData.data[0].duracionestimada);
                        _this.duracionEstimadaDias.setValue(responseData.data[0].dias);
                        _this.duracionEstimadaHoras.setValue(responseData.data[0].horas);
                        _this.duracionEstimadaMinutos.setValue(responseData.data[0].minutos);
                        _this.duracionReal.setValue(responseData.data[0].duracionreal);
                        _this.hedescripcion.setValue(responseData.data[0].descripcion);
                        _this.identificacion.setValue(responseData.data[0].identificador);
                        _this.cmbcategoria.setValue(responseData.data[0].categoria.idnomenclador);
                        _this.cmbcategoria.setRawValue(responseData.data[0].categoria.denominacion);

                        _this.cmbPrioridad.setValue(responseData.data[0].prioridad.idprioridad);
                        _this.cmbPrioridad.setRawValue(responseData.data[0].prioridad.denominacion);

                        _this.objclasificadorinvol.stGInvolucrados.reload({
                            params: {
                                idelemento: arrayidelementos[0].id,
                                idtipoelemento: 8
                            }
                        });
                    }
                }
            });
        };

        switch (accion) {
            case 'Adicionar':
                /*_this.cbtiporepeticiones.enable();
                 _this.btnCancelarCrudAct.setVisible(true);
                 _this.btnAceptarCrudAct.setVisible(true);
                 
                 _this.objclasificadorinvol.cargarInvolConfPerfil(3);*/
                break;
            case 'Ver datos de':
                Ext.getCmp('btncerr').show();
                Ext.getCmp('btncanc').hide();
                _this.btnAceptarCrudProyecto.hide();
                _this.objclasificadorinvol.tpinvolucrados.disable();
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
            default:
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
        }

    };

    //funcion donde procedo a adicionar y modificar el proyecto/plantilla
    this.adicionar = function(accion, aplicar, tipo, PostAccionesGestionar, arrayidelementos, idEstructura, verificarInvol) {
        url = 'adicionarProyecto';
        postaccionId = 'adicionar';
        if (tipo == 'plantilla') {
            var plantilla = 1;
            waitMsg = 'Guardando datos de la plantilla...';
            postaccion = 'adicionada';
        } else {
            plantilla = 0;
            waitMsg = 'Guardando datos del proyecto...';
            postaccion = 'adicionado';
        }
        if (accion == 'Modificar') {
            url = 'modificarElemento';
            if (tipo == 'plantilla') {
                postaccion = 'modificada';
            } else {
                postaccion = 'modificado';
            }
        }
        if (accion == 'Duplicar') {
            url = 'duplicarProyecto';
            postaccionId = 'duplicar';
            waitMsg = 'Duplicando datos del proyecto...';
            if (tipo == 'plantilla') {
                waitMsg = 'Duplicando datos de la plantilla...';
                postaccion = 'duplicada';
            } else {
                postaccion = 'duplicado';
            }
        }

        btnaplicar = false;
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();

        var duracionEstimada = (_this.duracionEstimadaDias.getValue() * 24) + _this.duracionEstimadaHoras.getValue() + (_this.duracionEstimadaMinutos.getValue() / 60);
        var verificartiempoInvol = (!verificarInvol && arrayinvolucrados.length > 0) ? 1 : 0;

        _this.BarraProgreso.show(waitMsg);
        _this.fpCrudProyecto.getForm().submit({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/' + url,
            params: {
                plantilla: plantilla,
                duracionE: duracionEstimada,
                idelemento: (arrayidelementos == undefined) ? null : arrayidelementos[0].id,
                tipo: (arrayidelementos == undefined) ? null : arrayidelementos[0].tipo,
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                idEstructura: idEstructura,
                verificartiempoinvol: verificartiempoInvol
            },
            failure: function(form, action) {
                _this.BarraProgreso.hide();
                if (action.result.mensaje.mensaje == 5) {
                    var arrayInvol = action.result.mensaje.involucrados;
                    var fechafinact = action.result.mensaje.fechafinact;
                    var msj = 'En el proyecto ' + postaccion + ' existe(n) conflicto(s) entre la fecha de fin del proyecto (<b>' + fechafinact + '</b>) ' +
                            'y el fondo de tiempo planificado para el(los) siguiente(s) involucrado(s):<br /><br />';
                    for (var invol in arrayInvol) {
                        if (arrayInvol.hasOwnProperty(invol)) {
                            if (arrayInvol[invol].nombreapellidos != '') {
                                msj += '<b>Nombre: </b>' + arrayInvol[invol].nombreapellidos + ' ---- <b>Según fondo de tiempo planificado: </b>' + arrayInvol[invol].fechafin + '<br />';
                            } else {
                                msj += '<b>Usuario: </b>' + arrayInvol[invol].usuario + ' ---- <b>Según fondo de tiempo planificado: </b>' + arrayInvol[invol].fechafin + '<br />';
                            }

                        }
                    }
                    msj += '<br />Ã‚Â¿Desea ignorar la advertencia?'
                    mostrarMensaje(2, msj, function(btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.adicionar(accion, aplicar, tipo, PostAccionesGestionar, arrayidelementos, idEstructura, verificarInvol = 1);
                        } else {
                        }
                    });

                }
                if (action.result.mensaje == 1) {
                    if (tipo == 'plantilla') {
                        mostrarMensaje(1, 'La plantilla ha sido ' + postaccion + ' satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'El proyecto ha sido ' + postaccion + ' satisfactoriamente.');
                    }
                    if (aplicar == 0) {
                        _this.winCrudProyecto.destroy();
                        PostAccionesGestionar(action.result.mensaje, accion, tipo);
                    } else {
                        _this.fpCrudProyecto.getForm().reset();
                    }
                }
                if (action.result.mensaje == 0) {
                    if (accion == 'Modificar') {
                        if (tipo == 'plantilla') {
                            if (action.result.identificador == 'existe') {
                                mostrarMensaje(1, 'El identificador de la planilla que quiere modificar ya existe');
                                _this.identificacion.focus();
                            } else {
                                mostrarMensaje(1, 'La plantilla que quiere modificar ya existe.');
                            }
                        } else {
                            mostrarMensaje(1, 'El proyecto que quiere modificar ya existe.');
                        }
                    } else {
                        //accion == Adicionar
                        if (tipo == 'plantilla') {
                            if (action.result.identificador == 'existe') {
                                mostrarMensaje(1, 'El identificador de la planilla que quiere  ' + postaccionId + '  ya existe');
                                _this.identificacion.focus();
                            } else {
                                mostrarMensaje(1, 'La plantilla que quiere adicionar ya existe.');
                            }
                        } else {
                            if (action.result.identificador == 'existe') {
                                mostrarMensaje(1, 'El identificador del proyecto que quiere  ' + postaccionId + '  ya existe');
                                _this.identificacion.focus();
                            } else {
                                mostrarMensaje(1, 'El proyecto que quiere adicionar ya existe.');
                            }
                        }
                    }
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
                if (action.result.mensaje == 2) {
                    if (tipo == 'plantilla') {
                        mostrarMensaje(1, 'La plantilla que usted quiere modificar ya no se encuentra en los registros.');
                    } else {
                        mostrarMensaje(1, 'El proyecto que usted quiere modificar ya no se encuentra en los registros.');
                    }
                    _this.winCrudProyecto.destroy();
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
            }
        });
    };
};
