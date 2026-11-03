Ext.grid.Panel.override({
    initComponent: function () {
        var me = this;

        me.callParent();

        me.on('scrollershow', function (scroller) {
            if (scroller && scroller.scrollEl) {
                scroller.clearManagedListeners();
                scroller.mon(scroller.scrollEl, 'scroll', scroller.onElScroll, scroller);
            }
        });
    }
});

/*Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Traces: "app"
    }
});*/

Zeolides.App({
    modulo: "reporte",
    name: "Traces",
    paths: {
        Traces: "app"
    },
    controllers : [
        'Cronologia',
        'Detalles',
        'Grafica'
    ],

     launch: function () {
        //Traces.idioma = Ext.widget('idioma_es');
        Ext.widget ( 'principal' );
    }
});

