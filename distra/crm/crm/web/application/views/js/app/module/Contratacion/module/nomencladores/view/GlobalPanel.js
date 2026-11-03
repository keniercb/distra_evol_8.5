Ext.define('Nomencladores.view.GlobalPanel', {
    extend: 'BaseModule.view.GlobalPanel',
    module: 'Nomencladores',
    requires:[
        'Nomencladores.view.GridToGrid',
        'Nomencladores.view.CmbIcons',
        'Nomencladores.view.CmbActions',
        'Nomencladores.view.ElementosFormatoNumCont',
        'Nomencladores.view.PanelAreas'
    ],
    border: false,
    initComponent:function(){
        this.etiquetas = LangMgr.getLang(this);
        this.callParent();
    }
});