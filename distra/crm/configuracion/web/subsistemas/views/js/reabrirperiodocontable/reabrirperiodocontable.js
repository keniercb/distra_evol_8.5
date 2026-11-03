var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
etiqueta = Object();
UCID.portal.cargarEtiquetas('reabrirperiodocontable', cargaretiquetas);
var etiqueta = new Object();
var beforeloadstReabrirperiodocontable = false;
var textoPaginadoReabrirperiodocontable = new Ext.form.Label({
    xtype: 'label',
    text: ""
});

var prioini = 1;
function cargaretiquetas() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        initEtiquetas();
    });
}
function cargaInicial() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
    mymask.show();
    stEjercicios = new Ext.data.Store({
        url: 'cargarEjerciciosContables',
        autoLoad: true,
        id: 'stUsuarios',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'nombre'
            }]),
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.ejercicioActual.idejercicio);
                stPeriodos.reload();
                cargarInterfaz();
            }
        }
    });
    stPeriodos = new Ext.data.Store({
        url: 'cargarPeriodosContables',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idperiodo'
        }, [{
                name: 'idperiodo'
            }, {
                name: 'nombre'
            }]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.idejercicio = cbEjercicio.getValue();
            },
        }
    });
    stSubsistemas = new Ext.data.Store({
        url: 'cargarSubsistemas',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idsubsistema'
        }, [{
                name: 'idsubsistema'
            }, {
                name: 'denominacion'
            }]),
    });
    stEstructuras = new Ext.data.Store({
        url: 'cargarEstructuras',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructurae'
        }, [{
                name: 'idestructurae'
            }, {
                name: 'descripcion'
            }]),
    });
    cbEjercicio = new Ext.form.ComboBox({
        store: stEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'nombre',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: etiqueta.lbEmptyTextSeleccionar,
        loadingText: etiqueta.lbCargando,
        width: 140,
        listeners: {
            select: function (cb, rec, index) {
                stReabrirperiodocontable.reload();
            }
        }
    });
}
function cargarInterfaz() {
    stReabrirperiodocontable = new Ext.data.Store({
        url: 'listarSolicitudes',
        listeners: {
            beforeload: function (st, options) {
                mymask.show();
                beforeloadstReabrirperiodocontable = true;
                st.baseParams.idejercicio = cbEjercicio.getValue();
                cambiarTituloFiltrar(gpReabrirperiodocontable, filtrosReabrirperiodocontable, etiqueta.lbSolicitudes);
            },
            load: function (st, records, options) {
                if (st.getCount() == 0) {
                    if (beforeloadstReabrirperiodocontable) {
                        mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                    }
                }
                beforeloadstReabrirperiodocontable = false;
                if (st.getCount() > 0) {
                    textoPaginadoReabrirperiodocontable.setText(etiqueta.lbMostrando + st.getCount() + etiqueta.lbDe + st.getCount());
                    btnExportarSolicitudes.enable();
                } else {
                    textoPaginadoReabrirperiodocontable.setText(etiqueta.msgNoExistenDatos);
                    btnExportarSolicitudes.disable();
                }
                controlarObjetos();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idperiodoabierto'
            }, {
                name: 'periodo'
            }, {
                name: 'entidad'
            }, {
                name: 'idsubsistema'
            }, {
                name: 'subsistema'
            }, {
                name: 'usuariosolicitud'
            }, {
                name: 'fechasolicitud'
            }, {
                name: 'observacionsolicitud'
            }, {
                name: 'usuarioaprobacion'
            }, {
                name: 'fechaaprobacion'
            }, {
                name: 'observacionaprobacion'
            }, {
                name: 'estado'
            }, {
                name: 'fechacierre'
            }, {
                name: 'tieneoperaciones'
            }, {
                name: 'usuariocierre'
            }
        ])
    });
    smReabrirperiodocontable = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetos();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetos();
            }
        }
    });
    cmReabrirperiodocontable = new Ext.grid.ColumnModel([
        {
            header: 'Período',
            tooltip: 'Período',
            width: 100,
            sortable: true,
            dataIndex: 'periodo',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbSubsistema,
            width: 100,
            sortable: true,
            dataIndex: 'subsistema',
            tooltip: etiqueta.lbSubsistema,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbEntidad,
            width: 200,
            sortable: true,
            dataIndex: 'entidad',
            tooltip: etiqueta.lbEntidad,
            renderer: crearToolTip
        }, {
            header: 'Solicita',
            width: 100,
            sortable: true,
            dataIndex: 'usuariosolicitud',
            tooltip: 'Usuario que solita',
            renderer: crearToolTip
        }, {
            header: 'Motivo de la solicitud',
            width: 300,
            sortable: true,
            dataIndex: 'observacionsolicitud',
            tooltip: 'Motivo de la solicitud',
            renderer: crearToolTip
        }, {
            header: 'Fecha de la solicitud',
            width: 120,
            sortable: true,
            dataIndex: 'fechasolicitud',
            tooltip: 'Fecha de la solicitud',
            renderer: crearToolTip
        }, {
            header: 'Aprobado/rechazado por',
            width: 140,
            sortable: true,
            dataIndex: 'usuarioaprobacion',
            tooltip: 'Usuario que aprueba/rechaza la solicitud',
            renderer: crearToolTip
        }, {
            header: 'Observación',
            width: 300,
            sortable: true,
            dataIndex: 'observacionaprobacion',
            tooltip: 'Observación',
            renderer: crearToolTip
        }, {
            header: 'Fecha de la aprobación',
            width: 120,
            sortable: true,
            dataIndex: 'fechaaprobacion',
            tooltip: 'Fecha de la aprobación',
            renderer: crearToolTip
        }, {
            header: 'Estado',
            width: 80,
            sortable: true,
            dataIndex: 'estado',
            tooltip: 'Estado',
            align: 'center',
            renderer: modificarEstado
        }, {
            header: 'Tiene operaciones',
            width: 120,
            sortable: true,
            dataIndex: 'tieneoperaciones',
            tooltip: 'Tiene operaciones',
            renderer: renderSiNo
        }, {
            header: 'Cerrado por',
            width: 140,
            sortable: true,
            hidden: true,
            dataIndex: 'usuariocierre',
            tooltip: 'Usuario que cerró el subsistema',
            renderer: crearToolTip
        }, {
            header: 'Fecha de cierre',
            width: 120,
            sortable: true,
            hidden: true,
            dataIndex: 'fechacierre',
            tooltip: 'Fecha de cierre',
            renderer: crearToolTip
        }
    ]);
    filtrosReabrirperiodocontable = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'periodo',
                idcombo: 'idcbperiodo',
                valueFieldcb: 'idperiodo',
                displayFieldcb: 'nombre',
                st: stPeriodos,
                autoload: true,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'subsistema',
                idcombo: 'idcbsubsistema',
                valueFieldcb: 'idsubsistema',
                displayFieldcb: 'denominacion',
                st: stSubsistemas,
                autoload: true,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'entidad',
                idcombo: 'idcbentidad',
                valueFieldcb: 'idestructurae',
                displayFieldcb: 'descripcion',
                st: stEstructuras,
                autoload: true,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [[0, etiqueta.lbPendiente], [1, etiqueta.lbAprobado], [2, etiqueta.lbRechazado], [3, etiqueta.lbCerrado]]
            }, {
                type: 'list',
                dataIndex: 'tieneoperaciones',
                options: [[0, etiqueta.lbNo], [1, etiqueta.lbSi]]
            }]
    });
    btnAprobarReabrirperiodocontable = new Ext.Toolbar.Button({
        id: 'btnAprobarReabrirperiodocontable',
        iconCls: 'aprobar',
        tooltip: 'Aprobar',
        text: 'Aprobar',
        disabled: true,
        handler: function () {
            ventanaAprobarReabrirperiodocontable('aprobar');
        }
    });
    btnRechazarReabrirperiodocontable = new Ext.Toolbar.Button({
        id: 'btnRechazarReabrirperiodocontable',
        iconCls: 'desaprobar',
        tooltip: 'Rechazar',
        text: 'Rechazar',
        disabled: true,
        handler: function () {
            ventanaAprobarReabrirperiodocontable('rechazar');
        }
    });
    btnExportarSolicitudes = new Ext.Toolbar.Button({
        id: 'btnExportarSolicitudes',
        iconCls: 'exportar',
        tooltip: 'Exportar solicitudes',
        text: 'Exportar solicitudes',
        disabled: true,
        handler: function () {
            var win = window.open('exportarSolicitudes?idejercicio=' + cbEjercicio.getValue() +
                    '&denoejercicio=' + cbEjercicio.getRawValue());
        }
    });
    btnExportarOperaciones = new Ext.Toolbar.Button({
        id: 'btnExportarOperaciones',
        iconCls: 'desaprobar',
        tooltip: 'Exportar operaciones',
        text: 'Exportar operaciones',
        disabled: true,
        handler: function () {
            var win = window.open('exportarOperaciones?idejercicio=' + cbEjercicio.getValue() +
                    '&denoejercicio=' + cbEjercicio.getRawValue() +
                    '&periodoabierto=' + Ext.encode(smReabrirperiodocontable.getSelected().data));
        }
    });
    btnActualizarReabrirperiodocontable = new Ext.Button({
        disabled: false,
        iconCls: 'actualizar',
        tooltip: etiqueta.lbActualizar,
        handler: function () {
            if (stReabrirperiodocontable.reader != undefined)
                stReabrirperiodocontable.reload();
        }
    });
    btnLimpiarReabrirperiodocontable = new Ext.Button({
        disabled: false,
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            if (stReabrirperiodocontable.reader != undefined)
                filtrosReabrirperiodocontable.clearFilters();
        }
    });
    gpReabrirperiodocontable = new Ext.grid.GridPanel({
        id: 'gpReabrirperiodocontable',
        store: stReabrirperiodocontable,
        region: 'center',
        sm: smReabrirperiodocontable,
        cm: cmReabrirperiodocontable,
        plugins: filtrosReabrirperiodocontable,
        title: etiqueta.lbSolicitudes,
        bbar: [btnActualizarReabrirperiodocontable, btnLimpiarReabrirperiodocontable, '->', textoPaginadoReabrirperiodocontable],
        viewConfig: {
            getRowClass: function (record, index) {
                if (record.data.estado == 0) {
                    return 'fila_amarillo';
                } else
                if (record.data.estado == 1) {
                    return 'fila_verde';
                } else
                if (record.data.estado == 2) {
                    return 'fila_rojo';
                } else
                if (record.data.estado == 3) {
                    return 'fila_azul';
                }
            }
        },
    });
    viewReabrirperiodocontable = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            tbar: [{
                    xtype: 'tbtext',
                    text: 'Ejercicio' + ': '
                }, cbEjercicio, btnAprobarReabrirperiodocontable, btnRechazarReabrirperiodocontable, '-', btnExportarSolicitudes, btnExportarOperaciones],
            items: [gpReabrirperiodocontable]
        })
    });
    stReabrirperiodocontable.reload();
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + 'Aprobado' + '"';
        return 'Aprobado';
    } else
    if (val == 2) {
        m.attr = 'ext:qtip="' + 'Rechazado' + '"';
        return 'Rechazado';
    } else
    if (val == 3) {
        m.attr = 'ext:qtip="' + 'Cerrado' + '"';
        return 'Cerrado';
    } else {
        m.attr = 'ext:qtip="' + 'Pendiente' + '"';
        return 'Pendiente';
    }
}

function renderSiNo(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
}

function controlarObjetos() {
    btnAprobarReabrirperiodocontable.disable();
    btnRechazarReabrirperiodocontable.disable();
    btnExportarOperaciones.disable();

    if (smReabrirperiodocontable.hasSelection()) {
        if (smReabrirperiodocontable.getSelected().data.estado == 0) {
            btnAprobarReabrirperiodocontable.enable();
            btnRechazarReabrirperiodocontable.enable();
        } else
        if (smReabrirperiodocontable.getSelected().data.tieneoperaciones > 0) {
            btnExportarOperaciones.enable();
        }
    }
}

function ventanaAprobarReabrirperiodocontable(accion) {
    btnCancelarAprobarReabrirperiodocontable = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAprobarReabrirperiodocontable',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            winAprobarReabrirperiodocontable.destroy();
        }
    });
    btnAceptarAprobarReabrirperiodocontable = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarAprobarReabrirperiodocontable',
        nextTab: 'denominacion',
        disabled: true,
        text: 'Aceptar',
        tooltip: 'Guardar los datos y cerrar la ventana',
        handler: function () {
            if (fpAprobarReabrirperiodocontable.getForm().isValid()) {
                if (accion == 'aprobar') {
                    Ext.Msg.show({
                        title: 'Confirmaci&oacute;n',
                        msg: '<span style="color: red"><b>Ud. está intentando reabrir el período contable anterior para el subsistema actual. Este proceso tendrá consecuencias y podrá efectar la integridad de funcionamiento de otros subsistemas contables. Las operaciones realizadas bajo estas condiciones tendrán un tratamiento especial</b></span> <b> &iquest;Est&aacute; seguro que desea reabrir el período contable anterior?</b>',
                        buttons: Ext.Msg.OKCANCEL,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn, text) {
                            if (btn == 'ok') {
                                aprobarReabrirperiodocontablePeticion(accion);
                            }
                        }
                    });
                } else {
                    aprobarReabrirperiodocontablePeticion(accion);
                }
            }
        }
    });
    if (accion == 'aprobar')
        emptyText = 'Observaciones sobre la aprobación de la solicitud, acuerdos o resultados del análisis realizado...';
    else
        emptyText = 'Acuerdos o resultados del análisis realizado...';
    txfAprobarReabrirperiodocontable = new Ext.form.TextArea({
        id: 'observacion',
        width: '100%',
        height: 100,
        stateful: true,
        preventScrollbars: true,
        allowBlank: false,
        minLength: 1,
        emptyText: emptyText,
        enableKeyEvents: true,
        hideLabel: true,
        listeners: {
            keyup: function (tf, e) {
                if (tf.isValid()) {
                    btnAceptarAprobarReabrirperiodocontable.enable();
                } else {
                    btnAceptarAprobarReabrirperiodocontable.disable();
                }
            }
        }
    });
    var buttons = [btnCancelarAprobarReabrirperiodocontable, btnAceptarAprobarReabrirperiodocontable];
    fpAprobarReabrirperiodocontable = new Ext.FormPanel({
        id: 'fpAprobarReabrirperiodocontable',
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
                        items: txfAprobarReabrirperiodocontable
                    }]
            }]
    });
    if (accion == 'aprobar')
        title = 'Declarar motivo para aprobar la apertura del período contable';
    else
        title = 'Declarar motivo para rechazar la apertura del período contable';
    winAprobarReabrirperiodocontable = new Ext.Window({
        id: 'winAprobarReabrirperiodocontable',
        title: title,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        resizable: true,
        width: 750,
        height: 500,
        autoHeight: true,
        items: fpAprobarReabrirperiodocontable,
        buttons: buttons,
        listeners: {
            beforedestroy: function () {
                stReabrirperiodocontable.reload();
                Ext.Msg.hide();
            },
        }
    });
    winAprobarReabrirperiodocontable.show();

    function aprobarReabrirperiodocontablePeticion(accion) {
        Ext.Ajax.timeout = 60000;
        if (fpAprobarReabrirperiodocontable.getForm().isValid()) {
            fpAprobarReabrirperiodocontable.getForm().submit({
                url: 'aprobarSolicitud',
                params: {
                    observacion: txfAprobarReabrirperiodocontable,
                    idperiodoabierto: smReabrirperiodocontable.getSelected().data.idperiodoabierto,
                    idsubsistema: smReabrirperiodocontable.getSelected().data.idsubsistema,
                    subsistema: smReabrirperiodocontable.getSelected().data.subsistema,
                    accion: accion
                },
                failure: function (form, action) {
                    winAprobarReabrirperiodocontable.destroy();
                    var responseData = action.result;
                    if (responseData.code == 3) {
                        Ext.Msg.show({
                            title: 'Notificación',
                            msg: responseData.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO,
                        });
                    } else {
                        Ext.Msg.show({
                            title: '¡Atención!',
                            msg: responseData.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING,
                        });
                    }
                }
            });
        }
    }
}

function cambiarTituloFiltrar(gridPanel, filtro, label) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(label);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(label + " - <i> " + etiqueta.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
