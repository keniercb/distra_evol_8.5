Ext.define('PanelControlMarketing.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pcm_main',
    frame: false,
    margin: false,
    border: false,
    layout: 'column',
    autoScroll: true,

    initComponent: function () {

        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.closable = true;

        var p1 = Ext.create('PanelControlMarketing.view.OportunidadesMesChart'),
            p2 = Ext.create('PanelControlMarketing.view.ClientesPotencialesChart'),
            p3 = Ext.create('PanelControlMarketing.view.OportunidadDesacuerdoChart'),
            p4 = Ext.create('PanelControlMarketing.view.CampannasPotencialesChart');
        this.items = [p1, p3, p2 ,p4];
        this.callParent();
    }
});
