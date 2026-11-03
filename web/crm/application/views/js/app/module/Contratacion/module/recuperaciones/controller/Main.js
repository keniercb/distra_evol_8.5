Ext.define('Recuperaciones.controller.Main', {
    extend: 'Ext.app.Controller',
    views: ['Main'],

    refs: [
        {ref: 'Main', selector: 'pro_main'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {

            }
        });
    }
});