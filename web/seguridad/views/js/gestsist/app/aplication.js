/**
 * Created by lilianne on 23/01/15.
 */
/**
 * Override para resolver los bugs con los scroll en los grids. *
 */
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

Zeolides.App({
    modulo: 'gestsist',

    name: 'Conf',

    appFolder: 'app',

    controllers: [
        'Gestsist'
    ],


    launch: function() {

        //Conf.idioma = Ext.widget('idioma_es').idioma;

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'principal'
                }
            ]
        });
    }
});
