Utilidades.Cmp.Cmpcrudobjetivos = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.eshija = 0;
    this.arrayidobjetivos = [];
    this.contadorid = 0;
    this.superior = 0;
    this.prevrowcriterio = -1;
    this.arrayelementosrelacionadosinicial = [];
    var arr_dates = [];
    this.gestionado = 0;
    this.permitirmodificar = 0;
    this.comboRelacionesDisable = false;

    this.datoscrit_ini = '';
    this.datoscrit_fin = '';
    this.array_invol_ini = [];
    this.array_invol_fin = [];
    this.heparticipantescriterio = '';
    this.hedescripcioncriterio = '';
    _this.btnaplicar = false;
    var contador = 1;
    var readonlyObj = false;
    var horaslaborables = 24;
    _this.change = false;

    this.mod = ({
        denominacion: false,
        descripcion: false,
        participantes: false,
        dirigentes: false,
        fechainicio: false,
        fechafin: false,
        porcientocump: false,
        estadocumplimiento: false,
        tiempoestimado: false,
        categoriaobjetivo: false
    });
    this.valoresiniform = ({
        denominacion: '',
        descripcion: '',
        participantes: '',
        dirigentes: '',
        fechainicio: null,
        fechafin: null,
        porcientocump: '',
        estadocumplimiento: '',
        tiempoestimado: 0,
        categoriaobjetivo: ''
    });

    this.modCriterio = ({
        denominacion: false,
        descripcion: false,
        participantes: false,
        fechainicio: false,
        fechafin: false,
        valorMeta: false,
        valorReal: false,
        um: false,
        negativo: false
    });
    this.valoresiniCriterio = ({
        denominacion: '',
        descripcion: '',
        participantes: '',
        fechainicio: null,
        fechafin: null,
        valorMeta: '',
        valorReal: '',
        um: '',
        positivo: false
    });

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    // componente gestionar indicadores
    this.objGestionarIndicadores=new Utilidades.Cmp.Cmpgestionarindicadores();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolCriterio = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto del componente Gestor Documental.
    this.objcmpgestordoc = new Utilidades.Cmp.Cmpgestordocumental();

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function (val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return;
            }
            if (field.endDateField) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });


    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudObjetivos = function (fechainicio, fechafin, accion, PostAccionesGestionar, arrayidobjetivos,
                                           idautor, eshija, permisomodificar, permisoeliminar,
                                           arrayelementosrelacionadosinicial, sm, st) {
        if (_this.winCrudObjetivos) {
            _this.winCrudObjetivos.destroy();
        }
        _this.arrayelementosrelacionadosinicial = [];
        if (arrayelementosrelacionadosinicial.length > 0) {
            _this.arrayelementosrelacionadosinicial = arrayelementosrelacionadosinicial;
        }
        _this.eshija = eshija;
        _this.arrayidobjetivos = arrayidobjetivos;
        this.sm = sm;
        _this.estamodificando = 0;
        _this.permisomodificar = permisomodificar;
        _this.permisoeliminar = permisoeliminar;
        var permiso = 1;

        if (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Relacionar elementos al') {
            _this.estamodificando = 1;
            if (accion == 'Ver datos del' || accion == 'Relacionar elementos al') {
                readonlyObj = true;
                if (accion == 'Ver datos del')
                    _this.comboRelacionesDisable = true;
            }
        }

        //campo para la denominacion del objetivo
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionobj',
            prevTab: (accion == 'Ver datos del') ? 'btnCerrarCrudObj' : 'btacep',
            nextTab: (accion == 'Ver datos del') ? 'btnCerrarCrudObj' : null,
            fieldLabel: 'Denominación',
            maxLength: 1000,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            readOnly: readonlyObj,
            anchor: '100%',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            (_this.valoresiniform.denominacion !== c.getValue().toString()) ? _this.mod.denominacion = true : _this.mod.denominacion = false;
                        }, c);
                    }
                },
                change: function () {
                    _this.change = true;
                }
            }
        });
        //campo para la descripcion de la objetivo
        _this.hedescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripcionobj',
            width: 640,
            height: 230,
            readOnly: readonlyObj,
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    _this.change = true;
                },
                sync: function (editor, html) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.descripcion == '' || _this.valoresiniform.descripcion == '&nbsp;' || _this.valoresiniform.descripcion == '&nbsp;<br>' || _this.valoresiniform.descripcion == '<br>') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.descripcion = false;
                            else
                                _this.mod.descripcion = true;
                        } else if (_this.valoresiniform.descripcion != html)
                            _this.mod.descripcion = true;
                        else
                            _this.mod.descripcion = false;
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
        //campo donde muestro los participantes del objetivo
        _this.heparticipantes = new Ext.form.HtmlEditor({
            id: 'heparticipantesobj',
            width: 640,
            height: 230,
            readOnly: readonlyObj,
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
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    _this.change = true;
                },
                sync: function (editor, html) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.participantes == '' || _this.valoresiniform.participantes == '&nbsp;' || _this.valoresiniform.participantes == '&nbsp;<br>' || _this.valoresiniform.participantes == '<br>') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.participantes = false;
                            else
                                _this.mod.participantes = true;
                        } else if (_this.valoresiniform.participantes != html)
                            _this.mod.participantes = true;
                        else
                            _this.mod.participantes = false;
                    }
                }
            }
        });
        //campo donde muestro los dirigentes del objetivo
        _this.hedirigentes = new Ext.form.HtmlEditor({
            id: 'hedirigentesobj',
            width: 640,
            height: 230,
            readOnly: readonlyObj,
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
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    _this.change = true;
                },
                sync: function (editor, html) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.dirigentes == '' || _this.valoresiniform.dirigentes == '&nbsp;' || _this.valoresiniform.dirigentes == '&nbsp;<br>' || _this.valoresiniform.dirigentes == '<br>') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.dirigentes = false;
                            else
                                _this.mod.dirigentes = true;
                        } else if (_this.valoresiniform.dirigentes != html)
                            _this.mod.dirigentes = true;
                        else
                            _this.mod.dirigentes = false;
                    }
                }
            }
        });
        //campo para la fecha de inicio del objetivo
        _this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finiobj',
            endDateField: 'ffinobj',
            allowBlank: false,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            format: 'd/m/Y',
            readOnly: readonlyObj,
            hideTrigger: readonlyObj,
            anchor: '95%',
            vtype: 'rangoFechas',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.fechainicio !== c.getValue().format('d/m/Y')) {
                                    _this.mod.fechainicio = true;
                                } else {
                                    _this.mod.fechainicio = false;
                                }
                            }
                        }, c);
                    }
                    //Validar campo tiempo estimado al escribir en el campo de las fechas
                    c.getEl().on('keyup', function () {
                        if (this.isValid()) {
                            _this.validarHorasLaborables(this, _this.ffin);
                        }
                    }, c);
                },
                change: function () {
                    _this.change = true;
                }
            },
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    if (date > _this.ffin.getValue()) {
                        _this.ffin.setValue(date);
                    }
                    this.setMaxValue(_this.ffin.getValue());
                    if (_this.estamodificando == 1) {
                        (_this.valoresiniform.fechainicio != date.format('d/m/Y')) ? _this.mod.fechainicio = true : _this.mod.fechainicio = false;
                    }
                    _this.validarHorasLaborables(this, _this.ffin);
                }
            }
        });
        //campo para la fecha de fin del objetivo
        _this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffinobj',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            format: 'd/m/Y',
            allowBlank: false,
            startDateField: 'finiobj',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            readOnly: readonlyObj,
            hideTrigger: readonlyObj,
            anchor: '95%',
            vtype: 'rangoFechas',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.fechafin !== c.getValue().format('d/m/Y')) {
                                    _this.mod.fechafin = true;
                                } else {
                                    _this.mod.fechafin = false;
                                }
                            }
                        }, c);
                        //Validar campo tiempo estimado al escribir en el campo de las fechas
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                _this.validarHorasLaborables(_this.fini, this);
                            }
                        }, c);
                    }
                },
                change: function () {
                    _this.change = true;
                }
            },
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                    if (date < _this.fini.getValue()) {
                        _this.fini.setValue(date);
                    }
                    this.setMinValue(_this.fini.getValue());
                    if (_this.estamodificando == 1) {
                        (_this.valoresiniform.fechainicio != date.format('d/m/Y')) ? _this.mod.fechainicio = true : _this.mod.fechainicio = false;
                    }
                    _this.validarHorasLaborables(_this.fini, this);
                }
            }
        });
        //campo para el estado de cumplimiento del objetivo
        _this.estadocumplimiento = new Ext.form.TextField({
            id: 'estadocumplimientoobj',
            fieldLabel: 'Estado de cumplimiento',
            allowBlank: false,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '95%'
        });
        //campo para el grado de cumplimiento del objetivo
        _this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocumpobj',
            maxValue: 100,
            minValue: 0,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            allowNegative: false,
            value: 0,
            readOnly: readonlyObj,
            anchor: '95%',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.porcientocump != c.getValue()) {
                                _this.mod.porcientocump = true;
                            } else {
                                _this.mod.porcientocump = false;
                            }
                        }, c);
                    }
                },
                change: function () {
                    _this.change = true;
                }
            }
        });
        //Campo tiempo estimado del objetivo
        _this.tiempoestimado = new Ext.form.NumberField({
            fieldLabel: 'Tiempo estimado (horas)',
            id: 'tiempoestimadobj',
            maxValue: horaslaborables,
            maxText: 'Solo admite números enteros positivos entre 0 y ' + horaslaborables + '. Con 2 cifras decimales.',
            allowNegative: false,
            readOnly: readonlyObj,
            value: 0,
            anchor: '95%',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        change = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        if (this.isValid()) {
                            c.getEl().on('keyup', function () {
                                if (_this.valoresiniform.tiempoestimado != c.getValue().toString()) {
                                    _this.mod.tiempoestimado = true;
                                } else {
                                    _this.mod.tiempoestimado = false;
                                }
                            }, c);
                        }
                    }
                }
            }
        });

        this.stcbCategoriaObjetivo = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcategoriaobjetivo',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcategoriaobj',
                root: "data"
            }, [{
                name: 'idcategoriaobj'
            }, {
                name: 'dennomenclador'
            }, {
                name: 'objetivo'
            }]),
            listeners: {
                beforeload: function (st, opt) {
                },
                load: function (store, records, options) {

                }
            }
        });

        this.cbCategoriaObjetivo = new Ext.form.ComboBox({
            fieldLabel: 'Categoría del objetivo',
            store: _this.stcbCategoriaObjetivo,
            hiddenName: 'idcategoriaobj',
            valueField: 'idcategoriaobj',
            displayField: 'dennomenclador',
            typeAhead: true,
            readOnly: readonlyObj,
            mode: 'remote',
            triggerAction: 'all',
            loadingText: 'Cargando datos',
            anchor: '95%',
            emptyText: 'Seleccione',
            forceSelection: true,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.categoriaobjetivo != record.data.idnomenclador) {
                            _this.mod.categoriaobjetivo = true;
                        } else {
                            _this.mod.categoriaobjetivo = false;
                        }
                    }
                },
                expand: function (combo) {
                    _this.stcbCategoriaObjetivo.reload();
                }
            }
        });

        _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(arrayidobjetivos[0], 1, _this.estamodificando, idautor);

        //campo donde marco si el objetivo es o no principal();
        _this.chprincipal = new Ext.form.Checkbox({
            boxLabel: 'Principal',
            checked: false,
            fieldLabel: '',
            labelSeparator: ''
        });
        //panel donde muestro los datos generales
        _this.pdatosgenerales = new Ext.Panel({
            title: 'Datos generales',
            id: 'idDatosGenerales',
            frame: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.fini, _this.ffin]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.estadocumplimiento, _this.porcientocump]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.cbCategoriaObjetivo, _this.tiempoestimado]
                        }

                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    id: 'tabPanelObjBottom',
                                    activeTab: 0,
                                    height: 270,
                                    items: [
                                        _this.pclasificadorinvol,
                                        {
                                            xtype: 'panel',
                                            id: 'pparticipantes',
                                            title: 'Participantes',
                                            layout: 'fit',
                                            items: [_this.heparticipantes]
                                        }, {
                                            xtype: 'panel',
                                            id: 'pdirigentes',
                                            title: 'Dirigentes',
                                            layout: 'fit',
                                            items: [_this.hedirigentes]
                                        }, {
                                            xtype: 'panel',
                                            id: 'pdescripcion',
                                            title: 'Descripci&oacute;n',
                                            layout: 'fit',
                                            items: [_this.hedescripcion]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Contenidos asociados',
                                            id: 'panelGD',
                                            layout: 'fit',
                                            items: [_this.objcmpgestordoc.CrearGridDocAsociados(accion, _this.arrayidobjetivos[0])]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        //panel de relaciones
        _this.prelaciones = _this.objcmprelaciones.CrearCmpRelaciones(_this.estamodificando, 1, arrayidobjetivos[0],
            permiso, PostAccionesGestionar, _this.DestruirWinCrudObjetivos, _this.comboRelacionesDisable);
        //tabpanel donde muestro los datos del objetivo
        _this.tpdatosobjetivo = new Ext.TabPanel({
            height: 420,
            activeTab: 0,
            frame: true,
            items: [_this.pdatosgenerales, _this.prelaciones],
            listeners: {
                tabchange: function (tabpanel, relaciones) {
                    //console.log(_this.tpdatosobjetivo.getActiveTab().id);
                    //if(_this.tpdatosobjetivo.getActiveTab().id == 'idDatosGenerales'){
                    //    _this.btnCancelarCrudObj.prevTab = '';
                    //}else{
                    //    _this.btnCancelarCrudObj.prevTab = 'idbtnEliminarRelaciones';
                    //}
                    //console.log(_this.btnCancelarCrudObj.prevTab);
                    _this.objcmprelaciones.stTGRelaciones.on('load', function () {
                        if (relaciones == _this.prelaciones && contador == 1) {
                            arrayrelaciones_ini = _this.objcmprelaciones.ObtenerIDElementosRelacionados();
                            contador++;
                        }
                    })

                }
            }
        });

        //texto donde muestro el autor del objetivo
        _this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        //formulario con atributos del objetivo
        _this.fpCrudObjetivos = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        var idElementoConFoco = document.activeElement.id;
                        (!_this.btnAceptarCrudObj.disabled && idElementoConFoco != 'tfbuscarInv') ? Ext.getCmp('btacep').handler.call(this) : null;
                    }
                }],
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
                        items: [_this.tpdatosobjetivo]
                    }, {
                        columnWidth: 1,
                        bodyStyle: 'padding:5px 5px',
                        layout: 'form',
                        items: [_this.lfautor]
                    }
                ]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    (valid) ? _this.btnAceptarCrudObj.setDisabled(false) : _this.btnAceptarCrudObj.setDisabled(true);

                    if (_this.estamodificando == 1) {
                        if (valid && (_this.objclasificadorinvol.modificarInv
                            || _this.mod.denominacion || _this.mod.descripcion
                            || _this.mod.dirigentes || _this.mod.participantes
                            || _this.mod.fechainicio || _this.mod.fechafin
                            || _this.mod.tiempoestimado
                            || _this.mod.porcientocump
                            || _this.mod.categoriaobjetivo
                            || _this.objcmprelaciones.modificarRelaciones))
                            _this.btnAceptarCrudObj.setDisabled(false);
                        else
                            _this.btnAceptarCrudObj.setDisabled(true);
                    }
                }
            }
        });
        _this.btnCancelarCrudObj = new Ext.Button({
            id: 'btnCancelarCrudObj',
            nextTab: (_this.estamodificando) ? 'btacep' : 'btnAplicarCrudObj',
            prevTab: 'idbtnEliminarRelaciones',
            iconCls: 'cancelar',
            text: 'Cancelar',
            hidden: true,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.winCrudObjetivos.destroy();
                _this.btnaplicar = false;
                if (sm.hasSelection() != null)
                    sm.clearSelections();
            }
        });
        _this.btnAceptarCrudObj = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'btacep',
            prevTab: (_this.estamodificando) ? 'btnCancelarCrudObj' : 'btnAplicarCrudObj',
            hidden: true,
            nextTab: 'tfdenominacionobj',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.CrudObjetivos(PostAccionesGestionar, accion, aplicar = 0);
            },
            listeners: {
                show: function () {
                    // _this.btnAceptarCrudObj.focus(true);
                }
            }
        });
        _this.btnAplicarCrudObj = new Ext.Button({
            id: 'btnAplicarCrudObj',
            nextTab: 'btacep',
            prevTab: 'btnCancelarCrudObj',
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: true,
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.CrudObjetivos(PostAccionesGestionar, accion, aplicar = 1);
                _this.btnaplicar = true;
            },
            listeners: {
                show: function () {
                    // _this.btnAceptarCrudObj.focus(true);
                }
            }
        });
        _this.btnCerrarCrudObj = new Ext.Button({
            id: 'btnCerrarCrudObj',
            iconCls: 'cerrar',
            nextTab: 'btnCerrarCrudObj',
            prevTab: 'btnCerrarCrudObj',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            hidden: true,
            handler: function () {
                _this.winCrudObjetivos.destroy();
            }
        });

        _this.winCrudObjetivos = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' objetivo',
            width: 750,
            height: 560,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                    _this.fini.setValue(fechainicio);
                    //_this.ffin.setValue(fechafin);
                    if (accion == 'Adicionar') {
                        _this.ffin.setMinValue(_this.fini.getValue());
                        _this.ffin.setValue(_this.fini.getValue());
                    }
                    if (!usarGD) {
                        //Ext.getCmp('panelGD').disable();
                        var tabpanel = Ext.getCmp('tabPanelObjBottom');
                        var panelGD = Ext.getCmp('panelGD');
                        tabpanel.remove(panelGD, true);
                    }
                },
                beforedestroy: function () {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                destroy: function (win) {
                    contador = 1;
                    arrayrelaciones_ini = [];
                    arrayinvolucrados_ini = [];
                    _this.btnaplicar = false;
                    readonlyObj = false;
                    _this.comboRelacionesDisable = false;
                    _this.change = false;
                    horaslaborables = 24;
                    _this.mod = ({
                        denominacion: false,
                        descripcion: false,
                        participantes: false,
                        dirigentes: false,
                        fechainicio: false,
                        fechafin: false,
                        porcientocump: false,
                        estadocumplimiento: false,
                        tiempoestimado: false,
                        categoriaobjetivo: false
                    });
                    _this.objcmprelaciones.modificarRelaciones = false;
                    _this.objclasificadorinvol.ResetearArregloDeInvolucradosEliminar();
                }
            },
            buttons: [_this.btnCancelarCrudObj, _this.btnAplicarCrudObj, _this.btnAceptarCrudObj, _this.btnCerrarCrudObj],
            items: [_this.fpCrudObjetivos]
        });
        _this.winCrudObjetivos.on('beforeshow', function () {
            _this.tfdenominacion.focus(false, 700);
        });

        _this.winCrudObjetivos.doLayout();
        _this.winCrudObjetivos.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion) {
            case 'Adicionar':
                _this.btnCancelarCrudObj.setVisible(true);
                _this.btnAceptarCrudObj.setVisible(true);
                _this.btnAplicarCrudObj.setVisible(true);
                _this.objclasificadorinvol.cargarInvolConfPerfil(1);
                break;
            default:
                var accionejecutada = 'que usted quiere modificar';
                if (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Duplicar' || accion == 'Relacionar elementos al') {
                    if (accion == 'Modificar' || accion == 'Duplicar') {
                        if (accion == 'Duplicar') {
                            accionejecutada = 'que usted quiere duplicar';
                        }
                        _this.btnCancelarCrudObj.setVisible(true);
                        _this.btnAceptarCrudObj.setVisible(true);
                    }
                    if (accion == 'Ver datos del' || accion == 'Relacionar elementos al') {
                        readonlyObj = true;
                        accionejecutada = 'al cual usted quiere ver sus datos';
                        if (accion == 'Relacionar elementos al') {
                            accionejecutada = 'al cual usted quiere relacionar elementos';
                            _this.pdatosgenerales.disable();
                            _this.tpdatosobjetivo.activate(_this.prelaciones);
                        }
                        _this.btnCerrarCrudObj.setVisible(true);
                        _this.objclasificadorinvol.tpinvolucrados.disable();
                        if (accion == 'Ver datos del') {
                            _this.comboRelacionesDisable = true;
                            _this.objcmprelaciones.btnRelacionar.setVisible(false);
                            _this.objcmprelaciones.btnEliminarRelaciones.setVisible(false);
                            _this.cbCategoriaObjetivo.clearInvalid();
                            _this.cbCategoriaObjetivo.on('expand', function () {
                                _this.cbCategoriaObjetivo.collapse();
                            });
                        }
                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarformobjetivo',
                        params: {
                            idobjetivo: arrayidobjetivos[0]
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                mostrarMensaje(1, 'El objetivo ' + accionejecutada + ' ya no se encuentra en los registros.');
                                _this.winCrudObjetivos.destroy();
                                PostAccionesGestionar();
                            } else {
                                _this.BarraProgreso.hide();
                                if (accion == 'Modificar' || accion == 'Relacionar elementos al' || accion == 'Ver datos del') {
                                    _this.heparticipantes.setValue(responseData.data[0].participantes);
                                    _this.hedirigentes.setValue(responseData.data[0].dirigentes);
                                    _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                                    _this.valoresiniform.participantes = responseData.data[0].participantes;
                                    _this.valoresiniform.dirigentes = responseData.data[0].dirigentes;
                                }
                                if (accion == 'Duplicar') {
                                    if (_this.subordinado == 1) {
                                        _this.heparticipantes.setValue(responseData.data[0].participantes);
                                        _this.hedirigentes.setValue(responseData.data[0].dirigentes);

                                        _this.objclasificadorinvol.stGInvolucrados.reload({
                                            params: {
                                                idelemento: _this.arrayidobjetivos[0],
                                                idtipoelemento: 1
                                            }
                                        });
                                        _this.objcmprelaciones.stTGRelaciones.reload({});
                                    }
                                }
                                _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                                _this.fini.setValue(responseData.data[0].fechainicio);
                                _this.ffin.setValue(responseData.data[0].fechafin);
                                _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                                _this.tiempoestimado.setValue(responseData.data[0].tiempoestimado);
                                _this.cbCategoriaObjetivo.setValue(responseData.data[0].categoriaobj.idcategoriaobj);
                                _this.cbCategoriaObjetivo.setRawValue(responseData.data[0].categoriaobj.denominacion);
                                if (responseData.data[0].actualiza_gradocump == 0) {
                                    _this.porcientocump.disable();
                                }
                                _this.estadocumplimiento.setValue(responseData.data[0].estadocumplimiento);
                                _this.hedescripcion.setValue(responseData.data[0].descripcion);

                                _this.datos_ini = _this.fpCrudObjetivos.getForm().getValues(true);
                                arrayinvolucrados_ini = _this.objclasificadorinvol.ObtenerInvolucrados(true);

                                _this.valoresiniform.denominacion = responseData.data[0].denominacion;
                                _this.valoresiniform.descripcion = responseData.data[0].descripcion;
                                _this.valoresiniform.fechainicio = responseData.data[0].fechainicio;
                                _this.valoresiniform.fechafin = responseData.data[0].fechafin;
                                _this.valoresiniform.porcientocump = responseData.data[0].gradocumplimiento;
                                _this.valoresiniform.estadocumplimiento = responseData.data[0].estadocumplimiento;
                                _this.valoresiniform.tiempoestimado = responseData.data[0].tiempoestimado;
                                _this.valoresiniform.categoriaobjetivo = responseData.data[0].categoriaobj;
                                //Validar campos del formulario
                                _this.validarHorasLaborables(_this.fini, _this.ffin);

                            }
                        }
                    });
                }
        }
    };

    this.CrearCmpCriterio = function (idobjetivo, nombreobjetivo, permisomodificar, idautorobjetivo, stTGCmpObjetivos) {
        //menu derecho del grid de los objetivos
        _this.menuderechoTGCmpCriterios = new Ext.menu.Menu({
            items: [{
                text: 'Modificar criterio de medida',
                iconCls: 'modificar',
                hideOnClick: true,
                handler: function () {
                    _this.CrearWinCriterio('Modificar', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
                }
            }, {
                text: 'Eliminar criterio de medida',
                iconCls: 'eliminar',
                hideOnClick: true,
                handler: function () {
                    _this.EliminarCriterios();
                }
            }, {
                text: 'Ver datos del criterio de medida',
                iconCls: 'ver',
                hideOnClick: true,
                handler: function () {
                    _this.CrearWinCriterio('Ver datos del', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
                }
            }]
        });

        _this.idobjetivo = idobjetivo;
        _this.idautorobjetivo = idautorobjetivo;
        if (_this.winCmpCriterio) {
            _this.winCmpCriterio.destroy();
        }

        //botones para la gestion de los criterios
        _this.btnAdicionarCriterio = new Ext.Button({
            handler: function () {
                _this.CrearWinCriterio('Adicionar', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
            },
            disabled: true,
            iconCls: 'adicionar',
            tooltip: 'Adicionar criterio',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });
        _this.btnModificarCriterio = new Ext.Button({
            handler: function () {
                _this.CrearWinCriterio('Modificar', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
            },
            disabled: true,
            iconCls: 'modificar',
            tooltip: 'Modificar criterio',
            key: {
                alt: true,
                key: 'M'
            },
            scope: this
        });
        _this.btnEliminarCriterio = new Ext.Button({
            handler: function () {
                _this.EliminarCriterios();
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar criterio',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        _this.btnVerCriterio = new Ext.Button({
            handler: function () {
                _this.CrearWinCriterio('Ver datos del', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
            },
            disabled: true,
            iconCls: 'ver',
            tooltip: 'Ver datos del criterio',
            key: {
                alt: true,
                key: 'D'
            },
            scope: this
        });

		    _this.btnGestionarIndicadores = new Ext.Button({
				    handler: function () {
              _this.gestionarIndicadores(_this.idobjetivo, nombreobjetivo);
				    },
				    // disabled: true,
				    iconCls: 'gestionarindicadores',
				    tooltip: 'Gestionar indicadores',
				    // key: {
						 //    alt: true,
						 //    key: 'G'
				    // },
				    scope: this
		    });

        _this.btnGuardarCriterio = new Ext.Button({
            handler: function () {
                _this.GuardarCambiosCriterio()
            },
            disabled: true,
            iconCls: 'guardar',
            tooltip: 'Guardar cambios',
            key: {
                alt: true,
                key: 'G'
            },
            scope: this
        });

        _this.btnVerNotif = new Ext.Button({
            id: 'btnnoticriterio',
            disabled: false,
            iconCls: 'notificaciones',
            tooltip: 'Consultar notificaciones generadas',
            handler: function () {
                var objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
                    {
                        MostrarFiltroPorTipoElem: true,
                        UsarBtnCerrar: false,
                        maxWinPrincipal: false,
                        closeableWinPrincipal: true,
                        Mostrartitle: 'Registro de notificaciones',
                        noUsarAyuda: true
                    });
                objCmpNotificaciones.CargarCmpNotificaciones(4);
            },
            key: {
                ctrl: true,
                key: 'O'
            }
        });

		 //btnActCumplimientoCM
        this.btn100CM = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-verde',
            tooltip: 'Actualizar criterios de medida al 100% de cumplimiento',
            id: 'btnActualizar100CMAct',
//        prevTab: 'btnGestPuntualizarAct',
//        nextTab: 'btnActualizarValorAct',
            handler: function () {
                _this.actualizarCumplimientoCM();
            },
            key: {
                ctrl: true,
                alt: true,
                key: 'Z'
            }
        });

        this.btnOtroValorCM = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-amarilla',
            tooltip: 'Actualizar cumplimiento de los criterios de medida',
            id: 'btnActualizarValorAct',
//        prevTab: 'btnActualizar100Act',
//        nextTab: 'btnLimpiarAct',
            handler: function () {
                _this.actualizarCumplimientoParcialCM();
            }
        });
		
        if (permisomodificar == 1) {
            _this.btnAdicionarCriterio.enable();
        }

        _this.smTGCmpCriterio = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (_this.prevrowcriterio >= 0 && _this.prevrowcriterio != indiceFila) {
                        Ext.get(_this.TGCmpCriterio.getView().getRow(_this.prevrowcriterio)).removeClass('superior2');
                        Ext.get(_this.TGCmpCriterio.getView().getRow(_this.prevrowcriterio)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.TGCmpCriterio.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.TGCmpCriterio.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrowcriterio = indiceFila;
                    } else
                        _this.prevrowcriterio = -1;
                    _this.ActualizarEstadoBarraHerramientasCriterios();
                },
                rowdeselect: function (sm, indiceFila, record) {

                    if (_this.prevrowcriterio >= 0 && _this.prevrowcriterio != indiceFila) {
                        Ext.get(_this.TGCmpCriterio.getView().getRow(_this.prevrowcriterio)).removeClass('superior2');
                        Ext.get(_this.TGCmpCriterio.getView().getRow(_this.prevrowcriterio)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.TGCmpCriterio.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.TGCmpCriterio.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrowcriterio = indiceFila;
                    } else
                        _this.prevrowcriterio = -1;
                    _this.ActualizarEstadoBarraHerramientasCriterios();
                }
            }
        });

        _this.stTGCmpCriterio = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarcriterios',
            reader: new Ext.data.JsonReader({
                id: 'idcriteriomedida',
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'idcriteriomedida'
            }, {
                name: 'denominacion'
            }, {
                name: 'valormeta'
            }, {
                name: 'valoreal'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'estadocumplimiento'
            }, {
                name: 'nombreautor'
            }, {
                name: 'subordinado'
            }, {
                name: 'superior'
            }, {
                name: 'modificar'
            }, {
                name: 'eliminar'
            }, {
                name: 'idautor'
            }, {
                name: 'evaluacion'
            }]),
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idobjetivo = _this.idobjetivo;
                },
                load: function (store, record, options) {
                    _this.ActualizarEstadoBarraHerramientasCriterios();
                    _this.smTGCmpCriterio.selectFirstRow();
                }
            }
        });
        var color = '';
        _this.cmTGCmpCriterio = new Ext.grid.ColumnModel(
            [
                _this.smTGCmpCriterio,
                {
                    header: 'CAR',
                    dataIndex: 'idcriteriomedida',
                    width: 80,
                    sortable: true
                }, {
                header: "Denominaci&oacute;n",
                id: 'expandir',
                dataIndex: 'denominacion',
                sortable: true,
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Fecha de Inicio",
                dataIndex: 'fechainicio',
                width: 100,
                sortable: true
            }, {
                header: "Fecha de Fin",
                dataIndex: 'fechafin',
                width: 100,
                sortable: true
            }, {
                header: "Autor",
                dataIndex: 'nombreautor',
                width: 90,
                sortable: true
            }, {
                header: "Valor meta",
                dataIndex: 'valormeta',
                width: 80,
                sortable: true,
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            }, {
                header: "Valor real",
                dataIndex: 'valoreal',
                width: 80,
                sortable: true,
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            }, {
                header: "Evaluaci&oacute;n",
                dataIndex: 'evaluacion',
                width: 80,
                sortable: true,
                renderer: MostrarImagenEvaluacion
            }, {
                header: "Estado de cumplimiento",
                dataIndex: 'estadocumplimiento',
                width: 165,
                sortable: true,
                renderer: MostrarImagenEstadoCumplimiento
            }
            ]);
        _this.TGCmpCriterio = new Ext.grid.EditorGridPanel({
            autoWidth: true,
            width: '100%',
            height: '50%',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            border: false,
            sm: _this.smTGCmpCriterio,
            store: _this.stTGCmpCriterio,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando criterios'
            },
            clicksToEdit: 1,
            cm: _this.cmTGCmpCriterio,
            tbar: [_this.btnAdicionarCriterio, ' ', _this.btnModificarCriterio, ' ', _this.btnEliminarCriterio, ' ',
                _this.btnVerCriterio, ' ', _this.btnVerNotif, ' ',_this.btnGestionarIndicadores,' ', _this.btnGuardarCriterio, ' ', _this.btn100CM, ' ', _this.btnOtroValorCM],
            menuderecho: _this.menuderechoTGCmpCriterios,
            listeners: {
                rowcontextmenu: function (grid, row, e) {
                    _this.TGCmpCriterio.getSelectionModel().selectRow(row);
                    if (_this.arrayidcriterios.length == 1) {
                        e.stopEvent();
                        var xy = e.getXY();
                        _this.menuderechoTGCmpCriterios.showAt(xy);
                    }
                },
                afteredit: function (e) {
                    if (e.value != e.originalValue)
                        _this.btnGuardarCriterio.enable()
                },
                rowdblclick: function () {
                    _this.CrearWinCriterio('Modificar', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
                }
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.stTGCmpCriterio,
                displayInfo: true
            })
        });

        _this.stTGCmpCriterio.reload({
            params: {
                limit: 20,
                start: 0
            }
        });
        _this.TGCmpCriterio.getView().getRowClass = function (ri, n) {
            if (ri.data.superior == 1)
                return "superior";
            else
                return "";
        };
        _this.pcmpcriterio = new Ext.Panel({
            items: [_this.TGCmpCriterio],
            usarKeymap: true,
            height: 540,
            layout: 'fit',
            width: 1000,
            botonesKeymap: [_this.btnAdicionarCriterio, _this.btnModificarCriterio, _this.btnEliminarCriterio,
                _this.btnVerCriterio, _this.btnVerNotif, _this.btnGuardarCriterio]
        });
        _this.winCmpCriterio = new Ext.Window({
            title: 'Criterios de medidas del objetivo : "' + nombreobjetivo + '"',
            modal: true,
            resizable: false,
            constrain: true,
            width: 1000,
            layout: 'fit',
            height: 540,
            items: [_this.pcmpcriterio],
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.winCmpCriterio.destroy();
                        if (_this.gestionado == 1) {
                            stTGCmpObjetivos.reload();
                        }
                    }
                }
            ]
        });
        _this.winCmpCriterio.show();
    };

	this.actualizarCumplimientoCM = function(porciento) {

        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/actualizarPorcientoCM',
            params: {
                listadoId:Ext.encode(_this.arrayidcriterios),
                campo: 'idcriteriomedida',
                porciento : porciento || 100
            },
            callback: function (options, success, response) {

                if (success) {
                    mostrarMensaje(1, 'Los criterios de medida han sido modificados satisfactoriamente.');

                    _this.btn100CM.disable();
                    _this.smTGCmpCriterio.clearSelections();
                    var start = (_this.TGCmpCriterio.getBottomToolbar().getPageData().activePage - 1) * (_this.TGCmpCriterio.getBottomToolbar().cbPageSize.getValue());
                    _this.stTGCmpCriterio.reload({
                        params: {
                            limit: 20,
                            start: start
                        }
                    });
                }
            }
        });
    };

    this.actualizarCumplimientoParcialCM = function(){
        Ext.Msg.prompt('Criterio de medida', 'Porciento de cumplimiento:', function(btn, text){
            var porciento = parseInt(text);
            if (btn == 'ok' && (porciento >= 0 && porciento <= 100)){
                _this.actualizarCumplimientoCM(porciento);
            }
        });
    }

    this.gestionarIndicadores=function (idobjetivo, nombreobjetivo) {
		    var _this = this;
        _this.objGestionarIndicadores.crearWinPrincipal(idobjetivo, nombreobjetivo);

    }
	
    this.GuardarCambiosCriterio = function () {
        var _this = this;
        filasmodificadas = [];

        filasmodificadas = _this.TGCmpCriterio.getStore().getModifiedRecords();
        var campos_modificados = [];
        for (var i = 0; i < filasmodificadas.length; i++) {
            el =
            {
                valorreal: filasmodificadas[i].data.valoreal,
                valormeta: filasmodificadas[i].data.valormeta,
                fechainicio: filasmodificadas[i].data.fechainicio,
                fechafin: filasmodificadas[i].data.fechafin,
                dencriterio: filasmodificadas[i].data.denominacion,
                idumedida: filasmodificadas[i].data.idumedida,
                estadocumplimiento: filasmodificadas[i].data.estadocumplimiento

            };
            el.idcriterio = filasmodificadas[i].data.idcriteriomedida;
            campos_modificados.push(el)
        }
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/salvarCambiosCriterio',
            params: {
                criterios: Ext.encode(campos_modificados),
                idobjetivo: _this.idobjetivo
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {

                    mostrarMensaje(1, 'El criterio de medida ha sido modificado satisfactoriamente.');
                    _this.stTGCmpCriterio.reload();
                    _this.btnGuardarCriterio.disable();
                }
            }
        });
    };

    this.CrearWinCriterio = function (accion, fechainicio, fechafin, criterio) {
        var dirty = false;
        if (_this.winCrudCriterio) {
            _this.winCrudCriterio.destroy();
        }
        _this.estamodificandocriterio = 0;
        if (accion == 'Modificar' || accion == 'Ver datos del') {
            _this.estamodificandocriterio = 1;
        }
        //campo para la denominacion del criterio
        _this.tfdenominacioncriterio = new Ext.form.TextField({
            id: 'tfdenominacioncrit',
            prevTab: (accion == 'Ver datos del') ? 'btnCerrarCrudCrit' : 'btnAceptarCrudCrit',
            nextTab: '',
            name: 'tfdenominacioncrit',
            fieldLabel: 'Denominación',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            anchor: '100%',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificandocriterio == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniCriterio.denominacion !== c.getValue().toString()) {
                                _this.modCriterio.denominacion = true;
                            } else {
                                _this.modCriterio.denominacion = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para la descripcion del criterio
        _this.hedescripcioncriterio = new Ext.form.HtmlEditor({
            id: 'hedescripcioncrit',
            name: 'hedescripcioncrit',
            width: 640,
            height: 230,
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
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                },
                sync: function (editor, html) {
                    if (_this.estamodificandocriterio == 1) {
                        if (_this.valoresiniCriterio.descripcion == '') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.modCriterio.descripcion = false;
                            else
                                _this.modCriterio.descripcion = true;
                        } else if (_this.valoresiniCriterio.descripcion != html)
                            _this.modCriterio.descripcion = true;
                        else
                            _this.modCriterio.descripcion = false;
                    }
                }
            }
        });
        //campo donde muestro los participantes del criterio
        _this.heparticipantescriterio = new Ext.form.HtmlEditor({
            id: 'heparticipantescrit',
            name: 'heparticipantescrit',
            width: 640,
            height: 230,
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
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                },
                sync: function (editor, html) {
                    if (_this.estamodificandocriterio == 1) {
                        if (_this.valoresiniCriterio.participantes == '') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.modCriterio.participantes = false;
                            else
                                _this.modCriterio.participantes = true;
                        } else if (_this.valoresiniCriterio.participantes != html)
                            _this.modCriterio.participantes = true;
                        else
                            _this.modCriterio.participantes = false;
                    }
                }
            }
        });
        //campo para la fecha de inicio del criterio
        _this.finicriterio = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finicrit',
            name: 'finicrit',
            endDateField: 'ffincrit',
            allowBlank: false,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '95%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.ffincriterio.setMinValue(date);
                    if (date > _this.ffincriterio.getValue()) {
                        _this.ffincriterio.setValue(date);
                    }
                    //Modificar
                    if (_this.estamodificandocriterio == 1) {
                        if (_this.valoresiniCriterio.fechainicio != date.format('d/m/Y')) {
                            _this.modCriterio.fechainicio = true;
                        } else {
                            _this.modCriterio.fechainicio = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function (c) {
                    if (_this.estamodificandocriterio == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniCriterio.fechainicio != c.getValue().format('d/m/Y')) {
                                    _this.modCriterio.fechainicio = true;
                                } else {
                                    _this.modCriterio.fechainicio = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para la fecha de fin del criterio
        _this.ffincriterio = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffincrit',
            name: 'ffincrit',
            format: 'd/m/Y',
            readOnly: true,
            allowBlank: false,
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '95%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.finicriterio.setMaxValue(date);
                    //Modificar
                    if (_this.estamodificandocriterio == 1) {
                        if (_this.valoresiniCriterio.fechafin != date.format('d/m/Y')) {
                            _this.modCriterio.fechafin = true;
                        } else {
                            _this.modCriterio.fechafin = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function (c) {
                    if (_this.estamodificandocriterio == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniCriterio.fechafin != c.getValue().format('d/m/Y')) {
                                    _this.modCriterio.fechafin = true;
                                } else {
                                    _this.modCriterio.fechafin = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });
        _this.rpositivo = new Ext.form.Radio({
            hideLabel: true,
            boxLabel: 'Positivo',
            checked: true,
            name: 'reval',
            inputValue: '1'
        });
        _this.rnegativo = new Ext.form.Radio({
            hideLabel: true,
            boxLabel: 'Negativo',
            name: 'reval',
            inputValue: '0',
            listeners: {
                check: function (e, val) {
                    if (_this.tfvalorreal.isValid() && _this.tfvalormeta.isValid()) {
                        porcentajeCumplimiento();
                    }
                    //modificar
                    if (_this.estamodificandocriterio == 1) {
                        if (val) {
                            checkpositivo = false;
                        } else {
                            checkpositivo = true;
                        }
                        if (_this.valoresiniCriterio.positivo != checkpositivo) {
                            _this.modCriterio.negativo = true;
                        } else {
                            _this.modCriterio.negativo = false;
                        }
                    }
                }
            }
        });
        //campo para el grado de cumplimiento del criterio
        _this.porcientocumpcriterio = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocumpcrit',
            name: 'porcientocumpcrit',
            allowNegative: true,
            readOnly: true,
            value: 0,
            anchor: '95%',
            listeners: {
                focus: function (t) {
                    if (_this.tfvalorreal.isValid() && _this.tfvalormeta.isValid()) {
                        porcentajeCumplimiento();
                    }
                }
            }
        });
        //store para el combo donde muestro la unidad de medida

        _this.cbum = new Utilidades.Cmp.TreeCombo({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarunidadesmedidas',
            id: 'cbumedida',
            name: 'cbumedida',
            selectOnlyLeaf: true,
            fieldLabel: 'Unidad de medida',
            allowBlank: false,
            emptyText: 'Seleccione',
            anchor: '95%',
            listeners: {
                select: function (combo, record, index) {
                    if (accion == 'Modificar') {

                        if (_this.valoresiniCriterio.um != _this.cbum.getValue()) {
                            _this.modCriterio.um = true;
                        } else {
                            _this.modCriterio.um = false;
                        }
                    }
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniCriterio.um != c.getValue()) {
                                    _this.modCriterio.um = true;
                                } else {
                                    _this.modCriterio.um = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para el valor meta
        _this.tfvalormeta = new Ext.form.TextField({
            id: 'tfvalormeta',
            name: 'tfvalormeta',
            maxLength: 19,
            maxLengthText: 'El tamaño máximo requerido es 19 caracteres.',
            fieldLabel: 'Valor meta',
            regex: /^([-]?[0-9]+([.][0-9]{0,2}){0,1})$/,
            maskRe: /^([0-9.])$/,
            regexText: 'Solo admite números enteros de hasta 19 dígitos.',
            allowBlank: false,
            allowNegative: false,
            anchor: '90%',
            listeners: {
                blur: function (t) {
                    if (_this.tfvalorreal.isValid()) {
                        porcentajeCumplimiento();
                    }
                },
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificandocriterio == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniCriterio.valorMeta !== c.getValue().toString()) {
                                _this.modCriterio.valorMeta = true;
                            } else {
                                _this.modCriterio.valorMeta = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para el valor real
        _this.tfvalorreal = new Ext.form.TextField({
            id: 'tfvalorreal',
            name: 'tfvalorreal',
            fieldLabel: 'Valor real',
            maxLength: 19,
            maxLengthText: 'El tamaño máximo requerido es 19 caracteres.',
            regexText: 'Solo admite números enteros de hasta 19 dígitos.',
            regex: /^([-]?[0-9]+([.][0-9]{0,2}){0,1})$/,
            maskRe: /^([0-9.-])$/,
            allowBlank: false,
            allowNegative: false,
            anchor: '90%',
            listeners: {
                blur: function (t) {
                    if (_this.tfvalormeta.isValid()) {
                        porcentajeCumplimiento();
                    }
                },
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificandocriterio == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniCriterio.valorReal !== c.getValue().toString()) {
                                _this.modCriterio.valorReal = true;
                            } else {
                                _this.modCriterio.valorReal = false;
                            }
                        }, c);
                    }
                }
            }
        });
        if (accion == 'Ver datos del') {
            Ext.getCmp('tfdenominacioncrit').readOnly = true;
            Ext.getCmp('tfvalorreal').readOnly = true;
            Ext.getCmp('tfvalormeta').readOnly = true;
            Ext.getCmp('cbumedida').disabled = true;
        }
        if (criterio)
            _this.pclasificadorinvolcrit = _this.objclasificadorinvolCriterio.CrearClasificadorInvolCrit('', criterio, _this.estamodificandocriterio, '');
        else
            _this.pclasificadorinvolcrit = _this.objclasificadorinvolCriterio.CrearClasificadorInvolCrit(_this.idobjetivo, _this.arrayidcriterios[0], _this.estamodificandocriterio, _this.idautorobjetivo);

        _this.pdatosgeneralescriterio = new Ext.Panel({
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.finicriterio, {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [_this.tfvalormeta]
                            }, {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [_this.tfvalorreal]
                            }
                        ]
                    }]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.ffincriterio, _this.porcientocumpcriterio]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.cbum, {
                        xtype: 'fieldset',
                        checkboxToggle: false,
                        title: 'Evaluación:',
                        height: 60,
                        style: "padding-top:0px; padding-bottom:0px",
                        collapsed: false,
                        items: [{
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.rpositivo]
                                }, {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.rnegativo]
                                }
                            ]
                        }]
                    }]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'tabpanel',
                        activeTab: 0,
                        height: 270,
                        items: [
                            _this.pclasificadorinvolcrit,
                            {
                                xtype: 'panel',
                                title: 'Participantes',
                                layout: 'fit',
                                items: [_this.heparticipantescriterio]
                            }, {
                                xtype: 'panel',
                                title: 'Descripci&oacute;n',
                                layout: 'fit',
                                items: [_this.hedescripcioncriterio]
                            }]
                    }]
                }]
            }]
        });
        //texto donde muestro el autor del objetivo
        _this.lfautorCriterio = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        //formulario con atributos del objetivo
        _this.fpCrudCriterios = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfdenominacioncriterio]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.pdatosgeneralescriterio]
                    }, {
                        columnWidth: 1,
                        bodyStyle: 'padding:5px 5px',
                        layout: 'form',
                        items: [_this.lfautorCriterio]
                    }
                ]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAplicarCrudCrit.enable();
                        _this.btnAceptarCrudCrit.enable();
                    } else {
                        _this.btnAplicarCrudCrit.disable();
                        _this.btnAceptarCrudCrit.disable();
                    }
                    //Modificar
                    if (_this.estamodificandocriterio == 1) {
                        if (valid && (_this.objclasificadorinvolCriterio.modificarInv
                                || _this.modCriterio.denominacion
                                || _this.modCriterio.descripcion
                                || _this.modCriterio.participantes
                                || _this.modCriterio.fechainicio
                                || _this.modCriterio.fechafin
                                || _this.modCriterio.valorMeta
                                || _this.modCriterio.valorReal
                                || _this.modCriterio.um
                                || _this.modCriterio.negativo
                            )) {
                            _this.btnAceptarCrudCrit.enable();
                        } else {
                            _this.btnAceptarCrudCrit.disable();
                        }
                    }
                }
            }
        });

        _this.btnCancelarCrudCrit = new Ext.Button({
            iconCls: 'cancelar',
            id: 'btnCancelarCrudCrit',
            prevTab: '',
            nextTab: (accion == 'Modificar') ? 'btnAceptarCrudCrit' : 'btnAplicarCrudCrit',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            hidden: true,
            handler: function () {
                _this.winCrudCriterio.destroy();
                _this.datoscrit_ini = '';
                _this.datoscrit_fin = '';
                _this.array_invol_ini = [];
                _this.array_invol_fin = [];
                _this.heparticipantescriterio = '';
                _this.hedescripcioncriterio = '';
            }
        });
        _this.btnAplicarCrudCrit = new Ext.Button({
            iconCls: 'aplicar ',
            id: 'btnAplicarCrudCrit',
            prevTab: 'btnCancelarCrudCrit',
            nextTab: 'btnAceptarCrudCrit',
            text: 'Aplicar ',
            tooltip: 'Guardar datos y limpiar campos',
            hidden: true,
            disabled: true,
            handler: function () {
                _this.CrudCriterios('Aplicar');
            }
        });
        _this.btnAceptarCrudCrit = new Ext.Button({
            iconCls: 'aceptar ',
            id: 'btnAceptarCrudCrit',
            prevTab: (accion == 'Modificar') ? 'btnCancelarCrudCrit' : 'btnAplicarCrudCrit',
            nextTab: 'tfdenominacioncrit',
            text: 'Aceptar ',
            tooltip: 'Guardar datos y cerrar ventana',
            hidden: true,
            disabled: true,
            handler: function () {
                if (accion == 'Modificar') {
                    if (validarModificacionCrit())
                        _this.CrudCriterios(accion);
                } else
                    _this.CrudCriterios(accion);
            }
        });

        _this.btnCerrarCrudCrit = new Ext.Button({
            iconCls: 'cerrar',
            id: 'btnCerrarCrudCrit',
            prevTab: '',
            nextTab: 'tfdenominacioncrit',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            hidden: true,
            handler: function () {
                _this.winCrudCriterio.destroy();
            }
        });
        _this.winCrudCriterio = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            layout: 'fit',
            title: accion + ' criterio de medida',
            width: 700,
            height: 540,
            constrain: true,
            resizable: false,
            listeners: {
                beforeshow: function (win) {
                    _this.finicriterio.setValue(fechainicio);
                    _this.ffincriterio.setValue(fechafin);
                },
                destroy: function (win) {
                    //modificar
                    _this.modCriterio.denominacion = false;
                    _this.modCriterio.descripcion = false;
                    _this.modCriterio.participantes = false;
                    _this.modCriterio.fechainicio = false;
                    _this.modCriterio.fechafin = false;
                    _this.modCriterio.valorMeta = false;
                    _this.modCriterio.valorReal = false;
                    _this.modCriterio.um = false;
                    _this.modCriterio.negativo = false;
                    _this.objclasificadorinvolCriterio.ResetearArregloDeInvolucradosEliminar();
                    _this.objclasificadorinvolCriterio.modificarInv = false;
                }
            },
            buttons: [_this.btnCancelarCrudCrit, _this.btnAplicarCrudCrit, _this.btnAceptarCrudCrit, _this.btnCerrarCrudCrit],
            items: [_this.fpCrudCriterios]
        });
        _this.winCrudCriterio.doLayout();
        _this.winCrudCriterio.show();
        _this.tfdenominacioncriterio.focus(false, 1024);

        switch (accion) {
            case 'Adicionar':
                _this.btnCancelarCrudCrit.setVisible(true);
                _this.btnAceptarCrudCrit.setVisible(true);
                _this.btnAplicarCrudCrit.setVisible(true);
                break;
            default:
                if (criterio)
                    idcriterio = criterio;
                else
                    idcriterio = _this.arrayidcriterios[0];
                var accionejecutada = 'que usted quiere modificar';
                if (accion == 'Modificar' || accion == 'Ver datos del') {
                    if (accion == 'Modificar') {
                        _this.btnCancelarCrudCrit.setVisible(true);
                        _this.btnAceptarCrudCrit.setVisible(true);
                    }
                    if (accion == 'Ver datos del') {
                        accionejecutada = 'al cual usted quiere ver sus datos';
                        _this.btnCerrarCrudCrit.setVisible(true);
                        _this.objclasificadorinvolCriterio.tpinvolucradosCriterio.disable();
                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/cargarformcriterio',
                        params: {
                            idcriterio: idcriterio
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                mostrarMensaje(1, 'El criterio ' + accionejecutada + ' ya no se encuentra en los registros.');
                                _this.winCrudCriterio.destroy();
                                _this.stTGCmpCriterio.reload({
                                    params: {
                                        limit: 20,
                                        start: 0
                                    }
                                });
                            } else {
                                _this.BarraProgreso.hide();
                                _this.cbum.cargar(responseData.data[0].um.denominacion, responseData.data[0].um.idumedida),
                                    _this.heparticipantescriterio.setValue(responseData.data[0].participantes);
                                _this.lfautorCriterio.setText('Autor: ' + responseData.data[0].autor);
                                _this.tfdenominacioncriterio.setValue(responseData.data[0].denominacion);
                                _this.finicriterio.setValue(responseData.data[0].fechainicio);
                                _this.ffincriterio.setValue(responseData.data[0].fechafin);
                                _this.porcientocumpcriterio.setValue(responseData.data[0].gradocumplimiento);
                                /* _this.estadocumplimientocriterio.setValue(responseData.data[0].evaluacion);*/
                                _this.hedescripcioncriterio.setValue(responseData.data[0].descripcion);
                                _this.tfvalormeta.setValue(responseData.data[0].valormeta);
                                _this.tfvalorreal.setValue(responseData.data[0].valoreal);
                                if (responseData.data[0].evaluacion == '0') {
                                    _this.rnegativo.setValue(true);
                                    _this.rpositivo.setValue(false);
                                }
                                //para valida modificacion
                                _this.datoscrit_ini = _this.fpCrudCriterios.getForm().getValues(true);
                                _this.array_invol_ini = _this.objclasificadorinvolCriterio.ObtenerInvolucradosCriterios(true);
                                _this.heparticipantescriterio_ini = _this.heparticipantescriterio.getValue();
                                _this.hedescripcioncriterio_ini = _this.hedescripcioncriterio.getValue();

                                //Var para el MODIFICAR
                                _this.valoresiniCriterio.denominacion = responseData.data[0].denominacion;
                                _this.valoresiniCriterio.descripcion = responseData.data[0].descripcion;
                                _this.valoresiniCriterio.participantes = responseData.data[0].participantes;
                                _this.valoresiniCriterio.fechainicio = responseData.data[0].fechainicio;
                                _this.valoresiniCriterio.fechafin = responseData.data[0].fechafin;
                                _this.valoresiniCriterio.valorMeta = responseData.data[0].valormeta;
                                _this.valoresiniCriterio.valorReal = responseData.data[0].valoreal;
                                _this.valoresiniCriterio.um = responseData.data[0].um.idumedida;
                                if (responseData.data[0].evaluacion == '0') {
                                    _this.valoresiniCriterio.positivo = false;
                                } else {
                                    _this.valoresiniCriterio.positivo = true;
                                }
                            }
                        }
                    });
                }
        }
    };

    this.DestruirWinCrudObjetivos = function () {
        _this.winCrudObjetivos.destroy();
    };

    this.CrudObjetivos = function (PostAccionesGestionar, accion, aplicar) {
        var idobjetivopadre = _this.arrayidobjetivos[0];
        url = 'adicionarobjetivo';
        waitMsg = 'Guardando datos del objetivo';
        postaccion = 'adicionado';
        existe = 'adicionar';
        elementosrelacionados = _this.objcmprelaciones.ObtenerElementosRelacionados();
        if (_this.arrayelementosrelacionadosinicial.length > 0) {
            for (var i = 0; i < _this.arrayelementosrelacionadosinicial.length; i++) {
                elementosrelacionados.push(_this.arrayelementosrelacionadosinicial[i]);
            }
        }
        if (accion == 'Modificar') {
            var idobjetivo = _this.arrayidobjetivos[0];
            idobjetivopadre = _this.sm.getSelections()[0].data._parent;
            url = 'modificarobjetivo';
            waitMsg = 'Guardando datos del objetivo';
            postaccion = 'modificado';
            existe = 'modificar';
            //elementosrelacionados = [];
        }
        if (accion == 'Duplicar') {
            idobjetivo = _this.arrayidobjetivos[0];
            idobjetivopadre = _this.arrayidobjetivos[1];
            waitMsg = 'Duplicando objetivo';
            postaccion = 'duplicado';
        }
        var arraydocumentos = [];
        if (usarGD)
            arraydocumentos = _this.objcmpgestordoc.ObtenerDocumentos();
        _this.BarraProgreso.show(waitMsg);
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
        var objprincipal = this.EsPrincipal();
        _this.fpCrudObjetivos.getForm().submit({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/' + url,
            params: {
                idobjetivopadre: idobjetivopadre,
                eshija: _this.eshija,
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                idobjetivo: idobjetivo,
                arrayelementosrelacionados: Ext.encode(elementosrelacionados),
                documentos: Ext.encode(arraydocumentos)
            },
            failure: function (form, action) {
                _this.BarraProgreso.hide();
                if (action.result.mensaje == 1) {
                    mostrarMensaje(1, 'El objetivo ha sido ' + postaccion + ' satisfactoriamente.');
                    if (aplicar == 0) {
                        _this.winCrudObjetivos.destroy();
                        PostAccionesGestionar(action.result.mensaje, accion);
                    } else {
                        _this.fpCrudObjetivos.getForm().reset();
                        _this.objclasificadorinvol.ResetearCampos();
                        _this.objcmprelaciones.ResetearRelaciones();
                        _this.validarHorasLaborables(_this.fini, _this.ffin);
                    }
                }
                if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'El objetivo que quiere ' + existe + ' ya existe.');
                }
                if (action.result.mensaje == 0) {
                    mostrarMensaje(1, 'El objetivo al cual usted quiere agregarle un objetivo hijo ya no se encuentra en los registros.');
                    _this.winCrudObjetivos.destroy();
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
                if (action.result.mensaje == 3) {
                    mostrarMensaje(1, 'El objetivo que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudObjetivos.destroy();
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
            }
        });
    };

    //para validar datos nulos(ARA)
    function validarModificacionCrit() {
        var result = true;
        _this.datoscrit_fin = _this.fpCrudCriterios.getForm().getValues(true);
        _this.array_invol_fin = _this.objclasificadorinvolCriterio.ObtenerInvolucradosCriterios(true);
        _this.heparticipantescriterio_fin = (_this.heparticipantescriterio.getValue() != '') ? _this.heparticipantescriterio.getValue() : '';
        _this.hedescripcioncriterio_fin = (_this.hedescripcioncriterio.getValue() != '') ? _this.hedescripcioncriterio.getValue() : '';

        var pParticActivo = _this.datoscrit_fin.lastIndexOf('&heparticipantescrit');
        var pDescripActivo = _this.datoscrit_fin.lastIndexOf('&hedescripcioncrit');
        if (pParticActivo != -1 && pDescripActivo != -1)
            var replazardesde = (pParticActivo < pDescripActivo) ? pParticActivo : pDescripActivo;
        else
            var replazardesde = (pParticActivo != -1) ? pParticActivo : pDescripActivo;
        if (replazardesde != -1)
            _this.datoscrit_fin = _this.datoscrit_fin.replace(_this.datoscrit_fin.substring(replazardesde), '');

        if (_this.datoscrit_fin === _this.datoscrit_ini
            && _this.array_invol_ini.toString() === _this.array_invol_fin.toString()
            && _this.heparticipantescriterio_ini === _this.heparticipantescriterio_fin
            && _this.hedescripcioncriterio_ini === _this.hedescripcioncriterio_fin) {
            mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
            result = false;
        }
        return result;
    }

    this.CrudCriterios = function (accion) {
        url = 'adicionarcriterio';
        waitMsg = 'Guardando datos del criterio de medida';
        postaccion = 'adicionado';
        if (accion == 'Modificar') {
            url = 'modificarcriterio';
            waitMsg = 'Guardando datos del criterio de medida';
            postaccion = 'modificado';
            elementosrelacionados = [];
        }
        _this.BarraProgreso.show(waitMsg);
        var arrayinvolucrados = _this.objclasificadorinvolCriterio.ObtenerInvolucradosCriterios();
        _this.fpCrudCriterios.getForm().submit({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/' + url,
            params: {
                idobjetivo: _this.idobjetivo,
                idcriterio: _this.arrayidcriterios[0],
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                idum: _this.cbum.getValue()
            },
            failure: function (form, action) {
                _this.BarraProgreso.hide();
                if (action.result.mensaje == 2) {
                    if (accion == 'Modificar') {
                        mostrarMensaje(1, 'El criterio de medida que quiere modificar ya existe.');
                    } else
                        mostrarMensaje(1, 'El criterio de medida que quiere adicionar ya existe.');
                }
                if (action.result.mensaje == 1) {
                    mostrarMensaje(1, 'El criterio de medida ha sido ' + postaccion + ' satisfactoriamente.');
                    _this.stTGCmpCriterio.reload();
                    if (accion != 'Aplicar') {
                        _this.winCrudCriterio.destroy();
                    } else {
                        /*   _this.stTGCmpCriterio.reload();*/
                        _this.gestionado = 1;
                        _this.datoscrit_ini = '';
                        _this.datoscrit_fin = '';
                        _this.array_invol_ini = [];
                        _this.array_invol_fin = [];
                        _this.heparticipantescriterio = '';
                        _this.hedescripcioncriterio = '';
                        _this.cbum.resetNode();
                        _this.fpCrudCriterios.getForm().reset();
                        _this.objclasificadorinvolCriterio.ResetearCriterio();
                    }
                }
                if (action.result.mensaje == 0) {
                    mostrarMensaje(1, 'El objetivo al cual usted quiere agregarle un criterio de medida ya no se encuentra en los registros.');
                    _this.winCrudCriterio.destroy();
                    _this.winCmpCriterio.destroy();
                }
                if (action.result.mensaje == 3) {
                    mostrarMensaje(1, 'El criterio de medida que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudCriterio.destroy();
                    _this.stTGCmpCriterio.reload({
                        params: {
                            limit: 20,
                            start: 0
                        }
                    });
                }
            }
        });
    };

    this.EliminarObjetivos = function (arrayidobjetivos, PostAccionesGestionar, smTGCmpObjetivos) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '';
        if (arrayidobjetivos.length == 1) {
            mensaje = '¿Está seguro que quiere eliminar el objetivo seleccionado?';
            mensajemascara = 'Eliminando objetivo';
            mensajeconfirmacion = 'El objetivo ha sido eliminado satisfactoriamente.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar los objetivos seleccionados?';
            mensajemascara = 'Eliminando objetivos';
            mensajeconfirmacion = 'Los objetivos han sido eliminados satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarobjetivos',
                    params: {
                        arrayidobjetivos: Ext.encode(arrayidobjetivos)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar(1, 'Eliminar');
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidobjetivos.length > 1)
                                mensajeconfirmacion2 = 'Los objetivos que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'El objetivo que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(1, mensajeconfirmacion2);
                            PostAccionesGestionar(0, 'Eliminar');
                        }
                    }
                });
            } else {
                if (smTGCmpObjetivos.hasSelection())
                    smTGCmpObjetivos.clearSelections();
            }
        });
    };

    this.HacerRaizObjetivos = function (arrayidobjetivos, smTGCmpObjetivos, stTGCmpObjetivos, start) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion0 = '';
        if (arrayidobjetivos.length == 1) {
            mensaje = '¿Está seguro que quiere reorganizar el sub-objetivo seleccionado?';
            mensajemascara = 'Moviendo objetivo';
            mensajeconfirmacion = 'El sub-objetivo ha sido reordenado satisfactoriamente.';
            mensajeconfirmacion0 = 'No se ha podido reordenar el sub-objetivo seleccionado.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar los objetivos seleccionados?';
            mensajemascara = 'Eliminando objetivos';
            mensajeconfirmacion = 'Los sub-objetivos han sido reordenados satisfactoriamente.';
            mensajeconfirmacion0 = 'No se han podido reordenar los sub-objetivos seleccionados.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/hacerRaizObjetivos',
                    params: {
                        arrayidobjetivos: Ext.encode(arrayidobjetivos)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion0, function () {
                                //_this.arrayidobjetivosReorganizar = [];
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            stTGCmpObjetivos.reload({
                                params: {
                                    anode: null,
                                    start: start
                                }
                            });
                            smTGCmpObjetivos.clearSelections();
                        }
                    }
                });
            } else {
                if (smTGCmpObjetivos.hasSelection())
                    smTGCmpObjetivos.clearSelections();
            }
        });
    };

    this.EliminarCriterios = function () {
        var mensaje = '', mensajemascara = '', mensajefin = '', mensajeconfirmacion2 = '';
        mensaje = '¿Est&aacute; seguro que quiere eliminar el criterio seleccionado? ';
        mensajemascara = 'Eliminando criterio';
        mensajefin = 'El criterio ha sido eliminado satisfactoriamente.';
        mensajeconfirmacion2 = 'El criterio que usted quiere eliminar ya no se encuentra en los registros.';
        if (_this.arrayidcriterios.length > 1) {
            mensaje = '¿Est&aacute; seguro que quiere eliminar los criterios seleccionados? ';
            mensajemascara = 'Eliminando criterios';
            mensajefin = 'Los criterios han sido eliminados satisfactoriamente.';
            mensajeconfirmacion2 = 'Los criterios que usted quiere eliminar ya no se encuentran en los registros.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarcriterios',
                    params: {
                        arrayidcriterios: Ext.encode(_this.arrayidcriterios)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 2) {
                            mostrarMensaje(1, mensajefin);
                            _this.stTGCmpCriterio.removeAll();
                            _this.stTGCmpCriterio.reload({
                                params: {
                                    limit: 20,
                                    start: 0
                                }
                            });
                            _this.gestionado = 1;
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2);
                            _this.stTGCmpCriterio.removeAll();
                            _this.stTGCmpCriterio.reload({
                                params: {
                                    limit: 20,
                                    start: 0
                                }
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajefin);
                            _this.stTGCmpCriterio.removeAll();
                            _this.stTGCmpCriterio.reload({
                                params: {
                                    limit: 20,
                                    start: 0
                                }
                            });
                            _this.gestionado = 1;
                        }
                    }
                });
            }
        });
    };

    this.EsPrincipal = function () {
        if (_this.chprincipal.getValue() == true) {
            esprincipal = 1
        } else
            (esprincipal = 0);
        return esprincipal;
    };

    this.AnalizarProcesoDuplicado = function (objobjetivo, PostAccionesGestionar, arrayidobjetivos, arrayelementosrelacionadosinicial) {
        arrayidobjetivos[1] = objobjetivo._parent;
        _this.subordinado = objobjetivo.subordinado;
        _this.CrearWinCrudObjetivos(
            new Date().format('d/m/Y'),
            new Date().format('d/m/Y'),
            'Duplicar',
            PostAccionesGestionar,
            arrayidobjetivos,
            null,
            (objobjetivo._parent != null) ? 1 : 0,
            permisomodificar = 1,
            permisoeliminar = 1,
            arrayelementosrelacionadosinicial
        );
    };

    _this.ActualizarEstadoBarraHerramientasCriterios = function () {
        _this.arrayidcriterios = [];
        _this.btnModificarCriterio.disable();
        _this.btnEliminarCriterio.disable();
        _this.btnVerCriterio.disable();
		 _this.btn100CM.disable();
        _this.btnOtroValorCM.disable();
        if (_this.smTGCmpCriterio.hasSelection()) {
            var arrayrecords = _this.smTGCmpCriterio.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
				_this.btn100CM.enable();
                _this.btnOtroValorCM.enable();
                var puedemodificar = 1;
                var puedeeliminar = 1;
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidcriterios[i] = arrayrecords[i].data.idcriteriomedida;
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificarCriterio.enable();
                    _this.permitirmodificar = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminarCriterio.enable();
                }
            }
            if (totalrecords == 1) {
                _this.btnVerCriterio.enable();
            }
        }
    };

    this.GetRangeDay = function (date_ini, date_end) {
        date_iniold = arr_dates[arr_dates.length - 2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if (date_iniold && date_ini != date_iniold) {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates / 1000 / 60 / 60 / 24; //conviertiendolo a días
            result_date = date_ini.add(Date.DAY, result_day); //obteniendo nueva fecha dado el rango de días
            return result_date;
        } else
            return date_ini;
    };

    this.compararArray = function (arrayIni, arrayTemp) {
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
                }
                else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };

    //funcion para mostrar el icono "estado de cumplimiento"
    function MostrarImagenEstadoCumplimiento(val) {
        if (val) {

            val0 = val;
            val1 = val0.split("(");
            val2 = val1[1].split("%");
            val3 = val2[0] * 1;
            if (val3 <= 0 || val3 >= 95) {
                return '<span class="' + color + ' icondistra-bandera ">' + ' ' + val + '</span>';
            }
            if (val3 > 0 && val3 < 95) {
                return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
            }
            /* if (val3 >= 95) {
             return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
             }*/
        }
    }

    function MostrarImagenEvaluacion(val) {
        if (val == 1) {
            color = "sipac-verde";
            return '<span class="icondistra-aprobar sipac-verde"></span>';
        } else {
            color = "sipac-roja";
            return '<span class="icondistra-desaprobar sipac-roja"></span>';
        }
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        return ('<center>' + val.substring(8, 10) + ' / ' + val.substring(5, 7) + ' / ' + val.substring(0, 4) + '</center>');
    }

    //funcion para calcular el porcentaje de cumplimiento segun valores meta y real
    function porcentajeCumplimiento() {
        var promedio = 0;
        if (_this.tfvalormeta.isValid() && _this.tfvalorreal.isValid()) {
            if (_this.rnegativo.getValue()) {
                if (_this.tfvalorreal.getValue() < 0) {
                    promedio = (-1) * ((((_this.tfvalorreal.getValue() - _this.tfvalormeta.getValue()) * 100) / _this.tfvalormeta.getValue()));
                }
                else {
                    promedio = (-1) * ((_this.tfvalorreal.getValue() / _this.tfvalormeta.getValue()) * 100);
                }
            }
            else {
                promedio = (_this.tfvalorreal.getValue() / _this.tfvalormeta.getValue()) * 100;
            }
            _this.porcientocumpcriterio.setValue(Math.round(promedio * 100) / 100);
        }
    }

    //Funcion para validar los dias laborables que existen entre dos fechas
    this.validarHorasLaborables = function (fini, ffin) {
        if (fini.isValid() && ffin.isValid()) {
            horaslaborables = ((((ffin.getValue() - fini.getValue()) / 86400) / 1000) + 1) * 24;  //24 horas
            _this.tiempoestimado.maxValue = horaslaborables;
            var maxText = 'Solo admite números enteros positivos entre 0 y ' + horaslaborables + '. Con 2 cifras decimales.';
            _this.tiempoestimado.maxText = maxText;
            _this.tiempoestimado.validate();
        }
    };

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor) {
        return '<span class="icondistra-unidadmedida sipac-azul">' + ' ' + valor + '</span>';
    }
};
