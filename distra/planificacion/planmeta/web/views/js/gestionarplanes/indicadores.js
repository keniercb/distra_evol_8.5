/**
 * Created by madrid on 03/04/2017.
 */

var winAddNormaPlanes, filtrosindicadoresPlanes, stGpAddNormaPlanes, checkColumnAddNormaPlanes, apl = false, offset = 0;

function crearIUAddIndicadores() {//Inicio de declaracion

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    var stCmbUMPlanes = new Ext.data.Store({
        url: 'cargarunidadmedida',
        listeners: {
            load: function() {
                flag5 = true;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosindicadoresPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idumedidaindicadores',
                urlcb: 'cargarunidadmedida',
                mode: 'remote',
                idstore: 'idstumedidaindicadores',
                valueFieldcb: 'idunidadmedida',
                st: stCmbUMPlanes,
                displayFieldcb: 'denominacionunidadmedida',
                autoload: false
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                /*temporal arreglar el listar para que liste centros de balance*/
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcbcentrobalancenorma',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'identidaddatosnomenclador',
                displayFieldcb: 'centrobalance'
            }, {
                type: 'listado',
                dataIndex: 'viaadquisicion',
                idcombo: 'idviaadquisicionc',
                urlcb: 'cargarviaadquision',
                mode: 'remote',
                idstore: 'idStViaInd',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                autoload: false
            }
        ]
    });


    checkColumnAddNormaPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function() {
                if (!checkColumnAddNormaPlanes.hasSelection()) {
                    Ext.getCmp('btnaceptaraddnormaPlanes').disable();
                    Ext.getCmp('btnaplicaraddnormaPlanes').disable();
                } else {
                    Ext.getCmp('btnaceptaraddnormaPlanes').enable();
                    Ext.getCmp('btnaplicaraddnormaPlanes').enable();
                }
            },
            rowdeselect: function() {
                cmGpAddNormaPlanes.setColumnHeader(0, '');
                cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
            }
        }

    });

    var cmGpAddNormaPlanes = new Ext.grid.ColumnModel([
        checkColumnAddNormaPlanes, {
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: false,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            id: 'umedida',
            header: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'umedida'
        }, {id: 'precio',
            header: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            dataIndex: 'precio'
        }, {
            header: perfil.etiquetas.lbNumPieza,
            width: 120,
            sortable: true,
            dataIndex: 'numeropieza'
        }, {
            id: 'centrobalance',
            header: perfil.etiquetas.lbCentroBalance,
            sortable: true,
            dataIndex: 'centrobalance'
        }, {
            id: 'via',
            header: perfil.etiquetas.lbViaAdquisicion,
            sortable: true,
            dataIndex: 'viaadquisicion'
        }
    ]);

    var smGpAddNormaPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    stGpAddNormaPlanes = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            load: function() {
                siexisteIndEnModeloFiltradoPlanes();
            },
            beforeload: function() {
                setTituloFiltrar();
                this.baseParams.start = offset;
                this.baseParams.identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                this.baseParams.tipoplan = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'estado'
            }, {
                name: 'idformato'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }, {
                name: 'precio'
            }, {
                name: 'umedida'
            }, {
                name: 'numeropieza'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'viaadquisicion'
            }])
    });

    var cmUidMedPlanes = new Ext.form.ComboBox({
        store: stCmbUMPlanes,
        width: 100,
        fieldLabel: perfil.etiquetas.lbUnidadMedida,
        emptyText: perfil.etiquetas.lbSeleccione,
        valueField: 'idunidadmedida',
        displayField: 'nombreum',
        id: 'cmUidMed',
        mode: 'remote',
        //editable:false,
        anchor: '95%',
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });

    var cbEspecialidadNormaPlanes = new Ext.form.ComboBox({
        id: 'cbEspecialidadNorma',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: new Ext.data.Store({
            url: 'listarEspecialidades',
            reader: new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'data'
            }, [{
                    name: 'idespecialidad'
                }, {
                    name: 'denespecialidad'
                }]),
            listeners: {
                load: function(x, y, z) {
                }
            }
        }),
        valueField: 'idespecialidad',
        displayField: 'denespecialidad',
        mode: 'remote',
        editable: false,
        triggerAction: 'all',
        width: 120,
        fieldLabel: 'Especialidad',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });

    var gpAddNormaPlanes = new Ext.grid.GridPanel({
        store: stGpAddNormaPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: cmGpAddNormaPlanes,
        sm: checkColumnAddNormaPlanes,
        autoExpandColumn: 'expandir',
        region: 'center',
        plugins: filtrosindicadoresPlanes,
        id: 'gpAddNorma',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptAddInd',
            store: stGpAddNormaPlanes,
            displayInfo: true,
            items: [{
                    xtype: 'tbseparator'
                }, {
                    iconCls: 'limpiar',
                    tooltip: "Limpiar",
                    id: 'btntodos',
                    handler: function() {
                        filtrosindicadoresPlanes.clearFilters();
                        stGpAddNormaPlanes.reload();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        })
    });

    winAddNormaPlanes = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 950,
        layout: 'fit',
        items: gpAddNormaPlanes,
        height: 500,
        title: perfil.etiquetas.lbAdicionarIndicador,
        listeners: {
            show: function() {
                stCmbUMPlanes.load();
                stGpAddNormaPlanes.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            },
            hide: function() {
                // filtrosindicadores.clearFilters();
            }
        },
        buttons: [{
                id: 'idcancelPlanes',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function() {
                    if (apl == true) {
                        stGpGestModeloPlanes.reload();
                        apl = false;
                    }
                    winAddNormaPlanes.hide();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');

                }
            }, {
                disabled: true,
                id: 'btnaplicaraddnormaPlanes',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: perfil.etiquetas.lbAplicar,
                handler: function() {
                    apl = true;
                    adicionarIndicadores();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }, {
                disabled: true,
                id: 'btnaceptaraddnormaPlanes',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function() {
                    adicionarIndicadores();
                    winAddNormaPlanes.hide();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }]
    });

    winAddNormaPlanes.show();

}//Fin de Declaracion


function adicionarIndicadores() {
    var indicadoresPlanes = new Array();
    var msg = Ext.MessageBox.show({
        title: perfil.etiquetas.lbEspere,
        msg: 'Adicionando indicador(es).',
        width: 250,
        wait: true,
        progress: true,
        closable: false

    });
    if (checkColumnAddNormaPlanes.hasSelection())
        for (p in checkColumnAddNormaPlanes.getSelections()) {
            if (checkColumnAddNormaPlanes.getSelections()[p].id)
                indicadoresPlanes.push(checkColumnAddNormaPlanes.getSelections()[p].id);
        }

    Ext.Ajax.request({
        url: 'adicionarindicadores',
        params: {
            idmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo,
            tipoplan: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan,
            indicadores: Ext.encode(indicadoresPlanes),
            identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
            idejercicio: cbEjercicioPlanes.getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg != 1) {
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                recargarindplanes();
            }
            msg.hide();
            stGpGestModeloPlanes.reload();
        }
    });
}
function recargarindplanes() {
    stGpGestModeloPlanes.reload()
}
function setTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadoresPlanes.getFiltrosActivos() == undefined || filtrosindicadoresPlanes.getFiltrosActivos().length == 0) {
        winAddNormaPlanes.setTitle(perfil.etiquetas.lbAdicionarIndicador);
    } else {
        for (i = 0; i < filtrosindicadoresPlanes.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "precio") {//
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "umedida") {//
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            }
            if (i == filtrosindicadoresPlanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        winAddNormaPlanes.setTitle(perfil.etiquetas.lbAdicionarIndicador + ' / ' + perfil.etiquetas.lbFiltradoPor + filtrado_por);
        filtrado_por = "";
    }
}

function exportarIndicadoresEnmarc() {
    var win = window.open('exportar?identidad=' + identidadselectedPlanes + '&idejercicio=' + cbEjercicioPlanes.getValue()
            + '&entidad=' + denom_ent);
}