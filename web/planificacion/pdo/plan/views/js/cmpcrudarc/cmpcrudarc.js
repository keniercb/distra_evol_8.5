Utilidades.Cmp.Cmpcrudarc = function() {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.eshija = 0;
    this.arrayidarc = [];
    var arr_dates = [];
    this.datos_ini = "";
    this.datos_fin = "";
    var contador = 1;
    var arrayinvolucrados_ini = [];
    var arrayrelaciones_ini = [];
    this.hedescripcion_ini = '';
    this.btnaplicar = false;
    this.mod = ({
        denominacion: false,
        descripcion: false,
        fechainicio: false,
        fechafin: false,
        orden:false
    });
    this.valoresiniform = ({
        denominacion: '',
        descripcion: '',
        fechainicio: null,
        fechafin: null,
        orden:''
    });
    this.tipoelemento = '';

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();
    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function(val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.endDateField) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
            }
            return true;
        }
    });

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudArc = function(accion, elemento, PostAccionesGestionar, arrayidarc, idautor, eshija, arrayelementosrelacionadosinicial, sm, st) {
        _this.arrayelementosrelacionadosinicial = [];
        if (arrayelementosrelacionadosinicial.length > 0) {
            _this.arrayelementosrelacionadosinicial = arrayelementosrelacionadosinicial;
        }
        _this.eshija = eshija;
        _this.arrayidarc = arrayidarc;
        _this.estamodificando = 0;
        _this.tipoelemento = elemento;
        var permiso = 1;
        var readonlyArc = false;
        if (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Relacionar elementos al') {
            _this.estamodificando = 1;
            if (accion == 'Ver datos del') {
                readonlyArc = true;
            }
        }
        //campo para la denominacion del arc
        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacionarc',
            fieldLabel: 'Denominación',
            maxLength: 255,
            prevTab: 'btaceparc',
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            readOnly: readonlyArc,
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

        _this.orden = new Ext.form.NumberField({
            id:'orden',
            allowDecimals :false,
            allowNegative :false,
            allowBlank: false,
            maxLength :2,
            minLength :1,
            fieldLabel: 'Orden',
            name: 'orden',
            width:80,
            value:1,
            listeners:{
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.orden !== c.getValue().toString()) {
                                _this.mod.orden = true;
                            } else {
                                _this.mod.orden = false;
                            }
                        }, c);
                    }
                }
            }

        });

        //campo para la descripcion del arc
        _this.hedescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripcionarc',
            width: 690,
            height: 223,
            readOnly: readonlyArc,
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

        //campo para la fecha de inicio del arc
        _this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finiarc',
            endDateField: 'ffinarc',
            allowBlank: false,
            readOnly: readonlyArc,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            vtype: 'daterange',
            format: 'd/m/Y',
            anchor: '95%',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.ffin.setMinValue(date);
                    if (date > _this.ffin.getValue()) {
                        _this.ffin.setValue(date);
                    }//Modificar
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.fechainicio != date.format('d/m/Y')) {
                            _this.mod.fechainicio = true;
                        } else {
                            _this.mod.fechainicio = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.fechainicio != c.getValue().format('d/m/Y')) {
                                _this.mod.fechainicio = true;
                            } else {
                                _this.mod.fechainicio = false;
                            }
                        }, c);
                    }
                }
            }
        });

        //campo para la fecha de fin del arc
        _this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffinarc',
            vtype: 'daterange',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            readOnly: readonlyArc,
            startDateField: 'finiarc',
            format: 'd/m/Y',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            anchor: '95%',
            menuListeners: {
                select: function(df, date) {
                    this.setValue(date);
                    _this.fini.setMaxValue(date);
                    //Modificar
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.fechafin != date.format('d/m/Y')) {
                            _this.mod.fechafin = true;
                        } else {
                            _this.mod.fechafin = false;
                        }
                    }
                }
            },
            listeners: {
                'render': function(c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function() {
                            if (_this.valoresiniform.fechafin != c.getValue().format('d/m/Y')) {
                                _this.mod.fechafin = true;
                            } else {
                                _this.mod.fechafin = false;
                            }
                        }, c);
                    }
                }
            }
        });

        _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvol(arrayidarc[0], 5, _this.estamodificando, idautor);

        //tabpanel donde pongo el clasificador de involucrados y la descripcion
        _this.tpdatoscomp = new Ext.TabPanel({
            height: 250,
            activeTab: 0,
            frame: true,
            listeners: {
                tabchange: function(tf) {
                    _this.tpdatoscomp.doLayout();
                }
            },
            items: [_this.pclasificadorinvol,
                {
                    title: 'Descripci&oacute;n',
                    xtype: 'panel',
                    items: [_this.hedescripcion]
                }
            ]
        });

        //texto donde muestro el autor del arc
        _this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });

        //panel de relaciones
        _this.prelaciones = _this.objcmprelaciones.CrearCmpRelaciones(_this.estamodificando, 5, arrayidarc[0], permiso, PostAccionesGestionar, _this.DestruirWinCrudArc);

        _this.tpdatosgenerales = new Ext.TabPanel({
            height: 370,
            activeTab: 0,
            frame: true,
            items: [
                {
                    title: 'Datos generales',
                    frame: true,
                    items: [
                        {
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
                                            id: 'dg',
                                            activeTab: 0,
                                            border: false,
                                            bodyBorder: false,
                                            width: 400,
                                            height: 350,
                                            items: [{
                                                    frame: false,
                                                    items: [{
                                                            layout: 'column',
                                                            bodyStyle: 'padding:10px 10px',
                                                            items: [
                                                                {
                                                                    columnWidth: 0.4,
                                                                    layout: 'form',
                                                                    items: [_this.fini]
                                                                }, {
                                                                    columnWidth: 0.4,
                                                                    layout: 'form',
                                                                    items: [_this.ffin]
                                                                },
                                                                {
                                                                    columnWidth: 0.2,
                                                                    layout: 'form',
                                                                    items: [_this.orden]
                                                                }, {
                                                                    columnWidth: 1,
                                                                    layout: 'form',
                                                                    items: [_this.tpdatoscomp]
                                                                }
                                                            ]
                                                        }]
                                                }]
                                        }]
                                }
                            ]
                        }
                    ]
                },
                _this.prelaciones
            ],
            listeners: {
                tabchange: function(tabpanel, relaciones) {
                    _this.objcmprelaciones.stTGRelaciones.on('load', function() {
                        if (relaciones == _this.prelaciones && contador == 1) {
                            arrayrelaciones_ini = _this.objcmprelaciones.ObtenerIDElementosRelacionados();
                            contador++;
                        }
                    });
                }
            }
        });

        //formulario con atributos del arc
        _this.fpCrudArc = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function() {
                        Ext.getCmp('btaceparc').handler.call(this);
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
                            items: [_this.tpdatosgenerales]
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
                        _this.btnAceptarCrudARC.enable();
                    } else {
                        _this.btnAceptarCrudARC.disable();
                    }
                    //Modificar
                    if (_this.estamodificando == 1) {
                        if (valid && (_this.objclasificadorinvol.modificarInv
                                || _this.mod.denominacion
                                || _this.mod.descripcion
                                || _this.mod.fechainicio
                                || _this.mod.fechafin
                                || _this.mod.orden
                                || _this.objcmprelaciones.modificarRelaciones
                                )) {
                            _this.btnAceptarCrudARC.enable();
                        } else {//desabilito
                            _this.btnAceptarCrudARC.disable();
                        }
                    }
                }
            }
        });

        _this.btnCancelarCrudARC = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'btcancarc',
            nextTab: 'btaplarc',
            tooltip: 'Cerrar ventana sin guardar los datos',
            hidden: true,
            handler: function() {
                contador = 1;
                arrayrelaciones_ini = [];
                _this.hedescripcion_ini = '';
                _this.winCrudArc.destroy();
                _this.btnaplicar = false;
                //if (sm.hasSelection() != null) sm.clearSelections();
            }
        });
        _this.btnAceptarCrudARC = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'btaceparc',
            prevTab: 'btaplarc',
            nextTab: 'tfdenominacionarc',
            hidden: true,
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function() {
                _this.CrudArc(PostAccionesGestionar, accion, aplicar = 0);
            }
        });
        _this.btnAplicarCrudARC = new Ext.Button({
            iconCls: 'aplicar',
            id: 'btaplarc',
            prevTab: 'btcancarc',
            nextTab: 'btaceparc',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function() {
                _this.CrudArc(PostAccionesGestionar, accion, aplicar = 1);
                _this.btnaplicar = true;
            }
        });
        _this.btnCerrarCrudARC = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            hidden: true,
            handler: function() {
                _this.winCrudArc.destroy();
            }
        });

        if (_this.winCrudArc) {
            _this.winCrudArc.destroy();
        }
        _this.winCrudArc = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: (elemento==1)?accion +' Capítulo':accion +' ARC',
            width: 750,
            height: 530,
            resizable: false,
            listeners: {
                beforeshow: function(win) {
                    _this.fini.setValue(new Date().format('d/m/Y'));
                },
                beforedestroy: function(win) {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                destroy: function() {
                    this.datos_ini = "";
                    this.datos_fin = "";
                    var contador = 1;
                    var arrayinvolucrados_ini = [];
                    var arrayrelaciones_ini = [];
                    this.hedescripcion_ini = '';
                    _this.btnaplicar = false;
                    //modificar
                    _this.mod.denominacion = false;
                    _this.mod.descripcion = false;
                    _this.mod.fechainicio = false;
                    _this.mod.fechafin = false;
                    _this.objcmprelaciones.modificarRelaciones = false;
                }
            },
            buttons: [_this.btnCancelarCrudARC, _this.btnAplicarCrudARC, _this.btnAceptarCrudARC, _this.btnCerrarCrudARC],
            items: [_this.fpCrudArc]
        });
        _this.winCrudArc.doLayout();
        _this.winCrudArc.show();
        _this.tfdenominacion.focus(false, 1024);
        _this.objcmprelaciones.ReiniciarArrayElementosRelacionados();
        if (accion == 'Modificar' || accion == 'Ver datos del'
                || accion == 'Relacionar elementos al') {
            _this.BarraProgreso.show('Cargando datos');
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionararc/cargarFormArc',
                params: {
                    idarc: arrayidarc[0]
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 0) {
                        _this.BarraProgreso.hide();
                        _this.winCrudArc.enable();
                        mostrarMensaje(1, 'El ARC que usted quiere modificar ya no se encuentra en los registros.', function() {
                            _this.winCrudArc.destroy();
                            PostAccionesGestionar();
                        });
                    } else {
                        _this.BarraProgreso.hide();
                        _this.winCrudArc.enable();
                        responseData = Ext.decode(response.responseText);
                        _this.tfdenominacion.setValue(responseData.data[0].denarc);
                        _this.hedescripcion.setValue(responseData.data[0].descrip);
                        _this.fini.setValue(responseData.data[0].fechainicio);
                        _this.ffin.setValue(responseData.data[0].fechafin);
                        _this.orden.setValue(responseData.data[0].orden);
                        _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                        _this.datos_ini = _this.fpCrudArc.getForm().getValues(true);
                        arrayinvolucrados_ini = _this.objclasificadorinvol.ObtenerInvolucrados(true);
                        _this.hedescripcion_ini = responseData.data[0].descrip;
                        //Var para el MODIFICAR
                        _this.valoresiniform.denominacion = responseData.data[0].denarc;
                        _this.valoresiniform.descripcion = responseData.data[0].descrip;
                        _this.valoresiniform.fechainicio = responseData.data[0].fechainicio;
                        _this.valoresiniform.fechafin = responseData.data[0].fechafin;
                        _this.valoresiniform.orden = responseData.data[0].orden;
                    }
                }
            });
        }
        switch (accion) {
            case'Adicionar':
                _this.btnCancelarCrudARC.setVisible(true);
                _this.btnAceptarCrudARC.setVisible(true);
                _this.objclasificadorinvol.cargarInvolConfPerfil(4);
                break;
            default:
                var accionejecutada = 'que usted quiere modificar';
                if (accion == 'Modificar' || accion == 'Ver datos del'
                        || accion == 'Relacionar elementos al') {
                    if (accion == 'Modificar') {
                        _this.btnCancelarCrudARC.setVisible(true);
                        _this.btnAceptarCrudARC.setVisible(true);
                        _this.btnAplicarCrudARC.setVisible(false);
                        _this.btnCancelarCrudARC.nextTab = 'btaceparc';
                        _this.btnAceptarCrudARC.prevTab = 'btcancarc';
                    }
                    if (accion == 'Ver datos del' || accion == 'Relacionar elementos al') {
                        accionejecutada = 'a la cual usted quiere ver sus datos';
                        _this.objcmprelaciones.btnRelacionar.setVisible(false);
                        _this.btnAplicarCrudARC.setVisible(false);
                        _this.objcmprelaciones.btnEliminarRelaciones.setVisible(false);
                        if (accion == 'Relacionar elementos al') {
                            accionejecutada = 'a la cual usted quiere relacionar con otros elementos';
                            Ext.getCmp('dg').disable();
                            _this.tpdatosgenerales.activate(_this.prelaciones);
                            _this.objcmprelaciones.btnRelacionar.setVisible(true);
                            _this.objcmprelaciones.btnEliminarRelaciones.setVisible(true);
                        }
                        _this.btnCerrarCrudARC.setVisible(true);
                        _this.objclasificadorinvol.tpinvolucrados.disable();
                    }
                    _this.BarraProgreso.show('Cargando datos');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionararc/cargarFormArc',
                        params: {
                            idarc: arrayidarc[0]
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.BarraProgreso.hide();
                                _this.winCrudArc.enable();
                                mostrarMensaje(1, 'El ARC ' + accionejecutada + ' ya no se encuentra en los registros.', function() {
                                    _this.winCrudArc.destroy();
                                    PostAccionesGestionar();
                                });
                            } else {
                                _this.BarraProgreso.hide();
                                _this.winCrudArc.enable();
                                responseData = Ext.decode(response.responseText);
                                _this.tfdenominacion.setValue(responseData.data[0].denarc);
                                _this.hedescripcion.setValue(responseData.data[0].descrip);
                                _this.fini.setValue(responseData.data[0].fechainicio);
                                _this.ffin.setValue(responseData.data[0].fechafin);
                                _this.lfautor.setText('Autor: ' + responseData.data[0].autor);
                                _this.hedescripcion_ini = _this.hedescripcion.getValue();
                                //Var para el MODIFICAR
                                _this.valoresiniform.denominacion = responseData.data[0].denarc;
                                _this.valoresiniform.descripcion = responseData.data[0].descrip;
                                _this.valoresiniform.fechainicio = responseData.data[0].fechainicio;
                                _this.valoresiniform.fechafin = responseData.data[0].fechafin;
                            }
                        }
                    });
                }
        }
    };
    this.validarMod = function() {
        var result = false;
        var arrayrelaciones_fin = [];
        _this.datos_fin = _this.fpCrudArc.getForm().getValues(true);
        var arrayinvolucrados_fin = _this.objclasificadorinvol.ObtenerInvolucrados();
        arrayrelaciones_fin = _this.objcmprelaciones.ObtenerIDElementosRelacionados();
        var aux = _this.datos_fin.lastIndexOf('&cbrelacionadocon');
        if (_this.tpdatosgenerales.getActiveTab() == _this.prelaciones || aux != -1) {
            _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(_this.datos_fin.lastIndexOf('&cbrelacionadocon')), '');
        }
        var hedescripcion_fin = (_this.hedescripcion.getValue() != '') ? _this.hedescripcion.getValue() : '';
        var replazardesde;
        var pDescripArcActivo = _this.datos_fin.lastIndexOf('&hedescripcionarc');
        if (pDescripArcActivo != -1) {
            replazardesde = pDescripArcActivo;
            _this.datos_fin = _this.datos_fin.replace(_this.datos_fin.substring(replazardesde), '');
        }
        if (_this.datos_fin == _this.datos_ini
                && arrayinvolucrados_fin.toString() == arrayinvolucrados_ini.toString()
                && arrayrelaciones_fin.toString() == arrayrelaciones_ini.toString()
                && hedescripcion_fin == _this.hedescripcion_ini)
            result = true;
        return result;
    };
    //funcion donde procedo a adicionar y modificar el plan
    this.CrudArc = function(PostAccionesGestionar, accion, aplicar) {
        url = 'adicionararc';
        waitMsg = 'Guardando datos del ARC';
        postaccion = 'adicionada';
        existe = 'adicionar';
        elementosrelacionados = _this.objcmprelaciones.ObtenerElementosRelacionados();
        escapitulo = 0;
        tipoelemento = 'ARC';

        console.log("_this.tipoelemento", _this.tipoelemento);

        if (accion == 'Modificar') {
            url = 'modificararc';
            waitMsg = 'Guardando datos del ARC';
            postaccion = 'modificada';
            existe = 'modificar';
            elementosrelacionados = [];
        }

        if (_this.tipoelemento == 1) {
            escapitulo = 1;
            tipoelemento = 'capítulo';
            postaccion = (accion == 'Modificar')?'modificado':'adicionado';
        }
        if (_this.arrayelementosrelacionadosinicial.length > 0) {
            for (var i = 0; i < _this.arrayelementosrelacionadosinicial.length; i++) {
                elementosrelacionados.push(_this.arrayelementosrelacionadosinicial[i]);
            }
        }
        if (!_this.validarMod()) {
            if (_this.fpCrudArc.getForm().isValid()) {
                _this.btnaplicar = false;
                var procede = 0;
                /* var patron = /[a-zA-Z0-9áéíóúñüÑ]/;
                 if (_this.tfdenominacion.getValue().match(patron)) {
                 procede = 1;
                 }
                 if (procede == 1) {*/
                _this.BarraProgreso.show(waitMsg);
                var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
                _this.fpCrudArc.getForm().submit({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionararc/' + url,
                    params: {
                        idarcp: _this.arrayidarc[0],
                        eshija: _this.eshija,
                        arrayinvolucrados: Ext.encode(arrayinvolucrados),
                        idarc: _this.arrayidarc[0],
                        arrayelementosrelacionados: Ext.encode(elementosrelacionados),
                        escapitulo: escapitulo
                    },
                    failure: function(form, action) {
                        _this.BarraProgreso.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'El ' + tipoelemento + ' ha sido ' + postaccion + ' satisfactoriamente.');
                            if (aplicar == 0) {
                                PostAccionesGestionar(action.result.mensaje, accion);
                                contador = 1;
                                arrayrelaciones_ini = [];
                                _this.hedescripcion_ini = '';
                                _this.winCrudArc.destroy();
                            } else {
                                _this.fpCrudArc.getForm().reset();
                                _this.objclasificadorinvol.ResetearCampos();
                                _this.objcmprelaciones.ResetearRelaciones();
                            }
                        }
                        if (action.result.mensaje == 0) {
                            mostrarMensaje(1, 'El ' + tipoelemento + ' que quiere ' + existe + ' ya existe.');
                            btnaplicar = false;
                        }
                        if (action.result.mensaje == 2) {
                            mostrarMensaje(1, 'El ' + tipoelemento + ' al cual usted quiere agregarle un ARC hija ya no se encuentra en los registros.', function() {
                                _this.winCrudArc.destroy();
                                PostAccionesGestionar(action.result.mensaje, accion);
                            });
                        }
                        if (action.result.mensaje == 3) {
                            mostrarMensaje(1, 'El ' + tipoelemento + ' que usted quiere modificar ya no se encuentra en los registros.', function() {
                                _this.winCrudArc.destroy();
                                PostAccionesGestionar(action.result.mensaje, accion);
                            });
                        }
                    }
                });
                /* } else
                 mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');*/
            } //else
            //  mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
        } else
            mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
    };


    //funcion donde procedo a eliminar  el o las arc
    this.EliminarArc = function(elemento, arrayidarc, PostAccionesGestionar, smTGCmpArc, TGCmpArc) {
        var mensaje = '', mensajeespera;
        var tipoelemento = 'ARC';
        if (elemento == 1) {
            tipoelemento = 'capítulo';
        }
        if (arrayidarc.length == 1) {
            mensaje = (elemento == 1)?'¿Está seguro que quiere eliminar el capítulo seleccionado?':
                                      '¿Está seguro que quiere eliminar el ARC seleccionada?';
            mensajeespera = 'Eliminando ' + tipoelemento;
        } else {
            mensaje = (elemento == 1)?'¿Está seguro que quiere eliminar los capítulos seleccionados?':
                                      '¿Está seguro que quiere eliminar las ARC seleccionadas?';
            mensajeespera = 'Eliminando ARCs';
        }
        mostrarMensaje(2, mensaje, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(mensajeespera);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionararc/eliminararc',
                    params: {
                        arrayidarc: Ext.encode(arrayidarc)
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        msj = 'El ' + tipoelemento + ' que usted quiere eliminar ya no se encuentra en los registros.';
                        icono = 3;
                        var ms = 0;
                        if (responseData.mensaje == 1) {
                            if (arrayidarc.length == 1) {
                                msj = (elemento == 1)?'El capítulo ha sido eliminado satisfactoriamente.':
                                                      'EL ARC ha sido eliminada satisfactoriamente.';
                            } else {
                                msj = (elemento == 1)?'Los capítulos han sido eliminados satisfactoriamente.':
                                                      'Las ARCs han sido eliminadas satisfactoriamente.';
                            }

                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 2) {
                            if (arrayidarc.length > 1)
                                msj = (elemento == 1)?'Los capítulos han sido eliminados y desactivados satisfactoriamente.':
                                                      'Las ARCs han sido eliminadas y desactivadas satisfactoriamente.';
                            else
                                msj = (elemento == 1)?'El capítulo ha sido eliminado y desactivado satisfactoriamente.':
                                                      'El ARC ha sido eliminada y desactivada satisfactoriamente.';
                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 4) {
                            if (arrayidarc.length > 1)
                                msj = (elemento == 1)?'Los capítulos han sido desactivados satisfactoriamente.':
                                                      'Las ARCs han sido desactivadas satisfactoriamente.';
                            else
                                msj = (elemento == 1)?'El capítulo ha sido desactivado satisfactoriamente.':
                                                      'El ARC ha sido desactivada satisfactoriamente.';
                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 5) {
                            if (arrayidarc.length > 1)
                                msj = (elemento == 1)?'Los capítulos no se pueden eliminar debido a que est&aacute;n en uso.':
                                                      'Las ARCs no se pueden eliminar debido a que est&aacute;n en uso.';
                            else
                                msj = (elemento == 1)?'El capítulo no se puede eliminar debido a que est&aacute; en uso.':
                                                      'El ARC no se puede eliminar debido a que est&aacute; en uso.';
                            icono = 1;
                            ms = 1;
                        }
                        if (responseData.mensaje == 1
                                || responseData.mensaje == 2
                                || responseData.mensaje == 4 || responseData.mensaje == 5) {
                            mostrarMensaje(1, msj);
                            PostAccionesGestionar(ms, 'Eliminar');
                        } else {
                            mostrarMensaje(icono, msj, function() {
                                PostAccionesGestionar(ms, 'Eliminar');
                            });
                        }
                    }
                });
            } else {
                if (smTGCmpArc.hasSelection()) {
                    smTGCmpArc.clearSelections();
                    TGCmpArc.getView().refresh(true);
                }
            }
        }
    };

    //funcion donde procedo a activar o desactivar  la o las arc
    this.ActivarDesactivarArc = function(elemento, arrayidarc, PostAccionesGestionar, accion, smTGCmpArc) {
        var mensaje = '', mensajemascara = '';
        if (arrayidarc.length > 1) {
            mensaje = (elemento ==1)?'¿Está seguro que quiere ' + accion + ' los capítulos seleccionados?':
                                     '¿Está seguro que quiere ' + accion + ' las ARCs seleccionadas?';
            mensajemascara = (elemento ==1)?'capítulos':'ARCs';
        } else {
            mensaje = (elemento ==1)?'¿Está seguro que quiere ' + accion + ' el capítulo seleccionado?':
                                     '¿Está seguro que quiere ' + accion + ' el ARC seleccionada?';
            mensajemascara = (elemento ==1)?'capítulo':'ARC';
        }
        mostrarMensaje(2, mensaje, ejecuta);

        function ejecuta(btnPresionado) {
            if (btnPresionado == 'ok') {
                sms = (elemento ==1)?'Activando':'Activanda';
                smsp = (elemento ==1)?'activado':'activada';
                varaccion = 1;
                if (accion == 'desactivar') {
                    sms = (elemento ==1)?'Desactivando':'Desactivanda';
                    smsp = (elemento ==1)?'desactivado':'desactivado';
                    varaccion = 0;
                }
                _this.BarraProgreso.show(sms + mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionararc/activardesactivararc',
                    params: {
                        arrayidarc: Ext.encode(arrayidarc),
                        accion: varaccion
                    },
                    callback: function(options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion1 = '';
                            if (arrayidarc.length > 1)
                                mensajeconfirmacion1 = (elemento ==1)?'Los capítulos han sido ' + smsp + 's satisfactoriamente.':
                                                                      'Las ARCs han sido ' + smsp + 's satisfactoriamente.';
                            else
                                mensajeconfirmacion1 = (elemento ==1)?'El capítulo ha sido ' + smsp + ' satisfactoriamente.':
                                                                      'El ARC ha sido ' + smsp + ' satisfactoriamente.';

                            mostrarMensaje(1, mensajeconfirmacion1);
                            PostAccionesGestionar(responseData.mensaje, 'DesAct');
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arrayidarc.length > 1)
                                mensajeconfirmacion2 = (elemento ==1)?'Los capítulos que usted quiere ' + accion + ' ya no se encuentran en los registros.':
                                                                      'Las ARCs que usted quiere ' + accion + ' ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = (elemento ==1)?'El capítulo que usted quiere ' + accion + ' ya no se encuentra en los registros.':
                                                                      'El ARC que usted quiere ' + accion + ' ya no se encuentra en los registros.';

                            mostrarMensaje(1, mensajeconfirmacion2, function() {
                                PostAccionesGestionar(responseData.mensaje, 'DesAct');
                            });
                        }
                    }
                });
            } else {
                if (smTGCmpArc.hasSelection())
                    smTGCmpArc.clearSelections();
            }
        }
    };

    this.DestruirWinCrudArc = function() {
        _this.winCrudArc.destroy();
    }


};
