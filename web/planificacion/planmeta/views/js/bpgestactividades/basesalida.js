/**
 * Created by madrid on 30/08/2017.
 */
initBaseSalida = function () {
    /*Variables locales*/
    filasalida = -1;
    columnasalida = -1;
    var offsetSalidas = 0;
    var offsetAddIndSalidas = 0;
    /*Fin de las variables locales*/

    /*Constructor del Grid de Salida*/

    filtrossalida = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioNormas',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
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
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
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
                dataIndex: 'cantidad'
            }
        ]
    });
    stGpGestSalida = new Ext.data.Store({
        url: 'listarSalidas',
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }, {
                name: 'fecha'
            }, {
                name: 'idindicador'
            }, {
                name: 'idnorma'
            }, {
                name: 'cantidad'
            }, {
                name: 'numeropieza'
            }, {
                name: 'idumedida'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'precio'
            }]),
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpGestSalidas, filtrossalida, "Salidas de: " + smGpGestAct.getSelected().data.denominacion);
                if (smGpGestAct.getSelected() != undefined) {
                    stGpGestSalida.baseParams.idactividad = idactividadselecc;
                    stGpGestSalida.baseParams.start = offsetSalidas;
                }
            },
            load: function (st, rec, opt) {
                if (gpGestSalidas.getStore().getCount() == 0 && esta_buscandosalida) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                    esta_buscandosalida = false;
                }
                if (st.getCount() > 0) {
                } else if (filtrossalida.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
                controlarObjetosSalidas();
            }
        }
    });

    cbEjercicioSalida = new Ext.form.ComboBox({
        id: 'cbEjercicioSalida',
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
                stGpGestSalida.reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioActv = false;
                } else {
                    gestionSegunEstEjercicioActv = true;
                }
            }
        }
    });

    cmsalida = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            width: 100
        }, {
            header: perfil.etiquetas.lbNumPieza,
            tooltip: perfil.etiquetas.lbNumPieza,
            width: 100,
            sortable: true,
            hidden: true,
            dataIndex: 'numeropieza'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            width: 100,
            id: 'umedida',
            header: perfil.etiquetas.lbUnidadMedida,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: 'Precio',
            tooltip: 'Precio',
            width: 100,
            align: 'right',
            dataIndex: 'precio',
            sortable: true,
            renderer: crearToolTipNro
        }, {
            header: 'Magnitud',
            tooltip: 'Magnitud',
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
    smGpGestSalida = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosSalidas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosSalidas();
            }
        }
    });

    pgGpGestSalidas = new Ext.PagingToolbar({
        store: stGpGestSalida,
        displayInfo: true,
        listeners: {
            beforechange: function (p, e) {
                offsetSalidas = e.start;
            }
        }
    });

    btnAdicionarSalida = new Ext.Button({
        tooltip: perfil.etiquetas.lbAdicionarSalidas,
        id: 'btnAdicionarSalida',
        iconCls: 'adicionar',
        handler: function () {
            var accionSalida = "salida";
            ventanaAddSalida(accionSalida);
        }
    });

    btnGuardarSalida = new Ext.Button({
        tooltip: perfil.etiquetas.lbGuardarSalidas,
        id: 'btnGuardarSalida',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            var campos_modificados = [];
            var modificados = gpGestSalidas.getStore().getModifiedRecords();
            for (var i = 0; i < modificados.length; i++) {
                campos_modificados.push({
                    idindicador: modificados[i].data.idindicador,
                    cantidad: modificados[i].data.cantidad
                });
            }
            actualizarSalida(campos_modificados);
        }
    });

    btnEliminarSalida = new Ext.Button({
        tooltip: perfil.etiquetas.lbEliminarSalidas,
        id: 'btnEliminarSalida',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            mostrarMensaje(2, '¿Está seguro que quiere eliminar la(s) salida(s) seleccionada(s)?', eliminarSalidas);
            function eliminarSalidas(btnPresionado) {
                if (btnPresionado == 'ok') {
                    eliminarVariasSalidas();
                }
            }
        }
    });
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltrosSalida',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrossalida.clearFilters();
        }
    });

    gpGestSalidas = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpGestSalidas',
        autoExpandColumn: 'expandir',
        store: stGpGestSalida,
        plugins: filtrossalida,
        clicksToEdit: 2,
        split: true,
        margins: '2 2 2 -4',
        sm: smGpGestSalida,
        cm: cmsalida,
        title: "Salidas",
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            afteredit: function (sm) {
                btnGuardarSalida.enable();
            },
            keypress: function (e) {
                if (e.getKey() == 46) {
                }
            }
        },
        tbar: [btnAdicionarSalida, btnGuardarSalida, btnEliminarSalida, '->'/*, perfil.etiquetas.lbcbEjercicio, cbEjercicioSalida*/],
        bbar: new Ext.PagingToolbar({
            store: smGpGestSalida,
            displayInfo: true,
            plugins: [filtrossalida],
            listeners: {
                beforechange: function (p, e) {
                    offsetSalidas = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });


    /*Fin del Constructor del Grid de Salida*/


    /*Funciones para las Salidas*/
    adicionarSalidas = function (apl) {
        var _this = this;
        var recordsSel = gpAddSalida.getSelectionModel().getSelections();
        var normasAdd = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                normasAdd.push({
                    idindicador: recordsSel[i].data.idindicador
                });
            myMaskActv.show(perfil.etiquetas.msgAdicionandoSalida, true);
            Ext.Ajax.request({
                url: 'adicionarSalida',
                params: {
                    salidas: Ext.encode(normasAdd),
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
                        recarga(gpGestSalidas.getStore());
                        if (!apl) {
                            winAddSalida.destroy();
                        }
                        mostrarMensaje(1, perfil.etiquetas.msgSalidaAdicionadaOk);
                    }
                }
            });
        } else {
            winAddSalida.destroy();
        }
    }

    ventanaAddSalida = function (accionSalidaSalida) {
        filtrosindicadoresAddSalida = new Ext.grid.GridFilters({
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
        checkColumnAddSalida = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        cmGpAddSalida = new Ext.grid.ColumnModel([checkColumnAddSalida, {
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
                width: 90,
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbPreciomlc,
                tooltip: perfil.etiquetas.lbPreciomlc,
                dataIndex: 'preciodivisa',
                width: 90,
                hidden: true,
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbCentroBalance,
                tooltip: perfil.etiquetas.lbCentroBalance,
                dataIndex: 'idcentrobalance',
                renderer: renderCB
            }, {
                header: 'Naturaleza',
                tooltip: 'Naturaleza',
                dataIndex: 'idnaturaleza',
                width: 100,
                renderer: renderNaturaleza
            }
        ]);
        cmGpAddSalida.defaultSortable = true;

        smGpAddSalida = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        stGpAddSalida = new Ext.data.Store({
            url: 'listarIndicadoresAddSalidas',
            listeners: {
                beforeload: function () {
                    Ext.Ajax.timeout = 7200000;
                    cambiarTituloFiltrar(gpAddSalida, filtrosindicadoresAddSalida, perfil.etiquetas.lbIndicadores);
                    stGpAddSalida.baseParams.idactividad = idactividadselecc;
                    //stGpAddSalida.baseParams.idejercicio = cbEjercicioSalida.getValue();
                    stGpAddSalida.baseParams.start = offsetAddIndSalidas;
                },
                load: function (st, rec, opt) {
                    if (st.getCount() == 0) {
                        if (filtrosindicadoresAddSalida.getFiltrosActivos().length > 0) {
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
                filtrosindicadoresAddSalida.clearFilters();
            }
        });
        gpAddSalida = new Ext.grid.GridPanel({
            id: 'gpAddSalida',
            frame: true,
            store: stGpAddSalida,
            master_column_id: 'mscolumn',
            sm: checkColumnAddSalida,
            region: 'center',
            root_title: perfil.etiquetas.lbGpRootTitle,
            autoExpandColumn: 'expandir',
            cm: cmGpAddSalida,
            plugins: filtrosindicadoresAddSalida,
            title: perfil.etiquetas.lbIndicadores,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            bbar: new Ext.PagingToolbar({
                store: stGpAddSalida,
                displayInfo: true,
                items: ['-', btnLimpiarFiltrosInd],
                listeners: {
                    beforechange: function (p, e) {
                        offsetAddIndSalidas = e.start;
                    }
                }
            })
        });
        winAddSalida = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 960,
            layout: 'fit',
            items: gpAddSalida,
            constrain: true,
            height: 500,
            title: perfil.etiquetas.lbAdicionarSalidas,
            listeners: {
                hide: function () {
                    //Alternar con la línea siguiente por un problema de rendimiento
                    //stGpActividades.reload();
                    stGpGestSalida.reload();
                },
                show: function () {
                    stGpAddSalida.load();
                }
            },
            buttons: [{
                    tooltip: perfil.etiquetas.lbttCancelar,
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    handler: function () {
                        winAddSalida.hide();
                    }
                }, {
                    iconCls: 'aplicar',
                    tooltip: perfil.etiquetas.lbttAplicar,
                    id: 'btnaplicaraddnorma',
                    text: perfil.etiquetas.lbBtnAplicar,
                    handler: function () {
                        adicionarSalidas(true);
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnaceptaraddnorma',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbttAceptar,
                    handler: function () {
                        adicionarSalidas(false);
                    }
                }]
        });
        winAddSalida.show();
    }

    actualizarSalida = function (campos_modificados) {
        myMaskActv.show(perfil.etiquetas.msgModificandoSalida, true);
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'modificarSalida',
                params: {
                    idactividad: idactividadselecc,
                    salidas: Ext.encode(campos_modificados)
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
                        mostrarMensaje(1, perfil.etiquetas.msgSalidaModificadaOk);
                        stGpGestSalida.load();
                    }
                }
            });
        }
    }

    eliminarVariasSalidas = function () {
        myMaskActv.show(perfil.etiquetas.msgEliminandoSalida, true);
        var recordsSel = gpGestSalidas.getSelectionModel().getSelections(), salidasElim = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                salidasElim.push(
                        recordsSel[i].data.idindicador
                        );
            Ext.Ajax.request({
                url: 'eliminarSalida',
                params: {
                    salidas: Ext.encode(salidasElim),
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
                        recarga(gpGestSalidas.getStore());
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarSalidaOk);
                    }
                }
            });
        }
    }

    function controlarObjetosSalidas() {
        btnAdicionarSalida.disable();
        btnGuardarSalida.disable();
        btnEliminarSalida.disable();
        gpGestSalidas.getColumnModel().setEditable(cmsalida.findColumnIndex('cantidad'), false);
        if (gestionSegunEstEjercicioActv) {
            if (smGpGestAct.getSelections().length == 1) {
                if (smGpGestAct.getSelected().data.idaprobacion < 3 && smGpGestAct.getSelected().data.estado == 0) {
                    btnAdicionarSalida.enable();
                    if (smGpGestSalida.getSelections().length > 0) {
                        btnEliminarSalida.enable();
                    } else {
                        btnEliminarSalida.disable();
                    }
                    gpGestSalidas.getColumnModel().setEditable(cmsalida.findColumnIndex('cantidad'), true);
                }
            }
        }
    }
    /*Fin de las funciones para las Salidas*/

}
