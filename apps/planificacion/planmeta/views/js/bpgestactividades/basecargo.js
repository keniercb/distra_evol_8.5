/**
 * Created by madrid on 30/08/2017.
 */
initBaseCargo = function () {
    /*Variables locales*/
    filacargo = -1;
    columnacargo = -1;
    var offsetCargos = 0;
    var offsetAddIndCargos = 0;
    var esta_buscandocargo = false;
    /*Fin de las variables locales*/

    /*Constructor del Grid de Cargo*/
    stCargos = new Ext.data.Store({
        url: 'obtenerCargos',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idcargo'
        }, [{
                name: 'idcargo'
            }, {
                name: 'denominacion'
            }])

    });
    filtroscargo = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioCargos',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'duracion'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }
        ]
    });
    stGpGestCargo = new Ext.data.Store({
        url: 'listarCargos',
        enableKeyEvents: true,
        pruneModifiedRecords: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }, {
                name: 'idcargo'
            }, {
                name: 'cantidad'
            }, {
                name: 'duracion'
            }]),
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpGestCargos, filtroscargo, "Cargos de: " + smGpGestAct.getSelected().data.denominacion);
                if (smGpGestAct.getSelected() != undefined) {
                    stGpGestCargo.baseParams.idactividad = idactividadselecc;
                    stGpGestCargo.baseParams.start = offsetCargos;
                }
            },
            load: function (st, rec, opt) {
                if (gpGestCargos.getStore().getCount() == 0 && esta_buscandocargo) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                    esta_buscandocargo = false;
                }
                if (st.getCount() > 0) {
                } else if (filtroscargo.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
                controlarObjetosCargos();
            }
        }
    });

    cbEjercicioCargo = new Ext.form.ComboBox({
        id: 'cbEjercicioCargo',
        store: stEjercicio,
        disabled: false,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        //maxLength: 5,
        width: 180,
        listeners: {
            select: function (cb, rec, num) {
                stGpGestCargo.reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioActv = false;
                } else {
                    gestionSegunEstEjercicioActv = true;
                }
            }
        }
    });

    cmcargo = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'idcargo',
            renderer: renderCargo
        }, {
            header: 'Cantidad',
            tooltip: 'Cantidad',
            width: 80,
            dataIndex: 'cantidad',
            align: 'right',
            sortable: true,
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: 'El valor debe ser mayor que 0',
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: 'Duración en horas',
            tooltip: 'Duración en horas',
            width: 130,
            dataIndex: 'duracion',
            align: 'right',
            sortable: true,
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                invalidText: 'El valor debe ser mayor que 0',
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            sortable: true,
            hidden: true,
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fecha',
            sortable: true,
            hidden: true,
            width: 150,
            renderer: crearToolTip
        }]);
    smGpGestCargo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosCargos();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosCargos();
            }
        }
    });

    pgGpGestCargos = new Ext.PagingToolbar({
        store: stGpGestCargo,
        displayInfo: true,
        listeners: {
            beforechange: function (p, e) {
                offsetCargos = e.start;
            }
        }
    });

    btnAdicionarCargo = new Ext.Button({
        tooltip: perfil.etiquetas.lbAdicionarCargos,
        id: 'btnAdicionarCargo',
        iconCls: 'adicionar',
        handler: function () {

            var accionCargo = "cargo";
            ventanaAddCargo(accionCargo);
        }
    });

    btnGuardarCargo = new Ext.Button({
        tooltip: perfil.etiquetas.lbGuardarCargos,
        id: 'btnGuardarCargo',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            var campos_modificados = [];
            var modificados = stGpGestCargo.getModifiedRecords();
            for (var i = 0; i < modificados.length; i++) {
                campos_modificados.push({
                    idcargo: modificados[i].data.idcargo,
                    cantidad: modificados[i].data.cantidad,
                    duracion: modificados[i].data.duracion
                });
            }
            actualizarCargo(campos_modificados);
        }
    });

    btnEliminarCargo = new Ext.Button({
        tooltip: perfil.etiquetas.lbEliminarCargos,
        id: 'btnEliminarCargo',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarCargo, eliminarCargos);
            function eliminarCargos(btnPresionado) {
                if (btnPresionado == 'ok') {
                    eliminarVariasCargos();
                }
            }
        }
    });
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltrosCargos',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtroscargo.clearFilters();
        }
    });
    gpGestCargos = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpGestCargos',
        autoExpandColumn: 'expandir',
        store: stGpGestCargo,
        plugins: filtroscargo,
        clicksToEdit: 2,
        split: true,
        margins: '2 2 2 -4',
        sm: smGpGestCargo,
        cm: cmcargo,
        title: "Cargos",
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            afteredit: function (sm) {
                btnGuardarCargo.enable();
            },
            keypress: function (e) {
                if (e.getKey() == 46) {
                }
            }
        },
        tbar: [btnAdicionarCargo, btnGuardarCargo, btnEliminarCargo, '->'/*, perfil.etiquetas.lbcbEjercicio, cbEjercicioCargo*/],
        bbar: new Ext.PagingToolbar({
            store: stGpGestCargo,
            displayInfo: true,
            plugins: [filtroscargo],
            listeners: {
                beforechange: function (p, e) {
                    offsetCargos = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });


    /*Fin del Constructor del Grid de Cargo*/


    /*Funciones para las Cargos*/
    adicionarCargos = function (apl) {
        var _this = this;
        var recordsSel = gpAddCargo.getSelectionModel().getSelections();

        var cargosAdd = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                cargosAdd.push({
                    idnomcargo: recordsSel[i].data.idnomcargo
                });
            myMaskActv.show(perfil.etiquetas.msgAdicionandoCargo, true);
            Ext.Ajax.request({
                url: 'adicionarCargo',
                params: {
                    cargos: Ext.encode(cargosAdd),
                    idactividad: idactividadselecc
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        mostrarMensaje(3, perfil.etiquetas.msgTiempoExcedido);
                        return;
                    }

                    if (responseData.codMsgS == 1) {
                        recarga(gpGestCargos.getStore());
                        if (!apl) {
                            winAddCargo.destroy();
                        }
                        stGpAddCargo.reload();
                        mostrarMensaje(1, perfil.etiquetas.msgCargoAdicionadoOk);
                    }
                }
            });
        } else {
            winAddCargo.destroy();
        }
    }

    ventanaAddCargo = function (accionCargoCargo) {

        filtrosindicadoresAddCargo = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'list',
                    dataIndex: 'actual',
                    options: [[1, perfil.etiquetas.lbSi], [0, perfil.etiquetas.lbNo]]
                }, {
                    type: 'list',
                    dataIndex: 'visible',
                    options: [[1, perfil.etiquetas.lbSi], [0, perfil.etiquetas.lbNo]]
                }, {
                    type: 'string',
                    dataIndex: 'abreviatura'
                }]
        });
        checkColumnAddCargo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        cmGpAddCargo = new Ext.grid.ColumnModel([checkColumnAddCargo, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbAbreviatura,
                tooltip: perfil.etiquetas.lbAbreviatura,
                dataIndex: 'abreviatura',
                width: 80,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbActual,
                tooltip: perfil.etiquetas.lbActual,
                dataIndex: 'actual',
                width: 80,
                renderer: renderNivelPlanif
            }, {
                header: perfil.etiquetas.lbVisible,
                tooltip: perfil.etiquetas.lbVisible,
                dataIndex: 'visible',
                renderer: renderNivelPlanif
            }
        ]);
        cmGpAddCargo.defaultSortable = true;

        smGpAddCargo = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        stGpAddCargo = new Ext.data.Store({
            url: 'listarCargosAddCargos',
            listeners: {
                beforeload: function () {
                    Ext.Ajax.timeout = 7200000;
                    cambiarTituloFiltrar(gpAddCargo, filtrosindicadoresAddCargo, perfil.etiquetas.lbIndicadores);
                    stGpAddCargo.baseParams.idactividad = idactividadselecc;
                    //stGpAddCargo.baseParams.idejercicio = cbEjercicioCargo.getValue();
                    stGpAddCargo.baseParams.start = offsetAddIndCargos;
                },
                load: function (st, rec, opt) {
                    if (st.getCount() == 0) {
                        if (filtrosindicadoresAddCargo.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idnomcargo'
            }, [{
                    name: 'idnomcargo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'abreviatura'
                }, {
                    name: 'actual'
                }, {
                    name: 'visible'
                }, {
                    name: 'orden'
                }])
        });

        //********* Limpiar ****************
        btnLimpiarFiltrosInd = new Ext.Button({
            id: 'btnLimpiarFiltros',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
            handler: function () {
                filtrosindicadoresAddCargo.clearFilters();
            }
        });
        gpAddCargo = new Ext.grid.GridPanel({
            id: 'gpAddCargo',
            frame: true,
            store: stGpAddCargo,
            master_column_id: 'mscolumn',
            sm: checkColumnAddCargo,
            region: 'center',
            root_title: perfil.etiquetas.lbGpRootTitle,
            autoExpandColumn: 'expandir',
            cm: cmGpAddCargo,
            plugins: filtrosindicadoresAddCargo,
            title: perfil.etiquetas.lbCargos,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            bbar: new Ext.PagingToolbar({
                store: stGpAddCargo,
                displayInfo: true,
                items: ['-', btnLimpiarFiltrosInd],
                listeners: {
                    beforechange: function (p, e) {
                        offsetAddIndCargos = e.start;
                    }
                }
            })
        });
        winAddCargo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 960,
            layout: 'fit',
            items: gpAddCargo,
            constrain: true,
            height: 500,
            title: perfil.etiquetas.lbAdicionarCargos,
            listeners: {
                hide: function () {
                    //Alternar con la línea siguiente por un problema de rendimiento
                    //stGpActividades.reload();
                    stGpGestCargo.reload();
                },
                show: function () {
                    stGpAddCargo.load();
                }
            },
            buttons: [{
                    tooltip: perfil.etiquetas.lbttCancelar,
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    handler: function () {
                        winAddCargo.hide();
                    }
                }, {
                    iconCls: 'aplicar',
                    tooltip: perfil.etiquetas.lbttAplicar,
                    id: 'btnaplicaraddnorma',
                    text: perfil.etiquetas.lbBtnAplicar,
                    handler: function () {
                        adicionarCargos(true);
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnaceptaraddnorma',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbttAceptar,
                    handler: function () {
                        adicionarCargos(false);
                    }
                }]
        });
        winAddCargo.show();
    }

    actualizarCargo = function (campos_modificados) {
        myMaskActv.show(perfil.etiquetas.msgModificandoCargo, true);
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'modificarCargo',
                params: {
                    idactividad: idactividadselecc,
                    cargos: Ext.encode(campos_modificados)
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        return;
                    }
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, perfil.etiquetas.lbmsgError1);
                    } else if (responseData.si == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgCargoModificadoOk);
                        stGpGestCargo.load();
                    }
                }
            });
        }
    }

    eliminarVariasCargos = function () {
        myMaskActv.show(perfil.etiquetas.msgEliminandoCargo, true);
        var recordsSel = gpGestCargos.getSelectionModel().getSelections();
        var cargosElim = [];
        if (recordsSel.length > 0) {

            for (var i = 0; i < recordsSel.length; i++)
                cargosElim.push(recordsSel[i].data.idcargo);

            Ext.Ajax.request({
                url: 'eliminarCargo',
                params: {
                    cargos: Ext.encode(cargosElim),
                    idactividad: idactividadselecc
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        mostrarMensaje(3, perfil.etiquetas.msgTiempoExcedido);
                        return;
                    }

                    if (responseData.codMsgG == 1) {
                        recarga(gpGestCargos.getStore());
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarCargoOk);
                    }
                }
            });
        }
    }

    function controlarObjetosCargos() {
        btnAdicionarCargo.disable();
        btnGuardarCargo.disable();
        btnEliminarCargo.disable();
        gpGestCargos.getColumnModel().setEditable(cmcargo.findColumnIndex('cantidad'), false);
        if (gestionSegunEstEjercicioActv) {
            if (smGpGestAct.getSelections().length == 1) {
                if (smGpGestAct.getSelected().data.idaprobacion < 3 && smGpGestAct.getSelected().data.estado == 0) {
                    btnAdicionarCargo.enable();
                    if (smGpGestCargo.getSelections().length > 0) {
                        btnEliminarCargo.enable();
                    } else {
                        btnEliminarCargo.disable();
                    }
                    gpGestCargos.getColumnModel().setEditable(cmcargo.findColumnIndex('cantidad'), true);
                }
            }
        }
    }
    /*Fin de las funciones para las Cargos*/

}
