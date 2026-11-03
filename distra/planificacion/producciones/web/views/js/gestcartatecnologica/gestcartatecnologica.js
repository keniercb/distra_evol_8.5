var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('gestcartatecnologica', preCargarInterfaz);

var nodoEst = null, id_entidad_seleccionada = null, is_leaf = null;
var beforeloadstCT = false;

var offsetCT = 0, columna, gpCaracterizacion,
        arrayIndexDinamicosTodos, arrayIndexDinamicosNum, contJRGrid = 0;

var cmCT = new Ext.grid.ColumnModel([]);
var offsetSeleccIndicador = 0;
var offsetAutor = 0;
var chkGlobal = null;
var aprobada_rector = false;
var cbTipoCarta = null;
var winaddcarta = null;
var addomodCT, duplicar = null;
var idusuarioLog, identidadLog, aux1;
var offsetActCT = 0, offsetActividad = 0, offsetNorma = 0, offsetdin = 0;
var identidadCT, winImp = null, smGpCT, stActividadesCT, stact = 0;
var objci = {};
objci.acciones = [];
var offsetEquipos = 0;
var offsetEquiposAsoc = 0, denomcarta = '', totalda = 0, totaldp = 0, totalgm = 0;
var exportarFichaPDF = 0;

function preCargarInterfaz() {
    stCbTipoCarta = new Ext.data.Store({
        autoLoad: true,
        url: 'listarTiposCartas',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomodelo"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }]
                ),
        listeners: {
            load: function (t, n, e) {
                if (t.reader.jsonData.data[0] != undefined) {
                    cbTipoCarta.setValue(t.reader.jsonData.data[0].idtipomodelo);
                    cargarInterfaz();
                } else {
                    mostrarMensaje(1, "No existe configuración para tipos de cartas.");
                }
            }
        }
    });
    cbTipoCarta = new Ext.form.ComboBox({
        id: 'cbTipoCarta',
        store: stCbTipoCarta,
        valueField: 'idtipomodelo',
        hiddenName: 'idtipomodelo',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                cargarDatos();
            }
        }
    });
}

function cargarInterfaz() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[i/*acciones_reportes[i].abreviatura*/] = acciones_reportes[i].abreviatura;
        }
    });
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaCartTec',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtAyuda,
    });

    //Árbol de entidades
    trEntidadesCarta = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    trEntidadesCarta.btnBuscar.setText("");
    trEntidadesCarta.btnLimpiar.setText("");
    trEntidadesCarta = trEntidadesCarta.items.items[0];
    trEntidadesCarta.getRootNode().expand();
    trEntidadesCarta.region = 'west';
    trEntidadesCarta.width = 250;
    trEntidadesCarta.addListener('click', function (n) {
        nodoEst = n;
        id_entidad_seleccionada = n.id;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (is_leaf) {
            chkGlobal.hide();
        } else {
            chkGlobal.show();
        }
        if (nodoEst.id != 'Estructuras') {
            if (cbTipoCarta.getValue() != undefined)
                cargarDatos();
        } else {
            pGeneral.disable();
            if (typeof (stCT) != 'undefined')
                stCT.removeAll();
        }
        panelact.disable();
        panelact.collapse(true);
        stActividadesCT.removeAll();
    });
    //Para el trabajo con los usuarios a partir de 'idusuario'
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        id: 'stUsuarios',
        reader: new Ext.data.JsonReader({
            root: 'data',
            idusuarioLog: 'idusuarioLog',
            id: 'idusuario'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }]),
        listeners: {
            load: function () {
                idusuarioLog = stUsuarios.reader.jsonData.idusuarioLog;
            }
        }
    });
    stUsuarios.reload();
    //Fin del store Usuarios
    //Para el trabajo con las unidades de medidad a partir de 'idumedida'
    stum = new Ext.data.Store({
        url: 'cargarUnidaddeMedida',
        id: 'stum',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    //Fin del store UM
    stVariable = new Ext.data.Store({
        url: 'cargarVariables',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }])
    });
    stCB = new Ext.data.Store({
        url: 'listarCentroBalance',
        id: 'stCB',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idcentrobalance'
        }, [{
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }])
    });
    stNaturaleza = new Ext.data.Store({
        url: 'listarNaturalezas',
        id: 'stNaturaleza',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'naturaleza'
        }, [{
                name: 'naturaleza'
            }, {
                name: 'denominacion'
            }])
    });
    stComboEntidades = new Ext.data.Store({
        url: 'cargarFiltrosEntidades',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            identidadLog: 'identidadLog',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function () {
                identidadLog = stComboEntidades.reader.jsonData.identidadLog;
            }
        }
    });
    stTotalPlanes = new Ext.data.Store({
        url: 'cargarPlanes',
        id: ' stTotalPlanes',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }])
    });
    stAutorFicha = new Ext.data.Store({
        url: 'listarautorficha',
        id: 'stAutorFicha',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'iddatosautorficha'
        }, [{
                name: 'iddatosautorficha'
            }, {
                name: 'empresasubordinada'
            }, {
                name: 'confeccionada'
            }, {
                name: 'aprobada'
            }, {
                name: 'cargoconf'
            }, {
                name: 'cargoaprob'
            }, {
                name: 'telefonoaprob'
            }, {
                name: 'telefonoconf'
            }]),
        listeners: {
            beforeload: function () {
                stAutorFicha.baseParams.start = offsetAutor;
                cambiarTituloFiltrar(gpAutorFichacosto, filtrosAutor, perfil.etiquetas.lbWinFirmasTitle);
            }
        }
    });

    //Se llaman las acciones de los otros ficheros JS
    addcartatecnologica();
    addactividadcarta();
    //initimportaractividadescarta();

    //Botones del panel
    chkGlobal = new Ext.form.Checkbox({
        id: 'chkGlobal',
        boxLabel: perfil.etiquetas.lbGlobal,
        disabled: false,
        listeners: {
            check: function (ck, t) {
                stCT.reload();
            }
        }
    });
    btnAdicionar = new Ext.Button({
        id: 'btnAdd',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarCT,
        disabled: true,
        handler: function () {
            addomodCT = 0;
            accion = 'adicionar';
            cargarDatosAdicionar();
        }
    });
    btnDuplicar = new Ext.Button({
        id: 'btnDuplicar',
        iconCls: 'duplicar',
        tooltip: perfil.etiquetas.lbDuplicarCT,
        disabled: true,
        handler: function () {
            duplicar = 1;
            duplicarCarta();
        }
    });
    btnModificar = new Ext.Button({
        id: 'btnMod',
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbModificarCT,
        disabled: true,
        handler: function () {
            accionvalidar = 'modificar';
            ModificarCarta();
        }
    });
    btnEliminar = new Ext.Button({
        id: 'btnEli',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarCT,
        disabled: true,
        handler: function () {
            accionvalidar = 'eliminar';
            EliminarCarta();
        }
    });
    //********************menu aprobar*****************
    btnAprobarRector = new Ext.Button({
        id: 'btnAprobarRector',
        iconCls: 'aprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarCT + ' (Rector)',
        listeners: {
            click: function (st) {
                cambiarAprobacion(4, true);
            }
        }
    });
    btnAprobarEspecialista = new Ext.Button({
        id: 'btnAprobarEspecialista',
        iconCls: 'aprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobarCT + ' (Especialista)',
        listeners: {
            click: function (st) {
                cambiarAprobacion(3, false);
            }
        }
    });
    btnDesaprobarRector = new Ext.Button({
        id: 'btnDesaprobarRector',
        iconCls: 'desaprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarCT + ' (Rector)',
        listeners: {
            click: function (st) {
                cambiarAprobacion(1, true);
            }
        }
    });
    btnDesaprobarEspecialista = new Ext.Button({
        id: 'btnDesaprobarEspecialista',
        iconCls: 'desaprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobarCT + ' (Especialista)',
        listeners: {
            click: function (st) {
                cambiarAprobacion(1, false);
            }
        }
    });
    btnActivar = new Ext.Button({
        id: 'btnActivar',
        iconCls: 'habilitar',
        disabled: true,
        tooltip: perfil.etiquetas.lbActivarCT,
        listeners: {
            click: function (st) {
                cambiarEstado(1);
            }
        }
    });
    btnDesactivar = new Ext.Button({
        id: 'btnDesactivar',
        iconCls: 'deshabilitar',
        disabled: true,
        tooltip: perfil.etiquetas.lbDesactivarCT,
        listeners: {
            click: function (st) {
                cambiarEstado(0);
            }
        }
    });
    btnAsociarDepreciacion = new Ext.Button({
        id: 'btnAsociarDepreciacion',
        iconCls: 'asociar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAsociarHerr,
        listeners: {
            click: function (st) {
                denomcarta = (smGpCT.getSelections()[0]).data.denominacion;
                asociarequipos();
                winEquiposAsociados();
            }
        }
    });

    //Menu Exportar
    mbExportar = new Ext.Toolbar.MenuButton({
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        menu: {
            items: [{
                    text: perfil.etiquetas.lbExportarCT,
                    id: 'btnExportarCartas',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportar('cart');
                        }
                    }
                }, {
                    text: perfil.etiquetas.lbExportarCTActividades,
                    id: 'btnExportarCartasyActividades',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportar('cartAct');
                        }
                    }
                }, {
                    text: perfil.etiquetas.lbExportarActCT,
                    id: 'btnExportarCartaconAct',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportarCartaConActividadesOIndicadores('act');
                        }
                    }
                }, {
                    text: perfil.etiquetas.lbExportarIndCT,
                    id: 'btnExportarCartaconInd',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportarCartaConActividadesOIndicadores('ind');
                        }
                    }
                }, {
                    text: perfil.etiquetas.lbExportarFichaCosto + ' (MS Excel)',
                    id: 'btnExportarFichaCosto',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportarFichaPDF = 0;
                            winExportFicha.show();
                        }
                    }
                }, {
                    text: perfil.etiquetas.lbExportarFichaCosto + ' (PDF)',
                    id: 'btnExportarFichaCostoPDF',
                    iconCls: 'exportar',
                    disabled: true,
                    listeners: {
                        click: function () {
                            exportarFichaPDF = 1;
                            winExportFicha.show();
                        }
                    }
                }
            ]
        }
    });
    //Panel de exportar Ficha costo
    filtrosAutor = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'empresasubordinada'
            }, {
                type: 'string',
                dataIndex: 'confeccionada'
            }, {
                type: 'string',
                dataIndex: 'cargoconf'
            }, {
                type: 'string',
                dataIndex: 'telefonoconf'
            }, {
                type: 'string',
                dataIndex: 'aprobada'
            }, {
                type: 'string',
                dataIndex: 'aprobador'
            }, {
                type: 'string',
                dataIndex: 'cargoaprob'
            }, {
                type: 'string',
                dataIndex: 'telefonoaprob'
            }]
    });
    cmAutorFicha = new Ext.grid.ColumnModel([
        {
            header: "Subordinada a",
            width: 100,
            sortable: true,
            dataIndex: 'empresasubordinada',
            renderer: crearToolTip
        }, {
            header: "Confeccionado por",
            width: 120,
            sortable: true,
            dataIndex: 'confeccionada',
            renderer: crearToolTip
        }, {
            header: "Cargo del confeccionador",
            width: 150,
            sortable: true,
            dataIndex: 'cargoconf',
            renderer: crearToolTip
        }, {
            header: "Teléfono del confeccionador",
            width: 150,
            sortable: true,
            dataIndex: 'telefonoconf',
            renderer: crearToolTip
        }, {
            header: "Aprobado por",
            width: 120,
            sortable: true,
            dataIndex: 'aprobada',
            renderer: crearToolTip
        }, {
            header: "Cargo del aprobador",
            width: 120,
            sortable: true,
            dataIndex: 'cargoaprob',
            renderer: crearToolTip
        }, {
            header: "Teléfono del aprobador",
            width: 150,
            sortable: true,
            dataIndex: 'telefonoaprob',
            renderer: crearToolTip
        }
    ]);
    smAutorFicha = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                var selected = smAutorFicha.getSelections();
                if (selected.length > 0) {
                    Ext.getCmp('btnAceptarFicha').enable();
                }
            }, rowdeselect: function () {
                var selected = smAutorFicha.getSelections();
                if (selected.length == 0) {
                    Ext.getCmp('btnAceptarFicha').disable();
                }
            }
        }
    });
    btnLimpiarAutorFicha = new Ext.Button({
        id: 'btnLimpiarAutorFicha',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosAutor.clearFilters();
        }
    });
    gpAutorFichacosto = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbWinFirmasTitle,
        layout: 'fit',
        region: 'center',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        plugins: filtrosAutor,
        store: stAutorFicha,
        cm: cmAutorFicha,
        sm: smAutorFicha,
        clicksToEdit: 2,
        bbar: new Ext.PagingToolbar({
            store: stAutorFicha,
            displayInfo: true,
            items: ['-', btnLimpiarAutorFicha],
            listeners: {
                beforechange: function (p, e) {
                    offsetAutor = e.start;
                }
            }
        }),
        listeners: {}
    });

    var winExportFicha = new Ext.Window({
        closeAction: 'hide',
        frame: true,
        layout: 'fit',
        width: 925,
        height: 600,
        modal: true,
        items: [gpAutorFichacosto],
        buttons: [{
                id: 'btnAceptarFicha',
                iconCls: 'aceptar',
                disabled: true,
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    exportaFicha();
                    winExportFicha.hide();
                }
            }, {
                id: 'btnCancelarFicha',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    smAutorFicha.clearSelections();
                    winExportFicha.hide();
                }
            }],
        listeners: {
            beforeshow: function () {
                stAutorFicha.reload();
            }
        }
    });

    /*********Mapeo de teclas calientes**************/
//        map = new Ext.KeyMap(Ext.getDoc(), [
//        {
//            key: 'Ww',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnDesaprobar)) {
//                    cambiarAprobacion(1);
//                }
//            }
//        }, {
//            key: 'Qq',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnAprobar)) {
//                    cambiarAprobacion();
//                }
//            }
//        },{
//            key: 'Gg',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnGuardarActividadCT)) {
//                    GuardarTodos();
//                }
//            }
//        }, {
//            key: 'Dd',
//            ctrl: true,
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnDuplicarActividadCT)) {
//                    accionvalidar = 'duplicar_Act';
//                    validarAprobacion();
//                }
//            }
//        }, {
//            key: 'Jj',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnActivar)) {
//                    cambiarEstado(1);
//                }
//            }
//        }, {
//            key: 'Kk',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnDesactivar)) {
//                    cambiarEstado(0);
//                }
//            }
//        }, {
//            key: 46,
//            fn: function () {
//                if (validarBtn(btnEliminar)) {
//                    accionvalidar = 'eliminar';
//                    validarAprobacion();
//                }
//            }
//        }
//    ]);
//    map.enable();
//    validarBtn = function (btn) {
//        return btn.hidden == false && !btn.disabled
//    };

    pCT = new Ext.Panel({
        id: 'pCT',
        region: 'center',
        layout: 'fit',
        disabled: false,
        collapsible: true,
        collapsed: false,
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbTipoCarta
            }, cbTipoCarta, '-', btnAdicionar, btnDuplicar, btnModificar, btnEliminar, '-', btnAprobarRector, btnAprobarEspecialista, btnDesaprobarRector, btnDesaprobarEspecialista, '-', btnActivar, btnDesactivar, '-', btnAsociarDepreciacion, '-', mbExportar, '-', chkGlobal]
    });

    panelact = new Ext.Panel({
        layout: 'fit',
        id: 'panelact',
        region: 'south',
        collapsible: true,
        collapsed: true,
        disabled: false,
        height: 300,
        titleCollapse: true,
        split: true,
        title: " ",
        items: [gpActividadesCT]
    });
    //Panel general de las cartas y sus actividades
    pGeneral = new Ext.Panel({
        layout: 'border',
        id: 'pGeneral',
        region: 'center',
        disabled: true,
        items: [panelact, pCT]
    });
    pView = new Ext.Panel({
        id: 'pView',
        layout: 'border',
        region: 'center',
        tbar: ['->', btnAyuda],
        items: [trEntidadesCarta, pGeneral]
    });
    // viewport de la plantilla
    vpCT = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCT',
        items: [pView]
    });
}

function cargarDatos() {
    Ext.Ajax.timeout = 600000; //10min
    mymask.show();
    Ext.Ajax.request({
        url: 'obtenerColumnasDinamicas',
        params: {
            idtipomodelo: cbTipoCarta.getValue()
        },
        callback: function (options, success, response) {
            mymask.hide();
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                reconfgridCT(responseData);
                pCT.add(crearGrid(filtrosCT, stCT, cmCT, pagCT, smGpCT));
                pCT.doLayout();
                stCT.reload();
            } else {
                reconfgridCT();
            }
            pGeneral.enable();
        }
    });
}

function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';

    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}

function reconfgridCT(cf) {
    filterDinamico = [];
    //poner todos los filtros de las columnas fijas
    filterDinamico.push({
        type: 'string',
        dataIndex: 'denominacion'
    });
    filterDinamico.push({
        type: 'listado',
        dataIndex: 'idestructura',
        idcombo: 'idcbentidades',
        valueFieldcb: 'idestructura',
        displayFieldcb: 'denominacion',
        st: stComboEntidades,
        autoload: false,
        mode: 'local'
    });
    filterDinamico.push({
        type: 'listado',
        dataIndex: 'idusuario',
        idcombo: 'idcbusuario',
        valueFieldcb: 'idusuario',
        displayFieldcb: 'nombreusuario',
        st: stUsuarios,
        autoload: false,
        mode: 'local'
    });
    filterDinamico.push({
        type: 'date',
        dataIndex: 'fecha'
    });
    filterDinamico.push({
        type: 'string',
        dataIndex: 'denoindicador'
    });
    filterDinamico.push({
        type: 'listado',
        idcombo: 'idcbmodelo',
        dataIndex: 'idmodelo',
        valueFieldcb: 'idmodelo',
        displayFieldcb: 'denominacion',
        st: stTotalPlanes,
        autoload: false,
        mode: 'local'
    });
    filterDinamico.push({
        type: 'list',
        dataIndex: 'idaprobacion',
        options: [perfil.etiquetas.lbAprobadoRector, perfil.etiquetas.lbAprobado,
            perfil.etiquetas.lbDesaprobado]
    });
    filterDinamico.push({
        type: 'list',
        dataIndex: 'estado',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
    });
    filterDinamico.push({
        type: 'list',
        dataIndex: 'enuso',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
    });
    filterDinamico.push({
        type: 'numeric',
        dataIndex: 'valorrendimiento'
    });
    filterDinamico.push({
        type: 'listado',
        dataIndex: 'idumedidarendimiento',
        idcombo: 'idcbumrendimiento',
        valueFieldcb: 'idunidadmedida',
        displayFieldcb: 'denominacionunidadmedida',
        st: stum,
        autoload: false,
        mode: 'local'
    });
    filterDinamico.push({
        type: 'listado',
        dataIndex: 'idvariablecontrol',
        idcombo: 'idcbvariable',
        valueFieldcb: 'idvariable',
        displayFieldcb: 'denominacionvariable',
        st: stVariable,
        autoload: false,
        mode: 'local'
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    var arrayIndexDinamicos = new Array();
    arrayIndexDinamicosTodos = new Array();
    arrayIndexDinamicosNum = new Array();
    arrayIndexDinamicosCad = new Array();

    readerdina = [];
    readerdina.push({
        name: 'idcartatecnologica'
    });
    readerdina.push({
        name: 'denominacion'
    });
    readerdina.push({
        name: 'idestructura'
    });
    readerdina.push({
        name: 'idusuario'
    });
    readerdina.push({
        name: 'fecha'
    });
    readerdina.push({
        name: 'idindicador'
    });
    readerdina.push({
        name: 'denoindicador'
    });
    readerdina.push({
        name: 'idmodelo'
    });
    readerdina.push({
        name: 'idaprobacion'
    });
    readerdina.push({
        name: 'estado'
    });
    readerdina.push({
        name: 'enuso'
    });
    readerdina.push({
        name: 'valorrendimiento'
    });
    readerdina.push({
        name: 'idumedidarendimiento'
    });
    readerdina.push({
        name: 'idvariablecontrol'
    });
    readerdina.push({
        name: 'idmetodocosecha'
    });
    readerdina.push({
        name: 'idmetodosiembra'
    });
    readerdina.push({
        name: 'idsistemariego'
    });
    //variable para controlar los editores dinamicos de los combos
    //1-es la diferencia entre posicion del arreglo y longitud
    //3-numero de columnas fijas antes de la 1er columna dinamica
    contJRGrid = readerdina.length + 1 - 11;

    cmdina = [];
    cmdina.push({
        header: perfil.etiquetas.lbDenominacion,
        tooltip: perfil.etiquetas.lbDenominacion,
        dataIndex: 'denominacion',
        id: 'expandir',
        sortable: true,
        renderer: crearToolTip
    });
    cmdina.push({
        header: perfil.etiquetas.lbEntidad,
        tooltip: perfil.etiquetas.lbEntidad,
        dataIndex: 'idestructura',
        sortable: true,
        hidden: true,
        width: 120,
        renderer: renderEntidad
    });
    cmdina.push({
        header: perfil.etiquetas.lbProducto,
        tooltip: perfil.etiquetas.lbProducto,
        dataIndex: 'denoindicador',
        sortable: true,
        width: 180,
        renderer: crearToolTip
    });
    cmdina.push({
        header: perfil.etiquetas.lbPlan,
        tooltip: perfil.etiquetas.lbPlan,
        width: 150,
        sortable: true,
        dataIndex: 'idmodelo',
        renderer: renderTotalPlanes
    });
    cmdina.push({
        header: perfil.etiquetas.lbAprobado,
        tooltip: perfil.etiquetas.lbAprobado,
        dataIndex: 'idaprobacion',
        sortable: true,
        width: 60,
        renderer: renderAprobado,
        align: 'center'
    });
    cmdina.push({
        header: perfil.etiquetas.lbActivado,
        tooltip: perfil.etiquetas.lbActivado,
        dataIndex: 'estado',
        sortable: true,
        width: 60,
        renderer: renderActivado,
        align: 'center'
    });
    cmdina.push({
        header: perfil.etiquetas.lbUso,
        tooltip: perfil.etiquetas.lbUso,
        dataIndex: 'enuso',
        sortable: true,
        width: 60,
        renderer: renderActivado,
        align: 'center'
    });
    cmdina.push({
        header: perfil.etiquetas.lbRendimiento,
        tooltip: perfil.etiquetas.lbRendimiento,
        sortable: true,
        dataIndex: 'valorrendimiento',
        width: 90,
        align: 'right',
        renderer: crearToolTip
    });
    cmdina.push({
        header: perfil.etiquetas.lbUM,
        tooltip: perfil.etiquetas.lbUnidadMedida,
        sortable: true,
        dataIndex: 'idumedidarendimiento',
        width: 90,
        renderer: renderUM
    });
    cmdina.push({
        header: perfil.etiquetas.lbVariable,
        tooltip: perfil.etiquetas.lbVariableControl,
        sortable: true,
        dataIndex: 'idvariablecontrol',
        width: 90,
        renderer: renderVariable
    });

    if (cf) {
        for (var index = 0; index < cf.cm.length; index++) {
            if (cf.cm[index].edit.xtype) {
                switch (cf.cm[index].edit.xtype) {
                    case 'numberfield':
                        {
                            //cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                            cf.cm[index].tooltip = cf.cm[index].header;
                            cf.cm[index].align = 'right';
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });
                            var itemsNum = cf.cm;
                            filterDinamico.push({
                                type: 'numeric',
                                dataIndex: itemsNum[index].dataIndex
                            });
                            arrayIndexDinamicosTodos.push(itemsNum[index].dataIndex);
                            arrayIndexDinamicosNum.push(itemsNum[index].dataIndex);
                        }
                        break;
                    case 'datefield':
                        {
                            //cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                            cf.cm[index].editor.format = 'd/m/Y';
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamico.push({
                                type: 'date',
                                dataIndex: cf.cm[index].dataIndex
                            });
                            cf.cm[index].renderer = function (v, m, r, ri, ci, st) {
                                if (v) {
                                    if (typeof (v) == 'string') {
                                        var arreg = v.split('-');
                                        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                        m.attr = 'ext:qtip="' + v + '"';
                                        return v;
                                    } else {
                                        m.attr = 'ext:qtip="' + v.format('d/m/Y') + '"';
                                        return v.format('d/m/Y');
                                    }
                                }
                                return '';
                            }
                        }
                        break;
                    case 'combo':
                        {
                            var item = cf.cm[index].edit;
                            var items = cf.cm;
                            var almacen = new Ext.data.SimpleStore({fields: ['iddatosnomenclador', item.displayField]});
                            var valores = [];
                            for (var j = 0; j < cf.cm[index].edit.store.length; j++) {
                                valores.push(new Ext.data.Record(cf.cm[index].edit.store[j]));
                            }
                            almacen.add(valores);
                            //arreglos de index dinamicos para despues trabajar con ellos
                            arrayIndexDinamicos.push(items[index].dataIndex);
                            arrayIndexDinamicosTodos.push(items[index].dataIndex);
                            cf.cm[index] = {
                                id: items[index].edit.id,
                                header: items[index].header,
                                dataIndex: items[index].dataIndex,
                                sortable: true,
                                width: 180,
                                tooltip: items[index].header,
                                renderer: function (value, cell, rec, row, col) {
                                    var col = col;
                                },
                                editor: new Ext.form.ComboBox({
                                    id: item.id,
                                    hiddenName: item.hiddenName,
                                    name: item.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: item.allowBlank,
                                    emptyText: item.emptyText,
                                    width: 180,
                                    typeAhead: item.typeAhead,
                                    valueField: item.valueField,
                                    displayField: item.displayField,
                                    renderer: crearToolTip,
                                    store: almacen,
                                    listeners: {
                                        select: function (a, b, c) {
                                            for (var i = 0; i < smCT.getSelections().length; i++) {
                                                stCT.getById(smCT.getSelections()[i].id).set(stCT.getById(smCT.getSelections()[i].id).fields.items[columna + contJRGrid].name, a.getValue());
                                            }
                                        }
                                    }
                                })
                            };
                            filterDinamico.push({
                                type: 'listado',
                                dataIndex: items[index].dataIndex,
                                valueFieldcb: 'iddatosnomenclador',
                                st: almacen,
                                displayFieldcb: item.displayField,
                                autoload: false
                            });
                        }
                        break;
                    default:
                        {
                            arrayIndexDinamicosCad.push(cf.cm[index].dataIndex);
                            //Hubo que reimplementar el editor porque daba error con las comillas del regex
                            //cf.cm[index].editor = new Ext.form.TextField({cf.cm[index].edit});
                            cf.cm[index].editor = new Ext.form.TextField({
                                allowBlank: cf.cm[index].edit.allowBlank,
                                anchor: cf.cm[index].edit.anchor,
                                fieldLabel: cf.cm[index].edit.fieldLabel,
                                id: cf.cm[index].edit.id,
                                maxLength: cf.cm[index].edit.maxLength,
                                name: cf.cm[index].edit.name,
                                regex: new RegExp(cf.cm[index].edit.regex.substring(1, cf.cm[index].edit.regex.length - 1)),
                                store: cf.cm[index].edit.store,
                                xtype: cf.cm[index].edit.xtype
                            });
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamico.push({
                                type: 'string',
                                dataIndex: cf.cm[index].dataIndex
                            });
                        }
                        break;
                }
                cmdina.push(cf.cm[index]);
            }
        }
        for (var index = 0; index < cf.rd.length; index++) {
            readerdina.push(cf.rd[index]);
        }
    }
    cmdina.push({
        header: perfil.etiquetas.lbUsuario,
        tooltip: perfil.etiquetas.lbUsuario,
        dataIndex: 'idusuario',
        sortable: true,
        hidden: true,
        width: 120,
        renderer: renderUsuario
    });
    cmdina.push({
        header: perfil.etiquetas.lbFecha,
        tooltip: perfil.etiquetas.lbFecha,
        dataIndex: 'fecha',
        width: 120,
        sortable: true,
        hidden: true,
        align: 'center',
        renderer: renderFechaCT
    });

    jrStGpCT = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'jrStGpCT',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        fields: readerdina
    });
    cmCT = new Ext.grid.ColumnModel(cmdina);
//para recorrer los indices dinamicos y trabajar con el render
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicos[i]);
        cmCT.setRenderer(indiceColumn, function (value, m, rec, row, col) {
            m.attr = 'ext:qtip="' + getRawValue(value, cmCT.getCellEditor(col, row).field, cmCT, col) + '"';
            return getRawValue(value, cmCT.getCellEditor(col, row).field, cmCT, col);
        });
    }
    for (var i = 0; i < arrayIndexDinamicosNum.length; i++) {
        var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicosNum[i]);
        cmCT.setRenderer(indiceColumn, function (value, m) {
            if (value != null) {
                m.attr = 'ext:qtip="' + value + '"';
                return value;
            } else {
                m.attr = 'ext:qtip="' + 0 + '"';
                return 0;
            }
        });
    }
    for (var i = 0; i < arrayIndexDinamicosCad.length; i++) {
        var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicosCad[i]);
        cmCT.setRenderer(indiceColumn, function (value, m) {
            if (value != null) {
                m.attr = 'ext:qtip="' + value + '"';
                return value;
            } else {
                m.attr = 'ext:qtip=""';
                return '';
            }
        });
    }
    stCT = new Ext.data.Store({
        url: 'listarCartas',
        listeners: {
            beforeload: function () {
                stum.clearFilter();
                beforeloadstCT = true;
                stCT.baseParams.identidad = nodoEst.id;
                stCT.baseParams.idtipomodelo = cbTipoCarta.getValue();
                stCT.baseParams.global = chkGlobal.getValue();
                stCT.baseParams.start = offsetCT;
                cambiarTituloFiltrar(Ext.getCmp('gpCT'), filtrosCT, perfil.etiquetas.lbCartasTecnologicas);
            },
            load: function (record) {
                controlarObjetosCT();
                if (stCT.getCount() == 0) {
                    if (beforeloadstCT) {
                        if (filtrosCT.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        }
                    }
                }
                beforeloadstCT = false;
            }
        },
        reader: jrStGpCT
    });
    filtrosCT = new Ext.grid.GridFilters({
        filters: filterDinamico
    });
    btnLimpiarCT = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarCT',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosCT.clearFilters();
            panelact.disable();
            panelact.collapse(true);
            stActividadesCT.removeAll();
        }
    });
    pagCT = new Ext.PagingToolbar({
        store: stCT,
        displayInfo: true,
        items: [btnLimpiarCT],
        listeners: {
            beforechange: function (p, e) {
                offsetCT = e.start;
            }
        }
    });
    smGpCT = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smGpCT',
        listeners: {}
    });
}

function crearGrid(filtrosCT, stCT, cmCT, pagCT, smGpCT) {
    return new Ext.grid.EditorGridPanel({
        store: stCT,
        title: perfil.etiquetas.lbCartasTecnologicas,
        id: 'gpCT',
        region: 'center',
        sm: smGpCT,
        cm: cmCT,
        frame: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosCT,
        margins: '2 2 2 -4',
        bbar: pagCT,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        listeners: {
            beforeedit: function (e) {
                columna = e.column;
                //para el renderer luego
                cmCT.getCellEditor(e.column, e.row).field.renderiza = true;
                e.cancel = true;
            },
            validateedit: function (e) {
                if (e.originalValue != e.value)
                    cmCT.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            click: function (n) {
                controlarObjetosCT();

            }
        }
    });
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderUsuario(value, m) {
    for (i = 0; i < stUsuarios.data.length; i++) {
        if (stUsuarios.data.items[i].data.hasOwnProperty('idusuario') && stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

/*function renderUM(value, m) {
 for (i in stum.data.items) {
 if (stum.data.items[i].data.hasOwnProperty('idunidadmedida') && stum.data.items[i].data.idunidadmedida == value) {
 m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
 return stum.data.items[i].data.denominacionunidadmedida;
 } else if (stum.data.items[i].data.hasOwnProperty('idumedida') && stum.data.items[i].data.idumedida == value) {
 m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacion + '"';
 return stum.data.items[i].data.denominacion;
 }
 }
 m.attr = 'ext:qtip=""';
 return '';
 }*/
function renderUM(value, m) {
    for (i = 0; i < stum.data.length; i++) {
        if (stum.data.items[i].data.hasOwnProperty('idunidadmedida') && stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        } else if (stum.data.items[i].data.hasOwnProperty('idumedida') && stum.data.items[i].data.idumedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacion + '"';
            return stum.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function renderAprobado(val, m) {
    if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobado + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoRector + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbDesaprobado + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderActivado(val, m) {
    if (val == 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function renderVariable(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stVariable.data.items)
        if (stVariable.data.items[i].data.idvariable == value) {
            m.attr = 'ext:qtip="' + stVariable.data.items[i].data.denominacionvariable + '"';
            return stVariable.data.items[i].data.denominacionvariable;
        }
}

function renderEntidad(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stComboEntidades.data.items.length; i++) {
        if (stComboEntidades.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stComboEntidades.data.items[i].data.denominacion + '"';
            return stComboEntidades.data.items[i].data.denominacion;
        }
    }
}

function renderTotalPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    //for (i in stTotalModelos.data.items)
    for (var i = 0; i < stTotalPlanes.data.items.length; i++)
        if (stTotalPlanes.data.items[i].data.idmodelo == value) {
            m.attr = 'ext:qtip="' + stTotalPlanes.data.items[i].data.denominacion + '"';
            return stTotalPlanes.data.items[i].data.denominacion;
        }
}

function renderNaturaleza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stNaturaleza.data.items.length; i++)
        if (stNaturaleza.data.items[i].data.naturaleza == value) {
            m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
            return stNaturaleza.data.items[i].data.denominacion;
        }
}

function renderCentroBalance(value, m) {
    valuecol = getRawValue(value, Ext.getCmp('idcbcentrobalanceindicadornorma'));
    m.attr = 'ext:qtip="' + valuecol + '"';
    return valuecol;
}

function renderNivelPlanif(val, m) {
    if (val == "1") {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
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

function HabilitarEditores(varbool) {
    var ind = cmCT.findColumnIndex('valor');
    cmCT.setEditable(ind, varbool);
    for (var i = 0; i < arrayIndexDinamicosTodos.length; i++) {
        var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicosTodos[i]);
        cmCT.setEditable(indiceColumn, varbool);
    }
}

function controlarObjetosCT() {
    //Objetos del exportar
    Ext.getCmp('btnExportarCartas').disable();
    Ext.getCmp('btnExportarCartasyActividades').disable();
    Ext.getCmp('btnExportarCartaconAct').disable();
    Ext.getCmp('btnExportarCartaconInd').disable();
    Ext.getCmp('btnExportarFichaCosto').disable();
    Ext.getCmp('btnExportarFichaCostoPDF').disable();
    if (stCT.getCount() > 0) {
        Ext.getCmp('btnExportarCartas').enable();
        Ext.getCmp('btnExportarCartasyActividades').enable();
        if (smGpCT.getSelections().length == 1) {
            Ext.getCmp('btnExportarCartaconAct').enable();
            Ext.getCmp('btnExportarCartaconInd').enable();
            Ext.getCmp('btnExportarFichaCosto').enable();
            Ext.getCmp('btnExportarFichaCostoPDF').enable();
        }
    }
    //Fin de los objetos del exportar

    btnAdicionar.disable();
    btnDuplicar.disable();
    btnModificar.disable();
    btnEliminar.disable();
    btnAprobarRector.disable();
    btnAprobarEspecialista.disable();
    btnDesaprobarRector.disable();
    btnDesaprobarEspecialista.disable();
    btnActivar.disable();
    btnDesactivar.disable();
    btnAsociarDepreciacion.disable();

    if (chkGlobal.getValue() == false) {
        //Si NO está en global
        btnAdicionar.enable();
        if (smGpCT.getSelections().length > 0) {
            //si tiene seleccionado...

            if (smGpCT.getSelections().length == 1) {
                //si tiene un único elemento seleccionado
                btnAsociarDepreciacion.enable();
                btnDuplicar.enable();

                if (smGpCT.getSelected().data.idaprobacion == 1) {
                    //si está desaprobado
                    btnModificar.enable();
                    btnEliminar.enable();
                    btnAprobarEspecialista.enable();
                    btnAprobarRector.enable();

                } else {
                    //si está aprobado...
                    if (smGpCT.getSelected().data.idaprobacion == 3) {
                        btnAprobarRector.enable();
                        //si no está en uso
                        if (smGpCT.getSelected().data.enuso == 0) {

                            btnDesaprobarRector.enable();
                            btnDesaprobarEspecialista.enable();
                        }


                    } else if (smGpCT.getSelected().data.idaprobacion == 4) {
                        if (smGpCT.getSelected().data.enuso == 0) {

                            btnDesaprobarRector.enable();
                        }
                    }
                    //si NO esta activado
                    if (smGpCT.getSelected().data.estado == 0) {

                        btnActivar.enable();

                    } else {
                        //si NO esta en uso
                        btnDesactivar.enable();


                    }
                }


            } else {
                //si tiene varios elementos seleccionados
                btnEliminar.enable();
                btnAprobarEspecialista.enable();
                btnAprobarRector.enable();
                btnDesaprobarEspecialista.enable();
                btnDesaprobarRector.enable();
                btnActivar.enable();
                btnDesactivar.enable();
            }
        }
    }

    //Controlar panel
    if (smGpCT.getSelections().length == 1) {
        //si tiene un único elemento seleccionado
        stActividadesCT.reload();
        panelact.expand();
        panelact.enable();
    } else {
        //si tiene varios elementos seleccionados
        panelact.disable();
        panelact.collapse();
        stActividadesCT.removeAll();
    }
}

function renderFechaCT(v, m) {
    if (typeof (v) == 'string') {
        //Se divide la fecha de la hora
        var tempC = v.split(' ');
        // Se divide por "-" y se sustituye por un "/"
        var arreg = tempC[0].split('-');
        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
        // Se muestra la hora hasta los minutos
        var temp = tempC[1].split(':');
        var time = temp[0] + ':' + temp[1];
        m.attr = 'ext:qtip="' + v + " " + time + '"';
        return v;
    } else {
        m.attr = 'ext:qtip="' + v.format('d/m/Y') + '"';
        return v.format('d/m/Y');
    }
}

function renderFecha(val, m) {
    try {
        if (val != null) {
            var temp = val.split(':');
            var tempC = val.split(' ');
            var v = temp[0] + ':' + temp[1];
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }
        return val;
    } catch (err) {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}

function exportar(tipo) {
    var win = window.open('exportar?tipo=' + tipo
            + '&identidad=' + id_entidad_seleccionada
            + '&entidad=' + nodoEst.text
            + '&denominaciontipomodelo=' + cbTipoCarta.getRawValue()
            + '&global=' + chkGlobal.getValue()
            + '&filtros=' + Ext.encode(filtrosCT.getFilterData())
            + '&idtipomodelo=' + cbTipoCarta.getValue());
}

function exportarCartaConActividadesOIndicadores(tipo) {
    var seleccion = smGpCT.getSelected().data;
    var win = window.open('exportarCartaConActividadesOIndicadores?identidad=' + nodoEst.id
            + '&entidad=' + nodoEst.text
            + '&denominaciontipomodelo=' + cbTipoCarta.getRawValue()
            + '&cartatecnologica=' + Ext.encode(seleccion)
            + '&tipo=' + tipo
            + '&idtipomodelo=' + cbTipoCarta.getValue());
}

function exportaFicha() {
    selected = smAutorFicha.getSelections();
    mymask.show();
    var win = window.open('exportarFichaCosto?idcarta=' + Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idcartatecnologica + "&identidad=" + id_entidad_seleccionada + "&iddatosautorficha=" + selected[0].data.iddatosautorficha + "&exportarfichapdf=" + exportarFichaPDF);
    mymask.hide();
    smAutorFicha.clearSelections();
}