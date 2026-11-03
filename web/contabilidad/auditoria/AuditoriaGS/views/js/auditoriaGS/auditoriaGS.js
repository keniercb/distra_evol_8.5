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
        this.createButtonPanel();
        this.createGridPanel();
        this.initEventos();
        // this.initFunctions();
        AuditoriaContable.Contable.PanelContable.superclass.constructor.call(this);
    },
    createButtonPanel: function () {

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
                {name: 'id', mapping: 'idsubsistema'},
            ]),
        });

        this.comboLocal = new Ext.form.ComboBox({
            //fieldLabel: 'Tipos de auditorias contables',
            name: 'cmb-data',
            style: 'margin: 0 0 0 10',
            displayField: 'nombsubsistema',
            forceSelection: true,
            store: st,
            mode: 'remote',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            //hideTrigger:true,
            editable: false,
            align: 'right',
            width:200,
        });
        this.lbAuditoria = new Ext.form.Label({
            id: 'id',
            text: 'Subsistemas: ',
            style: 'font-weight:bold;',

        });
        this.btn = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: this.idioma.lbTooltipBtn,


        });
        this.Vistareporte = new Ext.Button({
            iconCls: 'vistareporte',
            text:'Vista reporte',
            columns: 2,
        });

        this.tbar = [
            '','','',
            this.lbAuditoria,
            '-',
            // '->',
            this.comboLocal,
            '','','','','','','','','',
            this.btn

        ];
    }
    ,
    createGridPanel: function () {
        this.stContable = new Ext.data.GroupingStore({
            url: '',
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: false,

            reader: new Ext.data.JsonReader({
                root: ''
            }, this.record = Ext.data.Record.create([
                {name: '', type: ''},
            ])),
            sortInfo: {field: '', direction: 'ASC'}
        });
        this.colModelAudCatalogo = new Ext.grid.ColumnModel([
            {header: 'Documento', dataIndex: 'documento'},
            {header: 'No.Documento', dataIndex: 'no.Documento'},
            {header: 'Importe', dataIndex: 'importe'},
        ]);

        this.gpContable = new Ext.grid.GridPanel({
            store: this.stContable,
            loadMask: true,
            border: false,
            frame: false,
            view: new Ext.grid.GridView({
                forceFit: true
            }),
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
                emptyMsg: "No hay resultados para mostrar."//etiquetas.lbNoResult
            })
        });
        this.items = [
            this.gpContable,
        ];
    }
    ,
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

        this.comboLocal.on({
            select: function (combo, record, index) {
                // if (record.get('id') == 14) {
                // me.gpContable.reconfigure(me.auDocM, me.colModelAudCatalogo1);
                me.gpContable.getColumnModel().setColumnHeader(1, 'No.Documento ' + record.get('nombsubsistema'));
                // }
                // if(record.get('id') == 1){
                //     me.gpContable.reconfigure(me.stContable, me.colModelAudCatalogo);
                // }
                // if(record.get('id') == 3){
                //     me.gpContable.reconfigure(me.auCOpe, me.colModelAudCatalogo2);
                // }

                // else if () {

                // }

            },
            deselect: function () {

            }
        });
        ////////////////////////////////////////////////////////////////////////////////Vista reporte
        //Funcion que crea la ventana para el reporte
        this.crearPrintView = function(dataReport, defaultValues) {
            return new SCFPrintView(dataReport, "/contabilidad/comun/SCFPrintView/", defaultValues);
        };

        //Evento click para el boton de la vista reporte
        me.Vistareporte.on('click', function(){
            var datosReporte = new Array();
            var printView = me.crearPrintView(datosReporte, {paperSize: "A4", orientation: "Vertical", reportType: "HTML"});
            printView.show();
        },this);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    ,
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