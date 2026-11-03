
initBaseActivos = function () {
    /*Variables locales*/
    filaactivos = -1;
    columnaactivos = -1;
    var offsetActivos = 0;
    var offsetAddIndActivos = 0;
    var esta_buscandoactivos = false;
    /*Fin de las variables locales*/

    /*Constructor del Grid de Activos*/

    filtrosactivos = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioActivos',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }
        ]
    });
    stGpGestActivos = new Ext.data.Store({
        url: 'listarActivos',
        enableKeyEvents: true,
        pruneModifiedRecords: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idactividadactivofijo'
            }, {
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'idactividad'
            }, {
                name: 'fecha'
            }, {
                name: 'idusuario'
            }, {
                name: 'cantidad'
            }]),
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpGestActivos, filtrosactivos, "Activos de: " + smGpGestAct.getSelected().data.denominacion);
                if (smGpGestAct.getSelected() != undefined) {
                    stGpGestActivos.baseParams.idactividad = idactividadselecc;
                    stGpGestActivos.baseParams.start = offsetActivos;
                }
            },
            load: function (st, rec, opt) {
                if (gpGestActivos.getStore().getCount() == 0 && esta_buscandoactivos) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                    esta_buscandoactivos = false;
                }
                if (st.getCount() > 0) {
                } else if (filtrosactivos.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
                controlarObjetosActivos();
            }
        }
    });

    cbEjercicioActivos = new Ext.form.ComboBox({
        id: 'cbEjercicioActivos',
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
                stGpGestActivos.reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioActv = false;
                } else {
                    gestionSegunEstEjercicioActv = true;
                }
            }
        }
    });

    cmactivos = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: 'Cantidad',
            tooltip: 'Cantidad',
            width: 100,
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
    smGpGestActivos = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosActivos();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosActivos();
            }
        }
    });

    pgGpGestActivos = new Ext.PagingToolbar({
        store: stGpGestActivos,
        displayInfo: true,
        listeners: {
            beforechange: function (p, e) {
                offsetActivos = e.start;
            }
        }
    });

    btnAdicionarActivos = new Ext.Button({
        tooltip: perfil.etiquetas.lbAdicionarActivos,
        id: 'btnAdicionarActivos',
        iconCls: 'adicionar',
        handler: function () {

            var accionActivos = "activos";
            ventanaAddActivos(accionActivos);
        }
    });

    btnGuardarActivos = new Ext.Button({
        tooltip: perfil.etiquetas.lbGuardarActivos,
        id: 'btnGuardarActivos',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            var campos_modificados = [];
            var modificados = gpGestActivos.getStore().getModifiedRecords();
            for (var i = 0; i < modificados.length; i++) {
                campos_modificados.push({
                    idindicador: modificados[i].data.idindicador,
                    cantidad: modificados[i].data.cantidad
                });
            }
            actualizarActivos(campos_modificados);
        }
    });

    btnEliminarActivos = new Ext.Button({
        tooltip: perfil.etiquetas.lbEliminarActivos,
        id: 'btnEliminarActivos',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarActivos, eliminarActivos);
            function eliminarActivos(btnPresionado) {
                if (btnPresionado == 'ok') {
                    eliminarVariasActivos();
                }
            }
        }
    });
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltrosActivos',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrosactivos.clearFilters();
        }
    });

    gpGestActivos = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpGestActivos',
        autoExpandColumn: 'expandir',
        store: stGpGestActivos,
        plugins: filtrosactivos,
        clicksToEdit: 2,
        split: true,
        margins: '2 2 2 -4',
        sm: smGpGestActivos,
        cm: cmactivos,
        title: "Activos",
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            afteredit: function (sm) {
                btnGuardarActivos.enable();
            },
            keypres: function (e) {
                if (e.getKey() == 46) {
                }
            }
        },
        tbar: [btnAdicionarActivos, btnGuardarActivos, btnEliminarActivos, '->'/*, perfil.etiquetas.lbcbEjercicio, cbEjercicioActivos*/],
        bbar: new Ext.PagingToolbar({
            store: stGpGestActivos,
            displayInfo: true,
            plugins: [filtrosactivos],
            listeners: {
                beforechange: function (p, e) {
                    offsetActivos = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });


    /*Fin del Constructor del Grid de Activos*/


    /*Funciones para las Activos*/
    adicionarActivos = function (apl) {
        var _this = this;
        var recordsSel = gpAddActivos.getSelectionModel().getSelections();

        var activosAdd = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                activosAdd.push({
                    idindicador: recordsSel[i].data.idindicador
                });
            myMaskActv.show(perfil.etiquetas.msgAdicionandoActivos, true);
            Ext.Ajax.request({
                url: 'adicionarActivos',
                params: {
                    activos: Ext.encode(activosAdd),
                    idactividad: idactividadselecc
                },
                callback: function (options, succes, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        mostrarMensaje(3, perfil.etiquetas.msgTiempoExcedido);
                        return;
                    }

                    if (responseData.codMsgS != 0) {
                        recarga(gpGestActivos.getStore());
                        if (!apl) {
                            winAddActivos.destroy();
                        }
                        stGpAddActivos.reload();
                        mostrarMensaje(1, perfil.etiquetas.msgActivosAdicionadoOk);
                    }
                }
            });
        } else {
            winAddActivos.destroy();
        }
    }

    ventanaAddActivos = function (accionActivosActivos) {

        filtrosindicadoresAddActivos = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'codigo_ind_calculo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                    strEmptyText: ''
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'string',
                    dataIndex: 'numeropieza'
                }, {
                    type: 'listado',
                    dataIndex: 'idumedida',
                    idcombo: 'idcbunidadmedida',
                    valueFieldcb: 'idunidadmedida',
                    displayFieldcb: 'denominacionunidadmedida',
                    st: stum,
                    autoload: false,
                    mode: 'local'
                }, {
                    type: 'numeric',
                    dataIndex: 'precio'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciodivisa'
                }, {
                    type: 'listado',
                    dataIndex: 'idcentrobalance',
                    idcombo: 'idcbcentrobalanceindicadornorma',
                    valueFieldcb: 'idcentrobalance',
                    displayFieldcb: 'centrobalance',
                    st: stCB,
                    autoload: false,
                    mode: 'local'
                }, {
                    type: 'listado',
                    dataIndex: 'idnaturaleza',
                    idcombo: 'idcbnaturalezaindicadornorma',
                    valueFieldcb: 'naturaleza',
                    displayFieldcb: 'denominacion',
                    st: stNaturaleza,
                    autoload: false,
                    mode: 'local'
                }]
        });
        checkColumnAddActivos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        cmGpAddActivos = new Ext.grid.ColumnModel([checkColumnAddActivos, {
                header: perfil.etiquetas.lbCodigo,
                tooltip: perfil.etiquetas.lbCodigo,
                dataIndex: 'codigo',
                width: 100,
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                hidden: true,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbNumPieza,
                tooltip: perfil.etiquetas.lbNumPieza,
                dataIndex: 'numeropieza',
                width: 120,
                hidden: true,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbUnidadMedida,
                tooltip: perfil.etiquetas.lbUnidadMedida,
                dataIndex: 'idumedida',
                renderer: renderUM
            }, {
                header: perfil.etiquetas.lbPreciomn,
                tooltip: perfil.etiquetas.lbPreciomn,
                dataIndex: 'precio',
                align: 'right',
                width: 80,
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbPreciomlc,
                tooltip: perfil.etiquetas.lbPreciomlc,
                dataIndex: 'preciodivisa',
                align: 'right',
                width: 80,
                hidden: true,
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbCentroBalance,
                tooltip: perfil.etiquetas.lbCentroBalance,
                dataIndex: 'idcentrobalance',
                renderer: renderCB
            }, {
                header: perfil.etiquetas.lbNaturaleza,
                tooltip: perfil.etiquetas.lbNaturaleza,
                dataIndex: 'idnaturaleza',
                width: 100,
                renderer: renderNaturaleza
            }
        ]);
        cmGpAddActivos.defaultSortable = true;

        smGpAddActivos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        stGpAddActivos = new Ext.data.Store({
            url: 'listarActivosAddActivos',
            listeners: {
                beforeload: function () {
                    Ext.Ajax.timeout = 7200000;
                    cambiarTituloFiltrar(gpAddActivos, filtrosindicadoresAddActivos, perfil.etiquetas.lbIndicadores);
                    stGpAddActivos.baseParams.idactividad = idactividadselecc;
                    //stGpAddActivos.baseParams.idejercicio = cbEjercicioActivos.getValue();
                    stGpAddActivos.baseParams.start = offsetAddIndActivos;
                },
                load: function (st, rec, opt) {
                    if (st.getCount() == 0) {
                        if (filtrosindicadoresAddActivos.getFiltrosActivos().length > 0) {
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
                id: 'idindicador'
            }, [{
                    name: 'idindicador'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'idnaturaleza'
                }, {
                    name: 'idcentrobalance'
                }, {
                    name: 'precio'
                }, {
                    name: 'preciodivisa'
                }, {
                    name: 'idumedida'
                }])
        });

        //********* Limpiar ****************
        btnLimpiarFiltrosInd = new Ext.Button({
            id: 'btnLimpiarFiltros',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
            handler: function () {
                filtrosindicadoresAddActivos.clearFilters();
            }
        });
        gpAddActivos = new Ext.grid.GridPanel({
            id: 'gpAddActivos',
            frame: true,
            store: stGpAddActivos,
            master_column_id: 'mscolumn',
            sm: checkColumnAddActivos,
            region: 'center',
            root_title: perfil.etiquetas.lbGpRootTitle,
            autoExpandColumn: 'expandir',
            cm: cmGpAddActivos,
            plugins: filtrosindicadoresAddActivos,
            title: perfil.etiquetas.lbActivos,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            bbar: new Ext.PagingToolbar({
                store: stGpAddActivos,
                displayInfo: true,
                items: ['-', btnLimpiarFiltrosInd],
                listeners: {
                    beforechange: function (p, e) {
                        offsetAddIndActivos = e.start;
                    }
                }
            })
        });
        winAddActivos = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 960,
            layout: 'fit',
            items: gpAddActivos,
            constrain: true,
            height: 500,
            title: perfil.etiquetas.lbAdicionarActivos,
            listeners: {
                hide: function () {
                    //Alternar con la línea siguiente por un problema de rendimiento
                    //stGpActividades.reload();
                    stGpGestActivos.reload();
                },
                show: function () {
                    stGpAddActivos.load();
                }
            },
            buttons: [{
                    tooltip: perfil.etiquetas.lbttCancelar,
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    handler: function () {
                        winAddActivos.hide();
                    }
                }, {
                    iconCls: 'aplicar',
                    tooltip: perfil.etiquetas.lbttAplicar,
                    id: 'btnaplicaraddactivos',
                    text: perfil.etiquetas.lbBtnAplicar,
                    handler: function () {
                        adicionarActivos(true);
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnaceptaraddactivos',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbttAceptar,
                    handler: function () {
                        adicionarActivos(false);
                    }
                }]
        });
        winAddActivos.show();
    }

    actualizarActivos = function (campos_modificados) {
        myMaskActv.show(perfil.etiquetas.msgModificandoActivos, true);
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'modificarActivos',
                params: {
                    idactividad: idactividadselecc,
                    activos: Ext.encode(campos_modificados)
                },
                callback: function (options, succes, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        return;
                    }
                    if (responseData.codMsgN == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgActivosModificadoNo);
                        stGpGestActivos.load();
                    } else if (responseData.codMsgN == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgActivosModificadoOk);
                    } else {
                        mostrarMensaje(3, perfil.etiquetas.lbmsgError1);
                    }
                    stGpGestActivos.load();
                }
            });
        }
    }

    eliminarVariasActivos = function () {
        myMaskActv.show(perfil.etiquetas.msgEliminandoActivos, true);
        var recordsSel = gpGestActivos.getSelectionModel().getSelections();
        var activosElim = [];
        if (recordsSel.length > 0) {

            for (var i = 0; i < recordsSel.length; i++)
                activosElim.push(recordsSel[i].data.idindicador);

            Ext.Ajax.request({
                url: 'eliminarActivos',
                params: {
                    activos: Ext.encode(activosElim),
                    idactividad: idactividadselecc
                },
                callback: function (options, succes, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        mostrarMensaje(3, perfil.etiquetas.msgTiempoExcedido);
                        return;
                    }

                    if (responseData.codMsgN == 1) {
                        recarga(gpGestActivos.getStore());
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarActivosOk);
                    }
                    stGpGestActivos.load();
                }
            });
        }
    }

    function controlarObjetosActivos() {
        btnAdicionarActivos.disable();
        btnGuardarActivos.disable();
        btnEliminarActivos.disable();
        gpGestActivos.getColumnModel().setEditable(cmactivos.findColumnIndex('cantidad'), false);
        if (gestionSegunEstEjercicioActv) {
            if (smGpGestAct.getSelections().length == 1) {
                if (smGpGestAct.getSelected().data.idaprobacion < 3 && smGpGestAct.getSelected().data.estado == 0) {
                    btnAdicionarActivos.enable();
                    if (smGpGestActivos.getSelections().length > 0) {
                        btnEliminarActivos.enable();
                    } else {
                        btnEliminarActivos.disable();
                    }
                    gpGestActivos.getColumnModel().setEditable(cmactivos.findColumnIndex('cantidad'), true);
                }
            }
        }
    }
    /*Fin de las funciones para las Activos*/

}
