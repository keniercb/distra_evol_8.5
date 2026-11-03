Ext.define('Nomencladores.view.IconWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.iconwindow',
    width: 810,
    height: 516,
    layout: 'fit',
    frame: false,
    autoCreateForm: true,
    tipocontrato: false,
    bodyStyle: 'background:white;',
    maximizable: true,
    action: 'select',
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.title = 'Seleccionar icono';

        this.createStore();
        this.addStyle();
        this.addToBody();
        this.callParent();
        this.tools[0].refhelp = 'select_icon';
        this.store.load();
    },
    addToBody: function () {
        var me = this,
            emptyText = '<div class="x-grid-empty" align="center" style="margin-top: 23%">' +
                '<div class="icondistra-conflicto gris" style="font-size: 20px;" align="center">' +
                '</div>' + 'No existen datos que mostrar' + '</div>',
            tpl = [
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name:stripTags}">',
                '<div class="thumb"><span class="icondistra-{name} {color}" title="{name:htmlEncode}"></span>',
                '<span class="title">{name:htmlEncode}</span>',
                '</div>',
                '</div>',
                '</tpl>'
            ];
        this.searchfield = Ext.create('Ext.ux.SearchField', {
            width: 250,
            searchTooltip: 'Buscar icono',
            clearTooltip: 'Limpiar filtro'
        });

        this.cmbcolor = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Color',
            labelWidth: 30,
            first:true,
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'clase'],
                data: [
                    {id: 0, clase: "Por defecto"},
                    {id: 1, clase: "verde"},
                    {id: 2, clase: "rojo"},
                    {id: 3, clase: "amarillo"},
                    {id: 4, clase: "gris"}
                ]
            }),
            value: 0,
            queryMode: 'local',
            displayField: 'clase',
            valueField: 'id'
        });

        this.dataview = Ext.create('Ext.view.View', {
            id: 'icon-view',
            store: me.store,
            autoScroll: true,
            tpl: tpl,
            multiSelect: true,
            trackOver: true,
            overItemCls: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: emptyText
        });

        this.tbar = [this.cmbcolor, '->', this.searchfield];
        this.items = this.dataview;
    },
    createStore: function () {
        var me = this;
        this.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'color'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: this.method || 'getIcons'}, ModuleMgr.get(this.module || 'Nomencladores')),
                extraParams: {
                    file: 'css'
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
    addStyle: function () {
        if (!document.getElementById('style-dataview-icon')) {
            var style = document.createElement("link");
            //adicionando hoja de estilo
            style.type = "text/css";
            style.id = 'style-dataview-icon';
            style.rel = "stylesheet";
            style.href = "/crm/application/views/css/icon-dataview.css";
            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }
});
