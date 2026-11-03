perfil.etiquetas = Object();
var adicionar = true;
var winAdd, ctrladd = true, cfgridpanel, fsMod, fsEncabesado;
var tempTipoModeloSeleccionado = 0;
var urlListarConsolidacion = 'listarConsolidacion';
var urlListarIndModelo = '../gestmodelo/listarIndModelo';
var urlListar = '../gestmodelo/ListarIndModelo';
var baseUrl = '../gestmodelo/';
var urlCbUM = '../gestmodelo/cargarunidadmedida';
var urlCbPais = '../gestmodelo/listarPais';
var urlCbCentBalance = '../gestmodelo/listarCentroBalance';

var cantidad = 0, precio = 0.000000, preciodivisa = 0.000000, fila, columna, jrStGpGestModelo;
var combNomencOld, combNomencNew, combNomenc, btnLimpiarFiltros, nfImporte;
var global_tree = 2;
var winAsociar, obj, sel, entro, sel_, entro_, antedit, despedit, desaprobar;
var importes = [];
iniciaModelo = function() {
	Ext.Ajax.timeout = 600000;
    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.consolid = consolidado;
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
                this.baseParams.idejercicio = Ext.getCmp('idejerc1').getValue();
            },
            load: function() {
                smGpGestModelo.selectFirstRow();
                calcularImporteTotal();

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
        }
        ])
    });

    tfImportePlan = new Ext.form.TextField({
        id: 'idtfImportePlan',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        // enableKeyEvents:true,
        emptyText: '0.000'
    });

    stCbImportesPlan = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
        [1, perfil.etiquetas.lbImporteMNTotal],
        [2, perfil.etiquetas.lbImporteTotalMLC],
        [3, perfil.etiquetas.lbImporteFlete],
        [4, perfil.etiquetas.lbImporteConti]
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

    btnLimpiarFiltros = new Ext.Button({
        id: 'btntodoslimp',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        //  text:perfil.etiquetas.lbLimpiarFiltros,
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtros.clearFilters();
            stGpGestModelo.reload();
        }
    });
    btnLimpiarFiltrosDemanda = new Ext.Button({
        id: 'btntodos',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbLimpiarFiltros,
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosGpdemandacentrobalance.clearFilters();
            stCmbEspecialidad.reload();
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
            }, tfImportePlan]
        });
    } else
{
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
    }



    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtros = new Ext.grid.GridFilters({
        filters: [
        {
            type: 'string',
            dataIndex: 'codigo'
        }, {
            type: 'string',
            dataIndex: 'numeropieza'
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'listado',
            dataIndex: 'umedida',
            idcombo: 'idumedidaindicadores',
            urlcb: urlCbUM,
            mode: 'remote',
            idstore: 'idstumedidaindicadores',
            valueFieldcb: 'idunidadmedida',
            displayFieldcb: 'nombreum',
            autoload: false,
            mode:'remote'
        },
        {/*temporal arreglar el listar para que liste centros de balance*/
            type: 'listado',
            dataIndex: 'centrobalance',
            idcombo: 'idcbcentrobalancenorma',
            urlcb: urlCbCentBalance,
            idstore: 'idstcentrobalancenorma',
            valueFieldcb: 'idcentrobalance',
            displayFieldcb: 'centrobalance'
        // autoload:false,
        // mode:'remote'
        },
        {/*temporal arreglar el listar para que liste centros de balance*/
            type: 'listado',
            dataIndex: 'pais',
            idcombo: 'idcbpaisnorma',
            urlcb: urlCbPais,
            idstore: 'idstpais',
            valueFieldcb: 'idpais',
            displayFieldcb: 'nombrepais',
            autoload: false,
            mode: 'remote'
        },
        {
            type: 'list',
            dataIndex: 'idaprobaciondemanda',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector]
        },
        {
            type: 'numeric',
            dataIndex: 'precio'
        }, {
            type: 'numeric',
            dataIndex: 'preciodivisa'
        },
        {
            type: 'numeric',
            dataIndex: 'cantidad'
        }, {
            type: 'numeric',
            dataIndex: 'importe'
        }, {
            type: 'numeric',
            dataIndex: 'importedivisa'
        }, {
            type: 'list',
            dataIndex: 'generadobasesplan',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
        }, {
            type: 'numeric',
            dataIndex: 'flete'
        }, {
            type: 'numeric',
            dataIndex: 'contingencia'
        }
        ]
    });

    cmGpGestMdelo = new Ext.grid.ColumnModel([]);

    smGpGestModelo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(x, y, w) {
                habilitarDesabilitar(true);
            },
            rowdeselect: function(s, n, r) {
                if (smGpGestModelo.getSelections().length == 0)
                {
                    habilitarDesabilitar(false);
                }
                else
                {
                    habilitarDesabilitar(true);
                }
            }
        }
    });

    btnAprob = new Ext.Button({
        disabled: true,
        id: 'btnAprob',
        tooltip: 'Aprobar el indicador seleccionado (Alt+Q)',
        tabIndex: 4,
        icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnAprobar,
        handler: function() {
            desaprobar = 0;
            accionAprobar();

        }
    });
    btnDes = new Ext.Button({
        disabled: true,
        id: 'btnDes',
        tabIndex: 5,
        tooltip: 'Desaprobar el indicador seleccionado (Alt+W)',
        icon: perfil.dirImg + 'desaprobar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnDesaprobar,
        handler: function() {
            desaprobar = 1;
            cambiarEstado(1);
        }
    });

    btnAprobTodos = new Ext.Button({
        //disabled:true,
        id: 'btnAprobTodos',
        tabIndex: 4,
        icon: perfil.dirImg + 'aprobar.png',
        tooltip: ' Aprobar todos los indicadores (Ctrl+Alt+Q)',
        iconCls: 'btn',
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
    });
    btnDesTodos = new Ext.Button({
        // disabled:true,
        id: 'btnDesTodos',
        tabIndex: 5,
        icon: perfil.dirImg + 'desaprobar.png',
        tooltip: 'Desaprobar todos los indicadores (Ctrl+Alt+W)',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnDesaprobarTodos,
        handler: function() {
            desaprobar = 1;
            cambiarEstadoTodos(1);
        }
    });

    btnExportar = new Ext.Button({
        disabled: false,
        id: 'btnExportar',
        hidden: false,
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: 'Exportar indicadores del plan.(ALt+E)',
        text: 'Exportar',
        handler: function() {
            var selectedEntity = tpBaseEstructura.selModel.getSelectedNode().text;
            var selectedPlan = tpBasePlan.selModel.getSelectedNode().text;
            var win = window.open('exportar?entidad=' + selectedEntity + '&plan=' + selectedPlan + '&hoja=' + eshoja + '& idmodelo=' + treesel + '& identidadmodelo=' + tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo + '& identidad=' + identidadselected + '& filtros=' + Ext.encode(filtros.getFilterData()));
        }
    });

    btnVerDemanda = new Ext.Toolbar.Button({
        id: 'btnVerDemanda',
        icon: perfil.dirImg + 'ver.png',
        iconCls: 'btn',
        text: 'Ver Demanda',
        handler: function() {
            windemandacentrobalance.show();

            if (objci.acciones.rector == undefined) {
                cbCtroBalance.setValue(stcbCtroBalance.data.items[0].data.identidad);
                stGpdemandacentrobalance.reload();
                cbCtroBalance.disable();
            }
            if(cbCtroBalance.getValue()!=""){
                stCmbEntidad.load({
                    params: {
                        identiCB: cbCtroBalance.getValue()
                    }
                });
            }
        }
    });

    gpModelo = new Ext.grid.EditorGridPanel({
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
        {
            xtype: 'tbbutton',
            text: perfil.etiquetas.lbBtnAdicionar,
            tooltip: 'Adicionar indicadores(Alt+I)',
            id: 'btnAdicionarInds',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            handler: function() {

                importarJS('../../views/js/comun/indicadorespornivel.js');
            }
        }, {
            xtype: 'tbbutton',
            disabled: true,
            text: perfil.etiquetas.lbBtnEliminar,
            tooltip: 'Eliminar indicadores(DEL)',
            id: 'btnEliminarInds',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            handler: function() {
                eliminarIndModPlan();
            }
        }

        , btnAprob, btnDes, btnAprobTodos, btnDesTodos,
        {
            xtype: 'tbbutton',
            text: perfil.etiquetas.lbBtnGuardar,
            tooltip: 'Guardar datos de los indicadores (Alt+G)',
            id: 'btnGuardar',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            handler: function() {
                GuardarTodas();
            }
        }, btnExportar],
        bbar: pgGestModelo,
        md: new Ext.menu.Menu({
            id: 'mdGrid',
            items: [{
                text: perfil.etiquetas.lbTtbtnComen,
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                id: 'mdAddcoment',
                handler: function() {
                    fpComent.getForm().reset();
                    winAddComent.show(Ext.getBody());
                    winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
                    Ext.getCmp('idelemcoment').setValue(smGpGestModelo.getSelected().get('idplanificacion'));
                }
            }, {
                text: perfil.etiquetas.lbVerComent,
                icon: perfil.dirImg + 'ver.png',
                iconCls: 'btn',
                id: 'vercomentario',
                handler: function() {
                    idelementoComentado = smGpGestModelo.getSelected().get('idplanificacion');
                    mostrarComentarios();
                }
            },
            /*Por desarrollar,
                 {
                 text: "Eliminar asociaciones",
                 icon:perfil.dirImg  + 'eliminar.png',
                 iconCls:'btn',
                 id:'eliminarAsociacionesButton',
                 hidden:true,
                 handler : function(){
                 eliminarTodasAsociaciones(smGpGestModelo.getSelections());
                 }
                 },
                 {
                 text: "Asociar Indicadores a Control de Divisa",
                 icon:perfil.dirImg  + 'asociar.png',
                 iconCls:'btn',
                 id:'asociarcontroldivisaButton',
                 //hidden:true,
                 handler : function(){
                 alert("Pincha");
                 }
                 },{
                 text: "Asociar Indicadores a otros Codificadores",
                 icon:perfil.dirImg  + 'asociar.png',
                 iconCls:'btn',
                 id:'asociarclasificadoresButton',
                 //hidden:true,
                 handler : function(){
                 alert("Pincha"); 
                 }
                 }*/
            ]
        }),
        listeners: {
            beforeedit: function(e) {


                //Por ponce para el renderer luego
                //gpModelo.getColumnModel().getCellEditor(e.column, e.row).field.renderiza = true;
                fila = e.row;
                columna = e.column;
                if (e.record.get('idaprobaciondemanda') > 1) {
                    e.cancel = true;
                }
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


            },
            rowcontextmenu: function(g, r, e) {
                if (eshoja == 0) {
                    e.stopEvent();
                    gpModelo.getSelectionModel().selectRow(r);
                    ValidateMenu();
                    if (gpModelo.getSelectionModel().getSelections().length == 1) {
                        record_selected = g.getStore().getAt(r);
                        g.getEl().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
                        Ext.Ajax.request({
                            url: baseUrl + 'validarasociacion',
                            params: {
                                idplanificacion: record_selected.data.idplanificacion
                            },
                            callback: function(options, success, response) {

                                g.getEl().unmask();
                                gpModelo.md.showAt(e.getXY());
                            }
                        });
                    } else {
                        obj = false;
                        gpModelo.md.showAt(e.getXY());
                    }
                }
            }
        }
    });

    pModelo = new Ext.Panel({
        id: 'pModelo',
        title: perfil.etiquetas.titModelos,
        split: true,
        layout: 'fit',
        items: [gpModelo]
    });


    //Demanda por Entidad a los Centros de balance
    stcbCtroBalance = new Ext.data.Store({
        autoLoad: true,
        url: 'ListarComboCentroBalance',
        listeners: {
            beforeload: function(st) {
                st.baseParams.identidad = identidadselected;
                st.baseParams.rector = objci.acciones.rector;
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
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: 'Exportar demanda.(ALt+E)',
        text: 'Exportar',
        handler: function() {
            var win = window.open('exportarDemanda?identiCB=' + cbCtroBalance.getValue()
                + '&idmodelo=' + treesel + '& filtros=' + Ext.encode(filtros.getFilterData()));
        }
    });


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
        listeners: {
            select: function(cb, rec, index) {
                stGpdemandacentrobalance.reload();

            }
        }
    });


    var cmGpdemandacentrobalance = new Ext.grid.ColumnModel([
    {
        id: 'expandir',
        header: 'Especialidad',
        width: 100,
        dataIndex: 'idespecialidad',
        tooltip: 'Especialidad'/*,
             renderer:function(id){
             return stCmbEspecialidad.getById(id).data.denespecialidad;
             }*/
    },
    {
        header: 'Entidad',
        width: 100,
        dataIndex: 'entidad',
        tooltip: 'Entidad'

    },
    {
        header: 'Plan',
        width: 180,
        dataIndex: 'denominacionmodelo',
        tooltip: 'Plan'

    }, {
        header: 'Código',
        width: 75,
        dataIndex: 'codigo',
        tooltip: 'Código'
    }, {
        header: 'Número de pieza',
        width: 100,
        dataIndex: 'numeropieza',
        tooltip: 'Número de pieza'

    }, {
        header: 'Indicador',
        width: 100,
        dataIndex: 'denominacionind',
        tooltip: 'Indicador'

    }, {
        header: 'Cantidad',
        width: 100,
        dataIndex: 'necesidad',
        tooltip: 'Cantidad'


    }, {
        header: 'Importe',
        width: 100,
        dataIndex: 'importe',
        tooltip: 'Importe'
    }


    ]);
    stGpdemandacentrobalance = new Ext.data.Store({
        url: 'listarIndXCentroBalance',
        listeners: {
            load: function() {
            },
            beforeload: function() {
                Ext.Ajax.timeout = 600000;
                stGpdemandacentrobalance.baseParams.identiCB = cbCtroBalance.getValue();
            //stGpdemandacentrobalance.baseParams.idmodelo = treesel;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
        {
            name: 'idespecialidad'
        }, {
            name: 'entidad'
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
            name: 'importe'
        }]
        )
    });

    smGpdemandacentrobalance = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    stCmbEspecialidad = new Ext.data.Store({
        url: 'listarEspecialidades',
        storeId: 'stCmbEspecialidad',
        //        autoLoad : true,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 120000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idespecialidad'
        }, [{
            name: 'idespecialidad'
        }, {
            name: 'denespecialidad'
        }])
    });

    stCmbEntidad = new Ext.data.Store({
        url: 'listarEntidades',
        storeId: 'stCmbEntidad',
        //autoLoad : true,
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
        autoLoad : true,
        /*params: {
            identiCB: cbCtroBalance.getValue()
        },
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000;
            }
        },*/
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
            name: 'denominacion'
        }, {
            name: 'idmodelo'
        }])
    });

    stCmbEspecialidad.load();
    
    cbCtroBalance.on('select', function(cmb, record, index) {
        /*stCmbEntidad.load({
            params: {
                identiCB: cbCtroBalance.getValue()
            }
        });*/
    });
    
    btnVerDemanda.on('click', function(btn, e) {
        if(cbCtroBalance.getValue()!=""){
            stCmbEntidad.load({
                params: {
                    identiCB: cbCtroBalance.getValue()
                }
            });
        }
    });
    
    /*stGpdemandacentrobalance.on('load', function(cmb, record, index) {
        if(cbCtroBalance.getValue()!=""){
            stCmbEntidad.load({
                params: {
                    identiCB: cbCtroBalance.getValue()
                }
            });
        }
    });*/
    
    filtrosGpdemandacentrobalance = new Ext.grid.GridFilters({
        filters: [
        {
            type: 'listado',
            dataIndex: 'idespecialidad',
            idcombo: 'cbidespecialidad',
            urlcb: 'listarEspecialidades',
            valueFieldcb: 'denespecialidad',
            displayFieldcb: 'denespecialidad',
            st: stCmbEspecialidad,
            mode: 'local'
        },
        {
            type: 'listado',
            dataIndex: 'entidad',
            idcombo: 'cbentidad',            
            valueFieldcb: 'denominacion',
            displayFieldcb: 'denominacion',            
            st: stCmbEntidad,
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
            dataIndex: 'importe'
        }
        ]
    });
    Gpdemandacentrobalance = new Ext.grid.GridPanel({
        frame: true,
        id: 'Gpdemandacentrobalance',
        autoExpandColumn: 'expandir',
        // title:'Demanda por Entidades a los centro de balance',
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
            items: [btnLimpiarFiltrosDemanda]
        })


    });

    stGpdemandacentrobalance.load({
        params: {
            limit: 20,
            start: 0,
            identiCB: -1
        }
    });

    btnCancelarDemanda = new Ext.Toolbar.Button({
        id: 'btnCancelarDemanda',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        handler: function() {
            windemandacentrobalance.hide();
            cbCtroBalance.clearValue();
            stGpdemandacentrobalance.reload();
        }
    });

    windemandacentrobalance = new Ext.Window({
        title: "Demanda por Entidades a los centro de balance",
        width: 1000,
        layout: 'fit',
        height: 500,
        modal: true,
        closeAction: 'hide',
        buttons: [btnCancelarDemanda],
        items: [Gpdemandacentrobalance]
    })


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
    if (objci.acciones.rector)
    {
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').hide();
        if ((Ext.getCmp('tpestructura').selModel.getSelectedNode().isLeaf())) {
            Ext.getCmp('btnAprob').show();
            Ext.getCmp('btnDes').show();
            Ext.getCmp('btnAprobTodos').show();
            Ext.getCmp('btnDesTodos').show();
        } else {
            Ext.getCmp('btnAprob').hide();
            Ext.getCmp('btnDes').hide();
            Ext.getCmp('btnAprobTodos').hide();
            Ext.getCmp('btnDesTodos').hide();
        }

    } else if ((Ext.getCmp('tpestructura').selModel.getSelectedNode().isLeaf())) {
        Ext.getCmp('btnAdicionarInds').show();
        Ext.getCmp('btnEliminarInds').show();
        Ext.getCmp('btnGuardar').show();
        Ext.getCmp('btnAprob').show();
        Ext.getCmp('btnDes').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    } else
{
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').hide();
        Ext.getCmp('btnAprob').hide();
        Ext.getCmp('btnDes').hide();
        Ext.getCmp('btnAprobTodos').hide();
        Ext.getCmp('btnDesTodos').hide();
    }
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
                reconfgrid(responseData);
            }
            else {
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
    /*if(value>1)
     return 'Si';
     return 'No';*/
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
        name: 'importedivisa'
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
    cmGp.push({
        header: perfil.etiquetas.lbCodigo,
        width: 100,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbNumPieza,
        width: 70,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbDenominacion,
        id: 'expandir',
        width: 100,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbUM,
        width: 40,
        sortable: true,
        dataIndex: 'umedida',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbPrecio,
        width: 75,
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: Precio
    });
    cmGp.push({
        header: perfil.etiquetas.lbPrecioMLC,
        width: 75,
        sortable: true,
        dataIndex: 'preciodivisa',
        tooltip: perfil.etiquetas.lbPrecioMLC,
        renderer: crearToolTip
    // renderer: Precio
    });

    cmGp.push({
        header: perfil.etiquetas.lbAprobado,
        width: 60,
        sortable: true,
        dataIndex: 'idaprobaciondemanda',
        renderer: ColumnaAprobacion,
        tooltip: perfil.etiquetas.lbAprobado,
        hidden: true
    });
    cmGp.push({
        header: perfil.etiquetas.lbCantidad,
        width: 70,
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
                /*change:
                 function(f,n,o){
                 var aux = n* smGpGestModelo.getSelected().get('precio');
                 smGpGestModelo.getSelected().set('importe',aux);
                 },*/
                focus: function(f) {
                    f.selectText();
                }
            }
        })
    });
    cmGp.push({
        header: perfil.etiquetas.lbCentroBalance,
        width: 100,
        sortable: true,
        dataIndex: 'centrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbPais,
        width: 80,
        sortable: true,
        dataIndex: 'pais',
        tooltip: perfil.etiquetas.lbPais,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: perfil.etiquetas.lbDescripcion,
        width: 300,
        sortable: true,
        dataIndex: 'descripcion',
        tooltip: perfil.etiquetas.lbDescrip,
        hidden: true,
        renderer: crearToolTip
    });

    if (cf) {
        for (var index = 0; index < cf.cm.length; index++)
        {
            if (cf.cm[index].edit) {
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
                                if (typeof(v) == 'string') {
                                    var arreg = v.split('-');
                                    v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                    return v;
                                }
                                else {
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
                        var almacen = new Ext.data.SimpleStore({
                            fields: ['iddatosnomenclador', 'nom_datosnomenclador_denominacion']
                        });
                        var valores = [];
                        for (pos in cf.cm[index].edit.store)
                        {
                            valores.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                        }
                        valores.pop();
                        almacen.add(valores);

                        cf.cm[index] = {
                            id: items[index].id,
                            header: items[index].header,
                            dataIndex: items[index].dataIndex,
                            sortable: true,
                            renderer: function(value, cell, rec, row, col) {
                                return getRawValue(value, gpModelo.getColumnModel().getCellEditor(col, row).field);
                            /*
                                     var editor  = gpModelo.getColumnModel().getCellEditor(col, row).field;
                                     if(editor.renderiza){
                                     gpModelo.getColumnModel().getCellEditor(col, row).field.renderiza = false;
                                     return editor.getRawValue();
                                     }else{
                                     var posicion = editor.store.find(editor.valueField,value);
                                     if(posicion!=-1){
                                     return editor.store.getAt(posicion).get(editor.displayField);
                                     } else return value;
                                     }*/
                            },
                            editor: new Ext.form.ComboBox({
                                id: item.id,
                                hiddenName: item.hiddenName,
                                name: item.hiddenName,
                                mode: 'local',
                                triggerAction: 'all',
                                allowBlank: item.allowBlank,
                                emptyText: item.emptyText,
                                typeAhead: item.typeAhead,
                                valueField: item.valueField,
                                displayField: item.displayField,
                                store: almacen,
                                listeners: {
                                    select: function(a, b, c) {
                                        for (var i = 0; i < smGpGestModelo.getSelections().length; i++) {
                                            //si se le adiciona otra columna estatica antes de las columnas dinamicas debe adiconarle 1 a la suma de la columna
                                            stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).set(stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).fields.items[columna + 13].name, a.getValue());
                                        //                                           
                                        }
                                    }
                                },
                                tpl: '<tpl for="."><div ext:qtip="{' + item.displayField + '}" class="x-combo-list-item">{' + item.displayField + '}</div></tpl>'
                            })
                        };
                    }
                    break;
                    default:
                    {
                        cf.cm[index].editor = new Ext.form.TextField(cf.cm[index].edit);
                        cf.cm[index].editor.on('focus', function(f) {
                            f.selectText();
                        });
                    }
                    break;
                }
                cmGp.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++)
            rec.push(cf.rd[index]);
    }

    cmGp.push({
        header: perfil.etiquetas.lbImporte,
        width: 100,
        sortable: true,
        dataIndex: 'importe',
        tooltip: perfil.etiquetas.lbImport,
        minValue: 0
    //renderer:calcularImporte
    });

    cmGp.push({
        header: perfil.etiquetas.lbImporteMLC,
        width: 75,
        sortable: true,
        dataIndex: 'importedivisa',
        tooltip: perfil.etiquetas.lbImporteMLC,
        minValue: 0
    //renderer:tresdecimales
    });

    cmGp.push({
        header: perfil.etiquetas.lbImporteFS,
        width: 75,
        sortable: true,
        dataIndex: 'flete',
        tooltip: perfil.etiquetas.lbImporteFS,
        minValue: 0,
        hidden: true
    //renderer:tresdecimales
    });
    cmGp.push({
        header: perfil.etiquetas.lbImporteConting,
        width: 75,
        sortable: true,
        dataIndex: 'contingencia',
        tooltip: perfil.etiquetas.lbImporteConting,
        minValue: 0,
        hidden: true
    //renderer:tresdecimales
    });

    cmGp.push({
        header: perfil.etiquetas.lbBasePlan,
        width: 60,
        sortable: true,
        dataIndex: 'generadobasesplan',
        tooltip: perfil.etiquetas.lbBasePlan,
        renderer: EsdeBasePlanP
    });

    cmGp.push({
        header: perfil.etiquetas.lbAprobado,
        width: 60,
        sortable: true,
        dataIndex: 'idaprobaciondemanda',
        tooltip: perfil.etiquetas.lbAprobacion,
        renderer: ColumnaAprobacion
    });

    cmGp.push({
        header: 'Vía de adquisición',
        width: 100,
        sortable: true,
        hidden: true,
        dataIndex: 'viaadquisicion',
        tooltip: 'Vía de adquisición'

    });

    cmGp.push({
        header: 'Órgano que satisface',
        width: 100,
        sortable: true,
        hidden: true,
        dataIndex: 'organosatisface',
        tooltip: 'Órgano que satisface'

    });



    jrStGpGestModelo = new Ext.data.JsonReader({
        totalProperty: 'total',
        importetotal: 'importetotal',
        importedivisatotal: 'importedivisatotal',
        importeflete: 'importeflete',
        importecontingencia: 'importecontingencia',
        llave: 'llave',
        root: 'data',
        id: 'jrStGpGestModelo',
        fields: rec
    });

    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.idejercicio = idejerc;
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
                this.baseParams.identidad = identidadselected;
                this.baseParams.filtros = Ext.encode(filtros.getFilterData());
                cambiarTituloFiltrar();
            },
            load: function() {
                calcularImporteTotal();

                siexisteIndEnModeloFiltrado();
                //configurarColoresCeldas();
                global_tree++;
            },
            loadexception: function() {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrStGpGestModelo
    });

    gpModelo.reconfigure(stGpGestModelo, new Ext.grid.ColumnModel(cmGp));


    pgGestModelo.bind(stGpGestModelo);

    if (urlListar == urlListarConsolidacion)
    {
        gpModelo.getStore().baseParams.idmodelo = treesel;
        gpModelo.getStore().baseParams.calcular = calcular;
        gpModelo.getStore().baseParams.modelos = Ext.encode(tpBasePlan.getChecked("idmodelo", nodo));
    }
    gpModelo.getStore().load({
        params: {
            start: 0,
            limit: 20
        }
    });
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
            //animEl: 'mb6'
            });

            Ext.Ajax.request({
                url: '../gestmodelo/eliminar',
                params: {
                    identidad: identidadselected,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo
                },
                callback: function(options, success, response) {
                    //Ext.getBody().unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        tpBasePlan.selectPath(tpBasePlan.getSelectionModel().getSelectedNode().parentNode.getPath());
                        idelemsel = tpBasePlan.getSelectionModel().getSelectedNode().id;
                        pcm.layout.setActiveItem('pComentario');
                        gpComent.getStore().load({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                        mostrarMensaje(responseData.codMsg, perfil.etiquetas.msgPlanEliminado, function() {
                            tpBasePlan.getSelectionModel().getSelectedNode().parentNode.reload();
                        });

                    }
                    else if (responseData.codMsg == 21)
                    {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorElimMode);
                    }
                }
            });
        }
    }
}
/*
 function modificarEstado(val){
 if(val==1)
 return 'Si';
 return 'No';
 }*/

eliminarIndModPlan = function() {
    mostrarMensaje(2, "¿Está seguro que quiere eliminar el(los) indicador(es) seleccionado(s)?", elimina);
    function elimina(btn) {
        if (btn == 'ok') {
            var aux = gpModelo.getSelectionModel().getSelections();
            var arreglo = [];
            for (pos in aux) {
                if (aux[pos].id)
                    arreglo.push(aux[pos].data.idplanificacion);
            }
            Ext.MessageBox.show({
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
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo
                },
                callback: function(options, success, response) {

                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsg == 1) {

                            mostrarMensaje(1, perfil.etiquetas.msgEliminado, funcionAceptar);
                        }
                        else if (responseData.codMsg == 21) {

                            mostrarMensaje(3, perfil.etiquetas.msgErrorEliminarDemanda);
                        }
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
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
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        for (k in rec) {
            if (typeof(rec[k]) == 'object') {
                if (rec[k]) {
                    rec[k] = rec[k].format('d/m/Y');
                }
            }
        }
        if ((Object.keys(rec).length > 0 && !rec['cantidad'] && rec['cantidad'] != 0 && !rec['importe']) ||
            (Object.keys(rec).length > 2 && rec['cantidad'] && rec['importe']) ||
            (Object.keys(rec).length > 1 && rec['cantidad'] && !rec['importe'])) {

            rec[llave] = record.data[llave];
            rec['insertarenmeta'] = true;
        }
        rec['idplanificacion'] = record.data['idplanificacion'];
        count++;
        arreglo.push(rec);
    }
    obj['idmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo;
    obj['identidadmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
    obj.filas = Ext.encode(arreglo);
    Ext.Ajax.request({
        url: '../gestmodelo/adicionarIndicador',
        params: obj,
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg) {
                if (responseData.codMsg == 20) {

                    mostrarMensaje(1, perfil.etiquetas.msgGuardados, function() {
                        stGpGestModelo.reload();
                    });
                }
                else {
                    editadas.push(record);
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                    }
                }
            }
            else {
                editadas.push(record);
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        }
    });
}

function cambiarEstado(valor)
{
    if (desaprobar == 1) {

        var mensaje;
        mensaje = 'Desaprobando el(los) indicador(es) seleccionado(s).'
    } else {
        mensaje = 'Aprobando el(los) indicador(es) seleccionado(s).'
    }
    if (smGpGestModelo.getSelections().length >= 1) {
        var aux = gpModelo.getSelectionModel().getSelections();


        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                //console.log(aux[pos].data);
                arreglo.push(aux[pos].data.idindicador);
            }
        }


        var rectora;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        mostrarMensaje(2, perfil.etiquetas.msgComprobar, function(btn) {
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
                    url: '../gestmodelo/aprobarDesaprobar',
                    params: {
                        idindicadores: Ext.encode(arreglo),
                        identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
                        idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                        aprobado: valor,
                        rectora: rectora
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            if (valor == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobado, funcionAcepAccion);


                            }
                            else {
                                mostrarMensaje(1, perfil.etiquetas.msgAprobado, funcionAcepAccion);

                            }
                        }
                        else {
                            if (responseData.codMsg == 3) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                            }
                            if (responseData.codMsg == 21) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                            }
                            if (responseData.codMsg == 22) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
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
function funcionAcepAccion() {
    stGpGestModelo.reload();
}
function FuncionSegu() {
    mostrarMensaje(1, perfil.etiquetas.msgDesaprobado, funcionAcepAccion);
}
function FuncionSegu2() {
    mostrarMensaje(1, perfil.etiquetas.msgAprobado, funcionAcepAccion);
}

function cambiarEstadoTodos(valor)
{
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
    //alert(arrayidindicadores.push(gpModelo.getStore().getAt(0).get('idindicador')));
    if (gpModelo.getStore().getCount() >= 1) {
        for (var i = 0; i < gpModelo.getStore().getCount(); i++) {
            arrayidindicadores.push(gpModelo.getStore().getAt(i).get('idindicador'));
        }
    }

    mostrarMensaje(2, perfil.etiquetas.msgComprobarTodos, function(btn) {
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
                url: '../gestmodelo/aprobarTodos',
                params: {
                    //idindicadores: Ext.encode(arrayidindicadores),
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    rectora: rectora
                },
                callback: function(options, success, response) {
                    // Ext.getBody().unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        if (valor == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoTodo, function() {
                                stGpGestModelo.reload();
                            });
                        }
                        else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoTodo, function() {
                                stGpGestModelo.reload();
                            });

                        }

                    }
                    else {
                        if (responseData.codMsg == 3) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                        }
                        if (responseData.codMsg == 21) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                        }
                        if (responseData.codMsg == 22) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
                        }
                    }


                }
            });
        }
    }
    );

}

function ActualizarIU(id)
{
    stGpGestModelo.getById(id).commit();
    if (fila <= stGpGestModelo.getCount() - 1) {
        gpModelo.startEditing(fila, columna);
    }
}

function habilitarDesabilitar(bandera)
{
    //configurarColoresCeldas();
    if (bandera) {
        if (smGpGestModelo.getSelections().length == 1) {
            aprobarDesaprobar(false);
            Ext.getCmp('mdAddcoment').show();
        }
        else {
            aprobarDesaprobar(true);
            Ext.getCmp('mdAddcoment').hide();


        }
    }
    else {
        Ext.getCmp('mdAddcoment').hide();
        Ext.getCmp('btnAprob').disable();
        Ext.getCmp('btnDes').disable();
        Ext.getCmp('btnEliminarInds').disable();

    }
}

function aprobarDesaprobar(multi) {
    if (multi) {
        // btnAprob.enable();
        Ext.getCmp('btnAprob').enable();
        //btnDes.enable();
        Ext.getCmp('btnDes').enable();
        Ext.getCmp('btnEliminarInds').enable();
    }
    else {
        var rectora = false;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '1') {
            Ext.getCmp('btnAprob').enable();
            Ext.getCmp('btnDes').disable();
            Ext.getCmp('btnEliminarInds').enable();
        }
        else {
            if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '2') {
                if (rectora) {
                    Ext.getCmp('btnAprob').enable();
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                } else {
                    Ext.getCmp('btnAprob').disable();
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                }
            }
            else {
                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
                    if (rectora) {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').enable();
                        Ext.getCmp('btnEliminarInds').disable();
                    }
                    else {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').disable();
                        Ext.getCmp('btnEliminarInds').disable();

                    }
                }
            //            else{
            //
            //                Ext.getCmp('btnAprob').disable();
            //                Ext.getCmp('btnDes').disable();
            //                Ext.getCmp('btnEliminarInds').disable();
            //            }
            }
        }
    }

}





function ColumnaAprobacion(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1)
        return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    else if (val == 2)
        return '<span><img src=' + perfil.dirImg + 'yes.png' + '>';
    else
        return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
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
    if (filtros.getFiltrosActivos() == undefined || filtros.getFiltrosActivos().length == 0) {
        pModelo.setTitle(perfil.etiquetas.titModelos);
    } else {
        for (i = 0; i < filtros.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtros.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "preciodivisa") {
                aux = perfil.etiquetas.lbPrecioMLC;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "umedida") {
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "cantidad") {
                aux = perfil.etiquetas.lbNecesidad
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = "Importe";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "importedivisa") {
                aux = "Importe en MLC";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "flete") {
                aux = perfil.etiquetas.lbImporteFS;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "contingencia") {
                aux = perfil.etiquetas.lbImporteConting;
            }
            if (i == filtros.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        pModelo.setTitle(perfil.etiquetas.titModelos + perfil.etiquetas.lbFiltradoPor + filtrado_por);
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
        }
        else {
            Ext.getCmp('vercomentario').setVisible(false);
        }
    }
    else {
        Ext.getCmp('vercomentario').setVisible(false);
        Ext.getCmp('mdAddcoment').setVisible(false);
    }
}

function EsdeBasePlanP(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1)
        return 'Si';
    else
        return 'No';
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


//function calcularImporteTotal(valor){
//    if(valor)
//    {
//        nfImporte.setValue( parseFloat(valor).toFixed(3) );
//    }
//    else {
//        if( stGpGestModelo.getCount() > 0 ){
//            
//            nfImporte.setValue( jrStGpGestModelo.jsonData.importetotal);
//        }
//        else
//            nfImporte.setValue( parseFloat(0).toFixed(3) );
//    }
//}


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
        dataIndex: 'codigo'
    },
    {
        id: 'expandir',
        header: "NAE",
        //width: 100,
        sortable: true,
        dataIndex: 'denominacion'
    }
    ]);

    //creamos una variable para referenciar a nuesto objeto
    paginado2 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true

    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
        autoExpandColumn: 'expandir',
        height: 250,
        width: 400,
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
                            idplanificaciones: Ext.encode(idplanificaciones)
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
        // method:'POST',
        listeners: {
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
        singleSelect: true
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
        dataIndex: 'codigo'
    },
    {
        id: 'idcolumnog',
        header: "Denominación",
        //width: 250,
        sortable: true,
        dataIndex: 'denominacion'
    }
    ]);
    paginado1 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeOG,
        id: 'paginado1',
        displayInfo: true

    });


    //creamos una variable para referenciar a nuesto objeto
    gpOG = new Ext.grid.GridPanel({
        title: 'Objeto de Gasto',
        region: 'center',
        id: 'gpOG',
        store: storeOG,
        cm: myColumnModelOG,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumnog',
        height: 250,
        width: 200,
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
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        handler: function() {

            winAsociar.close()
        }
    });

    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        icon: perfil.dirImg + 'asociar.png',
        iconCls: 'btn',
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
                        idobjgasto: gpOG.getSelectionModel().getSelected().id
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
        width: 800,
        layout: 'border',
        height: 300,
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
        dataIndex: 'codigo'
    },
    {
        id: 'expandir',
        header: "NAE",
        //width: 250,
        sortable: true,
        dataIndex: 'denominacion'
    }
    ]);
    //creamos una variable para referenciar a nuesto objeto
    paginado2 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true

    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
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
                    selections_plan = winAsociarRF.planificaciones
                    for (var j = 0; j < selections_plan.length; j++) {
                        idplanificaciones.push(selections_plan[j].data.idplanificacion);
                    }
                    Planificacion.mostrarMascara('eliminarasociacionnaerf', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                    Ext.Ajax.request({
                        url: baseUrl + 'eliminarasociacionesnaerecursos',
                        params: {
                            idnaes: Ext.encode(idnaes),
                            idplanificaciones: Ext.encode(idplanificaciones)
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
        width: 400,
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
    paginadoRF = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeRecurso,
        id: 'paginadoRF',
        displayInfo: true

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
        dataIndex: 'codigo'
    },
    {
        id: 'idcolumrf',
        header: "Recurso financiero",
        //width: 250,
        sortable: true,
        dataIndex: 'denominacion'
    }
    ]);

    //creamos una variable para referenciar a nuesto objeto

    gpRF = new Ext.grid.GridPanel({
        title: 'Recurso finaciero',
        region: 'center',
        store: storeRecurso,
        id: 'gpRF',
        cm: myColumnModelRF,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumrf',
        height: 250,
        width: 200,
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
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        handler: function() {
            winAsociarRF.close();
        }
    });

    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        icon: perfil.dirImg + 'asociar.png',
        iconCls: 'btn',
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
                    idingreso: gpRF.getSelectionModel().getSelected().id
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
        title: "Asociar a Recuso financiero",
        width: 800,
        layout: 'border',
        height: 300,
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
    //Ext.getCmp('gpRF').getSelectionModel().clearSelections();
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpRF').getStore();
    if (entro)
        check.dom.checked = sel.checked;
    /* if(check.dom.checked){
     sel.push(store.getById(idrecord));
     Ext.getCmp('gpRF').getSelectionModel().selectRecords(sel,true);
     }*/
    if (!check.dom.checked) {
        index = store.find('idingreso', idrecord);
        Ext.getCmp('gpRF').getSelectionModel().deselectRow(index);
    }
    entro = false;
}
function selectRow_(id) {
    //Ext.getCmp('gpRF').getSelectionModel().clearSelections();
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpOG').getStore();
    if (entro_)
        check.dom.checked = sel_.checked;
    /* if(check.dom.checked){
     sel.push(store.getById(idrecord));
     Ext.getCmp('gpRF').getSelectionModel().selectRecords(sel,true);
     }*/
    if (!check.dom.checked) {
        index = store.find('idobjetogasto', idrecord);
        Ext.getCmp('gpOG').getSelectionModel().deselectRow(index);
    }
    entro_ = false;
}
function getRawValue(v, cmb) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
            ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
            : '');
        for (var j = 1; j < arrid.length; j++) {
            str += ((cmb.store.find(cmb.valueField, arrid[j]) != -1) ? ','
                + cmb.store.getAt(cmb.store.find(cmb.valueField,
                    arrid[j])).data[cmb.displayField] : '');
        }
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
                idplanificaciones: Ext.encode(ids)
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
    importes.push('0.000');//indice 1 MN
    importes.push('0.000');//indice 2 MLC
    importes.push('0.000');//indice 3 IFlete
    importes.push('0.000');//indice 4 IContingencia
}

function calcularImporteTotal() {
    setearImporte();
    if (stGpGestModelo.getCount() > 0) {
        importes[1] = jrStGpGestModelo.jsonData.importetotal;
        importes[2] = jrStGpGestModelo.jsonData.importedivisatotal;
        importes[3] = jrStGpGestModelo.jsonData.importeflete;
        importes[4] = jrStGpGestModelo.jsonData.importecontingencia;
        tfImportePlan.setValue(importes[cbImportesPlan.getValue()]);
    } else {
        tfImportePlan.setValue(importes[0]);
    }
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}