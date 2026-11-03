Utilidades.Cmp.Cmpcrudcargapordefecto = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    this.tipoelemento = [];
    var arr_dates = [];
    this.arrayuserestructinsert = [];
    this.change = 0;
    this.BarraProgreso = new BarraEstado();
    var addNewRecord;
    this.url = '/planificacion/pdo/configuracion/index.php/cmpconfigurarperfil/';

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    this.mod = ({
        chplan: false,
        chobjetivo: false,
        chactividad: false,
        charc: false,
        chfip: false,

        chigual: false,
        chmayor: false,
        chmenor: false,

        chactual: false,

        fini: false,
        ffin: false,

        tfdenominacion: false,
        tfporcientocumplimiento: false,
        pporciento: false,
        taDescripcion: false,

        cbestadoaprob: false,
        cbestadocumpl: false,
        cbtipoinvolucrado: false,
        cbcategoria: false,
        cbtipoactividad: false,
        cbvistapordef: false
    });

    this.valoresIniciales = ({
        chplan: '',
        chobjetivo: '',
        chactividad: '',
        charc: '',
        chfip: '',

        chigual: '',
        chmayor: '',
        chmenor: '',

        chactual: '',

        fini: null,
        ffin: null,

        tfdenominacion: '',
        tfporcientocumplimiento: '',
        pporciento: '',
        taDescripcion: '',

        cbestadoaprob: '',
        cbestadocumpl: '',
        cbtipoinvolucrado: '',
        cbcategoria: '',
        cbtipoactividad: '',
        cbvistapordef: ''
    });

    this.CrearWinFormCargaPorDefecto = function (accion, caso, PostAccionesGestionar, sm) {

        var estamodificando = 0;
        var tipoelemento = 3;
        var selected = null;
        if (caso == 1) {
            if (accion == 'Modificar') {
                estamodificando = 1;
                selected = sm.getSelected().data.idconfiguracionperfil;
            }
            tipoelemento = 'calendario';
        }

        if (caso == 3) {
            tipoelemento = 'comportamiento';
            if (accion == 'Modificar') {
                estamodificando = 1;
                selected = sm.getSelected().id;
            }
        }

        if (caso == 2) {
            if (accion == 'Modificar') {
                estamodificando = 1;
                selected = sm.getSelected().data.idconfiguracionperfil;
            }
            tipoelemento = 'cargas';
        }
        this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(selected, tipoelemento, estamodificando, null, 1);


        this.chplan = new Ext.form.Checkbox({
            id: 'chplan',
            boxLabel: '<span class="icondistra-folder sipac-azul">' + 'Plan' + '&nbsp;' + '</span>',
            prevTab: 'btnAceptarLoad',
            listeners: {
                check: function (check, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        _this.valoresIniciales.chplan = sm.getSelections()[0].data.plan;
                        if (_this.valoresIniciales.chplan != checkprinciplal) {
                            _this.mod.chplan = true;
                        } else {
                            _this.mod.chplan = false;
                        }
                    }
                }
            }
        });

        this.chobjetivo = new Ext.form.Checkbox({
            id: 'chobjetivo',
            prevTab: (caso == 2) ? 'chplan' : 'btnaceptarComp',
            boxLabel: '<span class="icondistra-archivo sipac-azul">' + 'Objetivo' + '&nbsp;' + '</span>',
            listeners: {
                check: function (check, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        _this.valoresIniciales.chobjetivo = sm.getSelections()[0].data.objetivo;
                        if (_this.valoresIniciales.chobjetivo != checkprinciplal) {
                            _this.mod.chobjetivo = true;
                        } else {
                            _this.mod.chobjetivo = false;
                        }
                    }
                }
            }
        });

        this.chactividad = new Ext.form.Checkbox({
            id: 'chactividad',
            boxLabel: '<span class="icondistra-actividades sipac-azul">' + 'Actividad' + '&nbsp;' + '</span>',
            listeners: {
                check: function (check, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        _this.valoresIniciales.chactividad = sm.getSelections()[0].data.actividad;
                        if (_this.valoresIniciales.chactividad != checkprinciplal) {
                            _this.mod.chactividad = true;
                        } else {
                            _this.mod.chactividad = false;
                        }
                    }
                }
            }
        });

        this.charc = new Ext.form.Checkbox({
            id: 'charc',
            listeners: {
                'check': function (ck, tp) {
                    //_this.habilitaBtnAplicarAceptar();
                }
            }
        });
        this.chfip = new Ext.form.Checkbox({
            id: 'chfip',
            nextTab: 'tfdenominacionact',
            prevTab: (caso == 2) ? 'chactividad' : 'charc',
            boxLabel: '<span class="icondistra-ficha sipac-azul">' + 'FIP' + '&nbsp;' + '</span>',
            listeners: {
                check: function (check, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        _this.valoresIniciales.chfip = sm.getSelections()[0].data.fip;
                        if (_this.valoresIniciales.chfip != checkprinciplal) {
                            _this.mod.chfip = true;
                        } else {
                            _this.mod.chfip = false;
                        }
                    }
                }
            }
        });

        this.chigual = new Ext.form.Checkbox({
            id: 'chigual',
            nextTab: 'chmayor',
            prevTab: 'tfporcientocumplimiento',
            disabled: false,
            width: 80,
            boxLabel: 'Igual <b>(=)</b>  ',
            listeners: {
                check: function (checkbox, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        if (_this.valoresIniciales.chigual != checkprinciplal) {
                            _this.mod.chigual = true;
                        } else {
                            _this.mod.chigual = false;
                        }
                    }
                }
            }
        });

        this.chmayor = new Ext.form.Checkbox({
            id: 'chmayor',
            disabled: false,
            nextTab: 'chmenor',
            prevTab: 'chigual',
            width: 80,
            boxLabel: 'Mayor <b>(>)</b>  ',
            listeners: {
                check: function (checkbox, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        //_this.valoresIniciales.chmayor = sm.getSelections()[0].data.mayor;
                        if (_this.valoresIniciales.chmayor != checkprinciplal) {
                            _this.mod.chmayor = true;
                        } else {
                            _this.mod.chmayor = false;
                        }
                    }
                    if (checked) {
                        (_this.chmenor.getValue) ? _this.setValueCheckBox(_this.chmenor, false) : null;
                    }
                }
            }
        });

        this.chmenor = new Ext.form.Checkbox({
            id: 'chmenor',
            nextTab: 'cbestadocumpl',
            prevTab: 'chmayor',
            disabled: false,
            boxLabel: 'Menor <b>(<)</b> ',
            width: 80,
            listeners: {
                check: function (checkbox, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        //_this.valoresIniciales.chmenor = sm.getSelections()[0].data.menor;
                        if (_this.valoresIniciales.chmenor != checkprinciplal) {
                            _this.mod.chmenor = true;
                        } else {
                            _this.mod.chmenor = false;
                        }
                    }
                    if (checked) {
                        (_this.chmayor.getValue) ? _this.setValueCheckBox(_this.chmayor, false) : null;
                    }
                }
            }
        });

        this.chactual = new Ext.form.Checkbox({
            boxLabel: 'Actual',
            hideLabel: true,
            labelSeparator: '',
            id: 'actual',
            listeners: {
                check: function (check, checked) {
                    if (estamodificando == 1) {
                        if (checked) {
                            checkprinciplal = 1;
                        } else {
                            checkprinciplal = 0;
                        }
                        _this.valoresIniciales.chactual = sm.getSelections()[0].data.actual;
                        if (_this.valoresIniciales.chactual != checkprinciplal) {
                            _this.mod.chactual = true;
                        } else {
                            _this.mod.chactual = false;
                        }
                    }
                }
            }
        });

        //validacion de fechas
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
                    arr_dates.push(date); //arreglo temporal que almacena las fechas que se seleccionan en el datefield inicio
                    date = _this.GetRangeDay(date, end.getValue());//permite respetar fecha final a partir de una fecha inicial dado un rango de dias.
                    end.setValue(date);
                    /*var end = Ext.getCmp(field.endDateField);
                     end.setMinValue(date);
                     end.validate();*/
                }
                return true;
            }
        });

        this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finiact',
            endDateField: 'ffinact',
            format: 'd/m/Y',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            readOnly: true,
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    //Modificar
                    if (estamodificando == 1) {
                        if (_this.valoresIniciales.fini != date.format('d/m/Y')) {
                            _this.mod.fini = true;
                        } else {
                            _this.mod.fini = false;
                            _this.ffin.setValue(_this.valoresIniciales.ffin);
                        }
                    }
                }
            },
            listeners: {
                'render': function (c) {
                    if (estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                var fecha = ((c.getValue() != '' && c.getValue() != null)
                                    ? c.getValue().format('d/m/Y') : null);
                                if (_this.valoresIniciales.fini != fecha) {
                                    _this.mod.fini = true;
                                } else {
                                    _this.mod.fini = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffinact',
            minText: 'La fecha debe ser posterior a la fecha de inicio ',
            format: 'd/m/Y',
            startDateField: 'finiact',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            readOnly: true,
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                    //Modificar
                    if (estamodificando == 1) {
                        if (_this.valoresIniciales.ffin != date.format('d/m/Y')) {
                            _this.mod.ffin = true;
                        } else {
                            _this.mod.ffin = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function (c) {
                    if (estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                var fecha = ((c.getValue() != '' && c.getValue() != null)
                                    ? c.getValue().format('d/m/Y') : null);
                                if (_this.valoresIniciales.ffin != fecha) {
                                    _this.mod.ffin = true;
                                } else {
                                    _this.mod.ffin = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionact',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            fieldLabel: 'Denominaci&oacute;n',
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
                    if (estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresIniciales.tfdenominacion !== c.getValue().toString()) {
                                _this.mod.tfdenominacion = true;
                            } else {
                                _this.mod.tfdenominacion = false;
                            }
                        }, c);
                    }
                }
            }
        });

        this.tfporcientocumplimiento = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento:',
            id: 'tfporcientocumplimiento',
            anchor: '100%',
            maxValue: 100,
            nextTab: 'chigual',
            minValue: 0,
            maxText: 'Solo admite números enteros positivos entre 0 y 100.',
            minText: 'Solo admite números enteros positivos entre 0 y 100.',
            enableKeyEvents: true,
            allowNegative: false,
            labelSeparator: '',
            allowBlank: true,
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        dirty = true;
                    }
                },
                'render': function (c) {
                    _this.deshabilitarOperadoresComparacion();
                    c.getEl().on('keyup', function () {
                        if (estamodificando == 1) {
                            (_this.valoresIniciales.tfporcientocumplimiento == null) ? _this.valoresIniciales.tfporcientocumplimiento = '' : null;
                            if (_this.valoresIniciales.tfporcientocumplimiento != c.getValue().toString()) {
                                _this.mod.tfporcientocumplimiento = true;
                            } else {
                                _this.mod.tfporcientocumplimiento = false;
                            }
                        }
                        if (_this.cbestadocumpl.getValue() == 2) {
                            var maxText, minText;
                            if (c.getValue() == 0 || c.getValue() == 100) {
                                maxText = 'Solo admite números enteros positivos entre 1 y 99.';
                                minText = 'Solo admite números enteros positivos entre 1 y 99.';
                                _this.tfporcientocumplimiento.maxText = maxText;
                                _this.tfporcientocumplimiento.minText = minText;
                                _this.tfporcientocumplimiento.maxValue = 99;
                                _this.tfporcientocumplimiento.minValue = 1;
                                _this.tfporcientocumplimiento.validate();
                            }
                        }
                        if (c.isValid() && c.getValue() !== '') {
                            Ext.getCmp('comparacion').enable();
                            if (c.getValue() == 0) {
                                Ext.getCmp('menor').disable();
                                (_this.chmenor.getValue()) ? _this.setValueCheckBox(_this.chmenor, false) : null;
                            } else  Ext.getCmp('menor').enable();
                            if (c.getValue() == 100) {
                                Ext.getCmp('mayor').disable();
                                (_this.chmayor.getValue()) ? _this.setValueCheckBox(_this.chmayor, false) : null;
                            } else  Ext.getCmp('mayor').enable();

                        } else {
                            _this.deshabilitarOperadoresComparacion();
                        }
                    }, c);
                }
            },
            width: 40
        });

        this.pporciento = new Ext.form.FieldSet({
            title: 'Porciento de cumplimiento:',
            id: 'pPorciento',
            height: 100,
            items: [_this.tfporcientocumplimiento,
                {
                    layout: 'column', id: 'comparacion', columnWidth: .33,
                    items: [
                        {
                            id: 'igual',
                            items: [_this.chigual]
                        }, {
                            id: 'mayor',
                            items: [_this.chmayor]
                        }, {
                            id: 'menor',
                            items: [_this.chmenor]
                        }]
                }]
        });

        this.taDescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripcionact',
            anchor: '100%',
            height: 120,
            maxLength: 500,
            fieldLabel: 'Descripci&oacute;n',
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                },
                sync: function (editor, html) {
                    if (estamodificando == 1) {
                        if (_this.valoresIniciales.taDescripcion == '' || _this.valoresIniciales.taDescripcion == null) {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.taDescripcion = false;
                            else
                                _this.mod.taDescripcion = true;
                        } else if (_this.valoresIniciales.taDescripcion != html)
                            _this.mod.taDescripcion = true;
                        else
                            _this.mod.taDescripcion = false;
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

        this.taInvolucrado = new Ext.form.TextArea({
            name: 'involucrado',
            fieldLabel: 'Involucrado',
            anchor: '100%',
            height: 90
        });

        this.stcbestadoaprob = new Ext.data.Store({
            url: _this.url + 'cargarcmbestados',
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idestado"
            }, [{
                name: 'idestado'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                load: function (st, rc, obj) {
                    _this.addNewRecord();
                }
            }
        });

        this.addNewRecord = function () {
            var estado = Ext.data.Record.create([{
                name: 'idestado',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);
            var p = new estado({
                idestado: 0,
                denominacion: 'Ninguno'
            });
            this.stcbestadoaprob.insert(0, p);
        };

        this.cbestadoaprob = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: 'Estado de aprobaci&oacute;n',
            store: _this.stcbestadoaprob,
            hiddenName: 'idestado',
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            loadingText: 'Cargando estados',
            editable: false,
            mode: 'remote',
            anchor: '95%',
            selectOnFocus: true,
            typeAhead: true,
            value: 0,
            listeners: {
                expand: function (combo) {
                    _this.stcbestadoaprob.reload();
                },
                select: function (combo, record, index) {
                    if (estamodificando == 1) {
                        if (_this.valoresIniciales.cbestadoaprob != record.data.idestado) {
                            _this.mod.cbestadoaprob = true;
                        } else {
                            _this.mod.cbestadoaprob = false;
                        }
                    }
                },
                'render': function (c) {
                    if (estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresIniciales.cbestadoaprob != c.getValue()) {
                                _this.mod.cbestadoaprob = true;
                            } else {
                                _this.mod.cbestadoaprob = false;
                            }
                        }, c);
                    }
                },
                beforerender: function (c) {
                    _this.addNewRecord();
                }
            }
        });

        this.stcbestadocumpl = new Ext.data.SimpleStore({
            fields: ['idestado', 'denominacion'],
            data: [
                [0, 'Ninguno'],
                [1, 'Sin cumplir'],
                [2, 'Parcialmente cumplido'],
                [3, 'Cumplida']
            ]
        });

        this.cbestadocumpl = new Ext.form.ComboBox({
            fieldLabel: 'Estado de cumplimiento',
            id: 'cbestadocumpl',
            prevTab: 'chmenor',
            store: _this.stcbestadocumpl,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idestado',
            valueField: 'idestado',
            readOnly: true,
            width: 50,
            anchor: '100%',
            emptyText: 'Seleccione...',
            value: 0,
            listeners: {
                select: function (combo, record, index) {
                    if (estamodificando == 1) {
                        if (_this.valoresIniciales.cbestadocumpl != record.data.idestado) {
                            _this.mod.cbestadocumpl = true;
                        } else {
                            _this.mod.cbestadocumpl = false;
                        }
                    }
                    _this.validarPanelPorciento();
                },
                'render': function (c) {
                    if (estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresIniciales.cbestadocumpl != c.getValue()) {
                                _this.mod.cbestadocumpl = true;
                            } else {
                                _this.mod.cbestadocumpl = false;
                            }
                        }, c);
                    }
                }
            }
        });

        this.stcbtipoinvolucrado = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                name: 'denominacion'
            }, {
                name: 'idtipo'
            }, {
                name: 'incidencia'
            }]),
            listeners: {
                beforeload: function (st, opt) {
                    st.baseParams.tiponomenclador = 9;
                },
                load: function (store, records, options) {
                    if (store.getCount() == 0) {
                        _this.objclasificadorinvol.notienetiposinvol = 1;
                    } else {
                        _this.objclasificadorinvol.notienetiposinvol = 0;
                    }
                }
            }
        });

        this.cbtipoinvolucrado = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de involucrado',
            store: _this.stcbtipoinvolucrado,
            displayField: 'denominacion',
            typeAhead: true,
            allowBlank: true,
            mode: 'remote',
            triggerAction: 'all',
            loadingText: 'Cargando estados',
            valueField: 'idtipo',
            anchor: '100%',
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                    _this.objclasificadorinvol.comboSeleccion = 1;
                    _this.objclasificadorinvol.involucradoSelected = {
                        idtipo: record.data.idtipo,
                        denominacion: record.data.denominacion
                    };
                }
            }
        });

        this.fsfechas = new Ext.form.FieldSet({
            title: 'Per&iacute;odo de carga',
            bodyStyle: 'padding:5px 5px 5px 5px',
            width: 280,
            height: 100,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .5,
                            border: false,
                            layout: 'form',
                            items: [_this.fini]
                        }, {
                            columnWidth: .5,
                            border: false,
                            layout: 'form',
                            items: [_this.ffin]
                        }
                    ]
                }
            ]
        });

        this.stcbcategoria = new Ext.data.Store({
            autoLoad: true,
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcategoriasactividad',
            reader: new Ext.data.JsonReader({
                id: 'idcategoria',
                root: "data"
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                load: function (st, rc, obj) {
                    _this.addNewRecordA();
                }
            }
        });

        this.addNewRecordA = function () {
            var categoria = Ext.data.Record.create([{
                name: 'idcategoria',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);
            var f = new categoria({
                idcategoria: 'ninguno',
                denominacion: 'Ninguno'
            });
            this.stcbcategoria.insert(0, f);
        };

        this.cbcategoria = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: 'Categor&iacute;a de la actividad',
            store: _this.stcbcategoria,
            hiddenName: 'idcategoria',
            valueField: 'idcategoria',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: true,
            loadingText: 'Cargando datos',
            mode: 'local',
            anchor: '95%',
            listeners: {
                expand: function (combo) {
                    _this.stcbcategoria.reload();
                }
            }
        });

        this.stcbtipoactividad = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                name: 'idtipo'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                load: function (st, rc, obj) {
                    _this.addNewRecordTA();
                }
            }
        });

        this.addNewRecordTA = function () {
            var tipoact = Ext.data.Record.create([{
                name: 'idtipo',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);
            var e = new tipoact({
                idtipo: 'ninguno',
                denominacion: 'Ninguno'
            });
            this.stcbtipoactividad.insert(0, e);
        };

        this.cbtipoactividad = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: 'Tipo de actividad',
            store: _this.stcbtipoactividad,
            hiddenName: 'idtipo',
            valueField: 'idtipo',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: true,
            loadingText: 'Cargando datos',
            mode: 'local',
            anchor: '100%',
            listeners: {
                expand: function (combo) {
                    _this.stcbtipoactividad.reload();
                }
            }
        });

        this.stcbvistapordef = new Ext.data.Store({
            url: _this.url + 'cargarCmbVistaCalendario',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idvistacalendario',
                root: "data"
            }, [{
                name: 'idvistacalendario'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                load: function (st, rc, obj) {
                    _this.addNewRecordD();
                }

            }
        });

        this.addNewRecordD = function () {
            var defecto = Ext.data.Record.create([{
                name: 'idvistacalendario',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);
            var d = new defecto({
                idvistacalendario: 'ninguno',
                denominacion: 'Ninguno'
            });
            this.stcbvistapordef.insert(0, d);
        };

        this.cbvistapordef = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: 'Vista por defecto',
            store: _this.stcbvistapordef,
            hiddenName: 'idvistacalendario',
            valueField: 'idvistacalendario',
            displayField: 'denominacion',
            triggerAction: 'all',
            loadingText: 'Cargando datos',
            mode: 'local',
            anchor: '95%',
            typeAhead: true,
            listeners: {
                expand: function (combo) {
                    _this.stcbvistapordef.load();
                }
            }
        });

        this.pInvolucrado = new Ext.Panel({
            title: 'Involucrado',
            height: 125,
            layout: 'fit',
            items: [_this.taInvolucrado]
        });

        this.pDescripcion = new Ext.Panel({
            title: 'Descripci&oacute;n',
            height: 110,
            layout: 'fit',
            items: [_this.taDescripcion]
        });

        this.tpInvolDescrip = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            height: 250,
            items: [_this.pclasificadorinvol, _this.pDescripcion]
        });

        switch (caso) {
            case 1:
                _this.tfporcientocumplimiento.hideLabel = true;
                _this.chactual.hideLabel = false;
                _this.chactual.boxLabel = '';
                _this.chactual.fieldLabel = 'Actual:';
                this.formload = new Ext.form.FormPanel({
                    width: 610,
                    height: 750,
                    frame: true,
                    bodyStyle: 'padding: 5px 5px 0',
                    labelAlign: 'top',
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.85,
                                    layout: 'form',
                                    items: [_this.tfdenominacion]
                                }, {
                                    columnWidth: 0.15,
                                    layout: 'form',
                                    items: [_this.chactual]
                                }
                            ]
                        }, {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.cbestadoaprob]
                                }, {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.cbestadocumpl]
                                }

                            ]
                        }, {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .5,
                                    layout: 'form',
                                    items: [_this.cbcategoria]
                                }, {
                                    columnWidth: .5,
                                    layout: 'form',
                                    items: [_this.cbtipoactividad]
                                }
                            ]
                        }, {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.cbvistapordef]
                                }, {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.pporciento]
                                }
                            ]
                        }, {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.cbvistapordef]
                                }, {
                                    columnWidth: 0.5,
                                    layout: 'form',
                                    items: [_this.pporciento]
                                }
                            ]
                        },
                        _this.tpInvolDescrip
                    ]
                });

                this.winCrudCargaPorDefecto = new Ext.Window({
                    modal: true,
                    layout: 'fit',
                    title: accion + ' configuraci&oacute;n de calendario',
                    width: 665,
                    height: 580,
                    items: [_this.formload],
                    buttons: [
                        {
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            handler: function () {
                                _this.winCrudCargaPorDefecto.destroy();
                            }
                        }, {
                            iconCls: 'aplicar',
                            text: 'Aplicar',
                            tooltip: 'Guardar datos y limpiar los campos',
                            hidden: false,
                            id: 'btnaplicar',
                            handler: function () {
                                _this.CrudConfigurarCalendario(accion, PostAccionesGestionar, sm, true);
                            }
                        }, {
                            id: 'btnaceptarc',
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            tooltip: 'Guardar datos y cerrar ventana',
                            handler: function () {
                                _this.CrudConfigurarCalendario(accion, PostAccionesGestionar, sm, false);
                            }
                        }]
                });
                if (accion == 'Modificar') {
                    Ext.getCmp('btnaplicar').hide();
                    _this.modificarConfCalendario(sm);
                } else {
                    _this.winCrudCargaPorDefecto.show();
                }
                break;
            case 2:
                //fsera
                _this.tfporcientocumplimiento.hideLabel = true;
                _this.chactual.boxLabel = 'Actual';
                _this.chactual.hideLabel = true;
                this.formload = new Ext.form.FormPanel({
                    width: 610,
                    frame: true,
                    bodyStyle: 'padding: 5px 5px 0',
                    labelAlign: 'top',
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 1.0,
                                    layout: 'form',
                                    items: [_this.tfdenominacion]
                                }
                            ]
                        }, {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .5,
                                    layout: 'form',
                                    items: [_this.fsfechas, _this.cbestadoaprob, _this.chactual]
                                }, {
                                    columnWidth: .5,
                                    layout: 'form',
                                    items: [_this.pporciento, _this.cbestadocumpl]
                                }
                            ]
                        },
                        _this.taDescripcion
                    ],
                    listeners: {
                        'clientvalidation': function (fm, valid) {
                            if (valid && (_this.chplan.getValue() || _this.chactividad.getValue() ||
                                _this.chobjetivo.getValue() || _this.chfip.getValue() )) {
                                _this.habilitaBtnAplicarAceptar(caso);
                            } else {
                                _this.desHabilitaBtnAplicarAceptar(caso);
                            }
                            //Modificar
                            if (estamodificando == 1) {
                                if (valid && (_this.chplan.getValue() || _this.chactividad.getValue() ||
                                    _this.chobjetivo.getValue() || _this.chfip.getValue() )
                                    && (_this.mod.tfdenominacion
                                        || _this.mod.chactual
                                        || _this.mod.cbestadoaprob
                                        || _this.mod.fini
                                        || _this.mod.ffin
                                            //|| _this.mod.pporciento
                                        || _this.mod.cbestadocumpl
                                        || _this.mod.taDescripcion
                                        || _this.mod.chactividad
                                        || _this.mod.chobjetivo
                                        || _this.mod.chfip
                                        || _this.mod.chplan
                                        || _this.mod.tfporcientocumplimiento
                                        || _this.mod.chigual
                                        || _this.mod.chmayor
                                        || _this.mod.chmenor
                                    )) {
                                    Ext.getCmp('btnAceptarLoad').enable();
                                } else {
                                    Ext.getCmp('btnAceptarLoad').disable();
                                }
                            }
                        }
                    }
                });

                this.winCrudCargaPorDefecto = new Ext.Window({
                    modal: true,
                    layout: 'fit',
                    title: accion + ' carga por defecto',
                    constrain: true,
                    resizable: false,
                    width: 620,
                    height: 500,
                    tbar: ['-', 'Configuraci&oacute;n v&aacute;lida para: ',
                        _this.chplan, _this.chobjetivo, _this.chactividad, _this.chfip
                    ],
                    listeners: {
                        destroy: function (win) {
                            //modificar
                            _this.mod.tfdenominacion = false;
                            _this.mod.chactual = false;
                            _this.mod.cbestadoaprob = false;
                            _this.mod.fini = false;
                            _this.mod.ffin = false;
                            _this.mod.cbestadocumpl = false;
                            _this.mod.taDescripcion = false;
                            _this.mod.chactividad = false;
                            _this.mod.chobjetivo = false;
                            _this.mod.chfip = false;
                            _this.mod.chplan = false;
                            _this.mod.tfporcientocumplimiento = false;
                            _this.mod.chigual = false;
                            _this.mod.chmayor = false;
                            _this.mod.chmenor = false;
                        }
                    },
                    items: [_this.formload],
                    buttons: [
                        {
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            id: 'btnCancelarLoad',
                            nextTab: (accion == 'Modificar') ? 'btnAceptarLoad' : 'btnAplicarLoad',
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            handler: function () {
                                _this.winCrudCargaPorDefecto.destroy();
                            }
                        }, {
                            iconCls: 'aplicar sipac',
                            text: 'Aplicar' + ' ',
                            tooltip: 'Guardar datos y limpiar los campos',
                            hidden: false,
                            disabled: true,
                            id: 'btnAplicarLoad',
                            nextTab: 'btnAceptarLoad',
                            prevTab: 'btnCancelarLoad',
                            handler: function () {
                                _this.CrudConfigurarPerfilCxD(accion, PostAccionesGestionar, sm, true);
                            }
                        }, {
                            iconCls: 'aceptar sipac',
                            text: 'Aceptar' + ' ',
                            disabled: true,
                            id: 'btnAceptarLoad',
                            nextTab: 'chplan',
                            prevTab: (accion == 'Modificar') ? 'btnCancelarLoad' : 'btnAplicarLoad',
                            tooltip: 'Guardar datos y cerrar ventana',
                            handler: function () {
                                _this.CrudConfigurarPerfilCxD(accion, PostAccionesGestionar, sm, false);
                            }

                        }]
                });
                _this.winCrudCargaPorDefecto.on('beforeshow', function () {
                    _this.chplan.focus(true, 700);
                });
                _this.winCrudCargaPorDefecto.doLayout();
                _this.winCrudCargaPorDefecto.show();
                _this.chplan.focus(false, 1024);

                if (accion == 'Modificar') {
                    Ext.getCmp('btnAplicarLoad').hide();
                    _this.modificarConfCargaxDefecto(sm);
                } else {
                    _this.winCrudCargaPorDefecto.show();

                }
                break;
            case 3:
                _this.tfporcientocumplimiento.hideLabel = false;
                _this.chactual.hideLabel = false;
                _this.chactual.boxLabel = '';
                _this.chactual.fieldLabel = 'Actual:';
                this.formload = new Ext.form.FormPanel({
                    width: 610,
                    frame: true,
                    bodyStyle: 'padding: 5px 5px 0',
                    labelAlign: 'top',
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .5,
                                    layout: 'form',
                                    items: [_this.tfdenominacion]
                                }, {
                                    columnWidth: .4,
                                    layout: 'form',
                                    bodyStyle: 'padding: 0 10px 0',
                                    items: [_this.cbtipoinvolucrado]
                                }, {
                                    columnWidth: .1,
                                    layout: 'form',
                                    bodyStyle: 'padding: 0 10px 0',
                                    items: [_this.chactual]
                                }
                            ]
                        },
                        _this.tpInvolDescrip
                    ]
                });

                this.winCrudCargaPorDefecto = new Ext.Window({
                    modal: true,
                    layout: 'fit',
                    title: accion + ' configuraci&oacute;n de comportamiento',
                    width: 670,
                    height: 435,
                    tbar: ['-', 'Configuraci&oacute;n v&aacute;lida para: ',
                        _this.chobjetivo, {
                            text: 'Objetivo',
                            iconCls: 'objetivo'
                        }, ' ',
                        _this.chactividad, {
                            text: 'Actividad',
                            iconCls: 'actividad'
                        }, ' ',
                        _this.charc, {
                            text: 'ARC',
                            iconCls: 'arc'
                        }, ' ',
                        _this.chfip, {
                            text: 'FIP',
                            iconCls: 'fip'
                        }
                    ],
                    items: [_this.formload],
                    buttons: [
                        {
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            handler: function () {
                                _this.change = 0;
                                _this.objclasificadorinvol.comboSeleccion = 0;
                                _this.winCrudCargaPorDefecto.destroy();

                            }
                        }, {
                            iconCls: 'aplicar',
                            text: 'Aplicar',
                            tooltip: 'Guardar datos y limpiar los campos',
                            hidden: false,
                            disabled: true,
                            id: 'btnAplicarLoad',
                            handler: function () {
                                _this.CrudConfigurarComportamiento(accion, PostAccionesGestionar, sm, true);
                            }
                        }, {
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            tooltip: 'Guardar datos y cerrar ventana',
                            id: 'btnAceptarLoad',
                            disabled: true,
                            handler: function () {
                                _this.objclasificadorinvol.comboSeleccion = 0;
                                _this.CrudConfigurarComportamiento(accion, PostAccionesGestionar, sm, false);
                            }
                        }]
                });
                if (accion == 'Modificar') {
                    Ext.getCmp('btnAplicarLoad').hide();
                    _this.modificarConfComportamiento(sm);
                } else {
                    _this.winCrudCargaPorDefecto.show();

                }
                break;
        }
    };

    this.CrudConfigurarPerfilCxD = function (accion, PostAccionesGestionar, sm, apl) {
        var tipoelemento = [];
        var tipoelementodelete = [];
        var actual = 0;
        var fechainicio = '';
        var fechafin = '';
        var idconfiguracionperfil;
        var mensaje = '';
        var mensajemascara = '';
        if (_this.chactual.getValue() == true) {
            actual = 1;
        }
        if (_this.chactividad.getValue() == true) {
            tipoelemento.push(3);
        } else {
            tipoelementodelete.push(3);
        }
        if (_this.chobjetivo.getValue() == true) {
            tipoelemento.push(1);
        } else {
            tipoelementodelete.push(1);
        }
        if (_this.chfip.getValue() == true) {
            tipoelemento.push(2);
        } else {
            tipoelementodelete.push(2);
        }
        if (_this.chplan.getValue() == true) {
            tipoelemento.push(0);
        } else {
            tipoelementodelete.push(0);
        }
        if (_this.fini.getValue() != '') {
            fechainicio = _this.fini.getValue().format('d/m/Y');
        }
        if (_this.ffin.getValue() != '') {
            fechafin = _this.ffin.getValue().format('d/m/Y');
        }
        if (accion == 'Modificar') {
            idconfiguracionperfil = sm.getSelected().data.idconfiguracionperfil;
            mensaje = 'La configuración de cargas por defecto ha sido modificada satisfactoriamente.';
            mensajemascara = 'Modificando configuración';
        } else {
            _this.change = 0;
            idconfiguracionperfil = null;
            mensaje = 'La configuración de cargas por defecto ha sido adicionada satisfactoriamente.';
            mensajemascara = 'Adicionando configuración';
        }
        if (_this.FormularioIsValid('cargasPorDefecto')) {
            _this.BarraProgreso.show(mensajemascara);
            Ext.Ajax.request({
                url: _this.url + 'adicionarConfCargaxDefecto',
                params: {
                    fechainicio: fechainicio,
                    fechafin: fechafin,
                    tipoelemento: Ext.encode(tipoelemento),
                    tipoelementodelete: Ext.encode(tipoelementodelete),
                    denominacion: _this.tfdenominacion.getValue(),
                    actual: actual,
                    estadoaprob: _this.cbestadoaprob.getValue(),
                    estadocumpl: _this.cbestadocumpl.getValue(),
                    porcientocumpl: _this.tfporcientocumplimiento.getValue(),
                    descripcion: _this.taDescripcion.getValue(),
                    idconfiguracion: idconfiguracionperfil,
                    mayor: (_this.chmayor.getValue()) ? 1 : 0,
                    menor: (_this.chmenor.getValue()) ? 1 : 0,
                    igual: (_this.chigual.getValue()) ? 1 : 0,
                    accion: accion
                },
                callback: function (options, success, response) {
                    _this.change = 0;
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(2, mensaje);
                        PostAccionesGestionar('Adicionar', 2);

                        if (apl) {
                            _this.formload.getForm().reset();
                            _this.limpiarCheckboxForm();
                            _this.validarPanelPorciento();
                            // _this.objclasificadorinvol.ResetearCampos();
                        } else
                            _this.winCrudCargaPorDefecto.destroy();
                    } else {
                        mostrarMensaje(2, "Ya existe una configuración de cargas por defecto con la denominación especificada.");
                    }
                }
            });
        } else {
            mostrarMensaje(1, "Debe especificar al menos un parámetro de los mostrados en la interfaz.");
        }
    };

    this.CrudConfigurarCalendario = function (accion, PostAccionesGestionar, sm, apl) {
        var actual = 0;
        var idconfiguracionperfil;
        var mensaje = '';
        var mensajemascara = '';
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
        if (accion == 'Modificar') {
            idconfiguracionperfil = sm.getSelected().data.idconfiguracionperfil;
            mensaje = 'La configuración de calendario ha sido modificada satisfactoriamente.';
            mensajemascara = 'Modificando configuración';
        } else {
            _this.change = 0;
            idconfiguracionperfil = null;
            mensaje = 'La configuración de calendario ha sido adicionada satisfactoriamente.';
            mensajemascara = 'Adicionando configuración';
        }

        if (_this.formload.getForm().isValid()) {
            if (_this.FormularioIsValid()) {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: _this.url + 'adicionarConfCalendario',
                    params: {
                        usuariosinv: Ext.encode(arrayinvolucrados),
                        usuarioseliminar: Ext.encode(arrayinvolucradoseliminar),
                        //estructuras: Ext.encode(estructurasinv),
                        denominacion: _this.tfdenominacion.getValue(),
                        vista: _this.cbvistapordef.getValue(),
                        estadoaprob: _this.cbestadoaprob.getValue(),
                        estadocumpl: _this.cbestadocumpl.getValue(),
                        porcientocumpl: _this.tfporcientocumplimiento.getValue(),
                        mayor: (_this.chmayor.getValue()) ? 1 : 0,
                        menor: (_this.chmenor.getValue()) ? 1 : 0,
                        igual: (_this.chigual.getValue()) ? 1 : 0,
                        descripcion: _this.taDescripcion.getValue(),
                        idconfiguracion: idconfiguracionperfil,
                        actual: (_this.chactual.getValue()) ? 1 : 0,
                        accion: accion,
                        cateactividad: _this.cbcategoria.getValue(),
                        tipoactividad: _this.cbtipoactividad.getValue()
                    },
                    callback: function (options, success, response) {
                        _this.change = 0;
                        _this.BarraProgreso.hide();
                        _this.objclasificadorinvol.ResetearArregloDeInvolucradosEliminar();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, mensaje);
                            PostAccionesGestionar('Adicionar', 1);

                            if (apl) {
                                _this.formload.getForm().reset();
                                _this.objclasificadorinvol.ResetearCampos();
                            } else
                                _this.winCrudCargaPorDefecto.destroy();
                        } else {
                            mostrarMensaje(2, "Ya existe una configuración de calendario con la denominación especificada.");
                        }
                    }
                });
            } else {
                mostrarMensaje(1, "Debe especificar al menos un parámetro de los mostrados en la interfaz.");
            }
        } else {
            mostrarMensaje(1, "Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
        }
    };

    this.CrudConfigurarComportamiento = function (accion, PostAccionesGestionar, sm, apl) {
        var tipoelemento = [];
        var tipoelementodelete = [];
        var actual = 0;
        var fechainicio = '';
        var fechafin = '';
        var idconfiguracionperfil;
        var mensaje = '';
        var mensajemascara = '';

        if (_this.chactual.getValue() == true) {
            actual = 1;
        }
        if (_this.chactividad.getValue() == true) {
            tipoelemento.push(3);
        } else {
            tipoelementodelete.push(3);
        }
        if (_this.chobjetivo.getValue() == true) {
            tipoelemento.push(1);
        } else {
            tipoelementodelete.push(1);
        }
        if (_this.charc.getValue() == true) {
            tipoelemento.push(4);
        } else {
            tipoelementodelete.push(4);
        }
        if (_this.chfip.getValue() == true) {
            tipoelemento.push(2);
        } else {
            tipoelementodelete.push(2);
        }
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
        if (accion == 'Modificar') {
            idconfiguracionperfil = sm.getSelected().id;
            mensaje = 'La configuración de comportamiento ha sido modificado satisfactoriamente.';
            mensajemascara = 'Modificando configuración';
        } else {
            _this.change = 0;
            idconfiguracionperfil = null;
            mensaje = 'La configuración de comportamiento ha sido adicionado satisfactoriamente.';
            mensajemascara = 'Adicionando configuración';
        }
        if (_this.FormularioIsValid()) {
            _this.BarraProgreso.show(mensajemascara);
            Ext.Ajax.request({
                url: _this.url + 'adicionarConfComportamiento',
                params: {
                    tipoelemento: Ext.encode(tipoelemento),
                    tipoelementodelete: Ext.encode(tipoelementodelete),
                    usuariosinv: Ext.encode(arrayinvolucrados),
                    usuarioseliminar: Ext.encode(arrayinvolucradoseliminar),
                    denominacion: _this.tfdenominacion.getValue(),
                    actual: actual,
                    descripcion: _this.taDescripcion.getValue(),
                    idconfiguracion: idconfiguracionperfil,
                    accion: accion
                },
                callback: function (options, success, response) {
                    _this.change = 0;
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(2, mensaje);
                        PostAccionesGestionar(accion, 3);
                        if (apl) {
                            _this.formload.getForm().reset();
                            _this.limpiarCheckboxForm();
                            _this.objclasificadorinvol.ResetearCampos();
                        } else
                            _this.winCrudCargaPorDefecto.destroy();
                    } else {
                        mostrarMensaje(2, "Ya existe una configuración de comportamiento con la denominación especificada.");
                    }
                }
            });
        } else {
            mostrarMensaje(1, "Debe especificar al menos un parámetro de los mostrados en la interfaz.");
        }
    };

    this.modificarConfCargaxDefecto = function (sm) {
        _this.BarraProgreso.show('Cargando datos de configuración');
        Ext.Ajax.request({
            url: _this.url + 'modificarConfCargaxDefecto',
            params: {
                idconfiguracion: sm.getSelected().data.idconfiguracionperfil
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                _this.change = responseData;
                if (responseData.mensaje == 1) {
                    _this.winCrudCargaPorDefecto.show();

                    _this.tfdenominacion.setValue(responseData.confperfil.denominacion);
                    _this.fini.setValue(responseData.confvalida[0].fechainicio);
                    _this.ffin.setValue(responseData.confvalida[0].fechafin);
                    _this.tfporcientocumplimiento.setValue(responseData.confperfil.porcientocumplimiento);

                    if (responseData.confperfil.estadoaprobacion != null) {
                        _this.cbestadoaprob.setValue(responseData.confperfil.estadoaprobacion);
                        if (responseData.confperfil.estadoaprobacion == 0) {
                            _this.cbestadoaprob.setRawValue('Ninguno');
                        } else {
                            _this.cbestadoaprob.setRawValue(responseData.confperfil.denoestadoaprob);
                        }

                    }

                    if (responseData.confperfil.estadocumplimiento != null) {
                        _this.cbestadocumpl.setValue(responseData.confperfil.estadocumplimiento);
                    }

                    _this.taDescripcion.setValue(responseData.confperfil.descripcion);
                    _this.chigual.setValue(responseData.confperfil.igual);
                    _this.chmayor.setValue(responseData.confperfil.mayor);
                    _this.chmenor.setValue(responseData.confperfil.menor);
                    for (var i = 0; i < responseData.confvalida.length; i++) {
                        if (responseData.confvalida[i].idtipoelemento == 0)
                            _this.chplan.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 1)
                            _this.chobjetivo.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 2)
                            _this.chfip.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 3)
                            _this.chactividad.setValue(true);
                        if (responseData.confvalida[0].actual == 1)
                            _this.chactual.setValue(true);
                    }
                    (_this.tfporcientocumplimiento.getValue() !== '') ? _this.habilitarOperadoresComparacion() :
                        _this.deshabilitarOperadoresComparacion();
                    _this.validarPanelPorciento;
                    //Validar MODIFICAR
                    _this.valoresIniciales.tfdenominacion = responseData.confperfil.denominacion;
                    _this.valoresIniciales.tfporcientocumplimiento = responseData.confperfil.porcientocumplimiento;
                    _this.valoresIniciales.cbestadoaprob = responseData.confperfil.estadoaprobacion;
                    _this.valoresIniciales.cbestadocumpl = responseData.confperfil.estadocumplimiento;
                    _this.valoresIniciales.fini = responseData.confvalida[0].fechainicio;
                    _this.valoresIniciales.ffin = responseData.confvalida[0].fechafin;
                    _this.valoresIniciales.chigual = (responseData.confperfil.igual == undefined) ? 0 : responseData.confperfil.igual;
                    _this.valoresIniciales.chmayor = (responseData.confperfil.mayor == undefined) ? 0 : responseData.confperfil.mayor;
                    _this.valoresIniciales.chmenor = (responseData.confperfil.menor == undefined) ? 0 : responseData.confperfil.menor;

                } else {
                    mostrarMensaje(3, 'Error');
                }
            }
        });
    };

    this.modificarConfCalendario = function (sm) {
        _this.BarraProgreso.show('Cargando datos de configuración');
        Ext.Ajax.request({
            url: _this.url + 'modificarConfCalendario',
            params: {
                idconfiguracion: sm.getSelected().data.idconfiguracionperfil
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                _this.change = responseData;
                if (responseData.mensaje == 1) {
                    _this.winCrudCargaPorDefecto.show();
                    _this.tfdenominacion.setValue(responseData.confperfil.denominacion);
                    _this.tfporcientocumplimiento.setValue(responseData.confperfil.porcientocumplimiento);
                    if (responseData.confperfil.estadoaprobacion != null) {
                        _this.cbestadoaprob.setValue(responseData.confperfil.estadoaprobacion);
                        _this.cbestadoaprob.setRawValue(responseData.confperfil.denoestadoaprob);
                    }
                    if (responseData.confperfil.estadocumplimiento != null) {
                        _this.cbestadocumpl.setValue(responseData.confperfil.estadocumplimiento);
                    }
                    _this.taDescripcion.setValue(responseData.confperfil.descripcion);
                    if (responseData.confvalida.idcategoriaactividad != null) {
                        _this.cbcategoria.setValue(responseData.confvalida.idcategoriaactividad);
                        _this.cbcategoria.setRawValue(responseData.confperfil.denocateact);
                    }
                    if (responseData.confvalida.idtipoactividad != null) {
                        _this.cbtipoactividad.setValue(responseData.confvalida.idtipoactividad)
                        _this.cbtipoactividad.setRawValue(responseData.confperfil.denotipoact);
                    }
                    if (responseData.confvalida.idvistaxdefecto != null) {
                        _this.cbvistapordef.setValue(responseData.confvalida.idvistaxdefecto);
                        _this.cbvistapordef.setRawValue(responseData.confperfil.denovista);
                    }
                    _this.arrayuserestructinsert = responseData.confperfil.involucrados;
                    _this.chactual.setValue(responseData.confperfil.actual);
                    _this.chigual.setValue(responseData.confperfil.igual);
                    _this.chmayor.setValue(responseData.confperfil.mayor);
                    _this.chmenor.setValue(responseData.confperfil.menor);
                } else {
                    mostrarMensaje(3, 'Error');
                }
            }
        });
    };

    this.modificarConfComportamiento = function (sm) {
        _this.BarraProgreso.show('Cargando datos de configuración');
        Ext.Ajax.request({
            url: _this.url + 'modificarConfComportamiento',
            params: {
                idconfiguracion: sm.getSelected().id
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.change = responseData;
                    _this.winCrudCargaPorDefecto.show();
                    _this.tfdenominacion.setValue(responseData.confperfil.denominacion);
                    _this.taDescripcion.setValue(responseData.confperfil.descripcion);
                    _this.arrayuserestructinsert = responseData.confperfil.involucrados;
                    _this.chactual.setValue(responseData.confperfil.actual);
                    for (var i = 0; i < responseData.confvalida.length; i++) {
                        if (responseData.confvalida[i].idtipoelemento == 4)
                            _this.charc.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 1)
                            _this.chobjetivo.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 2)
                            _this.chfip.setValue(true);
                        if (responseData.confvalida[i].idtipoelemento == 3)
                            _this.chactividad.setValue(true);
                    }
                } else {
                    mostrarMensaje(3, 'Error');
                }
            }
        });
    };

    this.setValueCheckBox = function (checkbox, value) {
        checkbox.suspendEvents(false);
        checkbox.setValue(value);
        checkbox.resumeEvents();
    };

    this.validarPanelPorciento = function () {
        if (_this.cbestadocumpl.getValue() != 2 && _this.cbestadocumpl.getValue() != 0) {
            _this.tfporcientocumplimiento.reset();
            _this.tfporcientocumplimiento.disable();
            _this.deshabilitarOperadoresComparacion();
        } else {
            _this.tfporcientocumplimiento.reset();
            _this.tfporcientocumplimiento.enable();
            _this.deshabilitarOperadoresComparacion();
            if (_this.cbestadocumpl.getValue() == 0) {
                var maxText, minText;
                maxText = 'Solo admite números enteros positivos entre 0 y 100.';
                minText = 'Solo admite números enteros positivos entre 0 y 100.';
                _this.tfporcientocumplimiento.maxText = maxText;
                _this.tfporcientocumplimiento.minText = minText;
                _this.tfporcientocumplimiento.maxValue = 100;
                _this.tfporcientocumplimiento.minValue = 0;
                _this.tfporcientocumplimiento.validate();
            }
        }
    };
    this.deshabilitarOperadoresComparacion = function () {
        Ext.getCmp('comparacion').disable();
        Ext.getCmp('mayor').enable();
        Ext.getCmp('menor').enable();
        (_this.chigual.getValue()) ? _this.setValueCheckBox(_this.chigual, false) : null;
        (_this.chmayor.getValue()) ? _this.setValueCheckBox(_this.chmayor, false) : null;
        (_this.chmenor.getValue()) ? _this.setValueCheckBox(_this.chmenor, false) : null;
    };
    this.habilitarOperadoresComparacion = function () {
        Ext.getCmp('comparacion').enable();
        (_this.tfporcientocumplimiento.getValue() == 0) ? Ext.getCmp('menor').disable() : Ext.getCmp('menor').enable();
        (_this.tfporcientocumplimiento.getValue() == 100) ? Ext.getCmp('mayor').disable() : Ext.getCmp('mayor').enable();
    };

    this.FormularioIsValid = function (caso) {
        var realizarPeticion = false;
        if (caso == 'cargasPorDefecto') {
            if (_this.fini.getValue() != ''
                || _this.ffin.getValue() != ''
                || _this.cbestadoaprob.getValue() != 0
                || _this.tfporcientocumplimiento.getValue() != ''
                || _this.cbestadocumpl.getValue() != 0) realizarPeticion = true;
        } else {
            var check = (_this.chactual.getValue() == true) ? 1 : 0;
            var sumaelementos = 0;
            var sumaelementoscheck = 0;
            var cantdeinvoleliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar().length;
            var cantinvolucrar = _this.objclasificadorinvol.ObtenerInvolucrados().length;
            var mayor = (_this.chmayor.getValue() == true) ? 1 : 0;
            var menor = (_this.chmenor.getValue() == true) ? 1 : 0;
            var igual = (_this.chigual.getValue() == true) ? 1 : 0;
            if (_this.change != 0) {
                if (_this.change.confvalida != undefined) {
                    if ((_this.cbcategoria.getValue() != _this.change.confvalida.idcategoriaactividad
                        && _this.cbcategoria.getValue() != '')
                        || (_this.cbtipoactividad.getValue() != _this.change.confvalida.idtipoactividad
                        && _this.cbtipoactividad.getValue() != '')
                        || (_this.cbvistapordef.getValue() != _this.change.confvalida.idvistaxdefecto
                        && _this.cbvistapordef.getValue() != '')
                        || (_this.fini.getValue() != ''
                        && _this.fini.getValue().format('d/m/Y') != _this.change.confvalida[0].fechainicio)
                        || (_this.ffin.getValue() != ''
                        && _this.ffin.getValue().format('d/m/Y') != _this.change.confvalida[0].fechafin)) {
                        realizarPeticion = true;
                    }
                    if (_this.chactividad.getValue() == true) {
                        sumaelementoscheck += 3;
                    }
                    if (_this.chobjetivo.getValue() == true) {
                        sumaelementoscheck += 1;
                    }
                    if (_this.charc.getValue() == true) {
                        sumaelementoscheck += 4;
                    }
                    if (_this.chfip.getValue() == true) {
                        sumaelementoscheck += 2;
                    }
                    for (var i = 0; i < _this.change.confvalida.length; i++) {
                        sumaelementos += parseFloat(_this.change.confvalida[i].idtipoelemento);
                    }
                }
                if ((_this.tfdenominacion.getValue() != _this.change.confperfil.denominacion)
                    || (check != _this.change.confperfil.actual) || (sumaelementoscheck != sumaelementos)
                    || (_this.tfporcientocumplimiento.getValue() != _this.change.confperfil.porcientocumplimiento
                    && _this.tfporcientocumplimiento.getValue() != '')
                    || (_this.cbestadocumpl.getValue() != _this.change.confperfil.estadocumplimiento && _this.cbestadocumpl.getValue() != '')
                    || (_this.cbestadoaprob.getValue() != _this.change.confperfil.estadoaprobacion
                    && _this.cbestadoaprob.getValue() != '')
                    || (mayor != _this.change.confperfil.mayor && _this.change.confperfil.mayor != undefined)
                    || (menor != _this.change.confperfil.menor && _this.change.confperfil.menor != undefined)
                    || (igual != _this.change.confperfil.igual && _this.change.confperfil.igual != undefined)
                    || (_this.taDescripcion.getValue() != _this.change.confperfil.descripcion && _this.taDescripcion.getValue() != ''
                    )) {
                    realizarPeticion = true;
                }
                if (_this.change.confperfil.involucrados != undefined) {
                    if (_this.change.confperfil.involucrados.length != cantinvolucrar || cantdeinvoleliminar > 0) {
                        realizarPeticion = true;
                    }
                }
            } else {
                if (_this.tfporcientocumplimiento.getValue() != ''
                    || _this.cbestadoaprob.getValue() != ''
                    || _this.cbestadocumpl.getValue() != ''
                    || (_this.taDescripcion.getValue() != undefined
                    && _this.taDescripcion.getValue() != '')
                    || _this.fini.getValue() != '' || _this.ffin.getValue() != ''
                    || _this.cbestadoaprob.getValue() != ''
                    || _this.cbestadocumpl.getValue() != ''
                    || _this.cbtipoinvolucrado.getValue() != ''
                    || _this.cbcategoria.getValue() != ''
                    || _this.cbtipoactividad.getValue() != ''
                    || _this.cbvistapordef.getValue() != '') {
                    realizarPeticion = true;
                }
            }
        }
        return realizarPeticion;
    };

    this.habilitaBtnAplicarAceptar = function (caso) {

        if (caso == 1) {
            Ext.getCmp('btnAplicarLoad').enable();
            Ext.getCmp('btnAceptarLoad').enable();
        } else if (caso == 2) {
            Ext.getCmp('btnAplicarLoad').enable();
            Ext.getCmp('btnAceptarLoad').enable();
        } else {
            Ext.getCmp('btnAplicarLoad').enable();
            Ext.getCmp('btnAceptarLoad').enable();
        }
    };
    this.desHabilitaBtnAplicarAceptar = function (caso) {
        if (caso == 1) {
            Ext.getCmp('btnAplicarLoad').disable();
            Ext.getCmp('btnAceptarLoad').disable();
        } else if (caso == 2) {
            Ext.getCmp('btnAplicarLoad').disable();
            Ext.getCmp('btnAceptarLoad').disable();
        } else {
            Ext.getCmp('btnAplicarLoad').disable();
            Ext.getCmp('btnAceptarLoad').disable();
        }
    };

    this.limpiarCheckboxForm = function () {
        if (_this.chplan.getValue())
            _this.chplan.setValue(false);

        if (_this.chobjetivo.getValue())
            _this.chobjetivo.setValue(false);

        if (_this.chactividad.getValue())
            _this.chactividad.setValue(false);

        if (_this.charc.getValue())
            _this.charc.setValue(false);

        if (_this.chfip.getValue())
            _this.chfip.setValue(false);

        Ext.getCmp('btnAplicarLoad').disable();
        Ext.getCmp('btnAceptarLoad').disable();
    };

    this.eliminarCargaxDefecto = function (arrayidconfs, PostAccionesGestionar) {
        var arrayidconfperfil = [];
        var totalarrayidconfs = arrayidconfs.length;
        for (i = 0; i < totalarrayidconfs; i++) {
            var elemento = new Object;
            elemento.idcconfperfil = arrayidconfs[i].data.idconfiguracionperfil;
            arrayidconfperfil.push(elemento);
        }
        var mensaje = '', mensajemascara = '';
        if (arrayidconfs.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar las configuraciones de cargas por defecto seleccionadas?';
            mensajemascara = 'Eliminando configuraciones';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar la configuración de cargas por defecto seleccionada?';
            mensajemascara = 'Eliminando configuración';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: _this.url + 'eliminarConfPerfilCargaxDefecto',
                    params: {
                        arrayidconfs: Ext.encode(arrayidconfperfil)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion = 'Las configuraciones de cargas por defecto han sido eliminadas satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'La configuración de cargas por defecto ha sido eliminada satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar('Eliminar', 2);
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion2 = 'Las configuraciones de cargas por defecto que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'La configuración de cargas por defecto que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(3, mensajeconfirmacion2, function () {
                                PostAccionesGestionar('Eliminar', 2);
                            });
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

    this.eliminarCalendario = function (arrayidconfs, PostAccionesGestionar) {
        var arrayidconfperfil = [];
        var totalarrayidconfs = arrayidconfs.length;
        for (i = 0; i < totalarrayidconfs; i++) {

            var elemento = new Object;
            elemento.idcconfperfil = arrayidconfs[i].data.idconfiguracionperfil;
            arrayidconfperfil.push(elemento);

        }
        var mensaje = '', mensajemascara = '';
        if (arrayidconfs.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar las configuraciones de calendario seleccionadas?';
            mensajemascara = 'Eliminando configuraciones';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar la configuración de calendario seleccionada?';
            mensajemascara = 'Eliminando configuración';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: _this.url + 'eliminarConfPerfilCalendario',
                    params: {
                        arrayidconfs: Ext.encode(arrayidconfperfil)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion = 'Las configuraciones de calendario han sido eliminadas satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'La configuración de calendario ha sido eliminada satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar('Eliminar', 1);
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion2 = 'Las configuraciones de calendario que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'La configuración de calendario que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(3, mensajeconfirmacion2, function () {
                                PostAccionesGestionar('Eliminar', 1);
                            });
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

    this.eliminarConfComportamiento = function (arrayidconfs, PostAccionesGestionar) {
        var arrayidconfperfil = [];
        var totalarrayidconfs = arrayidconfs.length;
        for (i = 0; i < totalarrayidconfs; i++) {
            arrayidconfperfil.push(arrayidconfs[i].id);
        }
        var mensaje = '', mensajemascara = '';
        if (arrayidconfs.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar las configuraciones de comportamiento seleccionadas?';
            mensajemascara = 'Eliminando configuraciones';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar la configuración de comportamiento seleccionada?';
            mensajemascara = 'Eliminando configuración';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: _this.url + 'eliminarConfPerfilComportamiento',
                    params: {
                        arrayidconfs: Ext.encode(arrayidconfperfil)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion = 'Las configuraciones de comportamiento han sido eliminadas satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'La configuración de comportamiento ha sido eliminada satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar('Eliminar', 3);
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidconfs.length > 1)
                                mensajeconfirmacion2 = 'Las configuraciones de comportamiento que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'La configuración de comportamiento que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(3, mensajeconfirmacion2, function () {
                                PostAccionesGestionar('Eliminar', 3);
                            });
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
    }
};

