Ext.define('Facturacion.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fac_main',
    frame: false,
    margin: false,
    border: false,

    initComponent: function () {

        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout = 'border';
        this.closable = true;

        this.contratogrid = Ext.create('Facturacion.view.ContratoGrid', {
            region: 'west',
            flex:1
            // width: 300
        });

        this.hitogrid = Ext.create('Facturacion.view.HitoGrid',{
            region:'center',
            flex:1
        });

        this.btnCheckIn = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'checkin',
            selector: 'btnCheckIn',
            hidden: false,
            disabled: true,
            text: this.etiquetas.lbBtnCheckIn,
            tooltip: this.etiquetas.qtipCheckIn
        });

        this.items = [this.contratogrid, this.hitogrid];

        this.callParent();
    }
});
