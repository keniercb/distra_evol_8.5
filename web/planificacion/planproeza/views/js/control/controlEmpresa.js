var offsetGestionarObservacionEmpresa = 0;
function cargarControlEmpresa() {

    var importesEmpresa = [];
    btnGuardarEstimado = new Ext.Button({
        id: 'btnGuardarEstimado',
        hidden: true,
        disabled: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarEstimado();
        }
    });
    btnLimpiarControlEmpresa = new Ext.Button({
        id: 'idbtnLimpiarControlEmpresa',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosControlEmpresa.clearFilters();
        }
    });
    btnAdicionarExtraplan = new Ext.Button({
        id: 'btnAdicionarExtraplan',
        disabled: false,
        iconCls: 'adicionar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAdicionarExtraPlan,
        handler: function () {
            adicionarDemandaExtraPlan();
        }
    });
    btnEliminarExtraplan = new Ext.Button({
        id: 'btnEliminarExtraplan',
        hidden: true,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDemanda, eliminarDemandaExtraPlan);
        }
    });
    btnGestionarObservacionEmpresa = new Ext.Button({
        id: 'btnGestionarObservacionEmpresa',
        iconCls: 'info',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbGestionarObservacion,
        handler: function () {
            gestionarObservacionEmpresa();
        }
    });
    stTieneObservEmpresa = new Ext.data.SimpleStore({
        id: 'stTieneObservEmpresa',
        fields: [{
                name: 'tieneobservacion'
            }, {
                name: 'denominacion'
            }],
        data: [['0', perfil.etiquetas.lbNo], ['1', perfil.etiquetas.lbSi]]
    });

    stControlEmpresa = new Ext.data.Store({
        id: 'stControlEmpresa',
        url: 'listarControlEmpresaRector',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemanda'
        }, [{
                name: 'iddemanda'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'iddemandatiempo'
            }, {
                name: 'idprograma'
            }, {
                name: 'iddestino'
            }, {
                name: 'estimado'
            }, {
                name: 'plan'
            }, {
                name: 'planfinal'
            }, {
                name: 'ajuste'
            }, {
                name: 'cantreal'
            }, {
                name: 'diferencia'
            }, {
                name: 'importeplan'
            }, {
                name: 'importeajustado'
            }, {
                name: 'importereal'
            }, {
                name: 'diferenciaimporte'
            }, {
                name: 'importeplandivisa'
            }, {
                name: 'importeajustadodivisa'
            }, {
                name: 'importerealdivisa'
            }, {
                name: 'diferenciaimportedivisa'
            }, {
                name: 'tieneobservacion'
            }, {
                name: 'enero'
            }, {
                name: 'febrero'
            }, {
                name: 'marzo'
            }, {
                name: 'abril'
            }, {
                name: 'mayo'
            }, {
                name: 'junio'
            }, {
                name: 'julio'
            }, {
                name: 'agosto'
            }, {
                name: 'septiembre'
            }, {
                name: 'octubre'
            }, {
                name: 'noviembre'
            }, {
                name: 'diciembre'
            }, {
                name: 'extraplan'
            }, {
                name: 'importeplantotalmn'
            }
            , {
                name: 'importeplantotalcuc'
            }
            , {
                name: 'importeajustadototalmn'
            }
            , {
                name: 'importeajustadototalcuc'
            }
            , {
                name: 'importerealtotalmn'
            }
            , {
                name: 'importerealtotalcuc'
            }
            , {
                name: 'diferenciaimportetotalmn'
            }
            , {
                name: 'diferenciaimportetotalcuc'
            }
        ]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stControlEmpresa.baseParams.start = offsetControlEmpresa;
                stControlEmpresa.baseParams.identidad = nodoEntidadControl.id;
                stControlEmpresa.baseParams.idejercicio = cbEjercicioControl.getValue();
                stControlEmpresa.baseParams.tipo = cbComportamientoControl.getValue();
            },
            load: function () {
                btnGuardarEstimado.disable();
                btnEliminarExtraplan.disable();
                cambiarTituloFiltrar(gpControlEmpresa, filtrosControlEmpresa, 'Controles');
                gpControlEmpresa.enable();
                if (stControlEmpresa.getCount() == 0) {
                    setearImporteEmpresa();
                    btnGestionarObservacionEmpresa.disable();
                    stControlEmpresaTaller.loadData({"data": [], "total": 0});
                    btnExportarControl.disable();
                    if (filtrosControlEmpresa.getFiltrosActivos() == undefined || filtrosControlEmpresa.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    upColorCellControlEmpresa(stControlEmpresa, cmControlEmpresa, gpControlEmpresa);
                    calcularImporteTotalEmpresa();
                    if (importesEmpresa[cbImportesEmpresa.getValue()] != undefined) {
                        var importeEmpresa = separadorDeMilesEmpresa(importesEmpresa[cbImportesEmpresa.getValue()]);
                        tfimportetotalEmpresa.setValue(importeEmpresa);
                    } else {
                        tfimportetotalEmpresa.setValue('0.000');
                    }
                    upColorControl(stControlEmpresa, cmControlEmpresa, gpControlEmpresa);
                    btnExportarControl.enable();
                    Ext.getCmp('btnExportarControlEmpresa').show();
                    Ext.getCmp('btnExportarControlProductor').hide();
                    Ext.getCmp('btnExportarControlRector').hide();
                }
                mymask.hide();
            }
        }
    });
    filtrosControlEmpresa = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidadcliente',
                idcombo: 'idcbentidadcliente',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesCliente,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'tieneobservacion',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }, {
                type: 'listado',
                dataIndex: 'idprograma',
                idcombo: 'idcbprograma',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stPrograma,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'iddestino',
                idcombo: 'idcbdestino',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stDestino,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'estimado'
            }, {
                type: 'numeric',
                dataIndex: 'plan'
            }, {
                type: 'numeric',
                dataIndex: 'planfinal'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'cantreal'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'numeric',
                dataIndex: 'importeplan'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustado'
            }, {
                type: 'numeric',
                dataIndex: 'importereal'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimporte'
            }, {
                type: 'numeric',
                dataIndex: 'importeplandivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustadodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importerealdivisa'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimportedivisa'
            }, {
                type: 'numeric',
                dataIndex: 'enero'
            }, {
                type: 'numeric',
                dataIndex: 'febrero'
            }, {
                type: 'numeric',
                dataIndex: 'marzo'
            }, {
                type: 'numeric',
                dataIndex: 'abril'
            }, {
                type: 'numeric',
                dataIndex: 'mayo'
            }, {
                type: 'numeric',
                dataIndex: 'junio'
            }, {
                type: 'numeric',
                dataIndex: 'julio'
            }, {
                type: 'numeric',
                dataIndex: 'agosto'
            }, {
                type: 'numeric',
                dataIndex: 'septiembre'
            }, {
                type: 'numeric',
                dataIndex: 'octubre'
            }, {
                type: 'numeric',
                dataIndex: 'noviembre'
            }, {
                type: 'numeric',
                dataIndex: 'diciembre'
            }]
    });
    cmControlEmpresa = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUM,
            width: 60,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbCliente,
            tooltip: perfil.etiquetas.lbCliente,
            width: 120,
            dataIndex: 'identidadcliente',
            renderer: renderEntidadesCliente
        }, {
            header: perfil.etiquetas.lbPrograma,
            tooltip: perfil.etiquetas.lbPrograma,
            hidden: false,
            width: 120,
            dataIndex: 'idprograma',
            renderer: renderProgramas
        }, {
            header: perfil.etiquetas.lbDestino,
            hidden: false,
            tooltip: perfil.etiquetas.lbDestino,
            width: 120,
            dataIndex: 'iddestino',
            renderer: renderDestinos
        }, {
            header: perfil.etiquetas.lbEstimado,
            tooltip: perfil.etiquetas.lbEstimado,
            width: 100,
            dataIndex: 'estimado',
            renderer: crearToolTip,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                enableKeyEvents: true,
                decimalPrecision: 3,
                minValue: 0
            })
        }, {
            header: perfil.etiquetas.lbPlan,
            tooltip: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'plan',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAjuste,
            tooltip: perfil.etiquetas.lbAjuste,
            width: 100,
            dataIndex: 'ajuste',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPlanFinal,
            tooltip: perfil.etiquetas.lbPlanFinal,
            width: 100,
            dataIndex: 'planfinal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbReal,
            tooltip: perfil.etiquetas.lbReal,
            width: 100,
            dataIndex: 'cantreal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferencia,
            tooltip: perfil.etiquetas.lbDiferencia,
            width: 100,
            dataIndex: 'diferencia',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlan,
            tooltip: perfil.etiquetas.lbImportePlan,
            width: 100,
            dataIndex: 'importeplan',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustado,
            tooltip: perfil.etiquetas.lbImporteAjustado,
            width: 100,
            dataIndex: 'importeajustado',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteReal,
            tooltip: perfil.etiquetas.lbImporteReal,
            width: 100,
            dataIndex: 'importereal',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporte,
            tooltip: perfil.etiquetas.lbDiferenciaImporte,
            width: 100,
            dataIndex: 'diferenciaimporte',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlanDivisa,
            tooltip: perfil.etiquetas.lbImportePlanDivisa,
            width: 100,
            dataIndex: 'importeplandivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustadoDivisa,
            tooltip: perfil.etiquetas.lbImporteAjustadoDivisa,
            width: 100,
            dataIndex: 'importeajustadodivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteRealDivisa,
            tooltip: perfil.etiquetas.lbImporteRealDivisa,
            width: 100,
            dataIndex: 'importerealdivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporteDivisa,
            tooltip: perfil.etiquetas.lbDiferenciaImporteDivisa,
            width: 100,
            dataIndex: 'diferenciaimportedivisa',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbObservacion,
            width: 80,
            dataIndex: 'tieneobservacion',
            renderer: renderBinario
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 80,
            dataIndex: 'enero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbFebrero,
            tooltip: perfil.etiquetas.lbFebrero,
            width: 80,
            dataIndex: 'febrero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMarzo,
            tooltip: perfil.etiquetas.lbMarzo,
            width: 80,
            dataIndex: 'marzo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAbril,
            tooltip: perfil.etiquetas.lbAbril,
            width: 80,
            dataIndex: 'abril',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMayo,
            tooltip: perfil.etiquetas.lbMayo,
            width: 80,
            dataIndex: 'mayo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJunio,
            tooltip: perfil.etiquetas.lbJunio,
            width: 80,
            dataIndex: 'junio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJulio,
            tooltip: perfil.etiquetas.lbJulio,
            width: 80,
            dataIndex: 'julio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAgosto,
            tooltip: perfil.etiquetas.lbAgosto,
            width: 80,
            dataIndex: 'agosto',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbSeptiembre,
            tooltip: perfil.etiquetas.lbSeptiembre,
            width: 80,
            dataIndex: 'septiembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbOctubre,
            tooltip: perfil.etiquetas.lbOctubre,
            width: 80,
            dataIndex: 'octubre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbNoviembre,
            tooltip: perfil.etiquetas.lbNoviembre,
            width: 80,
            dataIndex: 'noviembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiciembre,
            tooltip: perfil.etiquetas.lbDiciembre,
            width: 80,
            dataIndex: 'diciembre',
            renderer: renderMeses,
            align: 'right'
        }
    ]);
    smControlEmpresa = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                stControlEmpresaTaller.reload();
                if (smControlEmpresa.getSelected().data.extraplan == 1) {
                    btnEliminarExtraplan.enable();
                    stPlanControlEmpresaTaller.reload();
                    gpPlanControlEmpresaTaller.enable();
                    Ext.getCmp('tabGestionDesgloseExtraplan').enable();
                } else {
                    Ext.getCmp('tabGestionDesgloseExtraplan').disable();
                    tabPanelExtraplanEjecucion.setActiveTab('tabVisualizarEstadoEjecucionXTalleres');
                    gpPlanControlEmpresaTaller.disable();
                    btnEliminarExtraplan.disable();
                }
                btnGestionarObservacionEmpresa.enable();
            },
            rowdeselect: function () {
                btnEliminarExtraplan.disable();
                stControlEmpresaTaller.loadData({"data": [], "total": 0});
                gpControlEmpresaTaller.disable();
                stPlanControlEmpresaTaller.loadData({"data": [], "total": 0});
                gpPlanControlEmpresaTaller.disable();
                btnGestionarObservacionEmpresa.disable();
            }
        }
    });

    tfimportetotalEmpresa = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalEmpresa',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportesEmpresa = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImportePlan],
            [2, perfil.etiquetas.lbImporteAjustado],
            [3, perfil.etiquetas.lbImporteReal],
            [4, perfil.etiquetas.lbDiferenciaImporte],
            [5, perfil.etiquetas.lbImportePlanDivisa],
            [6, perfil.etiquetas.lbImporteAjustadoDivisa],
            [7, perfil.etiquetas.lbImporteRealDivisa],
            [8, perfil.etiquetas.lbDiferenciaImporteDivisa]
        ]
    });
    cbImportesEmpresa = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportesEmpresa,
        displayField: 'denominacion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 110,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        listeners: {
            select: function () {
                if (importesEmpresa[cbImportesEmpresa.getValue()] != undefined) {
                    var importeEmpresa = separadorDeMilesEmpresa(importesEmpresa[cbImportesEmpresa.getValue()]);
                    tfimportetotalEmpresa.setValue(importeEmpresa);
                } else {
                    tfimportetotalEmpresa.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    gpControlEmpresa = new Ext.grid.EditorGridPanel({
        store: stControlEmpresa,
        autoScroll: true,
        title: 'Controles',
        id: 'idgpControlEmpresa',
        sm: smControlEmpresa,
        cm: cmControlEmpresa,
        plugins: filtrosControlEmpresa,
        region: 'center',
        tbar: [btnAdicionarExtraplan, btnGuardarEstimado, btnEliminarExtraplan],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stControlEmpresa,
            displayInfo: true,
            items: ['-', btnLimpiarControlEmpresa, '-', cbImportesEmpresa, tfimportetotalEmpresa],
            listeners: {
                beforechange: function (p, e) {
                    offsetControlEmpresa = e.start;
                }
            }
        }),
        listeners: {
            beforeedit: function (e) {
                if (btnGuardarEstimado.hidden)
                    e.cancel = true;
            },
            afteredit: function () {
                btnGuardarEstimado.enable();
            }
        }
    });

    //panel inferior: desglose de los controles
    btnGuardarAjuste = new Ext.Button({
        id: 'btnGuardarAjuste',
        hidden: true,
        disabled: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarAjuste();
        }
    });
    btnLimpiarControlEmpresaTaller = new Ext.Button({
        id: 'idbtnLimpiarControlEmpresaTaller',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosControlEmpresaTaller.clearFilters();
        }
    });

    stControlEmpresaTaller = new Ext.data.Store({
        id: 'stControlEmpresaTaller',
        url: 'listarControlEmpresaTaller',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemanda'
        }, [{
                name: 'iddemanda'
            }, {
                name: 'iddemandatiempo'
            }, {
                name: 'identidad'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'plan'
            }, {
                name: 'ajuste'
            }, {
                name: 'planfinal'
            }, {
                name: 'cantreal'
            }, {
                name: 'diferencia'
            }, {
                name: 'importeplan'
            }, {
                name: 'importeajustado'
            }, {
                name: 'importereal'
            }, {
                name: 'diferenciaimporte'
            }, {
                name: 'importeplandivisa'
            }, {
                name: 'importeajustadodivisa'
            }, {
                name: 'importerealdivisa'
            }, {
                name: 'diferenciaimportedivisa'
            }, {
                name: 'enero'
            }, {
                name: 'febrero'
            }, {
                name: 'marzo'
            }, {
                name: 'abril'
            }, {
                name: 'mayo'
            }, {
                name: 'junio'
            }, {
                name: 'julio'
            }, {
                name: 'agosto'
            }, {
                name: 'septiembre'
            }, {
                name: 'octubre'
            }, {
                name: 'noviembre'
            }, {
                name: 'diciembre'
            }
        ]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stControlEmpresaTaller.baseParams.start = offsetControlEmpresaTaller;
                stControlEmpresaTaller.baseParams.identidad = nodoEntidadControl.id;
                stControlEmpresaTaller.baseParams.idejercicio = cbEjercicioControl.getValue();
                stControlEmpresaTaller.baseParams.iddemanda = smControlEmpresa.getSelected().data.iddemanda;
            },
            load: function () {
                btnGuardarAjuste.disable();
                cambiarTituloFiltrar(gpControlEmpresaTaller, filtrosControlEmpresaTaller, 'Desglose de controles');
                gpControlEmpresaTaller.enable();
                if (stControlEmpresaTaller.getCount() == 0) {
                    if (filtrosControlEmpresaTaller.getFiltrosActivos() != undefined && filtrosControlEmpresaTaller.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                gpControlEmpresaTaller.getSelectionModel().clearSelections();
                mymask.hide();
            }
        }
    });
    filtrosControlEmpresaTaller = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'cbidentidadControl',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEjecutor,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'plan'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'planfinal'
            }, {
                type: 'numeric',
                dataIndex: 'cantreal'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'numeric',
                dataIndex: 'importeplan'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustado'
            }, {
                type: 'numeric',
                dataIndex: 'importereal'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimporte'
            }, {
                type: 'numeric',
                dataIndex: 'importeplandivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustadodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importerealdivisa'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimportedivisa'
            }, {
                type: 'numeric',
                dataIndex: 'enero'
            }, {
                type: 'numeric',
                dataIndex: 'febrero'
            }, {
                type: 'numeric',
                dataIndex: 'marzo'
            }, {
                type: 'numeric',
                dataIndex: 'abril'
            }, {
                type: 'numeric',
                dataIndex: 'mayo'
            }, {
                type: 'numeric',
                dataIndex: 'junio'
            }, {
                type: 'numeric',
                dataIndex: 'julio'
            }, {
                type: 'numeric',
                dataIndex: 'agosto'
            }, {
                type: 'numeric',
                dataIndex: 'septiembre'
            }, {
                type: 'numeric',
                dataIndex: 'octubre'
            }, {
                type: 'numeric',
                dataIndex: 'noviembre'
            }, {
                type: 'numeric',
                dataIndex: 'diciembre'
            }]
    });
    cmControlEmpresaTaller = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbEjecutor,
            tooltip: perfil.etiquetas.lbEjecutor,
            width: 120,
            dataIndex: 'identidad',
            renderer: renderEntidadesEjecutor

        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPrecioDiv,
            tooltip: perfil.etiquetas.lbPrecioDivisa,
            width: 100,
            dataIndex: 'preciodivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPlan,
            tooltip: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'plan',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAjuste,
            tooltip: perfil.etiquetas.lbAjuste,
            width: 100,
            dataIndex: 'ajuste',
            renderer: crearToolTip,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                enableKeyEvents: true,
                decimalPrecision: 3,
                maxValue: 0
            })
        }, {
            header: perfil.etiquetas.lbPlanFinal,
            tooltip: perfil.etiquetas.lbPlanFinal,
            width: 100,
            dataIndex: 'planfinal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbReal,
            tooltip: perfil.etiquetas.lbReal,
            width: 100,
            dataIndex: 'cantreal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferencia,
            tooltip: perfil.etiquetas.lbDiferencia,
            width: 100,
            dataIndex: 'diferencia',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlan,
            tooltip: perfil.etiquetas.lbImportePlan,
            width: 100,
            dataIndex: 'importeplan',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustado,
            tooltip: perfil.etiquetas.lbImporteAjustado,
            width: 100,
            dataIndex: 'importeajustado',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteReal,
            tooltip: perfil.etiquetas.lbImporteReal,
            width: 100,
            dataIndex: 'importereal',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporte,
            tooltip: perfil.etiquetas.lbDiferenciaImporte,
            width: 100,
            dataIndex: 'diferenciaimporte',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlanDivisa,
            tooltip: perfil.etiquetas.lbImportePlanDivisa,
            width: 100,
            dataIndex: 'importeplandivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustadoDivisa,
            tooltip: perfil.etiquetas.lbImporteAjustadoDivisa,
            width: 100,
            dataIndex: 'importeajustadodivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteRealDivisa,
            tooltip: perfil.etiquetas.lbImporteRealDivisa,
            width: 100,
            dataIndex: 'importerealdivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporteDivisa,
            tooltip: perfil.etiquetas.lbDiferenciaImporteDivisa,
            width: 100,
            dataIndex: 'diferenciaimportedivisa',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 80,
            dataIndex: 'enero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbFebrero,
            tooltip: perfil.etiquetas.lbFebrero,
            width: 80,
            dataIndex: 'febrero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMarzo,
            tooltip: perfil.etiquetas.lbMarzo,
            width: 80,
            dataIndex: 'marzo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAbril,
            tooltip: perfil.etiquetas.lbAbril,
            width: 80,
            dataIndex: 'abril',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMayo,
            tooltip: perfil.etiquetas.lbMayo,
            width: 80,
            dataIndex: 'mayo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJunio,
            tooltip: perfil.etiquetas.lbJunio,
            width: 80,
            dataIndex: 'junio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJulio,
            tooltip: perfil.etiquetas.lbJulio,
            width: 80,
            dataIndex: 'julio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAgosto,
            tooltip: perfil.etiquetas.lbAgosto,
            width: 80,
            dataIndex: 'agosto',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbSeptiembre,
            tooltip: perfil.etiquetas.lbSeptiembre,
            width: 80,
            dataIndex: 'septiembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbOctubre,
            tooltip: perfil.etiquetas.lbOctubre,
            width: 80,
            dataIndex: 'octubre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbNoviembre,
            tooltip: perfil.etiquetas.lbNoviembre,
            width: 80,
            dataIndex: 'noviembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiciembre,
            tooltip: perfil.etiquetas.lbDiciembre,
            width: 80,
            dataIndex: 'diciembre',
            renderer: renderMeses,
            align: 'right'
        }
    ]);
    smControlEmpresaTaller = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    gpControlEmpresaTaller = new Ext.grid.EditorGridPanel({
        store: stControlEmpresaTaller,
        autoScroll: true,
        title: 'Desglose de controles',
        id: 'idgpControlEmpresaTaller',
        sm: smControlEmpresaTaller,
        cm: cmControlEmpresaTaller,
        plugins: filtrosControlEmpresaTaller,
        region: 'south',
        height: 300,
        disabled: true,
        tbar: [btnGuardarAjuste],
        listeners: {
            beforeedit: function (e) {
                if (btnGuardarAjuste.hidden)
                    e.cancel = true;
            },
            afteredit: function () {
                btnGuardarAjuste.enable();
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stControlEmpresaTaller,
            displayInfo: true,
            items: ['-', btnLimpiarControlEmpresaTaller],
            listeners: {
                beforechange: function (p, e) {
                    offsetControlEmpresaTaller = e.start;
                }
            }
        })
    });

    //panel inferior: desglose de los extraplanes
    btnAdicionarDesglosePlanExtraplan = new Ext.Button({
        id: 'btnAdicionarDesglosePlanExtraplan',
        iconCls: 'adicionar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAdicionarDesgloseExtraPlan,
        handler: function () {
            adicionarDesgloseDemandaExtraPlan();
        }
    });
    btnGuardarDesglosePlanExtraplan = new Ext.Button({
        id: 'btnGuardarDesglosePlanExtraplan',
        disabled: true,
        hidden: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarDesglosePlanExtraplan();
        }
    });
    btnEliminarDesglosePlanExtraplan = new Ext.Button({
        id: 'btnEliminarDesglosePlanExtraplan',
        hidden: true,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDesgloseDemanda, eliminarDesgloseDemandaExtraPlan);
        }
    });
    btnLimpiarPlanControlEmpresaTaller = new Ext.Button({
        id: 'idbtnLimpiarPlanControlEmpresaTaller',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosPlanControlEmpresaTaller.clearFilters();
        }
    });

    stPlanControlEmpresaTaller = new Ext.data.Store({
        id: 'stPlanControlEmpresaTaller',
        url: 'listarDesgloseDemandaExtraPlan',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemandatiempo'
        }, [{
                name: 'iddemandatiempo'
            }, {
                name: 'identidad'
            }, {
                name: 'preciodesglosado'
            }, {
                name: 'preciodesglosadodivisa'
            }, {
                name: 'cantidaddesglosada'
            }, {
                name: 'importetotal'
            }, {
                name: 'importetotaldivisa'
            }, {
                name: 'enero'
            }, {
                name: 'febrero'
            }, {
                name: 'marzo'
            }, {
                name: 'abril'
            }, {
                name: 'mayo'
            }, {
                name: 'junio'
            }, {
                name: 'julio'
            }, {
                name: 'agosto'
            }, {
                name: 'septiembre'
            }, {
                name: 'octubre'
            }, {
                name: 'noviembre'
            }, {
                name: 'diciembre'
            }
        ]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stPlanControlEmpresaTaller.baseParams.start = offsetPlanControlEmpresaTaller;
                stPlanControlEmpresaTaller.baseParams.iddemanda = smControlEmpresa.getSelected().data.iddemanda;
            },
            load: function () {
                btnGuardarDesglosePlanExtraplan.disable();
                cambiarTituloFiltrar(gpPlanControlEmpresaTaller, filtrosPlanControlEmpresaTaller, 'Desglose extraplan');
                //gpPlanControlEmpresaTaller.enable();
                if (stPlanControlEmpresaTaller.getCount() == 0) {
                    if (filtrosPlanControlEmpresaTaller.getFiltrosActivos() != undefined && filtrosPlanControlEmpresaTaller.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                gpPlanControlEmpresaTaller.getSelectionModel().clearSelections();
                mymask.hide();
            }
        }
    });
    filtrosPlanControlEmpresaTaller = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'cbidentidadControl',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEjecutor,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosado'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosadodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'cantidaddesglosada'
            }, {
                type: 'numeric',
                dataIndex: 'importetotal'
            }, {
                type: 'numeric',
                dataIndex: 'importetotaldivisa'
            }, {
                type: 'numeric',
                dataIndex: 'enero'
            }, {
                type: 'numeric',
                dataIndex: 'febrero'
            }, {
                type: 'numeric',
                dataIndex: 'marzo'
            }, {
                type: 'numeric',
                dataIndex: 'abril'
            }, {
                type: 'numeric',
                dataIndex: 'mayo'
            }, {
                type: 'numeric',
                dataIndex: 'junio'
            }, {
                type: 'numeric',
                dataIndex: 'julio'
            }, {
                type: 'numeric',
                dataIndex: 'agosto'
            }, {
                type: 'numeric',
                dataIndex: 'septiembre'
            }, {
                type: 'numeric',
                dataIndex: 'octubre'
            }, {
                type: 'numeric',
                dataIndex: 'noviembre'
            }, {
                type: 'numeric',
                dataIndex: 'diciembre'
            }]
    });
    cmPlanControlEmpresaTaller = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbEjecutor,
            tooltip: perfil.etiquetas.lbEjecutor,
            width: 120,
            dataIndex: 'identidad',
            renderer: renderEntidadesEjecutor

        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'preciodesglosado',
            renderer: crearToolTip,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbPrecioDiv,
            tooltip: perfil.etiquetas.lbPrecioDivisa,
            width: 100,
            dataIndex: 'preciodesglosadodivisa',
            renderer: crearToolTip,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbPlan,
            tooltip: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'cantidaddesglosada',
            renderer: crearToolTip,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbImportePlan,
            tooltip: perfil.etiquetas.lbImportePlan,
            width: 100,
            dataIndex: 'importetotal',
            renderer: crearToolTip,
            hidden: true,
            align: 'right',
            enableKeyEvents: true
        }, {
            header: perfil.etiquetas.lbImportePlanDivisa,
            tooltip: perfil.etiquetas.lbImportePlanDivisa,
            width: 100,
            dataIndex: 'importetotaldivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right',
            enableKeyEvents: true
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 80,
            dataIndex: 'enero',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbFebrero,
            tooltip: perfil.etiquetas.lbFebrero,
            width: 80,
            dataIndex: 'febrero',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbMarzo,
            tooltip: perfil.etiquetas.lbMarzo,
            width: 80,
            dataIndex: 'marzo',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbAbril,
            tooltip: perfil.etiquetas.lbAbril,
            width: 80,
            dataIndex: 'abril',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbMayo,
            tooltip: perfil.etiquetas.lbMayo,
            width: 80,
            dataIndex: 'mayo',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbJunio,
            tooltip: perfil.etiquetas.lbJunio,
            width: 80,
            dataIndex: 'junio',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbJulio,
            tooltip: perfil.etiquetas.lbJulio,
            width: 80,
            dataIndex: 'julio',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbAgosto,
            tooltip: perfil.etiquetas.lbAgosto,
            width: 80,
            dataIndex: 'agosto',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbSeptiembre,
            tooltip: perfil.etiquetas.lbSeptiembre,
            width: 80,
            dataIndex: 'septiembre',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbOctubre,
            tooltip: perfil.etiquetas.lbOctubre,
            width: 80,
            dataIndex: 'octubre',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbNoviembre,
            tooltip: perfil.etiquetas.lbNoviembre,
            width: 80,
            dataIndex: 'noviembre',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }, {
            header: perfil.etiquetas.lbDiciembre,
            tooltip: perfil.etiquetas.lbDiciembre,
            width: 80,
            dataIndex: 'diciembre',
            renderer: renderMeses,
            align: 'right',
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                enableKeyEvents: true,
                decimalPrecision: 3
            })
        }
    ]);
    smPlanControlEmpresaTaller = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                //if (smControlEmpresa.getSelected().data.extraplan == 1)
                btnEliminarDesglosePlanExtraplan.enable();
                //else
                //btnEliminarDesglosePlanExtraplan.disable();
            },
            rowdeselect: function () {
                btnEliminarDesglosePlanExtraplan.disable();
            }
        }
    });
    gpPlanControlEmpresaTaller = new Ext.grid.EditorGridPanel({
        store: stPlanControlEmpresaTaller,
        autoScroll: true,
        title: 'Desglose extraplan',
        id: 'idgpPlanControlEmpresaTaller',
        sm: smPlanControlEmpresaTaller,
        cm: cmPlanControlEmpresaTaller,
        plugins: filtrosPlanControlEmpresaTaller,
        region: 'south',
        height: 300,
        disabled: true,
        tbar: [btnAdicionarDesglosePlanExtraplan, btnGuardarDesglosePlanExtraplan, btnEliminarDesglosePlanExtraplan],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stPlanControlEmpresaTaller,
            displayInfo: true,
            items: ['-', btnLimpiarPlanControlEmpresaTaller],
            listeners: {
                beforechange: function (p, e) {
                    offsetPlanControlEmpresaTaller = e.start;
                }
            }
        }),
        listeners: {
            beforeedit: function (e) {
                if (btnGuardarDesglosePlanExtraplan.hidden)
                    e.cancel = true;
            },
            afteredit: function () {
                btnGuardarDesglosePlanExtraplan.enable();
            }
        }
    });

    //TabPanel inferior(desagregar extraplan y visualizar estado de ejecucion por talleres)
    tabPanelExtraplanEjecucion = new Ext.TabPanel({
        activeTab: 1,
        split: true,
        collapsible: true,
        collapsed: true,
        id: 'tabPanelExtraplanEjecucion',
        region: 'south',
        height: 300,
        plain: true,
        defaults: {autoScroll: true},
        items: [{
                id: 'tabGestionDesgloseExtraplan',
                title: 'Desglose extraplan',
                layout: 'fit',
                items: [gpPlanControlEmpresaTaller]
            }, {
                id: 'tabVisualizarEstadoEjecucionXTalleres',
                title: 'Desglose controles',
                layout: 'fit',
                items: [gpControlEmpresaTaller]
            }
        ]
    });

    panelControlEmpresa = new Ext.Panel({
        id: 'panelControlEmpresa',
        layout: 'border',
        region: 'center',
        items: [gpControlEmpresa, tabPanelExtraplanEjecucion]
    });

    function separadorDeMilesEmpresa(nStr) {
        nStr += '';
        ds = nStr.replace(/,/g, '');
        nStr = ds;
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    function setearImporteEmpresa() {
        importesEmpresa = [];
        importesEmpresa.push('0.000'); //indice 0
        importesEmpresa.push('0.000'); //indice 1 lbImportePlan
        importesEmpresa.push('0.000'); //indice 2 lbImporteAjustado   
        importesEmpresa.push('0.000'); //indice 3 lbImporteReal
        importesEmpresa.push('0.000'); //indice 4 lbDiferenciaImporte
        importesEmpresa.push('0.000'); //indice 5 lbImportePlanDivisa   
        importesEmpresa.push('0.000'); //indice 6 lbImporteAjustadoDivisa
        importesEmpresa.push('0.000'); //indice 7 lbImporteRealDivisa   
        importesEmpresa.push('0.000'); //indice 8 lbDiferenciaImporteDivisa   
    }
    function calcularImporteTotalEmpresa() {
        setearImporteEmpresa();
        if (stControlEmpresa.getCount() > 0) {
            importesEmpresa[1] = stControlEmpresa.getAt(0).data.importeplantotalmn;
            importesEmpresa[2] = stControlEmpresa.getAt(0).data.importeajustadototalmn;
            importesEmpresa[3] = stControlEmpresa.getAt(0).data.importerealtotalmn;
            importesEmpresa[4] = stControlEmpresa.getAt(0).data.diferenciaimportetotalmn;
            importesEmpresa[5] = stControlEmpresa.getAt(0).data.importeplantotalcuc;
            importesEmpresa[6] = stControlEmpresa.getAt(0).data.importeajustadototalcuc;
            importesEmpresa[7] = stControlEmpresa.getAt(0).data.importerealtotalcuc;
            importesEmpresa[8] = stControlEmpresa.getAt(0).data.diferenciaimportetotalcuc;

            var importe = separadorDeMilesEmpresa(importesEmpresa[cbImportesEmpresa.getValue()]);
            tfimportetotalEmpresa.setValue(importe);
        } else {
            var importe = separadorDeMilesEmpresa(importesEmpresa[cbImportesEmpresa.getValue()]);
            tfimportetotalEmpresa.setValue(importe);
        }
    }

    function upColorCellControlEmpresa(storeDin, cmDin, gpDin) {
        for (var i = 0; i < storeDin.getCount(); i++) {
            for (var j = 0; j < cmDin.getColumnCount(); j++) {
                //cumplido
                if (storeDin.getAt(i).data.diferencia == 0) {
                    Ext.get(gpDin.getView().getCell(i, j)).applyStyles('background-color:#CCFFCC');
                } else
                //sobrecumplido
                if (storeDin.getAt(i).data.diferencia < 0) {
                    Ext.get(gpDin.getView().getCell(i, j)).applyStyles('background-color:#8FBC8B');
                }
            }
        }
    }
}
function gestionarObservacionEmpresa() {
    stMesesEmpresa = new Ext.data.Store({
        url: 'cargarMeses',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbMesEmpresa = new Ext.form.ComboBox({
        store: stMesesEmpresa,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        width: 150,
        listeners: {
            select: function () {
                stGestionarObservacionEmpresa.reload();
            }
        }
    });
    stGestionarObservacionEmpresa = new Ext.data.Store({
        id: 'stGestionarObservacionEmpresa',
        url: 'listarObservacionesControl',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idobservacioncontrol'
        }, [{
                name: 'idobservacioncontrol'
            }, {
                name: 'iddemandatiempo'
            }
            , {
                name: 'idmes'
            }
            , {
                name: 'identidad'
            }
            , {
                name: 'idusuario'
            }, {
                name: 'observacion'
            }, {
                name: 'fecha'
            }
        ]), listeners: {
            beforeload: function () {
                mymask.show();
                stGestionarObservacionEmpresa.baseParams.iddemanda = smControlEmpresa.getSelected().data.iddemanda;
                stGestionarObservacionEmpresa.baseParams.identidad = nodoEntidadControl.id;
                stGestionarObservacionEmpresa.baseParams.idmes = cbMesEmpresa.getValue();
                stGestionarObservacionEmpresa.baseParams.start = offsetGestionarObservacionEmpresa;
                stGestionarObservacionEmpresa.baseParams.tipo = cbComportamientoControl.getValue();
            },
            load: function () {
                cambiarTituloFiltrar(gpGestionarObservacionEmpresa, filtrosGestionarObservacionEmpresa, perfil.etiquetas.lbTtleGestionarObservacion);
                if (stGestionarObservacionEmpresa.getCount() == 0) {
                    if (filtrosGestionarObservacionEmpresa.getFiltrosActivos() == undefined || filtrosGestionarObservacionEmpresa.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);

                }
                smGestionarObservacionEmpresa.clearSelections();
                gpGestionarObservacionEmpresa.enable();
                controlarObjetosObservacionEmpresa();
                mymask.hide();
            }
        }
    });
    filtrosGestionarObservacionEmpresa = new Ext.grid.GridFilters({
        filters: [{
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbidusuarioObservacion',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'idcbentidad',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEjecutor,
                autoload: true,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'observacion'
            }]
    });
    cmGestionarObservacionEmpresa = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbTaller,
            tooltip: perfil.etiquetas.lbTaller,
            width: 120,
            dataIndex: 'identidad',
            renderer: renderEntidadesEjecutor
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            width: 80,
            dataIndex: 'fecha',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 80,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbObservacion,
            width: 290,
            dataIndex: 'observacion',
            renderer: crearToolTip
        }
    ]);

    smGestionarObservacionEmpresa = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                controlarObjetosObservacionEmpresa();
            },
            rowdeselect: function () {
                controlarObjetosObservacionEmpresa();
            }
        }
    });
    btnLimpiarGestionarObservacionEmpresa = new Ext.Button({
        id: 'btnLimpiarGestionarObservacionEmpresa',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosGestionarObservacionEmpresa.clearFilters();
        }
    });
    gpGestionarObservacionEmpresa = new Ext.grid.GridPanel({
        plugins: filtrosGestionarObservacionEmpresa,
        store: stGestionarObservacionEmpresa,
        cm: cmGestionarObservacionEmpresa,
        sm: smGestionarObservacionEmpresa,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGestionarObservacionEmpresa,
            displayInfo: true,
            items: ['-', btnLimpiarGestionarObservacionEmpresa],
            listeners: {
                beforechange: function (p, e) {
                    offsetGestionarObservacionEmpresa = e.start;
                }
            }
        }),
        region: 'center',
        width: 325,
        title: perfil.etiquetas.lbTtleGestionarObservacion,
        id: 'gpGestionarObservacionEmpresa',
        tbar: [cbMesEmpresa]
    });
    textAreaObservacionEmpresa = new Ext.form.TextArea({
        id: 'textAreaObservacionEmpresa',
        frame: true,
        height: 150,
        anchor: '100%',
        maxLength: 255,
        readOnly: true,
        //allowBlank: false,
        fieldLabel: perfil.etiquetas.lbObservacion/*,
         enableKeyEvents: true*/
    });
    fpGestionarObservacionEmpresa = new Ext.form.FormPanel({
        region: 'east',
        disabled: true,
        title: 'Ver/Editar Observacion',
        frame: true,
        labelWidth: 80,
        width: 325,
        items: [
            textAreaObservacionEmpresa
        ]
    });
    pGestionarObservacionEmpresa = new Ext.Panel({
        width: 650,
        height: 300,
        layout: 'border',
        items: [
            gpGestionarObservacionEmpresa,
            fpGestionarObservacionEmpresa
        ]
    });
    wingestionarObservacionEmpresa = new Ext.Window({
        id: 'wingestionarObservacionEmpresa',
        modal: true,
        closeAction: 'destroy',
        width: 930,
        height: 350,
        layout: 'fit',
        resizable: false,
        items: [pGestionarObservacionEmpresa],
        title: perfil.etiquetas.lbGestionarObservacion,
        listeners: {
            destroy: function () {
                stControlEmpresa.reload();
            }
        }

    });
    wingestionarObservacionEmpresa.show();
    // stGestionarObservacion.reload();
    function guardarObservacionEmpresa() {
        mymask.show();
        selec1Empresa = smControlEmpresa.getSelected();
        txtObservacionEmpresa = textAreaObservacionEmpresa.getValue();
        Ext.Ajax.request({
            url: 'guardarObservacionControl',
            params: {
                iddemandatiempo: selec1Empresa.data.iddemandatiempo,
                identidad: nodoEntidadControl.id,
                idmes: cbMesEmpresa.getValue(),
                observacion: txtObservacionEmpresa

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddOK);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddNO);
                }
                stGestionarObservacionEmpresa.reload();
            }
        });
    }
    function controlarObjetosObservacionEmpresa() {
        //btnGuardarObservacion.disable();
        selecObservEmpresa = smGestionarObservacionEmpresa.getSelected();
        textAreaObservacionEmpresa.disable();
        fpGestionarObservacionEmpresa.disable();
        if (selecObservEmpresa != undefined) {
            if (idusariologueado == selecObserv.data.idusuario)
            {
                textAreaObservacion.enable();
                fpGestionarObservacionEmpresa.enable();
            }
            textAreaObservacion.reset();
            textAreaObservacion.setValue(selecObserv.data.observacion);
        } else {
            textAreaObservacionEmpresa.reset();
        }
    }

    function renderBinario(val, m) {
        if (val === 1) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            m.css = 'icondistra-true verde'
        } else if (val === 0) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            m.css = 'icondistra-false rojo'
        }
    }


}
