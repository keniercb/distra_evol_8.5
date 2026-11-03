var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('configurarplan', cargarInterfaz);
var btnAdicionar, btnModificar, btnEliminar, btnAyuda, btnAprobar, btnDesaprobar;
var stGpGestPlanes711, smGpGestPlanes711, gpGestPlanes711, vpPlanes711, stFF, stCC, montototalasig, chkCC, chkFF, ventanaCrud, idplan711modif;
var fpTipoModelo, fpTipoModeloMod, winMod, winAdd, winAddCampos, panelGeneral, mensaje;
var winGestEncabesado, adicionando, contaprobar = 0, conteliminar = 0, contdesaprobar = 0, offset = 0, accionventana, offsetmodif = 0;
var contadorNoEliminar = 0;
var accion_tipomod;
var field = 'codigo', direction = 'ASC', actual;
var controlaraccion = 0;
var eliminando = false;
var singleSmGpGestAtTM = null, idcomponente = 1, usuarios = [], accionboton, contarsalvas = 0, auxslva= [], empimp= null;
    var readerDina = [];
    var recorrido = null;
    var cmodel = [], rolepersona, contdeguardar =0;
    
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    rolepersona = perfil.idrol;
    
    btnAdicionar = new Ext.Button({
        handler: function () {
            accionventana = 1;
            winFp(accionventana);
        },
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        disabled: false,
        id: 'btnAdd',
        iconCls: 'adicionar'
    });
    btnModificar = new Ext.Button({
        handler: function () {
            accionventana = 2;
            winFp(accionventana);
        },
        tooltip: perfil.etiquetas.lbTtbtnMod,
        disabled: true,
        id: 'btnMod',
        iconCls: 'modificar'
    });
    btnEliminar = new Ext.Button({
        handler: function () {
            EliminarPlan();
        },
        tooltip: perfil.etiquetas.lbTtbtnDel,
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar'
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaPlanNegocio',
        iconCls: 'ayuda'
    });
    btnActualEjercicio = new Ext.Button({
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.lbMessageActual, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    cambiarActual();
                }
            })
        },
        disabled: true,
        iconCls: 'actual',
        tooltip: perfil.etiquetas.lbTtBtnActual
    });
    
    menuEstados = new Ext.Toolbar.MenuButton({
        id: 'menuEstados',
        tooltip: perfil.etiquetas.lbTtCambiarEstado,
        iconCls: 'cambiodestado',
        disabled: true,
        menu: {
            items: [{
                text: perfil.etiquetas.lbtnEstElabor,
                id: 'menuEstados1',
                handler: function () {
                        CambiarEstado('Elaboración');
                }
            },{
                text: perfil.etiquetas.lbtnEstEjec,
                id: 'menuEstados2',
                handler: function () {
                        CambiarEstado('Ejecución');
                }
            },{
                text: perfil.etiquetas.lbtnEstCerrado,
                id: 'menuEstados3',
                handler: function () {
                        CambiarEstado('Cerrado');
                }
            }]
        }
    });

    btnVerModificaciones = new Ext.Toolbar.Button({
        iconCls: 'ver',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtVerModif,
        id: 'btnVerModificaciones',
        disabled: true,
        handler: function () {
            winModificaciones();
        }
    });
    
    stTipoPlan = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoPlan.baseParams.uri = 16;
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

    cbTipoPlan = new Ext.form.ComboBox({
        id: 'cbTipoPlan',
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de plan',
        width: 150,
        disabled: false,
        store: stTipoPlan,
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
                btnAdicionar.enable();
                gpGestPlanes711.enable();
                stGpGestPlanes711.reload();
            }
        }
    });


    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosplanes711.clearFilters();
        }
    });
    
    agregarmodificarplan();
    vermodificaciones();
    
    aux = new Ext.data.Store({
        autoload: true,
        url: 'obtenerNomencladorEstado',
        reader: new Ext.data.JsonReader({
            id: 'idestado',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }])
    });

    // Store grid stGpGestPlanes711
    stGpGestPlanes711 = new Ext.data.Store({
        url: 'listarPlanes711',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stGpGestPlanes711.removeAll();
                stGpGestPlanes711.baseParams.field = field;
                stGpGestPlanes711.baseParams.start = offset;
                stGpGestPlanes711.baseParams.tipoplan = 1254
                cambiarTituloFiltrar(gpGestPlanes711, filtrosplanes711, perfil.etiquetas.lbgpGestPlanes711);
            },
            load: function (st, rec, obj) {
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idplan711'
            }, {
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'actual'
            }, {
                name: 'montototal'
            }, {
                name: 'idestado'
            }, {
                name: 'cantmodif'
            }]
                )
    });

    // Selection Model grid smGpGestPlanes711
    smGpGestPlanes711 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                controlarBotones(record);    
                actual = record.data.actual;
            }
        }
    });

    // Filtros para cada columna de tipo de modelo
    filtrosplanes711 = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'ejercicio'
            }, {
                type: 'numeric',
                dataIndex: 'montototal'
            }, {
                    type: 'listado',
                    dataIndex: 'idestado',
                    idcombo: 'cbestado',
                    store: aux,
                    urlcb: 'obtenerNomencladorEstado',
                    idstore: 'cbFiltroEstado',
                    valueFieldcb: 'iddatosnomenclador',
                    displayFieldcb: 'denominacion',
                    mode: 'local'
            }, {
                type: 'boolean',
                dataIndex: 'actual'
            }, {
                type: 'numeric',
                dataIndex: 'cantmodif'
            }]
    });

    // Grid gestion gpGestPlanes711
    gpGestPlanes711 = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        layout: 'fit',
        disabled: false,
        title: perfil.etiquetas.lbgpGestPlanes711,
        listeners: {
            sortchange: function (t, inf) {
                field = inf.field;
                direction = inf.direction;
                stGpGestPlanes711.reload();
            },
            celldblclick: function () {
                if (smGpGestPlanes711.getSelections().length == 1) {
                    accionventana = 2;
                    winFp(accionventana);
                }
            },
            click: function () {
                if (smGpGestPlanes711.getSelections().length == 0) {
                    btnModificar.disable();
                }
            }
        },
        store: stGpGestPlanes711,
        sm: smGpGestPlanes711,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idplan711'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idejercicio'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'ejercicio',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbMontoTotal,
                tooltip: perfil.etiquetas.lbMontoTotal,
                width: 200,
                sortable: true,
                align: 'left',
                dataIndex: 'montototal',
                renderer: RenderaddCommas
            }, {
                header: perfil.etiquetas.lbHeaderEstado,
                tooltip: perfil.etiquetas.lbHeaderEstado,
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'idestado',
                renderer: crearToolTip
            }/*, {
                header: perfil.etiquetas.lbEsActual,
                tooltip: perfil.etiquetas.lbEsActual,
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'actual',
                renderer: renderEstActual
            }*/, {
                header: perfil.etiquetas.lbHeaderModific,
                tooltip: perfil.etiquetas.lbHeaderModific,
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'cantmodif',
                hidden: true,
                renderer: crearToolTip
            }],
        //md: menuConfigAtributo,
        loadMask: {
            store: stGpGestPlanes711
        },
        bbar: new Ext.PagingToolbar({
            store: stGpGestPlanes711,
            displayInfo: true,
            items: [btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosplanes711
    });

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
            gridPanel.setTitle(etiqueta + ' - <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
            filtrado_por = "";
        }
    }

    function validar() {
        var tpm = gpGestPlanes711.getSelectionModel().getSelections();
        var arr = new Array();
        for (var i = 0; i < tpm.length; i++) {
            arr.push(tpm[i].id);
        }
        Ext.Ajax.request({
            url: 'validarOperaciones',
            params: {
                tiposmodelos: Ext.encode(arr),
                operacion: accion_tipomod
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgA == 22) {
                    switch (accion_tipomod) {
                        case 'mod':
                            {
                                winFp('Mod');
                            }
                            break;
                    }
                } else if (responseData.codMsgA == 21)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloEnUso);
                else if (responseData.codMsgA == 23)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloAprobado);
                else
                    (mostrarMensaje(3, perfil.etiquetas.msgErrorAction));
            }
        });
    }

    function modificarEstado(val, metaData) {
        if (val == 1) {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            metaData.css = 'icondistra-true verde';
        } else {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            metaData.css = 'icondistra-false rojo';
        }
    }

    function aprobado(val, metaData) {
        if (val == 3) {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            metaData.css = 'icondistra-true verde';
        } else {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            metaData.css = 'icondistra-false rojo';
        }
    }

    panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        autoWidth: true,
        height: 50,
        items: [gpGestPlanes711],
        tbar: [/*cbTipoPlan,'-',*/btnAdicionar, btnModificar, /*btnEliminar, btnActualEjercicio, menuEstados,*/ btnVerModificaciones, '->', btnAyuda]
    });

    // viewport de la plantilla
    vpPlanes711 = new Ext.Viewport({
        layout: 'fit',
        id: 'idvpPlanes711',
        items: [panelGeneral],
        listeners: {
            afterlayout: function (e) {
                claseMask();
            }
        }
    });

    panelGeneral.focus(true, 500);


    //stGpGestPlanes711.load();
    
//    if(rolepersona!=300000000405){
//        btnAdicionar.hide();
//        btnModificar.hide();
//        btnEliminar.hide();
//        btnActualEjercicio.hide();
//        menuEstados.hide();
//        
//    }
    
    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }

}// Endof cargarInterfaz

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderEstActual(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';

}

onkyupbusqueda = function (c, e) {
    if (e.getKey() == 13)
        stGpGestPlanes711.reload({});
}

function conformarMensaje(mesg) {
    mesg = perfil.etiquetas.msg1 + mesg + perfil.etiquetas.msg2;
    return mesg;
}

function siexisteTmodeloFiltrado() {
    if (filtrosplanes711.getFiltrosActivos().length > 0 && stGpGestPlanes711.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

 function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//funcion para cambiar el ejercicio actual
function cambiarActual() {
    //BarraProgreso.show('Cambiando ejercicio actual');
    Ext.Ajax.request({
        url: 'cambiarActual',
        timeout: 600000,
        params: {
            idejercicio: smGpGestPlanes711.getSelected().data.idejercicio
        },
        callback: function (options, success, response) {
            //BarraProgreso.hide();
            responseData = Ext.decode(response.responseText);

            if (responseData.mensaje == 1) {

                mostrarMensaje(1, perfil.etiquetas.lbMessageActualSatisfac, function () {
                    stGpGestPlanes711.reload();
                });
            }
            if (responseData.mensaje == 3) {
                mostrarMensaje(2, perfil.etiquetas.lbMessageActualPregunta,
                        function (btnPress) {
                            if (btnPress == 'ok') {
                                //BarraProgreso.show('Cambiando ejercicio actual');
                                Ext.Ajax.request({
                                    url: 'cambiarActual',
                                    timeout: 600000,
                                    params: {
                                        idejercicio: smGpGestPlanes711.getSelected().data.idejercicio,
                                        confirmar: true
                                    },
                                    callback: function (options, success, response) {
                                        //BarraProgreso.hide();
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.mensaje == 1) {
                                            mostrarMensaje(1, '');
                                            stGpGestPlanes711.reload();
                                            smGpGestPlanes711.clearSelections();
                                        }
                                    }
                                });
                            }

                        });
            }

        }
    });
}

function CambiarEstado(estado) {
    mostrarMensaje(2, perfil.etiquetas.lbMessageEstado, function (btnPresionado) {
        if (btnPresionado == 'ok') {
            if (actual == 0) {
                Ext.Ajax.request({
                    url: 'cambiarEstado',
                    params: {
                        idejercicio: smGpGestPlanes711.getSelected().data.idejercicio,
                        estado: estado
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, perfil.etiquetas.lbMessageEstadoSalida);
                            stGpGestPlanes711.reload();
                        } else {
                            mostrarMensaje(2, perfil.etiquetas.lbMessageError);
                        }
                    }
                })
            }else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageEstadoError);
            }
        }
    }); 
}

function EliminarPlan() {
    mostrarMensaje(2, perfil.etiquetas.lbMessageEliminar, function (btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'EliminarPlan',
                params: {
                    idplan711: smGpGestPlanes711.getSelected().data.idplan711,
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, perfil.etiquetas.lbMessageEliminarSatisf);
                        stGpGestPlanes711.reload();
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.lbMessageError);
                    }
                }
            })
        }
    }); 
}

function controlarBotones(recordsel){
    btnModificar.disable();
    btnActualEjercicio.disable();
    btnEliminar.disable();
    btnActualEjercicio.disable();
    Ext.getCmp('menuEstados1').disable();
    Ext.getCmp('menuEstados2').disable();
    Ext.getCmp('menuEstados3').disable();
    var estadosel = recordsel.data.idestado;
    btnVerModificaciones.enable();
    menuEstados.enable();
    switch (estadosel){
            case 'Elaboración':
                btnModificar.enable();
                Ext.getCmp('menuEstados2').enable();
                btnActualEjercicio.enable();
                break;
            case 'Ejecución':
                btnActualEjercicio.enable();
                Ext.getCmp('menuEstados3').enable();
                Ext.getCmp('menuEstados1').enable();
                btnActualEjercicio.enable();
                btnModificar.enable();
            break;
            case 'Cerrado':
                Ext.getCmp('menuEstados2').enable();
                btnEliminar.enable();
            break;
    }
    
}

function addCommas(nStr) {
    nStr+='';
    ds=nStr.replace(/,/g,'');
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
    nStr+='';
    ds=nStr.replace(/,/g,'');
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