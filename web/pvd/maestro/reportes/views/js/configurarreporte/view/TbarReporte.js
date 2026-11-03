Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.TbarReporte = Ext.extend(Ext.Toolbar, {
    initComponent: function () {
        var me = this,
                idiom = Maestro.ConfigurarReporte.idiom;

        me.btnInsert = new Ext.Button({
            text: idiom.lbBtnInsert,
            tooltip: idiom.lbBtnTtpInsertReporte,
            iconCls: 'adicionar',
        });

        me.btnUpdate = new Ext.Button({
            text: idiom.lbBtnUpdate,
            tooltip: idiom.lbBtnTtpUpdatetReporte,
            iconCls: 'modificar',
        });

        me.btnDelete = new Ext.Button({
            text: idiom.lbBtnDelete,
            tooltip: idiom.lbBtnTtpDeletetReporte,
            iconCls: 'eliminar',
        });

        me.btnActivar = new Ext.Button({
            text: idiom.lbBtnActivar,
            tooltip: idiom.lbBtnTtpActivarReporte,
            iconCls: 'habilitar',
        });
        me.btnDesActivar = new Ext.Button({
            text: idiom.lbBtnDesactivar,
            tooltip: idiom.lbBtnTtpDesactivarReporte,
            iconCls: 'deshabilitar',
        });

        me.btnCrudFilter = new Ext.Button({
            text: idiom.lbBtnCrudFilter,
            tooltip: idiom.lbBtnTtpDCrudFilter,
            iconCls: 'editar',
        });

        me.items = [me.btnInsert, me.btnUpdate, me.btnDelete, '-', me.btnActivar, me.btnDesActivar, '-', me.btnCrudFilter];

        Maestro.ConfigurarReporte.view.TbarReporte.superclass.initComponent.call(this);
    },
    setEnableBtn: function (enableInsert, enableUpdate, enableDelete, enableCrudFilter, enableActivar, enableDesActivar) {
        this.btnInsert[(enableInsert) ? 'enable' : 'disable']();
        this.btnUpdate[(enableUpdate) ? 'enable' : 'disable']();
        this.btnDelete[(enableDelete) ? 'enable' : 'disable']();
        this.btnCrudFilter[(enableCrudFilter) ? 'enable' : 'disable']();
        this.btnActivar[(enableActivar) ? 'enable' : 'disable']();
        this.btnDesActivar[(enableDesActivar) ? 'enable' : 'disable']();
    }
});