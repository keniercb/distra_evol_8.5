Ext.define('SolicitudPago.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sp_main',
    frame: false,
    margin: false,
    border: false,

    initComponent: function () {
        var me=this;
        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout = 'border';
        // this.layout = 'hbox';
        this.closable = true;

        this.hitogrid = Ext.create('SolicitudPago.view.GridSolicitudPago',{
            region:'center',
            // region: 'east',
            split:true,
            flex:1
        });

        this.contratogrid = Ext.create('SolicitudPago.view.ContratoGrid', {
            title:me.etiquetas.lbTitleContrato,
            region: 'west',
            // region:'center',
            split:true,
            flex:1,
            // width: 300
        });

        // this.btnCheckIn = Ext.create('Ext.Button', {
        //     iconCls: 'detalles',
        //     action: 'checkin',
        //     selector: 'btnCheckIn',
        //     hidden: false,
        //     disabled: true,
        //     text: this.etiquetas.lbBtnCheckIn,
        //     tooltip: this.etiquetas.qtipCheckIn
        // });

        this.items = [
            this.contratogrid,
            this.hitogrid
        ];

        this.callParent();
    }
});
