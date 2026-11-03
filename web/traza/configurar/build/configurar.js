Ext.define('ConfigurarTrazas.model.TrazasModel', {
    extend: 'Ext.data.Model',
    fields: ['traza', 'activado']
});Ext.define('ConfigurarTrazas.store.TrazasStore', {
    extend: 'Ext.data.Store',
    model: 'ConfigurarTrazas.model.TrazasModel',
    proxy:{
        type: 'ajax',
        url: 'cargar',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
});Ext.define('ConfigurarTrazas.view.gridTrazas' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.gridTrazas',
    id: "gridTrazas",
    store: 'TrazasStore',

    initComponent: function() {
        this.columns = [
            {header: perfil.etiquetas.labelColumnActivado,  dataIndex: 'traza',  flex: 1},
            {header: perfil.etiquetas.labelColumnTraza, dataIndex: 'activado', flex: 1}
        ];

        this.tbar = [
            {
                xtype: 'button',
                id: "buttonActivar",
                text: perfil.etiquetas.labelBtnActivar,
                iconCls: "icondistra-activar",
                disabled: true
            },'->',
            Ext.create("Ext.button.Button",{
                id: 'btnAyuda',
                //xtype: 'button',
                iconCls: 'ayuda',
                text: perfil.etiquetas.labelBtnAyuda
            })
        ];

        this.callParent(arguments);
    }
});Ext.define('ConfigurarTrazas.controller.Configurar', {
    extend: 'Ext.app.Controller',
    views: [
        'gridTrazas'
    ],
    stores: [
        'TrazasStore'
    ],
    models: [
        'TrazasModel'
    ],

    init: function() {
        this.control({
            'viewport > panel': {
                render: this.onPanelRendered
            },
            '#buttonActivar': {
                click: function(button){
                    var grid = button.up("grid");
                    var select = grid.getSelectionModel().getSelection()[0].data;
                    Ext.Ajax.request({
                        url: 'cambiar',
                        params: {
                            traza: select.traza,
                            activado: select.activado,
                        },
                        callback: function(params,opt,response){
                            var obj = Ext.decode(response.responseText);
                            if(obj.cod == 1){
                                mostrarMensaje(obj.cod,obj.mensaje);
                                grid.getStore().load();
                                Ext.getCmp("buttonActivar").disable()
                            }
                        }
                    });
                }
            },
            '#gridTrazas': {
                beforedeselect: function(selectionModel,record,index,opt){
                    var button = Ext.getCmp("buttonActivar");
                    var grid = button.up("grid");
                    if(!grid.getSelectionModel().hasSelection()){
                        Ext.getCmp("buttonActivar").disable();
                    }
                },
                beforeselect: function(selectionModel,record,index,opt){
                    Ext.getCmp("buttonActivar").enable();
                }
            }
        });
    },

    onPanelRendered: function() {
        console.log('The panel was rendered');
    }
});

Zeolides.App({
    modulo: "configurar",
    name: "ConfigurarTrazas",
    appFolder:"../../configurar",
    controllers : [
        'Configurar'
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'gridTrazas'
                }
            ]
        });
    }
});



