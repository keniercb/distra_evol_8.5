Ext.ns('Ext.Log.Desglote');

Ext.QuickTips.init();

Ext.Log.Desglote.ventana = Ext.extend(Ext.Window, {
    idioma: '',
    baseDirController: '/logistica/utiles/producto/index.php/desglote/',
    constructor: function(config) {

        var _this = this;
        Ext.Ajax.request({
            url: _this.baseDirController + 'cargaretiquetas',
            callback: function(options, success, response) {
                if (success) {
                    _this.idioma = Ext.decode(response.responseText);
                    _this._initComponent();
                    _this.show();
                    _this.maximize();
                }
            }
        });
        Ext.Log.Desglote.ventana.superclass.constructor.call(this, config);
    },
    _initComponent: function() {
        var _this = this;

        this.btnsiguiente = new Ext.Button({
            id: 'btnsiguiente',
            iconCls: 'siguiente',
            tooltip: _this.idioma.Ttsiguiente,
            handler: function() {
            }
        });

        this.btnanterior = new Ext.Button({
            id: 'btnanterior',
            iconCls: 'anterior',
            tooltip: _this.idioma.Ttanterior,
            handler: function() {
            }
        });

        this.btnAdicionarlote = new Ext.Button({
            id: 'btnAdicionarlote',
            iconCls: 'adicionar',
			text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.btnTtAdicionar,
            handler: function() {
                /*var win = VentanaAddTipoColor(true);
                 win.show();*/
            }
        });

        this.btnEliminarlote = new Ext.Button({
            id: 'btnEliminarlote',
            iconCls: 'eliminar',
			text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.btnTtEliminar,
            handler: function() {
                //eliminar();
            }
        });



        this.Record = new Ext.data.Record.create(
                [{
                        name: 'idlote',
                        mapping: 'idlote'
                    }, {
                        name: 'numero',
                        mapping: 'numero'
                    }, {
                        name: 'fechafabricacion',
                        mapping: 'fechafabricacion'
                    }, {
                        name: 'fechavencimiento',
                        mapping: 'fechavencimiento'
                    }, {
                        name: 'existencialote',
                        mapping: 'existencialote'
                    }, {
                        name: 'cantidaddisponible',
                        mapping: 'cantidaddisponible'
                    }, {
                        name: 'capacidadbulto',
                        mapping: 'capacidadbulto'
                    }, {
                        name: 'numerobulto',
                        mapping: 'numerobulto'
                    }, {
                        name: 'resto',
                        mapping: 'resto'
                    }]);


        this.stdesglote = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: 'idstdesglote'
            }, _this.Record)
                    /*listeners : {
                     'beforeload' : function(store, objeto) {
                     onloadMask('Cargando...');
                     },
                     'load' : function(store, records, options) {
                     Ext.getBody().unmask();
                     }
                     } */
        });

        this.cm = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [new Ext.LOG.PagingRowNumberer(),
					{header: _this.idioma.hdNumero, width: 80, dataIndex: 'numero'},
					{header: _this.idioma.hdFechaF, width: 130, dataIndex: 'fechafabricacion'},
					{header: _this.idioma.hdFechaV, width: 130, dataIndex: 'fechavencimiento'},
					{header: _this.idioma.hdExistencia, width: 130, dataIndex: 'existencialote'},
					{header: _this.idioma.hdCantidad, width: 130, dataIndex: 'cantidaddisponible'},
					{header: _this.idioma.hdCapacidad, width: 130, dataIndex: 'capacidadbulto'},
					{header: _this.idioma.hdNumeroBulto, width: 100, dataIndex: 'numerobulto'},
					{header: _this.idioma.hdResto, width: 100, dataIndex: 'resto'},
					{hidden: true, hideable: false, dataIndex: 'idlote'}]
        });

        this.gpdesglote = new Ext.grid.GridPanel({
            title: _this.idioma.TitleGpdesglote,
            region: 'center',
            store: _this.stdesglote,
            cm: _this.cm,
            id: 'idgpdesglote',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                moveEditorOnEnter: false,
                listeners: {
                    'selectionchange': function(sm) {
                    },
                }
            }),
            viewConfig: {
                forceFit: true
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.stdesglote,
                displayInfo: true,
                displayMsg: _this.idioma.displayMsg,
                emptyMsg: _this.idioma.emptyMsg
            }),
        });

        //stdesglote.load();


        /**
         *Grid de abajo
         */

        this.Record = new Ext.data.Record.create(
                [{
                        name: 'idlote',
                        mapping: 'idlote'
                    }, {
                        name: 'numero',
                        mapping: 'numero'
                    }, {
                        name: 'fechafabricacion',
                        mapping: 'fechafabricacion'
                    }, {
                        name: 'fechavencimiento',
                        mapping: 'fechavencimiento'
                    }, {
                        name: 'existencialote',
                        mapping: 'existencialote'
                    }, {
                        name: 'cantidaddisponible',
                        mapping: 'cantidaddisponible'
                    }, {
                        name: 'capacidadbulto',
                        mapping: 'capacidadbulto'
                    }, {
                        name: 'numerobulto',
                        mapping: 'numerobulto'
                    }, {
                        name: 'resto',
                        mapping: 'resto'
                    }]);


        this.stresgdesglote = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: 'idstresgdesglote'
            }, _this.Record)
                    /*listeners : {
                     'beforeload' : function(store, objeto) {
                     onloadMask('Cargando...');
                     },
                     'load' : function(store, records, options) {
                     Ext.getBody().unmask();
                     }
                     }  */
        });

        this.cm = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [new Ext.LOG.PagingRowNumberer(),
					{header: _this.idioma.hdNumero, width: 80, dataIndex: 'numero'},
					{header: _this.idioma.hdFechaF, width: 130, dataIndex: 'fechafabricacion'},
					{header: _this.idioma.hdFechaV, width: 130, dataIndex: 'fechavencimiento'},
					{header: _this.idioma.hdExistencia, width: 130, dataIndex: 'existencialote'},
					{header: _this.idioma.hdCantidad, width: 130, dataIndex: 'cantidaddisponible'},
					{header: _this.idioma.hdCapacidad, width: 130, dataIndex: 'capacidadbulto'},
					{header: _this.idioma.hdNumeroBulto, width: 100, dataIndex: 'numerobulto'},
					{header: _this.idioma.hdResto, width: 100, dataIndex: 'resto'},
					{hidden: true, hideable: false, dataIndex: 'idlote'}]
        });

        this.gpresgdesglote = new Ext.grid.GridPanel({
            title: _this.idioma.TitleGpresgdesglote,
            region: 'south',
            height: 265,
            store: _this.stresgdesglote,
            cm: _this.cm,
            id: 'idresgdesglote',
            tbar: [_this.btnAdicionarlote, _this.btnEliminarlote],
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                moveEditorOnEnter: false,
                listeners: {
                    'selectionchange': function(sm) {
                    },
                }
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.stresgdesglote,
                displayInfo: true,
                displayMsg: _this.idioma.displayMsg,
                emptyMsg: _this.idioma.emptyMsg
            }),
        });

        //stresgdesglote.load();

        this.panel = new Ext.Panel({
            layout: 'border',
            region: 'center',
            id: 'Paneles',
            tbar: [_this.btnanterior, _this.btnsiguiente],
            items: [_this.gpdesglote, _this.gpresgdesglote]
        });

        Ext.applyIf(this, {
            title: _this.idioma.TitlePanel,
			frame: true,
            layout: 'border',
            items: [_this.panel]
        });
		
        Ext.Log.Desglote.ventana.superclass.initComponent.call(this, arguments);

    }
    

});





	