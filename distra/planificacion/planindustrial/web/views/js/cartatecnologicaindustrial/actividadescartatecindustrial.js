var offsetActividadesCartatecnologica = 0;

function actividadescartatecindustrial() {
    stActividadesCartatecnologica = new Ext.data.Store({
        url: 'listarActividadesCartatecnologica',
        listeners: {
            beforeload: function (st, options) {
                mymask.show();
                cambiarTituloFiltrar(gpActividadesCartatecnologica, filtrosActividadesCartatecnologica, etiqueta.lbActividades);
                st.baseParams.start = offsetActividadesCartatecnologica;

                if (smCartatecnologica.getSelected() != undefined) {
                    st.baseParams.idcartatecindustrial = smCartatecnologica.getSelected().data.idcartatecindustrial;
                } else {
                    mymask.hide();
                }
            },
            load: function (st, records, options) {
                mymask.hide();
                controlarObjetosActividadesCartatecnologica();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idcartatecindustrialactividad'
            }, {
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }
        ])
    });
    smActividadesCartatecnologica = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                controlarObjetosActividadesCartatecnologica();
            },
            rowdeselect: function () {
                controlarObjetosActividadesCartatecnologica();
            }
        }
    });

    cmActividadesCartatecnologica = new Ext.grid.ColumnModel([
        {
            header: etiqueta.lbCodigo,
            tooltip: etiqueta.lbCodigo,
            dataIndex: 'codigo',
            width: 100,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            dataIndex: 'descripcion',
            width: 300,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbEstado,
            tooltip: etiqueta.lbEstado,
            dataIndex: 'estado',
            width: 80,
            renderer: renderEstado
        }, {
            header: etiqueta.lbAprobado,
            tooltip: etiqueta.lbAprobado,
            width: 80,
            align: 'center',
            dataIndex: 'idaprobacion',
            renderer: renderAprobado
        }
    ]);
    filtrosActividadesCartatecnologica = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
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
                type: 'list',
                dataIndex: 'estado',
                options: [[0, etiqueta.lbNo], [1, etiqueta.lbSi]]
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, etiqueta.lbNo], [3, etiqueta.lbEspecialista], [4, etiqueta.lbRector]]
            }]
    });
    btnAdicionarActividadesCartatecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionarActividadesCartatecnologica,
        handler: function () {
            adicionarActividadesCartatecnologica();
        }
    });
    btnEliminarActividadesCartatecnologica = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminarActividadesCartatecnologica,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmacionEliminarActividadesCartatecnologica, EliminarActividadesCartatecnologica);
        }
    });
    btnVerNormaActividadesCartatecnologica = new Ext.Button({
        disabled: true,
        iconCls: 'mostrar',
        hidden: true,
        tooltip: etiqueta.lbEliminarActividadesCartatecnologica,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmacionEliminarActividadesCartatecnologica, eliminarActividadesCartatecnologica);
        }
    });
    btnLimpiarActividadesCartatecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosActividadesCartatecnologica.clearFilters();
        }
    });
    gpActividadesCartatecnologica = new Ext.grid.GridPanel({
        title: etiqueta.lbActividades,
        store: stActividadesCartatecnologica,
        region: 'center',
        sm: smActividadesCartatecnologica,
        cm: cmActividadesCartatecnologica,
        plugins: filtrosActividadesCartatecnologica,
        autoExpandColumn: 'expandir',
        tbar: [btnAdicionarActividadesCartatecnologica, btnEliminarActividadesCartatecnologica, '-', btnVerNormaActividadesCartatecnologica],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stActividadesCartatecnologica,
            displayInfo: true,
            items: ['-', btnLimpiarActividadesCartatecnologica],
            listeners: {
                beforechange: function (p, e) {
                    offsetActividadesCartatecnologica = e.start;
                }
            }
        })
    });
}

function controlarObjetosActividadesCartatecnologica() {
    btnAdicionarActividadesCartatecnologica.disable();
    btnEliminarActividadesCartatecnologica.disable();
    btnVerNormaActividadesCartatecnologica.disable();

    if (smCartatecnologica.getSelections().length == 1) {
        if (smCartatecnologica.getSelected().data.idaprobacion == 1) {
            btnAdicionarActividadesCartatecnologica.enable();
        }

        if (smActividadesCartatecnologica.getSelections().length > 0) {
            btnEliminarActividadesCartatecnologica.enable();

            if (smActividadesCartatecnologica.getSelections().length == 1) {
                btnVerNormaActividadesCartatecnologica.enable();
            }
        }
    }

}

function adicionarActividadesCartatecnologica() {
    var offsetAdicionarActividadesCartatecnologica = 0;
    checkAdicionarActividadesCartatecnologica = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                controlarObjetosAdicionarActividadesCartatecnologica();
            },
            rowdeselect: function () {
                controlarObjetosAdicionarActividadesCartatecnologica();
            }
        }
    });
    cmAdicionarActividadesCartatecnologica = new Ext.grid.ColumnModel([checkAdicionarActividadesCartatecnologica, {
            width: 100,
            header: etiqueta.lbCodigo,
            tooltip: etiqueta.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            width: 100,
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }]);
    stAdicionarActividadesCartatecnologica = new Ext.data.Store({
        url: 'listarActividadesAdicionarActividadesCartatecnologica',
        listeners: {
            beforeload: function (st) {
                mymask.show();
                st.baseParams.start = offsetAdicionarActividadesCartatecnologica;
                st.baseParams.idcartatecindustrial = smCartatecnologica.getSelected().data.idcartatecindustrial;
            },
            load: function () {
                cambiarTituloFiltrar(gpAdicionarActividadesCartatecnologica, filtrosAdicionarActividadesCartatecnologica, etiqueta.lbActividades);
                controlarObjetosAdicionarActividadesCartatecnologica();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            id: 'idactividad',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });
    filtrosAdicionarActividadesCartatecnologica = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
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
            }]
    });
    btnLimpiarAdicionarActividadesCartatecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosAdicionarActividadesCartatecnologica.clearFilters();
        }
    });
    gpAdicionarActividadesCartatecnologica = new Ext.grid.GridPanel({
        store: stAdicionarActividadesCartatecnologica,
        autoExpandColumn: 'expandir',
        sm: checkAdicionarActividadesCartatecnologica,
        cm: cmAdicionarActividadesCartatecnologica,
        region: 'center',
        frame: true,
        plugins: filtrosAdicionarActividadesCartatecnologica,
        title: etiqueta.lbActividades,
        listeners: {
            celldblclick: function () {
                AdicionarActividadesCartatecnologicaLogica();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stAdicionarActividadesCartatecnologica,
            displayInfo: true,
            items: ['-', btnLimpiarAdicionarActividadesCartatecnologica],
            listeners: {
                beforechange: function (p, e) {
                    offsetAdicionarActividadesCartatecnologica = e.start;
                }
            }
        })
    });

    windowAdicionarActividadesCartatecnologica = new Ext.Window({
        modal: true,
        width: 750,
        constrain: true,
        height: 450,
        closeAction: 'destroy',
        items: [gpAdicionarActividadesCartatecnologica],
        layout: 'fit',
        title: etiqueta.lbAdicionarActividadesCartatecnologica,
        buttons: [{
                iconCls: 'cancelar',
                text: etiqueta.lbBtnCancelar,
                tooltip: etiqueta.lbTtbtnCancelar,
                handler: function () {
                    windowAdicionarActividadesCartatecnologica.destroy();
                    gpAdicionarActividadesCartatecnologica.getSelectionModel().clearSelections();
                }
            }, {
                id: 'btnaplicarAdicionarActividadesCartatecnologica',
                iconCls: 'aplicar',
                tooltip: etiqueta.lbTtbtnAplicar,
                text: etiqueta.lbBtnAplicar,
                handler: function () {
                    AdicionarActividadesCartatecnologicaLogica(true);
                    gpAdicionarActividadesCartatecnologica.getSelectionModel().clearSelections();
                }
            }, {
                id: 'btnaceptarAdicionarActividadesCartatecnologica',
                iconCls: 'aceptar',
                text: etiqueta.lbBtnAceptar,
                tooltip: etiqueta.lbTtbtnAceptar,
                handler: function () {
                    AdicionarActividadesCartatecnologicaLogica();
                    gpAdicionarActividadesCartatecnologica.getSelectionModel().clearSelections();
                }
            }],
        listeners: {
            beforeshow: function (w) {
                stAdicionarActividadesCartatecnologica.reload();
            }
        }
    });

    windowAdicionarActividadesCartatecnologica.show();
}

function controlarObjetosAdicionarActividadesCartatecnologica() {
    Ext.getCmp('btnaplicarAdicionarActividadesCartatecnologica').disable();
    Ext.getCmp('btnaceptarAdicionarActividadesCartatecnologica').disable();

    if (gpAdicionarActividadesCartatecnologica.getSelectionModel().getSelections().length > 0) {
        Ext.getCmp('btnaplicarAdicionarActividadesCartatecnologica').enable();
        Ext.getCmp('btnaceptarAdicionarActividadesCartatecnologica').enable();
    }
}

function AdicionarActividadesCartatecnologicaLogica(aplicar) {
    var mensajeConf = Ext.MessageBox.show({
        title: 'Por favor espere...',
        msg: 'Adicionando la(s) actividad(es)',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        id: 'idmensaje'
    });
    var actividades_sel = [];
    for (i = 0; i < gpAdicionarActividadesCartatecnologica.getSelectionModel().getCount(); i++) {
        actividades_sel.push(
                gpAdicionarActividadesCartatecnologica.getSelectionModel().getSelections()[i].data.idactividad
                );
    }
    Ext.Ajax.request({
        url: 'adicionarActividadesCartatecnologica',
        params: {
            idactividades: Ext.encode(actividades_sel),
            idcartatecindustrial: smCartatecnologica.getSelected().data.idcartatecindustrial
        },
        callback: function (options, success, response) {
            mensajeConf.hide();
            responseData = Ext.decode(response.responseText);

            if (responseData.codMsg > 0) {
                mostrarMensaje(1, etiqueta.msgActividadCartaAdicionadaOk);
                if (!aplicar) {
                    windowAdicionarActividadesCartatecnologica.destroy();
                } else {
                    stAdicionarActividadesCartatecnologica.reload();
                }
            } else {
                mostrarMensaje(1, etiqueta.msgActividadCartaAdicionadaNo);
            }
            stActividadesCartatecnologica.reload();
        }
    });
}

function EliminarActividadesCartatecnologica(btnPresionado) {
    if (btnPresionado == 'ok') {
        var mensajeElim = Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: 'Eliminando las actividades',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });
        var recordsSel = smActividadesCartatecnologica.getSelections(), actElim = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                actElim.push(recordsSel[i].data.idcartatecindustrialactividad);
            Ext.Ajax.request({
                url: 'eliminarActividadesCartatecnologica',
                params: {
                    idactividades: Ext.encode(actElim),
                    idcartatecindustrial: smCartatecnologica.getSelected().data.idcartatecindustrial
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg > 0) {
                        mostrarMensaje(1, etiqueta.msgActividadesCartaEliminadaOk);
                        stActividadesCartatecnologica.reload();
                    } else {
                        mostrarMensaje(1, etiqueta.msgActividadesCartaEliminadaNo);
                    }
                }
            });
        }
    }
}
