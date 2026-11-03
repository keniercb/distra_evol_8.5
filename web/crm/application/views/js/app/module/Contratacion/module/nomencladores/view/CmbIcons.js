Ext.define('Nomencladores.view.CmbIcons', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbicons',
    validateOnBlur: true,
    enableKeyEvents: true,
    pickerrender: false,
    multiSelect: false,
    queryMode: 'remote',
    typeAhead: true,
    displayField: 'name',
    valueField: 'name',
    pageSize: 100,
    autoExpand: false,
    listLoadingText: 'Cargando...',
    listEmptyText: 'No existen datos que mostrar.',
    module: '',
    method: '',
    initComponent: function () {
        this.listConfig = {
            loadingText: this.listLoadingText,
            emptyText: '<div class="x-grid-empty">' + this.listEmptyText + '</div>',
            tpl: '<ul class="' + Ext.plainListCls + '">' +
                    '<tpl for=".">' +
                        '<li role="option" unselectable="on" style="list-style-type: none;" class="x-boundlist-item icondistra-{name} {color}">{name}</li>' +
                    '</tpl>' +
                 '</ul>'
        };

        this.createButton();

        this.createStore();

        this.callParent();
    },
    createStore: function () {
        var me = this;
        this.store = Ext.create('Ext.data.Store', {
            pageSize: me.pageSize,
            fields: [
                {
                    name: 'name', convert: me.convertText.bind(me)
                },
                {
                    name: 'color'
                }
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: this.method || 'getIcons'}, ModuleMgr.get(this.module || 'Nomencladores')),
                extraParams: {
                    file: 'ini'
                },
                reader: {
                    idProperty: 'name',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });
    },
    createButton: function () {
        var pagintoolbar = this.getPicker().pagingToolbar;
        pagintoolbar.removeAll();

        this.btnSearch = Ext.create('Ext.Button', {
            iconCls: 'buscar',
            tooltip: 'Buscar',
            action:'searchicon'
        });
        this.btnUpdate = Ext.create('Ext.Button', {
            iconCls: 'actualizar',
            tooltip: 'Actualizar',
            action:'update'
        });
        pagintoolbar.add(this.btnUpdate, this.btnSearch);
    },
    convertText: function (value, record) {
        return value + ' ' + record.data.color || '';
    }
});
