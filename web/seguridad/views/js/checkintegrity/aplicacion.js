Zeolides.App({
    name: 'CheckIntegrity',
    modulo: "checkintegrity",
    appFolder: '../../views/js/checkintegrity',
    controllers: [
        'CheckIntegrity'
    ],
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    items: [
                        { xtype: 'resultadosChequeo' },
                        { xtype: 'tabHistorial' }


                    ]

                }
            ]
        });
    }
});

