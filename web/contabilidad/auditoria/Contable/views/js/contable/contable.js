// Ext.onReady(function(){
//     var data=['Auditoría de Catálago de Cuentas Contables','Auditoría a estados de Documentos de los Módulos','Auditoría a los comprobantes de Operaciones','Cuentas con saldos a su naturaleza'];
//
//     var comboLocal =new Ext.form.ComboBox({
//         fieldLabel: 'Tipos de auditorias contables',
//         name:'cmb-data',
//         forceSelection:true,
//         store:data,
//         emptyText:'Seleccionar',
//         triggerAction: 'all',
//         //hideTrigger:true,
//         editable:false,
//     });
//
//     var psuperior = new Ext.Panel({
//         id: 'id',
//         layout: 'fit',
//         // border: false,
//         region: 'center',
//         tbar: [comboLocal],
//         // items: [comboLocal]
//     });
//     var win = new Ext.Viewport({
//         items: [psuperior],
//         layout: 'border',
//         renderTo: document.body,
//         // layout: 'fit'
//     });
//
// });

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
        this.initFunctions();
        this.loadDataComponent(this);
        // this.loadMask();
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
                if (scope.responseData.Ejercicios.datos.length > 0) {
                    scope.Stejercicio.loadData(scope.responseData.Ejercicios);
                } else {
                    scope.initMsgWarning(2);
                    scope.pnlNorth.disable();
                }
                if (scope.responseData.Periodos.datos.length > 0) {
                   scope.Stperiodo.loadData(scope.responseData.Periodos);
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
        setTimeout(f(i), i * 800);
    }
},
    createButtonPanel: function () {
        var me = this;
        // var data = ['Auditoría de Catálago de Cuentas Contables', 'Auditoría a estados de Documentos de los Módulos', 'Auditoría a los comprobantes de Operaciones', 'Cuentas con saldos a su naturaleza'];

        var myData = [
           // [1, 'Auditoría de Catálago de Cuentas Contables'],
            [2, 'Estados de Documentos de los Módulos'],
            [3, 'Comprobantes de Operaciones'],
            // [4, 'Cuentas con saldos a su naturaleza'],
        ];

        var st = new Ext.data.SimpleStore({
            fields: ['id', 'text'],
            data: myData
        });
        this.Stejercicio = new Ext.data.Store({
            url: 'obtenerEjercicio',
            baseParams: '',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                // totalProperty: 'cantidad',
                // idProperty: 'idSub',
            }, [
                // {name: 'nombsubsistema', mapping: 'nombsubsistema', type: 'string'},
                {name: 'nombre'},
                {name: 'id', mapping: 'idejercicio'},
            ]),
            listeners: {
                load: function (store, records, options) {
                    if(store.reader.jsonData.Actual){
                        me.comboLocalEjercicio.setValue(store.reader.jsonData.Actual);
                    }
                }
            }
        });
        this.estadosFinanzas = [
            [8, 'Guardado'],
            [5, 'Confirmado'],
            [6, 'Posteado'],
            [7, 'Cancelado'],
        ];
        this.estadosContabilidad = [
            [8030, 'Sin error'],
            [8031, 'Terminado'],
            [8032, 'Asentado'],
            [8033, 'Con error'],
            [8034, 'Anulado'],
        ];

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['id', 'text'],
            data: []
        });

        this.Stperiodo = new Ext.data.Store({
            url: 'obtenerPeriodos',
            baseParams: '',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idperiodo',
                root: 'datos'
                // root: 'datos',
                // totalProperty: 'cantidad',
                // idProperty: 'idSub',
            }, [
                // {name: 'nombsubsistema', mapping: 'nombsubsistema', type: 'string'},
                {
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }, {
                    name: 'idejercicio'
                },

            ]),
            listeners: {
                load: function (store, records, options) {
                    if(store.reader.jsonData.Actual){
                        me.comboLocalPeriodo.setValue(store.reader.jsonData.Actual);
                    }
                }
            }
        });
        this.comboLocalEjercicio = new Ext.form.ComboBox({
            id: 'ejercicio',
            name: 'cmb-data',
            style: 'margin: 0 0 0 10',
            forceSelection: true,
            displayField: 'nombre',
            valueField:'id',
            store: this.Stejercicio,
            mode: 'local',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            // hideTrigger:true,
            editable: false,
            align: 'right',
            width:100,

        });
        this.comboLocalPeriodo = new Ext.form.ComboBox({
            id:'Periodo',
            name: 'cmb-data',
            style: 'margin: 0 0 0 10',
            displayField: 'codigo',
            valueField:'idperiodo',
            store: this.Stperiodo,
            forceSelection: true,
            mode: 'local',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            // hideTrigger:true,
            editable: false,
            align: 'right',
            width:100,

        });
        this.comboLocal = new Ext.form.ComboBox({
            name: 'cmb-data',
            id:'comboLocal',
            style: 'margin: 0 0 0 10',
            displayField: 'text',
            valueField: 'id',
            forceSelection: true,
            store: st,
            mode: 'local',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            //hideTrigger:true,
            editable: false,
            align: 'right',
            width:250,
        });
        this.comboEstado = new Ext.form.ComboBox({
            //fieldLabel: 'Tipos de auditorias contables',
            name: 'cmb-data',
            id:'comboEstado',
            style: 'margin: 0 0 0 10',
            displayField: 'text',
            valueField: 'id',
            forceSelection: true,
            store: this.stEstado,
            mode: 'local',
            emptyText: 'Seleccionar',
            triggerAction: 'all',
            //hideTrigger:true,
            editable: false,
            align: 'right',
            width:100,
        });

        me.comboEntidad = new Ext.CONT.UIXCombo({
            // emptyText: me.etiquetas.txtSeleccione,
            allowBlank: false,
            fieldLabel: 'Entidad',
            tabIndex: 1,
            emptyText: 'Seleccionar',
            width:100,
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'Entidades',
            // autoLoad: true,
            width:10,
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
            }]),

        });

        this.lbAuditoria = new Ext.form.Label({
            id: 'id',
            text: 'Auditorias: ',
            style: 'font-weight:bold;',

        }); this.cbEjercicio = new Ext.form.Label({
            id: 'idejercicio',
            text: 'Ejercicio ',
            style: 'font-weight:bold;',

        });
        this.cbEntidad = new Ext.form.Label({
            id: 'id',
            text: 'Entidad: ',
            style: 'font-weight:bold;',

        });
        this.cbEstado = new Ext.form.Label({
            id: 'Estado',
            text: 'Estado: ',
            style: 'font-weight:bold;',

        });
        this.btn = new Ext.Button({
            iconCls: 'buscaravanzada',
            disabled: true,
            text: 'Buscar',
            id:'BotonBuscar',
            tooltip: this.idioma.lbTooltipBtn,


        });
        this.lbPeriodo = new Ext.form.Label({
            id: 'id',
            text: 'Periodo: ',
            style: 'font-weight:bold;',

        });
        this.Vistareporte = new Ext.Button({
            iconCls: 'vistareporte',
            id:'idVistareporte',
            tooltip: 'Vista reporte <b>(Alt + R)</b>',
            text:'Vista reporte',
            disabled: true,
            columns: 2,
        });

        this.tbar = [
            '','','',
            this.cbEntidad,
            '-','','',
            this.comboEntidad,
            '','','','',
            this.cbEjercicio,
            '-',
            this.comboLocalEjercicio,
            '','','','','','',
            this.lbPeriodo,
            '-',
            this.comboLocalPeriodo,
            '','','','','','',
            this.lbAuditoria,
            '-',
            // '->',
            this.comboLocal,
            '','','','','','',
            this.cbEstado,
            '-',
            this.comboEstado,
            '','','','','','',
            this.btn,

        ];
    }
    ,
    createGridPanel: function () {
        var  me = this;
        this.stContable = new Ext.data.GroupingStore({
            url: '',
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: false,

            reader: new Ext.data.JsonReader({
                // root: ''
            }, this.record = Ext.data.Record.create([
               ,

            ])),
            sortInfo: {field: '', direction: 'ASC'}
        });


        this.colModelAudCatalogo = new Ext.grid.ColumnModel([
            {header: 'Efectivo en caja', dataIndex: 'efectivo en caja'},
            {header: 'Pacivo circulante', dataIndex: 'pacivo circulante'},
            {header: 'Activo circulante', dataIndex: 'activo circulante'},
        ]);
        /////////////////////////////////////////////////////////////////////////
        this.auDocM = new Ext.data.GroupingStore({
            url: 'DocumentosModulos',
//--------------por donde agrupar
            groupField:'denominacion',

            baseParams: {
                limit: 15,
                start: 0
            },
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',

            }, Ext.data.Record.create([
                {name: 'denominacion'},
                {name: 'numerodocumento'},
                {name: 'descripcion'},
                {name:'fecha'},
                {name:'tipodocumento'},
            ])),
            sortInfo: {field: 'numerodocumento', direction: 'ASC'}
        });

        this.colModelDocumento = new Ext.grid.ColumnModel([
            {header: 'Subsistemas', dataIndex: 'denominacion',hideable: false, hidden: true, width:100},
            {header: 'Num.Documento', dataIndex: 'numerodocumento'},
            {header: 'Fecha', dataIndex: 'fecha'},
            {header: 'Tipo.Documento', dataIndex: 'tipodocumento',width:200},
            {header: 'Estado', dataIndex: 'descripcion'},

        ]);
        ///////////////////////////////////////////////////////////////////////

        this.auCOpe = new Ext.data.GroupingStore({
            url: 'DocumentosModulos',
            groupField:'subsistema',

            baseParams: {
                limit: 15,
                start: 0,
            },
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cantidad',
                    root: 'datos',
            },

                Ext.data.Record.create([
                    {name: 'numerocomprobante'},
                    {name: 'fechaemision'},
                    {name: 'descripcion'},
                    {name: 'nombreusuario'},
                    {name: 'subsistema'},
                    {name: 'estado'},
            ])),
            sortInfo: {field: 'fechaemision', direction: 'ASC'}
        });

        this.colModelAudCatalogo2 = new Ext.grid.ColumnModel([
            {header: 'No.Comprobante', dataIndex: 'numerocomprobante',width:50 },
            {header: 'Fecha', dataIndex: 'fechaemision',width:50},
            {header: 'Subsistema', dataIndex: 'subsistema',hideable: false, hidden: true,width:200},
            {header: 'Descripción', dataIndex: 'descripcion',width:200},
            {header: 'Usuario', dataIndex: 'nombreusuario'},
            {header: 'Estado', dataIndex: 'estado'},

        ]);
        /////////////////////////////////////////////////////////////////////////


        this.gpContable = new Ext.grid.GridPanel({
            store: this.auDocM,
            loadMask: true,
            border: false,
            frame: false,
//--------------------agrupar
            view: new Ext.grid.GroupingView({
                forceFit: true
            }),
            sm: this.smContable = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            // cm: this.colModelDocumento,
            columns: [
                {
                    header: ''
                }
            ],
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
                        me.gpContable.getStore().baseParams.id = me.comboLocal.getValue();//------cambiar de pagina pasando el id
                    },
                }
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

        this.btn.setHandler(function () {//-----------------------boton aceptar
            me.pagToolContable.doClear();//--------------------------cuando cambia empieza la pagina que seleccionas desde uno
            var store = me.gpContable.getStore();
            store.baseParams.idestructurae = me.comboEntidad.fSelect.values[0];//---------mostrar la informacion
            store.baseParams.idgA = me.comboLocal.getValue();
            store.baseParams.idEstado = me.comboEstado.getValue();
            store.baseParams.idejercicio = me.comboLocalEjercicio.getValue();
            store.baseParams.idperiodo = me.comboLocalPeriodo.getValue();
                store.load({
                params: {
                   id : me.comboLocal.getValue()
                },
            })
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Ext.getCmp('comboLocal').on({
            select: function (combo, record, index) {

                if (record.get('id') === 2) {
                    me.gpContable.reconfigure(me.auDocM, me.colModelDocumento);
                    me.pagToolContable.bind(me.auDocM);
                    me.stEstado.loadData(me.estadosFinanzas);
                }
                // if(record.get('id') === 4){
                //     me.gpContable.reconfigure(me.stContable, me.colModelAudCatalogo);
                // }
                if(record.get('id') === 3){
                    me.gpContable.reconfigure(me.auCOpe, me.colModelAudCatalogo2);
                    me.pagToolContable.bind(me.auCOpe);
                    me.stEstado.loadData(me.estadosContabilidad);
                }
                me.comboEstado.clearValue();//limpiar cuando selecciono de new en el comboBox
                me.habilitarBtn();
            },
            deselect: function () {
            }
        });
        // Ext.getCmp('gpEntidad').getSelectionModel().on('rowselect', function (selectionModel, rowIndex, record) {
        //     me.habilitarBtn();
        // });

        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, opt) {
            if(store.reader.jsonData.Actual){
                me.comboEntidad.fSelect.display.push(store.reader.jsonData.Nombre);
                me.comboEntidad.fSelect.values.push(store.reader.jsonData.Actual);
                me.comboEntidad.setValue(store.reader.jsonData.Actual);
                me.comboEntidad.setRawValue(store.reader.jsonData.Nombre);
            }
        });

        Ext.getCmp('Periodo').on({select: function (combo, record, index) {
                me.habilitarBtn();
            },
            deselect: function () {
            }
        });
        this.comboLocalEjercicio.on('select', function (combo, record, index) {

            var result = new Array();
            result.push({
                idEjercicio:  record.get('id')
            });
            me.Stperiodo.removeAll();
            me.Stperiodo.load({
                params: {
                    arrayEjercicios: Ext.encode(result)
                }
            });

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
            for (var i= 0; i < datosReporte.datoCuerpo.length;i++) {
                datosReporte.datoCuerpo[i].descripcion = datosReporte.datoCuerpo[i].descripcion.substring(0,45)+'...';
            }
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };

        //Evento click para el boton de la vista reporte
        me.Vistareporte.on('click', function(){
            me.loadMessageBox();
            var arrColumnas = [];

            for (var i = 0; i < me.gpContable.getColumnModel().config.length; i++){//////entrar al header
                arrColumnas.push({
                    column: me.gpContable.getColumnModel().config[i].header,
                    data:  me.gpContable.getColumnModel().config[i].dataIndex,
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
                    idgA: me.comboLocal.getValue(),
                    idEstado: me.comboEstado.getValue(),
                    id: me.comboLocal.getValue(),
                    idejercicio: me.comboLocalEjercicio.getValue(),
                    idperiodo: me.comboLocalPeriodo.getValue(),
                    titulo: me.comboLocal.getRawValue(),
                    columnas: Ext.encode(arrColumnas)
                },
                url: "Reportes",
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData)
                        fOpenWindowReport(responseData);
                    Ext.MessageBox.hide();
                }
            });
        },this);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    ,
    initFunctions: function () {

        var me = this;
        //
        // this.search = function (filter) {
        //     this.stContable.baseParams.filter = filter;        //     this.stContable.load();
        // };

        me.habilitarBtn = function () {
            if(  me.comboLocal.getValue()&& me.comboLocalPeriodo.getValue()){ //&& me.comboEstado.getValue()me.comboEntidad.fSelect.values.length != 0 &&
                me.btn.enable();
                me.Vistareporte.enable();
            }
            else{
                me.btn.disable();
                me.Vistareporte.disable();
            }
        }
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