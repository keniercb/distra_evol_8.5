function cargarControlFunciones() {
}
//funciones de interfaz
function cambiarPaneles(v) {
    Ext.getCmp('tabPanelControl').hideTabStripItem('tabControlProductor');
    Ext.getCmp('tabPanelControl').hideTabStripItem('tabControlEmpresa');
    Ext.getCmp('tabPanelControl').hideTabStripItem('tabControlRector');
    Ext.getCmp('tabPanelControl').hideTabStripItem('tabDefecto');
    if (v == 1) {
        //productor
        Ext.getCmp('tabPanelControl').setActiveTab('tabControlProductor');
        Ext.getCmp('tabPanelControl').unhideTabStripItem('tabControlProductor');
        Ext.getCmp('tabControlProductor').setTitle('Control' + denomEntidadSelecionada);
    } else
    if (v == 2) {
        //empresa
        Ext.getCmp('tabPanelControl').setActiveTab('tabControlEmpresa');
        Ext.getCmp('tabPanelControl').unhideTabStripItem('tabControlEmpresa');
        Ext.getCmp('tabControlEmpresa').setTitle('Control' + denomEntidadSelecionada);
    } else
    if (v == 3) {
        //rector
        Ext.getCmp('tabPanelControl').setActiveTab('tabControlRector');
        Ext.getCmp('tabPanelControl').unhideTabStripItem('tabControlRector');
        Ext.getCmp('tabControlRector').setTitle('Control' + denomEntidadSelecionada);
    }
    Ext.getCmp('tabPanelControl').show();
    Ext.getCmp('tabPanelControl').enable();
}
function crearToolTip(val, m) {
    if (val == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}
function renderMeses(val, m) {
    if (val == 0) {
        m.attr = 'ext:qtip="0.000"';
        return "0.000";
    } else {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}
function renderUM(value, m) {
    for (var i = 0; i < stum.getTotalCount(); i++) {
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.abreviaturaunidadmedida + '"';
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderFecha(val, m) {
   // console.log(val);
    try {
        if (val != null) {
            var temp = val.split(':');
            var tempC = val.split(' ');
            var v = temp[0] + ':' + temp[1];
            m.attr = 'ext:qtip="' + v + '"';
            return tempC[0];
        }
        return val;
    } catch (err) {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}
function formatDate(value) {
    if (value == null || value == "")
        return 'Sin fecha';
    else {
        if (value.length > 10) {
            var dt = new Date(value.substring(0, 4), parseInt(value.substring(5, 7)) - 1, value.substring(8, 10));
            return dt.format('d-m-Y');
        } else {
            var dt = new Date(value);
            return dt.format('d-m-Y');
        }
    }
}
function renderUsuarios(value, m) {
    for (var i = 0; i < stUsuarios.getTotalCount(); i++) {
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesEjecutor(value, m) {
    for (var i = 0; i < stEntidadesEjecutor.getTotalCount(); i++) {
        if (stEntidadesEjecutor.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stEntidadesEjecutor.data.items[i].data.denominacion + '"';
            return stEntidadesEjecutor.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesCliente(value, m) {
    for (var i = 0; i < stEntidadesCliente.getTotalCount(); i++) {
        if (stEntidadesCliente.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stEntidadesCliente.data.items[i].data.denominacion + '"';
            return stEntidadesCliente.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidadesEmpresa(value, m) {
    for (var i = 0; i < stEntidadesEmpresa.getTotalCount(); i++) {
        if (stEntidadesEmpresa.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stEntidadesEmpresa.data.items[i].data.denominacion + '"';
            return stEntidadesEmpresa.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
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
        gridPanel.setTitle(etiqueta + " <i> - " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
function hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    dd = addZero(dd);
    mm = addZero(mm);
    return dd + '/' + mm + '/' + yyyy;
}
function renderEntidadesProd(value, m) {
    for (var i = 0; i < stCbEntidadesProd.getTotalCount(); i++) {
        if (stCbEntidadesProd.data.items[i].data.identidad == value) {
            m.attr = 'ext:qtip="' + stCbEntidadesProd.data.items[i].data.denominacion + '"';
            return stCbEntidadesProd.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderProgramas(value, m) {
    for (var i = 0; i < stPrograma.getTotalCount(); i++) {
        if (stPrograma.data.items[i].data.iddatosnomenclador == value) {
            m.attr = 'ext:qtip="' + stPrograma.data.items[i].data.denominacion + '"';
            return stPrograma.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderDestinos(value, m) {
    for (var i = 0; i < stDestino.getTotalCount(); i++) {
        if (stDestino.data.items[i].data.iddatosnomenclador == value) {
            m.attr = 'ext:qtip="' + stDestino.data.items[i].data.denominacion + '"';
            return stDestino.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function controlarPanelAddDesag() {
    selec = gpAdicionarDesag.getSelectionModel().getSelections();
    if (selec.length > 0) {
        btnAplicarAdicionarDesag.enable();
        btnAceptarAdicionarDesag.enable();
    } else {
        btnAplicarAdicionarDesag.disable();
        btnAceptarAdicionarDesag.disable();
    }
}
function guardarestadoPaneles() {
    estadogpControlEmpresaTaller = gpControlEmpresaTaller.disabled;
    gpControlEmpresaTaller.enable();
}
function revertirestadoPaneles() {
    if (estadogpControlEmpresaTaller)
        gpControlEmpresaTaller.disable();
}
function controlarbtnIndicadoresDemandaExtraPlanAceptar() {
    if (smIndicadoresDemandaExtraPlan.getSelected() != undefined) {
        idindicador = smIndicadoresDemandaExtraPlan.getSelected().data.idindicador;
        Ext.getCmp('btnIndicadoresDemandaExtraPlanAceptar').disable();
        if (cbClientesExtraPlan.getValue() != undefined && cbClientesExtraPlan.getValue() != null && cbClientesExtraPlan.getValue() != ''
                && cbProgramaExtraPlan.getValue() != undefined && cbProgramaExtraPlan.getValue() != null && cbProgramaExtraPlan.getValue() != ''
                && cbDestinoExtraPlan.getValue() != undefined && cbDestinoExtraPlan.getValue() != null && cbDestinoExtraPlan.getValue() != ''
                && idindicador != undefined && idindicador != null && idindicador != ''
                && cantidadExtraPlan.getValue() > 0) {
            Ext.getCmp('btnIndicadoresDemandaExtraPlanAceptar').enable();
        }
    }
}
function upColorControl(storeDin, cmDin, gpDin) {
    for (var i = 0; i < storeDin.getCount(); i++) {
        for (var j = 0; j < cmDin.getColumnCount(); j++) {
            if (storeDin.getAt(i).data.extraplan == 1) {
                Ext.get(gpDin.getView().getCell(i, j)).applyStyles('background-color:#F7FF7B');
            }
        }
    }
}

//metodos para la gestion de las ejecuciones
function guardarEjecucionProductor() {
    mymask.show();
    var records = gpEjecucion.getStore().getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['idcontrolejecucion'] = record.data['idcontrolejecucion'];
        rec['idusuario'] = record.data['idusuario'];
        rec['iddemandatiempo'] = smPlanControl.getSelections()[0].id;
        rec['cantidadproducida'] = record.data['cantidadproducida'];
        rec['fecha'] = record.data['fecha'];
        arreglo.push(rec);
    }
    Ext.Ajax.request({
        url: 'guardarEjecucionProductor',
        params: {
            datos: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarOK);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarNo);
            }
            index = stPlanControl.indexOf(smPlanControl.getSelected());
            stPlanControl.reload({
                callback: function () {
                    smPlanControl.selectRow(index);
                }
            });
            btnEliminar.disable();
            btnGuardar.disable();
        }
    });
}
function adicionarEjecucion() {
    var fechamodificacion = hoyFecha();
    var record = new Ext.data.Record({
        idcontrolejecucion: '',
        cantidadproducida: 0,
        fecha: '',
        idusuario: perfil.usuario,
        fechamodificacion: fechamodificacion
    });
    stEjecucion.add(record);
}
function eliminarEjecucion() {
    recordsDel = gpEjecucion.getSelectionModel().getSelections();
    if (recordsDel.length == 1) {
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminarEjecucion, del);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminarEjecucions, del);
    }
    function del(btnPresionado) {
        array_ejecuciones = [];
        if (btnPresionado == 'ok') {
            for (var i = 0; i < recordsDel.length; i++) {
                array_ejecuciones.push({
                    idcontrolejecucion: recordsDel[i].data.idcontrolejecucion
                });
            }
            if (array_ejecuciones.length > 0) {
                mymask.show();
                Ext.Ajax.request({
                    url: 'eliminarEjecucion',
                    params: {
                        ejecuciones: Ext.encode(array_ejecuciones)
                    },
                    callback: function (options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN == 1) {
                            if (recordsDel.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarEjecucionOK);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarEjecucionsOK);
                            }
                        }
                        index = stPlanControl.indexOf(smPlanControl.getSelected());
                        stPlanControl.reload({
                            callback: function (options, success, response) {
                                smPlanControl.selectRow(index);
                            }
                        });
                    }
                });
            }
        }
    }
}

//gestion de los ajustes
function guardarAjuste() {
    var records = stControlEmpresaTaller.getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['iddemandatiempo'] = record.data['iddemandatiempo'];
        rec['precio'] = record.data['precio'];
        rec['preciodivisa'] = record.data['preciodivisa'];
        rec['plan'] = record.data['plan'];
        arreglo.push(rec);
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'guardarAjusteControlEmpresaTaller',
        timeout: 3600000,
        waitMsg: perfil.etiquetas.msgGuardandoControl,
        params: {
            datos: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                mostrarMensaje(2, perfil.etiquetas.lbGuardarAjusteOK);
                stControlEmpresa.reload();
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbGuardarAjusteNo);
            }
        }
    });
    btnGuardarAjuste.disable();
}

//gestion del estimado
function guardarEstimado() {
    var records = stControlEmpresa.getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['iddemanda'] = record.data['iddemanda'];
        arreglo.push(rec);
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'guardarEstimadoControlEmpresa',
        timeout: 3600000,
        waitMsg: perfil.etiquetas.msgGuardandoControl,
        params: {
            datos: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                mostrarMensaje(2, perfil.etiquetas.lbGuardarEstimadoOK);
                stControlEmpresa.reload();
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbGuardarEstimadoNo);
            }
        }
    });
    btnGuardarEstimado.disable();
}

//gestion de las demandas extraplanes
function adicionarDemandaExtraPlan() {
    cbClientesExtraPlan = new Ext.form.ComboBox({
        id: 'cbClientesExtraPlan',
        store: stEntidadesCliente,
        valueField: 'idestructura',
        hiddenName: 'idestructura',
        displayField: 'denominacion',
        fieldLabel: perfil.etiquetas.lbCliente,
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        disabled: false,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }
        }
    });
    cbProgramaExtraPlan = new Ext.form.ComboBox({
        id: 'cbProgramaExtraPlan',
        store: stPrograma,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        fieldLabel: perfil.etiquetas.lbPrograma,
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        disabled: false,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }
        }
    });
    cbDestinoExtraPlan = new Ext.form.ComboBox({
        id: 'cbDestinoExtraPlan',
        store: stDestino,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        fieldLabel: perfil.etiquetas.lbDestino,
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        disabled: false,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }
        }
    });
    cantidadExtraPlan = new Ext.form.NumberField({
        fieldLabel: perfil.etiquetas.lbCantidad,
        id: 'cantidadExtraPlan',
        labelSeparator: '',
        minValue: 0,
        decimalPrecision: 3,
        allowNegative: false,
        regexText: perfil.etiquetas.soloNumEnteros,
        maskReText: perfil.etiquetas.msgErrorFormulario,
        anchor: '75%',
        allowBlank: false,
        listeners: {
            change: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }
        }
    });
    btnLimpiarIndicadoresDemandaExtraPlan = new Ext.Button({
        id: 'btnLimpiarIndicadoresDemandaExtraPlan',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosIndicadoresDemandaExtraPlan.clearFilters();
        }
    });
    stIndicadoresDemandaExtraPlan = new Ext.data.Store({
        id: 'stIndicadoresDemandaExtraPlan',
        url: 'listarIndicadoresDemandaExtraPlan',
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
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'identidadorganosatisface'
            }
        ]), listeners: {
            beforeload: function () {
                mymask.show();
                stIndicadoresDemandaExtraPlan.baseParams.start = offsetIndicadoresDemandaExtraPlan;
                stIndicadoresDemandaExtraPlan.baseParams.identidad = nodoEntidadControl.id;
            },
            load: function () {
                cambiarTituloFiltrar(gpIndicadoresDemandaExtraPlan, filtrosIndicadoresDemandaExtraPlan, 'Indicadores');
                gpIndicadoresDemandaExtraPlan.enable();
                if (stIndicadoresDemandaExtraPlan.getCount() == 0) {
                    if (filtrosIndicadoresDemandaExtraPlan.getFiltrosActivos() == undefined || filtrosIndicadoresDemandaExtraPlan.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                gpIndicadoresDemandaExtraPlan.getSelectionModel().clearSelections();
                mymask.hide();
            }
        }
    });
    filtrosIndicadoresDemandaExtraPlan = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
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
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }]
    });
    cmIndicadoresDemandaExtraPlan = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUM,
            width: 60,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPrecioDiv,
            tooltip: perfil.etiquetas.lbPrecioDivisa,
            width: 100,
            dataIndex: 'preciodivisa',
            renderer: crearToolTip,
            align: 'right'
        }]);
    smIndicadoresDemandaExtraPlan = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }, rowdeselect: function () {
                controlarbtnIndicadoresDemandaExtraPlanAceptar();
            }
        }
    });
    gpIndicadoresDemandaExtraPlan = new Ext.grid.GridPanel({
        store: stIndicadoresDemandaExtraPlan,
        autoScroll: true,
        region: 'center',
        title: 'Indicadores',
        id: 'gpIndicadoresDemandaExtraPlan',
        sm: smIndicadoresDemandaExtraPlan,
        cm: cmIndicadoresDemandaExtraPlan,
        plugins: filtrosIndicadoresDemandaExtraPlan,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stIndicadoresDemandaExtraPlan,
            displayInfo: true,
            items: ['-', btnLimpiarIndicadoresDemandaExtraPlan],
            listeners: {
                beforechange: function (p, e) {
                    offsetIndicadoresDemandaExtraPlan = e.start;
                }
            }
        })
    });
    panelIndicadoresDemandaExtraPlan = new Ext.FormPanel({
        id: 'panelIndicadoresDemandaExtraPlan',
        frame: true,
        width: 400,
        region: 'east',
        items: [{
                xtype: 'fieldset',
                title: perfil.etiquetas.lbDatosDemandaExtraplan,
                collapsible: true,
                autoHeight: true,
                items: [{
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbClientesExtraPlan]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbProgramaExtraPlan]
                            }
                        ]
                    }
                    , {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbDestinoExtraPlan]
                            }
                        ]
                    }
                    , {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cantidadExtraPlan]
                            }
                        ]
                    }
                ]
            }]
    });
    winIndicadoresDemandaExtraPlan = new Ext.Window({
        id: 'winIndicadoresDemandaExtraPlan',
        modal: true,
        closeAction: 'destroy',
        width: 1000,
        height: 500,
        layout: 'border',
        resizable: false,
        items: [gpIndicadoresDemandaExtraPlan, panelIndicadoresDemandaExtraPlan],
        constrain: true,
        title: perfil.etiquetas.lbAdicionarExtraPlan,
        listeners: {
            beforeshow: function () {
                guardarestadoPaneles();
            },
            beforeclose: function () {
                revertirestadoPaneles();
            },
            beforedestroy: function () {
                revertirestadoPaneles();
            },
            beforehide: function () {
                revertirestadoPaneles();
            }
        },
        buttons: [{
                id: 'btnIndicadoresDemandaExtraPlanCancelar',
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbCancelar,
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                handler: function () {
                    winIndicadoresDemandaExtraPlan.destroy();
                }
            }, {
                id: 'btnIndicadoresDemandaExtraPlanAceptar',
                iconCls: 'ok',
                tooltip: 'Adicionar',
                text: 'Adicionar',
                disabled: true,
                handler: function () {
                    mymask.show();
                    Ext.Ajax.request({
                        url: 'guardarDemandaExtraPlan',
                        params: {
                            idejercicio: cbEjercicioControl.getValue(),
                            identidadorganosatisface: smIndicadoresDemandaExtraPlan.getSelected().data.identidadorganosatisface,
                            idindicador: smIndicadoresDemandaExtraPlan.getSelected().data.idindicador,
                            cantfinal: cantidadExtraPlan.getValue(),
                            idprograma: cbProgramaExtraPlan.getValue(),
                            iddestino: cbDestinoExtraPlan.getValue(),
                            idcliente: cbClientesExtraPlan.getValue()
                        },
                        callback: function (options, success, response) {
                            mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            winIndicadoresDemandaExtraPlan.destroy();
                            if (responseData.codMsgN == 1) {
                                mostrarMensaje(1, perfil.etiquetas.lbAdicionarExtraPlanOK);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.lbAdicionarExtraPlanNO);
                            }
                            stControlEmpresa.reload();
                            gpControlEmpresa.getSelectionModel().clearSelections();
                        }
                    });
                }
            }]
    });
    stIndicadoresDemandaExtraPlan.reload();
    winIndicadoresDemandaExtraPlan.show();
}
function eliminarDemandaExtraPlan(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarDemandaExtraPlan',
            timeout: 3600000,
            waitMsg: perfil.etiquetas.msgEliminandoDemandaControl,
            params: {
                iddemanda: smControlEmpresa.getSelected().data.iddemanda
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDemandaOK);
                    stControlEmpresa.reload();
                    gpControlEmpresa.getSelectionModel().clearSelections();
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDemandaNO);
                }
            }
        });
        btnEliminarExtraplan.disable();
    }
}

//gestion del desglose de las demandas extraplanes
function adicionarDesgloseDemandaExtraPlan() {
    stAdicionarDesgloseDemandaExtraplan = new Ext.data.Store({
        url: 'listarEntidadesEjecutoras',
        listeners: {
            beforeload: function () {
                stAdicionarDesgloseDemandaExtraplan.baseParams.start = offsetAdicionarDesgloseDemandaExtraplan;
                stAdicionarDesgloseDemandaExtraplan.baseParams.identidad = nodoEntidadControl.id;
                stAdicionarDesgloseDemandaExtraplan.baseParams.iddemanda = smControlEmpresa.getSelected().data.iddemanda;
            },
            load: function () {
                cambiarTituloFiltrar(gpAdicionarDesag, filtrosAddDesag, perfil.etiquetas.lbTitlegpAddDesag);
                if (stAdicionarDesgloseDemandaExtraplan.getCount() == 0) {
                    if (filtrosAddDesag.getFiltrosActivos() == undefined || filtrosAddDesag.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                smAdicionarDesag.clearSelections();
                controlarPanelAddDesag();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'identidad'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }
        ])
    });

    btnLimpiarAdicionarDesag = new Ext.Button({
        id: 'btnLimpiarAdicionarDesag',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosAddDesag.clearFilters();
        }
    });
    btnCancelarAdicionarDesag = new Ext.Button({
        id: 'btnCancelarAdicionarDesag',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        text: perfil.etiquetas.lbCancelar,
        handler: function () {
            winAdicionarDesag.hide();
        }
    });
    btnAplicarAdicionarDesag = new Ext.Button({
        disabled: true,
        id: 'btnAplicarAdicionarDesag',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        text: perfil.etiquetas.lbAplicar,
        handler: function () {
            adicionarDesag(true);
        }
    });
    btnAceptarAdicionarDesag = new Ext.Button({
        disabled: true,
        id: 'btnAceptarAdicionarDesag',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        text: perfil.etiquetas.lbAdicionar,
        handler: function () {
            adicionarDesag(false);
        }
    });
    filtrosAddDesag = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    cmAdicionarDesag = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    smAdicionarDesag = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, index, record) {
                controlarPanelAddDesag();
            },
            rowdeselect: function (sm, index, record) {
                controlarPanelAddDesag();
            }
        }
    });
    gpAdicionarDesag = new Ext.grid.GridPanel({
        store: stAdicionarDesgloseDemandaExtraplan,
        title: perfil.etiquetas.lbTitlegpAddDesag,
        disabled: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        id: 'gpAdicionarDesag',
        sm: smAdicionarDesag,
        cm: cmAdicionarDesag,
        plugins: filtrosAddDesag,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            store: stAdicionarDesgloseDemandaExtraplan,
            pageSize: 20,
            displayInfo: true,
            items: ['-', btnLimpiarAdicionarDesag],
            listeners: {
                beforechange: function (p, e) {
                    offsetAdicionarDesgloseDemandaExtraplan = e.start;
                }
            }
        })

    });
    pAdicionarDesag = new Ext.Panel({
        id: 'pAdicionarDesag',
        layout: 'fit',
        region: 'center',
        items: [gpAdicionarDesag]
    });
    winAdicionarDesag = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        items: [pAdicionarDesag],
        resizable: true,
        height: 300,
        width: 470,
        title: perfil.etiquetas.lbTitleWinAddDesag,
        listeners: {
            show: function () {
                stAdicionarDesgloseDemandaExtraplan.reload();
            }
        },
        buttons: [btnCancelarAdicionarDesag, btnAplicarAdicionarDesag, btnAceptarAdicionarDesag]
    });
    winAdicionarDesag.show();
}
function guardarDesglosePlanExtraplan() {
    var records = stPlanControlEmpresaTaller.getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['iddemandatiempo'] = record.data['iddemandatiempo'];
        arreglo.push(rec);
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'guardarDatosDesgExtraplan',
        timeout: 3600000,
        waitMsg: perfil.etiquetas.msgGuardandoControl,
        params: {
            datos: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                mostrarMensaje(2, perfil.etiquetas.msgSegGuardarDesagsOK);
                stPlanControlEmpresaTaller.reload();
                stControlEmpresaTaller.reload();
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgSegGuardarDesagsNo);
            }
        }
    });
    btnGuardarDesglosePlanExtraplan.disable();
}
function adicionarDesag(apl) {
    recordsAdd = gpAdicionarDesag.getSelectionModel().getSelections();
    entidadesAdd = [];
    if (recordsAdd.length > 0) {
        for (var i = 0; i < recordsAdd.length; i++) {
            entidadesAdd.push({
                identidad: recordsAdd[i].json.idestructura
            });
        }
        Ext.Ajax.request({
            url: 'adicionarDesag',
            params: {
                identidad: Ext.encode(entidadesAdd),
                iddemanda: smControlEmpresa.getSelected().data.iddemanda
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    if (recordsAdd.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagOK);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsOK);
                    }
                } else if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNOAlgunas);
                } else {
                    if (recordsAdd.length == 2) {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagNO);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgSegAdicionarDesagsNO);
                    }
                }
                if (!apl) {
                    gpAdicionarDesag.getSelectionModel().clearSelections();
                    gpPlanControlEmpresaTaller.getSelectionModel().clearSelections();
                    winAdicionarDesag.hide();
                }
                stPlanControlEmpresaTaller.reload();
                stControlEmpresaTaller.reload();
            }
        });
    }
}
function eliminarDesgloseDemandaExtraPlan(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarDesgloseDemandaExtraPlan',
            timeout: 3600000,
            waitMsg: perfil.etiquetas.msgSegEliminarDesgloseDemanda,
            params: {
                iddemandatiempo: smPlanControlEmpresaTaller.getSelected().data.iddemandatiempo
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDesgloseDemandaOK);
                    stPlanControlEmpresaTaller.reload();
                    gpPlanControlEmpresaTaller.getSelectionModel().clearSelections();
                    stControlEmpresaTaller.reload();
                    gpControlEmpresaTaller.getSelectionModel().clearSelections();

                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDesgloseDemandaNO);
                }
            }
        });
        btnEliminarDesglosePlanExtraplan.disable();
    }
}