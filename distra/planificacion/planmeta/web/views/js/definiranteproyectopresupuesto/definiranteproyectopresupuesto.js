var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('definiranteproyectopresupuesto', cargarInterfaz);
var sm, winComun, treeclick, btnmenuaprobacion;
var contador_filter = 0;
var doc_selected = null, identidadselect, denomentidadselect, nodeSelect;
var rector = 0;
var filtrar = false;
var myViewI3, wReportesPartidas;
var entidadEcon = 0;
var elimina = true;
var tipoReporte;
var partidasDatos = [];
var gestor, gestorOLD, presupuesto_hot_key_i3, presupuesto_hot_key_i1, identidad, valor, btnrecargar, btnrecargar, hoja, is_leaf, idfiltroentidad, idconftiponomesp, actualizarArbol;

function cargarInterfaz() {
    Interfaz2();
}
function Interfaz2() {
    // ****************** filtros por columna del grid 2
    // ******************************
    contador_filter = 0;
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Planificacion.maskElement(Ext.getBody());
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    presupuesto_hot_key_i3 = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Cc',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!btnCancelar.disabled) {
                    btnCancelar.handler.call();
                }
            }
        },
        {
            key: 'Gg',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!Ext.getCmp('btnguardardoc').disabled) {
                    Ext.getCmp('btnguardardoc').handler.call();
                }
            }
        },
        {
            key: 'Ee',
            alt: true,
            stopEvent: true,
            fn: function () {
                anteproyecto = gridDocumento.getSelectionModel().getSelected();
                if (myViewI3 == undefined || !myViewI3.isVisible()) {
                    wReportesPartidas.show();
                } else if ((wReportesPartidas == undefined || !wReportesPartidas.isVisible()) && myViewI3.isVisible()) {
                    exportar(anteproyecto);
                }
            }
        }
    ]);
    //presupuesto_hot_key_i3.disable();
    presupuesto_hot_key_i2 = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 46,
            stopEvent: true,
            fn: function () {
                if (!btnEliminar.disabled) {
                    btnEliminar.handler.call();
                }
            }
        },
        {
            key: 'Ll',
            stopEvent: true,
            fn: function () {
                if (!btnLimpiarG2.disabled) {
                    btnLimpiarG2.handler.call();
                }
            }
        }, {
            key: 'Ll',
            stopEvent: true,
            ctrl: true,
            alt: true,
            fn: function () {
                if (!btnLimpiarNae.disabled) {
                    filtrosnae.clearFilters();
                }
            }
        },
        {
            key: 'Dd',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!btnVerdocumento.disabled) {
                    btnVerdocumento.handler.call();
                }
            }
        },
        {
            key: 'Qq',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!Ext.getCmp('btnAprobardocumento').disabled) {
                    Ext.getCmp('btnAprobardocumento').handler
                        .call();
                }
            }
        },
        {
            key: 'Ww',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!Ext.getCmp('btnDesaprobardocumento').disabled) {
                    Ext.getCmp('btnDesaprobardocumento').handler
                        .call();
                }
            }
        }
    ]);
    filtrosnae = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'boolean',
                dataIndex: 'asociado'
            }
        ]
    });
    presupuesto_hot_key_i2.enable();
    filtrosgestionardocumento = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'numeric',
                dataIndex: 'numero'
            },
            {
                type: 'numeric',
                dataIndex: 'version'
            },
            {
                type: 'listado',
                dataIndex: 'idejercicio',
                idcombo: 'cbFiltroejercicio',
                urlcb: 'cargarfiltroejercicio',
                idstore: 'idejercicio',
                valueFieldcb: 'idejercicio',
                displayFieldcb: 'ejercicio'
            },
            {
                type: 'date',
                dataIndex: 'fecha'
            },
            {
                type: 'listado',
                dataIndex: 'idtipoanteproyecto',
                idcombo: 'cbFiltrotipoanteproyecto',
                urlcb: 'cargarfiltrotipoanteproyecto',
                idstore: 'idtipoanteproyecto',
                valueFieldcb: 'idtipoanteproyecto',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'listado',
                dataIndex: 'idnae',
                idcombo: 'cbFiltroenae',
                urlcb: 'cargarfiltronae',
                idstore: 'idnae',
                valueFieldcb: 'idnae',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'listado',
                dataIndex: 'idconcepto',
                idcombo: 'cbFiltroconcepto',
                urlcb: 'cargarfiltroconcepto',
                idstore: 'idconcepto',
                valueFieldcb: 'idconcepto',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbFiltrousuario',
                urlcb: 'cargarfiltrousuario',
                idstore: 'idusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            },
            {
                type: 'listado',
                dataIndex: 'denentidad',
                idcombo: 'cbFiltroentidad',
                urlcb: 'cargarfiltroentidad',
                idstore: 'idestructura',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion'
            }
        ]
    });

    Ext.getCmp('cbFiltroenae').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });
    Ext.getCmp('cbFiltroejercicio').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });
    Ext.getCmp('cbFiltrotipoanteproyecto').store.addListener('load',
        function () {
            contador_filter++;
            if (contador_filter == 7) {
                Planificacion.unmaskElement(Ext.getBody());
            }
        });
    Ext.getCmp('cbFiltroconcepto').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });

    Ext.getCmp('cbFiltrousuario').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });

    Ext.getCmp('cbFiltroentidad').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });
    btnEliminar = new Ext.Button({
        // text: perfil.etiquetas.textBtnEliminarDocumentos,
        id: 'btnElimanar',
        //icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.ttBtnEliminar,
        disabled: true,
        handler: function () {
            Eliminardoc();

        }
    });
    btnVerdocumento = new Ext.Button({
        // text: perfil.etiquetas.textBtnVerDoc,
        id: 'btnVerdocumento',
        // icon: perfil.dirImg + 'ver.png',
        iconCls: 'ver',
        tooltip: perfil.etiquetas.ttBtnVerDoc,
        disabled: true,
        handler: function () {
            anteproyecto = gridDocumento.getSelectionModel().getSelected();
            Ver_documento(anteproyecto);
        }
    });
    btnmenuaprobacion = new Ext.Toolbar.MenuButton({
        id: 'menuaprob',
        // text: perfil.etiquetas.textBtnMenuAprobacion,
        tooltip: perfil.etiquetas.ttBtnMenuAprobacion,
        // icon: perfil.dirImg + 'area.png',
        iconCls: 'area',
        menu: {
            items: [
                {
                    id: 'btnAprobardocumento',
                    itemCls: 'x-menu-item icondistra-aprobar',
                    iconCls: 'imagen-none',
                    //icon: perfil.dirImg + 'aprobar.png',
                    // iconCls: 'aprobar',
                    tooltip: perfil.etiquetas.ttBtnAprobar,
                    text: perfil.etiquetas.textBtnAprobar,
                    disabled: true,
                    handler: function () {
                        anteproyecto = gridDocumento.getSelectionModel()
                            .getSelections();
                        if (anteproyecto.length == 1)
                            mostrarMensaje(2, '¿Está seguro que quiere aprobar el documento seleccionado?', funcion);
                        else
                            mostrarMensaje(2, '¿Está seguro que quiere aprobar los documentos seleccionados?', funcion);
                        function funcion(btn) {
                            if (btn == 'ok') {

                                array = [];
                                for (i in anteproyecto) {
                                    array.push(anteproyecto[i].id);
                                }
                                Ext.Ajax.request({
                                    url: 'aprobardesabropardoc',
                                    params: {
                                        aprobar: 1,
                                        rector: rector,
                                        idsanteproyectos: Ext.encode(array)
                                    },
                                    callback: function (options, success, response) {
                                        cod = Ext.decode(response.responseText);
                                        if (cod > 0) {
                                            gridDocumento.getStore().reload({
                                                params: {
                                                    start: 0,
                                                    limit: 20
                                                },
                                                callback: function () {
                                                    if (anteproyecto.length == 1)
                                                        mostrarMensaje(1, 'El documento ha sido aprobado satisfactoriamente.');
                                                    else
                                                        mostrarMensaje(1, 'Los documentos han sido aprobados satisfactoriamente.');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    id: 'btnDesaprobardocumento',
                    // icon: perfil.dirImg + 'desaprobar.png',
                    itemCls: 'x-menu-item icondistra-desaprobar',
                    iconCls: 'imagen-none',
                    // iconCls: 'desaprobar',
                    tooltip: perfil.etiquetas.ttBtnDesaprobar,
                    text: perfil.etiquetas.textBtnDesaprobar,
                    disabled: true,
                    handler: function () {
                        anteproyecto = gridDocumento.getSelectionModel()
                            .getSelections();
                        if (anteproyecto.length == 1)
                            mostrarMensaje(2, '¿Está seguro que quiere desaprobar el documento seleccionado?', funcion);
                        else
                            mostrarMensaje(2, '¿Está seguro que quiere desaprobar los documentos seleccionados?', funcion);
                        function funcion(btn) {
                            if (btn == 'ok') {

                                array = [];
                                for (i in anteproyecto) {
                                    array.push(anteproyecto[i].id);
                                }
                                Ext.Ajax.request({
                                    url: 'aprobardesabropardoc',
                                    params: {
                                        aprobar: 0,
                                        rector: rector,
                                        idsanteproyectos: Ext.encode(array)
                                    },
                                    callback: function (options, success, response) {
                                        cod = Ext.decode(response.responseText);
                                        if (cod > 0) {
                                            gridDocumento.getStore().reload({
                                                params: {
                                                    start: 0,
                                                    limit: 20
                                                },
                                                callback: function () {
                                                    if (cod == 3)
                                                        mostrarMensaje(3, 'No se puede desaprobar, esta no es la última versión del documento');
                                                    else if (anteproyecto.length == 1)
                                                        mostrarMensaje(1, 'El documento ha sido desaprobado satisfactoriamente.');
                                                    else
                                                        mostrarMensaje(1, 'Los documentos han sido desaprobados satisfactoriamente.');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            ]
        }
    });
    btnLimpiarG2 = new Ext.Button({
        //text: perfil.etiquetas.textBtnLimpiarfiltros,
        id: 'btnLimpiarG2',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.ttBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosgestionardocumento.clearFilters();
        }
    });
    btnLimpiarNae = new Ext.Button({
        // text: perfil.etiquetas.textBtnLimpiarfiltros,
        id: 'btnLimpiarNae',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.ttBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosnae.clearFilters();
        }
    });
    btnLimpiarGrids = new Ext.Button({
        // text: perfil.etiquetas.textBtnLimpiarfiltros,
        id: 'btnLimpiarGrids',
        //  icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar los grid',
        disabled: false,
        handler: function () {
            smI3_2.clearSelections();
            gridInter3_2.getStore().reload({
                params: {
                    start: 0,
                    limit: 10
                }
            });

            gridInter3_1.getStore().reload({
                params: {
                    start: 0,
                    limit: 10
                }
            });
            gridInter3.getStore().reload({
                params: {
                    start: 0,
                    limit: 10
                }
            });

        }
    });
    btnGenerarDoc = new Ext.Button({
        // text: perfil.etiquetas.textBtnGenerarDocumento,
        id: 'btngenerardoc',
        // icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.ttBtnGenDoc,
        disabled: true,
        handler: function () {
            Ext.Ajax.request({
                url: 'modificardoc',
                params: {
                    idanteproyecto: gridDocumento.getSelectionModel()
                        .getSelected().id,
                    duplicar: 1
                },
                callback: function (options, success, response) {
                    cod = Ext.decode(response.responseText);
                    if (cod == 1) {
                        gridDocumento.getStore().reload({
                            params: {
                                start: 0,
                                limit: 10
                            },
                            callback: function () {
                                mostrarMensaje(1,
                                    'La nueva version del documento se ha generado correctamente');
                            }
                        });
                    }
                }
            });
        }
    })
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.textBtnAyuda,
        id: 'btnAyudaAn',
        // icon:perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.ttBtnAyuda,
        disabled: false
    });


    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
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
        }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function () {
                gridNAE.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                gridDocumento.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                })
            }
        }

    });
    //stCbejercicio.reload();

    stEjercicioReportesPartidas = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEjercicioReportesPartidas.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
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
        }])
    });

    cbEjercicioReportesPartidas = new Ext.form.ComboBox({
        id: 'idcbEjercicioReportesPartidas',
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
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        fieldLabel: 'Ejercicio'
    });


    stNae = new Ext.data.Store({
        url: 'listarTodasNae',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
            name: 'idnae'
        }, {
            name: 'denominacion'
        }]),
        listeners: {
            beforeload: function (st, opts) {
                st.baseParams.identidad = tpEstructura.getSelectionModel().getSelectedNode().id;

            }
        }
    });

    cmbNae = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        width: 180,
        align: 'right',
        mode: 'local',
        store: stNae,
        valueField: 'idnae',
        displayField: 'denominacion',
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        listWidth: 250,
        typeAhead: true,
        fieldLabel: 'NAE'/*,
         tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'*/
    });

    stObjetosGatos = new Ext.data.Store({
        url: 'listarTodosObjetosGastos',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
            name: 'idobjetogasto'
        }, {
            name: 'denominacion'
        }])
    });

    cmbObjetosGatos = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        width: 180,
        align: 'right',
        mode: 'local',
        store: stObjetosGatos,
        valueField: 'idobjetogasto',
        displayField: 'denominacion',
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        listWidth: 250,
        typeAhead: true,
        fieldLabel: 'Elementos de Gastos'/*,
         tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'*/
    });

    stPartidas = new Ext.data.Store({
        url: 'listarTodasLasPartidasPadres',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
            name: 'idpartida'
        }, {
            name: 'denominacion'
        }])
    });

    cmbPartidas = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        width: 180,
        align: 'right',
        mode: 'local',
        store: stPartidas,
        valueField: 'idpartida',
        displayField: 'denominacion',
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        listWidth: 250,
        typeAhead: true,
        fieldLabel: 'Partidas',
        listeners: {
            select: function (com, rec, ind) {
                stObjetosGatos.reload({
                    params: {
                        partidas: Ext.encode(com.getCheckedValue())
                    }
                });
            }
        }
    });


    stRecursosFinan = new Ext.data.Store({
        url: 'listarTodosRecursosFinan',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
            name: 'idrecursofinanciero'
        }, {
            name: 'denominacion'
        }])
    });

    cmbRecursosFinan = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        width: 180,
        align: 'right',
        mode: 'local',
        store: stRecursosFinan,
        valueField: 'idrecursofinanciero',
        displayField: 'denominacion',
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        listWidth: 250,
        typeAhead: true,
        fieldLabel: 'Recurso financiero'/*,
         tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'*/
    });


    chbResumen = new Ext.form.Checkbox({
        id: 'idchbResumen',
        //width: 160,
        anchor: '95%',
        align: 'right',
        fieldLabel: 'Resumen',
        listeners: {
            check: function (check, checked) {
                if (checked) {
                    Ext.getCmp('idchbgeneral').setValue(false);
                }
            }
        }
    });

    chbGeneral = new Ext.form.Checkbox({
        id: 'idchbgeneral',
        //width: 160,
        anchor: '95%',
        align: 'right',
        fieldLabel: 'General',
        listeners: {
            check: function (check, checked) {
                if (checked) {
                    Ext.getCmp('idchbResumen').setValue(false);
                }
            }
        }
    });


    fpReportesPartidas = new Ext.FormPanel({
        frame: true,
        labelAlign: 'top',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [cbEjercicioReportesPartidas, cmbPartidas, cmbObjetosGatos]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [cmbNae, cmbRecursosFinan,
                    {
                        layout: 'column',
                        items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [chbGeneral]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [chbResumen]
                        }]
                    }
                ]
            }]
        }],
        listeners: {
            clientvalidation: function () {
                if (cbEjercicioReportesPartidas.getValue() != "") {
                    btnAceptarRP.enable();
                } else {
                    btnAceptarRP.disable();
                }

                if (cmbPartidas.getValue() != "") {
                    cmbRecursosFinan.disable();
                } else {
                    cmbRecursosFinan.enable();
                }

                if (cmbRecursosFinan.getValue() != "") {
                    cmbPartidas.disable();
                    cmbObjetosGatos.disable();
                    chbResumen.disable();
                    chbGeneral.disable();
                } else {
                    cmbPartidas.enable();
                    cmbObjetosGatos.enable();
                    chbResumen.enable();
                    chbGeneral.enable();
                }
            }
        }
    });

    btnCancelarRP = new Ext.Button({
        text: 'Cancelar',
        disabled: false,
        id: 'idbtnCancelarRP',
        iconCls: 'cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            fpReportesPartidas.getForm().reset();
            wReportesPartidas.hide();
        }
    });

    btnAceptarRP = new Ext.Button({
        text: 'Aceptar',
        disabled: true,
        id: 'idbtnAceptarRP',
        iconCls: 'aceptar',
        tooltip: 'Guardar los datos y cerrar la ventana',
        handler: function () {
            exportarPartidas(tipoReporte);
        }
    });


    wReportesPartidas = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        autoValidate: false,
        items: fpReportesPartidas,
        resizable: false,
        width: 400,
        height: 230,
        title: 'Configurar reporte',
        listeners: {
            beforeshow: function () {
                if (tipoReporte == 1) {
                    stNae.load();
                    stRecursosFinan.load();
                    stObjetosGatos.load();
                    stEjercicioReportesPartidas.load();
                    stPartidas.load();
                } else if (tipoReporte == 2) {
                    stNae.load();
                }
            },
            hide: function () {
                fpReportesPartidas.getForm().reset();
                wReportesPartidas.hide();
            }
        },
        buttons: [btnCancelarRP, btnAceptarRP]
    });

    menuReportesPartidas = new Ext.menu.Menu({
        items: [{
            id: 'btnReporte1',
            text: 'Resumen de Presupuesto por Partidas <b>(Alt+E)</b>',
            tooltip: 'Resumen de Presupuesto por Partidas',
            iconCls: 'exportar',
            handler: function () {
                tipoReporte = 1;
                wReportesPartidas.show();
            }
        }, {
            id: 'btnIngresosPlanifReal',
            text: 'Resumen de los Ingresos planificados y real',
            tooltip: 'Resumen de los Ingresos planificados y real',
            iconCls: 'exportar',
            handler: function () {
                exportarIngresosPlanificadosReal();
            }
        }]
    });

    menuReportes = new Ext.Button({
        id: 'idmenuReportes',
        disabled: true,
        tooltip: {
            text: 'Exportar Documentos por Partidas'
        },
        iconCls: 'exportar',
        menu: menuReportesPartidas
    });

    /** * arbol** */

    treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidades',
        listeners: {
            load: function () {
                if (is_leaf) {
                    grid.getStore().reload({
                        params: {
                            hoja: hoja,
                            start: 0,
                            limit: 20,
                            idconftiponomesp: idconftiponomesp,
                            identidad: idenhojatidad
                        }
                    });
                }

            },
            beforeload: function (tree, node, res) {
                tree.baseParams.valor = Ext.getCmp('idfiltroentidad').getValue();
                tree.baseParams.idejercicio = cbEjercicio.getValue();
            }

        }
    });

    tpEstructura = new Ext.estructura.panel.PanelEstructura(
        {
            cargos: false,
            menu: false,
            width: 300

        });

    var contextmenu = new Ext.menu.Menu({
        //node: null,
        items: [
            {
                id: 'generardocP2',
                text: perfil.etiquetas.textBtnMenuGenP2,
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                handler: function () {
                    Planificacion.maskElement(Ext.getBody());
                    Ext.Ajax.request({
                        url: 'generardoc2',
                        params: {
                            identidad: tpEstructura.getSelectionModel().getSelectedNode().id,
                            idejercicio: cbEjercicio.getValue()
                        },
                        callback: function (option, success, response) {
                            Planificacion.unmaskElement(Ext.getBody());
                            cod = Ext.decode(response.responseText);

                            if (cod.cod > 0) {
                                if (cod.cod == 5) {
                                    mostrarMensaje(1, 'Ya existe un documento P2 para esta entidad.');

                                } else if (cod.cod == 6) {
                                    mostrarMensaje(1, 'Existe(n) entidad(es) hija(s) sin generar su documento P2.');
                                } else if (cod.cod == 7) {
                                    mostrarMensaje(1, 'En la entidad no están creados todos los documentos P2.1');
                                }
                                else {
                                    storeI2.load();
                                    mostrarMensaje(1, 'El documento ha sido generado satisfactoriamente.');
                                }

                            } else if (cod.cod < 0 && cod.entidades.length > 0) {
                                var ent = '';
                                for (var i = 0; i < cod.entidades.length; i++) {
                                    storeentidad = Ext
                                        .getCmp('cbFiltroentidad').store;
                                    denominacion = storeentidad
                                        .getAt(storeentidad.find(
                                            'idestructura',
                                            cod.entidades[i])).data.denominacion;
                                    ent += '"' + denominacion + '"';
                                    if (i < cod.entidades.length - 1)
                                        ent += ', ';
                                }
                                //mostrarMensaje(1,'En la(s) entidad(es) '+ ent + ' no estan creados todos los documentos P2.1');
                                mostrarMensaje(1, 'El(Los) NAE asociado(s) a la entidad no tiene(n) P2.1.');
                            } else if (cod.cod < 0 && cod.entidades.length == 0) {
                                mostrarMensaje(1, 'El(los) NAE(s) asociado(s) a la entidad no tiene(n) P2.1');
                            } else if (cod.cod == 0) {
                                mostrarMensaje(1, 'No existen NAEs asociados a la entidad');
                            }
                        }
                    });

                }
            }, {
                id: 'actualizardocP2',
                text: perfil.etiquetas.textBtnMenuActP2,
                icon: perfil.dirImg + 'actualizar.png',
                iconCls: 'btn',
                handler: function () {
                    Planificacion.maskElement(Ext.getBody());
                    Ext.Ajax.request({
                        url: 'generardoc2',
                        params: {
                            identidad: tpEstructura.getSelectionModel().getSelectedNode().id,
                            idejercicio: cbEjercicio.getValue(),
                            actualizar: 1
                        },
                        callback: function (option, success, response) {
                            //recargar el arbol y expandirlo
                            Planificacion.unmaskElement(Ext.getBody());
                            storeI2.load();
                            mostrarMensaje(1, 'El documento ha sido generado satisfactoriamente.');
                        }
                    });
                }
            }
        ]
    });

    tpEstructura = tpEstructura.items.items[0];

    var listener = getNamedListener(tpEstructura, 'contextmenu');
    if (listener.length > 0) {
        for (var i = 0; i < listener.length; i++) {
            tpEstructura.removeListener('contextmenu', listener[i]);
        }
    }

    tpEstructura.getRootNode().expand();
    tpEstructura.region = 'west';

    tpEstructura.addListener('contextmenu', function (node, event) {
        var existeP2 = false;
        for (var i = 0; i < storeI2.data.items.length; i++) {
            if (storeI2.data.items[i].data.idtipoanteproyecto.idtipoanteproyecto == 4) {
                existeP2 = true;
                break;
            }
        }

        if (existeP2) {
            Ext.getCmp('actualizardocP2').enable();
            Ext.getCmp('generardocP2').disable();
        } else {
            Ext.getCmp('actualizardocP2').disable();
            Ext.getCmp('generardocP2').enable();
        }

        event.stopEvent();
        tpEstructura.getSelectionModel().select(node);
        if (node.id != 0) {
            contextmenu.node = node;
            contextmenu.showAt(event.getXY());
        }
    });

    tpEstructura.addListener('click', function (node, event) {

        if (node.text != "Estructuras") {
            cbEjercicio.enable();
            menuReportes.enable();
            gridNAE.enable();
            gridDocumento.enable();
            Ext.getCmp('idmenuReportes').enable();
            nodeRoot = tpEstructura.getRootNode();
            idNodeRoot = nodeRoot.childNodes[0].attributes.id;

            if (idNodeRoot == node.id) {
                entidadEcon = 1;
            } else {
                entidadEcon = 0;
            }
            identidadselect = node.id;
            denomentidadselect = node.text;
            nodeSelect = node;
            tpEstructura.getSelectionModel().select(node);
            gridNAE.getStore().removeAll();
            gridDocumento.getStore().removeAll();
            filtrosgestionardocumento.clearFilters_noEvent();
            if (node.id != 0 && stCbejercicio.getCount() > 0) {
                cbEjercicio.enable();
                gridNAE.expand();
                gridNAE.getStore().reload({
                    params: {
                        identidad: node.id,
                        start: 0,
                        limit: 20
                    }
                });
                gridDocumento.getStore().reload({
                    params: {
                        identidad: node.id,
                        start: 0,
                        limit: 20
                    }
                });
            }
        } else {
            cbEjercicio.disable();
            menuReportes.disable();
            gridNAE.disable();
            gridDocumento.disable();

            var storeLeft = gridNAE.getStore();
            storeLeft.removeAll();

            var storeRight = gridDocumento.getStore();
            storeRight.removeAll();

        }
    });

    tpEstructura.addListener('expandnode', function (node) {
        //selecciona el nodo anterior seleccionado antes de recargar
        if (nodeSelect) {
            if (node.id == nodeSelect.id) {
                node.select();
            }
        }
    });

    smgridNAE = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    smgridNAE.on('rowselect', function (sm, rowIndex, rec) {
        if (sm.getSelected()) {
            tienedoc = sm.getSelected().data.tienedoc;
            if (tienedoc == 1) {
                Ext.getCmp('generar21').disable();
                Ext.getCmp('actualizar21').enable();
            }
            else {
                Ext.getCmp('generar21').enable();
                Ext.getCmp('actualizar21').disable();
            }
        }

    }, this);

    // Grid NAE
    storeNAE = new Ext.data.Store({
        url: 'listarnaeasociados',
        listeners: {
            beforeload: function (_this, options) {
                var node;

                if (tpEstructura.getSelectionModel().getSelectedNode()) {
                    node = tpEstructura.getSelectionModel().getSelectedNode().id;
                } else {
                    node = nodeSelect.id;
                }

                if (entidadEcon == 1) {
                    _this.baseParams = {
                        identidad: node,
                        idejercicio: cbEjercicio.getValue(),
                        identidadRector: node
                    }
                } else {
                    _this.baseParams = {
                        identidad: tpEstructura.getSelectionModel().getSelectedNode().id,
                        idejercicio: cbEjercicio.getValue()
                    }
                }

            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idnae',
            root: 'data'
        }, [
            {
                name: 'idnae'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'asociado'
            },
            {
                name: 'tienedoc'
            }
        ])
    });


    var cmG1I2 = new Ext.grid.ColumnModel([
        {
            id: 'codigonae',
            header: "Código",
            dataIndex: 'codigo',
            width: 90,
            sortable: true
        },
        {
            header: "Denominación",
            dataIndex: 'denominacion',
            id: 'denominacionnae',
            width: 90,
            sortable: true
        },
        {
            header: "Asociación",
            dataIndex: 'asociado',
            width: 90,
            sortable: true,
            renderer: renderasociado
        }
    ]);


    smI12 = new Ext.grid.CheckboxSelectionModel({
        moveEditorOnEnter: true,
        listeners: {
            rowselect: function (_this, row_index, record) {

                records = _this.getSelections();

                if (record.data.idtipoanteproyecto.idtipoanteproyecto == 4) {
                    btnEliminar.enable();
                } else if (record.data.idtipoanteproyecto.idtipoanteproyecto == 1 && elimina) {
                    btnEliminar.enable();
                } else {
                    btnEliminar.disable();
                }

                if (_this.getSelections().length > 1) {

                    var bandera = false;

                    for (var i = 0; i < records.length; i++) {
                        if (records[i].data.idaprobacion >= 3) {
                            bandera = true;
                            break;
                        }
                    }

                    if (bandera || !elimina) {
                        btnEliminar.disable();
                    } else {
                        btnEliminar.enable();
                    }
                }


                aprobar = true;
                r = true;
                for (var k = 0; k < records.length; k++) {
                    if (records[k].data.idaprobacion >= 3) {
                        aprobar = false;
                    }
                    if (records[k].data.idaprobacion == 4) {
                        r = false;
                        btnEliminar.disable();
                    }
                }
                if (aprobar) {
                    Ext.getCmp('btnAprobardocumento').enable();
                    gridDocumento.colModel.setEditable(6, true);
                    Ext.getCmp('btnDesaprobardocumento').disable();
                } else {
                    //Ext.getCmp('btnAprobardocumento').disable();
                    gridDocumento.colModel.setEditable(6, false);
                    if (rector) {
                        Ext.getCmp('btnAprobardocumento').enable();
                        gridDocumento.colModel.setEditable(6, true);
                        Ext.getCmp('btnDesaprobardocumento').enable();
                        if (!r) {
                            Ext.getCmp('btnAprobardocumento').disable();
                            gridDocumento.colModel.setEditable(6, false);
                        }
                    } else {
                        if (r) {
                            Ext.getCmp('btnDesaprobardocumento').enable();
                        }
                    }
                }
                if (_this.getSelections().length == 1) {
                    btnVerdocumento.enable();
                    if (_this.getSelected().data.idaprobacion == 4) {
                        doc_ver = gridDocumento.getStore().query('numero',
                            _this.getSelected().data.numero);
                        mayor = true;
                        for (var i = 0; i < doc_ver.items.length; i++) {
                            if (_this.getSelected().data.version < doc_ver.items[i].data.version) {
                                mayor = false
                            }
                        }
                        if (mayor)
                            btnGenerarDoc.enable();
                        else
                            btnGenerarDoc.disable();
                    }
                    doc_selected = _this.getSelected();
                }
                if (_this.getSelections().length > 1) {
                    btnVerdocumento.disable();
                    btnGenerarDoc.disable();
                    doc_selected = null;
                }

            },
            rowdeselect: function (_this, row_index, record) {

                var bandera = false;
                var recordss = _this.getSelections();
                for (var i = 0; i < recordss.length; i++) {
                    if (recordss[i].data.idaprobacion >= 3) {
                        bandera = true;
                        break;
                    }
                }
                /*if (bandera) {
                 btnEliminar.disable();
                 } else {
                 btnEliminar.enable();
                 }*/

                if (_this.getSelections().length == 0) {
                    btnEliminar.disable();
                    btnVerdocumento.disable();
                    btnGenerarDoc.disable();
                    doc_selected = null;
                    Ext.getCmp('btnAprobardocumento').disable();
                    Ext.getCmp('btnDesaprobardocumento').disable();
                }
                if (_this.getSelections().length == 1) {
                    if (record.data.idaprobacion < 3) {
                        Ext.getCmp('btnAprobardocumento').enable();
                        Ext.getCmp('btnDesaprobardocumento').disable();
                    } else {
                        Ext.getCmp('btnAprobardocumento').disable();
                        if (rector && record.data.idaprobacion <= 3) {
                            Ext.getCmp('btnAprobardocumento').enable();
                            Ext.getCmp('btnDesaprobardocumento').enable();
                        }
                        else {
                            if (record.data.idaprobacion != 4)
                                Ext.getCmp('btnDesaprobardocumento').enable();
                        }
                    }
                    btnVerdocumento.enable();
                    if (_this.getSelected().data.idaprobacion == 4) {
                        doc_ver = gridDocumento.getStore().query('numero',
                            _this.getSelected().data.numero);
                        mayor = true;
                        for (var i = 0; i < doc_ver.items.length; i++) {
                            if (_this.getSelected().data.version < doc_ver.items[i].data.version) {
                                mayor = false
                            }
                        }
                        if (mayor)
                            btnGenerarDoc.enable();
                        else
                            btnGenerarDoc.disable();
                    }
                    doc_selected = _this.getSelected();
                }
                if (_this.getSelections().length > 1) {
                    btnVerdocumento.disable();
                    btnGenerarDoc.disable();
                    doc_selected = null;
                    records = _this.getSelections();
                    aprobar = true;
                    for (var k = 0; k < records.length; k++) {
                        if (records[k].data.idaprobacion >= 3)
                            aprobar = false;
                        if (records[k].data.idaprobacion == 4) {
                            r = false;
                        }
                    }
                    if (aprobar) {
                        Ext.getCmp('btnAprobardocumento').enable();
                        Ext.getCmp('btnDesaprobardocumento').disable();
                    } else {
                        Ext.getCmp('btnAprobardocumento').disable();
                        if (rector)
                            Ext.getCmp('btnDesaprobardocumento').enable();
                        else {
                            if (r)
                                Ext.getCmp('btnDesaprobardocumento').enable();
                        }
                    }
                }
            }
        }
    });
    paginadogridNAE = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        displayInfo: true,
        items: [btnLimpiarNae]
    })
    gridNAE = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.titleGridNae,
        master_column_id: 'exp',
        width: 410,
        plugins: filtrosnae,
        disabled: false,
        region: 'west',
        collapsible: true,
        collapsed: true,
        autoExpandColumn: 'denominacionnae',
        store: storeNAE,
        cm: cmG1I2,
        sm: smgridNAE,
        contextmenu: new Ext.menu.Menu({
            rows: [],
            items: [
                {
                    id: 'generar21',
                    text: perfil.etiquetas.textBtnGenP21,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    handler: function () {
                        Planificacion.maskElement(Ext.getBody());
                        idsnaes = [];
                        for (var i = 0; i < gridNAE.contextmenu.rows.length; i++) {
                            idsnaes.push(gridNAE.contextmenu.rows[i].id);
                        }
                        Ext.Ajax.request({
                            url: 'generardoc21',
                            params: {
                                idnaes: Ext.encode(idsnaes),
                                identidad: tpEstructura.getSelectionModel()
                                    .getSelectedNode().id,
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function (option, success, response) {
                                Planificacion.unmaskElement(Ext.getBody());
                                cod = Ext.decode(response.responseText);
                                if (cod.length > 0) {
                                    //recargar el arbol y expandirlo
                                    /*tpEstructura.getRootNode().reload();
                                     tpEstructura.expandAll();*/
                                    gridDocumento.getStore().reload({
                                        params: {
                                            start: 0,
                                            limit: 20
                                        },
                                        callback: function () {
                                            mostrarMensaje(1, 'El documento fue generado satisfactoriamente.');
                                        }
                                    });
                                }
                                storeNAE.reload();
                            }
                        });
                    }
                }, {
                    id: 'actualizar21',
                    text: "Actualizar P-2.1",
                    icon: perfil.dirImg + 'actualizar.png',
                    iconCls: 'btn',
                    handler: function () {
                        Planificacion.maskElement(Ext.getBody());
                        idsnaes = [];
                        for (var i = 0; i < gridNAE.contextmenu.rows.length; i++) {
                            idsnaes.push(gridNAE.contextmenu.rows[i].id);
                        }
                        Ext.Ajax.request({
                            url: 'generardoc21',
                            params: {
                                idnaes: Ext.encode(idsnaes),
                                identidad: tpEstructura.getSelectionModel().getSelectedNode().id,
                                actualizar: 1,
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function (option, success, response) {
                                Planificacion.unmaskElement(Ext.getBody());
                                cod = Ext.decode(response.responseText);
                                if (cod.length > 0) {
                                    gridDocumento.getStore().reload({
                                        params: {
                                            start: 0,
                                            limit: 20
                                        },
                                        callback: function () {
                                            mostrarMensaje(1, 'El(los) documento(s) fue(ron) actualizado(s) correctamente');
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            ]
        }),
        id: 'grid1I2',
        listeners: {
            rowcontextmenu: function (_this, rowIndex, event) {
                event.stopEvent();
                _this.contextmenu.rows = [];
                _this.getSelectionModel().selectRow(rowIndex);
                rows = _this.getSelectionModel().getSelections();
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].data.asociado) {
                        _this.contextmenu.rows.push(rows[i]);
                    }
                }
                if (_this.contextmenu.rows.length == rows.length)
                    _this.contextmenu.showAt(event.getXY());

            }
        },
        loadMask: true,
        frame: true,
        bbar: paginadogridNAE


    });
    storeI2 = new Ext.data.Store({
        url: 'cargardocumentos',
        listeners: {
            beforeload: function (_this, options) {
                cambiarTituloFiltrarNiveles();
                if (tpEstructura.getSelectionModel().getSelectedNode()) {
                    _this.baseParams = {
                        identidad: tpEstructura.getSelectionModel().getSelectedNode().id,
                        idejercicio: cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                } else {
                    return false;
                }
            },
            load: function (_this, records, options) {
                elimina = true;

                for (var i = 0; i < records.length; i++) {
                    if (records[i].data.idtipoanteproyecto.idtipoanteproyecto == 4) {
                        elimina = false;
                        break;
                    }
                }

                if (records.length == 0) {
                    btnVerdocumento.disable();
                    btnEliminar.disable();
                }
                if (records.length == 0
                    && filtrosgestionardocumento.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, 'No existen datos que correspondan con los criterios de búsqueda especificados');
                }
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idanteproyecto',
            root: 'data',
            totalProperty: 'total'
        }, [
            {
                name: 'idanteproyecto'
            },
            {
                name: 'numero'
            },
            {
                name: 'idejercicio'
            },
            {
                name: 'fecha'
            },
            {
                name: 'version'
            },
            {
                name: 'idtipoanteproyecto',
                mapping: 'NomTipoanteproyecto'
            },
            {
                name: 'idnae',
                mapping: 'DatAnteproyectonae'
            },
            {
                name: 'idconcepto',
                mapping: 'DatConceptoespecialidad.NomConcepto.idconcepto'
            },
            {
                name: 'idaprobacion'
            },
            {
                name: 'idusuario'
            },
            {
                name: 'identidad'
            },
            {
                name: 'denentidad'
            }
        ])
    })

    rnGridDocumento = new Ext.grid.RowNumberer({
        header: 'No.',
        sortable: true
    })

    var cmI2 = new Ext.grid.ColumnModel([
        smI12,
        rnGridDocumento,
        {
            id: 'numero',
            header: "Número",
            dataIndex: 'numero',
            width: 90,
            sortable: true
        },
        {
            header: "Versión",
            dataIndex: 'version',
            width: 90,
            sortable: true
        },
        {
            header: "Fecha",
            dataIndex: 'fecha',
            width: 90,
            sortable: true
        },
        {
            header: "Tipo",
            dataIndex: 'idtipoanteproyecto',
            width: 90,
            sortable: true,
            renderer: rendertipoanteproyecto
        },
        {
            header: "NAE",
            dataIndex: 'idnae',
            width: 90,
            sortable: true,
            renderer: rendernaeanteproyecto
        },
        {
            header: "Concepto",
            dataIndex: 'idconcepto',
            width: 90,
            sortable: true,
            renderer: renderconcepto,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                id: 'cmbEditorConcepto',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.Store({
                    url: 'cargarconceptos',
                    autoLoad: true,
                    reader: new Ext.data.JsonReader({
                        id: 'idconcepto'
                    }, [{
                        name: 'idconcepto'
                    }, {
                        name: 'denominacion'
                    }])
                }),
                valueField: 'idconcepto',
                displayField: 'denominacion'
            })
        },
        {
            header: "Aprobado",
            dataIndex: 'idaprobacion',
            width: 90,
            sortable: true,
            renderer: renderaprobacionanteproyecto
        },
        {
            header: "Usuario",
            dataIndex: 'idusuario',
            width: 90,
            sortable: true/*,
         renderer: renderusuarioanteproyecto*/
        },
        {
            header: "Entidad",
            dataIndex: 'denentidad',
            width: 90,
            sortable: true
        }
    ]);

    Ext.getCmp('cmbEditorConcepto').store.addListener('load', function () {
        contador_filter++;
        if (contador_filter == 7) {
            Planificacion.unmaskElement(Ext.getBody());
        }
    });


    gridDocumento = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.titleGridDoc,
        master_column_id: 'exp',
        width: 250,
        disabled: false,
        height: 500,
        region: 'center',
        plugins: filtrosgestionardocumento,
        autoExpandColumn: 'numero',
        contextmenu: new Ext.menu.Menu({
            items: [
                {
                    text: 'Ver documento',
                    icon: perfil.dirImg + 'ver.png',
                    iconCls: 'btn',
                    handler: function () {
                        btnVerdocumento.handler.call();
                    }
                }, {
                    text: 'Eliminar documento',
                    iconCls: 'eliminar',
                    //id: 'mdEliminarDocumento',
                    //tooltip: 'Eliminar documento',
                    handler: function () {

                    }
                }
            ]
        }),
        listeners: {
            rowcontextmenu: function (_this, rowIndex, event) {
                event.stopEvent();
                _this.getSelectionModel().selectRow(rowIndex);
                if (!btnVerdocumento.disabled) {
                    _this.contextmenu.showAt(event.getXY());
                }
            },
            afteredit: function (e) {
                Ext.Ajax.request({
                    url: 'guardarconceptodoc',
                    params: {
                        iddocumento: e.record.id,
                        idconcepto: e.value
                    },
                    callback: function (options, success, response) {
                        response = Ext.decode(response.responseText);
                        if (response == e.record.id) {
                            e.record.commit();
                        }
                    }
                });
            }
        },
        store: storeI2,
        cm: cmI2,
        sm: smI12,
        loadMask: true,
        id: 'gridI2',
        frame: true,
        tbar: [btnEliminar, btnVerdocumento, btnmenuaprobacion],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeI2,
            displayInfo: true,
            items: [btnLimpiarG2]
        })
    });
    pgeneral = new Ext.Panel({
        id: 'pgeneral',
        region: 'center',
        collapsible: true,
        split: true,
        width: 200,
        layout: 'border',
        items: [gridNAE, gridDocumento]
    });

    ptestructuras = new Ext.Panel({
        title: perfil.etiquetas.titlePanelEntidades,
        id: 'ptestructuras',
        region: 'west',
        collapsible: true,
        split: true,
        width: 350,
        layout: 'fit',
        items: tpEstructura
    });

    myViewI2 = new Ext.Viewport({
        layout: 'fit',
        items: {
            xtype: 'panel',
            layout: 'border',
            tbar: ['Ejercicio:', cbEjercicio, menuReportes, '->', btnAyuda],
            items: [ptestructuras, pgeneral]
        }
    });

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'rector') {
                rector = 1;
            }
        }
    })
}

function actualizarArbol(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
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

function buscarodo(tree) {
    buscarNodoTreeX(tree, identidadselect, 'idfiltroentidad');
}

function buscarNodoTreeX(trEnt, idselected, idcampobusq) {
    var rootNode = null;
    var idRootNode = null;
    if (idselected == null) {
        idRootNode = trEnt.getRootNode().firstChild.id;
        rootNode = trEnt.getNodeById(idRootNode);
        trEnt.getSelectionModel().select(rootNode);
    }
    else {
        if (idRootNode == null)
            idRootNode = idselected;
        rootNode = trEnt.getNodeById(idRootNode);
    }

    function contarCoinc(t1, t2) {
        var cont = 0;
        for (var index = 0; index < t1.length && index < t2.length; index++) {
            if (t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()) {
                cont++;
            } else {
                break;
            }
        }
        return cont;
    };
    var idmayor = -1;
    var cantConincMayor = 0;
    var node = null;
    rootNode.eachChild(function (n) {
        var cont = null;
        cont = contarCoinc(n.attributes.text, Ext.getCmp(idcampobusq).getValue());
        if (cont > cantConincMayor) {
            cantConincMayor = cont;
            idmayor = n.id;
            node = n;
        }
    }, null, null);
    if (node != null)
        trEnt.getSelectionModel().select(node);

}


function renderasociado(value, metaData, record) {
    if (value)
        metaData.css = 'icondistra-true verde'
    else
        metaData.css = 'icondistra-false rojo';
}

function renderconcepto(value) {
    storenae = Ext.getCmp('cbFiltroconcepto').store;
    var denominacion = '';
    denominacion = storenae.getAt(storenae.find('idconcepto', value)).data.denominacion;
    return denominacion;
}
function rendernaeanteproyecto(value) {
    storenae = Ext.getCmp('cbFiltroenae').store;
    var denominacion = '';
    for (var i = 0; i < value.length; i++) {
        denominacion += storenae.getAt(storenae.find('idnae', value[i].idnae)).data.denominacion;
        if (i < value.length - 1)
            denominacion += ', ';
    }
    return denominacion;
}

function rendertipoanteproyecto(value) {
    return value.denominacion;
}

function renderejercicio(value) {
    storeejercicio = Ext.getCmp('cbFiltroejercicio').store;
    denominacion = storeejercicio.getAt(storeejercicio.find('idejercicio',
        value)).data.ejercicio;
    return denominacion;
}

function renderaprobacionanteproyecto(value, metaData) {
    if (value == 4)
    //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
        metaData.css = 'icondistra-true verde';
    else if (value == 3)
    //return '<span><img src=' + perfil.dirImg + 'yes.png' + '>';
        metaData.css = 'icondistra-true verde';
    // return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    else
        metaData.css = 'icondistra-false rojo';
}

function renderusuarioanteproyecto(value) {
    storeusuario = Ext.getCmp('cbFiltrousuario').store;
    recorduser = storeusuario.find('idusuario', value);
    recorddatauser = storeusuario.getAt(recorduser);
    denominacion = recorddatauser.data.denominacion;
    return denominacion;
}

function renderentidadanteproyecto(value) {
    storeentidad = Ext.getCmp('cbFiltroentidad').store;
    recordentidad = storeentidad.find('idestructura', value);
    recorddataentidad = storeentidad.getAt(recordentidad);
    denominacion = recorddataentidad.data.denominacion;
    return denominacion;
}
function Ver_documento(anteproyecto) {
    presupuesto_hot_key_i2.disable();
    presupuesto_hot_key_i3.enable();
    contador_filter = 0;
    Planificacion.maskElement(Ext.getBody());
    storeInter3_2 = new Ext.data.Store({
        url: 'listarnaesdoc',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [
            {
                name: 'idnae'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'totalog'
            },
            {
                name: 'totalrf'
            }
        ]),
        listeners: {
            beforeload: function (_this, options) {
                _this.baseParams = {
                    idanteproyecto: anteproyecto.id
                }
            }
        }
    });

    paginadoI3_2 = new Ext.PagingToolbar({
        pageSize: 10,
        store: storeInter3_2,
        id: 'paginadoI3_2',
        displayInfo: true,
        items: ['-', btnLimpiarGrids, '-']
    });

    var cmI3_2 = new Ext.grid.ColumnModel([
        {
            id: 'codigo',
            header: "Código",
            dataIndex: 'codigo',
            width: 90,
            sortable: true
        },
        {
            id: 'denominacion',
            header: "Denominación",
            dataIndex: 'denominacion',
            width: 90,
            sortable: true
        },
        {
            id: 'totalog',
            header: "Total OG",
            tooltip: 'Total Objeto de Gasto',
            dataIndex: 'totalog',
            width: 90,
            sortable: true
        },
        {
            id: 'totalrf',
            header: "Total RF",
            tooltip: 'Total Recurso Financiero',
            dataIndex: 'totalrf',
            width: 90,
            sortable: true
        }
    ]);
    smI3_2 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (_this, rowindex, record) {
                gridInter3_1.getStore().reload({
                    params: {
                        idnae: record.id,
                        start: 0,
                        limit: 10
                    }
                });
                gridInter3.getStore().reload({
                    params: {
                        idnae: record.id,
                        start: 0,
                        limit: 10
                    }
                });
            },
            rowdeselect: function (_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gridInter3_1.getStore().reload({
                        params: {
                            start: 0,
                            limit: 10
                        }
                    });
                    gridInter3.getStore().reload({
                        params: {
                            start: 0,
                            limit: 10
                        }
                    });
                }
            }
        }
    });


    gridInter3_2 = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.titleGridNae,
        width: 600,
        height: 80,
        region: 'center',
        autoExpandColumn: 'denominacion',
        store: storeInter3_2,
        cm: cmI3_2,
        sm: smI3_2,
        id: 'gridI3_2',
        loadMask: true,
        bbar: paginadoI3_2

    });

    storeInter3 = new Ext.data.Store({
        url: 'listaringresosdoc',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idanteproyectonaeingreso'
        }, [
            {
                name: 'idanteproyectonaeingreso'
            },
            {
                name: 'codigoingreso'
            },
            {
                name: 'denominacioningreso'
            },
            {
                name: 'ejecucionanterior'
            },
            {
                name: 'presupuestoactual'
            },
            {
                name: 'presupuesto'
            },
            {
                name: 'planificacion'
            },
            {
                name: 'estimadoactual'
            },
            {
                name: 'idingreso'
            }
        ]),
        listeners: {
            beforeload: function (_this, options) {
                _this.baseParams = {
                    idanteproyecto: anteproyecto.id
                }
            }
        }
    });

    paginadoI3 = new Ext.PagingToolbar({
        pageSize: 10,
        store: storeInter3,
        id: 'paginadoI3',
        displayInfo: true
    });

    var cmI3 = new Ext.grid.ColumnModel([
        {
            id: 'codigo',
            header: "Código",
            dataIndex: 'codigoingreso',
            width: 40,
            sortable: true
        },
        {
            id: 'denominacion',
            header: "Denominación",
            dataIndex: 'denominacioningreso',
            sortable: true
        },
        {
            id: 'Ejecución',
            header: "Ejecución año anterior",
            dataIndex: 'ejecucionanterior',
            width: 140,
            sortable: true,
            editor: (anteproyecto.data.idaprobacion >= 3)
                ? false
                : new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        },
        {
            id: 'Presupuesto',
            header: "Presupuesto año actual",
            dataIndex: 'presupuestoactual',
            width: 140,
            sortable: true
        },
        {
            id: 'Estimado',
            header: "Estimado año actual",
            dataIndex: 'estimadoactual',
            width: 140,
            sortable: true,
            editor: (anteproyecto.data.idaprobacion >= 3)
                ? false
                : new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        },
        {
            id: 'Solicitud',
            header: "Solicitud Ejercicio de Planificación",
            dataIndex: 'planificacion',
            width: 190,
            sortable: true
        }
    ]);

    sm_gridInter3 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {}
    });
    gridInter3 = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.titleGridRF,
        master_column_id: 'exp',
        width: 600,
        region: 'south',
        height: 120,
        autoExpandColumn: 'denominacion',
        store: storeInter3,
        cm: cmI3,
        sm: sm_gridInter3,
        id: 'gridI3',
        listeners: {
            afteredit: function (event_edit) {
                Ext.getCmp('btnguardardoc').enable();
            }
        },
        loadMask: true,
        bbar: paginadoI3
    });

    // Estos datos son del segundo grid

    storeInter3_1 = new Ext.data.Store({
        url: 'listargastosdoc',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idanteproyectonaeobjetogasto'
        }, [
            {
                name: 'idanteproyectonaeobjetogasto'
            },
            {
                name: 'codigoobjetogasto'
            },
            {
                name: 'denominacionobjgasto'
            },
            {
                name: 'ejecucionanterior'
            },
            {
                name: 'presupuestoactual'
            },
            {
                name: 'presupuesto'
            },
            {
                name: 'planificacion'
            },
            {
                name: 'estimadoactual'
            },
            {
                name: 'idobjetogasto'
            }
        ]),
        listeners: {
            beforeload: function (_this, options) {
                _this.baseParams = {
                    idanteproyecto: anteproyecto.id
                }
            }
        }
    });

    paginadoI3_1 = new Ext.PagingToolbar({
        pageSize: 10,
        store: storeInter3_1,
        id: 'paginadoI3_1',
        displayInfo: true

    });

    var cmI3_1 = new Ext.grid.ColumnModel([
        {
            id: 'objeto',
            header: "Objeto de gasto",
            dataIndex: 'codigoobjetogasto',
            width: 40,
            sortable: true
        },
        {
            id: 'denominacion',
            header: "Denominación",
            dataIndex: 'denominacionobjgasto',
            sortable: true
        },
        {
            id: 'EjecuciÃ³n1',
            header: "Ejecución año anterior",
            dataIndex: 'ejecucionanterior',
            width: 140,
            sortable: true,
            editor: (anteproyecto.data.idaprobacion >= 3)
                ? false
                : new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        },
        {
            id: 'Presupuesto1',
            header: "Presupuesto año actual",
            dataIndex: 'presupuestoactual',
            width: 140,
            sortable: true
        },
        {
            id: 'Estimado1',
            header: "Estimado año actual",
            dataIndex: 'estimadoactual',
            width: 140,
            sortable: true,
            editor: (anteproyecto.data.idaprobacion >= 3)
                ? false
                : new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        },
        {
            id: 'Solicitud1',
            header: "Solicitud Ejercicio de Planificación",
            dataIndex: 'planificacion',
            width: 190,
            sortable: true
        }
    ]);

    gridInter3_1 = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.titleGridGastos,
        master_column_id: 'exp',
        width: 600,
        height: 130,
        region: 'south',
        autoExpandColumn: 'denominacion',
        store: storeInter3_1,
        cm: cmI3_1,
        id: 'gridI3_1',
        listeners: {
            afteredit: function (event_edit) {
                Ext.getCmp('btnguardardoc').enable();
            }
        },
        loadMask: true,
        bbar: paginadoI3_1

    });

    tipo = new Ext.form.Label({
        id: 'tipo_verdoc',
        name: 'tipo_verdoc',
        width: 110,
        fieldLabel: 'Tipo',
        anchor: '100%',
        text: perfil.etiquetas.textLabelTipo,
        allowBlank: false
    });
    codigo = new Ext.form.Label({
        id: 'codigo_verdoc',
        name: 'codigo_verdoc',
        fieldLabel: 'Codigo del NAE',
        width: 110,
        text: perfil.etiquetas.textLabelCodigo,
        anchor: '100%'
    });
    denominacionEsp = new Ext.form.Label({
        id: 'denominacionEsp',
        name: 'denominacionEsp',
        fieldLabel: 'Especialidad',
        width: 110,
        text: 'Especialidad:',
        anchor: '100%'
    });
    var numero = new Ext.form.Label({
        id: 'numero_verdoc',
        name: 'numero_verdoc',
        fieldLabel: 'Numero',
        width: 110,
        text: perfil.etiquetas.textLabelNumero,
        anchor: '100%'
    });

    var version = new Ext.form.Label({
        id: 'version_verdoc',
        name: 'version_verdoc',
        fieldLabel: 'Version',
        text: perfil.etiquetas.textLabelVersion,
        width: 110,
        anchor: '100%'
    });

    var fecha = new Ext.form.Label({
        id: 'fecha_verdoc',
        name: 'fecha_verdoc',
        fieldLabel: 'Fecha',
        width: 110,
        text: perfil.etiquetas.textLabelFecha,
        anchor: '100%'
    });

    var estado = new Ext.form.Label({
        id: 'estado_verdoc',
        name: 'estado',
        fieldLabel: 'Estado',
        width: 110,
        text: perfil.etiquetas.textLabelEstado,
        anchor: '100%'
    });

    var contenedor = new Ext.form.FieldSet({
        width: '420',
        height: '500',
        layout: 'column',
        items: [
            {
                columnWidth: 1,
                items: [codigo, tipo]
            }, {
                columnWidth: 1,
                items: [denominacionEsp]
            }
        ]
    });

    var contenedor_1 = new Ext.form.FieldSet({
        width: '200',
        height: '500',
        layout: 'column',
        items: [
            {
                columnWidth: 1,
                items: [numero]
            },
            {
                columnWidth: 1,
                items: [version]
            }
        ]
    });

    var contenedor_2 = new Ext.form.FieldSet({
        width: '200',
        height: '500',
        layout: 'column',
        items: [
            {
                columnWidth: 1,
                items: [fecha]
            },
            {
                columnWidth: 1,
                items: [estado]
            }
        ]
    });

    var general = new Ext.form.FieldSet({
        title: perfil.etiquetas.titleFSGeneral,
        width: '100%',
        height: '100%',
        badyStyle: {
            'margin': '1 1 1 1'
        },
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .46,
                        layout: 'form',
                        items: [contenedor]
                    },
                    {
                        columnWidth: .24,
                        layout: 'form',
                        items: [contenedor_1]
                    },
                    {
                        columnWidth: .25,
                        layout: 'form',
                        items: [contenedor_2]
                    }
                ]
            }
        ]
    });

    // aqui esta el formulario
    fpPresupuesto = new Ext.FormPanel({
        id: 'fpPresupuesto',
        region: 'north',
        frame: true,
        width: 50,
        height: 100,
        items: [general]
    });
    btnCancelar = new Ext.Button({
        text: perfil.etiquetas.textBtnCerrar,
        id: 'btnCancelar',
        //icon: perfil.dirImg + 'cerrar.png',
        iconCls: 'cerrar',
        tooltip: perfil.etiquetas.ttBtnCerrar,
        disabled: false,
        handler: function () {
            Ext.getCmp('verdocwindow').destroy();
        }
    });
    panel = new Ext.Panel({
        height: 300,
        width: 500,
        layout: 'border',
        region: 'center',
        items: [fpPresupuesto, gridInter3_2, gridInter3],
        tbar: [
            {
                iconCls: 'btn',
                tooltip: perfil.etiquetas.ttBtnGuardar,
                icon: perfil.dirImg + 'guardar.png',
                text: perfil.etiquetas.textBtnGuardar,
                id: 'btnguardardoc',
                disabled: true,
                handler: function () {
                    Planificacion
                        .mostrarMascara('mask_guardar_cambios_doc',
                        'Por favor espere',
                        'Aplicando cambios al docuemnto...');
                    rf_mod = gridInter3.getStore().getModifiedRecords();
                    og_mod = gridInter3_1.getStore().getModifiedRecords();
                    rf_send = [];
                    og_send = [];
                    for (var i = 0; i < rf_mod.length; i++) {
                        rf_send.push(rf_mod[i].data);
                    }
                    for (var j = 0; j < og_mod.length; j++) {
                        og_send.push(og_mod[j].data);
                    }
                    Ext.Ajax.request({
                        url: 'modificardoc',
                        params: {
                            idanteproyecto: anteproyecto.id,
                            duplicar: 0,
                            ingresosmodificados: Ext.encode(rf_send),
                            gastosmodificados: Ext.encode(og_send)
                        },
                        callback: function (options, success, response) {
                            Planificacion
                                .ocultarMascara('mask_guardar_cambios_doc');
                            cod = Ext.decode(response.responseText);
                            cont = 0;
                            if (cod == 1) {
                                gridInter3.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 10,
                                        idnae: (gridInter3_2.getSelectionModel()
                                            .hasSelection())
                                            ? gridInter3_2.getSelectionModel()
                                            .getSelected().id
                                            : null
                                    },
                                    callback: function () {
                                        cont++;
                                        if (cont == 2) {
                                            Ext.getCmp('btnguardardoc').disable();
                                            mostrarMensaje(1,
                                                'Los cambios se han guardado satisfactoriamente');
                                        }
                                    }
                                });
                                gridInter3_1.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 10,
                                        idnae: (gridInter3_2.getSelectionModel()
                                            .hasSelection())
                                            ? gridInter3_2.getSelectionModel()
                                            .getSelected().id
                                            : null
                                    },
                                    callback: function () {
                                        cont++;
                                        if (cont == 2) {
                                            Ext.getCmp('btnguardardoc').disable();
                                            mostrarMensaje(1,
                                                'Los cambios se han guardado satisfactoriamente');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            },
            {
                iconCls: 'btn',
                tooltip: perfil.etiquetas.ttBtnExportar,
                icon: perfil.dirImg + 'exportar.png',
                text: perfil.etiquetas.textBtnExportar,
                id: 'btnexportardoc',
                disabled: false,
                handler: function (_this) {
                    anteproyecto = gridDocumento.getSelectionModel().getSelected();
                    exportar(anteproyecto);
                }
            }
        ]
    });

    panel_2 = new Ext.Panel({
        height: 510,
        width: 900,
        id: 'panel_2',
        layout: 'border',
        items: [panel, gridInter3_1]
    });

    Ext.Ajax.request({
        url: 'cargardatosdoc',
        params: {
            idanteproyecto: anteproyecto.id,
            identidad: identidadselect
        },
        callback: function (options, success, response) {
            contador_filter++;
            if (contador_filter == 4) {
                Planificacion.unmaskElement(Ext.getBody());
                myViewI3 = new Ext.Window({
                    layout: 'fit',
                    constrain: true,
                    closeAction: 'destroy',
                    id: 'verdocwindow',
                    items: [panel_2]
                });
                myViewI3.show();
            }
            response = Ext.decode(response.responseText);
            texto_cod = Ext.getCmp('codigo_verdoc').text;
            texto_tipo = Ext.getCmp('tipo_verdoc').text;
            texto_fecha = Ext.getCmp('fecha_verdoc').text;
            texto_estado = Ext.getCmp('estado_verdoc').text;
            texto_version = Ext.getCmp('version_verdoc').text;
            texto_numero = Ext.getCmp('numero_verdoc').text;
            texto_denominacionEsp = Ext.getCmp('denominacionEsp').text;
            estado = '';

            if (doc_selected.data.idaprobacion == 3)
                estado = 'Aprobado especialista';
            else if (doc_selected.data.idaprobacion == 4)
                estado = 'Aprobado rector';
            else if (doc_selected.data.idaprobacion == 2)
                estado = 'Preparacion';
            else
                estado = 'Desaprobado';
            Ext.getCmp('codigo_verdoc').setText(texto_cod + ' ' + response.codigo
            + '\n');
            Ext.getCmp('tipo_verdoc').setText(texto_tipo + ' '
            + doc_selected.data.idtipoanteproyecto.denominacion + '\n');
            Ext.getCmp('numero_verdoc').setText(texto_numero + ' '
            + doc_selected.data.numero + '\n');
            Ext.getCmp('version_verdoc').setText(texto_version + ' '
            + doc_selected.data.version + '\n');
            Ext.getCmp('denominacionEsp').setText(texto_denominacionEsp + ' '
            + response.denominacion + '\n');
            Ext.getCmp('fecha_verdoc').setText(texto_fecha + ' '
            + doc_selected.data.fecha + '\n');
            Ext.getCmp('estado_verdoc').setText(texto_estado + ' ' + estado
            + '\n');
        }
    });

    storeInter3_2.load({
        params: {
            identidad: tpEstructura.getSelectionModel()
                .getSelectedNode().id,
            start: 0,
            limit: 20
        },
        callback: function () {
            contador_filter++;
            if (contador_filter == 4) {
                Planificacion.unmaskElement(Ext.getBody());
                myViewI3 = new Ext.Window({
                    layout: 'fit',
                    constrain: true,
                    closeAction: 'destroy',
                    id: 'verdocwindow',
                    items: [panel_2]
                });
                myViewI3.show();
            }
        }
    });

    storeInter3.load({
        params: {
            start: 0,
            limit: 10
        },
        callback: function () {
            contador_filter++;
            if (contador_filter == 4) {
                Planificacion.unmaskElement(Ext.getBody());
                myViewI3 = new Ext.Window({
                    layout: 'fit',
                    constrain: true,
                    closeAction: 'destroy',
                    id: 'verdocwindow',
                    items: [panel_2],
                    listeners: {
                        beforeshow: function (_this) {
                        }
                    }
                });
                myViewI3.show();
            }
        }
    });

    storeInter3_1.load({
        params: {
            start: 0,
            limit: 10
        },
        callback: function () {
            contador_filter++;
            if (contador_filter == 4) {
                Planificacion.unmaskElement(Ext.getBody());
                myViewI3 = new Ext.Window({
                    layout: 'fit',
                    constrain: true,
                    closeAction: 'destroy',
                    id: 'verdocwindow',
                    items: [panel_2]
                });
                myViewI3.show();
            }
        }
    });

}

function Eliminardoc() {
    var selections = gridDocumento.getSelectionModel().getSelections();
    if (selections.length == 1) {
        mostrarMensaje(2, '¿Esta seguro que quiere eliminar el documento seleccionado?', elimina);
    } else {
        mostrarMensaje(2, '¿Esta seguro que quiere eliminar los documentos seleccionados?', elimina);
    }


    function elimina(btn_pressed) {
        if (btn_pressed == 'ok') {

            idsdocs = [];
            for (var i = 0; i < selections.length; i++) {
                idsdocs.push(selections[i].id);
            }
            Ext.Ajax.request({
                url: 'eliminardocs',
                params: {
                    idsdocs: Ext.encode(idsdocs)
                },
                callback: function (options, success, response) {
                    cod = Ext.decode(response.responseText);
                    if (cod > 0) {

                        //recargar el arbol, expandirlo y mantener seleccionado el nodo
                        /* tpEstructura.getRootNode().reload();
                         tpEstructura.expandAll();*/
                        //tpEstructura.getSelectionModel().select(nodeSelect);

                        gridDocumento.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20
                            },
                            callback: function () {
                                if (selections.length == 1) {
                                    mostrarMensaje(1, 'El documento ha sido eliminado satisfactoriamente.');
                                } else {
                                    mostrarMensaje(1, 'Los documentos han sido eliminados satisfactoriamente.');
                                }
                                if (!gridDocumento.getSelectionModel()
                                        .hasSelection()) {
                                    btnEliminar.disable();
                                    btnVerdocumento.disable();
                                }
                            }
                        });
                    }
                    storeNAE.reload();
                }

            });
        }

    }
}

function cambiarTituloFiltrarNiveles() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgestionardocumento.getFiltrosActivos() == undefined || filtrosgestionardocumento.getFiltrosActivos().length == 0) {
        gridDocumento.setTitle("Documentos");
        esta_buscando = false;
    } else {
        esta_buscando = true;
        for (i = 0; i < filtrosgestionardocumento.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "numero") {
                aux = 'Número';
            } else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "version") {
                aux = "Versión";
            } else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "fecha") {
                aux = "Fecha";
            } else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "idtipoanteproyecto") {
                aux = "Número";
            } else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "idnae") {
                aux = "NAE";
            }
            else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "idconcepto") {
                aux = "Concepto";
            }
            else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "idusuario") {
                aux = "Usuario";
            }
            else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = 'Aprobado';
            }
            else if (filtrosgestionardocumento.getFiltrosActivos()[i].dataIndex == "denentidad") {
                aux = "Entidad";
            }
            else {
                aux = '?';
            }
            if (i == filtrosgestionardocumento.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gridDocumento.setTitle('Documentos <i>- Filtrado por: ' + filtrado_por + '</i>');

        filtrado_por = "";
    }
}

function exportar(anteproyecto) {
    var win = window.open('exportar?idanteproyecto=' + anteproyecto.id + '&numero=' + anteproyecto.data.numero
    + '&version=' + anteproyecto.data.version + '&fecha=' + anteproyecto.data.fecha
    + '&idaprobacion=' + anteproyecto.data.idaprobacion
    + '&tipo=' + anteproyecto.data.idtipoanteproyecto.denominacion
    + '&esp=' + Ext.getCmp('denominacionEsp').text
    + '&cod=' + Ext.getCmp('codigo_verdoc').text);
}

function exportarPartidas(tipo) {
    if (tipo == 1) {
        exportarPhtmlPresupuesto = false;
        //comprobar datos para el reporte
        Ext.Ajax.request({
            url: 'comprobarDatos',
            params: {
                identidad: identidadselect,
                idNae: cmbNae.getValue(),
                partidas: cmbPartidas.getValue(),
                idejercicio: cbEjercicioReportesPartidas.getValue(),
                recursos: cmbRecursosFinan.getValue(),
                gastos: cmbObjetosGatos.getValue(),
                resumen: chbResumen.getValue()
            },
            callback: function (options, success, response) {
                var resultado = Ext.decode(response.responseText);

                if (resultado.result == 1) {
                    exportarPhtmlPresupuesto = false;
                } else {
                    exportarPhtmlPresupuesto = true;
                }

                if (exportarPhtmlPresupuesto) {
                    var win = window.open('exportarPresupuesto?identidad=' + identidadselect + '&denomentidad=' + denomentidadselect + '&tipoReporte=' + tipo
                    + '&idNae=' + cmbNae.getValue()
                    + '&partidas=' + cmbPartidas.getValue() + '&idejercicio=' + cbEjercicioReportesPartidas.getValue()
                    + '&denomejercicio=' + cbEjercicioReportesPartidas.getRawValue() + '&resumen=' + chbResumen.getValue()
                    + '&recursos=' + cmbRecursosFinan.getValue() + '&gastos=' + cmbObjetosGatos.getValue() + '&general=' + chbGeneral.getValue());
                    fpReportesPartidas.getForm().reset();
                    wReportesPartidas.hide();
                } else {
                    mostrarMensaje(1, 'No existen datos que se correspondan con los criterios especificados.');
                }
            }
        });

    }
}

function exportarIngresosPlanificadosReal() {
    var winIngresos = window.open('exportarIngresosPlanificadosReal?identidad=' + identidadselect + '&idejercicio=' + cbEjercicioReportesPartidas.getValue());
}

function getNamedListener(obj, eventType) {
    var listeners = obj.events[eventType].listeners;

    var funciones = [];
    if (listeners != undefined) {
        for (var i = 0; i < listeners.length; i++) {
            var func = listeners[i].fn;
            funciones.push(func);
        }
    }

    return funciones;

}
