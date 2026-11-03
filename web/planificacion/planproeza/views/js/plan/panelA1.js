function cargarPanelA1() {
    //comportamiento rector
    var importesA1 = [];
    stPlanGestionA1 = new Ext.data.Store({
        id: 'stPlanGestionA1',
        url: 'listarPlanProduccion',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                mymask.show();

                stPlanGestionA1.baseParams.start = offsetPlanGestionA1;
                stPlanGestionA1.baseParams.idejercicio = cbEjercicio.getValue();
                stPlanGestionA1.baseParams.tipo = 3;
            },
            load: function () {
                cambiarTituloFiltrar(gpPlanGestionA1, filtrosPlanGestionA1, perfil.etiquetas.TtlePlanGestionA);

                gpPlanGestionA1.enable();
                if (stPlanGestionA1.getCount() == 0) {
                    setearImporteA1();
                    if (filtrosPlanGestionA1.getFiltrosActivos() == undefined || filtrosPlanGestionA1.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    upColorCellPlanRector();
                    calcularImporteTotalA1();
                    if (importesA1[cbImportesA1.getValue()] != undefined) {
                        var importeA1 = separadorDeMilesA1(importesA1[cbImportesA1.getValue()]);
                        tfimportetotalA1.setValue(importeA1);
                    } else {
                        tfimportetotalA1.setValue('0.000');
                    }
                }
                controlarObjetosA1();

                mymask.hide();
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
                name: 'identidadproveedor'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidad'
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
                name: 'importetotaldivisa'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }
            , {
                name: 'importetotalmn'
            }
            , {
                name: 'importetotalcuc'
            }
        ])
    });
    filtrosPlanGestionA1 = new Ext.grid.GridFilters({
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
                dataIndex: 'identidadcliente',
                idcombo: 'cbidentidad',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesCliente,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, perfil.etiquetas.lbNo], [2, perfil.etiquetas.lbAprobadoEmpresa], [4, perfil.etiquetas.lbAprobadoRector]]
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
                type: 'numeric',
                dataIndex: 'cantidadconfirmada'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosado'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosadodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'totaldesagregado'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
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
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });
    cmPlanGestionA1 = new Ext.grid.ColumnModel([{
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
            width: 50,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbEntidadUIM,
            tooltip: perfil.etiquetas.lbEntidadUIM,
            width: 150,
            dataIndex: 'identidadproveedor',
            renderer: renderEntidadesProdRector
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
            width: 100,
            dataIndex: 'cantidadconfirmada',
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
            renderer: crearToolTip
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
    smPlanGestionA1 = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, index, record) {
                //btnEliminar.enable();
                controlarObjetosA1();
                //controlarPanelDesagB();

                //controlarPanelDesagB();


            },
            rowdeselect: function (sm, index, record) {
//                if (sm.getCount() == 0) {
//                    btnEliminar.disable();
//
//                }
                //controlarPanelDesagB();
                controlarObjetosA1();
                //controlarObjetosB();

            }
        }
    });

    btnLimpiarPlanGestionA1 = new Ext.Button({
        id: 'btnLimpiarPlanGestionA1',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosPlanGestionA1.clearFilters();
        }
    });
    tfimportetotalA1 = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalA1',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportesA1 = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbImporteMLC]
        ]
    });
    cbImportesA1 = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportesA1,
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
                if (importesA1[cbImportesA1.getValue()] != undefined) {
                    var importeA1 = separadorDeMilesA1(importesA1[cbImportesA1.getValue()]);
                    tfimportetotalA1.setValue(importeA1);
                } else {
                    tfimportetotalA1.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
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
     '&filtros=' + Ext.encode(filtrosPlanGestionA1.getFilterData()));
     }
     });*/
    btnExportarA1 = new Ext.Toolbar.MenuButton({
        id: 'btnExportarA1',
        //disabled: true,
        tooltip: perfil.etiquetas.lbExportar,
        iconCls: 'exportar',
        menu: {
            items: [{
                    disabled: false,
                    id: 'btnExportarDatosA1',
                    iconCls: 'exportar',
                    //text: perfil.etiquetas.lbExportarDatos,
                    text: perfil.etiquetas.lbExportarPlan,
                    handler: function () {
                        window.open('exportarPlan?identidad=' + nodoEst.attributes.id +
                                '&denoentidad=' + nodoEst.attributes.text +
                                '&denoejercicio=' + cbEjercicio.getRawValue() +
                                '&idejercicio=' + cbEjercicio.getValue() +
                                '&tipo=' + cbComportamiento.getValue() +
                                '&denotipo=' + cbComportamiento.getRawValue() +
                                '&filtros=' + Ext.encode(filtrosPlanGestionA1.getFilterData()));
                    }
                }]
        }
    });
    btnAprobarProveedorA1 = new Ext.Button({
        id: 'btnAprobarProveedorA1',
        iconCls: 'aprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarProveedor,
        listeners: {
            click: function (st) {
                cambiarAprobacion("proveedor", 1, 2);
            }
        }
    });
    btnDesaprobarProveedorA1 = new Ext.Button({
        id: 'btnDesaprobarProveedorA1',
        iconCls: 'desaprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarProveedor,
        listeners: {
            click: function (st) {
                cambiarAprobacion("proveedor", 0, 1);
            }
        }
    });
    btnAprobarRectorA1 = new Ext.Button({
        id: 'btnAprobarRectorA1',
        iconCls: 'aprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarRector,
        listeners: {
            click: function (st) {
                cambiarAprobacion("rector", 1, 4);
            }
        }
    });
    btnDesaprobarRectorA1 = new Ext.Button({
        id: 'btnDesaprobarRectorA1',
        iconCls: 'desaprobar',
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarRector,
        listeners: {
            click: function (st) {
                cambiarAprobacion("rector", 0, 2);
            }
        }
    });

    gpPlanGestionA1 = new Ext.grid.GridPanel({
        store: stPlanGestionA1,
        // title: perfil.etiquetas.TtlePlanGestionA,
        title: 'Listado de demandas',
        //width: 3000,
        height: 500,
        region: 'north',
        autoScroll: true,
        id: 'gpPlanGestionA1',
        sm: smPlanGestionA1,
        cm: cmPlanGestionA1,
        plugins: filtrosPlanGestionA1,
        //margins: '2 2 2 -4',
        // loadMask: {
        //     msg: perfil.etiquetas.lbCargando
        // },
        tbar: [btnAprobarRectorA1, btnDesaprobarRectorA1, btnAprobarProveedorA1, btnDesaprobarProveedorA1, '-', btnExportarA1],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stPlanGestionA1,
            displayInfo: true,
            items: ['-', btnLimpiarPlanGestionA1, '-', cbImportesA1, tfimportetotalA1],
            listeners: {
                beforechange: function (p, e) {
                    offsetPlanGestionA1 = e.start;
                }
            }
        })

    });


    pPlanGestionA1 = new Ext.Panel({
        id: 'pPlanGestionA1',
        //title: 'Listado de demandas',
        layout: 'fit',
        region: 'center',
        items: [gpPlanGestionA1]

    });

    function controlarPanelDesagA1() {
        selec = gpPlanGestionA1.getSelectionModel().getSelections();

        if (selec.length == 1) {

            //entidadSeleccDesag = smPlanGestionA1.getSelected().data.identidad;
            demandaSelecc = smPlanGestionA1.getSelected().data.iddemanda;
            stDesagPlanGestionA1.baseParams.iddemanda = demandaSelecc;

            stDesagPlanGestionA1.reload();
            pDesagPlanGestionA1.enable();
        } else {
            if (stDesagPlanGestionA1.reader != undefined) {

                //stDesagPlanGestionA1.removeAll();
            }

            pDesagPlanGestionA1.disable();
        }




    }
    function controlarObjetosA1() {

        btnAprobarRectorA1.disable();
        btnDesaprobarRectorA1.disable();
        btnDesaprobarProveedorA1.disable();
        btnAprobarProveedorA1.disable();
        //btnGuardar.disable();
        //btnDesagGuardar.disable();
        //btnExportar.disable();
        //btnDesagExportar.disable();
        // btnAprobarTaller.disable();

        selec = gpPlanGestionA1.getSelectionModel().getSelections();
        //modified = gpPlanGestionA1.getStore().getModifiedRecords();
//       if (comportEntidadLogRector == true) {
        if (selec.length > 0) {

            if (selec.length == 1) {

                if (smPlanGestionA1.getSelected().data.idaprobacion == 2) {
                    btnAprobarRectorA1.enable();
                } else if (smPlanGestionA1.getSelected().data.idaprobacion == 4) {

                    btnDesaprobarRectorA1.enable();
                }
            } else {

                for (var i = 0; i < selec.length; i++) { //abilitando btn aprobar y desaprobar rector en seleccion multiple

                    if (selec[i].data.idaprobacion == 2) {
                        btnAprobarRectorA1.enable();
                        //  alert("abilitando btn aprobar rector")
                    } else if (selec[i].data.idaprobacion == 4) {
                        // alert("abilitando btn desaprobar rector")
                        btnDesaprobarRectorA1.enable();
                    }


                }

            }


        }

        if (gpPlanGestionA1.getStore().getTotalCount() > 0) {
            btnExportarA1.enable();
        }
//    if (modified.length > 0) {
//        btnGuardar.enable();
//    }

    }
    function cambiarAprobacion(rol, accion, valor) {
        var seleccionados = gpPlanGestionA1.getSelectionModel().getSelections();

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
            btnAprobarRectorA1.disable();
            btnAprobarProveedorA1.disable();

            btnDesaprobarProveedorA1.disable();

            btnDesaprobarRectorA1.disable();
            stPlanGestionA1.reload();
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
                                    // alert("seleccione una sola demanda y muestro el sms")
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionAprobarPlans);
                                    // alert("seleccione varias demanda y muestro el sms")

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

                        stPlanGestionA1.reload();


                    }
                });
            }
        }
    }
    function separadorDeMilesA1(nStr) {
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
    function setearImporteA1() {
        importesA1 = [];
        importesA1.push('0.000'); //indice 0
        importesA1.push('0.000'); //indice 1 MN
        importesA1.push('0.000'); //indice 2 MLC   
    }
    function calcularImporteTotalA1() {
        setearImporteA1();
        if (stPlanGestionA1.getCount() > 0) {
            importesA1[1] = stPlanGestionA1.getAt(0).data.importetotalmn;
            importesA1[2] = stPlanGestionA1.getAt(0).data.importetotalcuc;

            var importeA1 = separadorDeMilesA1(importesA1[cbImportesA1.getValue()]);
            tfimportetotalA1.setValue(importeA1);
        } else {
            var importeA1 = separadorDeMilesA1(importesA1[cbImportesA1.getValue()]);
            tfimportetotalA1.setValue(importeA1);
        }
    }
    function renderEntidadesProdRector(value, m) {
        for (var i = 0; i < stCbEntidadesProd.getTotalCount(); i++) {
            if (stCbEntidadesProd.data.items[i].data.identidad == value) {
                m.attr = 'ext:qtip="' + stCbEntidadesProd.data.items[i].data.denominacion + '"';
                return stCbEntidadesProd.data.items[i].data.denominacion;
            }
        }
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    }
     function upColorCellPlanRector() {
        for (var i = 0; i < stPlanGestionA1.getCount(); i++) {
            for (var j = 0; j < cmPlanGestionA1.getColumnCount(); j++) {
                //aprobado rector (azul)
                if (stPlanGestionA1.getAt(i).data.idaprobacion == 4) {
                    Ext.get(Ext.getCmp('gpPlanGestionA1').getView().getCell(i, j)).applyStyles('background-color:#b1d7fe');
                }
            }
        }
    }
}
