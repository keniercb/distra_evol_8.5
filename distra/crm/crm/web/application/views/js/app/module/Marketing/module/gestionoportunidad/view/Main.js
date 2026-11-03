Ext.define('GestionOportunidad.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gco_main',
    frame: false,
    margin: false,
    border :false,

    initComponent: function() {

        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout= 'border';
        this.closable = true;

        this.grid = Ext.create('GestionOportunidad.view.MainGrid');
        this.items = [this.grid];

        //this.html= '<div >   HOLALALA    </div>';

        this.callParent();
    }
});
