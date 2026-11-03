function cargarPanelB() {
    // Este es el grid de desagregacion de plan por talleres (este es el de abajo)
    stDesagPlanGestionB = new Ext.data.Store({
        id: 'stDesagPlanGestionB',
        url: 'listarPlanProduccionDesagregado',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                //mymask.show();

                entidadSeleccDesag = smPlanGestionA.getSelected().data.identidad;
                stDesagPlanGestionB.baseParams.start = offsetDesagPlanGestionB;
                stDesagPlanGestionB.baseParams.idejercicio = cbEjercicio.getValue();
                stDesagPlanGestionB.baseParams.tipo = 2;
                stDesagPlanGestionB.baseParams.iddemanda = smPlanGestionA.getSelected().data.iddemanda;
                beforeloadDesagPlanGestionB = true;


            },
            load: function () {
                cambiarTituloFiltrar(gpDesagPlanGestionB, filtrosDesagPlanGestionB, perfil.etiquetas.TtleDesagPlanGestionB);
                //gpDesagPlanGestionB.enable();
                if (gpPlanGestionA.getSelectionModel().getSelected() != undefined || gpPlanGestionA.getSelectionModel().getSelected() != null) {
                    if (stDesagPlanGestionB.getTotalCount() == 0) {

                        if (filtrosDesagPlanGestionB.getFiltrosActivos() == undefined || filtrosDesagPlanGestionB.getFiltrosActivos().length == 0)
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        else
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                }
                smDesagPlanGestionB.clearSelections();

                // mymask.hide();
                controlarObjetosB();

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
                name: 'denominacion'
            }, {
                name: 'idusuario'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'identidad'
            }, {
                name: 'cantidaddesglosada'
            }, {
                name: 'totaldesagregado'
            }, {
                name: 'diferencia'
            }, {
                name: 'importetotal'
            }, {
                name: 'importetotaldivisa'
            }, {
                name: 'preciodesglosado'
            }, {
                name: 'preciodesglosadodivisa'
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
            }
        ])
    });
    filtrosDesagPlanGestionB = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'importetotal'
            }, {
                type: 'numeric',
                dataIndex: 'importetotaldivisa'
            }, {
                type: 'numeric',
                dataIndex: 'cantidaddesglosada'
            }, {
                type: 'numeric',
                dataIndex: 'totaldesagregado'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosado'
            }, {
                type: 'numeric',
                dataIndex: 'preciodesglosadodivisa'
            }, {
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'cbidentidad',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEjecutor,
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
    cmDesagPlanGestionB = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbEjecutor,
            tooltip: perfil.etiquetas.lbEjecutor,
            width: 130,
            dataIndex: 'identidad',
            renderer: renderEntidadesEjecutor

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
    smDesagPlanGestionB = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, index, record) {

                controlarObjetosB();
            },
            rowdeselect: function (sm, index, record) {
                controlarObjetosB();
            }
        }
    });

    btnLimpiarDesagPlanGestionB = new Ext.Button({
        id: 'btnLimpiarDesagPlanGestionB',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosDesagPlanGestionB.clearFilters();
        }
    });
    btnDesagExportarB = new Ext.Button({
        id: 'btnDesagExportarB',
        disabled: false,
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportarDesagregacion,
        handler: function () {
            exportarDesagregacion();
        }
    });
    btnDesagAdicionarB = new Ext.Button({
        id: 'btnDesagAdicionarB',
        hidden: true,
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionar,
        handler: function () {
            winAdicionarDesag.show();
        }
    });
    btnDesagEliminarB = new Ext.Button({
        id: 'btnDesagEliminarB',
        hidden: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        handler: function () {
            eliminarDesagB();
        }
    });
    btnDesagGuardarB = new Ext.Button({
        id: 'btnDesagGuardarB',
        hidden: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarDesagPlanB();
        }
    });
    gpDesagPlanGestionB = new Ext.grid.EditorGridPanel({
        store: stDesagPlanGestionB,
        title: perfil.etiquetas.TtleDesagPlanGestionB,
        autoScroll: true,
        disabled: true,
        id: 'gpDesagPlanGestionB',
        sm: smDesagPlanGestionB,
        cm: cmDesagPlanGestionB,
        plugins: filtrosDesagPlanGestionB,
        tbar: [btnDesagAdicionarB, btnDesagEliminarB, btnDesagGuardarB, '-', btnDesagExportarB],
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stDesagPlanGestionB,
            displayInfo: true,
            items: ['-', btnLimpiarDesagPlanGestionB],
            listeners: {
                beforechange: function (p, e) {
                    offsetDesagPlanGestionB = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (e) {
                controlarObjetosB();
            },
            beforeedit: function (e) {
                //
                if (btnDesagGuardarB.hidden) {
                    e.cancel = true;
                } else {
                    controlarEventosB('beforeedit', e);
                }
                controlarObjetosB();
            }
        }
    });


    pDesagPlanGestionB = new Ext.Panel({
        id: 'pDesagPlanGestionB',
        layout: 'fit',
        height: 300,
        region: 'south',
        split: true,
        collapsible: true,
        collapsed: true,
        title: ' ',
        items: [gpDesagPlanGestionB]

    });
    function eliminarDesagB() {
        recordsDel = gpDesagPlanGestionB.getSelectionModel().getSelections();
        if (recordsDel.length == 1) {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDesag, del);
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDesags, del);
        }

        function del(btnPresionado) {
            array_desagregacion = [];
            if (btnPresionado == 'ok') {
                for (var i = 0; i < recordsDel.length; i++) {
                    if (recordsDel[i].data.idaprobacion == 1) {
                        array_desagregacion.push({
                            iddemandatiempo: recordsDel[i].data.iddemandatiempo
                        });
                    }
                }
                if (array_desagregacion.length > 0) {

                    //mymask.show();
                    Ext.Ajax.request({
                        url: 'eliminarDesag',
                        params: {
                            iddemandatiempo: Ext.encode(array_desagregacion)
                        },
                        callback: function (options, success, response) {
                            //mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgN == 1) {
                                if (array_desagregacion.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagOK);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagsOK);
                                }
                            } else if (responseData.codMsgN == 0) {
                                if (array_desagregacion.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagNO);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagsNO);
                                }
                            } else if (responseData.codMsgN == 2) {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagNoAlgunas);
                            }
                            index = stPlanGestionA.indexOf(smPlanGestionA.getSelected());
                            stPlanGestionA.reload({
                                callback: function (options, success, response) {
                                    smPlanGestionA.selectRow(index);
                                }
                            });
                        }
                    });
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagInvalidasTodas);
                }
            }
        }
    }
    function adicionarDesagB(apl) {

        recordsAdd = gpAdicionarDesag.getSelectionModel().getSelections();
        seleccDemanda = gpPlanGestionA.getSelectionModel().getSelected()[0].iddemanda;

        entidadesAdd = [];
        if (recordsAdd.length > 0) {
            //mymask.show();
            for (var i = 0; i < recordsAdd.length; i++) {
                entidadesAdd.push({
                    identidad: recordsAdd[i].json.idestructura
                });
            }
            Ext.Ajax.request({
                url: 'adicionarDesag',
                params: {
                    identidad: Ext.encode(entidadesAdd),
                    iddemanda: seleccDemanda

                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    //mymask.hide();
                    if (responseData.codMsgN == 1) {
                        if (entidadesAdd.length == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagOK);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsOK);
                        }
                    } else if (responseData.codMsgN == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNO);
                    } else if (responseData.codMsgN == 0) {
                        if (entidadesAdd.length == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsNO);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNoAlgunas);
                        }
                    }
                    if (!apl) {
                        gpAdicionarDesag.getSelectionModel().clearSelections();

                        gpDesagPlanGestionB.getSelectionModel().clearSelections();

                        winAdicionarDesag.hide();

                        //ventana = false;
                    } else {




                    }
                    stDesagPlanGestionB.reload();
                }
            });
        }
    }
    function controlarObjetosB() {
        btnDesagAdicionarB.disable();
        btnDesagGuardarB.disable();
        btnDesagEliminarB.disable();
        btnDesagExportarB.disable();


        selec = gpDesagPlanGestionB.getSelectionModel().getSelected();

        modified = gpDesagPlanGestionB.getStore().getModifiedRecords();
        if (comportEntidadLogProveedor == true) {


            btnDesagAdicionarB.enable();

            if (selec != undefined) {

                btnDesagEliminarB.enable();
            }
        }


        if (gpDesagPlanGestionB.getStore().getTotalCount() > 0) {
            btnDesagExportarB.enable();
        }
        if (modified.length > 0) {
            btnDesagGuardarB.enable();
        }
    }


    function guardarDesagPlanB() {
        mymask.show();

        recordsMod = gpDesagPlanGestionB.getStore().getModifiedRecords();


        var arreglo = [];
        while (recordsMod.length > 0) {

            var record = recordsMod.pop();
            var rec = record.getChanges();

            totaldesagregadoTemp = parseInt(record.data['enero']) + parseInt(record.data['febrero']) + parseInt(record.data['marzo'])
                    + parseInt(record.data['abril']) + parseInt(record.data['mayo']) + parseInt(record.data['junio'])
                    + parseInt(record.data['julio']) + parseInt(record.data['agosto']) + parseInt(record.data['septiembre'])
                    + parseInt(record.data['octubre']) + parseInt(record.data['noviembre']) + parseInt(record.data['diciembre']);

            rec['iddemandatiempo'] = record.data['iddemandatiempo'];
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
                if (responseData.codMsgN == 1) {
                    if (recordsMod.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagOK);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagsOK);
                    }
                } else if (responseData.codMsgN == 0) {
                    if (recordsMod.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagNO);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagsNO);
                    }
                } else if (responseData.codMsgN == 2) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarDesagNOAlgunas);
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
    function exportarDesagregacion() {

        window.open('exportarDesagregacionPlan?identidad=' + nodoEst.attributes.id +
                '&denoentidad=' + nodoEst.attributes.text +
                '&denoejercicio=' + cbEjercicio.getRawValue() +
                '&idejercicio=' + cbEjercicio.getValue() +
                '&tipo=' + cbComportamiento.getValue() +
                '&denotipo=' + cbComportamiento.getRawValue() +
                '&iddemanda=' + smPlanGestionA.getSelected().data.iddemanda +
                '&denomindicador=' + smPlanGestionA.getSelected().data.denominacion +
                '&codindicador=' + smPlanGestionA.getSelected().data.codigo +
                '&cantidadconfirmada=' + smPlanGestionA.getSelected().data.cantidadconfirmada +
                '&filtros=' + Ext.encode(filtrosDesagPlanGestionB.getFilterData()));
    }
    function eliminarDesag() {
        recordsDel = gpDesagPlanGestionB.getSelectionModel().getSelections();
        if (recordsDel.length == 1) {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarPlan, del);
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarPlans, del);
        }

        function del(btnPresionado) {
            array_desagregaciones = [];
            if (btnPresionado == 'ok') {
                for (var i = 0; i < recordsDel.length; i++) {
                    if (recordsDel[i].data.idaprobacion == 1) {
                        array_desagregaciones.push({
                            desagregaciones: recordsDel[i].data.iddemandatiempo
                        });
                    }
                }
                if (array_desagregaciones.length > 0) {

                    //mymask.show();
                    Ext.Ajax.request({
                        url: 'eliminarDesag',
                        params: {
                            desagregaciones: Ext.encode(array_desagregaciones)
                        },
                        callback: function (options, success, response) {
                            //mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgN == 1) {
                                if (recordsDel.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagOK);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagsOK);
                                }
                            } else if (responseData.codMsgN == 0) {
                                if (recordsDel.length == 1) {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagNO);
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagsNO);
                                }
                            } else if (responseData.codMsgN == 2) {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagNOAlgunas);
                            }
                            stDesagPlanGestionB.reload();
                        }
                    });
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDesagInvalidasTodas);
                }
            }
        }
    }
    function controlarEventosB(name, event) {
        selec = gpPlanGestionA.getSelectionModel().getSelections();
        selecDesag = gpDesagPlanGestionB.getSelectionModel().getSelections();

        if (name == 'beforeedit') {


            if (selec.length == 1) {

                if (smPlanGestionA.getSelected().data.idaprobacion != 1) {

                    event.cancel = true;
                } else
                if (selecDesag.length == 1) {

                    if (smDesagPlanGestionB.getSelected().data.idaprobacion != 1) {
                        event.cancel = true;
                    } else if (event.field != 'cantidaddesglosada' && event.field != 'preciodesglosado' && event.field != 'preciodesglosadodivisa') {

                        event.cancel = true;
                    }
                }
            }




        }
    }


}