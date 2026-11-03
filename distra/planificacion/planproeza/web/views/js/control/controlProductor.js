var offsetGestionarObservacion = 0;
function cargarControlProductor() {
//elementos del plan aprobado
    var importesProductor = [];
    stPlanControl = new Ext.data.Store({
        id: 'idstPlanControl',
        url: 'listarControlEjecucionProductor',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                mymask.show();
                stPlanControl.baseParams.start = offsetControlProductor;
                stPlanControl.baseParams.idejercicio = cbEjercicioControl.getValue();
                stPlanControl.baseParams.identidad = nodoEntidadControl.id;
            },
            load: function () {
                cambiarTituloFiltrar(gpPlanControl, filtrosPlanControl, 'Controles');
                gpPlanControl.enable();
                if (stPlanControl.getCount() == 0) {
                    setearImporteProductor();
                    stEjecucion.loadData({"data": [], "total": 0});
                    btnExportarControl.disable();
                    btnGestionarObservacion.disable();
                    if (filtrosPlanControl.getFiltrosActivos() == undefined || filtrosPlanControl.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    upColorCellControlProductor(stPlanControl, cmPlanControl, gpPlanControl);
                    calcularImporteTotalProductor();
                    if (importesProductor[cbImportesProductor.getValue()] != undefined) {
                        var importeProductor = separadorDeMilesProductor(importesProductor[cbImportesProductor.getValue()]);
                        tfimportetotalProductor.setValue(importeProductor);
                    } else {
                        tfimportetotalProductor.setValue('0.000');
                    }
                    btnExportarControl.enable();
                    Ext.getCmp('btnExportarControlProductor').show();
                    Ext.getCmp('btnExportarControlEmpresa').hide();
                    Ext.getCmp('btnExportarControlRector').hide();
                    upColorControl(stPlanControl, cmPlanControl, gpPlanControl);
                    
                }
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemandatiempo'
        }, [
            {
                name: 'iddemandatiempo'
            }, {
                name: 'iddemanda'
            }, {
                name: 'extraplan'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'idprograma'
            }, {
                name: 'iddestino'
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
        ])
    });
    stTieneObserv = new Ext.data.SimpleStore({
        id: 'stTieneObserv',
        fields: [{
                name: 'tieneobservacion'
            }, {
                name: 'denominacion'
            }],
        data: [['0', perfil.etiquetas.lbNo], ['1', perfil.etiquetas.lbSi]]
    });
    filtrosPlanControl = new Ext.grid.GridFilters({
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
    cmPlanControl = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 300,
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
    smPlanControl = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                stEjecucion.reload();
                btnAdicionar.enable();
                btnGestionarObservacion.enable();
            },
            rowdeselect: function () {
                stEjecucion.loadData({"data": [], "total": 0});
                btnAdicionar.disable();
                gpEjecucion.disable();
                btnGestionarObservacion.disable();
            }
        }
    });
    btnLimpiarPlanAprobado = new Ext.Button({
        id: 'idbtnLimpiarPlanAprobado',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosPlanControl.clearFilters();
        }
    });
    tfimportetotalProductor = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalProductor',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportesProductor = new Ext.data.SimpleStore({
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
    cbImportesProductor = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportesProductor,
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
                if (importesProductor[cbImportesProductor.getValue()] != undefined) {
                    var importeProductor = separadorDeMilesProductor(importesProductor[cbImportesProductor.getValue()]);
                    tfimportetotalProductor.setValue(importeProductor);
                } else {
                    tfimportetotalProductor.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnGestionarObservacion = new Ext.Button({
        id: 'btnGestionarObservacion',
        iconCls: 'info',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbGestionarObservacion,
        handler: function () {
            gestionarObservacion();
        }
    });
    gpPlanControl = new Ext.grid.GridPanel({
        region: 'center',
        title: 'Controles',
        store: stPlanControl,
        autoScroll: true,
        id: 'idgpPlanControl',
        sm: smPlanControl,
        cm: cmPlanControl,
        plugins: filtrosPlanControl,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stPlanControl,
            displayInfo: true,
            items: ['-', btnLimpiarPlanAprobado, '-', cbImportesProductor, tfimportetotalProductor],
            listeners: {
                beforechange: function (p, e) {
                    offsetControlProductor = e.start;
                }
            }
        })
    });
//elementos del control del plan aprobado
    stEjecucion = new Ext.data.Store({
        id: 'stEjecucion',
        url: 'listarEjecucion',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                mymask.show();
                stEjecucion.baseParams.start = offsetControlProductorDesglose;
                stEjecucion.baseParams.iddemandatiempo = smPlanControl.getSelections()[0].id;
            },
            load: function () {
                cambiarTituloFiltrar(gpEjecucion, filtrosEjecucion, 'Ejecución por fechas');
                if (stEjecucion.getCount() == 0) {
                    if (filtrosEjecucion.getFiltrosActivos() != undefined && filtrosEjecucion.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                gpEjecucion.enable();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idcontrolejecucion'
        }, [{
                name: 'idcontrolejecucion'
            }, {
                name: 'cantidadproducida'
            }, {
                name: 'fecha'
            }, {
                name: 'idusuario'
            }, {
                name: 'fechamodificacion'
            }
        ])
    });
    filtrosEjecucion = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'cantidadproducida'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios
            }, {
                type: 'date',
                dataIndex: 'fechamodificacion'
            }]
    });
    cmEjecucion = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            width: 100,
            dataIndex: 'cantidadproducida',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 2,
                allowBlank: false,
                listeners: {
                    change: function () {
                        btnGuardar.enable();
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            width: 100,
            dataIndex: 'fecha',
            sortable: false,
            renderer: renderFecha,
            editor: new Ext.form.DateField({
                format: 'd/m/Y',
                id: 'editorFecha',
                allowBlank: false,
                //maxValue: hoyFecha(),
                // minValue: '01/02/2020',
                invalidText: 'Formato: d/m/a',
                // value: new Date().format('d/m/Y'),
                listeners: {
                    select: function () {
                        btnGuardar.enable();
                    },
                    change: function () {
                        btnGuardar.enable();
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 200,
            dataIndex: 'idusuario',
            hidden: true,
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbFechaMod,
            tooltip: perfil.etiquetas.lbFechaMod,
            width: 100,
            hidden: true,
            dataIndex: 'fechamodificacion',
            renderer: renderFecha
        }
    ]);
    smEjecucion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminar.enable();
            },
            rowdeselect: function () {
                btnEliminar.disable();
            }
        }
    });
    btnLimpiarPlanEjecutado = new Ext.Button({
        id: 'idbtnLimpiarPlanEjecutado',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosEjecucion.clearFilters();
        }
    });
    btnAdicionar = new Ext.Button({
        id: 'idbtnAdicionar',
        disabled: true,
        iconCls: 'adicionar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAdicionar,
        handler: function () {
            adicionarEjecucion();
        }
    });
    btnEliminar = new Ext.Button({
        id: 'idbtnEliminar',
        disabled: true,
        hidden: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        handler: function () {
            eliminarEjecucion();
        }
    });
    btnGuardar = new Ext.Button({
        id: 'idbtnGuardarProductor',
        hidden: true,
        disabled: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarEjecucionProductor();
        }
    });
    gpEjecucion = new Ext.grid.EditorGridPanel({
        store: stEjecucion,
        title: 'Ejecución por fechas',
        autoScroll: true,
        disabled: true,
        id: 'idgpEjecucion',
        sm: smEjecucion,
        cm: cmEjecucion,
        plugins: filtrosEjecucion,
        clicksToEdit: 2,
        listeners: {
            beforeedit: function (e) {
                if (btnGuardar.hidden) {
                    e.cancel = true;
                }
            }
        },
        tbar: [btnAdicionar, btnEliminar, btnGuardar],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stEjecucion,
            displayInfo: true,
            items: ['-', btnLimpiarPlanEjecutado],
            listeners: {
                beforechange: function (p, e) {
                    offsetControlProductorDesglose = e.start;
                }
            }
        })
    });
    panelgpEjecucion = new Ext.Panel({
        id: 'panelgpEjecucion',
        layout: 'fit',
        region: 'south',
        split: true,
        title: ' ',
        collapsible: true,
        collapsed: true,
        height: 300,
        items: [gpEjecucion]
    });
//Panel de control del productor
    panelControlProductor = new Ext.Panel({
        id: 'panelControlProductor',
        layout: 'border',
        region: 'center',
        items: [gpPlanControl, panelgpEjecucion]
    });
    function separadorDeMilesProductor(nStr) {
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
    function setearImporteProductor() {
        importesProductor = [];
        importesProductor.push('0.000'); //indice 0
        importesProductor.push('0.000'); //indice 1 lbImportePlan
        importesProductor.push('0.000'); //indice 2 lbImporteAjustado   
        importesProductor.push('0.000'); //indice 3 lbImporteReal
        importesProductor.push('0.000'); //indice 4 lbDiferenciaImporte
        importesProductor.push('0.000'); //indice 5 lbImportePlanDivisa   
        importesProductor.push('0.000'); //indice 6 lbImporteAjustadoDivisa
        importesProductor.push('0.000'); //indice 7 lbImporteRealDivisa   
        importesProductor.push('0.000'); //indice 8 lbDiferenciaImporteDivisa   
    }
    function calcularImporteTotalProductor() {
        setearImporteProductor();
        if (stPlanControl.getCount() > 0) {
            importesProductor[1] = stPlanControl.getAt(0).data.importeplantotalmn;
            importesProductor[2] = stPlanControl.getAt(0).data.importeajustadototalmn;
            importesProductor[3] = stPlanControl.getAt(0).data.importerealtotalmn;
            importesProductor[4] = stPlanControl.getAt(0).data.diferenciaimportetotalmn;
            importesProductor[5] = stPlanControl.getAt(0).data.importeplantotalcuc;
            importesProductor[6] = stPlanControl.getAt(0).data.importeajustadototalcuc;
            importesProductor[7] = stPlanControl.getAt(0).data.importerealtotalcuc;
            importesProductor[8] = stPlanControl.getAt(0).data.diferenciaimportetotalcuc;

            var importe = separadorDeMilesProductor(importesProductor[cbImportesProductor.getValue()]);
            tfimportetotalProductor.setValue(importe);
        } else {
            var importe = separadorDeMilesProductor(importesProductor[cbImportesProductor.getValue()]);
            tfimportetotalProductor.setValue(importe);
        }
    }
    function upColorCellControlProductor(storeDin, cmDin, gpDin) {
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


function gestionarObservacion() {
    stMeses = new Ext.data.Store({
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
    cbMes = new Ext.form.ComboBox({
        store: stMeses,
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
                stGestionarObservacion.reload();
                btnAdicionarObservacion.enable();
            }
        }
    });
    stGestionarObservacion = new Ext.data.Store({
        id: 'stGestionarObservacion',
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
                stGestionarObservacion.baseParams.iddemandatiempo = smPlanControl.getSelected().data.iddemandatiempo;
                stGestionarObservacion.baseParams.idmes = cbMes.getValue();
                stGestionarObservacion.baseParams.start = offsetGestionarObservacion;
                stGestionarObservacion.baseParams.tipo = cbComportamientoControl.getValue();
            },
            load: function () {
                cambiarTituloFiltrar(gpGestionarObservacion, filtrosGestionarObservacion, perfil.etiquetas.lbTtleGestionarObservacion);
                if (stGestionarObservacion.getCount() == 0) {
                    if (filtrosGestionarObservacion.getFiltrosActivos() == undefined || filtrosGestionarObservacion.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);

                }
                smGestionarObservacion.clearSelections();
                gpGestionarObservacion.enable();
                controlarObjetosObservacion();
                mymask.hide();
            }
        }
    });
    filtrosGestionarObservacion = new Ext.grid.GridFilters({
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
    cmGestionarObservacion = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbTaller,
            tooltip: perfil.etiquetas.lbTaller,
            width: 120,
            dataIndex: 'denominacion',
            renderer: renderEntidadesEjecutoras
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
    stEntidadesEjecutor = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesEjecutor',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                stEntidadesEjecutor.baseParams.comp = 'ejecutor';
            }
        }
    });
    smGestionarObservacion = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {

                controlarObjetosObservacion();
            },
            rowdeselect: function () {
                controlarObjetosObservacion();
            }
        }
    });
    btnAdicionarObservacion = new Ext.Button({
        id: 'btnAdicionarObservacion',
        disabled: true,
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionar,
        handler: function () {
            textAreaObservacion.reset();
            fpGestionarObservacion.enable();
            textAreaObservacion.focus();
        }
    });
    btnGuardarObservacion = new Ext.Button({
        id: 'btnGuardarObservacion',
        disabled: true,
        iconCls: 'guardar',
        text: perfil.etiquetas.lbGuardar,
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        handler: function () {
            guardarObservacion();
        }
    });
    btnCancelarObservacion = new Ext.Button({
        id: 'btnCancelarObservacion',
        disabled: true,
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbCancelar,
        tooltip: perfil.etiquetas.lbCancelarInfo,
        enableKeyEvents: true,
        handler: function () {
            textAreaObservacion.reset();
            gpGestionarObservacion.enable();
            btnCancelarObservacion.disable();
            //controlarObjetosObservacion();
        }
    });
    btnLimpiarGestionarObservacion = new Ext.Button({
        id: 'btnLimpiarGestionarObservacion',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosGestionarObservacion.clearFilters();
        }
    });
    gpGestionarObservacion = new Ext.grid.GridPanel({
        plugins: filtrosGestionarObservacion,
        store: stGestionarObservacion,
        cm: cmGestionarObservacion,
        sm: smGestionarObservacion,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGestionarObservacion,
            displayInfo: true,
            items: ['-', btnLimpiarGestionarObservacion],
            listeners: {
                beforechange: function (p, e) {
                    offsetGestionarObservacion = e.start;
                }
            }
        }),
        region: 'center',
        width: 325,
        title: perfil.etiquetas.lbTtleGestionarObservacion,
        id: 'gpGestionarObservacion',
        tbar: [cbMes, '-', btnAdicionarObservacion]
    });
    textAreaObservacion = new Ext.form.TextArea({
        id: 'textAreaObservacion',
        frame: true,
        height: 150,
        anchor: '100%',
        maxLength: 255,
        allowBlank: false,
        fieldLabel: perfil.etiquetas.lbObservacion,
        enableKeyEvents: true,
        listeners: {
            keydown: function (e) {
                btnGuardarObservacion.enable();
            },
            focus: function () {
                gpGestionarObservacion.disable();
                btnGuardarObservacion.disable();
                btnCancelarObservacion.enable();
            }
        }
    });
    fpGestionarObservacion = new Ext.form.FormPanel({
        region: 'east',
        disabled: true,
        title: 'Ver/Editar Observacion',
        frame: true,
        labelWidth: 80,
        width: 325,
        items: [
            textAreaObservacion
        ],
        buttons: [btnGuardarObservacion, btnCancelarObservacion]
    });
    pGestionarObservacion = new Ext.Panel({
        width: 650,
        height: 300,
        layout: 'border',
        items: [
            gpGestionarObservacion,
            fpGestionarObservacion
        ]
    });
    wingestionarObservacion = new Ext.Window({
        id: 'wingestionarObservacion',
        modal: true,
        closeAction: 'destroy',
        width: 930,
        height: 350,
        layout: 'fit',
        resizable: false,
        items: [pGestionarObservacion],
        title: perfil.etiquetas.lbGestionarObservacion,
        listeners: {
            destroy: function () {
                stPlanControl.reload();
            }
        }

    });
    wingestionarObservacion.show();
    // stGestionarObservacion.reload();
    function guardarObservacion() {
        mymask.show();
        selec1 = smPlanControl.getSelected();

        txtObservacion = textAreaObservacion.getValue();
        Ext.Ajax.request({
            url: 'guardarObservacionControl',
            params: {
                iddemandatiempo: selec1.data.iddemandatiempo,
                iddemanda: selec1.data.iddemanda,
                identidad: nodoEntidadControl.id,
                idmes: cbMes.getValue(),
                observacion: txtObservacion

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddOK);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddNO);
                }
                stGestionarObservacion.reload();
            }
        });
    }
    function controlarObjetosObservacion() {
        //btnGuardarObservacion.disable();     
        selecObserv = smGestionarObservacion.getSelected();
        textAreaObservacion.disable();
        fpGestionarObservacion.disable();
        if (selecObserv != undefined) {
            if (idusariologueado == selecObserv.data.idusuario)
            {
                textAreaObservacion.enable();
                fpGestionarObservacion.enable();
            }
            textAreaObservacion.reset();
            textAreaObservacion.setValue(selecObserv.data.observacion);
        } else {
            textAreaObservacion.reset();

        }


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
function renderFecha(val, m) {
    try {
        if (val != null) {
            var temp = val.split('.');
            var val2 = temp[0];
            var temp2 = val2.split(' ');
            m.attr = 'ext:qtip="' + temp2[1] + '"';
            var fecha = (temp2[0]).split('/');
            var fechafix = fecha[0] + '-' + fecha[1] + '-' + fecha[2]
            return fechafix;
        }
        return val;
    } catch (err) {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}

function renderEntidadesEjecutoras(value, m) {
    for (var i = 0; i < stEntidadesEjecutor.getTotalCount(); i++)
    {
        if (stEntidadesEjecutor.data.items[i].data.identidad == value) {
            m.attr = 'ext:qtip="' + stEntidadesEjecutor.data.items[i].data.denominacion + '"';
            return stEntidadesEjecutor.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}