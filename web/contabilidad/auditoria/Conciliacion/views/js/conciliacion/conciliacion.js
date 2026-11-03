Ext.namespace('AuditoriaContable.Contable');
Ext.QuickTips.init();
Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new AuditoriaContable.Contable.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});
AuditoriaContable.Contable.PanelContable = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'PanelContable'
        });
        this.loadMessageBox();
        this.createButtonPanel();
        this.createGridPanel();
        this.initEventos();
        this.loadDataComponent(this);
        // this.initFunctions();
        AuditoriaContable.Contable.PanelContable.superclass.constructor.call(this);
    },
    loadDataComponent: function (scope) {
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataComponent",
            callback: function (options, success, response) {
                scope.responseData = Ext.decode(response.responseText);
                if (scope.responseData.Entidades.datos.length > 0) {
                    Ext.getCmp('gpEntidad').getStore().loadData(scope.responseData.Entidades);
                } else {
                    scope.initMsgWarning(1);
                    scope.pnlNorth.disable();
                }
                Ext.MessageBox.hide();
            }
        });
    },
    ///////////////Mensaje cargando////////////////
    loadMessageBox: function() {
        Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: 'Cargando...',
            //progressText: 'Inicializando...',
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 400);
        }
    },
    createButtonPanel: function () {
        var me = this;

        // var data = ['Auditoría de Catálago de Cuentas Contables', 'Auditoría a estados de Documentos de los Módulos', 'Auditoría a los comprobantes de Operaciones', 'Cuentas con saldos a su naturaleza'];

        // var myData = [
        //     [1, 'Caja'],
        //     [2, 'Banco'],
        //     [3, 'Cobros y pagos'],
        // ];

        // var st = new Ext.data.SimpleStore({
        //     fields: ['id', 'text'],
        //     data: myData
        // });

        // var recordSub = Ext.data.Record.create([
        //     {name: 'idSub', mapping: 'Sub', type: 'int'},
        // ]);

        var st = new Ext.data.Store({
            url: 'obtenerSubsistemas',
            baseParams: '',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad',
                // idProperty: 'idSub',
            }, [
                // {name: 'nombsubsistema', mapping: 'nombsubsistema', type: 'string'},
                {name: 'nombsubsistema'},
                {name: 'idsubsistema'},
            ]),
        });

        this.comboLocal = new Ext.form.ComboBox({
            //fieldLabel: 'Tipos de auditorias contables',
            id: 'combo1',
            name: 'cmb-data',
            style: 'margin: 0 0 0 10',
            displayField: 'nombsubsistema',
            valueField: 'idsubsistema',
            forceSelection: true,
            store: st,
            mode: 'remote',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            //hideTrigger:true,
            editable: false,
            align: 'right',
            width: 200,
        });
//----------------------combo de la entidad
        me.comboEntidad = new Ext.CONT.UIXCombo({
            // emptyText: me.etiquetas.txtSeleccione,
            allowBlank: false,
            fieldLabel: 'Entidad',
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'Entidades',
            autoLoad: true,
            // baseParams: {
            //     '': Ext.encode(me.comboEntidad.fSelect.values),
            // },
            tbar: [new Ext.Button({
                iconCls: 'deshabilitar amarillo',
                // text: me.etiquetas.txtNoConsolidar,
                id: 'btnNoConsolidar',
                hidden: true
            }), new Ext.Button({
                iconCls: 'habilitar amarillo',
                // text: scope.etiquetas.txtConsolidar,
                id: 'btnConsolidar',
                hidden: true
            })],
            singleSelect: true,
            reader: me.jrEntidad = new Ext.data.JsonReader({
                id: 'idestructurae',
                root: 'datos'
            }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'id'
            }, {
                name: 'text'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }])
        });
        this.lbAuditoria = new Ext.form.Label({
            id: 'id',
            text: 'Subsistemas: ',
            style: 'font-weight:bold;',

        });
        this.cbEntidad = new Ext.form.Label({
            id: 'id',
            text: 'Entidad: ',
            style: 'font-weight:bold;',

        });
        this.btn = new Ext.Button({
            iconCls: 'buscaravanzada',
            disabled: true,
            text: 'Buscar',
            tooltip: this.idioma.lbTooltipBtn,


        });
        this.Vistareporte = new Ext.Button({
            iconCls: 'vistareporte',
            text: 'Vista reporte',
            id: 'vistaReporte',
            disabled: true,
            columns: 2,
        });

        this.tbar = [
            '', '', '',
            this.cbEntidad,
            '-',
            // '->',
            this.comboEntidad,
            '', '', '','','','',
            this.lbAuditoria,
            '-',
            // '->',
            this.comboLocal,
            '', '', '', '', '', '', '',

            this.btn

        ];
    }
    ,
    createGridPanel: function () {
        var me = this;
        this.stContable = new Ext.data.GroupingStore({
            url: 'saldoModulosContables',
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: false,
            //----------------------------por donde agrupar
            groupField:'tipo',
            //--------------------------paginado
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
            },
                //-------------------------obtener los datos
                this.record = Ext.data.Record.create([
                    {name:'idestructuracomun'},
                    {name:'tipo'},
                    {name:'saldoContable'},
                    {name:'descripcion'},
                    {name:'saldo_modulo'},
                    {name: 'idcuenta'},
                    {name: 'codigoiso'},
                    {name:'concatcta'},
                    {name:'diferencia'}
            ])),
            //------------------------------------------codigo para organizar: primero por id y ascendente
            sortInfo: {field: 'idcuenta', direction: 'ASC'},
        });
        //lo que se va a mostrar en la columna lo paso por el dataIndex
        this.colModelAudCatalogo = new Ext.grid.ColumnModel([
            {header:'Tipo',dataIndex:'tipo', hideable: false, hidden: true,width:300},
            {header: 'Cuenta contable', dataIndex: 'concatcta'},
            {header: 'Descripcion', dataIndex: 'descripcion',width:200},
            {header: 'Saldo', dataIndex: 'saldo_modulo', renderer: 'usMoney'},
            {header: 'Saldo Contable', dataIndex: 'saldoContable', renderer: 'usMoney'},
            {header: 'Moneda', dataIndex: 'codigoiso',width: 40},
            {header: 'Diferencia', dataIndex: 'diferencia', renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                return Math.abs( record.get('saldoContable')-record.get('saldo_modulo')).toFixed(2);
                }},
            //-----------------------------hideable, hidden para que siga agrupando pero que no se muestre.


        ]);

        this.gpContable = new Ext.grid.GridPanel({
            store: this.stContable,
            loadMask: true,
            border: false,
            frame: false,
            //---------------------------------para agrupar
            view: new Ext.grid.GroupingView({
                forceFit: true,
            }),
            //-------------------------------------------
            sm: this.smContable = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            cm: this.colModelAudCatalogo,
            // columns: [
            //     {
            //         header: ''
            //     }
            // ],
            tbar: [this.Vistareporte],
            bbar: this.pagToolContable = new Ext.Cont.PagingToolbar({
                pageSize: 15,
                store: this.stContable,
                displayInfo: true,
                clearFilter: true,
                displayMsg: 'Resultados de {0} - {1} de {2}', //etiquetas.lbResultPag,
                emptyMsg: "No hay resultados para mostrar.",//etiquetas.lbNoResult
                //-------------------------------paginado
                listeners: {
                    'beforechange': function (pagingbar, params) {
                        me.stContable.baseParams.idSubsistema = me.comboLocal.getValue();//------cambiar de pagina pasando el id
                    },
                }
            })
        });
        this.items = [
            this.gpContable,
        ];
        //----------------------pintar filas
        this.gpContable.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('saldoContable') - record.get('saldo_modulo') != 0)
                return 'FilaRoja';
        }
        //-----------------------------------------------
    },
    initEventos: function () {
        var me = this;

        // this.btnAdicionar.on({
        //     scope: this,
        //     click: function (button, event) {
        //         this.winContable = new AuditoriaContable.Contable.WindowContable({
        //             idioma: this.idioma,
        //             scope: this,
        //             action: 'add'
        //         });
        //         this.winContable.show();
        //     }
        // });
//evento onClick-----------------------------------------boton aceptar
        this.btn.setHandler(function () {
            me.pagToolContable.doClear();//--------------------------cuando cambia empieza la pagina que seleccionas desde uno
            me.stContable.baseParams.idSubsistema = me.comboLocal.getValue();
            me.stContable.baseParams.idestructurae = me.comboEntidad.fSelect.values[0];
            me.stContable.load();//-------------------------------cargar los datos de la estore
        });
//---------------------------------------------------------
//         this.comboLocal.on({
        Ext.getCmp('combo1').on({
            select: function (combo, record, index) {
                // if (record.get('id') == 14) {
                // me.gpContable.reconfigure(me.auDocM, me.colModelAudCatalogo1);
                me.gpContable.getColumnModel().setColumnHeader(3, 'Saldo ' + record.get('nombsubsistema'));
                // }
                // if(record.get('id') == 1){
                //     me.gpContable.reconfigure(me.stContable, me.colModelAudCatalogo);
                // }
                // if(record.get('id') == 3){
                //     me.gpContable.reconfigure(me.auCOpe, me.colModelAudCatalogo2);
                // }

                // else if () {

                // }

                if (me.comboLocal.getValue() && me.comboEntidad.fSelect.values.length != 0) {
                    me.Vistareporte.enable();
                }
                if (me.comboEntidad.fSelect.values.length != 0) {
                    me.btn.enable();
                }
            },
            deselect: function () {

            }
        });
        Ext.getCmp('gpEntidad').getSelectionModel().on('rowselect', function (selectionModel, rowIndex, record) {
            if (me.comboLocal.getValue()) {
                me.btn.enable();
            }

        });

        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, opt) {
            if(store.reader.jsonData.Actual){
                me.comboEntidad.fSelect.display.push(store.reader.jsonData.Nombre);
                me.comboEntidad.fSelect.values.push(store.reader.jsonData.Actual);
                me.comboEntidad.setValue(store.reader.jsonData.Actual);
                me.comboEntidad.setRawValue(store.reader.jsonData.Nombre);
            }
        });


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Vista reporte
        //Funcion que crea la ventana para el reporte
        // this.crearPrintView = function(dataReport, defaultValues) {
        //     return new SCFPrintView(dataReport, "/contabilidad/comun/SCFPrintView/", defaultValues);
        // };
        fOpenWindowReport = function (datosReporte) {
            var defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            
            for (var i = 0; i < datosReporte.datoCuerpo.length;i++){
                // datosReporte.datoCuerpo[i].diferencia = datosReporte.datoCuerpo[i].saldo_modulo - datosReporte.datoCuerpo[i].saldoContable;
                datosReporte.datoCuerpo[i].diferencia = Math.abs(datosReporte.datoCuerpo[i].saldo_modulo - datosReporte.datoCuerpo[i].saldoContable);
                datosReporte.datoCuerpo[i].descripcion = datosReporte.datoCuerpo[i].descripcion.substring(0,45)+'...';
            }
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };

        //Evento click para el boton de la vista reporte
        me.Vistareporte.on('click', function () {
            me.loadMessageBox();
            var arrColumnas = [];

            for (var i = 0; i < me.gpContable.getColumnModel().config.length; i++) {//////entrar al header
                arrColumnas.push({
                    column: me.gpContable.getColumnModel().config[i].header,
                    data: me.gpContable.getColumnModel().config[i].dataIndex,
                    width: me.gpContable.getColumnModel().config[i].width,
                    style: 'text-align:' + (me.gpContable.getColumnModel().config[i].align ? me.gpContable.getColumnModel().config[i].align : 'left')
                });
            }

            ///////////////////////////////////////////parte de la vista reporte//////////////////////////////////////////////////
            //////////////obtener los datos///////////
            Ext.Ajax.request({
                method: "POST",
                params: {
                    idestructurae: me.comboEntidad.fSelect.values[0],
                    idSubsistema: me.comboLocal.getValue(),
                    titulo: me.comboLocal.getRawValue(),
                    columnas: Ext.encode(arrColumnas)

                },
                url: "ReportesConciliacion",
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData)
                        fOpenWindowReport(responseData);
                    Ext.MessageBox.hide();
                }
            });
        }, this);
    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    initFunctions: function () {

        // var me = this;
        //
        // this.search = function (filter) {
        //     this.stContable.baseParams.filter = filter;
        //     this.stContable.load();
        // };

    }
});


AuditoriaContable.Contable.WindowContable = Ext.extend(Ext.Window, {
    // constructor: function (params) {
    //     Ext.apply(this, params);
    //     Ext.apply(this, {
    //         autoValidate: false,
    //         modal: true,
    //         constrain: true,
    //         width: Ext.lib.Dom.getViewWidth() * 0.40,
    //         closeAction: 'close',
    //         frame: true,
    //         resizable: false,
    //         idioma: params.idioma,
    //         title: this.action == 'add' ? this.idioma.lbTitleAdd : this.idioma.lbTitleMod,
    //         listeners: {
    //             scope: this,
    //             show: function () {
    //                 this.scope.scope.keyMapa.disable();
    //             },
    //             close: function () {
    //                 this.scope.scope.keyMapa.enable();
    //             }
    //         }
    //     });
    //     this.createButtons();
    //     this.createForm();
    //     this.initFunctions();
    //     this.initEventos();
    //     AuditoriaContable.Contable.WindowContable.superclass.constructor.call(this);
    // },
    // createButtons: function () {
    //     this.btnCancelar = new Ext.Button({
    //         id: 'btnCancelar',
    //         iconCls: 'cancelar',
    //         selectOnFocus: true,
    //         text: this.idioma.lbCancelar,
    //         tooltip: this.idioma.lbTooltipCancelar,
    //         scope: this,
    //         handler: function () {
    //             this.close();
    //         }
    //     });
    //     this.btnAplicar = new Ext.Button({
    //         id: 'btnAplicar',
    //         iconCls: 'aplicar',
    //         hidden: this.action == 'add' ? false : true,
    //         text: this.idioma.lbAplicar,
    //         tooltip: this.idioma.lbTooltipAplicar
    //     });
    //     this.btnAceptar = new Ext.Button({
    //         id: 'btnAceptar',
    //         iconCls: 'aceptar',
    //         text: this.idioma.lbAceptar,
    //         tooltip: this.idioma.lbTooltipAceptar
    //     });
    //     this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    // },
    // createForm: function () {
    //
    //     this.formContable = new Ext.FormPanel({
    //         frame: true,
    //         layout: 'form',
    //         autoHeight: true,
    //         labelWidth: 50,
    //         labelAlign: 'top',
    //         trackResetOnLoad: true,
    //         items: [{
    //             layout: 'column',
    //             items: [{
    //                 columnWidth: .4,
    //                 layout: 'form',
    //                 items: []
    //             },
    //                 {
    //                     columnWidth: .3,
    //                     layout: 'form',
    //                     items: []
    //                 },
    //                 {
    //                     columnWidth: .3,
    //                     layout: 'form',
    //                     items: []
    //                 }
    //             ]
    //         },  {
    //             layout: 'column',
    //             items: [{
    //                 columnWidth: .4,
    //                 layout: 'form',
    //                 items: []
    //             }, {
    //                 columnWidth: .3,
    //                 layout: 'form',
    //                 items: []
    //             }, {
    //                 columnWidth: this.action == 'add' ? .18 : .28,
    //                 layout: 'form',
    //                 items: []
    //             },
    //                 {
    //                     style: 'margin: 10 0 0 10',
    //                     columnWidth: .12,
    //                     layout: 'form',
    //                     hidden: this.action == 'mod',
    //                     items: []
    //                 }
    //             ]
    //         }]
    //     });
    //
    //     this.items = [this.formContable];
    // },
    // initFunctions: function () {
    //     var me = this;
    // },
    // initEventos: function () {
    //     this.btnAceptar.on({
    //         scope: this,
    //         click: function () {
    //         }
    //     });
    //     this.btnAplicar.on({
    //         scope: this,
    //         click: function () {
    //         }
    //     });
    //     this.btnCancelar.on({
    //         scope: this,
    //         click: function () {
    //             this.close();
    //         }
    //     });
    // },
});

AuditoriaContable.Contable.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {

        this.panelContable = new AuditoriaContable.Contable.PanelContable({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
        });

        this.panelGeneral = new Ext.Panel({
            layout: 'border',
            frame: false,
            border: false,
            items: [this.panelContable]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelGeneral]
        });

        this.initGlobalsKeys();
        this.initFunctions();
        this.initEventos();

        AuditoriaContable.Contable.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.keyMapa = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {

                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                }
            }, {
                key: Ext.EventObject.DELETE,
                //alt: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: 'x',
                alt: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: 'r',
                alt: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: 'n',
                alt: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: "i",
                ctrl: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                }
            }, {
                key: "m",
                ctrl: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: 'x',
                ctrl: true,
                scope: this,
                fn: function () {
                }
            }, {
                key: "f",
                ctrl: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                }
            }, {
                key: "t",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                }
            }
        ]);

    },
    initFunctions: function () {
        var me = this;

        this.lMaskEspere = function () {
            this.lMask = new Ext.LoadMask(this.panelGeneral.body, {//body de la ventana
                msg: this.idioma.lbEspere,
                removeMask: false
            });
            this.lMask.show();
        };

    },
    initEventos: function () {
    },
});