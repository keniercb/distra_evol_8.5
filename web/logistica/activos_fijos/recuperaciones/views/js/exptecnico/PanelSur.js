Ext.ns('Ext.Log.ExpTec');
Ext.QuickTips.init();

Ext.Log.ExpTec.PanelSur = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        _this.idioma = config.idioma;
        _this.title = _this.idioma.lbTitlePanelSur;
        _this.perfil = config.perfil;
        _this.region = config.region;
        _this.height = 200;
        _this.layout = 'fit';
        _this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }),
            {
                header: 'N.\xb0 Documento',
                dataIndex: 'nrodoc',
                align: 'lefth'
            }, {
                header: _this.idioma.lbFecha,
                dataIndex: 'fechacontable',
                sortable: true
            }, {
                header: _this.idioma.lbOperacion,
                dataIndex: 'denominacion',
                id: 'iddenominacion'
            }
        ]);

        _this.store = new Ext.data.Store({
            url: 'getMovimientosRegistro',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'fechacontable'
                },
                {
                    name: 'nrodoc'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'beforeload': function(store) {
                    store.baseParams.limit = _this.grid.getBottomToolbar().pageSize;
                    if(!store.baseParams.idregnumerico){
                         mostrarMensaje(1, _this.idioma.lbMsgErrorMovSelec);
                         return false;
                    }
                },
                'load': function(store) {
                    if(store.getTotalCount() == 0){
                        mostrarMensaje(1, _this.idioma.lbMsgErrorMov);
                    }
                }
            }
        });

        _this.grid = new Ext.grid.GridPanel({
            border: false,
            bodyBorder: false,
            autoExpandColumn: 'iddenominacion',
            loadMask: true,
            cm: _this.cm,
            store: _this.store,
            sm: _this.sm,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.store,
                displayInfo: true,
                displayMsg: this.idioma.lbMsgResultadosMov,
                emptyMsg: this.idioma.lbMsgNoResultadosMov
            })
        });

        _this.items = [_this.grid];

        Ext.Log.ExpTec.PanelSur.superclass.constructor.apply(this, arguments);
    },

    cargarMovimientos: function(idreg,idarea) {
        this.store.baseParams = {};
        this.store.baseParams. idregnumerico= idreg;
        this.store.baseParams. idarearesp= idarea;
        this.store.baseParams. start= 0;
        this.store.baseParams. limit= 20;
        this.store.load();
    }   
})