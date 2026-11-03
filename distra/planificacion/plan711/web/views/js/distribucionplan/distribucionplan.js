var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('distribucionplan', cargarAccionesDist);
var objciPlanes = {};
objciPlanes.acciones = [];

var col = [];
var readerDina = [];
var readerDina2 = [];
var readerDina3 = [];
var col2 = [];
var col3 = [];
var cmCodigoVent, jrStCodCCV;
var fila = [];

/*Estos son los objetos del Grid de los indicadores */
var smGpGestModeloPlanes, stGpGestModeloPlanes, gpModeloPlanes, pgGestModeloPlanes, nro_filaSeleccionada,
        treePlanSelect, cbEjercicioPlanes, offsetGpGestModeloPlanes = 0;
var identidadselectedPlanes = 0;
//Importar
var winImpPlanes = null, offsetdin = 0, fpbuscarPlanes;
var estadoTreePlanes = true, estadoGridInd = true, estadoPanelInd = true;
//Ajustar
var importInicialPlanes, importFinalPlanes;
var importeInPlanes = 0, importAjuPlanes = 0, importeFiPlanes = 0;

//Hacia arriba revisar las variables que no se estan utilizando y borrarlas
//variables auxialiares mias
var plan, empimp, cc, ff, monto = 0, idejer, rolepersona, band, textomotivo, usuarios = [], recursos;



function cargarAccionesDist() {

    var temp = window.location.pathname;
    var url = temp.substr(1);
    //UCID.portal.cargarAccionesXUri(url);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'gpMontoTotalDist') {
                recursos = 1;
                break;
            }
        }
        cargarInterfazSolicitud();
    });

}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
    vermodificaciones();
//mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto

    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    btnAyudaDistribucion = new Ext.Button({
        id: 'btnAyudaDistribucion',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });

    btnGuardarDist = new Ext.Button({
        handler: function () {
            if (band == 1) {
                MotivoModif();
            } else {
                GuardarDistribucion();
            }
        },
        tooltip: 'Guardar distribución',
        disabled: true,
        id: 'btnGuardarDist',
        iconCls: 'guardar',
        //hidden: true
    });

    btnVerModificaciones = new Ext.Toolbar.Button({
        iconCls: 'ver',
        tabIndex: 11,
        tooltip: 'Ver modificaciones',
        id: 'btnVerModificaciones',
        disabled: false,
        handler: function () {
            winModificaciones();
        }
    });

    btnGuardarCodCC = new Ext.Button({
        handler: function () {
            GuardarCreditoFinanciero(2);
        },
        tooltip: 'Guardar crédito financiero',
        disabled: true,
        id: 'btnGuardarCodCC',
        iconCls: 'guardar'
    });

    btnAdicionarCredito = new Ext.Button({
        handler: function () {
            AdicionarCredito();
        },
        tooltip: 'Adicionar credito financiero',
        disabled: false,
        id: 'btnAdicionarCredito',
        iconCls: 'adicionar'
    });

    cbEmpresasImp = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                pEstructuras.enable();
                pMontoTotalDist.enable();
                stMontoTotalDist.reload();
                if (identidadselectedPlanes != 0 && identidadselectedPlanes != null && identidadselectedPlanes != 'undefined') {
                    pSolicitudes.enable();
                    stFFyCC.reload();
                    stCodigodeCC.reload();
                }

            }
        }
    });

    montototal = new Ext.form.Label({
        id: 'idmontototal',
        text: '0.00'
    });
    montototalreal = new Ext.form.Label({
        id: 'idmontototalreal',
        text: '0.00'
    });

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function (t) {
                //cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idplan711);
                //idejer = t.reader.jsonData.idejercicioactual.idejercicio;
            }
        }
    });

    //**************grid panel distribucion****************************

    function CargarTodosPanel() {
        col = [];
        col2 = [];
        col3 = [];
        readerDina = [];
        readerDina2 = [];
        col.push({
            header: 'Fuentes de financiamiento',
            tooltip: 'Fuentes de financiamiento',
            dataIndex: 'denominacionff',
            id: 'expandir',
            width: 100,
            align: 'left'
        });
        col3.push({
            header: 'Fuentes de financiamiento',
            tooltip: 'Fuentes de financiamiento',
            dataIndex: 'denominacionff',
            id: 'expandir',
            width: 100,
            align: 'left'
        });
        col2.push({
            header: '',
            tooltip: '',
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            align: 'left'
        });

        readerDina.push({
            name: 'asociado'
        });
        readerDina.push({
            name: 'iddatosff'
        });
        readerDina.push({
            name: 'denominacionff'
        });

        readerDina2.push({
            name: 'denominacion'
        });

        Ext.Ajax.timeout = 600000; //10min
        //mymask.show();
        Ext.Ajax.request({
            url: 'listarCC',
            callback: function (options, success, response) {
                //mymask.hide();
                var responseData = Ext.decode(response.responseText);
                if (responseData.data) {
                    var cant = responseData.data.length;
                    arreglocol = responseData.data;
                    for (var i = 0; i < cant; i++) {
                        if (arreglocol[i].denominacion != '-') {
                            readerDina.push({
                                name: arreglocol[i].iddatosnomenclador
                            });
                            readerDina.push({
                                name: arreglocol[i].uridatosnomenclador
                            });
                            readerDina2.push({
                                name: arreglocol[i].iddatosnomenclador
                            });
                            readerDina3.push({
                                name: arreglocol[i].iddatosnomenclador
                            });
                            col.push({
                                header: arreglocol[i].denominacion,
                                tooltip: arreglocol[i].denominacion,
                                dataIndex: arreglocol[i].iddatosnomenclador,
                                width: 100,
                                align: 'rigth',
                                renderer: RenderaddCommas,
                                editor: new Ext.form.TextField({
                                    allowNegative: true,
                                    regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                                    allowBlank: false,
                                    maxLength: 30,
                                    listeners: {
                                        change: function (me, nv, ov) {
                                            me.setValue(addCommas(nv));
                                        }
                                    }
                                })
                            });
                            col2.push({
                                header: arreglocol[i].denominacion,
                                tooltip: arreglocol[i].denominacion,
                                dataIndex: arreglocol[i].iddatosnomenclador,
                                width: 130,
                                align: 'rigth',
                                renderer: crearToolTip,
                                editor: new Ext.form.TextField({
                                    allowBlank: false
                                })
                            });
                            col3.push({
                                header: arreglocol[i].denominacion,
                                tooltip: arreglocol[i].denominacion,
                                dataIndex: arreglocol[i].iddatosnomenclador,
                                width: 150,
                                align: 'rigth',
                                renderer: RenderaddCommas
                            });
                            col3.push({
                                header: arreglocol[i].denominacion + ' real',
                                tooltip: arreglocol[i].denominacion + ' real',
                                dataIndex: arreglocol[i].uridatosnomenclador,
                                width: 150,
                                align: 'rigth',
                                renderer: RenderaddCommas
                            });
                        }
                    }

                    cmFFyCC = new Ext.grid.ColumnModel(col);

                    cmFFyCCD = new Ext.grid.ColumnModel(col3);
                    console.log(cmFFyCCD);
                    cmCodigoDeCC = new Ext.grid.ColumnModel(col2);

                    var jrStProdMT = new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        montototaldisponible: 'montototaldisponible',
                        montodisponiblereal: 'montodisponiblereal',
                        id: 'jrStProd',
                        fields: readerDina
                    });

                    var jrStProd = new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'jrStProd',
                        fields: readerDina
                    });

                    var jrStCodCC = new Ext.data.JsonReader({
                        root: 'data',
                        id: 'jrStProd',
                        fields: readerDina2
                    });

                    jrStCodCCV = new Ext.data.SimpleStore({
                        fields: readerDina3
                    });

                    cbEjercicioPlanes = new Ext.form.ComboBox({
                        id: 'cbEjercicio',
                        width: 150,
                        disabled: false,
                        store: stCbejercicioPlanes,
                        displayField: 'ejercicio',
                        valueField: 'idplan711',
                        typeAhead: false,
                        mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true,
                        anchor: '95%',
                        loadingText: 'Cargando...',
                        allowBlank: false,
                        listeners: {
                            select: function (cb, rec, num) {
                                cbEmpresasImp.enable();
                                idejer = rec.data.idplan711;
                                if (cbEmpresasImp.getValue() != '') {
                                    stMontoTotalDist.reload();
                                    if (identidadselectedPlanes != 0 && identidadselectedPlanes != null && identidadselectedPlanes != 'undefined') {
                                        stFFyCC.reload();
                                        stCodigodeCC.reload();
                                    }
                                }
                            }
                        }
                    });

                    stCbejercicioPlanes.reload();

                    //store del grid de FFyCC a distribuir 
                    stFFyCC = new Ext.data.Store({
                        url: 'listarDistribucion',
                        reader: jrStProd,
                        listeners: {
                            beforeload: function (store, record, options) {
                                Ext.Ajax.timeout = 6400000;
                                stFFyCC.baseParams.start = 0;
                                stFFyCC.baseParams.identidad = identidadselectedPlanes;
                                stFFyCC.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                                stFFyCC.baseParams.idempimp = cbEmpresasImp.getValue();
                            },
                            load: function (t) {
                                band = t.reader.jsonData.band;
                            }
                        }
                    });

                    stCodigodeCC = new Ext.data.Store({
                        url: 'listarCodigo',
                        reader: jrStCodCC,
                        listeners: {
                            beforeload: function (store, record, options) {
                                Ext.Ajax.timeout = 6400000;
                                stCodigodeCC.baseParams.identidad = identidadselectedPlanes;
                                stCodigodeCC.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                                stCodigodeCC.baseParams.idempimp = cbEmpresasImp.getValue();
                            }
                        }
                    });

                    //store del grid de monto total para ver la distribucion 
                    stMontoTotalDist = new Ext.data.Store({
                        //autoLoad: true,
                        url: 'listarMontoDisponible',
                        reader: jrStProdMT,
                        listeners: {
                            beforeload: function (store, record, options) {
                                Ext.Ajax.timeout = 6400000;
                                stMontoTotalDist.baseParams.start = 0;
                                //stMontoTotalDist.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                                stMontoTotalDist.baseParams.idejercicio = idejer;
                                stMontoTotalDist.baseParams.idempimp = cbEmpresasImp.getValue();
                            },
                            load: function (st, record, obj) {
                                montototal.setText(addCommas(st.reader.jsonData.montototaldisponible));
                                montototalreal.setText(addCommas(st.reader.jsonData.montodisponiblereal));
                            }
                        }
                    });

                    smFFyCC = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    });
                    smFFyCCD = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    });
                    smCodCC = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    });

                    gpFFyCC = new Ext.grid.EditorGridPanel({
                        frame: true,
                        stripeRows: true,
                        store: stFFyCC,
                        sm: smFFyCC,
                        autoExpandColumn: 'expandir',
                        cm: cmFFyCC,
                        disabled: false,
                        loadMask: {
                            msg: 'Cargando...'
                        },
                        listeners: {
                            celldblclick: function (me, row_id, col_id) {
                                gpFFyCC.getColumnModel().setEditable(col_id, true);
                                btnGuardarDist.enable();

                            },
                            afteredit: function (e) {
                                btnGuardarDist.enable();
                            }
                        }
                    });

                    gpCodigoDeCC = new Ext.grid.EditorGridPanel({
                        frame: true,
                        stripeRows: true,
                        store: stCodigodeCC,
                        sm: smCodCC,
                        autoExpandColumn: 'expandir',
                        cm: cmCodigoDeCC,
                        disabled: false,
                        loadMask: {
                            msg: 'Cargando...'
                        },
                        listeners: {
                            celldblclick: function (me, row_id, col_id) {
                                gpCodigoDeCC.getColumnModel().setEditable(col_id, true);
                                btnGuardarCodCC.enable();
                            },
                            afteredit: function (e) {
                                btnGuardarCodCC.enable();
                            }
                        }
                    });

                    gpMontoTotalDist = new Ext.grid.GridPanel({
                        frame: true,
                        stripeRows: true,
                        store: stMontoTotalDist,
                        sm: smFFyCCD,
                        enable: true,
                        autoExpandColumn: 'expandir',
                        cm: cmFFyCCD,
                        //hidden: true,
                        //id: 'gpMontoTotalDist',
                        //disabled: true,
                        loadMask: {
                            msg: 'Cargando...'
                        },
                        listeners: {}
                    });

                    //panel para mostrar la distribucion que se realiza
                    pPlanificacion = new Ext.Panel({
                        layout: 'fit',
                        region: 'center',
                        frame: true,
                        tbar: [btnGuardarDist, '-', btnVerModificaciones],
                        title: 'Distribución a realizar para una empresa: ',
                        //margins: '3 3 3 3',
                        //width: 500,
                        height: 300,
                        items: gpFFyCC
                    });

                    //panel para mostrar los codigos asignados a los CC
                    pCodigoDeCC = new Ext.Panel({
                        layout: 'fit',
                        region: 'south',
                        frame: true,
                        tbar: [btnGuardarCodCC, btnAdicionarCredito],
                        title: 'Crédito financiero asignado',
                        //margins: '3 3 3 3',
                        //width: 500,
                        height: 250,
                        items: gpCodigoDeCC
                    });


                    pSolicitudes = new Ext.Panel({
                        id: 'pSolicitudes',
                        title: perfil.etiquetas.titModelos,
                        split: true,
                        disabled: true,
                        region: 'center',
                        layout: 'border',
                        items: [pPlanificacion, pCodigoDeCC]
                    });

                    pMontoTotalDist = new Ext.Panel({
                        layout: 'fit',
                        region: 'east',
                        //hidden: true,
                        id: 'pMontoTotalDist',
                        frame: true,
                        disabled: true,
                        title: 'Disponibilidad de lo planificado',
                        //margins: '3 3 3 3',
                        width: '45%',
                        //width: 500,
                        //height: 300,
                        tbar: ['->', 'Monto total disponible: ', montototal, '-', 'Monto total planificado: ', montototalreal],
                        items: gpMontoTotalDist
                    });
                    //****************panel de solicitudes*******************
                    pSolicitudesTodas = new Ext.Panel({
                        region: 'center',
                        layout: 'border',
                        items: [pSolicitudes]
                    });
                    //****************************entidades********************************
                    tpEstructuraPlanes = new Ext.estructura.panel.PanelEstructura({
                        cargos: false,
                        menu: false,
                        //limit: [3],
                        width: 500

                    });
                    tpEstructuraPlanes.btnBuscar.setText("");
                    tpEstructuraPlanes.btnLimpiar.setText("");
                    tpEstructuraPlanes = tpEstructuraPlanes.items.items[0];
                    tpEstructuraPlanes.getRootNode().expand();
                    tpEstructuraPlanes.addListener('click', function (n) {
                        if (n.text != 'Estructuras' && n.attributes.nivel != 0) {
                            if (n.attributes.idorgano == 10015) {
                                identidadselectedPlanes = 0;
                                pSolicitudes.disable();
                                stFFyCC.removeAll();
                                stCodigodeCC.removeAll();
                                mostrarMensaje(1, 'La entidad seleccionada no pertenece al plan Negocio');
                                claseMask();
                            } else {
                                tpEstructuraPlanes.getSelectionModel().select(n);
                                cbEjercicioPlanes.enable();
                                identidadselectedPlanes = n.id;
                                hojaPlanes = n.leaf;
                                denom_ent = n.text;
                                stFFyCC.reload();
                                stCodigodeCC.reload();
                                pSolicitudes.enable();
                                gpCodigoDeCC.enable();
                                stMontoTotalDist.reload();
                                cbEmpresasImp.enable();
                                cbEjercicioPlanes.enable();
                                pPlanificacion.setTitle('Distribución a realizar para: ' + denom_ent)
                            }
                        } else {
                            identidadselectedPlanes = 0;
                            pSolicitudes.disable();
                            stFFyCC.removeAll();
                            stCodigodeCC.removeAll();
                            claseMask();
                        }

                    });

                    pEstructuras = new Ext.Panel({
                        title: 'Entidades',
                        layout: 'fit',
                        region: 'west',
                        //width: 250,
                        width: '15%',
                        disabled: true,
                        collapsible: true,
                        split: true,
                        items: [tpEstructuraPlanes]
                    });
                    pEntPlan = new Ext.Panel({
                        layout: 'border',
                        region: 'west',
                        width: 500,
                        items: [pEstructuras]
                    });
                    //****************panel principal*******************
                    pGeneral=null;
                    if (recursos != 1) {
                        pGeneral = new Ext.Panel({
                            layout: 'border',
                            tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
                            items: [pEstructuras, pSolicitudes]
                        });
                        btnGuardarDist.hide();
                    }else{
                        pGeneral = new Ext.Panel({
                            layout: 'border',
                            tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
                            items: [pEstructuras, pSolicitudes, pMontoTotalDist]
                        });
                    }
//                    pGeneral = new Ext.Panel({
//                        layout: 'border',
//                        tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
//                        items: [pEstructuras, pSolicitudes, pMontoTotalDist]
//                    });
                    //******************viewport*****************
                    myViewPlanes = new Ext.Viewport({
                        layout: 'fit',
                        items: [pGeneral],
                        listeners: {
                            afterlayout: function (e) {
                                /*var claseMask = document.getElementsByClassName('ext-el-mask');
                                 var maskEstructura = claseMask.item(0);
                                 var maskDistribucion = claseMask.item(1);
                                 (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
                                 (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;*/
                                claseMask();
                            }
                        }
                    });
                    //*****************sm del grid de indicadores************* 
                    smGpGestModeloPlanes = new Ext.grid.RowSelectionModel({
                        singleSelect: false,
                        listeners: {
                            rowselect: function (x, num, rec) {

                            },
                            rowdeselect: function (s) {

                            }

                        }
                    });

//                        if(rolepersona != 300000000405) {
//                            btnGuardarDist.hide();
//                            btnGuardarCodCC.hide();
//                        }
                }

            }


        });

    }

    CargarTodosPanel();

    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }
}

function GuardarDistribucion() {
    var modif = gpFFyCC.getStore().data.items;
    var distribuc = [];
    for (var i = 0, max = modif.length; i < max; i++) {
        distribuc.push(modif[i].data);
    }

    Ext.Ajax.request({
        url: 'adicionarModificarDistr',
        params: {
            idejercicio: cbEjercicioPlanes.getValue(),
            distribuc: Ext.encode(distribuc),
            idempimp: cbEmpresasImp.getValue(),
            identidad: identidadselectedPlanes,
            textomotivo: textomotivo
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'La distribución se ha realizado satisfactoriamente');
                stFFyCC.reload();
                stMontoTotalDist.reload();
            } else {
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });
}

function GuardarCreditoFinanciero(accion) {
    var credito = [];
    var modificar = [];
    if (accion == 1) {//adicionarcredito
        credito.push([BienesCapital.getValue(), 5003]);
        credito.push([BienesIntermedios.getValue(), 5004]);
    }
    if (accion == 2) {//modificarcredito
        var modif1 = gpCodigoDeCC.getStore().getModifiedRecords();
        for (var i = 0, max = modif1.length; i < max; i++) {
            credito.push([modif1[i].data, modif1[i].modified]);
        }
    }

    Ext.Ajax.request({
        url: 'adicionarModificarCreditoFinanciero',
        params: {
            idejercicio: cbEjercicioPlanes.getValue(),
            credito: Ext.encode(credito),
            idempimp: cbEmpresasImp.getValue(),
            identidad: identidadselectedPlanes,
            accion: accion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            console.log(responseData.mensaje);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'El crédito financiero se ha guardado satisfactoriamente.');
                btnGuardarCodCC.disable();
                stCodigodeCC.reload();
                if (accion == 1) {
                    ventanaCrud.destroy();
                }
                mymask.hide();
            } else {
                mostrarMensaje(1, 'Ha ocurrido un error al guardar el crédito financiero.');
            }
        }
    });
}

function AdicionarCredito() {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrud.destroy();
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                mymask.show();
                GuardarCreditoFinanciero(1);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    BienesCapital = new Ext.form.TextField({
        fieldLabel: 'Bienes capital',
        allowBlank: false,
        width: 200,
        anchor: '80%'
    });

    BienesIntermedios = new Ext.form.TextField({
        fieldLabel: 'Bienes intermedios',
        allowBlank: false,
        width: 200,
        anchor: '80%',
        //value: codigoreup
    });
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        frame: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: BienesCapital
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: BienesIntermedios
                    }]

            }]
    });
    ventanaCrud = null;
    ventanaCrud = new Ext.Window({
        title: 'Adicionar códigos de créditos financiero',
        id: 'ventanaCrud',
        width: 400,
        constrain: true,
        layout: 'fit',
        height: 150,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAceptarAdd],
        items: [pfinal],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaCrud.show();
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
function RenderaddCommas(nStr, m) {
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
    m.attr = 'ext:qtip="' + x1 + x2 + '"';
    return x1 + x2;
}
