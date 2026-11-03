var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('comportamientoentidaddinamico', cargaretiquetas);
//variable generales
var etiqueta = new Object();
var offsetComportamiento = 0, gpComportamiento;
var uriValorPorDefecto, idValorPorDefecto;
var cmCheckBox_lista = [];
function cargaretiquetas() {
    initEtiquetas();
}
function configurarGridDinamico() {
    Ext.Ajax.request({
        url: 'obtenerColumnasDinamicasComportamientoEntidad',
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.data[0]) {
                cargarInterfaz(responseData.data);
            } else {
                mostrarMensaje(1, etiqueta.lbNoNomenclador);
            }
        }
    });
}
function cargarInterfaz(cf) {
//mascara de cargando
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando

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
    //elementos del grid
    //store de las entidades del grid
    stEntidad = new Ext.data.Store({
        url: 'obtenerEntidadesHijas',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                st.baseParams.identidad = nodoEst.attributes.id;
                st.baseParams.denomentidad = nodoEst.attributes.denominacion;
            },
            load: function () {
                mymask.hide();
                stComportamiento.reload();
                btnDefinirRector.disable();
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
    //elementos dinamicos del grid
    filterDinamico = [];
    filterDinamico.push({
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
    });
    readerdina = [];
    readerdina.push({
        name: 'identidad'
    });
    cmdina = [];
    cmdina.push({
        header: etiqueta.lbEntidad,
        tooltip: etiqueta.lbEntidad,
        id: 'Entidad',
        sortable: true,
        dataIndex: 'identidad',
        renderer: setEntidad
    });
    uricolumnasdinamicas = [];
    var cmCheckBox_contador = 0;
    for (var index = 0; index < cf[0].total; index++) {
        uricolumnasdinamicas.push({
            uridatosnomenclador: cf[index].uridatosnomenclador,
            iddatosnomenclador: cf[index].iddatosnomenclador
        });

        filterDinamico.push({
            type: 'list',
            dataIndex: cf[index].uridatosnomenclador,
            options: [etiqueta.lbSi, etiqueta.lbNo]
        });
        var denomCol = cf[index].uridatosnomenclador;
        if (cf[index].valordefecto != 1) {
            cmCheckBox_lista[cmCheckBox_contador] = new Ext.grid.CheckColumn({
                id: cf[index].uridatosnomenclador,
                header: cf[index].denominacion,
                tooltip: cf[index].denominacion,
                sortable: true,
                dataIndex: cf[index].uridatosnomenclador,
                align: 'center',
                editable: true,
                editor: {
                    xtype: 'checkbox'
                },
                width: 100
            });
            cmdina.push(cmCheckBox_lista[cmCheckBox_contador]);
            cmCheckBox_contador++;
        } else {
            uriValorPorDefecto = cf[index].uridatosnomenclador;
            idValorPorDefecto = cf[index].iddatosnomenclador;
            cmdina.push({
                header: cf[index].denominacion,
                tooltip: cf[index].denominacion,
                dataIndex: cf[index].uridatosnomenclador,
                width: 100,
                sortable: true,
                align: 'center',
                renderer: renderRector
            });
        }
        readerdina.push({
            name: cf[index].uridatosnomenclador
        });
    }
    cmComportamiento = new Ext.grid.ColumnModel(cmdina);
    cmComportamiento.defaultSortable = true;
    filtrosComportamiento = new Ext.grid.GridFilters({
        filters: filterDinamico
    });
    jrstComportamiento = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'jrstComportamiento',
        fields: readerdina
    });
    //store del grid
    stComportamiento = new Ext.data.Store({
        url: 'listarComportamiento',
        method: 'POST',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                st.baseParams.identidad = nodoEst.attributes.id;
                st.baseParams.start = offsetComportamiento;
                st.baseParams.columnas = Ext.encode(uricolumnasdinamicas);
            },
            load: function (t) {
                if (stComportamiento.getCount() == 0) {
                    if (nodoEst.id != 'Estructuras') {
                        mostrarMensaje(1, etiqueta.lbNoDatosBuscados);
                    }
                }
                Ext.getCmp('btnGuardar').disable();
                btnDefinirRector.disable();
                cambiarTituloFiltrar(gpComportamiento, filtrosComportamiento, etiqueta.lbComportamiento);
                mymask.hide();
            }
        },
        reader: jrstComportamiento
    });
    smComportamiento = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        id: 'smComportamiento',
        listeners: {
            rowdeselect: function (sm, rowIndex, record) {
                btnDefinirRector.disable();
            },
            rowselect: function (sm, rowIndex, record) {
                if (record.data[uriValorPorDefecto] == false) {
                    btnDefinirRector.enable();
                }
            }
        }
    });
    //boton para asignar el rector
    btnDefinirRector = new Ext.Button({
        handler: function () {
            mostrarMensaje(2, etiqueta.lbRectorSeg, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    guardarDefinirRector();
                }
            });
        },
        disabled: true,
        iconCls: 'controldepersonal',
        tooltip: etiqueta.lbRector
    });
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        disabled: true,
        tooltip: etiqueta.lbGuardar,
        handler: function () {
            guardarComportamiento();
        }
    });
    switch (cmCheckBox_lista.length) {
        case 0:
            var plugins_obj = [filtrosComportamiento];
            break;
        case 1:
            var plugins_obj = [cmCheckBox_lista[0], filtrosComportamiento];
            break;
        case 2:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], filtrosComportamiento];
            break;
        case 3:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], filtrosComportamiento];
            break;
        case 4:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], filtrosComportamiento];
            break;
        case 5:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], filtrosComportamiento];
            break;
        case 6:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], cmCheckBox_lista[5], filtrosComportamiento];
            break;
        case 7:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], cmCheckBox_lista[5], cmCheckBox_lista[6], filtrosComportamiento];
            break;
        case 8:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], cmCheckBox_lista[5], cmCheckBox_lista[6], cmCheckBox_lista[7], filtrosComportamiento];
            break;
        case 9:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], cmCheckBox_lista[5], cmCheckBox_lista[6], cmCheckBox_lista[7], cmCheckBox_lista[8], filtrosComportamiento];
            break;
        case 10:
            var plugins_obj = [cmCheckBox_lista[0], cmCheckBox_lista[1], cmCheckBox_lista[2], cmCheckBox_lista[3], cmCheckBox_lista[4], cmCheckBox_lista[5], cmCheckBox_lista[6], cmCheckBox_lista[7], cmCheckBox_lista[8], cmCheckBox_lista[9], filtrosComportamiento];
            break;
    }
    //Grid panel de los comportamientos
    gpComportamiento = new Ext.grid.EditorGridPanel({
        title: etiqueta.lbComportamiento,
        region: 'center',
        autoExpandColumn: 'Entidad',
        autoScroll: true,
        enableKeyEvents: true,
        id: 'gpComportamiento',
        disabled: true,
        clicksToEdit: 2,
        store: stComportamiento,
        sm: smComportamiento,
        plugins: plugins_obj,
        cm: cmComportamiento,
        tbar: [btnGuardar, btnDefinirRector],
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
            }
        })
    });
    // viewport de la plantilla
    vpComportamiento = new Ext.Viewport({
        layout: 'border',
        id: 'vpComportamiento',
        items: [tpEstructura, gpComportamiento]
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
//metodo para guardar los comportamientos
function guardarComportamiento() {
    mymask.show();
    var records = gpComportamiento.getStore().getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['identidad'] = record.data['identidad'];
        arreglo.push(rec);
    }
    Ext.Ajax.request({
        url: 'guardarComportamiento',
        params: {
            datos: Ext.encode(arreglo),
            columnas: Ext.encode(uricolumnasdinamicas)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                mostrarMensaje(1, etiqueta.lbGuardarOK);
            } else {
                mostrarMensaje(1, etiqueta.lbGuardarNO);
            }
            stComportamiento.reload();
            btnDefinirRector.disable();
        }
    });
}
//metodo para guardar el rector(valor por defecto)
function guardarDefinirRector() {
    mymask.show();
    var seleccion = smComportamiento.getSelected();
    var identidad = seleccion.data.identidad;
    Ext.Ajax.request({
        url: 'guardarRector',
        params: {
            identidad: identidad,
            iddatosnomenclador: idValorPorDefecto
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 0) {
                mostrarMensaje(1, etiqueta.lbRectorNO);
            } else {
                mostrarMensaje(1, etiqueta.lbRectorOK);
            }
            stComportamiento.reload();
            btnDefinirRector.disable();
        }
    });
}
function cambiarTituloFiltrar(gridPanel, filtro, titulo) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(titulo);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(titulo + " - <i> " + etiqueta.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function renderRector(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
}

