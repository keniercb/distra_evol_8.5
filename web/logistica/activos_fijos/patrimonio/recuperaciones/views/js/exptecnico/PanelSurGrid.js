Ext.ns('Ext.Log.ExpTec');
Ext.QuickTips.init();

Ext.Log.ExpTec.PanelSurGrid= Ext.extend(Ext.Panel, {
    constructor: function(config) {        
        Ext.apply(this, config);        
        var _this = this;
        this.layout = 'fit';

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.cm = new Ext.grid.ColumnModel([
            new Ext.LOG.PagingRowNumberer(),
            {
                header: _this.idioma.lbCMNroSeir,
                dataIndex: 'nroserie',
                width:100
            }, {
                header: _this.idioma.lbCMNroInventario,
                dataIndex: 'nroinventario',
                width:100
            }, {
                header: _this.idioma.lbCMNroMatricula,
                dataIndex: 'nromatricula',
                width:80
            }, {
                header: _this.idioma.lbCMkilometraje,
                dataIndex: 'kilometraje',
                width:80
            }, {
                header: _this.idioma.lbCMNroCirculacion,
                dataIndex: 'nrocirculacion',
                width:80
            }, {
                header: _this.idioma.lbCMActividad,
                dataIndex: 'actividad',
                width:100
            }, {
                header: _this.idioma.lbCMValorAdquisicion,
                dataIndex: 'valoradquisicion',
                width:100
            }, {
                header: _this.idioma.lbCMFechaAdquisicion,
                dataIndex: 'fechaadq',
                width:100
            }, {
                header: _this.idioma.lbCMValorContable,
                dataIndex: 'valorcontable',
                width:100
            }, {
                header: _this.idioma.lbCMFicav,
                dataIndex: 'ficav',
                width:50
            }, {
                header: _this.idioma.lbCMLot,
                dataIndex: 'lot',
                id: 'idlot'
            }
        ]);

        this.store = new Ext.data.Store({
            url: 'getDatosMedio',
            autoLoad:true,
            baseParams: {
                idregnumerico :_this.idregnumerico
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'nroserie'
                },
                {
                    name: 'nroinventario'
                },
                {
                    name: 'valoradquisicion'
                },
                {
                    name: 'valorcontable'
                },
                {
                    name: 'fechaadq'
                },
                {
                    name: 'nromatricula'
                },
                {
                    name: 'kilometraje'
                },
                {
                    name: 'ficav'
                },
                {
                    name: 'lot'
                },
                {
                    name: 'nrocirculacion'
                },
                {
                    name: 'actividad'
                }
            ])
        });

        this.grid = new Ext.grid.GridPanel({
            border: false,
            bodyBorder: false,
            autoExpandColumn: 'idlot',
            loadMask: true,
            cm: _this.cm,
            store: _this.store,
            sm: _this.sm
        });

        this.items = [_this.grid];

        Ext.Log.ExpTec.PanelSurGrid.superclass.constructor.apply(this, arguments);
    } 
})