Ext.define('CRM.view.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.maintoolbar',

    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.items = [
            {
                //xtype: 'button',
                text: this.etiquetas.lbProyecto,
                arrowAlign: 'right',
                showSeparator: true,
                iconCls: 'icondistra-archivo',
                action: 'proyectmanage',
                menu: [
                    {text: this.etiquetas.lbOpen, iconCls: 'icondistra-abrir', action: 'open'},
                    {text: this.etiquetas.lbSave, iconCls: 'icondistra-guardar', disabled: true, action: 'save'},
                    {text: this.etiquetas.lbSaveAs, iconCls: 'icondistra-guardar', disabled: true, action: 'saveas'},
                    '-',
                    {text: this.etiquetas.lbClose, iconCls: 'icondistra-cerrar', action: 'close'}
                ]
            }
        ]

        this.callParent();
    }

});
