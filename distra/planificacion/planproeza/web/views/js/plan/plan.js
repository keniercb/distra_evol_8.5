//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('plan', cargarInterfazPrincipal);
var offsetPlanGestionA = 0;
var offsetPlanGestionA1 = 0;
var offsetDesagPlanGestionB = 0;
var offsetDesagPlanGestionB1 = 0;

var offsetAdicionarDesag = 0;
var entidadSelecc = null;
var entidadSeleccDesag = null;
var entidadEjecutoraSelecc = null;
var entidadProveedoraSelecc = null;
var demandaSelecc = null;
var objci = {};
var comportEntidadLogEjecutor = false;
var comportEntidadLogProveedor = false;
var comportEntidadLogRector = false;
var beforeloadDesagPlanGestionB = false;
//var stPlanGestion = null;
//var stDesagPlanGestion = null;
//var stDesagPlanGestionB1 = null;
objci.acciones = [];
function cargarInterfazPrincipal() {
    Ext.Ajax.request({
        url: 'comportEntidadLog',
        //timeout: 3600000,
        waitMsg: perfil.etiquetas.lbGuardando,
        callback: function(options, success, response) {
            //mymask.hide();
            responseData = Ext.decode(response.responseText);
         
            comportEntidadLog = responseData.data;
            for (i = 0; i < comportEntidadLog.length; i++) {
                if (comportEntidadLog[i].idtipocomportamiento == 1) {
                    comportEntidadLogEjecutor = true;
                } else if (comportEntidadLog[i].idtipocomportamiento == 2) {
                    comportEntidadLogProveedor = true;
                } else if (comportEntidadLog[i].idtipocomportamiento == 3) {
                    comportEntidadLogRector = true;
                }
            }
            if (comportEntidadLogEjecutor == true) {
                cambiarPaneles(1);
            } else if (comportEntidadLogProveedor == true) {
                cambiarPaneles(2);
            }
            else if (comportEntidadLogRector == true) {
                cambiarPaneles(3);
            }

        }
    });
    stum = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarUnidadMedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });

    stEntidadesEjecutor = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesEjecutor',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]), listeners: {
            beforeload: function() {
                stEntidadesEjecutor.baseParams.comp = 'ejecutor';
            }}
    });
    stEntidadesCliente = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesCliente',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]), listeners: {
            beforeload: function() {
                stEntidadesCliente.baseParams.comp = 'organoconsumidor';
            }}
    });
    stCbEntidadesProd = new Ext.data.Store({
        url: 'listarEntidadesProductoras',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidadorganosatisface'
        }, [{
                name: 'identidadorganosatisface'
            }, {
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    stPrograma = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarProgramas',
        id: 'stPrograma',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stDestino = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarDestinos',
        id: 'stDestino',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        autoLoad: true,
        listeners: {
            beforeload: function() {
                //mymask.show();
            }

        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idusuario'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }])
    });


    cargarPanelA();
    cargarPanelA1();
    cargarPanelB();
    cargarPanelB1();
    cargarInterfaz();

}
function cargarInterfaz() {

    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[i] = acciones_reportes[i].abreviatura;
        }
    });
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });


    stCbejercicio = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        listeners: {
            beforeload: function() {
                //mymask.show();
            },
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                // mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function(cb, rec, index) {
                stPlanGestionA.reload();
                //cargarDatos();
                //estadoEjercicio = rec.data.uridatosnomenclador;
            }
        }
    });

    stTipoComportamiento = new Ext.data.Store({
        url: 'obtenerComportamientoEjecutorProductor',
        id: 'stTipoComportamiento',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idtipocomportamiento'
        }, [{
                name: 'idtipocomportamiento'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(t, n, e) {
                cbComportamiento.setValue(stTipoComportamiento.getAt(0).get('idtipocomportamiento'));
                //tabPanelPlan.doLayout();
                //tabPanelPlan.show();
                cambiarPaneles(cbComportamiento.getValue());
                /* stPlanGestion.reload();
                 controlarObjetos();*/
            }, beforeload: function() {


            }
        }
    });
    cbComportamiento = new Ext.form.ComboBox({
        id: 'cbComportamiento',
        store: stTipoComportamiento,
        valueField: 'idtipocomportamiento',
        hiddenName: 'idtipocomportamiento',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function(cb, rec, index) {

                stPlanGestionA.reload();
                controlarObjetosAprobacion();
            }
        }
    });

    //Inicio del panel de estructuras
    trEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    trEntidades.btnBuscar.setText("");
    trEntidades.btnLimpiar.setText("");
    trEntidades = trEntidades.items.items[0];
    trEntidades.getRootNode().expand();
    trEntidades.split = true;
    trEntidades.getRootNode().attributes.text = perfil.etiquetas.lbEntidades;
    trEntidades.getRootNode().text = perfil.etiquetas.lbEntidades;
    trEntidades.addListener('click', function(n) {
        nodoEst = n;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {
            entidadSelecc = nodoEst.id;
            pPlanGestionA.show();
            pPlanGestionA1.show();
            pDesagPlanGestionB.show();
            pDesagPlanGestionB1.show();
            obterComportamientoPorEntidad(nodoEst);
        } else {
            pPlanGestionA.hide();
            pPlanGestionA1.hide();
            pDesagPlanGestionB.hide();
            pDesagPlanGestionB1.hide();

            mostrarMensaje(2, "Operacion no realizada satisfactoriamente");
            tabPanelPlan.disable();
            itemID = tabPanelPlan.getActiveTab().getItemId();
                if (itemID == "tabPlanProveedor") {
                    if (stPlanGestionA.reader != undefined)
                        stPlanGestionA.loadData({"data": [], "total": 0});
                    if (stDesagPlanGestionB.reader != undefined)
                        stDesagPlanGestionB.loadData({"data": [], "total": 0});
                } else if (itemID == "tabPlanRector") {
                    if (stPlanGestionA.reader != undefined)
                        stPlanGestionA.loadData({"data": [], "total": 0});
                } else if (itemID == "tabPlanEjecutor") {
                    if (stDesagPlanGestionB1.reader != undefined)
                        stDesagPlanGestionB1.loadData({"data": [], "total": 0});
                }

        }
    });
    pEntidades = new Ext.Panel({
        id: 'pEntidades',
        layout: 'fit',
        region: 'west',
        width: 250,
        split: true,
        collapsible: true,
        titleCollapse: true,
        title: perfil.etiquetas.lbEstructura,
        items: [trEntidades]
    });

    tabPanelPlan = new Ext.TabPanel({
        activeTab: 0,
        id: 'tabPlanGestion',
        region: 'center',
        plain: true,
        disabled: true,
        defaults: {autoScroll: true},
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEjercicio + ': '
            }, cbEjercicio, {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbComportamiento + ': '
            }, cbComportamiento/*, '->', btnAyuda*/],
        items: [{
                id: 'tabPlanRector',
                title: 'Gestionar plan',
                layout: 'fit',
                items: [pPlanGestionA1],
                listeners: {
                    activate: function() {
                    }
                }
            }, {
                id: 'tabPlanProveedor',
                title: 'Gestionar plan',
                layout: 'border',
                items: [pPlanGestionA, pDesagPlanGestionB],
                listeners: {
                    activate: function() {
                    }
                }
            }, {
                id: 'tabPlanEjecutor',
                title: 'Gestionar desagregación',
                layout: 'fit',
                items: [pDesagPlanGestionB1],
                listeners: {
                    activate: function() {
                    }
                }
            }
        ]
    });
    btnAyuda = new Ext.Toolbar.Button({
        text: perfil.etiquetas.lbAyuda,
        tooltip: perfil.etiquetas.lbAyuda,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        id: 'btnAyuda'
    });
    panelView = new Ext.Panel({
        id: 'panelView',
        layout: 'border',
        tbar: ['->', btnAyuda],
        items: [pEntidades, tabPanelPlan]
    });
    myViewGestionarPlanCentral = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });

    //Adicionar Desagregacion
    stAdicionarDesag = new Ext.data.Store({
        url: 'listarEntidadesEjecutoras',
        // pruneModifiedRecords: true,
        listeners: {
            beforeload: function() {
          
                if (entidadSelecc != null) {

                    stAdicionarDesag.baseParams.start = offsetAdicionarDesag;
                    stAdicionarDesag.baseParams.identidad = entidadSelecc;
                    stAdicionarDesag.baseParams.iddemanda = demandaSelecc;


                }
            },
            load: function() {
                // mymask.hide();
                cambiarTituloFiltrar(gpAdicionarDesag, filtrosAddDesag, perfil.etiquetas.lbTitlegpAddDesag);
                gpAdicionarDesag.enable();
                if (stAdicionarDesag.getCount() == 0) {

                    if (filtrosAddDesag.getFiltrosActivos() == undefined || filtrosAddDesag.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                smAdicionarDesag.clearSelections();
                controlarPanelAddDesag();

                //controlarObjetos();

            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'identidad'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }
        ])
    });

    btnLimpiarAdicionarDesag = new Ext.Button({
        id: 'btnLimpiarAdicionarDesag',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosAddDesag.clearFilters();
        }
    });
    btnCancelarAdicionarDesag = new Ext.Button({
        id: 'btnCancelarAdicionarDesag',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        text: perfil.etiquetas.lbCancelar,
        handler: function() {
            winAdicionarDesag.hide();
        }
    });
    btnAplicarAdicionarDesag = new Ext.Button({
        disabled: true,
        id: 'btnAplicarAdicionarDesag',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        text: perfil.etiquetas.lbAplicar,
        handler: function() {
            adicionarDesag(true);
        }
    });
    btnAceptarAdicionarDesag = new Ext.Button({
        disabled: true,
        id: 'btnAceptarAdicionarDesag',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        text: perfil.etiquetas.lbAceptar,
        handler: function() {
            adicionarDesag(false);
        }
    });
    filtrosAddDesag = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    cmAdicionarDesag = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    smAdicionarDesag = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, index, record) {
                controlarPanelAddDesag();
            },
            rowdeselect: function(sm, index, record) {
                controlarPanelAddDesag();
            }
        }
    });

    gpAdicionarDesag = new Ext.grid.GridPanel({
        store: stAdicionarDesag,
        title: perfil.etiquetas.lbTitlegpAddDesag,
        disabled: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        id: 'gpAdicionarDesag',
        sm: smAdicionarDesag,
        cm: cmAdicionarDesag,
        plugins: filtrosAddDesag,
        //margins: '2 2 2 -4',
        //clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            store: stAdicionarDesag,
            pageSize: 20,
            displayInfo: true,
            items: ['-', btnLimpiarAdicionarDesag],
            listeners: {
                beforechange: function(p, e) {
                    offsetAdicionarDesag = e.start;
                }
            }
        }),
        listeners: {
            beforechange: function(p, e) {
                offsetAdicionarDesag = e.start;
            }
        }

    });
    pAdicionarDesag = new Ext.Panel({
        id: 'pAdicionarDesag',
        layout: 'fit',
        region: 'center',
        items: [gpAdicionarDesag]
    });
    winAdicionarDesag = new Ext.Window({
        modal: true,

        closeAction: 'hide',
        layout: 'fit',
        items: [pAdicionarDesag],
        resizable: true,
        height: 300,
        width: 500,
        title: perfil.etiquetas.lbTitleWinAddDesag,
        listeners: {
            hide: function() {
                if (cbComportamiento.getValue() == 1) {
                    stDesagPlanGestionB1.reload();
                } else if (cbComportamiento.getValue() == 2) {
                    stDesagPlanGestionB.reload();
                }

            }, show: function() {
                stAdicionarDesag.reload();

            }
        },
        buttons: [btnCancelarAdicionarDesag, btnAplicarAdicionarDesag, btnAceptarAdicionarDesag]
    });

}
function obterComportamientoPorEntidad(nodoEst) {
    mymask.show();
    Ext.Ajax.request({
        url: 'obtenerComportamientoPorEntidad',
        params: {
            identidad: nodoEst.id
        },
        callback: function(options, success, response) {

            var responseData = Ext.decode(response.responseText);
            identidadESP = responseData;
            if (identidadESP.codMsgN == 1 || (comportEntidadLogRector == true && identidadESP.codMsgN == 2)) {
                stTipoComportamiento.baseParams.identidad = entidadSelecc;
                stTipoComportamiento.reload();
                tabPanelPlan.enable();

            } else {
                mostrarMensaje(2, perfil.etiquetas.msgEntidadNoOD);
                tabPanelPlan.disable();
                itemID = tabPanelPlan.getActiveTab().getItemId();
                if (itemID == "tabPlanProveedor") {
                    if (stPlanGestionA.reader != undefined)
                        stPlanGestionA.loadData({"data": [], "total": 0});
                    if (stDesagPlanGestionB.reader != undefined)
                        stDesagPlanGestionB.loadData({"data": [], "total": 0});
                } else if (itemID == "tabPlanRector") {
                    if (stPlanGestionA.reader != undefined)
                        stPlanGestionA.loadData({"data": [], "total": 0});
                } else if (itemID == "tabPlanEjecutor") {
                    if (stDesagPlanGestionB1.reader != undefined)
                        stDesagPlanGestionB1.loadData({"data": [], "total": 0});
                }



            }

        }
    });
    mymask.hide();
}
function configurarPanel(v) {

    if (v == 1) {

        // pPlan.layout = 'fit';
        pPlan.add(pDesagPlanGestion);
        pPlan.doLayout();

    } else if (v == 2) {
     
        // pPlan.layout = 'border';
        pPlan.add(pPlanGestion);
        //pPlan.add(pDesagPlanGestion);
        pPlan.doLayout();

    }

}
function crearToolTip(val, m) {
    if (val == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}
function renderNaturaleza(value, m) {
    if (value == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {
        m.attr = 'ext:qtip="' + value + '"';
        for (var i = 0; i < stNaturaleza.data.items.length; i++)
            if (stNaturaleza.data.items[i].data.naturaleza == value) {
                m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
                return stNaturaleza.data.items[i].data.denominacion;
            }
    }
}

function renderUM(value, m) {
    for (var i = 0; i < stum.getTotalCount(); i++) {
        if (stum.data.items[i].data.idunidadmedida == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stum.data.items[i].data.abreviaturaunidadmedida + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesEjecutor(value, m) {
    for (var i = 0; i < stEntidadesEjecutor.getTotalCount(); i++)
    {
        if (stEntidadesEjecutor.data.items[i].data.idestructura == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stEntidadesEjecutor.data.items[i].data.denominacion + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stEntidadesEjecutor.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesCliente(value, m) {
    for (var i = 0; i < stEntidadesCliente.getTotalCount(); i++)
    {
        if (stEntidadesCliente.data.items[i].data.idestructura == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stEntidadesCliente.data.items[i].data.denominacion + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stEntidadesCliente.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesProd(value, m) {
    for (var i = 0; i < stCbEntidadesProd.getTotalCount(); i++)
    {
        if (stCbEntidadesProd.data.items[i].data.identidad == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stCbEntidadesProd.data.items[i].data.denominacion + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stCbEntidadesProd.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderProgramas(value, m) {

    for (var i = 0; i < stPrograma.getTotalCount(); i++)
    {
        if (stPrograma.data.items[i].data.iddatosnomenclador == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stPrograma.data.items[i].data.denominacion + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stPrograma.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderDestinos(value, m) {

    for (var i = 0; i < stDestino.getTotalCount(); i++)
    {
        if (stDestino.data.items[i].data.iddatosnomenclador == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stDestino.data.items[i].data.denominacion + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stDestino.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderUsuarios(value, m) {

    for (var i = 0; i < stUsuarios.getTotalCount(); i++)
    {
        if (stUsuarios.data.items[i].data.idusuario == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stUsuarios.data.items[i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderAprobacion(val, m) {
    if (val === '1') {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
    } else if (val === '2') {
        m.css = 'icondistra-true amarillo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoEmpresa + '"';
    } else if (val === '3') { //Organo empresarial UIM
        m.css = 'icondistra-true verde';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoCliente + '"';
    } else if (val === '4') { //Organo Rector (UIM)
        m.css = 'icondistra-true azul';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoRector + '"';
    }
}

function renderBinario(val, m) {


    if (val === '1') {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else if (val === '0') {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }


}
function renderUsuarios(value, m) {

    for (var i = 0; i < stUsuarios.getTotalCount(); i++)
    {
        if (stUsuarios.data.items[i].data.idusuario == value) {
//m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            //return stum.data.items[i].data.denominacionunidadmedida;
            return stUsuarios.data.items[i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function crearToolTipDenom(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return '<p style="white-space:pre">' + v + '</p>';
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
        gridPanel.setTitle(etiqueta + " <i> - " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function cambiarPaneles(v) {

    if (v == 1) {
        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanProveedor');
        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanRector');
        //setActiveTab
        Ext.getCmp('tabPlanGestion').setActiveTab('tabPlanEjecutor');
        Ext.getCmp('tabPlanGestion').unhideTabStripItem('tabPlanEjecutor');
        if (entidadSelecc != null)
        {
            stDesagPlanGestionB1.reload();
        }

    } else if (v == 2) {

        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanEjecutor');
        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanRector');
        Ext.getCmp('tabPlanGestion').setActiveTab('tabPlanProveedor');
        Ext.getCmp('tabPlanGestion').unhideTabStripItem('tabPlanProveedor');
        if (entidadSelecc != null)
        {
            stPlanGestionA.reload();
        }


    }
    else if (v == 3) {
        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanEjecutor');
        Ext.getCmp('tabPlanGestion').hideTabStripItem('tabPlanProveedor');
        Ext.getCmp('tabPlanGestion').setActiveTab('tabPlanRector');
        Ext.getCmp('tabPlanGestion').unhideTabStripItem('tabPlanRector');
        if (entidadSelecc != null)
        {
            stPlanGestionA1.reload();
        }
    }

}

function controlarPanelAddDesag() {
    selec = gpAdicionarDesag.getSelectionModel().getSelections();
    if (selec.length > 0) {
        btnAplicarAdicionarDesag.enable();
        btnAceptarAdicionarDesag.enable();
    } else {
        btnAplicarAdicionarDesag.disable();
        btnAceptarAdicionarDesag.disable();
    }
}

function adicionarDesag(apl) {

    recordsAdd = gpAdicionarDesag.getSelectionModel().getSelections();

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
                iddemanda: demandaSelecc


            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                //mymask.hide();
                if (responseData.codMsgN == 1) {
                    if (recordsAdd.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagOK);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsOK);
                    }
                } else if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNOAlgunas);
                } else {
                    if (recordsAdd.length == 2) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNO);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsNO);
                    }
                }
                if (!apl) {
                    gpAdicionarDesag.getSelectionModel().clearSelections();
                    if (cbComportamiento.getValue() == 1) {
                        gpDesagPlanGestionB1.getSelectionModel().clearSelections();
                    } else if (cbComportamiento.getValue() == 2) {
                        gpDesagPlanGestionB.getSelectionModel().clearSelections();
                    }

                    winAdicionarDesag.hide();
                    //ventana = false;
                } else {
                    if (cbComportamiento.getValue() == 1) {
                        stDesagPlanGestionB1.reload();
                    } else if (cbComportamiento.getValue() == 2) {
                        stDesagPlanGestionB.reload();
                    }
                    stAdicionarDesag.reload();
                }



            }
        });
    }
    function guardarDesagPlan() {
        mymask.show();
        if (cbComportamiento.getValue() == 1) {
            recordsMod = gpDesagPlanGestionB1.getStore().getModifiedRecords();
        } else if (cbComportamiento.getValue() == 2) {
            recordsMod = gpDesagPlanGestionB.getStore().getModifiedRecords();
        }

        var arreglo = [];
        while (recordsMod.length > 0) {
            var record = recordsMod.pop();
            var rec = record.getChanges();
       
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
            callback: function(options, success, response) {
mymask.hide();
//            responseData = Ext.decode(response.responseText);
//            if (responseData.codMsgN > 0) {
//                mostrarMensaje(2, obtenerMensajeValidacion(responseData.codMsgN));
//                stHojadeCalculo.reload();
//            } else {
//                if (responseData.codMsgN == 0) {
//                    mostrarMensaje(2, perfil.etiquetas.msgGuardadoOk);
//                    stHojadeCalculo.reload();
//                } else {
//                    mostrarMensaje(2, perfil.etiquetas.msgGuardadoNo);
//                }
//            }
                stDesagPlanGestionB1.reload();
            }
        });
    }
}
