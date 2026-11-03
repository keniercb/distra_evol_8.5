Utilidades.Cmp.Cmpcruddesviaciones = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    var change = false;
    var Autoload = true;
    Ext.Ajax.timeout = 1000000000;
    this.BarraProgreso = new BarraEstado();
    this.arrayincidasociadas = [];
    this.idelemento = 0;
    _this.modificarIncidencias = false;
    this.mod = ({
        denominacion: false,
        impacto: false,
        tipodesviacion: false,
        asociadaincidencia: false,
        descripcion: false,
        objetivos: false,
        actividades: false
    });
    this.valoresiniform = ({
        denominacion: '',
        impacto: '',
        tipodesviacion: null,
        asociadaincidencia: [],
        descripcion: '',
        objetivos: '',
        actividades: ''
    });
    var iddesviacion;



    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();


    this.CrearWinFormDesviaciones = function (PostAccionesGestionar, accion, smDesviaciones) {




        if (accion == 'modificar')
            Autoload = false;

        /*this.objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan({
         idcomponente: 'local',
         tipoComponente: 'panel',
         noUsarAdicionar: true,
         noUsarModificar: true,
         noUsarEliminar: true,
         noUsarActivar: true,
         noUsarDesactivar: true,
         noUsarCerrarWinP: true,
         noUsarSeleccionarWinP: true,
         maxWinPrincipal: true,
         noUsarCbAprob: true,
         noUsarGestObser: true,
         noMostrarColumObser: true,
         singlemodoSeleccionGridPlanes: true,
         noUsarMenuGrid: true
         });*/



        this.objCmpActividades = new Utilidades.Cmp.Cmpgestionaractividades({
            noUsarAdicionar: true,
            noUsarModificar: true,
            noUsarEliminar: true,
            noUsarActivar: true,
            noUsarDesactivar: true,
            noUsarCerrarWinP: true,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            noUsarCbAprob: true,
            noUsarGestObser: true,
            noMostrarColumObser: true,
            singlemodoSeleccionGridActividades: false,
            reordenarHijos: true,
            idcmp: 'local',
            tipoComponente: 'panel',
            noUsarMenuGrid: true,
            noAutoload: Autoload,
            nombrePanel: 'Actividades',
            verificarPuntualizacion: false
        });

        this.objCmpObjetivos = new Utilidades.Cmp.Cmpgestionarobjetivos({
            noUsarAdicionar: true,
            noUsarModificar: true,
            noUsarEliminar: true,
            noUsarActivar: true,
            noUsarDesactivar: true,
            noUsarCerrarWinP: true,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            noUsarCbAprob: true,
            noUsarGestObser: true,
            noMostrarColumObser: true,
            idcmp: 'local',
            tipoComponente: 'panel',
            noUsarMenuGrid: true,
            nombrePanel: 'Objetivos'

        });

        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominaciondesv',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            fieldLabel: 'Denominaci&oacute;n',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            anchor: '100%',
            prevTab: 'btnAceptarCrudDes',
            listeners: {
                'render': function (c) {
                    if (accion == 'modificar') {
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

        this.stcbimpacto = new Ext.data.SimpleStore({
            fields: ['idestado', 'denominacion'],
            data: [
                [1, 'Bajo'],
                [2, 'Medio'],
                [3, 'Alto']
            ]
        });

        this.cbimpacto = new Ext.form.ComboBox({
            fieldLabel: 'Impacto',
            store: _this.stcbimpacto,
            displayField: 'denominacion',
            typeAhead: true,
            value: 1,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idestado',
            valueField: 'idestado',
            width: 50,
            anchor: '95%',
            emptyText: 'Seleccione...',
            readOnly: true,
            listeners: {
                select: function (combo, record, index) {
                    if (accion == 'modificar') {
                        if (_this.valoresiniform.impacto != record.data.idestado) {
                            _this.mod.impacto = true;
                        } else {
                            _this.mod.impacto = false;
                        }
                    }
                }
            }
        });

        this.stcbtipodesviacion = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargartipodesviaciones',

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
                beforeload: function (st, opt) { },
                load: function (store, records, options) {

                }
            }
        });

        this.cbtipodesviacion = new Ext.form.ComboBox({

            typeAhead: true,
            mode: 'remote',
            //allowBlank: false,
            fieldLabel: 'Tipo de desviaci&oacute;n',
            store: _this.stcbtipodesviacion,
            displayField: 'denominacion',
            //allowBlank: true,
            forceSelection: true,
            editable: true,
            triggerAction: 'all',
            loadingText: 'Cargando desviaciones',
            hiddenName: 'idtipo',
            valueField: 'idtipo',
            anchor: '100%',
            emptyText: 'Seleccione...',
            listeners: {
                expand: function (combo) {
                    _this.stcbtipodesviacion.reload();
                },
                select: function (combo, record, index) {
                    if (accion == 'modificar') {
                        if (_this.valoresiniform.tipodesviacion != record.data.idtipo) {
                            _this.mod.tipodesviacion = true;
                        } else {
                            _this.mod.tipodesviacion = false;
                        }
                    }
                },
                'render': function (c) {
                    if (accion == 'modificar') {
                        var tipodesviacion = null;
                        if (c.getValue() != '') {
                            tipodesviacion = c.getValue();
                        }
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.tipodesviacion != tipodesviacion) {
                                _this.mod.tipodesviacion = true;
                            } else {
                                _this.mod.tipodesviacion = false;
                            }
                        }, c);
                    }
                }
            }
        });

        this.stcbasociarincid = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionarincidencias/cargarincidencias',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "campos"
            }, [{
                name: 'denelemento'
            }, {
                name: 'idincidencia'
            },{
                name: 'incidencia'
            }]),
               listeners: {
                    load: function (store, records, options) {
                        if (accion == 'modificar') {

                            iddesviacion = smDesviaciones.getSelections()[0].data.idelemento;
                            Ext.Ajax.request({
                                url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/verificardesviacion',
                                params: {
                                    idelemento: iddesviacion
                                },
                                callback: function (options, success, response) {
                                    responseData = Ext.decode(response.responseText);
                                    //console.log(responseData.datosdesviacion);
                                    store.each(function (record) {

                                            for (var i = 0; i < responseData.datosdesviacion[0].incidenciasasociadas.length; i++) {
                                                if (record.data.idincidencia == responseData.datosdesviacion[0].incidenciasasociadas[i]) {

                                                    record.set('checked', true);
                                                }
                                            }


                                    }, this);

                                    _this.cbasociarincid.doQuery(_this.cbasociarincid.allQuery);
                                    _this.cbasociarincid.setValue(_this.cbasociarincid.getCheckedValue());
                                   _this.valoresiniform.asociadaincidencia = _this.cbasociarincid.getCheckedValue();
                                }
                            });
                        }
                    }
                //     load: function (store, records, options) {
                //         if (accion == 'modificar') {
                //             //console.log("entre aki");
                //             _this.CargarComboAsociarIncAccionModificando(records);
                //         }
                //     }
                 }

        });

        this.cbasociarincid = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            fieldLabel: 'Asociada a la incidencia',
            displayField: 'denelemento',
            valueField: 'idincidencia',
            disabled: false,
            id: 'cbasociarincid',
            store: _this.stcbasociarincid,
            autoCreate: true,
            typeAhead: true,
            hiddenName: 'incidencia',
            triggerAction: 'all',
            editable: false,
            allowBlank: true,
            anchor: '100%',
            mode: 'local',
            emptyText: 'Seleccione...',
            loadingText: 'Cargando incidencias',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (accion == "modificar") {
                        if (_this.valoresiniform.asociadaincidencia != combo.getCheckedValue()) {
                            _this.mod.asociadaincidencia= true;
                        } else {
                            _this.mod.asociadaincidencia = false;
                        }
                    }
                }
            }

        });

        this.taDescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripciondesv',
            anchor: '100%',
            height: 120,
            fieldLabel: 'Descripci&oacute;n',
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
                    if (accion == 'modificar') {
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

        this.pDescripcion = new Ext.Panel({
            title: 'Descripci&oacute;n',
            height: 110,
            layout: 'fit',
            items: [_this.taDescripcion]
        });
        /*this.pPlanes = _this.objCmpPlan.CargarCmpPlan(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null);
         _this.pPlanes.setTitle('Planes');*/
        this.pObjetivos = _this.objCmpObjetivos.CargarCmpObjetivos(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null, arrayidobjetivosReorganizar = []);
        this.pActividades = _this.objCmpActividades.CargarCmpActividades(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null, reorganizar = null);

        _this.pActividades.setTitle('Actividades');
        if (accion == 'modificar') {
            this.idelemento = smDesviaciones.getSelections()[0].data.idelemento;
            /*_this.pPlanes.addListener('activate', _this.SeleccionarPlanAsociado, this);*/
            _this.pObjetivos.addListener('activate', _this.SeleccionarObjtivoAsociada, this);
            _this.pActividades.addListener('activate', _this.SeleccionarActividadAsociada, this);
        }
        if (accion == 'adicionar') {
           this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolIncidenciaDesviacion(0, 'calendario', 0, null, 1);
        } else {
            this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolIncidenciaDesviacion(smDesviaciones.getSelections()[0].data.idelemento, 'desviacion', 1, smDesviaciones.getSelections()[0].data.idautor, 1);
        }
        _this.pclasificadorinvol.setTitle('Rango de publicidad');
        //console.log("objetivos" +_this.pObjetivos);
        this.tpInvolDescrip = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpInvolDescrip',
            border: false,
            height: 250,
            items: [_this.pclasificadorinvol, _this.pDescripcion,_this.pObjetivos,_this.pActividades]
        });

        this.formdesv = new Ext.form.FormPanel({
            width: 670,
            height: 270,
            region: 'center',
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
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [_this.cbimpacto]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [_this.cbtipodesviacion]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [_this.cbasociarincid]
                        }
                    ]
                }
            ],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudDes.enable();
                    } else {
                        _this.btnAceptarCrudDes.disable();
                    }
                    if (accion == 'modificar') {
                        _this.objclasificadorinvol.comprobarCambiosInv();
                        if (_this.tpInvolDescrip.getActiveTab() == _this.pObjetivos) {
                                _this.mod.objetivos = !_this.compararArray(_this.valoresiniform.objetivos, _this.ObtenerObjetivosHaAsociar());
                            }
                        if (_this.tpInvolDescrip.getActiveTab() == _this.pActividades) {
                               _this.mod.actividades = !_this.compararArray(_this.valoresiniform.actividades, _this.ObtenerActividadesHaAsociar());
                            }
                        if (valid && (_this.mod.denominacion || _this.mod.impacto || _this.mod.tipodesviacion ||
                            _this.mod.asociadaincidencia || _this.mod.descripcion ||_this.mod.actividades
                            ||_this.mod.objetivos || _this.objclasificadorinvol.modificarInv))
                            _this.btnAceptarCrudDes.enable();
                        else
                            _this.btnAceptarCrudDes.disable();
                    }
                    //Modificar
                    // if (accion == 'modificar') {
                    //     _this.objclasificadorinvol.comprobarCambiosInv();
                    //     incidencias = _this.cbasociarincid.getValue().split(",");
                    //    // _this.modificarIncidencias = !_this.compararArray(_this.valoresiniform.asociadaincidencia, incidencias);
                    //     if (_this.tpInvolDescrip.getActiveTab() == _this.pObjetivos) {
                    //     //    _this.mod.objetivos = !_this.compararArray(_this.valoresiniform.objetivos, _this.ObtenerObjetivosHaAsociar());
                    //     }
                    //     if (_this.tpInvolDescrip.getActiveTab() == _this.pActividades) {
                    //       //  _this.mod.actividades = !_this.compararArray(_this.valoresiniform.actividades, _this.ObtenerActividadesHaAsociar());
                    //     }
                    //     if (valid && (_this.objclasificadorinvol.modificarInv
                    //
                    //             || _this.mod.impacto
                    //             || _this.mod.tipodesviacion
                    //             || _this.mod.descripcion
                    //             || _this.mod.objetivos
                    //             || _this.modificarIncidencias
                    //             || _this.mod.actividades
                    //         )&& _this.mod.denominacion) {
                    //         _this.btnAceptarCrudDes.enable();
                    //     } else {//desabilito
                    //         _this.btnAceptarCrudDes.disable();
                    //     }
                    // }
                }
            }
        });

        this.pContenedordeTabPanel = new Ext.Panel({
            width: 670,
            height: 285,
            frame: true,
            region: 'south',
            layout: 'fit',
            items: [_this.tpInvolDescrip]
        });

        var titulo = 'Adicionar ';
        var ocultarBotonAplicar = false;
        if (accion == 'modificar') {
            titulo = 'Modificar ';
            ocultarBotonAplicar = true;
        }

        this.btnAceptarCrudDes = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            nextTab: 'tfdenominaciondesv',
            prevTab: (accion == 'modificar') ? 'btnCancelarDesv' : 'btnAplicarDesv',
            tooltip: 'Guardar datos y cerrar ventana',
            id: 'btnAceptarCrudDes',
            handler: function () {
                _this.GestionarDesviacion(false, accion, PostAccionesGestionar, smDesviaciones);
            }
        });

        this.winFormDesviaciones = new Ext.Window({
            modal: true,
            layout: 'border',
            title: titulo + ' desviaci&oacute;n',
            width: 750,
            constrain: true,
            height: 520,
            resizable: false,
            listeners: {
                destroy: function (win) {
                    //modificar
                    _this.mod.denominacion = false;
                    _this.mod.impacto = false;
                    _this.mod.tipodesviacion = false;
                    _this.mod.asociadaincidencia = false;
                    _this.mod.descripcion = false;
                    _this.mod.objetivos = false;
                    _this.mod.actividades = false;
                    _this.modificarIncidencias = false;
                },
                beforeshow: function (win) {
                    _this.tfdenominacion.validate();
                }
            },
            items: [_this.formdesv, _this.pContenedordeTabPanel],
            buttons: [
                {
                    iconCls: 'cancelar', text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    id: 'btnCancelarDesv',
                    nextTab: (accion == 'modificar') ? 'btnAceptarCrudDes' : 'btnAplicarDesv',
                    handler: function () {
                        _this.winFormDesviaciones.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    tooltip: 'Guardar datos y limpiar los campos',
                    hidden: ocultarBotonAplicar,
                    id: 'btnAplicarDesv',
                    nextTab: 'btnAceptarCrudDes',
                    prevTab: 'btnCancelarDesv',
                    handler: function () {
                        _this.GestionarDesviacion(true, accion, PostAccionesGestionar, smDesviaciones);
                    }
                }, _this.btnAceptarCrudDes]
        });
        _this.winFormDesviaciones.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.tfdenominacion.focus(false, 1024);
        if (accion == 'adicionar') {
            _this.winFormDesviaciones.show();
        } else {

            _this.VerificarDesviacion(smDesviaciones);
        }
    };

    this.CrearVentanaPublicarDesv = function (esPublicarTodos, stDesviaciones, smDesviaciones, PostAccionesGestionar) {

        this.tpPublicidadDesviaciones = new Ext.tree.TreePanel({
            id: 'tpPublicidadDesv',
            autoScroll: true,
            split: false,
            useArrows: true,
            collapsible: false,
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: 'root',
                children: [
                    {
                        nodeType: 'async',
                        id: 'nodo2',
                        idgrupo: 'nodo2',
                        text: 'Mis grupos',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo3',
                        idgrupo: 'nodo3',
                        text: 'Usuarios subordinados',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo5',
                        idgrupo: 'nodo5',
                        text: 'Estructuras',
                        leaf: false,
                        checked: false
                    }
                ]
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (_this.tpPublicidadDesviaciones.getChecked().length > 0) {
                        Ext.getCmp('publidesv').enable();
                        if (nodo.id == 'nodo3') {
                            _this.tpPublicidadDesviaciones.getRootNode().findChild('id', 'nodo3').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo2') {
                            _this.tpPublicidadDesviaciones.getRootNode().findChild('id', 'nodo2').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo5') {
                            _this.tpPublicidadDesviaciones.getRootNode().findChild('id', 'nodo5').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                    } else {
                        Ext.getCmp('publidesv').disable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarRangoPublicidad',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            estamodificando: 0,
                            idgrupo: anode.attributes.idgrupo/*,
                             idnom: selected.idnom*/
                        };
                    },
                    'load': function (atreeloader, anode) {
                        /*array_publicidad_ini = _this.tpPublicidadDesviaciones.getChecked();*/
                    }
                }
            })
        });

        this.panelPublicidad = new Ext.Panel({
            title: 'Usuarios',
            id: 'panelPublicidadDesv',
            layout: 'fit',
            autoScroll: true,
            height: 300,
            region: 'center',
            items: [_this.tpPublicidadDesviaciones],
            listeners: {
                activate: function (p) {
                    /*if (modificando && tabarbolact == 0)
                     {
                     tprangopublicidad.getRootNode().findChild('id', 'nodo2').expand();
                     tprangopublicidad.getRootNode().findChild('id', 'nodo3').expand();

                     }*/
                }
            }
        });

        this.tbPanelPublicar = new Ext.TabPanel({
            title: 'Rango de publicidad',
            activeTab: 0,
            border: false,
            items: [_this.panelPublicidad]
        });

        this.btnpublidesv = new Ext.Button({
            id: 'publidesv',
            iconCls: 'aceptar',
            prevTab: 'cancelarPubliDesv',
            nextTab: 'cancelarPubliDesv',
            text: 'Aceptar',
            disabled: true,
            tooltip: 'Guardar los cambios y cerrar ventana',
            handler: function () {
                _this.PublicarTodos(esPublicarTodos, stDesviaciones, smDesviaciones, PostAccionesGestionar)
            }
        });

        this.btncancelarPubliDesv = new Ext.Button({
            iconCls: 'cancelar',
            id: 'cancelarPubliDesv',
            prevTab: 'publidesv',
            nextTab: 'publidesv',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.wPublicarDesviaciones.destroy();
            }
        });

        this.wPublicarDesviaciones = new Ext.Window({
            title: 'Publicar desviaciones',
            width: 345,
            modal: true,
            constrain: true,
            layout: 'fit',
            items: [_this.tbPanelPublicar],
            buttons: [_this.btncancelarPubliDesv, _this.btnpublidesv]
        });
        _this.wPublicarDesviaciones.on('beforeshow', function () {
            _this.btncancelarPubliDesv.focus(true, 700);
        });
        _this.wPublicarDesviaciones.doLayout();
        _this.wPublicarDesviaciones.show();
        _this.btncancelarPubliDesv.focus(false, 1024);
        setTimeout(function(){_this.btncancelarPubliDesv.focus(true); }, 500);
    };

    this.PublicarTodos = function (esPublicarTodos, stDesviaciones, smDesviaciones, PostAccionesGestionar) {
        var array_iddesviaciones = [];
        if (esPublicarTodos) {
            /*if (stDesviaciones.getCount() != 0) {
             for (var i = 0; i < stDesviaciones.getCount(); i++) {
             array_iddesviaciones.push(stDesviaciones.getAt(i).data.idelemento);
             }
             }*/
            var arrayDesviacionesSeleccionados = smDesviaciones.getSelections();
            if (arrayDesviacionesSeleccionados.length > 0) {
                for (var i = 0; i < arrayDesviacionesSeleccionados.length; i++) {
                    array_iddesviaciones.push(arrayDesviacionesSeleccionados[i].data.idelemento);
                }
            }
        } else {
            array_iddesviaciones.push(smDesviaciones.getSelections()[0].data.idelemento);
        }
        var arrayPublicidadUsuarios = getgestionarCheck(_this.tpPublicidadDesviaciones, ['idusuario', 'idgrupo', 'tipo']);
        var mensajeMascara = 'Publicando desviaciones';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/publicartodasdenominaciones',
            params: {
                arrayiddesviaciones: Ext.encode(array_iddesviaciones),
                arrayidusuarios: Ext.encode(arrayPublicidadUsuarios.insertar)/*,
                 publicartodos: publicartodos*/
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                _this.BarraProgreso.hide();
                if (responseData.mensaje == 1) {
                    if (array_iddesviaciones.length == 1) {
                        mensaje = 'La desviación ha sido publicada satisfactoriamente.';
                    } else {
                        mensaje = 'Las desviaciones han sido publicadas satisfactoriamente.';
                    }
                    mostrarMensaje(2, mensaje);
                    PostAccionesGestionar('Publicar', 3);
                    _this.wPublicarDesviaciones.destroy();
                }
            }
        });
    };

    this.DespublicarTodos = function (stDesviaciones, PostAccionesGestionar) {
        var existePublicacion = false;
        var array_iddesviaciones = [];

        if (stDesviaciones.getCount() != 0) {
            for (var i = 0; i < stDesviaciones.getCount(); i++) {
                array_iddesviaciones.push(stDesviaciones.getAt(i).data.idelemento);
                if (stDesviaciones.getAt(i).data.publico == 1) {
                    existePublicacion = true;
                }
            }
        }
        if (existePublicacion) {
            var preg = '';
            if (array_iddesviaciones.length > 1) {
                preg = '¿Está seguro que quiere eliminar las publicaciones seleccionadas?';
            } else '¿Está seguro que quiere eliminar la publicaciónseleccionada?'

            mostrarMensaje(2, preg, function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    var mensajeMascara = 'Eliminando publicaciones';
                    _this.BarraProgreso.show(mensajeMascara);

                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/despublicartodasdenominaciones',
                        params: {
                            arrayiddesviaciones: Ext.encode(array_iddesviaciones)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            _this.BarraProgreso.hide();
                            if (responseData.mensaje == 1) {
                                if (array_iddesviaciones.length == 1) {
                                    var mensaje = 'La publicación ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las publicaciones han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(2, mensaje);
                                PostAccionesGestionar('Despublicar', 3);
                            }
                        }
                    });
                }
            });
        } else {
            mostrarMensaje(2, 'No existen desviaciones publicadas.');
        }
    };

    function MostrarImagenTipoElemento(valor, m, p) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        /*valor = replaceAll(valor, '%', '"');*/
        return '<span><img src="../../../comun/recursos/images/fam/act_ejec.png" >' + ' ' + valor + '</span>';
    }

    this.GestionarDesviacion = function (apl, accion, PostAccionesGestionar, smDesviaciones) {
        var iddesviacion;
        var mensajeMascara = 'Guardando datos de la desviaci&oacuten';
        var accionMensaje = 'adicionada';
        if (accion == 'modificar') {
           //console.log(smDesviaciones.getSelections()[0].data.idelemento);
            iddesviacion = smDesviaciones.getSelections()[0].data.idelemento;
            var mensajeMascara = 'Modificando datos de la desviaci&oacuten';
           // accionMensaje = 'modificada';
        }
        var patron = /[a-zA-Z0-9áéíóúñüÑ]/;

        _this.BarraProgreso.show(mensajeMascara);
        if (_this.formdesv.getForm().isValid()) {
            //console.log(accion)
            if (accion == 'modificar') {
                if (change || _this.mod.denominacion || _this.mod.impacto || _this.mod.tipoInc) {
                    Ext.Ajax.request({
                        url:'/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/adicionardesviaciones',
                        params: {
                            denominacion: _this.tfdenominacion.getValue(),
                            impacto: _this.cbimpacto.getValue(),
                            tipodesviacion: _this.cbtipodesviacion.getValue(),
                            incidenciasasociadas: _this.cbasociarincid.getValue(),
                            descripcion: _this.taDescripcion.getValue(),
                            involucrados: Ext.encode(_this.objclasificadorinvol.ObtenerInvolucrados()),
                            accion: accion,
                            idelemento: iddesviacion,
                            /*arrayidplanes: Ext.encode(_this.ObtenerPlanesHaAsociar()),*/
                            arrayidobjetivos: Ext.encode(_this.ObtenerObjetivosHaAsociar()),
                            arrayidactividades: Ext.encode(_this.ObtenerActividadesHaAsociar())
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, 'La desviacion ha sido modificada satisfactoriamente.');
                                PostAccionesGestionar('Adicionar', 2);
                                _this.winFormDesviaciones.destroy();

                            } else {
                                mostrarMensaje(1, 'Ya existe una desviaci&oacute;n con la denominación especificada.');
                            }
                        }
                    });
                    change = false;
                } else {
                    mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
                }
            }else {
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/adicionardesviaciones',
                    params: {
                        denominacion: _this.tfdenominacion.getValue(),
                        impacto: _this.cbimpacto.getValue(),
                        tipodesviacion: _this.cbtipodesviacion.getValue(),
                        incidenciasasociadas: _this.cbasociarincid.getValue(),
                        descripcion: _this.taDescripcion.getValue(),
                        involucrados: Ext.encode(_this.objclasificadorinvol.ObtenerInvolucrados()),
                        accion: accion,
                        idelemento: iddesviacion,
                        /*arrayidplanes: Ext.encode(_this.ObtenerPlanesHaAsociar()),*/
                        arrayidobjetivos: Ext.encode(_this.ObtenerObjetivosHaAsociar()),
                        arrayidactividades: Ext.encode(_this.ObtenerActividadesHaAsociar())
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, 'La desviaci&oacute;n ha sido ' + accionMensaje + ' satisfactoriamente.');
                            PostAccionesGestionar('Adicionar', 0);
                            if (apl) {
                                _this.formdesv.getForm().reset();
                                _this.objclasificadorinvol.ResetearCampos();
                                _this.tfdenominacion.focus(true, 700);
                                _this.tfdenominacion.validate();
                            } else {
                                _this.winFormDesviaciones.destroy();
                            }
                        } else {
                            mostrarMensaje(1, 'Ya existe una desviaci&oacute;n  con la denominación especificada.');
                        }

                    }
                });
            }

        } else {
            mostrarMensaje(1, "Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
        }
    };

    this.VerificarDesviacion = function (smDesviaciones) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/verificardesviacion',
            params: {
                idelemento: smDesviaciones.getSelections()[0].data.idelemento
            },
            callback: function (options, success, response) {
                var datosdesviacion = [];
                var arraydocumentosafectados = [];
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.winFormDesviaciones.show();
                    datosdesviacion = responseData.datosdesviacion;
                    _this.arrayincidasociadas = datosdesviacion[0].incidenciasasociadas;
                    _this.tfdenominacion.setValue(datosdesviacion[0].denominacion);
                    _this.cbimpacto.setValue(datosdesviacion[0].impacto);
                    _this.cbtipodesviacion.setValue(datosdesviacion[0].tipodesviacion);
                    _this.cbtipodesviacion.setRawValue(datosdesviacion[0].denomtipodesviacion);
                    _this.taDescripcion.setValue(datosdesviacion[0].descripcion);
                    //Var para el Modificar
                    _this.valoresiniform.denominacion = datosdesviacion[0].denominacion;
                    _this.valoresiniform.impacto = datosdesviacion[0].impacto;
                    _this.valoresiniform.tipodesviacion = datosdesviacion[0].tipodesviacion;
                    _this.valoresiniform.descripcion = datosdesviacion[0].descripcion;
                    _this.valoresiniform.asociadaincidencia = datosdesviacion[0].incidenciasasociadas;
                    _this.valoresiniform.objetivos = _this.ObtenerObjtivoAsociada();
                    _this.valoresiniform.actividades = _this.ObtenerActividadAsociada();
                } else {
                    mostrarMensaje(2, 'La desviaci&oacute;n seleccionada ya no se encuentra en la base de datos.');
                }
            }
        });
    };

    this.CargarComboAsociarIncAccionModificando = function (record) {

        _this.stcbasociarincid.each(function (record) {
            for (var i = 0; i < _this.arrayincidasociadas.length; i++) {
                if (record.data.idtipo == _this.arrayincidasociadas[i]) {
                    record.set('checked', true);
                }
            }
        }, this);
        _this.cbasociarincid.doQuery(_this.cbasociarincid.allQuery);
        _this.cbasociarincid.setValue(_this.cbasociarincid.getCheckedValue());
    };

    this.ObtenerObjetivosHaAsociar = function () {
        var array_idobjetivos = [];
        var smObjetivosAsociados = _this.objCmpObjetivos.ObtenerSmObjetivos();
        if (smObjetivosAsociados.hasSelection()) {
            var arrayObjetivosSeleccionados = smObjetivosAsociados.getSelections();
            if (arrayObjetivosSeleccionados.length > 0) {
                for (var i = 0; i < arrayObjetivosSeleccionados.length; i++) {
                    array_idobjetivos[i] = arrayObjetivosSeleccionados[i].data.idelemento;
                }
            }
        }
        return array_idobjetivos;
    };

    this.ObtenerActividadesHaAsociar = function () {
        var array_idactividades = [];
        var smActividadesAsociados = _this.objCmpActividades.ObtenerSmActividades();
        if (smActividadesAsociados.hasSelection()) {
            var arrayActividadesSeleccionados = smActividadesAsociados.getSelections();
            if (arrayActividadesSeleccionados.length > 0) {
                for (var i = 0; i < arrayActividadesSeleccionados.length; i++) {
                    array_idactividades[i] = arrayActividadesSeleccionados[i].data.idelemento;
                }
            }
        }
        return array_idactividades;
    };

    this.SeleccionarActividadAsociada = function () {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardocumentosafectados',
            params: {
                idelemento: _this.idelemento
            },
            callback: function (options, success, response) {
                var datosdesviacion = [];
                var arraydocumentosafectados = [];
                responseData = Ext.decode(response.responseText);
                if (responseData.success == true) {
                    arraydocumentosafectados = responseData.campos;
                    var stActividad = _this.objCmpActividades.ObtenerStActividades();
                    var smActividad = _this.objCmpActividades.ObtenerSmActividades();
                    stActividad.load({
                        callback: function (options, success, response) {
                            var record = [];
                            for (var i = 0; i < arraydocumentosafectados.length; i++) {
                                if (arraydocumentosafectados[i].idtipoelemento == 3) {
                                    for (var j = 0; j < stActividad.getCount(); j++) {
                                        if (stActividad.getAt(j).data.idelemento == arraydocumentosafectados[i].idelemento) {
                                            record.push(stActividad.getAt(j));
                                        }
                                    }
                                }
                            }
                            smActividad.selectRecords(record);
                        }
                    });
                }
                _this.pActividades.suspendEvents();
            }
        });
    };

    this.SeleccionarObjtivoAsociada = function () {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardocumentosafectados',
            params: {
                idelemento: _this.idelemento
            },
            callback: function (options, success, response) {
                var datosdesviacion = [];
                var arraydocumentosafectados = [];
                responseData = Ext.decode(response.responseText);

                if (responseData.success == true) {
                    arraydocumentosafectados = responseData.campos;

                    var stObjetivos = _this.objCmpObjetivos.ObtenerStObjetivos();
                    var smObjetivos = _this.objCmpObjetivos.ObtenerSmObjetivos();

                    stObjetivos.load({
                        callback: function (options, success, response) {
                            var record = [];
                            for (var i = 0; i < arraydocumentosafectados.length; i++) {
                                if (arraydocumentosafectados[i].idtipoelemento == 1) {
                                    for (var j = 0; j < stObjetivos.getCount(); j++) {
                                        if (stObjetivos.getAt(j).data.idelemento == arraydocumentosafectados[i].idelemento) {
                                            record.push(stObjetivos.getAt(j));
                                        }
                                    }
                                }
                            }
                            smObjetivos.selectRecords(record);
                        }
                    });
                }
                _this.pObjetivos.suspendEvents();
            }
        });
    };

    this.ObtenerObjtivoAsociada = function () {
        var record = [];
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardocumentosafectados',
            params: {
                idelemento: _this.idelemento
            },
            callback: function (options, success, response) {
                var arraydocumentosafectados = [];
                responseData = Ext.decode(response.responseText);
                if (responseData.success == true) {
                    arraydocumentosafectados = responseData.campos;
                    for (var i = 0; i < arraydocumentosafectados.length; i++) {
                        if (arraydocumentosafectados[i].idtipoelemento == 1) {
                            record.push(arraydocumentosafectados[i].idelemento);
                        }
                    }
                }
            }
        });
        return record;
    };

    this.ObtenerActividadAsociada = function () {
        var record = [];
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardocumentosafectados',
            params: {
                idelemento: _this.idelemento
            },
            callback: function (options, success, response) {
                var arraydocumentosafectados = [];
                responseData = Ext.decode(response.responseText);
                if (responseData.success == true) {
                    arraydocumentosafectados = responseData.campos;
                    for (var i = 0; i < arraydocumentosafectados.length; i++) {
                        if (arraydocumentosafectados[i].idtipoelemento == 3) {
                            record.push(arraydocumentosafectados[i].idelemento);
                        }
                    }
                }
            }
        });
        return record;
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
                } else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };


};
