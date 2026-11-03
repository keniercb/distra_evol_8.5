/*relacionarorganosentidades.js
 * Vista para gestionar la relación entre las entidades y los órganos que satisface
 * @author: Yunior Orosa Velázquez
 * @version: 1.0-0
 */
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
//***************variables****************
UCID.portal.cargarEtiquetas('relacionarorganosentidades', cargarAccionesP);

objci = {};
objci.acciones = [];
var id_entidad_seleccionada = null;
var offsetOrganos = 0, offsetAddOrgano = 0;
/*var subir = false;
 var bajar = false;*/
var prioini = 1;

var textoPaginado = new Ext.form.Label({
    xtype: 'label',
    text: ""
});

function cargarAccionesP() {
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
    })
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaRelacionarorganosentidades',
        iconCls: 'ayuda'
    });
    //Árbol de entidades
    trEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 300
            });
    trEntidades.btnBuscar.setText("");
    trEntidades.btnLimpiar.setText("");
    trEntidades = trEntidades.items.items[0];
    trEntidades.getRootNode().expand();
    trEntidades.region = 'west';
    trEntidades.addListener('click', function (n) {
        id_entidad_seleccionada = n.id;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (id_entidad_seleccionada != 'Estructuras') {
            stGpOrganos.load();
            panelGeneral.enable();
        } else {
            stGpOrganos.loadData({"data": [], "total": 0});
            panelGeneral.disable();
        }
    });
    //*************************************
    stGpOrganos = new Ext.data.Store({
        url: 'listarOrganosRelacionados',
        listeners: {
            beforeload: function (st) {
                this.baseParams.identidad = id_entidad_seleccionada;
                this.baseParams.start = offsetOrganos;
            },
            load: function () {
                cambiarTituloFiltrar(gpOrganos, filtrosOrganos, perfil.etiquetas.lbOrganos);
                if (stGpOrganos.getCount() == 0) {
                    if (filtrosOrganos.getFiltrosActivos() == undefined || filtrosOrganos.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltros);
                    }
                }
                if (stGpOrganos.getCount() > 0) {
                    textoPaginado.setText("Mostrando de 1 - " + stGpOrganos.getCount() + " de " + stGpOrganos.getCount());
                } else {
                    textoPaginado.setText(perfil.etiquetas.msgNoExistenResultados);
                }
                btnGuardar.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idorganosatisfaceentidad'
        }, [{
                name: 'idorganosatisfaceentidad'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'prioridad'
            }])
    });
    smGpOrganos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            selectionchange: function (sm) {
                if (smGpOrganos.getSelections().length > 0) {
                    btnEliminarOrgano.enable();
                    btnSubir.enable();
                    btnBajar.enable();
                } else {
                    btnEliminarOrgano.disable();
                    btnSubir.disable();
                    btnBajar.disable();
                }
            }
        }
    });
    cmGpOrganos = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            width: 180,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPrioridad,
            tooltip: perfil.etiquetas.lbPrioridad,
            dataIndex: 'prioridad',
            align: 'right',
            renderer: crearToolTip
        }]
            );

    filtrosOrganos = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'numeric',
                dataIndex: 'prioridad'
            }]
    });
    btnAdicionarOrgano = new Ext.Button({
        handler: function () {
            winAddOrgano.show();
            stAddOrgano.load();
        },
        tooltip: perfil.etiquetas.lbTtAdicionar,
        id: 'btnAdicionarOrgano',
        iconCls: 'adicionar'
    });
    btnEliminarOrgano = new Ext.Button({
        handler: function () {
            eliminarOrgano();
        },
        tooltip: perfil.etiquetas.lbTtEliminar,
        disabled: true,
        id: 'btnEliminarOrgano',
        iconCls: 'eliminar'
    });
    btnGuardar = new Ext.Button({
        disabled: true,
        id: 'btnGuardar',
        tooltip: perfil.etiquetas.lbGuardar,
        iconCls: 'guardar',
        handler: function () {
            guardarPriorizar();
        }
    });
    btnSubir = new Ext.Button({
        disabled: true,
        id: 'btnSubir',
        tooltip: perfil.etiquetas.lbSubir,
        iconCls: 'arriba',
        handler: function () {
            //subir = true;
            Ordenar('up');
        }
    });
    btnBajar = new Ext.Button({
        disabled: true,
        id: 'btnBajar',
        tooltip: perfil.etiquetas.lbBajar,
        iconCls: 'abajo',
        handler: function () {
            //bajar = true;
            Ordenar('down');
        }
    });
    btnActualizar = new Ext.Button({
        disabled: false,
        id: 'btnActualizar',
        iconCls: 'actualizar',
        tooltip: perfil.etiquetas.lbActualizar,
        handler: function () {
            if (stGpOrganos.reader != undefined)
                stGpOrganos.reload();
        }
    });
    btnLimpiar = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarOrgano',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosOrganos.clearFilters();
        }
    });
    //Fin de botones del grid
    gpOrganos = new Ext.grid.EditorGridPanel({
        store: stGpOrganos,
        sm: smGpOrganos,
        cm: cmGpOrganos,
        //plugins: filtrosOrganos,
        region: 'center',
        autoExpandColumn: 'expandir',
        frame: true,
        title: perfil.etiquetas.lbOrganos,
        height: 300,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAdicionarOrgano, btnGuardar, btnEliminarOrgano, btnSubir, btnBajar, '->', btnAyuda],
        bbar: [btnActualizar, /*'-', btnLimpiar, */'->', textoPaginado]
    });

    /*      ADICIONAR     */
    //Adicionar organos
    checkSmAddOrgano = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                actualizarEstadosAdd();
            },
            rowdeselect: function (sm, indiceFila, record) {
                actualizarEstadosAdd();
            }
        }
    });
    filtrosorganos = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }]
    });
    cmAddOrgano = new Ext.grid.ColumnModel([checkSmAddOrgano, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            width: 180,
            renderer: crearToolTip
        }
    ]);
    stAddOrgano = new Ext.data.Store({
        url: 'listarOrganosAdd',
        listeners: {
            beforeload: function () {
                stAddOrgano.baseParams.identidad = id_entidad_seleccionada;
                stAddOrgano.baseParams.start = offsetAddOrgano;
            },
            load: function () {
                cambiarTituloFiltrar(gpAddOrgano, filtrosorganos, perfil.etiquetas.lbOrganos);
                if (stAddOrgano.getCount() == 0) {
                    if (filtrosorganos.getFiltrosActivos() == undefined || filtrosorganos.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltros);
                    }
                }
                actualizarEstadosAdd();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idorganosatisface'
        }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });
    // Grid panel para los elementos
    btnLimpiarOrgano = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarOrgano',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosorganos.clearFilters();
        }
    });
    gpAddOrgano = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stAddOrgano,
        plugins: filtrosorganos,
        sm: checkSmAddOrgano,
        cm: cmAddOrgano,
        title: perfil.etiquetas.lbOrganos,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        bbar: new Ext.PagingToolbar({
            store: stAddOrgano,
            displayInfo: true,
            items: ['-', btnLimpiarOrgano],
            listeners: {
                beforechange: function (p, e) {
                    offsetAddOrgano = e.start;
                }
            }
        })
    });
    pAddOrgano = new Ext.Panel({
        id: 'pAddOrgano',
        layout: 'fit',
        items: [gpAddOrgano]
    });
    winAddOrgano = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 960,
        layout: 'fit',
        items: pAddOrgano,
        constrain: true,
        height: 500,
        title: perfil.etiquetas.lbTtAdicionar,
        listeners: {
            hide: function () {
                //filtrosorganos.clearFilters();
                stGpOrganos.reload();
            }
        },
        buttons: [{
                id: 'btnAddCancelar',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbTtCancelar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winAddOrgano.hide();
                }
            }, {
                id: 'btnAddAplicar',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.lbTtAplicar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    adicionarOrgano(true);
                }
            }, {
                id: 'btnAddAceptar',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.lbTtAceptar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarOrgano();
                }
            }]
    });
    //FIN del ADICIONAR

    panelGeneral = new Ext.Panel({
        layout: 'border',
        id: 'panelGeneral',
        region: 'center',
        disabled: true,
        height: 30,
        width: 20,
        items: [gpOrganos]
    });

    // viewport de la plantilla
    vpPriorizarEntidades = new Ext.Viewport({
        layout: 'border',
        id: 'vpPriorizarEntidades',
        items: [trEntidades, panelGeneral]
    });
}

function actualizarEstadosAdd() {
    recordsSelAdd = gpAddOrgano.getSelectionModel().getSelections();
    if (recordsSelAdd.length > 0) {
        Ext.getCmp('btnAddAplicar').enable();
        Ext.getCmp('btnAddAceptar').enable();
    } else {
        Ext.getCmp('btnAddAplicar').disable();
        Ext.getCmp('btnAddAceptar').disable();
    }
}

function adicionarOrgano(apl) {
    recordsAdd = gpAddOrgano.getSelectionModel().getSelections();
    organosAdd = [];
    if (recordsAdd.length > 0) {
        for (var i = 0; i < recordsAdd.length; i++) {
            organosAdd.push({
                organo: recordsAdd[i].data
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'adicionarOrganos',
            params: {
                organos: Ext.encode(organosAdd),
                identidad: id_entidad_seleccionada
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    if (apl) {
                        stAddOrgano.reload();
                    } else {
                        winAddOrgano.hide();
                    }
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionarOrganoEntidadSi);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionarOrganoEntidadNo);
                    winAddOrgano.hide();
                }
            }
        });
        gpAddOrgano.getSelectionModel().clearSelections();
    }
}

function eliminarOrgano() {
    recordsDel = gpOrganos.getSelectionModel().getSelections();
    organosDel = [];
    if (recordsDel.length > 0) {
        for (var i = 0; i < recordsDel.length; i++) {
            organosDel.push({
                organo: recordsDel[i].data
            });
        }
        if (organosDel.length > 0) {
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarSingular, eliminar);
        }
    }
    btnEliminarOrgano.disable();
}
function eliminar(keypressed) {
    if (keypressed == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarOrganos',
            params: {
                organos: Ext.encode(organosDel),
                identidad: id_entidad_seleccionada
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    stGpOrganos.reload();
                    mostrarMensaje(1, perfil.etiquetas.msgEliminarOrganoEntidadSi);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgEliminarOrganoEntidadNo);
                }
            }
        });
    }
}
function Ordenar(orden) {
    btnGuardar.enable();
    var j = 0;
    var contpri = prioini;
    var recordsSel = gpOrganos.getSelectionModel().getSelected();
    stGpOrganos.each(function (rec) {
        if (stGpOrganos.getAt(j).data.idorganosatisfaceentidad == recordsSel.data.idorganosatisfaceentidad) {
            var tmpdata = eval(uneval(stGpOrganos.getAt(j).data));
            if (orden == 'up' && j - 1 >= 0) {
                stGpOrganos.getAt(j).data = eval(uneval(stGpOrganos.getAt(j - 1).data));
                stGpOrganos.getAt(j - 1).data = tmpdata;
                stGpOrganos.getAt(j - 1).commit();
                gpOrganos.getSelectionModel().selectRow(j - 1);
            } else {
                if (j + 1 < stGpOrganos.getCount()) {
                    stGpOrganos.getAt(j).data = eval(uneval(stGpOrganos.getAt(j + 1).data));
                    stGpOrganos.getAt(j + 1).data = tmpdata;
                    stGpOrganos.getAt(j + 1).commit();
                    gpOrganos.getSelectionModel().selectRow(j + 1);
                }
            }
            stGpOrganos.getAt(j).commit();
        }
        j++;
    });
    j = 0;
    stGpOrganos.each(function (rec) {
        stGpOrganos.getAt(j).data.prioridad = contpri++;
        stGpOrganos.getAt(j).commit();
        j++;
    });
}

function guardarPriorizar() {
    if (stGpOrganos.getCount() != 0) {
        array_organos = [];
        for (var i = 0; i < stGpOrganos.getCount(); i++) {
            array_organos.push({
                organo: stGpOrganos.getAt(i).data
            })
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'actualizarPrioridad',
            params: {
                organos_prioridad: Ext.encode(array_organos),
                identidad: id_entidad_seleccionada
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 21) {
                    mostrarMensaje(1, perfil.etiquetas.lbOrganosYaPriorizados);
                } else
                if (responseData.codMsg == 22)
                    mostrarMensaje(1, perfil.etiquetas.lbOrganosNoPriorizados);
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.lbDebeExistirEntidad);
    }
    btnGuardar.disable();
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + ' <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}