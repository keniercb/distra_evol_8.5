/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.PanelEast", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelEast",


    initComponent:function(){
        this.title =  Zeolides.etiquetas.titlePanelEast,
        this.width = 300,
        this.region = 'east',
        this.id = 'panelDetalles',
        this.name = 'panelDetalles',
        this.html = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>",
        this.collapsible = true,
        this.collapseMode = 'mini',
        this.collapsed = true,
        this.split = true,

        this.callParent(arguments);
    }
});
