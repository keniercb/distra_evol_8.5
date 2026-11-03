/*Script para importar datos de Plan central*/
var winImp;
var offsetdin = 0;
importarDemanda = function () {
    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscarDemanda',
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
                id: 'form-file-Demanda',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ':',
                    id: 'idbuttonDemanda',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });
    winImportarDemanda(fpbuscar);

    Ext.getCmp('idFpBuscarDemanda').getForm().reset();
    winImp.show();
    winImp.add(fpbuscar);
    winImp.doLayout(false);

//Funciones auxuliares de los metodos
    function winImportarDemanda() {
        if (!winImp) {
            winImp = new Ext.Window({
                id: 'winImpDemanda',
                modal: true,
                closeAction: 'hide',
                constrain: true,
                layout: 'fit',
                title: perfil.etiquetas.lbImportarExcel,
                width: 400,
                height: 150,
                buttons: [{
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbCancelar,
                        tooltip: perfil.etiquetas.lbCancelar,
                        handler: function () {
                            winImp.hide();
                        }
                    }, {
                        iconCls: 'aceptar',
                        text: perfil.etiquetas.lbAceptar,
                        tooltip: perfil.etiquetas.lbAceptar,
                        handler: function () {
                            importar();
                        }
                    }]
            });
        }
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
                    id: 'btnDemanda',
                    tooltip: perfil.etiquetas.lbCerrar,
                    iconCls: 'aceptar'
                });
                Ext.getCmp('idFpBuscarDemanda').getForm().submit(
                        {
                            url: 'importarFicheroDemanda',
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
                                    }, {
                                        name: 'posicionOS',
                                        type: 'numeric'
                                    }]);

                                //creando el objeto fila de las columnas excel
                                FilaExcel = Ext.data.Record.create([
                                    {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    }, {
                                        name: 'posicioncolumnaExcel',
                                        type: 'numeric'
                                    }]);

                                Fila = Ext.data.Record.create([
                                    {
                                        name: 'denominacionOS',
                                        type: 'string'
                                    }, {
                                        name: 'denomcolumnaExcel',
                                        type: 'string'
                                    }, {
                                        name: 'posicionOS',
                                        type: 'numeric'
                                    }, {
                                        name: 'posicioncolumnaExcel',
                                        type: 'numeric'
                                    }, {
                                        name: 'relacion',
                                        type: 'string'
                                    }]);

                                btnAsociarOrden = new Ext.Button({
                                    disabled: true,
                                    id: 'btnAsociarOrdenDemanda',
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
                                    id: 'btnsiguienteDemanda',
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
                                    id: 'btnAnteriorDemanda',
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
                                    id: 'btnDesociarTodasDemanda',
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
                                    }
                                });
                                gpNomencladores = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbEspere
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
                                    }
                                });
                                gpNomencladoresExcel = new Ext.grid.GridPanel({
                                    loadMask: {
                                        msg: perfil.etiquetas.lbEspere
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
                                        msg: perfil.etiquetas.lbEspere
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
                                                }, {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresExcel]
                                                }, {
                                                    columnWidth: .06,
                                                    layout: 'form',
                                                    items: [btnAsociarOrden, btnSiguiente, btnAnterior, btnDesociarTodas]
                                                }, {
                                                    columnWidth: .27,
                                                    layout: 'form',
                                                    items: [pgpNomencladoresRelacion]
                                                }]
                                        }]
                                });

                                winRelacionarColumnas = new Ext.Window({
                                    modal: true,
                                    id: 'winRelacionarColumnasDemanda',
                                    closeAction: 'destroy',
                                    layout: 'fit',
                                    constrain: true,
                                    items: [pRelacionarColumnas],
                                    title: perfil.etiquetas.lbRelCol,
                                    buttons: [{
                                            icon: perfil.dirImg + 'cancelar.png',
                                            iconCls: 'cancelar',
                                            text: perfil.etiquetas.lbCancelar,
                                            tooltip: perfil.etiquetas.lbCancelar,
                                            handler: function () {
                                                winRelacionarColumnas.close();
                                            }
                                        }, {
                                            icon: perfil.dirImg + 'validar.png',
                                            iconCls: 'validar',
                                            id: 'btnValidarDemanda',
                                            disabled: true,
                                            text: perfil.etiquetas.lbValidar,
                                            tooltip: perfil.etiquetas.lbValidarD,
                                            handler: function () {
                                                //mymask.show();
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
                                                    url: 'importarDatosRelacionadosDemanda',
                                                    params: {
                                                        relaciones: Ext.encode(relaciones),
                                                        idejercicio: cbEjercicio.getValue(),
                                                        identidad: nodoEst.id,
                                                        tipo: cbComportamiento.getValue()
                                                    },
                                                    callback: function (options, success, response) {
                                                        winRelacionarColumnas.close();
                                                        response = Ext.decode(response.responseText);
                                                        if (response.result != 1) {
                                                            mostrarMensaje(1, perfil.etiquetas.lbDatosNoValidos);
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
            Ext.getCmp('btnValidarDemanda').enable();

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
            Ext.getCmp('btnValidarDemanda').enable();

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
                Ext.getCmp('btnValidarDemanda').disable();
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
            Ext.getCmp('btnValidarDemanda').disable();

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
                tooltip: perfil.etiquetas.lbCodigo,
                width: 120,
                dataIndex: 'codigo',
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbCantidad,
                tooltip: perfil.etiquetas.lbCantidad,
                align: 'right',
                width: 150,
                dataIndex: 'cantidadinicial',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbAjuste,
                tooltip: perfil.etiquetas.lbAjuste,
                align: 'right',
                width: 150,
                dataIndex: 'ajuste',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbEntidadUIM,
                tooltip: perfil.etiquetas.lbEntidadUIM,
                align: 'right',
                width: 150,
                dataIndex: 'empresa',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbPrograma,
                tooltip: perfil.etiquetas.lbPrograma,
                align: 'right',
                width: 150,
                dataIndex: 'programa',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDestino,
                tooltip: perfil.etiquetas.lbDestino,
                align: 'right',
                width: 150,
                dataIndex: 'destino',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbEstado,
                tooltip: perfil.etiquetas.lbEstado,
                width: 180,
                dataIndex: 'denominaciondato',
                renderer: crearToolTip
            }]);

        filtrosImportarValidado = new Ext.grid.GridFilters({
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
                    type: 'numeric',
                    dataIndex: 'cantidadinicial'
                }, {
                    type: 'numeric',
                    dataIndex: 'ajuste'
                }, {
                    type: 'string',
                    dataIndex: 'denominaciondato'
                }]
        });

        stImportarValidado = new Ext.data.GroupingStore({
            url: 'listarDatosValidadosDemanda',
            sortInfo: {
                field: 'denominaciondato',
                direction: "ASC"
            },
            groupField: 'denominaciondato',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = offsetdin;
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
                    name: 'cantidadinicial'
                }, {
                    name: 'ajuste'
                }, {
                    name: 'empresa'
                }, {
                    name: 'programa'
                }, {
                    name: 'destino'
                }, {
                    name: 'denominaciondato'
                }])
        });

        btnLimpiarFiltrosImportarValidado = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltrosDinDemanda',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbLimpiarImp,
            handler: function () {
                filtrosImportarValidado.clearFilters();
            }
        });

        smImportarValidado = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    //controlarObjetosEnmarcados();
                }
            }
        });

        gpImportarValidado = new Ext.grid.GridPanel({
            id: 'gpImportarValidadoDemanda',
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            store: stImportarValidado,
            sm: smImportarValidado,
            cm: cmImportarValidado,
            region: 'east',
            autoExpandColumn: 'expandir',
            margins: '2 2 2 2',
            anchor: '100%',
            plugins: filtrosImportarValidado,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
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
            id: 'winDatosValDemanda',
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            height: 500,
            width: 1000,
            title: perfil.etiquetas.lbTitlewinDatosVal,
            items: [pgpDatosVal],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbCancelar,
                    tooltip: perfil.etiquetas.lbCancelar,
                    handler: function () {
                        winDatosVal.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnAdicionarDemanda',
                    //disabled: true,
                    text: perfil.etiquetas.lbAceptar,
                    tooltip: perfil.etiquetas.lbAceptar,
                    handler: function () {
                        //mymask.show();
                        insertarDatos();
                    }
                }]
        });

        stImportarValidado.reload();
    }
    function insertarDatos() {
        Ext.Ajax.request({
            url: 'insertarDatosImportarDemanda',
            params: {
                identidad: nodoEst.id,
                idejercicio: cbEjercicio.getValue(),
                tipo: cbComportamiento.getValue()
            },
            callback: function (options, success, response) {
                winDatosVal.close();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgImportadoOK);
                    stDemandaGestion.reload();
                } else {
                    mostrarMensaje(1, "Algunos indicadores no fueron importados.");
                    stDemandaGestion.reload();
                }
            }
        });
    }
};



