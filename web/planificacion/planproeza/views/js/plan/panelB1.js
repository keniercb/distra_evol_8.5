function cargarPanelB1() {
    // Este es el grid de desagregacion de plan por talleres    
    var importesB1 = [];
    stDesagPlanGestionB1 = new Ext.data.Store({
        id: 'stDesagPlanGestionB1',
        url: 'listarPlanProduccion',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                stDesagPlanGestionB1.baseParams.start = offsetDesagPlanGestionB1;
                stDesagPlanGestionB1.baseParams.identidad = entidadSelecc;
                stDesagPlanGestionB1.baseParams.idejercicio = cbEjercicio.getValue();
                stDesagPlanGestionB1.baseParams.tipo = 1;
            },
            load: function () {
                cambiarTituloFiltrar(gpDesagPlanGestionB1, filtrosDesagPlanGestionB1, 'Listado de desagregaciones');
                gpDesagPlanGestionB1.enable();
                if (stDesagPlanGestionB1.getCount() == 0) {
                    setearImporteB1();
                    if (filtrosDesagPlanGestionB1.getFiltrosActivos() == undefined || filtrosDesagPlanGestionB1.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    calcularImporteTotalB1();
                    if (importesB1[cbImportesB1.getValue()] != undefined) {
                        var importeB1 = separadorDeMilesB1(importesB1[cbImportesB1.getValue()]);
                        tfimportetotalB1.setValue(importeB1);
                    } else {
                        tfimportetotalB1.setValue('0.000');
                    }
                }
                if (tabPanelPlan.disabled != true) {

                    controlarObjetosB1();
                }


            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemandatiempo'
        }, [{
                name: 'iddemandatiempo'
            }, {
                name: 'iddemanda'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'iddemandatiempo'
            }, {
                name: 'idusuario'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'identidad'
            }, {
                name: 'identidadproveedor'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'iddestino'
            }, {
                name: 'idprograma'
            }, {
                name: 'cantidaddesglosada'
            }, {
                name: 'preciodesglosadodivisa'
            }, {
                name: 'preciodesglosado'
            }, {
                name: 'totaldesagregado'
            }, {
                name: 'importetotaldivisa'
            }, {
                name: 'diferencia'
            }, {
                name: 'importetotal'
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
                name: 'fecha'
            }, {
                name: 'importetotalmn'
            }
            , {
                name: 'importetotalcuc'
            }
        ])
    });
    filtrosDesagPlanGestionB1 = new Ext.grid.GridFilters({
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
                dataIndex: 'cantidaddesglosada'
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
    cmDesagPlanGestionB1 = new Ext.grid.ColumnModel([{
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
            renderer: renderEntidadesProd
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
//            ,
//            editor: new Ext.form.ComboBox({
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
            hidden: false,
            tooltip: perfil.etiquetas.lbDestino,
            width: 120,
            dataIndex: 'iddestino',
            renderer: renderDestinos
//            ,
//            editor: new Ext.form.ComboBox({
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
            header: perfil.etiquetas.lbCantidadDesglosada,
            tooltip: perfil.etiquetas.lbCantidadDesglosada,
            width: 130,
            dataIndex: 'cantidaddesglosada',
            renderer: crearToolTip,
            align: 'right', editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })


        }, {
            header: perfil.etiquetas.lbTotalDesagregado,
            tooltip: perfil.etiquetas.lbTotalDesagregado,
            width: 130,
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
            header: perfil.etiquetas.lbPrecioDesglosado,
            tooltip: perfil.etiquetas.lbPrecioDesglosado,
            width: 120,
            dataIndex: 'preciodesglosado',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 2,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbPrecioDesglosadoDivisa,
            tooltip: perfil.etiquetas.lbPrecioDesglosadoDivisa,
            width: 150,
            dataIndex: 'preciodesglosadodivisa',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 2,
                allowBlank: false
            })

        }, {
            header: perfil.etiquetas.lbImporteTotal,
            tooltip: perfil.etiquetas.lbImporteTotal,
            width: 120,
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
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
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
            width: 80,
            dataIndex: 'diciembre',
            renderer: crearToolTip,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 0,
                allowBlank: false
            })

        }]);
    smDesagPlanGestionB1 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, index, record) {
                controlarObjetosB1();

            },
            rowdeselect: function (sm, index, record) {
                controlarObjetosB1();
            }
        }
    });

    btnLimpiarDesagPlanGestionB1 = new Ext.Button({
        id: 'btnLimpiarDesagPlanGestionB1',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosDesagPlanGestionB1.clearFilters();
        }
    });
    tfimportetotalB1 = new Ext.form.TextField({
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
    stCbImportesB1 = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbImporteMLC]
        ]
    });
    cbImportesB1 = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportesB1,
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
                if (importesB1[cbImportesB1.getValue()] != undefined) {
                    var importeB1 = separadorDeMilesB1(importesB1[cbImportesB1.getValue()]);
                    tfimportetotalB1.setValue(importeB1);
                } else {
                    tfimportetotalB1.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnDesagExportarB1 = new Ext.Button({
        id: 'btnDesagExportarB1',
        disabled: false,
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        handler: function () {
            exportarDesagregacion();
        }
    });


    btnDesagGuardarB1 = new Ext.Button({
        id: 'btnDesagGuardarB1',
        hidden: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarDesagPlanB1();
        }
    });
    gpDesagPlanGestionB1 = new Ext.grid.EditorGridPanel({
        title: 'Listado de desagregaciones',
        store: stDesagPlanGestionB1,
        autoScroll: true,
        disabled: false,
        id: 'gpDesagPlanGestionB1',
        sm: smDesagPlanGestionB1,
        cm: cmDesagPlanGestionB1,
        plugins: filtrosDesagPlanGestionB1,
        tbar: [btnDesagGuardarB1, '-', btnDesagExportarB1],
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        clicksToEdit: 2,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stDesagPlanGestionB1,
            displayInfo: true,
            items: ['-', btnLimpiarDesagPlanGestionB1, '-', cbImportesB1, tfimportetotalB1],
            listeners: {
                beforechange: function (p, e) {
                    offsetDesagPlanGestionB1 = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (e) {
                controlarObjetosB1();
            },
            beforeedit: function (e) {
                //
                if (btnDesagGuardarB1.hidden) {
                    e.cancel = true;
                } else {
                    controlarEventosB1('beforeedit', e);
                }
                controlarObjetosB1();
            }
        }
    });

    pDesagPlanGestionB1 = new Ext.Panel({
        id: 'pDesagPlanGestionB1',
        layout: 'fit',
        //title: 'Listado de desagregaciones',
        region: 'center',
        items: [gpDesagPlanGestionB1]

    });
    function controlarObjetosB1() {

        btnDesagGuardarB1.disable();

        btnDesagExportarB1.disable();

        //btnAprobarRector.disable();
        //btnAprobarProveedor.disable();
        //btnDesaprobarProveedor.disable();
        //btnAprobarTaller.disable();


        selec = gpDesagPlanGestionB1.getSelectionModel().getSelections();
        modified = gpDesagPlanGestionB1.getStore().getModifiedRecords();
        if (comportEntidadLogProveedor == true) {
            //btnAprobarProveedor.hide();
            //btnDesaprobarProveedor.hide();
            //btnAprobarTaller.show();
        }
        if (comportEntidadLogProveedor == true) {
            // btnAprobarTaller.hide();
            //btnAprobarProveedor.show();
            //btnDesaprobarProveedor.show();
        }

        if (selec.length > 0) {


            if (selec.length == 1) {

                if (smDesagPlanGestionB1.getSelected().data.idaprobacion == 2 && comportEntidadLogEjecutor == true) {

                    // btnAprobarTaller.enable();
                } else if (smDesagPlanGestionB1.getSelected().data.idaprobacion == 2 && comportEntidadLogProveedor == true) {

                    //btnDesaprobarProveedor.enable();
                } else if (smDesagPlanGestionB1.getSelected().data.idaprobacion == 3 && comportEntidadLogRector == true) {

                    //btnAprobarRector.enable();
                }

            } else {

                // btnAprobarTaller.enable();
                //btnAprobarProveedor.enable();
                //btnDesaprobarProveedor.enable();
                //btnAprobarRector.enable();
            }


        }
        if (gpDesagPlanGestionB1.getStore().getTotalCount() > 0) {
            btnDesagExportarB1.enable();
        }
        if (modified.length > 0) {
            btnDesagGuardarB1.enable();
        }

    }
    function guardarDesagPlanB1() {
        mymask.show();
        recordsMod = gpDesagPlanGestionB1.getStore().getModifiedRecords();

        var arreglo = [];
        flag = false;
        while (recordsMod.length > 0) {

            var record = recordsMod.pop();
            var rec = record.getChanges();


            totaldesagregadoTemp = parseInt(record.data['enero']) + parseInt(record.data['febrero']) + parseInt(record.data['marzo'])
                    + parseInt(record.data['abril']) + parseInt(record.data['mayo']) + parseInt(record.data['junio'])
                    + parseInt(record.data['julio']) + parseInt(record.data['agosto']) + parseInt(record.data['septiembre'])
                    + parseInt(record.data['octubre']) + parseInt(record.data['noviembre']) + parseInt(record.data['diciembre']);


            rec['iddemandatiempo'] = record.data['iddemandatiempo'];
            rec['totaldesagregado'] = totaldesagregadoTemp;
            rec['iddemanda'] = record.data['iddemanda'];
            arreglo.push(rec);

            //mymask.show();
        }

        Ext.Ajax.request({
            url: 'guardarPlanProduccionTalleres',
            //timeout: 3600000,
            waitMsg: perfil.etiquetas.lbGuardando,
            params: {
                demandatiempo: Ext.encode(arreglo)

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    if (recordsMod.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagOK);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagsOK);
                    }
                } else if (responseData.codMsg == 0) {
                    if (recordsMod.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagNO);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagsNO);
                    }
                } else if (responseData.codMsg == 2) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagNOAlgunas);
                }
                stDesagPlanGestionB1.reload();
            }
        });

    }
    function controlarEventosB1(name, event) {
        //selec = gpPlanGestion.getSelectionModel().getSelections();
        selecDesag = gpDesagPlanGestionB1.getSelectionModel().getSelected();
        if (name == 'beforeedit') {
            if (selecDesag != undefined) {
                if (selecDesag.data.idaprobacion != 1) {
                    event.cancel = true;
                } else if (event.field == 'cantidaddesglosada' || event.field == 'preciodesglosado' || event.field == 'preciodesglosadodivisa') {
                    event.cancel = true;
                } else if (parseInt(selecDesag.data.cantidaddesglosada) == 0 ||
                        (parseFloat(selecDesag.data.preciodesglosado) == 0 && parseInt(selecDesag.data.preciodesglosadodivisa) == 0))
                {
                    event.cancel = true;
                }

            }
        }
    }
    function exportarDesagregacion() {

        window.open('exportarPlan?identidad=' + nodoEst.attributes.id +
                '&denoentidad=' + nodoEst.attributes.text +
                '&denoejercicio=' + cbEjercicio.getRawValue() +
                '&idejercicio=' + cbEjercicio.getValue() +
                '&tipo=' + cbComportamiento.getValue() +
                '&denotipo=' + cbComportamiento.getRawValue() +
                '&filtros=' + Ext.encode(filtrosPlanGestionA.getFilterData()));
    }
//    function controlarPanelDesagB1() {
//        selec = gpPlanGestion.getSelectionModel().getSelections();

//        if (selec.length == 1) {
//            entidadSeleccDesag = smPlanGestion.getSelected().data.identidad;
//            demandaSelecc = smPlanGestion.getSelected().data.iddemanda;
//            stDesagPlanGestionB1.baseParams.identidad = entidadSeleccDesag;
//            stDesagPlanGestionB1.baseParams.iddemanda = demandaSelecc;
//            stDesagPlanGestionB1.reload();
//            pDesagPlanGestionB1.enable();
//        } else {
//            pDesagPlanGestionB1.disable();
//        }
//
//
//    }
    function separadorDeMilesB1(nStr) {
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
    function setearImporteB1() {
        importesB1 = [];
        importesB1.push('0.000'); //indice 0
        importesB1.push('0.000'); //indice 1 MN
        importesB1.push('0.000'); //indice 2 MLC   
    }
    function calcularImporteTotalB1() {
        setearImporteB1();
        if (stDesagPlanGestionB1.getCount() > 0) {
            importesB1[1] = stDesagPlanGestionB1.getAt(0).data.importetotalmn;
            importesB1[2] = stDesagPlanGestionB1.getAt(0).data.importetotalcuc;

            var importeB1 = separadorDeMilesB1(importesB1[cbImportesB1.getValue()]);
            tfimportetotal.setValue(importeB1);
        } else {
            var importeB1 = separadorDeMilesB1(importesB1[cbImportesB1.getValue()]);
            tfimportetotalB1.setValue(importeB1);
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

}
