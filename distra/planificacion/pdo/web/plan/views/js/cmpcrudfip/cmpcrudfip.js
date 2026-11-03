Utilidades.Cmp.Cmpcrudfip = function() {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.eshija = 0;
    this.arrayidfips = [];
    this.prevrowrep = -1;
    this.contadorid = 0;
    this.radioChekiado = 1;
    this.superior = 0;
    var arr_dates = [];
    this.datos_ini = "";
    this.datos_fin = "";
    var arrayinvolucrados_ini = [];
    this.heparticipantes_ini = '';
    this.hedirigentes_ini = '';
    this.hedescripcion_ini = '';
    this.heemite_ini = '';
    _this.btnaplicar = false;
    this.mod = ({
        denominacion: false,
        participantes: false,
        dirigentes: false,
        emite: false,
        descripcion: false,
        fechaemision: false,
        fechacumplimiento: false,
        fechacumplio: false,
        documento: false,
        porciento: false,
        tipofip: false,
        nivelacceso: false
    });
    this.valoresiniform = ({
        denominacion: '',
        participantes: '',
        dirigentes: '',
        emite: '',
        descripcion: '',
        fechaemision: null,
        fechacumplimiento: null,
        fechacumplio: null,
        documento: '',
        porciento: '',
        tipofip: '',
        nivelacceso: ''
    });

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "gestion documental"
    this.objcmpgestordoc = new Utilidades.Cmp.Cmpgestordocumental();

    //objeto del componente "Fechas de control""
    this.objfechascontrol = new Utilidades.Cmp.Cmpfechacontrol();

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangfechas: function(val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = [];
                for (i = 0; i < field.startDateField.length; i++) {
                    start[i] = Ext.getCmp(field.startDateField[i]);
                }
                for (i = 0; i < start.length; i++) {
                    start[i].setMaxValue(date);
                    start[i].validate();
                }
                this.dateRangeMax = date;

            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = [];
                for (i = 0; i < field.endDateField.length; i++) {
                    end[i] = Ext.getCmp(field.endDateField[i]);
                }
                if (end.length != 0) {
                    for (i = 0; i < end.length; i++) {
                        end[i].setMinValue(date);
                        end[i].validate();
                    }
                }
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        }
    });
    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudFips = function(fechaemision, fechacumplimiento, accion, PostAccionesGestionar, arrayidfips, idautor, eshija, permisomodificar, permisoeliminar, sm, st) {
        if (_this.winCrudFips) {
            _this.winCrudFips.destroy();
        }
        _this.eshija = eshija;
        _this.arrayidfips = arrayidfips;
        _this.estamodificando = 0;
        _this.permisomodificar = permisomodificar;
        _this.permisoeliminar = permisoeliminar;
        _this.PostAccionesGestionar = PostAccionesGestionar;
        var permiso = 1;
        if (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Duplicar') {
            _this.estamodificando = 1;
        }
        //campo para la denominacion del fip
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionfip',
            fieldLabel: 'Denominación',
            prevTab: (accion == 'Ver datos del') ? 'btnCerrarCrudFip' : 'btnAceptarCrudFip',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '100%',
            listeners: {
                change: function(el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
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
        //campo para la descripcion del fip
        _this.hedescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripcionfip',
            width: 640,
            height: 230,
            listeners: {
                editmodechange: function(editor) {
                    editor.syncValue();
                },
                sync: function(editor, html) {
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
        //campo donde muestro los participantes del fip
        _this.heparticipantes = new Ext.form.HtmlEditor({
            id: 'heparticipantesfip',
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
        //campo donde muestro los dirigentes del fip
        _this.hedirigentes = new Ext.form.HtmlEditor({
            id: 'hedirigentesfip',
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
        });
        //campo donde muestro quien emite el fip
        _this.heemite = new Ext.form.HtmlEditor({
            id: 'heemitefip',
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
                editmodechange: function(editor) {
                    editor.syncValue();
                },
                sync: function(editor, html) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.emite == '') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.emite = false;
                            else
                                _this.mod.emite = true;
                        } else if (_this.valoresiniform.emite != html)
                            _this.mod.emite = true;
                        else
                            _this.mod.emite = false;
                    }
                }
            }
        });

        //campo para la fecha de inicio del fip
        _this.femision = new Ext.form.DateField({
            fieldLabel: 'Fecha de emisi&oacute;n',
            id: 'femifip',
            endDateField: ['fcumpfip', 'fcumpliofip'],
            allowBlank: false,
            maxText: 'La fecha de emisión tiene que ser anterior o igual a la fecha de cumplimiento.',
            vtype: 'rangfechas',
            format: 'd/m/Y',
            anchor: '95%',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.fcumplimiento.setMinValue(date);
                    if (date > _this.fcumplimiento.getValue()) {
                        _this.fcumplimiento.setValue(date);
                    }//Modificar
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.fechaemision != date.format('d/m/Y')) {
                            _this.mod.fechaemision = true;
                        } else {
                            _this.mod.fechaemision = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.fechaemision != c.getValue().format('d/m/Y')) {
                                _this.mod.fechaemision = true;
                            } else {
                                _this.mod.fechaemision = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para la fecha de fin del fip
        _this.fcumplimiento = new Ext.form.DateField({
            fieldLabel: 'Fecha de cumplimiento',
            id: 'fcumpfip',
            vtype: 'rangfechas',
            startDateField: ['femifip'],
            format: 'd/m/Y',
            allowBlank: false,
            minText: 'La fecha de cumplimiento tiene que ser posterior o igual a la fecha de emisión.',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.femision.setMaxValue(date);
                    //Modificar
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.fechacumplimiento != date.format('d/m/Y')) {
                            _this.mod.fechacumplimiento = true;
                        } else {
                            _this.mod.fechacumplimiento = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.fechacumplimiento != c.getValue().format('d/m/Y')) {
                                _this.mod.fechacumplimiento = true;
                            } else {
                                _this.mod.fechacumplimiento = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para la fecha de fin del fip
        _this.fcumplio = new Ext.form.DateField({
            fieldLabel: 'Fecha en que se cumpli&oacute; ',
            id: 'fcumpliofip',
            vtype: 'rangfechas',
            startDateField: ['femifip'],
            format: 'd/m/Y',
            allowBlank: true,
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    //Modificar
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.fechacumplio != date.format('d/m/Y')) {
                            _this.mod.fechacumplio = true;
                        } else {
                            _this.mod.fechacumplio = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.fechacumplio != c.getValue().format('d/m/Y')) {
                                _this.mod.fechacumplio = true;
                            } else {
                                _this.mod.fechacumplio = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para la fecha de control del fip
        _this.fcontrol = new Ext.form.DateField({
            fieldLabel: 'Fecha de control',
            id: 'fcontrol',
            vtype: 'rangfechas',
            startDateField: ['femifip'],
            format: 'd/m/Y',
            allowBlank: true,
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%'
        });

        //campo de texto para el numero del fip
        _this.tfnumfip = new Ext.form.TextField({
            fieldLabel: 'Documento de Origen',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            id: 'numfip',
            anchor: '95%',
            allowBlank: true,
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.documento !== c.getValue().toString()) {
                                _this.mod.documento = true;
                            } else {
                                _this.mod.documento = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para el estado de cumplimiento del fip
        _this.estadocumplimiento = new Ext.form.TextField({
            id: 'estadocumplimientofip',
            fieldLabel: 'Estado de cumplimiento',
            allowBlank: false,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '95%'
        });
        //campo para el grado de cumplimientodel fip
        _this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocumpfip',
            maxValue: 100,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            minValue: 0,
            minText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            value: 0,
            allowNegative: false,
            nanText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            anchor: '95%',
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.porciento !== c.getValue().toString()) {
                                _this.mod.porciento = true;
                            } else {
                                _this.mod.porciento = false;
                            }
                        }, c);
                    }
                }
            }
        });
        _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(arrayidfips[0], 2, _this.estamodificando, idautor);

        //store para el combo para la busqueda de fips por nivel de acceso
        _this.stCmbNivelAcceso = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargarnivelacceso',
            reader: new Ext.data.JsonReader({
                id: 'idnivel',
                root: "data"
            }, [{
                    name: 'idnivel'
                }, {
                    name: 'denominacion'
                }])
        });
        //combo para la busqueda de fips por nivel de acceso
        _this.cbNivelAcceso = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            fieldLabel: 'Nivel de acceso al FIP',
            store: _this.stCmbNivelAcceso,
            hiddenName: 'idnivel',
            valueField: 'idnivel',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '95%',
            listeners: {
                expand: function(combo) {
                    _this.stCmbNivelAcceso.reload();
                },
                select: function(combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.nivelacceso != record.data.idnivel) {
                            _this.mod.nivelacceso = true;
                        } else {
                            _this.mod.nivelacceso = false;
                        }
                    }
                },
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.nivelacceso != c.getValue()) {
                                _this.mod.nivelacceso = true;
                            } else {
                                _this.mod.nivelacceso = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //store para el combo para la busqueda de fips por tipo
        _this.stCmbTipo = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                    name: 'idtipo'
                }, {
                    name: 'denominacion'
                }])
        });
        //combo para la busqueda de fips por tipo
        _this.cbbtipo = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            fieldLabel: 'Tipo de FIP',
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
            listeners: {
                expand: function(combo) {
                    _this.stCmbTipo.reload();
                },
                select: function(combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.tipofip != record.data.idtipo) {
                            _this.mod.tipofip = true;
                        } else {
                            _this.mod.tipofip = false;
                        }
                    }
                },
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.tipofip != c.getValue()) {
                                _this.mod.tipofip = true;
                            } else {
                                _this.mod.tipofip = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //panel donde muestro los datos generales
        _this.pdatosgenerales = new Ext.Panel({
            title: 'Datos generales',
            frame: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.femision, _this.estadocumplimiento]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.fcumplimiento, _this.porcientocump]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.tfnumfip, _this.cbbtipo]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.fcumplio, _this.cbNivelAcceso]
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
                                    id: 'tabPanelFipBottom',
                                    activeTab: 0,
                                    height: 210,
                                    items: [
                                        _this.pclasificadorinvol,
                                        {
                                            xtype: 'panel',
                                            title: 'Participantes',
                                            layout: 'fit',
                                            items: [_this.heparticipantes]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Dirigentes',
                                            layout: 'fit',
                                            items: [_this.hedirigentes]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Emite',
                                            layout: 'fit',
                                            items: [_this.heemite]
                                        }, {
                                            xtype: 'panel',
                                            title: 'Descripci&oacute;n',
                                            layout: 'fit',
                                            items: [_this.hedescripcion]
                                        }, {
                                            xtype: 'panel',
                                            id: 'panelGD',
                                            title: 'Contenidos asociados',
                                            layout: 'fit',
                                            items: [_this.objcmpgestordoc.CrearGridDocAsociados(accion, _this.arrayidfips[0])]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        //panel con el grid para las fechas de control
        _this.pfechascontrol = _this.objfechascontrol.ConstruirPanelFechasControl(_this.estamodificando, _this.arrayidfips[0], _this.AccionPostGestionarFechasControl);

        //tabpanel donde muestro los datos del fip
        _this.tpdatosfip = new Ext.TabPanel({
            height: 350,
            activeTab: 0,
            frame: true,
            items: [_this.pdatosgenerales, _this.pfechascontrol]
        });
        //texto donde muestro el autor del fip
        _this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        //formulario con atributos del fip
        _this.fpCrudFips = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function() {
                        Ext.getCmp('btnAceptarCrudFip').handler.call(this);
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
                            items: [_this.tpdatosfip]
                        }, {
                            columnWidth: 1,
                            bodyStyle: 'padding:10px 10px',
                            layout: 'form',
                            items: [_this.lfautor]
                        }
                    ]
                }],
            listeners: {
                'clientvalidation': function(fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudFip.enable();
                        _this.btnAplicarCrudFip.enable();
                    } else {
                        _this.btnAceptarCrudFip.disable();
                        _this.btnAplicarCrudFip.disable();
                    }
                    //Modificar
                    if (_this.estamodificando == 1) {
                        if (valid && (_this.objclasificadorinvol.modificarInv
                                || _this.mod.denominacion
                                || _this.mod.participantes
                                || _this.mod.dirigentes
                                || _this.mod.emite
                                || _this.mod.descripcion
                                || _this.mod.fechaemision
                                || _this.mod.fechacumplimiento
                                || _this.mod.fechacumplio
                                || _this.mod.documento
                                || _this.mod.porciento
                                || _this.mod.tipofip
                                || _this.mod.nivelacceso
                                || _this.objfechascontrol.modificarFechas
                                )) {
                            _this.btnAceptarCrudFip.enable();
                        } else {//desabilito
                            _this.btnAceptarCrudFip.disable();
                        }
                    }
                }
            }
        });

        _this.btnCancelarCrudFip = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'btnCancelarFip',
            prevTab: (_this.tpdatosfip.getActiveTab() == _this.pfechascontrol) ? 'btnEliminarFechaControl' : null,
            nextTab: (accion == "Modificar" || accion == "Duplicar") ? 'btnAceptarCrudFip' : 'btnAplicarCrudFip',
            hidden: true,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
                _this.winCrudFips.destroy();
                _this.btnaplicar = false;
                if (sm.hasSelection() != null)
                    sm.clearSelections();
            }
        });

        _this.btnAceptarCrudFip = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'btnAceptarCrudFip',
            nextTab: 'tfdenominacionfip',
            prevTab: (accion == "Modificar" || accion == "Duplicar") ? 'btnCancelarFip' : 'btnAplicarCrudFip',
            tooltip: 'Guardar datos y cerrar ventana',
            hidden: true,
            handler: function() {
                _this.CrudFips(PostAccionesGestionar, accion, aplicar = 0);
            }
        });
        _this.btnAplicarCrudFip = new Ext.Button({
            id: 'btnAplicarCrudFip',
            nextTab: 'btnAceptarCrudFip',
            prevTab: 'btnCancelarFip',
            iconCls: 'aplicar ',
            text: 'Aplicar ',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function() {
                _this.CrudFips(PostAccionesGestionar, accion, aplicar = 1);
                _this.btnaplicar = true;
            }
        });
        _this.btnCerrarCrudFip = new Ext.Button({
            id: 'btnCerrarCrudFip',
            iconCls: 'cerrar',
            text: 'Cerrar',
            nextTab: 'btnCerrarCrudFip',
            prevTab: 'btnCerrarCrudFip',
            hidden: true,
            tooltip: 'Cerrar ventana',
            handler: function() {
                _this.winCrudFips.destroy();
            }
        });
        _this.winCrudFips = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            title: accion + ' FIP',
            width: 810,
            height: 500,
            autoScroll: true,
            resizable: false,
            listeners: {
                beforeshow: function(win) {
                    _this.femision.setValue(fechaemision/*new Date().format('d/m/Y')*/);
                    _this.fcumplimiento.setValue(fechacumplimiento/*new Date().format('d/m/Y')*/);
                    if (!usarGD) {
                        //Ext.getCmp('panelGD').disable();
                        var tabpanel = Ext.getCmp('tabPanelFipBottom');
                        var panelGD = Ext.getCmp('panelGD');
                        tabpanel.remove(panelGD, true);
                    }
                },
                beforedestroy: function() {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                destroy: function() {
                    _this.datos_ini = "";
                    _this.datos_fin = "";
                    arrayinvolucrados_ini = [];
                    _this.heparticipantes_ini = '';
                    _this.hedirigentes_ini = '';
                    _this.hedescripcion_ini = '';
                    _this.heemite_ini = '';
                    _this.btnaplicar = false;
                    //Modificar
                    _this.mod.denominacion = false;
                    _this.mod.participantes = false;
                    _this.mod.dirigentes = false;
                    _this.mod.emite = false;
                    _this.mod.descripcion = false;
                    _this.mod.fechaemision = false;
                    _this.mod.fechacumplimiento = false;
                    _this.mod.fechacumplio = false;
                    _this.mod.documento = false;
                    _this.mod.porciento = false;
                    _this.mod.tipofip = false;
                    _this.mod.nivelacceso = false;
                    _this.objfechascontrol.modificarFechas = false;
                }
            },
            buttons: [_this.btnCancelarCrudFip, _this.btnAplicarCrudFip, _this.btnAceptarCrudFip,
                _this.btnCerrarCrudFip],
            items: [_this.fpCrudFips]
        });
        _this.winCrudFips.doLayout();
        _this.winCrudFips.show();
        _this.tfdenominacion.focus(false, 1024);
        _this.stCmbNivelAcceso.load();
        _this.stCmbTipo.load();

        switch (accion) {
            case 'Adicionar':
                _this.btnCancelarCrudFip.setVisible(true);
                _this.btnAceptarCrudFip.setVisible(true);
                _this.objclasificadorinvol.cargarInvolConfPerfil(2);
                break;
            default:
                var accionejecutada = 'que usted quiere modificar';
                if (accion == 'Modificar' || accion == 'Ver datos del' || accion == "Duplicar") {
                    if (accion == 'Modificar') {
                        _this.btnCancelarCrudFip.setVisible(true);
                        _this.btnAceptarCrudFip.setVisible(true);
                        _this.btnAplicarCrudFip.setVisible(false);
                    }
                    if (accion == 'Duplicar') {
                        accionejecutada = 'al cual usted quiere duplicar';
                        _this.btnCancelarCrudFip.setVisible(true);
                        _this.btnAceptarCrudFip.setVisible(true);
                        _this.btnAplicarCrudFip.setVisible(false);
                    }
                    if (accion == 'Ver datos del') {
                        accionejecutada = 'al cual usted quiere ver sus datos';
                        _this.btnCerrarCrudFip.setVisible(true);
                        _this.btnCerrarCrudFip.focus(false, 1024);
                        _this.btnAplicarCrudFip.setVisible(false);
                        _this.objclasificadorinvol.tpinvolucrados.disable();

                        _this.tfdenominacion.disable();
                        _this.cbNivelAcceso.disable();
                        _this.cbbtipo.disable();
                        _this.femision.disable();
                        _this.fcumplimiento.disable();
                        _this.fcumplio.disable();
                        _this.porcientocump.disable();
                        _this.estadocumplimiento.disable();
                        _this.hedescripcion.disable();
                        _this.tfnumfip.disable();
                        Ext.getCmp('btnAdicionarFechaControl').setVisible(false);
                        Ext.getCmp('btnEliminarFechaControl').setVisible(false);

                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargarformfip',
                        params: {
                            idfip: arrayidfips[0]
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                mostrarMensaje(1, 'El FIP ' + accionejecutada + ' ya no se encuentra en los registros.', function() {
                                    _this.winCrudFips.destroy();
                                    PostAccionesGestionar();
                                });
                            } else {
                                _this.BarraProgreso.hide();
                                if (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Duplicar') {
                                    _this.heparticipantes.setValue(responseData.data[0].participantes);
                                    _this.hedirigentes.setValue(responseData.data[0].dirigentes);
                                    _this.heemite.setValue(responseData.data[0].emite);
                                    _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                                }
                                _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                                _this.cbNivelAcceso.setValue(responseData.data[0].nivelacceso.idnivel);
                                _this.cbNivelAcceso.setRawValue(responseData.data[0].nivelacceso.denominacion);
                                _this.cbbtipo.setValue(responseData.data[0].tipo.idtipo);
                                _this.cbbtipo.setRawValue(responseData.data[0].tipo.denominacion);
                                _this.femision.setValue(responseData.data[0].fechaemision);
                                _this.fcumplimiento.setValue(responseData.data[0].fechacumplimiento);
                                _this.fcumplio.setValue(responseData.data[0].fechacumplio);
                                _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                                _this.estadocumplimiento.setValue(responseData.data[0].estadocumplimiento);
                                _this.hedescripcion.setValue(responseData.data[0].descripcion);
                                _this.tfnumfip.setValue(responseData.data[0].numfip);

                                _this.datos_ini = _this.fpCrudFips.getForm().getValues(true);
                                arrayinvolucrados_ini = _this.objclasificadorinvol.ObtenerInvolucrados(true);
                                _this.heparticipantes_ini = _this.heparticipantes.getValue();
                                _this.hedirigentes_ini = _this.hedirigentes.getValue();
                                _this.hedescripcion_ini = _this.hedescripcion.getValue();
                                _this.heemite_ini = _this.heemite.getValue();
                                //var para el modificar
                                _this.valoresiniform.denominacion = responseData.data[0].denominacion;
                                _this.valoresiniform.participantes = responseData.data[0].participantes;
                                _this.valoresiniform.dirigentes = responseData.data[0].dirigentes;
                                _this.valoresiniform.emite = responseData.data[0].emite;
                                _this.valoresiniform.descripcion = responseData.data[0].descripcion;
                                _this.valoresiniform.fechaemision = responseData.data[0].fechaemision;
                                _this.valoresiniform.fechacumplimiento = responseData.data[0].fechacumplimiento;
                                _this.valoresiniform.fechacumplio = responseData.data[0].fechacumplio;
                                _this.valoresiniform.documento = responseData.data[0].numfip;
                                _this.valoresiniform.porciento = responseData.data[0].gradocumplimiento;
                                _this.valoresiniform.tipofip = responseData.data[0].tipo.idtipo;
                                _this.valoresiniform.nivelacceso = responseData.data[0].nivelacceso.idnivel;
                            }
                        }
                    });
                }
        }
    };

    this.DestruirWinCrudFips = function() {
        _this.winCrudFips.destroy();
    };

    this.CrudFips = function(PostAccionesGestionar, accion) {
        url = 'adicionarfip';
        waitMsg = 'Guardando datos del FIP';
        postaccion = 'adicionado';
        existe = 'adicionar';
        if (accion == 'Modificar') {
            url = 'modificarfip';
            waitMsg = 'Guardando datos del FIP';
            postaccion = 'modificado';
            existe = 'modificar';
        }
        _this.BarraProgreso.show(waitMsg);
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
            var arraydocumentos = [];
            if (usarGD)
                arraydocumentos = _this.objcmpgestordoc.ObtenerDocumentos();
        _this.fpCrudFips.getForm().submit({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/' + url,
            params: {
                idfippadre: _this.arrayidfips[0],
                eshija: _this.eshija,
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                idfip: _this.arrayidfips[0],
                arrayfechascontrol: Ext.encode(_this.objfechascontrol.ObtenerFechasControlDesdeCliente()),
                documentos: Ext.encode(arraydocumentos)
            },
            failure: function(form, fipion) {
                _this.BarraProgreso.hide();
                _this.objclasificadorinvol.ResetearArregloDeInvolucradosEliminar();
                if (fipion.result.mensaje == 1) {
                    mostrarMensaje(1, 'El FIP ha sido ' + postaccion + ' satisfactoriamente.');
                    if (aplicar == 0) {
                        _this.winCrudFips.destroy();
                        PostAccionesGestionar(fipion.result.mensaje, accion);
                    } else {
                        _this.fpCrudFips.getForm().reset();
                        _this.objclasificadorinvol.ResetearCampos();
                        _this.objfechascontrol.LimpiarFormulario();
                    }
                }
                if (fipion.result.mensaje == 2) {
                    mostrarMensaje(1, 'El FIP que quiere ' + existe + ' ya existe.');
                }
                if (fipion.result.mensaje == 0) {
                    mostrarMensaje(1, 'El FIP al cual usted quiere agregarle un FIP hija ya no se encuentra en los registros.', function() {
                        _this.winCrudFips.destroy();
                        PostAccionesGestionar(fipion.result.mensaje, accion);
                    });
                }
                if (fipion.result.mensaje == 3) {
                    mostrarMensaje(1, 'El FIP que usted quiere modificar ya no se encuentra en los registros.', function() {
                        _this.winCrudFips.destroy();
                        PostAccionesGestionar(fipion.result.mensaje, accion);
                    });
                }
            }
        });
    };

    this.EliminarFips = function(arrayidfips, PostAccionesGestionar, smTGCmpFips, TGCmpFips) {
        var mensaje = '', mensajemascara = '';
        if (arrayidfips.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los FIPs seleccionados?';
            mensajemascara = 'Eliminando FIPs';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el FIP seleccionado?';
            mensajemascara = 'Eliminando FIP';
        }

        mostrarMensaje(2, mensaje, function(btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/eliminarfip',
                    params: {
                        arrayidfips: Ext.encode(arrayidfips)
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (arrayidfips.length > 1)
                                mensajeconfirmacion = 'Los FIPs han sido eliminados satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'El FIP ha sido eliminado satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar(1, 'Eliminar');
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidfips.length > 1)
                                mensajeconfirmacion2 = 'Los FIPs que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'El FIP que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(1, mensajeconfirmacion2, function() {
                                PostAccionesGestionar(0, 'Eliminar');
                            });
                        }
                    }
                });
            } else {
                if (smTGCmpFips.hasSelection()) {
                    smTGCmpFips.clearSelections();
                    TGCmpFips.getView().refresh(true);
                }
            }
        });
    };

    this.GetRangeDay = function(date_ini, date_end) {
        date_iniold = arr_dates[arr_dates.length - 2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if (date_iniold && date_ini != date_iniold) {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates / 1000 / 60 / 60 / 24; //conviertiendolo a días
            result_date = date_ini.add(Date.DAY, result_day);//obteniendo nueva fecha dado el rango de días
            return result_date;
        } else
            return date_ini;
    };

    this.AccionPostGestionarFechasControl = function(mensaje) {
        switch (mensaje) {
            case 1:
                break;
            default:
                _this.winCrudFips.destroy();
                _this.PostAccionesGestionar();
        }
    }


};
