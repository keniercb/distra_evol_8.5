var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('configurardepreciacion', cargarInterfaz);
var winImp, offsetDepreciacion = 0, offsetdin = 0, offsetIndicadorDepreciacion = 0;
function cargarInterfaz() {
    
    
    
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaConfDep',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtAyuda
    });
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

initimportarconfigurardepreciacion();

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
   
    filtrosIndicadorDepreciacion = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbum',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'listado',
                dataIndex: 'idnaturaleza',
                idcombo: 'idcbnaturalezas',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stNaturaleza,
                autoload: false,
                mode: 'local'
            }]
    });
    //***********grid panel****************
    stIndicadorDepreciacion = new Ext.data.Store({
        url: 'listarIndicadoresParaAdicionar',
        listeners: {
            beforeload: function () {
                stIndicadorDepreciacion.baseParams.start = offsetIndicadorDepreciacion;
                cambiarTituloFiltrar(gpIndicadorDepreciacion, filtrosIndicadorDepreciacion, perfil.etiquetas.lbIndicadores);
            },
            load: function () {
                controlar_objetosAdicionar();
                if (stIndicadorDepreciacion.getCount() == 0) {
                    if (filtrosIndicadorDepreciacion.getFiltrosActivos() == undefined || filtrosIndicadorDepreciacion.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                }
            }
        },
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            id: 'idindicador',
            root: 'data'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'numeropieza'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'idnaturaleza'
            }])
    });
    //**********checbox************************************
    checkIndicadorDepreciacion = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                controlar_objetosAdicionar();
            },
            rowdeselect: function () {
                controlar_objetosAdicionar();
            }
        }
    });
    //***************************************************

    cmIndicadorDepreciacion = new Ext.grid.ColumnModel([checkIndicadorDepreciacion, {
            width: 100,
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNumeroPieza,
            tooltip: perfil.etiquetas.lbNumeroPieza,
            width: 100,
            dataIndex: 'numeropieza',
            hidden: true,
            renderer: crearToolTip
        }, {
            width: 100,
            header: perfil.etiquetas.lbUnidadMedida,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            width: 100,
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            sortable: true,
            align: 'right',
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            width: 100,
            header: perfil.etiquetas.lbNaturaleza,
            tooltip: perfil.etiquetas.lbNaturaleza,
            sortable: true,
            dataIndex: 'idnaturaleza',
            renderer: renderNaturaleza
        }]);
    /*smIndicadorDepreciacion = new Ext.grid.RowSelectionModel({
     singleSelect: false,
     listeners: {
     rowselect: function () {
     controlar_objetosAdicionar();
     
     }, rowdeselect: function () {
     controlar_objetosAdicionar();
     
     }
     }
     });*/
    btnLimpiarIndicadorDepreciacion = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarIndicadorDepreciacion',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrosIndicadorDepreciacion.clearFilters();
        }
    });
    gpIndicadorDepreciacion = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        id: 'gpIndicadorDepreciacion',
        store: stIndicadorDepreciacion,
        plugins: filtrosIndicadorDepreciacion,
        sm: checkIndicadorDepreciacion, //smIndicadorDepreciacion,
        cm: cmIndicadorDepreciacion,
        region: 'west',
        autoExpandColumn: 'expandir',
        height: 480,
        width: 750,
        margins: '2 2 2 2',
        anchor: '95%',
        title: perfil.etiquetas.lbIndicadores,
        listeners: {
            celldblclick: function () {
                adicionarIndicadores(false);
                gpIndicadorDepreciacion.getSelectionModel().clearSelections();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stIndicadorDepreciacion,
            displayInfo: true,
            items: ['-', btnLimpiarIndicadorDepreciacion],
            listeners: {
                beforechange: function (p, e) {
                    offsetIndicadorDepreciacion = e.start;
                }
            }
        })
    });
    //***************window adicionar indicadores************
    winIndicadorDepreciacion = new Ext.Window({
        modal: true,
        id: 'winIndicador',
        constrain: true,
        width: 850,
        height: 570,
        closeAction: 'hide',
        items: gpIndicadorDepreciacion, //panelIndicadorDepreciacion,
        layout: 'fit',
        title: perfil.etiquetas.lbAdicionarDepreciacion,
        listeners: {
            beforeshow: function () {
                stIndicadorDepreciacion.reload();
            },
            beforehide: function () {
                stDepreciacion.reload();
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winIndicadorDepreciacion.hide();
                    gpIndicadorDepreciacion.getSelectionModel().clearSelections();
                }
            }, {
                id: 'btnaplicar',
                iconCls: 'aplicar',
                disabled: true,
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    adicionarIndicadores(true);
                    gpIndicadorDepreciacion.getSelectionModel().clearSelections();
                }
            }, {
                id: 'btnaceptar',
                iconCls: 'aceptar',
                disabled: true,
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarIndicadores(false);
                    gpIndicadorDepreciacion.getSelectionModel().clearSelections();
                }
            }]
    });
    btnAdicionar = new Ext.Button({
        id: 'btnAdd',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionar,
        disabled: false,
        handler: function () {
            winIndicadorDepreciacion.show();
        }
    });
    btnGuardar = new Ext.Button({
        id: 'btnSave',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar,
        disabled: true,
        handler: function () {
            GuardarTodos();
        }
    });
    btnEliminar = new Ext.Button({
        id: 'btnEli',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        disabled: true,
        handler: function () {
            accionvalidar = 'eliminar';
            EliminarDepreciacion();
        }
    });
    btnExportar = new Ext.Button({
        id: 'btnExp',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        disabled: true,
        handler: function () {
            exportar();
        }
    });
    btnImportar = new Ext.Button({
        id: 'btnImp',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportar,
        disabled: false,
        handler: function () {
            winImportar(fpbuscar);
        }
    });
    btnLimpiarDepreciacion = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarDepreciacion',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosDepreciacion.clearFilters();
            /*controlarObjetosAct();*/
        }
    });
    stDepreciacion = new Ext.data.Store({
        url: 'listarDepreciaciones',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stDepreciacion.baseParams.start = offsetDepreciacion;
            },
            load: function (mi, record) {
                cambiarTituloFiltrar(gpDepreciacion, filtrosDepreciacion, perfil.etiquetas.lbDepreciaciones);
                if (stDepreciacion.getCount() == 0) {
                    if (filtrosDepreciacion.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    }
                }
                controlarObjetosDepreciacion();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'iddepreciacionequipo'
            }, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'numeropieza'
            }, {
                name: 'cantidad'
            }, {
                name: 'precio'
            }, {
                name: 'valoraf'
            }, {
                name: 'tasadepreciacion'
            }, {
                name: 'depreciacionanual'
            }, {
                name: 'enuso'
            }])
    });
    filtrosDepreciacion = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'valoraf'
            }, {
                type: 'numeric',
                dataIndex: 'tasadepreciacion'
            }, {
                type: 'numeric',
                dataIndex: 'depreciacionanual'
            }, {
                type: 'list',
                dataIndex: 'enuso',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }]
    });
    smDepreciacion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function (sm) {
                controlarObjetosDepreciacion();
                arrayPadre = [];
                for (var j = 0; j < smDepreciacion.getSelections().length; j++) {
                    arrayPadre.push(smDepreciacion.getSelections()[j].data);
                }
            },
            rowdeselect: function () {
                arrayPadre = [];
                for (var j = 0; j < smDepreciacion.getSelections().length; j++) {
                    arrayPadre.push(smDepreciacion.getSelections()[j].data);
                }
                if (smDepreciacion.getSelections().length < 1) {
                    btnEliminar.disable();
                }
            }
        }
    });
    cmDepreciacion = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNumeroPieza,
            tooltip: perfil.etiquetas.lbNumeroPieza,
            width: 100,
            dataIndex: 'numeropieza',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                allowBlank: false
            })
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbValorAF,
            tooltip: perfil.etiquetas.lbValorAF,
            width: 120,
            sortable: true,
            dataIndex: 'valoraf',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbTasaDepreciacion,
            tooltip: perfil.etiquetas.lbTasaDepreciacion,
            dataIndex: 'tasadepreciacion',
            align: 'right',
            sortable: true,
            width: 120,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 3,
                allowBlank: false
            })
        }, {
            header: perfil.etiquetas.lbDepreciacionAnual,
            tooltip: perfil.etiquetas.lbDepreciacionAnual,
            dataIndex: 'depreciacionanual',
            align: 'right',
            sortable: true,
            width: 120,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEnUso,
            tooltip: perfil.etiquetas.lbEnUso,
            dataIndex: 'enuso',
            align: 'center',
            sortable: true,
            width: 120,
            renderer: renderEnUso
        }]);
    gpDepreciacion = new Ext.grid.EditorGridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosDepreciacion,
        store: stDepreciacion,
        sm: smDepreciacion,
        cm: cmDepreciacion,
        title: perfil.etiquetas.lbDepreciaciones,
        region: 'center',
        enableKeyEvents: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            store: stDepreciacion,
            displayInfo: true,
            items: ['-', btnLimpiarDepreciacion],
            listeners: {
                beforechange: function (p, e) {
                    offsetDepreciacion = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function () {
                btnGuardar.enable();
            }
        },
        tbar: [btnAdicionar, btnGuardar, btnEliminar, '-', btnExportar, '-', btnImportar]
    });
    pView = new Ext.Panel({
        id: 'pView',
        layout: 'fit',
        tbar: ['->', btnAyuda],
        items: [gpDepreciacion]
    });
    // viewport de la plantilla
    vpCT = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCD',
        items: [pView]
    });
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderEnUso(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
}


function adicionarIndicadores(aplicar) {
//mymask.show();
    var mensajeConf = Ext.MessageBox.show({
        title: perfil.etiquetas.lbEspere,
        msg: perfil.etiquetas.msgAdicionandoDepreciacion,
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        id: 'idmensaje'
    });
    var indicadores_sel = [];
    for (i = 0; i < gpIndicadorDepreciacion.getSelectionModel().getCount(); i++) {
        indicadores_sel.push(
                gpIndicadorDepreciacion.getSelectionModel().getSelections()[i].data.idindicador
                );
    }
    Ext.Ajax.request({
        url: 'adicionarIndicador',
        params: {
            idindicadores: Ext.encode(indicadores_sel)
        },
        callback: function (options, success, response) {
            mensajeConf.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {
                mostrarMensaje(1, perfil.etiquetas.msgAdicionadoDepreciacionOk);
                if (!aplicar) {
                    winIndicadorDepreciacion.hide();
                } else {
                    stIndicadorDepreciacion.reload();
                }

            } else {
                mostrarMensaje(2, perfil.etiquetas.msgAdicionadoDepreciacionNo);
            }
        }
    });
}

function EliminarDepreciacion() {
    if (gpDepreciacion.getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgSeleccionarDepreciacion);
    } else {
        mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarEliminarDepreciacion, eliminarDepreciacionesSeleccionadas);
    }
}

function eliminarDepreciacionesSeleccionadas(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        var recordsSel = gpDepreciacion.getSelectionModel().getSelections(), indElim = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                indElim.push(recordsSel[i].data.idindicador);
            }

            Ext.Ajax.request({
                url: 'eliminarIndicador',
                params: {
                    indicadores: Ext.encode(indElim)
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg > 0) {
                        gpDepreciacion.getStore().reload();
                        mostrarMensaje(2, perfil.etiquetas.msgEliminandoDepreciacionOk);
                    } else if (responseData.mensaje != null)
                        mostrarMensaje(2, responseData.mensaje);
                    else
                        mostrarMensaje(2, perfil.etiquetas.msgEliminandoDepreciacionNo);
                }
            });
        }
    }
}

function GuardarTodos() {
    mensajeBox = Ext.MessageBox.show({
        title: perfil.etiquetas.lbEspere,
        msg: perfil.etiquetas.msgGuardandoDepreciacion,
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6'
    });
    var recordsEnviar = [];
    var modified = gpDepreciacion.getStore().getModifiedRecords();
    if (!Ext.isEmpty(modified)) {
        Ext.each(modified, function (record) {
            recordsEnviar.push(Ext.apply(record.data));
        });
        Ext.Ajax.request({
            url: 'modificarIndicadores',
            params: {
                valores: Ext.encode(recordsEnviar)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    /*for (i = 0; i < recordsEnviar.length; i++) {
                     stGpActividades.getById(recordsEnviar[i].idcartatecnologicaactividad).commit();
                     }*/
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoDepreciacionOk);
                    stDepreciacion.reload();
                } else {
                    mostrarMensaje(2, responseData.mensaje);
                }
                mensajeBox.hide();
            }
        });
    }
}

function exportar() {
    var win = window.open("exportar" + "?filtros=" + Ext.encode(filtrosDepreciacion.getFilterData()));
}

function controlarObjetosDepreciacion() {
    btnGuardar.disable();
    btnEliminar.disable();
    btnExportar.disable();
    if (gpDepreciacion.getSelections().length > 0) {
        if (gpDepreciacion.getSelections().length == 1) {
            if (smDepreciacion.getSelected().data.enuso == 0) {
                btnEliminar.enable();
            }
        } else {
            btnEliminar.enable();
        }
    }

    if (stDepreciacion.data.length > 0 || filtrosDepreciacion.getFiltrosActivos().length > 0) {
        btnExportar.enable();
    }
}


function renderUM(value, m) {
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
}

function renderNaturaleza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stNaturaleza.data.items.length; i++)
        if (stNaturaleza.data.items[i].data.naturaleza == value) {
            m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
            return stNaturaleza.data.items[i].data.denominacion;
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

function controlar_objetosAdicionar() {
    Ext.getCmp('btnaplicar').disable();
    Ext.getCmp('btnaceptar').disable();
    if (checkIndicadorDepreciacion.getSelections().length > 0) {
        Ext.getCmp('btnaplicar').enable();
        Ext.getCmp('btnaceptar').enable();
    }
}