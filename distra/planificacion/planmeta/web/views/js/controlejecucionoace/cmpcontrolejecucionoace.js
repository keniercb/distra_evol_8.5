var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
//Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('cmpcontrolejecucionoace', cargarInterfaz);
var msjeliminar = 0;
var idsCentrobalance = [];
var denomCentrobalance = [];
//Ext.QuickTips.init();


function cargarInterfaz() {
    var _this = this;


    upColorCell = function () {
        for (var i = 0; i < _this.stDemanda.getCount(); i++) {
            for (var j = 0; j < 18; j++) {
                if (_this.stDemanda.getAt(i).data.tipo == 1) {
                    Ext.get(_this.gdPlanInd.getView().getCell(i, j))
                        .applyStyles('background-color:#FFCCCC');
                }
            }
        }
    };

    this.stCbMes = new Ext.data.SimpleStore({
        fields: ['idmes', 'mes'],
        data: [
            [0, 'Todos'],
            [01, 'Enero'],
            [02, 'Febrero'],
            [03, 'Marzo'],
            [04, 'Abril'],
            [05, 'Mayo'],
            [06, 'Junio'],
            [07, 'Julio'],
            [08, 'Agosto'],
            [09, 'Septiembre'],
            [10, 'Octubre'],
            [11, 'Noviembre'],
            [12, 'Diciembre']]
    });
    this.stReporte = new Ext.data.SimpleStore({
        fields: ['idreporte', 'reporte'],
        data: [
            [0, 'Contratación y ejecución'],
            [1, 'Cantidades y valores ejecutados de cada Centro de Balance'],
            [2, 'Reporte 3'],
            [3, 'Reporte 4']]
    });
    this.stCbValor = new Ext.data.SimpleStore({
        fields: ['idvalor', 'valor'],
        data: [
            [1, 'Todos'],
            [2, 'Pendientes Contratar'],
            [3, 'Contratados'],
            [4, 'Pendientes Ejecutar'],
            [5, 'Cumplimentados']
        ]


    });
    this.stCbCant = new Ext.data.SimpleStore({
        fields: ['idcant', 'cant'],
        data: [
            [1, 'Todos'],
            [2, 'Pendientes Contratar'],
            [3, 'Contratados'],
            [4, 'Pendientes Ejecutar'],
            [5, 'Cumplimentados']
        ]


    });
    this.stCbImporte = new Ext.data.SimpleStore({
        fields: ['idimporte', 'importe'],
        data: [
            [1, 'Importe Total Aprobado'],
            [2, 'Importe Total Contratado'],
            [3, 'Importe Total Ejecutado']

        ]
    });
    this.stCbInd = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    this.stTotal = new Ext.data.Store({
        autoLoad: true,
        url: 'listarTotal',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
            name: 'idTotal'
        }, {
            name: 'importeplanif'
        }, {
            name: 'importecontratado'
        }, {
            name: 'importeejecutado'
        }
        ])
    });
    this.stcbCentroBalance = new Ext.data.Store({
        autoLoad: true,
        id: 'storeCentroBalance',
        url: 'listarCentroBalance',
        listeners: {
            load: function(st,rec,opt){
               /* for(var i = 1;i<st.getCount();i++){
                    idsCentrobalance[i]
                }
                */
        }
        },
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
            name: 'centrobalance'
        }, {
            name: 'idcentrobalance'
        }])
    });
    this.stcbOrgano = new Ext.data.Store({
        autoLoad: true,
        id: 'stcbOrgano',
        url: 'listarOrganos',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
            name: 'idorganosatisface'
        }, {
            name: 'denominacion'
        }])
    });
    this.stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        timeout: 7200000,
        listeners: {
            load: function (t, n, e) {

                _this.cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                _this.cbEjercicioPuntualizar.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                _this.cbEjercicioRep.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                _this.gdPlanInd.getStore().reload({
                    params: {
                        idejercicio: _this.cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });


                _this.gdPuntualizarPlan.getStore().reload({
                    params: {
                        idejercicio: _this.cbEjercicioPuntualizar.getValue(),
                        start: 0,
                        limit: 20
                    }

                });


            }, beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [
            {
                name: 'idejercicio'
            },
            {
                name: 'ejercicio'
            },
            {
                name: 'estado'
            }
        ])
    });


    this.cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: _this.stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        tpl: '<tpl for="."><div ext:qtip="{ejercicio}" class="x-combo-list-item">{ejercicio}</div></tpl>',
        emptyText: 'Seleccione',
        fieldLabel: 'Ejercicio',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                _this.gdPlanInd.getStore().reload({
                    params: {
                        idejercicio: _this.cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

            }
        }
    });

    this.myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });

    this.btnAdicionar = new Ext.Button({
        id: 'btnAdicionar',
        //icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        tooltip: 'Adicionar Indicador (Alt+I)'//,
        //text: 'Adicionar'

    });
    this.btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        // icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        tooltip: 'Guardar',
        disabled: true,
        //text: 'Guardar',
        handler: function () {
            guardarEjecucion(campos_modificados);
        }


    });
    this.btnGuardarPuntual = new Ext.Button({
        id: 'btnGuardarPuntual',
        //  icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        disabled: true,
        tooltip: 'Guardar Puntualizaci&oacuten',
        // text: 'Guardar',
        handler: function () {
            guardarPuntual();
        }
    });
    this.btnEliminar = new Ext.Button({
        id: 'btnEliminar',
        // icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        tooltip: 'Elimiminar Indicador(DEL)',
        // text: 'Eliminar',
        disabled: true,
        handler: function () {
            msjeliminar = 1;
            eliminarI();
        }

    });
    this.tfimportetotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotal',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000'
    });
    this.tfcantidad = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'cantidad',
        maxLength: 2,
        maxLengthText: 'El campo debe tener 2 dígitos.',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0'
    });
    this.cbCantidad = new Ext.form.ComboBox({
        id: 'cbCantidad',
        value: 'Todos',
        store: _this.stCbCant,
        valueField: 'idcant',
        hiddenName: 'idcant',
        displayField: 'cant',
        mode: 'local',
        fieldLabel: 'Valores',
        anchor: '100%',
        allowBlank: true,
        editable: true,
        width: 160,
        triggerAction: 'all',
        emptyText: 'cantidad',
        loadingText: 'Cargando...',
        fieldLabel: 'Cantidades de la Ejecuci&oacuten',
        listeners: {
            select: function (cb, rec, index) {
                _this.gdPlanInd.getStore().reload({
                    params: {
                        idcant: _this.cbCantidad.getValue(),
                        idvalor: _this.cbValores.getValue(),
                        idejercicio: _this.cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

            }
        }
    });
    this.cbValores = new Ext.form.ComboBox({
        id: 'cbValores',
        value: 'Todos',
        store: _this.stCbValor,
        valueField: 'idvalor',
        displayField: 'valor',
        label: 'Valores',
        mode: 'local',
        anchor: '90%',
        allowBlank: true,
        editable: true,
        width: 160,
        triggerAction: 'all',
        emptyText: 'valores',
        fieldLabel: 'Importes de la Ejecuci&oacute',
        loadingText: 'Cargando...',
        listeners: {
            select: function (cb, rec, index) {
                _this.stDemanda.reload({
                    params: {
                        idvalor: _this.cbValores.getValue(),
                        idejercicio: _this.cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

            }
        }


    });
    this.cbMes = new Ext.form.ComboBox({
        id: 'cbMes',
       // value: 'Todos',
        store: _this.stCbMes,
        emptyText:'Seleccione...',
        valueField: 'idmes',
        hiddenName: 'idmes',
        displayField: 'mes',
        mode: 'local',
        allowBlank: true,
        editable: true,
        anchor: '100%',
        width: 80,
        triggerAction: 'all',
        fieldLabel: 'Mes',
        loadingText: 'Cargando...',
        listeners: {
            select: function (cb, rec, index) {
                _this.stDemanda.reload({
                    params: {
                        idvalor: _this.cbValores.getValue(),
                        idejercicio: _this.cbEjercicio.getValue(),
                        idmes: _this.cbMes.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

            }
        }
    });
    this.cbMes.setValue(01);
    this.cbReporte = new Ext.form.ComboBox({
        id: 'cbreporte',
        store: _this.stReporte,
        valueField: 'idreporte',
        hiddenName: 'idreporte',
        displayField: 'reporte',
        mode: 'local',
        allowBlank: true,
        editable: true,
        width: 350,
        triggerAction: 'all',
        emptyText: 'Seleccione un reporte',
        loadingText: 'Cargando...'
    });

    this.cbImporte = new Ext.form.ComboBox({
        value: 1,
        store: _this.stCbImporte,
        valueField: 'idimporte',
        hiddenName: 'idimporte',
        displayField: 'importe',
        width: 160,
        mode: 'local',
        selectOnFocus: true,
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Importe',
        loadingText: 'Seleccionar',
        typeAhead: true,
        listeners: {
            select: function (cb, record, index) {
                if (_this.cbImporte.getValue() == 1) {
                    _this.tfimportetotal.setValue(_this.stDemanda.getAt(0).data.sumaaprobado);
                } else if (_this.cbImporte.getValue() == 2) {
                    _this.tfimportetotal.setValue(_this.stDemanda.getAt(0).data.sumacontratado);
                }
                else if (_this.cbImporte.getValue() == 3) {
                    _this.tfimportetotal.setValue(_this.stDemanda.getAt(0).data.sumaeje);
                }

            }
        }

    });


    this.cbImportePuntualizar = new Ext.form.ComboBox({
        store: _this.stCbImporte,
        valuefield: 'idimporte',
        hiddenName: 'idimporte',
        displayField: 'importe',
        width: 160,
        mode: 'local',
        selectOnFocus: true,
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Importe',
        loadingText: 'Seleccionar',
        typeAhead: true
    });

    this.btnLimpiar = new Ext.Button({
        id: 'btnLimpiar',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar Filtro(s)<b>(Ctrl+Alt+L)</b>',
        handler: function () {
            limpiarfiltros();
        }

    });
    this.btnGenerarR = new Ext.Button({
        id: 'btnGenerarR',
        // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: 'Exportar',
        //  text: 'Exportar',
        handler: function () {
            exportar();
        }

    });
    this.btnExportar = new Ext.Button({
        id: 'btnExportar',
        // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: 'Exportar',
        // text: 'Exportar',
        handler: function () {
            exportarPuntual();
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyuda',
        //  icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)'//,
        //  text: 'Ayuda'
    });

    this.tfimportetotalVP = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalVP',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        fieldLabel: 'Total Importe Aprobado',
        emptyText: '0.000'
    });
    this.cbInd = new Ext.form.ComboBox({
        value: 20,
        store: _this.stCbInd,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function (cb, record, index) {
                Ext.getCmp('pgtPlanInd').pageSize = _this.getValue();
                _this.gdPlanInd.reload({
                    params: {
                        start: 0,
                        limit: _this.cbInd.getValue()
                    }
                });
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    /******************************* Store de la Tabla**************************/
    this.stDemanda = new Ext.data.Store({
        url: 'listarDemanda',
        reader: new Ext.data.JsonReader({
            root: 'data'

        }, [{
            name: 'idindicador'
        },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'numeropieza'
            }, {
                name: 'um'
            }, {
                name: 'precio'
            }, {
                name: 'demanda'
            }, {
                name: 'importeplanif'
            }, {
                name: 'contratado'
            }, {
                name: 'preciocontrado'
            }, {
                name: 'importecontratado'
            }, {
                name: 'ejecutado'
            }, {
                name: 'precioejecutado'
            }, {
                name: 'importeejecutado'
            }, {
                name: 'viaadquisicion'
            }, {
                name: 'centrobalance'
            }, {
                name: 'organosatisface'
            },
            {
                name: 'naturaleza'
            },
            {
                name: 'centrobalance'
            },
            {
                name: 'idajusteexistenciacb'
            },
            {
                name: 'sumaeje'
            },{
                name: 'sumaaprobado'
            },
            {
                name: 'sumacontratado'
            },
            {
                name: 'sumaimporteplanif'
            }
            ,
            {
                name: 'tipo'
            },
            {
                name: 'idejecucionoaceindicador'
            },
            {
                name: 'cantidad'
            },
            {
                name: 'idejecucionoace'
            },
            {
                name: 'porciento'
            }
        ]), listeners: {
            load: function () {
                params: {
                    idmes: _this.cbMes.getValue()
                }

                campos_modificados = [];
                _this.btnGuardar.disable();
                upColorCell();

                if ( _this.cbImportePuntualizar.getValue() == 1) {//aprobado
                    tfimportetotal.setValue(_this.stTotal.data.items[0].data.importeplanif);
                } else if ( _this.cbImportePuntualizar.getValue() == 2) {//contratado
                    tfimportetotal.setValue(_this.stTotal.data.items[0].data.importecontratado);
                } else if ( _this.cbImportePuntualizar.getValue() == 3) {//ejecutado
                    tfimportetotal.setValue(_this.stTotal.data.items[0].data.importeejecutado);
                }




                if (_this.stDemanda.getCount()>0) {
                    tfimportetotal.setValue(_this.stTotal.data.items[0].data.importeplanif);
                } else {
                    _this.tfimportetotal.setValue('0.000');
                }
                if (_this.PlanInd.getFiltrosActivos().length > 0 && _this.stDemanda.getCount() == 0) {
                    mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.");
                }
                if (_this.stDemanda.getCount() == 0) {
                    mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.");
                }
            }

        }
    });


    /***********************Panel************************************/
    this.PlanInd = new Ext.grid.GridFilters({
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
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
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
                type: 'string_adaptado',
                dataIndex: 'viaadquisicion',
                xtype: 'numberfield',
                idTextField: 'filtrovia',
                anchor: '95%',
                fieldLabel: '',
                disabled: true
            },
            {
                type: 'string_adaptado',
                dataIndex: 'organosatisface',
                xtype: 'numberfield',
                idTextField: 'filtroorgano',
                anchor: '95%',
                fieldLabel: '',
                disabled: true
            },
            {
                type: 'string_adaptado',
                dataIndex: 'naturaleza',
                xtype: 'numberfield',
                idTextField: 'filtronaturaleza',
                anchor: '95%',
                fieldLabel: '',
                disabled: true
            },
            {
                type: 'string_adaptado',
                dataIndex: 'um',
                xtype: 'numberfield',
                idTextField: 'filtroum',
                anchor: '95%',
                fieldLabel: ''
            },
            {
                type: 'numeric',
                dataIndex: 'precio'
            },
            {
                type: 'numeric',
                dataIndex: 'demanda'
            }, {
                type: 'numeric',
                dataIndex: 'importeplanif'
            },
            {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'cbCentroBalance',
                urlcb: 'listarCentroBalance',
                idstore: 'storeCentroBalance',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'
            },
            {
                type: 'numeric',
                dataIndex: 'contratado'
            }, {
                type: 'numeric',
                dataIndex: 'preciocontrado'
            }, {
                type: 'numeric',
                dataIndex: 'importecontratado'
            }, {
                type: 'numeric',
                dataIndex: 'ejecutado'
            }, {
                type: 'numeric',
                dataIndex: 'precioejecutado',
                aling: 'left'
            },
            {
                type: 'numeric',
                dataIndex: 'importeejecutado'
            }
        ]
    });

    this.cmPlanInd = [
        {
            header: "C&oacute;digo",
            id: 'expandir',
            dataIndex: 'codigo',
            width: 200,
            sortable: true,
            tooltip: 'C&oacute;digo'

        },
        {
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 200,
            sortable: true,
            tooltip: 'Denominaci&oacute;n'
        },
        {
            header: "No Pieza",
            dataIndex: 'numeropieza',
            width: 60,
            sortable: true,
            tooltip: 'No de Pieza'
        },
        {
            header: "UM",
            dataIndex: 'um',
            width: 50,
            sortable: true,
            tooltip: 'Unidad de Medida'
        },
        {
            header: "Precio",
            dataIndex: 'precio',
            width: 60,
            sortable: true,
            align: 'right',
            tooltip: 'Precio'

        },
        {
            header: "Cantidad Aprobada",
            dataIndex: 'demanda',
            width: 130,
            sortable: true,
            align: 'right',
            tooltip: 'Cantidad Aprobada'


        }
        ,
        {
            header: "Importe Aprobado",
            dataIndex: 'importeplanif',
            width: 130,
            sortable: true,
            align: 'right',
            tooltip: 'Importe Aprobado'

        },
        {
            header: "Centro de Balance",
            dataIndex: 'centrobalance',
            width: 100,
            sortable: true,
            tooltip: 'Centro de Balance'
        },
        {
            header: "V&iacute;a de Adquisici&oacute;n",
            dataIndex: 'viaadquisicion',
            width: 100,
            hidden: true,
            tooltip: 'V&iacute;a de Adquisici&oacute;n'
        },
        {
            header: "Naturaleza",
            dataIndex: 'naturaleza',
            width: 80,
            hidden: true,
            tooltip: 'Naturaleza'
        },
        {
            header: "&Oacute;rgano que  satisface",
            dataIndex: 'organosatisface',
            width: 130,
            hidden: true,
            tooltip: '&Oacute;rgano que  satisface'
        },
        {
            header: "Contratado",
            dataIndex: 'contratado',
            width: 80,
            sortable: true,
            align: 'right',
            tooltip: 'Cantidad Contratada',
            editor: new Ext.form.NumberField({
                allowBlank: false
            })

        },
        {
            header: "Precio Contratado",
            dataIndex: 'preciocontrado',
            width: 100,
            sortable: true,
            align: 'right',
            tooltip: 'Precio Contratado',
            editor: new Ext.form.NumberField({
                allowBlank: false
            })

        },
        {
            header: "Importe Contratado",
            dataIndex: 'importecontratado',
            width: 130,
            align: 'right',
            sortable: true,
            tooltip: 'Importe Contratado'


        },
        {
            header: "Ejecutado",
            dataIndex: 'ejecutado',
            width: 80,
            sortable: true,
            align: 'right',
            tooltip: 'Cantidad Ejecutada',
            editor: new Ext.form.NumberField({
                allowBlank: false
            })

        },
        {
            header: "Precio Ejecutado",
            dataIndex: 'precioejecutado',
            width: 100,
            sortable: true,
            align: 'right',
            tooltip: 'Precio Ejecutado',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                enableKeyEvents: true
            })

        },
        {
            header: "Importe Ejecutado",
            dataIndex: 'importeejecutado',
            width: 100,
            sortable: true,
            align: 'right',
            tooltip: 'Importe Ejecutado'

        },
        {
            header: "Porciento Ejecutado",
            dataIndex: 'porciento',
            width: 130,
            sortable: true,
            align: 'right',
            tooltip: 'Porciento Ejecutado'

        }
    ];
    this.smGpPlanInd = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (x, y, w) {
                if (_this.smGpPlanInd.getSelections()[0].get('tipo') == 1) {
                    _this.btnEliminar.enable();
                }
            },
            rowdeselect: function (x, y, w) {
                if (_this.smGpPlanInd.getSelections().length == 0) {
                    _this.btnEliminar.disable();
                }
            }
        }
    });
    this.btnLimpiarP = new Ext.Button({
        id: 'btnLimpiarP',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar Filtro(s)<b>(Ctrl+Alt+L)</b>'
    });
    this.gdPlanInd = new Ext.grid.EditorGridPanel({
        id: 'gdPlanInd',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.PlanInd,
        autoExpandColumn: 'expandir',
        autoExpandMax: 565,
        width: 715,
        store: _this.stDemanda,
        sm: _this.smGpPlanInd,
        columns: _this.cmPlanInd,
        listeners: {
            afteredit: function (sm) {
                campos_modificados.push({
                    contratado: sm.record.data.contratado,
                    ejecutado: sm.record.data.ejecutado,
                    idejecucionoace: sm.record.data.idejecucionoace,
                    campo_modif: sm.field
                });
                if (sm.field == 'ejecutado' && sm.record.data.ejecutado > sm.record.data.contratado) {
                    mostrarMensaje(1, 'La cantidad ejecutada es mayor que la cantidad contratada.');
                }

                if (sm.field == 'contratado' && sm.record.tipo == 0 && sm.record.data.contratado > sm.record.data.demanda) {
                    mostrarMensaje(1, 'La cantidad ejecutada es mayor que la cantidad contratada.');
                }

                _this.btnGuardar.enable();
            },
            validateedit: function (sm) {

                campo = sm.field;
                valor = sm.value;

            }
        },
        loadMask: {
            msg: 'Cargando ...'
        },
        bbar: new Ext.PagingToolbar({
            id: 'pgtPlanInd',
            store: _this.stDemanda,
            pageSize: 20,
            displayInfo: true,
            items: ['-', _this.cbInd/*, '-', _this.btnLimpiar, '-', _this.cbImporte, {
                xtype: 'tbtext',
                text: ':'
            },
                _this.tfimportetotal*/]
        })


    });
    this.panelCombo = new Ext.Panel({
        layout: 'border',
        name: 'Combo',
        id: 'combo',
        region: 'center',
        frame: true,
        items: [_this.gdPlanInd],
        tbar: [_this.btnAdicionar, _this.btnEliminar, _this.btnGuardar, _this.btnGenerarR, '-', {
            xtype: 'tbtext',
            text: 'Ejecuci&oacuten Importe:'
        }, _this.cbValores, '     ', {
            xtype: 'tbtext',
            text: 'Cantidad Importe:'
        }, _this.cbCantidad, '          ', _this.cbReporte,'-',_this.btnLimpiar, '-', _this.cbImporte, {
            xtype: 'tbtext',
            text: ':'
        },
            _this.tfimportetotal, '->', _this.btnAyuda]


    });

    this.panelPrincipal = new Ext.Panel({
        layout: 'border',
        name: 'principal',
        //height: 150,
        id: 'principal',
        labelAlign: 'top',
        frame: true,
        border: false,
        title: 'Controlar la Ejecución',
        tbar: [{
            xtype: 'tbtext',
            text: 'Ejercicio:'
        }, _this.cbEjercicio, '-', {
            xtype: 'tbtext',
            text: 'Mes:'
        }, _this.cbMes],
        items: [_this.panelCombo]
    });

    /*****************Pestana Puntualizar********************************************/


    this.cbEjercicioPuntualizar = new Ext.form.ComboBox({
        id: 'cbEjercicioPuntualizar',
        store: _this.stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        width: 180,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Ejercicio',
        loadingText: 'Cargando...',
        fieldLabel: 'Ejercicio',
        bodyStyle: 'padding: 0 0 0',
        listeners: {
            select: function (cb, rec, index) {
                _this.gdPuntualizarPlan.getStore().reload({
                    params: {
                    idejercicio: _this.cbEjercicioPuntualizar.getValue(),
                        start: 0,
                        limit: 20
                }
            });

            }
        }

    });

    this.btnPermisos = new Ext.Button({
        id: 'btnPemisos',
        // icon: perfil.dirImg + 'asignaroles.png',
        iconCls: 'permisossistemadominio',
        tooltip: 'Permisos de Puntualizar'//,
        // text: 'Permisos'

    });
    this.btnAyudaPuntualizar = new Ext.Button({
        id: 'btnAyudaPuntualizar',
        //icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Ayuda'//,
        //text: 'Ayuda'
    });

    this.stPuntualizarPlan = new Ext.data.Store({
        autoLoad: false,
        url: 'listarDemanda',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
            name: 'idindicador'
        },
            {
                name: 'idejecucionoace'
            },
            {
                name: 'centrobalance'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'numeropieza'
            }, {
                name: 'um'
            }, {
                name: 'precio'
            }, {
                name: 'demanda'
            }, {
                name: 'importeplanif'
            },
            {
                name: 'sumaimporteplanif'
            }, {
                name: 'ejecutar'
            }

        ]),
        listeners: {
            load: function () {
                if (_this.stPuntualizarPlan.getCount() != 0) {
                    _this.tfimportetotalVP.setValue(_this.stPuntualizarPlan.getAt(0).data.sumaimporteplanif);

                } else {
                    _this.tfimportetotalVP.setValue('0.000');
                }
            }

        }
    });
    this.smGpPuntualizarPlan = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    this.PuntualizarPlan = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '50%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
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
                dataIndex: 'precio'
            },
            {
                type: 'string_adaptado',
                dataIndex: 'um',
                xtype: 'numberfield',
                idTextField: 'filtroum',
                anchor: '95%',
                fieldLabel: ''
            },
            {
                type: 'numeric',
                dataIndex: 'demanda'
            }, {
                type: 'numeric',
                dataIndex: 'importeplanif'
            },
            {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'cbCentroBalance',
                urlcb: 'listarCentroBalance',
                idstore: 'storeCentroBalance',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'
            },
            {
                type: 'numeric',
                dataIndex: 'ejecutar'
            }
        ]
    });

    this.cmPuntualizarPlan = [
        {
            header: "C&oacute;digo",
            id: 'expandir',
            dataIndex: 'codigo',
            width: 300,
            sortable: true

        },
        {
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 150,
            sortable: true
        },
        {
            header: "No Pieza",
            dataIndex: 'numeropieza',
            width: 100,
            sortable: true
        },
        {
            header: "UM",
            dataIndex: 'um',
            width: 50,
            sortable: true
        },
        {
            header: "Precio",
            dataIndex: 'precio',
            width: 60,
            sortable: true

        },
        {
            header: "Cantidad Aprobada",
            dataIndex: 'demanda',
            width: 150,
            sortable: true
        }
        ,
        {
            header: "Importe Aprobado",
            dataIndex: 'importeplanif',
            width: 150,
            sortable: true

        },
        {
            header: "Centro de Balance",
            dataIndex: 'centrobalance',
            width: 150
        }
        , {
            header: "A Ejecutar",
            dataIndex: 'ejecutar',
            width: 150,
            editor: new Ext.form.NumberField({
                    allowBlank: false
                }
            )
        }
    ];


    this.gdPuntualizarPlan = new Ext.grid.EditorGridPanel({
        id: 'gdPuntualizarPlan',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.PuntualizarPlan,
        autoExpandColumn: 'expandir',
        autoExpandMax: 565,
        store: _this.stPuntualizarPlan,
        sm: _this.smGpPuntualizarPlan,
        columns: _this.cmPuntualizarPlan,
        width: 715,
        loadMask: {
            msg: 'Cargando ...'
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stPuntualizarPlan,
            displayInfo: true,
            items: ['-', _this.btnLimpiarP, '-', '  ', _this.cbImportePuntualizar, {
                xtype: 'tbtext',
                text: ':'
            }, _this.tfimportetotalVP, '-']
        }),
        listeners: {
            afteredit: function (sm) {

                _this.btnGuardarPuntual.enable();
            }


        }
    });


    this.panelPuntualizar = new Ext.Panel({
        layout: 'fit',
        name: 'puntualizar',
        id: 'puntualizar',
        labelAlign: 'top',
        frame: true,
        title: 'Puntualizar Demanda',
        items: [_this.gdPuntualizarPlan],
        tbar: [_this.cbEjercicioPuntualizar, _this.btnGuardarPuntual, _this.btnPermisos, _this.btnExportar, '->', _this.btnAyudaPuntualizar]
    });

    this.tbControl = new Ext.TabPanel({
        activeTab: 0,
        items: [_this.panelPrincipal, _this.panelPuntualizar]
    });

    ///////Ventana para adicionar un indicador//////////////////////
    this.btnLimpiarA = new Ext.Button({
        id: 'btnLimpiarA',
        //icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar(<b>Alt+L</b>)'//,
        // text: 'Limpiar'
    });
    this.btnAyudaAdicionarI = new Ext.Button({
        id: 'btnAyudaAdicionarI',
        //icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Ayuda'//,
        // text: 'Ayuda'
    });
    this.btnAceptar = new Ext.Button({
        id: 'btnAceptar',
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        tooltip: 'Cerrar ventana y guardar los datos',
        text: 'Aceptar',
        disabled: 'true',
        handler: function () {
            msjaceptar = 1;
            _this.gdAdicionarI.getSelectionModel().clearSelections();


        }
    });
    this.btnCancelar = new Ext.Button({
        id: 'btnCancelar',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        tooltip: 'Cerrar ventana sin guaradr los datos',
        text: 'Cancelar'
    });

    //Store para indicadores
    this.stgpIndicadores = new Ext.data.Store({
        url: 'listarIndicadores',
        reader: new Ext.data.JsonReader({
            id: 'idindicador',
            root: 'data',
            totalProperty: "total"
        }, [{
            name: 'codigo'
        },
            {
                name: 'denominacion'
            },
            {
                name: 'um'
            },
            {
                name: 'numeropieza'
            },
            {
                name: 'precio'
            },
            {
                name: 'idindicador'
            }
        ]), listeners: {
            load: function () {
                params: {
                    idmes: _this.cbMes.getValue()
                }}

        }
    });

    this.AdicionarI = new Ext.grid.GridFilters({
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
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
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
                dataIndex: 'precio'
            },
            {
                type: 'string',
                dataIndex: 'um'
            }
        ]
    });

    this.cmAdicionarI = [
        {
            header: "C&oacute;digo",
            id: 'expandir',
            dataIndex: 'codigo',
            width: 150,
            sortable: true,
            tooltip: 'C&oacute;digo'

        },
        {
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 150,
            sortable: true,
            tooltip: 'Denominaci&oacute;n'
        },
        {
            header: "UM",
            dataIndex: 'um',
            width: 60,
            sortable: true,
            tooltip: 'Unidad de Medida'

        },
        {
            header: "Nro Pieza",
            dataIndex: 'numeropieza',
            width: 80,
            sortable: true,
            tooltip: 'Numero de Pieza'

        },
        {
            header: "Precio",
            dataIndex: 'precio',
            width: 80,
            sortable: true,
            tooltip: 'Precio'

        }];


    this.smAdicionarI = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (x, y, w) {

                if (x.getCount() == 1) {
                    _this.btnAceptar.enable();


                }
                else {
                    _this.btnAceptar.disable();
                }
            },
            rowdeselect: function (s, n, r) {
                if (s.getSelections().length == 0)
                    _this.btnAceptar.disabled;
                else
                    _this.btnAceptar.enable();
            }
        }
    });


    this.gdAdicionarI = new Ext.grid.EditorGridPanel({
        id: 'gdAdicionarI',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.AdicionarI,
        autoExpandColumn: 'expandir',
        autoExpandMax: 565,
        store: _this.stgpIndicadores,
        sm: _this.smAdicionarI,
        columns: _this.cmAdicionarI,
        width: 715,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stgpIndicadores,
            displayInfo: true,
            items: ['-', _this.btnLimpiarA, '-']
        })
    });


    _this.stgpIndicadores.load({
        params: {
            //idmes: _this.cbMes.getValue(),
            start: 0,
            limit: 20
        }
    });

    //////////////////////// Ventana de permisos //////////////////

    this.btnAyudaP = new Ext.Button({
        id: 'btnAyudaP',
        // icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Ayuda'//,
        // text: 'Ayuda'
    });
    this.btnAceptarVP = new Ext.Button({
        id: 'btnAceptarVP',
        //icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        tooltip: 'Cerrar ventana y guardar los datos',
        text: 'Aceptar',
        disabled: true,
        handler: function () {
            guardarPermiso();
            _this.gdPermisoP.getSelectionModel().clearSelections();
            _this.winPermisoP.hide();
        }
    });
    this.btnCancelarVP = new Ext.Button({
        id: 'btnCancelarVP',
        // icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        text: 'Cancelar'
    });
    this.btnLimpiarVP = new Ext.Button({
        id: 'btnLimpiar',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar Filtro'

    });

    this.stcbCentroBalanceP = new Ext.data.Store({
        url: 'listarPermisoCB',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: "total"
        }, [{
            name: 'centrobalance'
        }, {
            name: 'idcentrobalance'
        },
            {
                name: 'puntualizar'
            },
            {
                name: 'idejecucionpermiso'
            }
        ])
    });


    this.PermisoP = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'cbCentroBalance',
                urlcb: 'listarCentroBalance',
                idstore: 'storeCentroBalance',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'
            },
            {
                type: 'numeric',
                dataIndex: 'puntualizar'
            }
        ]
    });
    this.check = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                if (_this.check.hasSelection()) {
                    _this.btnAceptarVP.enable();
                } else {
                    _this.btnAceptarVP.disable();
                }
            },
            rowdeselect: function (sm, indiceFila, record) {
                if (_this.check.hasSelection()) {
                    _this.btnAceptarVP.enable();
                } else {
                    _this.btnAceptarVP.disable();
                }
            }
        }

    });
    this.cmPermisoP = [
        _this.check, {
            header: "Centro de Balance",
            id: 'expandir',
            dataIndex: 'centrobalance',
            sortable: true,
            tooltip: 'Centro de Balance'

        },
        {
            header: "Puntualizar",
            id: 'expandir',
            dataIndex: 'puntualizar',
            sortable: true,
            tooltip: 'Puntualizar demanda',
            renderer: modificarEstado
        }];

    this.gdPermisoP = new Ext.grid.GridPanel({
        id: 'gdPermisoP',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.PermisoP,
        autoExpandColumn: 'expandir',
        autoExpandMax: 865,
        store: _this.stcbCentroBalanceP,
        sm: _this.check,
        columns: _this.cmPermisoP,
        width: 1015,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stcbCentroBalanceP,
            displayInfo: true,
            items: ['-', _this.btnLimpiarVP, '-']
        })
    });
    _this.stcbCentroBalanceP.load({
        params: {
            start: 0,
            limit: 20
        }
    });
//////////////////Reportes///////////////////////////
    this.cbCentroBalance = new Ext.form.ComboBox({
        id: 'cbCentroBalance',
        store: _this.stcbCentroBalance,
        valueField: 'idcentrobalance',
        hiddenName: 'idcentrobalance',
        displayField: 'centrobalance',
        mode: 'local',
        //allowBlank: false,
        width: 180,
        editable: true,
        triggerAction: 'all',
        fieldLabel: 'Centro de Balance',
        emptyText: 'Centro de Balance',
        loadingText: 'Cargando...',
        bodyStyle: 'padding: 0 0 0'
    });
    this.cbOrgano = new Ext.form.ComboBox({
        id: 'stcbOrgano',
        store: _this.stcbOrgano,
        valueField: 'idorganosatisface',
        hiddenName: 'idorganosatisface',
        displayField: 'denominacion',
        mode: 'local',
        //allowBlank: false,
        width: 180,
        editable: true,
        triggerAction: 'all',
        fieldLabel: 'Órgano',
        emptyText: 'Organo que satisface',
        loadingText: 'Cargando...',
        bodyStyle: 'padding: 0 0 0'
    });
    this.cbEjercicioRep = new Ext.form.ComboBox({
        id: 'cbEjercicioRep',
        store: _this.stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        width: 180,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Ejercicio',
        loadingText: 'Cargando...',
        fieldLabel: 'Ejercicio',
        bodyStyle: 'padding: 0 0 0'
    });
    this.cbMesRep = new Ext.form.ComboBox({
        id: 'cbMesRep',
        store: _this.stCbMes,
        valueField: 'idmes',
        hiddenName: 'idmes',
        displayField: 'mes',
        mode: 'local',
        allowBlank: true,
        editable: true,
        width: 180,
        fieldLabel: 'Mes',
        triggerAction: 'all',
        loadingText: 'Cargando...'

    });
    this.tfCodigo = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'codigo',
        maxLength: 16,
        width: 150,
        disabled: false,
        fieldLabel: 'C&oacutedigo',
        enableKeyEvents: false
    });
    this.tfNPieza = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'Npieza',
        maxLength: 16,
        width: 150,
        disabled: false,
        fieldLabel: 'Nro de Pieza',
        enableKeyEvents: false

    });
    this.tfDenominacion = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'denominacion',
        maxLength: 16,
        width: 150,
        disabled: false,
        fieldLabel: 'Denominaci&oacuten',
        enableKeyEvents: false

    });
    _this.cbReporte.on('select', function (combo, record) {
        if (record.data.idreporte == 0) {
            _this.winReporteEjec.show();
        }
        if (record.data.idreporte == 1) {
            _this.winReporteEjec.show();
        }
    })

    this.btnAceptarRep = new Ext.Button({
        text: 'Aceptar',
        iconCls: 'aceptar',
        tooltip: 'Aceptar',
        handler: function () {
            verReportesEjecucion()
        }

    });

    this.btnCancelarRep = new Ext.Button({
        text: 'Cancelar',
        iconCls: 'cancelar',
        tooltip: 'Cancelar'

    });
    this.fmreporte = new Ext.form.FormPanel({
        width: 700,
        height: 250,
        frame: true,
        region: "center",
        border: false,
        labelAlign: 'top',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .4,
                layout: 'form',
                items: [_this.cbEjercicioRep,_this.cbOrgano]
            }, {
                columnWidth: .4,
                layout: 'form',
                items: [/*_this.tfCodigo*/ _this.cbMesRep, _this.cbCentroBalance/*, _this.tfNPieza, _this.tfDenominacion*/]
            }
            ]
        }
        ]
    });

    _this.stCbejercicio.reload();

    this.winPrincipal = new Ext.Window({
        modal: true,
        layout: 'fit',

        closable: false,
        maximized: true,
        items: [_this.tbControl]
    });

    this.winReporteEjec = new Ext.Window({
        id: 'winConfigReporte',
        width: 500,
        height: 200,
        draggable: true,
        constrain: true,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [_this.fmreporte],
        buttons: [_this.btnCancelarRep, _this.btnAceptarRep]
    });


    this.winAdicionarIndicador = new Ext.Window({
        width: 800,
        height: 500,
        id: 'winAdicionarIndicador',
        title: 'Adicionar Indicador',
        layout: 'fit',
        closeAction: 'hide',
        constrain: true,
        modal: true,
        items: [_this.gdAdicionarI],
        tbar: [{text: 'Seleccione el indicador a adicionar:'}, '->', {
            xtype: 'tbtext',
            text: 'Inserte la cantidad a contratar del indicador:'
        }, _this.tfcantidad, _this.btnAyudaAdicionarI],
        bbar: ['->', _this.btnCancelar, _this.btnAceptar]

    });
    this.winPermisoP = new Ext.Window({
        width: 540,
        height: 500,
        id: 'winPermisoP',
        title: 'Asignar Permiso de Puntualizar:',
        layout: 'fit',
        closeAction: 'hide',
        constrain: true,
        modal: true,
        items: [_this.gdPermisoP],
        tbar: ['->', _this.btnAyudaP],
        bbar: ['->', _this.btnCancelarVP, _this.btnAceptarVP]

    });
    _this.btnCancelarRep.on('click', function () {
        _this.winReporteEjec.hide();
        _this.winPrincipal.show();

    }, this);
    _this.winPrincipal.show();
    _this.btnGuardar.on('click', function () {
    }, this);
    _this.btnAdicionar.on('click', function () {

        _this.stgpIndicadores.load({
            params: {
                idmes: _this.cbMes.getValue(),
                start: 0,
                limit: 20
            }
        });
        _this.winAdicionarIndicador.show();
    }, this);

    _this.btnCancelar.on('click', function () {
        _this.tfcantidad.reset();
        _this.winPrincipal.show();
    }, this);

    _this.btnPermisos.on('click', function () {
        _this.winPermisoP.show();
    }, this);

    _this.btnCancelarVP.on('click', function () {

        _this.winPermisoP.hide();
        _this.winPrincipal.show();

    }, this);

    _this.btnAceptar.on('click', function () {
        if (_this.tfcantidad.getValue() != "") {
            var aux = _this.gdAdicionarI.getSelectionModel().getSelections();
            var arreglo = [];
            for (var i = 0; i < aux.length; i++) {
                arreglo[i] = aux[i].data;
                arreglo[i]['idejercicio'] = _this.cbEjercicio.getValue();
            }
            if (arreglo.length > 0) {
                Ext.Ajax.request({
                    url: 'adicionarIndicador',
                    timeout: 6400000,
                    params: {
                        indicador: Ext.encode(arreglo),
                        cantidad: _this.tfcantidad.getValue(),
                        idmes: _this.cbMes.getValue()

                    },
                    callback: function (options, success, response) {
                        _this.myMask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (msjaceptar == 1) {
                            mostrarMensaje(1, 'El indicador ha sido adicionado satisfactoriamente.');
                            _this.winAdicionarIndicador.hide();
                            _this.stDemanda.reload({
                                params: {
                                    start: 0,
                                    limit: 20,
                                    idmes: _this.cbMes.getValue(),
                                    idejercicio: _this.cbEjercicio.getValue()
                                }
                            });
                            _this.stPuntualizarPlan.reload();
                            _this.tfcantidad.reset();

                        } else
                            mostrarMensaje(3, 'Ocurrió un error interno contacte con el administrador');
                    }
                });
            }
        } else {
            mostrarMensaje(1, 'Debe insertar la demanda del indicador');

        }
        ;
    });


    function modificarEstado(val, m, record, row, col) {
        var palabra = GetPalabraColumna(val, col);
        m.attr = 'ext:qtip="' + palabra + '"';
        if (val == 1) {
            m.css = 'icondistra-true verde';
           // return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
        }
        m.css = 'icondistra-false rojo';
        //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    }

    function GetPalabraColumna(val, col) {
        if (col == 2)
            return (val == 1) ? 'Si' : 'No';
    }

    function guardarPermiso() {
        var valores = _this.gdPermisoP.getSelectionModel().getSelections();
        var arreglo = [];
        for (i = 0; i < valores.length; i++) {
            arreglo[i] = valores[i].data;
        }

        Ext.Ajax.request({
            url: 'adicionarPermiso',
            waitMsg: "Cargando...",
            params: {
                idpermisos: Ext.encode(arreglo)
            },
            callback: function (options, success, response) {
                mostrarMensaje(1, 'Se han modificado los permisos  satisfactoriamente.');
                _this.gdPermisoP.reload();

            }

        });
    }


    function limpiarfiltros() {
        _this.PlanInd.clearFilters();
        _this.stDemanda.reload();
    }

    function guardarPuntual() {
        arrayEjecu = new Array();
        records = _this.stPuntualizarPlan.getModifiedRecords();
        _this.stPuntualizarPlan.commitChanges();
        for (var i = 0; i < records.length; i++) {
            arrayEjecu.push(records[i].data);
        }
        Ext.Ajax.request({
            url: 'guardarPuntual',
            waitMsg: "Cargando...",
            params: {
                idpuntual: Ext.encode(arrayEjecu)
            },
            callback: function (options, success, response) {
                mostrarMensaje(1, 'Se ha realizado la puntualizaci&oacuten satisfactoriamente.');
                _this.stPuntualizarPlan.reload();
                _this.stDemanda.reload();
            }
        });
    }

    function guardarEjecucion(campos_modificados) {

        arrayEjecu = new Array();
        records = _this.stDemanda.getModifiedRecords();
        _this.stDemanda.commitChanges();
        for (var i = 0; i < records.length; i++) {
            arrayEjecu.push(records[i].data);
        }

        Ext.Ajax.request({
            url: 'guardarEjecucion',
            waitMsg: "Cargando...",
            params: {
                idejecucion: Ext.encode(arrayEjecu),
                idejercicio: _this.cbEjercicio.getValue(),
                modificados: Ext.encode(campos_modificados),
                idmes: _this.cbMes.getValue()

            },
            callback: function (options, success, response) {
                mostrarMensaje(1, 'Se han actualizado los datos satisfactoriamente.');
                _this.stDemanda.reload();
            }
        });
    }

    function eliminarI() {
        mostrarMensaje(2, 'Est&aacute seguro que desea eliminar el indicador', elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                var indicadores = _this.gdPlanInd.getSelectionModel().getSelections();
                var arreglo = [];
                for (i = 0; i < indicadores.length; i++) {
                    arreglo[i] = indicadores[i].data;
                }
                if (arreglo.length > 0) {
                    Ext.Ajax.request({
                        url: 'eliminarIndicador',
                        timeout: 6400000,
                        params: {
                            indicador: Ext.encode(arreglo),
                            idmes: _this.cbMes.getValue()
                        },
                        callback: function (options, success, response) {
                            _this.myMask.hide();
                            responseData = Ext.decode(response.responseText);
                            if (msjeliminar == 1) {
                                mostrarMensaje(1, 'El indicador ha sido eliminado satisfactoriamente.');
                                _this.stDemanda.reload({
                                    params: {
                                        start: 0,
                                        limit: 20,
                                        idejercicio: _this.cbEjercicio.getValue(),
                                        idmes: _this.cbMes.getValue()


                                    }
                                });

                            } else
                                mostrarMensaje(3, 'Ocurrió un error interno contacte con el administrador');
                        }
                    });
                }
            }
        }
    }

    function exportarPuntual($params) {
        record = _this.stPuntualizarPlan.getRange();
        array = new Array();
        for (var i = 0; i < record.length; i++) {
            array.push(record[i].data.idindicador);
        }
        filtros = _this.PuntualizarPlan.getFilterData();
        window.open("exportarPuntual?idejercicio=" + _this.cbEjercicio.getValue() + "&filtros=" + Ext.encode(filtros) + "&indicadores=" + Ext.encode(array));
    }

    function exportar(params) {
        record = _this.stDemanda.getRange();
        array = new Array();
        for (var i = 0; i < record.length; i++) {
            array.push(record[i].data.idindicador);
        }
        filtros = _this.PlanInd.getFilterData();
        window.open("exportar?idejercicio=" + _this.cbEjercicio.getValue() + "&filtros=" + Ext.encode(filtros) + "&indicadores=" + Ext.encode(array));
    }

    function verReportesEjecucion() {
       // var nupieza = _this.tfNPieza.getValue();
        //var denominacion = _this.tfDenominacion.getValue();
       // var codigo = _this.tfCodigo.getValue();
        var idejercicio = _this.cbEjercicioRep.getValue();
        var mes = _this.cbMesRep.getValue();
        var mesname = _this.cbMesRep.getRawValue();
        var centrobalance = _this.cbCentroBalance.getValue();
        var cbname = _this.cbCentroBalance.getRawValue();
        var reporte = _this.cbReporte.getValue();
        var idorgano=_this.cbOrgano.getValue();
        var organo = _this.cbOrgano.getRawValue();
        var win = window.open('reporteEjecucion?idejercicio=' +
            idejercicio + '&mes=' + mes+ '&idorgano=' + idorgano+ '&organo=' + organo + '&mesname=' + mesname + '&centrobalance=' + centrobalance+ '&cbname=' + cbname + '&reporte=' + reporte);
        _this.winReporteEjec.hide();

    }

    function ValidarOperacion(campo, valor, sm) {

        if ((campo == 'ejecutado' && (valor > parseFloat(sm.record.data.ejecutado)))) {
            mostrarMensaje(1, "Este campo no puede ser mayor que el contratado");
            sm.cancel = true;
        }

    }

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: Ext.EventObject.DELETE,
            fn: function () {
                eliminarI();
            }
        },
        {
            key: '',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnLimpiar.hidden) {
                    if (!btnLimpiar.disabled)
                        limpiarfiltros();

                }

            }

        }, {
            key: 'I',
            alt: true,
            fn: function () {

            }
        },
        {
            key: 'E',
            alt: true,
            fn: function () {
                exportarPuntual(),
                    exportar(params)
            }
        },
        {
            key: 'G',
            alt: true,
            fn: function () {
                guardarEjecucion(campos_modificados),
                    guardarPuntual();
            }
        },
    ]);

}









