//Esto es para porner un panel con una página inicia

Ext.define('ConfigFormatoNumContrato.view.Main', {
    extend: 'Ext.window.Window',
    alias: 'widget.configformatonumcontrato_view',
    frame: false,
    margin: false,
    border: false,
    width: 350,
    closable: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.titleWinConfigFormatoNumContrato;

        me.items = [
            Ext.create('ConfigFormatoNumContrato.view.FpFormatoNumContrato'),
            Ext.create('ConfigFormatoNumContrato.view.GpElementosIncrementales')
        ];

        this.btnAceptar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
            action: 'acept',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.btnAplicar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnApply) ? this.etiquetas.lbBtnApply : 'Aplicar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipApply) ? this.etiquetas.qtipApply : 'Aplicar ',
            action: 'apply',
            //disabled: true,
            iconCls: 'aplicar'
        });

        this.btnCancelar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
            action: 'cancel',
            iconCls: 'cancelar',
            handler: function () {
                me.close();
            }
        });

        me.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
        me.callParent();
    }
});
