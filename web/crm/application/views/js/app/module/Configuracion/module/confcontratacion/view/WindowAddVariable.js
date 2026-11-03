Ext.define('ConfContratacion.view.WindowAddVariable', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowaddvariable',
    layout: 'fit',
    width: 500,
    minWidth: 500,
    minHeight: null,
    initComponent: function () {
        var me  = this;
        this.getLang();

        // this.form = Ext.create('Ext.form.Panel', {
        this.form = Ext.create('Ext.ux.CustomForm', {
            layout: 'anchor',
            border: false,
            trackResetOnLoad: true,
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'idvariable'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Nombre',
                    name: 'nombre',
                    allowBlank: false
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Descripcion',
                    name: 'descripcion',
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'SQL',
                    name: 'sql',
                    height: 300,
                    allowBlank: false
                }
            ]
        });
        this.items = [this.form];
        this.callParent();
    }
});
