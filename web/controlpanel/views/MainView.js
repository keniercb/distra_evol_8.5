Ext.ns("package.views");
package.views.MainView = Ext.extend(Ext.Panel,{
    constructor: function(config) {
        config = config || {};
        this.panelLateralIzquierdo =  new Ext.Panel({
            title       : 'Repositorios svn',
            region      : 'west',
            split       : true,
            width       : 400,
            collapsible : true,
            margins     : '3 0 3 3',
            cmargins    : '3 3 3 3'
        });
        this.panelPresentacion = new Ext.Panel({
            xtype    : "panel",
            region   : "center",
            id       : "idpanelPresentacion",
            width    : "100%",
            layout   : "absolute",
            html     : 'No hay ningún elemento seleccionado',
            height   : 600
        });
       /* this.panelDatos = new Ext.Panel({
            xtype    : "panel",
            region   : "center",
            id       : "idpanelDatos",
            width    : "100%",
            html     : "Primero",
            height   : 600
        });
        this.panelConfig = new Ext.Panel({
            xtype    : "panel",
            region   : "center",
            id       : "idpanelConfig",
            width    : "100%",
            html     : "Segundo",
            height   : 600
        });*/

        this.bootonNext =new Ext.Button({
            text: 'Siguiente',
            id: 'ayuda',
            iconCls: 'eliminar',
            listeners: {
                click: this.onclickNext,
                scope: this
            }
        });
        this.panelCentral = new Ext.Panel({
            xtype    : "panel",
            title    : "Panel Central",
            region   : "center",
            id       : "idpanelCentral",
            layout   : 'card',
            width    : "100%",
            height   : "auto",
            items    : [
                this.panelPresentacion,
               /* this.panelDatos,
                this.panelConfig*/
            ],
            bbar     : ['->',this.bootonNext]
        });




        Ext.apply(config, {
            id: 'id-controlpanel',
            layout: 'border',
            autoScroll: true,
            autowidth: true,
            items:[this.panelCentral,this.panelLateralIzquierdo]
        });

        package.views.MainView.superclass.constructor.call(this, config);
    }
});