Utilidades.Cmp.Cmpcrudactividades = function () {
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    //gestor documental en false para que levante la interfaz en calendario
    var usarGD = false;

    this.porciento = 100;
    this.eshija = 0;
    this.primerconteo = 'no';
    this.arrayidactividades = [];
    this.arrayrepeticionesseleccionadas = [];
    this.arrayelementosrelacionadosinicial = [];
    this.arrayidactrep = [];
    this.prevrowrep = -1;
    this.contadorid = 0;
    this.radioChekiado = 1;
    this.superior = 0;
    this.actividadpadre = null;
    var arr_dates = [];
    var arr_hour = [];
    var guardarcambios = false;
    this.datos_ini = "";
    this.datos_fin = "";
    this.datos_repeticiones_ini = "";
    this.datos_repeticiones_fin = "";
    this.heparticipantes_ini = '';
    this.hedirigentes_ini = '';
    this.hedescripcion_ini = '';
    this.formatohora = 'H:i';
    this.tipoformato = 'hmilitar';
    this.hvalorminimo = '00:00';
    this.hvalormaximo = '23:59';
    this.btnaplicar = false;
    this.editorCuml;
    var hiddenButton = false;
    var contadorrelaciones = 1;
    var contadorrepeticiones = 1;
    var arrayinvolucrados_ini = [];
    var arrayinvolucrados_repeticiones_ini = [];
    var arrayrepeticiones_ini = [];
    var arrayrelaciones_ini = [];
    var arrayidrecursosasociados = [], arrayidrecursosdesasociados = [];
    var fechafinactmasundia = '';
    var horaslaborables = 24;
    var fechainiact = '';
    var recursosasociadosIni = '';
    var recursosIni = '';
    var reasignaciones = '';
    this.comboRelacionesDisable = false;
    this.recursosDisable = false;
    this.reasignacionHidden = false;
    this.mod = ({
        denominacion: false,
        descripcion: false,
        participantes: false,
        dirigentes: false,
        fechainicio: false,
        fechafin: false,
        horaini: false,
        horafin: false,
        lugar: false,
        porciento: false,
        categoria: false,
        tipoactividad: false,
        principal: false,
        automatico: false,
        porcientore: false,
        peso: false,
        efecto: false,
        tiempoestimado: false,
        criterioeval: false
    });
    this.valoresiniform = ({
        denominacion: '',
        descripcion: '',
        participantes: '',
        dirigentes: '',
        fechainicio: null,
        fechafin: null,
        horaini: '',
        horafin: '',
        lugar: '',
        porciento: '',
        categoria: '',
        tipoactividad: '',
        principal: '',
        manual: '',
        porcientore: '',
        peso: '',
        tiempoestimado: 0,
        criterioeval: ''
    });
    this.modRepeticion = ({
        fechaInicioRepeticion: false,
        fechaFinRepeticion: false,
        horaInicioRepeticion: false,
        horaFinRepeticion: false,
        lugarRepeticion: false
    });
    this.valoresInicialesFormRepeticion = ({
        fechaInicioRepeticion: null,
        fechaFinRepeticion: null,
        horaInicioRepeticion: '',
        horaFinRepeticion: '',
        lugarRepeticion: ''
    });

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();
    //objeto del componente actividad---recurso
    this.objactivrecurso = new Utilidades.Cmp.Cmpcrudactividadrecurso();

    //objeto del componente "control de reasignaciones"
    this.objcmpctrlreasignaciones = new Utilidades.Cmp.Cmpctrlreasignaciones();

    //objeto del componente "gestion documental"
    this.objcmpgestordoc = new Utilidades.Cmp.Cmpgestordocumental();

    //objeto del componente "fondo de tiempo"
    this.objcmpfondodetiempo = new Utilidades.Cmp.Cmpfondodetiempo();

    Ext.override(Ext.form.DateField,
        {
            onTriggerClick: function () {
                if (this.disabled) {
                    return;
                }
                if (this.menu == null) {
                    this.menu = new Ext.menu.DateMenu();
                }
                Ext.apply(this.menu.picker, {
                    startDay: (this.startDay) ? this.startDay : 0,
                    minDate: this.minValue,
                    maxDate: this.maxValue,
                    disabledDatesRE: this.ddMatch,
                    disabledDatesText: this.disabledDatesText,
                    disabledDays: this.disabledDays,
                    disabledDaysText: this.disabledDaysText,
                    format: this.format,
                    showToday: this.showToday,
                    minText: String.format(this.minText, this.formatDate(this.minValue)),
                    maxText: String.format(this.maxText, this.formatDate(this.maxValue))
                });
                this.menu.on(Ext.apply({}, this.menuListeners, {
                    scope: this
                }));
                this.menu.picker.setValue(this.getValue() || this.minValue || new Date());  // add this.minValue here ...
                this.menu.show(this.el, "tl-bl?");
            }
        });
    var cont = 0;

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudActividades = function (fechainicio, fechafin, horainicio, horafin, accion, PostAccionesGestionar,
                                             arrayidactividades, idautor, eshija, permisomodificar, permisoeliminar,
                                             arrayelementosrelacionadosinicial, sm, st,
                                             decalendario, porcientocumpl, actpadre, mipadre, permitirreasignar,
                                             maximizada, usuario_logueado) {
        var dirty = false;
        var disableform = false;
        if (accion == 'Suspender') {
            disableform = true;
        }

        _this.act_bienestar = false;

        _this.diasentrefechas = 0;
        if (sm != null && sm.hasSelection() == true) {
            _this.act_bienestar = (sm.getSelected().data.numcaso != "");
        }
        if (eshija == 1 && (accion == 'Modificar' || accion == 'Adicionar' || accion == 'Puntualizar')) {
            Ext.Ajax.request({
                url: 'ObtenerPorcientoRe',
                params: {
                    actividadpadre: mipadre
                },
                callback: function (options, success, response) {
                    _this.porciento = response.responseText;
                    if (accion == 'Adicionar') {
                        if (_this.porciento > 0)
                            _this.tfporciento_re.setValue(_this.porciento);
                        else
                            _this.tfporciento_re.setValue(0);
                        _this.MaxValue(0);
                    }
                }
            });
        }
        if (_this.winCrudActividades) {
            _this.winCrudActividades.destroy();
        }

        _this.arrayelementosrelacionadosinicial = [];
        if (arrayelementosrelacionadosinicial.length > 0) {
            _this.arrayelementosrelacionadosinicial = arrayelementosrelacionadosinicial;
        }
        _this.eshija = eshija;
        _this.arrayidactividades = arrayidactividades;
        _this.estamodificando = 0;
        _this.permisomodificar = permisomodificar;
        _this.permisoeliminar = permisoeliminar;
        if (_this.eshija == 1 && (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender')) {
            if (sm != null)
                _this.actividadpadre = sm.getSelected().data._parent;
            else
                _this.actividadpadre = actpadre;
        } else
            _this.actividadpadre = null;
        var activartabrep = 0;
        _this.arrayRepeticiones = [];
        var permiso = 1;
        var readonlyAct = false;
        if (accion == 'Ver datos de la' || accion == 'Control de reasignaciones de la') {
            readonlyAct = true;
        }
        _this.chefectocadena = new Ext.form.Checkbox({
            boxLabel: 'Efecto cadena',
            readOnly: readonlyAct,
            hidden: true,
            checked: true,
            listeners: {
                check: function (check, checked) {
                    if (_this.estamodificando == 1) {
                        if (checked) {
                            _this.mod.efecto = false;
                        } else {
                            _this.mod.efecto = true;
                        }
                    }
                }
            }
        });

        if (accion == 'Modificar' || accion == 'Ver datos de la'
            || accion == 'Relacionar elementos a la'
            || accion == 'Control de reasignaciones de la'
            || accion == 'Puntualizar'
            || accion == 'Suspender') {
            _this.chefectocadena.show();
            _this.estamodificando = 1;
        }
        if (accion == 'Ver datos de la') {
            _this.comboRelacionesDisable = true;
            _this.recursosDisable = true;
            _this.reasignacionHidden = true;
            hiddenButton = true;
        }
        //campo para la denominacion de la actividad
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionact',
            maxLength: 255,
            disabled: disableform,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            fieldLabel: 'Denominación',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,.:/()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            readOnly: readonlyAct,
            anchor: '100%',
            prevTab: 'btacepact',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.denominacion !== c.getValue().toString()) {
                                _this.mod.denominacion = true;
                            } else {
                                _this.mod.denominacion = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para la descripcion de la actividad
        _this.hedescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripcionact',
            width: 640,
            height: 230,
            readOnly: readonlyAct,
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
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.descripcion == '') {
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
            }
        });

        //campo donde muestro los participantes de la actividad
        _this.heparticipantes = new Ext.form.TextArea({
            id: 'heparticipantesact',
            width: 640,
            height: 230,
            readOnly: readonlyAct,
            //maxLength: 255,
            //maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            //regex: _this.ObjValidaciones.expresionRegular('denominacion-correo'),
            //maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            //regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion-correo'),
            //vtype: 'validarEspaciosEnBlanco',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.participantes !== c.getValue().toString()) {
                                _this.mod.participantes = true;
                            } else {
                                _this.mod.participantes = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //campo donde muestro los dirigentes de la actividad
        _this.hedirigentes = new Ext.form.TextArea({
            id: 'hedirigentesact',
            width: 640,
            height: 230,
            readOnly: readonlyAct,
            //maxLength: 255,
            //maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            //regex: _this.ObjValidaciones.expresionRegular('denominacion-correo'),
            //maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            //regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion-correo'),
            //vtype: 'validarEspaciosEnBlanco',
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.dirigentes !== c.getValue().toString()) {
                                _this.mod.dirigentes = true;
                            } else {
                                _this.mod.dirigentes = false;
                            }
                        }, c);
                    }
                }
            }
        });

        /*  //campo donde muestro los participantes de la actividad
         _this.heparticipantes = new Ext.form.HtmlEditor({
         id: 'heparticipantesact',
         width: 640,
         height: 230,
         readOnly: readonlyAct,
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
         editmodechange: function(editor) {
         editor.syncValue();
         },
         sync: function(editor, html) {
         if (_this.estamodificando == 1) {
         if (_this.valoresiniform.participantes == '') {
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
         //campo donde muestro los dirigentes de la actividad
         _this.hedirigentes = new Ext.form.HtmlEditor({
         id: 'hedirigentesact',
         width: 640,
         height: 230,
         readOnly: readonlyAct,
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
         editmodechange: function(editor) {
         editor.syncValue();
         },
         sync: function(editor, html) {
         if (_this.estamodificando == 1) {
         if (_this.valoresiniform.dirigentes == '') {
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
         });*/
        //campo para la fecha de inicio de la actividad
        _this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finiact',
            // endDateField: 'ffinact',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            readOnly: readonlyAct,
            hideTrigger: readonlyAct,
            enableKeyEvents: true,
            format: 'd/m/Y',
            // maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            //invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            // vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    _this.fini.setMaxValue(null);
                    _this.ffin.setMinValue(null);
                    this.setValue(date);

                    if (_this.estamodificando != 1 &&
                        _this.ffin.getRawValue() != "" && _this.restaFechas(_this.fini.getRawValue(), _this.ffin.getRawValue()) > -1)
                        _this.ffin.setValue(date);

                    if (this.getRawValue() != "") {
                        if (date > _this.ffin.getValue()) {
                            _this.ffin.setValue(date);
                        }//Modificar
                        if (_this.estamodificando == 1) {
                            if (_this.valoresiniform.fechainicio != date.format('d/m/Y')) {
                                _this.mod.fechainicio = true;
                            } else {
                                _this.mod.fechainicio = false;
                            }
                            _this.ffin.setValue(_this.sumarDiasFecha(this.getRawValue(), _this.diasentrefechas));
                        }
                        //Validar horas laborables segun la finicio y ffin
                        _this.validarHorasLaborables(this, _this.ffin);
                        _this.validarHoraInicioFin(_this.tmfhorafin, true);
                    }

                }
            },
            listeners: {
                'render': function (c) {
                    //Validar campo tiempo estimado al escribir en el campo de las fechas
                    c.getEl().on('keyup', function () {
                        if (this.isValid()) {
                            if (_this.estamodificando == 1) {
                                if (_this.valoresiniform.fechainicio != c.getValue().format('d/m/Y')) {
                                    _this.mod.fechainicio = true;
                                } else {
                                    _this.mod.fechainicio = false;
                                }
                            }
                            _this.validarHorasLaborables(this, _this.ffin);
                            _this.validarHoraInicioFin(_this.tmfhorafin, true);
                        }
                    }, c);
                }
            }
        });
        //campo para la fecha de fin de la actividad
        _this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffinact',
            // startDateField: 'finiact',
            // minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            format: 'd/m/Y',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            readOnly: readonlyAct,
            hideTrigger: readonlyAct,
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '95%',
            // vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    _this.fini.setMaxValue(null);
                    _this.ffin.setMinValue(null);
                    this.setValue(date);
                    if (_this.fini.getRawValue() != "" && _this.restaFechas(_this.fini.getRawValue(), _this.ffin.getRawValue()) < 0)
                        this.markInvalid('La fecha de inicio tiene que ser menor o igual a la fecha fin.');

                    //Modificar

                    if (this.getRawValue() != "") {
                        if (_this.estamodificando == 1) {
                            if (_this.valoresiniform.fechafin != date.format('d/m/Y')) {
                                _this.mod.fechafin = true;
                            } else {
                                _this.mod.fechafin = false;
                            }
                        }
                        //Validar horas laborables segun la finicio y ffin
                        _this.validarHorasLaborables(_this.fini, this);
                        _this.validarHoraInicioFin(_this.tmfhorafin, true);
                    }

                }
            },
            listeners: {
                'render': function (c) {
                    //Validar campo tiempo estimado al escribir en el campo de las fechas
                    c.getEl().on('keyup', function () {
                        if (this.isValid()) {
                            if (_this.estamodificando == 1) {
                                if (_this.valoresiniform.fechafin != c.getValue().format('d/m/Y')) {
                                    _this.mod.fechafin = true;
                                } else {
                                    _this.mod.fechafin = false;
                                }
                            }
                            _this.validarHorasLaborables(_this.fini, this);
                            _this.validarHoraInicioFin(_this.tmfhorafin, true);
                        }
                    }, c);
                }
            }
        });
        //campo para el estado de cumplimiento de la actividad
        _this.estadocumplimiento = new Ext.form.TextField({
            id: 'estadocumplimientoact',
            fieldLabel: 'Estado de cumplimiento',
            allowBlank: false,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '95%'
        });
        //campo para el grado de cumplimientode la actividad
        _this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocumpact',
            maxValue: 100,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            readOnly: (readonlyAct || _this.act_bienestar),
            regexText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            allowNegative: false,
            value: 0,
            anchor: '95%',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.porciento != c.getValue().toString()) {
                                _this.mod.porciento = true;
                            } else {
                                _this.mod.porciento = false;
                            }
                        }, c);
                    }
                }
            }
        });

        if (decalendario && idautor == null) {
            idautor = 'nulo';
        }
        _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(arrayidactividades[0], 3, _this.estamodificando, idautor);

        //store para el combo donde muestro la categoria de la actividad
        _this.stCmbCategorias = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcategoriasactividad',
            reader: new Ext.data.JsonReader({
                id: 'idcategoria',
                root: "data"
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }])
        });

        //combo donde muestro la categoria de la actividad
        _this.cbbcat = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            fieldLabel: 'Categor&iacute;a de la actividad',
            store: _this.stCmbCategorias,
            hiddenName: 'idcategoria',
            valueField: 'idcategoria',
            displayField: 'denominacion',
            triggerAction: 'all',
            readOnly: readonlyAct,
            editable: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            listeners: {
                expand: function (combo) {
                    _this.stCmbCategorias.reload();
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.categoria != record.data.idcategoria) {
                            _this.mod.categoria = true;
                        } else {
                            _this.mod.categoria = false;
                        }
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.categoria != c.getValue()) {
                                _this.mod.categoria = true;
                            } else {
                                _this.mod.categoria = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //store para el combo donde muestro el tipo de la actividad
        _this.stCmbTipo = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                name: 'idtipo'
            }, {
                name: 'denominacion'
            }])
        });
        //combo donde muestro el tipo de la actividad
        _this.cbbtipo = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            fieldLabel: 'Tipo de actividad',
            store: _this.stCmbTipo,
            hiddenName: 'idtipo',
            valueField: 'idtipo',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            readOnly: readonlyAct,
            listeners: {
                expand: function (combo) {
                    _this.stCmbTipo.reload();
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.tipoactividad != record.data.idtipo) {
                            _this.mod.tipoactividad = true;
                        } else {
                            _this.mod.tipoactividad = false;
                        }
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.tipoactividad != c.getValue()) {
                                _this.mod.tipoactividad = true;
                            } else {
                                _this.mod.tipoactividad = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //campo de texto donde muestro el lugar de la actividad
        _this.tflugar = new Ext.form.TextField({
            fieldLabel: 'Lugar',
            id: 'tflugaract',
            readOnly: readonlyAct,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            anchor: '95%',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.lugar !== c.getValue().toString()) {
                                _this.mod.lugar = true;
                            } else {
                                _this.mod.lugar = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //campo donde muestro la hora de inicio de la actividad
        _this.tmfhora = new Ext.form.TimeField({
            fieldLabel: 'Hora de inicio',
            format: _this.formatohora,
            minValue: _this.hvalorminimo,
            maxValue: _this.hvalormaximo,
            increment: 15,
            readOnly: readonlyAct,
            value: horainicio, //'8:00 AM',
            //id: 'tmfhoraact',
            editable: true,
            emptyText: 'Seleccione',
            anchor: '95%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato establecido: hh:mm am/pm.',
            allowBlank: false,
            validationEvent: false,
            listeners: {
                beforeselect: function (combo, record, index) {
                    arr_hour.push(Date.parseDate(combo.getValue(), _this.formatohora));
                    //si retornas true te permite seleccionar y false cancela la seleccion
                    if (!_this.fini.isValid() || !_this.ffin.isValid()) {
                        combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
                        return false;
                    } else if (!_this.tmfhorafin.isValid() && _this.tmfhorafin.getValue() != '') {
                        combo.markInvalid('Debe validar el campo hora de fin.');
                        return false;
                    } else if (_this.tmfhorafin.getValue() == '') {
                        combo.clearInvalid();
                        return true;
                    } else {
                        var vHoraFinal = Date.parseDate(_this.tmfhorafin.getValue(), _this.formatohora).format("U");
                        var vHoraInicial = Date.parseDate(record.get('text'), _this.formatohora).format("U");
                        var vFechaInicial = (_this.fini.getValue()).format('d/m/Y');
                        var vFechaFin = (_this.ffin.getValue()).format('d/m/Y');
                        var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
                        var valorindex = 0;
                        if (nopuedeSeleccionar) {
                            if (index == 95) {
                                valorindex = record.store.data.items[index].data.text;
                            } else if(index < 88 ) {
                                valorindex = record.store.data.items[index + 8].data.text;
                            }else if(index >= 88 && index < 95 ) {
                                valorindex = record.store.data.items[index + 1].data.text;
                            }
                           //console.log(index)
                           // valorindex = record.store.data.items[index + 8].data.text;
                            var valor = record.store.data.items[index].data.text;
                            _this.tmfhorafin.setValue(valorindex);
                            _this.tmfhora.setValue(valor);
                            combo.clearInvalid();
                            _this.tmfhorafin.clearInvalid();

                            //combo.markInvalid("La hora de inicio debe ser menor que la hora de fin.");
                        } else {
                            combo.clearInvalid();
                            _this.tmfhorafin.clearInvalid();
                        }
                        return !nopuedeSeleccionar;
                    }
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.horaini != record.data.text) {
                            _this.mod.horaini = true;
                        } else {
                            _this.mod.horaini = false;
                        }
                    }
                },
                'render': function (c) {
                    //Validar campo al escribir
                    c.getEl().on('keyup', function () {
                        if (_this.estamodificando == 1) {
                            if (this.isValid()) {
                                if (_this.valoresiniform.horaini != this.getValue()) {
                                    _this.mod.horaini = true;
                                } else {
                                    _this.mod.horaini = false;
                                }
                            }
                        }
                        _this.validarHoraInicioFin(this, false);
                    }, c);
                },
                blur: function (c) {
                    _this.validarHoraInicioFin(c, false);
                }
            }
        });
        //campo donde muestro la hora de fin de la actividad
        _this.tmfhorafin = new Ext.form.TimeField({
            fieldLabel: 'Hora de fin',
            format: _this.formatohora,
            minValue: _this.hvalorminimo,
            maxValue: _this.hvalormaximo,
            increment: 15,
            readOnly: readonlyAct,
            value: horafin, //'5:00 PM',
            //id: 'tmfhorafinact',
            editable: true,
            emptyText: 'Seleccione',
            anchor: '95%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato establecido: hh:mm am/pm.',
            allowBlank: false,
            validationEvent: false,
            listeners: {
                scope: this,
                beforeselect: function (combo, record, index) {
                    if (!_this.fini.isValid() || !_this.ffin.isValid()) {
                        combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
                        return false;
                    } else if (!_this.tmfhora.isValid() && _this.tmfhora.getValue() != '') {
                        combo.markInvalid('Debe validar el campo hora de inicio.');
                        return false;
                    } else if (_this.tmfhora.getValue() == '') {
                        combo.clearInvalid();
                        return true;
                    } else {
                        var vHoraInicial = Date.parseDate(_this.tmfhora.getValue(), _this.formatohora).format("U");
                        var vHorafinal = Date.parseDate(record.get('text'), _this.formatohora).format("U");
                        var vFechaInicial = (_this.fini.getValue()).format('d/m/Y');
                        var vFechaFin = (_this.ffin.getValue()).format('d/m/Y');
                        var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHorafinal));
                        if (nopuedeSeleccionar) {
                            var valorindex = 0
                            // combo.markInvalid("La hora de fin debe ser mayor que la hora de inicio.");

                            if (index == 0) {
                                valorindex = record.store.data.items[index].data.text;
                            } else if(index > 8 ) {
                                valorindex = record.store.data.items[index - 8].data.text;
                            }else if(index <= 8 && index > 0 ) {
                                valorindex = record.store.data.items[index - 1].data.text;
                            }
                            var valor = record.store.data.items[index].data.text;

                            _this.tmfhora.setValue(valorindex);
                            _this.tmfhorafin.setValue(valor);
                            combo.clearInvalid();
                            _this.tmfhorafin.clearInvalid();
                        } else {
                            combo.clearInvalid();
                            _this.tmfhora.clearInvalid();
                        }
                        return !nopuedeSeleccionar;
                    }
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.horafin != record.data.text) {
                            _this.mod.horafin = true;
                        } else {
                            _this.mod.horafin = false;
                        }
                    }
                },
                'render': function (c) {
                    //Validar campo al escribir
                    c.getEl().on('keyup', function () {
                        if (_this.estamodificando == 1) {
                            if (this.isValid()) {
                                if (_this.valoresiniform.horafin != this.getValue()) {
                                    _this.mod.horafin = true;
                                } else {
                                    _this.mod.horafin = false;
                                }
                            }
                        }
                        _this.validarHoraInicioFin(this, true);
                    }, c);
                },
                blur: function (c) {
                    _this.validarHoraInicioFin(c, true);
                }
            }
        });
        _this.tiempoestimado = new Ext.form.NumberField({
            fieldLabel: 'Tiempo estimado (horas)',
            id: 'tiempoestimadoact',
            maxValue: horaslaborables,
            readOnly: readonlyAct,
            maxText: 'Solo admite números enteros positivos entre 0 y ' + horaslaborables + '. Con 2 cifras decimales.',
            allowNegative: false,
            value: 0,
            anchor: '95%',
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
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
        });

        //store del combo Criterio de evaluacion
        _this.stcbcriterioeval = new Ext.data.SimpleStore({
            fields: ['criterioeval', 'denominacion'],
            data: [
                ['NE', 'NE'],
                ['M', 'M'],
                ['R', 'R'],
                ['B', 'B'],
                ['E', 'E']
            ]
        });
        //combo Criterio de evaluacion
        _this.cbcriterioeval = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            fieldLabel: 'Criterio de evaluación',
            store: _this.stcbcriterioeval,
            hiddenName: 'criterioeval',
            valueField: 'criterioeval',
            displayField: 'denominacion',
            triggerAction: 'all',
            readOnly: readonlyAct,
            editable: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            value: 'NE',
            listeners: {
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.criterioeval != record.data.denominacion) {
                            _this.mod.criterioeval = true;
                        } else {
                            _this.mod.criterioeval = false;
                        }
                    }
                }
            }
        });

        //campo donde marco si la actividad es o no principal
        _this.chprincipal = new Ext.form.Checkbox({
            boxLabel: 'Principal',
            checked: false,
            fieldLabel: '',
            readOnly: readonlyAct,
            labelSeparator: '',
            listeners: {
                check: function (check, checked) {
                    if (_this.estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = '1';
                        } else {
                            checkprinciplal = '0';
                        }
                        if (_this.valoresiniform.principal != checkprinciplal) {
                            _this.mod.principal = true;
                        } else {
                            _this.mod.principal = false;
                        }
                    }
                }
            }
        });

        _this.rmanual = new Ext.form.Radio({
            hideLabel: true,
            id: 'rmanual',
            boxLabel: 'Manual',
            name: 'auto_manual',
            readOnly: readonlyAct,
            inputValue: '0',
            checked: true,
            listeners: {
                check: function (check, val) {
                    Ext.getCmp('porcientocumpact').enable();
                },
                focus: function (el) {
                    Ext.getCmp('porcientocumpact').enable();
                }
            }
        });
        _this.rautomatico = new Ext.form.Radio({
            hideLabel: true,
            boxLabel: 'Autom&aacute;tico',
            readOnly: readonlyAct,
            name: 'auto_manual',
            inputValue: '1',
            listeners: {
                focus: function (el) {
                    Ext.getCmp('porcientocumpact').disable();
                },
                check: function (chb, ch) {
                    //modificar
                    _this.pporciento.focus(false, 15);
                    if (_this.estamodificando == 1) {
                        if (ch) {
                            checkmanual = '1';
                        } else {
                            checkmanual = '0';
                        }
                        if (_this.valoresiniform.manual != checkmanual) {
                            _this.mod.automatico = true;
                        } else {
                            _this.mod.automatico = false;
                        }
                    }
                    if (ch) {
                        Ext.getCmp('porcientocumpact').disable();
                        if (decalendario) {
                            Ext.focus();
                        }
                    }
                }
            }
        });
        _this.tfporciento_re = new Ext.form.NumberField({
            readOnly: readonlyAct,
            allowNegative: false,
            value: 0,
            labelSeparator: '',
            boxLabel: '% que representa:',
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            allowBlank: true,
            width: 60,
            hidden: (eshija == 0) ? true : false,
            hideLabel: true,
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (c.getValue() == '') {
                                peso = '0';
                            } else {
                                peso = c.getValue().toString();
                            }
                            if (_this.valoresiniform.porcientore != peso) {
                                _this.mod.porcientore = true;
                            } else {
                                _this.mod.porcientore = false;
                            }
                        }, c);
                    }
                }
            }
        });
        _this.lporciento_re = new Ext.form.Label({
            text: '% que representa:',
            width: 105,
            hidden: (eshija == 0) ? true : false,
            style: 'font-size: 12px;'
        });
        _this.nfPeso = new Ext.form.NumberField({
            maxValue: 1000,
            maxText: 'El valor máximo es 1000.',
            readOnly: readonlyAct,
            allowNegative: false,
            value: 1,
            nanText: 'Solo admite números enteros positivos entre 0 y 1000.',
            labelSeparator: '',
            allowBlank: true,
            width: 60,
            hideLabel: true,
            listeners: {
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {

                            if (c.getValue() == '') {
                                peso = '0';
                            } else {
                                peso = c.getValue().toString();
                            }
                            if (_this.valoresiniform.peso != peso) {
                                _this.mod.peso = true;
                            } else {
                                _this.mod.peso = false;
                            }
                        }, c);
                    }
                }
            }
        });
        _this.lpeso = new Ext.form.Label({
            text: 'Peso:',
            width: 40,
            style: 'font-size: 12px;'
        });
        _this.separacion = new Ext.Panel({
            width: 8,
            border: false,
            height: 73
        });
        _this.pporciento = new Ext.Panel({
            frame: false,
            border: true,
            layout: 'column',
            bodyStyle: 'align:top',
            items: [
                {
                    xtype: 'fieldset',
                    checkboxToggle: false,
                    title: 'Realizar el porciento de cumplimiento de forma:',
                    height: 90,
                    id: 'realizarporciento',
                    bodyStyle: "paddingLeft:20px",
                    columnWidth: 0.798,
                    collapsed: false,
                    items: [
                        {
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.15,
                                    layout: 'form',
                                    bodyStyle: 'padding:0 0 0',
                                    items: _this.rmanual
                                }, {
                                    columnWidth: 0.19,
                                    layout: 'form',
                                    bodyStyle: 'padding:0 0 0',
                                    items: _this.rautomatico
                                }, {
                                    columnWidth: 0.19,
                                    layout: 'form',
                                    bodyStyle: 'padding:6px; margin-top: 2px;',
                                    items: _this.lporciento_re
                                }, {
                                    columnWidth: 0.16,
                                    layout: 'form',
                                    bodyStyle: 'padding:0px',
                                    items: _this.tfporciento_re
                                }, {
                                    columnWidth: 0.07,
                                    layout: 'form',
                                    bodyStyle: 'padding:6px;  margin-top: 2px;',
                                    items: _this.lpeso
                                }, {
                                    columnWidth: 0.15,
                                    layout: 'form',
                                    bodyStyle: 'padding:0px',
                                    items: _this.nfPeso
                                }
                            ]
                        }
                    ]
                }, _this.separacion, {
                    xtype: 'fieldset',
                    title: 'Efecto:',
                    height: 90,
                    columnWidth: 0.189,
                    bodyStyle: 'paddingLeft:20px; paddingTop:5px',
                    collapsed: false,
                    items: [
                        {
                            layout: 'column',
                            bodyStyle: 'padding:0 0 0',
                            items: _this.chprincipal
                        }, {
                            layout: 'column',
                            bodyStyle: 'paddingTop:2px',
                            items: _this.chefectocadena
                        }
                    ]
                }
            ]
        });

        _this.btnVerificarTiempoLibre = new Ext.Button({
            text: 'Verificar tiempo libre',
            iconCls: 'icondistra-revisar sipac-verde',
            id: 'btnVerificarTiempoLibre',
            prevTab: 'btnVerificarConflicto',
            nextTab: (accion == 'Ver datos de la') ? 'btncerrar' : 'btcancelarAct',
            disabled: true,
            hidden: hiddenButton,
            handler: function () {
                var arrayidinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados(true);
                if (arrayidinvolucrados.length != 0)
                    _this.objcmpfondodetiempo.CrearWinFondoDeTiempo(arrayidinvolucrados, _this.fini, _this.ffin, _this.objclasificadorinvol);
                else
                    mostrarMensaje(1, 'Debe seleccionar al menos un usuario a involucrar.');
            },
            tooltip: 'Verificar tiempo libre'
        });

        _this.btnVerificarConflicto = new Ext.Button({
            text: 'Verificar conflicto',
            iconCls: 'revisar',
            id: 'btnVerificarConflicto',
            prevTab: 'btnActualizarExpandirAgrupacion',
            nextTab: 'btnVerificarTiempoLibre',
            disabled: true,
            hidden: hiddenButton,
            handler: function () {
                var arrayidinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados(true);
                if (arrayidinvolucrados.length != 0) {
                    if (_this.fini.getValue() && _this.ffin.getValue())
                        _this.objcmpfondodetiempo.CrearWinVerificarConflicto(arrayidinvolucrados, _this.fini.getValue().format('d/m/Y'), _this.ffin.getValue().format('d/m/Y'), _this.objclasificadorinvol);
                    else
                        mostrarMensaje(1, 'Debe especificar las fechas de la actividad.');
                } else
                    mostrarMensaje(1, 'Debe seleccionar al menos un usuario a involucrar.');
            },
            tooltip: 'Verificar conflicto'
        });

        _this.pclasificadorinvol.addButton(_this.btnVerificarConflicto);
        _this.pclasificadorinvol.addButton(_this.btnVerificarTiempoLibre);

        _this.pdatosgenerales = new Ext.Panel({
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
                            items: [_this.fini, _this.ffin]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.cbcriterioeval, _this.porcientocump]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.cbbcat, _this.cbbtipo]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.tmfhora, _this.tmfhorafin]
                        }, {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.tflugar, _this.tiempoestimado]
                        }
                    ]
                }, {
                    layout: 'form',
                    items: [
                        {
                            columnWidth: 0.20,
                            layout: 'form',
                            items: [_this.pporciento]
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
                                    id: 'tabPanelActBottom',
                                    activeTab: 0,
                                    height: 210,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            title: 'Participantes',
                                            id: 'panelParticipantes',
                                            layout: 'fit',
                                            items: [_this.heparticipantes]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Dirigentes',
                                            id: 'panelDirigentes',
                                            layout: 'fit',
                                            items: [_this.hedirigentes]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Descripci&oacute;n',
                                            id: 'panelDescrip',
                                            //nextTab: 'panelGD',
                                            layout: 'fit',
                                            items: [_this.hedescripcion]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Contenidos asociados',
                                            id: 'panelGD',
                                            prevTab: 'panelDescrip',
                                            nextTab: 'tfbuscarInv',
                                            layout: 'fit',
                                            items: [_this.objcmpgestordoc.CrearGridDocAsociados(accion, _this.arrayidactividades[0])]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        //store del combo de los tipos de repeticiones
        _this.stcbtiporepeticiones = new Ext.data.SimpleStore({
            fields: ['idrept', 'denominacion'],
            data: [
                [1, 'Periódica'],
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
            disabled: true,
            hiddenName: 'idrept',
            valueField: 'idrept',
            emptyText: 'Seleccione',
            anchor: '80%',
            listeners: {
                select: function (combo, record, index) {
                    _this.CrearWunCrudRepeticiones('Adicionar', _this.cbtiporepeticiones.getValue(), horainicio, horafin);
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
                _this.CrearWunCrudRepeticiones('Adicionar', _this.cbtiporepeticiones.getValue(), horainicio, horafin);
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
                _this.CrearWunCrudRepeticiones('Modificar', 2, horainicio, horafin);
            },
            iconCls: 'modificar',
            tooltip: 'Modificar repetici&oacute;n',
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
                _this.CrearWunCrudRepeticiones('Duplicar', 2, horainicio, horafin);
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
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarrepeticionesactividad',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.limit = 2000;
                    st.baseParams.idactividad = _this.arrayidactividades[0];
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
                    name: 'idactividad'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'hora'
                }, {
                    name: 'horafin'
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
                    _this.CargarInvolucradosRepeticion(record, 'marcado');
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
                    _this.CargarInvolucradosRepeticion(record, 'desmarcado');
                }
            }
        });
//barra de paginado del grid donde se cargan las repeticiones
        _this.pggrepeticiones = new Ext.PagingToolbar({
            pageSize: 1000,
            store: _this.stggrepeticiones,
            displayInfo: true
        });
//grid donde cargo las repeticiones
        _this.ggrepeticiones = new Ext.grid.GridPanel({
            region: 'center',
            listeners: {
                rowdblclick: function () {
                    _this.CrearWunCrudRepeticiones('Modificar', 2, horainicio, horafin);
                }
            },
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando repeticiones de la actividad'
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
                    header: "Hora de inicio",
                    width: 80,
                    sortable: true,
                    dataIndex: 'hora'
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
            id: 'gginvolucradosrepeticion',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            titleCollapse: true,
            loadMask: {
                msg: 'Cargando involucrados en la repetici&oacute;n'
            },
            listeners: {
                collapse: function (p) {
                    //Ext.getCmp('panel-repeticiones').layout.south.getCollapsedEl().titleEl.dom.innerHTML = 'Case Information for: ';
                }
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
//panel donde muestro las repeticiones
        _this.prepeticiones = new Ext.Panel(
            {
                title: 'Repeticiones',
                id: 'panel-repeticiones',
                layout: 'border',
                tbar: ['Tipo de repetici&oacute;n:', ' ', ' ', ' ', ' ', ' ', ' ', _this.cbtiporepeticiones, ' ',
                    _this.btnAdicionarRepeticiones, _this.btnModificarRepeticiones, ' ',
                    _this.btnEliminarRepeticiones, ' ', _this.btnDuplicarRepeticiones],
                usarKeymap: true,
                botonesKeymap: [_this.btnAdicionarRepeticiones, _this.btnModificarRepeticiones,
                    _this.btnEliminarRepeticiones, _this.btnDuplicarRepeticiones],
                items: [_this.ggrepeticiones, _this.gginvolucradosrepeticion]
            });
        _this.prepeticiones.addListener('activate', function (p) {
            if (_this.estamodificando == 1) {
                _this.stggrepeticiones.load();
            }
            if (accion == 'Duplicar' && _this.subordinado == 1) {
                if (activartabrep == 0) {
                    _this.stggrepeticiones.load();
                    activartabrep = 1;
                }
            }
        });
        _this.prepeticiones.addListener('deactivate', function (p) {
            _this.primerconteo = 'no';
        });

//panel de relaciones

        _this.prelaciones = _this.objcmprelaciones.CrearCmpRelaciones(_this.estamodificando, 3, arrayidactividades[0],
            permiso, PostAccionesGestionar, _this.DestruirWinCrudActividades, _this.comboRelacionesDisable);


//panel para el control de las reasignaciones
        _this.pctrlreasignaciones = _this.objcmpctrlreasignaciones.CrearCmpCtrlReasignacion(
            _this.estamodificando, 3, arrayidactividades[0], _this.DestruirWinCrudActividades,
            PostAccionesGestionar, permitirreasignar, _this.reasignacionHidden);

//funcion para obtener un arreglo de Ids de repetiones.
        this.obtenerIdRepeticiones = function () {
            var arrayelementosrepetidos = [];
            var elementosrepeticiones = _this.stggrepeticiones.getRange();
            if (elementosrepeticiones.length > 0) {
                for (var i = 0; i < elementosrepeticiones.length; i++) {
                    var elementorepeticiones;
                    elementorepeticiones = elementosrepeticiones[i].data.idactividad;
                    arrayelementosrepetidos.push(elementorepeticiones);
                }
            }
            return arrayelementosrepetidos;
        };
        var proyecto = 0;
        panelactividadrecurso = _this.objactivrecurso.dosgrids(accion, this.arrayidactividades[0],
            decalendario,
            _this.estamodificando, _this.recursosDisable, proyecto);
        panelactividadrecurso.setTitle('Recursos');

//tabpanel donde muestro los datos de la actividad
        _this.tpdatosactividad = new Ext.TabPanel({
            height: 420,
            activeTab: 0,
            disabled: disableform,
            frame: true,
            items: [_this.pdatosgenerales, _this.pclasificadorinvol, _this.prepeticiones, _this.prelaciones, panelactividadrecurso],
            listeners: {
                tabchange: function (tabpanel, tabseleccionado) {
                    _this.objcmprelaciones.stTGRelaciones.on('load', function () {
                        if (tabseleccionado == _this.prelaciones && contadorrelaciones == 1) {
                            arrayrelaciones_ini = _this.objcmprelaciones.ObtenerIDElementosRelacionados();
                            contadorrelaciones++;
                        }
                    });
                    _this.stggrepeticiones.on('load', function () {
                        if (tabseleccionado == _this.prepeticiones && contadorrepeticiones == 1) {
                            arrayrepeticiones_ini = _this.obtenerIdRepeticiones();
                            contadorrepeticiones++;
                        }
                    })
                }
            }
        });

        if (decalendario) {
            //_this.tpdatosactividad.remove(_this.prelaciones);
        }

//texto donde muestro el autor de la actividad
        _this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

//formulario con atributos de la actividad
        _this.fpCrudActividades = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
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
                        items: [_this.tpdatosactividad]
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
                    //Tiempo Libre
                    if (_this.objclasificadorinvol.verificarCantInv) {
                        Ext.getCmp('btnVerificarTiempoLibre').setDisabled(false);
                        Ext.getCmp('btnVerificarConflicto').setDisabled(false);
                    } else {
                        Ext.getCmp('btnVerificarTiempoLibre').setDisabled(true);
                        Ext.getCmp('btnVerificarConflicto').setDisabled(true);
                    }
                    if (valid) {
                        _this.btnAceptarCrudAct.enable();
                    } else {
                        _this.btnAceptarCrudAct.disable();
                    }
                    //Modificar
                    if (_this.estamodificando == 1) {
                        arrayrepeticiones_fin = _this.obtenerIdRepeticiones();
                        recursosasociadosFin = _this.objactivrecurso.retornarasociados();
                        if (valid && (_this.objclasificadorinvol.modificarInv
                            || _this.mod.denominacion
                            || _this.mod.descripcion
                            || _this.mod.participantes
                            || _this.mod.dirigentes
                            || _this.mod.lugar
                            || _this.mod.horaini
                            || _this.mod.horafin
                            || _this.mod.fechainicio
                            || _this.mod.fechafin
                            || _this.mod.porciento
                            || _this.mod.categoria
                            || _this.mod.tipoactividad
                            || _this.mod.principal
                            || _this.mod.automatico
                            || _this.mod.peso
                            || _this.mod.porcientore
                            || _this.mod.efecto
                            || _this.mod.tiempoestimado
                            || _this.mod.criterioeval
                            || arrayrepeticiones_fin.toString() !== arrayrepeticiones_ini.toString()
                            || _this.objcmprelaciones.modificarRelaciones
                            || recursosIni !== recursosasociadosFin.toString()
                            || _this.objcmpctrlreasignaciones.modificarAsignaciones
                        )) {
                            _this.btnAceptarCrudAct.enable();
                        } else if (accion == 'Suspender') {
                            _this.btnAceptarCrudAct.enable();
                        } else {
                            _this.btnAceptarCrudAct.disable();
                        }
                    }
                }
            }
        });

        _this.btnCancelarCrudAct = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'btcancelarAct',
            prevTab: 'btnVerificarTiempoLibre',
            nextTab: 'btaplicar',
            hidden: true,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.winCrudActividades.destroy();
                _this.btnaplicar = false;
            }
        });
        _this.btnAceptarCrudAct = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'btacepact',
            nextTab: 'tfdenominacionact',
            prevTab: 'btaplicar',
            tooltip: 'Guardar datos y cerrar ventana',
            hidden: true,
            handler: function () {
                _this.CrudActividades(PostAccionesGestionar, accion, aplicar = 0);
            }
        });
        _this.btnAplicarCrudAct = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            id: 'btaplicar',
            prevTab: 'btcancelarAct',
            nextTab: 'btacepact',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.CrudActividades(PostAccionesGestionar, accion, aplicar = 1, fechainicio);
                _this.btnaplicar = true;
            }
        });
        _this.btnCerrarCrudAct = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            id: 'btncerrar',
            nextTab: 'tfdenominacionact',
            tooltip: 'Cerrar ventana',
            hidden: true,
            handler: function () {
                _this.winCrudActividades.destroy();
            }
        });
        if (!maximizada) {
            maximizada = false;
        }
        _this.winCrudActividades = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' actividad',
            width: 840,
            height: 570,
            autoValidate: true,
            validateDefault: true,
            //maximizable: true,
            resizable: false,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    var idElementoConFoco = document.activeElement.id;
                    if (!_this.btnAceptarCrudAct.disabled && (idElementoConFoco != 'heparticipantesact' && idElementoConFoco != 'hedirigentesact' && idElementoConFoco != 'tfbuscarInv')) {
                        _this.CrudActividades(PostAccionesGestionar, accion, aplicar = 0);
                    }
                },
                scope: this
            }],
            listeners: {
                beforeshow: function (win) {
                    _this.fini.setValue(fechainicio);
                    _this.fini.setMaxValue(null);
                    if (accion == 'Adicionar') {
                        _this.ffin.setMinValue(_this.fini.getValue());
                        var vregexFecha = /^(0[1-9]|[1-2]\d|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;
                        (vregexFecha.test(fechafin)) ? _this.ffin.setValue(fechafin) : _this.ffin.setValue(_this.fini.getValue());
                    }
                    if (!usarGD) {
                        //Ext.getCmp('panelGD').disable();
                        var tabpanel = Ext.getCmp('tabPanelActBottom');
                        var panelGD = Ext.getCmp('panelGD');
                        tabpanel.remove(panelGD, true);
                    }
                    if (_this.objclasificadorinvol.verificarCantInv) {
                        _this.btnVerificarConflicto.setDisabled(false);
                        _this.btnVerificarTiempoLibre.setDisabled(false);
                    } else {
                        _this.btnVerificarConflicto.setDisabled(true);
                        _this.btnVerificarTiempoLibre.setDisabled(true);
                    }

                },
                beforedestroy: function (w) {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                destroy: function (win) {
                    _this.primerconteo = 'no';
                    contadorrelaciones = 1;
                    contadorrepeticiones = 1;
                    arrayrelaciones_ini = [];
                    arrayrepeticiones_ini = [];
                    arrayinvolucrados_ini = [];
                    _this.heparticipantes_ini = '';
                    _this.hedirigentes_ini = '';
                    _this.hedescripcion_ini = '';
                    _this.btnaplicar = false;
                    _this.comboRelacionesDisable = false;
                    _this.recursosDisable = false;
                    _this.reasignacionHidden = false;
                    //modificar
                    _this.mod.denominacion = false;
                    _this.mod.descripcion = false;
                    _this.mod.participantes = false;
                    _this.mod.dirigentes = false;
                    _this.mod.lugar = false;
                    _this.mod.horaini = false;
                    _this.mod.horafin = false;
                    _this.mod.fechainicio = false;
                    _this.mod.fechafin = false;
                    _this.mod.porciento = false;
                    _this.mod.categoria = false;
                    _this.mod.tipoactividad = false;
                    _this.mod.principal = false;
                    _this.mod.automatico = false;
                    _this.mod.peso = false;
                    _this.mod.porcientore = false;
                    _this.mod.efecto = false;
                    _this.mod.tiempoestimado = false;
                    _this.mod.criterioeval = false;
                    _this.objcmprelaciones.modificarRelaciones = false;
                    _this.objcmpctrlreasignaciones.modificarAsignaciones = false;
                    _this.objclasificadorinvol.ResetearArregloDeInvolucradosEliminar();
                    horaslaborables = 24;
                }
            },
            buttons: [_this.btnCancelarCrudAct,
                _this.btnAplicarCrudAct,
                _this.btnAceptarCrudAct,
                _this.btnCerrarCrudAct],
            items: [_this.fpCrudActividades]
        });
        _this.winCrudActividades.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.winCrudActividades.doLayout();
        _this.winCrudActividades.show();
        _this.tfdenominacion.focus(false, 1024);
        _this.stCmbCategorias.load();
        _this.stCmbTipo.load();
        switch (accion) {
            case 'Adicionar':
                _this.cbtiporepeticiones.enable();
                _this.btnCancelarCrudAct.setVisible(true);
                _this.btnAceptarCrudAct.setVisible(true);

                _this.objclasificadorinvol.cargarInvolConfPerfil(3);

                _this.fini.setMaxValue(null);
                _this.ffin.setMinValue(null);
                break;
            default:
                var accionejecutada = 'que usted quiere modificar';
                var mostrarctrlreasignaciones = 0;
                if (accion == 'Modificar' || accion == 'Ver datos de la'
                    || accion == 'Duplicar'
                    || accion == 'Relacionar elementos a la'
                    || accion == 'Control de reasignaciones de la' || accion == 'Puntualizar' || accion == 'Suspender') {
                    if (accion == 'Modificar' || accion == 'Duplicar' || accion == 'Puntualizar' || accion == 'Suspender') {
                        if (accion == 'Duplicar') {
                            accionejecutada = 'que usted quiere duplicar';
                        }
                        if (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') {
                            mostrarctrlreasignaciones = 1;
                            _this.cbtiporepeticiones.enable();
                        }
                        _this.btnCancelarCrudAct.setVisible(true);
                        _this.btnAceptarCrudAct.setVisible(true);
                        _this.btnAceptarCrudAct.setDisabled(true);
                        _this.btnAplicarCrudAct.setVisible(false);
                        _this.btnCancelarCrudAct.nextTab = 'btacepact';
                        _this.btnAceptarCrudAct.prevTab = 'btcancelarAct';
                    }
                    if (accion == 'Ver datos de la'
                        || accion == 'Relacionar elementos a la'
                        || accion == 'Control de reasignaciones de la') {
                        _this.btnAplicarCrudAct.setVisible(false);
                        accionejecutada = 'a la cual usted quiere ver sus datos';
                        if (accion == 'Relacionar elementos a la') {
                            accionejecutada = 'a la cual usted quiere relacionar elementos';
                            _this.pdatosgenerales.disable();
                            _this.prepeticiones.disable();
                            _this.tpdatosactividad.activate(_this.prelaciones);
                        }
                        _this.btnCerrarCrudAct.setVisible(true);
                        // _this.objclasificadorinvol.tpinvolucrados.disable();
                        _this.btnAdicionarRepeticiones.setVisible(false);
                        _this.btnModificarRepeticiones.setVisible(false);
                        _this.btnEliminarRepeticiones.setVisible(false);
                        _this.btnDuplicarRepeticiones.setVisible(false);
                        if (accion == 'Ver datos de la') {
                            //_this.btnVerificarConflicto.disable();
                            //   _this.btnVerificarTiempoLibre.disable();
                            _this.hedescripcion.disable();
                            _this.cbtiporepeticiones.disable();
                            readonlyAct = true;
                            _this.comboRelacionesDisable = true;
                            _this.objcmprelaciones.btnRelacionar.setVisible(false);
                            _this.objcmprelaciones.btnEliminarRelaciones.setVisible(false);
                            mostrarctrlreasignaciones = 1;
                            _this.recursosDisable = true;
                            _this.reasignacionHidden = true;
                            _this.cbbcat.clearInvalid();
                            _this.cbbcat.on('expand', function () {
                                _this.cbbcat.collapse();
                            });
                            _this.cbbtipo.clearInvalid();
                            _this.cbbtipo.on('expand', function () {
                                _this.cbbtipo.collapse();
                            });
                            _this.cbcriterioeval.clearInvalid();
                            _this.cbcriterioeval.on('expand', function () {
                                _this.cbcriterioeval.collapse();
                            });
                            _this.tmfhora.clearInvalid();
                            _this.tmfhora.on('expand', function () {
                                _this.tmfhora.collapse();
                            });
                            _this.tmfhorafin.clearInvalid();
                            _this.tmfhorafin.on('expand', function () {
                                _this.tmfhorafin.collapse();
                            });
                        }
                        if (accion == 'Control de reasignaciones de la') {
                            _this.pdatosgenerales.disable();
                            _this.prepeticiones.disable();
                            _this.prelaciones.disable();
                            _this.tpdatosactividad.add(_this.pctrlreasignaciones);
                            _this.tpdatosactividad.activate(_this.pctrlreasignaciones);
                            panelactividadrecurso.disable();
                        }
                    }
                    if (mostrarctrlreasignaciones == 1) {
                        _this.tpdatosactividad.add(_this.pctrlreasignaciones);
                    }
                    if (accion == 'Modificar' && idautor == usuario_logueado) {
                        _this.pctrlreasignaciones.disable();
                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarformactividad',
                        params: {
                            idactividad: arrayidactividades[0]
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                mostrarMensaje(1, 'La actividad ' + accionejecutada + ' ya no se encuentra en los registros.');
                                _this.winCrudActividades.destroy();
                                PostAccionesGestionar();
                            } else {
                                _this.BarraProgreso.hide();
                                var titulo = _this.winCrudActividades.title + '  -  ' + 'CAR: ' + responseData.data[0].idactividad + '  -  ' + 'Estado: ' + responseData.data[0].estado;
                                _this.winCrudActividades.setTitle(titulo);

                                if (accion == 'Modificar' || accion == 'Relacionar elementos a la' || accion == 'Ver datos de la' || accion == 'Puntualizar' || accion == 'Suspender') {
                                    _this.heparticipantes.setValue(responseData.data[0].participantes);
                                    _this.hedirigentes.setValue(responseData.data[0].dirigentes);
                                    _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                                }
                                if (accion == 'Duplicar') {
                                    //if (_this.subordinado == 1) {
                                    _this.heparticipantes.setValue(responseData.data[0].participantes);
                                    _this.hedirigentes.setValue(responseData.data[0].dirigentes);
                                    _this.objclasificadorinvol.stGInvolucrados.reload({
                                        params: {
                                            idelemento: _this.arrayidactividades[0],
                                            idtipoelemento: 3
                                        }
                                    });
                                    //}
                                    _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                                    _this.objcmprelaciones.stTGRelaciones.reload({});
                                    _this.stggrepeticiones.load();
                                }
                                _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                                _this.cbbcat.setValue(responseData.data[0].categoria.idcategoria);
                                _this.cbbcat.setRawValue(responseData.data[0].categoria.denominacion);
                                _this.cbbtipo.setValue(responseData.data[0].tipo.idtipo);
                                _this.cbbtipo.setRawValue(responseData.data[0].tipo.denominacion);
                                _this.fini.setValue(responseData.data[0].fechainicio);
                                _this.ffin.setValue(responseData.data[0].fechafin);
                                _this.diasentrefechas = _this.restaFechas(_this.fini.getRawValue(), _this.ffin.getRawValue());
                                _this.fini.setMaxValue(null);
                                _this.ffin.setMinValue(null);
                                _this.tmfhora.setValue(responseData.data[0].hora);
                                _this.tmfhorafin.setValue(responseData.data[0].horafin);
                                _this.tflugar.setValue(responseData.data[0].lugar);
                                _this.tiempoestimado.setValue(responseData.data[0].tiempoestimado);
                                _this.cbcriterioeval.setValue(responseData.data[0].criterioevaluacion);
                                _this.cbcriterioeval.setRawValue(responseData.data[0].criterioevaluacion);
                                if (responseData.data[0].deshabilitarxciento == 0) {
                                    _this.porcientocump.disable();
                                }
                                _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                                _this.estadocumplimiento.setValue(responseData.data[0].estadocumplimiento);
                                _this.hedescripcion.setValue(responseData.data[0].descripcion);
                                _this.chprincipal.setValue(responseData.data[0].esprincipal);
                                if (responseData.data[0].auto_manual == 0) {
                                    _this.rmanual.setValue(true);
                                    _this.rautomatico.setValue(false);
                                } else {
                                    _this.rmanual.setValue(false);
                                    _this.rautomatico.setValue(true);
                                }
                                _this.tfporciento_re.setValue(responseData.data[0].porcientoinicio);
                                _this.nfPeso.setValue(responseData.data[0].peso);
                                _this.MaxValue(_this.porciento);
                                //Var para el MODIFICAR
                                _this.valoresiniform.denominacion = responseData.data[0].denominacion;
                                _this.valoresiniform.descripcion = responseData.data[0].descripcion;
                                _this.valoresiniform.participantes = responseData.data[0].participantes;
                                _this.valoresiniform.dirigentes = responseData.data[0].dirigentes;
                                _this.valoresiniform.fechainicio = responseData.data[0].fechainicio;
                                _this.valoresiniform.fechafin = responseData.data[0].fechafin;
                                _this.valoresiniform.horaini = responseData.data[0].hora;
                                _this.valoresiniform.horafin = responseData.data[0].horafin;
                                _this.valoresiniform.lugar = responseData.data[0].lugar;
                                _this.valoresiniform.porciento = responseData.data[0].gradocumplimiento;
                                _this.valoresiniform.categoria = responseData.data[0].categoria.idcategoria;
                                _this.valoresiniform.tipoactividad = responseData.data[0].tipo.idtipo;
                                _this.valoresiniform.principal = responseData.data[0].esprincipal;
                                _this.valoresiniform.manual = responseData.data[0].auto_manual;
                                _this.valoresiniform.porcientore = responseData.data[0].porcientoinicio;
                                _this.valoresiniform.peso = responseData.data[0].peso;
                                _this.valoresiniform.tiempoestimado = responseData.data[0].tiempoestimado;
                                _this.valoresiniform.criterioeval = responseData.data[0].criterioevaluacion;
                                _this.validarHorasLaborables(_this.fini, _this.ffin);
                                //Correccion de errores introducidos en los campos horas
                                _this.correccionErroresHora();
                                recursosasociadosIni = _this.objactivrecurso.retornarasociados();
                                recursosIni = recursosasociadosIni.toString();

                                if (accion == 'Puntualizar' || accion == 'Suspender') {
                                    _this.cbbcat.disable();
                                    _this.estadocumplimiento.disable();
                                    _this.rmanual.disable();
                                    _this.rautomatico.disable();
                                    _this.cbbtipo.disable();
                                    _this.cbcriterioeval.disable();
                                    _this.estadocumplimiento.disable(); //panelGD
                                    Ext.getCmp('panelParticipantes').disable();
                                    Ext.getCmp('panelDirigentes').disable();
                                    Ext.getCmp('panelDescrip').disable();
                                    _this.prepeticiones.disable();
                                    Ext.getCmp('panelGD').disable();
                                    _this.prelaciones.disable();
                                    panelactividadrecurso.disable();
                                    _this.pctrlreasignaciones.disable();
                                }
                            }
                        }
                    });
                }
        }
    };

    this.DestruirWinCrudActividades = function () {
        _this.winCrudActividades.destroy();
    };

    this.ActualizarEstadoBarraHerramientasRepeticiones = function () {
        _this.arrayrepeticionesseleccionadas = [];
        _this.arrayidactrep = [];
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
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (arrayrecords[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidactrep[i] = arrayrecords[i].data.idactividad;
                    var repeticionseleccionada = {};
                    repeticionseleccionada = {
                        idrepeticion: arrayrecords[i].data.idrepeticion,
                        idactividad: arrayrecords[i].data.idactividad,
                        fechainicio: arrayrecords[i].data.fechainicio,
                        fechafin: arrayrecords[i].data.fechafin,
                        horainicio: arrayrecords[i].data.hora,
                        horafin: arrayrecords[i].data.horafin,
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

    this.CrearWunCrudRepeticiones = function (accion, tiporepeticion, horainicio, horafin) {

        _this.estaModificandoRepeticion = 0;

        if (_this.winCrudRepeticiones)
            _this.winCrudRepeticiones.destroy();
        var tabsig = 'cbintervalorepetperiodica';
        var fechafinact = _this.ffin.getValue();
        fechainiact = _this.fini.getValue();
        if (fechafinact.toString() != '')
            fechafinactmasundia = new Date(fechafinact).add(Date.DAY, 1);

        if (accion == 'Modificar') {
            _this.estaModificandoRepeticion = 1;
        }

        if (accion == 'Adicionar' && tiporepeticion == 1) {
            //store del combo del intervalo de las repeticiones periodicas
            _this.stcbintervalorepetperiodica = new Ext.data.SimpleStore({
                fields: ['idintervalo', 'denominacion'],
                data: [[1, 'Por días']]
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
                invalidText: 'El formato establecido: dd/mm/aaaa.',
                width: 100,
                minValue: fechafinactmasundia,
                value: fechafinactmasundia,
                disabled: true,
                minText: 'La fecha fin de las repetición tiene que ser posterior o igual a la fecha fin de la actividad.',
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
                        }],
                    listeners: {
                        'clientvalidation': function (fm, valid) {
                            if (valid) {
                                _this.winCrudRepeticiones.autoValidate = false;
                                Ext.getCmp('btaceprepeticion').setDisabled(false);
                                Ext.getCmp('btaplicarrepeticion').setDisabled(false);
                            } else {
                                _this.winCrudRepeticiones.autoValidate = true;
                                Ext.getCmp('btaceprepeticion').setDisabled(true);
                                Ext.getCmp('btaplicarrepeticion').setDisabled(false);
                            }
                        }
                    }
                });
        } else {
            tabsig = 'dffechainiciorepaleatoria';
            var modificandorepeticion = 0;
            var idautorrepeticion = null;
            if ((accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') && _this.estamodificando == 1) {
                modificandorepeticion = 1;
                idautorrepeticion = _this.arrayrepeticionesseleccionadas[0].idautor;
            }

            //campo de fecha de inicio para las repeticiones aleatorias
            _this.dffechainiciorepaleatoria = new Ext.form.DateField({
                //fsera
                fieldLabel: 'Fecha de inicio',
                format: 'd/m/Y',
                id: 'dffechainiciorepaleatoria',
                //endDateField: 'dffechafinrepaleatoria',
                prevTab: 'btaceprepeticion',
                anchor: '80%',
                invalidText: 'El formato establecido: dd/mm/aaaa.',
                allowBlank: false,
                maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
                blankText: 'Este campo es obligatorio.',
                menuListeners: {
                    select: function (df, date) {
                        this.setValue(date);
                        _this.dffechafinrepaleatoria.setMinValue(date);
                        if (date > _this.dffechafinrepaleatoria.getValue()) {
                            _this.dffechafinrepaleatoria.setValue(date);
                        }
                        //_this.dffechainiciorepaleatoria.setMaxValue(date);
                        //Modificar
                        if (_this.estaModificandoRepeticion == 1) {
                            if (_this.valoresInicialesFormRepeticion.fechaInicioRepeticion != date.format('d/m/Y')) {
                                _this.modRepeticion.fechaInicioRepeticion = true;
                            } else {
                                _this.modRepeticion.fechaInicioRepeticion = false;
                            }
                        }
                        //Validar horas laborables segun la finicio y ffin
                        _this.validarHorasLaborables(this, _this.dffechafinrepaleatoria);
                    }
                },
                listeners: {
                    change: function (el, vn, ov) {
                        if (vn == "")
                            _this.dffechafinrepaleatoria.setMinValue(_this.dffechafinrepaleatoria.getValue());
                        else
                            _this.dffechafinrepaleatoria.setMinValue(vn);
                    },
                    'render': function (c) {
                        if (_this.estaModificandoRepeticion == 1) {
                            c.getEl().on('keyup', function () {
                                if (this.isValid()) {
                                    if (_this.valoresInicialesFormRepeticion.fechaInicioRepeticion != c.getValue().format('d/m/Y')) {
                                        _this.modRepeticion.fechaInicioRepeticion = true;
                                    } else {
                                        _this.modRepeticion.fechaInicioRepeticion = false;
                                    }
                                }
                            }, c);
                        }
                        //Validar campo tiempo estimado al escribir en el campo de las fechas
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                _this.validarHorasLaborables(this, _this.dffechafinrepaleatoria);
                            }
                        }, c);
                    }
                }
            });
            //campo de fecha de fin para las repeticiones aleatorias
            _this.dffechafinrepaleatoria = new Ext.form.DateField({
                id: 'dffechafinrepaleatoria',
                fieldLabel: 'Fecha de fin',
                format: 'd/m/Y',
                //startDateField: 'dffechainiciorepaleatoria',
                anchor: '80%',
                invalidText: 'El formato establecido: dd/mm/aaaa.',
                minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
                allowBlank: false,
                blankText: 'Este campo es obligatorio.',
                menuListeners: {
                    select: function (df, date) {
                        this.setValue(date);
                        _this.dffechafinrepaleatoria.setMinValue(date);
                        if (date > _this.dffechafinrepaleatoria.getValue()) {
                            _this.dffechafinrepaleatoria.setValue(date);
                        }
                        _this.dffechainiciorepaleatoria.setMaxValue(date);
                        //Modificar
                        if (_this.estaModificandoRepeticion == 1) {
                            if (_this.valoresInicialesFormRepeticion.fechaFinRepeticion != date.format('d/m/Y')) {
                                _this.modRepeticion.fechaFinRepeticion = true;
                            } else {
                                _this.modRepeticion.fechaFinRepeticion = false;
                            }
                        }
                        //Validar horas laborables segun la finicio y ffin
                        _this.validarHorasLaborables(_this.dffechainiciorepaleatoria, this);

                    }
                },
                listeners: {
                    change: function (el, vn, ov) {
                        if (vn == "")
                            _this.dffechainiciorepaleatoria.setMaxValue(null);
                        else
                            _this.dffechainiciorepaleatoria.setMaxValue(vn);
                    },
                    'render': function (c) {
                        if (_this.estaModificandoRepeticion == 1) {
                            c.getEl().on('keyup', function () {
                                if (this.isValid()) {
                                    if (_this.valoresInicialesFormRepeticion.fechaFinRepeticion != c.getValue().format('d/m/Y')) {
                                        _this.modRepeticion.fechaFinRepeticion = true;
                                    } else {
                                        _this.modRepeticion.fechaFinRepeticion = false;
                                    }
                                }
                            }, c);
                        }
                        //Validar campo tiempo estimado al escribir en el campo de las fechas
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                _this.validarHorasLaborables(_this.dffechainiciorepaleatoria, this);
                            }
                        }, c);
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
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                anchor: '80%',
                listeners: {
                    'render': function (c) {
                        if (_this.estaModificandoRepeticion == 1) {
                            c.getEl().on('keyup', function () {
                                if (_this.valoresInicialesFormRepeticion.lugarRepeticion !== c.getValue().toString()) {
                                    _this.modRepeticion.lugarRepeticion = true;
                                } else {
                                    _this.modRepeticion.lugarRepeticion = false;
                                }
                            }, c);
                        }
                    }
                }
            });
            //campo de texto donde muestro la hora de inicio de la repeticion aleatoria
            _this.tmfhorarepaleatoria = new Ext.form.TimeField({
                fieldLabel: 'Hora de inicio',
                name: 'tmfhorarepaleatoria',
                format: _this.formatohora,
                minValue: _this.hvalorminimo,
                maxValue: _this.hvalormaximo,
                increment: 15,
                value: horainicio,
                editable: false,
                emptyText: 'Seleccione',
                anchor: '80%',
                maskRe: /^([0-9:aAmMpP\s])$/,
                maxText: 'Formato: hh:mm am/pm.',
                listeners: {
                    beforeselect: function (combo, record, index) {
                        arr_hour.push(Date.parseDate(combo.getValue(), _this.formatohora));
                        //si retornas true te permite seleccionar y false cancela la seleccion
                        if (!_this.fini.isValid() || !_this.ffin.isValid()) {
                            combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
                            return false;
                        } else if (!_this.tmfhorafin.isValid()) {
                            combo.markInvalid('Debe validar el campo fecha de fin.');
                            return false;
                        } else {
                            var vHoraFinal = Date.parseDate(_this.tmfhorafinrepaleatoria.getValue(), _this.formatohora).format("U");
                            var vHoraInicial = Date.parseDate(record.get('text'), _this.formatohora).format("U");
                            var vFechaInicial = (_this.fini.getValue()).format('d/m/Y');
                            var vFechaFin = (_this.ffin.getValue()).format('d/m/Y');
                            var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
                            if (nopuedeSeleccionar) {
                                combo.markInvalid("La hora de inicio debe ser menor que la hora de fin.");
                            } else {
                                combo.clearInvalid();
                            }
                            return !nopuedeSeleccionar;
                        }
                    },
                    select: function (combo, record, index) {
                        //_this.selectHour(record, _this.tmfhorafin);
                        if (_this.estaModificandoRepeticion == 1) {
                            if (_this.valoresInicialesFormRepeticion.horaInicioRepeticion != record.data.text) {
                                _this.modRepeticion.horaInicioRepeticion = true;
                            } else {
                                _this.modRepeticion.horaInicioRepeticion = false;
                            }
                        }
                    },
                    'render': function (c) {
                        if (_this.estaModificandoRepeticion == 1) {
                            c.getEl().on('keyup', function () {
                                if (this.isValid()) {
                                    if (_this.valoresInicialesFormRepeticion.horaInicioRepeticion != this.getValue()) {
                                        _this.modRepeticion.horaInicioRepeticion = true;
                                    } else {
                                        _this.modRepeticion.horaInicioRepeticion = false;
                                    }
                                }
                            }, c);
                        }
                        //Validar campo al escribir
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {

                            }
                        }, c);
                    }
                }
            });
            //campo de texto donde muestro la hora de fin de la repeticion aleatoria
            _this.tmfhorafinrepaleatoria = new Ext.form.TimeField({
                fieldLabel: 'Hora de fin',
                name: 'tmfhorafinrepaleatoria',
                format: _this.formatohora,
                minValue: _this.hvalorminimo,
                maxValue: _this.hvalormaximo,
                increment: 15,
                value: horafin,
                editable: false,
                emptyText: 'Seleccione',
                anchor: '80%',
                maskRe: /^([0-9:aAmMpP\s])$/,
                maxText: 'Formato: hh:mm am/pm.',
                listeners: {
                    scope: this,
                    beforeselect: function (combo, record, index) {
                        //si retornas true te permite seleccionar y false cancela la seleccion
                        if (!_this.fini.isValid() || !_this.ffin.isValid()) {
                            combo.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
                            return false;
                        } else if (!_this.tmfhora.isValid()) {
                            combo.markInvalid('Debe validar el campo hora de inicio.');
                            return false;
                        } else {
                            var vHoraInicial = Date.parseDate(_this.tmfhora.getValue(), _this.formatohora).format("U");
                            var vHorafinal = Date.parseDate(record.get('text'), _this.formatohora).format("U");
                            var vFechaInicial = (_this.fini.getValue()).format('d/m/Y');
                            var vFechaFin = (_this.ffin.getValue()).format('d/m/Y');
                            var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHorafinal));
                            if (nopuedeSeleccionar) {
                                combo.markInvalid("La hora de fin debe ser mayor que la hora de inicio.");
                            } else {
                                combo.clearInvalid();
                            }
                            return !nopuedeSeleccionar;
                        }
                    },
                    select: function (combo, record, index) {
                        if (_this.estaModificandoRepeticion == 1) {
                            if (_this.valoresInicialesFormRepeticion.horaFinRepeticion != record.data.text) {
                                _this.modRepeticion.horaFinRepeticion = true;
                            } else {
                                _this.modRepeticion.horaFinRepeticion = false;
                            }
                        }
                    },
                    'render': function (c) {
                        if (_this.estaModificandoRepeticion == 1) {
                            c.getEl().on('keyup', function () {
                                if (this.isValid()) {
                                    if (_this.valoresInicialesFormRepeticion.horaFinRepeticion != this.getValue()) {
                                        _this.modRepeticion.horaFinRepeticion = true;
                                    } else {
                                        _this.modRepeticion.horaFinRepeticion = false;
                                    }
                                }
                            }, c);
                        }
                        //Validar campo al escribir
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                _this.validarHoraInicioFin(this, true);
                            }
                        }, c);
                    }
                }
            });

            _this.pclasificadorinvolrepeticiones = _this.objclasificadorinvolrepeticiones.CrearClasificadorInvol(_this.arrayidactrep[0], 3, modificandorepeticion, idautorrepeticion, {id: 'repeticion'});

            // formulario para las repeticiones aletorias
            _this.fprepeticiones = new Ext.FormPanel(
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
                                    items: [_this.dffechainiciorepaleatoria, _this.tmfhorarepaleatoria, _this.tflugarrepaleatoria]
                                }, {
                                    columnWidth: .5,
                                    layout: 'form',
                                    border: false,
                                    items: [_this.dffechafinrepaleatoria, _this.tmfhorafinrepaleatoria]
                                }
                            ]

                        },
                        _this.pclasificadorinvolrepeticiones
                    ],
                    listeners: {
                        'clientvalidation': function (fm, valid) {

                            if (_this.estaModificandoRepeticion == 1) {
                                if (valid && (_this.objclasificadorinvolrepeticiones.modificarInv
                                    || _this.modRepeticion.lugarRepeticion
                                    || _this.modRepeticion.fechaInicioRepeticion
                                    || _this.modRepeticion.fechaFinRepeticion
                                    || _this.modRepeticion.horaInicioRepeticion
                                    || _this.modRepeticion.horaFinRepeticion)) {

                                    _this.winCrudRepeticiones.autoValidate = false;
                                    Ext.getCmp('btaceprepeticion').setDisabled(false);
                                    Ext.getCmp('btaplicarrepeticion').setDisabled(false);


                                } else {
                                    _this.winCrudRepeticiones.autoValidate = true;
                                    Ext.getCmp('btaceprepeticion').setDisabled(true);
                                    Ext.getCmp('btaplicarrepeticion').setDisabled(true);

                                }
                            } else {
                                if (valid) {
                                    _this.winCrudRepeticiones.autoValidate = false;
                                    Ext.getCmp('btaceprepeticion').setDisabled(false);
                                    Ext.getCmp('btaplicarrepeticion').setDisabled(false);

                                } else {
                                    _this.winCrudRepeticiones.autoValidate = true;
                                    Ext.getCmp('btaceprepeticion').setDisabled(true);
                                    Ext.getCmp('btaplicarrepeticion').setDisabled(true);

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
            height: 493,
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
                    iconCls: 'aplicar ',
                    text: 'Aplicar ',
                    id: 'btaplicarrepeticion',
                    disabled: true,
                    nextTab: 'btaceprepeticion',
                    prevTab: 'btcancrepeticion',
                    tooltip: 'Guardar datos y limpiar los campos',
                    handler: function () {
                        _this.CrudRepeticiones(accion, "aplicar", tiporepeticion);
                    }
                }, {
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    id: 'btaceprepeticion',
                    disabled: true,
                    nextTab: tabsig,
                    prevTab: 'btaplicarrepeticion',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.CrudRepeticiones(accion, "aceptar", tiporepeticion);
                    }
                }
            ],
            listeners: {
                destroy: function (win) {
                    _this.datos_repeticiones_ini = "";
                    _this.datos_repeticiones_fin = "";
                    arrayinvolucrados_repeticiones_ini = [];
                    fechafinactmasundia = '';
                    fechainiact = '';

                    _this.objclasificadorinvolrepeticiones.modificarInv = false;
                    _this.modRepeticion.fechaInicioRepeticion = false;
                    _this.modRepeticion.fechaFinRepeticion = false;
                    _this.modRepeticion.horaInicioRepeticion = false;
                    _this.modRepeticion.horaFinRepeticion = false;
                    _this.modRepeticion.lugarRepeticion = false;
                },
                show: function (win) {
                    if (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') {
                        _this.datos_repeticiones_ini = _this.fprepeticiones.getForm().getValues(true);
                        arrayinvolucrados_repeticiones_ini = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
                    }
                },
                beforeshow: function (win) {
                    if (tiporepeticion != 1 && accion == 'Adicionar') {
                        if (fechainiact.toString() == '') {
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
                        if (fechafinactmasundia == '' || fechainiact.toString() == '')
                            _this.fprepeticiones.getComponent('finrepeticion').setDisabled(true);
                    } else if (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') {
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
                _this.tmfhorarepaleatoria.setValue(_this.tmfhora.getValue());
                _this.tmfhorafinrepaleatoria.setValue(_this.tmfhorafin.getValue());
                _this.dffechainiciorepaleatoria.focus(false, 1024);
            }
        }

        if (accion == 'Modificar') {
            Ext.getCmp('btaplicarrepeticion').setVisible(false);
        }

        if (accion == 'Modificar' || accion == 'Duplicar' || accion == 'Puntualizar' || accion == 'Suspender') {
            _this.BarraProgreso.show('Cargando datos');
            _this.CargarDatosRepeticionDesdeCliente();
            _this.BarraProgreso.hide();
            _this.dffechainiciorepaleatoria.focus(false, 1024);
        }
        arr_dates = [];
        arr_hour = [];
        _this.winCrudRepeticiones.show();
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

    this.CrudRepeticiones = function (accion, btn, tiporepeticion) {
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
                        if (fechafinactmasundia == '' || fechainiact.toString() == '') {
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
                        (fechainiact.toString() == '') ? errorformulario = 2 : _this.ObtenerInstanciasAleatoria(tiporepeticion);
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
                    _this.AdicionarRepeticionServidor(accion, btn);
                }

                if (btn == "aceptar") {
                    _this.winCrudRepeticiones.destroy();
                    _this.cbtiporepeticiones.clearValue();
                    _this.smggrepeticiones.clearSelections();
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                } else if (_this.estamodificando == 0 && btn == "aplicar") {
                    _this.tflugarrepaleatoria.setValue("");
                    _this.smggrepeticiones.clearSelections();
                }
            } else if (errorformulario == 1) {
                mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
                return
            } else if (errorformulario == 2) {
                _this.notificarErrorAdicionarRept(tiporepeticion);
                return
            }
        }
        if (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') {
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
                    mostrarMensaje(1, ' La repetici&oacute;n ha sido ' + accionejecutada + ' satisfactoriamente.');
                    _this.winCrudRepeticiones.destroy();

                } else {
                    mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
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
                            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificarrepeticion',
                            params: {
                                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                                idactrepeticion: _this.arrayrepeticionesseleccionadas[0].idactividad,
                                idactividad: _this.arrayidactividades[0]
                            },
                            failure: function (form, action) {
                                _this.BarraProgreso.hide();
                                console.log(btn, btn)
                                if (action.result.mensaje == 1) {
                                    mostrarMensaje(1, 'La repetici&oacute;n ha sido modificada satisfactoriamente.');
                                    guardarcambios = true;
                                    _this.stggrepeticiones.load();
                                    _this.winCrudRepeticiones.destroy();
                                }
                                if (action.result.mensaje == 0) {
                                    mostrarMensaje(1, 'La actividad a al cual usted quiere modificarle la repetici&oacute;n ya no se encuentra en los registros.', function () {
                                        _this.winCrudRepeticiones.destroy();
                                        _this.winCrudActividades.destroy();
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
                    }
                }
            }
        }
    };

    this.CrudActividades = function (PostAccionesGestionar, accion, aplicar, fechainicio) {
        arrayidrecursosasociados = _this.objactivrecurso.retornarasociados();
        arrayidrecursosdesasociados = _this.objactivrecurso.retornardesasociados();
        duplicando = 0;
        var idpadreactividad = _this.arrayidactividades[0];
        url = 'adicionaractividad';
        waitMsg = 'Guardando datos de la actividad';
        postaccion = 'adicionada';
        existe = 'adicionar';
        elementosrelacionados = _this.objcmprelaciones.ObtenerElementosRelacionados();
        if (_this.arrayelementosrelacionadosinicial.length > 0) {
            for (var i = 0; i < _this.arrayelementosrelacionadosinicial.length; i++) {
                elementosrelacionados.push(_this.arrayelementosrelacionadosinicial[i]);
            }
        }
        if (accion == 'Modificar') {
            var idactividad = _this.arrayidactividades[0];
            url = 'modificaractividad';
            waitMsg = 'Guardando datos de la actividad';
            postaccion = 'modificada';
            existe = 'modificar';
        }
        if (accion == 'Duplicar') {
            duplicando = 1;
            idactividad = _this.arrayidactividades[0];
            idpadreactividad = _this.arrayidactividades[1];
            waitMsg = 'Duplicando actividad';
            postaccion = 'duplicada';
        }
        if (accion == 'Suspender') {
            waitMsg = 'Suspendiendo actividad';
            postaccion = 'suspendida';
        }
        if (_this.fpCrudActividades.getForm().isValid()) {
            _this.btnaplicar = false;
            var procede = 0;
            var patron = /[a-zA-Z0-9áéíóúñüÑ]/;
            if (_this.tfdenominacion.getValue().match(patron)) {
                procede = 1;
            }
            if (procede == 1) {
                var arrayrelaciones_fin = [];
                var arrayrepeticiones_fin = [];
                _this.datos_fin = _this.fpCrudActividades.getForm().getValues(true);
                var arrayinvolucrados_fin = _this.objclasificadorinvol.ObtenerInvolucrados(true);
                arrayrelaciones_fin = _this.objcmprelaciones.ObtenerIDElementosRelacionados();
                arrayrepeticiones_fin = _this.obtenerIdRepeticiones();
                var aux = _this.datos_fin.lastIndexOf('&cbrelacionadocon');
                if (_this.tpdatosactividad.getActiveTab() == _this.prelaciones || aux != -1) {
                    _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(_this.datos_fin.lastIndexOf('&cbrelacionadocon')), '');
                }
                var aux_repeticiones = _this.datos_fin.lastIndexOf('&idrept');
                if (_this.tpdatosactividad.getActiveTab() == _this.prepeticiones || aux_repeticiones != -1) {
                    _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(_this.datos_fin.lastIndexOf('&idrept')), '');
                }
                var heparticipantes_fin = (_this.heparticipantes.getValue() != null) ? _this.heparticipantes.getValue() : null;
                var hedescripcion_fin = (_this.hedescripcion.getValue() != null) ? _this.hedescripcion.getValue() : null;
                var hedirigentes_fin = (_this.hedirigentes.getValue() != null) ? _this.hedirigentes.getValue() : null;
                var replazardesde = 0;
                var pDescripActActivo = _this.datos_fin.lastIndexOf('&hedescripcionact');
                if (pDescripActActivo != -1) {
                    replazardesde = pDescripActActivo;
                    _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(replazardesde), '');
                }
                var pDirigActActivo = _this.datos_fin.lastIndexOf('&hedirigentesact');
                if (pDirigActActivo != -1) {
                    if (replazardesde != 0)
                        replazardesde = (replazardesde > pDirigActActivo) ? pDirigActActivo : replazardesde;
                    else
                        replazardesde = pDirigActActivo;
                    _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(replazardesde), '');
                }
                var pParticActActivo = _this.datos_fin.lastIndexOf('&heparticipantesact');
                if (pParticActActivo != -1) {
                    if (replazardesde != 0)
                        replazardesde = (replazardesde > pParticActActivo) ? pParticActActivo : replazardesde;
                    else
                        replazardesde = pParticActActivo;
                    _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(replazardesde), '');
                }
                if ((_this.datos_fin !== _this.datos_ini
                    || arrayinvolucrados_fin.toString() !== arrayinvolucrados_ini.toString()
                    || arrayrepeticiones_fin.toString() !== arrayrepeticiones_ini.toString()
                    || arrayrelaciones_fin.toString() !== arrayrelaciones_ini.toString()
                    || heparticipantes_fin !== _this.heparticipantes_ini
                    || hedescripcion_fin !== _this.hedescripcion_ini
                    || hedirigentes_fin !== _this.hedirigentes_ini)
                    || accion == 'Duplicar' || guardarcambios == true
                    || _this.primerconteo !== _this.stggrepeticiones.getCount()) {
                }
                _this.BarraProgreso.show(waitMsg);
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
                var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
                var arrayrepeticiones = _this.ObtenerRepeticiones();
                var actprincipal = this.EsPrincipal();
                var efectocadena = (_this.chefectocadena.getValue() == true) ? 1 : 0;
                var arraydocumentos = [];
                if (usarGD)
                    arraydocumentos = _this.objcmpgestordoc.ObtenerDocumentos();
                _this.fpCrudActividades.getForm().submit({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/' + url,
                    params: {
                        asociados: Ext.encode(arrayidrecursosasociados),
                        idactividadpadre: idpadreactividad,
                        accion: accion,
                        eshija: (accion == 'Puntualizar' || accion == 'Suspender') ? 1 : _this.eshija,
                        arrayinvolucrados: Ext.encode(arrayinvolucrados),
                        arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                        arrayrepeticiones: Ext.encode(arrayrepeticiones),
                        idactividad: idactividad,
                        arrayelementosrelacionados: Ext.encode(elementosrelacionados),
                        principal: actprincipal,
                        efectocadena: efectocadena,
                        denominactividad: _this.tfdenominacion.getValue(),
                        duplicando: duplicando,
                        porciento_re: _this.tfporciento_re.getValue(),
                        documentos: Ext.encode(arraydocumentos),
                        actividadpadre: _this.actividadpadre,
                        peso: _this.nfPeso.getValue(),
                        idtipoelemento: (accion == 'Puntualizar' || accion == 'Suspender') ? 7 : 3,
                        idcategoria: _this.cbbcat.getValue(),
                        denomcategoria: _this.cbbcat.getRawValue(),
                        idtipo: _this.cbbtipo.getValue(),
                        denomtipo: _this.cbbtipo.getRawValue(),
                        duracion: _this.tiempoestimado.getValue(), //horaslaborables,
                        tmfhoraact: _this.tmfhora.getValue(),
                        tmfhorafinact: _this.tmfhorafin.getValue(),
                        idsubsistema: 1,
                        hedescripcionact: _this.hedescripcion.getValue(),
                        hedirigentesact: _this.hedirigentes.getValue(),
                        heparticipantesact: _this.heparticipantes.getValue(),
                        act_bienestar:(_this.act_bienestar)?1:0
                    },
                    failure: function (form, action) {
                        _this.BarraProgreso.hide();
                        _this.objclasificadorinvol.ResetearArregloDeInvolucradosEliminar();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'La actividad ha sido ' + postaccion + ' satisfactoriamente.');
                            if (aplicar == 0) {
                                _this.winCrudActividades.destroy();
                                if (PostAccionesGestionar != null)
                                    PostAccionesGestionar(action.result.mensaje, accion, action.result);
                            } else {
                                _this.fpCrudActividades.getForm().reset();
                                _this.fini.setValue(fechainicio);
                                _this.fini.setMaxValue(null);
                                _this.ffin.setMinValue(_this.fini.getValue());
                                _this.ffin.setValue(_this.fini.getValue());
                                _this.validarHorasLaborables(_this.fini, _this.ffin);
                                _this.objcmprelaciones.ResetearRelaciones();
                                _this.stgginvolucradosrepeticion.removeAll();
                                _this.objclasificadorinvol.ResetearCampos();
                                _this.stggrepeticiones.removeAll();

                                _this.objclasificadorinvol.verificarCantInv = false;
                                _this.btnVerificarConflicto.setDisabled(true);
                                _this.btnVerificarTiempoLibre.setDisabled(true);
                            }
                        }
                        if (action.result.mensaje == 2) {
                            mostrarMensaje(1, 'La actividad que quiere ' + existe + ' ya existe.');
                        }
                        if (action.result.mensaje == 4) {
                            mostrarMensaje(1, 'Las fechas de la actividad seleccionada no pueden ser modificadas.', function () {
                                _this.winCrudActividades.destroy();
                                PostAccionesGestionar(action.result.mensaje, accion);
                            });
                        }
                        if (action.result.mensaje == 0) {
                            mostrarMensaje(1, 'La actividad a al cual usted quiere agregarle una actividad hija ya no se encuentra en los registros.', function () {
                                _this.winCrudActividades.destroy();
                                PostAccionesGestionar(action.result.mensaje, accion);
                            });
                        }
                        if (action.result.mensaje == 3) {
                            mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function () {
                                _this.winCrudActividades.destroy();
                                PostAccionesGestionar(action.result.mensaje, accion);
                            });
                        }
                        if (action.result.mensaje == 6) {
                            mostrarMensaje(1, 'Usted no tiene los permisos necesarios para modificar la actividad seleccionada.');
                            _this.permisomodificar = 0;
                            _this.winCrudActividades.destroy();
                            PostAccionesGestionar(0, accion);

                        }
                        if (action.result.mensaje == 5) {
                            mostrarMensaje(1, 'La actividad ha sido ' + postaccion + ' satisfactoriamente. <br><br> Ocurri&oacute; un error al enviar la notificaci&oacute;n por correo electr&oacute;nico.');
                            _this.winCrudActividades.destroy();
                            if (PostAccionesGestionar != null) {
                                PostAccionesGestionar(action.result.mensaje, accion, action.result.padre_raiz, idactividad);
                            }

                        }
                    }
                });
            }
        }
    };

    this.ModificarHorarioActividad = function (arrayidactividades, horainicio, horafin, PostAccionesGestionar) {
        mostrarMensaje(2, ' ¿Est&aacute; seguro que quiere modificar el horario de esta actividad? ', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Modificando actividad');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificarhorarioactividad',
                    params: {
                        idactividad: arrayidactividades[0],
                        horainicio: horainicio,
                        horafin: horafin
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function () {
                                PostAccionesGestionar();
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La actividad ha sido modificada satisfactoriamente.');
                            PostAccionesGestionar();
                        }
                    }
                });
            } else {
                PostAccionesGestionar();
            }
        });
    };

    this.notificarErrorAdicionarRept = function (tiporepeticion) {
        switch (tiporepeticion) {
            case 1:
                mostrarMensaje(2, " Para adicionar una repetición periódica debe especificar la fecha (inicio - fin) de la actividad. ¿Desea especificar la fecha (inicio - fin) de la actividad? ", function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.winCrudRepeticiones.destroy();
                        _this.tpdatosactividad.setActiveTab('pdatosgenerales');
                    } else {
                        Ext.getCmp('btaceprepeticion').setDisabled(true);
                        Ext.getCmp('btaplicarrepeticion').setDisabled(true);
                    }
                });
                break;
            case 2:
                mostrarMensaje(2, " Para adicionar una repetición aleatoria debe especificar la fecha inicio de la actividad. ¿Desea especificar la fecha inicio de la actividad? ", function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.winCrudRepeticiones.destroy();
                        _this.tpdatosactividad.setActiveTab('pdatosgenerales');
                    } else {
                        Ext.getCmp('btaceprepeticion').setDisabled(true);
                        Ext.getCmp('btaplicarrepeticion').setDisabled(true);
                    }
                });
                break;
        }
    };

    this.EliminarActividades = function (arrayidactividades, PostAccionesGestionar, sm, TG, calendario) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion1 = '', mensajeconfirmacion0 = '',
            mensajeconfirmacion2 = '', mensajeconfirmacion3 = '';

        if (arrayidactividades.length == 1 || calendario) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar la actividad seleccionada?';
            mensajemascara = 'Eliminando actividad';
            mensajeconfirmacion0 = 'La actividad que usted quiere eliminar ya no se encuentra en los registros.';
            mensajeconfirmacion1 = 'La actividad ha sido eliminada satisfactoriamente.';
            mensajeconfirmacion2 = 'Usted no tiene los permisos necesarios para eliminar la actividad seleccionada.';
            mensajeconfirmacion3 = 'La actividad con permiso para eliminarse han sido eliminada satisfactoriamente.';

        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar las actividades seleccionadas?';
            mensajemascara = 'Eliminando actividades';
            mensajeconfirmacion0 = 'Las actividades que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion1 = 'Las actividades han sido eliminadas satisfactoriamente.';
            mensajeconfirmacion2 = 'Usted no tiene los permisos necesarios para eliminar las actividades seleccionadas.';
            mensajeconfirmacion3 = 'Las actividades con permiso para eliminarse han sido eliminadas satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
                    params: {
                        arrayidactividades: Ext.encode(arrayidactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion1);
                            PostAccionesGestionar(1, 'Eliminar');
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion0, function () {
                                PostAccionesGestionar(0, 'Eliminar');
                            });
                        }
                        if (responseData.mensaje == 2) {
                            mostrarMensaje(1, mensajeconfirmacion2);
                            PostAccionesGestionar(1, 'Eliminar');
                            _this.permisoeliminar = 0;
                        }
                        if (responseData.mensaje == 3) {
                            mostrarMensaje(1, mensajeconfirmacion3);
                            PostAccionesGestionar(0, 'Eliminar');
                        }
                    }
                });
            } else {
                if (sm.hasSelection()) {
                    sm.clearSelections();
                    TG.getView().refresh(true);
                }
            }
        });
    };

    this.HacerRaizActividades = function (arrayidactividades, sm, st, start) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        if (arrayidactividades.length == 1) {
            mensajeconfirmacion = 'La sub-actividad ha sido reordenada satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar la sub-actividad seleccionada?';
            mensajemascara = 'Reorganizando sub-actividad';
            mensajeconfirmacion2 = 'No se ha podido reordenar la sub-actividad seleccionada.';
        } else {
            mensajeconfirmacion = 'Las sub-actividades han sido reordenadas satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar las sub-actividades seleccionadas?';
            mensajemascara = 'Reorganizando sub-actividades';
            mensajeconfirmacion2 = 'No se han podido reordenar las sub-actividades seleccionadas.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/hacerRaizActividades',
                    params: {
                        arrayidactividades: Ext.encode(arrayidactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                                //_this.arrayidobjetivosReorganizar = [];
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            st.reload({
                                params: {
                                    anode: null,
                                    start: start
                                }
                            });
                            sm.clearSelections();
                        }
                    }
                });
            } else {
                if (sm.hasSelection())
                    sm.clearSelections();
            }
        });
    };

    this.EliminarRepeticiones = function () {
        var arrayrepeticionesseleccionadas = _this.smggrepeticiones.getSelections();
        var mensajerepeticion = '', mensajemascararepeticion = '';
        if (arrayrepeticionesseleccionadas.length > 1) {
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
                    if (arrayrepeticionesseleccionadas.length > 0) {
                        for (var i = 0; i < arrayrepeticionesseleccionadas.length; i++) {
                            _this.stggrepeticiones.remove(arrayrepeticionesseleccionadas[i]);
                        }
                    }
                    _this.stgginvolucradosrepeticion.removeAll();
                    _this.BarraProgreso.hide();
                    var mensajeinformacion = '';
                    if (arrayrepeticionesseleccionadas.length > 1)
                        mensajeinformacion = 'Las repeticiones han sido eliminadas satisfactoriamente.';
                    else
                        mensajeinformacion = 'La repetici&oacute;n ha sido eliminada satisfactoriamente.';
                    mostrarMensaje(1, mensajeinformacion);
                    _this.ActualizarEstadoBarraHerramientasRepeticiones();
                } else {
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminarrepeticion',
                        params: {
                            idactividad: _this.arrayidactividades[0],
                            arrayrepeticiones: Ext.encode(_this.arrayrepeticionesseleccionadas)
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad a la cual usted quiere eliminarle las repeticiones ya no se encuentra en los registros.', function () {
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

    this.ObtenerInstanciasAleatoria = function (tiporepeticion) {
        var arrayInvolucradosRepAlea = _this.objclasificadorinvolrepeticiones.ObtenerInvolucrados();
        var repeticion = {};
        var fechainicioRe = _this.dffechainiciorepaleatoria.getValue();
        var fechafinRe = _this.dffechafinrepaleatoria.getValue();
        var lugarRe = _this.tflugarrepaleatoria.getValue();
        var horaRe = _this.tmfhorarepaleatoria.getValue();
        var horafinRe = _this.tmfhorafinrepaleatoria.getValue();
        repeticion = {
            idrepeticion: _this.contadorid,
            idactividad: _this.contadorid,
            fechainicioRe: fechainicioRe,
            fechafinRe: fechafinRe,
            lugar: lugarRe,
            horaRe: horaRe,
            horafinRe: horafinRe,
            involucrados: arrayInvolucradosRepAlea,
            tipoDeRep: tiporepeticion
        };
        _this.contadorid++;
        _this.arrayRepeticiones.push(repeticion);
    };

    this.CalcularIntervaloRepeticionPeriodica = function (tiporepeticion) {
        //variables para el calculo
        var FechaFinActMadre = _this.ffin.getValue(); //fecha fin de la actividad principal o madre
        var DiferenciaLosDias = _this.DiferenciaDeFechas(); //retorna la diferencia de dias entre fecha de inicio y fecha fin de la actividad principal o madre
        var CantidadRepeticion = _this.tfdespuesdnrepeticiones.getValue(); //cantidad de veces que se repite
        var k = parseInt(_this.tfcadandias.getValue());
        //variables del arreglo
        var repeticionPer = {};
        var lugarRePer = _this.tflugar.getValue();
        var horaRePer = _this.tmfhora.getValue();
        var horafinRePer = _this.tmfhorafin.getValue();
        var indexx;
        //variable fecha
        var FechaFinMadreFormatiada;
        var FechaInicioHijo;
        var FechaFinHijo;
        var fechaFinFija = _this.terminarenfechan.getValue();
        var NumeroCincoAnno = 365 * 5 + 1; //cinco año
        var f;
        var involrep = [];
        var arrayinvolucradosrepeticion = [];
        //terminar tras...
        if (_this.radioChekiado == 1) {
            for (var i = 0; i < CantidadRepeticion; i++) {
                //calcular la fecha de inicio de la rep
                FechaFinMadreFormatiada = FechaFinActMadre.format("m/d/Y");
                FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
                //Calcular la fecha fin de la rep
                FechaFinHijo = new Date(FechaInicioHijo).add(Date.DAY, DiferenciaLosDias);
                // armando el arreglo de rep
                repeticionPer = {
                    idrepeticion: _this.contadorid,
                    idactividad: _this.contadorid,
                    fechainicioRe: FechaInicioHijo,
                    fechafinRe: FechaFinHijo,
                    lugar: lugarRePer,
                    horaRe: horaRePer,
                    horafinRe: horafinRePer,
                    tipoDeRep: tiporepeticion,
                    involucrados: arrayinvolucradosrepeticion
                };
                _this.contadorid++;
                //para la proxima repeticion.
                FechaFinActMadre = FechaFinHijo;
                _this.arrayRepeticiones.push(repeticionPer);
            }
        }// Terminar el
        if (_this.radioChekiado == 2) {
            //calcular la fecha de inicio de la rep
            FechaFinMadreFormatiada = FechaFinActMadre.format("m/d/Y");
            FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
            f = FechaFinActMadre;
            while (FechaInicioHijo.between(f, fechaFinFija)) {
                FechaFinMadreFormatiada = FechaFinActMadre.format("m/d/Y");
                FechaInicioHijo = new Date(FechaFinMadreFormatiada).add(Date.DAY, k);
                //Calcular la fecha fin de la rep
                FechaFinHijo = new Date(FechaInicioHijo).add(Date.DAY, DiferenciaLosDias);
                if (!FechaInicioHijo.between(f, fechaFinFija))
                    break;
                // armando el arreglo de rep
                repeticionPer = {
                    idrepeticion: _this.contadorid,
                    idactividad: _this.contadorid,
                    fechainicioRe: FechaInicioHijo,
                    fechafinRe: FechaFinHijo,
                    lugar: lugarRePer,
                    horaRe: horaRePer,
                    horafinRe: horafinRePer,
                    tipoDeRep: tiporepeticion,
                    involucrados: arrayinvolucradosrepeticion
                };
                _this.contadorid++;
                //para la proxima repeticion.
                FechaFinActMadre = FechaFinHijo;
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
                    name: 'idactividad'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'hora'
                }, {
                    name: 'horafin'
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
                idactividad: _this.arrayRepeticiones[i]['idactividad'],
                fechainicio: fi,
                fechafin: ff,
                hora: _this.arrayRepeticiones[i]['horaRe'],
                horafin: _this.arrayRepeticiones[i]['horafinRe'],
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

    this.CargarInvolucradosRepeticion = function (record, accion) {
        if (_this.arrayrepeticionesseleccionadas.length <= 1) {
            if (accion == 'marcado') {
                var involucrado = {};
                var arrayinvolucradosrepet = record.data.involucrados;
                if (arrayinvolucradosrepet.length > 0) {
                    _this.stgginvolucradosrepeticion.removeAll();
                    _this.stgginvolucradosrepeticion.loadData(arrayinvolucradosrepet);
                }
            } else {
                _this.stgginvolucradosrepeticion.removeAll();
            }
        } else {
            _this.stgginvolucradosrepeticion.removeAll();
        }
    };

    this.restaFechas = function (f1, f2) {
        var aFecha1 = f1.split('/');
        var aFecha2 = f2.split('/');
        var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
        var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        return dias;
    }

    this.sumarDiasFecha = function (fecha, dias) {
        var fi = fecha.split('/')[2] + "-" +
            fecha.split('/')[1] + "-" +
            fecha.split('/')[0];
        var dt_ini = new Date(fi);
        dt_ini.setDate(dt_ini.getDate() + dias + 1);
        return dt_ini;

    }

    this.CargarDatosRepeticionDesdeCliente = function () {
        _this.dffechainiciorepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].fechainicio);
        _this.dffechafinrepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].fechafin);
        _this.tmfhorarepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].horainicio);
        _this.tmfhorafinrepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].horafin);
        _this.tflugarrepaleatoria.setValue(_this.arrayrepeticionesseleccionadas[0].lugar);

        //validar modificar de repeticiones
        this.valoresInicialesFormRepeticion.fechaInicioRepeticion = _this.arrayrepeticionesseleccionadas[0].fechainicio;
        this.valoresInicialesFormRepeticion.fechaFinRepeticion = _this.arrayrepeticionesseleccionadas[0].fechafin;
        this.valoresInicialesFormRepeticion.horaInicioRepeticion = _this.arrayrepeticionesseleccionadas[0].horainicio;
        this.valoresInicialesFormRepeticion.horaFinRepeticion = _this.arrayrepeticionesseleccionadas[0].horafin;
        this.valoresInicialesFormRepeticion.lugarRepeticion = _this.arrayrepeticionesseleccionadas[0].lugar;

        if (_this.arrayrepeticionesseleccionadas[0].involucrados) {
            if (_this.arrayrepeticionesseleccionadas[0].involucrados.length > 0) {
                for (var i = 0; i < _this.arrayrepeticionesseleccionadas[0].involucrados.length; i++) {
                    _this.objclasificadorinvolrepeticiones.CargarGridInvolucrados(_this.arrayrepeticionesseleccionadas[0].involucrados[i]);
                }
            }
        }
    };

    this.ModificarRepeticionDesdeCliente = function (tiporepeticion, accion) {
        if (accion == 'Modificar' || accion == 'Puntualizar' || accion == 'Suspender') {
            _this.stggrepeticiones.remove(_this.smggrepeticiones.getSelected());
        }
        _this.ObtenerInstanciasAleatoria(tiporepeticion);
        _this.CargarRepeticionesCliente();
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
                    hora: repeticionesexistentes[i].data.hora,
                    horafin: repeticionesexistentes[i].data.horafin,
                    lugar: repeticionesexistentes[i].data.lugar,
                    tiporepeticion: repeticionesexistentes[i].data.tiporepeticion,
                    involucrados: repeticionesexistentes[i].data.involucrados
                };
                arrayrepeticiones.push(repeticion);
            }
        }
        return arrayrepeticiones;
    };

    this.EsPrincipal = function () {
        if (_this.chprincipal.getValue() == true) {
            esprincipal = 1
        } else
            (esprincipal = 0);
        return esprincipal;
    };

    this.AdicionarRepeticionServidor = function (accion, btn) {
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
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/' + url + 'repeticion',
            params: {
                idactividad: _this.arrayidactividades[0],
                arrayrepeticiones: Ext.encode(_this.arrayRepeticiones)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 0) {
                    mostrarMensaje(1, 'La actividad a la cual usted quiere ' + accionfuturo + ' la repetici&oacute;n ya no se encuentra en los registros.', function () {
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
                    if (btn != "aplicar")
                        _this.winCrudRepeticiones.destroy();

                    _this.stggrepeticiones.load();
                }
            }
        });
        _this.arrayRepeticiones = [];
    };

    this.AnalizarProcesoDuplicado = function (objactividad, PostAccionesGestionar, arrayidactividades,
                                              arrayelementosrelacionadosinicial, usuario_logueado) {
        arrayidactividades[1] = objactividad._parent;
        _this.subordinado = objactividad.subordinado;
        _this.CrearWinCrudActividades(
            new Date().format('d/m/Y'),
            new Date().format('d/m/Y'),
            '8:00 AM',
            '5:00 PM',
            'Duplicar',
            PostAccionesGestionar,
            arrayidactividades,
            null, //idautor
            (objactividad._parent != null) ? 1 : 0,
            permisomodificar = 1,
            permisoeliminar = 1,
            arrayelementosrelacionadosinicial, null, null, null, null, null, null, null, null, usuario_logueado);
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

    this.GetRangeHour = function (hour_ini, hour_end) {
        hour_iniold = arr_hour.pop(); //obteniendo hora anterior a la que se modofica en el TImefield inicio.
        if (hour_iniold && hour_ini != hour_iniold) {
            range_hour = hour_end.getElapsed(hour_iniold);//obteniendo rango de milisegundos entre la hora inicial y final dadas.
            new_hour_end = hour_ini.add(Date.MILLI, range_hour); //cse adiciona la diferencia entre la hora inicial y final a la inicial para obtener nueva hora
            return new_hour_end;
        } else
            return hour_end;
    };

    this.selectHour = function (record, tm_end) {
        hour_ini = Date.parseDate(record.get('text'), "g:i A");
        hour_fin = Date.parseDate(tm_end.getValue(), "g:i A");
        new_hour_fin = _this.GetRangeHour(hour_ini, hour_fin);
        tm_end.setValue(new_hour_fin);
    };

    function MostrarImagenEstadoCumplimiento(val) {
        if (val) {
            val0 = val;
            val1 = val0.split("(");
            val2 = val1[1].split("%");
            val3 = val2[0] * 1;
            if (val3 == 0) {
                //return '<span><img src="../../../comun/recursos/images/fam/flag_red.png" >' + ' ' + val + '</span>';
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

    this.MaxValue = function (porciento) {
        if (porciento <= 0) {
            _this.tfporciento_re.maxValue = _this.tfporciento_re.getValue();
        } else {
            _this.tfporciento_re.maxValue = parseInt(_this.tfporciento_re.getValue()) + parseInt(porciento);
        }
    };

    this.validarHorasLaborables = function (fini, ffin) {
        if (fini.isValid() && ffin.isValid()) {
            horaslaborables = ((((ffin.getValue() - fini.getValue()) / 86400) / 1000) + 1) * 24;  //24 horas
            _this.tiempoestimado.maxValue = horaslaborables;
            var maxText = 'Solo admite números enteros positivos entre 0 y ' + horaslaborables + '. Con 2 cifras decimales.';
            _this.tiempoestimado.maxText = maxText;
            _this.tiempoestimado.validate();
        }
    };

    this.validarHoraInicioFin = function (timefield, eshorafin) {
        if (!_this.fini.isValid() || !_this.ffin.isValid()) {
            timefield.markInvalid('Debe validar los campos fecha de inicio y/o fecha de fin.');
        } else {
            var msj = "La hora de inicio debe ser menor que la hora de fin.";
            if (eshorafin) {
                msj = "La hora de fin debe ser mayor que la hora de inicio.";
            }
            var vHoraFinal = false;
            var vHoraInicial = false;
            if (_this.tmfhorafin.isValid()) {
                vHoraFinal = Date.parseDate(_this.tmfhorafin.getValue(), _this.formatohora).format("U");
            }
            if (_this.tmfhora.isValid()) {
                vHoraInicial = Date.parseDate(_this.tmfhora.getValue(), _this.formatohora).format("U");
            }
            if (vHoraInicial && vHoraFinal) {
                var vFechaInicial = _this.fini.getValue().format('d/m/Y');
                var vFechaFin = _this.ffin.getValue().format('d/m/Y');
                var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
                if (nopuedeSeleccionar) {
                     timefield.markInvalid(msj);
                    (eshorafin) ? _this.mod.horafin = false : _this.mod.horaini = false;

                } else {
                    _this.tmfhorafin.clearInvalid();
                    _this.tmfhora.clearInvalid();
                }
            }
        }
    };

    this.correccionErroresHora = function () {
        var vHoraFinal, vHoraInicial;
        if (_this.tmfhorafin.isValid() && (_this.tmfhorafin.getValue() != '' || _this.tmfhorafin.getValue() != null)) {
            vHoraFinal = Date.parseDate(_this.tmfhorafin.getValue(), _this.formatohora).format("U");
        } else {
            var horafin = '17:00';
            _this.tmfhorafin.setValue(horafin);
            vHoraFinal = horafin;
        }
        if (_this.tmfhora.isValid() && (_this.tmfhora.getValue() != '' || _this.tmfhora.getValue() != null)) {
            vHoraInicial = Date.parseDate(_this.tmfhora.getValue(), _this.formatohora).format("U");
        } else {
            var horaini = '08:00';
            _this.tmfhora.setValue(horaini);
            vHoraInicial = horaini;
        }
        var vFechaInicial = _this.fini.getValue().format('d/m/Y');
        var vFechaFin = _this.ffin.getValue().format('d/m/Y');
        var nopuedeSeleccionar = ((vFechaFin == vFechaInicial) && (vHoraInicial > vHoraFinal));
        if (nopuedeSeleccionar) {
            _this.tmfhorafin.setValue(_this.tmfhora.getValue());
            _this.valoresiniform.horafin = _this.tmfhora.getValue();
        }

    }

    this.obtenerBtnActualizarPanelInvol = function () {
        var tbarPanelInvol = _this.pclasificadorinvol.getComponent('tpInvolucradosUserEst').topToolbar.items.items;
        for (i in tbarPanelInvol) {
            if (tbarPanelInvol[i].id == 'btnActualizarExpandirAgrupacion') {
                var btnActualizarPanelInvol = tbarPanelInvol[i];
                break;
            }
        }
        return btnActualizarPanelInvol;
    }

    function loadJs(jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc);
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    }


};
