Utilidades.Cmp.Cmpcrudplan = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    var arr_dates = [];
    this.datos_ini = "";
    this.datos_fin = "";
    this.idelemento = null;
    var btnaplicar = false;
    var change = false;
    this.mod = ({
        denominacion: false,
        descripcion: false,
        fechainicio: false,
        fechafin: false,
        porciento: false,
        categoria: false
    });
    this.valoresiniform = ({
        denominacion: '',
        descripcion: '',
        fechainicio: null,
        fechafin: null,
        porciento: '',
        categoria: ''
    });
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    //componente para el manejo de los mensajes de espera
    this.BarraProgreso = new BarraEstado();
    //objeto del componente "gestion documental"
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
                arr_dates.push(date); //arreglo temporal que almacena las fechas que se seleccionan en el datefield inicio
                date = _this.GetRangeDay(date, end.getValue())//permite respetar fecha final a partir de una fecha inicial dado un rango de dias.
                end.setValue(date);
            }
            return true;
        }
    });
    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudPlan = function (accion, PostAccionesGestionar, arrayidplan, sm, st) {
        var readonlyPlan = false;
        if (accion == 'Ver datos del') {
            readonlyPlan = true;
        }
        //campo para la denominacion del plan
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: (accion == 'Ver datos del') ? 'btncerr' : 'btnacep',
            nextTab: (accion == 'Ver datos del') ? 'btncerr' : 'fini',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: readonlyPlan,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.denominacion !== c.getValue().toString()) {
                                    _this.mod.denominacion = true;
                                } else {
                                    _this.mod.denominacion = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        //campo oculto
        _this.idplanhidden = new Ext.form.Hidden({
            id: 'idplan'
        });

        //campo para la descripcion del plan
        this.hedescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'Descripción',
            id: 'hedescripcion',
            width: 640,
            prevTab: 'porcientocump',
            nextTab: 'btncanc',
            readOnly: readonlyPlan,
            height: 140,
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    change = true;
                },
                sync: function (editor, html) {
                    change = true;
                    if (accion == 'Modificar') {
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

        //store del combo categoria del plan
        _this.stCmbCategorias = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarcategoriasplan',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcategoria',
                root: "data"
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }])
        });
        //combo categoria del plan
        _this.cmbcategoria = new Ext.form.ComboBox({
            id: 'cmbcategoria',
            prevTab: 'estadocumplimiento',
            nextTab: 'ffin',
            emptyText: 'Seleccione',
            fieldLabel: 'Categoría del plan',
            store: _this.stCmbCategorias,
            hiddenName: 'idcategoria',
            valueField: 'idcategoria',
            displayField: 'denominacion',
            triggerAction: 'all',
            allowBlank: true,
            editable: true,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'local',
            anchor: '100%',
            listeners: {
                expand: function (combo) {
                    _this.stCmbCategorias.reload();
                },
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (accion == 'Modificar') {
                        if (_this.valoresiniform.categoria != record.data.idcategoria) {
                            _this.mod.categoria = true;
                        } else {
                            _this.mod.categoria = false;
                        }
                    }
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.categoria != c.getValue()) {
                                    _this.mod.categoria = true;
                                } else {
                                    _this.mod.categoria = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para el estado de cumplimiento del plan
        _this.estadocumplimiento = new Ext.form.TextField({
            id: 'estadocumplimiento',
            prevTab: 'fini',
            nextTab: 'cmbcategoria',
            fieldLabel: 'Estado de cumplimiento',
            allowBlank: false,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '90%',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                }
            }
        });
        //campo para el grado de cumplimiento del plan
        _this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocump',
            prevTab: 'ffin',
            nextTab: 'hedescripcion',
            maxValue: 100,
            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            minValue: 0,
            minText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            allowNegative: false,
            nanText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            value: 0,
            anchor: '90%',
            enableKeyEvents: true,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.porciento !== c.getValue().toString()) {
                                    _this.mod.porciento = true;
                                } else {
                                    _this.mod.porciento = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para la fecha de inicio del plan
        _this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            prevTab: 'tfdenominacion',
            nextTab: 'estadocumplimiento',
            id: 'fini',
            endDateField: 'ffin',
            hideTrigger: readonlyPlan,
            readOnly: readonlyPlan,
            allowBlank: false,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            //invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            format: 'd/m/Y',
            anchor: '90%',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    if (date > _this.ffin.getValue()) {
                        _this.ffin.setValue(date);
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                        if (_this.valoresiniform.fechainicio != date.format('d/m/Y')) {
                            _this.mod.fechainicio = true;
                        } else {
                            _this.mod.fechainicio = false;
                        }
                    }
                }
            },
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.fechainicio != c.getValue().format('d/m/Y')) {
                                    _this.mod.fechainicio = true;
                                } else {
                                    _this.mod.fechainicio = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });
        //campo para la fecha de fin del plan
        _this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffin',
            prevTab: 'cmbcategoria',
            nextTab: 'porcientocump',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            format: 'd/m/Y',
            startDateField: 'fini',
            hideTrigger: readonlyPlan,
            readOnly: readonlyPlan,
            //invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false,
            anchor: '90%',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                    //Modificar
                    if (accion == 'Modificar') {
                        if (_this.valoresiniform.fechafin != date.format('d/m/Y')) {
                            _this.mod.fechafin = true;
                        } else {
                            _this.mod.fechafin = false;
                        }
                    }
                }
            },
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                if (_this.valoresiniform.fechafin != c.getValue().format('d/m/Y')) {
                                    _this.mod.fechafin = true;
                                } else {
                                    _this.mod.fechafin = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        //texto donde muestro el autor del plan
        _this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });
        var autoLoad = true;
        if (accion == 'Modificar') {
            autoLoad = false;
        }

        //formulario con atributos del plan
        _this.fpCrudPlan = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    Ext.getCmp('btnacep').handler.call(this);
                }
            }],
            reader: new Ext.data.JsonReader({
                    totalProperty: "total",
                    root: "data",
                    id: "idplan"
                }, [{
                    name: 'idplan'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'fini'
                }, {
                    name: 'ffin'
                }, {
                    name: 'porcientocump'
                }, {
                    name: 'hedescripcion'
                }, {
                    name: 'docasociados '
                }]
            ),
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfdenominacion, _this.idplanhidden]
                    }, {
                        columnWidth: 1,
                        layout: 'fit',
                        items: [{
                            xtype: 'panel',
                            activeTab: 0,
                            border: false,
                            bodyBorder: false,
                            width: 400,
                            height: 500,
                            items: [{
                                frame: false,
                                items: [{
                                    layout: 'column',
                                    items: [{
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
                                        items: [_this.cmbcategoria]
                                    }, {
                                        columnWidth: 1,
                                        layout: 'form',
                                        items: [{
                                            xtype: 'tabpanel',
                                            id: 'tabPanelPlanBottom',
                                            activeTab: 0,
                                            border: true,
                                            bodyBorder: true,
                                            anchor: '100%',
                                            height: 240,
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    id: 'tabPanelDescripcion',
                                                    prevTab: 'cmbcategoria',
                                                    nextTab: 'panelGD',
                                                    title: 'Descripci&oacute;n',
                                                    layout: 'fit',
                                                    items: [_this.hedescripcion]
                                                }, {
                                                    xtype: 'panel',
                                                    title: 'Contenidos asociados',
                                                    id: 'panelGD',
                                                    prevTab: 'tabPanelDescripcion',
                                                    nextTab: 'btncerr',
                                                    layout: 'fit',
                                                    items: [_this.objcmpgestordoc.CrearGridDocAsociados(accion, arrayidplan[0])]
                                                }]
                                        }]
                                    }, {
                                        columnWidth: 1,
                                        layout: 'form',
                                        items: [_this.lfautor]
                                    }]
                                }]
                            }]
                        }]
                    }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudPlan.enable();
                    } else {
                        _this.btnAceptarCrudPlan.disable();
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                        if (valid && (_this.mod.denominacion
                                || _this.mod.descripcion
                                || _this.mod.fechainicio
                                || _this.mod.fechafin
                                || _this.mod.porciento
                                || _this.mod.categoria
                            )) {
                            _this.btnAceptarCrudPlan.enable();
                        } else {//desabilito
                            _this.btnAceptarCrudPlan.disable();
                        }
                    }
                }
            }
        });
        _this.btnAplicarCrudPlan = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: false,
            id: 'btnplic',
            prevTab: 'btncanc',
            nextTab: 'btnacep',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.CrudPlan(PostAccionesGestionar, accion, aplicar = 1);
                btnaplicar = true;
            }
        });
        _this.btnCerrarCrudPlan = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            hidden: true,
            id: 'btncerr',
            prevTab: 'panelGD',
            nextTab: 'btnplic',
            handler: function () {
                _this.winCrudPlan.destroy();
                if (sm.hasSelection()) {
                    sm.clearSelections();
                }
            }
        });

        _this.btnAceptarCrudPlan = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnacep',
            prevTab: 'btnplic',
            nextTab: 'tfdenominacion',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.CrudPlan(PostAccionesGestionar, accion, aplicar = 0);
            }
        });

        _this.btnCancelarCrudPlan = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btncanc',
            nextTab: 'btnplic',
            handler: function () {
                if (btnaplicar) {
                    btnaplicar = false;
                } else {
                    if (sm.hasSelection() != null)
                        sm.clearSelections();
                }
                _this.winCrudPlan.destroy();
            }
        });

        if (_this.winCrudPlan) {
            _this.winCrudPlan.destroy();
        }

        _this.winCrudPlan = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' plan',
            width: 700,
            defaultButton: 1,
            height: 490,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                    _this.fini.setValue('01/01/' + new Date().format('Y'));
                    _this.ffin.setValue('31/12/' + new Date().format('Y'));
                    if (!usarGD) {
                        //Ext.getCmp('panelGD').disable();
                        var tabpanel = Ext.getCmp('tabPanelPlanBottom');
                        var panelGD = Ext.getCmp('panelGD');
                        tabpanel.remove(panelGD, true);
                    }
                },
                destroy: function () {
                    btnaplicar = false;
                    horaslaborables = 24;
                    //modificar
                    _this.mod = ({
                        denominacion: false,
                        descripcion: false,
                        fechainicio: false,
                        fechafin: false,
                        porciento: false,
                        categoria: false
                    });
                },
                beforedestroy: function () {
                    if (btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                render: function (w) {
                    w.focus();
                }
            },
            buttons: [_this.btnCerrarCrudPlan, _this.btnCancelarCrudPlan, _this.btnAplicarCrudPlan,
                _this.btnAceptarCrudPlan
            ],
            items: _this.fpCrudPlan
        });
        _this.winCrudPlan.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.winCrudPlan.doLayout();
        _this.winCrudPlan.show();
        _this.tfdenominacion.focus(false, 1024);
        _this.stCmbCategorias.reload();

        switch (accion) {
            case'Adicionar':
            {
                _this.cmbcategoria.validate();
                _this.tfdenominacion.focus(false, 1024);
            }
                break;
            case'Modificar':
            {
                _this.tfdenominacion.focus(false, 1024);
                _this.btnAplicarCrudPlan.setVisible(false);
                _this.btnAceptarCrudPlan.prevTab = 'btncanc';
                Ext.getCmp('btncanc').nextTab = 'btnacep';
                _this.BarraProgreso.show('Cargando datos');
                _this.winCrudPlan.disable();
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarFormPlan',
                    params: {
                        idplan: arrayidplan[0]
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            _this.BarraProgreso.hide();
                            _this.winCrudPlan.enable();
                            mostrarMensaje(1, 'El plan que usted quiere modificar ya no se encuentra en los registros.');
                            _this.winCrudPlan.destroy();
                            PostAccionesGestionar();
                        } else {
                            _this.BarraProgreso.hide();
                            _this.winCrudPlan.enable();
                            responseData = Ext.decode(response.responseText);
                            _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                            _this.cmbcategoria.setValue(responseData.data[0].categoria.idcategoria);
                            _this.porcientocump.setValue(responseData.data[0].porcientocump);
                            _this.hedescripcion.setValue(responseData.data[0].desc);
                            _this.fini.setValue(responseData.data[0].fini);
                            _this.ffin.setValue(responseData.data[0].ffin);
                            _this.idplanhidden.setValue(responseData.data[0].idplan);
                            _this.estadocumplimiento.setValue(responseData.data[0].estadocumplimiento);
                            _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                            _this.cmbcategoria.setRawValue(responseData.data[0].categoria.denominacion);
                            //Var para el MODIFICAR
                            _this.valoresiniform.denominacion = responseData.data[0].denominacion;
                            _this.valoresiniform.descripcion = responseData.data[0].desc;
                            _this.valoresiniform.fechainicio = responseData.data[0].fini;
                            _this.valoresiniform.fechafin = responseData.data[0].ffin;
                            _this.valoresiniform.porciento = responseData.data[0].porcientocump;
                            _this.valoresiniform.categoria = responseData.data[0].categoria.idcategoria;
                        }
                    }
                });
            }
                break;
            case 'Ver datos del':
            {
                _this.btnCerrarCrudPlan.focus(false, 1024);
                Ext.getCmp('btnacep').hide();
                Ext.getCmp('btnplic').hide();
                Ext.getCmp('btncanc').hide();
                Ext.getCmp('btncerr').show();
                _this.BarraProgreso.show('Cargando datos');
                _this.winCrudPlan.disable();
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarFormPlan',
                    params: {
                        idplan: arrayidplan[0]
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            _this.BarraProgreso.hide();
                            _this.winCrudPlan.enable();
                            mostrarMensaje(1, 'El plan al cual usted quiere ver sus datos ya no se encuentra en los registros.');
                            _this.winCrudPlan.destroy();
                            PostAccionesGestionar();
                        } else {
                            _this.BarraProgreso.hide();
                            _this.winCrudPlan.enable();
                            responseData = Ext.decode(response.responseText);
                            _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                            _this.tfdenominacion.on('focus', function () {
                                _this.tfdenominacion.getEl().blur();
                            });
                            _this.cmbcategoria.setValue(responseData.data[0].categoria.idcategoria);
                            _this.cmbcategoria.clearInvalid();
                            _this.cmbcategoria.on('expand', function () {
                                _this.cmbcategoria.collapse();
                            });
                            _this.porcientocump.setValue(responseData.data[0].porcientocump);
                            _this.porcientocump.on('focus', function () {
                                _this.porcientocump.getEl().blur();
                            });

                            _this.hedescripcion.setValue(responseData.data[0].desc);
                            _this.hedescripcion.disable();

                            _this.fini.setValue(responseData.data[0].fini);
                            _this.fini.clearInvalid();

                            _this.ffin.setValue(responseData.data[0].ffin);
                            _this.ffin.clearInvalid();

                            _this.idplanhidden.setValue(responseData.data[0].idplan);
                            _this.idplanhidden.on('focus', function () {
                                _this.idplanhidden.getEl().blur();
                            });
                            _this.estadocumplimiento.setValue(responseData.data[0].estadocumplimiento);
                            _this.estadocumplimiento.on('focus', function () {
                                _this.estadocumplimiento.getEl().blur();
                            });
                            _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                            _this.lfautor.on('focus', function () {
                                _this.lfautor.getEl().blur();
                            });
                            _this.cmbcategoria.setRawValue(responseData.data[0].categoria.denominacion);
                            _this.cmbcategoria.on('focus', function () {
                                _this.cmbcategoria.getEl().blur();
                            });
                        }
                    }
                });
            }
                break;
        }
    };

    //funcion donde procedo a adicionar y modificar el plan
    this.CrudPlan = function (PostAccionesGestionar, accion, aplicar) {
        if (accion != 'Ver datos del') {
            url = 'adicionarplan';
            waitMsg = 'Guardando datos del plan';
            postaccion = 'adicionado';
            if (accion == 'Modificar') {
                url = 'modificarplan';
                waitMsg = 'Guardando datos del plan';
                postaccion = 'modificado';
            }
            _this.BarraProgreso.show(waitMsg);
            _this.datos_fin = _this.fpCrudPlan.getForm().getValues(true);
            var arraydocumentos = [];
            if (usarGD)
                arraydocumentos = _this.objcmpgestordoc.ObtenerDocumentos();
            _this.fpCrudPlan.getForm().submit({
                url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/' + url,
                params: {
                    documentos: Ext.encode(arraydocumentos)
                },
                failure: function (form, action) {
                    _this.BarraProgreso.hide();
                    if (action.result.mensaje == 1) {
                        mostrarMensaje(1, 'El plan ha sido ' + postaccion + ' satisfactoriamente.');
                        if (aplicar == 0) {
                            _this.winCrudPlan.destroy();
                            PostAccionesGestionar(action.result.mensaje, accion);
                        } else {
                            _this.fpCrudPlan.getForm().reset();
                        }
                    }
                    if (action.result.mensaje == 0) {
                        if (accion == 'Modificar') {
                            mostrarMensaje(1, 'El plan que quiere modificar ya existe.');
                        } else
                            mostrarMensaje(1, 'El plan que quiere adicionar ya existe.');
                    }
                    if (action.result.mensaje == 2) {
                        mostrarMensaje(1, 'El plan que usted quiere modificar ya no se encuentra en los registros.');
                        _this.winCrudPlan.destroy();
                        PostAccionesGestionar(action.result.mensaje, accion);
                    }
                }
            });
        } else {
            _this.winCrudPlan.destroy();
        }
    };

    //funcion donde procedo a eliminar  el o los planes
    this.EliminarPlan = function (arrayidplan, PostAccionesGestionar, smTGCmpPlan, TGCmpPlan) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        if (smTGCmpPlan.getSelections().length > 1) {
            mensaje = '¿Está seguro que quiere eliminar los planes seleccionados?';
            mensajemascara = 'Eliminando planes';
            mensajeconfirmacion = 'Los planes han sido eliminados satisfactoriamente.';
            mensajeconfirmacion2 = 'Los planes que usted quiere eliminar ya no se encuentran en los registros.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar el plan seleccionado?';
            mensajemascara = 'Eliminando plan';
            mensajeconfirmacion = 'El plan ha sido eliminado satisfactoriamente.';
            mensajeconfirmacion2 = 'El plan que usted quiere eliminar ya no se encuentra en los registros.';
        }
        mostrarMensaje(2, mensaje, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/eliminarplan',
                    params: {
                        arrayidplan: Ext.encode(arrayidplan)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            PostAccionesGestionar(1, 'Eliminar');
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2);
                            PostAccionesGestionar(0, 'Eliminar');
                        }
                    }
                });
            } else {
                if (smTGCmpPlan.hasSelection()) {
                    smTGCmpPlan.clearSelections();
                    TGCmpPlan.getView().refresh(true);
                }
            }
        }
    };

    //funcion donde procedo a activar o desactivar  el o los planes
    this.ActivarDesactivarPlan = function (arrayidplan, PostAccionesGestionar, accion) {
        mostrarMensaje(2, '¿Está seguro que quiere ' + accion + ' el(los) plan(es)?', ejecuta);
        function ejecuta(btnPresionado) {
            if (btnPresionado == 'ok') {
                sms = 'Activando';
                smsp = 'activado';
                varaccion = 1;
                if (accion == 'desactivar') {
                    sms = 'Desactivando';
                    smsp = 'desactivado';
                    varaccion = 0;
                }
                _this.BarraProgreso.show(sms + ' plan(es)');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/activardesactivarplan',
                    params: {
                        arrayidplan: Ext.encode(arrayidplan),
                        accion: varaccion
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        msj = 'El plan que usted quiere ' + accion + ' ya no se encuentra en los registros.';
                        if (responseData.mensaje == 1) {
                            msj = 'Plan ' + smsp + ' satisfactoriamente.';
                        }
                        if (responseData.mensaje == 2) {
                            msj = 'Planes ' + smsp + 's satisfactoriamente.';
                        }
                        if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                            mostrarMensaje(1, msj);
                            PostAccionesGestionar();
                        } else {
                            mostrarMensaje(1, msj);
                            PostAccionesGestionar();
                        }
                    }
                });
            }
        }
    };

    //
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


};
