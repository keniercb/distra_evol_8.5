//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
var indicadores = [];
var gestionSegunEstEjercicioCTE = true;
UCID.portal.cargarEtiquetas('calculocobertura', cargarInterfaz);
var stCmbEntidades, CmbEntidades, objci, btnGCobertura, titulo, identidadseleccionada, is_leaf, nombrentidadseleccionada, teclascalientes;
function cargarInterfaz() {
    var pCalculoCobertura;
    //ar _this = this;

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    mymask.show();
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function (options, success, response) {
            objci = Ext.decode(response.responseText);
            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    mymask.hide();
                    if (objci.acciones.rector)//organo rector
                    {
                        btnActualizarCalculoCTE.show();
                        btnActualizarCalculoCTE.disable();
                        CmbEntidades.enable();
                        titulo = 'Existencias';
                        stCmbEntidades.load();
                        btnGCobertura.disable();
                    } else {
                        btnActualizarCalculoCTE.hide();
                    }
                });
            }
        }
    });

    stum = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/cargarunidadmedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idunidadmedida'
            },
            [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    stum.reload();

    stCentroBalance = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/listarCentroBalance',
        reader: new Ext.data.JsonReader({
            id: 'idcentrobalance',
            root: 'data'
        }, [{
            name: 'idcentrobalance'
        }, {
            name: 'centrobalance'
        }])
    });
    stCentroBalance.reload();

    btnAyudaCobertura = new Ext.Button({
        disabled: false,
        id: 'btnAyuCalculoCobertura',
        //icon: perfil.dirImg + 'ayuda.png',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda
    });
    //Boton para actualizar los datos de CONMAT y Tecnoimport

    btnActualizarCalculoCTE = new Ext.Button({
        disabled: false,
        id: 'btnActualizarCalculoCTE',
        //icon: perfil.dirImg + 'actualizar.png',
        tooltip: 'Actualizar',
        iconCls: 'actualizar',
        // text: 'Actualizar cálculo CTE',
        handler: function () {
            actualizarCoberturaCTE();
        }
    });

    btnAprobTodos = new Ext.Button({
        disabled: false,
        id: 'btnAprobTodos',
        tabIndex: 4,
        tooltip: perfil.etiquetas.lbBtnAprobarTodos,
        //icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'aprobar',
        // text: perfil.etiquetas.lbBtnAprobarTodos,
        handler: function () {

        }
    });
    btnDesTodos = new Ext.Button({
        disabled: false,
        id: 'btnDesTodos',
        //icon: perfil.dirImg + 'desaprobar.png',
        tooltip: perfil.etiquetas.lbBtnDesaprobarTodos,
        iconCls: 'desaprobar',
        // text: perfil.etiquetas.lbBtnDesaprobarTodos,
        handler: function () {

        }
    });

    btnGCobertura = new Ext.Button({
        id: 'btnGCobertura',
        // icon: perfil.dirImg + 'guardar.png',
        tooltip: perfil.etiquetas.lbBtnGuardar + ' (<b>Alt+G</b>)',
        iconCls: 'guardar',
        disabled: true,
        // text: perfil.etiquetas.lbBtnGuardar,
        handler: function () {
            ActualizarCamposAjusteEntidad();
        }
    });
// Este boton se quito del tbar
    btnAdicionarC = new Ext.Button({
        id: 'btnAdicionarC',
        // icon: perfil.dirImg + 'adicionar.png',
        disabled: true,
        iconCls: 'adicionar',
        // text: 'Adicionar',
        handler: function () {
            winAdd.setTitle('Adicionar indicadores');
            winAdd.show();
            storeIndicadores.load({
                params: {
                    limit: 20,
                    start: 0
                }
            });
        }
    });
// Este boton se quito del tbar
    btnEliminarC = new Ext.Button({
        id: 'btnEliminarC',
        // icon: perfil.dirImg + 'eliminar.png',
        disabled: true,
        iconCls: 'eliminar',
        // text: 'Eliminar',
        handler: function () {
            eliminarIndExist();
        }
    });

    btnLimpiarFcob = new Ext.Button({
        id: 'btnLimpiarFcob',
        //icon: perfil.dirImg + 'limpiar.png',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        iconCls: 'limpiar',
        // text: perfil.etiquetas.lbBtnLimpiar,
        handler: function () {

            limpiarfiltrosCobertura();

        }
    });
    btnLimpiarFindica = new Ext.Button({
        id: 'btnLimpiarFindica',
        // icon: perfil.dirImg + 'limpiar.png',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        iconCls: 'limpiar',
        //  text: perfil.etiquetas.lbBtnLimpiar,
        handler: function () {

            limpiarfiltrosIndAddCob();

        }
    });

    btnExportar = new Ext.Button({
        id: 'btnExportar',
        // icon: perfil.dirImg + 'exportar.png',
        tooltip: perfil.etiquetas.lbBtnExportar + '(<b>Alt+E</b>)',
        iconCls: 'exportar',
        // text: perfil.etiquetas.lbBtnExportar,
        disabled: true,
        handler: function () {

            filtros = filtrosCalculoCobertura.getFilterData();

            var win = window.open('exportar?filtros=' + Ext.encode(filtros) + '& identsel= ' + identidadseleccionada + '& idejercicio= ' + cbEjercicio.getValue() + '& nomsel= ' + nombrentidadseleccionada);

        }
    });

    storeIndicadores = new Ext.data.Store({
        url: 'listarIndCC',
        method: 'POST',
        listeners: {
            beforeload: function (st, opt) {
                this.baseParams.identidad = identidadseleccionada;
                this.baseParams.hoja = is_leaf;
                this.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function (st, opt) {
                if (storeIndicadores.getCount() == 0) {
                    winAdd.hide();
                    mostrarMensaje(1, 'No existen indicadores a mostrar.');
                }
            }

        },
        reader: new Ext.data.JsonReader({
            id: 'codigo',
            root: 'data',
            totalProperty: 'total'
        }, [{
            name: 'plan'
        }, {
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'idumedida'
        }, {
            name: 'numeropieza'
        }, {
            name: 'identidad'
        }, {
            name: 'idindicador'
        }, {
            name: 'cantidad'
        }, {
            name: 'importe'
        }
        ])

    });
    smGpIndicadores = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (obj, i, r) {
            },
            rowdeselect: function (obj, i, r) {


            }
        }
    });

    //Creando el objeto Ext.grid.ColumnModel

    cmIndicadores = new Ext.grid.ColumnModel([
        smGpIndicadores,
        {
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: perfil.etiquetas.lbCodigo,
            renderer: crearToolTip
        }, {
            header: 'Número de Pieza',
            width: 110,
            sortable: true,
            dataIndex: 'numeropieza',
            tooltip: perfil.etiquetas.lbNumPieza,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            width: 300,
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTip
        }, {
            header: 'Unidad de Medida',
            width: 110,
            sortable: true,
            dataIndex: 'idumedida',
            tooltip: perfil.etiquetas.lbUM,
            renderer: crearToolTip
        }

    ]);

    filtrosaddindicadores = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'codigo',
            xtype: 'numberfield',
            idTextField: 'filtrocodigo',
            anchor: '95%',
            fieldLabel: '',
            disabled: false,
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }/*,
             {
             type: 'listado',
             dataIndex: 'idumedida',
             idcombo: 'filtroumed',
             urlcb: '../gestmodelo/cargarunidadmedida',
             idstore: 'idstumindicadores',
             valueFieldcb: 'idunidadmedida',
             displayFieldcb: 'nombreum'
             }*/
        ]
    });

    rsmIndicadores = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {


            }

        }
    });

    gpIndicadores = new Ext.grid.GridPanel({
        region: 'center',
        id: 'gpIndicadores',
        store: storeIndicadores,
        sm: smGpIndicadores,
        plugins: filtrosaddindicadores,
        cm: cmIndicadores,
        height: 475,
        width: 670,
        loadMask: {
            store: storeIndicadores
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeIndicadores,
            displayInfo: true,
            items: [btnLimpiarFindica]
        }),
        listeners: {
            beforedit: function (cm) {

            },
            afteredit: function () {
                Ext.getCmp('btnGCobertura').enable();
            }
        }
    });

    fpCalculoCobertura = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpCalculoCobertura',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {
            render: function (f) {
            }
        },
        items: [{
            layout: 'column',
            items: [gpIndicadores]
        }]
    });

    winAdd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        constrain: true,
        width: 710,
        height: 560,
        items: fpCalculoCobertura,
        buttons: [{
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: perfil.etiquetas.lbTtBtnCancelar,
            handler: function () {
                fpCalculoCobertura.getForm().reset();
                winAdd.hide();

            }
        }, {
            //icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            id: 'btnaplicar',
            text: 'Aplicar',
            tooltip: perfil.etiquetas.lbTtBtnAplicar,
            handler: function () {
                adicionarIndExist();
                if (Ext.getCmp('gpIndicadores').getSelectionModel().getSelected() == undefined) {
                    mostrarMensaje(1, 'Debe seleccionar al menos un indicador');
                }

            }
        }, {
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'btnaceptar',
            text: 'Aceptar',
            tooltip: perfil.etiquetas.lbTTBtnAceptar,
            handler: function () {
                adicionarIndExist();
                if (Ext.getCmp('gpIndicadores').getSelectionModel().getSelected() == undefined) {
                    mostrarMensaje(1, 'Debe seleccionar al menos un indicador');
                } else {
                    winAdd.hide();
                }
            }
        }]
    });

    stCmbEntidades = new Ext.data.Store({
        url: 'ListarCombEntidades',
        reader: new Ext.data.JsonReader({
                id: 'identidad',
                root: 'data'
            },
            [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }, {
                name: 'identidaddatosnomenclador'

            }])
    });

    // -------------Fin del Store del combo de Centros de Balance

    //Combo para los Centros de Balance

    CmbEntidades = new Ext.form.ComboBox({
        tabIndex: 10,
        allowBlank: false,
        emptyText: "Seleccione",
        width: 150,
        listWidth: 250,
        store: stCmbEntidades,
        valueField: 'identidad',
        displayField: 'denominacion',
        id: 'CmbEntidades',
        mode: 'local',
        editable: false,
        triggerAction: 'all',
        disabled: true,
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: false,
        listeners: {
            select: function () {
                gpCalculoCobertura.getStore().removeAll();
                gpCalculoCobertura.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20,
                        identL: CmbEntidades.getValue()

                    }
                });
                btnExportar.enable();
                idtipoent = CmbEntidades.getValue();
                stCalculoCobertura.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                stCmbEntidades.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 22) {
                    mostrarMensaje(1, 'No existen indicadores asociados al Centro de balance seleccionado');

                }
            }
        }
    });

    stCalculoCobertura = new Ext.data.Store({
        url: 'listarindicadores',
        listeners: {
            beforeload: function (st, opt) {
                Ext.getCmp('btnEliminarC').disable();
                if (!objci.acciones.rector)
                    stCalculoCobertura.baseParams.identL = identidadseleccionada;
                else
                    stCalculoCobertura.baseParams.identL = identidadseleccionada;
                stCalculoCobertura.baseParams.idejercicio = cbEjercicio.getValue();
                filtroscobertura();

            },
            load: function () {
                if (stCalculoCobertura.getCount() == 0) {
                    btnExportar.disable();
                } else
                    btnExportar.enable();
                if (stCalculoCobertura.getCount() == 0) {
                    if (filtrosCalculoCobertura.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
                    } else {
                        mostrarMensaje(1, "No existen datos que mostrar");
                    }
                }

            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "data",
                id: "idajusteexistencia"
            },
            [{
                name: 'idajusteexistencia'
            },
                {
                    name: 'identidad'
                },
                {
                    name: 'idindicador'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'numeropieza'
                }, {
                name: 'denominacion'
            },
                {
                    name: 'cantidadeninventario'
                }, {
                name: 'cantidadcontratado'
            }, {
                name: 'mercanciaentransito'
            }, {
                name: 'necesidadannoactual'
            },
                {
                    name: 'coberturatotalestimada'
                },
                {
                    name: 'cteoriginal'
                },
                {
                    name: 'idajustecb'
                }, {
                name: 'RM'
            }, {
                name: 'economia'
            }, {
                name: 'conmat'
            }, {
                name: 'idumedida'
            }, {
                name: 'idcentrobalance'
            }])
    });

    cmCalculoCobertura = new Ext.grid.ColumnModel([
        {
            dataIndex: 'codigo',
            header: perfil.etiquetas.lbCodigo,
            sortable: true,
            width: 70,
            tooltip: perfil.etiquetas.lbCodigo,
            renderer: crearToolTip
        },
        {
            dataIndex: 'numeropieza',
            header: perfil.etiquetas.lbnropieza,
            sortable: true,
            width: 70,
            align: 'left',
            tooltip: perfil.etiquetas.lbnropieza,
            renderer: crearToolTip
        },
        {
            dataIndex: 'denominacion',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            width: 150,
            id: 'expand',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            tooltip: perfil.etiquetas.lbCentroBalance,
            sortable: true,
            dataIndex: 'idcentrobalance',
            renderer: renderCB
        },
        {
            dataIndex: 'cantidadeninventario',
            header: perfil.etiquetas.lbInventario,
            width: 70,
            align: 'right',
            sortable: true,
            tooltip: perfil.etiquetas.lbInventario,
            renderer: modificarEstado,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'mercanciaentransito',
            header: 'Tránsito',
            width: 70,
            align: 'right',
            sortable: true,
            tooltip: perfil.etiquetas.lbMercanciaEnTransito,
            renderer: modificarEstado,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'cantidadcontratado',
            header: perfil.etiquetas.lbContratados,
            width: 90,
            align: 'right',
            sortable: true,
            renderer: modificarEstado,
            tooltip: perfil.etiquetas.lbContratados,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'necesidadannoactual',
            header: perfil.etiquetas.lbDemAñoActual,
            width: 90,
            align: 'right',
            tooltip: 'Necesidad año actual',
            sortable: true,
            renderer: modificarEstado,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'coberturatotalestimada',
            header: perfil.etiquetas.lbCTE,
            width: 70,
            tooltip: 'Cobertura total estimada',
            align: 'right',
            sortable: true,
            renderer: modificarEstado
        },
        {
            dataIndex: 'cteoriginal',
            header: 'CTE inicial',
            width: 90,
            align: 'right',
            sortable: true,
            tooltip: 'Cobertura inicial',
            renderer: crearToolTip
        },
        {
            dataIndex: 'RM',
            header: perfil.etiquetas.lbRM,
            width: 70,
            align: 'right',
            tooltip: 'Reserva del ministro',
            sortable: true,
            renderer: modificarEstado,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                minValue: 0.000000000000
            })
        }, {
            dataIndex: 'economia',
            header: perfil.etiquetas.lbEconomia,
            width: 70,
            tooltip: 'Reserva de economía',
            align: 'right',
            sortable: true,
            renderer: modificarEstado,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                minValue: 0.000000000000
            })
        }, {
            dataIndex: 'conmat',
            header: 'CONMAT',
            width: 80,
            align: 'center',
            tooltip: 'CONMAT',
            align: 'center',
            sortable: true,
            renderer: modificarEstado2

        }]);

    filtrosCalculoCobertura = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'codigo',
            xtype: 'numberfield',
            idTextField: 'filtrocodigo',
            anchor: '95%',
            fieldLabel: '',
            disabled: false,
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'numeric',
                dataIndex: 'RM'
            },
            {
                type: 'numeric',
                dataIndex: 'coberturatotalestimada'
            },
            {
                type: 'numeric',
                dataIndex: 'cteoriginal'
            },
            {
                type: 'numeric',
                dataIndex: 'economia'
            },
            {
                type: 'numeric',
                dataIndex: 'necesidadannoactual'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidadcontratado'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidadeninventario'
            },
            {
                type: 'numeric',
                dataIndex: 'mercanciaentransito'
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'list',
                dataIndex: 'conmat',
                options: ['Si', 'No']
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idcentrobalance',
                idcombo: 'idcbcentrobalance',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                st: stCentroBalance,
                autoload: false,
                mode: 'local'
            }]
    });

    //*************************************
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                //aki no hace falta el validar para el estado Elaboracion ya que se garantiza en Configurar ejercicios
                //que el ejercicio actual solo es de tipo estado Elaboracion
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                gestionarPermiso();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
            name: 'idejercicio'
        }, {
            name: 'ejercicio'
        }, {
            name: 'estado'
        }, {
            name: 'uridatosnomenclador'
        }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                stCalculoCobertura.reload({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        limit: 20,
                        start: 0
                    }
                });
                gestionarPermiso();

                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioCTE = false;
                } else {
                    gestionSegunEstEjercicioCTE = true;
                }
            }
        }
    });

    smgpCalculoCobertura = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (x, y, w) {
                Ext.getCmp('btnEliminarC').enable();

            },
            rowdeselect: function (s, n, r) {

            }
        }
    });

    gpCalculoCobertura = new Ext.grid.EditorGridPanel({
        title: 'Existencias',
        store: stCalculoCobertura,
        sm: smgpCalculoCobertura,
        region: 'center',
        height: 800,
        plugins: filtrosCalculoCobertura,
        autoExpandColumn: 'expand',
        id: 'gpCobertura',
        autoExpandMin: 50,
        cm: cmCalculoCobertura,
        listeners: {
            validateedit: function (sm) {

                idajusteent = sm.record.data.idajusteexistencia;
                idindicador = sm.record.data.idindicador;
                identidad = sm.record.data.identidad;
                campo = sm.field;
                valor = sm.value;

            },
            beforeedit: function (e) {
                fila = e.row;
                columna = e.column;
                if (objci.acciones.rector) {
                    e.cancel = true;
                }

                if (!gestionSegunEstEjercicioCTE) {
                    e.cancel = true;
                } else {
                    e.cancel = false;
                }

            },
            afteredit: function () {
                btnGCobertura.enable();
            }
        },
        loadMask: {
            store: stCalculoCobertura
        },
        tbar: [
            '-', btnGCobertura, btnActualizarCalculoCTE, '-', btnExportar, 'Ejercicio:', cbEjercicio, '->', btnAyudaCobertura
        ],
        bbar: new Ext.PagingToolbar({
            id: 'paginado1',
            pageSize: 20,
            store: stCalculoCobertura,
            displayInfo: true,
            items: [btnLimpiarFcob]
        })
    });

    tpEstructuraCobertura = new Ext.estructura.panel.PanelEstructura(
        {
            cargos: false,
            menu: false,
            width: 300
        });
    tpEstructuraCobertura.btnBuscar.setText("");
    tpEstructuraCobertura.btnLimpiar.setText("");
    tpEstructuraCobertura = tpEstructuraCobertura.items.items[0];
    tpEstructuraCobertura.getRootNode().expand();
    tpEstructuraCobertura.region = 'west';
    tpEstructuraCobertura.addListener('click', function (n) {

        if (n.text != "Estructuras") {
            gpCalculoCobertura.enable();
            btnActualizarCalculoCTE.enable();
            if (n.id != 0) {
                identidadseleccionada = n.id;
                nombrentidadseleccionada = n.text;
                is_leaf = n.leaf;
                titulo = 'Existencias ' + '(' + n.text + ')';
                gpCalculoCobertura.setTitle(titulo);
                Ext.getCmp('btnAdicionarC').enable();
                cbEjercicio.enable();
                stCalculoCobertura.removeAll();
                stCalculoCobertura.load({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        limit: 20,
                        start: 0
                    }
                });
            }
        } else {
            gpCalculoCobertura.disable();
            var store = gpCalculoCobertura.getStore();
            store.loadData({"data": [], "total": 0});

        }
    });

    pCalculoCobertura = new Ext.Panel({
        layout: 'border',
        items: [tpEstructuraCobertura, gpCalculoCobertura]
    });

    vpCalculoCovertura = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCalculoCovertura',
        items: [pCalculoCobertura],
        listeners: {
            'afterlayout': function () {
                //  Ext.getCmp('btnAyuCalculoCobertura').focus();
            }
        }
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Gg',
            alt: true,
            fn: function () {
                if (!btnGCobertura.hidden) {
                    if (!btnGCobertura.disabled)
                        ActualizarCamposAjusteEntidad();

                }

            }
        },
        {
            key: 'Hh',
            alt: true,
            fn: function () {
//                if (!btnAyudaCobertura.hidden) {
//                    if (!btnAyudaCobertura.disabled)
//                        mostrarAyuda('Calculo de cobertura');
//                }

            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (!btnLimpiarFcob.hidden) {
                    if (!btnLimpiarFcob.disabled)
                        limpiarfiltrosCobertura();
                }

            }

        }

    ]);

    teclascalientes = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (me) {
                if (!Ext.getCmp('btnExportar').disabled) {
                    Ext.getCmp('btnExportar').handler.call(this);
                }
            }
        }

    ])

}

function modificarEstado(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return 0;
    return val;
}

ActualizarCamposAjusteEntidad = function () {

    var editadas = stCalculoCobertura.getModifiedRecords();

    var arreglo = [];
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();

        rec['idajusteexistencia'] = record.data['idajusteexistencia'];
        rec['identidad'] = identidadseleccionada;
        rec['idindicador'] = record.data['idindicador'];
        rec['idejercicio'] = cbEjercicio.getValue();

        arreglo.push(rec);
    }

    editado = true;
    Ext.Ajax.request({
        url: 'calcularCTE',
        params: {
            array: Ext.encode(arreglo)
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgL == 23) {
                mostrarMensaje(1, perfil.etiquetas.msgCoberturaVacia);
            }
            if (responseData.codMsgL == 24) {
                mostrarMensaje(1, perfil.etiquetas.msgCoberturaValida);
            }
            if (responseData.codMsgL == 25) {
                mostrarMensaje(3, perfil.etiquetas.msgCoberturaInvalida);
            }
            gpCalculoCobertura.getStore().reload();
            smgpCalculoCobertura.clearSelections();
            Ext.getCmp('btnGCobertura').disable();
        }
    });

}

function filtroscobertura() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosCalculoCobertura.getFiltrosActivos() == undefined || filtrosCalculoCobertura.getFiltrosActivos().length == 0) {
        gpCalculoCobertura.setTitle(titulo);
    } else {
        for (i = 0; i < filtrosCalculoCobertura.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = 'código';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "numeropieza") {//
                aux = 'no pieza';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = 'denominación';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "denominacioncb") {
                aux = 'centro de balance';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "cantidadeninventario") {
                aux = 'inventario';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "cteoriginal") {//
                aux = 'cteoriginal';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "mercanciaentransito") {
                aux = 'tráncito';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "cantidadcontratado") {
                aux = 'contratados';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "necesidadannoactual") {
                aux = 'necesidad';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "coberturatotalestimada") {
                aux = 'CTE';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = 'aprobado';
            }
            else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "idumedida") {
                aux = 'unidad de medida';
            } else if (filtrosCalculoCobertura.getFiltrosActivos()[i].dataIndex == "idcentrobalance") {
                aux = 'centro de balance';
            }
            if (i == filtrosCalculoCobertura.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpCalculoCobertura.setTitle(titulo + ' filtrados por  : ' + filtrado_por);
        filtrado_por = "";
    }
}

function limpiarfiltrosCobertura() {


    if (gpCalculoCobertura.getStore().getCount() >= 0 && (filtrosCalculoCobertura.getFiltrosActivos()[0] != undefined || filtrosCalculoCobertura.getFiltrosActivos().length != 0)) {
        filtrosCalculoCobertura.clearFilters();
    } else if (filtrosCalculoCobertura.getFiltrosActivos()[0] == undefined || filtrosCalculoCobertura.getFiltrosActivos().length == 0) {

        mostrarMensaje(1, 'No existen elementos filtrados.');
    }
}

function limpiarfiltrosIndAddCob() {


    if (gpIndicadores.getStore().getCount() >= 1 && (filtrosaddindicadores.getFiltrosActivos()[0] != undefined || filtrosaddindicadores.getFiltrosActivos().length != 0)) {
        filtrosaddindicadores.clearFilters();
    } else if (filtrosaddindicadores.getFiltrosActivos()[0] == undefined || filtrosaddindicadores.getFiltrosActivos().length == 0) {

        mostrarMensaje(1, 'No existen elementos filtrados.');
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function actualizarCoberturaCTE() {
    mostrarMensaje(2, '¿Está seguro que quiere actualizar la CTE de la entidad seleccionada?', actualizarCTE);
    function actualizarCTE(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: 'Por favor espere ...',
                msg: 'Actualizando CTE',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });
            Ext.Ajax.timeout = 60000;
            Ext.Ajax.request({
                url: 'actualizarCTE',
                params: {
                    identidad: identidadseleccionada,
                    is_leaf: is_leaf
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 21) {
                        mostrarMensaje(1, 'La CTE se a actualizado correctamente');
                    } else {
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                    if (identidadseleccionada) {
                        gpCalculoCobertura.getStore().removeAll();
                        gpCalculoCobertura.getStore().reload();
                    }

                }
            });
            Ext.MessageBox.hide();
        }
    }

}

function actualizarIndDesdePlan() {
    mostrarMensaje(2, '¿Está seguro que quiere actualizar los indicadores planificados ?', actualizarIndPLanif);
    function actualizarIndPLanif(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: 'Por favor espere ...',
                msg: 'Actualizando indicadores planificados. Esta operación puede tardar varios minutos.',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });
            Ext.Ajax.timeout = 3200000;
            Ext.Ajax.request({
                url: 'actualizarDesdePlan',
                params: {},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 21) {
                        mostrarMensaje(1, 'Los indicadores planificados se han actualizado correctamente');
                    } else {
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                    if (identidadseleccionada) {
                        gpCalculoCobertura.getStore().removeAll();
                        gpCalculoCobertura.getStore().reload();
                    }

                }
            });
        }
    }

}

function modificarEstado2(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + "Sí" + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + "No" + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stum.data.items)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
}

function renderCB(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stCentroBalance.data.items.length; i++) {
        if (stCentroBalance.data.items[i].data.idcentrobalance == value) {
            m.attr = 'ext:qtip="' + stCentroBalance.data.items[i].data.centrobalance + '"';
            return stCentroBalance.data.items[i].data.centrobalance;
        }
    }
}

function adicionarIndExist() {

    var filasel = Ext.getCmp('gpIndicadores').getSelectionModel().getSelections();
    var arraymandar = [];
    for (var i = 0; i < filasel.length; i++) {
        campos = {
            idindicador: filasel[i].data.idindicador
        };
        arraymandar.push(campos);
    }

    if (identidadseleccionada == null) {
        mostrarMensaje(1, 'Debe seleccionar una entidad.');
    } else {
        mymask.show();
        Ext.Ajax.request({
            url: 'adicionarIndCC',
            params: {
                idejercicio: cbEjercicio.getValue(),
                identidad: identidadseleccionada,
                idindicadores: Ext.encode(arraymandar)
            },
            callback: function (options, success, response) {

                responseData = Ext.decode(response.responseText);
                mymask.hide();
                if (responseData.codMsg == 21) {
                    mostrarMensaje(1, 'Los indicadores se han adicionado correctamente.');
                    if (identidadseleccionada) {
                        gpCalculoCobertura.getStore().reload();
                    }
                } else {
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(3, 'Existen indicadores repetidos');
                        if (identidadseleccionada) {
                            gpCalculoCobertura.getStore().reload();
                        }
                    } else {
                        mostrarMensaje(3, 'No puede repetir los indicadores');
                        if (identidadseleccionada) {
                            gpCalculoCobertura.getStore().reload();
                        }
                    }
                }

            }
        });

    }
}

function gestionarPermiso() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (responseData.data.length == 0) {
                //Ext.getCmp('btnGCobertura').hide();
                Ext.getCmp('btnEliminarC').hide();
                Ext.getCmp('btnAdicionarC').hide();
            } else {

                if (responseData.data[0].insertar != '1') {
                    Ext.getCmp('btnAdicionarC').hide();
                } else {
                    Ext.getCmp('btnAdicionarC').show();
                }
                if (responseData.data[0].eliminar != '1') {
                    Ext.getCmp('btnEliminarC').hide();
                } else {
                    Ext.getCmp('btnEliminarC').show();
                }
                /* if (responseData.data[0].guardar != '1') {
                 Ext.getCmp('btnGCobertura').hide();
                 } else {*/
                Ext.getCmp('btnGCobertura').show();
                // }
            }
        }
    });
}

function eliminarIndExist() {
    mymask.show();
    Ext.Ajax.request({
        url: 'eliminarIndCC',
        params: {
            idajusteexistencia: Ext.getCmp('gpCobertura').getSelectionModel().getSelected().data.idajusteexistencia
        },
        callback: function (options, success, response) {

            responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (responseData.codMsg == 21) {
                mostrarMensaje(1, 'Se ha eliminado correctamente.');
                if (identidadseleccionada) {
                    gpCalculoCobertura.getStore().reload();
                }
            } else {
                mostrarMensaje(3, 'Ocurrió un error');
                if (identidadseleccionada) {
                    gpCalculoCobertura.getStore().reload();
                }

            }

        }
    });

}