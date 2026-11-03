/*Desglose*/
var idactividadSeleccionada = null, filtrosDesgloses,
        cmDesgloses, gpDesgloses, offsetDesgloses = 0,
        stDesgloses, respColDinamicas = null;

function cargarconfgridDesglose(idtipomodelo) {

    smDesgloses = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, rowIndex, record) {
                if (!esrector) {
                    btnEliminarDesglose.enable();
                } else {
                    btnEliminarDesglose.disable();
                }
            },
            rowdeselect: function (sm, rowIndex, record) {
                btnEliminarDesglose.disable();
            }
        }
    });
    Ext.Ajax.timeout = 600000; //10min
    mymask.show();
    Ext.Ajax.request({
        url: 'obtenerColumnasDinamicas',
        params: {
            idtipomodelo: idtipomodelo
        },
        callback: function (options, success, response) {
            // mymask.hide();
            respColDinamicas = Ext.decode(response.responseText);
            if (respColDinamicas) {
                reconfgrid(respColDinamicas);
                pgridDesgloses.add(crearGrid(filtrosDesgloses, stDesgloses, cmDesgloses, pggpDesgloses, smDesgloses));
                pgridDesgloses.doLayout();
                //pgridDesgloses.expand();
                pgridDesgloses.enable();
                stDesgloses.reload();
            } else {
                respColDinamicas = null;
                reconfgrid();
            }

        }
    });
}
function crearGrid(filtrosDesgloses, stDesgloses, cmDesgloses, pggpDesgloses, smDesgloses) {

    return new Ext.grid.EditorGridPanel({
        store: stDesgloses,
        id: 'gpDesgloses',
        region: 'center',
        sm: smDesgloses,
        cm: cmDesgloses,
        frame: true,
        plugins: filtrosDesgloses,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: etiqueta.lbEspere
        },
        bbar: pggpDesgloses,
        listeners: {
            beforeedit: function (e) {
                columna = e.column;
                //para el renderer luego
                cmDesgloses.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            validateedit: function (e) {
                if (e.originalValue != e.value)
                    cmDesgloses.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            afteredit: function () {
                btnGuardarDesglose.enable();
            }
        }
    });
}

function reconfgrid(cf) {
    idactividadSeleccionada = gpNiveles.getSelectionModel().getSelected().data.idactividad;

    filterDinamico = [];
    filterDinamico.push({
        type: 'numeric',
        dataIndex: 'nivelactividad'
    });

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    var arrayIndexDinamicos = new Array();


    readerdina = [];
    readerdina.push({
        name: 'nivelactividad'
    });
    readerdina.push({
        name: 'iddesgloseentidadnivel'
    });

    //variable para controlar los editores dinamicos de los combos
    //1-es la diferencia entre posicion del arreglo y longitud
    //2-numero de columnas fijas antes de la 1er columna dinamica
//    contJRGrid = readerdina.length + 1 - 2;
    cmdina = [];
    cmdina.push({
        header: etiqueta.lbNivelActividad,
        allowBlank: false,
        align: 'right',
        dataIndex: 'nivelactividad',
        renderer: crearToolTip,
        tooltip: etiqueta.lbNivelActividad,
        width: 120,
        editor: new Ext.form.NumberField({
            name: 'nivelactividad',
            allowBlank: false,
            allowNegative: false,
            decimalPrecision: 4,
            minValue: 0,
            listeners: {
                focus: function (f) {
                    f.selectText();
                }
            }
        })
    });
    if (cf) {
        columnasdinamicas = [];
        for (var index = 0; index < cf.datos.length; index++) {
            columnasdinamicas.push({
                denom: cf.datos[index].uritiponomenclador,
                id: cf.datos[index].iddesglosetiponomenclador
            });
            var almacen = new Ext.data.SimpleStore({
                fields: ['iddatosnomenclador', 'denominacion']
            });
//            console.log(cf.datos);
            var valores = [];
            for (pos in cf.datos[index].datoscolumnas) {
                valores.push(new Ext.data.Record(cf.datos[index].datoscolumnas[pos]));
            }
            valores.pop();
            almacen.add(valores);
            readerdina.push({
                name: cf.datos[index].uritiponomenclador
            });
            arrayIndexDinamicos.push(cf.datos[index].uritiponomenclador);
            cf.datos[index] = {
                id: cf.datos[index].idtiponomenclador,
                header: cf.datos[index].denominacion,
                dataIndex: cf.datos[index].uritiponomenclador,
                sortable: true,
                width: 300,
                renderer: crearToolTip,
                tooltip: cf.datos[index].denominacion,
                editor: new Ext.form.ComboBox({
                    id: cf.datos[index].uritiponomenclador,
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: etiqueta.lbSeleccione,
                    width: 300,
                    valueField: 'iddatosnomenclador',
                    displayField: 'denominacion',
                    renderer: crearToolTip,
                    store: almacen,
                    listeners: {
                        select: function (a, b, c) {
                            adicionarrec = 0;
                            idcolumn = a.el.id;
                        },
                        focus: function () {
                        }
                    }
                })
            };

            cmdina.push(cf.datos[index]);
        }
    }
    jrstDesgloses = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'jrstDesgloses',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        fields: readerdina
    });

    cmDesgloses = new Ext.grid.ColumnModel(cmdina);

//para recorrer los indices dinamicos y trabajar con el render
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = cmDesgloses.findColumnIndex(arrayIndexDinamicos[i]);
        cmDesgloses.setRenderer(indiceColumn, function (value, m, rec, row, col) {
            m.attr = 'ext:qtip="' + getRawValue(value, cmDesgloses.getCellEditor(col, row).field, cmDesgloses, col) + '"';
            return getRawValue(value, cmDesgloses.getCellEditor(col, row).field, cmDesgloses, col);
        });
    }

    stDesgloses = new Ext.data.Store({
        url: 'listarDesgloseNivelesActividad',
        listeners: {
            beforeLoad: function () {
                this.baseParams.idactividad = idactividadSeleccionada;
                this.baseParams.identidad = nodoEst.id;
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.start = offsetDesgloses;
                this.baseParams.filtrosD = Ext.encode(filtrosDesgloses.getFilterData());
                cambiarTituloFiltrarDesglose();
            },
            load: function (st, rec, obj) {
                btnAdicionarDesglose.enable();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                cambiarTituloFiltrarDesglose();
                mymask.hide();
            },
            loadexception: function () {
                mostrarMensaje(1, etiqueta.msgErrorAction);
            }
        },
        reader: jrstDesgloses
    });
    filtrosDesgloses = new Ext.grid.GridFilters({
        filters: filterDinamico
    });
    btnLimpiarDesgloses = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarDesgloses',
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            accionbtnLimpiarDesgloses();
            stDesgloses.reload();
        }
    });
    pggpDesgloses = new Ext.PagingToolbar({
        pageSize: 20,
        store: stDesgloses,
        displayInfo: true,
        items: [btnLimpiarDesgloses],
        listeners: {
            beforechange: function (p, e) {
                offsetDesgloses = e.start;
            }
        }
    });
}
function calcularCantidad() {
    var suma = 0;
    for (var i = 0; i < Ext.getCmp('gpDesgloses').getStore().getCount(); i++) {
        if (Ext.getCmp('gpDesgloses').getStore().getAt(i).data.nivelactividad == null)
            cant = 0;
        else
            cant = Ext.getCmp('gpDesgloses').getStore().getAt(i).data.nivelactividad;
        suma += parseFloat(cant);
    }
    return suma;
}

function initDesgloses() {
    desgloses_realizados = [];
    for (var i = 0; i < 20; i++)
        desgloses_realizados.push({
            id: i,
            modif: false
        });
}

function guardarDesgloseConfirmacion() {
    var suma = calcularCantidad();
    if ((parseFloat(gpNiveles.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNiveles.getSelectionModel().getSelected().data.ajuste)) - parseInt(suma) < 0)
        mostrarMensaje(1, etiqueta.msgNoPuedeSeguirDesglosandoLimite);
    else if ((parseFloat(gpNiveles.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNiveles.getSelectionModel().getSelected().data.ajuste)) > 0 && (parseInt(suma) === 0))
        mostrarMensaje(1, etiqueta.msgVerifiqueQueNoHaDesglosado);
    else
        guardarDesgloses();

}

function guardarDesgloses(btn) {
    var desgloses = Ext.getCmp('gpDesgloses').getStore().getRange();
    var recorsm = [];
    var recorsm = Ext.getCmp('gpDesgloses').getStore().getModifiedRecords();
    var recordsEnviar = [];
    for (var i = 0; i < desgloses.length; i++) {
        if (desgloses[i].data.nivelactividad != null && desgloses[i].data.nivelactividad != 0) {
            recordsEnviar.push(desgloses[i].data);
        }
    }
//    console.log(recordsEnviar);
    if (recordsEnviar.length > 0) {
        mymask.show();
        idactividad = gpNiveles.getSelectionModel().getSelected().data.idactividad;
        Ext.Ajax.request({
            url: 'guardarDesgloses',
            params: {
                columnas: Ext.encode(columnasdinamicas),
                desglose: Ext.encode(recordsEnviar),
                idactividad: idactividad,
                identidad: nodoEst.id,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {
                Ext.getCmp('gpDesgloses').getStore().commitChanges();
                mymask.hide();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 20) {
                    if (recorsm.length == 1) {
                        mostrarMensaje(1, etiqueta.msgDesgloseRealizado);
                    } else {
                        mostrarMensaje(1, etiqueta.msgDesglosesRealizados);
                    }
                    stDesgloses.reload();
                    initDesgloses();
                } else if (responseData.codMsg == 26) {
                    mostrarMensaje(1, etiqueta.msgDesglosesSinGuardar);
                    stDesgloses.reload();
                } else if (responseData.codMsg == "Error") {
                    mostrarMensaje(1, etiqueta.msgNoSePudoGuardarDesglose);
                }
            }
        });
    }
}

function adicionarDesglose() {
    adicionarrec = 1;
    var arr = new Object();
    arr[0] = {
        name: 'nivelactividad',
        type: 'string'
    };
    if (respColDinamicas) {
        posicion = 1;
        for (var index = 0; index < respColDinamicas.datos.length; index++) {
            arr[posicion] = {
                name: respColDinamicas.datos[index].uritiponomenclador,
                type: 'string'
            };
            posicion++;
        }
    }
    Fila = Ext.data.Record.create(arr);
    var nivelact = parseFloat(gpNiveles.getSelectionModel().getSelected().data.nivelactividadfinal);
    var nivelp = calcularCantidad();
    if (nivelact - nivelp > 0) {
        if (nivelp == 0) {
            var p = new Fila({
                nivelactividad: Math.round(nivelact * Math.pow(10, 4)) / Math.pow(10, 4)
            });
        } else {
            var p = new Fila({
                nivelactividad: Math.round((nivelact - nivelp) * Math.pow(10, 4)) / Math.pow(10, 4)
            });
        }
        Ext.getCmp('gpDesgloses').getStore().add(p);
        adicionarrec = 0;
    } else
        mostrarMensaje(1, etiqueta.msgNoPuedeSeguirDesglosando);
}

function eliminarDesgloseConfirmacion() {
    var suma = calcularCantidad();
    if (suma == 0) {
        mostrarMensaje(1, etiqueta.msgNoHayDesgloses);
    } else {
        var desgloses = Ext.getCmp('gpDesgloses').getSelectionModel().getSelections();
        if (desgloses.length == 1)
            mostrarMensaje(2, etiqueta.msgConfirmarEliminarDesglose, eliminarDesglose);
        else
            mostrarMensaje(2, etiqueta.msgConfirmarEliminarDesgloses, eliminarDesglose);
    }
}
function eliminarDesglose(btnPresionado) {
    if (btnPresionado == 'ok') {
        var desgloses = Ext.getCmp('gpDesgloses').getSelectionModel().getSelections();
        var recordsEnviar = [];
        for (var i = 0; i < desgloses.length; i++) {
            if (desgloses[i].data.nivelactividad != null) {
                recordsEnviar.push(desgloses[i].data.iddesgloseentidadnivel);
            }
        }
        mymask.show();
        Ext.Ajax.timeout = 600000; //10min
        Ext.Ajax.request({
            url: 'eliminarDesglose',
            params: {
                idactividad: gpNiveles.getSelectionModel().getSelected().data.idactividad,
                identidad: nodoEst.id,
                iddesglose: Ext.encode(recordsEnviar),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {
//                stGpActividadDesglose.removeAll();
                stDesgloses.removeAll();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1) {
                    if (desgloses.length == 1)
                        mostrarMensaje(1, etiqueta.msgDesglosesEliminado);
                    else
                        mostrarMensaje(1, etiqueta.msgDesglosesEliminados);
                } else if (responseData.codMsgE == 21)
                    mostrarMensaje(1, etiqueta.msgErrorAction);
                else if (responseData.codMsgE == 3)
                    mostrarMensaje(1, responseData.mensaje);
                Ext.getCmp('gpDesgloses').getStore().load();
            }
        });
    }
}
//function limpiarDesglose() {
//    stDesgloses.loadData({"data": [], "total": 0});
//    pgridDesgloses.disable();
//}