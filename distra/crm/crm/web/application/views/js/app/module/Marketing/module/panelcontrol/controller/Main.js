Ext.define('PanelControlMarketing.controller.Main', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {

            }
        });
    }
});
