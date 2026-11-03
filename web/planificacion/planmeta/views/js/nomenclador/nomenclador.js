var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('nomenclador', cargaretiquetas);
var etiqueta = new Object(), beforeloadstNomenclador = false, accionNomenclador = '';
var idNomencladorArbol = null, attributesNomencladorArbol = null;
var idNomencladorSel = null, idNomencladorEliminar = null;
var nodoNomenclador = null;
var textoPaginado = new Ext.form.Label({
    xtype: 'label',
    text: ""
});

function cargaretiquetas() {
    initEtiquetas();
}
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
    /*criteriobusqueda = new Ext.form.TextField({
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
                        console.log(1);
                        tpNomenclador.getRootNode().reload();
                        tpNomenclador.getRootNode().expand();
                        stNomenclador.loadData({"data": [], "total": 0});
                        gpNomenclador.disable();
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
                console.log(2);
                tpNomenclador.getRootNode().reload();
                tpNomenclador.getRootNode().expand();
                stNomenclador.loadData({"data": [], "total": 0});
                gpNomenclador.disable();
            }
        }
    });
    btnLimpiarSeleccionarNomenclador = new Ext.Button({
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            console.log(3);
            criteriobusqueda.reset();
            tpNomenclador.getRootNode().reload();
            tpNomenclador.getRootNode().expand();
            stNomenclador.loadData({"data": [], "total": 0});
            gpNomenclador.disable();
        }
    });*/
    loaderTreeNomenclador = new Ext.tree.TreeLoader({
        dataUrl: 'listarNomenclador',
        listeners: {
            scope: this,
//            beforeload: function (loader, treeNode) {
//                loader.baseParams = {
//                    criteriobusqueda: criteriobusqueda.getValue()
//                };
//            },
            load: function (loader, nodo, respuesta) {
                mymask.hide();
            }
        }}
    );

    tpNomenclador = new Ext.tree.TreePanel({
        autoScroll: true,
//        tbar: ['->', criteriobusqueda, '-', btnBuscarSeleccionarNomenclador, btnLimpiarSeleccionarNomenclador],
        border: false,
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        width: 300,
        enableDD: true,
        animate: true,
        listeners: {
            click: function (n, e) {
                nodoNomenclador = n;
                idNomencladorArbol = n.id;
                attributesNomencladorArbol = n.attributes;
                stNomenclador.reload();
            },
            movenode: function (arbol, nodo, viejopadre, nuevopadre, index) {
                if (viejopadre != nuevopadre) {
                    mymask.show();
                    Ext.Ajax.request({
                        url: 'moverRama',
                        params: {
                            idnodo: nodo.id,
                            idviejopadre: viejopadre.id,
                            idnuevopadre: nuevopadre.id
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgN == 1) {
                                mostrarMensaje(1, etiqueta.msgMoverNomencladorOK);
                                tpNomenclador.getRootNode().expand();
                                stNomenclador.loadData({"data": [], "total": 0});
                                gpNomenclador.disable();
                            } else {
                                mostrarMensaje(1, etiqueta.msgMoverNomencladorNO);
                            }
                            mymask.hide();
                        }
                    });
                } else {
                    stNomenclador.loadData({"data": [], "total": 0});
                    gpNomenclador.disable();
                }
            }//,
//            beforeload: function (loader, treeNode) {
//                loader.baseParams = {
//                    criteriobusqueda: criteriobusqueda.getValue()
//                };
//            }
        },
        loader: loaderTreeNomenclador,
        root: {
            nodeType: 'async',
            id: '0',
            draggable: false,
            text: 'Nomencladores',
            tipo: 0,
            leaf: false
        }
    });
    tpNomenclador.getRootNode().expand();

    stNomenclador = new Ext.data.Store({
        url: 'listarGridNomenclador',
        id: 'stNomenclador',
        listeners: {
            beforeload: function () {
                mymask.show();
                gpNomenclador.disable();
                beforeloadstNomenclador = true;
                cambiarTituloFiltrar(gpNomenclador, filtrosNomenclador, etiqueta.lbNomenclador);
                stNomenclador.baseParams.node = idNomencladorArbol;
            },
            load: function (options, success, response) {
                mymask.hide();
                gpNomenclador.enable();
                idNomencladorSel = null;
                idNomencladorEliminar = null;
                btnModificarNomenclador.disable();
                btnEliminarNomenclador.disable();
                if (stNomenclador.getCount() == 0) {
                    btnExportarNomenclador.disable();
                    btnOrdenAlfabetico.disable();
                    if (beforeloadstNomenclador) {
                        if (filtrosNomenclador.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatosFiltro);
                            textoPaginado.setText(etiqueta.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                            textoPaginado.setText(etiqueta.msgNoExistenDatos);
                        }
                    }
                } else {
                    btnExportarNomenclador.enable();
                    totalDatos = stNomenclador.getAt(0).data.total;
                    textoPaginado.setText(etiqueta.lbMostrando + totalDatos + etiqueta.lbDe + totalDatos);
                    if (stNomenclador.getCount() > 1)
                        btnOrdenAlfabetico.enable();
                    else
                        btnOrdenAlfabetico.disable();
                }
                beforeloadstNomenclador = false;
                smNomenclador.clearSelections();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'id'
        }, [{
                name: 'id'
            }, {
                name: 'idnomenclador'
            }, {
                name: 'text'
            }, {
                name: 'descripcion'
            }, {
                name: 'uri'
            }, {
                name: 'activacion'
            }, {
                name: 'valordefecto'
            }, {
                name: 'orden'
            }, {
                name: 'total'
            }, {
                name: '_parent'
            }])
    });
    smNomenclador = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smNomenclador.on('selectionchange', function (sm) {
        idNomencladorSel = null;
        idNomencladorEliminar = null;
        cantActivados = 0;
        cantDesactivados = 0;
        if (smNomenclador.getSelections().length > 0) {
            //Si hay una fila seleccionada
            if (smNomenclador.getSelections().length == 1) {
                idNomencladorSel = smNomenclador.getSelected().data.id;
                idNomencladorEliminar = smNomenclador.getSelected().data.id;
                //Si es valor por defecto
                if (smNomenclador.getSelected().data.valordefecto == 1) {
                    btnEliminarNomenclador.disable();
                }
                if (smNomenclador.getSelected().data.valordefecto == 1) {
                    btnDefinirValorDefecto.disable();
                } else if (smNomenclador.getSelected().data.valordefecto == 0) {
                    btnDefinirValorDefecto.enable();
                }
                if (smNomenclador.getSelected().data.activacion == 1 && smNomenclador.getSelected().data.valordefecto == 0) {
                    btnActivar.disable();
                    btnDesactivar.enable();
                } else if (smNomenclador.getSelected().data.activacion == 0) {
                    btnActivar.enable();
                    btnDesactivar.disable();
                }
                btnModificarNomenclador.enable();
                if (filtrosNomenclador.getFiltrosActivos().length == 0 && smNomenclador.getSelected().data.orden != 1)
                    btnSubir.enable();
                else
                    btnSubir.disable();
                if (filtrosNomenclador.getFiltrosActivos().length == 0 && smNomenclador.getSelected().data.orden != stNomenclador.getCount())
                    btnBajar.enable();
                else
                    btnBajar.disable();
            } else {
                //Si hay mas de una fila seleccionada
                btnDefinirValorDefecto.disable();
                btnModificarNomenclador.disable();
                var nomencladorSel = smNomenclador.getSelections();
                for (var index = 0; index < nomencladorSel.length; index++) {
                    if (nomencladorSel[index].data.activacion == 0) {
                        cantDesactivados++;
                    }
                    if (nomencladorSel[index].data.activacion == 1 && nomencladorSel[index].data.valordefecto == 0) {
                        cantActivados++;
                    }
                    if (idNomencladorSel == null) {
                        idNomencladorSel = nomencladorSel[index].data.id;
                    } else {
                        idNomencladorSel = idNomencladorSel + ',' + nomencladorSel[index].data.id;
                    }
                    if (nomencladorSel[index].data.valordefecto == 0) {
                        if (idNomencladorEliminar == null) {
                            idNomencladorEliminar = nomencladorSel[index].data.id;
                        } else {
                            idNomencladorEliminar = idNomencladorEliminar + ',' + nomencladorSel[index].data.id;
                        }
                    }
                }
                if (cantDesactivados > 0)
                    btnActivar.enable();
                else
                    btnActivar.disable();
                if (cantActivados > 0)
                    btnDesactivar.enable();
                else
                    btnDesactivar.disable();
                btnSubir.disable();
                btnBajar.disable();
            }
            if (idNomencladorEliminar == null)
                btnEliminarNomenclador.disable();
            else
                btnEliminarNomenclador.enable();

        } else {
            btnActivar.disable();
            btnDesactivar.disable();
            btnDefinirValorDefecto.disable();
            btnEliminarNomenclador.disable();
            btnModificarNomenclador.disable();
            btnSubir.disable();
            btnBajar.disable();
        }
    });
    cmNomenclador = new Ext.grid.ColumnModel([
        {
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            width: 300,
            dataIndex: 'text',
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
    filtrosNomenclador = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'text'
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

    btnAdicionarNomenclador = new Ext.Toolbar.Button({
        id: 'btnAdicionarNomenclador',
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionar,
        disabled: false,
        handler: function () {
            accionNomenclador = 'adicionar';
            adicionarModificarNomencladorInterfaz();
        }
    });
    btnModificarNomenclador = new Ext.Toolbar.Button({
        id: 'btnModificarNomenclador',
        iconCls: 'modificar',
        tooltip: etiqueta.lbModificar,
        disabled: true,
        handler: function () {
            accionNomenclador = 'modificar';
            adicionarModificarNomencladorInterfaz();
        }
    });
    btnEliminarNomenclador = new Ext.Toolbar.Button({
        id: 'btnEliminarNomenclador',
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminar,
        disabled: true,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgSegEliminarNomenclador, eliminarNomenclador);
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
    btnExportarNomenclador = new Ext.Toolbar.Button({
        id: 'btnExportarNomenclador',
        iconCls: 'exportar',
        tooltip: etiqueta.lbExportar,
        disabled: true,
        handler: function () {
            var win = window.open('exportarGridNomenclador?' + '&filtros=' + Ext.encode(filtrosNomenclador.getFilterData())
                    + '&node=' + idNomencladorArbol
                    + '&text=' + attributesNomencladorArbol.text);
        }
    });
    btnImportarNomenclador = new Ext.Button({
        id: 'btnImportarNomenclador',
        iconCls: 'importar',
        tooltip: etiqueta.lbImportar,
        disabled: false,
        handler: function () {
            importarNomenclador(etiqueta);
        }
    });
    btnActualizarNomenclador = new Ext.Button({
        disabled: false,
        iconCls: 'actualizar',
        tooltip: etiqueta.lbActualizar,
        handler: function () {
            if (stNomenclador.reader != undefined)
                stNomenclador.reload();
        }
    });
    btnLimpiarNomenclador = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosNomenclador.clearFilters();
        }
    });
    gpNomenclador = new Ext.grid.GridPanel({
        id: 'gpNomenclador',
        region: 'center',
        split: true,
        title: etiqueta.lbNomenclador,
        store: stNomenclador,
        disabled: true,
        sm: smNomenclador,
        cm: cmNomenclador,
        plugins: filtrosNomenclador,
        tbar: [btnAdicionarNomenclador, btnModificarNomenclador, btnEliminarNomenclador, '-', btnDefinirValorDefecto, '-', btnActivar, btnDesactivar, '-', btnOrdenAlfabetico, btnSubir, btnBajar, btnGuardar, '-', btnImportarNomenclador, btnExportarNomenclador],
        bbar: [btnActualizarNomenclador, btnLimpiarNomenclador, '->', textoPaginado],
        listeners: {
            celldblclick: function () {
                if (smNomenclador.getSelections().length == 1) {
                    accionNomenclador = 'modificar';
                    adicionarModificarNomencladorInterfaz();
                }
            }
        }
    });
    myView = new Ext.Viewport({
        layout: 'border',
        id: 'myView',
        items: [tpNomenclador, gpNomenclador]
    });
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

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
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
        gridPanel.setTitle(titulo + " <i> " + etiqueta.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function guardarestadoPaneles() {
    estadogpNomencladores = gpNomenclador.disabled;
    gpNomenclador.enable();
}
function revertirestadoPaneles() {
    if (estadogpNomencladores)
        gpNomenclador.disable();
}
function adicionarModificarNomencladorInterfaz() {
    btnCancelarNomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModNomencladorCancelar',
        iconCls: 'cancelar',
        tooltip: etiqueta.msgCerrarSinGuardar,
        text: etiqueta.lbCancelar,
        handler: function () {
            winAdicionarModificarNomenclador.destroy();
        }
    });
    btnAplicarNomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModNomencladorAplicar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardarSinCerrar,
        text: etiqueta.lbAplicar,
        handler: function () {
            adicionarModificarNomenclador();
        }
    });
    btnAceptarNomenclador = new Ext.Toolbar.Button({
        id: 'btnAddModNomencladorAceptar',
        iconCls: 'aceptar',
        tooltip: etiqueta.msgGuardaryCerrar,
        text: etiqueta.lbAceptar,
        handler: function () {
            adicionarModificarNomenclador(true);
        }
    });
    if (accionNomenclador == 'adicionar') {
        tituloWinAddModNomenclador = etiqueta.lbAdicionarNomenclador;
        botonesNomenclador = [btnCancelarNomenclador, btnAplicarNomenclador, btnAceptarNomenclador];
    } else if (accionNomenclador == 'modificar') {
        tituloWinAddModNomenclador = etiqueta.lbModificarNomenclador;
        botonesNomenclador = [btnCancelarNomenclador, btnAceptarNomenclador];
    }
    denominacionNomenclador = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'denominacionNomenclador',
        fieldLabel: etiqueta.lbDenominacion,
        anchor: '99%',
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        allowBlank: false,
        maxLength: 255,
        maxLengthText: etiqueta.msgMaxLengthTextDenominacion,
        blankText: etiqueta.lbmsgCampoObligatorio
    });
    descripcionNomenclador = new Ext.form.TextArea({
        id: 'descripcionNomenclador',
        fieldLabel: etiqueta.lbDescripcion,
        anchor: '100%',
        maxLength: 255,
        width: 400,
        height: 100,
        maxLengthText: etiqueta.msgMaxLengthTextDescripcion,
        allowBlank: true,
    });
    fpAdicionarModificarNomenclador = new Ext.FormPanel({
        id: 'fpAdicionarNomenclador',
        frame: true,
        layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: denominacionNomenclador
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: descripcionNomenclador
                    }]
            }]
    });
    if (accionNomenclador == 'modificar') {
        denominacionNomenclador.setValue(smNomenclador.getSelected().data.text);
        descripcionNomenclador.setValue(smNomenclador.getSelected().data.descripcion);
    } else {
        denominacionNomenclador.reset();
        descripcionNomenclador.reset();
    }
    winAdicionarModificarNomenclador = new Ext.Window({
        id: 'winAdicionarModificarNomenclador',
        title: tituloWinAddModNomenclador,
        resizable: false,
        modal: true,
        closeAction: 'destroy',
        width: 400,
        height: 220,
        layout: 'fit',
        items: fpAdicionarModificarNomenclador,
        constrain: true,
        buttons: botonesNomenclador,
        listeners: {
            beforeshow: function () {
                guardarestadoPaneles();
            },
            beforedestroy: function () {
                revertirestadoPaneles();
            }
        }
    });
    winAdicionarModificarNomenclador.show();
}
function adicionarModificarNomenclador(clickAceptar) {
    if (accionNomenclador == 'adicionar')
        valordefecto = 0;
    else
        valordefecto = smNomenclador.getSelected().data.valordefecto;
    mymask.show();
    Ext.Ajax.request({
        url: 'addModNomenclador',
        params: {
            accion: accionNomenclador,
            idpadre: idNomencladorArbol,
            denominacion: denominacionNomenclador.getValue(),
            descripcion: descripcionNomenclador.getValue(),
            idnomenclador: idNomencladorSel,
            valordefecto: valordefecto
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (accionNomenclador == 'adicionar') {
                    mostrarMensaje(1, etiqueta.msgAdicionarNomencladorOK);
                    if (clickAceptar) {
                        winAdicionarModificarNomenclador.destroy();
                    } else {
                        fpAdicionarModificarNomenclador.getForm().reset();
                    }
                    if (nodoNomenclador.id == 0) {
                        //nomenclador raiz
                        tpNomenclador.getRootNode().reload();
                        stNomenclador.reload();
                    } else if (nodoNomenclador.leaf == 0) {
                        //nomenclador no raiz y no hoja
                        nodoNomenclador.reload();
                        stNomenclador.reload();
                    } else {
                        if (clickAceptar) {
                            //nomenclaodr hoja
                            if (nodoNomenclador.attributes._parent == nodoNomenclador.id) {
                                //hoja raiz
                                tpNomenclador.getRootNode().reload();
                            } else {
                                //hoja no raiz
                                nodoNomencladorPadre = tpNomenclador.getNodeById(nodoNomenclador.attributes._parent);
                                nodoNomencladorPadre.reload();
                            }
                            stNomenclador.loadData({"data": [], "total": 0});
                            gpNomenclador.disable();
                        }
                    }

                } else if (accionNomenclador == 'modificar') {
                    mostrarMensaje(1, etiqueta.msgModificarNomencladorOK);
                    stNomenclador.reload();
                    winAdicionarModificarNomenclador.destroy();
                }

            } else {
                if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, etiqueta.msgDenominacionNomencladorExiste);
                }
            }
            mymask.hide();
        }
    });
}
function eliminarNomenclador(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarNomenclador',
            waitMsg: etiqueta.msgEliminandoNomenclador,
            params: {
                idnomenclador: idNomencladorEliminar,
                idpadre: idNomencladorArbol
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, etiqueta.msgEliminarNomencladorNO);
                } else {
                    if (responseData.codMsgN == 1) {
                        mostrarMensaje(1, etiqueta.msgEliminarNomencladorOK);
                    } else {
                        mostrarMensaje(1, etiqueta.msgEliminarNomencladorAlgunosNO);
                    }
                    if (nodoNomenclador.id == 0) {
                        //nomenclador raiz
                        tpNomenclador.getRootNode().reload();
                        stNomenclador.reload();
                    } else if (nodoNomenclador.leaf == 0) {
                        //nomenclador no raiz y no hoja
                        nodoNomenclador.reload();
                        stNomenclador.reload();
                    } else {
                        //nomenclaodr hoja
                        if (nodoNomenclador.attributes._parent == nodoNomenclador.id) {
                            //hoja raiz
                            tpNomenclador.getRootNode().reload();
                        } else {
                            //hoja no raiz
                            nodoNomencladorPadre = tpNomenclador.getNodeById(nodoNomenclador.attributes._parent);
                            nodoNomencladorPadre.reload();
                        }
                        stNomenclador.loadData({"data": [], "total": 0});
                        gpNomenclador.disable();
                    }
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
            idnomenclador: idNomencladorSel,
            idpadre: idNomencladorArbol
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                mostrarMensaje(1, etiqueta.msgDefinirValorDefectoOK);
                stNomenclador.reload();
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
            idnomenclador: idNomencladorSel,
            activacion: accion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                mostrarMensaje(1, msgActivacionOK);
                stNomenclador.reload();
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
    var prioini = stNomenclador.getAt(0).data.orden;
    var contpri = prioini;
    var recordsSel = smNomenclador.getSelected();
    stNomenclador.each(function (rec) {
        if (stNomenclador.getAt(j).data.id == recordsSel.data.id) {
            var tmpdata = stNomenclador.getAt(j).data;
            if (orden == 'up' && j - 1 >= 0) {
                stNomenclador.getAt(j).data = stNomenclador.getAt(j - 1).data;
                stNomenclador.getAt(j - 1).data = tmpdata;

                stNomenclador.getAt(j).data.orden = contpri;
                stNomenclador.getAt(j).commit();
                stNomenclador.getAt(j - 1).data.orden = contpri - 1;

                stNomenclador.getAt(j - 1).commit();
                smNomenclador.selectRow(j - 1);
            } else {
                if (j + 1 < stNomenclador.getCount()) {
                    stNomenclador.getAt(j).data = stNomenclador.getAt(j + 1).data;
                    stNomenclador.getAt(j + 1).data = tmpdata;

                    stNomenclador.getAt(j).data.orden = contpri;
                    stNomenclador.getAt(j).commit();
                    postemp = contpri;
                    postemp++;
                    stNomenclador.getAt(j + 1).data.orden = postemp;

                    stNomenclador.getAt(j + 1).commit();
                    smNomenclador.selectRow(j + 1);
                }
            }
            stNomenclador.getAt(j).commit();
        }
        j++;
        contpri++;
    });
}
function actualizarOrden() {
    if (stNomenclador.getCount() != 0) {
        array_Nomenclador = [];
        for (var i = 0; i < stNomenclador.getCount(); i++) {
            array_Nomenclador.push({
                nomenclador: stNomenclador.getAt(i).data
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'actualizarOrden',
            params: {
                nomenclador: Ext.encode(array_Nomenclador)
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgOrdenarOK);
                    if (nodoNomenclador.id == 0) {
                        //nomenclador raiz
                        tpNomenclador.getRootNode().reload();
                        stNomenclador.reload();
                    } else if (nodoNomenclador.leaf == 0) {
                        //nomenclador no raiz y no hoja
                        nodoNomenclador.reload();
                        stNomenclador.reload();
                    } else {
                        //nomenclaodr hoja
                        if (nodoNomenclador.attributes._parent == nodoNomenclador.id) {
                            //hoja raiz
                            tpNomenclador.getRootNode().reload();
                        } else {
                            //hoja no raiz
                            nodoNomencladorPadre = tpNomenclador.getNodeById(nodoNomenclador.attributes._parent);
                            nodoNomencladorPadre.reload();
                        }
                        stNomenclador.loadData({"data": [], "total": 0});
                        gpNomenclador.disable();
                    }
                } else
                    mostrarMensaje(1, etiqueta.msgOrdenarNO);
            }
        });
    }
    btnGuardar.disable();
}
function ordenAlfabetico() {
    if (stNomenclador.getCount() > 1) {
        mymask.show();
        Ext.Ajax.request({
            url: 'ordenAlfabetico',
            params: {
                idpadre: idNomencladorArbol
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgOrdenarOK);
                    if (nodoNomenclador.id == 0) {
                        //nomenclador raiz
                        tpNomenclador.getRootNode().reload();
                        stNomenclador.reload();
                    } else if (nodoNomenclador.leaf == 0) {
                        //nomenclador no raiz y no hoja
                        nodoNomenclador.reload();
                        stNomenclador.reload();
                    } else {
                        //nomenclaodr hoja
                        if (nodoNomenclador.attributes._parent == nodoNomenclador.id) {
                            //hoja raiz
                            tpNomenclador.getRootNode().reload();
                        } else {
                            //hoja no raiz
                            nodoNomencladorPadre = tpNomenclador.getNodeById(nodoNomenclador.attributes._parent);
                            nodoNomencladorPadre.reload();
                        }
                        stNomenclador.loadData({"data": [], "total": 0});
                        gpNomenclador.disable();
                    }
                } else
                    mostrarMensaje(1, etiqueta.msgOrdenarNO);
            }
        });
    }
}