var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestenmarcamiento', cargarAccionesP);
objci = {};
objci.acciones = [];
var primero_vad = false;
var mymask = new Ext.LoadMask(Ext.getBody(), {
    msg: "Cargando ..."
});
var identidadselected;
var sum = 0;
var contadorsuma = 0;
var sumtotal = 0;
var diferencia = 0;
var mod = 0;
var sumaenmarcamientosvia = 0;
var identidadlogueada;
var identidadrectora;
var denominacionentidadselected;
var campos_modificados = [];
var campos_modificadoscomp = [];
var campo_mod = [];
var pangeneral;
var comportamientoselect;
var identidadpadreselected;
var entidadrectora = false;

function cargarAccionesP() {
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        cargarInterfaz();
    });
}

function cargarInterfaz() {
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function (options, success, response) {
            if (objci.entidadCB == true) {
                centroB = 1;
            }
        }
    });

    /*
     * Loaders de los arboles por CB u OD
     */

    loaderTreetpCB = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidadesCB',
        listeners: {
            beforeload: function (tl, n) {

                baseParams = {
                    rector: objci.acciones.rector,
                    CB: objci.entidadCB,
                    valor: Ext.getCmp('idfiltroent').getValue()
                };
            }
        }
    });

    loaderTreetpOD = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidades',
        preloadChildren: false,
        listeners: {
            beforeload: function (tree, node, res) {
                tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                tree.baseParams.idEstructuraPadre = node.attributes.idEstructuraPadre;
            }
        }
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (!btnLimpiarFiltrosComportamiento.hidden) {
                    if (!btnLimpiarFiltrosComportamiento.disabled)
                        limpiarfiltrosComportamiento();
                } else
                if (!btnLimpiarFiltrosViaAdq.hidden) {
                    if (!btnLimpiarFiltrosViaAdq.disabled)
                        limpiarfiltrosViaAdq();
                }
            }

        }

    ]);

    // Fin loaders de los arboles por CB u OD

    /*
     * Componentes del grid para el Tab Comportamiento
     */

    btnExportarComportamiento = new Ext.Button({
        id: 'btnExportarComportamiento',
        // icon: perfil.dirImg + 'exportar.png',
        tooltip: perfil.etiquetas.lbBtnExportar,
        iconCls: 'exportar',
        disabled: true,
        //text: perfil.etiquetas.lbBtnExportar,
        handler: function () {

            if (cmbComportamiento.getValue() == 1) {
                if (gpViaAdq.getStore().data.length > 0) {

                    filtros = filtrosComportamiento.getFilterData();
                    var win = window.open('exportarOD?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue() +
                            '& identidad=' + identidadselected + '& denominacionentidad=' + denominacionentidadselected + '& identidaddatosnomencladorcb=' + gpComportamiento.getSelectionModel().getSelected().data.identidaddatosnomencladorcb + '& identdatnomodpadre=' + identidadpadreselected + '& idenmarcamiento=' + gpComportamiento.getSelectionModel().getSelected().data.idenmarcamiento + '& denominacioncb=' + gpComportamiento.getSelectionModel().getSelected().data.denominacioncb + '& enmarcamientodisponible=' + gpComportamiento.getSelectionModel().getSelected().data.enmarcamientodisponible + '& enmarcamiento=' + gpComportamiento.getSelectionModel().getSelected().data.enmarcamiento);

                } else {

                    filtros = filtrosComportamiento.getFilterData();
                    var win = window.open('exportarOD?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue() +
                            '& identidad=' + identidadselected + '& denominacionentidad=' + denominacionentidadselected + '& identdatnomodpadre=' + identidadpadreselected);


                }
            } else if (cmbComportamiento.getValue() == 2) {

                if (gpViaAdq.getStore().data.length > 0) {

                    filtros = filtrosCB.getFilterData();
                    var win = window.open('exportarCB?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue() +
                            '& identidad=' + identidadselected + '& denominacionentidad=' + denominacionentidadselected + '& idenmarcamiento=' + gpCB.getSelectionModel().getSelected().data.idenmarcamiento + '& denominacionod=' + gpCB.getSelectionModel().getSelected().data.denorgano + '& identidaddatosnomencladorod= ' + gpCB.getSelectionModel().getSelected().data.identidaddatosnomencladorod + '& enmarcamientodisponible=' + gpCB.getSelectionModel().getSelected().data.enmarcamientodisponible + '& enmarcamiento=' + gpCB.getSelectionModel().getSelected().data.enmarcamiento);

                } else {

                    filtros = filtrosCB.getFilterData();
                    var win = window.open('exportarCB?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue() +
                            '& identidad=' + identidadselected + '& denominacionentidad=' + denominacionentidadselected);
                }

            }
        }
    });

    btnGuardarComportamiento = new Ext.Button({
        id: 'btnGuardarComportamiento',
        // icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        disabled: true,
        tooltip: 'Guardar enmarcamiento',
        // text: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarComportamiento();
        }
    });
    // *********Ayuda****************
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyudaEnmarcamiento',
        // icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtBtnAyuda,
        text: perfil.etiquetas.lbBtnAyuda
    });
    //Comportamiento
    btnLimpiarFiltrosComportamiento = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosComportamiento',
        //  icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarfiltrosComportamiento();
        }
    });

    btnLimpiarFiltrosCB = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosCB',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarfiltrosComportamientoCB();
        }
    });

    jrstGpComportamiento = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: "data"
    }, [{
            name: 'identidaddatosnomencladorcb'
        }, {
            name: 'denominacioncb'
        }, {
            name: 'enmarcamiento'
        },
        {
            name: 'idenmarcamiento'
        }, {
            name: 'enmarcamientodisponible'
        }, {
            name: 'totalenmarcamiento'
        }
    ]);

    stGpComportamiento = new Ext.data.Store({
        url: 'listarComportamiento',
        listeners: {
            load: function () {
                Ext.getCmp('ptViaAdq').setVisible(false);
                stGpViaAdq.removeAll();
                Ext.getCmp('tfTotalViaAdq').reset();
                Ext.getCmp('tfTotalComportamiento').setValue(stGpComportamiento.reader.jsonData.totalenmarcamiento);

                siexisteComportamientoFiltrado();
                if (stGpComportamiento.data.length > 0)
                    Ext.getCmp('btnExportarComportamiento').enable();
                else {
                    Ext.getCmp('btnExportarComportamiento').disable();
                }

            },
            beforeload: function () {
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.identidad = identidadselected;
                this.baseParams.identdatnomodpadre = identidadpadreselected;
            }
        },
        reader: jrstGpComportamiento
    });

    cmComportamiento = new Ext.grid.ColumnModel([
        {
            id: 'idcmComportamiento',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacioncb',
            sortable: true,
            align: 'left',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTipPadre
        }, {
            header: perfil.etiquetas.lbEnmarcamiento,
            dataIndex: 'enmarcamiento',
            sortable: true,
            align: 'left',
            width: 95,
            tooltip: perfil.etiquetas.lbEnmarcamiento,
            editor: new Ext.form.NumberField({
                allowNegative: false, maskRe: /^[0-9.]$/,
                regex: /^([0-9]+)([\.]{0,1})([0-9]{0,3})$/,
                regexText: 'Solo admite números reales positivos con hasta 3 cifras decimales',
                allowNegative: false,
                        decimalPrecision: 4
            }),
            renderer: crearToolTip
        }, {
            header: 'Enmarcamiento disponible',
            dataIndex: 'enmarcamientodisponible',
            sortable: true,
            align: 'left',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoDisponible,
            renderer: crearToolTip
        }
    ]);

    smGpComportamiento = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stCmblistarCentro = new Ext.data.Store({
        id: 'stCmblistarCentro',
        url: 'listarCentroBalanceEnmarcado',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idorgano'
            }, {
                name: 'denominacion'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function () {
            }
        }
    });
    filtrosComportamiento = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'denominacioncb',
                idcombo: 'cbplandirectofiltro',
                urlcb: 'listarCentroBalanceEnmarcado',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                idstore: 'stCmblistarCentro',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            },
            {
                type: 'numeric',
                dataIndex: 'enmarcamiento'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientodisponible'
            }]
    });

    tfTotalComportamiento = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'tfTotalComportamiento',
        width: 110,
        align: 'right',
        readOnly: true,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000.00'
    });
    tfTotalComportamientoCB = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'tfTotalComportamientoCB',
        width: 110,
        align: 'right',
        readOnly: true,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000.00'
    });

    gpComportamiento = new Ext.grid.EditorGridPanel({
        id: 'gpComportamiento',
        autoExpandColumn: 'idcmComportamiento',
        //title: perfil.etiquetas.lbComportamiento,
        store: stGpComportamiento,
        margins: '2 2 2 -4',
        width: 95,
        plugins: filtrosComportamiento,
        clicksToEdit: 2,
        sm: smGpComportamiento,
        cm: cmComportamiento,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            click: function () {
                if (gpComportamiento.getSelectionModel().getSelected().data.enmarcamiento != 0) {
                    gpViaAdq.getStore().reload({
                        params: {
                            limit: 20,
                            start: 0
                        }
                    });
                    // panelVia.enable();

                    panelVia.expand(true);
                    Ext.getCmp('ptViaAdq').setVisible(true);
                } else {
                    Ext.getCmp('ptViaAdq').setVisible(false);
                    stGpViaAdq.removeAll();
                    Ext.getCmp('tfTotalViaAdq').reset();
                    panelVia.collapse(true);
                    // panelVia.disable();
                }

            },
            afteredit: function (sm) {
                mymask.show();
                if (!entidadrectora) {
                    Ext.Ajax.request({
                        url: 'verificarEnmarcamiento',
                        params: {
                            identidadpadre: identidadpadreselected,
                            identidaddatosnomencladorcb: sm.record.data.identidaddatosnomencladorcb,
                            idejercicio: cbEjercicio.getValue(),
                            enmarcamientomodificado: sm.record.data.enmarcamiento,
                            enmarcamiento: sm.originalValue,
                            entidadrectora: identidadrectora
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 24) {
                                btnGuardarComportamiento.enable();
                                var addmod = false;
                                for (i = 0; i < campos_modificadoscomp.length; i++) {
                                    if (campos_modificadoscomp[i].identidaddatosnomencladorcb == sm.record.data.identidaddatosnomencladorcb) {
                                        campos_modificadoscomp[i].renmarcamiento = sm.record.data.enmarcamiento;
                                        addmod = true;
                                        break;
                                    }
                                }
                                if (!addmod) {
                                    campos_modificadoscomp.push({
                                        renmarcamiento: sm.record.data.enmarcamiento,
                                        rdenominacion: sm.record.data.denominacioncb,
                                        identidaddatosnomencladorcb: sm.record.data.identidaddatosnomencladorcb
                                    });
                                }
                                mymask.hide();
                            } else {
                                if (responseData.codMsg == 20) {
                                    mymask.hide();
                                    btnGuardarComportamiento.disable();
                                    mostrarMensaje(1, 'Su enmarcamiento disponible no es suficiente.');
                                    sm.record.reject();
                                }
                            }
                        }
                    });
                }
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptComportamiento',
            store: stGpComportamiento,
            displayInfo: true,
            items: ['-', btnLimpiarFiltrosComportamiento, '-', {
                    xtype: 'tbtext',
                    text: '&nbsp;&nbsp;<b>' + 'Total:&nbsp;' + '</b>'
                }, tfTotalComportamiento]
        })

    });


    jrstTgCB = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'idfila'
    }, [{
            name: 'idfila'
        }, {
            name: '_parent'
        }, {
            name: '_lft'
        }, {
            name: '_rgt'
        }, {
            name: '_is_leaf'
        }, {
            name: 'denominacion'
        }, {
            name: 'identidaddatosnomencladorod'
        }, {
            name: 'enmarcamiento'
        }, {
            name: 'idenmarcamiento'
        }, {
            name: 'enmarcamientodisponible'
        }, {
            name: 'enmarcamientodisponiblepadre'
        }, {
            name: 'identidaddatosnomencladorcb'
        }]);

    stTgCB = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarCBTG',
        listeners: {
            beforeload: function () {
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.identcb = identidadselected;
                this.baseParams.identidad = identidadselected;
                this.baseParams.identidadrectora = identidadrectora;

            },
            load: function () {
                Ext.getCmp('ptViaAdq').setVisible(false);
                stGpViaAdq.removeAll();
                Ext.getCmp('tfTotalViaAdq').reset();

                if (stTgCB.getTotalCount() == 0) {
                    stTgCB.removeAll();
                    Ext.getCmp('btnExportarComportamiento').disable();
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                } else
                    Ext.getCmp('btnExportarComportamiento').enable();
                var total = 0;
                for (i = 0; i < stTgCB.data.length; i++) {
                    if (stTgCB.getAt(i).data._parent == null)
                        total += parseFloat(stTgCB.getAt(i).data.enmarcamiento);
                }
                Ext.getCmp('tfTotalComportamientoCB').setValue(total);
            }
        },
        reader: jrstTgCB
    });


    cmCB = new Ext.grid.ColumnModel([
        {
            id: 'iddenorgano',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            align: 'left',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTipPadre
        }, {
            header: perfil.etiquetas.lbEnmarcamiento,
            dataIndex: 'enmarcamiento',
            sortable: true,
            align: 'left',
            editable: true,
            tooltip: perfil.etiquetas.lbEnmarcamiento,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 4
            }),
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEnmarcamientoDisponible,
            dataIndex: 'enmarcamientodisponible',
            width: 150,
            sortable: true,
            align: 'left',
            tooltip: perfil.etiquetas.lbEnmarcamientoDisponible,
            renderer: crearToolTip
        }
    ]);
    stCmblistarCB = new Ext.data.Store({
        id: 'stCmblistarCB',
        url: 'listarFiltroEntidades',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'text'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function () {
            }
        }
    });
    filtrosCB = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denominacion',
                idcombo: 'cbfiltroCB',
                urlcb: 'listarFiltrosEntidades',
                valueFieldcb: 'text',
                displayFieldcb: 'text',
                idstore: 'stCmblistarCB',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamiento'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientodisponible'
            }]
    });

    stCbPaginadoCB = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });

    cbPaginadoCB = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginadoCB,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function (cb, record, index) {
                Ext.getCmp('pgTreeGrid').pageSize = record.data.idnumpag;
                Ext.getCmp('pgTreeGrid').doLoad(Ext.getCmp('pgTreeGrid').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });


    smGpCB = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (x, y, w) {
            },
            rowdeselect: function (s, n, r) {

            }
        }
    });

    gpCB = new Ext.ux.maximgb.treegrid.GridPanel({
        id: 'gpCB',
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        title: perfil.etiquetas.lbTgCB,
        store: stTgCB,
        master_column_id: 'iddenorgano',
        sm: smGpCB,
        root_title: perfil.etiquetas.lbGpRootTitle,
        autoExpandColumn: 'iddenorgano',
        width: 95,
        stripeRows: true,
        cm: cmCB,
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stTgCB,
            displayInfo: false,
            items: ['-', btnLimpiarFiltrosCB, '-', {
                    xtype: 'tbtext',
                    text: '&nbsp;&nbsp;<b>' + 'Total:&nbsp;' + '</b>'
                }, tfTotalComportamientoCB],
            id: 'pgTreeGrid'
        }),
        md: new Ext.menu.Menu({// Menu de clic derecho para los elementos seleccionados
            id: 'md',
            items: [{
                    text: 'Modificar',
                    // icon: perfil.dirImg + 'modificar.png',
                    // iconCls: 'btn',
                    itemCls: 'x-menu-item icondistra-modificar ',
                    iconCls: 'imagen-none',
                    hidden: true,
                    id: 'modenmarcamiento',
                    handler: function () {
                        modificarEnmarcamienro();
                    }
                }]
        }),
        plugins: filtrosCB,
        listeners: {
            click: function () {
                if (gpCB.getSelectionModel().getSelected().data.enmarcamiento != 0) {
                    gpViaAdq.getStore().reload({
                        params: {
                            limit: 20,
                            start: 0
                        }
                    });
                    panelVia.collapse();
                    //     panelVia.enable();
                    Ext.getCmp('ptViaAdq').setVisible(true);
                } else {
                    Ext.getCmp('ptViaAdq').setVisible(false);
                    stGpViaAdq.removeAll();
                    Ext.getCmp('tfTotalViaAdq').reset();
                    //  panelVia.disable();
                    panelVia.collapse(true);
                }

            },
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                gpCB.getSelectionModel().selectRow(r);
                gpCB.md.showAt(e.getXY());
                if (smGpCB.getSelections().length == 1 && identidadlogueada == identidadrectora && identidadselected != identidadrectora) {
                    Ext.getCmp('modenmarcamiento').setVisible(true);
                } else {
                    Ext.getCmp('modenmarcamiento').setVisible(false);
                }

            }
        }
    });

    strComportamiento = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: 'strComportamiento'
        }, [{
                name: 'idcomportamiento'
            }, {
                name: 'comportamiento'
            }])
    });

    strComportamiento = [
        [1, 'Órgano demandante'], [2, 'Centro de balance']
    ];

    cmbComportamiento = new Ext.form.ComboBox({
        id: 'cmbComportamiento',
        store: strComportamiento,
        fieldLabel: 'Comportamiento',
        height: 40,
        width: 150,
        value: 1,
        displayField: 'comportamiento',
        hiddenName: 'idcomportamiento',
        valueField: 'idcomportamiento',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        loadingText: 'Cargando...',
        emptyText: 'Seleccione...',
        disabled: false,
        listeners: {
            select: function (combo, record, index) {
                if (record.data.value == 2) {
                    Ext.getCmp('treeComportamiento').loader = loaderTreetpCB;
                    Ext.getCmp('treeComportamiento').root.reload();
                    panelGeneral.layout.setActiveItem('gpCB');
                    stGpComportamiento.removeAll();
                    stTgCB.removeAll();
                    tfTotalComportamiento.reset();
                } else {
                    if (cmbComportamiento.value == 1) {
                        Ext.getCmp('treeComportamiento').loader = loaderTreetpOD;
                        Ext.getCmp('treeComportamiento').root.reload();
                        panelGeneral.layout.setActiveItem('gpComportamiento');
                        stGpComportamiento.removeAll();
                        stTgCB.removeAll();
                        tfTotalComportamientoCB.reset();

                    }
                }
                Ext.getCmp('btnExportarComportamiento').disable();
                Ext.getCmp('ptViaAdq').setVisible(false);
                stGpViaAdq.removeAll();
                Ext.getCmp('tfTotalViaAdq').reset();
            }
        }
    });

    treePComportamiento = new Ext.tree.TreePanel({
        id: 'treeComportamiento',
        titleCollapse: true,
        autoScroll: true,
        layout: 'fit',
        height: 200,
        border: false,
        rootVisible: false,
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function () {
                    treePComportamiento.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    treePComportamiento.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function () {
                    actualizarArbol(treePComportamiento);
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: perfil.etiquetas.lbFiltrarEnt,
                width: 110,
                id: 'idfiltroent',
                listeners: {
                    specialkey: function (t, e) {
                        if (e.getKey() == '13') {
                            buscarNodoTree(treePComportamiento, identidadselected, 'idfiltroent');
                            actualizarArbol(treePComportamiento);
                        }
                    }
                }
            }],
        listeners: {
            click: function (n, e) {
                gpCB.getColumnModel().setEditable(1, true);
                stTgCB.removeAll();
                if (n.id == n.attributes.entidadlogueada) {
                    gpComportamiento.getColumnModel().setEditable(1, false);
                    gpViaAdq.getColumnModel().setEditable(1, false);
                } else {
                    gpComportamiento.getColumnModel().setEditable(1, true);
                    gpViaAdq.getColumnModel().setEditable(1, true);
                }



                treePComportamiento.getSelectionModel().select(n);
                identidadselected = n.id;
                identidadlogueada = n.attributes.entidadlogueada;
                identidadrectora = n.attributes.entidadrectora;
                denominacionentidadselected = n.text;
                identidadpadreselected = n.attributes._parent;
                mymask.show();
                btnGuardarComportamiento.disable();
                btnGuardarViaAdq.disable();
                campos_modificadoscomp = [];
                if (cmbComportamiento.getValue() == 1) {
                    Ext.Ajax.request({
                        url: 'obtenerEntidadRectora',
                        params: {
                            identidad: identidadselected
                        },
                        callback: function (options, success, response) {
                            mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.data == true) {
                                entidadrectora = true;
                                stGpComportamiento.removeAll();
                            } else {
                                entidadrectora = false;
                            }

                            if (!n.attributes.identidaddatosnomenclador && !entidadrectora) {

                                gpComportamiento.hide();
                                Ext.getCmp('btnExportarComportamiento').disable();
                                mostrarMensaje(1, 'La entidad seleccionada no posee comportamiento Órgano demandante.');
                            } else
                            {
                                if (entidadrectora) {
                                    if (n.attributes.entidadlogueada == n.attributes.entidadrectora) {

                                        gpComportamiento.show();
                                        Ext.getCmp('btnExportarComportamiento').enable();
                                        stGpComportamiento.reload({
                                            params: {
                                                start: 0,
                                                limit: 20
                                            }
                                        });
                                    } else {
                                        Ext.getCmp('btnExportarComportamiento').disable();
                                    }
                                } else {

                                    gpComportamiento.show();
                                    Ext.getCmp('btnExportarComportamiento').enable();
                                    stGpComportamiento.reload({
                                        params: {
                                            start: 0,
                                            limit: 20
                                        }
                                    });
                                }
                            }
                        }
                    });

                } else {
                    if (n.attributes.id == n.attributes.entidadrectora) {
                        if (n.attributes.entidadlogueada == n.attributes.entidadrectora) {

                            stTgCB.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                        } else {
                            stTgCB.removeAll();
                            Ext.getCmp('btnExportarComportamiento').disable();
                        }
                    } else {
                        stTgCB.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                    mymask.hide();
                }
                Ext.getCmp('ptViaAdq').setVisible(false);
                stGpViaAdq.removeAll();
                Ext.getCmp('tfTotalViaAdq').reset();
            }
        },
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbEntidades,
            tipo: 0,
            id: '0'
        }),
        loader: loaderTreetpOD
    });

    btnExportarViaAdq = new Ext.Button({
        id: 'btnExportarViaAdq',
        // icon: perfil.dirImg + 'exportar.png',
        tooltip: perfil.etiquetas.lbBtnExportar,
        iconCls: 'exportar',
        disabled: true,
        text: perfil.etiquetas.lbBtnExportar,
        handler: function () {
            filtros = filtrosViaAdq.getFilterData();
            var win = window.open('exportarViaAdq?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue() +
                    '& identidad=' + identidadselected + '& denominacionentidad=' + denominacionentidadselected + '& identdatnomodpadre=' + identidadpadreselected);
        }
    });
    btnGuardarViaAdq = new Ext.Button({
        id: 'btnGuardarViaAdq',
        // icon: perfil.dirImg + 'guardar.png',
        disabled: true,
        iconCls: 'guardar',
        tooltip: 'Guardar enmarcamiento vía de adquisición',
        // text: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarVia();
        }
    });

    //Via Adquisicion
    btnLimpiarFiltrosViaAdq = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosViaAdq',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarfiltrosViaAdq();
        }
    });

    jrstGpViaAdq = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: "data"
    }, [{
            name: 'identidaddatosnomencladorod'
        }, {
            name: 'denominacionviaadquisicion'
        }, {
            name: 'enmarcamiento'
        }, {
            name: 'enmarcamientodisponible'
        }, {
            name: 'idviaadquisicion'
        }, {
            name: 'enmarcamientodisponiblepadre'
        }, {
            name: 'totalenmarcamiento'
        }, {
            name: 'sumatotal'
        }
    ]);

    stGpViaAdq = new Ext.data.Store({
        url: 'listarViaAdq',
        listeners: {
            load: function () {
                contadorsuma = 0;
                gpViaAdq.disabled = false;
                Ext.getCmp('ptViaAdq').setVisible(true);
                Ext.getCmp('tfTotalViaAdq').setValue(stGpViaAdq.reader.jsonData.totalenmarcamiento);
                siexisteViaAdqFiltrado();
                if (stGpViaAdq.data.length > 0)
                    Ext.getCmp('btnExportarViaAdq').enable();
                else
                    Ext.getCmp('btnExportarViaAdq').disable();
            },
            beforeload: function () {
                if (cmbComportamiento.getValue() == 1) {
                    this.baseParams.idenmarcamiento = gpComportamiento.getSelectionModel().getSelected().data.idenmarcamiento;
                } else {
                    this.baseParams.idenmarcamiento = gpCB.getSelectionModel().getSelected().data.idenmarcamiento;
                }
                this.baseParams.identidad = identidadselected;
                if (cmbComportamiento.getValue() == 1) {
                    this.baseParams.identidaddatosnomencladorod = null;
                    this.baseParams.idejercicio = cbEjercicio.getValue();
                    this.baseParams.identidaddatosnomencladorcb = gpComportamiento.getSelectionModel().getSelected().data.identidaddatosnomencladorcb;
                } else {
                    this.baseParams.identidaddatosnomencladorcb = null;
                    this.baseParams.idejercicio = cbEjercicio.getValue();
                    this.baseParams.identidaddatosnomencladorod = gpCB.getSelectionModel().getSelected().data.identidaddatosnomencladorod;
                }

            }
        },
        reader: jrstGpViaAdq
    });

    cmViaAdq = new Ext.grid.ColumnModel([
        {
            id: 'idcmViaAdq',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacionviaadquisicion',
            sortable: true,
            align: 'left',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTipPadre
        }, {
            header: perfil.etiquetas.lbEnmarcamiento,
            dataIndex: 'enmarcamiento',
            sortable: true,
            align: 'left',
            tooltip: perfil.etiquetas.lbEnmarcamiento,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 4
            }),
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEnmarcamientoDisponible,
            dataIndex: 'enmarcamientodisponible',
            sortable: true,
            align: 'left',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoDisponible,
            renderer: crearToolTip
        }
    ]);

    smGpViaAdq = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stCmblistarViaAdq = new Ext.data.Store({
        id: 'stCmblistarViaAdq',
        url: 'listarFiltrosViaAdq',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function () {
            }
        }
    });
    filtrosViaAdq = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denominacionviaadquisicion',
                idcombo: 'cbfiltroViaAdq',
                urlcb: 'listarFiltrosViaAdq',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                idstore: 'stCmblistarViaAdq',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }
            , {
                type: 'numeric',
                dataIndex: 'enmarcamiento'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientodisponible'
            }]
    });

    tfTotalViaAdq = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'tfTotalViaAdq',
        width: 110,
        align: 'right',
        readOnly: true,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000.00'
    });

    gpViaAdq = new Ext.grid.EditorGridPanel({
        id: 'gpViaAdq',
        enable: true, //collapsible:true,collapsed:true,
        autoExpandColumn: 'idcmViaAdq',
        title: perfil.etiquetas.lbViaAdq,
        store: stGpViaAdq,
        margins: '2 2 2 -4', //disabled:true,
        plugins: filtrosViaAdq,
        clicksToEdit: 2,
        sm: smGpViaAdq,
        cm: cmViaAdq,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            afteredit: function (sm) {
                sum = 0;

                for (i = 0; i < stGpViaAdq.data.length; i++) {
                    if (sm.record.data.idviaadquisicion == stGpViaAdq.getAt(i).data.idviaadquisicion) {
                        if (parseFloat(stGpViaAdq.getAt(i).data.enmarcamiento) != parseFloat(sm.originalValue)) {
                            diferencia = parseFloat(stGpViaAdq.getAt(i).data.enmarcamiento) - parseFloat(sm.originalValue);
                            contadorsuma += diferencia;
                        }
                    }
                }
                sumtotal = parseFloat(stGpViaAdq.getAt(0).data.sumatotal);
                sumaenmarcamientosvia = sumtotal + contadorsuma;

                mymask.show();
                if (!entidadrectora) {
                    if (cmbComportamiento.getValue() == 1) {
                        comportamientoselect = gpComportamiento.getSelectionModel().getSelected().data.enmarcamiento;
                    } else {
                        comportamientoselect = gpCB.getSelectionModel().getSelected().data.enmarcamiento;
                    }
                    Ext.Ajax.request({
                        url: 'verificarEnmarcamientoVia',
                        params: {
                            enmarcamientocb: comportamientoselect,
                            identidadpadre: identidadpadreselected,
                            disponiblepadre: sm.record.data.enmarcamientodisponiblepadre,
                            idejercicio: cbEjercicio.getValue(),
                            enmarcamientomodificado: sm.record.data.enmarcamiento,
                            enmarcamiento: sm.originalValue,
                            suma: sumaenmarcamientosvia,
                            entidadrectora: identidadrectora
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 24) {
                                if (btnGuardarComportamiento.hidden || btnGuardarComportamiento.disabled)
                                    btnGuardarViaAdq.enable();
                                var addmod = false;
                                for (i = 0; i < campos_modificados.length; i++) {
                                    if (campos_modificados[i].idviaadquisicion == sm.record.data.idviaadquisicion) {
                                        campos_modificados[i].renmarcamiento = sm.record.data.enmarcamiento;
                                        addmod = true;
                                        break;
                                    }
                                }
                                if (!addmod) {
                                    campos_modificados.push({
                                        renmarcamiento: sm.record.data.enmarcamiento,
                                        idvia: sm.record.data.idviaadquisicion
                                    });
                                }
                                mymask.hide();
                            } else {
                                if (responseData.codMsg == 20) {
                                    contadorsuma -= diferencia;
                                    mymask.hide();
                                    btnGuardarViaAdq.disable();
                                    mostrarMensaje(1, 'Su enmarcamiento disponible no es sufiente.');
                                    sm.record.reject();
                                }
                            }
                        }
                    });
                }
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptViaAdq',
            store: stGpViaAdq,
            displayInfo: false,
            items: ['-', btnLimpiarFiltrosViaAdq, '-', {
                    xtype: 'tbtext',
                    text: '&nbsp;&nbsp;<b>' + 'Total:&nbsp;' + '</b>'
                }, tfTotalViaAdq]
        })
    });


    panelVia = new Ext.Panel({
        frame: true, collapsible: true, collapseFirst: true,
        collapsed: true,
        region: 'east', width: 400,
        layout: 'fit',
        id: 'panelVia',
        tbar: ['-', btnGuardarViaAdq],
        items: [gpViaAdq]
    });

    panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'card',
        width: 900,
        activeItem: 0,
        id: 'panelGeneral',
        tbar: ['-', btnGuardarComportamiento],
        items: [gpComportamiento, gpCB]
    });

    panelCompVia = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelCompVia',
        items: [panelGeneral, panelVia]
    });

    ptestructuras = new Ext.Panel({
        title: 'Entidades',
        id: 'ptestructuras',
        region: 'west',
        collapsible: true,
        split: true,
        width: 200,
        layout: 'fit',
        items: treePComportamiento
    });

    pcomportamiento = new Ext.Panel({
        id: 'pcomportamiento',
        region: 'center',
        layout: 'border',
        tbar: ['Ejercicio:', ejercicio('pcomportamiento'), '-', 'Comportamiento:', cmbComportamiento, '-', btnExportarComportamiento, '->', btnAyu],
        items: [ptestructuras, panelCompVia]
    });

    pdatoscomportamiento = new Ext.Panel({
        id: 'pdatoscomportamiento',
        //title: 'Comportamiento',
        region: 'center',
        border: false,
        layout: 'fit',
        items: [pcomportamiento]/*,
         tbar: ['->', btnAyu]*/

    });

    /*
     * Componentes del grid para el Tab Via Adquisicion
     */


    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [pdatoscomportamiento]/*,
             tbar: ['->', btnAyu]*/
        })
    });

    // Fin paneles contenedores 


    function siexisteComportamientoFiltrado() {
        if (filtrosComportamiento.getFiltrosActivos().length > 0 && stGpComportamiento.getCount() == 0)
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
    }

    function siexisteViaAdqFiltrado() {
        if (filtrosViaAdq.getFiltrosActivos().length > 0 && stGpViaAdq.getCount() == 0)
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
    }

    function ejercicio(ctab) {
        stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
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
            id: 'cbEjercicio' + ctab,
            store: stCbejercicio,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            mode: 'local',
            allowBlank: true,
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            loadingText: 'Cargando...',
            width: 180,
            listeners: {
                select: function (cb, rec, index) {

                    if (cmbComportamiento.value == 1) {
                        gpComportamiento.getStore().reload({
                            params: {
                                limit: 20,
                                start: 0
                            }
                        });

                    } else {
                        stTgCB.getSelectionModel().clearSelections();
                        gpCB.getStore().reload({
                            params: {
                                limit: 20,
                                start: 0
                            }
                        });
                    }

                }

            }
        });
        return cbEjercicio;
    }
}
// fin de cargar interfaz

function buscarNodoTree(trEnt, idselected, idcampobusq, funct) {
    var rootNode = null;
    var idRootNode = null;
    if (idselected == null) {
        idRootNode = trEnt.getRootNode().firstChild.id;
        rootNode = trEnt.getNodeById(idRootNode);
        trEnt.getSelectionModel().select(rootNode);
    } else {
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
    }
    ;

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
    if (node != null) {
        trEnt.getSelectionModel().select(node);
        identidadselected = node.id;
        idEstructuraPadre = node.attributes.idEstructuraPadre;
        entidades_productoras = node.attributes.entidades_productoras;
        is_leaf = node.leaf;
        stNivActividad.reload();
    }

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

function guardarComportamiento() {
    if (campos_modificadoscomp.length > 0) {
        var camposmod = [];
        for (i = 0; i < campos_modificadoscomp.length; i++) {
            for (j = 0; j < jrstGpComportamiento.jsonData.total; j++) {
                if (campos_modificadoscomp[i].identidaddatosnomencladorcb == jrstGpComportamiento.jsonData.data[j].identidaddatosnomencladorcb) {
                    if (parseFloat(campos_modificadoscomp[i].renmarcamiento) != jrstGpComportamiento.jsonData.data[j].enmarcamiento) {
                        if (parseFloat(campos_modificadoscomp[i].renmarcamiento) > 0 && jrstGpComportamiento.jsonData.data[j].enmarcamiento == 0) {
                            camposmod.push({
                                accionaddmoddel: 'add',
                                renmarcamiento: parseFloat(campos_modificadoscomp[i].renmarcamiento),
                                rdenominacion: campos_modificadoscomp[i].rdenominacion,
                                identidaddatosnomencladorcb: campos_modificadoscomp[i].identidaddatosnomencladorcb
                            });
                            break;
                        } else {
                            if (parseFloat(campos_modificadoscomp[i].renmarcamiento) > 0 && jrstGpComportamiento.jsonData.data[j].enmarcamiento > 0) {
                                camposmod.push({
                                    accionaddmoddel: 'mod',
                                    renmarcamiento: campos_modificadoscomp[i].renmarcamiento,
                                    rdenominacion: campos_modificadoscomp[i].rdenominacion,
                                    identidaddatosnomencladorcb: campos_modificadoscomp[i].identidaddatosnomencladorcb
                                });
                                break;
                            } else {
                                if (parseFloat(campos_modificadoscomp[i].renmarcamiento) == 0 && jrstGpComportamiento.jsonData.data[j].enmarcamiento > 0) {
                                    camposmod.push({
                                        accionaddmoddel: 'del',
                                        renmarcamiento: campos_modificadoscomp[i].renmarcamiento,
                                        rdenominacion: campos_modificadoscomp[i].rdenominacion,
                                        identidaddatosnomencladorcb: campos_modificadoscomp[i].identidaddatosnomencladorcb
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (camposmod.length > 0) {
            mymask.show();
            Ext.Ajax.request({
                url: 'guardarComportamiento',
                params: {
                    identidaddatosnomencladorod: identidadselected,
                    identidadpadre: identidadpadreselected,
                    camposmod: Ext.encode(camposmod),
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        mostrarMensaje(1, 'El(los) enmarcamiento(s) asignado(s) ha(n) sido guardado(s) satisfactoriamente.');
                    } else {
                        if (responseData.codMsg == 20) {
                            mostrarMensaje(1, 'La entidad seleccionada no es Órgano Demandante.');
                        }
                    }
                    gpComportamiento.getStore().reload();
                    btnGuardarComportamiento.disable();
                    campos_modificadoscomp = [];
                }
            });
        } else {
            gpComportamiento.getStore().reload();
            btnGuardarComportamiento.disable();
            campos_modificadoscomp = [];
        }
    }
}


function guardarVia() {
    if (campos_modificados.length > 0) {
        var camposmod = [];
        for (i = 0; i < campos_modificados.length; i++) {
            for (j = 0; j < jrstGpViaAdq.jsonData.total; j++) {
                if (campos_modificados[i].idvia == jrstGpViaAdq.jsonData.data[j].idviaadquisicion) {
                    if (parseFloat(campos_modificados[i].renmarcamiento) != jrstGpViaAdq.jsonData.data[j].enmarcamiento) {
                        if (parseFloat(campos_modificados[i].renmarcamiento) > 0 && jrstGpViaAdq.jsonData.data[j].enmarcamiento == 0) {

                            camposmod.push({
                                accionaddmoddel: 'add',
                                renmarcamiento: parseFloat(campos_modificados[i].renmarcamiento),
                                rdenominacion: campos_modificados[i].rdenominacion,
                                idvia: campos_modificados[i].idvia
                            });
                            break;
                        } else {
                            if (parseFloat(campos_modificados[i].renmarcamiento) > 0 && jrstGpViaAdq.jsonData.data[j].enmarcamiento > 0) {
                                camposmod.push({
                                    accionaddmoddel: 'mod',
                                    renmarcamiento: campos_modificados[i].renmarcamiento,
                                    rdenominacion: campos_modificados[i].rdenominacion,
                                    idvia: campos_modificados[i].idvia
                                });
                                break;
                            } else {
                                if (parseFloat(campos_modificados[i].renmarcamiento) == 0 && jrstGpViaAdq.jsonData.data[j].enmarcamiento > 0) {
                                    camposmod.push({
                                        accionaddmoddel: 'del',
                                        renmarcamiento: campos_modificados[i].renmarcamiento,
                                        rdenominacion: campos_modificados[i].rdenominacion,
                                        idvia: campos_modificados[i].idvia
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (camposmod.length > 0) {
            mymask.show();
            if (cmbComportamiento.getValue() == 1) {
                comportamientoselect = gpComportamiento.getSelectionModel().getSelected().data.idenmarcamiento;
            } else {
                comportamientoselect = gpCB.getSelectionModel().getSelected().data.idenmarcamiento;
            }
            Ext.Ajax.request({
                url: 'guardarVia',
                params: {
                    identidaddatosnomencladorod: identidadselected,
                    camposmod: Ext.encode(camposmod),
                    idenmarcamiento: comportamientoselect
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        mostrarMensaje(1, 'El(los) enmarcamiento(s) asignado(s) ha(n) sido guardado(s) satisfactoriamente.');
                    } else {
                        if (responseData.codMsg == 20) {
                            mostrarMensaje(1, 'La entidad seleccionada no es Órgano Demandante.');
                        }
                    }
                    gpViaAdq.getStore().reload();
                    btnGuardarViaAdq.disable();
                    campos_modificados = [];
                }
            });
        } else {
            gpViaAdq.getStore().reload();
            btnGuardarViaAdq.disable();
            campos_modificados = [];
        }
    }
}

function crearToolTipPadre(v, m, t, g) {
    m.attr = 'ext:qtip="' + v + ' <br> <b>Enmarcamiento disponible padre:  <b>' + t.json.enmarcamientodisponiblepadre + '"';
    return v;
}

function limpiarfiltrosComportamiento() {
    control = 0;
    smGpComportamiento.clearSelections(true);
    if (!smGpComportamiento.getSelected())
        filtrosComportamiento.clearFilters();

}
function limpiarfiltrosComportamientoCB() {
    smGpCB.clearSelections(true);
    if (!smGpCB.getSelected())
        filtrosCB.clearFilters();
}


function limpiarfiltrosViaAdq() {
    filtrosViaAdq.clearFilters();
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function modificarEnmarcamienro() {

    enmarcamiento = new Ext.form.TextField({
        id: 'enmarcacb',
        xtype: 'numberfield',
        name: 'enmarcamiento',
        tabIndex: 11,
        fieldLabel: 'Enmarcamiento',
        anchor: '100%',
        maxLength: 255,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000.00',
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio

    });
    fp_mod_enmarcamiento = new Ext.FormPanel({
        id: 'fp_mod_enmarcamiento',
        region: 'center',
        autoHeight: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: [enmarcamiento]
                    }]

            }]
    });
    winModEnmarcamiento = new Ext.Window({
        modal: true,
        title: 'Modificar Enmarcamiento',
        layout: 'fit',
        width: 320,
        constrain: true,
        autoHeight: true,
        items: fp_mod_enmarcamiento,
        buttons: [{
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tabIndex: 14,
                id: 'idcancel',
                text: 'Cancelar',
                handler: function () {
                    winModEnmarcamiento.destroy();
                }
            }
            , {
                //  icon: perfil.dirImg + 'guardar.png',
                iconCls: 'guardar',
                tabIndex: 12,
                id: 'idaceptar',
                text: 'Guardar',
                handler: function () {
                    esValido();


                }
            }],
    });
    winModEnmarcamiento.show();
    Ext.getCmp('enmarcacb').setValue(gpCB.getSelectionModel().getSelected().data.enmarcamiento);
}
function esValido() {
    Ext.Ajax.request({
        url: 'verificarEnmarcamiento',
        params: {
            identidadpadre: gpCB.getSelectionModel().getSelected().data._parent,
            identidaddatosnomencladorcb: gpCB.getSelectionModel().getSelected().data.identidaddatosnomencladorcb,
            idejercicio: cbEjercicio.getValue(),
            enmarcamientomodificado: Ext.getCmp('enmarcacb').getValue(),
            enmarcamiento: gpCB.getSelectionModel().getSelected().data.enmarcamiento
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {

                modificarEnmarcamiento();
                mymask.hide();
            } else {
                if (responseData.codMsg == 20) {
                    mymask.hide();

                    mostrarMensaje(1, 'Su enmarcamiento disponible no es suficiente.');
                    gpCB.getSelectionModel().getSelected().reject();
                }
            }
        }
    });

}

function modificarEnmarcamiento() {

    var enmarcrowselect = gpCB.getSelectionModel().getSelected().data;
    var enmarcamientomod = Ext.getCmp('enmarcacb').getValue();
    var camposmod = [];

    if (parseFloat(enmarcamientomod) != enmarcrowselect.enmarcamiento) {
        if (enmarcamientomod > 0 && enmarcrowselect.enmarcamiento == 0) {
            camposmod.push({
                accionaddmoddel: 'add',
                renmarcamiento: parseFloat(enmarcamientomod),
                rdenominacion: enmarcrowselect.enmarcamiento,
                identidaddatosnomencladorcb: enmarcrowselect.identidaddatosnomencladorcb
            });

        } else {
            if (parseFloat(enmarcamientomod) > 0 && enmarcrowselect.enmarcamiento > 0) {
                camposmod.push({
                    accionaddmoddel: 'mod',
                    renmarcamiento: parseFloat(enmarcamientomod),
                    rdenominacion: enmarcrowselect.enmarcamiento,
                    identidaddatosnomencladorcb: enmarcrowselect.identidaddatosnomencladorcb
                });

            } else {
                if (parseFloat(enmarcamientomod) == 0 && enmarcrowselect.enmarcamiento > 0) {
                    camposmod.push({
                        accionaddmoddel: 'del',
                        renmarcamiento: parseFloat(enmarcamientomod),
                        rdenominacion: enmarcrowselect.enmarcamiento,
                        identidaddatosnomencladorcb: enmarcrowselect.identidaddatosnomencladorcb
                    });

                }
            }
        }
    }




    if (camposmod.length > 0) {
        mymask.show();
        Ext.Ajax.request({
            url: 'guardarComportamiento',
            params: {
                identidaddatosnomencladorod: gpCB.getSelectionModel().getSelected().data.idfila,
                identidadpadre: identidadpadreselected,
                camposmod: Ext.encode(camposmod),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    mostrarMensaje(1, 'El enmarcamiento asignado ha sido guardado satisfactoriamente.');
                    winModEnmarcamiento.destroy();
                }

                var rec = gpCB.getStore().getById(gpCB.getSelectionModel().getSelected().data.idfila);
                gpCB.getStore().reload({
                    params: {
                        anode: null,
                        start: 0,
                        limit: 20
                    },
                    callback: function ()
                    {
                        if (rec.data._is_leaf == true && rec.data._parent != null)
                        {
                            var recparent = gpCB.getStore().getById(rec.data._parent);
                            gpCB.getStore().collapseNode(recparent);
                            gpCB.getStore().setNodeLoaded(recparent, false);
                            gpCB.getStore().expandNode(recparent);
                        }
                    }
                });

                campos_modificados = [];
            }
        });
    } else {
        winModEnmarcamiento.destroy();

        campos_modificados = [];
    }

}
function formato_numero(numero, decimales, separador_decimal, separador_miles) {

    numero = parseFloat(numero);
    if (decimales !== undefined) {
        // Redondeamos        
        numero = numero.toFixed(decimales);
    }
    //Convertimos el punto en separador_decimal    
    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
    if (separador_miles) {
        // Añadimos los separadores de miles      
        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (miles.test(numero)) {
            numero = numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }
    return numero;
}

//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyuda;
//    var referencia = 'Enmarcamiento';//esto puede ser el id del boton o cualquier cosa 
//    help.show(title, referencia);
//}
