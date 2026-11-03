Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Packed: "app"
    }
});

Zeolides.App({
    modulo: "package",
    name: "Packed",
    controllers : [
        'Packs'
    ],

    launch: function () {
        /*console.log('perfi', perfil);
        Packed.idioma = Ext.widget('idiomaES').idioma;*/
        Ext.widget ( 'principal' );

    }
});


