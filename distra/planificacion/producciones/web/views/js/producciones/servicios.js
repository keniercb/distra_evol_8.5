
var offsetActividadesProduccion = 0, offsetServicios = 0, offsetActividadAddServicio = 0;

var indiceFilaActividadesProduccion = null;
function gestionarServicios() {
    filtrosActividadesProduccion = new Ext.grid.GridFilters({
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
                type: 'numeric',
                dataIndex: 'plazo'
            }, {
                type: 'numeric',
                dataIndex: 'duracion'
            }, {
                type: 'listado',
                dataIndex: 'idetapa',
                idcombo: 'cbEtapas',
                valueFieldcb: 'idetapa',
                displayFieldcb: 'denominacion',
                st: stEtapas,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'diacero',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadproduccion'
            }, {
                type: 'date',
                dataIndex: 'fechainicio'
            }, {
                type: 'date',
                dataIndex: 'fechafin'
            }, {
                type: 'list',
                dataIndex: 'servicio',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }
        ]
    });

    stActividadesProduccion = new Ext.data.Store({
        url: 'listarActividadesProduccion',
        listeners: {
            beforeload: function () {
                //IMPLEMENTANDO UNA BARBARIDAD, para limpiar los records modified
                var records = stActividadesProduccion.getModifiedRecords();
                while (records.length > 0) {
                    var record = records.pop();
                }
                //FIN DE LA BARBARIDAD
                stActividadesProduccion.baseParams.start = offsetActividadesProduccion;
                stActividadesProduccion.baseParams.idaplicacioncartatec = smProducciones.getSelected().data.idaplicacioncartatec;
                cambiarTituloFiltrar(gpActividadesProduccion, filtrosActividadesProduccion, perfil.etiquetas.lbActividadesProduccion);
            },
            load: function (options, success, response) {
                if (stActividadesProduccion.getCount() == 0) {
                    if (filtrosActividadesProduccion.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    }
                }
                smActividadesProduccion.selectRow(indiceFilaActividadesProduccion);
                controlarObjetosActividadesProduccion();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idactividadentidadprodcartatec'
        }, [{
                name: 'idactividadentidadprodcartatec'
            }, {
                name: 'idcartatecnologicaactividad'
            }, {
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'plazo'
            }, {
                name: 'duracion'
            }, {
                name: 'idetapa'
            }, {
                name: 'diacero'
            }, {
                name: 'nivelactividadproduccion'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'servicio'
            }, {
                name: 'idactividadentidadprodcartatec'
            }])
    });
    smActividadesProduccion = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                indiceFilaActividadesProduccion = indiceFila;
                controlarObjetosActividadesProduccion();
            },
            rowdeselect: function (sm, indiceFila, record) {
                indiceFilaActividadesProduccion = null;
                controlarObjetosActividadesProduccion();
            }
        }
    });

    cmActividadesProduccion = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            //id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            width: 160,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPlazo,
            tooltip: perfil.etiquetas.lbPlazoInicio,
            width: 80,
            dataIndex: 'plazo',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDuracion,
            tooltip: perfil.etiquetas.lbDuracion,
            sortable: true,
            width: 150,
            hidden: true,
            align: 'right',
            dataIndex: 'duracion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEtapa,
            tooltip: perfil.etiquetas.lbEtapa,
            sortable: true,
            width: 130,
            renderer: renderEtapa,
            dataIndex: 'idetapa'
        }, {
            header: perfil.etiquetas.lbDiaCero,
            tooltip: perfil.etiquetas.lbDiaCero,
            sortable: true,
            width: 80,
            hidden: true,
            dataIndex: 'diacero',
            renderer: renderEstado
        }, {
            header: perfil.etiquetas.lbNA,
            tooltip: perfil.etiquetas.lbNivelActividad,
            width: 80,
            hidden: true,
            align: 'right',
            dataIndex: 'nivelactividadproduccion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbFechaInicio,
            tooltip: perfil.etiquetas.lbFechaInicio,
            width: 100,
            align: 'right',
            dataIndex: 'fechainicio',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbFechaFin,
            tooltip: perfil.etiquetas.lbFechaFin,
            width: 80,
            align: 'right',
            dataIndex: 'fechafin',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbSustituido,
            tooltip: perfil.etiquetas.lbSustituidoServicio,
            width: 80,
            dataIndex: 'servicio',
            renderer: renderEstado
        }
    ]);
    btnLimpiarActividadesProduccion = new Ext.Button({
        id: 'btnLimpiarActividadesProduccion',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosActividadesProduccion.clearFilters();
        }
    });
    gpActividadesProduccion = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        store: stActividadesProduccion,
        region: 'center',
        plugins: filtrosActividadesProduccion,
        sm: smActividadesProduccion,
        cm: cmActividadesProduccion,
        title: perfil.etiquetas.lbActividadesProduccion,
        frame: true,
        clicksToEdit: 2,
        bbar: new Ext.PagingToolbar({
            store: stActividadesProduccion,
            displayInfo: true,
            items: ['-', btnLimpiarActividadesProduccion],
            listeners: {
                beforechange: function (p, e) {
                    offsetActividadesProduccion = e.start;
                }
            }
        })
    });

//SERVICIOS
    stServicios = new Ext.data.Store({
        url: 'listarServiciosActividadesProduccion',
        listeners: {
            beforeload: function () {
                //IMPLEMENTANDO UNA BARBARIDAD, para limpiar los records modified
                var records = stServicios.getModifiedRecords();
                while (records.length > 0) {
                    var record = records.pop();
                }
                //FIN DE LA BARBARIDAD
                stServicios.baseParams.start = offsetServicios;
                stServicios.baseParams.idaplicacioncartatec = smProducciones.getSelected().data.idaplicacioncartatec;
                stServicios.baseParams.idcartatecnologicaactividad = smActividadesProduccion.getSelected().data.idcartatecnologicaactividad;
            },
            load: function (options, success, response) {
                btnGuardarServicios.disable();
                controlarObjetosServicios();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idservicio'
        }, [{
                name: 'idservicio'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'gasto'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }])
    });
    smServicios = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosServicios();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosServicios();
            }
        }
    });

    cmServicios = new Ext.grid.ColumnModel([{
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
            width: 160,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            width: 160,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbGasto,
            tooltip: perfil.etiquetas.lbGasto,
            width: 80,
            dataIndex: 'gasto',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                invalidText: perfil.etiquetas.msgValorMayorquecero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            width: 80,
            hidden: true,
            renderer: renderUsuario
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fecha',
            hidden: true,
            width: 80,
            renderer: renderFecha
        }
    ]);
    btnSustituirPorServicios = new Ext.Button({
        id: 'btnSustituirPorServicios',
        tooltip: perfil.etiquetas.lbSustituirPorServicios,
        iconCls: 'salir',
        disabled: true,
        handler: function () {
            adicionarServicio();
        }
    });
    btnGuardarServicios = new Ext.Button({
        id: 'btnGuardarServicios',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardarServicio,
        disabled: true,
        handler: function () {
            guardarActividadServicio();
        }
    });
    btnEliminarServicios = new Ext.Button({
        id: 'btnEliminarServicios',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarServicio,
        disabled: true,
        handler: function () {
            eliminarActividadServicio();
        }
    });
    gpServicios = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        store: stServicios,
        region: 'south',
        sm: smServicios,
        cm: cmServicios,
        title: perfil.etiquetas.lbServicios,
        autoExpandColumn: 'expandir',
        height: 150,
        frame: true,
        clicksToEdit: 2,
        disabled: true,
        tbar: [btnSustituirPorServicios, btnGuardarServicios, btnEliminarServicios],
        listeners: {
            afteredit: function (sm) {
                btnGuardarServicios.enable();
            }
        }
    });
    pServicios = new Ext.Panel({
        id: 'pServicios',
        layout: 'border',
        items: [gpActividadesProduccion, gpServicios]
    });
    winServicios = new Ext.Window({
        id: 'winServicios',
        modal: true,
        closeAction: 'destroy',
        width: 960,
        layout: 'fit',
        resizable: false,
        items: pServicios,
        constrain: true,
        height: 600,
        title: perfil.etiquetas.lbGestionarServicios + " de: " + smProducciones.getSelected().data.denominacion + '[' + smProducciones.getSelected().data.producto + ']',
        listeners: {
            beforeshow: function () {
                stActividadesProduccion.reload();
            },
            beforedestroy: function () {
                stProducciones.reload();
            }
        },
        buttons: [{
                id: 'btnServiciosAceptar',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    winServicios.destroy();
                }
            }]
    });
    winServicios.show();
}

function controlarObjetosActividadesProduccion() {
    btnSustituirPorServicios.disable();
    gpServicios.disable();
    if (smActividadesProduccion.getSelections().length > 0) {
        if (smActividadesProduccion.getSelections().length == 1) {
            stServicios.reload();
            gpServicios.enable();
        }
    } else {
        if (stServicios.reader != undefined)
            stServicios.loadData({"data": [], "total": 0});
    }
}

function controlarObjetosServicios() {
    btnSustituirPorServicios.disable();
    btnEliminarServicios.disable();
    cmServicios.setEditable(cmServicios.findColumnIndex('gasto'), false);
    if (smProducciones.getSelected().data.idaprobacion < 3) {
        btnSustituirPorServicios.enable();
        if (smServicios.getSelections().length > 0) {
            if (smServicios.getSelections().length == 1) {
                btnEliminarServicios.enable();
                cmServicios.setEditable(cmServicios.findColumnIndex('gasto'), true);
            }
        }
    }
}

function adicionarServicio() {
    filtrosActividadAddServicio = new Ext.grid.GridFilters({
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
            }]
    });
    //***********grid panel****************
    stActividadAddServicio = new Ext.data.Store({
        url: 'listarActividadesAddServicio',
        listeners: {
            beforeload: function () {
                stActividadAddServicio.baseParams.start = offsetActividadAddServicio;
                stActividadAddServicio.baseParams.identidad = nodoEst.id;
                stActividadAddServicio.baseParams.idproduccion = smProducciones.getSelected().data.idaplicacioncartatec;
                stActividadAddServicio.baseParams.idcartaactividadorigen = smActividadesProduccion.getSelected().data.idcartatecnologicaactividad;
                stActividadAddServicio.baseParams.idactividadentidadprodcartatec = smActividadesProduccion.getSelected().data.idactividadentidadprodcartatec;
                stActividadAddServicio.baseParams.fechainicio = smActividadesProduccion.getSelected().data.fechainicio;
                stActividadAddServicio.baseParams.fechafin = smActividadesProduccion.getSelected().data.fechafin;
            },
            load: function () {
                cambiarTituloFiltrar(gpActividadAddServicio, filtrosActividadAddServicio, perfil.etiquetas.lbActividades);
                if (stActividadAddServicio.getCount() == 0) {
                    if (filtrosActividadAddServicio.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            id: 'idactividad',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });
    //**********checbox************************************

    cmActividadAddServicio = new Ext.grid.ColumnModel([{
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
            width: 100,
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }]);
    smActividadAddServicio = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    btnLimpiarActividadAddServicio = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarActividadAddServicio',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosActividadAddServicio.clearFilters();
        }
    });
    gpActividadAddServicio = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        id: 'gpActividadAddServicio',
        store: stActividadAddServicio,
        plugins: filtrosActividadAddServicio,
        sm: smActividadAddServicio,
        cm: cmActividadAddServicio,
        region: 'west',
        autoExpandColumn: 'expandir',
        height: 480,
        width: 750,
        margins: '2 2 2 2',
        anchor: '95%',
        title: perfil.etiquetas.lbActividades,
        listeners: {
            celldblclick: function () {
                adicionarActividadServicio(false);
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadAddServicio,
            displayInfo: true,
            items: ['-', btnLimpiarActividadAddServicio],
            listeners: {
                beforechange: function (p, e) {
                    offsetActividadAddServicio = e.start;
                }
            }
        })
    });
    //***************window principal************
    winActividadAddServicio = new Ext.Window({
        modal: true,
        id: 'winActividadAddServicio',
        constrain: true,
        closeAction: 'destroy',
        items: [gpActividadAddServicio],
        //layout: 'fit',
        title: perfil.etiquetas.lbSustituirPorServicios,
        listeners: {
            beforeshow: function () {
                stActividadAddServicio.reload();
            },
            beforedestroy: function () {
                stActividadesProduccion.reload();
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winActividadAddServicio.destroy();
                }
            }, {
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarActividadServicio();
                }
            }]
    });
    winActividadAddServicio.show();
}

function adicionarActividadServicio() {
    mymask.show();
    Ext.Ajax.request({
        url: 'adicionarServicio',
        waitMsg: perfil.etiquetas.msgSustituyendoPorServicio,
        params: {
            identidad: nodoEst.id,
            idactividad: smActividadAddServicio.getSelected().data.idactividad,
            idaplicacioncartatec: smProducciones.getSelected().data.idaplicacioncartatec,
            idcartatecnologicaactividad: smActividadesProduccion.getSelected().data.idcartatecnologicaactividad
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                winActividadAddServicio.destroy();
                mostrarMensaje(2, perfil.etiquetas.msgSustituidoPorServicioOk);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgSustituidoPorServicioNo);
            }
        }
    });
}

function guardarActividadServicio() {
    var records = stServicios.getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['idservicio'] = smServicios.getSelected().data.idservicio;
        arreglo.push(rec);
    }
    if (arreglo.length > 0) {
        Ext.Ajax.request({
            url: 'actualizarServicio',
            waitMsg: perfil.etiquetas.msgGuardandoServicio,
            params: {
                servicios: Ext.encode(arreglo),
                identidad: nodoEst.id
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoServicioOk);
                    stServicios.reload();
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoServicioNo);
                }
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }
}

function eliminarActividadServicio() {
    mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarServicio, eliminarObjetoServicio);
    function eliminarObjetoServicio(btnPresionado) {
        if (btnPresionado == 'ok') {
            var serviciosEliminar = [];
            var recordsSel = smServicios.getSelections();
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++)
                    serviciosEliminar.push({
                        idservicio: recordsSel[i].data.idservicio
                    });
                Ext.Ajax.request({
                    url: 'eliminarServicio',
                    waitMsg: perfil.etiquetas.msgEliminandoServicio,
                    params: {
                        servicios: Ext.encode(serviciosEliminar),
                        identidad: nodoEst.id
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoServicioOk);
                            stActividadesProduccion.reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoServicioNo);
                        }
                    }
                });
            }
        }
    }
}

