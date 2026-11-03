Ext.define('Packed.view.Principal', {
    /*require: [
        'Replica.view.ArbolAmbientes',
        'Replica.view.PanelNodos',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],*/
    extend: 'Ext.container.Viewport',
    alias: 'widget.principal',
    //border: 0,
    initComponent: function(){

        this.PanelCenter = Ext.widget('panelCenter');
        this.PanelEast = Ext.widget('panelEast');
        var _this = this;
        this.layout  = 'fit';
        this.items = [
            {
                xtype: 'panel',
                layout: 'border',
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        text: perfil.etiquetas.textNuevoPack,
                        tooltip : perfil.etiquetas.tooltipNuevoPack,
                        //scope: this,
                        iconCls: 'nuevo',
                        action: 'createPack'

                    },{
                        text: perfil.etiquetas.textElimPack,
                        iconCls: "eliminar",
                        tooltip : perfil.etiquetas.tooltipElimPack,
                        disabled : true,
                        name: 'btnElimPack',
                        id: 'btnElimPack',
                        action: 'deletePack'
                    },{
                        text: perfil.etiquetas.textPublicar,
                        name: 'btnPublicar',
                        id: 'btnPublicar',
                        disabled : true,
                        action: 'publicarPack',
                        iconCls: "publicar",
                        tooltip: perfil.etiquetas.tooltiPublicar
                    },{
                        text:  perfil.etiquetas.textConfigurar,
                        name: 'btnConfigurar',
                        id: 'btnConfigurar',
                        action: 'configurarGestor',
                        iconCls: "config",
                        tooltip: perfil.etiquetas.tooltiConfigurar
                    },'->',{
                        text: perfil.etiquetas.textAyuda,
                        iconCls: "ayuda",
                        tooltip : perfil.etiquetas.tooltipAyuda,
                        name: 'btnAyuda',
                        id: 'btnAyuda'
                    }]
                }],
                items: [
                    this.PanelCenter,
                    this.PanelEast
                ]
            }
        ],
        this.callParent(arguments);
    }


});