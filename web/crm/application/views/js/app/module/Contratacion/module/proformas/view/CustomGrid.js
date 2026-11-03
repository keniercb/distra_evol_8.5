/**
 * Created by alberto on 31/07/2015.
 */
Ext.define('Proformas.view.CustomGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.customgrid',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.toolbar.Paging',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager',
        'Ext.ux.grid.FiltersFeature',
        'Ext.ux.SearchField'
    ],
    stripeRows: true,
    multiSelect: true,
    plugins: [Ext.create('CRM.plugins.grid.DragSelector'),
        {
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate('<p>{contenido}</p>')
        }
    ],
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;
        this.viewConfig = {
            deferEmptyText: false
        };

        this.createBody();

        this.on({
            render: function () {
                this.getView().refresh();
            }
        });
        this.callParent(arguments);
    },
    createBody: function () {
        var me = this,
            concept = (this.etiquetas['textNomClausula'] || 'cl&aacute;usula').toLowerCase(),
            conceptpl = this.etiquetas['textPlNomClausula'] || concept;

        this.btnAdd = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnAdd || 'Adicionar',
            tooltip: this.etiquetas.qtipAdd.get(concept),
            iconCls: 'adicionar',
            action: 'add',
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });

        this.btnEdit = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnMod || 'Modificar',
            tooltip: this.etiquetas.qtipMod.get(concept),
            disabled: true,
            action: 'edit',
            iconCls: 'modificar',
            actioncolumn: true,
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });

        this.btnDel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnDel || 'Eliminar',
            tooltip: this.etiquetas.qtipDel.get(concept),
            action: 'del',
            disabled: true,
            iconCls: 'eliminar',
            actioncolumn: true,
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnUp = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnUp || 'Subir',
            tooltip: this.etiquetas.qtipUp.get(concept),
            action: 'up',
            disabled: true,
            iconCls: 'arriba',
            keyMap: {
                key: Ext.EventObject.UP,
                alt: true,
                event: 'click'
            }
        });

        this.btnDown = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnDown || 'Bajar',
            tooltip: this.etiquetas.qtipDown.get(concept),
            action: 'down',
            disabled: true,
            iconCls: 'abajo',
            keyMap: {
                key: Ext.EventObject.DOWN,
                alt: true,
                event: 'click'
            }
        });

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            width: 250,
            searchTooltip: this.etiquetas.qtipSearch.get(conceptpl.toLowerCase()),
            clearTooltip: this.etiquetas.qtipCleanFilter,
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'clear'
                },
                {
                    key: 'b',
                    alt: true,
                    event: 'search'
                }
            ]
        });

        var tbar = [this.btnAdd, this.btnEdit, this.btnDel, this.btnUp, this.btnDown, '->', this.searchfield];

        this.topBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            enableOverflow: true,
            items: tbar
        });

        this.store = this.createStore();
        this.columns = [
            {
                text: 'No.',
                width: 35,
                dataIndex: 'orden',
                sortable: false
            },
            {
                text: this.etiquetas.lbclausula,
                flex: 1,
                dataIndex: 'denominacion',
                sortable: false
            }
        ];

        this.dockedItems = [this.topBar];
    },
    createStore: function () {

        Ext.define('Clausula', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idclausula'},
                {name: 'denominacion'},
                {name: 'contenido'},
                {name: 'orden', type:'int'}
            ]
        });

        return Ext.create('Ext.data.Store', {
            model: 'Clausula',
            sorters:[{'property':'orden'}],
            listeners:{
                datachanged:function(yo){
                    // console.log('datachanged', yo)
                    for(var i =0;i<yo.getCount();i++){
                        if(yo.getAt(i).get('orden')=='' || yo.getAt(i).get('orden')==undefined)
                            yo.getAt(i).set('orden', i+1);
                    };
                },
                update:function(){
                    // console.log('update')
                },
                add:function(){
                    // console.log('add')
                }
            }
        });
    }

});