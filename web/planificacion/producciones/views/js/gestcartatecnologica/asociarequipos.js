asociarequipos = function () {

    filtrosEquipos = new Ext.grid.GridFilters({
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
                type: 'numeric',
                dataIndex: 'depreciacionanual'
            }, {
                type: 'numeric',
                dataIndex: 'depreciasionperiodo'
            }, {
                type: 'numeric',
                dataIndex: 'gastosmantenimiento'
            }]
    });

    cmEquipos = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(), {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            width: 200,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDepAnual,
            tooltip: perfil.etiquetas.lbDepAnual,
            dataIndex: 'depreciacionanual',
            align: 'right',
            sortable: true,
            width: 130,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDepEquip,
            tooltip: perfil.etiquetas.lbDepEquip,
            dataIndex: 'depreciasionperiodo',
            align: 'right',
            sortable: true,
            width: 150,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbGasMant,
            tooltip: perfil.etiquetas.lbGasMant,
            dataIndex: 'gastosmantenimiento',
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }]);

    filtrosEquipoAsc = new Ext.grid.GridFilters({
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
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'valoraf'
            }, {
                type: 'numeric',
                dataIndex: 'tasadepreciacion'
            }, {
                type: 'numeric',
                dataIndex: 'depreciacionanual'
            }]
    });

    checkEquipoAsoc = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                if (checkEquipoAsoc.getSelections().length >= 1) {
                    Ext.getCmp('btnaplicarAsoc').enable();
                    Ext.getCmp('btnaceptarasoc').enable();
                }

            },
            rowdeselect: function () {
                if (checkEquipoAsoc.getSelections().length < 1) {
                    Ext.getCmp('btnaplicarAsoc').disable();
                    Ext.getCmp('btnaceptarasoc').disable();
                }

            }
        }
    });

    cmEquipoAsoc = new Ext.grid.ColumnModel([checkEquipoAsoc,
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            width: 200,
            sortable: true,
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            dataIndex: 'precio',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbValoraf,
            tooltip: perfil.etiquetas.lbValoraf,
            dataIndex: 'valoraf',
            align: 'right',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbTasaDepAnual,
            tooltip: perfil.etiquetas.lbTasaDepAnual,
            dataIndex: 'tasadepreciacion',
            align: 'right',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDepAnual,
            tooltip: perfil.etiquetas.lbDepAnual,
            dataIndex: 'depreciacionanual',
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }]);

    labeltotalda = new Ext.form.Label({
        text: perfil.etiquetas.lbDepAnualT + totalda
    });
    labeltotaldp = new Ext.form.Label({
        text: perfil.etiquetas.lbDepEquipT + totaldp
    });
    labeltotalgm = new Ext.form.Label({
        text: perfil.etiquetas.lbGasMantT + totalgm
    });

    buscarTotales();

}

function winEquiposAsociados() {

    btnAdicionarEquip = new Ext.Button({
        id: 'btnAdicionarEquip',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAsociarEquipo,
        disabled: true,
        handler: function () {
            asociarEquipoACarta();
        }
    });

    btnEliminarEquip = new Ext.Button({
        id: 'btnEliminarEquip',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarEquipo,
        disabled: true,
        handler: function () {
            accionvalidar = 'eliminar';
            eliminarEquipoAsoc();
        }
    });

    btnLimpiarEquipoiacion = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarEquipoiacion',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosEquipos.clearFilters();
        }
    });

    stEquipos = new Ext.data.Store({
        url: 'listarEquiposCarta',
        listeners: {
            beforeload: function () {
                stEquipos.baseParams.start = offsetEquipos;
                stEquipos.baseParams.idcartatecnologica = smGpCT.getSelected().data.idcartatecnologica;
            },
            load: function (mi, record) {
                cambiarTituloFiltrar(gpEquipos, filtrosEquipos, perfil.etiquetas.lbGridEquip);
                stact = record.length;
                btnEliminarEquip.disable();
                controlarBotonesAsociarEq();
                labeltotalda.setText(perfil.etiquetas.lbDepAnualT + totalda);
                labeltotaldp.setText(perfil.etiquetas.lbDepEquipT + totaldp);
                labeltotalgm.setText(perfil.etiquetas.lbGasMantT + totalgm);
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idequipocarta"
        }, [{
                name: 'idequipocarta'
            }, {
                name: 'idcartatecnologica'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'gastosmantenimiento'
            }, {
                name: 'depreciasionperiodo'
            }, {
                name: 'depreciacionanual'
            }])
    });

    smEquipos = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function (sm) {
                arrayPadre = [];
                for (var j = 0; j < smEquipos.getSelections().length; j++) {
                    arrayPadre.push(smEquipos.getSelections()[j].data);
                }
                controlarBotonesAsociarEq();
            },
            rowdeselect: function () {
                arrayPadre = [];
                for (var j = 0; j < smEquipos.getSelections().length; j++) {
                    arrayPadre.push(smEquipos.getSelections()[j].data);
                }
                controlarBotonesAsociarEq();
            }
        }
    });

    gpEquipos = new Ext.grid.EditorGridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosEquipos,
        store: stEquipos,
        sm: smEquipos,
        cm: cmEquipos,
        title: perfil.etiquetas.lbGridEquip,
        region: 'center',
        enableKeyEvents: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            store: stEquipos,
            displayInfo: true,
            items: ['-', btnLimpiarEquipoiacion],
            listeners: {
                beforechange: function (p, e) {
                    offsetEquipos = e.start;
                }
            }
        }),
        tbar: [btnAdicionarEquip, btnEliminarEquip, '-', '->', '-', labeltotaldp, '-', labeltotalgm]
    });

    //***************window de equipos asociados************
    winEquipos = new Ext.Window({
        modal: true,
        id: 'winAsocHerramientas',
        constrain: true,
        width: 850,
        height: 600,
        closeAction: 'destroy',
        items: gpEquipos,
        layout: 'fit',
        title: perfil.etiquetas.lbPanelAsocEquip,
        listeners: {
            beforeshow: function () {
                stEquipos.reload();
                if (smGpCT.getSelected().data.idaprobacion == 3 || smGpCT.getSelected().data.idaprobacion == 4) {
                    btnAdicionarEquip.disable();
                }
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbTtCerrar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winEquipos.destroy();
                    gpEquipos.getSelectionModel().clearSelections();
                }
            }]
    });

    winEquipos.setTitle('' + perfil.etiquetas.lbPanelAsocEquip + denomcarta + '');
    winEquipos.show();
}

function buscarTotales() {
    Ext.Ajax.request({
        url: 'TotalesDepACarta',
        params: {
            idcartatecnologica: smGpCT.getSelected().data.idcartatecnologica
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            totalda = responseData.data[0].totalda;
            totaldp = responseData.data[0].totaldp;
            totalgm = responseData.data[0].totalgm;
        }
    });
}

function asociarEquipoACarta() {

    btnCancelarAsoc = new Ext.Button({
        id: 'btnCancelarAsoc',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        text: perfil.etiquetas.lbCancelar,
        disabled: false,
        handler: function () {
            winEquipoAsoc.destroy();
            gpEquipoAsoc.getSelectionModel().clearSelections();
        }
    });

    btnaplicarAsoc = new Ext.Button({
        id: 'btnaplicarAsoc',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        text: perfil.etiquetas.lbAplicar,
        disabled: true,
        handler: function () {
            asociarEqSel(2);
            gpEquipoAsoc.getSelectionModel().clearSelections();
        }
    });

    btnaceptarasoc = new Ext.Button({
        id: 'btnaceptarasoc',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        handler: function () {
            asociarEqSel(1);
            gpEquipoAsoc.getSelectionModel().clearSelections();
        }
    });

    stEquipoAsoc = new Ext.data.Store({
        url: 'listarEquipos',
        listeners: {
            beforeload: function () {
                stEquipoAsoc.baseParams.start = offsetEquiposAsoc;
                stEquipoAsoc.baseParams.idcartatecnologica = smGpCT.getSelected().data.idcartatecnologica;
            },
            load: function (mi, record) {
                cambiarTituloFiltrar(gpEquipoAsoc, filtrosEquipoAsc, perfil.etiquetas.lbGridEquip);
                stact = record.length;
                //controlarObjetosEquipoiacion();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'iddepreciacionequipo'
            }, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'precio'
            }, {
                name: 'valoraf'
            }, {
                name: 'tasadepreciacion'
            }, {
                name: 'depreciacionanual'
            }])
    });

    btnLimpiarEquipoAsoc = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarEquipoAsoc',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrosEquipoAsc.clearFilters();
        }
    });
    gpEquipoAsoc = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        id: 'gpEquipoAsoc',
        store: stEquipoAsoc,
        plugins: filtrosEquipoAsc,
        sm: checkEquipoAsoc,
        cm: cmEquipoAsoc,
        frame: true,
        layout: 'fit',
        autoExpandColumn: 'expandir',
        //height: 480,
        width: 800,
        margins: '2 2 2 2',
        anchor: '95%',
        title: perfil.etiquetas.lbGridEquip,
        bbar: new Ext.PagingToolbar({
            store: stEquipoAsoc,
            displayInfo: true,
            items: ['-', btnLimpiarEquipoAsoc],
            listeners: {
                beforechange: function (p, e) {
                    offsetEquiposAsoc = e.start;
                }
            }
        }),
        listeners: {
            celldblclick: function () {
                asociarEqSel(1);
                gpEquipoAsoc.getSelectionModel().clearSelections();
            }
        }
    });

    //***************window seleccionar equipos para asociar************
    winEquipoAsoc = new Ext.Window({
        modal: true,
        id: 'winEquipoAsoc',
        constrain: true,
        width: 870,
        height: 580,
        closeAction: 'destroy',
        items: gpEquipoAsoc,
        layout: 'fit',
        title: 'Seleccionar equipos a asociar',
        listeners: {
            beforeshow: function () {
                stEquipoAsoc.reload();
            },
            beforehide: function () {
                stEquipo.reload();
            }
        },
        buttons: [btnCancelarAsoc, btnaplicarAsoc, btnaceptarasoc]
    });

    winEquipoAsoc.show();

}

function asociarEqSel(accion) {
    mymask.show();
    var equip_sel = [];
    for (i = 0; i < gpEquipoAsoc.getSelectionModel().getCount(); i++) {
        equip_sel.push(
                gpEquipoAsoc.getSelectionModel().getSelections()[i].data.iddepreciacionequipo
                );
    }
    Ext.Ajax.request({
        url: 'asociarEqACarta',
        params: {
            equipos: Ext.encode(equip_sel),
            idcartatecnologica: smGpCT.getSelected().data.idcartatecnologica
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgAsociarEquip);
                if (accion == 1) {
                    winEquipoAsoc.destroy();
                }
                buscarTotales();
                stEquipos.reload();
                stEquipoAsoc.reload();
            } else {
                mostrarMensaje(2, responseData.codMsg);
            }
        }
    });
}

function eliminarEquipoAsoc() {
    mymask.show();
    var equip_sel = [];
    for (i = 0; i < gpEquipos.getSelectionModel().getCount(); i++) {
        equip_sel.push(
                gpEquipos.getSelectionModel().getSelections()[i].data.idequipocarta
                );
    }
    Ext.Ajax.request({
        url: 'eliminarEquipoAsoc',
        params: {
            equipos: Ext.encode(equip_sel),
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgElimEquipAsoc);
                buscarTotales();
                stEquipos.reload();
                btnEliminarEquip.disable();
            } else {
                mostrarMensaje(2, responseData.codMsg);
            }
        }
    });
}

function controlarBotonesAsociarEq() {
    btnAdicionarEquip.disable();
    btnEliminarEquip.disable();
    if (smGpCT.getSelected().data.idaprobacion != 3 && smGpCT.getSelected().data.idaprobacion != 4 && chkGlobal.getValue() == false) {
        btnAdicionarEquip.enable();
        if (smEquipos.getSelections().length > 0) {
            btnEliminarEquip.enable();
        }
    }
}