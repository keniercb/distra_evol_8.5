Utilidades.Cmp.Cmpcrudtarea = function (opcionesConfig) {
//
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.arrayidtarearep = [];
    this.arrayidelementos = [];
    this.arrayidactividades = [];
    this.primerconteo = 'no';
    this.opcionesConfig = opcionesConfig;
    this.prevrowrep = -1;
    this.contadorid = 0;
    this.radioChekiado = 1;
    var fechainitarea = '';
    var fechafintareamasundia = '';
    var contadorrepeticiones = 1;
    var arrayrepeticiones_ini = [];
    this.recursosDisable = false;
    this.permitirCalculo = false;
    this.equivalencia;

    this.BarraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente actividad---recurso
    this.objactivrecurso = new Utilidades.Cmp.Cmpcrudactividadrecurso();

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudtarea = function (accion, padre, PostAccionesGestionar, arrayidelementos, idautor, idEstructura) {

        //objeto del componente "relaciones"
        this.objRelaciones = new Utilidades.Cmp.Cmprelaciones();

        this.arrayidelementos = arrayidelementos;
        this.estamodificando = 0;
        this.idEstructura = idEstructura;
        this.padre = padre;
        _this.arrayRepeticiones = [];
        var propertyPlantilla = false;
        if (_this.padre.plantilla == 1) {
            propertyPlantilla = true;
        }
        if (accion == 'Modificar' || accion == 'Duplicar') {
            _this.estamodificando = 1;
        }
        var readOnly = false;
        if (accion == 'Ver datos de la') {
            _this.recursosDisable = true;
            readOnly = true;
        }

        if (_this.opcionesConfig.useCmbEvento != undefined) {
            this.stCmbEvento = new Ext.data.SimpleStore({
                fields: ['id', 'denominacion'],
                data: [
                    ['combustible', 'Combustible'],
                    ['catering', 'Catering'],
                    ['bombero', 'Bomberos'],
                    ['taller', 'Taller'],
                    ['descarga', 'Descarga'],
                    ['equipaje2', 'Equipaje']
                ]
            });

            this.CmbEvento = new Ext.form.ComboBox({
                fieldLabel: 'Evento Asociado',
                emptyText: "Seleccione...",
                loadingText: 'Cargando...',
                anchor: '95%',
                mode: 'local',
                triggerAction: 'all',
                typeAhead: true,
                store: _this.stCmbEvento,
                valueField: 'id',
                displayField: 'denominacion',
                id: 'CmbEvento',
                tpl: new Ext.XTemplate(
                    "<tpl for=\".\"><div class=\"x-combo-list-item\"><img src=\"/planificacion/inversionesproyecto/views/images/{id}.png\" style=\"height:40px; width:40px\">" +
                    "<div class=\"combotext\">{denominacion}</div></div></tpl>"),
                listeners: {
                    select: function (combo, record, index) {

                    }
                }
            });
        }


        //campo para la denominacion de la tarea
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            readOnly: readOnly,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9-Á-É-Í-Ó-ÚÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ÃƒÂ±Ãƒâ€˜ÃƒÅ“"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'btnacep',
            allowBlank: false,
            style: {textTransform: 'uppercase'},
            anchor: '100%'
        });
        //campo para la descripcion de la tarea
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
                    title: 'NumeraciÃƒÂ³n',
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
        //campos para la duracion de la tarea
        this.duracionEstimadaDias = new Ext.form.NumberField({
            fieldLabel: 'D&iacute;as',
            id: 'duracionEstimadaDias',
            maxValue: 1000,
            //width: 40,
            allowBlank: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 0,
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
            allowBlank: false,
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
            allowBlank: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimada = new Ext.form.FieldSet({
            title: 'Duración estimada:',
            height: 87,
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
        //campo para la duracion de la tarea
        this.duracionReal = new Ext.form.NumberField({
            fieldLabel: 'Duración real(horas)',
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
        this.unidadmedida = new Ext.form.TextField({
            fieldLabel: 'UM',
            id: 'unidadmedida',
            readOnly: readOnly,
            maxLength: 10,
            maxLengthText: 'El tamaño máximo requerido es de 10 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9ÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ÃƒÂ±Ãƒâ€˜ÃƒÅ“"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            anchor: '95%',
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {

                        //if (c.getValue() != '') {
                        //    _this.valormeta.enable();
                        //    _this.valorreal.enable();
                        //} else {
                        //    _this.valormeta.reset();
                        //    _this.valorreal.reset();
                        //    _this.valormeta.disable();
                        //    _this.valorreal.disable();
                        //
                        //}

                    }, c);
                }
            }
        });
        this.valormeta = new Ext.form.NumberField({
            fieldLabel: 'Valor Meta',
            id: 'valormeta',
            maxLength: 19,
            //maxText: 'Solo admite números enteros positivos hasta 19 cifras',
            readOnly: readOnly,
            allowNegative: false,
            allowDecimals: true,
            disabled: propertyPlantilla,
            allowBlank: true,
            value: 0,
            anchor: '95%',
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        //si es cero pongo cero en porcientocump
                        if (c.getValue() == 0 || (_this.valorreal.getValue() == 0 && c.getValue() == 0)) {
                            _this.porcientocump.setValue(0);
                        } else {
                            _this.porcientocump.setValue(parseInt(((_this.valorreal.getValue() * 100) / c.getValue())));
                        }
                    }, c);
                }
            }
        });
        this.valorreal = new Ext.form.NumberField({
            fieldLabel: 'Valor Real',
            id: 'valorreal',
            maxLength: 19,
            //maxText: 'Solo admite números enteros positivos entre 0 y 19.',
            readOnly: readOnly,
            allowNegative: false,
            allowDecimals: true,
            disabled: propertyPlantilla,
            allowBlank: true,
            value: 0,
            anchor: '95%',
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        //si es cero pongo cero en porcientocump
                        if (_this.valormeta.getValue() == 0 || (c.getValue() == 0 && _this.valormeta.getValue() == 0)) {
                            _this.porcientocump.setValue(0);
                        } else {
                            _this.porcientocump.setValue(parseInt(((c.getValue() * 100) / _this.valormeta.getValue())));
                        }
                    }, c);
                }
            }
        });
        //campo para el peso de la tarea
        this.peso = new Ext.form.NumberField({
            id: 'peso',
            fieldLabel: 'Peso',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 1,
            anchor: '95%',
            listeners: {}
        });
        //store del combo categoria de la tarea
        this.stCmbCategorias = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarNomenclador',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tiponom = 16;
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
        //combo categoria de la tarea
        this.cmbcategoria = new Ext.form.ComboBox({
            id: 'cmbcategoria',
            emptyText: 'Seleccione',
            fieldLabel: 'Categoría de la tarea',
            store: _this.stCmbCategorias,
            hiddenName: 'idnomenclador',
            valueField: 'idnomenclador',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            editable: false,
            readOnly: readOnly,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {}
        });
        this.sttipoTarea = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargartipoTarea',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tiponom = 17;
                }
            },
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipotarea',
                root: "data"
            }, [{
                name: 'idtipotarea'
            }, {
                name: 'denominacion'
            }])
        });
        //combo tipo de tarea
        this.cmbtipoTarea = new Ext.form.ComboBox({
            id: 'cmbtipoTarea',
            emptyText: 'Seleccione',
            fieldLabel: 'Tipo de tarea',
            store: _this.sttipoTarea,
            hiddenName: 'idtipotarea',
            valueField: 'idtipotarea',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            editable: false,
            readOnly: readOnly,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {}
        });
        //campo para la fecha de inicio de la tarea
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
                select: function (df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    if (date > _this.ffin.getValue()) {
                        _this.ffin.setValue(date);
                    }
                }
            }
        });
        //campo para la fecha de fin de la tarea
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
            anchor: '95%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                }
            }
        });

        //campo donde muestro la hora de inicio de la tarea
        this.tmfhoraini = new Ext.form.TimeField({
            fieldLabel: 'Hora de inicio',
            format: 'H:i:s',
            minValue: '00:00:00',
            maxValue: '23:59:00',
            increment: 15,
            readOnly: readOnly,
            value: '08:00:00',
            id: 'tmfhoraini',
            editable: true,
            emptyText: 'Seleccione',
            anchor: '95%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato: hh:mm am/pm.',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla
        });

        //campo donde muestro la hora de fin de la tarea
        _this.tmfhorafin = new Ext.form.TimeField({
            fieldLabel: 'Hora de fin',
            format: 'H:i:s',
            minValue: '00:00:00',
            maxValue: '23:59:00',
            increment: 15,
            readOnly: readOnly,
            value: '17:00:00',
            id: 'tmfhorafin',
            editable: true,
            emptyText: 'Seleccione',
            anchor: '95%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato: hh:mm am/pm.',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla
        });

        //store del combo evaluacion
        this.stcbcriterioeval = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarEval',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tiponom = 18;
                }
            },
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'ideval',
                root: "data"
            }, [{
                name: 'ideval'
            }, {
                name: 'denominacion'
            }])
        });
        //combo Criterio de evaluacion
        this.cbcriterioeval = new Ext.form.ComboBox({
            store: _this.stcbcriterioeval,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'ideval',
            valueField: 'ideval',
            emptyText: 'Seleccione',
            anchor: '100%',
            fieldLabel: 'Criterio de evaluación',
            disabled: propertyPlantilla,
            allowBlank: true,
            readOnly: readOnly,
            listeners: {}
        });
        //campo donde marco si la tarea es o no principal
        this.chprincipal = new Ext.form.Checkbox({
            boxLabel: 'Principal',
            checked: false,
            fieldLabel: '',
            labelSeparator: '',
            listeners: {}
        });
        this.chefectocadena = new Ext.form.Checkbox({
            boxLabel: 'Efecto cadena',
            checked: true,
            fieldLabel: '',
            labelSeparator: '',
            listeners: {}
        });

        //campo de texto donde muestro el lugar de la tarea
        this.tflugar = new Ext.form.TextField({
            fieldLabel: 'Lugar',
            id: 'tflugar',
            readOnly: readOnly,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9ÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ÃƒÂ±Ãƒâ€˜ÃƒÅ“"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            anchor: '95%',
            listeners: {}
        });
        //campo para el estado de cumplimiento de la tarea
        this.estadoCumpl = new Ext.form.TextField({
            id: 'estadoCumpl',
            fieldLabel: 'Estado de cumplimiento',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '100%'
        });
        //campo para el grado de cumplimientode la tarea
        this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocump',
            maxValue: 100,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            readOnly: false, //(arrayidelementos[0]._is_leaf) ? false : true,
            allowNegative: false,
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 0,
            anchor: '100%',
            listeners: {}
        });
        //texto donde muestro el autor de la tarea
        this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        this.costo = new Ext.form.NumberField({
            fieldLabel: 'Costo',
            id: 'costo',
            //maxValue: 1000,
            //width: 40,
            allowBlank: false,
            maxText: 'Solo admite números enteros positivos.',
            readOnly: readOnly,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });

        this.tfclave = new Ext.form.TextField({
            id: 'tfclave',
            fieldLabel: 'Clave',
            maxLength: 10,
            readOnly: readOnly,
            maxLengthText: 'El tamaño máximo requerido es 10 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9-Á-É-Í-Ó-ÚÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ÃƒÂ±Ãƒâ€˜ÃƒÅ“"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            //prevTab: 'btnacep',
            //allowBlank: false,
            style: {textTransform: 'uppercase'},
            anchor: '50%'
        });

        //panel donde muestro las relaciones
        this.prelaciones = _this.objRelaciones.CrearCmpRelaciones(_this.estamodificando, 10,
            _this.arrayidelementos[0].id, permiso = 1, PostAccionesGestionar, null,
            readOnly, _this.arrayidelementos[0].plantilla, _this.idEstructura);

        //panel donde muestro los recursos
        // id_tarea = _this.arrayidelementos[0].id
        this.panelactividadrecurso = _this.objactivrecurso.dosgrids(accion, _this.arrayidelementos[0].id, false,
            _this.estamodificando, _this.recursosDisable);
        _this.panelactividadrecurso.setTitle('Recursos');
        //_this.panelactividadrecurso.disable();        

        this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(
            _this.arrayidelementos[0].id, 10, _this.estamodificando, _this.arrayidelementos[0].idautor);
        //panel donde muestro los datos generales
        this.pdatosgenerales = new Ext.Panel({
            title: 'Datos generales',
            frame: true,
            id: 'pdatosgenerales',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.duracionEstimada, _this.duracionReal, _this.unidadmedida]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.fini, _this.ffin, _this.tflugar, _this.valormeta]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.tmfhoraini, _this.tmfhorafin, _this.peso, _this.valorreal]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.cmbcategoria, _this.cmbtipoTarea, _this.chprincipal, _this.costo]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.cbcriterioeval, _this.porcientocump, _this.chefectocadena, _this.tfclave]
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
                                    height: 200,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            title: 'Descripci&oacute;n',
                                            layout: 'fit',
                                            items: [_this.hedescripcion]
                                        }, _this.pclasificadorinvol, /* {
                                         xtype: 'panel',
                                         title: 'Contenidos asociados',
                                         id: 'contenidos',
                                         layout: 'fit'
                                         // items: []
                                         }*/]
                                }, {
                                    columnWidth: 1,
                                    layout: 'form',
                                    bodyStyle: 'padding:5px 5px',
                                    items: [_this.lfautor]
                                }]
                        }]
                }]
        });


        if (_this.opcionesConfig.useCmbEvento != undefined) {
            _this.pdatosgenerales.items.items[0].items.items[4].add(_this.CmbEvento);
            _this.pdatosgenerales.doLayout();
        }

        //store del combo de los tipos de repeticiones
        _this.stcbtiporepeticiones = new Ext.data.SimpleStore({
            fields: ['idrept', 'denominacion'],
            data: [
                [1, 'PeriÃƒÂ³dica'],
                [2, 'Aleatoria']
            ]
        });
        //combo de los tipos de repeticiones
        _this.cbtiporepeticiones = new Ext.form.ComboBox({
            store: _this.stcbtiporepeticiones,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            disabled: false,
            hiddenName: 'idrept',
            valueField: 'idrept',
            emptyText: 'Seleccione',
            anchor: '80%',
            listeners: {
                select: function (combo, record, index) {
                    _this.CrearWinCrudRepeticiones('Adicionar', _this.cbtiporepeticiones.getValue());
                    combo.setValue('');
                }
            }
        });
        //botones para gestionar repeticiones
        _this.btnAdicionarRepeticiones = new Ext.Button({
            text: 'Adicionar',
            disabled: true,
            hidden: true,
            handler: function () {
                //_this.CrearWunCrudRepeticiones('Adicionar', _this.cbtiporepeticiones.getValue(), horainicio, horafin);
            },
            iconCls: 'adicionar',
            tooltip: 'Adicionar repeticiones',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });
        _this.btnModificarRepeticiones = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.CrearWinCrudRepeticiones('Modificar', tipoRepetricion = 2);
            },
            iconCls: 'modificar',
            tooltip: 'Modificar repeticiones',
            key: {
                alt: true,
                key: 'M'
            },
            scope: this
        });
        _this.btnEliminarRepeticiones = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.EliminarRepeticiones();
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar repeticiones',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });
        _this.btnDuplicarRepeticiones = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.CrearWinCrudRepeticiones('Duplicar', tipoRepetricion = 2);
            },
            iconCls: 'duplicar',
            tooltip: 'Duplicar repetici&oacute;n',
            key: {
                alt: true,
                ctrl: true,
                key: 'D'
            },
            scope: this
        });
        //store del grid donde cargo las repeticiones
        _this.stggrepeticiones = new Ext.data.GroupingStore({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarRepeticionesTarea',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.limit = 15;
                    st.baseParams.idtarea = _this.arrayidelementos[0].id;
                    st.baseParams.idelementopadre = _this.padre.idelemento,
                        _this.stgginvolucradosrepeticion.removeAll();

                },
                load: function (st) {
                    if (_this.primerconteo == 'no') {
                        _this.primerconteo = _this.stggrepeticiones.getCount();
                    }
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                }
            },
            reader: reader = new Ext.data.JsonReader(
                {
                    id: 'idrepeticion',
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idrepeticion'
                }, {
                    name: 'idtarea'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'lugar'
                }, {
                    name: 'involucrados'
                }, {
                    name: 'modificar'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'superior'
                }, {
                    name: 'subordinado'
                }, {
                    name: 'estadocumplimiento'
                }, {
                    name: 'nombreautor'
                }, {
                    name: 'idautor'
                }, {
                    name: 'tiporepeticion'
                }, {
                    name: 'mes'
                }, {
                    name: 'numeroMes',
                    type: 'int'
                }
                ]),
            sortInfo: {
                field: 'numeroMes',
                direction: "ASC"
            },
            groupField: 'numeroMes',
            groupOnSort: true
        });
        //modo de seleccion del grid donde cargo las repeticiones
        _this.smggrepeticiones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (_this.prevrowrep >= 0 && _this.prevrowrep != indiceFila) {
                        Ext.get(_this.ggrepeticiones.getView().getRow(_this.prevrowrep)).removeClass('superior2');
                        Ext.get(_this.ggrepeticiones.getView().getRow(_this.prevrowrep)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.ggrepeticiones.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.ggrepeticiones.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrowrep = indiceFila;
                    } else
                        _this.prevrowrep = -1;
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                    //_this.CargarInvolucradosRepeticion(record, 'marcado');
                },
                rowdeselect: function (sm, indiceFila, record) {
                    if (_this.prevrowrep >= 0 && _this.prevrowrep != indiceFila) {
                        Ext.get(_this.ggrepeticiones.getView().getRow(_this.prevrowrep)).removeClass('superior2');
                        Ext.get(_this.ggrepeticiones.getView().getRow(_this.prevrowrep)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.ggrepeticiones.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.ggrepeticiones.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrowrep = indiceFila;
                    } else
                        _this.prevrowrep = -1;
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                    //_this.CargarInvolucradosRepeticion(record, 'desmarcado');
                }
            }
        });
        //barra de paginado del grid donde se cargan las repeticiones
        _this.pggrepeticiones = new Ext.PagingToolbar({
            pageSize: 15,
            store: _this.stggrepeticiones,
            displayInfo: true
        });
        //grid donde cargo las repeticiones
        _this.ggrepeticiones = new Ext.grid.GridPanel({
            region: 'center',
            listeners: {
                rowdblclick: function () {
                    //_this.CrearWunCrudRepeticiones('Modificar', 2, horainicio, horafin);
                }
            },
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando repeticiones de la tarea'
            },
            stripeRows: true,
            sm: _this.smggrepeticiones,
            store: _this.stggrepeticiones,
            columns: [_this.smggrepeticiones,
                {
                    header: "Fecha de inicio",
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechainicio'
                }, {
                    header: "Fecha de fin",
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechafin'
                }, {
                    id: 'expandir',
                    header: "Lugar",
                    width: 100,
                    sortable: true,
                    dataIndex: 'lugar'
                }, {
                    header: "Estado de cumplimiento",
                    renderer: MostrarImagenEstadoCumplimiento,
                    width: 165,
                    sortable: true,
                    dataIndex: 'estadocumplimiento'
                }, {
                    header: "Autor",
                    width: 80,
                    sortable: true,
                    dataIndex: 'nombreautor'
                }, {
                    header: "Mes",
                    hidden: true,
                    dataIndex: 'numeroMes',
                    renderer: function (a, b, r, ri, ci, ds) {
                        return r.get('mes');
                    }
                }
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "repeticiones" : "repetición"]})'
            }),
            height: 160,
            iconCls: 'icon-grid'
        });
        _this.ggrepeticiones.getView().getRowClass = function (ri, n) {
            if (ri.data.superior == 1)
                return "superior";
            else
                return "";
        };

        //store del grid donde muestro los involucrados de la repeticion
        _this.stgginvolucradosrepeticion = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado"
                }, [{
                    name: 'denominacion'
                }, {
                    name: 'idinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'nombretipo'
                }]
            ),
            sortInfo: {
                field: 'tipo',
                direction: "ASC"
            },
            groupField: 'nombretipo'
        });
        //grid donde muestro los involucrados de la repeticion
        _this.gginvolucradosrepeticion = new Ext.grid.GridPanel({
            title: 'Involucrados',
            region: 'south',
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando involucrados en la repetici&oacute;n'
            },
            stripeRows: true,
            store: _this.stgginvolucradosrepeticion,
            height: 150,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 350
                }, {
                    header: "Tipo",
                    hidden: true,
                    dataIndex: 'nombretipo'
                }
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "involucrados" : "involucrado"]})'
            })
        });
        _this.prepeticiones = new Ext.Panel(
            {
                title: 'Repeticiones',
                layout: 'border',
                tbar: ['Tipo de repetici&oacute;n:', ' ', ' ', ' ', ' ', ' ', ' ', _this.cbtiporepeticiones, ' ',
                    _this.btnAdicionarRepeticiones, _this.btnModificarRepeticiones, ' ',
                    _this.btnEliminarRepeticiones, ' ', _this.btnDuplicarRepeticiones],
                usarKeymap: true,
                botonesKeymap: [_this.btnAdicionarRepeticiones, _this.btnModificarRepeticiones,
                    _this.btnEliminarRepeticiones, _this.btnDuplicarRepeticiones],
                items: [_this.ggrepeticiones, _this.gginvolucradosrepeticion],
                listeners: {
                    activate: function (p) {
                        //if (_this.estamodificando == 1) {
                        //    _this.stggrepeticiones.load();
                        //}
                    },
                    deactivate: function (p) {
                    }
                }
            });
        _this.prepeticiones.addListener('activate', function (p) {
            if (_this.estamodificando == 1) {
                _this.stggrepeticiones.load();
            }
            if (accion == 'Duplicar' && _this.subordinado == 1) {
                if (activartabrep == 0) {
                    //_this.stggrepeticiones.load();
                    //activartabrep = 1;
                }
            }
        });
        _this.prepeticiones.addListener('deactivate', function (p) {
            _this.primerconteo = 'no';
        });

        //panel para los calculos de duracionestimada
        this.tiempooptimistaDias = new Ext.form.NumberField({
            fieldLabel: 'D&iacute;as',
            id: 'tiempooptimistaDias',
            maxValue: 1000,
            //width: 40,
            allowBlank: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempooptimistaHoras = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            id: 'tiempooptimistaHoras',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            //width: 40,
            allowBlank: false,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempooptimistaMinutos = new Ext.form.NumberField({
            fieldLabel: 'Min',
            id: 'tiempooptimistaMinutos',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            // width: 40,
            allowNegative: false,
            allowBlank: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempooptimista = new Ext.form.FieldSet({
            title: 'Tiempo optimista:',
            height: 91,
            anchor: '95%',
            items: [{
                layout: 'column', items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempooptimistaDias]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempooptimistaHoras]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempooptimistaMinutos]
                }]
            }]
        });

        this.tiempomedioDias = new Ext.form.NumberField({
            fieldLabel: 'D&iacute;as',
            id: 'tiempomedioDias',
            maxValue: 1000,
            //width: 40,
            allowBlank: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempomedioHoras = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            id: 'tiempomedioHoras',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            //width: 40,
            allowBlank: false,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempomedioMinutos = new Ext.form.NumberField({
            fieldLabel: 'Min',
            id: 'tiempomedioMinutos',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            // width: 40,
            allowNegative: false,
            allowBlank: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempomedio = new Ext.form.FieldSet({
            title: 'Tiempo medio:',
            height: 91,
            anchor: '95%',
            items: [{
                layout: 'column', items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempomedioDias]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempomedioHoras]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempomedioMinutos]
                }]
            }]
        });

        this.tiempopesimistaDias = new Ext.form.NumberField({
            fieldLabel: 'D&iacute;as',
            id: 'tiempopesimistaDias',
            maxValue: 1000,
            //width: 40,
            allowBlank: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempopesimistaHoras = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            id: 'tiempopesimistaHoras',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            //width: 40,
            allowBlank: false,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempopesimistaMinutos = new Ext.form.NumberField({
            fieldLabel: 'Min',
            id: 'tiempopesimistaMinutos',
            maxValue: 1000,
            maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            // width: 40,
            allowNegative: false,
            allowBlank: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });
        this.tiempopesimista = new Ext.form.FieldSet({
            title: 'Tiempo pesimista:',
            height: 91,
            anchor: '95%',
            items: [{
                layout: 'column', items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempopesimistaDias]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempopesimistaHoras]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempopesimistaMinutos]
                }]
            }]
        });

        this.fscalculo = new Ext.form.FieldSet({
            title: 'Variables que intervienen en el cálculo de la Duración estimada (Dt):',
            height: 140,
            anchor: '95%',
            items: [{
                layout: 'column', items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempooptimista]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempomedio]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.tiempopesimista]
                }]
            }]
        });

        this.pcalculodetiempo = new Ext.Panel({
            title: 'Cálculo de tiempo',
            frame: true,
            id: 'calculodetiempo',
            items: [_this.fscalculo]
        });

        this.tpdatostarea = new Ext.TabPanel({
                height: 450,
                activeTab: 0,
                frame: true,
                items: [_this.pdatosgenerales, _this.pcalculodetiempo, _this.prelaciones, _this.panelactividadrecurso],
                listeners: {
                    tabchange: function (tabpanel, tabseleccionado) {
                        if (tabseleccionado == _this.prepeticiones) {
                            _this.stggrepeticiones.on('load', function () {
                                if (tabseleccionado == _this.prepeticiones && contadorrepeticiones == 1) {
                                    arrayrepeticiones_ini = _this.obtenerIdRepeticiones();
                                    contadorrepeticiones++;
                                }
                            })
                        } else if (tabseleccionado == _this.pcalculodetiempo) {
                            _this.pcalculodetiempo.doLayout();
                            _this.permitirCalculo = true;
                        } else if (tabseleccionado == _this.pdatosgenerales && _this.permitirCalculo == true) {
                            _this.CalcularTiempoEstimado();
                            _this.permitirCalculo = false;
                        }
                    }
                }
            }
        );

        this.fpCrudTarea = new Ext.FormPanel({
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
                        items: [_this.tpdatostarea]
                    }]
            }]
        });
        this.btnAplicarCrudTarea = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: (accion == 'Modificar' || accion == 'Ver datos de la' || accion == 'Duplicar'),
            id: 'btnplic',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.adicionar(accion, 1, PostAccionesGestionar, _this.arrayidelementos);
            }
        });
        this.btnAceptarCrudTarea = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnacep',
            nextTab: 'tfdenominacion',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.adicionar(accion, 0, PostAccionesGestionar, _this.arrayidelementos);
            }
        });
        if (_this.winCrudTarea) {
            _this.winCrudTarea.destroy();
        }
        this.winCrudTarea = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' tarea',
            width: 840,
            height: 580,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                    if (accion == 'Adicionar') {
                        _this.fini.setValue(new Date().format('d/m/Y'));
                        _this.fini.setMaxValue(null);
                        _this.ffin.setMinValue(_this.fini.getValue());
                        _this.ffin.setValue(_this.fini.getValue());
                    }
                },
                destroy: function () {
                    this.primerconteo = 'no';
                    var contadorrepeticiones = 1;
                    var arrayrepeticiones_ini = [];
                },
                beforedestroy: function () {
                }
            },
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                id: 'btncanc',
                handler: function () {
                    _this.winCrudTarea.destroy();
                    //PostAccionesGestionar();
                }
            }, {
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: true,
                id: 'btncerr',
                handler: function () {
                    _this.winCrudTarea.destroy();
                    PostAccionesGestionar();
                }
            }, _this.btnAplicarCrudTarea,
                _this.btnAceptarCrudTarea
            ],
            items: _this.fpCrudTarea
        });
        _this.winCrudTarea.doLayout();
        _this.winCrudTarea.show();

        this.cargarDatosDesdeCliente = function (arrayidelementos) {
            _this.BarraProgreso.show('Cargando datos...');
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarFormElemento',
                params: {
                    idelemento: arrayidelementos[0].id,
                    tipo: arrayidelementos[0].tipo,
                    plantilla: propertyPlantilla
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 0) {
                        /*  _this.BarraProgreso.hide();
                         mostrarMensaje(1, 'La actividad ' + accionejecutada + ' ya no se encuentra en los registros.');
                         _this.winCrudProyecto.destroy();
                         PostAccionesGestionar();*/
                    } else {
                        _this.BarraProgreso.hide();
                        var titulo = _this.winCrudTarea.title + '  -  ' + 'CAR: ' + responseData.data[0].idelemento;
                        _this.winCrudTarea.setTitle(titulo);
                        if (propertyPlantilla == false) {
                            _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                            _this.estadoCumpl.setValue(responseData.data[0].estadocumplimiento);
                            _this.fini.setValue(responseData.data[0].fechainicio);
                            _this.ffin.setValue(responseData.data[0].fechafin);
                            _this.tmfhoraini.setValue(responseData.data[0].horainicio);
                            _this.tmfhorafin.setValue(responseData.data[0].horafin);
                            _this.duracionReal.setValue(responseData.data[0].duracionreal);
                        }
                        _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                        _this.hedescripcion.setValue(responseData.data[0].descripcion);
                        _this.peso.setValue(responseData.data[0].peso);
                        _this.cmbcategoria.setValue(responseData.data[0].categoria.idnomenclador);
                        _this.cmbcategoria.setRawValue(responseData.data[0].categoria.denominacion);
                        _this.cmbtipoTarea.setValue(responseData.data[0].tipotarea.idtipotarea);
                        _this.cmbtipoTarea.setRawValue(responseData.data[0].tipotarea.denominacion);
                        if (responseData.data[0].criterioeval) {
                            _this.cbcriterioeval.setValue(responseData.data[0].criterioeval.ideval);
                            _this.cbcriterioeval.setRawValue(responseData.data[0].criterioeval.denominacion);
                        }
                        _this.tflugar.setValue(responseData.data[0].lugar);

                        _this.duracionEstimadaDias.setValue(responseData.data[0].dias);
                        _this.duracionEstimadaHoras.setValue(responseData.data[0].horas);
                        _this.duracionEstimadaMinutos.setValue(responseData.data[0].minutos);

                        _this.tiempooptimistaDias.setValue(responseData.data[0].diasOpt);
                        _this.tiempooptimistaHoras.setValue(responseData.data[0].horasOpt);
                        _this.tiempooptimistaMinutos.setValue(responseData.data[0].minutosOpt);

                        _this.tiempomedioDias.setValue(responseData.data[0].diasMed);
                        _this.tiempomedioHoras.setValue(responseData.data[0].horasMed);
                        _this.tiempomedioMinutos.setValue(responseData.data[0].minutosMed);

                        _this.tiempopesimistaDias.setValue(responseData.data[0].diasPes);
                        _this.tiempopesimistaHoras.setValue(responseData.data[0].horasPes);
                        _this.tiempopesimistaMinutos.setValue(responseData.data[0].minutosPes);

                        _this.unidadmedida.setValue(responseData.data[0].unidadmedida);
                        _this.valorreal.setValue(responseData.data[0].valorreal ? responseData.data[0].valorreal : 0);
                        _this.valormeta.setValue(responseData.data[0].valormeta ? responseData.data[0].valormeta : 0);
                        _this.costo.setValue(responseData.data[0].costo ? responseData.data[0].costo : 0);
                        _this.tfclave.setValue(responseData.data[0].clave);

                        if (_this.opcionesConfig.useCmbEvento != undefined) {
                            _this.CmbEvento.setValue(responseData.data[0].evento)
                        }

                        _this.objclasificadorinvol.stGInvolucrados.reload({
                            params: {
                                idelemento: arrayidelementos[0].id,
                                idtipoelemento: 10
                            }
                        });
                    }
                }
            });
        };

        switch (accion) {
            case 'Adicionar':
                _this.cbtiporepeticiones.enable();
                break;
            case 'Ver datos de la':
                _this.cbtiporepeticiones.disable();
                Ext.getCmp('btncerr').show();
                Ext.getCmp('btncanc').hide();
                _this.btnAceptarCrudTarea.hide();
                _this.objclasificadorinvol.tpinvolucrados.disable();
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
            default:
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
        }
    };

    this.esPrincipal = function () {
        if (_this.chprincipal.getValue() == true) {
            esprincipal = 1
        } else
            (esprincipal = 0);
        return esprincipal;
    };

    //funcion donde procedo a adicionar y modificar una tarea
    this.adicionar = function (accion, aplicar, PostAccionesGestionar, arrayidelementos, verificarInvol) {
        this.elementosrelacionados = _this.objRelaciones.ObtenerElementosRelacionados();
        url = 'adicionarTarea';
        waitMsg = 'Guardando datos de la tarea...';
        postaccion = 'adicionada';
        if (accion == 'Modificar') {
            url = 'modificarTarea';
            postaccion = 'modificada';
            _this.estamodificando = 1;
        }
        if (accion == 'Duplicar') {
            url = 'duplicarTarea';
            postaccion = 'duplicada';
        }
        var plantilla = 0;
        if (_this.padre.plantilla == 1) {
            plantilla = 1;
        }
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayidrecursosasociados = _this.objactivrecurso.retornarasociados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
        var idpadre = _this.padre.idelemento;
        var idautorpadre = _this.padre.idautor;
        var tipopadre = _this.padre.tipoelemento;
        var actprincipal = _this.esPrincipal();
        var arrayrepeticiones = _this.ObtenerRepeticiones();
        var evento = 'vacio';
        if (_this.opcionesConfig.useCmbEvento != undefined) {
            if (_this.CmbEvento.getValue() != undefined)
                evento = _this.CmbEvento.getValue();
        }
        var duracionEstimada = (_this.duracionEstimadaDias.getValue() * 24) + _this.duracionEstimadaHoras.getValue() + (_this.duracionEstimadaMinutos.getValue() / 60);
        var verificartiempoInvol = (!verificarInvol && arrayinvolucrados.length > 0) ? 1 : 0;
        btnaplicar = false;
        _this.BarraProgreso.show(waitMsg);
        _this.fpCrudTarea.getForm().submit({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/' + url,
            params: {
                idelemento: (arrayidelementos == undefined) ? null : arrayidelementos[0].id,
                principal: actprincipal,
                plantilla: plantilla,
                idpadre: idpadre,
                idautorpadre: idautorpadre,
                duracionE: duracionEstimada,
                tipopadre: tipopadre,
                asociados: Ext.encode(arrayidrecursosasociados),
                arrayrepeticiones: Ext.encode(arrayrepeticiones),
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                arrayelementosrelacionados: Ext.encode(_this.elementosrelacionados),
                evento: evento,
                _is_leaf: arrayidelementos[0]._is_leaf,
                verificartiempoinvol: verificartiempoInvol,
                idEstructura: _this.idEstructura,
                idSubsistema: 2,
                tiempooptimistaDias: _this.tiempooptimistaDias.getValue(),
                tiempooptimistaHoras: _this.tiempooptimistaHoras.getValue(),
                tiempooptimistaMinutos: _this.tiempooptimistaMinutos.getValue(),
                tiempomedioDias: _this.tiempomedioDias.getValue(),
                tiempomedioHoras: _this.tiempomedioHoras.getValue(),
                tiempomedioMinutos: _this.tiempomedioMinutos.getValue(),
                tiempopesimistaDias: _this.tiempopesimistaDias.getValue(),
                tiempopesimistaHoras: _this.tiempopesimistaHoras.getValue(),
                tiempopesimistaMinutos: _this.tiempopesimistaMinutos.getValue()
            },
            failure: function (form, action) {
                _this.BarraProgreso.hide();
                if (action.result.mensaje.mensaje == 5) {
                    var arrayInvolConflicto = action.result.mensaje.involucradosConflicto;
                    var fechafinact = action.result.mensaje.fechafinact;
                    var msj = 'En la tarea ' + postaccion + ' existe(n) conflicto(s) entre la fecha de fin de la tarea (<b>' + fechafinact + '</b>) ' +
                        'y el fondo de tiempo planificado para el(los) siguiente(s) involucrado(s):<br /><br />';
                    for (var invol in arrayInvolConflicto) {
                        if (arrayInvolConflicto.hasOwnProperty(invol)) {
                            if (arrayInvolConflicto[invol].nombreapellidos != '') {
                                msj += '<b>Nombre: </b>' + arrayInvolConflicto[invol].nombreapellidos + ' ---- <b>SegÃƒÂºn fondo de tiempo planificado: </b>' + arrayInvolConflicto[invol].fechafin + '<br />';
                            } else {
                                msj += '<b>Usuario: </b>' + arrayInvolConflicto[invol].usuario + ' ---- <b>SegÃƒÂºn fondo de tiempo planificado: </b>' + arrayInvolConflicto[invol].fechafin + '<br />';
                            }

                        }
                    }
                    msj += '<br />¿Desea ignorar la advertencia?'
                    mostrarMensaje(2, msj, function (btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.adicionar(accion, aplicar, PostAccionesGestionar, arrayidelementos, verificarInvol = 1);
                        } else {
                        }
                    });

                }
                if (action.result.mensaje == 1) {
                    mostrarMensaje(1, 'La tarea ha sido ' + postaccion + ' satisfactoriamente.');
                    if (aplicar == 0) {
                        _this.winCrudTarea.destroy();
                        PostAccionesGestionar(action.result.mensaje, accion);
                    } else {
                        _this.objRelaciones.ResetearRelaciones();
                        _this.fpCrudTarea.getForm().reset();
                        _this.objactivrecurso.botonAplicar();
                        _this.objclasificadorinvol.ResetearCampos(); // limpia el clasificador de involucrados luego de la insercion de datos
                    }
                }
                if (action.result.mensaje == 0) {
                    if (accion == 'Modificar') {
                        mostrarMensaje(1, 'La tarea que quiere modificar ya existe.');
                    } else {
                        mostrarMensaje(1, 'La tarea que quiere adicionar ya existe.');
                    }
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
                if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'La tarea que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudTarea.destroy();
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
            }
        });
    };

    this.ActualizarEstadoBarraHerramientasRepeticiones = function () {
        _this.arrayrepeticionesseleccionadas = [];
        _this.arrayidtarearep = [];
        _this.btnModificarRepeticiones.disable();
        _this.btnAdicionarRepeticiones.disable();
        _this.btnEliminarRepeticiones.disable();
        _this.btnDuplicarRepeticiones.disable();
        if (_this.smggrepeticiones.hasSelection()) {
            var arrayrecords = _this.smggrepeticiones.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                var puedemodificar = 1;
                var puedeeliminar = 1;
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidtarearep[i] = arrayrecords[i].data.idtarea;
                    var repeticionseleccionada = {};
                    repeticionseleccionada = {
                        idrepeticion: arrayrecords[i].data.idrepeticion,
                        idtarea: arrayrecords[i].data.idtarea,
                        fechainicio: arrayrecords[i].data.fechainicio,
                        fechafin: arrayrecords[i].data.fechafin,
                        lugar: arrayrecords[i].data.lugar,
                        idautor: arrayrecords[i].data.idautor
                    };
                    if (arrayrecords[i].data.involucrados.length > 0) {
                        repeticionseleccionada.involucrados = arrayrecords[i].data.involucrados;
                    }
                    _this.arrayrepeticionesseleccionadas.push(repeticionseleccionada);
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificarRepeticiones.enable();
                    _this.btnDuplicarRepeticiones.enable();
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminarRepeticiones.enable();
                }
            }
        }
    };
    this.CrearWinCrudRepeticiones = function (accion, tiporepeticion) {
        if (_this.winCrudRepeticiones)
            _this.winCrudRepeticiones.destroy();
        var tabsig = 'cbintervalorepetperiodica';
        var fechafintarea = _this.ffin.getValue();
        var fechainitarea = _this.fini.getValue();
        if (fechafintarea.toString() != '')
            fechafintareamasundia = new Date(fechafintarea).add(Date.DAY, 1);

        if (accion == 'Adicionar' && tiporepeticion == 1) {
            //store del combo del intervalo de las repeticiones periodicas
            _this.stcbintervalorepetperiodica = new Ext.data.SimpleStore({
                fields: ['idintervalo', 'denominacion'],
                data: [[1, 'Por dÃƒÂ­as']]
            });
            //combo del intervalo de las repeticiones periodicas
            _this.cbintervalorepetperiodica = new Ext.form.ComboBox({
                fieldLabel: 'Intervalo',
                hiddenName: 'idintervalo',
                valueField: 'idintervalo',
                id: 'cbintervalorepetperiodica',
                store: _this.stcbintervalorepetperiodica,
                displayField: 'denominacion',
                value: 1,
                prevTab: 'btaceprepeticion',
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                allowBlank: false,
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    select: function (combo, record, index) {
                    }
                }
            });
            //campo de texto donde muestro el inicio de la repeticion periodica(cada n dias)
            _this.tfcadandias = new Ext.form.NumberField({
                value: 1,
                allowNegative: false,
                maxLength: 3,
                maxValue: 365,
                maxText: 'Solo admite números enteros positivos hasta 365.',
                maxLengthText: 'El tamaño máximo requerido es de 3 dígitos.',
                regexText: 'Este valor es incorrecto',
                allowBlank: false,
                width: 40
            });
            //campo de texto donde muestro el fin de la repeticion periodica(despues de n repeticiones)
            _this.tfdespuesdnrepeticiones = new Ext.form.NumberField({
                anchor: '100%',
                value: 2,
                style: 'margin-top:-1px;',
                allowNegative: false,
                regexText: 'Este valor es incorrecto',
                maxLength: 3,
                maxValue: 365,
                maxText: 'Solo admite números enteros positivos hasta 365.',
                maxLengthText: 'El tamaño máximo requerido es de 3 dígitos.',
                labelSeparator: '',
                disabled: false,
                width: 40,
                allowBlank: false
            });
            //campo de fecha donde muestro el fin de la repeticion periodica(terminar en la fecha n)
            _this.terminarenfechan = new Ext.form.DateField({
                format: 'd/m/Y',
                invalidText: 'Formato: dd/mm/aaaa.',
                width: 100,
                minValue: fechafintareamasundia,
                value: fechafintareamasundia,
                disabled: true,
                minText: 'La fecha fin de las repetición tiene que ser posterior o igual a la fecha fin de la tarea.',
                style: 'margin-top:-1px;',
                labelSeparator: '',
                allowBlank: false
            });
            // formulario para las repeticiones periodicas
            _this.fprepeticiones = new Ext.FormPanel(
                {
                    frame: true,
                    labelAlign: 'top',
                    id: 'formperiodica',
                    xtype: 'form',
                    bodyStyle: 'padding:5px 5px 0;',
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 1,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.cbintervalorepetperiodica]
                                }
                            ]
                        }, {
                            xtype: 'fieldset',
                            title: 'Repetir',
                            width: 235,
                            height: 70,
                            layout: 'column',
                            cls: 'panel-repeticion',
                            items: [{
                                columnWidth: .15,
                                id: 'panel-repeticion-cada',
                                items: [{
                                    xtype: 'tbtext',
                                    labelSeparator: '',
                                    text: 'Cada '
                                }]

                            }, {
                                columnWidth: .23,
                                items: [_this.tfcadandias]
                            }, {
                                columnWidth: .2,
                                id: 'panel-repeticion-dias',
                                items: [{
                                    xtype: 'tbtext',
                                    text: 'd&iacute;a(s).'
                                }]
                            }]
                        }, {
                            xtype: 'fieldset',
                            width: 235,
                            height: 140,
                            id: 'finrepeticion',
                            items: [{
                                layout: 'column',
                                items: [{
                                    defaultType: 'radio',
                                    columnWidth: .78,
                                    layout: 'form',
                                    border: false,
                                    items: [{
                                        labelSeparator: '',
                                        checked: true,
                                        boxLabel: 'Terminar tras la repetici&oacute;n',
                                        name: 'b',
                                        id: 'terminarenrepeticionn',
                                        listeners: {
                                            check: function (chk, checked) {
                                                _this.AccionesPostChequearRadiosRepPeriodica(chk, checked);
                                            }
                                        }
                                    }]
                                }, {
                                    defaultType: 'textfield',
                                    columnWidth: .2,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.tfdespuesdnrepeticiones]
                                }]
                            }, {
                                layout: 'column',
                                items: [{
                                    defaultType: 'radio',
                                    columnWidth: .5,
                                    layout: 'form',
                                    border: false,
                                    items: [{
                                        labelSeparator: '',
                                        boxLabel: 'Terminar el',
                                        name: 'b',
                                        id: 'terminarenfechan',
                                        listeners: {
                                            check: function (chk, checked) {
                                                _this.AccionesPostChequearRadiosRepPeriodica(chk, checked);
                                            }
                                        }
                                    }]
                                }, {
                                    columnWidth: .5,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.terminarenfechan]
                                }]
                            }]
                        }]
                });
        } else {
            tabsig = 'dffechainiciorepaleatoria';
            var modificandorepeticion = 0;
            var idautorrepeticion = null;
            if ((accion == 'Modificar' || accion == 'Puntualizar') && _this.estamodificando == 1) {
                modificandorepeticion = 1;
                idautorrepeticion = _this.arrayrepeticionesseleccionadas[0].idautor;
            }
            //campo de fecha de inicio para las repeticiones aleatorias
            _this.dffechainiciorepaleatoria = new Ext.form.DateField
            ({
                fieldLabel: 'Fecha de inicio',
                format: 'd/m/Y',
                id: 'dffechainiciorepaleatoria',
                endDateField: 'dffechafinrepaleatoria',
                prevTab: 'btaceprepeticion',
                anchor: '80%',
                invalidText: 'Formato: dd/mm/aaaa.',
                allowBlank: false,
                maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
                blankText: 'Este campo es obligatorio.',
                listeners: {
                    change: function (el, vn, ov) {
                        if (vn == "")
                            _this.dffechafinrepaleatoria.setMinValue(_this.fini.getValue());
                        else
                            _this.dffechafinrepaleatoria.setMinValue(vn);
                    }
                }
            });
            //campo de fecha de fin para las repeticiones aleatorias
            _this.dffechafinrepaleatoria = new Ext.form.DateField
            ({
                id: 'dffechafinrepaleatoria',
                fieldLabel: 'Fecha de fin',
                format: 'd/m/Y',
                startDateField: 'dffechainiciorepaleatoria',
                anchor: '80%',
                invalidText: 'Formato: dd/mm/aaaa.',
                minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
                allowBlank: false,
                blankText: 'Este campo es obligatorio.',
                listeners: {
                    change: function (el, vn, ov) {
                        if (vn == "")
                            _this.dffechainiciorepaleatoria.setMaxValue(null);
                        else
                            _this.dffechainiciorepaleatoria.setMaxValue(vn);
                    }
                }
            });
            //campo de texto donde muestro el lugar de la repeticion aleatoria
            _this.tflugarrepaleatoria = new Ext.form.TextField({
                fieldLabel: 'Lugar',
                name: 'tflugarrepaleatoria',
                maxLength: 255,
                maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9ÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ¼Ãƒï¿½Ãƒâ€°Ãƒï¿½Ãƒâ€œÃƒÅ¡ÃƒÂ±Ãƒâ€˜ÃƒÅ“"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                anchor: '80%'
            });

            this.pclasificadorinvolrepeticiones = _this.objclasificadorinvolrepeticiones.CrearClasificadorInvol(
                _this.arrayidelementos[0], tipoelemento = 10, modificandorepeticion, idautorrepeticion);

            // formulario para las repeticiones aletorias
            this.fprepeticiones = new Ext.FormPanel(
                {
                    labelAlign: 'top',
                    frame: false,
                    id: 'formaleatoria',
                    rezasible: false,
                    width: 690,
                    height: 457,
                    xtype: 'form',
                    items: [
                        {
                            layout: 'column',
                            frame: true,
                            items: [
                                {
                                    columnWidth: .5,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.dffechainiciorepaleatoria, _this.tflugarrepaleatoria]
                                }, {
                                    columnWidth: .5,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.dffechafinrepaleatoria]
                                }
                            ]

                        },
                        _this.pclasificadorinvolrepeticiones
                    ],
                    listeners: {
                        'clientvalidation': function (fm, valid) {
                            if (_this.estamodificando == 1) {
                                if (valid && _this.objclasificadorinvolrepeticiones.modificarInv) {
                                    _this.winCrudRepeticiones.autoValidate = false;
                                    Ext.getCmp('btaceprepeticion').setDisabled(false);
                                } else {
                                    _this.winCrudRepeticiones.autoValidate = true;
                                    Ext.getCmp('btaceprepeticion').setDisabled(true);
                                }
                            }
                        }
                    }
                });
        }

        _this.winCrudRepeticiones = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            title: accion + ' repetici&oacute;n',
            width: 700,
            height: 453,
            constrain: true,
            maximized: false,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            items: [_this.fprepeticiones],
            buttons: [
                {
                    iconCls: 'cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    id: 'btcancrepeticion',
                    text: 'Cancelar',
                    handler: function () {
                        _this.winCrudRepeticiones.destroy();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    id: 'btaceprepeticion',
                    nextTab: tabsig,
                    prevTab: 'btcancrepeticion',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.CrudRepeticiones(accion, tiporepeticion);
                    }
                }
            ],
            listeners: {
                destroy: function (win) {
                    _this.datos_repeticiones_ini = "";
                    _this.datos_repeticiones_fin = "";
                    arrayinvolucrados_repeticiones_ini = [];
                    fechafintareamasundia = '';
                    fechainitarea = '';
                },
                show: function (win) {
                    if (accion == 'Modificar' || accion == 'Puntualizar') {
                        _this.datos_repeticiones_ini = _this.fprepeticiones.getForm().getValues(true);
                        arrayinvolucrados_repeticiones_ini = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
                    }
                },
                beforeshow: function (win) {
                    if (tiporepeticion != 1 && accion == 'Adicionar') {
                        if (fechainitarea.toString() == '') {
                            _this.dffechainiciorepaleatoria.setDisabled(true);
                            _this.dffechafinrepaleatoria.setDisabled(true);
                        } else {
                            _this.dffechainiciorepaleatoria.setMinValue(_this.fini.getValue());
                            _this.dffechainiciorepaleatoria.setValue(_this.fini.getValue());
                            _this.dffechafinrepaleatoria.setMinValue(_this.fini.getValue());
                            _this.dffechafinrepaleatoria.setValue(_this.fini.getValue());
                        }
                    } else if (tiporepeticion == 1 && accion == 'Adicionar') {
                        _this.winCrudRepeticiones.validateDefault = false;
                        if (fechafintareamasundia == '' || fechainitarea.toString() == '')
                            _this.fprepeticiones.getComponent('finrepeticion').setDisabled(true);
                    } else if (accion == 'Modificar' || accion == 'Puntualizar') {
                        var arrayrecords = _this.smggrepeticiones.getSelections();
                        var fechainicio = arrayrecords[0].data.fechainicio;
                        var fechafin = arrayrecords[0].data.fechafin;
                        var finicio = fechainicio.replace(/\s/g, '');
                        var ffin = fechafin.replace(/\s/g, '');
                        _this.dffechainiciorepaleatoria.setValue(finicio);
                        _this.dffechainiciorepaleatoria.setMinValue(_this.fini.getValue());
                        _this.dffechafinrepaleatoria.setValue(ffin);
                    }
                }
            }
        });

        this.CrudRepeticiones = function (accion, tiporepeticion) {
            var errorformulario = 0;
            if (accion == 'Adicionar' || accion == 'Duplicar') {
                switch (tiporepeticion) {
                    case 1:
                        if (_this.fprepeticiones.getForm().isValid()) {
                            if (_this.radioChekiado == 1) {
                                if (!_this.tfcadandias.getValue() || !_this.tfdespuesdnrepeticiones.getValue()) {
                                    errorformulario = 1;
                                }
                            }
                            if (_this.radioChekiado == 2) {
                                if (!_this.tfcadandias.getValue() || !_this.terminarenfechan.getValue()) {
                                    errorformulario = 1;
                                }
                            }
                            if (fechafintareamasundia == '' || fechainitarea.toString() == '') {
                                errorformulario = 2;
                            }
                            if (errorformulario == 0) {
                                _this.CalcularIntervaloRepeticionPeriodica(tiporepeticion);
                            }
                        } else {
                            errorformulario = 1;
                        }
                        break;
                    case 2:
                        if (_this.fprepeticiones.getForm().isValid()) {
                            (fechainitarea.toString() == '') ? errorformulario = 2 : _this.ObtenerInstanciasAleatoria(tiporepeticion);
                        } else {
                            errorformulario = 1;
                        }
                        break;
                }
                if (errorformulario == 0) {
                    if (_this.estamodificando == 0) {
                        _this.CargarRepeticionesCliente();
                        var mensajerepeticion = 'La repetici&oacute;n ha sido adicionada satisfactoriamente.';
                        if (tiporepeticion == 1) {
                            if (_this.tfdespuesdnrepeticiones.getValue() > 1) {
                                mensajerepeticion = 'Las repeticiones han sido adicionadas satisfactoriamente.';
                            }
                        }
                        mostrarMensaje(1, mensajerepeticion);
                    } else {
                        _this.AdicionarRepeticionServidor(accion);
                    }
                    _this.winCrudRepeticiones.destroy();
                    _this.cbtiporepeticiones.clearValue();
                    _this.smggrepeticiones.clearSelections();
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                } else if (errorformulario == 1) {
                    mostrarMensaje(1, "Existe(n) algÃƒÂºn(os) campo(s) con valor(es) incorrecto(s) o vacÃƒÂ­o(s).");
                    return
                } else if (errorformulario == 2) {
                    _this.notificarErrorAdicionarRept(tiporepeticion);
                    return
                }
            }
            if (accion == 'Modificar' || accion == 'Puntualizar') {
                var accionenprogreso = 'Modificando';
                var accionejecutada = 'modificada';
                if (accion == 'Duplicar') {
                    accionenprogreso = 'Duplicando';
                    accionejecutada = 'duplicada';
                }
                if (_this.estamodificando == 0) {
                    if (_this.fprepeticiones.getForm().isValid()) {
                        _this.BarraProgreso.show(accionenprogreso + ' repetici&oacute;n');
                        _this.ModificarRepeticionDesdeCliente(tiporepeticion, accion);
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, " La repetici&oacute;n ha sido " + accionejecutada + " satisfactoriamente.");
                        _this.winCrudRepeticiones.destroy();
                    } else {
                        mostrarMensaje(1, "Existe(n) algÃƒÂºn(os) campo(s) con valor(es) incorrecto(s) o vacÃƒÂ­o(s).");
                    }
                } else {
                    if (_this.fprepeticiones.getForm().isValid()) {
                        _this.datos_repeticiones_fin = _this.fprepeticiones.getForm().getValues(true);
                        var arrayinvolucrados_repeticiones_fin = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
                        guardarcambios = false;
                        if (_this.datos_repeticiones_fin !== _this.datos_repeticiones_ini
                            || arrayinvolucrados_repeticiones_fin.toString() !== arrayinvolucrados_repeticiones_ini.toString()) {
                            _this.BarraProgreso.show('Modificando repetici&oacute;n');
                            var arrayinvolucrados = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
                            var arrayinvolucradoseliminar = _this.objclasificadorinvolrepeticiones.ObtenerInvolucradosEliminar();
                            _this.fprepeticiones.getForm().submit({
                                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/modificarrepeticion',
                                params: {
                                    arrayinvolucrados: Ext.encode(arrayinvolucrados),
                                    arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                                    idtarearepeticion: _this.arrayrepeticionesseleccionadas[0].idtarea,
                                    idelemento: _this.arrayidelementos[0].id
                                },
                                failure: function (form, action) {
                                    _this.BarraProgreso.hide();
                                    if (action.result.mensaje == 1) {
                                        mostrarMensaje(1, 'La repetici&oacute;n ha sido modificada satisfactoriamente.');
                                        guardarcambios = true;
                                        _this.winCrudRepeticiones.destroy();
                                        _this.stggrepeticiones.load();
                                    }
                                    if (action.result.mensaje == 0) {
                                        mostrarMensaje(1, 'La tarea a al cual usted quiere modificarle la repetici&oacute;n ya no se encuentra en los registros.', function () {
                                            _this.winCrudRepeticiones.destroy();
                                            _this.winCrudTarea.destroy();
                                            PostAccionesGestionar();
                                        });
                                    }
                                    if (action.result.mensaje == 3) {
                                        mostrarMensaje(1, 'La  repetici&oacute;n que usted quiere modificar ya no se encuentra en los registros.', function () {
                                            _this.winCrudRepeticiones.destroy();
                                            _this.stggrepeticiones.load();
                                        });
                                    }
                                }
                            });
                        } else {
                            mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
                        }
                    } else {
                        mostrarMensaje(1, "Existe(n) algÃƒÂºn(os) campo(s) con valor(es) incorrecto(s) o vacÃƒÂ­o(s).");
                    }
                }
            }
        };

        if (accion == 'Adicionar') {
            if (tiporepeticion == 1) {//periodica
                _this.winCrudRepeticiones.setSize({
                    width: 272,
                    height: 365
                });
                _this.cbintervalorepetperiodica.focus(false, 1024);
                _this.winCrudRepeticiones.doLayout();
            } else {
                var arrayinvolactinicial = _this.objclasificadorinvol.ObtenerInvolucrados();
                if (arrayinvolactinicial.length > 0) {
                    for (var p = 0; p < arrayinvolactinicial.length; p++) {
                        _this.objclasificadorinvolrepeticiones.CargarGridInvolucrados(arrayinvolactinicial[p]);
                    }
                }
                _this.tflugarrepaleatoria.setValue(_this.tflugar.getValue());
                _this.dffechainiciorepaleatoria.focus(false, 1024);
            }
        }
        if (accion == 'Modificar' || accion == 'Duplicar' || accion == 'Puntualizar') {
            _this.BarraProgreso.show('Cargando datos');
            _this.CargarDatosRepeticionDesdeCliente();
            _this.BarraProgreso.hide();
            _this.dffechainiciorepaleatoria.focus(false, 1024);
        }
        arr_dates = [];
        arr_hour = [];
        _this.winCrudRepeticiones.show();
    };
    this.AdicionarRepeticionServidor = function (accion) {
        var accionenprogreso = 'Adicionando';
        var accionejecutada = 'adicionada';
        var accionfuturo = 'adicionarle';
        var url = 'adicionar';
        if (accion == 'Modificar') {
            accionenprogreso = 'Modificando';
            accionejecutada = 'modificada';
            url = 'modificar';
            accionfuturo = 'modificarle';
        }
        if (accion == 'Duplicar') {
            accionenprogreso = 'Duplicando';
            accionejecutada = 'duplicada';
            accionfuturo = 'duplicarle';
        }
        _this.BarraProgreso.show(accionenprogreso + ' repetici&oacute;n');
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/' + url + 'repeticion',
            params: {
                idtarea: _this.arrayidelementos[0].id,
                idelementopadre: _this.padre.idelemento,
                arrayrepeticiones: Ext.encode(_this.arrayRepeticiones)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 0) {
                    mostrarMensaje(1, 'La tarea a la cual usted quiere ' + accionfuturo + ' la repetici&oacute;n ya no se encuentra en los registros.', function () {
                        _this.winCrudRepeticiones.destroy();
                        _this.winCrudActividades.destroy();
                        PostAccionesGestionar();
                    });
                }
                if (responseData.mensaje == 1) {
                    var mensajeinformacion4 = '';
                    if (_this.arrayRepeticiones.length > 1)
                        mensajeinformacion4 = 'Las repeticiones han sido ' + accionejecutada + ' satisfactoriamente.';
                    else
                        mensajeinformacion4 = 'La repetici&oacute;n ha sido ' + accionejecutada + ' satisfactoriamente.';
                    mostrarMensaje(1, mensajeinformacion4);
                    _this.winCrudRepeticiones.destroy();
                    _this.stggrepeticiones.load();
                }
            }
        });
        _this.arrayRepeticiones = [];
    };
    this.CargarRepeticionesCliente = function () {
        var arrayrepeticionesexistentes = [];
        arrayrepeticionesexistentes = _this.stggrepeticiones.getRange();
        for (var i = 0; i < _this.arrayRepeticiones.length; i++) {
            var fecha = _this.arrayRepeticiones[i]['fechainicioRe'];
            var date = new Date(fecha);
            date.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            var mes = date.format('F');
            var numeroMes = date.format('n');
            var TopicRecord = Ext.data.Record.create([
                {
                    name: 'idrepeticion'
                }, {
                    name: 'idtarea'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'lugar'
                }, {
                    name: 'involucrados'
                }, {
                    name: 'modificar'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'superior'
                }, {
                    name: 'subordinado'
                }, {
                    name: 'estadocumplimiento'
                }, {
                    name: 'nombreautor'
                }, {
                    name: 'tiporepeticion'
                }, {
                    name: 'mes'
                }, {
                    name: 'numeroMes',
                    type: 'int'
                }
            ]);

            var finic = new Date(_this.arrayRepeticiones[i]['fechainicioRe']);
            var fi = finic.format('d/m/Y');
            var ffin = new Date(_this.arrayRepeticiones[i]['fechafinRe']);
            var ff = ffin.format('d/m/Y');
            var orden = finic.format('m');
            var myNewRecord = new TopicRecord({
                idrepeticion: _this.arrayRepeticiones[i]['idrepeticion'],
                idtarea: _this.arrayRepeticiones[i]['idtarea'],
                fechainicio: fi,
                fechafin: ff,
                lugar: _this.arrayRepeticiones[i]['lugar'],
                modificar: 1,
                eliminar: 1,
                subordinado: 1,
                superior: 0,
                estadocumplimiento: 'Sin cumplir(0%)',
                nombreautor: window.perfil.usuario,
                involucrados: _this.arrayRepeticiones[i]['involucrados'],
                tiporepeticion: _this.arrayRepeticiones[i]['tipoDeRep'],
                mes: mes,
                numeroMes: parseInt(numeroMes)
            });
            arrayrepeticionesexistentes.push(myNewRecord);
        }
        _this.stggrepeticiones.removeAll();
        _this.stgginvolucradosrepeticion.removeAll();
        _this.stggrepeticiones.add(arrayrepeticionesexistentes);
        _this.arrayRepeticiones = [];
    };
    this.obtenerIdRepeticiones = function () {
        var arrayelementosrepetidos = [];
        var elementosrepeticiones = _this.stggrepeticiones.getRange();
        if (elementosrepeticiones.length > 0) {
            for (var i = 0; i < elementosrepeticiones.length; i++) {
                var elementorepeticiones;
                elementorepeticiones = elementosrepeticiones[i].data.idtarea;
                arrayelementosrepetidos.push(elementorepeticiones);
            }
        }
        return arrayelementosrepetidos;
    };
    this.CalcularIntervaloRepeticionPeriodica = function (tiporepeticion) {
        //variables para el calculo
        var fechafintareaMadre = _this.ffin.getValue(); //fecha fin del elemento principal o madre
        var DiferenciaLosDias = _this.DiferenciaDeFechas(); //retorna la diferencia de dias entre fecha de inicio y fecha fin del elemento principal o madre
        var CantidadRepeticion = _this.tfdespuesdnrepeticiones.getValue(); //cantidad de veces que se repite
        var k = parseInt(_this.tfcadandias.getValue());
        //variables del arreglo
        var repeticionPer = {};
        var lugarRePer = _this.tflugar.getValue();
        var indexx;
        //variable fecha
        var FechaFinMadreFormatiada;
        var FechaInicioHijo;
        var FechaFinHijo;
        var fechaFinFija = _this.terminarenfechan.getValue();
        var NumeroCincoAnno = 365 * 5 + 1; //cinco aÃƒÂ±o
        var f;
        var involrep = [];
        var arrayinvolucradosrepeticion = [];
        //terminar tras...
        if (_this.radioChekiado == 1) {
            for (var i = 0; i < CantidadRepeticion; i++) {
                //calcular la fecha de inicio de la rep
                FechaFinMadreFormatiada = fechafintareaMadre.format("m/d/Y");
                FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
                //Calcular la fecha fin de la rep
                FechaFinHijo = new Date(FechaInicioHijo).add(Date.DAY, DiferenciaLosDias);
                // armando el arreglo de rep
                repeticionPer = {
                    idrepeticion: _this.contadorid,
                    idtarea: _this.contadorid,
                    fechainicioRe: FechaInicioHijo,
                    fechafinRe: FechaFinHijo,
                    lugar: lugarRePer,
                    tipoDeRep: tiporepeticion,
                    involucrados: arrayinvolucradosrepeticion
                };
                _this.contadorid++;
                //para la proxima repeticion.
                fechafintareaMadre = FechaFinHijo;
                _this.arrayRepeticiones.push(repeticionPer);
            }
        }// Terminar el
        if (_this.radioChekiado == 2) {
            //calcular la fecha de inicio de la rep
            FechaFinMadreFormatiada = fechafintareaMadre.format("m/d/Y");
            FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
            f = fechafintareaMadre;
            while (FechaInicioHijo.between(f, fechaFinFija)) {
                FechaFinMadreFormatiada = fechafintareaMadre.format("m/d/Y");
                FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
                //Calcular la fecha fin de la rep
                FechaFinHijo = new Date(FechaInicioHijo).add(Date.DAY, DiferenciaLosDias);
                if (!FechaInicioHijo.between(f, fechaFinFija))
                    break;
                // armando el arreglo de rep
                repeticionPer = {
                    idrepeticion: _this.contadorid,
                    idtarea: _this.contadorid,
                    fechainicioRe: FechaInicioHijo,
                    fechafinRe: FechaFinHijo,
                    lugar: lugarRePer,
                    tipoDeRep: tiporepeticion,
                    involucrados: arrayinvolucradosrepeticion
                };
                _this.contadorid++;
                //para la proxima repeticion.
                fechafintareaMadre = FechaFinHijo;
                _this.arrayRepeticiones.push(repeticionPer);
            }
        }
        _this.radioChekiado = 1;
    };
    this.DiferenciaDeFechas = function () {
        var fecha1 = _this.fini.getValue();
        fecha1 = fecha1.format("U");
        var fecha2 = _this.ffin.getValue();
        fecha2 = fecha2.format("U");
        var diferenciaSegundos = fecha2 - fecha1;
        var diferenciaDias = diferenciaSegundos / (24 * 60 * 60); //esto es lo mismo que (86400)
        return diferenciaDias;
    };
    this.AccionesPostChequearRadiosRepPeriodica = function (chk, checked) {
        if (checked) {
            if (chk.id == 'terminarenrepeticionn') {
                _this.tfdespuesdnrepeticiones.reset();
                _this.terminarenfechan.reset();
                _this.tfdespuesdnrepeticiones.enable();
                _this.terminarenfechan.disable();
                _this.radioChekiado = 1;
            } else if (chk.id == 'terminarenfechan') {
                _this.tfdespuesdnrepeticiones.reset();
                _this.terminarenfechan.reset();
                _this.tfdespuesdnrepeticiones.disable();
                _this.radioChekiado = 2;
                _this.terminarenfechan.enable();
            }
        }
    };
    this.CargarDatosRepeticionDesdeCliente = function () {
        _this.dffechainiciorepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].fechainicio);
        _this.dffechafinrepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].fechafin);
        _this.tflugarrepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].lugar);
        if (_this.arrayrepeticionesseleccionadas[0].involucrados) {
            if (_this.arrayrepeticionesseleccionadas[0].involucrados.length > 0) {
                for (var i = 0; i < _this.arrayrepeticionesseleccionadas[0].involucrados.length; i++) {
                    _this.objclasificadorinvolrepeticiones.CargarGridInvolucrados(_this.arrayrepeticionesseleccionadas[0].involucrados[i]);
                }
            }
        }
    };
    this.ModificarRepeticionDesdeCliente = function (tiporepeticion, accion) {
        if (accion == 'Modificar' || accion == 'Puntualizar') {
            _this.stggrepeticiones.remove(_this.smggrepeticiones.getSelected());
        }
        _this.ObtenerInstanciasAleatoria(tiporepeticion);
        _this.CargarRepeticionesCliente();
    };
    this.ObtenerInstanciasAleatoria = function (tiporepeticion) {
        var arrayInvolucradosRepAlea = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
        var repeticion = {};
        var fechainicioRe = _this.dffechainiciorepaleatoria.getValue();
        var fechafinRe = _this.dffechafinrepaleatoria.getValue();
        var lugarRe = _this.tflugarrepaleatoria.getValue();
        repeticion = {
            idrepeticion: _this.contadorid,
            idactividad: _this.contadorid,
            fechainicioRe: fechainicioRe,
            fechafinRe: fechafinRe,
            lugar: lugarRe,
            involucrados: arrayInvolucradosRepAlea,
            tipoDeRep: tiporepeticion
        };
        _this.contadorid++;
        _this.arrayRepeticiones.push(repeticion);
    };
    this.ObtenerRepeticiones = function () {
        var arrayrepeticiones = [];
        var repeticionesexistentes = _this.stggrepeticiones.getRange();
        if (repeticionesexistentes.length > 0) {
            for (var i = 0; i < repeticionesexistentes.length; i++) {
                var repeticion = {};
                repeticion = {
                    fechainicio: repeticionesexistentes[i].data.fechainicio,
                    fechafin: repeticionesexistentes[i].data.fechafin,
                    lugar: repeticionesexistentes[i].data.lugar,
                    tiporepeticion: repeticionesexistentes[i].data.tiporepeticion,
                    involucrados: repeticionesexistentes[i].data.involucrados
                };
                arrayrepeticiones.push(repeticion);
            }
        }
        return arrayrepeticiones;
    };
    this.notificarErrorAdicionarRept = function (tiporepeticion) {
        switch (tiporepeticion) {
            case 1:
                mostrarMensaje(2, " Para adicionar una repetición periódica debe especificar la fecha (inicio - fin) de la tarea. ¿Desea especificar la fecha (inicio - fin) de la tarea? ", function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.winCrudRepeticiones.destroy();
                        _this.tpdatostarea.setActiveTab('pdatosgenerales');
                    } else {
                        Ext.getCmp('btaceprepeticion').setDisabled(true);
                    }
                });
                break;
            case 2:
                mostrarMensaje(2, " Para adicionar una repetición aleatoria debe especificar la fecha inicio de la tarea. ¿Desea especificar la fecha inicio de la tarea? ", function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.winCrudRepeticiones.destroy();
                        _this.tpdatostarea.setActiveTab('pdatosgenerales');
                    } else {
                        Ext.getCmp('btaceprepeticion').setDisabled(true);
                    }
                });
                break;
        }
    };
    this.EliminarRepeticiones = function () {
        var arrayrepeticionesseleccionadas = _this.smggrepeticiones.getSelections();
        var mensajerepeticion = '', mensajemascararepeticion = '';
        var cantReptSelec = arrayrepeticionesseleccionadas.length;
        if (cantReptSelec > 1) {
            mensajerepeticion = '¿Est&aacute; seguro que quiere eliminar las repeticiones seleccionadas?';
            mensajemascararepeticion = 'Eliminando repeticiones';
        } else {
            mensajerepeticion = ' ¿Est&aacute; seguro que quiere eliminar la repetici&oacute;n seleccionada? ';
            mensajemascararepeticion = 'Eliminando repetici&oacute;n';
        }
        mostrarMensaje(2, mensajerepeticion, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascararepeticion);
                if (_this.estamodificando == 0) {
                    if (cantReptSelec > 0) {
                        for (var i = 0; i < cantReptSelec; i++) {
                            _this.stggrepeticiones.remove(arrayrepeticionesseleccionadas[i]);
                        }
                    }
                    _this.stgginvolucradosrepeticion.removeAll();
                    _this.BarraProgreso.hide();
                    var mensajeinformacion = '';
                    if (cantReptSelec > 1)
                        mensajeinformacion = 'Las repeticiones han sido eliminadas satisfactoriamente.';
                    else
                        mensajeinformacion = 'La repetici&oacute;n ha sido eliminada satisfactoriamente.';
                    mostrarMensaje(1, mensajeinformacion);
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                } else {
                    Ext.Ajax.request({
                        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/eliminarrepeticion',
                        params: {
                            idtarea: _this.arrayidelementos[0].id,
                            arrayrepeticiones: Ext.encode(_this.arrayrepeticionesseleccionadas)
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La tarea a la cual usted quiere eliminarle las repeticiones ya no se encuentra en los registros.', function () {
                                    _this.winCrudActividades.destroy();
                                    PostAccionesGestionar();
                                });
                            }
                            if (responseData.mensaje == 3) {
                                var mensajeinformacion2 = '';
                                if (_this.arrayrepeticionesseleccionadas.length > 1)
                                    mensajeinformacion2 = 'Las repeticiones que usted quiere eliminar ya no se encuentran en los registros.';
                                else
                                    mensajeinformacion2 = 'La repetici&oacute;n que usted quiere eliminar ya no se encuentra en los registros.';
                                mostrarMensaje(1, mensajeinformacion2, function () {
                                    _this.winCrudActividades.destroy();
                                    PostAccionesGestionar();
                                });
                            }
                            if (responseData.mensaje == 1) {
                                var mensajeinformacion3 = '';
                                if (_this.arrayrepeticionesseleccionadas.length > 1)
                                    mensajeinformacion3 = 'Las repeticiones han sido eliminadas satisfactoriamente.';
                                else
                                    mensajeinformacion3 = 'La repetici&oacute;n ha sido eliminada satisfactoriamente.';
                                mostrarMensaje(1, mensajeinformacion3);
                                _this.stggrepeticiones.load();
                            }
                        }
                    });
                }
            }
        });
    };
    this.CalcularTiempoEstimado = function () {

        var tiempooptimistaDias = _this.tiempooptimistaDias.getValue();
        var tiempooptimistaHoras = _this.tiempooptimistaHoras.getValue();
        var tiempooptimistaMinutos = _this.tiempooptimistaMinutos.getValue();

        var tiempomedioDias = _this.tiempomedioDias.getValue();
        var tiempomedioHoras = _this.tiempomedioHoras.getValue();
        var tiempomedioMinutos = _this.tiempomedioMinutos.getValue();

        var tiempopesimistaDias = _this.tiempopesimistaDias.getValue();
        var tiempopesimistaHoras = _this.tiempopesimistaHoras.getValue();
        var tiempopesimistaMinutos = _this.tiempopesimistaMinutos.getValue();

        var duracionestimada = 0;
        var tiempooptimista = 0;
        tiempooptimista = (parseInt(tiempooptimistaDias) * 24) * 60;
        tiempooptimista = (parseInt(tiempooptimistaHoras) * 60) + parseInt(tiempooptimista);
        tiempooptimista = parseInt(tiempooptimistaMinutos) + parseInt(tiempooptimista);
        tiempooptimista = Math.round(tiempooptimista);

        var tiempomedio = 0;
        tiempomedio = (parseInt(tiempomedioDias) * 24) * 60;
        tiempomedio = (parseInt(tiempomedioHoras) * 60) + parseInt(tiempomedio);
        tiempomedio = parseInt(tiempomedioMinutos) + parseInt(tiempomedio);
        tiempomedio = Math.round(tiempomedio);

        var tiempopesimista = 0;
        tiempopesimista = (parseInt(tiempopesimistaDias) * 24) * 60;
        tiempopesimista = (parseInt(tiempopesimistaHoras) * 60) + parseInt(tiempopesimista);
        tiempopesimista = parseInt(tiempopesimistaMinutos) + parseInt(tiempopesimista);
        tiempopesimista = Math.round(parseInt(tiempopesimista));

        duracionestimada = (parseInt(tiempooptimista) + (parseInt(tiempomedio) * 4) + parseInt(tiempopesimista)) / 6;

        var duracionTotal = _this.MostrarDuracionPlan(duracionestimada);
        _this.duracionEstimadaDias.setValue(Math.round(_this.equivalencia.equivalenciaDias));
        _this.duracionEstimadaHoras.setValue(Math.round(_this.equivalencia.equivalenciaHoras));
        _this.duracionEstimadaMinutos.setValue(Math.round(_this.equivalencia.restoMinutos));
    }

    this.MostrarDuracionPlan = function (equivalenciaMinutos) {
        var restoAnos = equivalenciaMinutos % (525600);
        var equivalenciaAnos = equivalenciaMinutos / (525600);
        var restoMeses = restoAnos % (44640);
        var equivalenciaMeses = restoAnos / (44640);
        var restoDias = restoMeses % (1440);
        var equivalenciaDias = restoMeses / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);

        var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';

        var totalDias = parseInt(equivalenciaAnos) * 365 + parseInt(equivalenciaMeses) * 31 + parseInt(equivalenciaDias);

        _this.equivalencia = {
            equivalenciaDias: totalDias,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };
        return duracionPlanTotal;
    }

    function MostrarImagenEstadoCumplimiento(val) {
        if (val) {
            val0 = val;
            val1 = val0.split("(");
            val2 = val1[1].split("%");
            val3 = val2[0] * 1;
            if (val3 == 0) {
                return '<span class="icondistra-bandera sipac-roja">' + ' ' + val + '</span>';
            }
            if (val3 > 0 && val3 < 95) {
                return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
            }
            if (val3 >= 95) {
                return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
            }
        }
    }


};
