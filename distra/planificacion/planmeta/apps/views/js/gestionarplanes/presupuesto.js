/**
 * Created by madrid on 23/03/2017.
 */

/*Crear grid inicialmente*/
btnLimpiarFiltrosPPlanes = new Ext.Button({
    id: 'btnLimpiarFiltrosP',
    //icon:perfil.dirImg+'limpiar.png',
    iconCls: 'limpiar',
    //text:perfil.etiquetas.lbLimpiarFiltros,
    tooltip: perfil.etiquetas.lbLimpiar,
    handler: function() {
        filtrospresupuesto.clearFilters();
        storeAsociadoaPresupuesto.reload();
    }
});

btnExportarPlanes = new Ext.Button({
    disabled: false,
    id: 'btnExportarAPre',
    hidden: false,
    //icon:perfil.dirImg+'exportar.png',
    iconCls: 'exportar',
    tooltip: 'Exportar indicadores del plan.(ALt+E)',
    //text:'Exportar',
    handler: function() {
        exportarPresupuestoPlanes();
    }
});

smGpAsociadoaPresupuestoPlanes = new Ext.grid.RowSelectionModel({
    singleSelect: false,
    listeners: {
        rowselect: function() {

        }

    }
});

//creando el repositorio de datos
storeAsociadoaPresupuestoPlanes = new Ext.data.Store({
    url: 'listarNAEOGRFPlanes',
    method: 'POST',
    listeners: {
        beforeload: function(st, opt) {
            cambiarTituloFiltrarAsociadoaPresupuestoPlanes();
            this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
            this.baseParams.idmodelo = treePlanSelect;
            this.baseParams.identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
            this.baseParams.identidad = identidadselectedPlanes;
            this.baseParams.hoja = (eshoja == 1) ? true : false;
            this.baseParams.start = offsetgpAsociadoaPresupuestoPlanes;

        },
        load: function(st, record, ob) {
            siexisteIndAsociadoFiltradoPlanes();

        }

    },
    reader: new Ext.data.JsonReader({
        id: 'idasociadoapresupuesto',
        root: 'data',
        totalProperty: 'total'

    }, [{
            name: 'idindicador'
        }, {
            name: 'idplanificacion'
        }, {
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'idcentrobalance'
        }, {
            name: 'denocentrobalance'
        }, {
            name: 'precio'
        }, {
            name: 'idumedida'
        }, {
            name: 'nom_datosnomenclador_denominacion'
        }, {
            name: 'denoum'
        }, {
            name: 'numeropieza'
        }, {
            name: 'idplanificacionnae'
        }, {
            name: 'idobjetogasto'
        }, {
            name: 'idingreso'
        }, {
            name: 'datos'
        }, {
            name: 'cantidad'
        }, {
            name: 'importe'
        }
    ])

});
//paginado
pgAsociadoaPresupuestoPlanes = new Ext.PagingToolbar({
    id: 'paginado1',
    pageSize: 20,
    store: storeAsociadoaPresupuestoPlanes,
    displayInfo: true,
    listeners: {
        beforechange: function(p, e) {
            offsetgpAsociadoaPresupuestoPlanes = e.start;
        }
    }
});
//Creando el objeto Ext.grid.ColumnModel
cmAsociadoaPresupuestoPlanes = new Ext.grid.ColumnModel([
    {
        header: perfil.etiquetas.lbCodigo,
        width: 60,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTipPlanes
    }, {
        header: perfil.etiquetas.lbNumPieza,
        width: 60,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTipPlanes
    }, {
        header: perfil.etiquetas.lbDenominacion,
        id: 'expandir',
        width: 100,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTipPlanes
    }, {
        header: perfil.etiquetas.lbUM,
        width: 50,
        sortable: true,
        dataIndex: 'denoum',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTipPlanes
    }, {
        header: "Destino",
        width: 100,
        sortable: true,
        dataIndex: 'nom_datosnomenclador_denominacion',
        tooltip: "Destino",
        renderer: crearToolTipPlanes
    }, {
        header: perfil.etiquetas.lbCentroBalance,
        width: 100,
        sortable: true,
        dataIndex: 'denocentrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        renderer: crearToolTipPlanes

    }, {
        header: perfil.etiquetas.lbPrecio,
        width: 60,
        sortable: true,
        dataIndex: 'precio',
        renderer: precioPlanes,
        tooltip: perfil.etiquetas.lbPrecio

    }, {
        header: perfil.etiquetas.lbCantidad,
        width: 60,
        sortable: true,
        dataIndex: 'cantidad',
        tooltip: perfil.etiquetas.lbCant,
        renderer: crearToolTipPlanes
    }, {
        header: perfil.etiquetas.lbImporte,
        width: 60,
        sortable: true,
        renderer: crearToolTipPlanes,
        dataIndex: 'importe',
        tooltip: perfil.etiquetas.lbImport

    }, {
        header: perfil.etiquetas.lbAsociado,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idplanificacionnae',
        tooltip: perfil.etiquetas.lbAsociado,
        renderer: ColumnaAsociadoPlanes
    }, {
        header: perfil.etiquetas.lbNaeog,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idobjetogasto',
        tooltip: perfil.etiquetas.lbNaeog,
        renderer: ColumnaAsociadonaeogPlanes
    }, {
        header: perfil.etiquetas.lbNaerf,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idingreso',
        tooltip: perfil.etiquetas.lbNaerf,
        renderer: ColumnaAsociadonaerfPlanes
    }, {
        header: perfil.etiquetas.lbDatos,
        width: 60,
        sortable: true,
        dataIndex: 'datos',
        tooltip: perfil.etiquetas.lbDatos,
        renderer: crearToolTipPlanes
    }

]);

Ext.menu.RangeMenu.prototype.icons = {
    gt: perfil.dirImg + 'greater_then.png',
    lt: perfil.dirImg + 'less_then.png',
    eq: perfil.dirImg + 'equals.png'
};

Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg + 'find.png';

filtrospresupuestoPlanes = new Ext.grid.GridFilters({
    filters: [
        {
            type: 'string',
            dataIndex: 'codigo'
        }, {
            type: 'string',
            dataIndex: 'numeropieza'
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'listado',
            dataIndex: 'denoum',
            idcombo: 'idumedidaindicadores',
            urlcb: urlCbUMPlanes,
            idstore: 'idstumedidaindicadores',
            valueFieldcb: 'idunidadmedida',
            displayFieldcb: 'nombreum',
            autoload: false,
            mode: 'remote'
        },
        {
            type: 'listado',
            dataIndex: 'denocentrobalance',
            idcombo: 'idcbcentrobalancenorma',
            urlcb: urlCbCentBalancePlanes,
            idstore: 'idstcentrobalancenorma',
            valueFieldcb: 'idcentrobalance',
            displayFieldcb: 'centrobalance',
            autoload: false,
            mode: 'remote'
        }, {
            type: 'numeric',
            dataIndex: 'precio'
        }, {
            type: 'numeric',
            dataIndex: 'cantidad'
        }, {
            type: 'numeric',
            dataIndex: 'importe'
        }, {
            type: 'list',
            dataIndex: 'idplanificacionnae',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
        }, {
            type: 'list',
            dataIndex: 'idobjetogasto',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
        }, {
            type: 'list',
            dataIndex: 'idingreso',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
        }, {
            type: 'string',
            dataIndex: 'datos'
        }]
});

gpAsociadoaPresupuestoPlanes = new Ext.grid.GridPanel({
    region: 'center',
    store: storeAsociadoaPresupuestoPlanes,
    cm: cmAsociadoaPresupuestoPlanes,
    sm: smGpAsociadoaPresupuestoPlanes,
    plugins: filtrospresupuestoPlanes,
    height: 200,
    width: 410,
    loadMask: {
        msg: perfil.etiquetas.lbCargando
    },
    tbar: ['->', btnExportarPlanes, '-', btnLimpiarFiltrosPPlanes],
    bbar: pgAsociadoaPresupuestoPlanes,
    md: new Ext.menu.Menu({
        id: 'mdGridAsociar',
        items: [{
                text: "Asociar a Objeto de Gasto",
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'asociarOGasto',
                handler: function() {
                    asociarObjetoGastoPlanes();
                }
            }, {
                text: "Asociar a Recurso financiero",
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'asociarRFinanciero',
                handler: function() {
                    recursofinacieroPlanes();
                }
            }, {
                text: "Eliminar asociaciones",
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'eliminarAsoccionesButton',
                hidden: true,
                handler: function() {
                    eliminarTodasAsociacionesPlanes(smGpAsociadoaPresupuestoPlanes.getSelections());
                }
            }, {
                text: "Asociar a Presupuesto",
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'idasociarpresup',
                handler: function() {
                    crearWinPresupContabilidad();
                }
            }, {
                text: "Eliminar asociacion con Presupuesto",
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'idelimasociarpresup',
                handler: function() {

                }
            }]
    }),
    listeners: {
        rowcontextmenu: function(g, r, e) {

            e.stopEvent();
            gpAsociadoaPresupuestoPlanes.getSelectionModel().selectRow(r);
            if (gpAsociadoaPresupuestoPlanes.getSelectionModel().getSelections().length == 1) {
                record_selected = g.getStore().getAt(r);

                g.getEl().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
                Ext.Ajax.request({
                    url: 'validarasociacion',
                    params: {
                        idplanificacion: record_selected.data.idplanificacion
                    },
                    callback: function(options, success, response) {
                        obj = Ext.decode(response.responseText);
                        if (obj[0].DatPlanificacionnae.length > 0) {
                            var datplanifnae = obj[0].DatPlanificacionnae;
                            if (datplanifnae[0].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso) {
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(0).disable();
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(1).enable();
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(2).show();
                            } else if (datplanifnae[0].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto) {
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(1).disable();
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(0).enable();
                                gpAsociadoaPresupuestoPlanes.md.items.itemAt(2).show();
                            }
                        } else {
                            gpAsociadoaPresupuestoPlanes.md.items.itemAt(0).enable();
                            gpAsociadoaPresupuestoPlanes.md.items.itemAt(1).enable();
                        }

                        g.getEl().unmask();
                        gpAsociadoaPresupuestoPlanes.md.showAt(e.getXY());
                    }

                });

            } else {
                obj = false;
                gpAsociadoaPresupuestoPlanes.md.items.itemAt(2).show();
                gpAsociadoaPresupuestoPlanes.md.items.itemAt(0).enable();
                gpAsociadoaPresupuestoPlanes.md.items.itemAt(1).enable();
                gpAsociadoaPresupuestoPlanes.md.showAt(e.getXY());
            }

        }
    }
});

pAsociadoaPresupuestoPlanes = new Ext.Panel({
    id: 'pAsociadoaPresupuestoPlanes',
    margins: '0 0 0 5',
    layout: 'fit',
    title: "Asociación a presupuesto",
    border: false,
    layoutConfig: {
        animate: true
    },
    items: [gpAsociadoaPresupuestoPlanes]

});

/*fin*/

function mostrarPresupuestoPlanes() {
    Ext.getCmp('verplanPlanes').hide();
    if (treePlanSelect != null && (menuLeaf)) {
        pcmPlanes.layout.setActiveItem('pAsociadoaPresupuestoPlanes');
        Ext.Ajax.request({
            url: 'getgridinterfaces',
            params: {
                idmodelo: treePlanSelect
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.cm) {
                    for (var index = 0; index < responseData.cm.length; index++) {
                        if (responseData.cm[index].header == 'Formato') {
                            responseData.cm[index].header = 'UM';
                            responseData.cm[index].hidden = true;
                        }
                    }
                    reconfigurarPresupuestoPlanes(responseData);
                } else {
                    reconfigurarPresupuestoPlanes();
                }
            }
        });
    } else {
        mostrarMensaje(1, "Antes de ejecutar la acción  'Ver presupuesto' debe seleccionar al menos uno de los planes.");
    }
}

function reconfigurarPresupuestoPlanes(cf) {

    var recPlanes = [];
    recPlanes.push({
        name: 'idindicador'
    });
    recPlanes.push({
        name: 'mod_planificacionmeta_nom_05_n5'
    });
    recPlanes.push({
        name: 'mod_planificacionmeta_nom_05_n4'
    });
    recPlanes.push({
        name: 'idplanificacion'
    });
    recPlanes.push({
        name: 'denominacion'
    });
    recPlanes.push({
        name: 'codigo'
    });
    recPlanes.push({
        name: 'idcentrobalance'
    });
    recPlanes.push({
        name: 'denocentrobalance'
    });
    recPlanes.push({
        name: 'precio'
    });
    recPlanes.push({
        name: 'idumedida'
    });
    recPlanes.push({
        name: 'nom_datosnomenclador_denominacion'
    });
    recPlanes.push({
        name: 'denoum'
    });
    recPlanes.push({
        name: 'numeropieza'
    });
    recPlanes.push({
        name: 'idplanificacionnae'
    });
    recPlanes.push({
        name: 'idobjetogasto'
    });
    recPlanes.push({
        name: 'idingreso'
    });
    recPlanes.push({
        name: 'datos'
    });
    recPlanes.push({
        name: 'cantidad'
    });
    recPlanes.push({
        name: 'importe'
    });

    var cmGpPlanes = [];
    cmGpPlanes.push({
        header: perfil.etiquetas.lbCodigo,
        width: 100,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbNumPieza,
        width: 70,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbDenominacion,
        id: 'expandir',
        width: 100,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbUM,
        width: 40,
        sortable: true,
        dataIndex: 'denoum',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbPrecio,
        width: 75,
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: precioPlanes
    });

    cmGpPlanes.push({
        header: perfil.etiquetas.lbCantidad,
        width: 60,
        sortable: true,
        dataIndex: 'cantidad',
        tooltip: perfil.etiquetas.lbCant,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbCentroBalance,
        width: 100,
        sortable: true,
        dataIndex: 'denocentrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbImporte,
        width: 60,
        sortable: true,
        renderer: crearToolTipPlanes,
        dataIndex: 'importe',
        tooltip: perfil.etiquetas.lbImport
    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbAsociado,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idplanificacionnae',
        tooltip: perfil.etiquetas.lbAsociado,
        renderer: ColumnaAsociadoPlanes
    });

    if (cf) {
        for (var index = 0; index < cf.cm.length; index++) {
            if (cf.cm[index].edit) {
                switch (cf.cm[index].edit.xtype) {
                    case 'combo':
                        {
                            var itemPlanes = cf.cm[index].edit;
                            var itemsPlanes = cf.cm;
                            var almacenPlanes = new Ext.data.SimpleStore({
                                fields: ['iddatosnomenclador', 'nom_datosnomenclador_denominacion']
                            });
                            var valoresPlanes = [];
                            for (pos in cf.cm[index].edit.store) {
                                valoresPlanes.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                            }
                            valoresPlanes.pop();
                            almacenPlanes.add(valoresPlanes);

                            cf.cm[index] = {
                                id: itemsPlanes[index].id,
                                header: itemsPlanes[index].header,
                                dataIndex: itemsPlanes[index].dataIndex,
                                sortable: true,
                                tooltip: itemPlanes.displayField/*'Sector Rama'*/,
                                renderer: function(value, cell, rec, row, col) {
                                    return getRawValue(value, gpAsociadoaPresupuestoPlanes.getColumnModel().getCellEditor(col, row).field);
                                },
                                editor: new Ext.form.ComboBox({
                                    id: itemPlanes.id,
                                    hiddenName: itemPlanes.hiddenName,
                                    name: itemPlanes.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: itemPlanes.allowBlank,
                                    emptyText: itemPlanes.emptyText,
                                    typeAhead: itemPlanes.typeAhead,
                                    valueField: itemPlanes.valueField,
                                    displayField: itemPlanes.displayField,
                                    renderer: crearToolTipPlanes,
                                    store: almacenPlanes,
                                    listeners: {
                                        select: function(a, b, c) {
                                        }
                                    }
                                })
                            };
                        }
                        break;
                }
                cmGpPlanes.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++)
            recPlanes.push(cf.rd[index]);
    }

    cmGpPlanes.push({
        header: perfil.etiquetas.lbNaeog,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idobjetogasto',
        tooltip: perfil.etiquetas.lbNaeog,
        renderer: ColumnaAsociadonaeogPlanes
    });

    cmGpPlanes.push({
        header: perfil.etiquetas.lbNaerf,
        width: 60,
        sortable: true,
        hidden: false,
        dataIndex: 'idingreso',
        tooltip: perfil.etiquetas.lbNaerf,
        renderer: ColumnaAsociadonaerfPlanes
    });

    cmGpPlanes.push({
        header: perfil.etiquetas.lbDatos,
        width: 60,
        sortable: true,
        dataIndex: 'datos',
        tooltip: perfil.etiquetas.lbDatos,
        renderer: crearToolTipPlanes
    });

    jrstoreAsociadoaPresupuestoPlanes = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'idasociadoapresupuestoPlanes',
        fields: recPlanes
    });

    storeAsociadoaPresupuestoPlanesReconfig = new Ext.data.Store({
        url: 'listarNAEOGRFPlanes',
        method: 'POST',
        listeners: {
            beforeLoad: function() {
                storeAsociadoaPresupuestoPlanesReconfig.removeAll();
                // cambiarTituloFiltrarAsociadoaPresupuesto();
                this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                this.baseParams.idmodelo = treePlanSelect;
                this.baseParams.identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                this.baseParams.identidad = identidadselectedPlanes;
                this.baseParams.hoja = (hojaPlanes == 1) ? true : false;
                this.baseParams.filtros = Ext.encode(filtrospresupuestoPlanes.getFilterData());
                this.baseParams.start = offsetgpAsociadoaPresupuestoPlanes;
            },
            load: function() {
                // siexisteIndAsociadoFiltrado();
            }
        },
        reader: jrstoreAsociadoaPresupuestoPlanes
    });

    gpAsociadoaPresupuestoPlanes.reconfigure(storeAsociadoaPresupuestoPlanesReconfig, new Ext.grid.ColumnModel(cmGpPlanes));

    pgAsociadoaPresupuestoPlanes.bind(storeAsociadoaPresupuestoPlanesReconfig);
    gpAsociadoaPresupuestoPlanes.getStore().load({
        params: {
            start: 0,
            limit: 20
        }
    });
}

function asociarObjetoGastoPlanes() {
    var sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeOG.each(function(rec) {
                    Ext.get('checkgridogog_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = true;
                    sel_.checked = true;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaeog_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = false;
                    sel_.checked = false;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaeog_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaeog_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel_ = _this.getSelections();
            }
        }
    });
    var smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpOG.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpOG.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                gpOG.getSelectionModel().clearSelections();
                                Ext.get('checkgridogog_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaeog_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpOG.getStore().each(function(r) {
                        gpOG.getSelectionModel().clearSelections();
                        Ext.get('checkgridogog_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpOG.getSelectionModel().selectAll();
                    gpOG.getSelectionModel().clearSelections();
                    gpOG.disable();
                } else {
                    var aux = (obj) ? obj[0] : [];
                    if (aux.length == 0)
                        aux.DatPlanificacionnae = [];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpOG.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                    gpOG.getSelectionModel().clearSelections();
                                    Ext.get('checkgridogog_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaeog_' + record.id).dom.checked = false;
                }
            }
        }
    });
    //creando el repositorio de datos
    var storeNAE = new Ext.data.Store({
        url: 'cargarnaes',
        listeners: {
            beforeload: function() {
                storeNAE.baseParams.start = offsetNaePlanes;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel


    var myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_Planes
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTipPlanes
        },
        {
            id: 'expandir',
            header: "NAE",
            //width: 100,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTipPlanes
        }
    ]);
    var btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });


    //creamos una variable para referenciar a nuesto objeto
    var paginado2 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true,
        items: [btnLimpiarFiltrosP],
        listeners: {
            beforechange: function(p, e) {
                offsetNaePlanes = e.start;
            }
        }
    });
    var filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    var gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        plugins: filtrosNAE,
        cm: myColumnModel,
        sm: smNAE,
        autoExpandColumn: 'expandir',
        height: 250,
        width: 450,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado2,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociar.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaeog', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaeobjetogasto',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaeog');
                                if (response.cod == 1) {
                                    winAsociar.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente');
                                    storeAsociadoaPresupuesto.reload();
                                }

                            }
                        });
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    var storeOG = new Ext.data.Store({
        url: 'cargarobjetosgasto',
        listeners: {
            beforeload: function() {
                storeOG.baseParams.start = offsetOGPlanes;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idobjetogasto'
        }, [{
                name: 'idobjetogasto'
            }, , {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //******check***********
    var checkOG = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    //Creando el objeto Ext.grid.ColumnModel
    var myColumnModelOG = new Ext.grid.ColumnModel([
        {
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_OGPlanes
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTipPlanes
        },
        {
            id: 'idcolumnog',
            header: "Denominación",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTipPlanes
        }
    ]);
    var btnLimpiarFiltrosOG = new Ext.Button({
        id: 'btnLimpiarFiltrosOG',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosOG.clearFilters();
            storeOG.reload();
        }
    });

    var paginado1 = new Ext.PagingToolbar({
        store: storeOG,
        displayInfo: true,
        items: [btnLimpiarFiltrosOG],
        listeners: {
            beforechange: function(p, e) {
                offsetOGPlanes = e.start;
            }
        }
    });
    var filtrosOG = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto
    var gpOG = new Ext.grid.GridPanel({
        title: 'Objeto de Gasto',
        region: 'center',
        id: 'gpOG',
        store: storeOG,
        cm: myColumnModelOG,
        plugins: filtrosOG,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumnog',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado1,
        listeners: {
            start: 0,
            limit: 20
        }
    });
    gpOG.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    var btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelar',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        text: 'Cancelar',
        handler: function() {

            winAsociar.close()
        }
    });
    var btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        //icon: perfil.dirImg + 'asociar.png',
        tooltip: perfil.etiquetas.lbAceptOG,
        iconCls: 'asociar',
        text: 'Asociar',
        handler: function() {
            idnaes = [];
            del = 0;
            idplanificaciones = [];
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            var selections_plan = winAsociar.planificaciones;
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = 1;
            if (gpNAE.getSelectionModel().getSelected() && gpOG.getSelectionModel().getSelected() && selections_plan) {
                Planificacion.mostrarMascara('mascaraAsociarOG', 'Por favor espere...', 'Aplicando cambios');
                Ext.Ajax.request({
                    url: 'asociarmodeloaobjetogasto',
                    params: {
                        idplanificaciones: Ext.encode(idplanificaciones),
                        idnaes: Ext.encode(idnaes),
                        del: del,
                        idobjgasto: gpOG.getSelectionModel().getSelected().id,
                        idejercicio: cbEjercicioPlanes.getValue()
                    },
                    callback: function(options, success, response) {
                        respuesta = Ext.decode(response.responseText);
                        Planificacion.ocultarMascara('mascaraAsociarOG');
                        if (respuesta.cod == 3) {
                            mostrarMensaje(1, 'Ha ocurrido un error');
                        } else if (respuesta.cod == 1) {
                            winAsociar.close();
                            mostrarMensaje(1, 'Se han realizado los cambios correctamente');
                            storeAsociadoaPresupuestoPlanesReconfig.reload();
                        }
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe seleccionar un NAE y un Objeto de gasto');
            }
        }
    });
    var winAsociar = new Ext.Window({
        title: "Asociar a Objeto de Gasto",
        width: 1000,
        layout: 'border',
        height: 300,
        constrain: true,
        modal: true,
        planificaciones: smGpAsociadoaPresupuestoPlanes.getSelections(),
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpOG]
    });
    cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }
        }
    });
    storeOG.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }

        }
    });
}

function recursofinacieroPlanes() {
    var sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeRecurso.each(function(rec) {
                    Ext.get('checkgridrfrf_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = true;
                    sel.checked = true;
                    entro = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaerf_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = false;
                    sel.checked = false;
                    entro = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaerf_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaerf_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel = _this.getSelections();
            }
        }
    });
    var smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpRF.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpRF.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                gpRF.getSelectionModel().clearSelections();
                                Ext.get('checkgridrfrf_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaerf_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpRF.getStore().each(function(r) {
                        gpRF.getSelectionModel().clearSelections();
                        Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpRF.getSelectionModel().selectAll();
                    gpRF.getSelectionModel().clearSelections();
                    gpRF.disable();
                } else {
                    var aux = obj[0];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpRF.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                    gpRF.getSelectionModel().clearSelections();
                                    Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaerf_' + record.id).dom.checked = false;
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {

            }
        }
    });
    //creando el repositorio de datos
    var storeNAE = new Ext.data.Store({
        url: 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel
    var myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheckPlanes
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTipPlanes
        },
        {
            id: 'expandir',
            header: "NAE",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTipPlanes
        }
    ]);
    var btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    //creamos una variable para referenciar a nuesto objeto
    var paginado3 = new Ext.PagingToolbar({
        store: storeNAE,
        id: 'paginado3',
        displayInfo: true,
        items: [btnLimpiarFiltrosP]
    });
    var filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    var gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
        plugins: filtrosNAE,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado3,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociarRF.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaerf', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaerecursos',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()

                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaerf');
                                if (response.cod == 1) {
                                    winAsociarRF.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente');
                                    storeAsociadoaPresupuesto.reload();
                                }

                            }
                        });
                    }
                }]
        }),
        autoExpandColumn: 'expandir',
        height: 250,
        width: 480,
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    var storeRecurso = new Ext.data.Store({
        url: 'cargarnrecursosfinacieros',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idrecursofinanciero'
        }, [{
                name: 'idrecursofinanciero'
            }, {
                name: 'codigo'
            }, , {
                name: 'denominacion'
            }])
    });

    var btnLimpiarFiltrosRF = new Ext.Button({
        id: 'btnLimpiarFiltrosRF',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosRF.clearFilters();
            storeRecurso.reload();
        }
    });
    var paginadoRF = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeRecurso,
        id: 'paginadoRF',
        displayInfo: true,
        items: [btnLimpiarFiltrosRF]
    });
    //Creando el objeto Ext.grid.ColumnModel
    var myColumnModelRF = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_RFPlanes
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTipPlanes
        },
        {
            id: 'idcolumrf',
            header: "Recurso financiero",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTipPlanes
        }
    ]);
    var filtrosRF = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto

    var gpRF = new Ext.grid.GridPanel({
        title: 'Recurso finaciero',
        region: 'center',
        store: storeRecurso,
        plugins: filtrosRF,
        id: 'gpRF',
        cm: myColumnModelRF,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumrf',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginadoRF,
        listeners: {
            start: 0,
            limit: 20,
            rowclick: function(_this, rowindex, event) {

            }
        }
    });
    gpRF.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    var btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelarrf',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        iconCls: 'cancelar',
        text: 'Cancelar',
        handler: function() {
            winAsociarRF.close();
        }
    });
    var btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        // icon: perfil.dirImg + 'asociar.png',
        iconCls: 'asociar',
        text: 'Asociar',
        tooltip: perfil.etiquetas.lbAceptRF,
        handler: function() {
            idnaes = [];
            idplanificaciones = [];
            del = 0;
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociarRF.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = true;
            Planificacion.mostrarMascara('mascaraAsociarRF', 'Por favor espere...', 'Aplicando cambios');
            Ext.Ajax.request({
                url: 'asociarmodeloarecursofinaciero',
                params: {
                    idplanificaciones: Ext.encode(idplanificaciones),
                    idnaes: Ext.encode(idnaes),
                    del: del,
                    idingreso: gpRF.getSelectionModel().getSelected().id,
                    idejercicio: cbEjercicioPlanes.getValue()
                },
                callback: function(options, success, response) {
                    respuesta = Ext.decode(response.responseText);
                    Planificacion.ocultarMascara('mascaraAsociarRF');
                    if (respuesta.cod == 3) {
                        mostrarMensaje(1, 'Ha ocurrido un error');
                    } else if (respuesta.cod == 1) {
                        winAsociarRF.close();
                        mostrarMensaje(1, 'Se han realizado los cambios correctamente');
                        storeAsociadoaPresupuestoPlanesReconfig.reload();
                    }
                }
            });
        }
    });
    var winAsociarRF = new Ext.Window({
        title: "Asociar a Recurso financiero",
        width: 1000,
        layout: 'border',
        height: 300,
        constrain: true,
        planificaciones: smGpAsociadoaPresupuestoPlanes.getSelections(),
        modal: true,
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpRF]
    })
    var cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
    storeRecurso.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
}

function eliminarTodasAsociacionesPlanes(idplanificaciones) {
    if (idplanificaciones.length > 0) {
        ids = [];
        for (var j = 0; j < idplanificaciones.length; j++) {
            ids.push(idplanificaciones[j].data.idplanificacion);
        }
        Planificacion.mostrarMascara('eliminarasociaciones', 'Eliminando las asociaciones', 'Desasociando...');
        Ext.Ajax.request({
            url: 'eliminarasociaciones',
            params: {
                idplanificaciones: Ext.encode(ids),
                idejercicio: cbEjercicioPlanes.getValue()
            },
            callback: function(options, success, response) {
                response = Ext.decode(response.responseText);
                Planificacion.ocultarMascara('eliminarasociaciones');
                if (response.cod == 1) {
                    mostrarMensaje(1, 'Se han eliminado las asociaciones correctamente');
                    storeAsociadoaPresupuestoReconfigPlanes.reload();
                }
            }
        });
    }
}

function exportarPresupuestoPlanes() {
    var selectedEntity = tpEstructuraPlanes.selModel.getSelectedNode().text;
    var selectedPlan = tpBasePlanes.selModel.getSelectedNode().text;
    var idejerc = cbEjercicioPlanes.getValue();
    var mihoja = (hojaPlanes == 1) ? true : false;
    var win = window.open('exportarpresupuesto?entidad=' + selectedEntity + '&plan=' + selectedPlan + '&identidad=' + identidadselectedPlanes + '&idejercicio=' + idejerc + '&idmodelo=' + treesel + '&hoja=' + mihoja + '&start=' + 0 + '&limit=' + 10000 + '&identidadmodelo=' + tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo + '& filtros=' + Ext.encode(filtrospresupuesto.getFilterData()));
}

function crearWinPresupContabilidad() {
    var _this = this;

    _this.offsetGpPresupCuenta = 0;

    _this.cmGpPresupCuenta = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: 'C&oacute;digo',
            width: 100,
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo'
        },
        {
            id: 'expandir',
            header: 'Denominaci&oacute;n',
            width: 100,
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n'
        },
        {
            id: 'expandir',
            header: 'Tipo',
            width: 100,
            dataIndex: 'tipo',
            tooltip: 'Tipo de cuenta'
        }

    ]);

    _this.smGpPresupCuenta = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sel, row, rec) {
                _this.btnAceptarPresup.enable();
            },
            rowdeselect: function(sel, row, rec) {
                _this.btnAceptarPresup.disable();
            }
        }
    });

    _this.stGpPresupCuenta = new Ext.data.Store({
        url: 'listarCuentas',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'tipo'
            }]),
        listeners: {
            beforeload: function(st) {
                st.baseParams.start = _this.offsetGpPresupCuenta;
            }
        }
    });

    _this.filtrosGpPresupCuenta = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            }
        ]
    });

    _this.btnLimpiarFiltrosGpPresupCuenta = new Ext.Button({
        id: 'btntodos',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            _this.filtrosGpPresupCuenta.clearFilters();
        }
    });

    _this.pgGpPresupCuenta = new Ext.PagingToolbar({
        pageSize: 20,
        id: 'pgGpdemandacentrobalancePlanes',
        store: _this.stGpPresupCuenta,
        displayInfo: true,
        items: [_this.btnLimpiarFiltrosGpPresupCuenta],
        listeners: {
            beforechange: function(p, e) {
                _this.offsetGpPresupCuenta = e.start;
            }
        }
    });

    _this.GpPresupCuenta = new Ext.grid.GridPanel({
        title: "Cuentas",
        frame: true,
        autoExpandColumn: 'expandir',
        store: _this.stGpPresupCuenta,
        plugins: _this.filtrosGpPresupCuenta,
        sm: _this.smGpPresupCuenta,
        cm: _this.cmGpPresupCuenta,
        loadMask: {
            msg: 'Cargando...'
        },
        bbar: _this.pgGpPresupCuenta
    });

    _this.btnCancelarPresup = new Ext.Button({
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbBtnCancelar,
        disabled: false,
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            _this.winPresups.destroy();
        }
    });

    _this.btnAceptarPresup = new Ext.Button({
        iconCls: 'aceptar',
        id: 'idbtnAceptarPresup',
        disabled: true,
        text: perfil.etiquetas.lbBtnAceptar + '<b>',
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function() {
            asociarAPresupuesto();
        }
    });

    _this.winPresups = new Ext.Window({
        title: 'Asociar Indicador a Presupuesto',
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        width: 800,
        height: 350,
        layout: 'fit',
        items: _this.GpPresupCuenta,
        buttons: [_this.btnCancelarPresup, _this.btnAceptarPresup],
        listeners: {
            beforeshow: function() {
                _this.stGpPresupCuenta.load();
            }
        }
    });

    _this.winPresups.show();
}

function asociarAPresupuesto() {
    var _this = this;
}
