/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Controlpanel.views.PanelWest", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelWest",


    initComponent:function(){

        this.treeRepo = Ext.widget('treeRepo');
        this.layout = 'fit',
        this.title =  Zeolides.etiquetas.titlePanelWeast,
        this.width = 300,
        this.region = 'west',
        this.id = 'panelWest',
        this.name = 'panelWest',
        this.collapsible = true,
        this.collapseMode = 'mini',
        //this.collapsed = true,
        this.split = true,
        this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                text: Zeolides.etiquetas.textAddRepo,
                iconCls: 'adicionar',
                tooltip : Zeolides.etiquetas.tooltipAddRepo,
                name: 'addrepo',
                id: 'addrepo',
                action: 'addrepo'

            },{
                text: Zeolides.etiquetas.textModRepo,
                iconCls: 'modificar',
                tooltip : Zeolides.etiquetas.tooltipModRepo,
                name: 'modrepo',
                id: 'modrepo',
                disabled:true,
                action: 'modrepo'

            },{
                text: Zeolides.etiquetas.textElimRepo,
                iconCls: 'eliminar',
                tooltip : Zeolides.etiquetas.tooltipElimRepo,
                name: 'elimrepo',
                id: 'elimrepo',
                disabled:true,
                action: 'elimrepo'

            }]
        }],
        this.items = [this.treeRepo]

        this.callParent(arguments);
    }
});
