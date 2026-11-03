/*Script para importar datos de datonomenclador*/
var winImp;
var offsetdin = 0;
//Formulario para la carga del Excel
importarNomenclador = function (etiqueta) {
    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscarNomenclador',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                fieldLabel: etiqueta.lbCargarDoc,
                name: 'file',
                id: 'form-file-Nomenclador',
                prevTab: 'idBtnAceptarImp',
                emptyText: etiqueta.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ':',
                    id: 'idbuttonNomenclador',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });
    winImportarNomenclador(fpbuscar);
//Pintar el campo de carga de archivo Excel
    Ext.getCmp('idFpBuscarNomenclador').getForm().reset();
    winImp.show();
    winImp.add(fpbuscar);
    winImp.doLayout(false);
//Funcion auxuliar para crear la ventana de carga de archivo Excel
    function winImportarNomenclador() {
        if (!winImp) {
            winImp = new Ext.Window({
                id: 'winImpNomenclador',
                modal: true,
                closeAction: 'hide',
                constrain: true,
                layout: 'fit',
                title: etiqueta.lbImportarExcel,
                width: 400,
                height: 150,
                buttons: [{
                        iconCls: 'cancelar',
                        text: etiqueta.lbCancelar,
                        tooltip: etiqueta.lbCancelar,
                        handler: function () {
                            winImp.hide();
                        }
                    }, {
                        iconCls: 'aceptar',
                        text: etiqueta.lbAceptar,
                        tooltip: etiqueta.lbAceptar,
                        handler: function () {
                            importar();
                        }
                    }]
            });
        }
    }
    function importar() {
        try {
            if (fpbuscar.getForm().isValid()) {
                barra = Ext.MessageBox.show({
                    msg: etiqueta.lbEspere,
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false
                });
                btnCerrarWin = new Ext.Button({
                    text: etiqueta.lbCerrar,
                    disabled: true,
                    id: 'btnNomenclador',
                    tooltip: etiqueta.lbCerrar,
                    iconCls: 'aceptar'
                });
                //Enviar el archivo al servidor
                Ext.getCmp('idFpBuscarNomenclador').getForm().submit(
                        {
                            url: 'importarFicheroNomenclador',
                            timeout: 1800000, //milisegundos = 30 min
                            method: 'POST',
                            failure: function (form, action) {
                                barra.hide();
                                winImp.hide();
                                coldin = action.result.columnasdinamicas;
                                //creando el objeto fila de las columnas dinamicas
                                FilaOS = Ext.data.Record.create([
                                    {
                                        name: 'denominacionOS',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicionOS',
                                        type: 'numeric'
                                    }]);
                                //creando el objeto fila de las columnas excel
                                FilaExcel = Ext.data.Record.create([
                                    {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicioncolumnaExcel',
                                        type: 'numeric'
                                    }]);
                                Fila = Ext.data.Record.create([
                                    {
                                        name: 'denominacionOS',
                                        type: 'string'
                                    },
                                    {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    },
                                    {
                                        name: 'posicionOS',
                                        type: 'numeric'
                                    },
                                    {
                                        name: 'posicioncolumnaExcel',
                                        type: 'numeric'
                                    },
                                    {
                                        name: 'relacion',
                                        type: 'string'
                                    }]);
                                //Botones de asociación
                                btnAsociarOrden = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAsociarOrdenNomenclador',
                                    tooltip: etiqueta.lbRelColOrden,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:50px',
                                    icon: perfil.dirImg + 'incluir.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        addRelacionTodas();
                                    }
                                });
                                btnSiguiente = new Ext.Button({
                                    disabled: true,
                                    id: 'btnsiguienteNomenclador',
                                    tooltip: etiqueta.lbRelCol,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                    icon: perfil.dirImg + 'siguiente.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        addRelacion();
                                    }
                                });
                                btnAnterior = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAnteriorNomenclador',
                                    tooltip: etiqueta.lbelimRel,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:10px',
                                    icon: perfil.dirImg + 'anterior.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        eliminarnom();
                                    }
                                });

                                btnDesociarTodas = new Ext.Button({
                                    disabled: true,
                                    id: 'btnDesociarTodasNomenclador',
                                    tooltip: etiqueta.lbelimRels,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                    icon: perfil.dirImg + 'deshacer.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        eliminarnomTodas();
                                    }
                                });
                                //grid panel para columnas
                                stNomen = new Ext.data.SimpleStore({
                                    fields: ['denominacionOS', 'posicionOS'],
                                    data: action.result.columnas,
                                    sorters: [{
                                            property: 'posicionOS',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicionOS',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });
                                cmNomencladores = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: etiqueta.lbDenominacion,
                                        tooltip: etiqueta.lbDenominacion,
                                        dataIndex: 'denominacionOS',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);
                                smNomencladores = new Ext.grid.RowSelectionModel({
                                    singleSelect: true
                                });
                                smNomencladores.on('selectionchange', function (sm) {
                                    if (sm.getSelections().length == 1 && smNomencladoresExcel.getSelections().length == 1 && stNomen.getCount() <= stNomenExcel.getCount()) {
                                        btnSiguiente.enable();
                                    } else {
                                        btnSiguiente.disable();
                                    }
                                });
                                gpNomencladores = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: etiqueta.lbEspere
                                    },
                                    store: stNomen,
                                    sm: smNomencladores,
                                    cm: cmNomencladores,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%'
                                });
                                pgpNomencladores = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: etiqueta.lbColSistema,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '95%',
                                    layout: 'fit',
                                    items: [gpNomencladores]

                                });
                                //grid panel para columnas del excel
                                stNomenExcel = new Ext.data.SimpleStore({
                                    fields: ['denomcolumnaExcel', 'posicioncolumnaExcel'],
                                    data: action.result.columnasExcel,
                                    sorters: [{
                                            property: 'posicioncolumnaExcel',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicioncolumnaExcel',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });
                                cmNomencladoresExcel = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: etiqueta.lbDenominacion,
                                        tooltip: etiqueta.lbDenominacion,
                                        dataIndex: 'denomcolumnaExcel',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);
                                smNomencladoresExcel = new Ext.grid.RowSelectionModel({
                                    singleSelect: true
                                });
                                smNomencladoresExcel.on('selectionchange', function (sm) {
                                    if (sm.getSelections().length == 1 && smNomencladores.getSelections().length == 1 && stNomen.getCount() <= stNomenExcel.getCount()) {
                                        btnSiguiente.enable();
                                    } else {
                                        btnSiguiente.disable();
                                    }
                                });
                                gpNomencladoresExcel = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: etiqueta.lbEspere
                                    },
                                    store: stNomenExcel,
                                    sm: smNomencladoresExcel,
                                    cm: cmNomencladoresExcel,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%'
                                });
                                pgpNomencladoresExcel = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: etiqueta.lbColExcel,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '100%',
                                    layout: 'fit',
                                    items: [gpNomencladoresExcel]
                                });
                                //grid panel para relacionar columnas
                                stNomenRelacion = new Ext.data.Store({
                                    enableKeyEvents: true,
                                    reader: new Ext.data.JsonReader({
                                        root: 'data'
                                    }, [{
                                            name: 'denominacionOS'
                                        }, {
                                            name: 'denomcolumnaExcel'
                                        }, {
                                            name: 'posicionOS'
                                        }, {
                                            name: 'posicioncolumnaExcel'
                                        }, {
                                            name: 'relacion'
                                        }]),
                                    sorters: [{
                                            property: 'posicionOS',
                                            direction: 'ASC'
                                        }],
                                    sortRoot: 'posicionOS',
                                    sortOnLoad: true,
                                    remoteSort: false
                                });
                                cmNomencladoresRelacion = new Ext.grid.ColumnModel([{
                                        id: 'expandir',
                                        header: etiqueta.lbDenominacion,
                                        tooltip: etiqueta.lbDenominacion,
                                        dataIndex: 'relacion',
                                        sortable: true,
                                        renderer: crearToolTip
                                    }]);
                                smNomencladoresRelacion = new Ext.grid.RowSelectionModel({
                                    singleSelect: false
                                });
                                smNomencladoresRelacion.on('selectionchange', function (sm) {
                                    if (sm.getSelections().length != 0) {
                                        btnAnterior.enable();
                                    } else {
                                        btnAnterior.disable();
                                    }
                                });
                                gpNomencladoresRelacion = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: etiqueta.lbEspere
                                    },
                                    store: stNomenRelacion,
                                    sm: smNomencladoresRelacion,
                                    cm: cmNomencladoresRelacion,
                                    region: 'east',
                                    autoExpandColumn: 'expandir',
                                    margins: '2 2 2 2',
                                    anchor: '100%', listeners: {
                                        rowdblclick: function () {
                                            eliminarnom();
                                        }
                                    }
                                });
                                pgpNomencladoresRelacion = new Ext.Panel({
                                    labelAlign: 'top',
                                    title: etiqueta.lbColRel,
                                    height: 285,
                                    frame: true,
                                    border: true,
                                    anchor: '100%',
                                    layout: 'fit',
                                    items: [gpNomencladoresRelacion]

                                });
                                pRelacionarColumnas = new Ext.Panel({
                                    labelAlign: 'top',
                                    height: 300,
                                    width: 800,
                                    frame: true,
                                    layout: 'form',
                                    items: [{
                                            layout: 'column',
                                            items: [{
                                                    columnWidth: .40,
                                                    layout: 'form',
                                                    items: [pgpNomencladores]
                                                },
                                                {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresExcel]
                                                },
                                                {
                                                    columnWidth: .06,
                                                    layout: 'form',
                                                    items: [btnAsociarOrden, btnSiguiente, btnAnterior, btnDesociarTodas]
                                                },
                                                {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresRelacion]
                                                }]
                                        }]

                                });
                                winRelacionarColumnas = new Ext.Window({
                                    modal: true,
                                    id: 'winRelacionarColumnasNomenclador',
                                    closeAction: 'destroy',
                                    layout: 'fit',
                                    constrain: true,
                                    items: [pRelacionarColumnas],
                                    title: etiqueta.lbRelCol,
                                    buttons: [{
                                            icon: perfil.dirImg + 'cancelar.png',
                                            iconCls: 'cancelar',
                                            text: etiqueta.lbCancelar,
                                            tooltip: etiqueta.lbCancelar,
                                            handler: function () {
                                                winRelacionarColumnas.close();
                                            }
                                        }, {
                                            icon: perfil.dirImg + 'validar.png',
                                            iconCls: 'validar',
                                            id: 'btnValidarNomenclador',
                                            disabled: true,
                                            text: etiqueta.lbValidar,
                                            tooltip: etiqueta.lbValidarD,
                                            handler: function () {
                                                mymask.show();
                                                var rel = stNomenRelacion.getRange();
                                                var relaciones = [];
                                                for (var index = 0; index < stNomenRelacion.getCount(); index++) {
                                                    relaciones.push({
                                                        denominacionOS: rel[index].data.denominacionOS,
                                                        denomcolumnaExcel: rel[index].data.denomcolumnaExcel,
                                                        posicionOS: rel[index].data.posicionOS,
                                                        posicioncolumnaExcel: rel[index].data.posicioncolumnaExcel
                                                    });
                                                }
                                                Ext.Ajax.request({
                                                    url: 'importarDatosRelacionadosNomenclador',
                                                    params: {
                                                        relaciones: Ext.encode(relaciones),
                                                        node: idNomencladorArbol
                                                    },
                                                    callback: function (options, success, response) {
                                                        winRelacionarColumnas.close();
                                                        response = Ext.decode(response.responseText);
                                                        if (response.result != 1) {
                                                            mostrarMensaje(1, etiqueta.lbDatosNoValidos);
                                                            winRelacionarColumnas.close();
                                                        } else {
                                                            columnasdinamicas = response.columnasdinamicas;
                                                            tabla = response.tabla;
                                                            campos = response.result;
                                                            mostrarResultadoValidacion();
                                                        }
                                                    }
                                                });
                                            }
                                        }]
                                });
                                winRelacionarColumnas.show();
                                if (stNomen.getCount() <= stNomenExcel.getCount())
                                    btnAsociarOrden.enable();
                                if (stNomenRelacion.getCount() != 0)
                                    btnDesociarTodas.enable();
                            }
                        }
                );
            } else {
                mostrarMensaje(1, etiqueta.lbCamposIncorrectos);
            }

        } catch (e) {
            console.log(e);
        }
    }
    function  addRelacion() {
        var recordSel = smNomencladores.getSelections();
        var recordSelExc = smNomencladoresExcel.getSelections();
        stNomen.remove(recordSel[0]);
        stNomenExcel.remove(recordSelExc[0]);
        var p = new Fila({
            denominacionOS: recordSel[0].data.denominacionOS,
            posicionOS: recordSel[0].data.posicionOS,
            denomcolumnaExcel: recordSelExc[0].data.denomcolumnaExcel,
            posicioncolumnaExcel: recordSelExc[0].data.posicioncolumnaExcel,
            relacion: recordSel[0].data.denominacionOS + " / " + recordSelExc[0].data.denomcolumnaExcel
        });
        stNomenRelacion.add(p);
        stNomenRelacion.sort('posicionOS', 'ASC');
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
        if (stNomen.getCount() == 0)
            Ext.getCmp('btnValidarNomenclador').enable();
        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();
        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function  addRelacionTodas() {
        var records = stNomen.getRange();
        var recordsExcel = stNomenExcel.getRange();
        var contador = stNomen.getCount();
        for (var index = 0; index < contador; index++) {
            var p = new Fila({
                denominacionOS: records[index].data.denominacionOS,
                posicionOS: records[index].data.posicionOS,
                denomcolumnaExcel: recordsExcel[index].data.denomcolumnaExcel,
                posicioncolumnaExcel: recordsExcel[index].data.posicioncolumnaExcel,
                relacion: records[index].data.denominacionOS + " / " + recordsExcel[index].data.denomcolumnaExcel
            });
            stNomenRelacion.add(p);
            stNomen.remove(records[index]);
            stNomenExcel.remove(recordsExcel[index]);
        }
        stNomenRelacion.sort('posicionOS', 'ASC');
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
        if (stNomen.getCount() == 0)
            Ext.getCmp('btnValidarNomenclador').enable();
        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();
        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }
    function eliminarnom() {
        var recordsSel = smNomencladoresRelacion.getSelections();
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                var recordSel = recordsSel[i];
                var pTipMod = new FilaOS({
                    denominacionOS: recordSel.data.denominacionOS,
                    posicionOS: recordSel.data.posicionOS
                });
                stNomen.add(pTipMod);
                var pExcel = new FilaExcel({
                    denomcolumnaExcel: recordSel.data.denomcolumnaExcel,
                    posicioncolumnaExcel: recordSel.data.posicioncolumnaExcel
                });
                stNomenExcel.add(pExcel);
                stNomenRelacion.remove(recordSel);
            }
            if (stNomen.getCount() != 0)
                Ext.getCmp('btnValidarNomenclador').disable();
        }
        stNomenRelacion.sort('posicionOS', 'ASC');
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();
        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function eliminarnomTodas() {
        var records = stNomenRelacion.getRange();
        var contador = stNomenRelacion.getCount();
        for (var i = 0; i < contador; i++) {
            var pTipMod = new FilaOS({
                denominacionOS: records[i].data.denominacionOS,
                posicionOS: records[i].data.posicionOS
            });
            stNomen.add(pTipMod);
            var pExcel = new FilaExcel({
                denomcolumnaExcel: records[i].data.denomcolumnaExcel,
                posicioncolumnaExcel: records[i].data.posicioncolumnaExcel
            });
            stNomenExcel.add(pExcel);
            stNomenRelacion.remove(records[i]);
        }
        stNomenRelacion.sort('posicionOS', 'ASC');
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
        if (stNomen.getCount() != 0)
            Ext.getCmp('btnValidarNomenclador').disable();
        if (stNomen.getCount() <= stNomenExcel.getCount())
            btnAsociarOrden.enable();
        else
            btnAsociarOrden.disable();
        if (stNomenRelacion.getCount() != 0)
            btnDesociarTodas.enable();
        else
            btnDesociarTodas.disable();
    }

    function  mostrarResultadoValidacion() {
        offsetdin = 0;
        //grid panel para mostrar la validacion de los datos
        cmImportarValidado = new Ext.grid.ColumnModel([
            {
                id: 'expandir',
                header: etiqueta.lbDenominacion,
                tooltip: etiqueta.lbDenominacion,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: etiqueta.lbDescripcion,
                tooltip: etiqueta.lbDescripcion,
                width: 120,
                dataIndex: 'descripcion',
                renderer: crearToolTip
            }, {
                header: etiqueta.lbEstado,
                tooltip: etiqueta.lbEstado,
                width: 180,
                dataIndex: 'denominaciondato',
                renderer: crearToolTip
            }]);
        filtrosImportarValidado = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }]
        });
        stImportarValidado = new Ext.data.GroupingStore({
            url: 'listarDatosValidadosNomenclador',
            sortInfo: {
                field: 'denominaciondato',
                direction: "ASC"
            },
            groupField: 'denominaciondato',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = offsetdin;
                    cambiarTituloFiltrar(gpImportarValidado, filtrosImportarValidado, etiqueta.lbDatVal);
                },
                load: function (t, n, e) {
                    winDatosVal.show();
                    mymask.hide();
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idtabla',
                totalProperty: 'total',
                root: 'data'
            }, [{
                    name: 'idtabla'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'cantidad'
                }, {
                    name: 'denominaciondato'
                }])
        });
        btnLimpiarFiltrosImportarValidado = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltrosDinNomenclador',
            iconCls: 'limpiar',
            tooltip: etiqueta.lbLimpiarImp,
            handler: function () {
                filtrosImportarValidado.clearFilters();
            }
        });
        smImportarValidado = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        gpImportarValidado = new Ext.grid.GridPanel({
            id: 'gpImportarValidadoNomenclador',
            loadMask: {
                msg: etiqueta.lbEspere
            },
            store: stImportarValidado,
            sm: smImportarValidado,
            cm: cmImportarValidado,
            title: etiqueta.lbDatVal,
            region: 'east',
            autoExpandColumn: 'expandir',
            margins: '2 2 2 2',
            anchor: '100%',
            plugins: filtrosImportarValidado,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Nomencladores" : "Nomenclador"]})'
            }),
            bbar: new Ext.PagingToolbar({
                store: stImportarValidado,
                displayInfo: true,
                items: [btnLimpiarFiltrosImportarValidado],
                listeners: {
                    beforechange: function (p, e) {
                        offsetdin = e.start;
                    }
                }
            })
        });
        pgpDatosVal = new Ext.Panel({
            labelAlign: 'top',
            frame: true,
            border: true,
            anchor: '100%',
            layout: 'fit',
            items: [gpImportarValidado]
        });
        winDatosVal = new Ext.Window({
            modal: true,
            id: 'winDatosValNomenclador',
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            height: 500,
            width: 1000,
            title: etiqueta.lbTitlewinDatosVal,
            items: [pgpDatosVal],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: etiqueta.lbCancelar,
                    tooltip: etiqueta.lbCancelar,
                    handler: function () {
                        winDatosVal.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnAdicionarNomenclador',
                    text: etiqueta.lbAceptar,
                    tooltip: etiqueta.lbAceptar,
                    handler: function () {
                        mymask.show();
                        insertarDatos();
                    }
                }]
        });
        stImportarValidado.reload();
    }
    function insertarDatos() {
        Ext.Ajax.request({
            url: 'insertarDatosImportarNomenclador',
            params: {
                node: idNomencladorArbol
            },
            callback: function (options, success, response) {
                winDatosVal.close();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgImportadoOK);
                } else {
                    mostrarMensaje(1, etiqueta.msgImportadoParcial);
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
        });
    }
};



