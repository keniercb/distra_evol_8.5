/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.PanelCenter", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelCenter",
    //title: 'Navigation',
    region: 'center',
    layout: 'fit',
    width: 880,
    margins: '5 0 0 0',
    //collapsible: true,
    //collapseMode: 'mini',
    split: true,

    initComponent: function () {
        this.storeGridPacked = Ext.create('Packed.store.pack');

        this.items = [
            Ext.create('Ext.grid.Panel', {
                anchor: '100%',
                //height: 430,
                name: 'gridPacked',
                id: 'gridPacked',
                frame: true,
                multiSelect : true,
                store: this.storeGridPacked,
                //iconCls: 'icon-user',
                viewConfig: {
                    loadingText: Zeolides.etiquetas.textCargando
                },
                columns: [{
                    header: Zeolides.etiquetas.headerNamePack,
                    width: 200,
                    sortable: true,
                    dataIndex: 'name'
                }, {
                    text: Zeolides.etiquetas.headerVersionPack,
                    width: 200,
                    sortable: true,
                    dataIndex: 'version',
                    renderer: function(value, metaData, record){
                        var type = record.raw.typeVersion;
                        return value.substring(1) + '-' + type;
                    }

                }, {
                    text: Zeolides.etiquetas.headerDescripPack,
                    //width: 450,
                    sortable: true,
                    dataIndex: 'description',
                    flex: 1

                }], dockedItems: [{
                    xtype: 'toolbar',
                    items: [Zeolides.etiquetas.namePack, {
                        xtype: 'textfield',
                        name: 'searchFieldPack',
                        id: 'searchFieldPack',
                        emptyText : Zeolides.etiquetas.emptyTextSearch,
                        hideLabel: true,
                        width: 200

                    }, {
                        text: Zeolides.etiquetas.btnBuscar,
                        iconCls: 'buscar',
                        disabled:true,
                        tooltip : Zeolides.etiquetas.tooltipBtnBuscar,
                        name: 'textfieldBuscarTree',
                        id: 'textfieldBuscarTree',
                        action: 'filtrarGridPack'

                    }, {

                        text: Zeolides.etiquetas.btnLimpiar,
                        id: 'clearFiltroGridPack',
                        disabled:true,
                        iconCls: "limpiar",
                        scope: this,
                        tooltip : Zeolides.etiquetas.tooltipBtnLimpiar,
                        action: 'limpiarFiltroGridPack'

                    }]
                }],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.storeGridPacked,
                    displayInfo: true,
                    emptyMsg: Zeolides.etiquetas.emptyMsgToolbar,
                    displayMsg: Zeolides.etiquetas.displayMsgToolbar,
                    beforePageText: Zeolides.etiquetas.beforePageTextToolbar,
                    afterPageText: Zeolides.etiquetas.afterPageTextToolbar,
                    firstText: Zeolides.etiquetas.firstTextToolbar,
                    prevText:  Zeolides.etiquetas.prevTextToolbar,
                    nextText: Zeolides.etiquetas.nextTextToolbar,
                    lastText: Zeolides.etiquetas.lastTextToolbar,
                    refreshText: Zeolides.etiquetas.refreshTextToolbar

                })
            })
        ];
        // this.storeGrid = Ext.create('Packed.store.packs');
        this.callParent(arguments);
    }
});
