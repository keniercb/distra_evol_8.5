//var perfil = eval(uneval(window.parent.UCID.portal.perfil));

Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('demandadeproduccion', cargarInterfaz);
var nodoEst = null;
var offsetDemandaGestion = 0;
var offsetGestionarObservacion = 0;
var offsetIndicadoresEmpresaAddDemanda = 0;
var cantidad = 0;
var entidadSelecc = null;
var entidadProdSelec = null;
var stIndicadores = null;
var objci = {};
var comportEntidadLogCliente = false;
var comportEntidadLogProveedor = false;
var comportEntidadLogRector = false;
var beforeloadstDemandaGestion = false;
var estadoEjercicio = 'elaboracion';
objci.acciones = [];
function cargarInterfaz() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[i] = acciones_reportes[i].abreviatura;
        }
    });
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    stCbejercicio = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        listeners: {
            beforeload: function () {
            },
            load: function (t) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                estadoEjercicio = 'elaboracion';
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function (cb, rec, index) {
                stDemandaGestion.reload();
                estadoEjercicio = rec.data.uridatosnomenclador;
            }
        }
    });
    //Inicio del panel de estructuras
    trEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    trEntidades.btnBuscar.setText("");
    trEntidades.btnLimpiar.setText("");
    trEntidades = trEntidades.items.items[0];
    trEntidades.getRootNode().expand();
    trEntidades.split = true;
    trEntidades.getRootNode().attributes.text = perfil.etiquetas.lbEntidades;
    trEntidades.getRootNode().text = perfil.etiquetas.lbEntidades;
    trEntidades.addListener('click', function (n) {
        nodoEst = n;
        entidadSelecc = nodoEst.id
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {
            pDemandaGestion.show();
            obterComportamientoPorEntidad();
        } else {
            pDemanda.disable();
            pDemandaGestion.hide();

            if (stDemandaGestion.reader != undefined)
                stDemandaGestion.loadData({"data": [], "total": 0});
        }
    });
    pEntidades = new Ext.Panel({
        id: 'pEntidades',
        layout: 'fit',
        region: 'west',
        width: 250,
        split: true,
        collapsible: true,
        titleCollapse: true,
        title: perfil.etiquetas.lbEstructura,
        items: [trEntidades]
    });
    //Fin del panel de estructuras
    Ext.Ajax.request({
        url: 'comportEntidadLog',
        waitMsg: perfil.etiquetas.lbGuardando,
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            comportEntidadLog = responseData.data;
            for (i = 0; i < comportEntidadLog.length; i++) {
                if (comportEntidadLog[i].idtipocomportamiento == 1) {
                    comportEntidadLogCliente = true;
                } else if (comportEntidadLog[i].idtipocomportamiento == 2) {
                    comportEntidadLogProveedor = true;
                } else if (comportEntidadLog[i].idtipocomportamiento == 3) {
                    comportEntidadLogRector = true;
                }
            }
        }
    });

    stEntidadesProveedor = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesProveedor',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stEntidadesProveedor.baseParams.comp = 'organoempresarial';
            }, load: function () {
                mymask.hide();
            }
        }
    });
    stEntidadesCliente = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesCliente',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stEntidadesCliente.baseParams.comp = 'organoconsumidor';
            }, load: function () {
                mymask.hide();
            }
        }
    });
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idusuario'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }])
    });
    stCbEntidadesProd = new Ext.data.Store({
        url: 'listarEntidadesProductoras',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidadorganosatisface'
        }, [{
                name: 'identidadorganosatisface'
            }, {
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    stum = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarUnidadMedida',
        id: 'stum',
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });
    stPrograma = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarProgramas',
        id: 'stPrograma',
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stDestino = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarDestinos',
        id: 'stDestino',
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stNaturaleza = new Ext.data.Store({
        url: 'listarNaturalezas',
        id: 'stNaturaleza',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'naturaleza'
        }, [{
                name: 'naturaleza'
            }, {
                name: 'denominacion'
            }])
    });
    stTieneObserv = new Ext.data.SimpleStore({
        id: 'stTieneObserv',
        fields: [{
                name: 'tieneobservacion'
            }, {
                name: 'denominacion'
            }],
        data: [['0', perfil.etiquetas.lbNo], ['1', perfil.etiquetas.lbSi]]
    });
    stTipoComportamiento = new Ext.data.Store({
        url: 'obtenerComportamientoClienteProductor',
        id: 'stTipoComportamiento',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idtipocomportamiento'
        }, [{
                name: 'idtipocomportamiento'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
                cbComportamiento.setValue(stTipoComportamiento.getAt(0).get('idtipocomportamiento'));
                stDemandaGestion.reload();
                controlarObjetosAprobacion();
            }
        }
    });

    cbComportamiento = new Ext.form.ComboBox({
        id: 'cbComportamiento',
        store: stTipoComportamiento,
        valueField: 'idtipocomportamiento',
        hiddenName: 'idtipocomportamiento',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function () {
                stDemandaGestion.reload();
                controlarObjetosAprobacion();
            }
        }
    });
    stDemandaGestion = new Ext.data.Store({
        id: 'stDemandaGestion',
        url: 'listarDemandas',
        pruneModifiedRecords: true,
        listeners: {
            beforeload: function () {
                //limpiar los records modified               
                stDemandaGestion.commitChanges();
                beforeloadstDemandaGestion = true;
                stDemandaGestion.baseParams.start = offsetDemandaGestion;
                stDemandaGestion.baseParams.identidad = entidadSelecc;
                stDemandaGestion.baseParams.idejercicio = cbEjercicio.getValue();
                stDemandaGestion.baseParams.tipo = cbComportamiento.getValue();
            },
            load: function () {
                cambiarTituloFiltrar(gpDemandaGestion, filtrosDemandaGestion, perfil.etiquetas.lbIndicadoresDemandados);
                gpDemandaGestion.enable();
                if (stDemandaGestion.getCount() == 0) {
                    if (beforeloadstDemandaGestion) {
                        if (filtrosDemandaGestion.getFiltrosActivos() == undefined || filtrosDemandaGestion.getFiltrosActivos().length == 0)
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        else
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                } else {
                    //implementacion para lanzar un cartel para el rector de la cantidad 
                    //de demandas que estan listas para que el las apruebe
                    cantidad = stDemandaGestion.data.items[0].data.cantdemandasxaprobar;
                    if (cantidad > 0) {
                        Ext.Msg.show({
                            title: perfil.etiquetas.lbDemandas,
                            msg: perfil.etiquetas.msgTienedemandasxaprobar + cantidad + perfil.etiquetas.msgTienedemandasxaprobar1,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        });
                    }
                    //implementacion para pintar los colores segun la aprobacion
                    upColorCellDemandas();
                }
                smDemandaGestion.clearSelections();
                beforeloadstDemandaGestion = false;
                btnGuardar.disable();
                controlarObjetos();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemanda'
        }, [{
                name: 'iddemanda'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'cantidadinicial'
            }, {
                name: 'ajuste'
            }, {
                name: 'cantidadconfirmada'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'importeestmn'
            }, {
                name: 'importeestcuc'
            }, {
                name: 'identidadproveedor'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'tieneobservacion'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'idprograma'
            }, {
                name: 'iddestino'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }, {
                name: 'fechalimite'
            }
            , {
                name: 'idusuariocrea'
            }
            , {
                name: 'cantdemandasxaprobar'
            }
        ])
    });

    filtrosDemandaGestion = new Ext.grid.GridFilters({
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
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadinicial'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadconfirmada'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importeestmn'
            }, {
                type: 'numeric',
                dataIndex: 'importeestcuc'
            }, {
                type: 'listado',
                dataIndex: 'identidadproveedor',
                idcombo: 'cbidentidadproductor',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stCbEntidadesProd,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, perfil.etiquetas.lbNo], [2, perfil.etiquetas.lbAprobadoEmpresa], [3, perfil.etiquetas.lbAprobadoCliente], [4, perfil.etiquetas.lbAprobadoRector]]
            }, {
                type: 'list',
                dataIndex: 'tieneobservacion',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }, {
                type: 'listado',
                dataIndex: 'identidadcliente',
                idcombo: 'cbidentidadcliente',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesCliente,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idprograma',
                idcombo: 'cbiddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stPrograma,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'iddestino',
                idcombo: 'cbiddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stDestino,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbidusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'date',
                dataIndex: 'fechalimite'
            }, {
                type: 'listado',
                dataIndex: 'idusuariocrea',
                idcombo: 'cbidusuariocrea',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }]
    });
    cmDemandaGestion = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            width: 200,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            width: 80,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbEntidadUIM,
            tooltip: perfil.etiquetas.lbEntidadUIM,
            width: 150,
            dataIndex: 'identidadproveedor',
            renderer: renderEntidadesProd
        }, {
            header: perfil.etiquetas.lbCliente,
            tooltip: perfil.etiquetas.lbCliente,
            width: 120,
            dataIndex: 'identidadcliente',
            renderer: renderEntidades
        }, {
            header: perfil.etiquetas.lbPrograma,
            id: 'programa',
            tooltip: perfil.etiquetas.lbPrograma,
            hidden: false,
            width: 120,
            dataIndex: 'idprograma',
            renderer: renderProgramas,
            editor: new Ext.form.ComboBox({
                id: 'cbPrograma',
                store: stPrograma,
                valueField: 'iddatosnomenclador',
                hiddenName: 'iddatosnomenclador',
                displayField: 'denominacion',
                mode: 'local',
                allowBlank: false,
                typeAhead: true,
                editable: true,
                triggerAction: 'all',
                emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
                loadingText: perfil.etiquetas.lbCargando,
                width: 140})
        }, {
            header: perfil.etiquetas.lbDestino,
            id: 'destino',
            hidden: false,
            tooltip: perfil.etiquetas.lbDestino,
            width: 120,
            dataIndex: 'iddestino',
            renderer: renderDestinos,
            editor: new Ext.form.ComboBox({
                id: 'cbDestino',
                store: stDestino,
                valueField: 'iddatosnomenclador',
                hiddenName: 'iddatosnomenclador',
                displayField: 'denominacion',
                mode: 'local',
                allowBlank: false,
                typeAhead: true,
                editable: true,
                triggerAction: 'all',
                emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
                loadingText: perfil.etiquetas.lbCargando,
                width: 140})
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            width: 100,
            dataIndex: 'cantidadinicial',
            renderer: renderCantidad,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 3,
                allowBlank: false,
                allowNegative: false
            })
        }, {
            header: perfil.etiquetas.lbAjuste,
            tooltip: perfil.etiquetas.lbAjuste,
            width: 80,
            dataIndex: 'ajuste',
            renderer: renderCantidad,
            align: 'right',
            editor: new Ext.form.NumberField({
                decimalPrecision: 3,
                allowBlank: false,
                allowNegative: true
            })
        }, {
            header: perfil.etiquetas.lbCantidadFinal,
            tooltip: perfil.etiquetas.lbCantidadFinal,
            width: 100,
            dataIndex: 'cantidadconfirmada',
            renderer: renderCantidad,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecioEstMN,
            width: 100,
            dataIndex: 'precio',
            align: 'right',
            renderer: renderMoneda
        }, {
            header: perfil.etiquetas.lbPrecioCUC,
            tooltip: perfil.etiquetas.lbPrecioEstCUC,
            width: 100,
            dataIndex: 'preciodivisa',
            align: 'right',
            renderer: renderMoneda
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporteEstMN,
            width: 100,
            dataIndex: 'importeestmn',
            align: 'right',
            renderer: renderMoneda
        }, {
            header: perfil.etiquetas.lbImporteCUC,
            tooltip: perfil.etiquetas.lbImporteEstCUC,
            width: 100,
            dataIndex: 'importeestcuc',
            align: 'right',
            renderer: renderMoneda
        }, {
            header: perfil.etiquetas.lbfechaLimite,
            tooltip: perfil.etiquetas.lbfechaLimite,
            width: 80,
            dataIndex: 'fechalimite',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            width: 80,
            dataIndex: 'idaprobacion',
            renderer: renderAprobacion
        }, {
            header: perfil.etiquetas.lbUsuarioC,
            tooltip: perfil.etiquetas.lbUsuarioCrea,
            width: 100,
            dataIndex: 'idusuariocrea',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbObservacion,
            width: 80,
            dataIndex: 'tieneobservacion',
            renderer: renderBinario
        }, {
            header: perfil.etiquetas.lbUsuarioUA,
            tooltip: perfil.etiquetas.lbUsuarioUltAct,
            width: 100,
            hidden: true,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbUltimaActualizacion,
            width: 80,
            hidden: true,
            dataIndex: 'fecha',
            renderer: renderFecha
        }]);
    smDemandaGestion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {

                controlarObjetos();
            },
            rowdeselect: function () {
                controlarObjetos();
            }
        }
    });
    btnLimpiarDemandaGestion = new Ext.Button({
        id: 'btnLimpiarDemandaGestion',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosDemandaGestion.clearFilters();
        }
    });
    btnAdicionar = new Ext.Button({
        id: 'btnAdicionar',
        disabled: true,
        iconCls: 'adicionar',
        hidden: true,
        tooltip: perfil.etiquetas.lbAdicionar,
        handler: function () {
            adicionarDemandaInterfaz();
        }
    });
    btnEliminar = new Ext.Button({
        id: 'btnEliminar',
        disabled: true,
        hidden: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar,
        handler: function () {
            eliminarDemanda();
        }
    });
    btnGestionarObservacion = new Ext.Button({
        id: 'btnGestionarObservacion',
        iconCls: 'info',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbGestionarObservacion,
        handler: function () {
            gestionarObservacion();
        }
    });
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        disabled: true,
        iconCls: 'guardar',
        hidden: true,
        tooltip: perfil.etiquetas.lbGuardar,
        listeners: {
            click: function () {
                guardarDemanda();
            }
        }});
    btnAprobarProveedor = new Ext.Button({
        id: 'btnAprobarProveedor',
        iconCls: 'aprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobar + ' Proveedor',
        listeners: {
            click: function () {
                cambiarAprobacion('proveedor', 1, 2);
            }
        }

    });
    btnAprobarCliente = new Ext.Button({
        id: 'btnAprobarCliente',
        iconCls: 'aprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobar + ' Cliente',
        listeners: {
            click: function (st) {
                cambiarAprobacion('cliente', 1, 3);
            }
        }
    });
    btnAprobarRector = new Ext.Button({
        id: 'btnAprobarRector',
        iconCls: 'aprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbAprobar + ' Rector',
        listeners: {
            click: function () {
                cambiarAprobacion('rector', 1, 4);
            }
        }
    });
    btnDesaprobarProveedor = new Ext.Button({
        id: 'btnDesaprobarProveedor',
        iconCls: 'desaprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobar + ' Proveedor',
        listeners: {
            click: function () {
                cambiarAprobacion('proveedor', 0, 1);
            }
        }
    });
    btnDesaprobarCliente = new Ext.Button({
        id: 'btnDesaprobarCliente',
        iconCls: 'desaprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobar + ' Cliente',
        listeners: {
            click: function () {
                cambiarAprobacion('cliente', 0, 2);
            }
        }
    });
    btnDesaprobarRector = new Ext.Button({
        id: 'btnDesaprobarRector',
        iconCls: 'desaprobar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbDesaprobar + ' Rector',
        listeners: {
            click: function () {
                cambiarAprobacion('rector', 0, 3);
            }
        }
    });
    btnExportar = new Ext.Button({
        id: 'btnExportar',
        disabled: true,
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        handler: function () {
            window.open('exportarDemandas?identidad=' + nodoEst.attributes.id +
                    '&denoentidad=' + nodoEst.attributes.text +
                    '&idejercicio=' + cbEjercicio.getValue() +
                    '&denoejercicio=' + cbEjercicio.getRawValue() +
                    '&tipo=' + cbComportamiento.getValue() +
                    '&denotipo=' + cbComportamiento.getRawValue() +
                    '&filtros=' + Ext.encode(filtrosDemandaGestion.getFilterData()));
        }
    });
    //Importar datos 
    btnImportarDemanda = new Ext.Button({
        id: 'btnImportarDemanda',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportarDemanda,
        disabled: true,
        hidden: true,
        handler: function () {
            importarDemanda();
        }
    });
    gpDemandaGestion = new Ext.grid.EditorGridPanel({
        store: stDemandaGestion,
        title: perfil.etiquetas.lbIndicadoresDemandados,
        id: 'gpDemandaGestion',
        region: 'center',
        sm: smDemandaGestion,
        cm: cmDemandaGestion,
        plugins: filtrosDemandaGestion,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAdicionar, btnEliminar, btnGuardar, btnGestionarObservacion, '-',
            btnAprobarProveedor, btnAprobarCliente, btnAprobarRector, btnDesaprobarProveedor, btnDesaprobarCliente, btnDesaprobarRector, '-', btnExportar, btnImportarDemanda],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stDemandaGestion,
            displayInfo: true,
            items: ['-', btnLimpiarDemandaGestion],
            listeners: {
                beforechange: function (p, e) {
                    offsetDemandaGestion = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (e) {

            },
            beforeedit: function (e) {
                controlarEventos('beforeedit', e);

            }
        }
    });
    pDemandaGestion = new Ext.Panel({
        id: 'pDemandaGestion',
        layout: 'fit',
        region: 'center',
        width: 500,
        items: [gpDemandaGestion]

    });

    btnAyuda = new Ext.Toolbar.Button({
        text: perfil.etiquetas.lbAyuda,
        tooltip: perfil.etiquetas.lbAyuda,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        id: 'btnAyuda'
    });
    pDemanda = new Ext.Panel({
        id: 'pDemanda',
        layout: 'fit',
        region: 'center',
        width: 500,
        split: true,
        title: perfil.etiquetas.lbDemanda,
        disabled: true,
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEjercicio + ': '
            }, cbEjercicio, {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbComportamiento + ': '
            }, cbComportamiento],
        items: [pDemandaGestion]

    });
    panelView = new Ext.Panel({
        id: 'panelView',
        layout: 'border',
        tbar: ['->', btnAyuda],
        items: [pEntidades, pDemanda]
    });
    myViewGestionarPlanCentral = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });
}
function adicionarDemandaInterfaz() {
    stcbEmpresaAddDemanda = new Ext.data.Store({
        url: 'listarEntidadesProductorasIndicador',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidadorganosatisface'
        }, [{
                name: 'identidadorganosatisface'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stcbEmpresaAddDemanda.baseParams.idindicador = smIndicadoresEmpresaAddDemanda.getSelected().data.idindicador;
            },
            load: function () {
                cbEmpresaAddDemanda.enable();
                mymask.hide();
            }
        }
    });
    cbEmpresaAddDemanda = new Ext.form.ComboBox({
        id: 'cbEmpresaAddDemanda',
        store: stcbEmpresaAddDemanda,
        valueField: 'identidadorganosatisface',
        hiddenName: 'identidadorganosatisface',
        displayField: 'denominacion',
        fieldLabel: perfil.etiquetas.lbEntidadesProd,
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        disabled: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                controlarbtnIndicadoresEmpresaAddDemanda();
            }
        }
    });
    cantidadEmpresaAddDemanda = new Ext.form.NumberField({
        fieldLabel: perfil.etiquetas.lbCantidad,
        id: 'cantidadEmpresaAddDemanda',
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
                controlarbtnIndicadoresEmpresaAddDemanda();
            }
        }
    });
    fechaLimite = new Ext.form.DateField({
        id: 'fechaLimite',
        width: 160,
        align: 'right',
        allowBlank: false,
        fieldLabel: perfil.etiquetas.lbfechaLimite,
        listeners: {
            change: function () {
                controlarbtnIndicadoresEmpresaAddDemanda();
            }
        }
    });
    btnLimpiarEmpresaAddDemanda = new Ext.Button({
        id: 'btnLimpiarEmpresaAddDemanda',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosIndicadoresEmpresaAddDemanda.clearFilters();
        }
    });
    stIndicadoresEmpresaAddDemanda = new Ext.data.Store({
        id: 'stIndicadoresEmpresaAddDemanda',
        url: 'listarIndicadoresEmpresaAddDemanda',
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
            }, {
                name: 'idnaturaleza'
            }
        ]), listeners: {
            beforeload: function () {
                mymask.show();
                stIndicadoresEmpresaAddDemanda.baseParams.start = offsetIndicadoresEmpresaAddDemanda;
            },
            load: function () {
                cambiarTituloFiltrar(gpIndicadoresEmpresaAddDemanda, filtrosIndicadoresEmpresaAddDemanda, 'Indicadores');
                gpIndicadoresEmpresaAddDemanda.enable();
                if (stIndicadoresEmpresaAddDemanda.getCount() == 0) {
                    if (filtrosIndicadoresEmpresaAddDemanda.getFiltrosActivos() == undefined || filtrosIndicadoresEmpresaAddDemanda.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                }
                gpIndicadoresEmpresaAddDemanda.getSelectionModel().clearSelections();
                mymask.hide();
            }
        }
    });
    filtrosIndicadoresEmpresaAddDemanda = new Ext.grid.GridFilters({
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
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idnaturaleza',
                idcombo: 'idcbnaturaleza',
                valueFieldcb: 'idnaturaleza',
                displayFieldcb: 'denominacion',
                st: stNaturaleza,
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
    cmIndicadoresEmpresaAddDemanda = new Ext.grid.ColumnModel([{
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
            header: perfil.etiquetas.lbNaturaleza,
            tooltip: perfil.etiquetas.lbNaturaleza,
            width: 100,
            dataIndex: 'idnaturaleza',
            renderer: renderNaturaleza
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
    smIndicadoresEmpresaAddDemanda = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                stcbEmpresaAddDemanda.reload();
                controlarbtnIndicadoresEmpresaAddDemanda();
            }, rowdeselect: function () {
                controlarbtnIndicadoresEmpresaAddDemanda();
            }
        }
    });
    gpIndicadoresEmpresaAddDemanda = new Ext.grid.GridPanel({
        store: stIndicadoresEmpresaAddDemanda,
        autoScroll: true,
        region: 'center',
        title: 'Indicadores',
        id: 'gpIndicadoresEmpresaAddDemanda',
        sm: smIndicadoresEmpresaAddDemanda,
        cm: cmIndicadoresEmpresaAddDemanda,
        plugins: filtrosIndicadoresEmpresaAddDemanda,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stIndicadoresEmpresaAddDemanda,
            displayInfo: true,
            items: ['-', btnLimpiarEmpresaAddDemanda],
            listeners: {
                beforechange: function (p, e) {
                    offsetIndicadoresEmpresaAddDemanda = e.start;
                }
            }
        })
    });
    panelIndicadoresEmpresaAddDemanda = new Ext.FormPanel({
        id: 'panelIndicadoresEmpresaAddDemanda',
        frame: true,
        width: 350,
        region: 'east',
        items: [{
                xtype: 'fieldset',
                title: perfil.etiquetas.lbDatosGeneralesDemanda,
                collapsible: true,
                autoHeight: true,
                items: [{
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbEmpresaAddDemanda]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cantidadEmpresaAddDemanda]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [fechaLimite]
                            }
                        ]
                    }
                ]
            }]
    });
    winIndicadoresEmpresaAddDemanda = new Ext.Window({
        id: 'winIndicadoresEmpresaAddDemanda',
        modal: true,
        closeAction: 'destroy',
        width: 1050,
        height: 500,
        layout: 'border',
        resizable: false,
        items: [gpIndicadoresEmpresaAddDemanda, panelIndicadoresEmpresaAddDemanda],
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
                id: 'btnIndicadoresEmpresaAddDemandaCancelar',
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbCancelar,
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                handler: function () {
                    winIndicadoresEmpresaAddDemanda.destroy();
                }
            }, {
                id: 'btnIndicadoresEmpresaAddDemandaAceptar',
                iconCls: 'ok',
                tooltip: 'Adicionar',
                text: 'Adicionar',
                disabled: true,
                handler: function () {
                    mymask.show();
                    Ext.Ajax.request({
                        url: 'adicionarDemanda',
                        params: {
                            fechalimite: fechaLimite.getValue().format('d/m/Y'),
                            idejercicio: cbEjercicio.getValue(),
                            cant: cantidadEmpresaAddDemanda.getValue(),
                            idindicador: smIndicadoresEmpresaAddDemanda.getSelected().data.idindicador,
                            identidadorganosatisface: cbEmpresaAddDemanda.getValue(),
                            idcliente: nodoEst.attributes.id
                        },
                        callback: function (options, success, response) {
                            mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            winIndicadoresEmpresaAddDemanda.destroy();
                            if (responseData.codMsgN == 1) {
                                mostrarMensaje(1, perfil.etiquetas.lbAdicionadoOK);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.lbAdicionadoNo);
                            }
                            filtrosDemandaGestion.clearFilters();
                        }
                    });
                }
            }]
    });
    stIndicadoresEmpresaAddDemanda.reload();
    winIndicadoresEmpresaAddDemanda.show();
}

function guardarestadoPaneles() {
    estadoDemandaGestion = gpDemandaGestion.disabled;
    gpDemandaGestion.enable();
}

function revertirestadoPaneles() {
    if (estadoDemandaGestion)
        gpDemandaGestion.disable();
}

function controlarbtnIndicadoresEmpresaAddDemanda() {
    if (smIndicadoresEmpresaAddDemanda.getSelected() != undefined) {
        idindicador = smIndicadoresEmpresaAddDemanda.getSelected().data.idindicador;
        Ext.getCmp('btnIndicadoresEmpresaAddDemandaAceptar').disable();
        if (cbEmpresaAddDemanda.getValue() != undefined && cbEmpresaAddDemanda.getValue() != null && cbEmpresaAddDemanda.getValue() != ''
                && idindicador != undefined && idindicador != null && idindicador != ''
                && cantidadEmpresaAddDemanda.getValue() > 0
                && fechaLimite.getValue() != null && fechaLimite.getValue() != undefined && fechaLimite.getValue() != '') {
            Ext.getCmp('btnIndicadoresEmpresaAddDemandaAceptar').enable();
        }
    }
}
function gestionarObservacion() {
    selecting = false;
    stGestionarObservacion = new Ext.data.Store({
        id: 'stGestionarObservacion',
        url: 'listarObservaciones',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idobservacion'
        }, [{
                name: 'idobservacion'
            }, {
                name: 'iddemanda'
            }, {
                name: 'idusuario'
            }, {
                name: 'observacion'
            }, {
                name: 'fecha'
            }
        ]), listeners: {
            beforeload: function () {
                mymask.show();
                stGestionarObservacion.baseParams.iddemanda = smDemandaGestion.getSelected().data.iddemanda;
                stGestionarObservacion.baseParams.start = offsetGestionarObservacion;
            },
            load: function () {
                cambiarTituloFiltrar(gpGestionarObservacion, filtrosGestionarObservacion, perfil.etiquetas.lbTtleGestionarObservacion);
                if (stGestionarObservacion.getCount() == 0) {
                    if (filtrosGestionarObservacion.getFiltrosActivos() == undefined || filtrosGestionarObservacion.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);

                }
                smGestionarObservacion.clearSelections();
                gpGestionarObservacion.enable();
                controlarObjetosObservacion();
                mymask.hide();
            }
        }
    });
    filtrosGestionarObservacion = new Ext.grid.GridFilters({
        filters: [{
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbidusuarioObservacion',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'observacion'
            }]
    });
    cmGestionarObservacion = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            dataIndex: 'fecha',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 290,
            dataIndex: 'observacion',
            renderer: crearToolTip
        }
    ]);
    smGestionarObservacion = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                controlarObjetosObservacion();
            },
            rowdeselect: function () {
                controlarObjetosObservacion();
            }
        }
    });
    btnAdicionarObservacion = new Ext.Button({
        id: 'btnAdicionarObservacion',
        disabled: false,
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionar,
        handler: function () {
            textAreaObservacion.reset();

            fpGestionarObservacion.enable();
            textAreaObservacion.focus();
        }
    });
    btnGuardarObservacion = new Ext.Button({
        id: 'btnGuardarObservacion',
        disabled: true,
        iconCls: 'guardar',
        text: perfil.etiquetas.lbGuardar,
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        handler: function () {
            guardarObservacion();
        }
    });
    btnCancelarObservacion = new Ext.Button({
        id: 'btnCancelarObservacion',
        disabled: true,
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbCancelar,
        tooltip: perfil.etiquetas.lbCancelarInfo,
        enableKeyEvents: true,
        handler: function () {
            textAreaObservacion.reset();
            gpGestionarObservacion.enable();
            btnCancelarObservacion.disable();
            //controlarObjetosObservacion();
        }
    });
    btnLimpiarGestionarObservacion = new Ext.Button({
        id: 'btnLimpiarGestionarObservacion',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosGestionarObservacion.clearFilters();
        }
    });
    gpGestionarObservacion = new Ext.grid.GridPanel({
        plugins: filtrosGestionarObservacion,
        store: stGestionarObservacion,
        cm: cmGestionarObservacion,
        sm: smGestionarObservacion,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGestionarObservacion,
            displayInfo: true,
            items: ['-', btnLimpiarGestionarObservacion],
            listeners: {
                beforechange: function (p, e) {
                    offsetGestionarObservacion = e.start;
                }
            }
        }),
        region: 'center',
        width: 325,
        title: perfil.etiquetas.lbTtleGestionarObservacion,
        id: 'gpGestionarObservacion',
        tbar: [btnAdicionarObservacion]
    });
    textAreaObservacion = new Ext.form.TextArea({
        id: 'textAreaObservacion',
        frame: true,
        height: 150,
        anchor: '100%',
        maxLength: 255,
        allowBlank: false,
        fieldLabel: perfil.etiquetas.lbObservacion,
        enableKeyEvents: true,
        listeners: {
            keyup: function (e) {
                btnGuardarObservacion.enable();
            },
            focus: function () {
                gpGestionarObservacion.disable();
                btnGuardarObservacion.disable();
                btnCancelarObservacion.enable();
            }
        }
    });
    fpGestionarObservacion = new Ext.form.FormPanel({
        region: 'east',
        disabled: true,
        title: 'Ver/Editar Observacion',
        frame: true,
        labelWidth: 80,
        width: 325,
        items: [
            textAreaObservacion
        ],
        buttons: [btnGuardarObservacion, btnCancelarObservacion]
    });
    pGestionarObservacion = new Ext.Panel({
        width: 650,
        height: 300,
        layout: 'border',
        items: [
            gpGestionarObservacion,
            fpGestionarObservacion
        ]
    });
    wingestionarObservacion = new Ext.Window({
        id: 'wingestionarObservacion',
        modal: true,
        closeAction: 'destroy',
        width: 800,
        height: 350,
        layout: 'fit',
        resizable: false,
        items: [pGestionarObservacion],
        title: perfil.etiquetas.lbGestionarObservacion,
        listeners: {
            destroy: function () {
                stDemandaGestion.reload();
            }
        }

    });
    wingestionarObservacion.show();
    stGestionarObservacion.reload();
    function guardarObservacion() {
        mymask.show();
        selec1 = smDemandaGestion.getSelected();
        txtObservacion = textAreaObservacion.getValue();
        Ext.Ajax.request({
            url: 'guardarObservacion',
            params: {
                iddemanda: selec1.data.iddemanda,
                observacion: txtObservacion

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddOK);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddNO);
                }
                stGestionarObservacion.reload();
            }
        });
    }
    function controlarObjetosObservacion() {

        //btnGuardarObservacion.disable();
        selecObserv = smGestionarObservacion.getSelected();

        if (selecObserv != undefined) {

            textAreaObservacion.reset();
            textAreaObservacion.setValue(selecObserv.data.observacion);
            fpGestionarObservacion.enable();
        } else {
            textAreaObservacion.reset();
            fpGestionarObservacion.disable();
        }


    }
}

function controlarObjetos() {
    btnAdicionar.disable();
    btnEliminar.disable();
    btnGestionarObservacion.disable();
    btnExportar.disable();
    btnAprobarRector.disable();
    btnAprobarProveedor.disable();
    btnAprobarCliente.disable();
    btnDesaprobarProveedor.disable();
    btnDesaprobarCliente.disable();
    btnDesaprobarRector.disable();
    btnImportarDemanda.disable();
    if (cbComportamiento.getValue() == 1 && (comportEntidadLogCliente == true || comportEntidadLogProveedor == true)) {
        btnAdicionar.enable();
    }
    selec = gpDemandaGestion.getSelectionModel().getSelections();
    modified = gpDemandaGestion.getStore().getModifiedRecords();
    if (selec.length > 0) {
        if (selec.length == 1) {
            selec1 = smDemandaGestion.getSelected();
            if (cbComportamiento.getValue() == 1 && comportEntidadLogCliente == true && selec1.data.idaprobacion == 1) {
                btnEliminar.enable();
            }
            if (comportEntidadLogCliente == true || comportEntidadLogProveedor == true || comportEntidadLogRector == true) {
                btnGestionarObservacion.enable();
            }

            if (selec1.data.idaprobacion == 1 && comportEntidadLogProveedor && selec1.data.cantidadinicial > 0 && selec1.data.cantidadconfirmada > 0) {
                indexDestino = stDestino.find('iddatosnomenclador', selec1.data.iddestino);
                indexPrograma = stPrograma.find('iddatosnomenclador', selec1.data.idprograma);
                denomdestino = stDestino.getAt(indexDestino).data.denominacion;
                denomprograma = stPrograma.getAt(indexPrograma).data.denominacion;
                if (denomdestino != '-' && denomprograma != '-') {
                    btnAprobarProveedor.enable();
                }
            } else if (selec1.data.idaprobacion == 2) {
                if (cbComportamiento.getValue() == 1 && comportEntidadLogCliente == true) {
                    btnAprobarCliente.enable();
                } else if (cbComportamiento.getValue() == 2 && comportEntidadLogProveedor == true) {
                    btnDesaprobarProveedor.enable();
                }
            } else if (selec1.data.idaprobacion == 3 && comportEntidadLogRector == true) {
                btnAprobarRector.enable();
            } else if (selec1.data.idaprobacion == 3 && comportEntidadLogCliente == true) {
                btnDesaprobarCliente.enable();
            } else if (selec1.data.idaprobacion == 4 && comportEntidadLogRector == true) {
                btnDesaprobarRector.enable();
            }
        } else {
            //seleccion multiple
            if (cbComportamiento.getValue() == 1 && comportEntidadLogCliente == true) {
                btnEliminar.enable();
            }
            //si al menos un elemento cumple con la validacion se manda a activar
            aprobarCliente = false;
            desaprobarCliente = false;
            aprobarProveedor = false;
            desaprobarProveedor = false;
            aprobarRector = false;
            desaprobarRector = false;
            for (var i = 0; i < selec.length; i++) {
                if (selec[i].data.idaprobacion == 1 && comportEntidadLogProveedor && selec[i].data.cantidadinicial > 0 && selec[i].data.cantidadconfirmada > 0) {
                    indexDestino = stDestino.find('iddatosnomenclador', selec[i].data.iddestino);
                    indexPrograma = stPrograma.find('iddatosnomenclador', selec[i].data.idprograma);
                    denomdestino = stDestino.getAt(indexDestino).data.denominacion;
                    denomprograma = stPrograma.getAt(indexPrograma).data.denominacion;
                    if (denomdestino != '-' && denomprograma != '-') {
                        aprobarProveedor = true;
                    }
                } else if (selec[i].data.idaprobacion == 2) {
                    if (cbComportamiento.getValue() == 1 && comportEntidadLogCliente == true) {
                        aprobarCliente = true;
                    } else if (cbComportamiento.getValue() == 2 && comportEntidadLogProveedor == true) {
                        desaprobarProveedor = true;
                    }
                } else if (selec[i].data.idaprobacion == 3 && comportEntidadLogRector == true) {
                    aprobarRector = true;
                } else if (selec[i].data.idaprobacion == 3 && comportEntidadLogCliente == true) {
                    desaprobarCliente = true;
                } else if (selec[i].data.idaprobacion == 4 && comportEntidadLogRector == true) {
                    desaprobarRector = true;
                }
            }
            if (aprobarCliente)
                btnAprobarCliente.enable();
            if (desaprobarCliente)
                btnDesaprobarCliente.enable();
            if (aprobarProveedor)
                btnAprobarProveedor.enable();
            if (desaprobarProveedor)
                btnDesaprobarProveedor.enable();
            if (aprobarRector)
                btnAprobarRector.enable();
            if (desaprobarRector)
                btnDesaprobarRector.enable();

        }
    }
    if (gpDemandaGestion.getStore().getTotalCount() > 0) {
        btnExportar.enable();
    }
    if (cbComportamiento.getValue() == 1 /*&& comportEntidadLogCliente == true*/) {
        btnImportarDemanda.enable();
    }
}
function controlarEventos(name, event) {
    selec = gpDemandaGestion.getSelectionModel().getSelections();
    if (name == 'beforeedit') {
        if (comportEntidadLogRector == true) {
            event.cancel = true;
        } else if (selec.length == 1) {
            if (smDemandaGestion.getSelected().data.idaprobacion == 1) {
                if (cbComportamiento.getValue() == 1) {
                    if (event.field == 'iddestino' || event.field == 'idprograma' || event.field == 'ajuste') {
                        event.cancel = true;
                    } else {
                        btnGuardar.enable();
                    }
                } else if (cbComportamiento.getValue() == 2) {
                    if (event.field == 'cantidadinicial') {
                        event.cancel = true;
                    } else {
                        btnGuardar.enable();
                    }
                } else {
                    btnGuardar.enable();
                }
            } else {
//el cliente y el proveedor no modifica nada en el estado de aprobacion 2, 3 y 4
                event.cancel = true;
            }
        }
    }
}
function cambiarAprobacion(rol, accion, valor) {

    var seleccionados = gpDemandaGestion.getSelectionModel().getSelections();
    var valorAComprobar = 0;
    if (accion == 1) {
//aprobando...
        if (rol == 'proveedor')
            valorAComprobar = 1;
        else if (rol == 'cliente')
            valorAComprobar = 2;
        else if (rol == 'rector')
            valorAComprobar = 3;
    } else {
//desaprobando...
        if (rol == 'proveedor')
            valorAComprobar = 2;
        else if (rol == 'cliente')
            valorAComprobar = 3;
        else if (rol == 'rector')
            valorAComprobar = 4;
    }
    var demandas = [];
    for (var i = 0; i < seleccionados.length; i++) {
        if (seleccionados[i].data.idaprobacion == valorAComprobar) {
            if (seleccionados[i].data.cantidadconfirmada > 0 || accion == 0) {
//si estoy desaprobando... o la cantidad final es mayor que 0 (porque se está aprobando)
                demandas.push({
                    iddemanda: seleccionados[i].data.iddemanda
                });
            }
        }
    }
    if (demandas.length > 0) {
        if (accion == 1) {
//aprobando...
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarAprobarDemanda, aprobarDesaprobarDemanda);
        } else {
//desaprobando...
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarDesaprobarDemanda, aprobarDesaprobarDemanda);
        }
    } else {
        mostrarMensaje(1, perfil.etiquetas.lbMsgErrorNoDemandas);
        btnAprobarRector.disable();
        btnAprobarProveedor.disable();
        btnAprobarCliente.disable();
        btnDesaprobarProveedor.disable();
        btnDesaprobarCliente.disable();
        btnDesaprobarRector.disable();
        smDemandaGestion.clearSelections();
    }

    function aprobarDesaprobarDemanda(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'aprobarDesaprobarDemanda',
                params: {
                    demandas: Ext.encode(demandas),
                    accion: accion,
                    idaprobacion: valor,
                    rol: rol,
                    valorAComprobar: valorAComprobar
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (accion == 1) {
                        if (responseData.codMsgN == 1) {
                            if (demandas.length == 1) {

                                mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionAprobarDemanda);
                            } else {

                                mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionAprobarDemandas);
                            }
                        } else if (responseData.codMsgN == 0) {
                            if (demandas.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarDemanda);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarDemandas);
                            }
                        } else if (responseData.codMsgN == 2) {
                            mostrarMensaje(1, perfil.etiquetas.lbMsgErrorAprobarAlgunasDemandas);
                        }
                    } else {
                        if (responseData.codMsgN == 1) {
                            if (demandas.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionDesaprobarDemanda);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgInformacionDesaprobarDemandas);
                            }
                        } else if (responseData.codMsgN == 0) {
                            if (demandas.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarDemanda);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarDemandas);
                            }
                        } else if (responseData.codMsgN == 2) {
                            mostrarMensaje(1, perfil.etiquetas.lbMsgErrorDesaprobarAlgunasDemandas);
                        }
                    }
                    stDemandaGestion.reload();
                }
            });
        }
    }
}
function guardarDemanda() {
    mymask.show();
    recordsMod = gpDemandaGestion.getStore().getModifiedRecords();
    var arreglo = [];
    while (recordsMod.length > 0) {
        var record = recordsMod.pop();
        var rec = record.getChanges();
        rec['iddemanda'] = record.data['iddemanda'];
        arreglo.push(rec);
    }
    Ext.Ajax.request({
        url: 'guardarDemanda',
        waitMsg: perfil.etiquetas.lbGuardando,
        params: {
            demandas: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (recordsMod.length == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarOK);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarOKs);
                }
            } else if (responseData.codMsgN == 0) {
                if (recordsMod.length == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarNO);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgSegGuardarNOs);
                }
            } else if (responseData.codMsgN == 2) {
                mostrarMensaje(1, perfil.etiquetas.msgSegGuardarNOAlgunas);
            }
            stDemandaGestion.reload();
        }

    });
}

function eliminarDemanda() {
    recordsDel = gpDemandaGestion.getSelectionModel().getSelections();
    if (recordsDel.length == 1) {
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDemanda, del);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminarDemandas, del);
    }
    function del(btnPresionado) {
        array_demandas = [];
        if (btnPresionado == 'ok') {
            for (var i = 0; i < recordsDel.length; i++) {
                if (recordsDel[i].data.idaprobacion == 1) {
                    array_demandas.push({
                        iddemanda: recordsDel[i].data.iddemanda
                    });
                }
            }
            if (array_demandas.length > 0) {
                Ext.Ajax.request({
                    url: 'eliminarDemanda',
                    params: {
                        demandas: Ext.encode(array_demandas)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN == 1) {
                            if (recordsDel.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandaOK);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandasOK);
                            }
                        } else if (responseData.codMsgN == 0) {
                            if (recordsDel.length == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandaNO);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandasNO);
                            }
                        } else if (responseData.codMsgN == 2) {
                            mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandaNOAlgunas);
                        }
                        stDemandaGestion.reload();
                    }
                });
            } else {
                mostrarMensaje(1, perfil.etiquetas.msgSegEliminarDemandaInvalidasTodas);
            }
        }
    }
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
function renderNaturaleza(value, m) {
    if (value == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {
        m.attr = 'ext:qtip="' + value + '"';
        for (var i = 0; i < stNaturaleza.data.items.length; i++)
            if (stNaturaleza.data.items[i].data.naturaleza == value) {
                m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
                return stNaturaleza.data.items[i].data.denominacion;
            }
    }
}
function renderUM(value, m) {
    for (var i = 0; i < stum.getTotalCount(); i++) {
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}
function renderEntidades(value, m) {
    for (var i = 0; i < stEntidadesCliente.getTotalCount(); i++) {
        if (stEntidadesCliente.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stEntidadesCliente.data.items[i].data.denominacion + '"';
            return stEntidadesCliente.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
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
function renderAprobacion(val, m) {
    if (val === '1') {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
    } else if (val === '2') {
        m.css = 'icondistra-true amarillo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoEmpresa + '"';
    } else if (val === '3') { //Organo empresarial UIM
        m.css = 'icondistra-true verde';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoCliente + '"';
    } else if (val === '4') { //Organo Rector (UIM)
        m.css = 'icondistra-true azul';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoRector + '"';
    }
}
function renderFecha(val, m) {
    try {
        if (val != null) {
            var temp = val.split('.');
            var val2 = temp[0];
            var temp2 = val2.split(' ');
            m.attr = 'ext:qtip="' + temp2[1] + '"';
            var fecha = (temp2[0]).split('/');
            var fechafix = fecha[0] + '-' + fecha[1] + '-' + fecha[2]
            return fechafix;
        }
        return val;
    } catch (err) {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}
function renderMoneda(val) {
    return parseFloat(val).toFixed(2);
}
function renderCantidad(val) {
    return parseFloat(val).toFixed(3);
}
function renderBinario(val, m) {
    if (val === '1') {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else if (val === '0') {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
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
function obterComportamientoPorEntidad() {
    mymask.show();
    Ext.Ajax.request({
        url: 'obtenerComportamientoPorEntidad',
        params: {
            identidad: nodoEst.id
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            identidadEsOD = responseData;
            if (identidadEsOD.codMsgN == 1 || (comportEntidadLogRector == true && identidadEsOD.codMsgN == 2)) {
                stTipoComportamiento.baseParams.identidad = entidadSelecc;
                stTipoComportamiento.reload();
                pDemanda.enable();
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgEntidadNoOD);
                pDemanda.disable()
                if (stDemandaGestion.reader != undefined)
                    stDemandaGestion.loadData({"data": [], "total": 0});
            }
            mymask.hide();
        }
    });
}
function controlarObjetosAprobacion() {
    btnAprobarCliente.hide();
    btnDesaprobarCliente.hide();
    btnAprobarProveedor.hide();
    btnDesaprobarProveedor.hide();
    if (cbComportamiento.getValue() == 1 && comportEntidadLogCliente == true) {
        btnAprobarCliente.show();
        btnDesaprobarCliente.show();
    } else if (cbComportamiento.getValue() == 2 && comportEntidadLogProveedor == true) {
        btnAprobarProveedor.show();
        btnDesaprobarProveedor.show();
    }
}

function upColorCellDemandas() {
    for (var i = 0; i < stDemandaGestion.getCount(); i++) {
        for (var j = 0; j < cmDemandaGestion.getColumnCount(); j++) {
            //desaprobado (rojo)
            if (stDemandaGestion.getAt(i).data.idaprobacion == 1) {
                Ext.get(Ext.getCmp('gpDemandaGestion').getView().getCell(i, j)).applyStyles('background-color:#FFCCAA ');
            } else
            //aprobado proveedor (amarillo)
            if (stDemandaGestion.getAt(i).data.idaprobacion == 2) {
                Ext.get(Ext.getCmp('gpDemandaGestion').getView().getCell(i, j)).applyStyles('background-color:#F7FF7B');
            } else
            //aprobado cliente (verde)
            if (stDemandaGestion.getAt(i).data.idaprobacion == 3) {
                Ext.get(Ext.getCmp('gpDemandaGestion').getView().getCell(i, j)).applyStyles('background-color:#CCFFCC');
            } else
            //aprobado rector (azul)
            if (stDemandaGestion.getAt(i).data.idaprobacion == 4) {
                Ext.get(Ext.getCmp('gpDemandaGestion').getView().getCell(i, j)).applyStyles('background-color:#b1d7fe');//
            }
        }
    }
}

