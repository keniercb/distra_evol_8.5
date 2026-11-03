var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('comportamientoentidad', cargarInterfaz);
//variable generales
var offsetComportamiento = 0;
function cargarInterfaz() {
    btnAyudaComportamiento = new Ext.Button({
        id: 'idbtnAyudaComportamiento',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });
    //mascara de cargando
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando

    });
    //boton para asignar el rector
    btnrector = new Ext.Button({
        handler: function () {
            mostrarMensaje(2, '¿Es posible que ya exista una entidad rectora, está seguro que desea continuar?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    guardarRector();
                }
            })
        },
        disabled: true,
        iconCls: 'controldepersonal',
        tooltip: 'Rector'
    });
    //colum model del grid
    var chkorgdemandante = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbOD,
        tooltip: perfil.etiquetas.lbOD,
        sortable: true,
        align: 'center',
        dataIndex: 'od',
        editable: true,
        editor: {
            xtype: 'checkbox'
        },
        width: 120
    });
    var chkcentrobalance = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbCB,
        tooltip: perfil.etiquetas.lbCB,
        sortable: true,
        dataIndex: 'cb',
        align: 'center',
        editable: true,
        editor: {
            xtype: 'checkbox'
        },
        width: 110
    });
    var chkorgejecutor = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbOE,
        tooltip: perfil.etiquetas.lbOE,
        sortable: true,
        dataIndex: 'ejecutor',
        align: 'center',
        editable: true,
        editor: {
            xtype: 'checkbox'
        },
        width: 100
    });
    cmComportamiento = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbEntidad,
            tooltip: perfil.etiquetas.lbEntidad,
            id: 'Entidad',
            sortable: true,
            dataIndex: 'identidad',
            renderer: setEntidad
        },
        chkorgdemandante,
        chkcentrobalance,
        chkorgejecutor,
        {
            header: "Rector",
            dataIndex: 'rector',
            width: 100,
            sortable: true,
            align: 'center',
            renderer: renderRector
        }
    ]);
    cmComportamiento.defaultSortable = true;
    //store de las entidades del grid
    stEntidad = new Ext.data.Store({
        url: 'obtenerEntidadesHijas',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.denomentidad = nodoEst.attributes.denominacion;
            },
            load: function () {
                mymask.hide();
                stComportamiento.reload();
                btnrector.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    //stEntidad = getBuildStore('obtenerEntidadesHijas', 'stEntidad', 'identidad', 'identidad', 'denominacion');
    //filtros del grid de los permisos
    filtrosComportamiento = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'cbEntidad',
                urlcb: 'obtenerEntidadesHijas',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stEntidad,
                autoload: false,
                mode: 'local',
                multiple: 1
            }, {
                type: 'list',
                dataIndex: 'od',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'cb',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'ejecutor',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'rector',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }

        ]
    });
    // ********** SelectionModel del Grid comportamiento ***************
    smComportamiento = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        id: 'smComportamiento',
        listeners: {
            rowdeselect: function (sm, rowIndex, record) {
                btnrector.disable();

            },
            rowselect: function (sm, rowIndex, record) {
                if (record.data.rector === false)
                {
                    btnrector.enable();
                }
            }
        }
    });
    //store del grid de los Comportamiento
    stComportamiento = new Ext.data.Store({
        url: 'listarComportamiento',
        method: 'POST',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.start = offsetComportamiento;
            },
            load: function (t) {
                if (stComportamiento.getCount() == 0) {
                    if (nodoEst.id != 'Estructuras') {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                Ext.getCmp('btnGuardar').disable();
                btnrector.disable();
                mymask.hide();
                cambiarTituloFiltrar(gpComportamiento, filtrosComportamiento, perfil.etiquetas.lbComportamiento);
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idcomportamiento',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'identidad'
            }, {
                name: 'od'
            }, {
                name: 'cb'
            }, {
                name: 'ejecutor'
            }, {
                name: 'rector'
            }
        ])

    });
    //btn LimpiarFiltros
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosComportamiento.clearFilters();
        }
    });
    //btnGuardar
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarComportamiento();
        }
    });
    //Panel de las entidades
    tpEstructura = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEstructura.btnBuscar.setText("");
    tpEstructura.btnLimpiar.setText("");
    tpEstructura = tpEstructura.items.items[0];
    tpEstructura.getRootNode().expand();
    tpEstructura.region = 'west';
    tpEstructura.width = 300;
    tpEstructura.split = true;
    tpEstructura.collapsible = true;
    tpEstructura.addListener('click', function (n) {
        nodoEst = n;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {
            gpComportamiento.enable();
            stEntidad.reload();
            gpComportamiento.enable();
        } else {
            gpComportamiento.disable();
            if (stComportamiento)
                stComportamiento.loadData({"data": [], "total": 0});
        }
    });
    //panel de las estructuras
    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        width: 300,
        collapsible: true,
        split: true,
        items: [tpEstructura]
    });
    //Grid panel de los permisos
    gpComportamiento = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbComportamiento,
        region: 'center',
        autoExpandColumn: 'Entidad',
        autoScroll: true,
        enableKeyEvents: true,
        id: 'gpComportamiento',
        disabled: true,
        clicksToEdit: 2,
        //stripeRows: true,
        store: stComportamiento,
        sm: smComportamiento,
        plugins: [chkorgdemandante, chkcentrobalance, chkorgejecutor, filtrosComportamiento],
        cm: cmComportamiento,
        tbar: [btnGuardar, btnrector],
        listeners: {
            checkcolumn: function () {
                btnGuardar.enable();
            }},
        bbar: new Ext.PagingToolbar({
            store: stComportamiento,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    offsetComportamiento = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });
    //panel General contiene el tree de las entidades y el grid de los permisos
    panelGeneral = new Ext.Panel({
        id: 'panelGeneral',
        //disabled: false,
        region: 'center',
        // split: true,
        layout: 'border',
        items: [pEstructuras, gpComportamiento]
    });
    //panel del componente
    panelGen = new Ext.Panel({
        id: 'panelGen',
        tbar: ['->', btnAyudaComportamiento],
        layout: 'fit',
        items: [panelGeneral]
    });
    // viewport de la plantilla
    vpComportamiento = new Ext.Viewport({
        layout: 'fit',
        id: 'vpComportamiento',
        items: [panelGen]
    });
}


//metodo para renderizar las entidades del gpComportamiento
function setEntidad(value, m) {
    if (value == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {

        for (var i = 0; i < stEntidad.data.items.length; i++)
            if (stEntidad.data.items[i].data.identidad == value) {
                m.attr = 'ext:qtip="' + stEntidad.data.items[i].data.denominacion + '"';
                return stEntidad.data.items[i].data.denominacion;
            }
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    }
}
//metodo para guardar los Permisos
function guardarComportamiento() {
    mymask.show();
    var records = gpComportamiento.getStore().getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['identidad'] = record.data['identidad'];
        rec['od'] = (record.data['od'] === false) ? 0 : 1;
        rec['cb'] = (record.data['cb'] === false) ? 0 : 1;
        rec['ejecutor'] = (record.data['ejecutor'] === false) ? 0 : 1;
        rec['rector'] = (record.data['rector'] === false) ? 0 : 1;
        arreglo.push(rec);
    }

    Ext.Ajax.request({
        url: 'guardarComportamiento',
        params: {
            datos: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarOK);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarNo);
            }
            stComportamiento.reload();
            btnrector.disable();
        }
    });
}
//metodo para guardar el rector
function guardarRector() {
    mymask.show();
    var seleccion = smComportamiento.getSelected();
    var identidad = seleccion.data.identidad;

    Ext.Ajax.request({
        url: 'guardarRector',
        params: {
            identidad: Ext.encode(identidad)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 0) {
                mostrarMensaje(1, perfil.etiquetas.lbRectorNo);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbRectorOK);
            }
            stComportamiento.reload();
            btnrector.disable();
        }
    });
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
        gridPanel.setTitle(etiqueta + " - <i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderRector(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
}

