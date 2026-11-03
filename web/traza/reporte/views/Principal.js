Ext.define('Traces.view.Principal', {

    extend: 'Ext.container.Viewport',
    alias: 'widget.principal',
    initComponent: function(){

        this.panelGrafica = Ext.widget('panelGrafica');
        this.panelDetalles = Ext.widget('panelDetalles');
        this.panelCronologia = Ext.widget('panelCronologia');

        this.layout  = 'fit';
        this.items = [
                {
                    xtype: 'tabpanel',
                    id: 'tabPanel',
                    items: [this.panelGrafica,this.panelDetalles,this.panelCronologia],

                    listeners:{
                        tabchange: function(tabPanel,compNew,compOld){
                            if(compNew.id == 'panelGrafica'){
                                Ext.getCmp('fecha_desde').focus(true,200);
                            }
                        }
                    }
                }
            ];

        this.callParent(arguments);
    }


});