//Esto es para porner un panel con una página inicia

Ext.define('Segmentacion.view.MainSegmentacion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainsegmentacion',
    frame: false,
    margin: false,
    border: false,

    initComponent: function() {

        var etiquetas = LangMgr.getLang(this);
        this.closable = true;

        this.title = etiquetas.moduleName;
        this.layout= 'border';

        this.items = [
            Ext.create('Segmentacion.view.GridSegmentacion')
        ];

        this.callParent();
    }
});
