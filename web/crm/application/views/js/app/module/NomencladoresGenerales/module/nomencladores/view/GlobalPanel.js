Ext.define('Nomencladores.view.GlobalPanel', {
    extend: 'BaseModule.view.GlobalPanel',
    module: 'Nomencladores',
    requires:[
        'Nomencladores.view.GridNotificacion',
        'Nomencladores.view.GridToGrid',
        'Nomencladores.view.CmbIcons',
        'Nomencladores.view.CmbActions',
        'Nomencladores.view.CmbLineas',
        'Nomencladores.view.ElementosFormatoNumCont',
        'Nomencladores.view.PanelAreas',
        'Nomencladores.view.CmbPaises',
        'Nomencladores.view.PanelPersonas',
    ],
    border: false,
    initComponent:function(){
        this.etiquetas = LangMgr.getLang(this);
        this.callParent();
    }
});