/**
 * Created by alberto on 30/07/2015.
 */
Ext.define('BaseModule.view.WesternTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.westerntree',
    rootVisible: false,
    region: 'west',
    flex: 0.2,
    minWidth: 200,
    maxWidth: 245,
    collapsible: true,
    split: true,
    layout: 'fit',
    title: 'Nomencladores',
    loadMask: true,
    collapseFirst: false,
    hideHeaders: true,
    border: false,
    initComponent: function () {
        var me = this,
            globalLang = LangMgr.getLang(this);

        this.etiquetas = Ext.Object.merge(globalLang, me.etiquetas || {});
        this.emptyText = this.etiquetas.msgNoDataLoaded;

        me.addCls(me.autoWidthCls);

        me.columns = [Ext.create('Ext.ux.IconTreeColumn', {
            text: 'Name',
            width: me.isIE6 ? '100%' : 10000, // IE6 needs width:100%
            dataIndex: me.displayField
        })];

        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.createStore();

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            clearTooltip: me.etiquetas.qtipLimpiar || 'Limpiar filtro',
            searchTooltip: me.etiquetas.qtipBuscar || 'Buscar elementos'
        });

        this.btnAsc = Ext.create('Ext.Button', {
            icon: '../../views/images/hmenu-asc.gif',
            action: 'asc',
            tooltip: me.etiquetas.qtipSortAsc || 'Orden ascendente'
        });

        this.btnDesc = Ext.create('Ext.Button', {
            icon: '../../views/images/hmenu-desc.gif',
            action: 'desc',
            tooltip: me.etiquetas.qtipSortDesc || 'Orden descendente'
        });

        this.topBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            enableOverflow: true,
            items: [this.searchfield, '-', this.btnAsc, this.btnDesc]
        });
        this.dockedItems = [this.topBar];
    },
    createStore: function () {
        var me = this;

        var nomenclador = Ext.define('nomenclador', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'text', type: 'string', convert: me.convertText.bind(me)},
                {name: 'leaf', type: 'boolean'},
                {name: 'qtip', type: 'string', convert: me.convertQtip.bind(me)},
                {name: 'gen', type: 'string'},
                {name: 'clase', type: 'string'}
            ],

            proxy: {
                extraParams: {
                    fileConfig: ""
                },
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getNomenclador'}, ModuleMgr.get(me.module || 'Nomencladores'))
            }
        });

        this.store = Ext.create('Ext.data.TreeStore', {
            model: 'nomenclador',
            storeId: 'WesternTree',
            autoLoad: false,
            root: {
                text: 'Nomenclador',
                id: 'nomenclador',
                expanded: false
            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });
    },
    convertText: function (value, record) {
        return this.etiquetas['text' + record.data['clase']] || value;
    },
    convertQtip: function (value, record) {
        return this.etiquetas['qtip' + record.data['clase']] || value;
    }
});