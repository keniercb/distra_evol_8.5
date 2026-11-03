Ext.define('ConfigurarTrazas.controller.Configurar', {
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