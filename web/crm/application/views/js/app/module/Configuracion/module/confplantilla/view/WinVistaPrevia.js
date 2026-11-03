Ext.define('ConfPlantilla.view.WinVistaPrevia', {
    extend: 'Ext.window.Window',
    alias: 'widget.winvistaprevia',
    frame: false,
    margin: false,
    width: 1000,
    height: 430,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable: false,
    bodyStyle: {
        background: 'white',
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.lbTitleVistaPrevia;

        me.items = {
            xtype: 'dataview',
            autoScroll: true,
            store: Ext.create('ConfPlantilla.store.Estructura'),
            tpl: me.getTplInfo()
        };

        me.initButtons();

        me.callParent();
    },
    getTplInfo: function(){
        var me = this;
        return new Ext.XTemplate(
            '<div class="pr-documentbody"><div>'+me.etiquetas.lbCuerpoReporte+'</div></div>',
            '<tpl for=".">',
                '<div class="pr-item pr-item-posicion-{posicion} pr-item-region-{region}">',
                    '<tpl if="tipo == 1">',
                        '<div class="pr-text">{texto}</div>',
                    '<tpl else>',
                        '<img class="pr-img-{posicion}" src="data:image/jpg;base64,{img}"/>',
                    '</tpl>',
                '</div>',
            '</tpl>'
        );
    },
    initButtons: function(){
        var me = this;

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            action: 'cerrar'
        }];
    },
    loadValues: function(val){
        var me = this,
            estrucStore = me.down('dataview').getStore();

        estrucStore.removeAll();
        estrucStore.loadData(val.get('estructura'));
    }
});
