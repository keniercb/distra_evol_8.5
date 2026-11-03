Ext.define('GestionCampanna.view.ChartWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.chartwindow',

    autoScroll: false,
    maximizable: true,
    width: 650,
    height: 490,
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.title = "An&aacute;lisis";
        this.buttons = [];
    }
});