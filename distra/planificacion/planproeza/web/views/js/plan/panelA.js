function cargarPanelA() {
    //Comportamiento proveedor 
    var rowDeselect = false;
    var importes = [];
    stPlanGestionA = new Ext.data.Store({
        id: 'stPlanGestionA',
        url: 'listarPlanProduccion',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                //mymask.show();

                stPlanGestionA.baseParams.start = offsetPlanGestionA;

                stPlanGestionA.baseParams.identidad = entidadSelecc;


                stPlanGestionA.baseParams.idejercicio = cbEjercicio.getValue();
                stPlanGestionA.baseParams.tipo = 2;
            },
            load: function () {
                cambiarTituloFiltrar(gpPlanGestionA, filtrosPlanGestionA, perfil.etiquetas.TtlePlanGestionA);
                gpPlanGestionA.enable();
                if (stPlanGestionA.getCount() == 0) {
                    setearImporte();
                    if (filtrosPlanGestionA.getFiltrosActivos() == undefined || filtrosPlanGestionA.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    upColorCellPlan();
                    calcularImporteTotal();
                    if (importes[cbImportes.getValue()] != undefined) {
                        var importe = separadorDeMiles(importes[cbImportes.getValue()]);
                        tfimportetotal.setValue(importe);
                    } else {
                        tfimportetotal.setValue('0.000');
                    }
                }
                if (tabPanelPlan.disabled != true) {
                    controlarObjetosA();
                    controlarPanelDesagB();
                }
                // mymask.hide();
            }
        },
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
                name: 'cantidadconfirmada'
            }, {
                name: 'importetotaldivisa'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidadproveedor'
            }, {
                name: 'iddestino'
            }, {
                name: 'idprograma'
            }, {
                name: 'idaprobacion'
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
                name: 'totaldesagregado'
            }, {
                name: 'diferencia'
            }, {
                name: 'importetotal'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }, {
                name: 'importetotalmn'
            }
            , {
                name: 'importetotalcuc'
            }
        ])
    });
    filtrosPlanGestionA = new Ext.grid.GridFilters({
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
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'importetotal'
            }, {
                type: 'numeric',
                dataIndex: 'importetotaldivisa'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadconfirmada'
            }, {
                type: 'numeric',
                dataIndex: 'totaldesagregado'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, perfil.etiquetas.lbNo], [2, perfil.etiquetas.lbAprobadoEmpresa], [4, perfil.etiquetas.lbAprobadoRector]]
            }, {
                type: 'listado',
                dataIndex: 'identidadcliente',
                idcombo: 'cbidentidad',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesCliente,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidadproveedor',
                idcombo: 'cbidentidadproductor',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stCbEntidadesProd,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idprograma',
                idcombo: 'cbiddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stPrograma,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'iddestino',
                idcombo: 'cbiddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stDestino,
                autoload: false,
                mode: 'local'
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
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbidusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'

            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });
    cmPlanGestionA = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            width: 200,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTipDenom
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            width: 40,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbEntidadUIM,
            tooltip: perfil.etiquetas.lbEntidadUIM,
            width: 150,
            dataIndex: 'identidadproveedor',
            renderer: renderEntidadesProd
        }, {
            header: perfil.etiquetas.lbCliente,
            tooltip: perfil.etiquetas.lbCliente,
            width: 120,
            dataIndex: 'identidadcliente',
            renderer: renderEntidadesCliente
        }, {
            header: perfil.etiquetas.lbPrograma,
            id: 'programa',
            tooltip: perfil.etiquetas.lbPrograma,
            hidden: false,
            width: 120,
            dataIndex: 'idprograma',
            renderer: renderProgramas
//            ,
//            editor: new Ext.form.ComboBox({
//                id: 'cbPrograma',
//                store: stPrograma,
//                valueField: 'iddatosnomenclador',
//                hiddenName: 'iddatosnomenclador',
//                displayField: 'denominacion',
//                mode: 'local',
//                allowBlank: false,
//                typeAhead: true,
//                editable: true,
//                triggerAction: 'all',
//                emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
//                loadingText: perfil.etiquetas.lbCargando,
//                width: 140})
        }, {
            header: perfil.etiquetas.lbDestino,
            id: 'destino',
            hidden: false,
            tooltip: perfil.etiquetas.lbDestino,
            width: 120,
            dataIndex: 'iddestino',
            renderer: renderDestinos
//            ,
//            editor: new Ext.form.ComboBox({
//                id: 'cbDestino',
//                store: stDestino,
//                valueField: 'iddatosnomenclador',
//                hiddenName: 'iddatosnomenclador',
//                displayField: 'denominacion',
//                mode: 'local',
//                allowBlank: false,
//                typeAhead: true,
//                editable: true,
//                triggerAction: 'all',
//                emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
//                loadingText: perfil.etiquetas.lbCargando,
//                width: 140})
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            width: 90,
            dataIndex: 'cantidadconfirmada',
            renderer: crearToolTip,
            align: 'right'

        }, {
            header: perfil.etiquetas.lbTotalDesagregado,
            tooltip: perfil.etiquetas.lbTotalDesagregado,
            width: 120,
            dataIndex: 'totaldesagregado',
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
            header: perfil.etiquetas.lbImporteTotal,
            tooltip: perfil.etiquetas.lbImporteTotal,
            width: 100,
            dataIndex: 'importetotal',
            renderer: crearToolTip,
            align: 'right'

        }, {
            header: perfil.etiquetas.lbImporteTotalDivisa,
            tooltip: perfil.etiquetas.lbImporteTotalDivisa,
            width: 120,
            dataIndex: 'importetotaldivisa',
            renderer: crearToolTip,
            align: 'right'

        }, {
            header: perfil.etiquetas.lbNivelAprobacion,
            tooltip: perfil.etiquetas.lbNivelAprobacion,
            width: 110,
            dataIndex: 'idaprobacion',
            renderer: renderAprobacion
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 100,
            dataIndex: 'idusuario',
            hidden: true,
            renderer: renderUsuarios

        }, {
            header: perfil.etiquetas.lbUltimaActualizacion,
            tooltip: perfil.etiquetas.lbUltimaActualizacion,
            width: 130,
            dataIndex: 'fecha',
            hidden: true,
            renderer: crearToolTip,
            align: 'center'
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 50,
            dataIndex: 'enero',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbFebrero,
            tooltip: perfil.etiquetas.lbFebrero,
            width: 50,
            dataIndex: 'febrero',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbMarzo,
            tooltip: perfil.etiquetas.lbMarzo,
            width: 50,
            dataIndex: 'marzo',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbAbril,
            tooltip: perfil.etiquetas.lbAbril,
            width: 50,
            dataIndex: 'abril',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbMayo,
            tooltip: perfil.etiquetas.lbMayo,
            width: 50,
            dataIndex: 'mayo',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbJunio,
            tooltip: perfil.etiquetas.lbJunio,
            width: 50,
            dataIndex: 'junio',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbJulio,
            tooltip: perfil.etiquetas.lbJulio,
            width: 50,
            dataIndex: 'julio',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbAgosto,
            tooltip: perfil.etiquetas.lbAgosto,
            width: 50,
            dataIndex: 'agosto',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbSeptiembre,
            tooltip: perfil.etiquetas.lbSeptiembre,
            width: 60,
            dataIndex: 'septiembre',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbOctubre,
            tooltip: perfil.etiquetas.lbOctubre,
            width: 60,
            dataIndex: 'octubre',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbNoviembre,
            tooltip: perfil.etiquetas.lbNoviembre,
            width: 60,
            dataIndex: 'noviembre',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbDiciembre,
            tooltip: perfil.etiquetas.lbDiciembre,
            width: 60,
            dataIndex: 'diciembre',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }]);
    smPlanGestionA = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, index, record) {
                //btnEliminar.enable();
                rowDeselect = false;
                controlarObjetosA();
                controlarPanelDesagB();
                //controlarPanelDesagB();


            },
            rowdeselect: function (sm, index, record) {
                rowDeselect = true;
                controlarObjetosA();
                controlarPanelDesagB();

                //controlarObjetosB();

            }
        }
    });

    btnLimpiarPlanGestionA = new Ext.Button({
        id: 'btnLimpiarPlanGestionA',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosPlanGestionA.clearFilters();
        }
    });
    /*btnExportar = new Ext.Button({
     id: 'btnExportar',
     disabled: true,
     iconCls: 'exportar',
     tooltip: perfil.etiquetas.lbExportar,
     handler: function () {
     window.open('exportarPlan?identidad=' + nodoEst.attributes.id +
     '&denoentidad=' + nodoEst.attributes.text +
     '&idejercicio=' + cbEjercicio.getValue() +
     '&denoejercicio=' + cbEjercicio.getRawValue() +
     '&tipo=' + cbComportamiento.getValue() +
     '&denotipo=' + cbComportamiento.getRawValue() +
     '&filtros=' + Ext.encode(filtrosPlanGestion.getFilterData()));
     }
     });*/
    btnExportarA = new Ext.Toolbar.MenuButton({
        id: 'btnExportarA',
        //disabled: true,
        tooltip: perfil.etiquetas.lbExportar,
        iconCls: 'exportar',
        menu: {
            items: [{
                    disabled: false,
                    id: 'btnExportarDatosA',
                    iconCls: 'exportar',
                    //text: perfil.etiquetas.lbExportarDatos,renderTo:this,
                    text: perfil.etiquetas.lbExportarPlan,
                    handler: function () {
                        window.open('exportarPlan?identidad=' + nodoEst.attributes.id +
                                '&denoentidad=' + nodoEst.attributes.text +
                                '&denoejercicio=' + cbEjercicio.getRawValue() +
                                '&idejercicio=' + cbEjercicio.getValue() +
                                '&tipo=' + cbComportamiento.getValue() +
                                '&denotipo=' + cbComportamiento.getRawValue() +
                                '&filtros=' + Ext.encode(filtrosPlanGestionA.getFilterData()));
                    }
                }]
        }
    });

    btnAprobarProveedorA = new Ext.Button({
        id: 'btnAprobarProveedorA',
        iconCls: 'aprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarProveedor,
        listeners: {
            click: function (st) {
                cambiarAprobacion("proveedor", 1, 2);
            }
        }
    });
    btnDesaprobarProveedorA = new Ext.Button({
        id: 'btnDesaprobarProveedorA',
        iconCls: 'desaprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarProveedor,
        listeners: {
            click: function (st) {
                cambiarAprobacion("proveedor", 0, 1);
            }
        }
    });
    btnAprobarRectorA = new Ext.Button({
        id: 'btnAprobarRectorA',
        iconCls: 'aprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarRector,
        listeners: {
            click: function (st) {
                cambiarAprobacion("rector", 1, 4);
            }
        }
    });
    btnDesaprobarRectorA = new Ext.Button({
        id: 'btnDesaprobarRectorA',
        iconCls: 'desaprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarRector,
        listeners: {
            click: function (st) {
                cambiarAprobacion("rector", 0, 2);
            }
        }
    });
    tfimportetotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotal',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportes = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbImporteMLC]
        ]
    });
    cbImportes = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportes,
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
                if (importes[cbImportes.getValue()] != undefined) {
                    var importe = separadorDeMiles(importes[cbImportes.getValue()]);
                    tfimportetotal.setValue(importe);
                } else {
                    tfimportetotal.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    gpPlanGestionA = new Ext.grid.GridPanel({
        store: stPlanGestionA,
        title: perfil.etiquetas.TtlePlanGestionA,
        //width: 3000,
        height: 500,
        region: 'north',
        autoScroll: true,
        id: 'gpPlanGestionA',
        sm: smPlanGestionA,
        cm: cmPlanGestionA,
        tbar: [btnAprobarRectorA, btnDesaprobarRectorA, btnAprobarProveedorA, btnDesaprobarProveedorA, '-', btnExportarA],
        plugins: filtrosPlanGestionA,
        //margins: '2 2 2 -4',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stPlanGestionA,
            displayInfo: true,
            items: ['-', btnLimpiarPlanGestionA, '-', cbImportes, tfimportetotal],
            listeners: {
                beforechange: function (p, e) {
                    offsetPlanGestionA = e.start;
                }
            }
        })

    });

//    btnGuardar = new Ext.Button({
//        id: 'btnGuardar',
//        disabled: true,
//        iconCls: 'guardar',
//        tooltip: perfil.etiquetas.lbGuardar,
//        handler: function() {
//            guardarPlan();
//        }
//    });

    pPlanGestionA = new Ext.Panel({
        id: 'pPlanGestionA',
        layout: 'fit',
        region: 'center',
        items: [gpPlanGestionA]

    });

    function controlarPanelDesagB() {

        selec = gpPlanGestionA.getSelectionModel().getSelected();

        if (selec != undefined && comportEntidadLogEjecutor != true) {

            //entidadSeleccDesag = smPlanGestionA.getSelected().data.identidad;
            demandaSelecc = smPlanGestionA.getSelected().data.iddemanda;
            stDesagPlanGestionB.baseParams.iddemanda = demandaSelecc;

            stDesagPlanGestionB.reload();
            gpDesagPlanGestionB.enable();
        } else {
            gpDesagPlanGestionB.disable();
            if (stDesagPlanGestionB.reader != undefined) {

                stDesagPlanGestionB.loadData({"data": [], "total": 0});
            }


        }




    }
    function controlarObjetosA() {
        btnAprobarRectorA.disable();
        btnAprobarProveedorA.disable();
        btnDesaprobarRectorA.disable();
        btnDesaprobarProveedorA.disable();
        selec = gpPlanGestionA.getSelectionModel().getSelected();

        if (selec != undefined) {
            //modified = gpPlanGestionA.getStore().getModifiedRecords();
            if (comportEntidadLogRector == true) {

                if (selec.data.idaprobacion == 2) {
                    btnAprobarRectorA.enable();
                } else if (selec.data.idaprobacion == 4) {
                    btnDesaprobarRectorA.enable();
                }


            } else if (comportEntidadLogProveedor == true) {

                if (selec.data.idaprobacion == 1 && selec.data.totaldesagregado != 0 && selec.data.diferencia == 0) {

                    btnAprobarProveedorA.enable();
                } else if (smPlanGestionA.getSelected().data.idaprobacion == 2) {

                    btnDesaprobarProveedorA.enable();
                }


            }
        }
        if (gpPlanGestionA.getStore().getTotalCount() > 0) {
            btnExportarA.enable();
        }
//    if (modified.length > 0) {
//        btnGuardar.enable();
//    }

    }
    function cambiarAprobacion(rol, accion, valor) {
        var seleccionados = gpPlanGestionA.getSelectionModel().getSelections();

        var valorAComprobar = 0;
        if (accion == 1) {
            //aprobando...
            if (rol == 'proveedor')
                valorAComprobar = 1;

            else if (rol == 'rector')
                valorAComprobar = 2;
        } else {
            //desaprobando...
            if (rol == 'proveedor')
                valorAComprobar = 2;

            else if (rol == 'rector')
                valorAComprobar = 4;
        }

        var plandemandas = [];
        for (var i = 0; i < seleccionados.length; i++) {
            if (seleccionados[i].data.idaprobacion == valorAComprobar) {
                if (seleccionados[i].data.totaldesagregado == seleccionados[i].data.cantidadconfirmada || accion == 0) {
                    //si estoy desaprobando... o la cantidad final es mayor que 0 (porque se está aprobando)
                    plandemandas.push({
                        iddemanda: seleccionados[i].data.iddemanda,
                        cantidadconfirmada: seleccionados[i].data.cantidadconfirmada
                    });
                }
            }
        }

        if (plandemandas.length > 0) {
            if (accion == 1) {
                //aprobando...
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarAprobarPlan, aprobarDesaprobarPlan);
            } else {
                //desaprobando...
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarDesaprobarPlan, aprobarDesaprobarPlan);
            }
        } else {
            mostrarMensaje(1, perfil.etiquetas.lbMsgErrorNoPlans);
            btnAprobarRectorA.disable();
            btnAprobarProveedorA.disable();

            btnDesaprobarProveedorA.disable();

            btnDesaprobarRectorA.disable();
            stPlanGestionA.reload();
        }

        function aprobarDesaprobarPlan(btnPresionado) {

            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'aprobarDesaprobarPlan',
                    params: {
                        demandas: Ext.encode(plandemandas),
                        accion: accion,
                        idaprobacion: valor,
                        rol: rol,
                        valorAComprobar: valorAComprobar
                    },
                    callback: function (options, success, response) {

                        responseData = Ext.decode(response.responseText);
                        if (accion == 1) {
                            if (responseData.codMsgN == 1) {
                                if (plandemandas.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionAprobarPlan);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionAprobarPlans);
                                }
                            } else if (responseData.codMsgN == 0) {
                                if (plandemandas.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarPlan);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarPlans);
                                }
                            } else if (responseData.codMsgN == 2) {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarAlgunasPlan);
                            }
                        } else {
                            if (responseData.codMsgN == 1) {
                                if (plandemandas.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionDesaprobarPlan);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionDesaprobarPlans);
                                }
                            } else if (responseData.codMsgN == 0) {
                                if (plandemandas.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarPlan);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarPlans);
                                }
                            } else if (responseData.codMsgN == 2) {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarAlgunasPlan);
                            }
                        }

                        index = stPlanGestionA.indexOf(smPlanGestionA.getSelected());
                        stPlanGestionA.reload({
                            callback: function (options, success, response) {
                                smPlanGestionA.selectRow(index);
                            }
                        });

                    }
                });
            }
        }
    }
    function separadorDeMiles(nStr) {
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
    function setearImporte() {
        importes = [];
        importes.push('0.000'); //indice 0
        importes.push('0.000'); //indice 1 MN
        importes.push('0.000'); //indice 2 MLC   
    }
    function calcularImporteTotal() {
        setearImporte();
        if (stPlanGestionA.getCount() > 0) {
            importes[1] = stPlanGestionA.getAt(0).data.importetotalmn;
            importes[2] = stPlanGestionA.getAt(0).data.importetotalcuc;

            var importe = separadorDeMiles(importes[cbImportes.getValue()]);
            tfimportetotal.setValue(importe);
        } else {
            var importe = separadorDeMiles(importes[cbImportes.getValue()]);
            tfimportetotal.setValue(importe);
        }
    }
    function renderEntidadesProd(value, m) {
        for (var i = 0; i < stCbEntidadesProd.getTotalCount(); i++) {
            if (stCbEntidadesProd.data.items[i].data.identidad == value) {
                m.attr = 'ext:qtip="' + stCbEntidadesProd.data.items[i].data.denominacion + '"';
                return stCbEntidadesProd.data.items[i].data.denominacion;
            }
        }
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    }
    function upColorCellPlan() {
        for (var i = 0; i < stPlanGestionA.getCount(); i++) {
            for (var j = 0; j < cmPlanGestionA.getColumnCount(); j++) {
                //aprobado rector (azul)
                if (stPlanGestionA.getAt(i).data.idaprobacion == 4) {
                    Ext.get(Ext.getCmp('gpPlanGestionA').getView().getCell(i, j)).applyStyles('background-color:#b1d7fe');
                }
            }
        }
    }
}
