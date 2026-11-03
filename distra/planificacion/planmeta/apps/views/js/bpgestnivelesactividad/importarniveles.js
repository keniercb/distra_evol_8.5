initimportarniveles = function () {
    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscar',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                fieldLabel: perfil.etiquetas.lbCargarDoc,
                name: 'file',
                id: 'form-file',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ' ',
                    id: 'idbutton',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });

    //*IMPORTAR Actividades*//

    winImportar = function (fpbuscar) {
        if (!winImp) {
            winImp = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                constrain: true,
                layout: 'fit',
                title: perfil.etiquetas.lbImportar,
                width: 400,
                height: 150,
                buttons: [{
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbCancelar,
                        //tooltip: perfil.etiquetas.lbTtbtnCancelar,
                        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                        handler: function () {
                            winImp.hide();
                        }
                    }, {
                        iconCls: 'aceptar',
                        text: perfil.etiquetas.lbAceptar,
                        //tooltip: perfil.etiquetas.lbTtbtnAceptar,
                        tooltip: perfil.etiquetas.lbTtbtnAceptar,
                        handler: function () {
                            estado_deshabilitado = pgridDesg.disabled;
                            pgridDesg.enable();
                            importar();
                        }
                    }]
            });
        }
        Ext.getCmp('idFpBuscar').getForm().reset();
        winImp.show();
        winImp.add(fpbuscar);
        winImp.doLayout();
    }

    function importar() {
        try {
            if (fpbuscar.getForm().isValid())
            {
                barra = Ext.MessageBox.show({
                    msg: perfil.etiquetas.lbEspere,
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false
                });
                btnCerrarWin = new Ext.Button({
                    text: perfil.etiquetas.lbCerrar,
                    disabled: true,
                    id: 'btn',
                    tooltip: perfil.etiquetas.lbCerrar,
                    iconCls: 'aceptar'
                });
                Ext.getCmp('idFpBuscar').getForm().submit(
                        {
                            url: 'importarFichero',
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

                                btnAsociarOrden = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAsociarOrden',
                                    tooltip: perfil.etiquetas.lbRelColOrden,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:50px',
                                    icon: perfil.dirImg + 'incluir.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        addRelacionTodas();
                                    }
                                });

                                btnSiguiente = new Ext.Button({
                                    disabled: true,
                                    id: 'btnsiguiente',
                                    tooltip: perfil.etiquetas.lbRelCol,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                    icon: perfil.dirImg + 'siguiente.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        addRelacion();
                                    }
                                });

                                btnAnterior = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAnterior',
                                    tooltip: perfil.etiquetas.lbelimRel,
                                    style: 'margin-left:10px;margin-rigth:10px;margin-top:10px',
                                    icon: perfil.dirImg + 'anterior.png',
                                    iconCls: 'btn',
                                    handler: function () {
                                        eliminarnom();
                                    }
                                });

                                btnDesociarTodas = new Ext.Button({
                                    disabled: true,
                                    id: 'btnDesociarTodas',
                                    tooltip: perfil.etiquetas.lbelimRels,
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
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
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
                                        if (smNomencladoresExcel.getSelections().length == 1 && stNomen.getCount() > stNomenExcel.getCount())
                                            mostrarMensaje(1, perfil.etiquetas.msgDistintaCantidadColumnas);
                                    }
                                });
                                gpNomencladores = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbCargando
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
                                    title: perfil.etiquetas.lbCol,
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
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
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
                                        if (smNomencladores.getSelections().length == 1 && stNomen.getCount() > stNomenExcel.getCount())
                                            mostrarMensaje(1, perfil.etiquetas.msgDistintaCantidadColumnas);
                                    }
                                });
                                gpNomencladoresExcel = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbCargando
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
                                    title: perfil.etiquetas.lbColExcel,
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
                                        header: perfil.etiquetas.lbDenominacion,
                                        tooltip: perfil.etiquetas.lbDenominacion,
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
                                        msg: perfil.etiquetas.lbCargando
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
                                    title: perfil.etiquetas.lbColRel,
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
                                    id: 'winRelacionarColumnas',
                                    closeAction: 'destroy',
                                    layout: 'fit',
                                    constrain: true,
                                    items: [pRelacionarColumnas],
                                    title: perfil.etiquetas.lbRelCol,
                                    buttons: [{
                                            icon: perfil.dirImg + 'cancelar.png',
                                            iconCls: 'btn',
                                            text: perfil.etiquetas.lbCancelar,
                                            tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                                            handler: function () {
                                                winRelacionarColumnas.destroy();
                                            }
                                        }, {
                                            icon: perfil.dirImg + 'validar.png',
                                            iconCls: 'btn',
                                            id: 'btnValidar',
                                            disabled: true,
                                            text: perfil.etiquetas.lbValidar,
                                            tooltip: perfil.etiquetas.lbValidarD,
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
                                                ;
                                                Ext.Ajax.request({
                                                    url: 'importarDatosRelacionados',
                                                    params: {
                                                        relaciones: Ext.encode(relaciones),
                                                        idejercicio: cbEjercicio.getValue(),
                                                        identidad: identidadselected
                                                    },
                                                    callback: function (options, success, response) {
                                                        winRelacionarColumnas.destroy();
                                                        response = Ext.decode(response.responseText);
                                                        columnasdinamicas = response.columnasdinamicas;
                                                        tabla = response.tabla;
                                                        campos = response.campos;
                                                        columnasdinamicasindex = response.columnasdinamicasindex;
                                                        mostrarResultadoValidacion();
                                                    }
                                                });
                                            }
                                        }],
                                    listeners: {
                                        destroy: function() {
                                            if (estado_deshabilitado == true)
                                                pgridDesg.disable();
                                            else
                                                pgridDesg.enable();
                                        }
                                    }
                                });
                                winRelacionarColumnas.show();
                                if (stNomen.getCount() <= stNomenExcel.getCount())
                                    btnAsociarOrden.enable();
                                else
                                    mostrarMensaje(1, perfil.etiquetas.msgDistintaCantidadColumnas);
                                if (stNomenRelacion.getCount() != 0)
                                    btnDesociarTodas.enable();
                            }
                        }
                );
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
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
            Ext.getCmp('btnValidar').enable();

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
            Ext.getCmp('btnValidar').enable();

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
        //grid panel para mostrar la validacion de los datos
        cmImportarValidado = new Ext.grid.ColumnModel([
            {
                header: perfil.etiquetas.lbCodigo,
                tooltip: perfil.etiquetas.lbTtCodigo,
                width: 120,
                dataIndex: 'codigo',
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbTtDenominacion,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbNAManual,
                tooltip: perfil.etiquetas.lbTtNAManual,
                align: 'right',
                width: 80,
                dataIndex: 'namanual',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbEstado,
                tooltip: perfil.etiquetas.lbTtEstado,
                width: 180,
                dataIndex: 'denominaciondato',
                renderer: crearToolTip
            }]);

        filtrosImportarValidado = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'codigo'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'numeric',
                    dataIndex: 'namanual'
                }]
        });

        stImportarValidado = new Ext.data.GroupingStore({
            url: 'listarDatosValidados',
            sortInfo: {
                field: 'codigo',
                direction: "ASC"
            },
            groupField: 'denominaciondato',
            listeners: {
                beforeload: function () {
                    stImportarValidado.baseParams.start = offsetdin;
                    cambiarTituloFiltrarNiveles(gpImportarValidado, filtrosImportarValidado, perfil.etiquetas.lbDatosImportar);
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
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'namanual'
                }, {
                    name: 'denominaciondato'
                }])
        });

        btnLimpiarFiltrosImportarValidado = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltrosDin',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbLimpiar,
            handler: function () {
                filtrosImportarValidado.clearFilters();
            }
        });

        smImportarValidado = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        gpImportarValidado = new Ext.grid.GridPanel({
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            store: stImportarValidado,
            sm: smImportarValidado,
            cm: cmImportarValidado,
            region: 'east',
            autoExpandColumn: 'expandir',
            title: perfil.etiquetas.lbDatosImportar,
            margins: '2 2 2 2',
            anchor: '100%',
            plugins: filtrosImportarValidado,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Actividades" : "Actividad"]})'
            }),
            bbar: new Ext.PagingToolbar({
                //pageSize: 20,
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
            title: perfil.etiquetas.lbDatVal,
            frame: true,
            border: true,
            anchor: '100%',
            layout: 'fit',
            items: [gpImportarValidado]
        });

        winDatosVal = new Ext.Window({
            modal: true,
            id: 'winDatosVal',
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            height: 500,
            width: 1000,
            title: perfil.etiquetas.lbImportar,
            items: [pgpDatosVal],
            buttons: [{
                    iconCls: 'cancelar',
                    id: 'btnCancelarImportar',
                    text: perfil.etiquetas.lbCancelar,
                    tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                    handler: function () {
                        winDatosVal.destroy();
                    }
                }, {
                    iconCls: 'adicionar',
                    id: 'btnAdicionarImportar',
                    text: perfil.etiquetas.lbBtnImp,
                    tooltip: perfil.etiquetas.lbBtnImp,
                    handler: function () {
                        mymask.show();
                        insertarDatos();
                    }
                }],
                listeners: {
                    hide: function() {
                        if (estado_deshabilitado == true)
                            pgridDesg.disable();
                        else
                            pgridDesg.enable();
                    }
                }
        });
        stImportarValidado.reload();
    }

    function insertarDatos() {
        Ext.Ajax.request({
            url: 'insertarDatosImportar',
            params: {
                idejercicio: cbEjercicio.getValue(),
                identidad: identidadselected

            },
            callback: function (options, success, response) {
                winDatosVal.destroy();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgImportadoOK);
                    stNivActividad.reload();
                } else {
                    mostrarMensaje(1, "Algunos datos no pudieron ser importados.");
                    stNivActividad.reload();
                }
            }
        });
    }

    function crearToolTip(v, m) {
        m.attr = 'ext:qtip="' + v + '"';
        return v;
    }

    function eliminarnom() {
        var recordsSel = gpNomencladoresRelacion.getSelectionModel().getSelections();
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                stNomenRelacion.remove(recordsSel[i]);
                var p1 = new Fila({
                    denominacionOS: recordsSel[i].data.denominacionOS,
                    posicionOS: recordsSel[i].data.posicionOS,
                    relacion: recordsSel[0].data.denominacionOS
                });
                stNomen.add(p1);
                var p2 = new Fila({
                    denomcolumnaExcel: recordsSel[i].data.denomcolumnaExcel,
                    posicioncolumnaExcel: recordsSel[i].data.posicioncolumnaExcel,
                    relacion: recordsSel[i].data.denominacionOS
                });
                stNomenExcel.add(p2)
            }
        }
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
    }

    function eliminarnomTodas() {
        var recordsSel = stNomenRelacion.getRange();
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                stNomenRelacion.remove(recordsSel[i]);
                var p1 = new Fila({
                    denominacionOS: recordsSel[i].data.denominacionOS,
                    posicionOS: recordsSel[i].data.posicionOS,
                    relacion: recordsSel[0].data.denominacionOS
                });
                stNomen.add(p1);
                var p2 = new Fila({
                    denomcolumnaExcel: recordsSel[i].data.denomcolumnaExcel,
                    posicioncolumnaExcel: recordsSel[i].data.posicioncolumnaExcel,
                    relacion: recordsSel[i].data.denominacionOS
                });
                stNomenExcel.add(p2)
            }
        }
        stNomen.sort('posicionOS', 'ASC');
        stNomenExcel.sort('posicioncolumnaExcel', 'ASC');
    }
}


