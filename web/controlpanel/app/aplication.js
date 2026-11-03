Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Packed: "app"
    }
});
/*Ext.application({
    name: 'Controlpanel',
    appFolder: 'app',
    controllers : [
        'Control'
    ],*/

    Zeolides.App({
        modulo: "controlpanel",
        name: "Controlpanel",
        controllers : [
            'Control'
        ],

        launch: function () {
            /*console.log('perfil', perfil);
            Packed.idioma = Ext.widget('idiomaES').idioma;*/
            Ext.widget ( 'principal' );

        }
    });
/*

    launch: function() {
        Controlpanel.idioma = Ext.widget('idiomaES').idioma;
        Ext.widget ( 'principal' );
    }
});*/
