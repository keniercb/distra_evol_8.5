var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('cartatecnologicaindustrial', cargaretiquetas);
var etiqueta = new Object();

var offsetCartatecnologica = 0;
var idindicador = null;

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
    actividadescartatecindustrial();
    stCartatecnologica = new Ext.data.Store({
        url: 'listarCartatecnologica',
        listeners: {
            beforeload: function (st, options) {
                mymask.show();
                cambiarTituloFiltrar(gpCartatecnologica, filtrosCartatecnologica, etiqueta.lbCartastecnologicas);
                st.baseParams.start = offsetCartatecnologica;
            },
            load: function (st, records, options) {
                if (st.getCount() == 0) {
                    mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                }
                mymask.hide();
                controlarObjetosCartatecnologica();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
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
            }, {
                name: 'idaprobacion'
            }
        ])
    });
    smCartatecnologica = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                controlarObjetosCartatecnologica();
                if (smCartatecnologica.getSelections().length == 1) {
                    stActividadesCartatecnologica.reload();
                } else {
                    stActividadesCartatecnologica.loadData({"data": [], "total": 0});
                }
            },
            rowdeselect: function () {
                controlarObjetosCartatecnologica();
                if (smCartatecnologica.getSelections().length == 1) {
                    stActividadesCartatecnologica.reload();
                } else {
                    stActividadesCartatecnologica.loadData({"data": [], "total": 0});
                }
            }
        }
    });

    cmCartatecnologica = new Ext.grid.ColumnModel([
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
        }, {
            header: etiqueta.lbAprobado,
            tooltip: etiqueta.lbAprobado,
            width: 80,
            align: 'center',
            dataIndex: 'idaprobacion',
            renderer: renderAprobado
        }
    ]);
    filtrosCartatecnologica = new Ext.grid.GridFilters({
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
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, etiqueta.lbNo], [4, etiqueta.lbSi]]
            }]
    });
    btnAdicionarCartatecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionarCartatecnologica,
        handler: function () {
            adicionarCartatecnologica();
        }
    });
    btnModificarCartatecnologica = new Ext.Button({
        disabled: true,
        iconCls: 'modificar',
        tooltip: etiqueta.lbModificarCartatecnologica,
        handler: function () {
            adicionarCartatecnologica(true);
        }
    });
    btnEliminarCartatecnologica = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminarCartatecnologica,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgConfirmacionEliminarCartatecnologica, eliminarCartatecnologica);
        }
    });
    btnAprobarCartatecnologica = new Ext.Button({
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarCartatecnologica,
        disabled: true,
        handler: function () {
            aprobarCartatecnologica(4);
        }
    });
    btnDesaprobarCartatecnologica = new Ext.Button({
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarCartatecnologica,
        disabled: true,
        handler: function () {
            aprobarCartatecnologica(1);
        }
    });
    btnExportarCartatecnologica = new Ext.Toolbar.MenuButton({
        tooltip: {
            text: etiqueta.lbExportar
        },
        iconCls: 'exportar',
        menu: {
            items: [{
                    disabled: true,
                    id: 'btnExportarCartatecnologica1',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarCartatecnologica,
                    handler: function () {
                        exportarCartatecnologica(1);
                    }
                }, {
                    disabled: true,
                    id: 'btnExportarCartatecnologica2',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarCartatecnologicaActividades,
                    handler: function () {
                        exportarCartatecnologica(2);
                    }
                }, {
                    disabled: true,
                    id: 'btnExportarCartatecnologica3',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarDatosCartatecnologicaSeleccionada,
                    handler: function () {
                        exportarCartatecnologica(3);
                    }
                }]
        }
    });
    btnLimpiarCartatecnologica = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosCartatecnologica.clearFilters();
        }
    });
    gpCartatecnologica = new Ext.grid.GridPanel({
        title: etiqueta.lbCartastecnologicas,
        store: stCartatecnologica,
        region: 'center',
        sm: smCartatecnologica,
        cm: cmCartatecnologica,
        plugins: filtrosCartatecnologica,
        autoExpandColumn: 'expandir',
        tbar: [btnAdicionarCartatecnologica, btnModificarCartatecnologica, btnEliminarCartatecnologica, '-', btnAprobarCartatecnologica, btnDesaprobarCartatecnologica, '-', btnExportarCartatecnologica],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stCartatecnologica,
            displayInfo: true,
            items: ['-', btnLimpiarCartatecnologica],
            listeners: {
                beforechange: function (p, e) {
                    offsetCartatecnologica = e.start;
                }
            }
        }),
        listeners: {
            celldblclick: function () {
                if (smCartatecnologica.getSelections().length == 1)
                    adicionarCartatecnologica(true);
            }
        }
    });

    pCartatecnologica = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        items: [gpCartatecnologica]
    });

    pActividadesCartatecnologica = new Ext.Panel({
        layout: 'fit',
        region: 'south',
        collapsible: false,
        collapsed: false,
        disabled: false,
        height: 300,
        titleCollapse: true,
        split: true,
        title: etiqueta.lbActividadesCartastecnologicas,
        items: [gpActividadesCartatecnologica]
    });

    panelViewCartatecnologica = new Ext.Panel({
        layout: 'border',
        items: [pCartatecnologica, pActividadesCartatecnologica]
    });

    viewCartatecnologica = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [panelViewCartatecnologica]
        })
    });
    stCartatecnologica.reload();
}

function controlarObjetosCartatecnologica() {
    btnModificarCartatecnologica.disable();
    btnEliminarCartatecnologica.disable();
    btnAprobarCartatecnologica.disable();
    btnDesaprobarCartatecnologica.disable();

    Ext.getCmp('btnExportarCartatecnologica1').disable();
    Ext.getCmp('btnExportarCartatecnologica2').disable();
    Ext.getCmp('btnExportarCartatecnologica3').disable();

    if (smCartatecnologica.getSelections().length > 0) {
        if (smCartatecnologica.getSelections().length == 1) {
            if (smCartatecnologica.getSelected().data.idaprobacion == 1) {
                btnModificarCartatecnologica.enable();
                btnEliminarCartatecnologica.enable();
                btnAprobarCartatecnologica.enable();
            } else {
                btnDesaprobarCartatecnologica.enable();
            }
        } else {
            btnEliminarCartatecnologica.enable();
            btnAprobarCartatecnologica.enable();
            btnDesaprobarCartatecnologica.enable();
        }
    }

    if (smCartatecnologica.getSelections().length == 1) {
        //stActividadesCartatecnologica.reload();
        Ext.getCmp('btnExportarCartatecnologica3').enable();
    } else {
        stActividadesCartatecnologica.loadData({"data": [], "total": 0});
    }

    if (stCartatecnologica.getCount() > 0) {
        Ext.getCmp('btnExportarCartatecnologica1').enable();
        Ext.getCmp('btnExportarCartatecnologica2').enable();
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

function renderEstado(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
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
        gridPanel.setTitle(etiqueta + " - <i> " + /*etiqueta.lbFiltradoPor*/ 'Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}


function adicionarCartatecnologica(modificar) {
    idindicador = null;
    btnCancelar = new Ext.Button({
        iconCls: 'cancelar',
        text: etiqueta.lbBtnCancelar,
        tooltip: etiqueta.lbTtbtnCancelar,
        handler: function () {
            winAdicionarCartatecnologica.destroy();
        }
    });
    btnAplicar = new Ext.Button({
        iconCls: 'aplicar',
        text: etiqueta.lbBtnAplicar,
        tooltip: etiqueta.lbTtbtnAplicar,
        handler: function () {
            adicionarModificarCartatecnologicaLogica(modificar, true);
        }
    });
    btnAceptar = new Ext.Button({
        iconCls: 'aceptar',
        text: etiqueta.lbBtnAceptar,
        tooltip: etiqueta.lbTtbtnAceptar,
        handler: function () {
            adicionarModificarCartatecnologicaLogica(modificar, false);
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
    descripcion = new Ext.form.TextArea({
        maxLength: 255,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        mymaskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: etiqueta.lbMsgSoloALfa,
        maxLengthText: etiqueta.msgMaxLengthTextDescripcion,
        fieldLabel: etiqueta.lbDescripcion,
        allowBlank: true,
        blankText: etiqueta.lbmsgCampoObligatorio,
        anchor: '100%'
    });
    indicadorsalida = new Ext.form.TextField({
        id: 'cartaproducto',
        emptyText: etiqueta.lbEmptyTextSeleccionar,
        readOnly: true,
        disabled: false,
        fieldLabel: etiqueta.lbIndicadorSalida,
        xtype: 'textfield',
        allowBlank: false,
        anchor: '95%',
        listeners: {
            focus: function () {
                seleccionarIndicadorSalida();
            }
        }
    });
    cantidad = new Ext.form.TextField({
        id: 'cartarendimiento',
        fieldLabel: "Rendimiento",
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
        tituloventana = etiqueta.lbModificarCartatecnologica;
    } else {
        tituloventana = etiqueta.lbAdicionarCartatecnologica;
    }

    fpAdicionarCartatecnologica = new Ext.FormPanel({
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
                        items: [denominacion, descripcion, indicadorsalida, cantidad]
                    }]
            }]
    });

    if (modificar == true) {
        denominacion.setValue(smCartatecnologica.getSelected().data.denominacion);
        descripcion.setValue(smCartatecnologica.getSelected().data.descripcion);
        indicadorsalida.setValue(smCartatecnologica.getSelected().data.denominacionindicador);
        idindicador = smCartatecnologica.getSelected().data.idindicadorsalida;
        cantidad.setValue(smCartatecnologica.getSelected().data.cantidad);
    }

    if (modificar == true)
        var buttons = [btnCancelar, btnAceptar];
    else
        var buttons = [btnCancelar, btnAplicar, btnAceptar];

    winAdicionarCartatecnologica = new Ext.Window({
        title: tituloventana,
        modal: true,
        resizable: false,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fpAdicionarCartatecnologica,
        buttons: buttons,
        listeners: {
            beforedestroy: function (w) {
                stCartatecnologica.reload();
            }
        }
    });
    winAdicionarCartatecnologica.show();
}

function seleccionarIndicadorSalida() {
    var offsetSeleccionarIndicador = 0;
    smSeleccionarIndicador = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                Ext.getCmp('btnaceptarSeleccionarIndicador').enable();
            },
            rowdeselect: function () {
                Ext.getCmp('btnaceptarSeleccionarIndicador').disable();
            }
        }
    });
    cmSeleccionarIndicador = new Ext.grid.ColumnModel([{
            header: etiqueta.lbCodigo,
            tooltip: etiqueta.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: 'No. de pieza',
            tooltip: 'Número de pieza',
            width: 80,
            sortable: true,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbUM,
            tooltip: etiqueta.lbUM,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: etiqueta.lbPrecio,
            tooltip: etiqueta.lbPrecio,
            width: 80,
            sortable: true,
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbPrecioVenta,
            tooltip: etiqueta.lbPrecioVenta,
            width: 100,
            hidden: true,
            sortable: true,
            dataIndex: 'precioventa',
            renderer: crearToolTip
        }]);

    // Store grid stGpCT
    stSeleccionarIndicador = new Ext.data.Store({
        url: 'listarIndicadoresAdicionarCartatecnologica',
        listeners: {
            beforeload: function (st) {
                mymask.show();
                st.baseParams.start = offsetSeleccionarIndicador;
            },
            load: function () {
                cambiarTituloFiltrar(gpSeleccionarIndicador, filtrosSeleccionarIndicador, etiqueta.lbIndicadores);
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'precioventa'
            }, {
                name: 'numeropieza'
            }])
    });
    filtrosSeleccionarIndicador = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'codigo_ind_calculo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbumrendimiento',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'precioventa'
            }]
    });
    btnLimpiarSeleccionarIndicador = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosSeleccionarIndicador.clearFilters();
        }
    });
    gpSeleccionarIndicador = new Ext.grid.GridPanel({
        store: stSeleccionarIndicador,
        autoExpandColumn: 'expandir',
        sm: smSeleccionarIndicador,
        cm: cmSeleccionarIndicador,
        region: 'center',
        frame: true,
        plugins: filtrosSeleccionarIndicador,
        title: etiqueta.lbIndicadores,
        listeners: {
            celldblclick: function () {
                idindicador = smSeleccionarIndicador.getSelected().data.idindicador;
                indicadorsalida.setValue(smSeleccionarIndicador.getSelected().data.denominacion);
                windowSeleccionarIndicador.destroy();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stSeleccionarIndicador,
            displayInfo: true,
            items: ['-', btnLimpiarSeleccionarIndicador],
            listeners: {
                beforechange: function (p, e) {
                    offsetSeleccionarIndicador = e.start;
                }
            }
        })
    });
    // Colum Model grid Norma
    windowSeleccionarIndicador = new Ext.Window({
        width: 750,
        constrain: true,
        height: 450,
        closeAction: 'destroy',
        layout: 'fit',
        title: etiqueta.lbAdicionarIndicadorSalida,
        items: gpSeleccionarIndicador,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: etiqueta.lbBtnCancelar,
                tooltip: etiqueta.lbTtbtnCancelar,
                handler: function () {
                    windowSeleccionarIndicador.destroy();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnaceptarSeleccionarIndicador',
                text: etiqueta.lbBtnAceptar,
                tooltip: etiqueta.lbTtbtnAceptar,
                disabled: true,
                handler: function () {
                    idindicador = smSeleccionarIndicador.getSelected().data.idindicador;
                    indicadorsalida.setValue(smSeleccionarIndicador.getSelected().data.denominacion);
                    windowSeleccionarIndicador.destroy();
                }
            }],
        listeners: {
            beforeshow: function (w) {
                stSeleccionarIndicador.reload();
            }
        }
    });
    windowSeleccionarIndicador.show();
}

function adicionarModificarCartatecnologicaLogica(modificar, aplicar) {
    var mensa = "";
    idcartatecindustrial = null;
    if (modificar == true) {
        mensa = etiqueta.msgModificando;
        idcartatecindustrial = smCartatecnologica.getSelected().data.idcartatecindustrial;
    } else {
        mensa = etiqueta.msgAdicionando;
    }

    if (fpAdicionarCartatecnologica.getForm().isValid()) {
        mymask.show();
        fpAdicionarCartatecnologica.getForm().submit({
            url: 'adicionarCartatecnologica',
            params: {
                idcartatecindustrial: idcartatecindustrial,
                denominacion: denominacion.getValue(),
                descripcion: descripcion.getValue(),
                idindicador: idindicador,
                cantidad: cantidad.getValue()
            },
            waitMsg: mensa,
            failure: function (form, action) {
                responseData = action.result;
                if (responseData.codMsg == 1) {
                    if (modificar == true) {
                        mostrarMensaje(1, etiqueta.msgCartaModificadaOk);
                    } else {
                        mostrarMensaje(1, etiqueta.msgCartaAdicionadaOk);
                    }

                    if (aplicar == true) {
                        denominacion.reset();
                        descripcion.reset();
                        indicadorsalida.reset();
                        cantidad.reset();
                        idindicador = null;
                    } else {
                        winAdicionarCartatecnologica.destroy();
                    }

                } else {
                    if (modificar == true) {
                        mostrarMensaje(1, etiqueta.msgCartaModificadaNo);
                    } else {
                        mostrarMensaje(1, etiqueta.msgCartaAdicionadaNo);
                    }
                }
                mymask.hide();
            }
        });
    } else {
        mostrarMensaje(1, etiqueta.msgErrorFormulario);
    }
}

function eliminarCartatecnologica(btnPresionado) {
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
        var recordsSel = smCartatecnologica.getSelections(), objetosProcesar = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                objetosProcesar.push(recordsSel[i].data.idcartatecindustrial);
            Ext.Ajax.request({
                url: 'eliminarCartatecnologica',
                params: {
                    idcartatecindustrial: Ext.encode(objetosProcesar)
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, etiqueta.msgCartaEliminadaOk);
                    } else {
                        mostrarMensaje(1, etiqueta.msgCartaEliminadaNo);
                    }
                    stCartatecnologica.reload();
                }
            });
        }
    }
}

function aprobarCartatecnologica(idaprobacion) {
    var mensajeElim = Ext.MessageBox.show({
        title: etiqueta.lbPorFavorEspere,
        msg: etiqueta.msgAprobando,
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6'
    });
    var recordsSel = smCartatecnologica.getSelections(), objetosProcesar = [];
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            if (idaprobacion == 4) {
                if (recordsSel[i].data.idaprobacion < 4)
                    objetosProcesar.push(recordsSel[i].data.idcartatecindustrial);
            } else {
                if (recordsSel[i].data.idaprobacion != 1)
                    objetosProcesar.push(recordsSel[i].data.idcartatecindustrial);
            }
        }
        if (objetosProcesar.length > 0) {
            Ext.Ajax.request({
                url: 'aprobarCartatecnologica',
                params: {
                    idaprobacion: idaprobacion,
                    idcartatecindustrial: Ext.encode(objetosProcesar)
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg > 0) {
                        if (idaprobacion == 1) {
                            mostrarMensaje(1, etiqueta.msgCartaDesaprobadaOk);
                        } else {
                            if (objetosProcesar.length == responseData.codMsg) {
                                mostrarMensaje(1, etiqueta.msgCartaAprobadaOk);
                            } else {
                                mostrarMensaje(1, etiqueta.msgCartaAprobadaNoTodas);
                            }
                        }
                    } else {
                        if (idaprobacion == 1) {
                            mostrarMensaje(1, etiqueta.msgCartaDesaprobadaNo);
                        } else {
                            mostrarMensaje(1, etiqueta.msgCartaAprobadaNo);
                        }
                    }
                    stCartatecnologica.reload();
                }
            });
        }
        mensajeElim.hide();
    }
}

function exportarCartatecnologica(tipo) {
    var recordsSel = smCartatecnologica.getSelections(), objetosProcesar = [];

    if (recordsSel.length > 0)
        for (var i = 0; i < recordsSel.length; i++) {
            objetosProcesar.push(recordsSel[i].data.idcartatecindustrial);
        }

    var win = window.open('exportarCartatecnologica?tipo=' + tipo +
            '&idcartatecindustrial=' + Ext.encode(objetosProcesar) +
            '&filtros=' + Ext.encode(filtrosCartatecnologica.getFilterData()));
    mascaraExportar(etiqueta.lbExportandoDatos, etiqueta.lbEsperePorFavor, win);
}