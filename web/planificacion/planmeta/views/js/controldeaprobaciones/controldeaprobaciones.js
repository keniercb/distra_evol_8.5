var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controldeaprobaciones', cargarInterfaz);
var sm, winComun, treeclick, teclascalientes;
var gestor, gestorOLD, identidad, valor, hoja, is_leaf, idfiltroentidad, rector = 0;
var puedeadicionar = 0;//variable para adicionar o no segun la configuracion de los permisos
var puedemodificar = 0;//variable para modificar o no segun la configuracion de los permisos
var puedeeliminar = 0;//variable para eliminar o no segun la configuracion de los permisos
var puedeguardar = 0;//variable para guardar o no segun la configuracion de los permisos
var idnidicadorcd;
var start = 0;
var startdoc = 0;
var limit = 20;
var limitdoc = 20;

BarraEstado = function () {
    this.show = function (mensaje) {
        Ext.MessageBox.show({
            msg: mensaje,
            title: 'Por favor espere...',
            width: 300,
            wait: true
        });
    }
    this.hide = function () {
        Ext.MessageBox.hide();
    }
}
var BarraProgreso = new BarraEstado();

Ext.apply(Ext.form.VTypes, {
    rangosipacdefechas: function (val, field) {
        if (val) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            /* if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
             var start = Ext.getCmp(field.startDateField);
             start.setMaxValue(date);
             if(start.getValue()){
             var dateIni = field.parseDate(start.getValue());
             field.setMinValue(dateIni);
             }
             this.dateRangeMax = date;
             start.validate();
             }*/
            if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                if (end.getValue()) {
                    var dateFin = field.parseDate(end.getValue());
                    field.setMaxValue(dateFin);
                }
                this.dateRangeMin = date;
                // end.validate();
            }
            return true;
        }
    },
    rangoFechas: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    },
    validarEspaciosEnBlanco: function (value, field) {
        return(!(/^\s+|\s+$/.test(value)));
    },
    validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
});

function cargarInterfaz() {
    myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    // myMask.show();

    myMaskEliminar = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Por favor espere: Eliminando datos del documento'
    });

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'rector') {
                rector = 1;
            }
        }
        stCbejercicio.reload();
        if (rector == 0) {
            btnmenuadicionar.hide();
            btnActualizarDoc.hide();
            btnModificarCD.hide();
            btnDuplicarCD.hide();
            menuAprobacion.hide();
            btnEliminarCD.hide()
            Ext.getCmp('btnmenuexportar').hide();
        } else {
            Ext.getCmp('btnmenuexportar').show();
        }
    })

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Dd',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnVerdocumentoCD').disabled && Ext.getCmp('ventanaCrud') == undefined) {
                    Ext.getCmp('btnVerdocumentoCD').handler.call(this);
                }
            }
        }
    ]);

    teclascalientes = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnImprimirCD').disabled) {
                    Ext.getCmp('btnImprimirCD').handler.call(this);
                }
            }
        }, {
            key: 'Mm',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnModificarCD').disabled) {
                    Ext.getCmp('btnModificarCD').handler.call(this);
                }
            }
        }, {
            key: 46,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnEliminarCD').disabled) {
                    Ext.getCmp('btnEliminarCD').handler.call(this);
                }
            }
        }, {
            key: 'Qq',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnAprob').disabled) {
                    Ext.getCmp('btnAprob').handler.call(this);
                }
            }
        }, {
            key: 'Ww',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnDesap').disabled) {
                    Ext.getCmp('btnDesap').handler.call(this);
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnLimpiar').disabled) {
                    filtrosControlAprob.clearFilters();
                }
            }
        }, {
            key: 'Zz',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnActualizarDoc').disabled) {
                    Ext.getCmp('btnActualizarDoc').handler.call(this);
                }
            }
        }, {
            key: 'Ii',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnadicionarmanual').disabled) {
                    Ext.getCmp('btnadicionarmanual').handler.call(this);
                }
            }
        }, {
            key: 'Ii',
            alt: true,
            scope: this,
            ctrl: true,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnadicionarautom').disabled) {
                    Ext.getCmp('btnadicionarautom').handler.call(this);
                }
            }
        }, {
            key: 'Dd',
            alt: true,
            ctrl: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnDuplicarCD').disabled && Ext.getCmp('ventanaCrud') == undefined) {
                    map.disable();
                    Ext.getCmp('btnDuplicarCD').handler.call(this);
                }
            }
        }
    ]);

    teclascalientes.enable();

    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                getPermisos();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }
        ])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        tpl: '<tpl for="."><div ext:qtip="{ejercicio}" class="x-combo-list-item">{ejercicio}</div></tpl>',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                getPermisos();
                stGpdocumento.reload({
                    params: {
                        identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                        start: 0,
                        idejercicio: cbEjercicio.getValue()
                    }
                });
            }
        }
    });

    treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'ListarAprobaciones',
        listeners: {
            load: function () {
                if (is_leaf) {
                }
                myMask.hide();

                if (tpEntidades.getRootNode().firstChild != null) {
                    tpEntidades.getRootNode().firstChild.select();
                    stindicadoresCD.load({
                        params: {
                            identidad: tpEntidades.getRootNode().firstChild.attributes.id,
                            desglose: 1
                        }
                    });
                    identidad = tpEntidades.getRootNode().firstChild.attributes.id;
                } else {
                    mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                }
                if (identidad != 0) {
                    stGpdocumento.reload({
                        params: {
                            idejercicio: 1,
                            start: 0
                        }
                    });
                    Ext.getCmp('gpdocumento').enable();
                }
            },
            beforeload: function (tree, node, res) {
                tree.baseParams.valor = Ext.getCmp('idfiltroentidad').getValue();
            }
        }
    });

    cboperacion = new Ext.form.ComboBox({
        fieldLabel: 'Operación',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cboperaciones',
        autoCreate: true,
        typeAhead: true,
        editable: false,
        allowBlank: false,
        anchor: '95%',
        mode: 'local'
    });

    stconcepto = new Ext.data.Store({
        url: 'listarConceptos',
        id: 'stconceptos',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idconcepto'
        }, [{
                name: 'idconceptoespecialidad'

            }, {
                name: 'denominacion'
            }
        ]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });

    cbconceptos = new Ext.form.ComboBox({
        fieldLabel: 'Concepto',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        displayField: 'denominacion',
        id: 'cbconceptos',
        valueField: 'idconceptoespecialidad',
        store: stconcepto,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idconcepto',
        triggerAction: 'all',
        editable: false,
        allowBlank: false,
        anchor: '95%',
        mode: 'remote',
        listeners: {
            expand: function () {
                stconcepto.reload();
            }
        }
    });

    fpconcepto = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpconceptos',
        frame: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {},
        items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: .7,
                        layout: 'form',
                        items: [cbconceptos]
                    }
                ]
            }, {
                layout: 'column',
                items: [
                    {
                        columnWidth: .7,
                        layout: 'form',
                        items: [cboperacion]
                    }
                ]
            }
        ]
    });

    winAdddoc = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        constrain: true,
        width: 400,
        autoHeight: true,
        items: fpconcepto,
        buttons: [{
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function () {
                    fpconcepto.getForm().reset();
                    winAdddoc.hide();
                }
            }, {
                iconCls: 'aceptar',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function () {
                    Adicionarclick();
                }
            }
        ]
    });
    stconcepto.reload({
        params: {}
    });

    tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 300
            });

    tpEntidades.btnBuscar.setText("");
    tpEntidades.btnLimpiar.setText("");
    tpEntidades = tpEntidades.items.items[0];
    tpEntidades.getRootNode().expand();
    tpEntidades.region = 'west';
    tpEntidades.addListener('click', function (n) {

        if (n.text != "Estructuras") {
            Ext.getCmp('gpdocumento').enable();
            Ext.getCmp('controlejecucion_p1').enable();
            if (n.id != 0) {
                is_leaf = n.leaf;
                // if (is_leaf != false) {
                stindicadoresCD.reload({
                    params: {
                        identidad: n.id
                    }
                });
                Gpindicadoresdesglose.collapse();
                stindicadoresdesglose.removeAll();
                identidad = n.id;
                Ext.getCmp('gpdocumento').enable();

                stGpdocumento.reload({
                    params: {
                        identidad: n.id,
                        start: 0,
                        idejercicio: cbEjercicio.getValue()
                    }
                });
                myMask.hide();
                //  }
            }
        } else {
            gridDoc = Ext.getCmp('gpdocumento');
            gridDoc.disable();
            var storeDoc = gridDoc.getStore();
            storeDoc.removeAll();
            //controlejecucion_p1
            gridControl = Ext.getCmp('controlejecucion_p1');
            gridControl.disable();
            var storeCE = GpindicadoresCD.getStore(); //,Gpindicadoresdesglose
            storeCE.removeAll();

            var storeDesglose = Gpindicadoresdesglose.getStore(); //,Gpindicadoresdesglose
            storeDesglose.removeAll();
        }

    });

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaControlAprobaciones',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
        //  text: 'Ayuda'
//        handler: function(opcion) {
//            mostrarAyuda('Control de las aprobaciones');
//        }
    });

    btnEliminarCD = new Ext.Toolbar.Button({
        id: 'btnEliminarCD',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: 'Eliminar documento <b>(DEL)</b>',
        handler: function () {
            mostrarMensaje(2, '¿Está seguro que quiere eliminar el documento de aprobación seleccionado?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    myMaskEliminar.show();
                    Eliminar();
                }
            });
        }
    });
    btnModificarCD = new Ext.Button({
        id: 'btnModificarCD',
        iconCls: 'modificar',
        tooltip: '<u>M</u>odificar documento <b>(Alt+M)</b>',
        disabled: true,
        handler: function () {
            ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('ModificarDocumento', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, sm.getSelected().data.iddocumentoaprobacion, sm.getSelected().data.esmanual, sm.getSelected().data.idaprobacion, cbEjercicio.getValue());
        }
    });
    /* btnImprimirCD = new Ext.Button({
     // text: "Exportar",
     id: 'btnImprimirCD',
     //  icon: perfil.dirImg + 'exportar.png',
     iconCls: 'exportar',
     tooltip: 'Exportar documento <b>(Alt+E)</b>',
     disabled: true,
     handler: function () {
     ImprimirModelo();
     }
     });
     btnImprimirreporte = new Ext.Button({
     id: 'btnImprimirreporte',
     iconCls: 'exportar',
     tooltip: 'Exportar resumen general',
     handler: function () {
     ventanadefinirresponsable2();
     //  var loco=sm.getSelected().data.iddocumentoaprobacion;
     //     var win = window.open('reportenuevo?reporta=' + cbEjercicio.getValue());
     }
     });*/

    btnmenuexportar = new Ext.Toolbar.MenuButton({
        id: 'btnmenuexportar',
        tooltip: 'Exportar documentos.',
        iconCls: 'exportar',
        menu: {
            items: [{
                    text: "Exportar documento",
                    id: 'btnImprimirCD',
                    iconCls: 'exportar',
                    //tooltip: 'Exportar documento <b>(Alt+E)</b>',
                    disabled: true,
                    handler: function () {
                        ImprimirModelo();
                    }
                }, {
                    id: 'btnImprimirreporte',
                    text: "Exportar resumen general",
                    iconCls: 'exportar',
                    //tooltip: 'Exportar resumen general',
                    handler: function () {
                        ventanadefinirresponsable2();
                        //  var loco=sm.getSelected().data.iddocumentoaprobacion;
                        //     var win = window.open('reportenuevo?reporta=' + cbEjercicio.getValue());
                    }
                }]
        }
    });

    btnDuplicarCD = new Ext.Button({
        iconCls: 'duplicar',
        tooltip: 'Duplicar documento <b>(Ctrl+Alt+D)</b>',
        id: 'btnDuplicarCD',
        disabled: true,
        handler: function () {
            ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('Duplicar', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, sm.getSelected().data.iddocumentoaprobacion, sm.getSelected().data.esmanual, sm.getSelected().data.idaprobacion, cbEjercicio.getValue(), cbEjercicio.getRawValue(), map);
        }
    });
    btnVerdocumentoCD = new Ext.Button({
        // text: "Ver Documento",
        id: 'btnVerdocumentoCD',
        iconCls: 'ver',
        tooltip: "Ver documento  <b>(Alt+D)</b>",
        disabled: true,
        handler: function () {
            ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('VerDocumento', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, sm.getSelected().data.iddocumentoaprobacion, sm.getSelected().data.esmanual, null, cbEjercicio.getValue(), null);
        }
    });

    btnCancelarestadoCD = new Ext.Button({
        // text: "Cancelar Estado",
        id: 'btnCancelarestadoCD',
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        hidden: true,
        tooltip: "Cancelar Estado",
        disabled: true,
        handler: function () {
        }
    });

    menuAprobacion = new Ext.Toolbar.MenuButton({
        //text: 'Aprobación',
        tooltip: {
            text: perfil.etiquetas.ttBtnMenuAprobacion,
            title: 'Aprobación'
        },
        // icon: perfil.dirImg + 'area.png',
        iconCls: 'area',
        menu: {
            items: [
                {
                    id: 'btnAprob',
                    iconCls: 'aprobar',
                    text: perfil.etiquetas.textBtnAprobar,
                    //tooltip: perfil.etiquetas.ttBtnAprobar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, '¿Está seguro que quiere aprobar el documento de aprobación seleccionado?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                Aprobar(true);
                            }
                        });
                    }
                }, {
                    id: 'btnDesap',
                    iconCls: 'desaprobar',
                    //tooltip: perfil.etiquetas.ttBtnDesaprobar,
                    text: perfil.etiquetas.textBtnDesaprobar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, '¿Está seguro que quiere desaprobar el documento de aprobación seleccionado?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                Aprobar(false);
                            }
                        });
                    }
                }
            ]
        }
    });
    btnmenuadicionarcontingencia = new Ext.Button({
        id: 'btnadicionarcontingencia',
        iconCls: 'configuraravisos',
        tooltip: 'Adicionar Contingencia',
        disabled: false,
        handler: function () {
            ObjCrudCodigosCtrlDiv.CrearVentanaCrudDefinirContingencia(cbEjercicio.getValue());
        }
    });

    btnmenuadicionar = new Ext.Toolbar.MenuButton({
        id: 'menuadic',
        tooltip: 'Adicionar tipos de documentos.',
        iconCls: 'adicionar',
        menu: {
            items: [{
                    id: 'btnadicionarmanual',
                    iconCls: 'adicionar',
                    // tooltip: perfil.etiquetas.ttBtnAdicionarManualmente,
                    text: perfil.etiquetas.textBtnAdicionarManualmente,
                    disabled: false,
                    handler: function () {
                        ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('Manual', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, null, null, null, cbEjercicio.getValue(), cbEjercicio.getRawValue());
                    }
                }, {
                    id: 'btnadicionarautom',
                    iconCls: 'adicionar',
                    //tooltip: perfil.etiquetas.ttBtnAdicionarAutomaticamente,
                    text: perfil.etiquetas.textBtnAdicionarAutomaticamente,
                    disabled: false,
                    handler: function () {
                        ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('Automatico', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, null, null, null, cbEjercicio.getValue(), cbEjercicio.getRawValue());
                    }
                }
            ]
        }
    });

    btnActualizarDoc = new Ext.Button({
        id: 'btnActualizarDoc',
        iconCls: 'actualizar',
        tooltip: "Actualizar documento",
        disabled: true,
        handler: function () {
            ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('Actualizar', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, sm.getSelected().data.iddocumentoaprobacion, null, sm.getSelected().data.idaprobacion);
        }
    });
    btnLimpiar = new Ext.Toolbar.Button({
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s) <b>(Alt + L)</b>',
        handler: function () {
            filtrosControlAprob.clearFilters();
        }
    });
    // *** Acceso directo alias
    var frm = Ext.form;
    // *** Column Model del Grid
    var cm = new Ext.grid.ColumnModel([{
            id: 'numero',
            header: "Número",
            dataIndex: 'numero',
            tooltip: 'Número',
            width: 80,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Versión",
            dataIndex: 'version',
            width: 100,
            tooltip: 'Versión',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Número de documento",
            dataIndex: 'numeroaprobacion',
            width: 100,
            tooltip: 'Número de documento',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Origen",
            dataIndex: 'esmanual',
            tooltip: 'Origen',
            width: 100,
            renderer: origenManualAutom,
            sortable: true
        }, {
            header: "Año",
            dataIndex: 'ejercicio',
            tooltip: 'Año',
            width: 70,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Fecha",
            dataIndex: 'fecha',
            tooltip: 'Fecha',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Tipo",
            dataIndex: 'tipo',
            tooltip: 'Tipo',
            width: 80,
            hidden: true,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Aprobación",
            dataIndex: 'idaprobacion',
            width: 100,
            tooltip: 'Versión',
            renderer: renderaprobacion,
            sortable: true
        }, {
            header: "Estado",
            dataIndex: 'estado',
            width: 100,
            hidden: true,
            tooltip: 'Estado',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Usuario",
            dataIndex: 'usuario',
            tooltip: 'Usuario',
            width: 100,
            renderer: crearToolTip,
            sortable: true,
        }, {
            header: "Centro de Balance",
            dataIndex: 'cb',
            tooltip: 'Centro de Balance',
            width: 100,
            hidden: true,
            renderer: crearToolTip,
            sortable: true
        }
    ]);

    stGpdocumento = new Ext.data.GroupingStore({
        url: 'listarDocumento',
        sortInfo: {
            field: 'version',
            direction: "ASC"
        },
        groupField: 'numeroaprobacion',
        listeners: {
            beforeload: function (st) {
                st.baseParams.start = startdoc;
                st.baseParams.limit = limitdoc;
                stGpdocumento.baseParams.identidad = identidad;
                stGpdocumento.baseParams.idejercicio = (cbEjercicio.getValue()) ? cbEjercicio.getValue() : 1;
            },
            load: function () {
                var hayauto = false;
                if (stGpdocumento.getCount() == 0) {
                    if (tabaprobacion.getActiveTab().id == 'gpdocumento')
                        if (filtrosControlAprob.getFiltrosActivos() == undefined || filtrosControlAprob.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos a mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                }
                if (stGpdocumento.getCount() > 0) {
                    for (var i = 0; i < stGpdocumento.getCount(); i++) {
                        if (stGpdocumento.getAt(i).data.esmanual == 0) {
                            hayauto = true;
                        }
                    }
                    if (hayauto) {
                        //    Ext.getCmp('btnadicionarautom').disable();
                    } else {
                        Ext.getCmp('btnadicionarautom').enable();
                    }

                    var arrayDoc = [];
                    var arrayMayores = [];
                    for (var i = 0; i < stGpdocumento.getCount(); i++) {
                        var arrayDoc = [];
                        for (var j = 0; j < stGpdocumento.getCount(); j++) {
                            if (stGpdocumento.getAt(i).data.numeroaprobacion == stGpdocumento.getAt(j).data.numeroaprobacion) {
                                arrayDoc.push(stGpdocumento.getAt(j));
                            }
                        }

                        var mayorVersion = arrayDoc[0].data.version;
                        var pos = 0;
                        for (var k = 0; k < arrayDoc.length; k++) {
                            if (arrayDoc[k].data.version > mayorVersion) {
                                mayorVersion = arrayDoc[k].data.version;
                                pos = k;
                            }
                        }

                        var mayorNumero = 0;
                        for (var t = pos; t < arrayDoc.length; t++) {
                            if (mayorVersion == arrayDoc[t].data.version && arrayDoc[t].data.numero > mayorNumero) {
                                pos = t;
                                mayorNumero = arrayDoc[t].data.numero;
                            }
                        }
                        arrayMayores.push(arrayDoc[pos].data.iddocumentoaprobacion);
                    }

                    for (var i = 0; i < arrayMayores.length; i++) {
                        for (var j = 0; j < stGpdocumento.getCount(); j++) {
                            if (stGpdocumento.getAt(j).data.iddocumentoaprobacion == arrayMayores[i]) {
                                for (var t = 0; t < 10; t++) {
                                    Ext.get(Gpdocumento.getView().getCell(j, t)).applyStyles('background-color:#FFCCCC');
                                }
                            }
                        }
                    }
                } else {
                    Ext.getCmp('btnadicionarautom').enable();
                }

                if (sm.getSelections().length == 0) {
                    Ext.getCmp('btnVerdocumentoCD').disable();
                    Ext.getCmp('btnModificarCD').disable();
                    Ext.getCmp('btnDuplicarCD').disable();
                    Ext.getCmp('btnEliminarCD').disable();
                    Ext.getCmp('btnAprob').disable();
                    Ext.getCmp('btnDesap').disable();
                    Ext.getCmp('btnImprimirCD').disable();
                    Ext.getCmp('btnActualizarDoc').disable();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddocumentoaprobacion'
        }, [{
                name: 'iddocumentoaprobacion'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'fecha'
            }, {
                name: 'concepto'
            }, {
                name: 'ejercicio'
            }, {
                name: 'entidad'
            }, {
                name: 'operacion'
            }, {
                name: 'numeroaprobacion'
            }, {
                name: 'usuario'
            }, {
                name: 'numero'
            }, {
                name: 'version'
            }, {
                name: 'esmanual'
            }, {
                name: 'iddocumentoorigen'
            }
        ])
    });

    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (_this, row_index, record) {
                if (sm.getSelected().data.esmanual == 0) {
                    Ext.getCmp('btnActualizarDoc').enable();
                }

                if (sm.getSelected().data.iddocumentoaprobacion) {
                    Ext.getCmp('btnVerdocumentoCD').enable();
                    Ext.getCmp('btnModificarCD').enable();
                    Ext.getCmp('btnDuplicarCD').enable();
                    Ext.getCmp('btnImprimirCD').enable();
                    if (sm.getSelected().data.idaprobacion == 1) {
                        Ext.getCmp('btnAprob').enable();
                        Ext.getCmp('btnDesap').disable();
                    } else {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDesap').enable();
                    }

                    if (sm.getSelected().data.idaprobacion != 4) {
                        Ext.getCmp('btnEliminarCD').enable();
                    } else {
                        Ext.getCmp('btnEliminarCD').disable();
                    }
                }
            },
            rowdeselect: function (_this, row_index, record) {
                Ext.getCmp('btnVerdocumentoCD').disable();
                Ext.getCmp('btnModificarCD').disable();
                Ext.getCmp('btnDuplicarCD').disable();
                Ext.getCmp('btnEliminarCD').disable();
                Ext.getCmp('btnAprob').disable();
                Ext.getCmp('btnDesap').disable();
                Ext.getCmp('btnImprimirCD').disable();
                Ext.getCmp('btnActualizarDoc').disable();
            }
        }
    });

    filtrosControlAprob = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'numero'
            }, {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            }, {
                type: 'numeric',
                dataIndex: 'version'
            }, {
                type: 'date',
                dateFormat: 'Y-m-d',
                dataIndex: 'fecha'
            }, {
                type: 'string',
                dataIndex: 'ejercicio'
            }, {
                type: 'list',
                dataIndex: 'esmanual',
                options: ['Manual', 'Automático']
            }, {
                type: 'string',
                dataIndex: 'numeroaprobacion'

            }
        ]
    });

    /**
     * menu del click derecho del grid
     */
    menuDocAprobacion = new Ext.menu.Menu({
        id: 'menuDocAprobacion',
        listeners: {},
        items: [{
                text: 'Eliminar',
                iconCls: 'eliminar',
                id: 'mdEliminarDocumento',
                tooltip: 'Eliminar documento',
                handler: function () {

                }
            }, {
                text: 'Aprobar',
                iconCls: 'aprobar',
                id: 'mdAprobarDocumento',
                tooltip: 'Aprobar documento',
                handler: function () {

                }
            }, {
                text: 'Desaprobar',
                iconCls: 'desaprobar',
                id: 'mdDesaprobarDocumento',
                tooltip: 'Desaprobar documento',
                handler: function () {

                }
            }, {
                text: 'Actualizar',
                iconCls: 'actualizar',
                id: 'mdActualizarDocumento',
                tooltip: 'Actualiuzar documento',
                handler: function () {

                }
            }, {
                text: 'Duplicar',
                iconCls: 'duplicar',
                id: 'mdDuplicarDocumento',
                tooltip: 'Duplicar documento',
                handler: function () {

                }
            }, {
                text: 'Duplicar',
                iconCls: 'duplicar',
                id: 'mdDuplicarDocumento',
                tooltip: 'Duplicar documento',
                handler: function () {

                }
            }, {
                text: 'Ver',
                iconCls: 'ver',
                id: 'mdVerDocumento',
                tooltip: 'Ver documento',
                handler: function () {

                }
            }]
    });


    // *** Definicion del grid editable
    Gpdocumento = new Ext.grid.GridPanel({
        title: 'Documentos',
        plugins: filtrosControlAprob,
        master_column_id: 'exp',
        width: 850,
        disabled: true,
        loadMask: {
            msg: 'Cargando documentos...'
        },
        height: 600,
        region: 'center',
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Documentos" : "Documento"]})'
        }),
        store: stGpdocumento,
        cm: cm,
        sm: sm,
        md: menuDocAprobacion,
        listeners: {
            rowdblclick: function (_this, row_index, record) {
                ObjCrudCodigosCtrlDiv.CrearVentanaCrudControlAprobaciones('VerDocumento', tpEntidades.getSelectionModel().getSelectedNode().id, stGpdocumento, sm.getSelected().data.iddocumentoaprobacion, sm.getSelected().data.esmanual);
            }
        },
        frame: true,
        id: 'gpdocumento',
        tbar: [btnmenuadicionarcontingencia, btnmenuadicionar, btnModificarCD, btnEliminarCD, menuAprobacion, btnActualizarDoc, btnDuplicarCD,
            btnVerdocumentoCD, btnmenuexportar,
            {xtype: 'tbtext', text: 'Ejercicio:', bodyStyle: 'margin-left:15px'}, cbEjercicio, '->', btnAyuda],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpdocumento,
            items: ['-', btnLimpiar],
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    if (startdoc != 'NaN' && startdoc != 'undefined')
                        startdoc = evento.start;
                    if (limitdoc != 'NaN' && limitdoc != 'undefined')
                        limitdoc = evento.limit;
                }
            }
        }),
        listeners:{
            rowdblclick: function (_this, row_index, record) {
            },
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        }
    });

    ObjCrudCodigosCtrlDiv = new PlanifMaterial.CtrlAprob.crudControlAprobaciones({
        sm: sm
    });

    //////ELEMENTOS PARA EL GRID CONTROL DIVISA
    //selection model para el grid de indicadores de la divisa
    smindicadoresCD = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (sm, row_index, record) {
                idnidicadorcd = record.id;
                stindicadoresdesglose.reload();
            }
        }
    });

    //columnModel para el grid de indicadores de la divisa
    cmindicadoresCD = new Ext.grid.ColumnModel([{
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'Denominaci&oacute;n',
            id: 'exp',
            align: 'left',
            dataIndex: 'denominacion',
            sortable: true
        }, {
            header: 'Importe',
            dataIndex: 'importe',
            align: 'left',
            sortable: true,
            renderer: ValorCeroUp
        }, {
            header: 'Importe Cr&eacute;dito',
            align: 'left',
            dataIndex: 'credito',
            sortable: true,
            renderer: ValorCeroUp,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }, {
            header: 'Importe L&iacute;quido',
            align: 'left',
            dataIndex: 'liquido',
            sortable: true,
            renderer: ValorCeroUp,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }
    ]);
    //store para el grid de indicadores de la divisa
    stindicadoresCD = new Ext.data.Store({
        url: 'listarIndicadoresControlDivisa',
        //autoLoad:true,
        listeners: {
            beforeload: function (st, opc) {
                st.baseParams.desglose = 1;
                st.baseParams.start = start;
                st.baseParams.limit = limit;
                st.baseParams.idejercicio = cbEjercicio.getValue();
                if (!opc.params.identidad)
                    opc.params.identidad = tpEntidades.getSelectionModel()
                            .getSelectedNode().id;
                /*st.baseParams.identidad = tpEntidades.getSelectionModel()
                 .getSelectedNode().id;*/
            },
            load: function (st) {
                tfimporteplan.setValue(st.reader.jsonData.importetotal);
                if (st.getCount() == 0) {
                    //btnadicionardesglosecd.disable();
                    myMask.hide();
                } else {
                    //btnadicionardesglosecd.enable();
                    myMask.hide();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idcontroldivisa'
        }, [{
                name: 'idcontroldivisa'
            }, {
                name: 'idcontroldivisaindicadormodelo'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'estado'
            }, {
                name: 'credito'
            }, {
                name: 'liquido'
            }, {
                name: 'importe'
            }])
    });

    //boton guardar de indicadores de loa divisa
    btnguardarindicadoresCD = new Ext.Button({
        //icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        disabled: true,
        id: 'btnguardarindicadoresCD',
        // text: 'Guardar',
        tooltip: 'Guardar Datos ',
        handler: function () {
            BarraProgreso.show('Guardando..');
            var datos = [];
            for (var i = 0; i < stindicadoresCD.getModifiedRecords().length; i++) {
                datos.push(stindicadoresCD.getModifiedRecords()[i].data);
            }
            Ext.Ajax.request({
                url: 'guardarDatosDesglose',
                params: {
                    datos: Ext.encode(datos),
                    idindicadorcd: idnidicadorcd,
                    upgrid: 1,
                    identidad: tpEntidades.getSelectionModel().getSelectedNode().id
                },
                callback: function (options, success, response) {
                    BarraProgreso.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == 1) {
                        mostrarMensaje(1, "El desglose ha sido guardado satisfactoriamente");
                        stindicadoresCD.reload();
                        stindicadoresCD.rejectChanges();
                        //stindicadoresCD.commit();
                    } else {
                        mostrarMensaje(1, "No se puede crear la aprobación, la entidad seleccionada no presenta indicadores planificados o asociados.", function () {

                        });
                    }
                }
            });
        }
    });

    //boton guardar de desglose de indicadores de CD
    btnadicionardesglosecd = new Ext.Button({
        iconCls: 'adicionar',
        //disabled: true,
        id: 'btnadicionardesglosecd',
        tooltip: 'Adicionar desglose autom&aacute;tico de divisa',
        handler: function () {
            crearVentanaDesgloseAutomatico(1);
        }
    });

    //grid de indicadores de loa divisa
    GpindicadoresCD = new Ext.grid.EditorGridPanel({
        //plugins: filtrosControlAprob,
        master_column_id: 'exp',
        autoExpandColumn: 'exp',
        loadMask: {
            msg: 'Cargando indicadores...'
        },
        region: 'center',
        store: stindicadoresCD,
        cm: cmindicadoresCD,
        sm: smindicadoresCD,
        listeners: {
            rowdblclick: function (_this, row_index, record) {

            },
            afteredit: function (e) {
                if (e.field == 'credito') {
                    if ((e.value + e.record.data.liquido * 1) > e.record.data.importe * 1) {
                        mostrarMensaje(1, 'La sumatoria del desglose no ' +
                                'puede ser mayor que el valor de la planificaci&oacute;n');
                        btnguardarindicadoresCD.disable();
                    } else {
                        //e.record.data.liquido = (e.record.data.importe*1) - e.value;
                        e.record.set('liquido', (e.record.data.importe * 1) - e.value);
                        btnguardarindicadoresCD.enable();
                    }
                }
                if (e.field == 'liquido') {

                    if ((e.record.data.credito * 1 + e.value) > e.record.data.importe * 1) {
                        mostrarMensaje(1, 'La sumatoria del desglose no puede ser mayor que el ' +
                                'valor de la planificaci&oacute;n');
                        btnguardarindicadoresCD.disable();
                    } else {
                        e.record.set('credito', (e.record.data.importe * 1) - e.value);
                        btnguardarindicadoresCD.enable();
                    }
                }
            }
        },
        frame: true,
        id: 'gpindicadorescd',
        tbar: [btnadicionardesglosecd, btnguardarindicadoresCD],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stindicadoresCD,
            //items: ['-', btnLimpiar],
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    if (start != 'NaN' && start != 'undefined')
                        start = evento.start;
                    if (limit != 'NaN' && limit != 'undefined')
                        limit = evento.limit;
                }
            }
        })
    });
    //////FIN ELEMENTOS PARA EL GRID CONTROL DIVISA


    //ELEMENTOS DEL GRID DE DESGLOSE DE EQUIPOS
    //selection model para el grid de desglose equipos
    smindicadoresdesglose = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (sm, row_index, record) {

            }
        }
    });

    //columnModel para el grid de desglose equipos
    cmindicadoresdesglose = new Ext.grid.ColumnModel([{
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'No. Pieza',
            dataIndex: 'pieza',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'Denominaci&oacute;n',
            id: 'exp',
            align: 'left',
            dataIndex: 'denominacion',
            sortable: true
        }, {
            header: 'V&iacute;a Adquisici&oacute;n',
            dataIndex: 'via',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'UM',
            dataIndex: 'um',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'Precio',
            dataIndex: 'precio',
            sortable: true,
            align: 'left',
            // width: 250
        }, {
            header: 'Cant',
            dataIndex: 'cantidad',
            align: 'left',
            sortable: true,
            renderer: ValorCero
        }, {
            header: 'Importe',
            dataIndex: 'importe',
            align: 'left',
            sortable: true,
            renderer: ValorCero
        }, {
            header: 'Cant Cr&eacute;dito',
            align: 'left',
            dataIndex: 'credito',
            sortable: true,
            renderer: ValorCero,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }, {
            header: 'Importe Cr&eacute;dito',
            dataIndex: 'importecredito',
            align: 'left',
            sortable: true,
            renderer: ValorCero
        }, {
            header: 'Cant L&iacute;quido',
            align: 'left',
            dataIndex: 'liquido',
            sortable: true,
            renderer: ValorCero,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }, {
            header: 'Importe L&iacute;quido',
            dataIndex: 'importeliquido',
            align: 'left',
            sortable: true,
            renderer: ValorCero
        }
    ]);
    //store para el grid de desglose equipos
    stindicadoresdesglose = new Ext.data.Store({
        url: 'listarIndicadoresDesglose',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idindicadorcd = idnidicadorcd;
                st.baseParams.desglose = 1;
                st.baseParams.idejercicio = cbEjercicio.getValue();
                st.baseParams.identidad = tpEntidades.getSelectionModel()
                        .getSelectedNode().id;
            },
            load: function (st) {
                tfimportecredito.setValue(st.reader.jsonData.sumas[0].importecreditototal);
                tfimporteliquido.setValue(st.reader.jsonData.sumas[0].importeliquidototal);
                if (st.getCount() == 0) {
                    btnadicionarindicadoresdesglose.disable();
                    Gpindicadoresdesglose.collapse();
                    myMask.hide();
                } else {
                    btnadicionarindicadoresdesglose.enable();
                    Gpindicadoresdesglose.expand();
                    myMask.hide();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'//,
                    // id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'idcontroldivisaindicadormodelo'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'importecredito'
            }, {
                name: 'importeliquido'
            }, {
                name: 'credito'
            }, {
                name: 'pieza'
            }, {
                name: 'via'
            }, {
                name: 'um'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            }, {
                name: 'importe'
            }, {
                name: 'liquido'
            }])
    });

    //boton guardar de desglose equipos automatico
    btnadicionarindicadoresdesglose = new Ext.Button({
        //icon: perfil.dirImg + 'guardar.png',
        iconCls: 'adicionar',
        disabled: true,
        id: 'btnadicionarindicadoresdesglose',
        // text: 'Guardar',
        tooltip: 'Adicionar desglose autom&aacute;tico de equipos',
        handler: function () {
            crearVentanaDesgloseAutomatico(2);
        }
    });

    //boton guardar de desglose equipos
    btnguardarindicadoresdesglose = new Ext.Button({
        //icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        disabled: true,
        id: 'btnguardarindicadoresCD',
        // text: 'Guardar',
        tooltip: 'Guardar Datos ',
        handler: function () {
            BarraProgreso.show('Guardando..');
            var datos = [];
            for (var i = 0; i < stindicadoresdesglose.getModifiedRecords().length; i++) {
                datos.push(stindicadoresdesglose.getModifiedRecords()[i].data);
            }

            Ext.Ajax.request({
                url: 'guardarDatosDesglose',
                params: {
                    datos: Ext.encode(datos),
                    idindicadorcd: idnidicadorcd
                },
                callback: function (options, success, response) {
                    BarraProgreso.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == 1) {
                        mostrarMensaje(1, "El desglose ha sido guardado satisfactoriamente");
                        stindicadoresdesglose.reload();
                        stindicadoresdesglose.rejectChanges();
                        //stindicadoresdesglose.commit();
                    } else {
                        mostrarMensaje(1, "No se puede crear la aprobación, la entidad seleccionada no presenta indicadores planificados o asociados.");
                    }
                }
            });
        }
    });

    tfimporteplan = new Ext.form.TextField({
        id: 'tfimporteplan',
        width: 100,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 0,
        // text:stGpGestCalc.getCount()
    });

    tfimporteliquido = new Ext.form.TextField({
        id: 'tfimporteliquido',
        width: 100,
        align: 'right',
        readOnly: true,
        enableKeyEvents: false,
        value: 0,
        // text:stGpGestCalc.getCount()
    });

    tfimportecredito = new Ext.form.TextField({
        id: 'tfimportecredito',
        width: 100,
        align: 'right',
        readOnly: true,
        enableKeyEvents: false,
        value: 0,
        // text:stGpGestCalc.getCount()
    });

    //grid de desglose equipos
    Gpindicadoresdesglose = new Ext.grid.EditorGridPanel({
        //plugins: filtrosControlAprob,
        title: 'Desglose de Equipos',
        master_column_id: 'exp',
        autoExpandColumn: 'exp',
        loadMask: {
            msg: 'Cargando indicadores...'
        },
        collapsible: true,
        collapsed: true,
        height: 500,
        region: 'south',
        store: stindicadoresdesglose,
        cm: cmindicadoresdesglose,
        sm: smindicadoresdesglose,
        listeners: {
            rowdblclick: function (_this, row_index, record) {

            },
            afteredit: function (e) {
                if (e.field == 'credito') {
                    if ((e.value + e.record.data.liquido * 1) > e.record.data.cantidad * 1) {
                        mostrarMensaje(1, 'La sumatoria del desglose de los equipos, no ' + 'puede ser mayor que el valor de la planificaci&oacute;n');
                        btnguardarindicadoresdesglose.disable();
                    } else {
                        btnguardarindicadoresdesglose.enable();
                    }
                }
                if (e.field == 'liquido') {

                    if ((e.record.data.credito * 1 + e.value) > e.record.data.cantidad * 1) {
                        mostrarMensaje(1, 'La sumatoria del desglose de los equipos, no puede ser mayor que el ' + 'valor de la planificaci&oacute;n');
                        btnguardarindicadoresdesglose.disable();
                    } else {
                        btnguardarindicadoresdesglose.enable();
                    }
                }
            }

        },
        frame: true,
        id: 'gpindicadoresdesglose',
        tbar: [btnadicionarindicadoresdesglose, btnguardarindicadoresdesglose],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stindicadoresdesglose,
            items: ['  ', '  ', 'Imp. total plan: ', tfimporteplan, '  ', 'Imp. total cr&eacute;dito: ', tfimportecredito,
                '  ', 'Imp. total l&iacutequido: ', tfimporteliquido],
            displayInfo: true
        })
    });
    //FIN ELEMENTOS DEL GRID DE DESGLOSE DE EQUIPOS

    //panel general que contiene los grids de indicadores de CD y desglose de equipos
    panelGeneralAprobacion = new Ext.Panel({
        id: 'controlejecucion_p1',
        title: 'Desglose Crédito - Líquido',
        layout: 'border',
        region: 'center',
        bodyBorder: false,
        items: [GpindicadoresCD, Gpindicadoresdesglose]
    });

    //TabPanel que contiene el grid de documentos y los paneles para el desglose liquido y credito
    tabaprobacion = new Ext.TabPanel({
        activeTab: 0,
        id: 'tabaprobacion',
        enableTabScroll: true,
        region: 'center',
        items: [Gpdocumento, panelGeneralAprobacion]
    });

    pAux = new Ext.Panel({
        layout: 'border',
        width: 400,
        height: 500,
        items: [tpEntidades, tabaprobacion]//,
                //tbar: ['Ejercicio: ', cbEjercicio, '->', btnAyuda]
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: pAux
    });
} //fin de la funcion cargarInterfaz

// Funcion para adicionar un record


//Para poner los campos vacÃ­os en cero
function getPermisos() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData[0]) {
                if (responseData[0].insertar == 0) {
                    Ext.getCmp('menuadic').hide();
                    Ext.getCmp('btnDuplicarCD').hide();
                    puedeadicionar = 0;
                } else {
                    if (rector == 1) {
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('btnEliminarCD').show();
                        puedeadicionar = 1;
                    }
                }
                if (responseData[0].eliminar == 0) {
                    Ext.getCmp('btnEliminarCD').hide();
                    puedeeliminar = 0;
                } else {
                    if (rector == 1) {
                        Ext.getCmp('btnEliminarCD').show();
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('btnEliminarCD').show();
                        puedeeliminar = 1;
                    }
                }
                if (responseData[0].modificar == 0) {
                    Ext.getCmp('btnModificarCD').hide();
                    puedemodificar = 0;
                } else {
                    if (rector == 1) {
                        Ext.getCmp('btnModificarCD').show();
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('menuadic').show();
                        Ext.getCmp('btnDuplicarCD').show();
                        Ext.getCmp('btnEliminarCD').show();
                        puedemodificar = 1;
                    }
                }
            }
        }
    });
}

function Adicionarclick() {
    myMask.show();
    Ext.Ajax.request({
        url: 'Adicionar',
        params: {
            idoperacion: cboperacion.getValue(),
            idconcepto: cbconceptos.getValue(),
            identidad: tpEntidades.getSelectionModel()
                    .getSelectedNode().id
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == 1)
                mostrarMensaje(1, "El documento ha sido adicionado con éxito", function () {
                    stGpdocumento.reload({
                        params: {
                            identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                            start: 0
                        }
                    });

                });
            else
                mostrarMensaje(1, "La entidad no tiene indicadores planificados asociados a indicadores de la divisa");
        }
    });
    myMask.hide();
    winAdddoc.hide();
}

function accionAdicionar() {
    winAdddoc.setTitle('Adicionar documento');
    fpconcepto.getForm().reset();
    winAdddoc.show('btnModificarCD');
}

function actualizararbol(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.root.reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}

function Eliminar() {
    Ext.Ajax.request({
        url: 'EliminarDocumento',
        params: {
            iddoc: sm.getSelected().data.iddocumentoaprobacion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == 1)
                myMaskEliminar.hide();
            mostrarMensaje(1, "El documento de aprobación ha sido eliminado satisfactoriamente.", function () {
                stGpdocumento.reload({
                    params: {
                        identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                        start: 0,
                        idejercicio: cbEjercicio.getValue()
                    }
                });
            });
        }
    });
}

function Aprobar(aprobar) {
    if (aprobar) {
        myMask.show();
        Ext.Ajax.request({
            url: 'AprobarDesaprobar',
            params: {
                iddoc: sm.getSelected().data.iddocumentoaprobacion,
                aprobacion: 4
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == 1)
                    mostrarMensaje(1, "El documento de aprobación ha sido aprobado satisfactoriamente.", function () {
                        stGpdocumento.reload({
                            params: {
                                identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                                start: 0,
                                idejercicio: cbEjercicio.getValue()
                            }
                        });
                    });
            }
        });
        myMask.hide();
    } else {
        myMask.show();
        Ext.Ajax.request({
            url: 'AprobarDesaprobar',
            params: {
                iddoc: sm.getSelected().data.iddocumentoaprobacion,
                aprobacion: 1
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == 1)
                    mostrarMensaje(1, "El documento de aprobación ha sido desaprobado satisfactoriamente.", function () {
                        stGpdocumento.reload({
                            params: {
                                identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                                start: 0,
                                idejercicio: cbEjercicio.getValue()
                            }
                        });
                    });
            }
        });
        myMask.hide();
    }
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == "" || value == null)
        return '-';
    else
        return value;
}

function renderaprobacion(value) {
    if (value == 4)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else if (value == 3)
        return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}

function origenManualAutom(value) {
    if (value == 1) {
        return 'Manual';
    } else
        return 'Automático';
}

function ImprimirModelo(id) {
    ventanadefinirresponsable();
    /* var iframe = document.createElement("iframe");
     iframe.src = document.location.protocol + '//' + document.location.host + '//planificacion/planmeta/index.php/controldeaprobaciones/reportes?reportes=' + sm.getSelected().data.iddocumentoaprobacion;
     iframe.style.display = 'none';
     document.body.appendChild(iframe);*/
}

function ventanadefinirresponsable() {
    btnAceptarjefe = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: false,
        id: 'btnAceptarFormAddAutomat',
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function () {
            ventanadefinircontingencia.destroy();
            var responsable = new Array();
            responsable[0] = tfnombre.getValue();
            responsable[1] = tfcargo.getValue();
            responsable[2] = tfgrado.getValue();
            var iddocumentoaprobacion = sm.getSelected().data.iddocumentoaprobacion;
            var params = {
                exportTo: ['EXCEL', 'WORD'],
                codigo: 1,
                idejercicio: cbEjercicio.getValue(),
                iddocumentoaprobacion: iddocumentoaprobacion,
                responsable: responsable
            };
            obtenerReporte(params);
            /*// var win = window.open('reportes?reporta=' + loco+"&responsable="+responsable
             +"&identidad="+tpEntidades.getSelectionModel().getSelectedNode().id);*/
        }
    });
    btnCancelarjefe = new Ext.Button({
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        id: ' btnCancelarFormAddAutomat',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            if (map != undefined)
                map.enable();
            ventanadefinircontingencia.destroy();
        }
    });

    tfnombre = new Ext.form.TextField({
        id: 'nombre', fieldLabel: 'Nombre y Apellidos',
        width: 180,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'LEOPOLDO CINTRA FRIAS',
        // text:stGpGestCalc.getCount()
    });
    tfcargo = new Ext.form.TextField({
        id: 'cargo', fieldLabel: 'Cargo',
        width: 150,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'MINISTRO DE LAS FAR',
        // text:stGpGestCalc.getCount()
    });
    tfgrado = new Ext.form.TextField({
        id: 'grado', fieldLabel: 'Grado',
        width: 200,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'GENERAL DE CUERPO DE EJÉRCITO',
        // text:stGpGestCalc.getCount()
    });

    Formdefinirjefe = new Ext.FormPanel({
        labelAlign: 'top',
        width: 900,
        height: 100,
        frame: true,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.32,
                        layout: 'form',
                        items: [tfnombre]
                    }, {
                        columnWidth: 0.30,
                        layout: 'form',
                        items: [tfcargo]
                    }, {
                        columnWidth: 0.38,
                        layout: 'form',
                        items: [tfgrado]
                    }]
            }]
    });

    ventanadefinircontingencia = new Ext.Window({
        title: 'Definir responsable ',
        id: 'ventanaAddAutomatico',
        layout: 'fit',
        constrain: true, width: 610,
        frame: true,
        modal: true,
        items: [Formdefinirjefe],
        buttons: [btnCancelarjefe, btnAceptarjefe]
    });
    ventanadefinircontingencia.show()
}

function ventanadefinirresponsable2() {
    fini = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        id: 'finiact',
        endDateField: 'ffinact',
        //allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        format: 'd/m/Y',
        maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
        invalidText: 'Formato: dd/mm/aaaa.',
        anchor: '95%',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function (df, date) {
                this.setValue(date);
                ffin.setMinValue(date);
                if (date > ffin.getValue()) {
                    ffin.setValue(date);
                }//Modificar
            }
        }
    });
    //campo para la fecha de fin de la actividad
    ffin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        id: 'ffinact',
        startDateField: 'finiact',
        minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
        format: 'd/m/Y',
        //allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa.',
        anchor: '95%',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function (df, date) {
                this.setValue(date);
                fini.setMaxValue(date);
                //Modificar
            }
        }
    });

    btnAceptarjefe = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: false,
        id: 'btnAceptarFormAddAutomat',
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function () {
            ventanadefinircontingencia.destroy();
            var responsable = new Array();
            responsable[0] = tfnombre.getValue();
            responsable[1] = tfcargo.getValue();
            responsable[2] = tfgrado.getValue();
            var fechainicio = (fini.getValue()) ? fini.getValue().format('d/m/Y') : false;
            var fechafin = (ffin.getValue()) ? ffin.getValue().format('d/m/Y') : false;
            var params = {
                exportTo: ['EXCEL', 'WORD'],
                idejercicio: cbEjercicio.getValue(),
                codigo: 2,
                fechainicio: fechainicio,
                fechafin: fechafin,
                responsable: responsable
            };
            obtenerReporte(params);
            /* var win = window.open('reportenuevo?reporta=' + cbEjercicio.getValue()+"&responsable="+responsable +
             '&fechainicio='+fechainicio+
             '&fechafin='+fechafin+'&identidad='+tpEntidades.getSelectionModel()
             .getSelectedNode().id );*/
        }
    });
    btnCancelarjefe = new Ext.Button({
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        id: ' btnCancelarFormAddAutomat',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            ventanadefinircontingencia.destroy();
        }
    });

    tfnombre = new Ext.form.TextField({
        id: 'nombre', fieldLabel: 'Nombre y Apellidos',
        width: 180,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'LEOPOLDO CINTRA FRIAS',
        // text:stGpGestCalc.getCount()
    });
    tfcargo = new Ext.form.TextField({
        id: 'cargo', fieldLabel: 'Cargo',
        width: 150,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'MINISTRO DE LAS FAR',
        // text:stGpGestCalc.getCount()
    });
    tfgrado = new Ext.form.TextField({
        id: 'grado', fieldLabel: 'Grado',
        width: 200,
        align: 'right',
        disabled: false,
        enableKeyEvents: false,
        value: 'GENERAL DE CUERPO DE EJÉRCITO',
        // text:stGpGestCalc.getCount()
    });

    Formdefinirjefe = new Ext.FormPanel({
        labelAlign: 'top',
        width: 900,
        height: 100,
        frame: true,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.32,
                        layout: 'form',
                        items: [tfnombre]
                    }, {
                        columnWidth: 0.30,
                        layout: 'form',
                        items: [tfcargo]
                    }, {
                        columnWidth: 0.38,
                        layout: 'form',
                        items: [tfgrado]
                    }]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [fini]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [ffin]
                    }]
            }]
    });

    ventanadefinircontingencia = new Ext.Window({
        title: 'Definir responsable ',
        id: 'ventanaAddAutomatico',
        layout: 'fit',
        constrain: true,
        width: 610,
        height: 200,
        frame: true,
        modal: true,
        items: [Formdefinirjefe],
        buttons: [btnCancelarjefe, btnAceptarjefe]
    });
    ventanadefinircontingencia.show()
}

function crearVentanaDesgloseAutomatico(tipo) {
    nfvalor = new Ext.form.NumberField({
        allowNegative: true,
        maxValue: 100,
        allowBlank: false,
        fieldLabel: 'Ingrese el porciento (%) que desea asignar al cr&eacute;dito'
    });
    Formdesgloseauto = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [nfvalor]
                    }]
            }]
    });

    btnAceptardesgloseauto = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        id: 'btnAceptardesgloseauto',
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function () {
            if (Formdesgloseauto.getForm().isValid()) {
                BarraProgreso.show('Guardando..');
                ventanadesgloseauto.destroy();
                var datos = [];
                if (tipo == 2) {
                    for (var i = 0; i < stindicadoresdesglose.getRange().length; i++) {
                        datos.push(stindicadoresdesglose.getRange()[i].data);
                    }
                } else {
                    for (var i = 0; i < stindicadoresCD.getRange().length; i++) {
                        datos.push(stindicadoresCD.getRange()[i].data);
                    }
                }

                Ext.Ajax.request({
                    url: 'guardarDatosDesglose',
                    params: {
                        datos: Ext.encode(datos),
                        idindicadorcd: idnidicadorcd,
                        automatico: 1,
                        tipo: tipo,
                        identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
                        porciento: nfvalor.getValue()
                    },
                    callback: function (options, success, response) {
                        BarraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData == 1) {
                            mostrarMensaje(1, "El desglose ha sido guardado satisfactoriamente");
                            if (tipo == 2)
                                stindicadoresdesglose.reload();
                            else
                                stindicadoresCD.reload();
                        } else {
                            mostrarMensaje(1, "No se puede crear la aprobación, la entidad seleccionada no presenta indicadores planificados o asociados.", function () {

                            });
                        }
                    }
                });
            }
        }
    });
    btnCancelardesgloseauto = new Ext.Button({
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        id: ' btnCancelardesgloseauto',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            ventanadesgloseauto.destroy();
        }
    });

    ventanadesgloseauto = new Ext.Window({
        title: 'Desglose autom&aacute;tico de Cr&eacute;dito y L&iacute;quido ',
        id: 'ventanadesgloseauto',
        layout: 'fit',
        closeAction: 'destroy',
        constrain: true,
        width: 350,
        height: 135,
        frame: true,
        modal: true,
        items: [Formdesgloseauto],
        buttons: [btnCancelardesgloseauto, btnAceptardesgloseauto]
    });
    ventanadesgloseauto.show()
}

function ValorCero(v, m, record, ri, ci) {
    if (ci == 3) {
        return record.data.importe * 1 - record.data.liquido * 1;
    }
    if (ci == 4) {
        return record.data.importe * 1 - record.data.credito * 1;
    }
    if (v) {
        return v;
    }
    return 0;
}

obtenerReporte = function (params) {
    var obj = {
        view: this,
        path: '/planificacion/planmeta/index.php/controldeaprobaciones/obtenerReporte',
        baseParams: {
            exportFormat: params.exportTo,
            iddocumentoaprobacion: params.iddocumentoaprobacion,
            idejercicio: params.idejercicio,
            codigo: params.codigo,
            fechainicio: params.fechainicio,
            fechafin: params.fechafin,
            identidad: tpEntidades.getSelectionModel().getSelectedNode().id,
            responsable: params.responsable
        },
        fnFailure: function () {
            mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
        }
    };
    reportes.create(obj);
};

function ValorCeroUp(v, m, record, ri, ci) {
    /*if(ci == 3){
     return record.data.importe*1 - record.data.liquido*1;
     }
     if(ci == 4){
     return record.data.importe*1 - record.data.credito*1;
     }*/
    if (v) {
        return v;
    }
    return 0;
}