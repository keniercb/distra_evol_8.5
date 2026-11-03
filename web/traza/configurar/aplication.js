

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



