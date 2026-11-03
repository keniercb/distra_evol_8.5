/**
 * Created by alberto on 30/07/2015.
 */
Ext.define('Proformas.view.WesternTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.pro_westerntree',
    rootVisible: true,
    region: 'west',
    flex: 0.2,
    minWidth: 200,
    maxWidth: 245,
    collapsible: true,
    split: true,
    layout: 'fit',
    loadMask: true,
    collapseFirst: false,
    hideHeaders: true,
    border: false,
    initComponent: function () {
        var _this = this;
        _this.addCls(_this.autoWidthCls);

        _this.columns = [Ext.create('Ext.ux.IconTreeColumn', {
            text: 'Name',
            width: _this.isIE6 ? '100%' : 10000, // IE6 needs width:100%
            dataIndex: _this.displayField
        })];

        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var _this = this;

        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;

        this.createStore();

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            searchTooltip: _this.etiquetas.qtipBuscar,
            clearTooltip: _this.etiquetas.qtipLimpiar
        });

        this.btnAsc = Ext.create('Ext.Button', {
            icon: '../../views/images/hmenu-asc.gif',
            action: 'asc',
            tooltip: _this.etiquetas.qtipSortAsc
        });

        this.btnDesc = Ext.create('Ext.Button', {
            icon: '../../views/images/hmenu-desc.gif',
            action: 'desc',
            tooltip: _this.etiquetas.qtipSortDesc
        });

        this.btnUpdate = Ext.create('Ext.Button', {
            iconCls: 'actualizar',
            action: 'updatetree',
            tooltip: 'Actualizar'
        });

        this.topBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            enableOverflow: true,
            items: [this.searchfield, '-', this.btnAsc, this.btnDesc]
        });

        this.bottomBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'bottom',
            action:'updatetree',
            enableOverflow: true,
            items: [this.btnUpdate]
        });
        this.dockedItems = [this.topBar,this.bottomBar];
    },
    createStore: function () {
        var me = this;
        Ext.define('tipocontrato', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id', type: 'int'},
                {name: 'text', type: 'string'},
                {name: 'leaf', type: 'boolean'},
                {name: 'idestructuracomun', type: 'int'},
                {name: 'idespaciotrabajo', type: 'string'},
                {
                    name: 'iconCls', type: 'string', convert: function (v, record) {
                    if (record.get('leaf')) {
                        return 'icondistra-tipocontratocrm';
                    }
                }
                },
            ],

            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: me.action}, ModuleMgr.get(me.module))
            }
        });

        this.store = Ext.create('Ext.data.TreeStore', {
            model: 'tipocontrato',
            storeId: 'Pro_WesternTree',
            autoLoad: false,
            root: {
                text: me.etiquetas.titleTiposContratos,
                id: 0,
                expanded: false
            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });
    }
});