Ext.define('Ext.ux.WindowTasaCambio', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowtasacambio',
    width: 400,
    minWidth: null,
    minHeight: null,
    layout: 'hbox',
    constrain: true,
    modal: true,
    etiquetas: '',
    concept: '',
    initComponent: function () {
        var me=this;

        me.items=[
            {
                xtype: 'combo',
                fieldLabel: 'Convertir a',
                labelAlign: 'top',
                valueField: 'id',
                displayField: 'nombre',
                name: 'moneda'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Factor de conversión',
                labelAlign: 'top',
                name: 'factorconversion',
                readOnly:true
            }
        ];



        me.callParent();
    }
});