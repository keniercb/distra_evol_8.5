Utilidades.Cmp.Cmpcrudhito = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.BarraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objRelaciones = new Utilidades.Cmp.Cmprelaciones();

    //funcion donde procedo a crear la ventana en dependencia de la accion a ejecutar(CRUD)
    this.CrearWinCrudhito = function (accion, padre, PostAccionesGestionar, arrayidelementos, idEstructura) {
        this.idEstructura = idEstructura;
        this.arrayidelementos = arrayidelementos;
        this.padre = padre;
        this.estamodificando = 0;
        if (accion == 'Modificar') {
            _this.estamodificando = 1;
        }

        var propertyPlantilla = false;
        if (_this.padre.plantilla == 1) {
            propertyPlantilla = true;
        }

        var readOnly = false;
        if (accion == 'Ver datos del') {
            readOnly = true;
        }
        //campo para la denominacion del hito
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 255,
            readOnly: readOnly,
            maxLengthText: 'El tamaÃ±o mÃ¡ximo requerido es 255 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9Ã¡Ã©Ã­Ã³ÃºÃ¼Ã�Ã‰Ã�Ã“ÃšÃ±Ã‘Ãœ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'btnacep',
            allowBlank: false,
            anchor: '100%',
            style: {textTransform: 'uppercase'},
            listeners: {}
        });
        //campo para la descripcion del hito
        this.hedescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'DescripciÃ³n',
            id: 'hedescripcion',
            width: 640,
            readOnly: readOnly,
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
                    text: 'Aumenta el tamaÃ±o de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaÃ±o de la fuente.',
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
                    title: 'ViÃ±etas',
                    text: 'Inicia una lista con viÃ±etas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'NumeraciÃ³n',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'HipervÃ­nculo',
                    text: 'Hace del texto seleccionado un hipervÃ­nculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'EdiciÃ³n de cÃ³digo',
                    text: 'Cambia al modo de ediciÃ³n de cÃ³digo.',
                    cls: 'x-html-editor-tip'
                }
            }
        });
        //campo para la duracion del hito
        /*this.duracionEstimada = new Ext.form.NumberField({
         fieldLabel: 'Duraci\xf3n estimada',
         id: 'duracionE',
         maxValue: 1000,
         maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
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
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
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
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            //width: 40,
            allowNegative: false,
            value: 8,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimadaMinutos = new Ext.form.NumberField({
            fieldLabel: 'Min',
            id: 'duracionEstimadaMinutos',
            maxValue: 1000,
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            // width: 40,
            allowNegative: false,
            value: 0,
            anchor: '90%',
            listeners: {}
        });

        this.duracionEstimada = new Ext.form.FieldSet({
            title: 'Duraci\xf3n estimada:',
            height: 91,
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
        //campo para la duracion del hito
        this.duracionReal = new Ext.form.NumberField({
            fieldLabel: 'Duraci\xf3n real',
            id: 'duracionR',
            maxValue: 1000,
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 0,
            anchor: '95%',
            listeners: {}
        });
        //campo para el peso del hito
        this.peso = new Ext.form.NumberField({
            id: 'peso',
            fieldLabel: 'Peso',
            maxValue: 1000,
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 1000.',
            readOnly: readOnly,
            allowNegative: false,
            value: 1,
            anchor: '95%',
            listeners: {}
        });
        //store del combo categoria del hito
        this.stCmbCategorias = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/cargarNomenclador',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tiponom = 15;
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
        //combo categoria del hito
        this.cmbcategoria = new Ext.form.ComboBox({
            id: 'cmbcategoria',
            emptyText: 'Seleccione',
            fieldLabel: 'Categoría del hito',
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
            listeners: {}
        });

        //texto donde muestro el autor del plan
        this.lfautor = new Ext.form.Label({
            text: 'Autor: ' + window.perfil.usuario
        });
        //campo para la fecha de inicio del hito
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
        //campo para la fecha de fin del hito
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
        //campo para el estado de cumplimiento del hito
        this.estadoCumpl = new Ext.form.TextField({
            id: 'estadoCumpl',
            fieldLabel: 'Estado de cumplimiento',
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 'Sin cumplir',
            readOnly: true,
            anchor: '95%'
        });
        //campo para el grado de cumplimientode del hito
        this.porcientocump = new Ext.form.NumberField({
            fieldLabel: 'Porciento de cumplimiento',
            id: 'porcientocump',
            maxValue: 100,
            maxText: 'Solo admite nÃºmeros enteros positivos entre 0 y 100. Con 2 cifras decimales.',
            readOnly: true,
            allowNegative: false,
            disabled: propertyPlantilla,
            allowBlank: propertyPlantilla,
            value: 0,
            anchor: '95%',
            listeners: {}
        });

        //panel donde muestro las relaciones
        this.prelaciones = _this.objRelaciones.CrearCmpRelaciones(
            _this.estamodificando, 9, _this.arrayidelementos[0].id,
            null, null, null, readOnly, _this.arrayidelementos[0].plantilla);

        this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolProyecto(
            _this.arrayidelementos[0].id, 9, _this.estamodificando, _this.arrayidelementos[0].idautor);

        //panel donde muestro los datos generales
        this.pdatosgenerales = new Ext.Panel({
            title: 'Datos generales',
            frame: true,
            id: 'pdatosgenerales',
            border: false,
            bodyBorder: false,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.duracionEstimada, _this.duracionReal]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.fini, _this.ffin]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.estadoCumpl, _this.porcientocump]
                        }, {
                            columnWidth: 0.25,
                            layout: 'form',
                            items: [_this.cmbcategoria, _this.peso]
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

        this.tpdatoshito = new Ext.TabPanel({
            height: 400,
            activeTab: 0,
            frame: true,
            items: [_this.pdatosgenerales/*, _this.prelaciones*/]
        });
        this.fpCrudHito = new Ext.FormPanel({
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
                        items: [_this.pdatosgenerales/*_this.tpdatoshito*/]
                    }]
            }]
        });


        this.btnAplicarCrudHito = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: (accion == 'Modificar' || accion == 'Ver datos del' || accion == 'Duplicar'),
            id: 'btnplic',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.adicionar(accion, 1);
            }
        });
        this.btnAceptarCrudHito = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnacep',
            nextTab: 'tfdenominacion',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.adicionar(accion, 0, PostAccionesGestionar, arrayidelementos);
            }
        });
        if (_this.winCrudHito) {
            _this.winCrudHito.destroy();
        }
        this.winCrudHito = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: accion + ' hito',
            width: 700,
            height: 530,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                },
                destroy: function () {
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
                    _this.winCrudHito.destroy();
                }
            }, {
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: true,
                id: 'btncerr',
                handler: function () {
                    _this.winCrudHito.destroy();
                }
            }, _this.btnAplicarCrudHito,
                _this.btnAceptarCrudHito
            ],
            items: _this.fpCrudHito
        });
        _this.winCrudHito.doLayout();
        _this.winCrudHito.show();

        this.cargarDatosDesdeCliente = function (arrayidelementos) {
            _this.BarraProgreso.show('Cargando datos');
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
                        var titulo = _this.winCrudHito.title + '  -  ' + 'CAR: ' + responseData.data[0].idelemento;
                        _this.winCrudHito.setTitle(titulo);
                        if (propertyPlantilla == false) {
                            _this.porcientocump.setValue(responseData.data[0].gradocumplimiento);
                            _this.estadoCumpl.setValue(responseData.data[0].estadocumplimiento);
                            _this.fini.setValue(responseData.data[0].fechainicio);
                            _this.ffin.setValue(responseData.data[0].fechafin);
                            _this.duracionReal.setValue(responseData.data[0].duracionreal);
                        }
                        _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                        //_this.duracionEstimada.setValue(responseData.data[0].duracionestimada);
                        _this.duracionEstimadaDias.setValue(responseData.data[0].dias);
                        _this.duracionEstimadaHoras.setValue(responseData.data[0].horas);
                        _this.duracionEstimadaMinutos.setValue(responseData.data[0].minutos);
                        _this.hedescripcion.setValue(responseData.data[0].descripcion);
                        _this.peso.setValue(responseData.data[0].peso);
                        _this.cmbcategoria.setValue(responseData.data[0].categoria.idnomenclador);
                        _this.cmbcategoria.setRawValue(responseData.data[0].categoria.denominacion);
                        _this.objclasificadorinvol.stGInvolucrados.reload({
                            params: {
                                idelemento: arrayidelementos[0].id,
                                idtipoelemento: 9
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
            case 'Ver datos del':
                Ext.getCmp('btncerr').show();
                Ext.getCmp('btncanc').hide();
                _this.btnAceptarCrudHito.hide();
                _this.objclasificadorinvol.tpinvolucrados.disable();
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
            default:
                _this.cargarDatosDesdeCliente(arrayidelementos);
                break;
        }
    };

    //funcion donde procedo a adicionar y modificar un hitos
    this.adicionar = function (accion, aplicar, PostAccionesGestionar, arrayidelementos, verificarInvol) {
        url = 'adicionarHito';
        waitMsg = 'Guardando datos del hito...';
        postaccion = 'adicionado';

        if (accion == 'Modificar') {
            url = 'modificarHito';
            waitMsg = 'Modificando datos del hito...';
            postaccion = 'modificado';
        }

        if (accion == 'Duplicar') {
            url = 'duplicarHito';
            waitMsg = 'Duplicando datos del hito...';
            postaccion = 'duplicado';
        }

        var plantilla = 0;
        if (_this.padre.plantilla == 1) {
            plantilla = 1;
        }
        var idpadre = _this.padre.idelemento;
        var idautorpadre = _this.padre.idautor;
        var tipopadre = _this.padre.tipoelemento;
        btnaplicar = false;
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var arrayinvolucradoseliminar = _this.objclasificadorinvol.ObtenerInvolucradosEliminar();
        var duracionEstimada = (_this.duracionEstimadaDias.getValue() * 24) + _this.duracionEstimadaHoras.getValue() + (_this.duracionEstimadaMinutos.getValue() / 60);
        var verificartiempoInvol = (!verificarInvol && arrayinvolucrados.length > 0) ? 1 : 0;
        _this.BarraProgreso.show(waitMsg);
        _this.fpCrudHito.getForm().submit({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/' + url,
            params: {
                plantilla: plantilla,
                idpadre: idpadre,
                duracionE: duracionEstimada,
                idautorpadre: idautorpadre,
                tipopadre: tipopadre,
                idelemento: (arrayidelementos == undefined) ? null : arrayidelementos[0].id,
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arrayinvolucradoseliminar: Ext.encode(arrayinvolucradoseliminar),
                verificartiempoinvol: verificartiempoInvol,
                idEstructura: _this.idEstructura
            },
            failure: function (form, action) {
                _this.BarraProgreso.hide();
                if (action.result.mensaje.mensaje == 5) {
                    var arrayInvol = action.result.mensaje.involucrados;
                    var fechafinact = action.result.mensaje.fechafinact;
                    var msj = 'En el hito ' + postaccion + ' existe(n) conflicto(s) entre la fecha de fin del hito (<b>' + fechafinact + '</b>) ' +
                        'y el fondo de tiempo planificado para el(los) siguiente(s) involucrado(s):<br /><br />';
                    for (var invol in arrayInvol) {
                        if (arrayInvol.hasOwnProperty(invol)) {
                            if (arrayInvol[invol].nombreapellidos != '') {
                                msj += '<b>Nombre: </b>' + arrayInvol[invol].nombreapellidos + ' ---- <b>SegÃºn fondo de tiempo planificado: </b>' + arrayInvol[invol].fechafin + '<br />';
                            } else {
                                msj += '<b>Usuario: </b>' + arrayInvol[invol].usuario + ' ---- <b>SegÃºn fondo de tiempo planificado: </b>' + arrayInvol[invol].fechafin + '<br />';
                            }

                        }
                    }
                    msj += '<br />Â¿Desea ignorar la advertencia?'
                    mostrarMensaje(2, msj, function (btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.adicionar(accion, aplicar, PostAccionesGestionar, arrayidelementos, verificarInvol = 1);
                        } else {
                        }
                    });

                }
                if (action.result.mensaje == 1) {
                    mostrarMensaje(1, 'El hito ha sido ' + postaccion + ' satisfactoriamente.');
                    if (aplicar == 0) {
                        _this.winCrudHito.destroy();
                    } else {
                        _this.fpCrudHito.getForm().reset();
                    }
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
                if (action.result.mensaje == 0) {
                    if (accion == 'Modificar') {
                        mostrarMensaje(1, 'El hito que quiere modificar ya existe.');
                    } else {
                        mostrarMensaje(1, 'El hito que quiere adicionar ya existe.');
                    }
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
                if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'El hito que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudHito.destroy();
                    PostAccionesGestionar(action.result.mensaje, accion);
                }
            }
        });
    };


};
