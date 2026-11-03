var adicionar = true, offsetNae = 0, offsetOG = 0;
var winAdd, ctrladd = true, cfgridpanel, fsMod, fsEncabesado;
var tempTipoModeloSeleccionado = 0;
var urlListarConsolidacion = 'listarConsolidacion';
var urlListarIndModelo = '../gestmodelo/listarIndModelo';
var urlListar = '../gestmodelo/listarIndModelo';

var baseUrl = '../gestmodelo/';
var urlCbUM = '../gestmodelo/cargarunidadmedida';
var urlCbVA = '../gestmodelo/cargarviaadquision';
var urlCbOS = '../gestmodelo/cargarorganosatisface';
var urlCbPais = '../gestmodelo/listarPais';
var urlCbCentBalance = '../gestmodelo/listarCentroBalance';
var urlListarVerActXInd = '../gestmodelo/listarVerActXInd';
var cantidad = 0, precio = 0.000000, preciodivisa = 0.000000, fila, columna, jrStGpGestModelo;
var combNomencOld, combNomencNew, combNomenc, btnLimpiarFiltros, nfImporte, col;
var global_tree = 2;
var winAsociar, obj, sel, gpModelo, cmGp, entro, sel_, entro_, antedit, despedit, desaprobar, aprobarajuste;
var importes = [];
var puedeadicionar = 0; //variable para adicionar o no segun la configuracion de los permisos
var dinamica = 0; //variable para adicionar o no segun la configuracion de los permisos
var puedemodificar = 0; //variable para modificar o no segun la configuracion de los permisos
var puedeeliminar = 0; //variable para eliminar o no segun la configuracion de los permisos
var puedeguardar = 0; //variable para guardar o no segun la configuracion de los permisos
var ocultar = true;
var maskPlan;
var winImp;
var offset = 0, tabla, columnasdinamicas, campos, coldin, offsetdin = 0;
var arrayIndexDinamicos = new Array();
var almacen;
var mymask = new Ext.LoadMask(
        Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
});
iniciaModelo = function() {
    Ext.Ajax.timeout = 100000000;

    /* stGpGestModelo = new Ext.data.Store({
     url: urlListar,
     listeners: {
     beforeLoad: function() {
     Ext.Ajax.timeout = 600000; //10min
     stGpGestModelo.removeAll();
     this.baseParams.consolid = consolidado;
     this.baseParams.hoja = eshoja;
     this.baseParams.idmodelo = treesel;
     this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
     },
     load: function() {
     smGpGestModelo.selectFirstRow();
     calcularImporteTotal();
     if (puedeadicionar == 1 || puedemodificar == 1 || puedeeliminar == 1 || puedeguardar == 1) {
     ocultar = false;
     }
     if (alert(objci.acciones.rector)) {
     Ext.getCmp('btnAdicionarInds').disable();
     }
     
     
     }
     
     },
     reader: new Ext.data.JsonReader({
     totalProperty: 'total',
     root: 'data',
     id: 'idplanificacion'
     }, [{
     name: 'idindicador'
     }, {
     name: 'idplanificacion'
     }, {
     name: 'denominacion'
     }, {
     name: 'codigo'
     }, {
     name: 'idaprobaciondemanda'
     }, {
     name: 'generadobasesplan'
     }, {
     name: 'estado'
     }, {
     name: 'idformato'
     }, {
     name: 'idpais'
     }, {
     name: 'idcentrobalance'
     }, {
     name: 'nivel'
     }, {
     name: 'descripcion'
     }, {
     name: 'naturaleza'
     }, {
     name: 'precio'
     }, {
     name: 'preciodivisa'
     }, {
     name: 'idumedida'
     }, {
     name: 'numeropieza'
     }, {
     name: 'flete'
     }, {
     name: 'contingencia'
     }, {
     name: 'viaadquisicion'
     }, {
     name: 'organosatisface'
     }, {name: 'idunidadmedida'}
     
     ])
     });*/
    tfImportePlan = new Ext.form.TextField({
        id: 'idtfImportePlan',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        emptyText: '0.000'
    });
    tfcantidadfinal = new Ext.form.TextField({
        id: 'idtfcantidadfinal',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        emptyText: '0.000'
    });
    stCbImportesPlan = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporteMNTotal],
            [3, perfil.etiquetas.lbImporteFlete],
            [4, perfil.etiquetas.lbImporteConti],
            [5, perfil.etiquetas.lbImporteAjuste],
            [6, perfil.etiquetas.lbImporteFinal]
        ]
    });
    cbImportesPlan = new Ext.form.ComboBox({
        value: 1,
        id: 'idcbImportesPlan',
        store: stCbImportesPlan,
        displayField: 'denominacion',
        typeAhead: true,
        listWidth: 100,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 80,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                tfImportePlan.setValue(importes[record.data.idimporte]);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    /*btnLimpiarFiltros = new Ext.Button({
     id: 'btntodoslimp',
     //icon: perfil.dirImg + 'limpiar.png',
     iconCls: 'limpiar',
     tooltip: perfil.etiquetas.lbLimpiar,
     handler: function() {
     filtros.clearFilters();
     stGpGestModelo.reload();
     }
     });*/
    btnLimpiarFiltrosDemanda = new Ext.Button({
        id: 'btntodos',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        // text: perfil.etiquetas.lbLimpiarFiltros,
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosGpdemandacentrobalance.clearFilters();
            stCmbEspecialidad.reload();
        }
    });

    btnLimpiarFiltrosVerAct = new Ext.Button({
        id: 'btnLimpiarFiltrosVerAct',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        //text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)',
        handler: function() {
            filtrosGpVerAct.clearFilters();
        }
    });
    /* if (objci.acciones.rector) {
     pgGestModelo = new Ext.PagingToolbar({
     pageSize: 20,
     id: 'pagGpModelo',
     store: stGpGestModelo,
     displayInfo: true,
     items: [btnLimpiarFiltros, '-', cbImportesPlan, {
     xtype: 'tbtext',
     text: '<b>:</b>'
     }, tfImportePlan]
     });
     } else {
     pgGestModelo = new Ext.PagingToolbar({
     pageSize: 20,
     id: 'pagGpModelo',
     store: stGpGestModelo,
     displayInfo: true,
     items: [btnLimpiarFiltros, '-', cbImportesPlan, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', {
     xtype: 'tbtext',
     text: '<b>:</b>'
     }, tfImportePlan]
     });
     }*/

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };


    // Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    /* filtros = new Ext.grid.GridFilters({
     filters: [{
     type: 'string',
     dataIndex: 'codigo'
     }, {
     type: 'string',
     dataIndex: 'numeropieza'
     }, {
     type: 'string',
     dataIndex: 'denominacion'
     },
     {
     type: 'listado',
     dataIndex: 'umedida',
     idcombo: 'idumedidaindicadores',
     urlcb: urlCbUM,
     mode: 'remote',
     idstore: 'idstumedidaindicadores',
     valueFieldcb: 'idunidadmedida',
     displayFieldcb: 'denominacionunidadmedida',
     autoload: false
     
     }, {
     type: 'listado',
     dataIndex: 'centrobalance',
     idcombo: 'idcbcentrobalancenorma',
     urlcb: urlCbCentBalance,
     idstore: 'idstcentrobalancenorma',
     valueFieldcb: 'idcentrobalance',
     displayFieldcb: 'centrobalance',
     tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
     }
     , {
     type: 'listado',
     dataIndex: 'pais',
     idcombo: 'idcbpaisnorma',
     urlcb: urlCbPais,
     idstore: 'idstpais',
     valueFieldcb: 'idpais',
     displayFieldcb: 'nombrepais',
     autoload: false,
     mode: 'remote'
     }, {
     type: 'list',
     dataIndex: 'idaprobaciondemanda',
     options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
     }, {
     type: 'numeric',
     dataIndex: 'precio'
     }, {
     type: 'numeric',
     dataIndex: 'preciodivisa'
     }, {
     type: 'numeric',
     dataIndex: 'cantidad'
     }, {
     type: 'numeric',
     dataIndex: 'ajuste'
     }, {
     type: 'numeric',
     dataIndex: 'cantidadfinal'
     }, {
     type: 'numeric',
     dataIndex: 'importe'
     }, {
     type: 'numeric',
     dataIndex: 'importeajustado'
     }, {
     type: 'numeric',
     dataIndex: 'importefinal'
     }, {
     type: 'numeric',
     dataIndex: 'importedivisa'
     }, {
     type: 'list',
     dataIndex: 'generadobasesplan',
     options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbAfectada]
     }, {
     type: 'numeric',
     dataIndex: 'flete'
     }, {
     type: 'numeric',
     dataIndex: 'contingencia'
     }, {
     type: 'listado',
     dataIndex: 'viaadquisicion',
     idcombo: 'idviaadquisicionc',
     urlcb: urlCbVA,
     mode: 'remote',
     idstore: 'idstvia',
     valueFieldcb: 'idviaadquisicion',
     displayFieldcb: 'denominacion',
     autoload: false
     }, {
     type: 'string',
     dataIndex: 'organosatisface'
     }
     ]
     });*/
    //cmGpGestMdelo = new Ext.grid.ColumnModel([]);
    /* smGpGestModelo = new Ext.grid.RowSelectionModel({
     singleSelect: false,
     listeners: {
     rowselect: function(x, y, w) {
     if (objci.acciones.rector || eshoja == 0 || smGpGestModelo.getSelected().get('idaprobaciondemanda') > 1)
     gpModelo.getColumnModel().setEditable(8, false);
     else
     gpModelo.getColumnModel().setEditable(8, true);
     if (objci.acciones.rector || eshoja == 0 || smGpGestModelo.getSelected().get('idaprobaciondemanda') != 4)
     gpModelo.getColumnModel().setEditable(9, false);
     else
     gpModelo.getColumnModel().setEditable(9, true);
     if (smGpGestModelo.getSelections().length == 0) {
     habilitarDesabilitar(false);
     habilitarDesabilitarAprobacionAjuste(false);
     } else {
     habilitarDesabilitar(true);
     habilitarDesabilitarAprobacionAjuste(true);
     }
     if (smGpGestModelo.getSelections().length != 0) {
     if (smGpGestModelo.getSelected().get('generadobasesplan') != 0) {
     Ext.getCmp('btnVerAct').enable();
     } else {
     Ext.getCmp('btnVerAct').disable();
     }
     } else {
     Ext.getCmp('btnVerAct').disable();
     }
     
     
     
     },
     rowdeselect: function(s, n, r) {
     if (smGpGestModelo.getSelections().length == 0) {
     habilitarDesabilitar(false);
     habilitarDesabilitarAprobacionAjuste(false);
     } else {
     habilitarDesabilitar(true);
     habilitarDesabilitarAprobacionAjuste(true);
     }
     if (smGpGestModelo.getSelections().length != 0) {
     if (smGpGestModelo.getSelected().get('generadobasesplan') != 0) {
     Ext.getCmp('btnVerAct').enable();
     } else {
     Ext.getCmp('btnVerAct').disable();
     }
     } else {
     Ext.getCmp('btnVerAct').disable();
     }
     }
     }
     });*/
    btnExportar = new Ext.Button({
        disabled: false,
        id: 'btnExportar',
        hidden: false,
        // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: 'Exportar indicadores del plan.(ALt+E)',
        //text: 'Exportar',
        handler: function() {
            var selectedEntity = tpBaseEstructura.selModel.getSelectedNode().text;
            var selectedPlan = tpBasePlan.selModel.getSelectedNode().text;
            var win = window.open('exportar?entidad=' + selectedEntity + '&glob=' + Ext.getCmp('chkglobalP').getValue() + '&plan=' + selectedPlan + '&idejercicio=' + cbEjercicio.getValue() + '&hoja=' + eshoja + '& idmodelo=' + treesel + '& identidadmodelo=' + tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo + '& identidad=' + identidadselected + '& filtros=' + Ext.encode(filtros.getFilterData()));
        }
    });
    /**************IMPORTAR*************************************/
    btnImportar = new Ext.Button({
        id: 'btnImportar',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportar,
        disabled: true,
        handler: function() {
            winFp('Imp');
        }
    });

    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscar',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                fieldLabel: perfil.etiquetas.lbCargarDoc,
                name: 'file',
                id: 'form-file',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ':',
                    id: 'idbutton',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });

    function winFp(opcion) {
        switch (opcion) {
            case 'Imp':
                {
                    if (!winImp) {
                        winImp = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            constrain: true,
                            layout: 'fit',
                            title: perfil.etiquetas.lbImportarExcel,
                            width: 400,
                            height: 150,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    text: perfil.etiquetas.lbBtnCancelar,
                                    tooltip: perfil.etiquetas.lbTtbtnCancelar,
                                    handler: function() {
                                        winImp.hide();
                                    }
                                }, {
                                    iconCls: 'aceptar',
                                    text: perfil.etiquetas.lbBtnAceptar,
                                    tooltip: perfil.etiquetas.lbTtbtnAceptar,
                                    handler: function() {
                                        importarPlan();
                                    }
                                }]
                        });
                    }
                    Ext.getCmp('idFpBuscar').getForm().reset();
                    winImp.show();
                    winImp.add(fpbuscar);
                    winImp.doLayout();

                }
                break;
        }
    }

    function importarPlan() {
        try {
            if (fpbuscar.getForm().isValid())
            {
                var barra = Ext.MessageBox.show({
                    msg: perfil.etiquetas.lbEspere,
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false
                });
                btnCerrarWin = new Ext.Button({
                    text: 'Cerrar',
                    disabled: true,
                    id: 'btn',
                    tooltip: 'Cerrar',
                    iconCls: 'aceptar'
                });

                fpbuscar.getForm().submit(
                        {
                            url: 'importarfichero',
                            timeout: 1800000, //milisegundos = 30 min
                            method: 'POST',
                            params: {
                                idconcepto: 9,
                                idejercicio: cbEjercicio.getValue(),
                                idmodelo: treesel,
                                identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                                idtipomodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idtipomodelo

                            },
                            failure: function(form, action) {
                                barra.hide();
                                winImp.hide();
                                coldin = action.result.columnasdinamicas;

                                Fila = Ext.data.Record.create([
                                    {
                                        name: 'denomcolumna',
                                        type: 'string'
                                    },
                                    {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    },
                                    {
                                        name: 'denomtipocolumna',
                                        type: 'string'
                                    },
                                    {
                                        name: 'relacion',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicion',
                                        type: 'numeric'
                                    },
                                    {
                                        name: 'nombre',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicionTM',
                                        type: 'numeric'
                                    }]);

                                FilaTipMod = Ext.data.Record.create([
                                    {
                                        name: 'denomcolumna',
                                        type: 'string'
                                    },
                                    {
                                        name: 'denomtipocolumna',
                                        type: 'string'
                                    },
                                    {
                                        name: 'denominacion',
                                        type: 'string'
                                    },
                                    {
                                        name: 'nombre',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicionTM',
                                        type: 'numeric'
                                    }]);

                                FilaExcel = Ext.data.Record.create([
                                    {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicion',
                                        type: 'numeric'
                                    }]);


                                btnAsociarOrden = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAsociarOrden',
                                    tooltip: perfil.etiquetas.lbRelColOrden,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:50px',
                                    icon: perfil.dirImg + 'incluir.png',
                                    iconCls: 'btn',
                                    handler: function() {
                                        addRelacionTodas();
                                    }
                                });

                                btnSiguiente = new Ext.Button({
                                    disabled: true,
                                    id: 'btnsiguiente',
                                    tooltip: perfil.etiquetas.lbRelCol,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                    icon: perfil.dirImg + 'siguiente.png',
                                    iconCls: 'btn',
                                    handler: function() {
                                        addRelacion();
                                    }
                                });

                                btnAnterior = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAnterior',
                                    tooltip: perfil.etiquetas.lbelimRel,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:10px',
                                    icon: perfil.dirImg + 'anterior.png',
                                    iconCls: 'btn',
                                    handler: function() {
                                        eliminarnom();
                                    }
                                });

                                btnDesociarTodas = new Ext.Button({
                                    disabled: true,
                                    id: 'btnDesociarTodas',
                                    tooltip: perfil.etiquetas.lbelimRels,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                    icon: perfil.dirImg + 'deshacer.png',
                                    iconCls: 'btn',
                                    handler: function() {
                                        eliminarnomTodas();
                                    }
                                });

                                //grid panel para columnas segun tipo de modelo
                                stNomen = new Ext.data.SimpleStore({
                                    fields: ['denomcolumna', 'denomtipocolumna', 'denominacion', 'nombre', 'posicionTM'],
                                    data: action.result.columnas,
                                    sorters: [{
                                            property: 'posicionTM',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicionTM',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });
                                cmNomencladores = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
                                        dataIndex: 'denomcolumna',
                                        sortable: true,
                                        renderer: crearToolTip
                                    },
                                    {
                                        header: perfil.etiquetas.lbTipDato,
                                        tooltip: perfil.etiquetas.lbTipDato,
                                        width: 150,
                                        dataIndex: 'denomtipocolumna',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);

                                smNomencladores = new Ext.grid.RowSelectionModel({
                                    singleSelect: true
                                });
                                smNomencladores.on('selectionchange', function(sm) {
                                    if (sm.getSelections().length == 1 && smNomencladoresExcel.getSelections().length == 1 && stNomen.getCount() <= stNomenExcel.getCount()) {
                                        btnSiguiente.enable();
                                    } else {
                                        btnSiguiente.disable();
                                    }
                                });
                                gpNomencladores = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbEspere
                                    },
                                    store: stNomen,
                                    sm: smNomencladores,
                                    cm: cmNomencladores,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%'
                                });

                                pgpNomencladores = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: perfil.etiquetas.lbColTM,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '95%',
                                    layout: 'fit',
                                    items: [gpNomencladores]

                                });

                                //grid panel para columnas del excel
                                stNomenExcel = new Ext.data.SimpleStore({
                                    fields: ['denomcolumnaExcel', 'posicion'],
                                    data: action.result.columnasExcel,
                                    sorters: [{
                                            property: 'posicion',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicion',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });

                                cmNomencladoresExcel = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
                                        dataIndex: 'denomcolumnaExcel',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);

                                smNomencladoresExcel = new Ext.grid.RowSelectionModel({
                                    singleSelect: true
                                });
                                smNomencladoresExcel.on('selectionchange', function(sm) {
                                    if (sm.getSelections().length == 1 && smNomencladores.getSelections().length == 1 && stNomen.getCount() <= stNomenExcel.getCount()) {
                                        btnSiguiente.enable();
                                    } else {
                                        btnSiguiente.disable();
                                    }
                                });
                                gpNomencladoresExcel = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbEspere
                                    },
                                    store: stNomenExcel,
                                    sm: smNomencladoresExcel,
                                    cm: cmNomencladoresExcel,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%'
                                });

                                pgpNomencladoresExcel = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: perfil.etiquetas.lbColExcel,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '100%',
                                    layout: 'fit',
                                    items: [gpNomencladoresExcel]
                                });

                                //grid panel para relacionar columnas
                                stNomenRelacion = new Ext.data.Store({
                                    enableKeyEvents: true,
                                    reader: new Ext.data.JsonReader({
                                        root: 'data'
                                    }, [{
                                            name: 'denomcolumna'
                                        }, {
                                            name: 'denomcolumnaExcel'
                                        }, {
                                            name: 'denomtipocolumna'
                                        }, {
                                            name: 'relacion'
                                        }, {
                                            name: 'posicion'
                                        }, {
                                            name: 'nombre'
                                        }, {
                                            name: 'posicionTM'
                                        }]),
                                    sorters: [{
                                            property: 'posicionTM',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicionTM',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });
                                cmNomencladoresRelacion = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
                                        dataIndex: 'relacion',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);

                                smNomencladoresRelacion = new Ext.grid.RowSelectionModel({
                                    singleSelect: false
                                });
                                smNomencladoresRelacion.on('selectionchange', function(sm) {
                                    if (sm.getSelections().length != 0) {
                                        btnAnterior.enable();
                                    } else {
                                        btnAnterior.disable();
                                    }
                                });
                                gpNomencladoresRelacion = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbEspere
                                    },
                                    store: stNomenRelacion,
                                    sm: smNomencladoresRelacion,
                                    cm: cmNomencladoresRelacion,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%', listeners: {
                                        rowdblclick: function() {
                                            eliminarnom();
                                        }
                                    }
                                });

                                pgpNomencladoresRelacion = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: perfil.etiquetas.lbColRel,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '100%',
                                    layout: 'fit',
                                    items: [gpNomencladoresRelacion]

                                });

                                pRelacionarColumnas = new Ext.Panel({
                                    labelAlign: 'top',
                                    height: 300,
                                    width: 800,
                                    frame: true,
                                    layout: 'form',
                                    items: [{
                                            layout: 'column',
                                            items: [{
                                                    columnWidth: .40,
                                                    layout: 'form',
                                                    items: [pgpNomencladores]
                                                },
                                                {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresExcel]
                                                },
                                                {
                                                    columnWidth: .06,
                                                    layout: 'form',
                                                    items: [btnAsociarOrden, btnSiguiente, btnAnterior, btnDesociarTodas]
                                                },
                                                {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresRelacion]
                                                }]
                                        }]

                                });
                                winRelacionarColumnas = new Ext.Window({
                                    modal: true,
                                    id: 'winRelacionarColumnas',
                                    closeAction: 'destroy',
                                    layout: 'fit',
                                    constrain: true,
                                    items: [pRelacionarColumnas],
                                    title: perfil.etiquetas.lbRelCol,
                                    buttons: [{
                                            icon: perfil.dirImg + 'cancelar.png',
                                            iconCls: 'btn',
                                            text: perfil.etiquetas.lbBtnCancelar,
                                            tooltip: perfil.etiquetas.lbTtbtnCancelar,
                                            handler: function() {
                                                winRelacionarColumnas.destroy();
                                            }
                                        }, {
                                            icon: perfil.dirImg + 'validar.png',
                                            iconCls: 'btn',
                                            id: 'btnValidar',
                                            disabled: true,
                                            text: perfil.etiquetas.lbValidar,
                                            tooltip: perfil.etiquetas.lbValidarD,
                                            handler: function() {
                                                mymask.show();
                                                var rel = stNomenRelacion.getRange();
                                                var relaciones = [];
                                                for (var index = 0; index < stNomenRelacion.getCount(); index++) {
                                                    relaciones.push({
                                                        denomcolumna: rel[index].data.denomcolumna,
                                                        denomtipocolumna: rel[index].data.denomtipocolumna,
                                                        denomcolumnaExcel: rel[index].data.denomcolumnaExcel,
                                                        posicion: rel[index].data.posicion,
                                                        nombre: rel[index].data.nombre
                                                    });
                                                }
                                                ;

                                                Ext.Ajax.request({
                                                    url: 'importarDatosRelacionados',
                                                    params: {
                                                        coldin: Ext.encode(coldin),
                                                        relaciones: Ext.encode(relaciones),
                                                        identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                                                        idejercicio: cbEjercicio.getValue(),
                                                        tipoplan: tpBasePlan.getSelectionModel().getSelectedNode().attributes.tipoplan,
                                                        idtipomodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idtipomodelo
                                                    },
                                                    callback: function(options, success, response) {
                                                        winRelacionarColumnas.destroy();
                                                        response = Ext.decode(response.responseText);
                                                        columnasdinamicas = response.columnasdinamicas;
                                                        tabla = response.tabla;
                                                        campos = response.campos;
                                                        columnasdinamicasindex = response.columnasdinamicasindex;
                                                        columnasdinamicasfiltro = response.tipofilc;
                                                        mostrarResultadoValidacion();
                                                    }
                                                });
                                            }
                                        }]
                                });
                                winRelacionarColumnas.show();
                                if (stNomen.getCount() <= stNomenExcel.getCount())
                                    btnAsociarOrden.enable();
                                if (stNomenRelacion.getCount() != 0)
                                    btnDesociarTodas.enable();
                            }

                        }

                );
            } else
                mostrarMensaje(1,
                        perfil.etiquetas.lbCamposIncorrectos);

        } catch (e) {
        }
    }

    function  addRelacion() {
        var recordSel = smNomencladores.getSelections();
        var recordSelExc = smNomencladoresExcel.getSelections();

        stNomen.remove(recordSel[0]);
        stNomenExcel.remove(recordSelExc[0]);

        var p = new Fila({
            denomcolumna: recordSel[0].data.denomcolumna,
            denomtipocolumna: recordSel[0].data.denomtipocolumna,
            nombre: recordSel[0].data.nombre,
            posicionTM: recordSel[0].data.posicionTM,
            denomcolumnaExcel: recordSelExc[0].data.denomcolumnaExcel,
            posicion: recordSelExc[0].data.posicion,
            relacion: recordSel[0].data.denomcolumna + " / " + recordSelExc[0].data.denomcolumnaExcel
        });

        stNomenRelacion.add(p);

        stNomenRelacion.sort('posicionTM', 'ASC');
        stNomen.sort('posicionTM', 'ASC');
        stNomenExcel.sort('posicion', 'ASC');

        if (stNomen.getCount() == 0)
            Ext.getCmp('btnValidar').enable();

        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();

        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function  addRelacionTodas() {
        var records = stNomen.getRange();
        var recordsExcel = stNomenExcel.getRange();
        var contador = stNomen.getCount();

        for (var index = 0; index < contador; index++) {
            var p = new Fila({
                denomcolumna: records[index].data.denomcolumna,
                denomtipocolumna: records[index].data.denomtipocolumna,
                nombre: records[index].data.nombre,
                posicionTM: records[index].data.posicionTM,
                denomcolumnaExcel: recordsExcel[index].data.denomcolumnaExcel,
                posicion: recordsExcel[index].data.posicion,
                relacion: records[index].data.denomcolumna + " / " + recordsExcel[index].data.denomcolumnaExcel
            });

            stNomenRelacion.add(p);
            stNomen.remove(records[index]);
            stNomenExcel.remove(recordsExcel[index]);
        }

        stNomenRelacion.sort('posicionTM', 'ASC');
        stNomen.sort('posicionTM', 'ASC');
        stNomenExcel.sort('posicion', 'ASC');

        if (stNomen.getCount() == 0)
            Ext.getCmp('btnValidar').enable();

        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();

        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function eliminarnom() {
        var recordsSel = smNomencladoresRelacion.getSelections();

        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                var recordSel = recordsSel[i];
                var pTipMod = new FilaTipMod({
                    denomcolumna: recordSel.data.denomcolumna,
                    denomtipocolumna: recordSel.data.denomtipocolumna,
                    denominacion: recordSel.data.denominacion,
                    nombre: recordSel.data.nombre,
                    posicionTM: recordSel.data.posicionTM
                });

                stNomen.add(pTipMod);

                var pExcel = new FilaExcel({
                    denomcolumnaExcel: recordSel.data.denomcolumnaExcel,
                    posicion: recordSel.data.posicion
                });
                stNomenExcel.add(pExcel);
                stNomenRelacion.remove(recordSel);
            }

            if (stNomen.getCount() != 0)
                Ext.getCmp('btnValidar').disable();
        }

        stNomenRelacion.sort('posicionTM', 'ASC');
        stNomen.sort('posicionTM', 'ASC');
        stNomenExcel.sort('posicion', 'ASC');

        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();

        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function eliminarnomTodas() {
        var records = stNomenRelacion.getRange();
        var contador = stNomenRelacion.getCount();

        for (var i = 0; i < contador; i++) {

            var pTipMod = new FilaTipMod({
                denomcolumna: records[i].data.denomcolumna,
                denomtipocolumna: records[i].data.denomtipocolumna,
                denominacion: records[i].data.denominacion,
                nombre: records[i].data.nombre,
                posicionTM: records[i].data.posicionTM
            });

            stNomen.add(pTipMod);

            var pExcel = new FilaExcel({
                denomcolumnaExcel: records[i].data.denomcolumnaExcel,
                posicion: records[i].data.posicion
            });

            stNomenExcel.add(pExcel);
            stNomenRelacion.remove(records[i]);
        }

        stNomenRelacion.sort('posicionTM', 'ASC');
        stNomen.sort('posicionTM', 'ASC');
        stNomenExcel.sort('posicion', 'ASC');

        if (stNomen.getCount() != 0)
            Ext.getCmp('btnValidar').disable();

        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();

        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function  mostrarResultadoValidacion() {
        //grid panel para mostrar la validacion de los datos
        readerdina = [];
        readerdina.push({
            name: 'codigo'
        });
        readerdina.push({
            name: 'cantidad'
        });
        readerdina.push({
            name: 'ajuste'
        });
        readerdina.push({
            name: 'idaprobaciondemanda'
        });
        cmdina = [];
        cmdina.push({
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            id: 'expandir',
            renderer: crearToolTip,
            sortable: true
        });
        cmdina.push({
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            align: 'right',
            dataIndex: 'cantidad',
            renderer: crearToolTip,
            sortable: true
        });
        cmdina.push({
            header: perfil.etiquetas.lbAjuste,
            tooltip: perfil.etiquetas.lbAjuste,
            align: 'right',
            dataIndex: 'ajuste',
            renderer: crearToolTip,
            sortable: true
        });
        cmdina.push({
            header: perfil.etiquetas.lbAprobacion,
            sortable: true,
            align: 'center',
            dataIndex: 'idaprobaciondemanda',
            tooltip: perfil.etiquetas.lbAprobacion,
            renderer: modificarAprobacion
        });
        filterDinamico = [];

        filterDinamico.push({
            type: 'string',
            dataIndex: 'codigo'
        }, {
            type: 'numeric',
            dataIndex: 'cantidad'
        }, {
            type: 'numeric',
            dataIndex: 'ajuste'
        }, {
            type: 'list',
            dataIndex: 'idaprobaciondemanda',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
        });
        for (var index = 0; index < coldin.length; index++) {
            readerdina.push({
                name: columnasdinamicasindex[index]
            });
            cmdina.push({
                header: coldin[index][0],
                sortable: true,
                align: 'center',
                dataIndex: columnasdinamicasindex[index],
                tooltip: coldin[index][0],
                renderer: crearToolTip
            });
            filterDinamico.push({
                type: columnasdinamicasfiltro[index],
                dataIndex: columnasdinamicasindex[index]
            });
        }
        readerdina.push({
            name: 'denominaciondato'
        });
        cmdina.push({
            header: 'Error',
            sortable: true,
            hidden: true,
            align: 'center',
            dataIndex: 'denominaciondato',
            tooltip: 'Error',
            renderer: crearToolTip
        });
        stDatosVal = new Ext.data.GroupingStore({
            url: 'listarDatosValidados',
            sortInfo: {
                field: 'denominaciondato',
                direction: "ASC"
            },
            groupField: 'denominaciondato',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.coldin = Ext.encode(columnasdinamicasindex);
                    st.baseParams.start = offsetdin;
                },
                load: function(t, n, e) {
                    winDatosVal.show();
                    Ext.getCmp('btnAdicionar').enable();
                    mymask.hide();
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                fields: readerdina
            })
        });
        cmDatosVal = new Ext.grid.ColumnModel(cmdina);
        smDatosVal = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
        filtrosDin = new Ext.grid.GridFilters({
            filters: filterDinamico
        });

        btnLimpiarFiltros = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltros',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbLimpiarImp,
            handler: function() {
                filtrosDin.clearFilters();
            }
        });

        gpDatosVal = new Ext.grid.GridPanel({
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            store: stDatosVal,
            sm: smDatosVal,
            cm: cmDatosVal,
            region: 'east',
            autoExpandColumn: 'expandir',
            margins: '2 2 2 2',
            anchor: '100%',
            plugins: filtrosDin,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: stDatosVal,
                displayInfo: true,
                items: [btnLimpiarFiltros],
                listeners: {
                    beforechange: function(p, e) {
                        offsetdin = e.start;
                    }
                }
            })
        });

        pgpDatosVal = new Ext.Panel({
            labelAlign: 'top',
            title: perfil.etiquetas.lbDatVal,
            frame: true,
            border: true,
            anchor: '100%',
            layout: 'fit',
            items: [gpDatosVal]
        });

        winDatosVal = new Ext.Window({
            modal: true,
            id: 'winDatosVal',
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            height: 500,
            width: 1000,
            items: [pgpDatosVal],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtbtnCancelar,
                    handler: function() {
                        winDatosVal.destroy();
                    }
                }, {
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnAdicionar',
                    disabled: true,
                    text: perfil.etiquetas.lbIns,
                    tooltip: perfil.etiquetas.lbInsD,
                    handler: function() {
                        mymask.show();
                        insertarDatos();
                    }
                }]
        });

        stDatosVal.reload({
            params: {
                start: 0,
                limit: 20
            }
        });
    }

    function insertarDatos() {
        Ext.Ajax.request({
            url: 'insertarDatosImportar',
            params: {
                tabla: tabla,
                columnasdinamicas: columnasdinamicas,
                campos: campos
            },
            callback: function(options, success, response) {
                winDatosVal.destroy();
                mymask.hide();
                mostrarMensaje(1, perfil.etiquetas.msgImportadoOK);
                cargarconfgrid();
            }
        });
    }

    function modificarAprobacion(val, m) {
        if (val == 1 || val < 0) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            m.css = 'icondistra-false rojo';
        } else if (val == 4) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbRector + '"';
            m.css = 'icondistra-true verde';
        } else if (val == 3) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            m.css = 'icondistra-true amarillo';
        } else if (val == 5) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbAjuste + '"';
            m.css = 'icondistra-true azul';
        }

    }

    /************************FIN IMPORTAR*****************************/

    btnVerDemanda = new Ext.Toolbar.Button({
        id: 'btnVerDemanda',
        // icon: perfil.dirImg + 'ver.png',
        iconCls: 'ver',
        tooltip: 'Ver Demanda',
        //text: 'Ver Demanda',
        handler: function() {
            windemandacentrobalance.show();
            //if (objci.acciones.rector == undefined) {
            if (identidadselected)
                cbCtroBalance.setValue(identidadselected);
            else
                cbCtroBalance.setValue(stcbCtroBalance.data.items[0].data.identidad);
            stGpdemandacentrobalance.reload();
            //cbCtroBalance.disable();
            //}
            if (cbCtroBalance.getValue() != "") {
                stCmbEntidad.load({
                    params: {
                        identiCB: cbCtroBalance.getValue()
                    }
                });
            }
        }
    });

    var btnVer = new Ext.Toolbar.Button({
        id: 'btnVerAct',
        // icon: perfil.dirImg + 'ver.png',
        iconCls: 'ver',
        //text: 'Ver ',
        tooltip: 'Ver Actividades',
        disabled: true,
        handler: function() {
            winveractividades.show();
            stGpVerAct.load({
                params: {
                    limit: 20,
                    start: 0
                }
            });
        }
    });

    menuReportes = new Ext.menu.Menu({
        items: [{
                id: 'btnReporteModeloProd',
                text: 'Modelo de producción',
                tooltip: 'Modelo de producción',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(1);
                }
            }, {
                id: 'btnReporteModeloGastosCostos',
                text: 'Modelo de gastos y costos',
                tooltip: 'Modelo de gastos y costos',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(2);
//                    exportarModeloGastosCostos();
                }
            }, {
                id: 'btnReporteEstadoResultado',
                text: 'Estado de Resultado',
                tooltip: 'Estado de Resultado',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(3);
                }
            }, {
                id: 'btnReporteEstadoSituacion',
                text: 'Estado de Situaci\xF3n',
                tooltip: 'Estado de Situaci\xF3n',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(4);
                }
            }, {
                id: 'btnReporteFlujoCaja',
                text: 'Flujo de Caja',
                tooltip: 'Flujo de Caja',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(5);
                }
            }, {
                id: 'btnReporteIndicadores',
                text: 'Indicadores',
                tooltip: 'Indicadores',
                iconCls: 'exportar',
                handler: function() {
                    exportarModelos(6);
                }
            }
        ]
    });

    botonReportes = new Ext.Button({
        id: 'botonReportes',
        tooltip: {
            text: 'Exportar reportes'
        },
        iconCls: 'exportar',
        menu: menuReportes
    });

    /* gpModelo = new Ext.grid.EditorGridPanel({
     store: stGpGestModelo,
     id: 'gpModelo',
     region: 'center',
     sm: smGpGestModelo,
     cm: cmGpGestMdelo,
     frame: true,
     plugins: filtros,
     margins: '2 2 2 -4',
     clicksToEdit: 2,
     loadMask: {
     msg: perfil.etiquetas.lbCargando
     },
     tbar: [
     new Ext.Toolbar.MenuButton({
     id: 'menuAprobInd',
     //text: perfil.etiquetas.lbBtnAprobacion,
     tooltip: perfil.etiquetas.lbBtnAprobacion,
     // icon: perfil.dirImg + 'area.png',
     iconCls: 'area',
     menu: {
     items: [{
     id: 'btnDesTodos',
     tabIndex: 5,
     // icon: perfil.dirImg + 'desaprobar.png',
     itemCls: 'x-menu-item icondistra-desaprobar',
     iconCls: 'imagen-none',
     tooltip: 'Desaprobar todos los indicadores (Ctrl+Alt+W)',
     // iconCls: 'desaprobar',
     text: perfil.etiquetas.lbBtnDesaprobarTodos,
     handler: function() {
     desaprobar = 1;
     cambiarEstadoTodos(1);
     }
     }, {
     id: 'btnAprobTodos',
     tabIndex: 4,
     // icon: perfil.dirImg + 'aprobar.png',
     tooltip: ' Aprobar todos los indicadores (Ctrl+Alt+Q)',
     // iconCls: 'aprobar',
     itemCls: 'x-menu-item icondistra-aprobar',
     iconCls: 'imagen-none',
     text: perfil.etiquetas.lbBtnAprobarTodos,
     handler: function() {
     desaprobar = 0;
     var rectora = false;
     if (objci.acciones)
     rectora = objci.acciones.rector;
     if (rectora)
     cambiarEstadoTodos(4);
     else
     cambiarEstadoTodos(2);
     }
     }, {
     id: 'btnAprob',
     disabled: true,
     tooltip: 'Aprobar el indicador seleccionado (Alt+Q)',
     tabIndex: 4,
     // icon: perfil.dirImg + 'aprobar.png',
     // iconCls: 'aprobar',
     itemCls: 'x-menu-item icondistra-aprobar',
     iconCls: 'imagen-none',
     text: perfil.etiquetas.lbBtnAprobar,
     handler: function() {
     desaprobar = 0;
     accionAprobar();
     }
     }, {
     id: 'btnDes',
     disabled: true,
     tabIndex: 5,
     tooltip: 'Desaprobar el indicador seleccionado (Alt+W)',
     // icon: perfil.dirImg + 'desaprobar.png',
     //iconCls: 'desaprobar',
     itemCls: 'x-menu-item icondistra-desaprobar',
     iconCls: 'imagen-none',
     text: perfil.etiquetas.lbBtnDesaprobar,
     handler: function() {
     desaprobar = 1;
     cambiarEstado(1);
     }
     }]
     }
     }),
     new Ext.Toolbar.MenuButton({
     id: 'menuAprobAjuste',
     //hide: true,
     //  text: perfil.etiquetas.lbBtnAprobacionAjuste,
     tooltip: perfil.etiquetas.lbBtnAprobacionAjuste,
     //icon: perfil.dirImg + 'area.png',
     iconCls: 'area',
     menu: {
     items: [{
     id: 'btnDesTodosAjustes',
     tabIndex: 5,
     // icon: perfil.dirImg + 'desaprobar.png',
     tooltip: 'Desaprobar todos los ajustes (Ctrl+Alt+W)',
     itemCls: 'x-menu-item icondistra-desaprobar',
     iconCls: 'imagen-none',
     //  iconCls: 'desaprobar',
     text: perfil.etiquetas.lbBtnDesaprobarTodos,
     handler: function() {
     aprobarajuste = 0;
     cambiarEstadoAjusteTodos(4);
     }
     }, {
     id: 'btnAprobTodosAjustes',
     tabIndex: 4,
     //icon: perfil.dirImg + 'aprobar.png',
     tooltip: ' Aprobar todos los ajustes (Ctrl+Alt+Q)',
     itemCls: 'x-menu-item icondistra-aprobar',
     iconCls: 'imagen-none',
     //    iconCls: 'aprobar',
     text: perfil.etiquetas.lbBtnAprobarTodos,
     handler: function() {
     aprobarajuste = 1;
     cambiarEstadoAjusteTodos(5);
     }
     }, {
     id: 'btnAprobAjuste',
     disabled: true,
     tooltip: 'Aprobar el ajuste del indicador seleccionado (Alt+Q)',
     tabIndex: 4,
     // icon: perfil.dirImg + 'aprobar.png',
     // iconCls: 'aprobar',
     itemCls: 'x-menu-item icondistra-aprobar',
     iconCls: 'imagen-none',
     text: perfil.etiquetas.lbBtnAprobar,
     handler: function() {
     aprobarajuste = 1;
     cambiarEstadoAjuste(5);
     }
     }, {
     id: 'btnDesAjuste',
     disabled: true,
     tabIndex: 5,
     tooltip: 'Desaprobar el ajuste del indicador seleccionado (Alt+W)',
     //icon: perfil.dirImg + 'desaprobar.png',
     //iconCls: 'desaprobar',
     itemCls: 'x-menu-item icondistra-desaprobar',
     iconCls: 'imagen-none',
     text: perfil.etiquetas.lbBtnDesaprobar,
     handler: function() {
     aprobarajuste = 0;
     cambiarEstadoAjuste(4);
     }
     }]
     }
     })
     , {
     xtype: 'tbbutton',
     // text: perfil.etiquetas.lbBtnAdicionar,
     tooltip: 'Adicionar indicadores <b>(Alt+I)</b>',
     hidden: ocultar,
     id: 'btnAdicionarInds',
     //icon: perfil.dirImg + 'adicionar.png',
     iconCls: 'adicionar',
     handler: function() {
     importarJS('../../views/js/comun/indicadorespornivel.js');
     }
     }, {
     xtype: 'tbbutton',
     disabled: true,
     // text: perfil.etiquetas.lbBtnEliminar,
     tooltip: 'Eliminar indicadores(DEL)',
     hidden: ocultar,
     id: 'btnEliminarInds',
     // icon: perfil.dirImg + 'eliminar.png',
     iconCls: 'eliminar',
     handler: function() {
     eliminarIndModPlan();
     }
     }, {
     xtype: 'tbbutton',
     // text: perfil.etiquetas.lbBtnGuardar,
     tooltip: 'Guardar datos de los indicadores (Alt+G)',
     id: 'btnGuardar',
     hidden: ocultar,
     // icon: perfil.dirImg + 'guardar.png',
     iconCls: 'guardar',
     handler: function() {
     GuardarTodas();
     }}
     
     , btnExportar, btnVer, '-'],
     bbar: pgGestModelo,
     md: new Ext.menu.Menu({
     id: 'mdGrid',
     items: [{
     text: perfil.etiquetas.lbTtbtnComen,
     itemCls: 'x-menu-item icondistra-adicionar',
     iconCls: 'imagen-none',
     id: 'mdAddcoment',
     handler: function() {
     fpComent.getForm().reset();
     winAddComent.show(Ext.getBody());
     winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
     Ext.getCmp('idelemcoment').setValue(smGpGestModelo.getSelected().get('idplanificacion'));
     }
     }, {
     text: perfil.etiquetas.lbVerComent,
     itemCls: 'x-menu-item icondistra-ver',
     iconCls: 'imagen-none',
     disabled: false,
     id: 'vercomentario',
     handler: function() {
     idelementoComentado = smGpGestModelo.getSelected().get('idplanificacion');
     mostrarComentarios();
     }
     }, {
     text: 'Ajustar',
     itemCls: 'x-menu-item icondistra-ajustar',
     iconCls: 'imagen-none',
     id: 'ajustarind',
     handler: function() {
     CargarImporteinicialAjuste();
     }
     }
     ]
     }),
     listeners: {
     beforeedit: function(e) {
     
     //Por ponce para el renderer luego
     gpModelo.getColumnModel().getCellEditor(e.column, e.row).field.renderiza = true;
     fila = e.row;
     columna = e.column;
     },
     afteredit: function(e) {
     },
     validateedit: function(e) {
     if (consolidado == 1)
     e.cancel = true;
     if (e.originalValue != e.value)
     gpModelo.getColumnModel().getCellEditor(e.column, e.row).field.renderiza = true;
     else
     e.cancel = true;
     campo = e.field;
     valor = e.value;
     ValidarOperacion(campo, valor, e);
     },
     rowcontextmenu: function(g, r, e) {
     
     if (eshoja == 0) {
     e.stopEvent();
     gpModelo.getSelectionModel().selectRow(r);
     ValidateMenu();
     
     } else {
     
     if (!objci.acciones.rector) {
     if (smGpGestModelo.getSelections().length == 1) {
     if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
     e.stopEvent();
     gpModelo.getSelectionModel().selectRow(r);
     Ext.getCmp('ajustarind').show();
     ValidateMenu();
     gpModelo.md.showAt(e.getXY());
     }
     }
     else
     if (smGpGestModelo.getSelections().length > 1) {
     e.stopEvent();
     gpModelo.getSelectionModel().selectRow(r);
     Ext.getCmp('ajustarind').show();
     ValidateMenu();
     gpModelo.md.showAt(e.getXY());
     }
     }
     
     }
     }
     }
     });*/

    var cont = 0;

    chglobal = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chkglobalP',
        hidden: true,
        listeners: {
            check: function(ck, t) {
                cont++;
                stGpGestModelo.reload({
                    callback: function() {
                    }
                });
                if (t || identidadEsOD == 0) {
                    Ext.getCmp('btnAdicionarInds').hide();
                    Ext.getCmp('btnImportar').disable();
                    Ext.getCmp('btnEliminarInds').hide();
                    Ext.getCmp('btnGuardar').hide();
                } else {
                    if (!objci.acciones.rector) {
                        Ext.getCmp('btnAdicionarInds').show();
                        Ext.getCmp('btnImportar').enable();
                        Ext.getCmp('btnEliminarInds').show();
                        Ext.getCmp('btnGuardar').show();
                    } else {
                        Ext.getCmp('btnAdicionarInds').hide();
                        Ext.getCmp('btnImportar').disable();
                        Ext.getCmp('btnEliminarInds').hide();
                        Ext.getCmp('btnGuardar').hide();
                    }
                }
            }
        }
    });

    pModelo = new Ext.Panel({
        id: 'pModelo',
        title: perfil.etiquetas.titModelos,
        split: true,
        disabled: true,
        layout: 'fit',
        tbar: [
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobInd',
                //text: perfil.etiquetas.lbBtnAprobacion,
                tooltip: perfil.etiquetas.lbBtnAprobacion,
                // icon: perfil.dirImg + 'area.png',
                iconCls: 'area',
                menu: {
                    items: [{
                            id: 'btnDesTodos',
                            tabIndex: 5,
                            // icon: perfil.dirImg + 'desaprobar.png',
                            itemCls: 'x-menu-item icondistra-desaprobar',
                            iconCls: 'imagen-none',
                            tooltip: 'Desaprobar todos los indicadores (Ctrl+Alt+W)',
                            // iconCls: 'desaprobar',
                            text: perfil.etiquetas.lbBtnDesaprobarTodos,
                            handler: function() {
                                desaprobar = 1;
                                cambiarEstadoTodos(1);
                            }
                        }, {
                            id: 'btnAprobTodos',
                            tabIndex: 4,
                            // icon: perfil.dirImg + 'aprobar.png',
                            tooltip: ' Aprobar todos los indicadores (Ctrl+Alt+Q)',
                            // iconCls: 'aprobar',
                            itemCls: 'x-menu-item icondistra-aprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobarTodos,
                            handler: function() {
                                desaprobar = 0;
                                var rectora = false;
                                if (objci.acciones)
                                    rectora = objci.acciones.rector;
                                if (rectora)
                                    cambiarEstadoTodos(4);
                                else
                                    cambiarEstadoTodos(2);
                            }
                        }, {
                            id: 'btnAprob',
                            disabled: true,
                            tooltip: 'Aprobar el indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            // icon: perfil.dirImg + 'aprobar.png',
                            // iconCls: 'aprobar',
                            itemCls: 'x-menu-item icondistra-aprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function() {
                                desaprobar = 0;
                                accionAprobar();
                            }
                        }, {
                            id: 'btnDes',
                            disabled: true,
                            tabIndex: 5,
                            tooltip: 'Desaprobar el indicador seleccionado (Alt+W)',
                            // icon: perfil.dirImg + 'desaprobar.png',
                            //iconCls: 'desaprobar',
                            itemCls: 'x-menu-item icondistra-desaprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function() {
                                desaprobar = 1;
                                cambiarEstado(1);
                            }
                        }]
                }
            }),
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobAjuste',
                //hide: true,
                //text: perfil.etiquetas.lbBtnAprobacionAjuste,
                tooltip: perfil.etiquetas.lbBtnAprobacionAjuste,
                iconCls: 'area',
                menu: {
                    items: [{
                            id: 'btnDesTodosAjustes',
                            tabIndex: 5,
                            // icon: perfil.dirImg + 'desaprobar.png',
                            tooltip: 'Desaprobar todos los ajustes (Ctrl+Alt+W)',
                            itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            //  iconCls: 'desaprobar',
                            text: perfil.etiquetas.lbBtnDesaprobarTodos,
                            handler: function() {
                                aprobarajuste = 0;
                                cambiarEstadoAjusteTodos(4);
                            }
                        }, {
                            id: 'btnAprobTodosAjustes',
                            tabIndex: 4,
                            //icon: perfil.dirImg + 'aprobar.png',
                            tooltip: ' Aprobar todos los ajustes (Ctrl+Alt+Q)',
                            itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            //    iconCls: 'aprobar',
                            text: perfil.etiquetas.lbBtnAprobarTodos,
                            handler: function() {
                                aprobarajuste = 1;
                                cambiarEstadoAjusteTodos(5);
                            }
                        }, {
                            id: 'btnAprobAjuste',
                            disabled: true,
                            tooltip: 'Aprobar el ajuste del indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            // icon: perfil.dirImg + 'aprobar.png',
                            // iconCls: 'aprobar',
                            itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function() {
                                aprobarajuste = 1;
                                cambiarEstadoAjuste(5);
                            }
                        }, {
                            id: 'btnDesAjuste',
                            disabled: true,
                            tabIndex: 5,
                            tooltip: 'Desaprobar el ajuste del indicador seleccionado (Alt+W)',
                            //icon: perfil.dirImg + 'desaprobar.png',
                            //iconCls: 'desaprobar',
                            itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function() {
                                aprobarajuste = 0;
                                cambiarEstadoAjuste(4);
                            }
                        }]
                }
            })
                    , {
                        xtype: 'tbbutton',
                        // text: perfil.etiquetas.lbBtnAdicionar,
                        tooltip: 'Adicionar indicadores <b>(Alt+I)</b>',
                        hidden: ocultar,
                        id: 'btnAdicionarInds',
                        //icon: perfil.dirImg + 'adicionar.png',
                        iconCls: 'adicionar',
                        handler: function() {
                            importarJS('../../views/js/comun/indicadorespornivel.js');
                        }
                    },
            {
                xtype: 'tbbutton',
                disabled: true,
                // text: perfil.etiquetas.lbBtnEliminar,
                tooltip: 'Eliminar indicadores(DEL)',
                hidden: ocultar,
                id: 'btnEliminarInds',
                // icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                /*  handler: function() {
                 eliminarIndModPlan();
                 }*/
            },
            {
                xtype: 'tbbutton',
                // text: perfil.etiquetas.lbBtnGuardar,
                tooltip: 'Guardar datos de los indicadores (Alt+G)',
                id: 'btnGuardar',
                hidden: ocultar,
                // icon: perfil.dirImg + 'guardar.png',
                iconCls: 'guardar',
                handler: function() {
                    GuardarTodas();
                }
            }

            , btnExportar, /*botonReportes,*/ btnVer, //yosniel
            chglobal, '-']/*
             items: []*/
    });
//Demanda por Entidad a los Centros de balance
    stcbCtroBalance = new Ext.data.Store({
        //  autoLoad: true,
        url: 'ListarComboCentroBalance',
        listeners: {
            beforeload: function(st) {
                st.baseParams.identidad = identidadselected;
                st.baseParams.rector = true;//objci.acciones.rector;
            },
            load: function() {
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });
    btnExportardemanda = new Ext.Button({
        disabled: false,
        id: 'btnExportardemanda',
        hidden: false,
        // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: 'Exportar demanda <b>(ALt+E)</b>',
        // text: 'Exportar',
        handler: function() {
            var win = window.open('exportarDemanda?identiCB=' + cbCtroBalance.getValue() + '&idejercicio=' + cbEjercicio.getValue() + '&idmodelo=' + treesel + '& filtros=' + Ext.encode(filtrosGpdemandacentrobalance.getFilterData()));

        }
    });
    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                Ext.Ajax.request({
                    url: 'gestPermisos',
                    params: {
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData[0]) {
                            if (responseData[0].guardar == 0) {
                                Ext.getCmp('btnGuardar').hide();
                                Ext.getCmp('btnGuardar').hidden = tue;
                                puedeguardar = 0;
                            } else {
                                puedeguardar = 1;
                                Ext.getCmp('btnGuardar').hidden = false;
                            }
                            if (responseData[0].insertar == 0) {
                                Ext.getCmp('addVarios').hide();
                                Ext.getCmp('addplan').hide();
                                Ext.getCmp('addmodelo').hide();
                                Ext.getCmp('btnAdicionarInds').hide();
                                Ext.getCmp('btnImportar').disable();
                                puedeadicionar = 0;
                            } else {
                                puedeadicionar = 1;
                            }
                            if (responseData[0].eliminar == 0) {
                                Ext.getCmp('delplan').hide();
                                Ext.getCmp('delmodelo').hide();
                                puedeeliminar = 0;
                            } else {
                                puedeeliminar = 1;
                            }
                            if (responseData[0].modificar == 0) {
                                Ext.getCmp('modplan').hide();
                                Ext.getCmp('modmodelo').hide();
                                puedemodificar = 0;
                            } else {
                                puedemodificar = 1;
                            }
                        } else {
                            puedeadicionar = 1;
                            puedemodificar = 1;
                            puedeeliminar = 1;
                            puedeguardar = 1;
                        }
                    }

                });
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
            select: function(cb, rec, index) {
                tpBasePlan.getRootNode().reload();
                stGpGestModelo.removeAll();
                pModelo.disable();
                Ext.Ajax.request({
                    url: 'gestPermisos',
                    params: {
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData[0]) {
                            if (responseData[0].guardar == 0) {
                                Ext.getCmp('btnGuardar').hide();
                                Ext.getCmp('btnGuardar').hidden = tue;
                                puedeguardar = 0;
                            } else {
                                puedeguardar = 1;
                            }
                            if (responseData[0].insertar == 0) {
                                Ext.getCmp('addplan').hide();
                                Ext.getCmp('addmodelo').hide();
                                Ext.getCmp('btnAdicionarInds').hide();
                                Ext.getCmp('btnImportar').disable();
                                puedeadicionar = 0;
                            } else {
                                puedeadicionar = 1;
                            }
                            if (responseData[0].eliminar == 0) {
                                Ext.getCmp('delplan').hide();
                                Ext.getCmp('delmodelo').hide();
                                Ext.getCmp('btnEliminarInds').hide();
                                puedeeliminar = 0;
                            } else {
                                puedeeliminar = 1;
                            }
                            if (responseData[0].modificar == 0) {
                                Ext.getCmp('modplan').hide();
                                Ext.getCmp('modmodelo').hide();
                                puedemodificar = 0;
                            } else {
                                puedemodificar = 1;
                            }
                        } else {

                            puedeadicionar = 1;
                            puedemodificar = 1;
                            puedeeliminar = 1;
                            puedeguardar = 1;
                        }
                    }

                });

            }
        }
    });

//boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: entidadsel,
        componente: 'Plan'
    });

    btnGraficoPlanif = btnGraficas.botonMenuGrafica();
    cbCtroBalance = new Ext.form.ComboBox({
        id: 'cbCtroBalance',
        store: stcbCtroBalance,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function(cb, rec, index) {
                stGpdemandacentrobalance.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        }
    });
    var cmGpdemandacentrobalance = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: 'Especialidad',
            width: 100,
            dataIndex: 'denomentidadpadre',
            tooltip: 'Especialidad',
            renderer: crearToolTip
        },
        {
            header: 'Entidad',
            width: 100,
            dataIndex: 'denominacionenti',
            tooltip: 'Entidad',
            renderer: crearToolTip

        },
        {
            header: 'Plan',
            width: 180,
            dataIndex: 'denominacionmodelo',
            tooltip: 'Plan',
            renderer: crearToolTip

        }, {
            header: 'Código',
            width: 75,
            dataIndex: 'codigo',
            tooltip: 'Código',
            renderer: crearToolTip
        }, {
            header: 'Número de pieza',
            width: 100,
            dataIndex: 'numeropieza',
            tooltip: 'Número de pieza',
            renderer: crearToolTip

        }, {
            header: 'Indicador',
            width: 100,
            dataIndex: 'denominacionind',
            tooltip: 'Indicador',
            renderer: crearToolTip

        }, {
            header: 'Cantidad',
            width: 100,
            dataIndex: 'cantidadreal',
            tooltip: 'Cantidad',
            renderer: crearToolTip


        }, {
            header: 'Ajuste',
            width: 100,
            dataIndex: 'ajuste',
            tooltip: 'Ajuste',
            renderer: crearToolTip


        }, {
            header: 'Cantidad final',
            width: 100,
            dataIndex: 'necesidad',
            tooltip: 'Cantidad final',
            renderer: crearToolTip


        }, {
            header: 'Importe',
            width: 100,
            dataIndex: 'importe',
            tooltip: 'Importe',
            renderer: crearToolTip
        }


    ]);

    cmGpVerAct = new Ext.grid.ColumnModel([
        {
            header: 'C&oacute;digo de la actividad',
            width: 150,
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo de la actividad',
            renderer: crearToolTip

        }, {
            header: 'Entidad',
            width: 180,
            dataIndex: 'denentidad',
            tooltip: 'Entidad',
            renderer: crearToolTip
        }, {
            header: 'Especialidad',
            width: 180,
            dataIndex: 'denespecialidad',
            tooltip: 'Especialidad',
            renderer: crearToolTip
        }, {
            header: 'Denominaci&oacute;n',
            width: 200,
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n',
            renderer: crearToolTip

        },
        {
            header: 'Nivel de actividad',
            width: 1505,
            dataIndex: 'nivel',
            tooltip: 'Nivel de actividad',
            id: 'expandir',
            renderer: crearToolTip

        }


    ]);


    stGpdemandacentrobalance = new Ext.data.Store({
        url: 'listarIndXCentroBalance',
        listeners: {
            load: function() {
                siexistecolumFiltrada();
            },
            beforeload: function() {
                Ext.Ajax.timeout = 600000;
                stGpdemandacentrobalance.baseParams.identiCB = cbCtroBalance.getValue();
                stGpdemandacentrobalance.baseParams.idejercicio = cbEjercicio.getValue();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denomentidadpadre'
            }, {
                name: 'denominacionenti'
            }, {
                name: 'denominacionmodelo'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacionind'
            }, {
                name: 'necesidad'
            }, {
                name: 'ajuste'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'importe'
            }]
                )
    });
    smGpGestModelo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(x, y, w) {
                idindsmGestModelo = x.getSelected().get('idindicador');

                if (objci.acciones.rector || x.getSelected().data.idaprobaciondemanda > 1 || Ext.getCmp('chkglobalP').getValue() == true || identidadEsOD == 0)
                    columnasDinamicasgpModelo.setEditable(columnasDinamicasgpModelo.findColumnIndex('cantidad'), false);
                else
                    columnasDinamicasgpModelo.setEditable(columnasDinamicasgpModelo.findColumnIndex('cantidad'), true);

                if (objci.acciones.rector || x.getSelected().data.idaprobaciondemanda == 4 || Ext.getCmp('chkglobalP').getValue() == true || identidadEsOD == 0) {
                    columnasDinamicasgpModelo.setEditable(columnasDinamicasgpModelo.findColumnIndex('ajuste'), true);
                } else {
                    columnasDinamicasgpModelo.setEditable(columnasDinamicasgpModelo.findColumnIndex('ajuste'), false);
                }

                if (x.getSelections().length == 0) {
                    habilitarDesabilitar(false);
                    habilitarDesabilitarAprobacionAjuste(false);
                } else {
                    habilitarDesabilitar(true);
                    habilitarDesabilitarAprobacionAjuste(true);
                }
                if (x.getSelections().length != 0) {
                    if (x.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerAct').enable();
                    } else {
                        Ext.getCmp('btnVerAct').disable();
                    }

                    Ext.getCmp('btnEliminarInds').on('click', function() {
                        Ext.getCmp('btnEliminarInds').setHandler(
                                eliminarIndModPlan(x));
                    });
                } else {
                    Ext.getCmp('btnVerAct').disable();
                }
            },
            rowdeselect: function(s, n, r) {
                if (s.getSelections().length == 0) {
                    habilitarDesabilitar(false);
                    habilitarDesabilitarAprobacionAjuste(false);
                } else {
                    habilitarDesabilitar(true);
                    habilitarDesabilitarAprobacionAjuste(true);
                }
                if (s.getSelections().length != 0) {
                    if (s.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerAct').enable();
                    } else {
                        Ext.getCmp('btnVerAct').disable();
                    }
                } else {
                    Ext.getCmp('btnVerAct').disable();
                }
            }
        }
    });
    stGpVerAct = new Ext.data.Store({
        url: urlListarVerActXInd,
        listeners: {
            load: function() {
                if (stGpVerAct.data.length === 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoActXInd);
                }
            },
            beforeload: function() {
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.identidad = identidadselected;
                this.baseParams.idindicador = smGpGestModelo.getSelected().data.idindicador;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'nivel'
            }, {
                name: 'denespecialidad'
            }, {
                name: 'denentidad'
            }])
    });


    smGpdemandacentrobalance = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var smGpVerAct = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stCmbEspecialidad = new Ext.data.Store({
        url: 'listarHijosRector',
        storeId: 'stCmbEspecialidad',
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 120000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identi'
        }, [{
                name: 'identi'
            }, {
                name: 'denominacion'
            }])
    });
    stCmbEntidad = new Ext.data.Store({
        url: 'listarEntidades',
        storeId: 'stCmbEntidad',
        params: {
            identiCB: cbCtroBalance.getValue()
        },
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'denominacion'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idden'
            }])
    });
    stCmbDenominacionModelo = new Ext.data.Store({
        url: 'listarModelos',
        storeId: 'stCmbDenominacionModelo',
        //  autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }])
    });
//  stCmbEspecialidad.load();
    cbCtroBalance.on('select', function(cmb, record, index) {
        stCmbEntidad.load({
            params: {
                identiCB: cbCtroBalance.getValue(),
                start: 0,
                limit: 20
            }
        });
    });
    btnVerDemanda.on('click', function(btn, e) {
        if (cbCtroBalance.getValue() != "") {
            stCmbEntidad.load({
                params: {
                    identiCB: cbCtroBalance.getValue()
                }
            });
        }
    });


    filtrosGpdemandacentrobalance = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denomentidadpadre',
                idcombo: 'identi',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                st: stCmbEspecialidad,
                mode: 'local'
            },
            {
                type: 'listado',
                dataIndex: 'denominacionmodelo',
                idcombo: 'cbdenominacionmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stCmbDenominacionModelo,
                mode: 'local'
            },
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'denominacionind',
                xtype: 'numberfield',
                idTextField: 'filtrodenominacionind',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'numeric',
                dataIndex: 'necesidad'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            },
            {
                type: 'numeric',
                dataIndex: 'ajuste'
            },
            {
                type: 'numeric',
                dataIndex: 'importe'
            }
        ]
    });

    filtrosGpVerAct = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'denominacion'
            }, {
                type: 'string_adaptado',
                dataIndex: 'codigo'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });
    stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });

//combo del modo donde muestro la cantidad de elementos por paginas del grid
    cbPaginado = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado,
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
            select: function(cb, record, index) {
                Ext.getCmp('ptGpdemandacentrobalance').pageSize = record.data.idnumpag;
                Ext.getCmp('ptGpdemandacentrobalance').doLoad(Ext.getCmp('ptGpdemandacentrobalance').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    Gpdemandacentrobalance = new Ext.grid.GridPanel({
        frame: true,
        id: 'Gpdemandacentrobalance',
        autoExpandColumn: 'expandir',
        store: stGpdemandacentrobalance,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtrosGpdemandacentrobalance,
        sm: smGpdemandacentrobalance,
        cm: cmGpdemandacentrobalance,
        loadMask: {
            msg: 'Cargando...'
        },
        tbar: [{
                xtype: 'tbtext',
                text: 'Centro de Balance:'
            }, cbCtroBalance, '-', btnExportardemanda],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptGpdemandacentrobalance',
            store: stGpdemandacentrobalance,
            displayInfo: true,
            items: [btnLimpiarFiltrosDemanda, '-', {
                    xtype: 'tbtext',
                    text: 'Resultados por p&aacute;gina : '
                }, cbPaginado]
        })


    });
    /*  stGpdemandacentrobalance.load({
     params: {
     limit: 20,
     start: 0,
     identiCB: -1
     }
     });*/


    var GpVerAct = new Ext.grid.GridPanel({
        id: 'GpVerAct',
        autoExpandColumn: 'expandir',
        store: stGpVerAct,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtrosGpVerAct,
        sm: smGpVerAct,
        cm: cmGpVerAct,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptGpVerAct',
            store: stGpVerAct,
            displayInfo: true,
            items: [btnLimpiarFiltrosVerAct]
        })
    });


    btnCancelarDemanda = new Ext.Toolbar.Button({
        id: 'btnCancelarDemanda',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            windemandacentrobalance.hide();
            cbCtroBalance.clearValue();
            stGpdemandacentrobalance.reload();
        }
    });
    windemandacentrobalance = new Ext.Window({
        title: "Demanda por Entidades a los centros de balance",
        width: 1000,
        layout: 'fit',
        height: 500,
        constrain: true,
        modal: true,
        closeAction: 'hide',
        buttons: [btnCancelarDemanda],
        items: [Gpdemandacentrobalance]
    });


    btnCancelarAct = new Ext.Toolbar.Button({
        id: 'btnCancelarAct',
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            winveractividades.hide();

        }
    });


    var winveractividades = new Ext.Window({
        title: "Ver actividades",
        width: 800,
        layout: 'fit',
        height: 400,
        modal: true,
        constrain: true,
        closeAction: 'hide',
        buttons: [btnCancelarAct],
        items: [GpVerAct]
    });


    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'lL',
            alt: true,
            fn: function() {
                if (!btnLimpiarFiltros.hidden) {
                    if (!btnLimpiarFiltros.disabled) {
                        filtros.clearFilters();
                        stGpGestModelo.reload();
                    }
                }
            }
        }, {
            key: 46,
            fn: function() {

                if (smGpGestModelo.getSelections().length >= 1)
                    eliminarIndModPlan();
            }
        }, {
            key: 'qQ',
            alt: true,
            fn: function() {
                if (!btnAprob.hidden) {
                    if (!btnAprob.disabled) {
                        accionAprobar();
                    }
                }


            }
        }, {
            key: 'wW',
            alt: true,
            fn: function() {
                if (!btnDes.hidden) {
                    if (!btnDes.disabled) {
                        cambiarEstado(1);
                    }
                }

            }
        }, {
            key: 'qQ',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!btnAprobTodos.hidden) {
                    if (!btnAprobTodos.disabled) {
                        var rectora = false;
                        if (objci.acciones)
                            rectora = objci.acciones.rector;
                        if (rectora)
                            cambiarEstadoTodos(4);
                        else
                            cambiarEstadoTodos(2);
                    }
                }

            }
        }, {
            key: 'wW',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!btnDesTodos.hidden) {
                    if (!btnDesTodos.disabled) {
                        cambiarEstadoTodos(1);
                    }
                }

            }
        }
        , {
            key: 'iI',
            alt: true,
            fn: function() {
                importarJS('../../views/js/comun/indicadorespornivel.js');
            }
        }
        , {
            key: 'gG',
            alt: true,
            fn: function() {
                GuardarTodas();
            }
        }

    ]);
}


// function para cargar la configuracion del grid
function cargarconfgrid() {
    if (objci.acciones.rector) {
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnImportar').disable();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    } else if (identidadEsOD == 1 || (identidadEsOD == 0 && Ext.getCmp('chkglobalP').getValue() == true)) {
        Ext.getCmp('btnAprob').show();
        Ext.getCmp('btnDes').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    } else {
        //Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').hide();
        Ext.getCmp('btnAprob').hide();
        Ext.getCmp('btnDes').hide();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    }

    if (puedeadicionar == 1 && Ext.getCmp('chkglobalP').getValue() == false && !objci.acciones.rector && identidadEsOD == 1) {
        Ext.getCmp('btnAdicionarInds').show();
        Ext.getCmp('btnImportar').enable();
    } else {
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnImportar').disable();
    }

    if (puedeeliminar == 1 && Ext.getCmp('chkglobalP').getValue() == false && !objci.acciones.rector && identidadEsOD == 1) {
        Ext.getCmp('btnEliminarInds').show();
    } else
        Ext.getCmp('btnEliminarInds').hide();

    if (puedeguardar == 1 && Ext.getCmp('chkglobalP').getValue() == false && !objci.acciones.rector && identidadEsOD == 1) {
        Ext.getCmp('btnGuardar').show();
    } else
        Ext.getCmp('btnGuardar').hide();

    global_tree = 0;
    Ext.Ajax.request({
        url: 'getgridinterfaces',
        params: {
            idmodelo: treesel
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                for (var index = 0; index < responseData.cm.length; index++) {
                    if (responseData.cm[index].header == 'Formato') {
                        responseData.cm[index].header = 'UM';
                        responseData.cm[index].hidden = true;
                    }
                }

                if (typeof (Ext.getCmp('gpModelo')) === 'undefined') {
                    reconfgrid(responseData);
                    Ext.getCmp('pModelo').insert(0, crearGridModelo(filtrosgpModelo, stGpGestModelo, columnasDinamicasgpModelo, pgGestModelo, smGpGestModelo/*,idGridModelo*/));
                    Ext.getCmp('pModelo').doLayout();

                    Ext.getCmp('gpModelo').addListener(
                            'rowselect', function() {
                                if (smGpGestModelo.getSelections().length == 0) {
                                    habilitarDesabilitar(false);
                                    habilitarDesabilitarAprobacionAjuste(false);
                                } else {
                                    habilitarDesabilitar(true);
                                    habilitarDesabilitarAprobacionAjuste(true);
                                }
                            });

                    Ext.getCmp('gpModelo').addListener(
                            'rowdeselect', function() {
                                if (smGpGestModelo.getSelections().length == 0) {
                                    habilitarDesabilitar(false);
                                    habilitarDesabilitarAprobacionAjuste(false);
                                } else {
                                    habilitarDesabilitar(true);
                                    habilitarDesabilitarAprobacionAjuste(true);
                                }
                            });

                } else {
                    reconfgrid(responseData);
                    stGpGestModelo.on('load', function() {
                        Ext.getCmp('gpModelo').reconfigure(stGpGestModelo, columnasDinamicasgpModelo, pgGestModelo);
                    });

                }

                stGpGestModelo.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });

            } else {
                reconfgrid();
            }
            global_tree++;
        }
    });
}

function calcularImporte(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return parseFloat(value).toFixed(3);
    return (precio * cantidad).toFixed(3);
}


function Precio(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}

function Aprobacion(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == 1)
        return 'No';
    else if (value == 2)
        return 'Si';
    else
        return 'Rector';
}

function Cantidad(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}
// function para reconfigurar el grid de modelo


function reconfgrid(cf) {
    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.start = offset;
                this.baseParams.consolid = consolidado;
                this.baseParams.glob = Ext.getCmp('chkglobalP').getValue();
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                this.baseParams.filtrosD = Ext.encode(filtrosgpModelo.getFilterData());

                if (!maskPlan) {
                    maskPlan = new Ext.LoadMask(
                            'Cargando')

                }
                maskPlan.show();
            },
            load: function(st, rec, obj) {
                if (st.getCount() == 0) {
                    smGpGestModelo.selectFirstRow();
                    calcularImporteTotal();
                    if (puedeadicionar == 1 || puedemodificar == 1 || puedeeliminar == 1 || puedeguardar == 1) {
                        ocultar = false;
                    }
                    if (objci.acciones.rector) {
                        Ext.getCmp('btnAdicionarInds').disable();
                        Ext.getCmp('btnImportar').disable();
                    }
                    if (identidadEsOD == 0) {
                        if ((eshoja) || (Ext.getCmp('chkglobalP').getValue() == false) && identidadselected != null)
                            mostrarMensaje(1, 'La entidad seleccionada no posee el comportamiento Órgano demandante');
                    }
                }
            }

        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idplanificacion'
        }, [{
                name: 'idindicador'
            }, {
                name: 'idplanificacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            },
            {
                name: 'idaprobaciondemanda'
            }, {
                name: 'generadobasesplan'
            }, {
                name: 'estado'
            }, {
                name: 'idformato'
            }, {
                name: 'idpais'
            },
            {
                name: 'idcentrobalance'
            }, {
                name: 'nivel'
            }, {
                name: 'descripcion'
            }, {
                name: 'naturaleza'
            }, {
                name: 'precio'
            },
            {
                name: 'preciodivisa'
            }, {
                name: 'idumedida'
            }, {
                name: 'numeropieza'
            }, {
                name: 'flete'
            }, {
                name: 'contingencia'
            },
            {
                name: 'viaadquisicion'
            }, {
                name: 'organosatisface'
            }, {name: 'idunidadmedida'},
            //esto es pa el minfar
            {
                type: 'string',
                dataIndex: 'llaveprimaria'
            }
            //hasta aki minfar
        ])
    });

    filterDinamico = [];

    filterDinamico.push({
        type: 'string',
        dataIndex: 'codigo'
    }, {
        type: 'string',
        dataIndex: 'numeropieza'
    }, {
        type: 'string',
        dataIndex: 'denominacion'
    },
    {
        type: 'listado',
        dataIndex: 'umedida',
        idcombo: 'idumedidaindicadores',
        urlcb: urlCbUM,
        mode: 'remote',
        idstore: 'idstumedidaindicadores',
        valueFieldcb: 'idunidadmedida',
        displayFieldcb: 'denominacionunidadmedida',
        autoload: false

    }, {
        /*temporal arreglar el listar para que liste centros de balance*/
        type: 'listado',
        dataIndex: 'centrobalance',
        idcombo: 'idcbcentrobalancenorma',
        urlcb: urlCbCentBalance,
        idstore: 'idstcentrobalancenorma',
        valueFieldcb: 'centrobalance',
        displayFieldcb: 'centrobalance',
        tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
    }
    , {
        /*temporal arreglar el listar para que liste centros de balance*/
        type: 'listado',
        dataIndex: 'pais',
        idcombo: 'idcbpaisnorma',
        urlcb: urlCbPais,
        idstore: 'idstpais',
        valueFieldcb: 'idpais',
        displayFieldcb: 'nombrepais',
        autoload: false,
        mode: 'remote'
    }, {
        type: 'list',
        dataIndex: 'idaprobaciondemanda',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
    }, {
        type: 'numeric',
        dataIndex: 'precio'
    }, {
        type: 'numeric',
        dataIndex: 'preciodivisa'
    }, {
        type: 'numeric',
        dataIndex: 'cantidad'
    },
        {
        type: 'numeric',
        dataIndex: 'ajuste'
    }, {
        type: 'numeric',
        dataIndex: 'cantidadfinal'
    }, {
        type: 'numeric',
        dataIndex: 'importe'
    }, {
        type: 'numeric',
        dataIndex: 'importeajustado'
    }, {
        type: 'numeric',
        dataIndex: 'importefinal'
    },
        {
        type: 'numeric',
        dataIndex: 'importedivisa'
    }, {
        type: 'list',
        dataIndex: 'generadobasesplan',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbAfectada]
    }, {
        type: 'numeric',
        dataIndex: 'flete'
    }, {
        type: 'numeric',
        dataIndex: 'contingencia'
    }, {
        type: 'listado',
        dataIndex: 'viaadquisicion',
        idcombo: 'idviaadquisicionc',
        urlcb: urlCbVA,
        mode: 'remote',
        idstore: 'idstvia',
        valueFieldcb: 'denominacion',
        displayFieldcb: 'denominacion',
        autoload: false
    }, {
        type: 'string',
        dataIndex: 'organosatisface'
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtros = new Ext.grid.GridFilters({
        filters: filterDinamico
    });

    //var arrayIndexDinamicos = new Array();

    rec = [];
    rec.push({
        name: '_is_leaf'
    });
    rec.push({
        name: 'idaprobaciondemanda'
    });
    rec.push({
        name: 'generadobasesplan'
    });
    rec.push({
        name: '_parent'
    });
    rec.push({
        name: 'idplanificacion'
    });
    rec.push({
        name: 'codigo'
    });
    rec.push({
        name: 'denominacion'
    });
    rec.push({
        name: 'descripcion'
    });
    rec.push({
        name: 'precio'
    });
    rec.push({
        name: 'preciodivisa'
    });
    rec.push({
        name: 'cantidad'
    });
    rec.push({
        name: 'ajuste'
    });
    rec.push({
        name: 'cantidadfinal'
    });
    rec.push({
        name: 'centrobalance'
    });
    rec.push({
        name: 'pais'
    });
    rec.push({
        name: 'umedida'
    });
    rec.push({
        name: 'numeropieza'
    });
    rec.push({
        name: 'importe'
    });
    rec.push({
        name: 'importeajustado'
    });
    rec.push({
        name: 'importefinal'
    });
    rec.push({
        name: 'comentario'
    });
    rec.push({
        name: 'idindicador'
    });
    rec.push({
        name: 'flete'
    });
    rec.push({
        name: 'contingencia'
    });
    rec.push({
        name: 'viaadquisicion'
    });
    rec.push({
        name: 'organosatisface'
    });
    cmGp = [];
    dinamica = 0;
    cmGp.push({
        header: 'Código',
        width: 80,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Nro. pieza',
        width: 80,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Denominación',
        //id: 'expandir',
        width: 250,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'UM',
        width: 35,
        sortable: true,
        dataIndex: 'umedida',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Precio',
        width: 70,
        align: 'right',
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: Precio
    });

    if (cf) {

        for (var index = 0; index < cf.cm.length; index++) {
            if (cf.cm[index].edit.xtype) {
                switch (cf.cm[index].edit.xtype) {
                    case 'numberfield':
                        {
                            cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                            cf.cm[index].editor.on('focus', function(f) {
                                f.selectText();
                            });
                        }
                        break;
                    case 'datefield':
                        {
                            cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                            cf.cm[index].editor.format = 'd/m/Y';
                            cf.cm[index].renderer = function(v, m, r, ri, ci, st) {
                                if (v) {
                                    if (typeof (v) == 'string') {
                                        var arreg = v.split('-');
                                        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                        return v;
                                    } else {
                                        return v.format('d/m/Y');
                                    }
                                }
                                return '';
                            }
                        }
                        break;
                    case 'combo':
                        {


                            var item = cf.cm[index].edit;
                            var items = cf.cm;
                            almacen = new Ext.data.SimpleStore({
                                fields: ['iddatosnomenclador', item.displayField]
                            });

                            var valores = [];

                            for (pos in cf.cm[index].edit.store) {
                                valores.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                            }

                            valores.pop();
                            almacen.add(valores);

                            //arreglos de index dinamicos para despues trabajar con ellos
                            arrayIndexDinamicos.push(items[index].dataIndex);

                            cf.cm[index] = {
                                id: items[index].edit.id,
                                header: items[index].header,
                                dataIndex: items[index].dataIndex,
                                sortable: true,
                                width: 180,
                                tooltip: items[index].header,
                                renderer: function(value, cell, rec, row, col) {
                                    var col = col;
                                    /* if (!objci.acciones.rector && eshoja) {
                                     gpModelo.getColumnModel().setEditable(col, true);
                                     } else {
                                     gpModelo.getColumnModel().setEditable(col, false);
                                     }
                                     return getRawValue(value, gpModelo.getColumnModel().getCellEditor(col, row).field, gpModelo.getColumnModel(), col);*/

                                },
                                editor: new Ext.form.ComboBox({
                                    id: item.id,
                                    hiddenName: item.hiddenName,
                                    name: item.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: item.allowBlank,
                                    emptyText: item.emptyText,
                                    width: 180,
                                    typeAhead: item.typeAhead,
                                    valueField: item.valueField,
                                    displayField: item.displayField,
                                    renderer: crearToolTip,
                                    store: almacen,
                                    listeners: {
                                        select: function(a, b, c) {
                                            for (var i = 0; i < smGpGestModelo.getSelections().length; i++) {
                                                //si se le adiciona otra columna estatica antes de las columnas dinamicas debe adiconarle 1 a la suma de la columna
                                                stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).set(stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).fields.items[columna + 22].name, a.getValue());
                                            }
                                        },
                                        focus: function() {

                                        }
                                    }

                                })
                            };
                            filterDinamico.push({
                                type: 'listado',
                                dataIndex: items[index].dataIndex,
                                valueFieldcb: 'iddatosnomenclador',
                                st: almacen,
                                displayFieldcb: item.displayField,
                                autoload: false
                            });
                        }
                        break;
                    default:
                        {
                            //Hubo que reimplementar el editor porque daba error con las comillas del regex
                            //cf.cm[index].editor = new Ext.form.TextField({cf.cm[index].edit});
                            cf.cm[index].editor = new Ext.form.TextField({
                                allowBlank: cf.cm[index].edit.allowBlank,
                                anchor: cf.cm[index].edit.anchor,
                                fieldLabel: cf.cm[index].edit.fieldLabel,
                                id: cf.cm[index].edit.id,
                                maxLength: cf.cm[index].edit.maxLength,
                                name: cf.cm[index].edit.name,
                                regex: new RegExp(cf.cm[index].edit.regex.substring(1, cf.cm[index].edit.regex.length - 1)),
                                store: cf.cm[index].edit.store,
                                xtype: cf.cm[index].edit.xtype
                            });
                            cf.cm[index].editor.on('focus', function(f) {
                                f.selectText();
                            });
                        }
                        break;
                }
                cmGp.push(cf.cm[index]);
                dinamica++;
            }
        }

        for (var index = 0; index < cf.rd.length; index++) {
            rec.push(cf.rd[index]);

        }
    }
    cmGp.push({
        header: 'Precio MLC',
        width: 80,
        sortable: true,
        align: 'right',
        hidden: false,
        dataIndex: 'preciodivisa',
        tooltip: perfil.etiquetas.lbPrecioMLC,
        renderer: crearToolTip
    });

    cmGp.push({
        header: 'Cantidad',
        width: 70,
        align: 'right',
        sortable: true,
        dataIndex: 'cantidad',
        tooltip: perfil.etiquetas.lbCant,
        renderer: Cantidad,
        editor: new Ext.form.NumberField({
            name: 'cantidad',
            allowBlank: false,
            decimalPrecision: 6,
            minValue: 0,
            listeners: {
                focus: function(f) {
                    f.selectText();
                }
            }
        })
    });
    cmGp.push({
        header: 'Ajuste',
        width: 70,
        sortable: true,
        dataIndex: 'ajuste',
        align: 'right',
        tooltip: perfil.etiquetas.lbAjuste,
        renderer: Cantidad,
        editable: false,
        editor: new Ext.form.NumberField({
            name: 'ajuste',
            allowBlank: false,
            decimalPrecision: 6,
            listeners: {
                focus: function(f) {
                    f.selectText();
                }
            }
        })
    });
    cmGp.push({
        header: 'Cantidad final',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'cantidadfinal',
        tooltip: perfil.etiquetas.lbCantidadFinal,
        renderer: function(v, params, record) {
            params.attr = 'ext:qtip="' + v + '"';
            return Number(record.data.cantidad) + Number(record.data.ajuste);
        }
    });
    cmGp.push({
        header: 'Centro de balance',
        width: 150,
        sortable: true,
        dataIndex: 'centrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'País',
        width: 200,
        sortable: true,
        dataIndex: 'pais',
        tooltip: perfil.etiquetas.lbPais,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Descripción',
        width: 200,
        sortable: true,
        dataIndex: 'descripcion',
        tooltip: perfil.etiquetas.lbDescrip,
        hidden: true,
        renderer: crearToolTip
    });


    cmGp.push({
        header: 'Importe inicial',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'importe',
        tooltip: 'Importe inicial',
        minValue: 0,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe ajust.',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'importeajustado',
        tooltip: perfil.etiquetas.lbImporteAjustado,
        minValue: 0,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe final',
        align: 'right',
        width: 90,
        sortable: true,
        dataIndex: 'importefinal',
        tooltip: perfil.etiquetas.lbImporteFinal,
        minValue: 0,
        renderer: crearToolTip
    });

    cmGp.push({
        header: 'Importe flete',
        width: 90,
        sortable: true,
        align: 'right',
        dataIndex: 'flete',
        tooltip: perfil.etiquetas.lbImporteFS,
        minValue: 0,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe cont.',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'contingencia',
        tooltip: perfil.etiquetas.lbImporteConting,
        minValue: 0,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Base plan',
        width: 60,
        sortable: true,
        dataIndex: 'generadobasesplan',
        tooltip: perfil.etiquetas.lbBasePlan,
        renderer: EsdeBasePlanP
    });
    cmGp.push({
        header: 'Aprobado',
        width: 60,
        align: 'center',
        sortable: true,
        dataIndex: 'idaprobaciondemanda',
        tooltip: perfil.etiquetas.lbAprobado,
        renderer: ColumnaAprobacion
    });
    cmGp.push({
        header: 'Vía de adquisición',
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'viaadquisicion',
        tooltip: perfil.etiquetas.lbViaAdquisicion,
        renderer: crearToolTip

    });
    cmGp.push({
        header: 'Órgano satisface',
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'organosatisface',
        tooltip: perfil.etiquetas.lbOrganoSatis,
        renderer: crearToolTip

    });
    jrStGpGestModelo = new Ext.data.JsonReader({
        totalProperty: 'total',
        importetotal: 'importetotal',
        importedivisatotal: 'importedivisatotal',
        importeflete: 'importeflete',
        importecontingencia: 'importecontingencia',
        cantidadfinal: 'cantidadfinal',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        root: 'data',
        id: 'jrStGpGestModelo',
        fields: rec
    });

    columnasDinamicasgpModelo = new Ext.grid.ColumnModel(cmGp);
    var idindsmGestModelo;

    //para recorrer los indices dinamicos y trabajar con el render nuevo yanila
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = columnasDinamicasgpModelo.findColumnIndex(arrayIndexDinamicos[i]);
        columnasDinamicasgpModelo.setRenderer(indiceColumn, function(value, cell, rec, row, col) {

            if (!objci.acciones.rector && Ext.getCmp('chkglobalP').getValue() == false && identidadEsOD == 1) {
                columnasDinamicasgpModelo.setEditable(col, true);
            } else {
                columnasDinamicasgpModelo.setEditable(col, false);
            }
            // return getRawValue(value, gpModelo.getColumnModel().getCellEditor(col, row).field, gpModelo.getColumnModel(), col);
            return getRawValue(value, columnasDinamicasgpModelo.getCellEditor(col, row).field, columnasDinamicasgpModelo, col);
        })
    }

    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.start = offset;
                this.baseParams.glob = Ext.getCmp('chkglobalP').getValue();
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                this.baseParams.identidad = identidadselected;
                this.baseParams.filtrosD = Ext.encode(filtrosgpModelo.getFilterData());
                cambiarTituloFiltrar();
            },
            load: function(st, rec, obj) {
                if (st.getCount() != 0) {
                    if (identidadEsOD == 0) {
                        if ((eshoja) || (Ext.getCmp('chkglobalP').getValue() == false) && identidadselected != null)
                            mostrarMensaje(1, 'La entidad seleccionada no posee el comportamiento Órgano demandante');
                    }

                    calcularImporteTotal();
                    siexisteIndEnModeloFiltrado();
                    global_tree++;
                }
            },
            loadexception: function() {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrStGpGestModelo
    });

    filtrosgpModelo = new Ext.grid.GridFilters({
        id: 'filtros',
        filters: filterDinamico
    });

    btnLimpiarFiltros = new Ext.Button({
        id: 'btntodoslimp',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        //  text:perfil.etiquetas.lbLimpiarFiltros,
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosgpModelo.clearFilters();
            stGpGestModelo.reload();
        }
    });

    if (objci.acciones.rector) {
        pgGestModelo = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModelo',
            store: stGpGestModelo,
            displayInfo: true,
            items: [btnLimpiarFiltros, '-', cbImportesPlan, {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlan, '-', {
                    xtype: 'tbtext',
                    text: '<b>Cantidad final:</b>'
                }, tfcantidadfinal],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        });
    } else {
        pgGestModelo = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModelo',
            store: stGpGestModelo,
            displayInfo: true,
            items: [btnLimpiarFiltros, '-', cbImportesPlan, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlan],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        });
    }

    //gpModelo.reconfigure(stGpGestModelo, new Ext.grid.ColumnModel(cmGp));

    // pgGestModelo.bind(stGpGestModelo);
    if (urlListar == urlListarConsolidacion) {
        stGpGestModelo.baseParams.idmodelo = treesel;
        stGpGestModelo.baseParams.calcular = calcular;
        stGpGestModelo.baseParams.modelos = Ext.encode(tpBasePlan.getChecked("idmodelo", nodo));
    }
    /* gpModelo.getStore().load({
     params: {
     start: 0,
     limit: 20
     }
     });*/
}

// function para eliminar un modelo de un plan
function eliminarModelo() {

    mostrarMensaje(2, perfil.etiquetas.msgEP, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el plan seleccionado.',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/eliminar',
                params: {
                    identidad: identidadselected,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        tpBasePlan.selectPath(tpBasePlan.getSelectionModel().getSelectedNode().parentNode.getPath());
                        idelemsel = tpBasePlan.getSelectionModel().getSelectedNode().id;
                        Ext.MessageBox.hide();
                        //pcm.layout.setActiveItem('pComentario');
                        /*gpComent.getStore().load({
                         params: {
                         start: 0,
                         limit: 20
                         }
                         });*/
                        mostrarMensaje(1, perfil.etiquetas.msgPlanEliminado);
                        tpBasePlan.getSelectionModel().getSelectedNode().parentNode.reload();
                    } else if (responseData.codMsg == 21) {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorElimMode);
                    }
                }
            });
        }
    }
}

eliminarIndModPlan = function(sModel) {
    mostrarMensaje(2, "¿Está seguro que quiere eliminar el(los) indicador(es) seleccionado(s)?", elimina);
    function elimina(btn) {
        if (btn == 'ok') {
            var aux = sModel.getSelections();
            var arreglo = [];
            var arrayInd = [];
            for (pos in aux) {
                if (aux[pos].id) {
                    arreglo.push(aux[pos].data.idplanificacion);
                    arrayInd.push(aux[pos].data.idindicador);
                }
            }
            var maskElim = Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el(los) indicador(es) seleccionado(s).',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/eliminarIndmodPlan',
                params: {
                    idplanificacion: Ext.encode(arreglo),
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idindicador: Ext.encode(arrayInd),
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {

                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsgD == 1) {

                            mostrarMensaje(1, perfil.etiquetas.msgEliminado);
                            funcionAceptar();
                        } else if (responseData.codMsgD == 21) {

                            mostrarMensaje(3, perfil.etiquetas.msgErrorEliminarDemanda);
                        }
                    } else
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    maskElim.hide();
                }
            });
        }

    }
}
function funcionAceptar() {
    stGpGestModelo.reload();
}

function GuardarTodas() {
    var editadas = stGpGestModelo.getModifiedRecords();
    var count = 0;
    var obj = {};
    var arreglo = [];
    var llave = jrStGpGestModelo.jsonData.llave;
    var llaveprimaria = jrStGpGestModelo.jsonData.llaveprimaria;
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        for (k in rec) {
            if (typeof (rec[k]) == 'object') {
                if (rec[k]) {
                    rec[k] = rec[k].format('d/m/Y');
                }
            }
        }

        if (((Object.keys(rec).length > 0 && !rec['cantidad'] && rec['cantidad'] != 0 && !rec['importe']) ||
                (Object.keys(rec).length > 2 && rec['cantidad'] && rec['importe']) ||
                (Object.keys(rec).length > 1 && rec['cantidad'] && !rec['importe'])) && !rec['ajuste'] && rec['ajuste'] != 0) {
            //rec[llave] = record.data[llave];
            rec[llaveprimaria] = record.data[llaveprimaria];
            rec['insertarenmeta'] = true;
        }

        rec['idplanificacion'] = record.data['idplanificacion'];
        count++;
        arreglo.push(rec);
    }
    obj['idmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo;
    obj['identidadmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
    obj.filas = Ext.encode(arreglo);
    Ext.Ajax.request({
        url: '../gestmodelo/adicionarIndicador',
        params: obj,
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            /*Lo que esta comentariado en este metodo es pa el MINFAR*/
            if (responseData.codMsgM) {

                /*if(responseData.codMsgM == 30){
                    if(editadas.length > 0){
                        mostrarMensaje(1, 'Algunos de los valores insertados sobre los indicadores seleccionados no han sido guardados satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Los valores insertados sobre el indicador seleccionado no han sido guardados satisfactoriamente.');
                    }
                    stGpGestModelo.reload();
                }
                else
                {*/
                    if (responseData.codMsgM == 20) {
                        mostrarMensaje(1, perfil.etiquetas.msgGuardados);
                        stGpGestModelo.reload();
                    } else {
                        editadas.push(record);
                        if (responseData.codMsgM == 3) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                        }
                    }
               // }

            } else {
                editadas.push(record);
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }


        }
    });
}
function cambiarEstadoAjuste(valor) {
    if (aprobarajuste == 0) {

        var mensaje;
        mensaje = 'Desaprobando el(los) ajustes de el(los) indicador(es) seleccionado(s).'
    } else {
        mensaje = 'Aprobando el(los) ajustes de el(los) indicador(es) seleccionado(s).'
    }
    if (smGpGestModelo.getSelections().length >= 1) {

        var aux = smGpGestModelo.getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }
        var rectora;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        var mens;
        if (valor == 5)
            mens = perfil.etiquetas.msgComprobarAjusteAprobar;
        else
            mens = perfil.etiquetas.msgComprobarAjusteDesaprobar;
        mostrarMensaje(2, mens, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: mensaje,
                    width: 350,
                    wait: true,
                    progress: true,
                    closable: false
                });
                Ext.Ajax.request({
                    url: '../gestmodelo/aprobarDesaprobarAjuste',
                    params: {
                        idplanificacion: Ext.encode(arreglo),
                        aprobado: valor
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            if (valor == 5) {
                                mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste, function() {
                                    stGpGestModelo.reload();
                                });
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste, function() {
                                    stGpGestModelo.reload();
                                });
                            }
                        }
                    }

                });
            }
        }
        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}
function cambiarEstadoAjusteTodos(valor) {
    if (aprobarajuste == 0) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var rectora;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    var mens;
    if (valor == 5)
        mens = perfil.etiquetas.msgComprobarAjusteAprobarTodos;
    else
        mens = perfil.etiquetas.msgComprobarAjusteDesaprobarTodos;
    mostrarMensaje(2, mens, function(btn) {
        if (btn == 'ok') {

            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: mensaje,
                width: 300,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/aprobarDesaprobarAjusteTodos',
                params: {
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicio.getValue(),
                    hoja: tpBaseEstructura.getSelectionModel().getSelectedNode().leaf,
                    identidad: tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.id,
                    rectora: rectora
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        if (valor == 4) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste, function() {
                                stGpGestModelo.reload();
                            });
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste, function() {
                                stGpGestModelo.reload();
                            });
                        }

                    }

                }
            });
        }
    }
    );
}
function cambiarEstado(valor) {
    if (desaprobar == 1) {

        var mensaje;
        mensaje = 'Desaprobando el(los) indicador(es) seleccionado(s).'
    } else {
        mensaje = 'Aprobando el(los) indicador(es) seleccionado(s).'
    }
    if (smGpGestModelo.getSelections().length >= 1) {
        var aux = smGpGestModelo.getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }


        var rectora;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        mostrarMensaje(2, perfil.etiquetas.msgComprobar, function(btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: '../gestmodelo/aprobarDesaprobar',
                    params: {
                        arrayidplanificacion: Ext.encode(arreglo),
                        aprobado: valor,
                        rectora: rectora
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgAD == 1) {

                            if (valor == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobado);
                                stGpGestModelo.reload();
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgAprobado);
                                stGpGestModelo.reload();
                            }
                        } else {
                            if (responseData.codMsgAD == 3) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                            }
                            if (responseData.codMsgAD == 21) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                            }
                            if (responseData.codMsgAD == 22) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
                            }
                        }
                        mymask.hide();
                    }

                });
            }
        }
        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}

function FuncionSegu() {
    mostrarMensaje(1, perfil.etiquetas.msgDesaprobado);
}
function FuncionSegu2() {
    mostrarMensaje(1, perfil.etiquetas.msgAprobado);
}

function cambiarEstadoTodos(valor) {
    if (desaprobar == 1) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var rectora;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    var arrayidindicadores = [];
    if (stGpGestModelo.getCount() >= 1) {
        for (var i = 0; i < stGpGestModelo.getCount(); i++) {
            arrayidindicadores.push(stGpGestModelo.getAt(i).get('idindicador'));
        }
    }
    if (desaprobar == 1) {
        var mensaje1;
        mensaje1 = perfil.etiquetas.msgComprobarDesTodos;
    } else {
        mensaje1 = perfil.etiquetas.msgComprobarTodos;
    }
    mostrarMensaje(2, mensaje1, function(btn) {
        if (btn == 'ok') {
            Ext.Ajax.request({
                url: '../gestmodelo/aprobarTodos',
                params: {
                    //idindicadores: Ext.encode(arrayidindicadores),
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicio.getValue(),
                    rectora: rectora

                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgM == 1) {
                        if (valor == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoTodo);
                            stGpGestModelo.reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoTodo);
                            stGpGestModelo.reload();
                        }

                    } else {
                        if (responseData.codMsgM == 3) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                        }
                        if (responseData.codMsgM == 21) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                        }
                        if (responseData.codMsgM == 22) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
                        }
                    }


                }
            });
        }
    }
    );
}

function ActualizarIU(id) {
    stGpGestModelo.getById(id).commit();
    if (fila <= stGpGestModelo.getCount() - 1) {
        gpModelo.startEditing(fila, columna);
    }
}
function habilitarDesabilitarAprobacionAjuste(bandera) {

    if (!objci.acciones.rector) {
        Ext.getCmp('menuAprobAjuste').hide();
    } else {
        if (bandera) {
            if (smGpGestModelo.getSelections().length == 1) {

                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '5' && smGpGestModelo.getSelected().data.ajuste != '0.0000') {
                    Ext.getCmp('btnAprobAjuste').disable();
                    if (Ext.getCmp('chkglobalP').getValue() == false && identidadEsOD == 1)
                        Ext.getCmp('btnDesAjuste').enable();
                } else if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4' && smGpGestModelo.getSelected().data.ajuste != '0.0000') {
                    if (Ext.getCmp('chkglobalP').getValue() == false && identidadEsOD == 1)
                        Ext.getCmp('btnAprobAjuste').enable();
                    Ext.getCmp('btnDesAjuste').disable();
                }

            } else {
                if (Ext.getCmp('chkglobalP').getValue() == false && identidadEsOD == 1) {
                    Ext.getCmp('btnAprobAjuste').enable();
                    Ext.getCmp('btnDesAjuste').enable();
                } else {
                    Ext.getCmp('btnAprobAjuste').disable();
                    Ext.getCmp('btnDesAjuste').disable();
                }

            }
        } else {
            Ext.getCmp('btnAprobAjuste').disable();
            Ext.getCmp('btnDesAjuste').disable();
        }
    }
}

function habilitarDesabilitar(bandera) {
    if (bandera) {
        if (smGpGestModelo.getSelections().length == 1) {
            aprobarDesaprobar(false);
            Ext.getCmp('mdAddcoment').show();
        } else {
            aprobarDesaprobar(true);
            Ext.getCmp('mdAddcoment').hide();
        }
    } else {
        Ext.getCmp('mdAddcoment').hide();
        Ext.getCmp('btnAprob').disable();
        Ext.getCmp('btnDes').disable();
        Ext.getCmp('btnEliminarInds').disable();
    }
}

function aprobarDesaprobar(multi) {
    if (multi) {
        Ext.getCmp('btnAprob').enable();
        Ext.getCmp('btnDes').enable();
        Ext.getCmp('btnEliminarInds').enable();
    } else {
        var rectora = false;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '1') {
            if (smGpGestModelo.getSelected().get('cantidad') > 0) {
                Ext.getCmp('btnAprob').enable();
            } else {
                Ext.getCmp('btnAprob').disable();
            }
            Ext.getCmp('btnDes').disable();
            Ext.getCmp('btnEliminarInds').enable();
        } else {
            if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '2') {
                if (rectora) {
                    if (smGpGestModelo.getSelected().get('cantidad') > 0) {
                        Ext.getCmp('btnAprob').enable();
                    } else {
                        Ext.getCmp('btnAprob').disable();
                    }
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                } else {
                    Ext.getCmp('btnAprob').disable();
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                }
            } else {
                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
                    if (rectora) {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').enable();
                        Ext.getCmp('btnEliminarInds').disable();
                    } else {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').disable();
                        Ext.getCmp('btnEliminarInds').disable();
                    }
                } else {
                    if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '5') {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').disable();
                    }
                }
            }
        }
    }

}

function ColumnaAprobacion(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1 || val == 2) {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + "No" + '"';
    } else if (val == 3) {
        m.css = 'icondistra-true amarillo';
        m.attr = 'ext:qtip="' + "Sí" + '"';
    } else if (val == 5) {
        m.css = 'icondistra-true azul';
        m.attr = 'ext:qtip="' + "Ajuste" + '"';
    } else {
        if (val == 4) {
            m.attr = 'ext:qtip="' + "Rector" + '"';
            m.css = 'icondistra-true verde';
        }
    }
}

//CON ESTA FUNCION SE PUEDEN PINTAR LAS CELDAS DE UN GRID
function configurarColoresCeldas() {
    for (var i = 0; i < gpModelo.getStore().getCount(); i++) {
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-aprobada2');
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-aprobada3');
        if (gpModelo.getStore().getAt(i).get('idaprobaciondemanda') > 1) {
            if (gpModelo.getStore().getAt(i).get('idaprobaciondemanda') > 2)
                Ext.get(gpModelo.getView().getRow(i)).addClass('fila-aprobada3');
            else
                Ext.get(gpModelo.getView().getRow(i)).addClass('fila-aprobada2');
        }
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-comentada');
        if (gpModelo.getStore().getAt(i).get('comentario')) {
            Ext.get(gpModelo.getView().getRow(i)).addClass('fila-comentada');
        }
    }
}

function cambiarTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgpModelo.getFiltrosActivos() == undefined || filtrosgpModelo.getFiltrosActivos().length == 0) {
        pModelo.setTitle(perfil.etiquetas.titModelos);
        //pModelo.setTitle('Detalles del plan');
    } else {
        for (i = 0; i < filtrosgpModelo.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == 'denominacion') {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "preciodivisa") {
                aux = perfil.etiquetas.lbPrecioMLC;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "umedida") {
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "cantidad") {
                aux = "Cantidad";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "ajuste") {
                aux = "Ajuste";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "idaprobaciondemanda") {
                aux = "Aprobación";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "cantidadfinal") {
                aux = "Cantidad Final";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "importeajustado") {
                aux = "Importe Ajustado";
            }
            if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "importefinal") {
                aux = "Importe Final";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = "Importe Inicial";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "importedivisa") {
                aux = "Importe en MLC";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "flete") {
                aux = perfil.etiquetas.lbImporteFS;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "contingencia") {
                aux = perfil.etiquetas.lbImporteConting;
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "viaadquisicion") {
                aux = "Vía de adquisición";
            } else if (filtrosgpModelo.getFiltrosActivos()[i].dataIndex == "organosatisface") {
                aux = "Órgano que satisface";
            }
            if (i == filtrosgpModelo.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        //pModelo.setTitle(perfil.etiquetas.titModelos + perfil.etiquetas.lbFiltradoPor + filtrado_por);
        pModelo.setTitle('Detalles del plan ' + '<i>- Filtrado por: ' + filtrado_por);
        filtrado_por = "";
    }
}

function siexisteIndEnModeloFiltrado() {
    if ((filtros.getFiltrosActivos().length > 0) && (stGpGestModelo.getCount() == 0))
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function ValidateMenu() {
    if (smGpGestModelo.getSelections().length == 1) {
        Ext.getCmp('mdAddcoment').setVisible(true);
        if (smGpGestModelo.getSelected().data.comentario) {
            Ext.getCmp('vercomentario').setVisible(true);
        } else {
            Ext.getCmp('vercomentario').setVisible(false);
        }
    } else {
        Ext.getCmp('vercomentario').setVisible(false);
        Ext.getCmp('mdAddcoment').setVisible(false);
    }
}

function EsdeBasePlanP(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + "Sí" + '"';
        return 'Sí';

    } else if (val == 0) {
        m.attr = 'ext:qtip="' + "No" + '"';
        return 'No';
    } else if (val == 2) {
        m.attr = 'ext:qtip="' + "Afectada" + '"';
        return 'Afectada';
    }
}

function accionAprobar() {
    var rectora = false;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    if (rectora)
        cambiarEstado(4);
    else
        cambiarEstado(2);
}


function presupuesto() {
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeOG.each(function(rec) {
                    Ext.get('checkgridogog_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = true;
                    sel_.checked = true;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaeog_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = false;
                    sel_.checked = false;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaeog_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaeog_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel_ = _this.getSelections();
            }
        }
    });
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpOG.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpOG.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                gpOG.getSelectionModel().clearSelections();
                                Ext.get('checkgridogog_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaeog_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpOG.getStore().each(function(r) {
                        gpOG.getSelectionModel().clearSelections();
                        Ext.get('checkgridogog_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpOG.getSelectionModel().selectAll();
                    gpOG.getSelectionModel().clearSelections();
                    gpOG.disable();
                } else {
                    var aux = (obj) ? obj[0] : [];
                    if (aux.length == 0)
                        aux.DatPlanificacionnae = [];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpOG.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                    gpOG.getSelectionModel().clearSelections();
                                    Ext.get('checkgridogog_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaeog_' + record.id).dom.checked = false;
                }
            }
        }
    });
    //creando el repositorio de datos
    storeNAE = new Ext.data.Store({
        url: baseUrl + 'cargarnaes',
        listeners: {
            beforeload: function() {
                storeNAE.baseParams.start = offsetNae;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel


    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'expandir',
            header: "NAE",
            //width: 100,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    //Combo para ver  la cantidad

    stCbPaginado1 = new Ext.data.SimpleStore({
        fields: ['idnumpagi', 'dennumpagi'],
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
    cbPaginado1 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado1,
        displayField: 'dennumpagi',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagi',
        valueField: 'idnumpagi',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado2').pageSize = record.data.idnumpagi;
                Ext.getCmp('paginado2').doLoad(Ext.getCmp('paginado2').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //creamos una variable para referenciar a nuesto objeto
    paginado2 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true,
        items: [btnLimpiarFiltrosP/*, cbPaginado1*/],
        listeners: {
            beforechange: function(p, e) {
                offsetNae = e.start;
            }
        }
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        plugins: filtrosNAE,
        cm: myColumnModel,
        sm: smNAE,
        autoExpandColumn: 'expandir',
        height: 250,
        width: 450,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado2,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociar.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaeog', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaeobjetogasto',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaeog');
                                if (response.cod == 1) {
                                    winAsociar.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente', function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }

                            }
                        });
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    storeOG = new Ext.data.Store({
        url: baseUrl + 'cargarobjetosgasto',
        listeners: {
            beforeload: function() {
                storeOG.baseParams.start = offsetOG;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idobjetogasto'
        }, [{
                name: 'idobjetogasto'
            }, , {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //******check***********
    checkOG = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModelOG = new Ext.grid.ColumnModel([
        {
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_OG
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'idcolumnog',
            header: "Denominación",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosOG = new Ext.Button({
        id: 'btnLimpiarFiltrosOG',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosOG.clearFilters();
            storeOG.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagina', 'dennumpagina'],
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
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagina',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagina',
        valueField: 'idnumpagina',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado1').pageSize = record.data.idnumpagina;
                Ext.getCmp('paginado1').doLoad(Ext.getCmp('paginado1').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    paginado1 = new Ext.PagingToolbar({
        store: storeOG,
        id: 'paginado1',
        displayInfo: true,
        items: [btnLimpiarFiltrosOG/*, cbPaginado3*/],
        listeners: {
            beforechange: function(p, e) {
                offsetOG = e.start;
            }
        }
    });
    filtrosOG = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto
    gpOG = new Ext.grid.GridPanel({
        title: 'Objeto de Gasto',
        region: 'center',
        id: 'gpOG',
        store: storeOG,
        cm: myColumnModelOG,
        plugins: filtrosOG,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumnog',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado1,
        listeners: {
            start: 0,
            limit: 20
        }
    });
    gpOG.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelar',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        text: 'Cancelar',
        handler: function() {

            winAsociar.close()
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        //icon: perfil.dirImg + 'asociar.png',
        iconCls: 'asociar',
        text: 'Asociar',
        handler: function() {
            idnaes = [];
            del = 0;
            idplanificaciones = [];
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociar.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = 1;
            if (gpNAE.getSelectionModel().getSelected() && gpOG.getSelectionModel().getSelected() && selections_plan) {
                Planificacion.mostrarMascara('mascaraAsociarOG', 'Por favor espere...', 'Aplicando cambios');
                Ext.Ajax.request({
                    url: baseUrl + 'asociarmodeloaobjetogasto',
                    params: {
                        idplanificaciones: Ext.encode(idplanificaciones),
                        idnaes: Ext.encode(idnaes),
                        del: del,
                        idobjgasto: gpOG.getSelectionModel().getSelected().id,
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        respuesta = Ext.decode(response.responseText);
                        Planificacion.ocultarMascara('mascaraAsociarOG');
                        if (respuesta.cod == 3) {
                            mostrarMensaje(3, 'Ha ocurrido un error');
                        } else if (respuesta.cod == 1) {
                            winAsociar.close();
                            mostrarMensaje(1, 'Se han realizado los cambios correctamente', function() {
                                storeAsociadoaPresupuesto.reload();
                            });
                        }
                    }
                });
            } else {
                mostrarMensaje(3, 'Debe seleccionar un NAE y un Objeto de gasto');
            }
        }
    });
    winAsociar = new Ext.Window({
        title: "Asociar a Objeto de Gasto",
        width: 1000,
        layout: 'border',
        height: 300,
        constrain: true,
        modal: true,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpOG]
    });
    cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }
        }
    });
    storeOG.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }

        }
    });
}

function recursofinaciero() {
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeRecurso.each(function(rec) {
                    Ext.get('checkgridrfrf_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = true;
                    sel.checked = true;
                    entro = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaerf_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = false;
                    sel.checked = false;
                    entro = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaerf_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaerf_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel = _this.getSelections();
            }
        }
    });
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpRF.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpRF.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                gpRF.getSelectionModel().clearSelections();
                                Ext.get('checkgridrfrf_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaerf_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpRF.getStore().each(function(r) {
                        gpRF.getSelectionModel().clearSelections();
                        Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpRF.getSelectionModel().selectAll();
                    gpRF.getSelectionModel().clearSelections();
                    gpRF.disable();
                } else {
                    var aux = obj[0];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpRF.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                    gpRF.getSelectionModel().clearSelections();
                                    Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaerf_' + record.id).dom.checked = false;
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {

            }
        }
    });
    //creando el repositorio de datos
    storeNAE = new Ext.data.Store({
        url: baseUrl + 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'expandir',
            header: "NAE",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagin', 'dennumpagin'],
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
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagin',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagin',
        valueField: 'idnumpagin',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado3').pageSize = record.data.idnumpagin;
                Ext.getCmp('paginado3').doLoad(Ext.getCmp('paginado3').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //creamos una variable para referenciar a nuesto objeto
    paginado3 = new Ext.PagingToolbar({
        store: storeNAE,
        id: 'paginado3',
        displayInfo: true,
        items: [btnLimpiarFiltrosP, cbPaginado3]
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
        plugins: filtrosNAE,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado3,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociarRF.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaerf', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaerecursos',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()

                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaerf');
                                if (response.cod == 1) {
                                    winAsociarRF.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente', function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }

                            }
                        });
                    }
                }]
        }),
        autoExpandColumn: 'expandir',
        height: 250,
        width: 480,
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    storeRecurso = new Ext.data.Store({
        url: baseUrl + 'cargarnrecursosfinacieros',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idrecursofinanciero'
        }, [{
                name: 'idrecursofinanciero'
            }, {
                name: 'codigo'
            }, , {
                name: 'denominacion'
            }])
    });
    stCbPaginado = new Ext.data.SimpleStore({
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
    cbPaginado = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginadoRF').pageSize = record.data.idnumpag;
                Ext.getCmp('paginadoRF').doLoad(Ext.getCmp('paginadoRF').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnLimpiarFiltrosRF = new Ext.Button({
        id: 'btnLimpiarFiltrosRF',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosRF.clearFilters();
            storeRecurso.reload();
        }
    });
    paginadoRF = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeRecurso,
        id: 'paginadoRF',
        displayInfo: true,
        items: [btnLimpiarFiltrosRF, cbPaginado]
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModelRF = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_RF
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'idcolumrf',
            header: "Recurso financiero",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    filtrosRF = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto

    gpRF = new Ext.grid.GridPanel({
        title: 'Recurso finaciero',
        region: 'center',
        store: storeRecurso,
        plugins: filtrosRF,
        id: 'gpRF',
        cm: myColumnModelRF,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumrf',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginadoRF,
        listeners: {
            start: 0,
            limit: 20,
            rowclick: function(_this, rowindex, event) {

            }
        }
    });
    gpRF.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelarrf',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        text: 'Cancelar',
        handler: function() {
            winAsociarRF.close();
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        // icon: perfil.dirImg + 'asociar.png',
        iconCls: 'asociar',
        text: 'Asociar',
        handler: function() {
            idnaes = [];
            idplanificaciones = [];
            del = 0;
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociarRF.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = true;
            Planificacion.mostrarMascara('mascaraAsociarRF', 'Por favor espere...', 'Aplicando cambios');
            Ext.Ajax.request({
                url: baseUrl + 'asociarmodeloarecursofinaciero',
                params: {
                    idplanificaciones: Ext.encode(idplanificaciones),
                    idnaes: Ext.encode(idnaes),
                    del: del,
                    idingreso: gpRF.getSelectionModel().getSelected().id,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {
                    respuesta = Ext.decode(response.responseText);
                    Planificacion.ocultarMascara('mascaraAsociarRF');
                    if (respuesta.cod == 3) {
                        mostrarMensaje(3, 'Ha ocurrido un error');
                    } else if (respuesta.cod == 1) {
                        winAsociarRF.close();
                        mostrarMensaje(1, 'Se han realizado los cambios correctamente', function() {
                            storeAsociadoaPresupuesto.reload();
                        });
                    }
                }
            });
        }
    });
    winAsociarRF = new Ext.Window({
        title: "Asociar a Recurso financiero",
        width: 1000,
        layout: 'border',
        height: 300,
        constrain: true,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        modal: true,
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpRF]
    })
    var cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
    storeRecurso.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
}
//stopEvent
function getCheck(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaerf_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaerf_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function getCheck_RF(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow(this.id)' type='checkbox' id='" + "checkgridrfrf_" + record.id + "'>";
    return check;
}
function getCheck_(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaeog_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaeog_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function getCheck_OG(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow_(this.id)' type='checkbox' id='" + "checkgridogog_" + record.id + "'>";
    return check;
}
function stopEvent(id) {
    check = Ext.get(id);
    check.dom.checked = !check.dom.checked;
}
function selectRow(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpRF').getStore();
    if (entro)
        check.dom.checked = sel.checked;
    if (!check.dom.checked) {
        index = store.find('idingreso', idrecord);
        Ext.getCmp('gpRF').getSelectionModel().deselectRow(index);
    }
    entro = false;
}
function selectRow_(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpOG').getStore();
    if (entro_)
        check.dom.checked = sel_.checked;
    if (!check.dom.checked) {
        index = store.find('idobjetogasto', idrecord);
        Ext.getCmp('gpOG').getSelectionModel().deselectRow(index);
    }
    entro_ = false;
}
function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';

    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}

function eliminarTodasAsociaciones(idplanificaciones) {
    if (idplanificaciones.length > 0) {
        ids = [];
        for (var j = 0; j < idplanificaciones.length; j++) {
            ids.push(idplanificaciones[j].data.idplanificacion);
        }
        Planificacion.mostrarMascara('eliminarasociaciones', 'Eliminando las asociaciones', 'Desasociando...');
        Ext.Ajax.request({
            url: baseUrl + 'eliminarasociaciones',
            params: {
                idplanificaciones: Ext.encode(ids),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                response = Ext.decode(response.responseText);
                Planificacion.ocultarMascara('eliminarasociaciones');
                if (response.cod == 1) {
                    mostrarMensaje(1, 'Se han eliminado las asociaciones correctamente', function() {
                        storeAsociadoaPresupuesto.reload();
                    });
                }


            }
        });
    }
}
if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];
        for (k in obj)
            if (obj.hasOwnProperty(k))
                keys.push(k);
        return keys;
    };
}

function tresdecimales(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(3);
}

function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000'); //indice 1 MN
    importes.push('0.000'); //indice 2 MLC
    importes.push('0.000'); //indice 3 IFlete
    importes.push('0.000'); //indice 4 IContingencia
}

function calcularImporteTotal() {
    setearImporte();
    if (stGpGestModelo.getCount() > 0) {
        importes[1] = jrStGpGestModelo.jsonData.importetotal;
        importes[2] = jrStGpGestModelo.jsonData.importedivisatotal;
        importes[3] = jrStGpGestModelo.jsonData.importeflete;
        importes[4] = jrStGpGestModelo.jsonData.importecontingencia;
        importes[5] = jrStGpGestModelo.jsonData.importeajustado;
        importes[6] = jrStGpGestModelo.jsonData.importefinal;
        tfImportePlan.setValue(importes[cbImportesPlan.getValue()]);
        tfcantidadfinal.setValue(jrStGpGestModelo.jsonData.cantidadfinal);
    } else {
        tfImportePlan.setValue(importes[0]);
        tfcantidadfinal.setValue(importes[0]);
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}


function siexistecolumFiltrada() {
    if (filtrosGpdemandacentrobalance.getFiltrosActivos().length > 0 && stGpdemandacentrobalance.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
}
function siexistecolumFiltradaVer() {
    if (filtrosGpVerAct.getFiltrosActivos().length > 0 && stGpVerAct.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function ValidarOperacion(campo, valor, sm) {

    if (campo == 'ajuste' && valor < 0 && (-1 * valor) > sm.record.data.cantidad) {

        Ext.MessageBox.show({
            title: 'Información',
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgAjusteIncorrecto,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }
}

function exportarModelos(tipoRpt) {
    window.open('exportarModeloProduccion?identidad=' + tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.id
            + '&denomentidad=' + tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.text
            + '&idejercicio=' + cbEjercicio.getValue() + '&denomejercicio=' + cbEjercicio.getRawValue() + '&tipoRpt=' + tipoRpt);
}

//function exportarModeloGastosCostos() {
//    window.open('exportarModeloGastosCostos?identidad=' + tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.id
//            + '&denomentidad=' + tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.text
//            + '&idejercicio=' + cbEjercicio.getValue() + '&denomejercicio=' + cbEjercicio.getRawValue());
//}
function crearGridModelo(filtrosgpModelo, stGpGestModelo, columnasDinamicasgpModelo, pgGestModelo, smGpGestModelo) {
    //var id = idGridModelo.(idGridModelo);

    return new Ext.grid.EditorGridPanel({
        store: stGpGestModelo,
        id: 'gpModelo',
        region: 'center',
        sm: smGpGestModelo,
        cm: columnasDinamicasgpModelo,
        frame: true,
        //  columnsByDemand: true,
        plugins: filtrosgpModelo,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: pgGestModelo,
        md: new Ext.menu.Menu({
            id: 'mdGrid',
            items: [{
                    text: perfil.etiquetas.lbTtbtnComen,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    id: 'mdAddcoment',
                    handler: function() {
                        fpComent.getForm().reset();
                        winAddComent.show(Ext.getBody());
                        winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
                        Ext.getCmp('idelemcoment').setValue(smGpGestModelo.getSelected().get('idplanificacion'));
                    }
                }, {
                    text: perfil.etiquetas.lbVerComent,
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    disabled: false,
                    id: 'vercomentario',
                    handler: function() {
                        idelementoComentado = smGpGestModelo.getSelected().get('idplanificacion');
                        mostrarComentarios();
                    }
                }, {
                    text: 'Ajustar',
                    itemCls: 'x-menu-item icondistra-ajustar',
                    iconCls: 'imagen-none',
                    id: 'ajustarind',
                    handler: function() {
                        CargarImporteinicialAjuste();
                    }
                }
            ]
        }),
        listeners: {
            beforeedit: function(e) {

//Por ponce para el renderer luego
                columnasDinamicasgpModelo.getCellEditor(e.column, e.row).field.renderiza = true;
                fila = e.row;
                columna = e.column;
            },
            afteredit: function(e) {
            },
            validateedit: function(e) {
                if (consolidado == 1)
                    e.cancel = true;
                if (e.originalValue != e.value)
                    columnasDinamicasgpModelo.getCellEditor(e.column, e.row).field.renderiza = true;
                else
                    e.cancel = true;
                campo = e.field;
                valor = e.value;
                ValidarOperacion(campo, valor, e);
            },
            rowcontextmenu: function(g, r, e) {

                if (Ext.getCmp('chkglobalP').getValue() == true || identidadEsOD == 0) {
                    e.stopEvent();
                    // gpModelo.getSelectionModel().selectRow(r);
                    ValidateMenu();

                } else {

                    if (!objci.acciones.rector) {
                        if (smGpGestModelo.getSelections().length == 1) {
                            if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
                                e.stopEvent();
                                Ext.getCmp('gpModelo').getSelectionModel().selectRow(r);
                                Ext.getCmp('ajustarind').show();
                                ValidateMenu();
                                Ext.getCmp('gpModelo').md.showAt(e.getXY());
                            }
                        } else if (smGpGestModelo.getSelections().length > 1) {
                            e.stopEvent();
                            Ext.getCmp('gpModelo').getSelectionModel().selectRow(r);
                            Ext.getCmp('ajustarind').show();
                            ValidateMenu();
                            Ext.getCmp('gpModelo').md.showAt(e.getXY());
                        }
                    }

                }
            }
        }
    });
}





