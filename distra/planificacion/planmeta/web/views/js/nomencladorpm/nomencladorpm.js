var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('nomencladorpm', cargaretiquetas);
var beforeloadstDatoNomenclador = false, idDatonomencladorSel = null, idDatonomencladorEliminar = null, accionDatonomenclador = '';
var idTiponomencladorSel = null, denomTiponomencladorSel = null, descTiponomencladorSel = null, configSistemaTiponomencladorSel = null, accionTiponomenclador = '', ventaaddModTipo = false, idTiponomencladorAddMod = null;
var etiqueta = new Object(), permisoConfigSistema = false;
var textoPaginado = new Ext.form.Label({
    xtype: 'label',
    text: ""
});
function cargaretiquetas() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'permisoConfigSistema') {
                permisoConfigSistema = true;
            }
        }
        initEtiquetas();
    });
}
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
//Porción de codigo dedicada al contenedor de los tipos nomencladores
//Botones de operaciones sobre  tipos nomencladores
    btnAdicionarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnAdicionarTiponomenclador',
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionar,
        disabled: false,
        handler: function () {
            accionTiponomenclador = 'adicionar';
            adicionarModificarTiponomencladorInterfaz();
        }
    });
    btnModificarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnModificarTiponomenclador',
        iconCls: 'modificar',
        tooltip: etiqueta.lbModificar,
        disabled: true,
        handler: function () {
            accionTiponomenclador = 'modificar';
            adicionarModificarTiponomencladorInterfaz();
        }
    });
    btnEliminarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnEliminarTiponomenclador',
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminar,
        disabled: true,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmarEliminarTiponomenclador, eliminarTiponomenclador);
        }
    });
    listarTiponomenclador = new Ext.tree.TreeLoader({
        dataUrl: 'listarTiponomenclador',
        preloadChildren: true,
        listeners: {
            scope: this, beforeload: function (loader, treeNode) {
                loader.baseParams = {
                    permisoConfigSistema: permisoConfigSistema,
                    criteriobusqueda: criteriobusqueda.getValue()
                };
                mymask.show();
            },
            load: function (tree, nodo, res) {
                if (idTiponomencladorAddMod != null) {
                    //acabo de adicionar o modificar
                    nodoTipoNomencladorSel = nodo.findChild("id", idTiponomencladorAddMod);
                    if (idTiponomencladorAddMod != null) {
                        nodoTipoNomencladorSel.select();
                        accionSelectTipoNomenclador(nodoTipoNomencladorSel);
                    }
                    idTiponomencladorAddMod = null;
                } else {
                    //elimine
                    btnModificarTiponomenclador.disable();
                    btnEliminarTiponomenclador.disable();
                    idTiponomencladorSel = null;
                    denomTiponomencladorSel = null;
                    configSistemaTiponomencladorSel = null;
                    descTiponomencladorSel = null;
                    if (typeof (stDatoNomenclador) != 'undefined') {
                        stDatoNomenclador.loadData({"data": [], "total": 0});
                        textoPaginado.setText(etiqueta.msgNoExistenDatos);
                    }
                    if (!ventaaddModTipo)
                        gpDatoNomenclador.disable();
                }
                mymask.hide();
            }
        }
    });
    criteriobusqueda = new Ext.form.TextField({
        maxLength: 255,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        mymaskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: etiqueta.msgSoloALfa,
        allowBlank: true,
        blankText: etiqueta.lbBuscarNomenclador,
        anchor: '100%',
        listeners: {
            change: function (obj, newValue, oldValue) {
                if (newValue != oldValue && newValue != '') {
                    if (newValue.length > 3) {
                        treeTiponomenclador.getRootNode().reload();
                    }
                }
            }
        }
    });
    btnBuscarSeleccionarNomenclador = new Ext.Button({
        iconCls: 'buscar',
        tooltip: etiqueta.lbBuscar,
        handler: function () {
            if (criteriobusqueda.getValue() != '') {
                treeTiponomenclador.getRootNode().reload();
            }
        }
    });
    btnLimpiarSeleccionarNomenclador = new Ext.Button({
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            criteriobusqueda.reset();
            treeTiponomenclador.getRootNode().reload();
        }
    });
    treeTiponomenclador = new Ext.tree.TreePanel({
        id: 'treeTiponomenclador',
        autoScroll: true,
        collapsible: true,
        collapsed: false,
        region: 'west',
        width: 300,
        title: etiqueta.lbTiponomenclador,
        rootVisible: true,
        root: new Ext.tree.AsyncTreeNode({
            text: etiqueta.lbTiponomenclador,
            id: '0'
        }),
        tbar: [btnAdicionarTiponomenclador, btnModificarTiponomenclador, btnEliminarTiponomenclador, '->', criteriobusqueda, '-', btnBuscarSeleccionarNomenclador, btnLimpiarSeleccionarNomenclador],
        listeners: {
            click: function (n, e) {
                accionSelectTipoNomenclador(n);
            }},
        loader: listarTiponomenclador
    });
    treeTiponomenclador.getRootNode().reload();

//Porción de codigo dedicada al grid de datos nomencladores
    stDatoNomenclador = new Ext.data.Store({
        url: 'listarDatonomenclador',
        id: 'stDatoNomenclador',
        listeners: {
            beforeload: function () {
                mymask.show();
                gpDatoNomenclador.disable();
                beforeloadstDatoNomenclador = true;
                cambiarTituloFiltrar(gpDatoNomenclador, filtrosDatoNomenclador, etiqueta.lbDatoNomenclador);
                stDatoNomenclador.baseParams.idtiponomenclador = idTiponomencladorSel;
            },
            load: function (options, success, response) {
                mymask.hide();
                gpDatoNomenclador.enable();
                idDatonomencladorSel == null;
                idDatonomencladorEliminar = null;
                btnModificarDatonomenclador.disable();
                btnEliminarDatonomenclador.disable();
                if (stDatoNomenclador.getCount() == 0) {
                    btnExportarDatoNomenclador.disable();
                    btnOrdenAlfabetico.disable();
                    if (beforeloadstDatoNomenclador) {
                        if (filtrosDatoNomenclador.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatosFiltro);
                            textoPaginado.setText(etiqueta.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                            textoPaginado.setText(etiqueta.msgNoExistenDatos);
                        }
                    }
                } else {
                    btnExportarDatoNomenclador.enable();
                    totalDatos = stDatoNomenclador.getAt(0).data.total;
                    textoPaginado.setText(etiqueta.lbMostrando + totalDatos + etiqueta.lbDe + totalDatos);
                    if (stDatoNomenclador.getCount() > 1 && configSistemaTiponomencladorSel == 0)
                        btnOrdenAlfabetico.enable();
                    else
                        btnOrdenAlfabetico.disable();
                }
                beforeloadstDatoNomenclador = false;
                smDatoNomenclador.clearSelections();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'activacion'
            }, {
                name: 'valordefecto'
            }, {
                name: 'orden'
            }, {
                name: 'configsistema'
            }, {
                name: 'idtiponomenclador'
            }, {
                name: 'total'
            }])
    });
    smDatoNomenclador = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smDatoNomenclador.on('selectionchange', function (sm) {
        idDatonomencladorSel = null;
        idDatonomencladorEliminar = null;
        cantDatosActivados = 0;
        cantDatosDesactivados = 0;
        if (smDatoNomenclador.getSelections().length > 0) {
            //Si hay una fila seleccionada
            if (smDatoNomenclador.getSelections().length == 1) {
                idDatonomencladorSel = smDatoNomenclador.getSelected().data.iddatosnomenclador;
                idDatonomencladorEliminar = smDatoNomenclador.getSelected().data.iddatosnomenclador;
                //Si es configuracion del sistema
                if (smDatoNomenclador.getSelected().data.configsistema == 1 || smDatoNomenclador.getSelected().data.valordefecto == 1) {
                    btnEliminarDatonomenclador.disable();
                } else if (smDatoNomenclador.getSelected().data.configsistema == 0) {
                    btnEliminarDatonomenclador.enable();
                }
                if (smDatoNomenclador.getSelected().data.valordefecto == 1) {
                    btnDefinirValorDefecto.disable();
                } else if (smDatoNomenclador.getSelected().data.valordefecto == 0) {
                    btnDefinirValorDefecto.enable();
                }
                if (smDatoNomenclador.getSelected().data.activacion == 1 && smDatoNomenclador.getSelected().data.valordefecto == 0) {
                    btnActivar.disable();
                    btnDesactivar.enable();
                } else if (smDatoNomenclador.getSelected().data.activacion == 0) {
                    btnActivar.enable();
                    btnDesactivar.disable();
                }
                btnModificarDatonomenclador.enable();
                if (filtrosDatoNomenclador.getFiltrosActivos().length == 0 && smDatoNomenclador.getSelected().data.orden != 1)
                    btnSubir.enable();
                else
                    btnSubir.disable();
                if (filtrosDatoNomenclador.getFiltrosActivos().length == 0 && smDatoNomenclador.getSelected().data.orden != stDatoNomenclador.getCount())
                    btnBajar.enable();
                else
                    btnBajar.disable();
            } else {
                //Si hay mas de una fila seleccionada
                btnDefinirValorDefecto.disable();
                btnModificarDatonomenclador.disable();
                var datosNomencladorSel = smDatoNomenclador.getSelections();
                for (var index = 0; index < datosNomencladorSel.length; index++) {
                    if (datosNomencladorSel[index].data.activacion == 0) {
                        cantDatosDesactivados++;
                    }
                    if (datosNomencladorSel[index].data.activacion == 1 && datosNomencladorSel[index].data.valordefecto == 0) {
                        cantDatosActivados++;
                    }
                    if (idDatonomencladorSel == null) {
                        idDatonomencladorSel = datosNomencladorSel[index].data.iddatosnomenclador;
                    } else {
                        idDatonomencladorSel = idDatonomencladorSel + ',' + datosNomencladorSel[index].data.iddatosnomenclador;
                    }
                    if (datosNomencladorSel[index].data.configsistema == 0 && datosNomencladorSel[index].data.valordefecto == 0) {
                        if (idDatonomencladorEliminar == null) {
                            idDatonomencladorEliminar = datosNomencladorSel[index].data.iddatosnomenclador;
                        } else {
                            idDatonomencladorEliminar = idDatonomencladorEliminar + ',' + datosNomencladorSel[index].data.iddatosnomenclador;
                        }
                    }
                }
                if (cantDatosDesactivados > 0)
                    btnActivar.enable();
                else
                    btnActivar.disable();
                if (cantDatosActivados > 0)
                    btnDesactivar.enable();
                else
                    btnDesactivar.disable();
                if (idDatonomencladorEliminar == null)
                    btnEliminarDatonomenclador.disable();
                else
                    btnEliminarDatonomenclador.enable();

                btnSubir.disable();
                btnBajar.disable();
            }

        } else {
            btnActivar.disable();
            btnDesactivar.disable();
            btnDefinirValorDefecto.disable();
            btnEliminarDatonomenclador.disable();
            btnModificarDatonomenclador.disable();
            btnSubir.disable();
            btnBajar.disable();
        }
    });
    cmDatoNomenclador = new Ext.grid.ColumnModel([
        {
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            width: 300,
            dataIndex: 'denominacion',
            align: 'left',
            renderer: crearToolTip
        },
        {
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            width: 300,
            dataIndex: 'descripcion',
            align: 'left',
            renderer: crearToolTip
        },
        {
            header: etiqueta.lbActivacion,
            tooltip: etiqueta.lbActivacion,
            width: 80,
            align: 'center',
            dataIndex: 'activacion',
            renderer: renderEstado
        },
        {
            header: etiqueta.lbValorDefecto,
            tooltip: etiqueta.lbValorDefecto,
            width: 100,
            align: 'center',
            dataIndex: 'valordefecto',
            renderer: renderEstado
        }
    ]);
    filtrosDatoNomenclador = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'list',
                dataIndex: 'activacion',
                options: [[0, etiqueta.lbNo], [1, etiqueta.lbSi]]
            }, {
                type: 'list',
                dataIndex: 'valordefecto',
                options: [[0, etiqueta.lbNo], [1, etiqueta.lbSi]]
            }]
    });
//Botones de operaciones sobre  datos nomencladores
    btnAdicionarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnAdicionarDatonomenclador',
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionar,
        disabled: false,
        handler: function () {
            accionDatonomenclador = 'adicionar';
            adicionarModificarDatonomencladorInterfaz();
        }
    });
    btnModificarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnModificarDatonomenclador',
        iconCls: 'modificar',
        tooltip: etiqueta.lbModificar,
        disabled: true,
        handler: function () {
            accionDatonomenclador = 'modificar';
            adicionarModificarDatonomencladorInterfaz();
        }
    });
    btnEliminarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnEliminarDatonomenclador',
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminar,
        disabled: true,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmarEliminarDatoNomenclador, eliminarDatonomenclador);
        }
    });
    btnDefinirValorDefecto = new Ext.Toolbar.Button({
        id: 'btnDefinirValorDefecto',
        iconCls: 'actual',
        tooltip: etiqueta.lbDefinirValorDefecto,
        disabled: true,
        handler: function () {
            definirValorDefecto();
        }
    });
    btnActivar = new Ext.Toolbar.Button({
        id: 'btnActivar',
        iconCls: 'habilitar',
        tooltip: etiqueta.lbActivar,
        disabled: true,
        handler: function () {
            activarDesactivar(1);
        }
    });
    btnDesactivar = new Ext.Toolbar.Button({
        id: 'btnDesactivar',
        iconCls: 'deshabilitar',
        tooltip: etiqueta.lbDesactivar,
        disabled: true,
        handler: function () {
            activarDesactivar(0);
        }
    });
    btnOrdenAlfabetico = new Ext.Toolbar.Button({
        id: 'btnOrdenAlfabetico',
        iconCls: 'ordenarcampos',
        tooltip: etiqueta.lbOrdenAlfabetico,
        disabled: true,
        handler: function () {
            ordenAlfabetico();
        }
    });
    btnSubir = new Ext.Button({
        id: 'btnSubir',
        iconCls: 'arriba',
        tooltip: etiqueta.lbSubir,
        disabled: true,
        handler: function () {
            ordenar('up');
        }
    });
    btnBajar = new Ext.Button({
        id: 'btnBajar',
        iconCls: 'abajo',
        tooltip: etiqueta.lbBajar,
        disabled: true,
        handler: function () {
            ordenar('down');
        }
    });
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        tooltip: etiqueta.lbGuardar,
        disabled: true,
        handler: function () {
            actualizarOrden();
        }
    });
    btnExportarDatoNomenclador = new Ext.Toolbar.Button({
        id: 'btnExportarDatoNomenclador',
        iconCls: 'exportar',
        tooltip: etiqueta.lbExportar,
        disabled: true,
        handler: function () {
            var win = window.open('exportarDatoNomenclador?' + '&filtros=' + Ext.encode(filtrosDatoNomenclador.getFilterData())
                    + '&idtiponomenclador=' + idTiponomencladorSel
                    + '&denomTiponomenclador=' + denomTiponomencladorSel);
        }
    });
    btnImportarDatoNomenclador = new Ext.Button({
        id: 'btnImportarDatoNomenclador',
        iconCls: 'importar',
        tooltip: etiqueta.lbImportarDatos,
        disabled: false,
        handler: function () {
            importarDatosDatonomenclador(etiqueta);
        }
    });
    btnActualizarDatoNomenclador = new Ext.Button({
        disabled: false,
        iconCls: 'actualizar',
        tooltip: etiqueta.lbActualizar,
        handler: function () {
            if (stDatoNomenclador.reader != undefined)
                stDatoNomenclador.reload();
        }
    });
    btnLimpiarDatoNomenclador = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosDatoNomenclador.clearFilters();
        }
    });
    gpDatoNomenclador = new Ext.grid.GridPanel({
        id: 'gpDatoNomenclador',
        title: etiqueta.lbDatoNomenclador,
        store: stDatoNomenclador,
        disabled: true,
        region: 'center',
        sm: smDatoNomenclador,
        cm: cmDatoNomenclador,
        plugins: filtrosDatoNomenclador,
        tbar: [btnAdicionarDatonomenclador, btnModificarDatonomenclador, btnEliminarDatonomenclador, '-', btnDefinirValorDefecto, '-', btnActivar, btnDesactivar, '-', btnOrdenAlfabetico, btnSubir, btnBajar, btnGuardar, '-', btnImportarDatoNomenclador, btnExportarDatoNomenclador],
        bbar: [btnActualizarDatoNomenclador, btnLimpiarDatoNomenclador, '->', textoPaginado],
        listeners: {
            celldblclick: function () {
                if (smDatoNomenclador.getSelections().length == 1) {
                    accionDatonomenclador = 'modificar';
                    adicionarModificarDatonomencladorInterfaz();
                }
            }
        }
    });


//Contenedor visual de la aplicacion: Viewport
    viewportDatoNomenclador = new Ext.Viewport({
        layout: 'border',
        items: [treeTiponomenclador, gpDatoNomenclador]
    });
}

// Funciones auxiliares
function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEstado(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
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
function accionSelectTipoNomenclador(n) {
    if (!n.leaf) {
        btnModificarTiponomenclador.disable();
        btnEliminarTiponomenclador.disable();
        idTiponomencladorSel = null;
        denomTiponomencladorSel = null;
        configSistemaTiponomencladorSel = null;
        descTiponomencladorSel = null;
        if (typeof (stDatoNomenclador) != 'undefined') {
            stDatoNomenclador.loadData({"data": [], "total": 0});
            textoPaginado.setText(etiqueta.msgNoExistenDatos);
        }
        gpDatoNomenclador.disable();
    } else {
        btnModificarTiponomenclador.enable();
        if (n.attributes.configsistema == 0)
            btnEliminarTiponomenclador.enable();
        else
            btnEliminarTiponomenclador.disable();
        idTiponomencladorSel = n.id;
        denomTiponomencladorSel = n.attributes.denominacion;
        configSistemaTiponomencladorSel = n.attributes.configsistema;
        descTiponomencladorSel = n.attributes.descripcion;
        stDatoNomenclador.reload();
    }
}


//Funciones de gestion sobre los tipos nomencladores
function adicionarModificarTiponomencladorInterfaz() {
    btnCancelarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModTiponomencladorCancelar',
        iconCls: 'cancelar',
        tooltip: etiqueta.msgCerrarSinGuardar,
        text: etiqueta.lbCancelar,
        handler: function () {
            winAdicionarModificarTiponomenclador.destroy();
        }
    });
    btnAplicarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModTiponomencladorAplicar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardarSinCerrar,
        text: etiqueta.lbAplicar,
        handler: function () {
            adicionarModificarTiponomenclador();
        }
    });
    btnAceptarTiponomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModTiponomencladorAceptar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardaryCerrar,
        text: etiqueta.lbAceptar,
        handler: function () {
            adicionarModificarTiponomenclador(true);
        }
    });
    if (accionTiponomenclador == 'adicionar') {
        //Adicionar
        tituloWinAddModTiponomenclador = etiqueta.lbAdicionarTiponomenclador;
        botonesTiponomenclador = [btnCancelarTiponomenclador, btnAplicarTiponomenclador, btnAceptarTiponomenclador];
    } else if (accionTiponomenclador == 'modificar') {
        //Modificar
        tituloWinAddModTiponomenclador = etiqueta.lbModificarTiponomenclador;
        botonesTiponomenclador = [btnCancelarTiponomenclador, btnAceptarTiponomenclador];
    }
    denominacionTiponomenclador = new Ext.form.TextField({
        id: 'denominacionTiponomenclador',
        fieldLabel: etiqueta.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: etiqueta.msgMaxLengthTextDenominacion,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d])$/,
        allowBlank: false,
        blankText: etiqueta.lbmsgCampoObligatorio

    });
    descripcionTiponomenclador = new Ext.form.TextArea({
        id: 'descripcionTiponomenclador',
        fieldLabel: etiqueta.lbDescripcion,
        width: 400,
        height: 100,
        anchor: '100%',
        maxLength: 255,
        maxLengthText: etiqueta.msgMaxLengthTextDescripcion,
        allowBlank: true

    });
    fpAdicionarModificarTiponomenclador = new Ext.FormPanel({
        id: 'fpAdicionarTiponomenclador',
        frame: true,
        layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: denominacionTiponomenclador
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: descripcionTiponomenclador
                    }]
            }]
    });
    if (accionTiponomenclador == 'modificar') {
        denominacionTiponomenclador.setValue(denomTiponomencladorSel);
        descripcionTiponomenclador.setValue(descTiponomencladorSel);
    } else {
        denominacionTiponomenclador.reset();
        descripcionTiponomenclador.reset();
    }
    winAdicionarModificarTiponomenclador = new Ext.Window({
        id: 'winAdicionarModificarTiponomenclador',
        title: tituloWinAddModTiponomenclador,
        resizable: false,
        modal: true,
        closeAction: 'destroy',
        width: 400,
        height: 220,
        layout: 'fit',
        items: fpAdicionarModificarTiponomenclador,
        constrain: true,
        buttons: botonesTiponomenclador,
        listeners: {
            beforeshow: function () {
                guardarestadoPaneles();
                ventaaddModTipo = true;
            },
            beforedestroy: function () {
                revertirestadoPaneles();
                ventaaddModTipo = false;
            }
        }
    });
    winAdicionarModificarTiponomenclador.show();
}
function guardarestadoPaneles() {
    estadogpDatosnomencladores = gpDatoNomenclador.disabled;
    gpDatoNomenclador.enable();
}
function revertirestadoPaneles() {
    if (estadogpDatosnomencladores)
        gpDatoNomenclador.disable();
}
function adicionarModificarTiponomenclador(clickAceptar) {
    mymask.show();
    Ext.Ajax.request({
        url: 'addModTiponomenclador',
        params: {
            accion: accionTiponomenclador,
            idtiponomenclador: idTiponomencladorSel,
            denominacion: denominacionTiponomenclador.getValue(),
            descripcion: descripcionTiponomenclador.getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN != 0) {
                if (accionTiponomenclador == 'adicionar') {
                    mostrarMensaje(1, etiqueta.msgAdicionarTiponomencladorOK);
                    if (clickAceptar) {
                        winAdicionarModificarTiponomenclador.destroy();
                    } else {
                        fpAdicionarModificarTiponomenclador.getForm().reset();
                    }
                } else if (accionTiponomenclador == 'modificar') {
                    mostrarMensaje(1, etiqueta.msgModificarTiponomencladorOK);
                    winAdicionarModificarTiponomenclador.destroy();
                }
                treeTiponomenclador.getRootNode().reload();
                if (clickAceptar)
                    idTiponomencladorAddMod = responseData.codMsgN;
            } else {
                if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, etiqueta.msgDenominacionTiponomencladorExiste);
                }
            }
            mymask.hide();
        }
    });
}
function eliminarTiponomenclador(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarTiponomenclador',
            waitMsg: etiqueta.msgEliminandoTiponomenclador,
            params: {
                idtiponomenclador: idTiponomencladorSel
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgEliminarTiponomencladorOK);
                    treeTiponomenclador.getRootNode().reload();
                } else {
                    mostrarMensaje(1, etiqueta.msgEliminarTiponomencladorNO);
                }
                mymask.hide();
            }
        });
    }
}

//Funciones de gestion sobre los datos nomencladores
function adicionarModificarDatonomencladorInterfaz() {
    btnCancelarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModDatonomencladorCancelar',
        iconCls: 'cancelar',
        tooltip: etiqueta.msgCerrarSinGuardar,
        text: etiqueta.lbCancelar,
        handler: function () {
            winAdicionarModificarDatonomenclador.destroy();
        }
    });
    btnAplicarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModDatonomencladorAplicar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardarSinCerrar,
        text: etiqueta.lbAplicar,
        handler: function () {
            adicionarModificarDatonomenclador();
        }
    });
    btnAceptarDatonomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModDatonomencladorAceptar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardaryCerrar,
        text: etiqueta.lbAceptar,
        handler: function () {
            adicionarModificarDatonomenclador(true);
        }
    });
    if (accionDatonomenclador == 'adicionar') {
        //Adicionar
        tituloWinAddModDatonomenclador = etiqueta.lbAdicionarDatonomenclador;
        botonesDatonomenclador = [btnCancelarDatonomenclador, btnAplicarDatonomenclador, btnAceptarDatonomenclador];
    } else if (accionDatonomenclador == 'modificar') {
        //Modificar
        tituloWinAddModDatonomenclador = etiqueta.lbModificarDatonomenclador;
        botonesDatonomenclador = [btnCancelarDatonomenclador, btnAceptarDatonomenclador];
    }
    denominacionDatonomenclador = new Ext.form.TextField({
        id: 'denominacionDatonomenclador',
        fieldLabel: etiqueta.lbDenominacion,
        anchor: '100%',
        maxLength: 255,
        maxLengthText: etiqueta.msgMaxLengthTextDenominacion,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d])$/,
        allowBlank: false,
        blankText: etiqueta.lbmsgCampoObligatorio

    });
    descripcionDatonomenclador = new Ext.form.TextArea({
        id: 'descripcionDatonomenclador',
        fieldLabel: etiqueta.lbDescripcion,
        anchor: '100%',
        maxLength: 255,
        width: 400,
        height: 100,
        maxLengthText: etiqueta.msgMaxLengthTextDescripcion,
        allowBlank: true

    });
    fpAdicionarModificarDatonomenclador = new Ext.FormPanel({
        id: 'fpAdicionarDatonomenclador',
        frame: true,
        layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: denominacionDatonomenclador
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: descripcionDatonomenclador
                    }]
            }]
    });
    if (accionDatonomenclador == 'modificar') {
        denominacionDatonomenclador.setValue(smDatoNomenclador.getSelected().data.denominacion);
        descripcionDatonomenclador.setValue(smDatoNomenclador.getSelected().data.descripcion);
    } else {
        denominacionDatonomenclador.reset();
        descripcionDatonomenclador.reset();
    }
    winAdicionarModificarDatonomenclador = new Ext.Window({
        id: 'winAdicionarModificarDatonomenclador',
        title: tituloWinAddModDatonomenclador,
        resizable: false,
        modal: true,
        closeAction: 'destroy',
        width: 400,
        height: 220,
        layout: 'fit',
        items: fpAdicionarModificarDatonomenclador,
        constrain: true,
        buttons: botonesDatonomenclador,
        listeners: {
            beforeshow: function () {
                guardarestadoPaneles();
            },
            beforedestroy: function () {
                revertirestadoPaneles();
            }
        }
    });
    winAdicionarModificarDatonomenclador.show();
}
function guardarestadoPaneles() {
    estadogpDatosnomencladores = gpDatoNomenclador.disabled;
    gpDatoNomenclador.enable();
}
function revertirestadoPaneles() {
    if (estadogpDatosnomencladores)
        gpDatoNomenclador.disable();
}
function adicionarModificarDatonomenclador(clickAceptar) {
    if (accionDatonomenclador == 'adicionar')
        valordefecto = 0;
    else
        valordefecto = smDatoNomenclador.getSelected().data.valordefecto;
    mymask.show();
    Ext.Ajax.request({
        url: 'addModDatonomenclador',
        params: {
            accion: accionDatonomenclador,
            idtiponomenclador: idTiponomencladorSel,
            denominacion: denominacionDatonomenclador.getValue(),
            descripcion: descripcionDatonomenclador.getValue(),
            iddatosnomenclador: idDatonomencladorSel,
            valordefecto: valordefecto
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (accionDatonomenclador == 'adicionar') {
                    mostrarMensaje(1, etiqueta.msgAdicionarDatonomencladorOK);
                    if (clickAceptar) {
                        winAdicionarModificarDatonomenclador.destroy();
                    } else {
                        fpAdicionarModificarDatonomenclador.getForm().reset();
                    }
                } else if (accionDatonomenclador == 'modificar') {
                    mostrarMensaje(1, etiqueta.msgModificarDatonomencladorOK);
                    winAdicionarModificarDatonomenclador.destroy();
                }
                stDatoNomenclador.reload();
            } else {
                if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, etiqueta.msgDenominacionDatonomencladorExiste);
                }
            }
            mymask.hide();
        }
    });
}
function eliminarDatonomenclador(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarDatonomenclador',
            waitMsg: etiqueta.msgEliminandoDatonomenclador,
            params: {
                iddatosnomenclador: idDatonomencladorEliminar,
                idtiponomenclador: idTiponomencladorSel
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, etiqueta.msgEliminarDatonomencladorNO);
                    stDatoNomenclador.reload();
                }
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgEliminarDatonomencladorOK);
                    stDatoNomenclador.reload();
                } else {
                    mostrarMensaje(1, etiqueta.msgEliminarDatonomencladorAlgunosNO);
                    stDatoNomenclador.reload();
                }
                mymask.hide();
            }
        });
    }
}
function definirValorDefecto() {
    mymask.show();
    Ext.Ajax.request({
        url: 'definirValorDefecto',
        waitMsg: etiqueta.msgDefiniendoValorDefecto,
        params: {
            iddatosnomenclador: idDatonomencladorSel,
            idtiponomenclador: idTiponomencladorSel
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                mostrarMensaje(1, etiqueta.msgDefinirValorDefectoOK);
                stDatoNomenclador.reload();
            } else {
                mostrarMensaje(1, etiqueta.msgDefinirValorDefectoNO);
            }
            mymask.hide();
        }
    });
}
function activarDesactivar(accion) {
    mymask.show();
    if (accion == 1) {
        msgActivacion = etiqueta.msgActivando;
        msgActivacionOK = etiqueta.msgActivadoOK;
        msgActivacionNO = etiqueta.msgActivadoNO;
    } else
    if (accion == 0) {
        msgActivacion = etiqueta.msgDesactivando;
        msgActivacionOK = etiqueta.msgDesactivadoOK;
        msgActivacionNO = etiqueta.msgDesactivadoNO;
    }
    Ext.Ajax.request({
        url: 'activarDesactivar',
        waitMsg: msgActivacion,
        params: {
            iddatosnomenclador: idDatonomencladorSel,
            activacion: accion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                mostrarMensaje(1, msgActivacionOK);
                stDatoNomenclador.reload();
            } else {
                mostrarMensaje(1, msgActivacionNO);
            }
            mymask.hide();
        }
    });
}
function ordenar(orden) {
    btnGuardar.enable();
    var j = 0;
    var prioini = stDatoNomenclador.getAt(0).data.orden;
    var contpri = prioini;
    var recordsSel = smDatoNomenclador.getSelected();
    stDatoNomenclador.each(function (rec) {
        if (stDatoNomenclador.getAt(j).data.iddatosnomenclador == recordsSel.data.iddatosnomenclador) {
            var tmpdata = stDatoNomenclador.getAt(j).data;
            if (orden == 'up' && j - 1 >= 0) {
                stDatoNomenclador.getAt(j).data = stDatoNomenclador.getAt(j - 1).data;
                stDatoNomenclador.getAt(j - 1).data = tmpdata;

                stDatoNomenclador.getAt(j).data.orden = contpri;
                stDatoNomenclador.getAt(j).commit();
                stDatoNomenclador.getAt(j - 1).data.orden = contpri - 1;

                stDatoNomenclador.getAt(j - 1).commit();
                smDatoNomenclador.selectRow(j - 1);
            } else {
                if (j + 1 < stDatoNomenclador.getCount()) {
                    stDatoNomenclador.getAt(j).data = stDatoNomenclador.getAt(j + 1).data;
                    stDatoNomenclador.getAt(j + 1).data = tmpdata;

                    stDatoNomenclador.getAt(j).data.orden = contpri;
                    stDatoNomenclador.getAt(j).commit();
                    postemp = contpri;
                    postemp++;
                    stDatoNomenclador.getAt(j + 1).data.orden = postemp;

                    stDatoNomenclador.getAt(j + 1).commit();
                    smDatoNomenclador.selectRow(j + 1);
                }
            }
            stDatoNomenclador.getAt(j).commit();
        }
        j++;
        contpri++;
    });
}
function actualizarOrden() {
    if (stDatoNomenclador.getCount() != 0) {
        array_DatoNomenclador = [];
        for (var i = 0; i < stDatoNomenclador.getCount(); i++) {
            array_DatoNomenclador.push({
                datonomenclador: stDatoNomenclador.getAt(i).data
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'actualizarOrden',
            params: {
                datonomenclador: Ext.encode(array_DatoNomenclador)
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgOrdenarOK);
                } else
                    mostrarMensaje(1, etiqueta.msgOrdenarNO);
            }
        });
    }
    btnGuardar.disable();
}
function ordenAlfabetico() {
    if (stDatoNomenclador.getCount() > 1) {
        mymask.show();
        Ext.Ajax.request({
            url: 'ordenAlfabetico',
            params: {
                idtiponomenclador: idTiponomencladorSel
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgOrdenarOK);
                    stDatoNomenclador.reload();
                } else
                    mostrarMensaje(1, etiqueta.msgOrdenarNO);
            }
        });
    }
}
