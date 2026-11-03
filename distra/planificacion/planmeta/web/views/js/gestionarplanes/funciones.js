/**
 * Created by madrid on 23/03/2017.
 */

//funciones renders
function crearToolTipPlanes(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function precioPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}

function AprobacionPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == 1)
        return 'No';
    else if (value == 2)
        return 'Si';
    else
        return 'Rector';
}

function CantidadPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}

function EsdeBasePlanPPLanes(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + "Base para el plan (Norma)" + '"';
        return 'Base para el plan (Norma)';

    } else if (val == 0) {
        m.attr = 'ext:qtip="' + "Directo al plan" + '"';
        return 'Directo al plan';
    } else if (val == 2) {
        m.attr = 'ext:qtip="' + "Afectado" + '"';
        return 'Afectado';
    } else if (val == 3) {
        m.attr = 'ext:qtip="' + "Otros" + '"';
        return 'Otros';

    } else if (val == 4) {
        m.attr = 'ext:qtip="' + "Base para el plan (Salida)" + '"';
        return 'Base para el plan (Salida)';
    }
}

function ColumnaAprobacionPLanes(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1 || val == 2) {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + "No" + '"';
    } else if (val == 3) {
        m.css = 'icondistra-true amarillo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
    } else if (val == 5) {
        m.css = 'icondistra-true azul';
        m.attr = 'ext:qtip="' + "Ajuste" + '"';
    } else {
        if (val == 4) {
            m.attr = 'ext:qtip="' + "Rector" + '"';
            m.css = 'icondistra-true verde';
        }
    }
}

function ColumnaAsociadoPlanes(val) {
    if (val != null)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';

}

function ColumnaAsociadonaeogPlanes(val) {
    if (!val)
        return 'No';
    else
        return 'Si';
}

function ColumnaAsociadonaerfPlanes(val) {
    if (!val)
        return 'No';
    else
        return 'Si';
}

function cambiarTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgpModeloPlanes.getFiltrosActivos() == undefined || filtrosgpModeloPlanes.getFiltrosActivos().length == 0) {
        pModeloPlanes.setTitle(perfil.etiquetas.titModelos);
    } else {
        for (i = 0; i < filtrosgpModeloPlanes.getFiltrosActivos().length; i++) {
            var numberCol = columnasDinamicasgpModeloPlanes.findColumnIndex(filtrosgpModeloPlanes.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosgpModeloPlanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += columnasDinamicasgpModeloPlanes.getColumnHeader(numberCol) + sep;
        }
        pModeloPlanes.setTitle('Detalles del plan ' + '<i>- Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function winFpPlanes(opcion) {
//winFpPlanes = function (opcion) {
    switch (opcion) {
        case 'Imp':
            {
                if (!winImpPlanes) {
                    winImpPlanes = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        constrain: true,
                        layout: 'fit',
                        title: perfil.etiquetas.lbImportarExcel,
                        width: 400,
                        height: 150,
                        buttons: [{
                                iconCls: 'cancelar',
                                text: perfil.etiquetas.lbBtnCancelar,
                                tooltip: perfil.etiquetas.lbTtbtnCancelar,
                                handler: function () {
                                    winImpPlanes.hide();
                                }
                            }, {
                                iconCls: 'aceptar',
                                text: perfil.etiquetas.lbBtnAceptar,
                                tooltip: perfil.etiquetas.lbTtbtnAceptar,
                                handler: function () {
                                    importarPlanes();
                                }
                            }]
                    });
                }
                //Ext.getCmp('idfpbuscarPlanes').getForm().reset();
                fpbuscarPlanes.getForm().reset();
                winImpPlanes.show();
                winImpPlanes.add(fpbuscarPlanes);
                winImpPlanes.doLayout();
            }
            break;
    }
}

function importarPlanes() {
    try {
        if (fpbuscarPlanes.getForm().isValid()) {
            var barra = Ext.MessageBox.show({
                msg: perfil.etiquetas.lbEspere,
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });
            var btnCerrarWin = new Ext.Button({
                text: 'Cerrar',
                disabled: true,
                id: 'btn',
                tooltip: 'Cerrar',
                iconCls: 'aceptar'
            });

            fpbuscarPlanes.getForm().submit(
                    {
                        url: 'importarfichero',
                        timeout: 1800000, //milisegundos = 30 min
                        method: 'POST',
                        params: {
                            idconcepto: 9,
                            idejercicio: cbEjercicioPlanes.getValue(),
                            idmodelo: treePlanSelect,
                            identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                            idtipomodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idtipomodelo

                        },
                        failure: function (form, action) {
                            barra.hide();
                            winImpPlanes.hide();
                            coldin = action.result.columnasdinamicas;

                            FilaPlanes = Ext.data.Record.create([
                                {
                                    name: 'denomcolumna',
                                    type: 'string'
                                },
                                {
                                    name: 'denomcolumnaExcel',
                                    type: 'string'
                                },
                                {
                                    name: 'denomtipocolumna',
                                    type: 'string'
                                },
                                {
                                    name: 'relacion',
                                    type: 'string'
                                },
                                {
                                    name: 'posicion',
                                    type: 'numeric'
                                },
                                {
                                    name: 'nombre',
                                    type: 'string'
                                },
                                {
                                    name: 'posicionTM',
                                    type: 'numeric'
                                }]);

                            FilaTipModPlanes = Ext.data.Record.create([
                                {
                                    name: 'denomcolumna',
                                    type: 'string'
                                },
                                {
                                    name: 'denomtipocolumna',
                                    type: 'string'
                                },
                                {
                                    name: 'denominacion',
                                    type: 'string'
                                },
                                {
                                    name: 'nombre',
                                    type: 'string'
                                },
                                {
                                    name: 'posicionTM',
                                    type: 'numeric'
                                }]);

                            FilaExcelPlanes = Ext.data.Record.create([
                                {
                                    name: 'denomcolumnaExcel',
                                    type: 'string'
                                },
                                {
                                    name: 'posicion',
                                    type: 'numeric'
                                }]);


                            btnAsociarOrdenPlanes = new Ext.Button({
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

                            btnSiguientePlanes = new Ext.Button({
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

                            btnAnteriorPlanes = new Ext.Button({
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

                            btnDesociarTodasPlanes = new Ext.Button({
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

                            //grid panel para columnas segun tipo de modelo
                            stNomenPlanes = new Ext.data.SimpleStore({
                                fields: ['denomcolumna', 'denomtipocolumna', 'denominacion', 'nombre', 'posicionTM'],
                                data: action.result.columnas,
                                sorters: [{
                                        property: 'posicionTM',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicionTM',
                                sortOnLoad: true,
                                remoteSort: false
                            });
                            cmNomencladoresPlanes = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenominacion,
                                    tooltip: perfil.etiquetas.lbDenominacion,
                                    dataIndex: 'denomcolumna',
                                    sortable: true,
                                    renderer: crearToolTip
                                },
                                {
                                    header: perfil.etiquetas.lbTipDato,
                                    tooltip: perfil.etiquetas.lbTipDato,
                                    width: 150,
                                    dataIndex: 'denomtipocolumna',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);

                            smNomencladoresPlanes = new Ext.grid.RowSelectionModel({
                                singleSelect: true
                            });
                            smNomencladoresPlanes.on('selectionchange', function (sm) {
                                if (sm.getSelections().length == 1 && smNomencladoresExcelPlanes.getSelections().length == 1 && stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount()) {
                                    btnSiguientePlanes.enable();
                                } else {
                                    btnSiguientePlanes.disable();
                                }
                            });
                            gpNomencladoresPlanes = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: stNomenPlanes,
                                sm: smNomencladoresPlanes,
                                cm: cmNomencladoresPlanes,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%'
                            });

                            pgpNomencladoresPlanes = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbColTM,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '95%',
                                layout: 'fit',
                                items: [gpNomencladoresPlanes]

                            });

                            //grid panel para columnas del excel
                            stNomenExcelPlanes = new Ext.data.SimpleStore({
                                fields: ['denomcolumnaExcel', 'posicion'],
                                data: action.result.columnasExcel,
                                sorters: [{
                                        property: 'posicion',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicion',
                                sortOnLoad: true,
                                remoteSort: false
                            });

                            cmNomencladoresExcelPlanes = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenominacion,
                                    tooltip: perfil.etiquetas.lbDenominacion,
                                    dataIndex: 'denomcolumnaExcel',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);

                            smNomencladoresExcelPlanes = new Ext.grid.RowSelectionModel({
                                singleSelect: true
                            });
                            smNomencladoresExcelPlanes.on('selectionchange', function (sm) {
                                if (sm.getSelections().length == 1 && smNomencladoresPlanes.getSelections().length == 1 && stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount()) {
                                    btnSiguientePlanes.enable();
                                } else {
                                    btnSiguientePlanes.disable();
                                }
                            });
                            gpNomencladoresExcelPlanes = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: stNomenExcelPlanes,
                                sm: smNomencladoresExcelPlanes,
                                cm: cmNomencladoresExcelPlanes,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%'
                            });

                            pgpNomencladoresExcelPlanes = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbColExcel,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '100%',
                                layout: 'fit',
                                items: [gpNomencladoresExcelPlanes]
                            });

                            //grid panel para relacionar columnas
                            stNomenRelacionPlanes = new Ext.data.Store({
                                enableKeyEvents: true,
                                reader: new Ext.data.JsonReader({
                                    root: 'data'
                                }, [{
                                        name: 'denomcolumna'
                                    }, {
                                        name: 'denomcolumnaExcel'
                                    }, {
                                        name: 'denomtipocolumna'
                                    }, {
                                        name: 'relacion'
                                    }, {
                                        name: 'posicion'
                                    }, {
                                        name: 'nombre'
                                    }, {
                                        name: 'posicionTM'
                                    }]),
                                sorters: [{
                                        property: 'posicionTM',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicionTM',
                                sortOnLoad: true,
                                remoteSort: false
                            });
                            cmNomencladoresRelacionPlanes = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenominacion,
                                    tooltip: perfil.etiquetas.lbDenominacion,
                                    dataIndex: 'relacion',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);

                            smNomencladoresRelacionPlanes = new Ext.grid.RowSelectionModel({
                                singleSelect: false
                            });
                            smNomencladoresRelacionPlanes.on('selectionchange', function (sm) {
                                if (sm.getSelections().length != 0) {
                                    btnAnteriorPlanes.enable();
                                } else {
                                    btnAnteriorPlanes.disable();
                                }
                            });
                            gpNomencladoresRelacionPlanes = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: stNomenRelacionPlanes,
                                sm: smNomencladoresRelacionPlanes,
                                cm: cmNomencladoresRelacionPlanes,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%', listeners: {
                                    rowdblclick: function () {
                                        eliminarnom();
                                    }
                                }
                            });

                            pgpNomencladoresRelacionPlanes = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbColRel,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '100%',
                                layout: 'fit',
                                items: [gpNomencladoresRelacionPlanes]

                            });

                            pRelacionarColumnasPlanes = new Ext.Panel({
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
                                                items: [pgpNomencladoresPlanes]
                                            },
                                            {
                                                columnWidth: .27,
                                                layout: 'form',
                                                items: [pgpNomencladoresExcelPlanes]
                                            },
                                            {
                                                columnWidth: .06,
                                                layout: 'form',
                                                items: [btnAsociarOrdenPlanes, btnSiguientePlanes, btnAnteriorPlanes, btnDesociarTodasPlanes]
                                            },
                                            {
                                                columnWidth: .27,
                                                layout: 'form',
                                                items: [pgpNomencladoresRelacionPlanes]
                                            }]
                                    }]

                            });
                            winRelacionarColumnasPlanes = new Ext.Window({
                                modal: true,
                                id: 'winRelacionarColumnas',
                                closeAction: 'destroy',
                                layout: 'fit',
                                constrain: true,
                                items: [pRelacionarColumnasPlanes],
                                title: perfil.etiquetas.lbRelCol,
                                buttons: [{
                                        icon: perfil.dirImg + 'cancelar.png',
                                        iconCls: 'btn',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.lbTtbtnCancelar,
                                        handler: function () {
                                            winRelacionarColumnasPlanes.destroy();
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
                                            var rel = stNomenRelacionPlanes.getRange();
                                            var relaciones = [];
                                            for (var index = 0; index < stNomenRelacionPlanes.getCount(); index++) {
                                                relaciones.push({
                                                    denomcolumna: rel[index].data.denomcolumna,
                                                    denomtipocolumna: rel[index].data.denomtipocolumna,
                                                    denomcolumnaExcel: rel[index].data.denomcolumnaExcel,
                                                    posicion: rel[index].data.posicion,
                                                    nombre: rel[index].data.nombre
                                                });
                                            }
                                            ;

                                            Ext.Ajax.request({
                                                url: 'importarDatosRelacionados',
                                                params: {
                                                    coldin: Ext.encode(coldin),
                                                    relaciones: Ext.encode(relaciones),
                                                    identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                                                    idejercicio: cbEjercicioPlanes.getValue(),
                                                    tipoplan: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan,
                                                    idtipomodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idtipomodelo
                                                },
                                                callback: function (options, success, response) {
                                                    winRelacionarColumnasPlanes.destroy();
                                                    response = Ext.decode(response.responseText);
                                                    columnasdinamicas = response.columnasdinamicas;
                                                    tabla = response.tabla;
                                                    campos = response.campos;
                                                    columnasdinamicasindex = response.columnasdinamicasindex;
                                                    columnasdinamicasfiltro = response.tipofilc;
                                                    mostrarResultadoValidacion();
                                                }
                                            });
                                        }
                                    }]
                            });
                            winRelacionarColumnasPlanes.show();
                            if (stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount())
                                btnAsociarOrdenPlanes.enable();
                            if (stNomenRelacionPlanes.getCount() != 0)
                                btnDesociarTodasPlanes.enable();
                        }
                    }
            );
        } else
            mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);

    } catch (e) {
    }
}

function addRelacion() {
    var recordSel = smNomencladoresPlanes.getSelections();
    var recordSelExc = smNomencladoresExcelPlanes.getSelections();

    stNomenPlanes.remove(recordSel[0]);
    stNomenExcelPlanes.remove(recordSelExc[0]);

    var p = new FilaPlanes({
        denomcolumna: recordSel[0].data.denomcolumna,
        denomtipocolumna: recordSel[0].data.denomtipocolumna,
        nombre: recordSel[0].data.nombre,
        posicionTM: recordSel[0].data.posicionTM,
        denomcolumnaExcel: recordSelExc[0].data.denomcolumnaExcel,
        posicion: recordSelExc[0].data.posicion,
        relacion: recordSel[0].data.denomcolumna + " / " + recordSelExc[0].data.denomcolumnaExcel
    });

    stNomenRelacionPlanes.add(p);

    stNomenRelacionPlanes.sort('posicionTM', 'ASC');
    stNomenPlanes.sort('posicionTM', 'ASC');
    stNomenExcelPlanes.sort('posicion', 'ASC');

    if (stNomenPlanes.getCount() == 0)
        Ext.getCmp('btnValidar').enable();

    if (stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount())
        btnAsociarOrdenPlanes.enable();
    else
        btnAsociarOrdenPlanes.disable();

    if (stNomenRelacionPlanes.getCount() != 0)
        btnDesociarTodasPlanes.enable();
    else
        btnDesociarTodasPlanes.disable();
}

function addRelacionTodas() {
    var records = stNomenPlanes.getRange();
    var recordsExcel = stNomenExcelPlanes.getRange();
    var contador = stNomenPlanes.getCount();

    for (var index = 0; index < contador; index++) {
        var p = new FilaPlanes({
            denomcolumna: records[index].data.denomcolumna,
            denomtipocolumna: records[index].data.denomtipocolumna,
            nombre: records[index].data.nombre,
            posicionTM: records[index].data.posicionTM,
            denomcolumnaExcel: recordsExcel[index].data.denomcolumnaExcel,
            posicion: recordsExcel[index].data.posicion,
            relacion: records[index].data.denomcolumna + " / " + recordsExcel[index].data.denomcolumnaExcel
        });

        stNomenRelacionPlanes.add(p);
        stNomenPlanes.remove(records[index]);
        stNomenExcelPlanes.remove(recordsExcel[index]);
    }

    stNomenRelacionPlanes.sort('posicionTM', 'ASC');
    stNomenPlanes.sort('posicionTM', 'ASC');
    stNomenExcelPlanes.sort('posicion', 'ASC');

    if (stNomenPlanes.getCount() == 0)
        Ext.getCmp('btnValidar').enable();

    if (stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount())
        btnAsociarOrdenPlanes.enable();
    else
        btnAsociarOrdenPlanes.disable();

    if (stNomenRelacionPlanes.getCount() != 0)
        btnDesociarTodasPlanes.enable();
    else
        btnDesociarTodasPlanes.disable();
}
function eliminarnom() {
    var recordsSel = smNomencladoresRelacionPlanes.getSelections();

    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            var recordSel = recordsSel[i];
            var pTipMod = new FilaTipModPlanes({
                denomcolumna: recordSel.data.denomcolumna,
                denomtipocolumna: recordSel.data.denomtipocolumna,
                denominacion: recordSel.data.denominacion,
                nombre: recordSel.data.nombre,
                posicionTM: recordSel.data.posicionTM
            });

            stNomenPlanes.add(pTipMod);

            var pExcel = new FilaExcelPlanes({
                denomcolumnaExcel: recordSel.data.denomcolumnaExcel,
                posicion: recordSel.data.posicion
            });
            stNomenExcelPlanes.add(pExcel);
            stNomenRelacionPlanes.remove(recordSel);
        }

        if (stNomenPlanes.getCount() != 0)
            Ext.getCmp('btnValidar').disable();
    }

    stNomenRelacionPlanes.sort('posicionTM', 'ASC');
    stNomenPlanes.sort('posicionTM', 'ASC');
    stNomenExcelPlanes.sort('posicion', 'ASC');

    if (stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount())
        btnAsociarOrdenPlanes.enable();
    else
        btnAsociarOrdenPlanes.disable();

    if (stNomenRelacionPlanes.getCount() != 0)
        btnDesociarTodasPlanes.enable();
    else
        btnDesociarTodasPlanes.disable();
}

function eliminarnomTodas() {
    var records = stNomenRelacionPlanes.getRange();
    var contador = stNomenRelacionPlanes.getCount();

    for (var i = 0; i < contador; i++) {

        var pTipMod = new FilaTipModPlanes({
            denomcolumna: records[i].data.denomcolumna,
            denomtipocolumna: records[i].data.denomtipocolumna,
            denominacion: records[i].data.denominacion,
            nombre: records[i].data.nombre,
            posicionTM: records[i].data.posicionTM
        });

        stNomenPlanes.add(pTipMod);

        var pExcel = new FilaExcelPlanes({
            denomcolumnaExcel: records[i].data.denomcolumnaExcel,
            posicion: records[i].data.posicion
        });

        stNomenExcelPlanes.add(pExcel);
        stNomenRelacionPlanes.remove(records[i]);
    }

    stNomenRelacionPlanes.sort('posicionTM', 'ASC');
    stNomenPlanes.sort('posicionTM', 'ASC');
    stNomenExcelPlanes.sort('posicion', 'ASC');

    if (stNomenPlanes.getCount() != 0)
        Ext.getCmp('btnValidar').disable();

    if (stNomenPlanes.getCount() <= stNomenExcelPlanes.getCount())
        btnAsociarOrdenPlanes.enable();
    else
        btnAsociarOrdenPlanes.disable();

    if (stNomenRelacionPlanes.getCount() != 0)
        btnDesociarTodasPlanes.enable();
    else
        btnDesociarTodasPlanes.disable();
}

function mostrarResultadoValidacion() {
    //grid panel para mostrar la validacion de los datos
    readerdina = [];
    readerdina.push({
        name: 'codigo'
    });
    readerdina.push({
        name: 'cantidad'
    });
    readerdina.push({
        name: 'ajuste'
    });
    readerdina.push({
        name: 'idaprobaciondemanda'
    });
    cmdina = [];
    cmdina.push({
        header: perfil.etiquetas.lbCodigo,
        tooltip: perfil.etiquetas.lbCodigo,
        dataIndex: 'codigo',
        id: 'expandir',
        renderer: crearToolTip,
        sortable: true
    });
    cmdina.push({
        header: perfil.etiquetas.lbCantidad,
        tooltip: perfil.etiquetas.lbCantidad,
        align: 'right',
        dataIndex: 'cantidad',
        renderer: crearToolTip,
        sortable: true
    });
    cmdina.push({
        header: perfil.etiquetas.lbAjuste,
        tooltip: perfil.etiquetas.lbAjuste,
        align: 'right',
        dataIndex: 'ajuste',
        renderer: crearToolTip,
        sortable: true
    });
    cmdina.push({
        header: perfil.etiquetas.lbAprobacion,
        sortable: true,
        align: 'center',
        dataIndex: 'idaprobaciondemanda',
        tooltip: perfil.etiquetas.lbAprobacion,
        renderer: modificarAprobacion
    });
    filterDinamico = [];

    filterDinamico.push({
        type: 'string',
        dataIndex: 'codigo'
    }, {
        type: 'numeric',
        dataIndex: 'cantidad'
    }, {
        type: 'numeric',
        dataIndex: 'ajuste'
    }, {
        type: 'list',
        dataIndex: 'idaprobaciondemanda',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
    });
    for (var index = 0; index < coldin.length; index++) {
        readerdina.push({
            name: columnasdinamicasindex[index]
        });
        cmdina.push({
            header: coldin[index][0],
            sortable: true,
            align: 'center',
            dataIndex: columnasdinamicasindex[index],
            tooltip: coldin[index][0],
            renderer: crearToolTip
        });
        filterDinamico.push({
            type: columnasdinamicasfiltro[index],
            dataIndex: columnasdinamicasindex[index]
        });
    }
    readerdina.push({
        name: 'denominaciondato'
    });
    cmdina.push({
        header: 'Error',
        sortable: true,
        hidden: true,
        align: 'center',
        dataIndex: 'denominaciondato',
        tooltip: 'Error',
        renderer: crearToolTip
    });
    stDatosVal = new Ext.data.GroupingStore({
        url: 'listarDatosValidados',
        sortInfo: {
            field: 'denominaciondato',
            direction: "ASC"
        },
        groupField: 'denominaciondato',
        listeners: {
            beforeload: function (st) {
                st.baseParams.coldin = Ext.encode(columnasdinamicasindex);
                st.baseParams.start = offsetdin;
            },
            load: function (t, n, e) {
                winDatosVal.show();
                Ext.getCmp('btnAdicionar').enable();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            fields: readerdina
        })
    });
    cmDatosVal = new Ext.grid.ColumnModel(cmdina);
    smDatosVal = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosDin = new Ext.grid.GridFilters({
        filters: filterDinamico
    });

    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiarImp,
        handler: function () {
            filtrosDin.clearFilters();
        }
    });

    gpDatosVal = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        store: stDatosVal,
        sm: smDatosVal,
        cm: cmDatosVal,
        region: 'east',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 2',
        anchor: '100%',
        plugins: filtrosDin,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stDatosVal,
            displayInfo: true,
            items: [btnLimpiarFiltros],
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
        items: [gpDatosVal]
    });

    winDatosVal = new Ext.Window({
        modal: true,
        id: 'winDatosVal',
        closeAction: 'destroy',
        layout: 'fit',
        constrain: true,
        height: 500,
        width: 1000,
        items: [pgpDatosVal],
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtbtnCancelar,
                handler: function () {
                    winDatosVal.destroy();
                }
            }, {
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                id: 'btnAdicionar',
                disabled: true,
                text: perfil.etiquetas.lbIns,
                tooltip: perfil.etiquetas.lbInsD,
                handler: function () {
                    mymask.show();
                    insertarDatos();
                }
            }]
    });

    stDatosVal.reload({
        params: {
            start: 0,
            limit: 20
        }
    });
}

function insertarDatos() {
    Ext.Ajax.request({
        url: 'insertarDatosImportar',
        params: {
            tabla: tabla,
            columnasdinamicas: columnasdinamicas,
            campos: campos
        },
        callback: function (options, success, response) {
            winDatosVal.destroy();
            mymask.hide();
            mostrarMensaje(1, perfil.etiquetas.msgImportadoOK);
            cargarconfgrid(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idtipomodelo);
        }
    });
}

function modificarAprobacion(val, m) {
    if (val == 1 || val < 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbRector + '"';
        m.css = 'icondistra-true verde';
    } else if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 5) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAjuste + '"';
        m.css = 'icondistra-true azul';
    }

}

/************************FIN IMPORTAR*****************************/
//calcular importes totales
function setearImportePlanes() {
    importesPlanes.push('0.000'); //indice 0
    importesPlanes.push('0.000'); //indice 1 MN
    importesPlanes.push('0.000'); //indice 2 MLC
    importesPlanes.push('0.000'); //indice 3 IFlete
    importesPlanes.push('0.000'); //indice 4 IContingencia
}

function calcularImporteTotalPlanes() {
    setearImportePlanes();
    if (stGpGestModeloPlanes.getCount() > 0) {
        importesPlanes[1] = jrStGpGestModeloPlanes.jsonData.importetotal;
        importesPlanes[2] = jrStGpGestModeloPlanes.jsonData.importedivisatotal;
        importesPlanes[3] = jrStGpGestModeloPlanes.jsonData.importeflete;
        importesPlanes[4] = jrStGpGestModeloPlanes.jsonData.importecontingencia;
        importesPlanes[5] = jrStGpGestModeloPlanes.jsonData.importeajustado;
        importesPlanes[6] = jrStGpGestModeloPlanes.jsonData.importefinal;
        tfImportePlanes.setValue(importesPlanes[cbImportesPlanes.getValue()]);
        tfcantidadfinalPlanes.setValue(jrStGpGestModeloPlanes.jsonData.cantidadfinal);
    } else {
        tfImportePlanes.setValue(importesPlanes[0]);
        tfcantidadfinalPlanes.setValue(importesPlanes[0]);
    }
}


//aprobar-desaprobar planes
function aprobarDesaprobarPlanes(multi) {
    if (multi) {
        aprob = 0;
        desap = 0;
        for (i = 0; i < smGpGestModeloPlanes.getSelections().length; i++) {
            if (smGpGestModeloPlanes.getSelections()[i].data.idaprobaciondemanda <= '2') {
                desap++;
            } else
                aprob++;
        }
        if (desap > 0 && aprob > 0) {
            Ext.getCmp('btnAprobPlanes').enable();
            Ext.getCmp('btnDesPlanes').enable();
        } else {
            if (desap > 0) {
                Ext.getCmp('btnAprobPlanes').enable();
                Ext.getCmp('btnDesPlanes').disable();
            } else {
                Ext.getCmp('btnAprobPlanes').disable();
                Ext.getCmp('btnDesPlanes').enable();
            }
        }
    } else {

        if (Ext.getCmp('chglobalPlanes').getValue() != true) {
            var rectora = false;
            if (objciPlanes.acciones)
                rectora = objciPlanes.acciones.rector;
            if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '1') {
                if (parseFloat(smGpGestModeloPlanes.getSelected().get('cantidad')) > 0) {
                    Ext.getCmp('btnAprobPlanes').enable();
                } else {
                    Ext.getCmp('btnAprobPlanes').disable();
                }
                Ext.getCmp('btnDesPlanes').disable();
            } else {
                if (/*smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '2' || */smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '3') {
                    if (rectora) {
                        if (parseFloat(smGpGestModeloPlanes.getSelected().get('cantidad')) > 0) {
                            Ext.getCmp('btnAprobPlanes').enable();
                        } else {
                            Ext.getCmp('btnAprobPlanes').disable();
                        }
                        Ext.getCmp('btnDesPlanes').enable();
                    } else {
                        Ext.getCmp('btnAprobPlanes').disable();
                        Ext.getCmp('btnDesPlanes').enable();
                    }
                } else {
                    if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '4') {
                        if (rectoraPlanes) {
                            Ext.getCmp('btnAprobPlanes').disable();
                            Ext.getCmp('btnDesPlanes').enable();
                        } else {
                            Ext.getCmp('btnAprobPlanes').disable();
                            Ext.getCmp('btnDesPlanes').disable();
                        }
                    } else {
                        if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '5') {
                            Ext.getCmp('btnAprobPlanes').disable();
                            Ext.getCmp('btnDesPlanes').disable();
                        }
                    }
                }

            }
        }
    }

}

//controlar acciones
function habilitarDesabilitarPlanes(bandera) {
    if (bandera) {
        if (smGpGestModeloPlanes.getSelections().length == 1) {
            aprobarDesaprobarPlanes(false);
        } else {
            aprobarDesaprobarPlanes(true);
        }
    } else {
        Ext.getCmp('btnAprobPlanes').disable();
        Ext.getCmp('btnDesPlanes').disable();
    }
}

function habilitarDesabilitarAprobacionAjustePlanes(bandera) {

    if (!objciPlanes.acciones.rector) {
        Ext.getCmp('menuAprobAjustePlanes').hide();
    } else {
        if (bandera) {
            if (smGpGestModeloPlanes.getSelections().length == 1) {

                if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '5' && smGpGestModeloPlanes.getSelected().data.ajuste != '0.0000') {
                    Ext.getCmp('btnAprobAjustePlanes').disable();
                    if (Ext.getCmp('chglobalPlanes').getValue() == false && identidadEsODPlanes == 1)
                        Ext.getCmp('btnDesAjustePlanes').enable();
                } else if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '4' && smGpGestModeloPlanes.getSelected().data.ajuste != '0.0000') {
                    if (Ext.getCmp('chglobalPlanes').getValue() == false && identidadEsODPlanes == 1)
                        Ext.getCmp('btnAprobAjustePlanes').enable();
                    Ext.getCmp('btnDesAjustePlanes').disable();
                }

            } else {
                if (Ext.getCmp('chglobalPlanes').getValue() == false && identidadEsODPlanes == 1) {
                    Ext.getCmp('btnAprobAjustePlanes').enable();
                    Ext.getCmp('btnDesAjustePlanes').enable();
                } else {
                    Ext.getCmp('btnAprobAjustePlanes').disable();
                    Ext.getCmp('btnDesAjustePlanes').disable();
                }
            }
        } else {
            Ext.getCmp('btnAprobAjustePlanes').disable();
            Ext.getCmp('btnDesAjustePlanes').disable();
        }
    }
}

function ValidateMenu() {
    if (smGpGestModeloPlanes.getSelections().length == 1) {
        Ext.getCmp('mdAddcoment').setVisible(true);
        /*if (smGpGestModeloPlanes.getSelected().data.comentario) {
         Ext.getCmp('vercomentario').setVisible(true);
         } else {
         Ext.getCmp('vercomentario').setVisible(false);
         }*/
    } else {
        //Ext.getCmp('vercomentario').setVisible(false);
        Ext.getCmp('mdAddcoment').setVisible(false);
    }
}

function upMenuDerTreePlanes(n) {
    if ((idtipodocPlanes == 0) && (objciPlanes.acciones.rector)) {
        if (n.attributes.hijos > 1) {
            if (n.attributes.hijos == 2) {
                if (puedeadicionarPlanes == 1) {
                    Ext.getCmp('addmodeloPlanes').show();
                    if (gestionSegunEstEjercicioPlan) {
                        Ext.getCmp('addmodeloPlanes').enable();
                    } else {
                        Ext.getCmp('addmodeloPlanes').disable();
                    }
                }
            } else {
                Ext.getCmp('addmodeloPlanes').hide();
            }
        } else {
            if (n.attributes.hijos == 0) {
                if (puedeadicionarPlanes == 1) {
                    Ext.getCmp('addmodeloPlanes').show();
                    if (gestionSegunEstEjercicioPlan) {
                        Ext.getCmp('addmodeloPlanes').enable();
                    } else {
                        Ext.getCmp('addmodeloPlanes').disable();
                    }
                }
            } else {
                Ext.getCmp('addmodeloPlanes').hide();
            }

        }
        if (puedeadicionarPlanes == 1) {
            Ext.getCmp('addplanPlanes').show();
            if (gestionSegunEstEjercicioPlan) {
                Ext.getCmp('addplanPlanes').enable();
            } else {
                Ext.getCmp('addplanPlanes').disable();
            }
        }
        Ext.getCmp('verplanPlanes').hide();
        Ext.getCmp('modplanPlanes').hide();
        Ext.getCmp('delplanPlanes').hide();
        Ext.getCmp('modmodeloPlanes').hide();
        Ext.getCmp('delmodeloPlanes').hide();
        Ext.getCmp('menuAsociarPlanes').hide();
        Ext.getCmp('menuDesasociarPlanes').hide();
        Ext.getCmp('ajustarPlanes').hide();
        Ext.getCmp('verpresupuestoPlanes').hide();
    } else {
        Ext.getCmp('verplanPlanes').hide();
        Ext.getCmp('addplanPlanes').hide();
        Ext.getCmp('addmodeloPlanes').hide();
        Ext.getCmp('modplanPlanes').hide();
        Ext.getCmp('delplanPlanes').hide();
        Ext.getCmp('modmodeloPlanes').hide();
        Ext.getCmp('delmodeloPlanes').hide();
        Ext.getCmp('ajustarPlanes').hide();
        Ext.getCmp('menuDesasociarPlanes').hide();
        Ext.getCmp('menuAsociarPlanes').hide();
    }
    if (idtipodocPlanes == 1) {
        if ((objciPlanes.acciones.rector)) {
            if (puedeadicionarPlanes == 1) {
                Ext.getCmp('addmodeloPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('addmodeloPlanes').enable();
                } else {
                    Ext.getCmp('addmodeloPlanes').disable();
                }
            }
            if (puedemodificarPlanes == 1) {
                Ext.getCmp('modplanPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('modplanPlanes').enable();
                } else {
                    Ext.getCmp('modplanPlanes').disable();
                }
            }
            if (puedeeliminarPlanes == 1) {
                Ext.getCmp('delplanPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('delplanPlanes').enable();
                } else {
                    Ext.getCmp('delplanPlanes').disable();
                }
            }
            if (n.attributes.hijos > 1) {
                if (n.attributes.hijos == 2) {
                    if (puedeadicionarPlanes == 1) {
                        Ext.getCmp('addmodeloPlanes').show();
                        if (gestionSegunEstEjercicioPlan) {
                            Ext.getCmp('addmodeloPlanes').enable();
                        } else {
                            Ext.getCmp('addmodeloPlanes').disable();
                        }
                    }

                } else
                    Ext.getCmp('addmodeloPlanes').hide();
            }

            Ext.getCmp('verpresupuestoPlanes').hide();
        } else {
            Ext.getCmp('modplanPlanes').hide();
            Ext.getCmp('delplanPlanes').hide();
            Ext.getCmp('addmodeloPlanes').hide();
            Ext.getCmp('ajustarPlanes').show();
            if (gestionSegunEstEjercicioPlan) {
                Ext.getCmp('ajustarPlanes').enable();
            } else {
                Ext.getCmp('ajustarPlanes').disable();
            }

        }
        Ext.getCmp('verplanPlanes').hide();
        Ext.getCmp('modmodeloPlanes').hide();
        Ext.getCmp('delmodeloPlanes').hide();
        Ext.getCmp('menuAsociarPlanes').hide();
        Ext.getCmp('ajustarPlanes').hide();
        Ext.getCmp('menuDesasociarPlanes').hide();
        Ext.getCmp('verpresupuestoPlanes').hide();
    } else if (idtipodocPlanes == 2) {

        Ext.getCmp('verpresupuestoPlanes').show();
        if (objciPlanes.acciones.rector) {
            Ext.getCmp('menuAsociarPlanes').show();
            Ext.getCmp('menuDesasociarPlanes').show();
            if (gestionSegunEstEjercicioPlan) {
                Ext.getCmp('menuAsociarPlanes').enable();
                Ext.getCmp('menuDesasociarPlanes').enable();
            } else {
                Ext.getCmp('menuAsociarPlanes').disable();
                Ext.getCmp('menuDesasociarPlanes').disable();
            }
            Ext.getCmp('ajustarPlanes').hide();
            if (puedeeliminarPlanes == 1) {
                Ext.getCmp('delmodeloPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('delmodeloPlanes').enable();
                } else {
                    Ext.getCmp('delmodeloPlanes').disable();
                }
            }
            if (puedemodificarPlanes == 1) {
                Ext.getCmp('modmodeloPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('modmodeloPlanes').enable();
                } else {
                    Ext.getCmp('modmodeloPlanes').disable();
                }
            }

        } else {
            Ext.getCmp('modmodeloPlanes').hide();
            Ext.getCmp('delmodeloPlanes').hide();
        }
        if (Ext.getCmp('chglobalPlanes').getValue() == false && identidadEsODPlanes == 1) {
            if (!objciPlanes.acciones.rector) {
                Ext.getCmp('ajustarPlanes').show();
                if (gestionSegunEstEjercicioPlan) {
                    Ext.getCmp('ajustarPlanes').enable();
                } else {
                    Ext.getCmp('ajustarPlanes').disable();
                }

            }

        } else {
            Ext.getCmp('ajustarPlanes').hide();

        }
        Ext.getCmp('verplanPlanes').show();
        Ext.getCmp('addmodeloPlanes').hide();
        Ext.getCmp('modplanPlanes').hide();
        Ext.getCmp('delplanPlanes').hide();
    }
}

//auxiliares
function siexisteindFiltradoAsociarPlanes() {
    if (filtrosAsociarPlanes.getFiltrosActivos().length > 0 && stGpAsociarPlanes.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function siexisteIndEnModeloFiltradoPlanes() {
    if (typeof (filtrosindicadoresPlanes) != 'undefined' && typeof (stGpAddNormaPlanes) != 'undefined') {
        if ((filtrosindicadoresPlanes.getFiltrosActivos().length > 0) && (stGpAddNormaPlanes.getCount() == 0))
            mostrarMensaje(1, perfil.etiquetas.msgBuscar);
    }

    if (typeof (filtrosgpModeloPlanes) != 'undefined' && typeof (stGpAddNormaPlanes) != 'undefined') {
        if ((filtrosgpModeloPlanes.getFiltrosActivos().length > 0) && (stGpAddNormaPlanes.getCount() == 0))
            mostrarMensaje(1, perfil.etiquetas.msgBuscar);
    }
}

function siexisteindFiltradoDesAsociarPlanes() {
    if (filtrosDesAsociarPlanes.getFiltrosActivos().length > 0 && stGpDesAsociarPlanes.getCount() == 0) {
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
    }

}

function mascaraPlanes(mensaje, accionMask) {
    if (accionMask == 1) {
        varMascaraPlanes = Ext.MessageBox.show({
            title: 'Por favor espere...',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6',
            msg: mensaje
        });
    } else {
        varMascaraPlanes.hide();
    }

}

function funcionAceptarPlanes() {
    stGpGestModeloPlanes.reload();
}

function ValidarOperacionPlanes(campo, valor, sm) {

    if (campo == 'ajuste' && valor < 0 && (-1 * valor) > sm.record.data.cantidad) {

        Ext.MessageBox.show({
            title: 'Información',
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgAjusteIncorrecto,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }

}

function siexistecolumFiltradaPlanes() {
    if (/*filtrosGpdemandacentrobalancePlanes.getFiltrosActivos().length > 0 && */ stGpdemandacentrobalancePlanes.getCount() == 0) {
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
    } else if (stGpdemandacentrobalancePlanes.getCount() == 0) {
        mostrarMensaje(1, 'No existen datos que mostrar.');
    }

}

function ColumnaAsociadonaerfPlanes(val) {
    if (!val)
        return 'No';
    else
        return 'Si';
}

function cambiarTituloFiltrarAsociadoaPresupuestoPlanes() {
    var filtrado_por = "";
    var sep = "/";
    if (typeof (filtrospresupuestoPlanes) != 'undefined') {
        if (filtrospresupuestoPlanes.getFiltrosActivos() == undefined || filtrospresupuestoPlanes.getFiltrosActivos().length == 0) {
            pAsociadoaPresupuestoPlanes.setTitle(perfil.etiquetas.titAsocPresupuesto);
        } else {
            for (i = 0; i < filtrospresupuestoPlanes.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = perfil.etiquetas.lbDenominacion;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "codigo") {
                    aux = perfil.etiquetas.lbCodigo;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "precio") {
                    aux = perfil.etiquetas.lbPrecio;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "umedida") {
                    aux = perfil.etiquetas.lbUnidadMedida;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "numeropieza")
                    aux = perfil.etiquetas.lbNumPieza;
                else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "cantidad") {
                    aux = perfil.etiquetas.lbNecesidad;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                    aux = perfil.etiquetas.lbCentroBalance;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "importe") {
                    aux = perfil.etiquetas.lbImporte;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "idplanificacionnae") {
                    aux = perfil.etiquetas.lbAsociado;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "idobjetogasto") {
                    aux = perfil.etiquetas.lbNaeog;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "idingreso") {
                    aux = perfil.etiquetas.lbNaerf;
                } else if (filtrospresupuestoPlanes.getFiltrosActivos()[i].dataIndex == "datos") {
                    aux = perfil.etiquetas.lbDatos;
                }
                if (i == filtrospresupuestoPlanes.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            pAsociadoaPresupuestoPlanes.setTitle(perfil.etiquetas.titAsocPresupuesto + perfil.etiquetas.lbFiltradoPor + filtrado_por);
            filtrado_por = "";
        }
    }


}

function siexisteIndAsociadoFiltradoPlanes() {
    if (typeof (filtrospresupuestoPlanes) != 'undefined') {
        if ((filtrospresupuestoPlanes.getFiltrosActivos().length > 0) && (storeAsociadoaPresupuestoReconfigPlanes.getCount() == 0))
            mostrarMensaje(1, perfil.etiquetas.msgBuscar);
    }

}

function getCheck_RFPlanes(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow(this.id)' type='checkbox' id='" + "checkgridrfrf_" + record.id + "'>";
    return check;
}

function getCheck_Planes(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaeog_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaeog_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}

function getCheck_OGPlanes(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow_(this.id)' type='checkbox' id='" + "checkgridogog_" + record.id + "'>";
    return check;
}

function getCheckPlanes(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaerf_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaerf_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}

function deshabilitarSegunEstadoDelEjercicioPLan(accion) {
    if (accion) {
        Ext.getCmp('addplanPlanes').enable();
        Ext.getCmp('addmodeloPlanes').enable();
        Ext.getCmp('menuAprobIndPlanes').enable();
        Ext.getCmp('menuAprobAjustePlanes').enable();
        if (Ext.getCmp('mdGridAsociar') != undefined) {
            Ext.getCmp('mdGridAsociar').enable();
        }
        gestionSegunEstEjercicioPlan = true;
    } else {
        Ext.getCmp('addplanPlanes').disable();
        Ext.getCmp('addmodeloPlanes').disable();
        Ext.getCmp('menuAprobIndPlanes').disable();
        Ext.getCmp('menuAprobAjustePlanes').disable();
        if (Ext.getCmp('mdGridAsociar') != undefined) {
            Ext.getCmp('mdGridAsociar').disable();
        }
        gestionSegunEstEjercicioPlan = false;
    }
}

function CargarImporteinicialAjuste() {

    mymask.show();
    arrayidplanificacion = [];

    if (smGpGestModeloPlanes.getSelections().length > 0) {
        for (i = 0; i < smGpGestModeloPlanes.getSelections().length; i++) {
            if (smGpGestModeloPlanes.getSelections()[i].data.idaprobaciondemanda == '4') {
                arrayidplanificacion.push(smGpGestModeloPlanes.getSelections()[i].data.idplanificacion);
            }
        }
    }

    Ext.Ajax.request({
        url: 'cargarImporteInicial',
        params: {
            arrayidplanificacion: Ext.encode(arrayidplanificacion),
            identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
            idejercicio: cbEjercicioPlanes.getValue()
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData == 23) {
                mostrarMensaje(1, perfil.etiquetas.lbNoajuste);
            } else {
                importeInPlanes = responseData.importe;
                Ext.getCmp('importInicialPlanes').setValue(responseData.importeformato);
                winRealizarAjustePlanes.show();
                Ext.getCmp('btnCalcularPlanes').disable();
                Ext.getCmp('idajustarPlanes').disable();
            }
        }
    });
}

function insertarAjustePlanes() {

    if (Ext.getCmp('porcientoPlanes').getValue() || Ext.getCmp('porcientoPlanes').getValue() == 0) {
        arrayidplanificacion = [];

        if (smGpGestModeloPlanes.getSelections().length > 0) {
            for (i = 0; i < smGpGestModeloPlanes.getSelections().length; i++) {
                if (smGpGestModeloPlanes.getSelections()[i].data.idaprobaciondemanda == '4') {
                    arrayidplanificacion.push(smGpGestModeloPlanes.getSelections()[i].data.idplanificacion);
                }
            }
        }

        Ext.Ajax.request({
            url: 'insertarAjuste',
            params: {
                arrayidplanificacion: Ext.encode(arrayidplanificacion),
                identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                idejercicio: cbEjercicioPlanes.getValue(),
                porciento: Ext.getCmp('porcientoPlanes').getValue()

            }
            ,
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (response.responseText == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgAjustadoSatisf);
                    stGpGestModeloPlanes.reload();
                } else
                    mostrarMensaje(1, perfil.etiquetas.msgAjustadoInsatisf);
            }

        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorPorciento);
    }

}

function LimpiarValoresPlanes() {
    Ext.getCmp('porcientoPlanes').reset();
    Ext.getCmp('importInicialPlanes').setValue('');
    Ext.getCmp('importFinalPlanes').setValue('');
    Ext.getCmp('importAjustadoPlanes').setValue('');
}

function CalcularAjustePlanes() {

    if (Ext.getCmp('porcientoPlanes').getValue() || Ext.getCmp('porcientoPlanes').getValue() == 0) {
        arrayidplanificacion = [];

        if (smGpGestModeloPlanes.getSelections().length > 0) {
            for (i = 0; i < smGpGestModeloPlanes.getSelections().length; i++) {
                if (smGpGestModeloPlanes.getSelections()[i].data.idaprobaciondemanda == '4') {
                    arrayidplanificacion.push(smGpGestModeloPlanes.getSelections()[i].data.idplanificacion);
                }
            }
        }
        Ext.Ajax.request({
            url: 'calcularAjuste',
            params: {
                arrayidplanificacion: Ext.encode(arrayidplanificacion),
                identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                idejercicio: cbEjercicioPlanes.getValue(),
                porciento: Ext.getCmp('porcientoPlanes').getValue()

            }
            ,
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (response.responseText != 23) {
                    Ext.getCmp('importAjustadoPlanes').setValue(responseData.importeformato);
                    importAjuPlanes = responseData.importe;
                    importeFiPlanes = parseFloat(importeInPlanes) + parseFloat(importAjuPlanes);
                    Ext.getCmp('importFinalPlanes').setValue(parseFloat(importeFiPlanes).toFixed(3));
                }

            }

        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorPorciento);
    }


}

function CmpBotonesComplementarios(opcionesConfig) {
    var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
    //objeto del componente "barra de progreso"
    BarraProgreso = new BarraEstado();

    //elemento sobre el cual se trabaja
    elemento = opcionesConfig.elemento;

    //store del combo que muestra las acciones sobre el DHW
    stacciones = new Ext.data.SimpleStore({
        id: 'stcbActivo',
        fields: ['idaccion', 'nombreaccion', 'icono'],
        data: [
            [1, 'Cierre', 'lote.png'],
            [2, 'Actualizar', 'lote.png']
        ]
    });

    //combo que muestra las acciones sobre el DWH
    cbacciones = new Ext.form.ComboBox({
        //id : 'cbActivo',
        //name: 'cbActivo',
        store: stacciones,
        displayField: 'nombreaccion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        editable: true,
        hidden: true,
        hiddenName: 'idaccion',
        valueField: 'idaccion',
        width: 200,
        emptyText: 'Acciones para el Almacen de Datos',
        listeners: {
            select: function (cmb) {
                EjecutarAccionSobreDWH();
            }
        }
    });

    return cbacciones;
}

//funcion que ejecuta la accion sobre el DWH
EjecutarAccionSobreDWH = function () {
    var _this = this;
    var mensajemascara = 'Efectuando cierre';
    var mensajeconfirmacion = 'El cierre se est&aacute; efectuando correctamente.';
    var mensajeerror = 'No se ha podido efectuar el cierre correctamente.';
    if (_this.cbacciones.getValue() == 2)
    {
        mensajemascara = 'Efectuando actualizaci&oacute;n';
        mensajeconfirmacion = 'La actualizaci&oacute;n se est&aacute; efectuando correctamente.';
        mensajeerror = 'No se ha podido efectuar la actualizaci&oacute;n correctamente.';
    }
    _this.BarraProgreso.show(mensajemascara);
    Ext.Ajax.request({
        url: '/planificacion/planmeta/index.php/cmpcomplementario/efectuaracciondwh',
        timeout: 640000,
        params: {
            elemento: _this.elemento,
            accion: _this.cbacciones.getRawValue()
        },
        callback: function (options, success, response)
        {
            _this.BarraProgreso.hide();
            responseData = Ext.decode(response.responseText);
            mensaje = mensajeconfirmacion;
            if (responseData.mensaje != 1)
            {
                mensaje = mensajeerror;
            }
            mostrarMensaje(1, mensaje);
        }
    });
}



