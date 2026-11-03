/*deslgoseporviaadquisicion.js
 * Vista para gestionar los desgloses por via de adquisicion
 * @author: Erlien Romero Nicles
 * @package: Plataforma Integral de Planificacion
 * @subpackage: Planificacion Materias y Financiera
 * @copyright: Planificacion
 * @version: 1.0-0
 */
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};

//***************variables****************

UCID.portal.cargarEtiquetas('priorizarplanes', cargarAccionesP);

objci = {};
objci.acciones = [];
var identidadselected = null;
var subir = false;
var bajar = false;
var termine_cargar = false;
var prioini = 1;
var modifRecords = [];

function cargarAccionesP() {
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        termine_cargar = true;
    })
    cargarInterfaz();
}

function cargarInterfaz() {

    var _this = this;

    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        tooltip: perfil.etiquetas.lbTtGuardarPriorización + ' <b>(Alt+G)</b>',
        iconCls: 'guardar',
        //text: 'Guardar',
        handler: function () {
            guardarPriorizarPlanes();
        }
    });

    btnLimpiarfil = new Ext.Button({
        id: 'btnLimpiarfil',
        tooltip: perfil.etiquetas.lbTtLimpiarFiltros + ' <b>(Alt+L)</b>',
        iconCls: 'limpiar',
        // text: perfil.etiquetas.lbBtnLimpiar,
        handler: function () {
            filtrosplanes.clearFilters();
        }
    });

    btnAyudaDesglose = new Ext.Button({
        disabled: false,
        id: 'btnAyuPriorizar',
        tooltip: perfil.etiquetas.lbTtMostrarAyuda + ' <b>(Alt+H)</b>',
        iconCls: 'ayuda'
                //text: 'Ayuda'
    });

    btnSubir = new Ext.Button({
        disabled: true,
        id: 'btnSubir',
        tooltip: perfil.etiquetas.lbTtIncrementarPrioridad,
        iconCls: 'arriba',
        handler: function () {
            subir = true;
            Ordenar('up');
        }
    });

    btnBajar = new Ext.Button({
        disabled: true,
        id: 'btnBajar',
        tooltip: perfil.etiquetas.lbTtDecrementarPrioridad,
        // icon: perfil.dirImg + 'abajo.png',
        iconCls: 'abajo',
        handler: function () {
            bajar = true;
            Ordenar('down');
        }
    });

    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                //gestionarPermiso();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                mymask.show();
                //gestionarPermiso();
                stCmbModelo.reload();
            }
        }
    });

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosplanes = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'prioridad'
            }]
    });
    // Store grid stGpIndicadores
    stGpPlanes = new Ext.data.Store({
        url: 'planesPrioridad',
        listeners: {
            beforeload: function () {
                this.baseParams.chek = Ext.getCmp('chkpresupuesto').getValue();
                this.baseParams.identidad = identidadselected;
                stGpPlanes.baseParams.idejercicio = cbEjercicio.getValue();
                cambiarTituloFiltrarPlanes();
            },
            load: function () {
                smGpPlanes.selectFirstRow(true);
                siexistePlanFiltrado();
                if (stGpPlanes.getCount() > 0)
                    prioini = stGpPlanes.getAt(0).data.prioridad;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idplan"
        }, [{
                name: 'denominacion'
            }, {
                name: 'prioridad'
            }, {
                name: 'idmodelo'
            }, {
                name: 'idejercicio'
            }, {
                name: 'identidadmodelo'
            }]
                )
    });

    loaderTreetpEntidades = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidadesPP',
        listeners: {
            beforeload: function (tl, n) {
                this.baseParams = {
                    valor: Ext.getCmp('idfiltroentpriori').getValue()
                };
            }
        }
    });

    // Selection Model grid smGpGestTipoModelo
    smGpPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, record) {
                btnSubir.enable();
                btnBajar.enable();
                if (row == 0 && record.data.prioridad == 1)
                    btnSubir.disable();
                if (row == stGpPlanes.getCount() - 1)
                    btnBajar.disable();
            },
            rowdeselect: function () {
            },
            beforerowselect: function () {
            }
        }
    });

    GpPlanes = new Ext.grid.GridPanel({
        frame: true,
        plugins: filtrosplanes,
        id: 'GpPlanes',
        height: 1500,
        // width: 800,
        autoWidth: true,
        // autoHeight: true,
        title: perfil.etiquetas.lbPriorizarPlanes,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stGpPlanes,
        region: 'center',
        split: true,
        sm: smGpPlanes,
        columns: [{
                id: 'expandir',
                header: perfil.etiquetas.lbPlan,
                width: 60,
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: perfil.etiquetas.lbTtPlanAPriorizar,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbPrioridad,
                width: 200,
                sortable: true,
                align: 'right',
                dataIndex: 'prioridad',
                tooltip: perfil.etiquetas.lbTtPrioridad,
                renderer: crearToolTip
            }],
        listeners: {
            validateedit: function (sm) {
                idejer = sm.record.data.idejercicio;
            },
            beforeedit: function (e) {
            },
            afteredit: function (sm) {
            }
        },
        tbar: [btnGuardar, '-', btnSubir, '-', btnBajar,
            {
                xtype: 'checkbox',
                boxLabel: perfil.etiquetas.lbPresupuesto,
                id: 'chkpresupuesto',
                listeners: {
                    check: function (ck, t) {
                        if (t == true) {
                            stGpPlanes.reload();
                        } else {
                            stGpPlanes.reload();
                        }
                    }
                }
            }],
        bbar:
                new Ext.PagingToolbar({
                    pageSize: 30,
                    store: stGpPlanes,
                    displayInfo: true,
                    items: [btnLimpiarfil]
                })
    });

    _this.tpEntidades = new Ext.estructura.panel.PanelEstructura(
        {
            cargos: false,
            menu: false,
            width: 600
        });


    _this.tpEntidades.btnBuscar.setText("");
    _this.tpEntidades.btnLimpiar.setText("");
    _this.tpEntidades = tpEntidades.items.items[0];
    _this.tpEntidades.getRootNode().expand();
    _this.tpEntidades.addListener('click', function(n) {

        if (n.text != "Estructuras") {
            _this.tpEntidades.getSelectionModel().select(n);
            identidadselected = n.id;

            if ((n.id != 0) && (objci.acciones.rector)) {
                stGpPlanes.reload({
                    params: {
                        start: 0,
                        limit: 30
                    }
                });
                cbEjercicio.enable();
                panelGeneral.enable(true);
            } else if ((n.id != 0) && (n.attributes._parent != n.id) && (!objci.acciones.rector)) {
                stGpPlanes.reload({
                    params: {
                        start: 0,
                        limit: 30
                    }
                });
                panelGeneral.enable(true);
            }
        }else{
            panelGeneral.disable(true);
            var store = GpPlanes.getStore();
            store.removeAll();
        }

    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                stCalculoCobertura.reload({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        limit: 20,
                        start: 0
                    }
                });
            }
        }
    });


    panelGeneral = new Ext.Panel({
        id: 'panelGeneral',
        labelAlign: 'top',
        region: 'center',
        disabled: true,
        autoHeight: true,
        //  autoWidth: true,
        //height: 850,
        // width: 910,
        frame: true,
        anchor: '100%',
        layout: 'fit',
        tbar: ['->', btnAyudaDesglose],
        items: [GpPlanes/*{
                layout: 'form',
                items: [{
                        //columnWidth: 1,
                        layout: 'form',
                        items: [GpPlanes]
                    }]
            }*/]

    });
    ptestructuras = new Ext.Panel({
        title: 'Entidades',
        id: 'ptestructuras',
        region: 'west',
        collapsible: true,
        split: true,
        width: 200,
        layout: 'fit',
        items: _this.tpEntidades
    });


    // viewport de la plantilla
    vpTipoModelo = new Ext.Viewport({
        layout: 'fit',
        items: {
            xtype: 'panel',
            layout: 'border',
            tbar: ['->', btnAyudaDesglose],
            items: [ptestructuras, panelGeneral],
            listeners: {
                'afterlayout': function () {
                    Ext.getCmp('btnAyuPriorizar').focus(true, 500);
                }
            }
        }
    })
}

function MostrarBarraProgreso(msg) {
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: msg
    });
}

/**************TECLAS CALIENTES********/

map = new Ext.KeyMap(Ext.getDoc(), [
    {
        key: 'lL',
        alt: true,
        fn: function () {
            if (!btnLimpiarfil.hidden) {
                if (!btnLimpiarfil.disabled) {
                    filtrosplanes.clearFilters();

                }
            }
        }
    }, {
        key: 'hH',
        alt: true,
        fn: function () {
            // mostrarAyuda('Priorizar Plan');
        }
    }
    , {
        key: 'gG',
        alt: true,
        fn: function () {
            guardarPriorizarPlanes();
        }
    }, {
        key: 072,
        alt: true,
        fn: function () {
            if (GpPlanes.getSelectionModel()) {
                if (!btnsubir.hidden) {
                    if (!btnsubir.disabled) {
                        subir = true;
                        Ordenar('up');
                    }
                }
            }
        }
    }, {
        key: 080,
        alt: true,
        fn: function () {
            if (GpPlanes.getSelectionModel()) {
                if (!btnbajar.hidden) {
                    if (!btnbajar.disabled) {
                        bajar = true;
                        Ordenar('down');
                    }
                }

            }
        }
    }

]);

//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyudaPriorizarPlanes;
//    var referencia = 'priorizarplan2';
//    help.show(title, referencia);
//}
function siexistePlanFiltrado() {
    if (filtrosplanes.getFiltrosActivos().length > 0 && stGpPlanes.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function cambiarTituloFiltrarPlanes() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosplanes.getFiltrosActivos() == undefined || filtrosplanes.getFiltrosActivos().length == 0)
    {
        GpPlanes.setTitle(perfil.etiquetas.lbPriorizarP);
    } else {
        for (i = 0; i < filtrosplanes.getFiltrosActivos().length; i++) {
            var aux = "";

            if (filtrosplanes.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosplanes.getFiltrosActivos()[i].dataIndex == "prioridad") {
                aux = perfil.etiquetas.lbPrioridad;
            }
            if (i == filtrosplanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        GpPlanes.setTitle(perfil.etiquetas.lbFiltradoPorP + filtrado_por + '</i>');

        filtrado_por = "";
    }
}

function Ordenar(orden) {
    var j = 0;
    var contpri = prioini;
    var recordsSel = GpPlanes.getSelectionModel().getSelected();
    stGpPlanes.each(function (rec) {
        if (stGpPlanes.getAt(j).data.idmodelo == recordsSel.data.idmodelo) {
            var tmpdata = eval(uneval(stGpPlanes.getAt(j).data));
            if (orden == 'up' && j - 1 >= 0) {
                stGpPlanes.getAt(j).data = eval(uneval(stGpPlanes.getAt(j - 1).data));
                stGpPlanes.getAt(j - 1).data = tmpdata;
                stGpPlanes.getAt(j - 1).commit();
                GpPlanes.getSelectionModel().selectRow(j - 1);
            } else {
                if (j + 1 < stGpPlanes.getCount()) {
                    stGpPlanes.getAt(j).data = eval(uneval(stGpPlanes.getAt(j + 1).data));
                    stGpPlanes.getAt(j + 1).data = tmpdata;
                    stGpPlanes.getAt(j + 1).commit();
                    GpPlanes.getSelectionModel().selectRow(j + 1);
                }
            }
            stGpPlanes.getAt(j).commit();
        }
        j++;
    });
    j = 0;
    stGpPlanes.each(function (rec) {
        stGpPlanes.getAt(j).data.prioridad = contpri++;
        stGpPlanes.getAt(j).commit();
        j++;
    });


}

function upColorCellPrio() {
    for (var i = 0; i < stGpPlanes.getCount(); i++) {
        for (var j = 0; j < 12; j++) {

            Ext.get(gpDemanda.getView().getCell(i, j)).applyStyles('background-color:#ccffcc');

        }
    }
}

function guardarPriorizarPlanes() {

    if (stGpPlanes.getCount() != 0) {
        MostrarBarraProgreso('Guardando priorización de planes.');
        array_planes = [];
        for (var i = 0; i < stGpPlanes.getCount(); i++) {

            array_planes.push({
                idmodelo: stGpPlanes.getAt(i).data.idmodelo,
                prioridad: stGpPlanes.getAt(i).data.prioridad,
                entidadmodelo: stGpPlanes.getAt(i).data.identidadmodelo
            })
        }
        Ext.Ajax.request({
            url: 'actualizarPrioridad',
            params: {
                planes_prioridad: Ext.encode(array_planes),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {

                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 21) {
                    mostrarMensaje(1, 'La priorización de los planes ha sido guardada satisfactoriamente.', function () {
                        stGpPlanes.reload();
                    });
                } else
                if (responseData.codMsg == 22)
                    mostrarMensaje(1, 'No existe plan asociado a la entidad seleccionada.');

            }
        });
    } else {
        mostrarMensaje(1, 'Debe existir al menos un plan para priorizar.');
    }

}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

