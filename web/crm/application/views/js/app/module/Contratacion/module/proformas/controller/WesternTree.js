Ext.define('Proformas.controller.WesternTree', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'westernTree',
        selector: 'pro_westerntree'
    }],

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#Pro_WesternTree': {
                    beforeload: this.onBeforeLoad,
                    load: this.onLoadTree
                }
            },
            component: {
                'pro_westerntree': {
                    render: this.onRenderTree,
                    select: this.onNodeSelect,
                    selectionchange: this.buttonEnable,
                },
                'pro_westerntree button[action]': {
                    click: this.sortTree
                },
                'pro_westerntree menuitem[action]': {
                    click: this.sortTree
                },
                'pro_westerntree button[action=updatetree]': {
                    click: this.updateTree
                },
                'pro_westerntree searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });

    },
    onBeforeLoad: function (store) {
        var me = this;
        this.loadMask = new Ext.LoadMask(this.getWesternTree(), {msg: me.etiquetas.msgLoading});
        this.loadMask.show();
    },
    onLoadTree: function (store, records, successful, eOpts) {
        this.loadMask.hide();
        this.getWesternTree().getRootNode().expand();
    },
    onRenderTree: function (tree) {
        tree.getStore().load();
    },
    onSearch: function (field) {
        this.loadMask.show();
        this.getWesternTree().getStore().filter("text", field.getValue(), function () {
            this.loadMask.hide();
        }, this);
    },
    onClear: function (field) {
        this.loadMask.show();
        this.getWesternTree().getStore().clearFilter(function () {
            this.loadMask.hide();
        }, this);
        this.getWesternTree().getRootNode().expand();
    },

    buttonEnable: function (sm) {
        // var me = this,
        var tree = this.getWesternTree(),
            grid = tree.up('pro_main'),
            selection = sm.getSelection(),
            len = selection.length;
        console.log('len', len, grid.btnHeredar, grid)
        if (len == 1) {
            if (grid.btnHeredar) grid.btnHeredar.setDisabled(false);
        } else if (len == 0) {
            if (grid.btnHeredar) grid.btnHeredar.setDisabled(true);

        }
    },

    onNodeSelect: function (rowModel, record, index, eOpts) {
        var tree =  this.getWesternTree(),
            grid = tree.up('pro_main').centergrid,
            documentospanel = tree.up('pro_main').documentospanel,
            store = grid.getStore();

        if (record.data.id != 0) {

            //parametro definido para filtrar el grid
            grid.filter = {
                'idtipocontrato': record.data.id
            };

            //parametro definido para crear el formulario con estos
            //valores por defecto.
            grid.defaultValues = [
                {
                    field: 'idtipocontrato',
                    value: record.data.id,
                    disabled: false
                },
                {
                    field: 'DatTipoContrato.denominacion',
                    value: record.data.text,
                    disabled: false
                }
            ];
            console.log('record:', record)
            documentospanel.getStore().proxy.extraParams.idespaciotrabajo=record.get('idespaciotrabajo');
            documentospanel.getStore().load();
        } else {
            grid.filter = false;
            grid.defaultValues = false;
            delete documentospanel.getStore().proxy.extraParams.idespaciotrabajo;
            documentospanel.getStore().load();
        }

        store.load();
    },
    sortTree: function (btn) {
        this.getWesternTree().getStore().sort('text', btn.action);
    },
    updateTree:function(){
        this.getWesternTree().getStore().load();
    }
});
