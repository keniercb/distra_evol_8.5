Ext.define('ConfigurarTrazas.view.gridTrazas' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.gridTrazas',
    id: "gridTrazas",
    store: 'TrazasStore',

    initComponent: function() {
        this.columns = [
            {header: perfil.etiquetas.labelColumnActivado,  dataIndex: 'traza',  flex: 1},
            {header: perfil.etiquetas.labelColumnTraza, dataIndex: 'activado', flex: 1}
        ];

        this.tbar = [
            {
                xtype: 'button',
                id: "buttonActivar",
                text: perfil.etiquetas.labelBtnActivar,
                iconCls: "icondistra-activar",
                disabled: true
            },'->',
            Ext.create("Ext.button.Button",{
                id: 'btnAyuda',
                //xtype: 'button',
                iconCls: 'ayuda',
                text: perfil.etiquetas.labelBtnAyuda
            })
        ];

        this.callParent(arguments);
    }
});