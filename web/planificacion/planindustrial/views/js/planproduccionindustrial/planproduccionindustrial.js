var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('planproduccionindustrial', cargaretiquetas);
var etiqueta = new Object();

var offsetProducciones = 0, beforeloadProducciones = false;
var nodoEntidad = null;
var estadoEjercicio = null;
var idcartatecindustrial = null;

function cargaretiquetas() {
    initEtiquetas();
}

function cargaInicial() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
    mymask.show();

    stum = new Ext.data.Store({
        url: 'cargarunidadmedida',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }]),
        listeners: {
            load: function () {
                cargarInterfaz();
            }
        }
    });
}

function cargarInterfaz() {
    //arbol de entidades
    trEnt = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    trEnt.btnBuscar.setText("");
    trEnt.btnLimpiar.setText("");
    trEnt = trEnt.items.items[0];
    trEnt.getRootNode().expand();
    pEntidad = new Ext.Panel({
        title: etiqueta.lbEntidades,
        region: 'west',
        split: true,
        collapsible: true,
        titleCollapse: true,
        width: 300,
        layout: 'fit',
        items: [trEnt]
    });
    trEnt.addListener('click', function (n) {
        nodoEntidad = n;
        pProducciones.setTitle(nodoEntidad.text);

        if (n.text != "Estructuras") {
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: n.id
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == 1) {
                        //es OD
                        pProducciones.enable();
                        stProducciones.reload();
                    } else {
                        //no es OD
                        mostrarMensaje(1, etiqueta.msgNoEntidadOD);
                        pProducciones.disable();
                        stProducciones.loadData({"data": [], "total": 0});
                    }
                }
            });
        } else {
            pProducciones.disable();
            stProducciones.loadData({"data": [], "total": 0});
        }
    });

    stCbejercicio = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                estadoEjercicio = t.reader.jsonData.idejercicioactual.uridatosnomenclador;
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
                name: 'denominacion'
            }, {
                name: 'estado'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        store: stCbejercicio,
        disabled: false,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: etiqueta.lbSeleccione,
        loadingText: etiqueta.lbCargando,
        width: 140,
        listeners: {
            select: function (cb, rec, index) {
                estadoEjercicio = rec.data.uridatosnomenclador;
            }
        }
    });
    stProducciones = new Ext.data.Store({
        url: 'listarProducciones',
        listeners: {
            beforeload: function (st, options) {
                mymask.show();
                beforeloadProducciones = true;
                cambiarTituloFiltrar(gpProducciones, filtrosProducciones, etiqueta.lbProducciones);
                st.baseParams.start = offsetProducciones;
                st.baseParams.identidad = nodoEntidad.id;
                st.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function (st, records, options) {
                if (st.getCount() == 0) {
                    if (beforeloadProducciones) {
                        if (filtrosProducciones.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                        }
                    }
                }
                beforeloadProducciones = false;
                mymask.hide();
                controlarObjetosProducciones();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idproduccionindustrial'
            }, {
                name: 'idcartatecindustrial'
            }, {
                name: 'denominacion'
            }, {
                name: 'denominacioncarta'
            }, {
                name: 'descripcion'
            }, {
                name: 'idindicadorsalida'
            }, {
                name: 'denominacionindicador'
            }, {
                name: 'idumedida'
            }, {
                name: 'valor'
            }, {
                name: 'idaprobacion'
            }
        ])
    });

    smProducciones = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                controlarObjetosProducciones();
            },
            rowdeselect: function () {
                controlarObjetosProducciones();
            }
        }
    });
    cmProducciones = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbCartaTecnologica,
            tooltip: etiqueta.lbCartaTecnologica,
            dataIndex: 'denominacioncarta',
            width: 150,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDescripcionCarta,
            tooltip: etiqueta.lbDescripcionCarta,
            dataIndex: 'descripcion',
            hidden: true,
            width: 150,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbIndicadorSalida,
            tooltip: etiqueta.lbIndicadorSalida,
            dataIndex: 'denominacionindicador',
            width: 200,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbUM,
            tooltip: etiqueta.lbUnidadMedida,
            dataIndex: 'idumedida',
            width: 110,
            renderer: renderUM
        }, {
            header: etiqueta.lbCantidad,
            tooltip: etiqueta.lbCantidad,
            width: 80,
            align: 'rigth',
            dataIndex: 'valor',
            renderer: crearToolTipNumerico
        }, {
            header: etiqueta.lbAprobado,
            tooltip: etiqueta.lbAprobado,
            width: 80,
            align: 'center',
            dataIndex: 'idaprobacion',
            renderer: renderAprobado
        }
    ]);
    filtrosProducciones = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denominacioncarta'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'denominacionindicador'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'valor'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, etiqueta.lbNo], [3, etiqueta.lbEspecialista], [4, etiqueta.lbRector]]
            }]
    });
    btnAdicionarProducciones = new Ext.Button({
        disabled: false,
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionarProduccion,
        handler: function () {
            adicionarProducciones();
        }
    });
    btnModificarProducciones = new Ext.Button({
        disabled: true,
        iconCls: 'modificar',
        tooltip: etiqueta.lbModificarProducciones,
        handler: function () {
            adicionarProducciones(true);
        }
    });
    btnEliminarProducciones = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminarProducciones,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmacionEliminarProducciones, eliminarProducciones);
        }
    });
    btnAprobarProducciones = new Ext.Button({
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarProducciones,
        disabled: true,
//        hidden: true,
        handler: function () {
            aprobarProducciones(3, false);
        }
    });
    btnAprobarProduccionesRector = new Ext.Button({
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarProducciones + '(Rector)',
        disabled: true,
//        hidden: true,
        handler: function () {
            aprobarProducciones(4, true);
        }
    });
    btnDesaprobarProducciones = new Ext.Button({
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarProducciones,
        disabled: true,
//        hidden: true,
        handler: function () {
            aprobarProducciones(1, false);
        }
    });
    btnDesaprobarProduccionesRector = new Ext.Button({
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarProducciones + '(Rector)',
        disabled: true,
//        hidden: true,
        handler: function () {
            aprobarProducciones(1, true);
        }
    });

    btnExportarProducciones = new Ext.Toolbar.MenuButton({
        tooltip: {
            text: etiqueta.lbExportar
        },
        iconCls: 'exportar',
        menu: {
            items: [{
                    disabled: true,
                    id: 'btnExportarProducciones1',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarProducciones,
                    handler: function () {
                        exportarProducciones(1);
                    }
                }, {
                    disabled: true,
                    id: 'btnExportarProducciones2',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarProduccionesActividades,
                    handler: function () {
                        exportarProducciones(2);
                    }
                }, {
                    disabled: true,
                    id: 'btnExportarProducciones3',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarDatosProduccionesSeleccionada,
                    handler: function () {
                        exportarProducciones(3);
                    }
                }]
        }
    });
    btnLimpiarProducciones = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosProducciones.clearFilters();
        }
    });
    gpProducciones = new Ext.grid.GridPanel({
        title: etiqueta.lbProducciones,
        store: stProducciones,
        region: 'center',
        sm: smProducciones,
        cm: cmProducciones,
        plugins: filtrosProducciones,
        autoExpandColumn: 'expandir',
        tbar: [{
                xtype: 'tbtext',
                text: etiqueta.lbEjercicio + ': '
            }, cbEjercicio, '-', btnAdicionarProducciones, btnModificarProducciones, btnEliminarProducciones, '-',
            btnAprobarProducciones, btnAprobarProduccionesRector, btnDesaprobarProducciones, btnDesaprobarProduccionesRector, '-', btnExportarProducciones],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stProducciones,
            displayInfo: true,
            items: ['-', btnLimpiarProducciones],
            listeners: {
                beforechange: function (p, e) {
                    offsetProducciones = e.start;
                }
            }
        }),
        listeners: {
            celldblclick: function () {
                if (smProducciones.getSelections().length == 1)
                    adicionarProducciones(true);
            }
        }
    });
    pProducciones = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        title: ' - ',
        disabled: true,
        items: [gpProducciones]
    });
    panelViewProducciones = new Ext.Panel({
        layout: 'border',
        items: [pEntidad, pProducciones]
    });
    viewProducciones = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [panelViewProducciones]
        })
    });
    mymask.hide();
}


function controlarObjetosProducciones() {
    btnModificarProducciones.disable();
    btnEliminarProducciones.disable();
    btnAprobarProducciones.disable();
    btnAprobarProduccionesRector.disable();
    btnDesaprobarProducciones.disable();
    btnDesaprobarProduccionesRector.disable();
    Ext.getCmp('btnExportarProducciones1').disable();
    Ext.getCmp('btnExportarProducciones2').disable();
    Ext.getCmp('btnExportarProducciones3').disable();


    if (estadoEjercicio == 'elaboracion') {
        if (smProducciones.getSelections().length > 0) {
            if (smProducciones.getSelections().length == 1) {
                if (smProducciones.getSelected().data.idaprobacion == 1) {
                    btnModificarProducciones.enable();
                    btnEliminarProducciones.enable();
                    btnAprobarProducciones.enable();
                    btnAprobarProduccionesRector.enable();
                } else if (smProducciones.getSelected().data.idaprobacion == 3) {
                    btnAprobarProduccionesRector.enable();
                    btnDesaprobarProducciones.enable();
                    btnDesaprobarProduccionesRector.enable();
                } else {
                    btnDesaprobarProduccionesRector.enable();
                }
            } else {
                btnEliminarProducciones.enable();
                btnAprobarProducciones.enable();
                btnAprobarProduccionesRector.enable();
                btnDesaprobarProducciones.enable();
                btnDesaprobarProduccionesRector.enable();
            }
        }
    }

    if (smProducciones.getSelections().length == 1) {
        Ext.getCmp('btnExportarProducciones3').enable();
    }
    if (stProducciones.getCount() > 0) {
        Ext.getCmp('btnExportarProducciones1').enable();
        Ext.getCmp('btnExportarProducciones2').enable();
    }
}

function crearToolTipDenom(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return '<p style="white-space:pre">' + v + '</p>';
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function crearToolTipNumerico(v, m) {
    m.attr = 'ext:qtip="' + addCommas(v) + '"';
    return addCommas(v);
}
function addCommas(nStr) {
    nStr += '';
    ds = nStr.replace(/,/g, '');
    nStr = ds;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stum.data.items.length; i++)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.abreviaturaunidadmedida + '"';
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
}

function renderAprobado(val, m) {
    if (val == 3) {
        m.attr = 'ext:qtip="' + etiqueta.lbEspecialista + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + etiqueta.lbRector + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

//function renderEstado(val, m) {
//    if (val > 0) {
//        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
//        m.css = 'icondistra-true verde'
//    } else {
//        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
//        m.css = 'icondistra-false rojo'
//    }
//}

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
        gridPanel.setTitle(etiqueta + " - <i> " + /*etiqueta.lbFiltradoPor*/ 'Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function adicionarProducciones(modificar) {
    idcartatecindustrial = null;
    btnCancelar = new Ext.Button({
        iconCls: 'cancelar',
        text: etiqueta.lbBtnCancelar,
        tooltip: etiqueta.lbTtbtnCancelar,
        handler: function () {
            winAdicionarProducciones.destroy();
        }
    });
    btnAplicar = new Ext.Button({
        iconCls: 'aplicar',
        text: etiqueta.lbBtnAplicar,
        tooltip: etiqueta.lbTtbtnAplicar,
        handler: function () {
            adicionarModificarProduccionesLogica(modificar, true);
        }
    });
    btnAceptar = new Ext.Button({
        iconCls: 'aceptar',
        text: etiqueta.lbBtnAceptar,
        tooltip: etiqueta.lbTtbtnAceptar,
        handler: function () {
            adicionarModificarProduccionesLogica(modificar, false);
        }
    });

    denominacion = new Ext.form.TextField({
        fieldLabel: etiqueta.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: etiqueta.msgMaxLengthTextDenominacion,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        mymaskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: etiqueta.lbMsgSoloALfa,
        allowBlank: false,
        blankText: etiqueta.lbmsgCampoObligatorio
    });
    cartatecnologica = new Ext.form.TextField({
        id: 'cartatecnologica',
        emptyText: etiqueta.lbEmptyTextSeleccionar,
        readOnly: true,
        disabled: false,
        fieldLabel: etiqueta.lbCartaTecnologica,
        xtype: 'textfield',
        allowBlank: false,
        anchor: '95%',
        listeners: {
            focus: function () {
                seleccionarCartaTecnologica();
            }
        }
    });
    cantidad = new Ext.form.TextField({
        id: 'cantidad',
        fieldLabel: etiqueta.lbCantidad,
        decimalPrecision: 6,
        allowBlank: false,
        maxLength: 19,
        maxLengthText: etiqueta.lbMsgmaxLengthText,
        invalidText: etiqueta.lbInvaliTex,
        regex: /^([0-9.]+ ?[0-9 .]*)+$/,
        regexText: etiqueta.lbRegexText,
        validator: function (val) {
            if (val <= 0) {
                return false
            } else {
                return true
            }
        },
        allowNegative: false,
        anchor: '95%'
    });

    var tituloventana = "";
    if (modificar == true) {
        tituloventana = etiqueta.lbModificarProduccion;
    } else {
        tituloventana = etiqueta.lbAdicionarProduccion;
    }

    fpAdicionarProducciones = new Ext.FormPanel({
        region: 'center',
        autoHeight: true,
        autoDestroy: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: [denominacion, cartatecnologica, cantidad]
                    }]
            }]
    });

    if (modificar == true) {
        denominacion.setValue(smProducciones.getSelected().data.denominacion);
        cartatecnologica.setValue(smProducciones.getSelected().data.denominacionindicador);
        idcartatecindustrial = smProducciones.getSelected().data.idcartatecindustrial;
        cantidad.setValue(smProducciones.getSelected().data.valor);
    }

    if (modificar == true)
        var buttons = [btnCancelar, btnAceptar];
    else
        var buttons = [btnCancelar, btnAplicar, btnAceptar];

    winAdicionarProducciones = new Ext.Window({
        title: tituloventana,
        modal: true,
        resizable: false,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fpAdicionarProducciones,
        buttons: buttons,
        listeners: {
            beforedestroy: function (w) {
                stProducciones.reload();
            }
        }
    });
    winAdicionarProducciones.show();
}

function seleccionarCartaTecnologica() {
    var offsetSeleccionarCartaTecnologica = 0;
    smSeleccionarCartaTecnologica = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                Ext.getCmp('btnaceptarSeleccionarCartaTecnologica').enable();
            },
            rowdeselect: function () {
                Ext.getCmp('btnaceptarSeleccionarCartaTecnologica').disable();
            }
        }
    });
    cmSeleccionarCartaTecnologica = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            dataIndex: 'denominacion',
//            width: 300,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            dataIndex: 'descripcion',
//            width: 300,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbIndicadorSalida,
            tooltip: etiqueta.lbIndicadorSalida,
            dataIndex: 'denominacionindicador',
            width: 200,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbUnidadMedida,
            tooltip: etiqueta.lbUnidadMedida,
            dataIndex: 'idumedida',
            width: 110,
            renderer: renderUM
        }, {
            header: etiqueta.lbCantidad,
            tooltip: etiqueta.lbCantidad,
            width: 80,
            align: 'rigth',
            dataIndex: 'cantidad',
            renderer: crearToolTipNumerico
        }
    ]);

    // Store grid stGpCT
    stSeleccionarCartaTecnologica = new Ext.data.Store({
        url: 'listarCartatecnologicaAdicionarProducciones',
        listeners: {
            beforeload: function (st) {
                mymask.show();
                st.baseParams.start = offsetSeleccionarCartaTecnologica;
            },
            load: function () {
                cambiarTituloFiltrar(gpSeleccionarCartaTecnologica, filtrosSeleccionarCartaTecnologica, etiqueta.lbCartastecnologicas);
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idcartatecindustrial'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'denominacionindicador'
            }, {
                name: 'idindicadorsalida'
            }, {
                name: 'idumedida'
            }, {
                name: 'cantidad'
            }])
    });
    filtrosSeleccionarCartaTecnologica = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'denominacionindicador'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }]
    });
    btnLimpiarSeleccionarCartaTecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosSeleccionarCartaTecnologica.clearFilters();
        }
    });
    gpSeleccionarCartaTecnologica = new Ext.grid.GridPanel({
        store: stSeleccionarCartaTecnologica,
        autoExpandColumn: 'expandir',
        sm: smSeleccionarCartaTecnologica,
        cm: cmSeleccionarCartaTecnologica,
        region: 'center',
        frame: true,
        plugins: filtrosSeleccionarCartaTecnologica,
        title: etiqueta.lbCartastecnologicas,
        listeners: {
            celldblclick: function () {
                idcartatecindustrial = smSeleccionarCartaTecnologica.getSelected().data.idcartatecindustrial;
                cartatecnologica.setValue(smSeleccionarCartaTecnologica.getSelected().data.denominacion);
                windowSeleccionarCartaTecnologica.destroy();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stSeleccionarCartaTecnologica,
            displayInfo: true,
            items: ['-', btnLimpiarSeleccionarCartaTecnologica],
            listeners: {
                beforechange: function (p, e) {
                    offsetSeleccionarCartaTecnologica = e.start;
                }
            }
        })
    });
    // Colum Model grid Norma
    windowSeleccionarCartaTecnologica = new Ext.Window({
        width: 750,
        constrain: true,
        height: 450,
        closeAction: 'destroy',
        layout: 'fit',
        title: etiqueta.lbAdicionarCartaTecnologica,
        items: gpSeleccionarCartaTecnologica,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: etiqueta.lbBtnCancelar,
                tooltip: etiqueta.lbTtbtnCancelar,
                handler: function () {
                    windowSeleccionarCartaTecnologica.destroy();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnaceptarSeleccionarCartaTecnologica',
                text: etiqueta.lbBtnAceptar,
                tooltip: etiqueta.lbTtbtnAceptar,
                disabled: true,
                handler: function () {
                    idcartatecindustrial = smSeleccionarCartaTecnologica.getSelected().data.idcartatecindustrial;
                    cartatecnologica.setValue(smSeleccionarCartaTecnologica.getSelected().data.denominacion);
                    windowSeleccionarCartaTecnologica.destroy();
                }
            }],
        listeners: {
            beforeshow: function (w) {
                stSeleccionarCartaTecnologica.reload();
            }
        }
    });
    windowSeleccionarCartaTecnologica.show();
}

function adicionarModificarProduccionesLogica(modificar, aplicar) {
    var mensa = "";
    idproduccionindustrial = null;
    if (modificar == true) {
        mensa = etiqueta.msgModificando;
        idproduccionindustrial = smProducciones.getSelected().data.idproduccionindustrial;
    } else {
        mensa = etiqueta.msgAdicionando;
    }

    if (fpAdicionarProducciones.getForm().isValid()) {
        mymask.show();
        fpAdicionarProducciones.getForm().submit({
            url: 'adicionarProducciones',
            params: {
                idejercicio: cbEjercicio.getValue(),
                identidad: nodoEntidad.id,
                idproduccionindustrial: idproduccionindustrial,
                denominacion: denominacion.getValue(),
                idcartatecindustrial: idcartatecindustrial,
                cantidad: cantidad.getValue()
            },
            waitMsg: mensa,
            failure: function (form, action) {
                responseData = action.result;
                if (responseData.codMsg == 1) {
                    if (modificar == true) {
                        mostrarMensaje(1, etiqueta.msgProduccionModificadaOk);
                    } else {
                        mostrarMensaje(1, etiqueta.msgProduccionAdicionadaOk);
                    }

                    if (aplicar == true) {
                        denominacion.reset();
                        descripcion.reset();
                        indicadorsalida.reset();
                        cantidad.reset();
                        idindicador = null;
                    } else {
                        winAdicionarProducciones.destroy();
                    }

                } else {
                    if (modificar == true) {
                        mostrarMensaje(1, etiqueta.msgProduccionModificadaNo);
                    } else {
                        mostrarMensaje(1, etiqueta.msgProduccionAdicionadaNo);
                    }
                }
                mymask.hide();
            }
        });
    } else {
        mostrarMensaje(1, etiqueta.msgErrorFormulario);
    }
}

function eliminarProducciones(btnPresionado) {
    if (btnPresionado == 'ok') {
        var mensajeElim = Ext.MessageBox.show({
            title: etiqueta.lbPorFavorEspere,
            msg: etiqueta.msgEliminando,
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });
        var recordsSel = smProducciones.getSelections(), objetosProcesar = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                objetosProcesar.push(recordsSel[i].data.idproduccionindustrial);
            Ext.Ajax.request({
                url: 'eliminarProducciones',
                params: {
                    identidad: nodoEntidad.id,
                    idejercicio: cbEjercicio.getValue(),
                    idproduccionindustrial: Ext.encode(objetosProcesar)
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg > 0) {
                        mostrarMensaje(1, etiqueta.msgProduccionesEliminadaOk);
                        stProducciones.reload();
                    } else {
                        mostrarMensaje(1, etiqueta.msgProduccionesEliminadaNo);
                    }
                }
            });
        }
    }
}

function aprobarProducciones(idaprobacion, rector) {
    var mensajeElim = Ext.MessageBox.show({
        title: etiqueta.lbPorFavorEspere,
        msg: etiqueta.msgAprobando,
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6'
    });
    var recordsSel = smProducciones.getSelections(), objetosProcesar = [];
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            if (rector) {
                if (idaprobacion == 4) {
                    if (recordsSel[i].data.idaprobacion < 4)
                        objetosProcesar.push(recordsSel[i].data.idproduccionindustrial);
                } else {
                    if (recordsSel[i].data.idaprobacion != 1)
                        objetosProcesar.push(recordsSel[i].data.idproduccionindustrial);
                }
            } else {
                if (idaprobacion == 3) {
                    if (recordsSel[i].data.idaprobacion == 1)
                        objetosProcesar.push(recordsSel[i].data.idproduccionindustrial);
                } else {
                    if (recordsSel[i].data.idaprobacion == 3)
                        objetosProcesar.push(recordsSel[i].data.idproduccionindustrial);
                }
            }
        }
        if (objetosProcesar.length > 0) {
            Ext.Ajax.request({
                url: 'aprobarProducciones',
                params: {
                    idaprobacion: idaprobacion,
                    rector: rector,
                    identidad: nodoEntidad.id,
                    idejercicio: cbEjercicio.getValue(),
                    idproduccionindustrial: Ext.encode(objetosProcesar)
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg > 0) {
                        if (idaprobacion == 1) {
                            mostrarMensaje(1, etiqueta.msgProduccionesDesaprobadaOk);
                        } else {
                            mostrarMensaje(1, etiqueta.msgProduccionesAprobadaOk);
                        }
                        stProducciones.reload();
                    } else {
                        if (idaprobacion == 1) {
                            mostrarMensaje(1, etiqueta.msgProduccionesDesaprobadaNo);
                        } else {
                            mostrarMensaje(1, etiqueta.msgProduccionesAprobadaNo);
                        }
                    }
                }
            });
        }
        mensajeElim.hide();
    }
}

function exportarProducciones(tipo) {
    var idproduccionindustrialExportar = null;
    var recordsSel = smProducciones.getSelections();
    if (recordsSel.length == 1)
        idproduccionindustrialExportar = smProducciones.getSelected().data.idproduccionindustrial;


    var win = window.open('exportarProducciones?identidad=' + nodoEntidad.attributes.id +
            '&denoentidad=' + nodoEntidad.attributes.text +
            '&idejercicio=' + cbEjercicio.getValue() +
            '&denoejercicio=' + cbEjercicio.getRawValue() +
            '&tipo=' + tipo +
            '&idproduccionindustrial=' + idproduccionindustrialExportar +
            '&filtros=' + Ext.encode(filtrosProducciones.getFilterData()));

    mascaraExportar(etiqueta.lbExportandoDatos, etiqueta.lbEsperePorFavor, win);
}
